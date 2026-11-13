import type { Level, MapelId, Question } from '../types'
import { benarSalah, pilihan } from './helpers'

/** Soal pilihan ganda tulisan tangan: jawaban benar, pengecoh, pembahasan. */
export interface PQ {
  t: string // teks
  a: string // jawaban benar
  s: string[] // pengecoh
  p: string // pembahasan
  l?: Level
  g?: string // gambar
  gambar?: boolean // opsi berupa gambar (emoji)
}

export interface BSQ {
  t: string
  ok: boolean
  p: string
  l?: Level
  g?: string
}

export function manual(mapel: MapelId, pfx: string, topik: string, pq: PQ[], bs: BSQ[] = []): Question[] {
  const out: Question[] = []
  pq.forEach((q, i) => {
    out.push(
      pilihan(
        { id: `${pfx}-${topik}-${i + 1}`, mapel, topik, level: q.l ?? 1 },
        q.t,
        q.a,
        q.s,
        q.p,
        { ...(q.g ? { gambar: q.g } : {}), ...(q.gambar ? { tipe: 'gambar' as const } : {}) },
      ),
    )
  })
  bs.forEach((q, i) => {
    out.push(
      benarSalah(
        { id: `${pfx}-${topik}-bs${i + 1}`, mapel, topik, level: q.l ?? 1 },
        `Benar atau salah? ${q.t}`,
        q.ok,
        q.p.length < 14 ? `${q.p} Pernyataannya: "${q.t}"` : q.p,
        q.g ? { gambar: q.g } : {},
      ),
    )
  })
  // Turunkan pernyataan benar/salah dari soal isian-kalimat yang berakhiran "…"
  pq.forEach((q, i) => {
    if (!q.t.endsWith('…') || q.gambar) return
    const stem = q.t.slice(0, -1).trimEnd()
    const lv = q.l ?? 1
    const base = (suf: string) => ({ id: `${pfx}-${topik}-d${suf}${i + 1}`, mapel, topik, level: lv })
    const ex = q.g ? { gambar: q.g } : {}
    out.push(
      benarSalah(base('t'), `Benar atau salah? ${stem} ${q.a}.`, true, `Benar. ${q.p}`, ex),
      benarSalah(base('f'), `Benar atau salah? ${stem} ${q.s[0]}.`, false, `Salah. Yang benar: ${stem} ${q.a}. ${q.p}`, ex),
    )
  })
  return out
}
