// Validasi otomatis bank soal: struktur, jawaban benar, pengecoh unik,
// dan hitung ulang soal hitungan secara independen.
// Jalankan: npm run validasi
import { ALL_QUESTIONS, BY_MAPEL } from '../lib/bank/index'
import { SUBJECTS } from '../lib/subjects'
import { norm } from '../lib/normalize'

const errors: string[] = []
const warn: string[] = []
const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`)

const ids = new Set<string>()
const MAPEL_OK = new Set(SUBJECTS.map((s) => s.id))
const TOPIK_OK = new Map(SUBJECTS.map((s) => [s.id, new Set(s.topik.map((t) => t.id))]))

for (const q of ALL_QUESTIONS) {
  if (ids.has(q.id)) err(q.id, 'id ganda')
  ids.add(q.id)
  if (!MAPEL_OK.has(q.mapel)) err(q.id, 'mapel tidak dikenal')
  if (!TOPIK_OK.get(q.mapel)?.has(q.topik)) err(q.id, `topik "${q.topik}" tidak terdaftar`)
  if (![1, 2, 3].includes(q.level)) err(q.id, 'level salah')
  if (!q.teks?.trim()) err(q.id, 'teks kosong')
  if (!q.pembahasan?.trim()) err(q.id, 'pembahasan kosong')
  if (q.pembahasan && q.pembahasan.length < 8) err(q.id, 'pembahasan terlalu pendek')

  switch (q.tipe) {
    case 'pilihan':
    case 'gambar': {
      const o = q.opsi ?? []
      if (o.length < 2 || o.length > 5) err(q.id, `jumlah opsi ${o.length}`)
      if (new Set(o.map((x) => (q.topik === 'huruf-kapital' ? x : x.toLowerCase()))).size !== o.length) err(q.id, `opsi ganda: ${o.join(' | ')}`)
      if (o.filter((x) => x === q.jawaban).length !== 1) err(q.id, `jawaban "${q.jawaban}" harus ada tepat 1x di opsi: ${o.join(' | ')}`)
      break
    }
    case 'benarsalah':
      if (!['benar', 'salah'].includes(q.jawaban)) err(q.id, 'jawaban benarsalah salah')
      break
    case 'isian':
      if (!q.jawaban?.trim()) err(q.id, 'jawaban isian kosong')
      break
    case 'susun': {
      const u = q.urutan ?? []
      if (u.length < 2) err(q.id, 'susun < 2 item')
      if (u.join(' ') !== q.jawaban) err(q.id, 'jawaban susun tidak cocok urutan')
      if (new Set(u).size === 1) err(q.id, 'semua item susun sama')
      if (q.pengecoh?.some((x) => u.includes(x))) err(q.id, 'pengecoh sama dengan keping jawaban')
      if (q.gabung && !q.urutan!.join('').match(/^[a-z]+$/)) err(q.id, 'susun gabung harus huruf kecil a-z')
      break
    }
    case 'cocok': {
      const p = q.pasangan ?? []
      if (p.length < 2) err(q.id, 'cocok < 2 pasangan')
      if (new Set(p.map((x) => x[0])).size !== p.length) err(q.id, 'sisi kiri ganda')
      if (new Set(p.map((x) => x[1])).size !== p.length) err(q.id, 'sisi kanan ganda')
      break
    }
  }

  // ---- hitung ulang soal hitungan ----
  const m = q.teks.match(/^(\d+) ([+−]) (\d+) = \?$/)
  if (m && q.mapel === 'matematika') {
    const a = +m[1]
    const c = +m[3]
    const want = m[2] === '+' ? a + c : a - c
    if (want < 0) err(q.id, 'hasil negatif')
    if (norm(q.jawaban) !== String(want)) err(q.id, `hitung ulang ${a} ${m[2]} ${c} = ${want}, jawaban ${q.jawaban}`)
  }
  const mp = q.teks.match(/^(\d+) \+ \? = (\d+)$/)
  if (mp && q.mapel === 'matematika') {
    if (+q.jawaban !== +mp[2] - +mp[1]) err(q.id, `pasangan salah: ${q.teks} -> ${q.jawaban}`)
  }
  if (q.gambar?.startsWith('susun:')) {
    const [, op, a, c] = q.gambar.split(':')
    const want = op === '+' ? +a + +c : +a - +c
    if (+q.jawaban !== want) err(q.id, `bersusun ${a} ${op} ${c} = ${want}, jawaban ${q.jawaban}`)
    if (want < 0 || want > 99) err(q.id, 'hasil bersusun di luar 0..99')
  }
  if (q.gambar?.startsWith('hitung:') && q.mapel === 'matematika' && /^\d+$/.test(q.jawaban)) {
    const n = +q.gambar.split(':')[2]
    if (+q.jawaban !== n) err(q.id, 'hitung gambar salah')
  }
  if (q.gambar?.startsWith('tambah:')) {
    const [, , a, c] = q.gambar.split(':')
    if (+q.jawaban !== +a + +c) err(q.id, 'tambah gambar salah')
  }
  if (q.gambar?.startsWith('kurang:')) {
    const [, , a, c] = q.gambar.split(':')
    if (+q.jawaban !== +a - +c) err(q.id, 'kurang gambar salah')
  }
  if (q.gambar?.startsWith('blok:') && q.tipe === 'pilihan' && /puluhan/.test(q.jawaban)) {
    const n = +q.gambar.split(':')[1]
    if (q.jawaban !== `${Math.floor(n / 10)} puluhan ${n % 10} satuan`) err(q.id, 'blok salah')
  }
}

// ---- ringkasan ----
console.log(`\nTotal soal: ${ALL_QUESTIONS.length}`)
for (const s of SUBJECTS) {
  const list = BY_MAPEL[s.id]
  const lv = [1, 2, 3].map((l) => list.filter((q) => q.level === l).length)
  console.log(`\n${s.emoji} ${s.nama}: ${list.length} soal (mudah ${lv[0]}, menengah ${lv[1]}, tantangan ${lv[2]})`)
  const tipe = new Map<string, number>()
  for (const q of list) tipe.set(q.tipe, (tipe.get(q.tipe) ?? 0) + 1)
  console.log('   tipe:', [...tipe].map(([k, v]) => `${k}=${v}`).join(' '))
  for (const t of s.topik) {
    const n = list.filter((q) => q.topik === t.id).length
    const per = [1, 2, 3].map((l) => list.filter((q) => q.topik === t.id && q.level === l).length)
    console.log(`   - ${t.nama}: ${n} (${per.join('/')})`)
    if (n < 8) warn.push(`${s.nama} / ${t.nama}: hanya ${n} soal`)
    if (n > 0 && per.some((x) => x === 0)) warn.push(`${s.nama} / ${t.nama}: ada level tanpa soal (${per.join('/')})`)
  }
}

if (warn.length) {
  console.log('\nPeringatan:')
  warn.forEach((w) => console.log('  ! ' + w))
}
if (errors.length) {
  console.log(`\n${errors.length} KESALAHAN:`)
  errors.slice(0, 80).forEach((e) => console.log('  x ' + e))
  process.exit(1)
}
console.log('\nSemua soal valid ✓')
