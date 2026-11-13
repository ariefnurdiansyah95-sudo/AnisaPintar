import type { Level, Question } from '../types'
import { makeRng } from '../rng'
import { benarSalah, numSalah, pilihan, susun } from './helpers'
import { manual, type PQ } from './manual'

const M = 'seni' as const
const b = (id: string, topik: string, level: Level) => ({ id, mapel: M, topik, level })

const POOLS: string[][] = [
  ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
  ['🍎', '🍌', '🍇', '🍓', '🍊'],
  ['🐱', '🐶', '🐰', '🐸', '🐥'],
  ['⭐', '🌙', '☀️', '❤️', '🌸'],
  ['🚗', '🚲', '🚌', '⚽', '🎈'],
]

const KELOMPOK: Record<string, string[]> = {
  buah: ['🍎', '🍌', '🍇', '🍓', '🍊'],
  hewan: ['🐱', '🐶', '🐰', '🐸', '🐥'],
  kendaraan: ['🚗', '🚲', '🚌', '🚂', '✈️'],
  pakaian: ['👕', '👖', '👗', '🧢', '👟'],
}

function build(): Question[] {
  const out: Question[] = []
  const r = makeRng('seni')

  // ================= POLA =================
  const polaSpec: [string, number[], Level, number][] = [
    ['AB', [0, 1], 1, 24],
    ['AAB', [0, 0, 1], 2, 12],
    ['ABB', [0, 1, 1], 2, 12],
    ['ABC', [0, 1, 2], 2, 14],
    ['ABCD', [0, 1, 2, 3], 3, 12],
  ]
  for (const [nm, cyc, lv, count] of polaSpec) {
    const seen = new Set<string>()
    let t = 0
    while (seen.size < count && t++ < 200) {
      const pool = r.pick(POOLS)
      const sym = r.shuffle(pool).slice(0, Math.max(...cyc) + 1)
      const key = sym.join('')
      if (seen.has(key)) continue
      seen.add(key)
      const len = cyc.length * 2 + (nm === 'AB' ? 1 : 1)
      const seq = Array.from({ length: len }, (_, i) => sym[cyc[i % cyc.length]])
      const next = sym[cyc[len % cyc.length]]
      const lain = pool.filter((x) => !sym.includes(x))
      const wrong = [...sym.filter((x) => x !== next), ...lain].slice(0, 2)
      out.push(
        pilihan(
          b(`sn-pola-${nm}-${key}`, 'pola', lv),
          'Lihat polanya. Gambar apa yang harus ada selanjutnya?',
          next,
          wrong,
          `Polanya berulang: ${cyc.map((c) => sym[c]).join(' ')}. Setelah ${seq[seq.length - 1]} datanglah ${next}.`,
          { gambar: seq.join(' ') + ' ❓', tipe: 'gambar' },
        ),
      )
    }
  }
  const angkaPola: [number, number, Level][] = [
    [2, 2, 2], [1, 2, 2], [5, 5, 2], [10, 10, 2], [3, 3, 3], [4, 4, 3], [2, 3, 3], [1, 1, 1], [0, 2, 2], [20, -2, 3], [10, -1, 2], [30, -5, 3], [50, -10, 3],
  ]
  for (const [start, step, lv] of angkaPola) {
    const seq = [0, 1, 2, 3].map((i) => start + step * i)
    const ans = start + step * 4
    if (ans < 0) continue
    out.push(
      pilihan(
        b(`sn-pola-angka-${start}-${step}`, 'pola', lv),
        `Lanjutkan pola bilangan: ${seq.join(', ')}, ___`,
        String(ans),
        numSalah(ans, `pa${start}${step}`, { min: 0, max: 100, step: [1, 2, Math.abs(step)] }),
        `Polanya ${step > 0 ? 'bertambah' : 'berkurang'} ${Math.abs(step)} setiap kali. ${seq[3]} ${step > 0 ? '+' : '−'} ${Math.abs(step)} = ${ans}.`,
      ),
    )
  }

  // ================= WARNA =================
  const warna: PQ[] = [
    { t: 'Warna pisang yang sudah matang adalah…', a: 'kuning', s: ['biru', 'ungu'], p: 'Pisang matang berwarna kuning.', g: '🍌' },
    { t: 'Warna daun yang segar adalah…', a: 'hijau', s: ['merah muda', 'hitam'], p: 'Daun yang segar berwarna hijau.', g: '🍃' },
    { t: 'Warna salju adalah…', a: 'putih', s: ['hijau', 'cokelat'], p: 'Salju berwarna putih.', g: '❄️' },
    { t: 'Warna langit saat cerah adalah…', a: 'biru', s: ['cokelat', 'merah muda'], p: 'Langit cerah berwarna biru.', g: '🌤️' },
    { t: 'Warna wortel adalah…', a: 'oranye', s: ['biru', 'ungu'], p: 'Wortel berwarna oranye.', g: '🥕' },
    { t: 'Warna terong ungu adalah…', a: 'ungu', s: ['kuning', 'oranye'], p: 'Terong berwarna ungu.', g: '🍆' },
    { t: 'Warna cokelat batangan adalah…', a: 'cokelat', s: ['hijau', 'biru'], p: 'Cokelat berwarna cokelat.', g: '🍫' },
    { t: 'Warna matahari dalam gambar anak biasanya…', a: 'kuning', s: ['hijau', 'ungu'], p: 'Matahari biasanya digambar kuning.', g: '☀️' },
    { t: 'Biru dicampur kuning menjadi warna…', a: 'hijau', s: ['merah', 'ungu'], p: 'Biru + kuning = hijau.', l: 2, g: '🔵+🟡' },
    { t: 'Merah dicampur kuning menjadi warna…', a: 'oranye', s: ['hijau', 'biru'], p: 'Merah + kuning = oranye.', l: 2, g: '🔴+🟡' },
    { t: 'Merah dicampur biru menjadi warna…', a: 'ungu', s: ['hijau', 'kuning'], p: 'Merah + biru = ungu.', l: 2, g: '🔴+🔵' },
    { t: 'Tiga warna dasar (warna primer) adalah…', a: 'merah, kuning, biru', s: ['hijau, ungu, oranye', 'hitam, putih, abu-abu'], p: 'Warna primer adalah merah, kuning, dan biru.', l: 3 },
    { t: 'Pelangi memiliki berapa warna?', a: '7', s: ['3', '5', '10'], p: 'Pelangi punya 7 warna: merah, jingga, kuning, hijau, biru, nila, ungu.', l: 3, g: '🌈' },
    { t: 'Warna paling atas pada pelangi adalah…', a: 'merah', s: ['ungu', 'hijau'], p: 'Warna paling atas pelangi adalah merah.', l: 3, g: '🌈' },
  ]
  out.push(...manual(M, 'sn', 'warna', warna))

  // ================= LOGIKA =================
  const names = Object.keys(KELOMPOK)
  const seenOdd = new Set<string>()
  let tt = 0
  while (seenOdd.size < 30 && tt++ < 500) {
    const [g1, g2] = r.shuffle(names).slice(0, 2)
    const three = r.shuffle(KELOMPOK[g1]).slice(0, 3)
    const odd = r.pick(KELOMPOK[g2])
    const key = three.join('') + odd
    if (seenOdd.has(key)) continue
    seenOdd.add(key)
    out.push(
      pilihan(
        b(`sn-logika-beda-${seenOdd.size}`, 'logika', seenOdd.size % 3 === 0 ? 2 : 1),
        'Tiga gambar sejenis, satu gambar berbeda. Mana yang berbeda?',
        odd,
        three,
        `Tiga gambar adalah ${g1}, sedangkan ${odd} termasuk ${g2}. Jadi ${odd} yang berbeda.`,
        { tipe: 'gambar' },
      ),
    )
  }
  const urut: PQ[] = [
    { t: 'Pagi, siang, sore, …', a: 'malam', s: ['pagi', 'kemarin'], p: 'Urutan waktu dalam sehari: pagi, siang, sore, malam.' },
    { t: 'Senin, Selasa, Rabu, …', a: 'Kamis', s: ['Jumat', 'Minggu'], p: 'Setelah Rabu adalah Kamis.' },
    { t: 'Kecil, sedang, …', a: 'besar', s: ['kecil', 'sedikit'], p: 'Urutan ukuran: kecil, sedang, besar.' },
    { t: 'Biji, tunas, …', a: 'pohon', s: ['batu', 'sepatu'], p: 'Biji tumbuh menjadi tunas, lalu menjadi pohon.', l: 2, g: '🌰🌱' },
    { t: 'Telur, anak ayam, …', a: 'ayam dewasa', s: ['telur lagi', 'kucing'], p: 'Telur menetas jadi anak ayam, lalu tumbuh menjadi ayam dewasa.', l: 2, g: '🥚🐣' },
    { t: 'Hari ini hari Rabu. Besok hari…', a: 'Kamis', s: ['Selasa', 'Senin'], p: 'Setelah Rabu adalah Kamis.', l: 2 },
    { t: 'Kemarin hari Selasa. Hari ini hari…', a: 'Rabu', s: ['Senin', 'Kamis'], p: 'Setelah Selasa adalah Rabu.', l: 2 },
    { t: 'Setelah hari Sabtu adalah hari…', a: 'Minggu', s: ['Jumat', 'Senin'], p: 'Setelah Sabtu adalah Minggu.', l: 2 },
    { t: 'Sebelum hari Senin adalah hari…', a: 'Minggu', s: ['Selasa', 'Sabtu'], p: 'Sebelum Senin adalah Minggu.', l: 3 },
    { t: 'Satu minggu ada berapa hari?', a: '7', s: ['5', '6', '10'], p: 'Seminggu ada 7 hari: Senin sampai Minggu.', l: 2 },
  ]
  out.push(...manual(M, 'sn', 'logika', urut))
  const NAMA = ['Ani', 'Budi', 'Citra', 'Dedi', 'Eka', 'Fajar']
  const seenT = new Set<string>()
  tt = 0
  while (seenT.size < 12 && tt++ < 100) {
    const [a, c, d] = r.shuffle(NAMA).slice(0, 3)
    const key = `${a}${c}${d}`
    if (seenT.has(key)) continue
    seenT.add(key)
    const tinggi = seenT.size % 2 === 0
    out.push(
      pilihan(
        b(`sn-logika-tinggi-${seenT.size}`, 'logika', 3),
        `${a} lebih tinggi daripada ${c}. ${c} lebih tinggi daripada ${d}. Siapa yang paling ${tinggi ? 'tinggi' : 'pendek'}?`,
        tinggi ? a : d,
        [c, tinggi ? d : a],
        `Urutan dari tertinggi: ${a}, ${c}, ${d}. Jadi yang paling ${tinggi ? 'tinggi' : 'pendek'} adalah ${tinggi ? a : d}.`,
      ),
    )
  }
  out.push(
    susun(b('sn-logika-pagi', 'logika', 2), 'Urutkan kegiatan pagi hari dari yang pertama.', ['bangun tidur', 'mandi', 'sarapan', 'berangkat sekolah'], 'Urutannya: bangun tidur, mandi, sarapan, lalu berangkat sekolah.', { gambar: '🌅' }),
    susun(b('sn-logika-tanam', 'logika', 3), 'Urutkan cara menanam biji.', ['siapkan tanah', 'tanam biji', 'siram air', 'tunas tumbuh'], 'Siapkan tanah, tanam biji, siram dengan air, lalu tunas tumbuh.', { gambar: '🌱' }),
    susun(b('sn-logika-cuci', 'logika', 3), 'Urutkan cara mencuci tangan.', ['basahi tangan', 'beri sabun', 'gosok tangan', 'bilas dengan air', 'keringkan tangan'], 'Basahi, beri sabun, gosok, bilas, lalu keringkan.', { gambar: '🧼' }),
    benarSalah(b('sn-logika-bs-1', 'logika', 1), 'Benar atau salah? Pola 🔴🔵🔴🔵 dilanjutkan dengan 🔴.', true, 'Benar. Polanya merah, biru, merah, biru, lalu merah lagi.', {}),
    benarSalah(b('sn-logika-bs-2', 'logika', 2), 'Benar atau salah? Pola 2, 4, 6, 8 dilanjutkan dengan 9.', false, 'Salah. Pola bertambah 2, jadi setelah 8 adalah 10.'),
  )
  return out
}

export const BANK_SENI: Question[] = build()
