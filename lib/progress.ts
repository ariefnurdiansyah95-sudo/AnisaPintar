import type { Level, MapelId } from './types'
import { SITE } from './site'

export interface QStat {
  n: number // berapa kali dijawab
  b: number // berapa kali benar
  last: number // timestamp terakhir
  run: number // benar berturut-turut (reset kalau salah)
  salah: boolean // pernah salah dan belum "lulus" remedial
}
export interface TopikStat { n: number; b: number; ms: number }
export interface SessionLog {
  ts: number
  mode: string
  mapel?: MapelId
  total: number
  benar: number
  skor: number
}
export interface PesanIbu {
  aktif: boolean
  foto: string // data URL (sudah dikecilkan)
  suara: string // data URL rekaman suara (opsional)
  teks: string
}
export const PESAN_IBU_DEFAULT: PesanIbu = { aktif: false, foto: '', suara: '', teks: 'Tidak apa-apa, Nak. Salah itu wajar. Ayo kita coba lagi pelan-pelan. Ibu sayang kamu!' }

export interface DayLog { xp: number; n: number; b: number }

export interface ProgressState {
  v: 1
  nama: string
  avatar: string
  xp: number
  q: Record<string, QStat>
  topik: Record<string, TopikStat> // "mapel:topik"
  mapelStat: Record<string, { n: number; b: number }>
  lessons: Record<string, number> // "mapel/id" -> ts
  sessions: SessionLog[]
  ulangan: SessionLog[]
  days: Record<string, DayLog>
  suara: boolean
  efek: boolean
  pin: string
  harianDone: Record<string, number> // date -> skor
  kreasi: Record<string, number>
  maxCombo: number
  pesanIbu: PesanIbu
}

export const defaultState = (): ProgressState => ({
  v: 1,
  nama: SITE.defaultNama,
  avatar: '🦊',
  xp: 0,
  q: {},
  topik: {},
  mapelStat: {},
  lessons: {},
  sessions: [],
  ulangan: [],
  days: {},
  suara: true,
  efek: true,
  pin: '1234',
  harianDone: {},
  kreasi: {},
  maxCombo: 0,
  pesanIbu: PESAN_IBU_DEFAULT,
})

export const XP_BY_LEVEL: Record<Level, number> = { 1: 10, 2: 15, 3: 20 }

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/** Level pemain dari XP. Ambang level n = 50·n·(n−1). */
export function levelInfo(xp: number) {
  let n = 1
  while (xp >= 50 * (n + 1) * n) n++
  const start = 50 * n * (n - 1)
  const next = 50 * (n + 1) * n
  return { level: n, start, next, pct: Math.min(100, Math.round(((xp - start) / (next - start)) * 100)), sisa: next - xp }
}

export const GELAR = ['Murid Baru', 'Pembaca Cilik', 'Bintang Kecil', 'Anak Rajin', 'Juara Kelas', 'Si Pintar', 'Pahlawan Belajar', 'Bintang Sekolah', 'Cendekia Cilik', 'Raja Pintar']
export const gelar = (lv: number) => GELAR[Math.min(GELAR.length - 1, lv - 1)]

export function bintang(skor: number): 0 | 1 | 2 | 3 {
  return skor >= 90 ? 3 : skor >= 75 ? 2 : skor >= 50 ? 1 : 0
}

export function streakHari(s: ProgressState): number {
  let n = 0
  const d = new Date()
  // jika hari ini belum belajar, mulai hitung dari kemarin
  if (!s.days[todayKey(d)]) d.setDate(d.getDate() - 1)
  while (s.days[todayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function bagusAkurasi(n: number, b: number) {
  return n === 0 ? 0 : Math.round((b / n) * 100)
}

export function soalSalahIds(s: ProgressState): string[] {
  return Object.entries(s.q).filter(([, v]) => v.salah).map(([id]) => id)
}

export interface AnswerResult {
  state: ProgressState
  xp: number
}

/** Catat satu jawaban. Soal salah dihapus dari daftar ulang setelah 2x benar berturut-turut. */
export function recordAnswer(
  s: ProgressState,
  q: { id: string; mapel: MapelId; topik: string; level: Level },
  benar: boolean,
  ms: number,
  combo = 0,
  bonus = true,
): AnswerResult {
  const now = Date.now()
  const prev = s.q[q.id] ?? { n: 0, b: 0, last: 0, run: 0, salah: false }
  const run = benar ? prev.run + 1 : 0
  const salah = benar ? (prev.salah && run < 2) : true
  const qs: QStat = { n: prev.n + 1, b: prev.b + (benar ? 1 : 0), last: now, run, salah }
  const tk = `${q.mapel}:${q.topik}`
  const pt = s.topik[tk] ?? { n: 0, b: 0, ms: 0 }
  const ms2 = Math.min(ms, 60000)
  const ps = s.mapelStat[q.mapel] ?? { n: 0, b: 0 }
  let xp = 0
  if (benar) {
    xp = XP_BY_LEVEL[q.level]
    if (bonus && combo >= 3) xp += 5
    if (prev.salah) xp += 5 // bonus berhasil memperbaiki soal yang pernah salah
  }
  const dk = todayKey()
  const day = s.days[dk] ?? { xp: 0, n: 0, b: 0 }
  const next: ProgressState = {
    ...s,
    xp: s.xp + xp,
    q: { ...s.q, [q.id]: qs },
    topik: { ...s.topik, [tk]: { n: pt.n + 1, b: pt.b + (benar ? 1 : 0), ms: pt.ms + ms2 } },
    mapelStat: { ...s.mapelStat, [q.mapel]: { n: ps.n + 1, b: ps.b + (benar ? 1 : 0) } },
    days: { ...s.days, [dk]: { xp: day.xp + xp, n: day.n + 1, b: day.b + (benar ? 1 : 0) } },
    maxCombo: Math.max(s.maxCombo, combo + (benar ? 1 : 0)),
  }
  return { state: next, xp }
}

export function finishSession(s: ProgressState, log: Omit<SessionLog, 'ts'>, bonusXp = 0): ProgressState {
  const entry: SessionLog = { ...log, ts: Date.now() }
  const dk = todayKey()
  const day = s.days[dk] ?? { xp: 0, n: 0, b: 0 }
  const next: ProgressState = {
    ...s,
    xp: s.xp + bonusXp,
    sessions: [...s.sessions, entry].slice(-300),
    days: { ...s.days, [dk]: { ...day, xp: day.xp + bonusXp } },
  }
  if (log.mode === 'ulangan') next.ulangan = [...s.ulangan, entry].slice(-100)
  if (log.mode === 'harian') next.harianDone = { ...s.harianDone, [dk]: Math.max(s.harianDone[dk] ?? 0, log.skor) }
  return next
}

// ===== Lencana (diturunkan dari state, tidak disimpan) =====
export interface Badge { id: string; nama: string; emoji: string; desk: string; ok: boolean }

export function hitungLencana(s: ProgressState): Badge[] {
  const totalBenar = Object.values(s.q).reduce((a, v) => a + v.b, 0)
  const totalJawab = Object.values(s.q).reduce((a, v) => a + v.n, 0)
  const lv = levelInfo(s.xp).level
  const streak = streakHari(s)
  const acc = (m: MapelId) => s.mapelStat[m]
  const hebat = (m: MapelId) => { const a = acc(m); return !!a && a.n >= 15 && a.b / a.n >= 0.8 }
  const bestUlangan = s.ulangan.reduce((a, u) => Math.max(a, u.skor), 0)
  const lessonN = Object.keys(s.lessons).length
  return [
    { id: 'pertama', nama: 'Langkah Pertama', emoji: '👣', desk: 'Menjawab 1 soal', ok: totalJawab >= 1 },
    { id: 'b25', nama: 'Rajin Menjawab', emoji: '📝', desk: '25 jawaban benar', ok: totalBenar >= 25 },
    { id: 'b100', nama: 'Seratus Benar', emoji: '💯', desk: '100 jawaban benar', ok: totalBenar >= 100 },
    { id: 'b500', nama: 'Bintang Soal', emoji: '🌟', desk: '500 jawaban benar', ok: totalBenar >= 500 },
    { id: 'm3', nama: 'Murid Rajin', emoji: '📚', desk: 'Selesai 3 materi', ok: lessonN >= 3 },
    { id: 'm15', nama: 'Kutu Buku', emoji: '🐛', desk: 'Selesai 15 materi', ok: lessonN >= 15 },
    { id: 's3', nama: 'Tiga Hari Berturut', emoji: '🔥', desk: 'Belajar 3 hari berturut-turut', ok: streak >= 3 },
    { id: 's7', nama: 'Seminggu Penuh', emoji: '🏅', desk: 'Belajar 7 hari berturut-turut', ok: streak >= 7 },
    { id: 'combo', nama: 'Jago Beruntun', emoji: '⚡', desk: '5 jawaban benar berturut-turut', ok: s.maxCombo >= 5 },
    { id: 'lv3', nama: 'Naik Level 3', emoji: '🚀', desk: 'Capai level 3', ok: lv >= 3 },
    { id: 'lv5', nama: 'Naik Level 5', emoji: '🏆', desk: 'Capai level 5', ok: lv >= 5 },
    { id: 'ulangan', nama: 'Juara Ulangan', emoji: '🎓', desk: 'Nilai ulangan 90 atau lebih', ok: bestUlangan >= 90 },
    { id: 'baca', nama: 'Jago Membaca', emoji: '📖', desk: 'Akurasi membaca ≥ 80%', ok: hebat('membaca') },
    { id: 'mat', nama: 'Jago Hitung', emoji: '🔢', desk: 'Akurasi matematika ≥ 80%', ok: hebat('matematika') },
    { id: 'eng', nama: 'Little English', emoji: '🇬🇧', desk: 'Akurasi Bahasa Inggris ≥ 80%', ok: hebat('inggris') },
    { id: 'kreasi', nama: 'Seniman Cilik', emoji: '🎨', desk: 'Mencoba 3 permainan kreasi', ok: Object.keys(s.kreasi).length >= 3 },
    { id: 'perbaiki', nama: 'Pantang Menyerah', emoji: '💪', desk: 'Memperbaiki soal yang pernah salah', ok: Object.values(s.q).some((v) => !v.salah && v.b > 0 && v.n > v.b) },
  ]
}

// ===== Penyimpanan =====
export function loadState(): ProgressState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(SITE.storageKey)
    if (!raw) return defaultState()
    const p = JSON.parse(raw)
    return { ...defaultState(), ...p, pesanIbu: { ...PESAN_IBU_DEFAULT, ...(p.pesanIbu ?? {}) }, v: 1 }
  } catch {
    return defaultState()
  }
}
export function saveState(s: ProgressState) {
  try { window.localStorage.setItem(SITE.storageKey, JSON.stringify(s)) } catch {}
}
export function importState(json: string): ProgressState | null {
  try {
    const p = JSON.parse(json)
    if (!p || typeof p !== 'object' || p.v !== 1 || typeof p.xp !== 'number') return null
    return { ...defaultState(), ...p, pesanIbu: { ...PESAN_IBU_DEFAULT, ...(p.pesanIbu ?? {}) } }
  } catch { return null }
}
