import { Suspense } from 'react'
import KuisClient from '@/components/KuisClient'
export const metadata = { title: 'Latihan Soal' }
export default function Page() {
  return <Suspense fallback={<p className="p-10 text-center text-xl font-extrabold">Memuat soal…</p>}><KuisClient /></Suspense>
}
