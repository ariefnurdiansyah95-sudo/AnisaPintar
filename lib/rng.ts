export function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRng(seed: string | number) {
  const rnd = mulberry32(typeof seed === 'number' ? seed : hashStr(seed))
  const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)]
  const shuffle = <T,>(arr: readonly T[]): T[] => {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  return { rnd, int, pick, shuffle }
}

export function shuffle<T>(arr: readonly T[], rnd: () => number = Math.random): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Acak sampai urutannya BERBEDA dari aslinya (untuk soal susun). */
export function shuffleDifferent<T>(arr: readonly T[], rnd: () => number = Math.random): T[] {
  if (arr.length < 2) return arr.slice()
  for (let i = 0; i < 20; i++) {
    const s = shuffle(arr, rnd)
    if (s.some((x, k) => x !== arr[k])) return s
  }
  return arr.slice().reverse()
}
