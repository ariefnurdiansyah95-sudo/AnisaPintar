import type { Level, MapelId, Question } from '../types'
import { makeRng } from '../rng'

type Base = {
  id: string
  mapel: MapelId
  topik: string
  level: Level
  grup?: string
}

/** Pilihan ganda: opsi diacak deterministik berdasarkan id. */
export function pilihan(
  b: Base,
  teks: string,
  jawaban: string,
  salah: string[],
  pembahasan: string,
  extra: Partial<Question> = {},
): Question {
  const r = makeRng('opsi:' + b.id)
  const opsi = r.shuffle([jawaban, ...salah])
  return { ...b, tipe: extra.tipe ?? 'pilihan', teks, opsi, jawaban, pembahasan, ...extra }
}

export function benarSalah(
  b: Base,
  teks: string,
  benar: boolean,
  pembahasan: string,
  extra: Partial<Question> = {},
): Question {
  return { ...b, tipe: 'benarsalah', teks, jawaban: benar ? 'benar' : 'salah', pembahasan, ...extra }
}

export function isian(
  b: Base,
  teks: string,
  jawaban: string,
  pembahasan: string,
  extra: Partial<Question> = {},
): Question {
  return { ...b, tipe: 'isian', teks, jawaban, pembahasan, ...extra }
}

export function susun(
  b: Base,
  teks: string,
  urutan: string[],
  pembahasan: string,
  extra: Partial<Question> = {},
): Question {
  return { ...b, tipe: 'susun', teks, jawaban: urutan.join(' '), urutan, pembahasan, ...extra }
}

export function cocok(
  b: Base,
  teks: string,
  pasangan: [string, string][],
  pembahasan: string,
  extra: Partial<Question> = {},
): Question {
  return { ...b, tipe: 'cocok', teks, jawaban: pasangan.map((p) => p.join('=')).join(', '), pasangan, pembahasan, ...extra }
}

/** Tiga pengecoh angka yang berbeda dari jawaban. */
export function numSalah(ans: number, seed: string, opts: { min?: number; max?: number; step?: number[] } = {}): string[] {
  const r = makeRng('num:' + seed)
  const min = opts.min ?? 0
  const max = opts.max ?? 1000
  const steps = opts.step ?? [1, 2, 3, 10]
  const cand = new Set<number>()
  for (const s of steps) {
    cand.add(ans + s)
    cand.add(ans - s)
  }
  const list = r.shuffle([...cand].filter((n) => n !== ans && n >= min && n <= max))
  let k = 1
  while (list.length < 3) {
    const n = ans + k
    if (n !== ans && n >= min && n <= max && !list.includes(n)) list.push(n)
    const m = ans - k
    if (list.length < 3 && m !== ans && m >= min && m <= max && !list.includes(m)) list.push(m)
    k++
    if (k > 50) break
  }
  return list.slice(0, 3).map(String)
}

export function pickDistinct<T>(pool: readonly T[], n: number, not: T[], seed: string): T[] {
  const r = makeRng('pd:' + seed)
  return r.shuffle(Array.from(new Set(pool)).filter((x) => !not.includes(x))).slice(0, n)
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Lengkapi sampai 3 pengecoh unik (selain jawaban) dari kandidat + cadangan. */
export function fill3(cands: string[], ans: string, pool: string[], seed: string): string[] {
  const out: string[] = []
  for (const c of cands) if (c !== ans && !out.includes(c)) out.push(c)
  const r = makeRng('f3:' + seed)
  for (const c of r.shuffle(pool)) {
    if (out.length >= 3) break
    if (c !== ans && !out.includes(c)) out.push(c)
  }
  return out.slice(0, 3)
}
