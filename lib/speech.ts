// Suara guru virtual memakai Web Speech API (tanpa file audio).
let enabled = true
let sfxOn = true
export const setSuara = (v: boolean) => { enabled = v; if (!v) stop() }
export const setEfek = (v: boolean) => { sfxOn = v }

export function bisaBicara() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Ubah teks agar enak dibacakan (simbol → kata, buang emoji). */
export function kePengucapan(t: string): string {
  return t
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, ' ')
    .replace(/\s\+\s|\+/g, ' tambah ')
    .replace(/\s[−-]\s|−/g, ' kurang ')
    .replace(/=/g, ' sama dengan ')
    .replace(/>/g, ' lebih besar dari ')
    .replace(/</g, ' lebih kecil dari ')
    .replace(/↔/g, ' lawannya ')
    .replace(/→/g, ' ')
    .replace(/\?/g, '? ')
    .replace(/\.{2,}/g, ' titik titik ')
    .replace(/\s+/g, ' ')
    .trim()
}

let voices: SpeechSynthesisVoice[] = []
function loadVoices() { if (bisaBicara()) voices = window.speechSynthesis.getVoices() }
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}
function pickVoice(lang: string) {
  const pre = lang.slice(0, 2)
  return voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.toLowerCase().startsWith(pre))
}

export function stop() { if (bisaBicara()) window.speechSynthesis.cancel() }

export function speak(text: string, lang: 'id-ID' | 'en-US' = 'id-ID', rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (!enabled || !bisaBicara() || !text.trim()) return resolve()
    const u = new SpeechSynthesisUtterance(lang === 'id-ID' ? kePengucapan(text) : text)
    u.lang = lang
    u.rate = lang === 'en-US' ? 0.8 : rate
    u.pitch = 1.15
    const v = pickVoice(lang)
    if (v) u.voice = v
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

/** Ucapkan satu per satu. Memutus ucapan sebelumnya. */
export async function speakSeq(parts: { t: string; lang?: 'id-ID' | 'en-US' }[]) {
  stop()
  for (const p of parts) await speak(p.t, p.lang ?? 'id-ID')
}

/** Eja suku kata: "ba" "ju" lalu "baju". */
export async function eja(suku: string[], lang: 'id-ID' | 'en-US' = 'id-ID') {
  stop()
  for (const s of suku) await speak(s, lang, 0.6)
  await speak(suku.join(''), lang, 0.8)
}

// ===== Efek suara (WebAudio) =====
let ctx: AudioContext | null = null
function beep(freq: number, dur: number, t0: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(vol, ctx.currentTime + t0)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + t0)
  o.stop(ctx.currentTime + t0 + dur + 0.02)
}
export function sfx(kind: 'benar' | 'salah' | 'klik' | 'menang' | 'bintang') {
  if (!sfxOn || typeof window === 'undefined') return
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    if (ctx.state === 'suspended') ctx.resume()
    if (kind === 'benar') { beep(660, 0.12, 0); beep(880, 0.18, 0.1) }
    else if (kind === 'salah') { beep(220, 0.25, 0, 'triangle', 0.18); beep(180, 0.3, 0.15, 'triangle', 0.18) }
    else if (kind === 'klik') beep(500, 0.05, 0, 'square', 0.06)
    else if (kind === 'bintang') beep(988, 0.15, 0, 'sine', 0.15)
    else { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.2, i * 0.12)) }
  } catch {}
}
