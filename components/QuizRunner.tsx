'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Delete, Home, RotateCcw, X } from 'lucide-react'
import type { Question } from '@/lib/types'
import { useProgress } from '@/context/ProgressContext'
import { bintang, finishSession, hitungLencana, levelInfo, recordAnswer, bagusAkurasi } from '@/lib/progress'
import { norm } from '@/lib/normalize'
import { shuffle, shuffleDifferent } from '@/lib/rng'
import { speak, speakSeq, sfx, stop } from '@/lib/speech'
import { SUBJECT_MAP, LEVEL_EMOJI } from '@/lib/subjects'
import Mascot from './Mascot'
import PesanIbuPopup from './PesanIbuPopup'
import Visual from './Visual'
import { Bintang, Confetti, Guru, ProgressBar, SpeakButton } from './ui'
import Emo from './Emo'

interface Props {
  soal: Question[]
  mode: string // latihan | bank | harian | ulangan | evaluasi | ulang
  judul: string
  keluar: string // href tombol kembali
  tanpaUmpanBalik?: boolean // ulangan
}

interface Hasil { q: Question; benar: boolean; jawab: string }

const PUJI = ['Hebat!', 'Pintar sekali!', 'Benar!', 'Keren!', 'Mantap!', 'Luar biasa!']
const SEMANGAT = ['Ayo coba lagi nanti!', 'Tidak apa-apa, kita belajar bersama.', 'Hampir! Perhatikan penjelasannya ya.']

const isAngka = (s: string) => /^\d+$/.test(s.trim())

/** Soal pilihan dengan jawaban angka diubah jadi isian (anak mengetik lewat tombol angka). */
export function tampilQ(q: Question): Question {
  if (q.tipe === 'pilihan' && isAngka(q.jawaban) && q.opsi?.every(isAngka)) return { ...q, tipe: 'isian', opsi: undefined }
  return q
}
const isVisualOpt = (s: string) => /^(shape|clock|blok):/.test(s)

export default function QuizRunner({ soal: soalAwal, mode, judul, keluar, tanpaUmpanBalik = false }: Props) {
  const { state, update } = useProgress()
  const [soal, setSoal] = useState<Question[]>(soalAwal)
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState<'tanya' | 'benar' | 'salah'>('tanya')
  const [hasil, setHasil] = useState<Hasil[]>([])
  const [selesai, setSelesai] = useState(false)
  const [xpTotal, setXpTotal] = useState(0)
  const [combo, setCombo] = useState(0)
  const [xpFlash, setXpFlash] = useState(0)
  const [putaran, setPutaran] = useState(0)
  const mulai = useRef(Date.now())
  const comboRef = useRef(0)
  const lencanaAwal = useRef(hitungLencana(state).filter((b) => b.ok).map((b) => b.id))
  const levelAwal = useRef(levelInfo(state.xp).level)
  const tersimpan = useRef(false)
  const salahBerturut = useRef(0)
  const [popupIbu, setPopupIbu] = useState(false)
  const ibuAktif = !!state.pesanIbu?.aktif

  const q = soal[idx] ? tampilQ(soal[idx]) : undefined

  // Ucapkan soal setiap kali berganti
  useEffect(() => {
    if (!q || selesai) return
    mulai.current = Date.now()
    const parts: { t: string; lang?: 'id-ID' | 'en-US' }[] = []
    if (q.suara) parts.push({ t: q.suara.teks, lang: q.suara.lang })
    if (!q.suara || q.suara.lang !== 'en-US' || q.teks.length > 0) parts.push({ t: q.teks })
    const t = setTimeout(() => speakSeq(parts), 250)
    return () => { clearTimeout(t); stop() }
  }, [q, selesai, putaran])

  const catat = useCallback((benar: boolean, jawab: string) => {
    if (!q) return
    const ms = Date.now() - mulai.current
    let gain = 0
    update((s) => {
      const r = recordAnswer(s, q, benar, ms, comboRef.current, mode !== 'ulangan')
      gain = r.xp
      return r.state
    })
    comboRef.current = benar ? comboRef.current + 1 : 0
    salahBerturut.current = benar ? 0 : salahBerturut.current + 1
    if (!benar && ibuAktif && !tanpaUmpanBalik) setTimeout(() => setPopupIbu(true), 700)
    setCombo(comboRef.current)
    setXpTotal((x) => x + gain)
    setXpFlash(gain)
    setHasil((h) => [...h, { q, benar, jawab }])
    if (!tanpaUmpanBalik) {
      setStatus(benar ? 'benar' : 'salah')
      sfx(benar ? 'benar' : 'salah')
      const kata = benar ? PUJI[Math.floor(Math.random() * PUJI.length)] : 'Belum tepat.'
      setTimeout(() => speakSeq([{ t: kata }, { t: q.pembahasan }]), 350)
    } else {
      sfx('klik')
      lanjut()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, update, mode, tanpaUmpanBalik])

  const lanjut = useCallback(() => {
    stop()
    setXpFlash(0)
    if (idx + 1 >= soal.length) {
      setSelesai(true)
      return
    }
    setIdx((i) => i + 1)
    setStatus('tanya')
  }, [idx, soal.length])

  // Simpan sesi sekali saat selesai
  const bonus = useMemo(() => {
    const b = hasil.filter((h) => h.benar).length
    const skor = hasil.length ? Math.round((b / hasil.length) * 100) : 0
    return { b, skor, bonusXp: bintang(skor) * 5 + (skor === 100 ? 10 : 0) }
  }, [hasil])
  useEffect(() => {
    if (!selesai || tersimpan.current) return
    tersimpan.current = true
    update((s) => finishSession(s, { mode, mapel: soal[0]?.mapel, total: hasil.length, benar: bonus.b, skor: bonus.skor }, bonus.bonusXp))
    sfx(bonus.skor >= 50 ? 'menang' : 'klik')
    speakSeq([{ t: bonus.skor >= 75 ? `Hebat sekali, ${state.nama}! Nilaimu ${bonus.skor}.` : bonus.skor >= 50 ? `Bagus, ${state.nama}! Nilaimu ${bonus.skor}. Ayo belajar lagi.` : `Tidak apa-apa, ${state.nama}. Ayo kita belajar lagi bersama.` }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selesai])

  function ulangSalah() {
    const salah = hasil.filter((h) => !h.benar).map((h) => h.q)
    if (!salah.length) return
    tersimpan.current = false
    comboRef.current = 0
    setSoal(shuffle(salah))
    setHasil([])
    setIdx(0)
    setStatus('tanya')
    setSelesai(false)
    setXpTotal(0)
    setPutaran((p) => p + 1)
  }

  if (!q && !selesai) {
    return (
      <div className="card text-center">
        <Mascot mood="mikir" size={120} className="mx-auto" />
        <p className="mt-2 text-xl font-extrabold">Belum ada soal di sini.</p>
        <Link href={keluar} className="btn btn-accent mt-4">Kembali</Link>
      </div>
    )
  }

  if (selesai) {
    return <><Selesai judul={judul} keluar={keluar} hasil={hasil} xp={xpTotal + bonus.bonusXp} skor={bonus.skor} state={state} lencanaAwal={lencanaAwal.current} levelAwal={levelAwal.current} ulangan={tanpaUmpanBalik} onUlang={ulangSalah} />{ibuAktif && bonus.skor < 50 && <PesanIbuPopup onTutup={() => {}} otomatis />}</>
  }

  if (!q) return null
  const sub = SUBJECT_MAP[q.mapel]
  return (
    <div className="mx-auto w-full max-w-2xl pb-40">
      {popupIbu && <PesanIbuPopup onTutup={() => setPopupIbu(false)} />}
      <div className="mb-3 flex items-center gap-3">
        <Link href={keluar} aria-label="Keluar" onClick={() => stop()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-chunky active:translate-y-1"><X /></Link>
        <div className="flex-1">
          <ProgressBar pct={((idx + (status === 'tanya' ? 0 : 1)) / soal.length) * 100} warna="bg-sun" tinggi="h-5" />
          <div className="mt-1 flex justify-between text-sm font-bold text-ink/70">
            <span>{judul}</span>
            <span>{idx + 1}/{soal.length}</span>
          </div>
        </div>
        {combo >= 2 && !tanpaUmpanBalik && <span className="chip animate-pop border-sun text-sun-dark"><Emo>🔥</Emo> {combo}</span>}
      </div>

      <div key={q.id + putaran} className="animate-pop">
        <div className="mb-2 flex flex-wrap gap-2 text-xs font-extrabold">
          <span className="chip"><Emo>{sub.emoji}</Emo> {sub.nama}</span>
          <span className="chip"><Emo>{LEVEL_EMOJI[q.level]}</Emo> Level {q.level}</span>
        </div>

        {q.bacaan && (
          <div className="card mb-3 bg-[#FFFBEA]">
            <div className="flex items-start gap-3">
              <p className="flex-1 text-xl font-bold leading-relaxed">{q.bacaan}</p>
              <SpeakButton text={q.bacaan} />
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-start gap-3">
            <p className="flex-1 text-2xl font-extrabold leading-snug">{q.teks}</p>
            <SpeakButton text={q.teks} />
            {q.suara && <SpeakButton text={q.suara.teks} lang={q.suara.lang} label="Dengarkan kata" />}
          </div>
          {q.gambar && q.gambar !== '🔊' && <div className="mt-4"><Visual v={q.gambar} /></div>}
          {q.gambar === '🔊' && <div className="mt-2 text-center text-6xl"><Emo>🔊</Emo></div>}
        </div>

        <div className="mt-4">
          <Jawaban key={q.id + putaran} q={q} terkunci={status !== 'tanya'} onJawab={catat} />
        </div>
      </div>

      {status !== 'tanya' && !tanpaUmpanBalik && (
        <div className={`fixed inset-x-0 bottom-0 z-40 border-t-4 px-4 pb-6 pt-3 ${status === 'benar' ? 'border-good bg-[#E6FFF0]' : 'border-bad bg-[#FFECEC]'}`}>
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-2">
              <Mascot mood={status === 'benar' ? 'hore' : 'sedih'} size={84} />
              <div className="mb-1 flex-1">
                <p className={`text-2xl font-extrabold ${status === 'benar' ? 'text-green-700' : 'text-red-600'}`}>
                  <Emo>{status === 'benar' ? '🎉 Benar!' : '😢 Belum tepat'}</Emo> {xpFlash > 0 && <span className="ml-1 rounded-full bg-sun px-2 py-0.5 text-base text-white">+{xpFlash} XP</span>}
                </p>
                {status === 'salah' && <p className="text-base font-bold text-ink/80">Jawabannya: <span className="text-accent-dark">{tampilJawaban(q)}</span></p>}
                <p className="text-base font-semibold leading-snug text-ink/80">{q.pembahasan}</p>
              </div>
            </div>
            <button className={`btn mt-2 w-full ${status === 'benar' ? 'btn-good' : 'btn-sun'}`} onClick={() => lanjut()}>
              {idx + 1 >= soal.length ? 'Lihat hasil' : 'Lanjut'} →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function tampilJawaban(q: Question): string {
  if (q.tipe === 'susun' && q.urutan) return q.urutan.join(q.gabung ? '-' : ' ')
  if (q.tipe === 'cocok' && q.pasangan) return q.pasangan.map((p) => p.join(' = ')).join(', ')
  if (q.tipe === 'benarsalah') return q.jawaban === 'benar' ? 'Benar' : 'Salah'
  return isVisualOpt(q.jawaban) ? 'pilihan yang benar' : q.jawaban
}

// ================= Input jawaban per tipe =================
export function Jawaban({ q, terkunci, onJawab }: { q: Question; terkunci: boolean; onJawab: (benar: boolean, jawab: string) => void }) {
  if (q.tipe === 'benarsalah') return <BenarSalah q={q} terkunci={terkunci} onJawab={onJawab} />
  if (q.tipe === 'isian') return <Isian q={q} terkunci={terkunci} onJawab={onJawab} />
  if (q.tipe === 'susun') return <Susun q={q} terkunci={terkunci} onJawab={onJawab} />
  if (q.tipe === 'cocok') return <Cocok q={q} terkunci={terkunci} onJawab={onJawab} />
  return <Pilihan q={q} terkunci={terkunci} onJawab={onJawab} />
}
type JP = { q: Question; terkunci: boolean; onJawab: (benar: boolean, jawab: string) => void }

const WARNA_OPSI = ['bg-[#FF7675]', 'bg-[#54A0FF]', 'bg-[#FDCB6E]', 'bg-[#55E6C1]']

function Pilihan({ q, terkunci, onJawab }: JP) {
  const opsi = useMemo(() => q.opsi ?? [], [q])
  const [pilih, setPilih] = useState<string | null>(null)
  const gambar = q.tipe === 'gambar'
  return (
    <div className={`grid gap-3 ${gambar ? 'grid-cols-3' : opsi.length > 3 && opsi.every((o) => o.length < 12) ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {opsi.map((o, i) => {
        const dipilih = pilih === o
        const benar = terkunci && o === q.jawaban
        const salah = terkunci && dipilih && o !== q.jawaban
        return (
          <button
            key={o}
            disabled={terkunci}
            onClick={() => { setPilih(o); sfx('klik'); onJawab(o === q.jawaban, o) }}
            className={`tap-pop flex min-h-[72px] items-center justify-center gap-2 rounded-3xl border-4 px-4 py-3 text-center font-extrabold shadow-chunky transition ${gambar ? 'text-6xl' : 'text-2xl'}
              ${benar ? 'border-good bg-[#C8F7DC] animate-pop' : salah ? 'border-bad bg-[#FFD6D6] animate-shake' : dipilih ? 'border-accent bg-accent/10' : 'border-ink/10 bg-white'}`}
          >
            {!gambar && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-white ${WARNA_OPSI[i % 4]}`}>{String.fromCharCode(65 + i)}</span>}
            {isVisualOpt(o) ? <Visual v={o} size="sm" /> : <span className={gambar ? '' : 'flex-1'}><Emo>{o}</Emo></span>}
            {benar && <Check className="text-good" />}
          </button>
        )
      })}
    </div>
  )
}

function BenarSalah({ q, terkunci, onJawab }: JP) {
  const [pilih, setPilih] = useState<string | null>(null)
  const tombol = [{ v: 'benar', t: 'Benar', e: '👍', c: 'bg-good' }, { v: 'salah', t: 'Salah', e: '👎', c: 'bg-bad' }]
  return (
    <div className="grid grid-cols-2 gap-4">
      {tombol.map((b) => {
        const ok = terkunci && b.v === q.jawaban
        const no = terkunci && pilih === b.v && b.v !== q.jawaban
        return (
          <button key={b.v} disabled={terkunci} onClick={() => { setPilih(b.v); sfx('klik'); onJawab(b.v === q.jawaban, b.v) }}
            className={`tap-pop flex min-h-[110px] flex-col items-center justify-center rounded-3xl text-3xl font-extrabold text-white shadow-chunkyLg ${b.c} ${ok ? 'ring-8 ring-yellow-300 animate-pop' : ''} ${no ? 'animate-shake opacity-60' : ''} ${terkunci && !ok && !no ? 'opacity-50' : ''}`}>
            <span className="text-5xl">{b.e}</span>{b.t}
          </button>
        )
      })}
    </div>
  )
}

function Isian({ q, terkunci, onJawab }: JP) {
  const [v, setV] = useState('')
  const angka = isAngka(q.jawaban) && !q.terima?.some((t) => !isAngka(t))
  const cek = () => {
    if (!v.trim() || terkunci) return
    const a = norm(v)
    const ok = a === norm(q.jawaban) || !!q.terima?.some((t) => norm(t) === a)
    onJawab(ok, v)
  }
  return (
    <div>
      <div className={`flex min-h-[72px] items-center justify-center rounded-3xl border-4 bg-white text-4xl font-extrabold tracking-wider ${terkunci ? 'border-ink/10' : 'border-accent'}`}>
        {angka ? (
          <span>{v || <span className="text-ink/20">?</span>}</span>
        ) : (
          <input autoFocus value={v} disabled={terkunci} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && cek()}
            placeholder="Ketik di sini…" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            className="w-full rounded-3xl bg-transparent px-4 py-3 text-center outline-none placeholder:text-ink/25" />
        )}
      </div>
      {angka && (
        <div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} disabled={terkunci} onClick={() => { sfx('klik'); setV((x) => (x + d).slice(0, 4)) }} className="tap-pop rounded-2xl bg-white py-3 text-3xl font-extrabold shadow-chunky">{d}</button>
          ))}
          <button disabled={terkunci} onClick={() => setV((x) => x.slice(0, -1))} aria-label="Hapus" className="tap-pop flex items-center justify-center rounded-2xl bg-sun py-3 text-white shadow-chunky"><Delete /></button>
          <button disabled={terkunci} onClick={() => { sfx('klik'); setV((x) => (x + '0').slice(0, 4)) }} className="tap-pop rounded-2xl bg-white py-3 text-3xl font-extrabold shadow-chunky">0</button>
          <span />
        </div>
      )}
      <button disabled={terkunci || !v.trim()} onClick={cek} className="btn btn-accent mt-4 w-full disabled:opacity-40">Periksa jawaban ✓</button>
    </div>
  )
}

function Susun({ q, terkunci, onJawab }: JP) {
  const target = q.urutan ?? []
  const awal = useMemo(() => shuffleDifferent([...target, ...(q.pengecoh ?? [])].map((t, i) => ({ t, i }))), [target, q.pengecoh])
  const [dipakai, setDipakai] = useState<number[]>([]) // index di awal
  const sisa = awal.map((_, i) => i).filter((i) => !dipakai.includes(i))
  const penuh = dipakai.length === target.length
  const kata = dipakai.map((i) => awal[i].t)
  const periksa = () => onJawab(kata.join('\u0001') === target.join('\u0001'), kata.join(q.gabung ? '' : ' '))
  const besar = q.gabung && (target[0]?.length ?? 0) <= 2
  return (
    <div>
      <div className="flex min-h-[84px] flex-wrap items-center gap-2 rounded-3xl border-4 border-dashed border-accent/40 bg-white p-3">
        {dipakai.length === 0 && <span className="w-full text-center font-bold text-ink/30">{q.gabung ? 'Ketuk kepingan di bawah satu per satu' : 'Ketuk kata di bawah untuk menyusun'}</span>}
        {dipakai.map((i) => (
          <button key={i} disabled={terkunci} onClick={() => { sfx('klik'); setDipakai((d) => d.filter((x) => x !== i)) }} className={`tap-pop rounded-2xl bg-accent font-extrabold text-white shadow-chunky ${besar ? 'px-5 py-3 text-4xl' : 'px-4 py-2 text-2xl'}`}>
            {awal[i].t}
          </button>
        ))}
      </div>
      {q.gabung && kata.length > 0 && <p className="mt-2 text-center text-3xl font-extrabold tracking-widest text-accent-dark">{kata.join('')}</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {sisa.map((i) => (
          <button key={i} disabled={terkunci} onClick={() => { sfx('klik'); speak(awal[i].t, 'id-ID', 0.6); setDipakai((d) => [...d, i]) }} className={`tap-pop rounded-2xl border-4 border-ink/10 bg-white font-extrabold shadow-chunky ${besar ? 'px-5 py-3 text-4xl' : 'px-4 py-2 text-2xl'}`}>{awal[i].t}</button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={terkunci || dipakai.length === 0} onClick={() => setDipakai([])} className="btn btn-ghost px-4 disabled:opacity-40" aria-label="Ulangi"><RotateCcw /></button>
        <button disabled={terkunci || !penuh} onClick={periksa} className="btn btn-accent flex-1 disabled:opacity-40">Periksa jawaban ✓</button>
      </div>
    </div>
  )
}

function Cocok({ q, terkunci, onJawab }: JP) {
  const pas = q.pasangan ?? []
  const kanan = useMemo(() => shuffle(pas.map((p) => p[1])), [pas])
  const [kiriPilih, setKiriPilih] = useState<number | null>(null)
  const [cocok, setCocok] = useState<Record<number, string>>({})
  const [salahKe, setSalahKe] = useState<string | null>(null)
  const [kesalahan, setKesalahan] = useState(0)
  const dipakaiKanan = new Set(Object.values(cocok))

  function pilihKanan(r: string) {
    if (terkunci || kiriPilih === null || dipakaiKanan.has(r)) return
    if (pas[kiriPilih][1] === r) {
      sfx('benar')
      const baru = { ...cocok, [kiriPilih]: r }
      setCocok(baru)
      setKiriPilih(null)
      if (Object.keys(baru).length === pas.length) setTimeout(() => onJawab(kesalahan === 0, 'cocok'), 450)
    } else {
      sfx('salah')
      setKesalahan((k) => k + 1)
      setSalahKe(r)
      setTimeout(() => setSalahKe(null), 450)
    }
  }
  const lihat = (s: string) => (isVisualOpt(s) ? <Visual v={s} size="sm" /> : <span>{s}</span>)
  return (
    <div>
      <p className="mb-2 text-center font-bold text-ink/60">Ketuk satu di kiri, lalu pasangannya di kanan</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {pas.map((p, i) => (
            <button key={i} disabled={terkunci || i in cocok} onClick={() => { sfx('klik'); speak(p[0]); setKiriPilih(i) }}
              className={`tap-pop flex min-h-[64px] items-center justify-center rounded-2xl border-4 px-2 py-2 text-center text-xl font-extrabold shadow-chunky ${i in cocok ? 'border-good bg-[#C8F7DC]' : kiriPilih === i ? 'border-accent bg-accent/10' : 'border-ink/10 bg-white'}`}>
              {lihat(p[0])}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {kanan.map((r) => (
            <button key={r} disabled={terkunci || dipakaiKanan.has(r)} onClick={() => pilihKanan(r)}
              className={`tap-pop flex min-h-[64px] items-center justify-center rounded-2xl border-4 px-2 py-2 text-center text-xl font-extrabold shadow-chunky ${dipakaiKanan.has(r) ? 'border-good bg-[#C8F7DC]' : salahKe === r ? 'animate-shake border-bad bg-[#FFD6D6]' : 'border-ink/10 bg-white'}`}>
              {lihat(r)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ================= Layar selesai =================
function Selesai({ judul, keluar, hasil, xp, skor, state, lencanaAwal, levelAwal, ulangan, onUlang }: {
  judul: string; keluar: string; hasil: Hasil[]; xp: number; skor: number; state: ReturnType<typeof useProgress>['state']
  lencanaAwal: string[]; levelAwal: number; ulangan: boolean; onUlang: () => void
}) {
  const b = hasil.filter((h) => h.benar).length
  const salah = hasil.filter((h) => !h.benar)
  const star = bintang(skor)
  const baru = hitungLencana(state).filter((x) => x.ok && !lencanaAwal.includes(x.id))
  const lv = levelInfo(state.xp)
  const mood = skor >= 75 ? 'hore' : skor >= 50 ? 'senang' : 'sedih'
  return (
    <div className="mx-auto max-w-2xl pb-10 text-center">
      {skor >= 75 && <Confetti />}
      <Mascot mood={mood} size={150} className="mx-auto" />
      <h1 className="mt-2 text-3xl font-extrabold">{skor >= 90 ? 'Luar biasa!' : skor >= 75 ? 'Hebat sekali!' : skor >= 50 ? 'Bagus!' : 'Ayo semangat!'}</h1>
      <p className="font-bold text-ink/70">{judul}</p>
      <div className="my-4"><Bintang n={star} besar /></div>
      <div className="card mx-auto grid max-w-md grid-cols-3 gap-2">
        <div><div className="text-4xl font-extrabold text-accent">{skor}</div><div className="text-sm font-bold">Nilai</div></div>
        <div><div className="text-4xl font-extrabold text-good">{b}/{hasil.length}</div><div className="text-sm font-bold">Benar</div></div>
        <div><div className="text-4xl font-extrabold text-sun-dark">+{xp}</div><div className="text-sm font-bold">XP</div></div>
      </div>
      {lv.level > levelAwal && <div className="card mt-4 animate-pop border-sun bg-[#FFF3D6] text-xl font-extrabold"><Emo>🚀</Emo> Naik ke Level {lv.level}!</div>}
      {baru.map((x) => (
        <div key={x.id} className="card mt-3 flex animate-pop items-center gap-3 border-accent text-left">
          <span className="text-5xl"><Emo>{x.emoji}</Emo></span>
          <div><div className="text-lg font-extrabold">Lencana baru: {x.nama}</div><div className="font-semibold text-ink/70">{x.desk}</div></div>
        </div>
      ))}

      {(ulangan || salah.length > 0) && (
        <div className="mt-5 text-left">
          <h2 className="mb-2 text-xl font-extrabold">{salah.length ? `Yuk, lihat ${salah.length} soal yang salah` : 'Semua benar! 🎉'}</h2>
          <div className="flex flex-col gap-3">
            {salah.map((h) => (
              <div key={h.q.id} className="card !p-4">
                <p className="text-lg font-extrabold">{h.q.teks}</p>
                {h.q.gambar && !h.q.gambar.startsWith('🔊') && <div className="my-2"><Visual v={h.q.gambar} size="sm" /></div>}
                <p className="mt-1 font-bold text-red-600">Jawabanmu: {h.jawab.length > 40 ? '…' : h.jawab}</p>
                <p className="font-bold text-green-700">Yang benar: {tampilJawaban(h.q)}</p>
                <p className="mt-1 font-semibold text-ink/80">{h.q.pembahasan}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3">
        {salah.length > 0 && <button onClick={onUlang} className="btn btn-sun"><RotateCcw /> Ulangi soal yang salah</button>}
        <Link href={keluar} className="btn btn-accent">Selesai</Link>
        <Link href="/" className="btn btn-ghost"><Home /> Ke beranda</Link>
      </div>
      <p className="mt-4 text-sm font-bold text-ink/50">Akurasi keseluruhan: {bagusAkurasi(Object.values(state.mapelStat).reduce((a, v) => a + v.n, 0), Object.values(state.mapelStat).reduce((a, v) => a + v.b, 0))}%</p>
    </div>
  )
}
