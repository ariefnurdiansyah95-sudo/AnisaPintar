'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import Gambar from './Gambar'
import Mewarnai from './Mewarnai'
import Memori from './Memori'
import Geser from './Geser'

export default function GameHost({ id, nama }: { id: string; nama: string }) {
  const { update, ready } = useProgress()
  useEffect(() => { if (ready) update((s) => (s.kreasi[id] ? s : { ...s, kreasi: { ...s.kreasi, [id]: Date.now() } })) }, [ready, id, update])
  return (
    <div className="space-y-3 pb-6">
      <Link href="/kreasi" className="inline-flex items-center gap-1 font-extrabold text-accent"><ChevronLeft /> Kreasi</Link>
      <h1 className="text-3xl font-extrabold">{nama}</h1>
      {id === 'gambar' && <Gambar />}
      {id === 'mewarnai' && <Mewarnai />}
      {id === 'memori' && <Memori />}
      {id === 'geser' && <Geser />}
    </div>
  )
}
