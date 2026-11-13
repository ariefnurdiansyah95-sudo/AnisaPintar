'use client'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Level, MapelId, Question } from '@/lib/types'
import { SUBJECT_MAP, topikNama } from '@/lib/subjects'
import { getLesson } from '@/lib/lessons'
import { useProgress } from '@/context/ProgressContext'
import { sesiBank, sesiEvaluasi, sesiHarian, sesiLatihan, sesiUlang, sesiUlangan } from '@/lib/select'
import Mascot from './Mascot'
import QuizRunner from './QuizRunner'

export default function KuisClient() {
  const sp = useSearchParams()
  const { state, ready } = useProgress()
  const mode = sp.get('mode') ?? 'bank'
  const mapel = sp.get('mapel') as MapelId | null
  const materi = sp.get('materi')
  const topik = sp.get('topik')
  const level = Number(sp.get('level') ?? 0) as Level | 0
  const n = Math.max(5, Math.min(20, Number(sp.get('n') ?? 10)))

  // Soal disusun sekali setelah progres dimuat (tidak berubah saat jawaban dicatat)
  const cfg = useMemo(() => {
    if (!ready) return null
    let soal: Question[] = []
    let judul = 'Latihan'
    let keluar = '/'
    if (mode === 'latihan' && mapel && materi) {
      const l = getLesson(mapel, materi)
      if (l) { soal = sesiLatihan(l, state); judul = `Latihan: ${l.judul}`; keluar = `/mapel/${mapel}` }
    } else if (mode === 'harian') { soal = sesiHarian(state); judul = 'Latihan Hari Ini' }
    else if (mode === 'ulang') { soal = sesiUlang(state); judul = 'Ulangi Soal yang Salah' }
    else if (mode === 'ulangan') { soal = sesiUlangan(mapel, state, n); judul = mapel ? `Ulangan ${SUBJECT_MAP[mapel].nama}` : 'Ulangan Campuran'; keluar = '/ulangan' }
    else if (mode === 'evaluasi' && mapel) { soal = sesiEvaluasi(mapel, state, 12); judul = `Cek Kemampuan: ${SUBJECT_MAP[mapel].nama}`; keluar = `/mapel/${mapel}` }
    else if (mapel) { soal = sesiBank(mapel, topik, level, n, state); judul = topik ? topikNama(mapel, topik) : SUBJECT_MAP[mapel].nama; keluar = `/mapel/${mapel}` }
    return { soal, judul, keluar }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mode, mapel, materi, topik, level, n])

  if (!cfg) return <div className="py-20 text-center"><Mascot mood="mikir" size={120} className="mx-auto" /><p className="text-xl font-extrabold">Kak Bubu menyiapkan soal…</p></div>
  return <QuizRunner soal={cfg.soal} mode={mode} judul={cfg.judul} keluar={cfg.keluar} tanpaUmpanBalik={mode === 'ulangan'} />
}
