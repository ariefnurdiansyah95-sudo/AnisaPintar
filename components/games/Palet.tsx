'use client'
export const WARNA = ['#FF6B6B', '#FF9F43', '#FDCB6E', '#2ED573', '#54A0FF', '#A29BFE', '#FF78B5', '#8D6E63', '#3B2F63', '#FFFFFF']
export default function Palet({ warna, onPilih }: { warna: string; onPilih: (c: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {WARNA.map((c) => (
        <button key={c} aria-label={`Warna ${c}`} onClick={() => onPilih(c)} style={{ background: c }} className={`h-11 w-11 rounded-full border-4 shadow-chunky active:translate-y-1 ${warna === c ? 'scale-110 border-ink' : 'border-white'}`} />
      ))}
    </div>
  )
}
