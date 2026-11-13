'use client'
import { useEffect, useRef, useState } from 'react'
import { Eraser, Trash2 } from 'lucide-react'
import Palet from './Palet'

export default function Gambar() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [warna, setWarna] = useState('#FF6B6B')
  const [tebal, setTebal] = useState(10)
  const [hapus, setHapus] = useState(false)
  const gambar = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const c = ref.current!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = c.clientWidth * dpr
    c.height = c.clientHeight * dpr
    const x = c.getContext('2d')!
    x.scale(dpr, dpr)
    x.fillStyle = '#fff'
    x.fillRect(0, 0, c.clientWidth, c.clientHeight)
  }, [])

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const garis = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const x = ref.current!.getContext('2d')!
    x.strokeStyle = hapus ? '#fff' : warna
    x.lineWidth = hapus ? tebal * 2.5 : tebal
    x.lineCap = 'round'
    x.lineJoin = 'round'
    x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke()
  }
  return (
    <div className="space-y-3">
      <canvas ref={ref} className="h-[360px] w-full touch-none rounded-3xl border-4 border-ink/10 bg-white shadow-chunky"
        onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); gambar.current = true; const p = pos(e); last.current = p; garis(p, p) }}
        onPointerMove={(e) => { if (!gambar.current || !last.current) return; const p = pos(e); garis(last.current, p); last.current = p }}
        onPointerUp={() => { gambar.current = false; last.current = null }}
        onPointerCancel={() => { gambar.current = false }} />
      <Palet warna={warna} onPilih={(c) => { setWarna(c); setHapus(false) }} />
      <div className="flex items-center gap-2">
        {[5, 10, 20].map((t) => <button key={t} onClick={() => setTebal(t)} className={`flex h-12 flex-1 items-center justify-center rounded-2xl border-4 ${tebal === t ? 'border-accent bg-accent/10' : 'border-ink/10 bg-white'}`}><span className="rounded-full bg-ink" style={{ width: t + 4, height: t + 4 }} /></button>)}
        <button onClick={() => setHapus((h) => !h)} className={`btn !min-h-[48px] px-4 ${hapus ? 'btn-accent' : 'btn-ghost'}`} aria-label="Penghapus"><Eraser /></button>
        <button onClick={() => { const c = ref.current!; const x = c.getContext('2d')!; x.fillStyle = '#fff'; x.fillRect(0, 0, c.clientWidth, c.clientHeight) }} className="btn btn-sun !min-h-[48px] px-4" aria-label="Bersihkan"><Trash2 /></button>
      </div>
    </div>
  )
}
