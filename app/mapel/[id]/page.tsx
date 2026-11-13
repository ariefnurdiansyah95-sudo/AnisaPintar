import { notFound } from 'next/navigation'
import { SUBJECTS, SUBJECT_MAP } from '@/lib/subjects'
import MapelView from '@/components/MapelView'

export function generateStaticParams() { return SUBJECTS.map((s) => ({ id: s.id })) }
export function generateMetadata({ params }: { params: { id: string } }) { return { title: SUBJECT_MAP[params.id as keyof typeof SUBJECT_MAP]?.nama ?? 'Pelajaran' } }

export default function Page({ params }: { params: { id: string } }) {
  const s = SUBJECTS.find((x) => x.id === params.id)
  if (!s) notFound()
  return <MapelView id={s.id} />
}
