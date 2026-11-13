'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Gift, Home, Palette, Star, Trophy } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { setEfek, setSuara } from '@/lib/speech'

const ITEMS = [
  { href: '/', label: 'Beranda', Icon: Home, c: 'text-accent' },
  { href: '/kuis?mode=harian', label: 'Harian', Icon: Star, c: 'text-sun-dark' },
  { href: '/ulangan', label: 'Ulangan', Icon: Trophy, c: 'text-sky-dark' },
  { href: '/kreasi', label: 'Kreasi', Icon: Palette, c: 'text-bubble' },
  { href: '/hadiah', label: 'Hadiah', Icon: Gift, c: 'text-good' },
]

export default function Nav() {
  const path = usePathname()
  const { state, ready } = useProgress()
  useEffect(() => { if (ready) { setSuara(state.suara); setEfek(state.efek) } }, [ready, state.suara, state.efek])
  if (path.startsWith('/kuis') || path.startsWith('/belajar') || path.startsWith('/orangtua') || /^\/kreasi\/.+/.test(path)) return null
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-ink/10 bg-white/95 px-2 pb-3 pt-2 backdrop-blur" aria-label="Menu utama">
      <ul className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
        {ITEMS.map(({ href, label, Icon, c }) => {
          const aktif = href === '/' ? path === '/' : path.startsWith(href.split('?')[0]) && !href.includes('?')
          return (
            <li key={href}>
              <Link href={href} className={`flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-xs font-extrabold ${aktif ? 'bg-accent/10' : ''} ${c}`}>
                <Icon size={28} strokeWidth={2.6} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
