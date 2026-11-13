'use client'
import { useRef, useState } from 'react'
import { Camera, Mic, Play, Square, Trash2 } from 'lucide-react'
import { useProgress } from '@/context/ProgressContext'
import { PESAN_IBU_DEFAULT } from '@/lib/progress'
import { speak } from '@/lib/speech'

function kecilkan(file: File, maks = 320): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const k = Math.min(1, maks / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = img.width * k; c.height = img.height * k
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = rej
    img.src = url
  })
}

export default function PesanIbuSetup() {
  const { state, update } = useProgress()
  const m = { ...PESAN_IBU_DEFAULT, ...(state.pesanIbu ?? {}) }
  const set = (p: Partial<typeof m>) => update((s) => ({ ...s, pesanIbu: { ...PESAN_IBU_DEFAULT, ...(s.pesanIbu ?? {}), ...p } }))
  const [rekam, setRekam] = useState(false)
  const [info, setInfo] = useState('')
  const mr = useRef<MediaRecorder | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function mulaiRekam() {
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(st)
      const chunks: Blob[] = []
      rec.ondataavailable = (e) => chunks.push(e.data)
      rec.onstop = () => {
        st.getTracks().forEach((t) => t.stop())
        const fr = new FileReader()
        fr.onload = () => set({ suara: String(fr.result) })
        fr.readAsDataURL(new Blob(chunks, { type: rec.mimeType }))
      }
      rec.start()
      mr.current = rec
      setRekam(true)
      setInfo('Merekam… maksimal 15 detik')
      setTimeout(() => { if (rec.state === 'recording') berhenti() }, 15000)
    } catch { setInfo('Mikrofon tidak bisa dipakai. Pesan akan dibacakan oleh suara bawaan.') }
  }
  function berhenti() { mr.current?.stop(); setRekam(false); setInfo('Rekaman tersimpan ✅') }

  return (
    <section className="card space-y-3">
      <h2 className="text-xl font-extrabold">💌 Pesan dari Ibu</h2>
      <p className="text-sm font-semibold text-ink/60">Setiap kali anak salah menjawab, atau nilainya masih rendah, muncul foto dan pesan penyemangat dari Ibu. Pakailah kata-kata yang hangat dan menyemangati, supaya belajar terasa aman dan menyenangkan.</p>
      <button onClick={() => set({ aktif: !m.aktif })} role="switch" aria-checked={m.aktif} className="flex w-full items-center justify-between rounded-2xl bg-cream px-3 py-2 font-bold">
        Tampilkan pesan Ibu
        <span className={`flex h-8 w-14 items-center rounded-full p-1 ${m.aktif ? 'bg-good' : 'bg-ink/20'}`}><span className={`h-6 w-6 rounded-full bg-white transition ${m.aktif ? 'translate-x-6' : ''}`} /></span>
      </button>
      <div className="flex items-center gap-3">
        {m.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.foto} alt="Foto Ibu" className="h-20 w-20 rounded-full border-4 border-bubble object-cover" />
        ) : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bubble/20 text-4xl">👩</div>}
        <div className="flex flex-1 flex-col gap-2">
          <button onClick={() => fileRef.current?.click()} className="btn btn-sky !min-h-[44px] text-base"><Camera size={18} /> {m.foto ? 'Ganti foto' : 'Pilih foto'}</button>
          {m.foto && <button onClick={() => set({ foto: '' })} className="text-sm font-bold text-bad">Hapus foto</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) set({ foto: await kecilkan(f) }) }} />
      </div>
      <label className="block font-bold">Isi pesan
        <textarea value={m.teks} maxLength={160} rows={3} onChange={(e) => set({ teks: e.target.value })} className="mt-1 w-full rounded-2xl border-4 border-ink/10 bg-white px-3 py-2 text-base outline-none focus:border-accent" />
      </label>
      <div className="flex flex-wrap gap-2">
        {!rekam ? <button onClick={mulaiRekam} className="btn btn-sun !min-h-[44px] flex-1 text-base"><Mic size={18} /> Rekam suara Ibu</button>
          : <button onClick={berhenti} className="btn !min-h-[44px] flex-1 bg-bad text-base"><Square size={18} /> Berhenti</button>}
        <button onClick={() => { if (m.suara) new Audio(m.suara).play(); else speak(m.teks) }} className="btn btn-good !min-h-[44px] text-base"><Play size={18} /> Coba</button>
        {m.suara && <button onClick={() => set({ suara: '' })} className="btn btn-ghost !min-h-[44px] px-3" aria-label="Hapus rekaman"><Trash2 size={18} /></button>}
      </div>
      {info && <p className="text-sm font-bold text-ink/60">{info}</p>}
      <p className="text-xs font-semibold text-ink/40">Foto dan suara hanya disimpan di perangkat ini.</p>
    </section>
  )
}
