'use client'
import { useState } from 'react'
import Palet from './Palet'
import Emo from '../Emo'

type Bagian = { id: string; el: (fill: string, on: () => void) => React.ReactNode }
const props = (fill: string, on: () => void) => ({ fill, stroke: '#3B2F63', strokeWidth: 4, strokeLinejoin: 'round' as const, onClick: on, style: { cursor: 'pointer' } })

const GAMBAR: Record<string, { nama: string; emoji: string; bagian: Bagian[] }> = {
  rumah: {
    nama: 'Rumah', emoji: '🏠',
    bagian: [
      { id: 'langit', el: (f, o) => <rect x="0" y="0" width="300" height="260" {...props(f, o)} /> },
      { id: 'rumput', el: (f, o) => <rect x="0" y="200" width="300" height="60" {...props(f, o)} /> },
      { id: 'dinding', el: (f, o) => <rect x="70" y="120" width="160" height="100" {...props(f, o)} /> },
      { id: 'atap', el: (f, o) => <polygon points="55,125 150,50 245,125" {...props(f, o)} /> },
      { id: 'pintu', el: (f, o) => <rect x="132" y="160" width="36" height="60" {...props(f, o)} /> },
      { id: 'jendela', el: (f, o) => <rect x="85" y="140" width="34" height="34" {...props(f, o)} /> },
      { id: 'matahari', el: (f, o) => <circle cx="250" cy="40" r="22" {...props(f, o)} /> },
    ],
  },
  bunga: {
    nama: 'Bunga', emoji: '🌸',
    bagian: [
      { id: 'langit', el: (f, o) => <rect x="0" y="0" width="300" height="260" {...props(f, o)} /> },
      { id: 'batang', el: (f, o) => <rect x="144" y="130" width="12" height="120" {...props(f, o)} /> },
      { id: 'daun1', el: (f, o) => <ellipse cx="115" cy="190" rx="30" ry="14" {...props(f, o)} /> },
      { id: 'daun2', el: (f, o) => <ellipse cx="185" cy="170" rx="30" ry="14" {...props(f, o)} /> },
      ...[0, 72, 144, 216, 288].map<Bagian>((a) => ({ id: `kelopak${a}`, el: (f, o) => <ellipse cx="150" cy="60" rx="22" ry="38" transform={`rotate(${a} 150 100)`} {...props(f, o)} /> })),
      { id: 'tengah', el: (f, o) => <circle cx="150" cy="100" r="22" {...props(f, o)} /> },
    ],
  },
  ikan: {
    nama: 'Ikan', emoji: '🐟',
    bagian: [
      { id: 'laut', el: (f, o) => <rect x="0" y="0" width="300" height="260" {...props(f, o)} /> },
      { id: 'ekor', el: (f, o) => <polygon points="205,130 270,80 270,180" {...props(f, o)} /> },
      { id: 'badan', el: (f, o) => <ellipse cx="140" cy="130" rx="80" ry="55" {...props(f, o)} /> },
      { id: 'sirip', el: (f, o) => <polygon points="120,80 150,40 175,85" {...props(f, o)} /> },
      { id: 'mata', el: (f, o) => <circle cx="95" cy="115" r="10" {...props(f, o)} /> },
      { id: 'pasir', el: (f, o) => <rect x="0" y="220" width="300" height="40" {...props(f, o)} /> },
    ],
  },
}

export default function Mewarnai() {
  const [gid, setGid] = useState('rumah')
  const [warna, setWarna] = useState('#FF6B6B')
  const [isi, setIsi] = useState<Record<string, string>>({})
  const g = GAMBAR[gid]
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {Object.entries(GAMBAR).map(([k, v]) => <button key={k} onClick={() => { setGid(k); setIsi({}) }} className={`flex-1 rounded-2xl border-4 py-2 text-lg font-extrabold ${gid === k ? 'border-accent bg-accent text-white' : 'border-ink/10 bg-white'}`}><Emo>{v.emoji}</Emo> {v.nama}</button>)}
      </div>
      <svg viewBox="0 0 300 260" className="w-full rounded-3xl border-4 border-ink/10 bg-white shadow-chunky touch-manipulation">
        {g.bagian.map((b) => <g key={gid + b.id}>{b.el(isi[b.id] ?? '#FFFFFF', () => setIsi((s) => ({ ...s, [b.id]: warna })))}</g>)}
      </svg>
      <p className="text-center font-bold text-ink/60">Pilih warna, lalu ketuk bagian gambar</p>
      <Palet warna={warna} onPilih={setWarna} />
      <button onClick={() => setIsi({})} className="btn btn-sun w-full">Hapus semua warna</button>
    </div>
  )
}
