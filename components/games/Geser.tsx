'use client'
import { useEffect, useState } from 'react'
import { sfx } from '@/lib/speech'

const SELESAI = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function acak(): number[] {
  // acak dengan langkah sah dari kondisi selesai → selalu bisa diselesaikan
  const b = SELESAI.slice()
  let kosong = 8
  let prev = -1
  for (let i = 0; i < 60; i++) {
    const r = Math.floor(kosong / 3), c = kosong % 3
    const n: number[] = []
    if (r > 0) n.push(kosong - 3)
    if (r < 2) n.push(kosong + 3)
    if (c > 0) n.push(kosong - 1)
    if (c < 2) n.push(kosong + 1)
    const pil = n.filter((x) => x !== prev)
    const t = pil[Math.floor(Math.random() * pil.length)]
    ;[b[kosong], b[t]] = [b[t], b[kosong]]
    prev = kosong
    kosong = t
  }
  return b
}

export default function Geser() {
  const [b, setB] = useState<number[]>(SELESAI)
  const [langkah, setLangkah] = useState(0)
  useEffect(() => setB(acak()), [])
  const menang = b.every((v, i) => v === SELESAI[i])
  function ketuk(i: number) {
    if (menang) return
    const k = b.indexOf(0)
    const dekat = (Math.abs(i - k) === 3) || (Math.abs(i - k) === 1 && Math.floor(i / 3) === Math.floor(k / 3))
    if (!dekat) return
    sfx('klik')
    const n = b.slice();
    [n[i], n[k]] = [n[k], n[i]]
    setB(n)
    setLangkah((l) => l + 1)
    if (n.every((v, j) => v === SELESAI[j])) sfx('menang')
  }
  return (
    <div className="space-y-3">
      <p className="text-center font-bold text-ink/60">Geser kotak sampai angkanya urut 1 sampai 8</p>
      <p className="text-center font-extrabold">Langkah: {langkah}</p>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 rounded-3xl bg-ink/10 p-2">
        {b.map((v, i) => (
          <button key={i} onClick={() => ketuk(i)} disabled={v === 0} className={`flex aspect-square items-center justify-center rounded-2xl text-5xl font-extrabold text-white shadow-chunky ${v === 0 ? 'invisible' : 'tap-pop bg-accent'}`}>{v || ''}</button>
        ))}
      </div>
      {menang && <div className="card animate-pop text-center text-2xl font-extrabold">🎉 Berhasil! {langkah} langkah</div>}
      <button onClick={() => { setB(acak()); setLangkah(0) }} className="btn btn-sun w-full">Acak lagi</button>
    </div>
  )
}
