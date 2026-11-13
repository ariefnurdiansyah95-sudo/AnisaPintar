import { notFound } from 'next/navigation'
import { ALL_LESSONS, getLesson } from '@/lib/lessons'
import LessonPlayer from '@/components/LessonPlayer'

export function generateStaticParams() { return ALL_LESSONS.map((l) => ({ mapel: l.mapel, materi: l.id })) }
export function generateMetadata({ params }: { params: { mapel: string; materi: string } }) { return { title: getLesson(params.mapel, params.materi)?.judul ?? 'Materi' } }

export default function Page({ params }: { params: { mapel: string; materi: string } }) {
  const l = getLesson(params.mapel, params.materi)
  if (!l) notFound()
  return <LessonPlayer lesson={l} />
}
