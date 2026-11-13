import type { Level, MapelId, Question } from '../types'
import { BANK_MEMBACA } from './membaca'
import { BANK_MATEMATIKA } from './matematika'
import { BANK_BINDO } from './bindo'
import { BANK_PANCASILA } from './pancasila'
import { BANK_IPAS } from './ipas'
import { BANK_PLBJ } from './plbj'
import { BANK_INGGRIS } from './inggris'
import { BANK_SENI } from './seni'
import { BANK_PRAKTEK } from './praktek'

const PRAKTEK_BY: Record<string, Question[]> = {}
for (const q of BANK_PRAKTEK) (PRAKTEK_BY[q.mapel] ??= []).push(q)
const P = (m: MapelId) => PRAKTEK_BY[m] ?? []

export const ALL_QUESTIONS: Question[] = [
  ...BANK_MEMBACA,
  ...P('membaca'),
  ...BANK_MATEMATIKA,
  ...P('matematika'),
  ...BANK_BINDO,
  ...P('bindo'),
  ...BANK_PANCASILA,
  ...P('pancasila'),
  ...BANK_IPAS,
  ...P('ipas'),
  ...BANK_PLBJ,
  ...P('plbj'),
  ...BANK_INGGRIS,
  ...P('inggris'),
  ...BANK_SENI,
  ...P('seni'),
]

export const QUESTION_MAP: Map<string, Question> = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))

export const BY_MAPEL: Record<MapelId, Question[]> = {
  membaca: [...BANK_MEMBACA, ...P('membaca')],
  matematika: [...BANK_MATEMATIKA, ...P('matematika')],
  bindo: [...BANK_BINDO, ...P('bindo')],
  pancasila: [...BANK_PANCASILA, ...P('pancasila')],
  ipas: [...BANK_IPAS, ...P('ipas')],
  plbj: [...BANK_PLBJ, ...P('plbj')],
  inggris: [...BANK_INGGRIS, ...P('inggris')],
  seni: [...BANK_SENI, ...P('seni')],
}

export function getQuestion(id: string): Question | undefined {
  return QUESTION_MAP.get(id)
}

export function filterQuestions(opts: { mapel?: MapelId; topik?: string[]; level?: Level | 0; grup?: string }): Question[] {
  const base = opts.mapel ? BY_MAPEL[opts.mapel] : ALL_QUESTIONS
  return base.filter(
    (q) =>
      (!opts.topik || opts.topik.length === 0 || opts.topik.includes(q.topik)) &&
      (!opts.level || q.level === opts.level) &&
      (!opts.grup || q.grup === opts.grup),
  )
}
