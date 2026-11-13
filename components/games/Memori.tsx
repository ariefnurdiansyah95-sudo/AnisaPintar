'use client'
import { useEffect, useState } from 'react'
import { shuffle } from '@/lib/rng'
import { sfx } from '@/lib/speech'
import Emo from '../Emo'

const EMO = ['🐱', '🐶', '🐸', '🐵', '🦁', '🐼', '🍎', '🍌', '🚗', '⭐']

export default function Memori() {
  const [kartu, setKartu] = useState<string[]>([])
  const [buka, setBuka] = useState<number[]>([])
  const [cocok, setCocok] = useState<number[]>([])
  const [langkah, setLangkah] = useState(0)
  const [level, setLevel] = useState(6)
  const ulang = () => { setKartu(shuffle([...EMO.slice(0, level), ...EMO.slice(0, level)])); setBuka([]); setCocok([]); setLangkah(0) }
  useEffect(() => { setKartu(shuffle([...EMO.slice(0, level), ...EMO.slice(0, level)])) }, [level])

  function ketuk(i: number) {
    if (buka.length >= 2 || buka.includes(i) || cocok.includes(i)) return
    sfx('klik')
    const b = [...buka, i]
    setBuka(b)
    if (b.length === 2) {
      setLangkah((l) => l + 1)
      if (kartu[b[0]] === kartu[b[1]]) { setTimeout(() => { sfx('benar'); setCocok((c) => [...c, ...b]); setBuka([]) }, 500) }
      else setTimeout(() => setBuka([]), 900)
    }
  }
  const menang = kartu.length > 0 && cocok.length === kartu.length
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[4, 6, 8].map((n) => <button key={n} onClick={() => { setLevel(n); setBuka([]); setCocok([]); setLangkah(0) }} className={`flex-1 rounded-2xl border-4 py-2 font-extrabold ${level === n ? 'border-accent bg-accent text-white' : 'border-ink/10 bg-white'}`}>{n * 2} kartu</button>)}
      </div>
      <p className="text-center font-extrabold">Langkah: {langkah}</p>
      <div className="grid grid-cols-4 gap-3">
        {kartu.map((k, i) => {
          const tampil = buka.includes(i) || cocok.includes(i)
          return (
            <button key={i} onClick={() => ketuk(i)} className={`tap-pop flex aspect-square items-center justify-center rounded-2xl border-4 text-4xl shadow-chunky transition ${cocok.includes(i) ? 'border-good bg-[#C8F7DC]' : tampil ? 'border-accent bg-white' : 'border-white bg-accent'}`}>
              {tampil ? <Emo>{k}</Emo> : <span className="text-white"><Emo>❓</Emo></span>}
            </button>
          )
        })}
      </div>
      {menang && <div className="card animate-pop text-center text-2xl font-extrabold">🎉 Hebat! Selesai dalam {langkah} langkah</div>}
      <button onClick={ulang} className="btn btn-sun w-full">Main lagi</button>
    </div>
  )
}
