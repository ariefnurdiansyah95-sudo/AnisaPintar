'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pencil, Play, X } from 'lucide-react'
import type { Lesson, Question, Slide } from '@/lib/types'
import { filterQuestions } from '@/lib/bank'
import { makeRng } from '@/lib/rng'
import { useProgress } from '@/context/ProgressContext'
import { eja, kePengucapan, sfx, speak, speakSeq, stop } from '@/lib/speech'
import { SUBJECT_MAP } from '@/lib/subjects'
import Visual from './Visual'
import { Jawaban, tampilJawaban, tampilQ } from './QuizRunner'
import { Guru, ProgressBar, SpeakButton } from './ui'
import Emo from './Emo'

const EMO = /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu

type Step = { t: 'slide'; s: Slide } | { t: 'coba'; q: Question }

/** Pilih soal "Coba sendiri" yang praktis: utamakan susun/ketik/cocok, variasikan tipe. */
function pilihCoba(lesson: Lesson): Question[] {
  const pool = filterQuestions({ mapel: lesson.mapel, topik: lesson.topik, grup: lesson.grup })
  if (!pool.length) return []
  const n = Math.min(4, Math.max(2, Math.ceil(lesson.slides.length / 2)))
  const r = makeRng('coba:' + lesson.id)
  const urut = (q: Question) => {
    const t = tampilQ(q).tipe
    return t === 'susun' ? 0 : t === 'isian' ? 1 : t === 'cocok' ? 2 : t === 'gambar' ? 3 : t === 'pilihan' ? 4 : 5
  }
  const out: Question[] = []
  const tipeDipakai = new Set<string>()
  const mudah = pool.filter((q) => q.level <= 2)
  const sumber = r.shuffle(mudah.length >= n ? mudah : pool).sort((a, b) => urut(a) - urut(b))
  // satu per tipe dulu
  for (const q of sumber) {
    const t = tampilQ(q).tipe
    if (!tipeDipakai.has(t)) { tipeDipakai.add(t); out.push(q) }
    if (out.length >= n) break
  }
  for (const q of sumber) { if (out.length >= n) break; if (!out.includes(q)) out.push(q) }
  return out.slice(0, n).sort((a, b) => a.level - b.level)
}

export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { update } = useProgress()
  const [i, setI] = useState(0)
  const [lolos, setLolos] = useState<Record<number, boolean>>({})
  const sub = SUBJECT_MAP[lesson.mapel]

  const steps = useMemo<Step[]>(() => {
    const coba = pilihCoba(lesson).slice()
    const out: Step[] = []
    lesson.slides.forEach((sl, k) => {
      out.push({ t: 'slide', s: sl })
      if (k % 2 === 1 && coba.length > 0 && k < lesson.slides.length - 1) out.push({ t: 'coba', q: coba.shift()! })
    })
    coba.forEach((q) => out.push({ t: 'coba', q }))
    return out
  }, [lesson])

  const step = steps[i]
  const akhir = i === steps.length - 1
  const terkunciCoba = step.t === 'coba' && !lolos[i]
  const lang = step.t === 'slide' ? step.s.lang ?? 'id-ID' : 'id-ID'

  useEffect(() => {
    const parts = step.t === 'slide'
      ? [{ t: step.s.judul ? `${step.s.judul}.` : '' }, { t: step.s.teks }].filter((x) => x.t)
      : [{ t: 'Sekarang giliranmu! Coba sendiri ya.' }, ...(step.q.suara ? [{ t: step.q.suara.teks, lang: step.q.suara.lang }] : []), { t: step.q.teks }]
    const t = setTimeout(() => speakSeq(parts), 300)
    return () => { clearTimeout(t); stop() }
  }, [i, step])

  useEffect(() => {
    if (akhir) update((st) => (st.lessons[`${lesson.mapel}/${lesson.id}`] ? st : { ...st, lessons: { ...st.lessons, [`${lesson.mapel}/${lesson.id}`]: Date.now() } }))
  }, [akhir, lesson, update])

  const href = `/kuis?mode=latihan&mapel=${lesson.mapel}&materi=${lesson.id}`
  return (
    <div className="mx-auto max-w-2xl pb-32">
      <div className="mb-3 flex items-center gap-3">
        <Link href={`/mapel/${lesson.mapel}`} onClick={() => stop()} aria-label="Keluar" className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-chunky active:translate-y-1"><X /></Link>
        <div className="flex-1">
          <ProgressBar pct={((i + 1) / steps.length) * 100} warna="bg-accent" tinggi="h-5" />
          <div className="mt-1 flex justify-between text-sm font-bold text-ink/70"><span><Emo>{sub.emoji}</Emo> {lesson.judul}</span><span>{i + 1}/{steps.length}</span></div>
        </div>
      </div>

      {step.t === 'slide' ? (
        <div key={i} className="animate-pop space-y-4">
          <div className="card">
            {step.s.judul && <h2 className="mb-2 text-center text-3xl font-extrabold text-accent-dark">{step.s.judul}</h2>}
            {step.s.gambar && <div className="my-3"><Visual v={step.s.gambar} /></div>}
            {step.s.suku && <SukuRow suku={step.s.suku} />}
            {step.s.kata && <KataGrid kata={step.s.kata} />}
            {step.s.baca && <BacaSorot teks={step.s.baca} />}
            {step.s.poin && <Poin poin={step.s.poin} lang={lang} />}
            {step.s.contoh && <Contoh c={step.s.contoh} />}
          </div>
          <Guru mood="senang" size={90}>
            <div className="flex items-start gap-2">
              <p className="flex-1 text-xl leading-snug">{step.s.teks}</p>
              <SpeakButton text={step.s.teks} size="sm" />
            </div>
          </Guru>
        </div>
      ) : (
        <Coba key={i} q={step.q} onSelesai={() => setLolos((l) => ({ ...l, [i]: true }))} />
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-4 border-ink/10 bg-cream/95 px-4 pb-5 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-3">
          <button disabled={i === 0} onClick={() => { sfx('klik'); setI(i - 1) }} className="btn btn-ghost px-5 disabled:opacity-30" aria-label="Sebelumnya"><ChevronLeft size={30} /></button>
          {!akhir ? (
            <button disabled={terkunciCoba} onClick={() => { sfx('klik'); setI(i + 1) }} className="btn btn-accent flex-1 disabled:opacity-40">{terkunciCoba ? 'Jawab dulu ya…' : 'Lanjut'} {!terkunciCoba && <ChevronRight size={28} />}</button>
          ) : (
            <Link href={href} onClick={() => stop()} className={`btn btn-sun flex-1 ${terkunciCoba ? 'pointer-events-none opacity-40' : ''}`}><Pencil size={24} /> Ayo latihan!</Link>
          )}
        </div>
      </div>
    </div>
  )
}

/** Latihan terbimbing di dalam materi: salah boleh mencoba lagi; setelah 2x salah, jawaban ditunjukkan. */
function Coba({ q: qAsli, onSelesai }: { q: Question; onSelesai: () => void }) {
  const q = useMemo(() => tampilQ(qAsli), [qAsli])
  const [coba, setCoba] = useState(0)
  const [salah, setSalah] = useState(0)
  const [status, setStatus] = useState<'tanya' | 'benar' | 'tunjuk'>('tanya')

  function jawab(benar: boolean) {
    if (benar) {
      sfx('benar'); setStatus('benar'); onSelesai()
      speakSeq([{ t: 'Benar! Hebat!' }, { t: q.pembahasan }])
      return
    }
    sfx('salah')
    const n = salah + 1
    setSalah(n)
    if (n >= 2) {
      setStatus('tunjuk'); onSelesai()
      speakSeq([{ t: 'Belum tepat. Lihat jawabannya ya.' }, { t: q.pembahasan }])
    } else {
      speakSeq([{ t: 'Belum tepat. Coba lagi ya!' }])
      setTimeout(() => setCoba((c) => c + 1), 1300)
    }
  }
  return (
    <div className="animate-pop space-y-3">
      <div className="rounded-3xl bg-sun px-4 py-2 text-center text-xl font-extrabold text-white shadow-chunky"><Emo>✍️</Emo> Coba sendiri!</div>
      {q.bacaan && (
        <div className="card bg-[#FFFBEA]"><div className="flex items-start gap-3"><p className="flex-1 text-xl font-bold leading-relaxed">{q.bacaan}</p><SpeakButton text={q.bacaan} /></div></div>
      )}
      <div className="card">
        <div className="flex items-start gap-3">
          <p className="flex-1 text-2xl font-extrabold leading-snug">{q.teks}</p>
          <SpeakButton text={q.teks} />
          {q.suara && <SpeakButton text={q.suara.teks} lang={q.suara.lang} label="Dengarkan kata" />}
        </div>
        {q.gambar && q.gambar !== '🔊' && <div className="mt-4"><Visual v={q.gambar} /></div>}
        {q.gambar === '🔊' && <div className="mt-2 text-center text-6xl">🔊</div>}
      </div>
      <div key={coba}>
        <Jawaban q={q} terkunci={status !== 'tanya'} onJawab={jawab} />
      </div>
      {salah > 0 && status === 'tanya' && <p className="animate-shake rounded-2xl bg-[#FFECEC] p-3 text-center text-lg font-extrabold text-red-600">Belum tepat. Ayo coba lagi!</p>}
      {status === 'benar' && <p className="animate-pop rounded-2xl bg-[#E6FFF0] p-3 text-center text-lg font-extrabold text-green-700">🎉 Benar! {q.pembahasan}</p>}
      {status === 'tunjuk' && <p className="rounded-2xl bg-[#FFF3D6] p-3 text-center text-lg font-extrabold text-sun-dark">Jawabannya: {tampilJawaban(q)}. {q.pembahasan}</p>}
    </div>
  )
}

function SukuRow({ suku }: { suku: string[] }) {
  return (
    <div className="my-3 flex flex-wrap items-center justify-center gap-2">
      {suku.map((x, k) => (
        <button key={k} onClick={() => { sfx('klik'); stop(); speak(x, 'id-ID', 0.6) }} className="tap-pop rounded-2xl bg-bubble px-5 py-3 text-4xl font-extrabold text-white shadow-chunky">{x}</button>
      ))}
      <button onClick={() => eja(suku)} className="tap-pop flex h-14 w-14 items-center justify-center rounded-full bg-good text-white shadow-chunky" aria-label="Eja semua"><Play /></button>
    </div>
  )
}

function KataGrid({ kata }: { kata: string[] }) {
  return (
    <div className="my-3 grid grid-cols-2 gap-3">
      {kata.map((k) => {
        const [teks, emoji] = k.split('|')
        const suku = teks.split('-')
        return (
          <button key={k} onClick={() => { sfx('klik'); eja(suku) }} className="tap-pop rounded-3xl border-4 border-ink/10 bg-[#FFFBEA] p-3 text-center shadow-chunky">
            {emoji && <div className="text-5xl"><Emo>{emoji}</Emo></div>}
            <div className="mt-1 text-3xl font-extrabold tracking-wide">
              {suku.map((x, j) => <span key={j} className={j % 2 ? 'text-sky-dark' : 'text-bubble'}>{x}</span>)}
            </div>
            <div className="text-sm font-bold text-ink/50">{suku.join(' · ')} → {suku.join('')}</div>
          </button>
        )
      })}
    </div>
  )
}

/** Teks bacaan: baca per kata dengan sorotan; ketuk kata untuk mendengarnya. */
function BacaSorot({ teks }: { teks: string }) {
  const kata = teks.split(/\s+/)
  const [aktif, setAktif] = useState(-1)
  const token = useRef(0)
  useEffect(() => () => { token.current++ }, [])

  async function putar() {
    stop()
    const my = ++token.current
    for (let k = 0; k < kata.length; k++) {
      if (my !== token.current) return
      setAktif(k)
      await speak(kata[k], 'id-ID', 0.75)
      await new Promise((r) => setTimeout(r, 120))
    }
    if (my === token.current) setAktif(-1)
  }
  return (
    <div className="my-3 rounded-3xl bg-[#FFFBEA] p-4">
      <p className="text-center text-3xl font-extrabold leading-[1.9]">
        {kata.map((w, k) => (
          <span key={k}>
            <button onClick={() => { token.current++; stop(); setAktif(k); speak(w, 'id-ID', 0.7).then(() => setAktif(-1)) }} className={`mx-0.5 rounded-lg px-1 ${aktif === k ? 'read-on' : ''}`}>{w}</button>{' '}
          </span>
        ))}
      </p>
      <button onClick={putar} className="btn btn-good mx-auto mt-3"><Play /> Dengarkan bacaan</button>
    </div>
  )
}

function Poin({ poin, lang }: { poin: string[]; lang: 'id-ID' | 'en-US' }) {
  return (
    <ul className="my-3 flex flex-col gap-2">
      {poin.map((p, k) => {
        let kiri = p
        let kanan = ''
        if (lang === 'en-US' && p.includes(' = ')) [kiri, kanan] = p.split(' = ')
        const ucap = lang === 'en-US' ? kiri.replace(EMO, '').trim() : kePengucapan(p)
        return (
          <li key={k}>
            <button onClick={() => { sfx('klik'); stop(); speak(ucap, lang) }} className="tap-pop flex w-full items-center gap-3 rounded-2xl border-4 border-ink/10 bg-white px-4 py-3 text-left shadow-chunky">
              <span className="flex-1 text-2xl font-extrabold"><Emo>{kiri}</Emo></span>
              {kanan && <span className="rounded-full bg-sun/20 px-3 py-1 text-lg font-bold text-sun-dark">{kanan}</span>}
              <span className="text-sky"><Emo>🔊</Emo></span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Contoh({ c }: { c: NonNullable<Slide['contoh']> }) {
  const [buka, setBuka] = useState(false)
  return (
    <div className="my-3 rounded-3xl border-4 border-dashed border-sun bg-[#FFF3D6] p-4 text-center">
      <p className="text-sm font-extrabold uppercase tracking-wide text-sun-dark">Contoh</p>
      <p className="mt-1 text-3xl font-extrabold">{c.soal}</p>
      {buka ? (
        <p className="mt-2 animate-pop text-3xl font-extrabold text-good">{c.jawab} ✅</p>
      ) : (
        <button onClick={() => { setBuka(true); sfx('benar'); speak(`Jawabannya ${c.jawab}`) }} className="btn btn-sun mt-3">Lihat jawaban</button>
      )}
    </div>
  )
}
