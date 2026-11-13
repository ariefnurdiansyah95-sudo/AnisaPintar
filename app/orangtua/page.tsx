'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ChevronLeft, Download, Lock, Trash2, Upload } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { SUBJECTS, topikNama } from '@/lib/subjects'
import { bagusAkurasi, gelar, importState, levelInfo, soalSalahIds, streakHari, todayKey } from '@/lib/progress'
import { ALL_LESSONS } from '@/lib/lessons'
import { TOTAL_SOAL } from '@/lib/select'
import { ProgressBar } from '@/components/ui'
import PesanIbuSetup from '@/components/PesanIbuSetup'
import type { MapelId } from '@/lib/types'

function Bar({ label, pct, sub }: { label: string; pct: number; sub?: string }) {
  const c = pct >= 80 ? 'bg-good' : pct >= 60 ? 'bg-sun' : 'bg-bad'
  return (
    <div>
      <div className="flex justify-between text-sm font-extrabold"><span>{label}</span><span>{sub ?? `${pct}%`}</span></div>
      <ProgressBar pct={pct} warna={c} tinggi="h-3" />
    </div>
  )
}

export default function Orangtua() {
  const { state, update, replace, reset } = useProgress()
  const [pin, setPin] = useState('')
  const [buka, setBuka] = useState(false)
  const [salahPin, setSalahPin] = useState(false)
  const [pinBaru, setPinBaru] = useState('')
  const [pesan, setPesan] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!buka) {
    return (
      <div className="mx-auto max-w-sm space-y-4 pt-10 text-center">
        <Link href="/" className="inline-flex items-center gap-1 font-extrabold text-accent"><ChevronLeft /> Kembali</Link>
        <Lock className="mx-auto text-accent" size={48} />
        <h1 className="text-2xl font-extrabold">Area Orang Tua</h1>
        <p className="font-semibold text-ink/60">Masukkan PIN (bawaan: 1234)</p>
        <input inputMode="numeric" type="password" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setSalahPin(false) }}
          className={`w-full rounded-2xl border-4 bg-white py-3 text-center text-3xl tracking-[0.5em] outline-none ${salahPin ? 'border-bad' : 'border-ink/10 focus:border-accent'}`} />
        {salahPin && <p className="font-bold text-bad">PIN salah, coba lagi.</p>}
        <button className="btn btn-accent w-full" onClick={() => (pin === state.pin ? setBuka(true) : setSalahPin(true))}>Masuk</button>
      </div>
    )
  }

  const totalN = Object.values(state.mapelStat).reduce((a, v) => a + v.n, 0)
  const totalB = Object.values(state.mapelStat).reduce((a, v) => a + v.b, 0)
  const lv = levelInfo(state.xp)
  const hari7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { k: todayKey(d), l: d.toLocaleDateString('id-ID', { weekday: 'short' }) } })
  const maxN = Math.max(1, ...hari7.map((h) => state.days[h.k]?.n ?? 0))
  const tkRows = Object.entries(state.topik).map(([k, v]) => { const [m, t] = k.split(':'); return { m: m as MapelId, t, ...v, acc: bagusAkurasi(v.n, v.b), rata: v.n ? Math.round(v.ms / v.n / 1000) : 0 } })
  const lemah = tkRows.filter((r) => r.n >= 5 && r.acc < 70).sort((a, b) => a.acc - b.acc).slice(0, 5)
  const membaca = tkRows.filter((r) => r.m === 'membaca')
  const eja = membaca.filter((r) => ['suku-kata', 'gabung', 'tiga-suku', 'konsonan', 'gabungan-huruf'].includes(r.t))
  const rata = (rs: typeof tkRows) => { const n = rs.reduce((a, r) => a + r.n, 0); const b = rs.reduce((a, r) => a + r.b, 0); return { n, acc: bagusAkurasi(n, b) } }

  function unduh() {
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `anisa-pintar-${todayKey()}.json`
    a.click()
  }
  async function impor(f: File | undefined) {
    if (!f) return
    const s = importState(await f.text())
    if (s) { replace(s); setPesan('Data berhasil dipulihkan ✅') } else setPesan('File tidak valid ❌')
  }

  return (
    <div className="space-y-5 pb-10">
      <Link href="/" className="inline-flex items-center gap-1 font-extrabold text-accent"><ChevronLeft /> Beranda</Link>
      <h1 className="text-3xl font-extrabold">👨‍👩‍👧 Laporan Orang Tua</h1>

      <section className="card grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        <Stat v={`${lv.level}`} l={`Level · ${gelar(lv.level)}`} />
        <Stat v={`${totalN}`} l="Soal dijawab" />
        <Stat v={`${bagusAkurasi(totalN, totalB)}%`} l="Akurasi" />
        <Stat v={`${streakHari(state)}`} l="Hari berturut" />
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-extrabold">Kemampuan membaca & mengeja</h2>
        <Bar label="Mengeja & suku kata" pct={rata(eja).acc} sub={`${rata(eja).acc}% (${rata(eja).n} soal)`} />
        <Bar label="Membaca kalimat, paragraf, cerita" pct={rata(membaca.filter((r) => ['kalimat', 'paragraf', 'cerita'].includes(r.t))).acc} sub={`${rata(membaca.filter((r) => ['kalimat', 'paragraf', 'cerita'].includes(r.t))).acc}%`} />
        {membaca.length === 0 && <p className="text-sm font-semibold text-ink/50">Belum ada data. Mulai dari pelajaran Membaca & Mengeja.</p>}
        {membaca.length > 0 && (
          <ul className="space-y-1 text-sm font-bold">
            {membaca.map((r) => <li key={r.t} className="flex justify-between"><span>{topikNama('membaca', r.t)}</span><span className="text-ink/60">{r.acc}% · rata-rata {r.rata} detik/soal</span></li>)}
          </ul>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-extrabold">Nilai per pelajaran</h2>
        {SUBJECTS.map((s) => { const m = state.mapelStat[s.id]; return <Bar key={s.id} label={`${s.emoji} ${s.nama}`} pct={m ? bagusAkurasi(m.n, m.b) : 0} sub={m ? `${bagusAkurasi(m.n, m.b)}% (${m.n} soal)` : 'belum ada'} /> })}
      </section>

      <section className="card">
        <h2 className="mb-3 text-xl font-extrabold">Aktivitas 7 hari</h2>
        <div className="flex h-32 items-end justify-between gap-2">
          {hari7.map((h) => { const n = state.days[h.k]?.n ?? 0; return (
            <div key={h.k} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-extrabold">{n || ''}</span>
              <div className="w-full rounded-t-xl bg-accent" style={{ height: `${(n / maxN) * 80}px`, minHeight: n ? 6 : 2, opacity: n ? 1 : 0.2 }} />
              <span className="text-xs font-bold text-ink/60">{h.l}</span>
            </div>) })}
        </div>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">Perlu dilatih lagi</h2>
        {lemah.length === 0 ? <p className="font-semibold text-ink/60">Belum ada topik yang lemah. 👍</p> : (
          <ul className="space-y-1 font-bold">{lemah.map((r) => <li key={r.m + r.t}>⚠️ {topikNama(r.m, r.t)} <span className="text-ink/50">({r.acc}%)</span></li>)}</ul>
        )}
        <p className="mt-2 text-sm font-semibold text-ink/60">{soalSalahIds(state).length} soal menunggu diulang. Materi selesai: {Object.keys(state.lessons).length}/{ALL_LESSONS.length}. Bank soal: {TOTAL_SOAL} soal.</p>
      </section>

      <section className="card">
        <h2 className="mb-2 text-xl font-extrabold">Riwayat ulangan</h2>
        {state.ulangan.length === 0 ? <p className="font-semibold text-ink/60">Belum ada.</p> : (
          <ul className="space-y-1 font-bold">{[...state.ulangan].reverse().slice(0, 8).map((u) => <li key={u.ts} className="flex justify-between"><span>{new Date(u.ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {u.mapel ? SUBJECTS.find((s) => s.id === u.mapel)?.nama : 'Campuran'}</span><span>{u.skor}</span></li>)}</ul>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-extrabold">Pengaturan</h2>
        <label className="block font-bold">Nama anak
          <input value={state.nama} maxLength={20} onChange={(e) => update((s) => ({ ...s, nama: e.target.value || 'Anisa' }))} className="mt-1 w-full rounded-2xl border-4 border-ink/10 bg-white px-3 py-2 text-lg outline-none focus:border-accent" />
        </label>
        <Toggle label="Suara guru (Kak Bubu)" on={state.suara} onClick={() => update((s) => ({ ...s, suara: !s.suara }))} />
        <Toggle label="Efek suara" on={state.efek} onClick={() => update((s) => ({ ...s, efek: !s.efek }))} />
        <div className="flex gap-2">
          <input inputMode="numeric" maxLength={6} placeholder="PIN baru" value={pinBaru} onChange={(e) => setPinBaru(e.target.value.replace(/\D/g, ''))} className="flex-1 rounded-2xl border-4 border-ink/10 bg-white px-3 py-2 outline-none focus:border-accent" />
          <button className="btn btn-accent !min-h-[48px] px-4 text-base" disabled={pinBaru.length < 4} onClick={() => { update((s) => ({ ...s, pin: pinBaru })); setPinBaru(''); setPesan('PIN diganti ✅') }}>Ganti PIN</button>
        </div>
        <p className="text-xs font-semibold text-ink/50">Suara memakai suara bawaan perangkat. Jika tidak terdengar, pastikan bahasa Indonesia terpasang di pengaturan suara perangkat.</p>
      </section>

      <PesanIbuSetup />

      <section className="card space-y-2">
        <h2 className="text-xl font-extrabold">Cadangan data</h2>
        <p className="text-sm font-semibold text-ink/60">Kemajuan belajar tersimpan di perangkat ini saja. Unduh cadangan untuk memindahkannya ke perangkat lain.</p>
        <div className="flex gap-2">
          <button onClick={unduh} className="btn btn-sky flex-1 !min-h-[52px] text-base"><Download size={20} /> Unduh</button>
          <button onClick={() => fileRef.current?.click()} className="btn btn-good flex-1 !min-h-[52px] text-base"><Upload size={20} /> Pulihkan</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => impor(e.target.files?.[0])} />
        </div>
        <button className="btn btn-ghost w-full !min-h-[48px] text-base text-bad" onClick={() => { if (confirm('Hapus SEMUA kemajuan belajar? Tindakan ini tidak bisa dibatalkan.')) { reset(); setBuka(false) } }}><Trash2 size={18} /> Hapus semua data</button>
        {pesan && <p className="text-center font-bold">{pesan}</p>}
      </section>
    </div>
  )
}

function Stat({ v, l }: { v: string; l: string }) { return <div><div className="text-3xl font-extrabold text-accent">{v}</div><div className="text-xs font-bold text-ink/60">{l}</div></div> }
function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-2xl bg-cream px-3 py-2 font-bold" role="switch" aria-checked={on}>
      {label}
      <span className={`flex h-8 w-14 items-center rounded-full p-1 transition ${on ? 'bg-good' : 'bg-ink/20'}`}><span className={`h-6 w-6 rounded-full bg-white transition ${on ? 'translate-x-6' : ''}`} /></span>
    </button>
  )
}
