import type { Lesson, MapelId } from '../types'
import { LESSONS_MEMBACA } from './membaca'
import { LESSONS_MATEMATIKA } from './matematika'
import { LESSONS_BINDO } from './bindo'
import { LESSONS_PANCASILA, LESSONS_IPAS, LESSONS_PLBJ, LESSONS_INGGRIS, LESSONS_SENI } from './umum'

export const LESSONS_BY_MAPEL: Record<MapelId, Lesson[]> = {
  membaca: LESSONS_MEMBACA,
  matematika: LESSONS_MATEMATIKA,
  bindo: LESSONS_BINDO,
  pancasila: LESSONS_PANCASILA,
  ipas: LESSONS_IPAS,
  plbj: LESSONS_PLBJ,
  inggris: LESSONS_INGGRIS,
  seni: LESSONS_SENI,
}

export const ALL_LESSONS: Lesson[] = Object.values(LESSONS_BY_MAPEL).flat()

export function getLesson(mapel: string, id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.mapel === mapel && l.id === id)
}
