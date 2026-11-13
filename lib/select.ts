import type { Lesson, Level, MapelId, Question } from './types'
import { ALL_QUESTIONS, BY_MAPEL, QUESTION_MAP, filterQuestions } from './bank'
import { SUBJECTS } from './subjects'
import { makeRng } from './rng'
import { soalSalahIds, todayKey, type ProgressState } from './progress'

export type Mode = 'latihan' | 'bank' | 'harian' | 'ulangan' | 'evaluasi' | 'ulang'

const angka = (x: string) => /^\d+$/.test(x)
/** Soal "aktif": anak mengisi/menyusun/mencocokkan sendiri (bukan sekadar memilih). */
export function soalAktif(q: Question): boolean {
  if (q.tipe === 'susun' || q.tipe === 'isian' || q.tipe === 'cocok') return true
  return q.tipe === 'pilihan' && angka(q.jawaban) && !!q.opsi?.every(angka) // diubah jadi isian angka
}

function ambil(pool: Question[], n: number, s: ProgressState | null, rnd: () => number, shuffle: <T>(a: readonly T[]) => T[]): Question[] {
  if (n <= 0) return []
  const scored = shuffle(pool).map((q) => ({ q, k: (s?.q[q.id]?.n ?? 0) + rnd() * 0.5 }))
  scored.sort((a, b) => a.k - b.k)
  const out: Question[] = []
  const seen = new Set<string>()
  for (const { q } of scored) {
    const key = q.teks + '|' + (q.gambar ?? '')
    if (seen.has(key)) continue
    seen.add(key)
    out.push(q)
    if (out.length >= n) break
  }
  return out
}

/**
 * Pilih n soal; utamakan yang paling jarang dilihat anak.
 * Sedikitnya ~60% soal bersifat praktek (isi/susun/cocok) bila tersedia, sisanya pilihan & benar-salah.
 */
export function pilihSoal(pool: Question[], n: number, s: ProgressState | null, seed: string | number): Question[] {
  const { rnd, shuffle } = makeRng(seed)
  const aktif = pool.filter(soalAktif)
  const pasif = pool.filter((q) => !soalAktif(q))
  const targetAktif = Math.min(aktif.length, Math.ceil(n * 0.6))
  const a = ambil(aktif, targetAktif, s, rnd, shuffle)
  const b = ambil(pasif, n - a.length, s, rnd, shuffle)
  let out = [...a, ...b]
  if (out.length < n) out = [...out, ...ambil(pool.filter((q) => !out.includes(q)), n - out.length, s, rnd, shuffle)]
  return shuffle(out)
}

/** Ambil soal pada level tertentu; jika kurang, tambah dari level terdekat. */
export function poolDenganFallback(base: Question[], level: Level | 0, n: number): Question[] {
  if (!level) return base
  const order: Level[] = level === 1 ? [1, 2, 3] : level === 2 ? [2, 1, 3] : [3, 2, 1]
  let pool: Question[] = []
  for (const l of order) {
    pool = pool.concat(base.filter((q) => q.level === l))
    if (pool.length >= n) break
  }
  return pool
}

/** Pastikan pool punya soal praktek: bila tidak ada pada level ini, tambahkan dari level lain. */
function denganAktif(pool: Question[], semua: Question[]): Question[] {
  return pool.some(soalAktif) ? pool : [...pool, ...semua.filter(soalAktif)]
}

const seedBase = () => `${Date.now()}-${Math.random()}`

export function sesiLatihan(lesson: Lesson, s: ProgressState, n = 6): Question[] {
  if (lesson.grup) return filterQuestions({ mapel: lesson.mapel, topik: lesson.topik, grup: lesson.grup })
  const base = filterQuestions({ mapel: lesson.mapel, topik: lesson.topik })
  const maju = s.lessons[`${lesson.mapel}/${lesson.id}`] ? 2 : 1 // sudah pernah selesai → mulai lebih sulit
  const lv1 = pilihSoal(poolDenganFallback(base, maju as Level, n), Math.ceil(n * 0.5), s, seedBase())
  const ids = new Set(lv1.map((q) => q.id))
  const sisa = base.filter((q) => !ids.has(q.id))
  const rest = pilihSoal(sisa, n - lv1.length, s, seedBase())
  return [...lv1, ...rest].slice(0, n)
}

export function sesiBank(mapel: MapelId, topik: string | null, level: Level | 0, n = 10, s: ProgressState | null = null): Question[] {
  const base = filterQuestions({ mapel, topik: topik ? [topik] : undefined })
  return pilihSoal(poolDenganFallback(base, level, n), n, s, seedBase())
}

/** Paket latihan harian: sama sepanjang hari (seed tanggal), campur mapel + remedial. */
export function sesiHarian(s: ProgressState, date = todayKey()): Question[] {
  const { rnd, shuffle } = makeRng('harian-' + date)
  const plan: [MapelId, number][] = [['membaca', 3], ['matematika', 2], ['bindo', 1], ['pancasila', 1], ['ipas', 1], ['inggris', 1], ['plbj', 1], ['seni', 1]]
  const out: Question[] = []
  const used = new Set<string>()
  // remedial: sampai 2 soal yang pernah salah
  for (const id of shuffle(soalSalahIds(s)).slice(0, 2)) {
    const q = QUESTION_MAP.get(id)
    if (q) { out.push(q); used.add(id) }
  }
  for (const [m, k] of plan) {
    const lv: Level = rnd() < 0.4 ? 1 : rnd() < 0.7 ? 2 : 3
    const pool = denganAktif(poolDenganFallback(BY_MAPEL[m], lv, k + 4), BY_MAPEL[m]).filter((q) => !used.has(q.id))
    for (const q of pilihSoal(pool, k, null, 'h-' + date + m)) { out.push(q); used.add(q.id) }
  }
  return shuffle(out).slice(0, 12)
}

/** Ulangan: tanpa umpan balik sampai selesai; sebar topik. */
export function sesiUlangan(mapel: MapelId | null, s: ProgressState, n = 10): Question[] {
  const { shuffle } = makeRng(seedBase())
  if (mapel) return sesiEvaluasi(mapel, s, n)
  // simulasi ulangan harian: campur semua mapel
  const per = shuffle(SUBJECTS.map((x) => x.id))
  const out: Question[] = []
  let i = 0
  while (out.length < n) {
    const m = per[i % per.length]
    const lv: Level = i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3
    const pool = denganAktif(poolDenganFallback(BY_MAPEL[m], lv, 6), BY_MAPEL[m]).filter((q) => !out.some((o) => o.id === q.id))
    out.push(...pilihSoal(pool, 1, s, seedBase()))
    i++
  }
  return shuffle(out)
}

/** Evaluasi kemampuan: sebar merata ke semua topik dalam satu mapel, campur level. */
export function sesiEvaluasi(mapel: MapelId, s: ProgressState, n = 12): Question[] {
  const sub = SUBJECTS.find((x) => x.id === mapel)!
  const out: Question[] = []
  const used = new Set<string>()
  let r = 0
  while (out.length < n && r < n * 2) {
    for (const t of sub.topik) {
      if (out.length >= n) break
      const lv: Level = ((r % 3) + 1) as Level
      const pool = poolDenganFallback(filterQuestions({ mapel, topik: [t.id] }), lv, 5).filter((q) => !used.has(q.id))
      const [q] = pilihSoal(pool, 1, s, seedBase())
      if (q) { out.push(q); used.add(q.id) }
    }
    r++
  }
  return makeRng(seedBase()).shuffle(out)
}

export function sesiUlang(s: ProgressState, n = 10): Question[] {
  const qs = soalSalahIds(s).map((id) => QUESTION_MAP.get(id)).filter(Boolean) as Question[]
  return pilihSoal(qs, n, null, seedBase())
}

export const TOTAL_SOAL = ALL_QUESTIONS.length
