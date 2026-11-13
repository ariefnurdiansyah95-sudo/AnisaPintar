import type { MapelId, Subject } from './types'

export const SUBJECTS: Subject[] = [
  {
    id: 'membaca',
    nama: 'Membaca & Mengeja',
    emoji: '📖',
    warna: 'bg-[#FF7675]',
    warnaTeks: 'text-[#D63031]',
    warnaGelap: 'border-[#D63031]',
    deskripsi: 'Suku kata, kata, kalimat, paragraf, dan cerita',
    topik: [
      { id: 'suku-kata', nama: 'Suku Kata', emoji: '🔤' },
      { id: 'gabung', nama: 'Menggabung Suku Kata', emoji: '🧩' },
      { id: 'tiga-suku', nama: 'Kata 3–4 Suku Kata', emoji: '🪜' },
      { id: 'konsonan', nama: 'Kata Berakhiran Konsonan', emoji: '🔚' },
      { id: 'gabungan-huruf', nama: 'Gabungan Huruf (ng, ny)', emoji: '🔗' },
      { id: 'kalimat', nama: 'Kalimat Pendek', emoji: '💬' },
      { id: 'paragraf', nama: 'Paragraf Pendek', emoji: '📄' },
      { id: 'cerita', nama: 'Cerita', emoji: '📚' },
    ],
  },
  {
    id: 'matematika',
    nama: 'Matematika',
    emoji: '🔢',
    warna: 'bg-[#54A0FF]',
    warnaTeks: 'text-[#2E86DE]',
    warnaGelap: 'border-[#2E86DE]',
    deskripsi: 'Angka, tambah, kurang, bangun, ukuran, dan jam',
    topik: [
      { id: 'angka', nama: 'Mengenal Angka', emoji: '🔟' },
      { id: 'tambah', nama: 'Penjumlahan', emoji: '➕' },
      { id: 'kurang', nama: 'Pengurangan', emoji: '➖' },
      { id: 'bersusun', nama: 'Operasi Bersusun', emoji: '🧮' },
      { id: 'pasangan', nama: 'Pasangan Bilangan', emoji: '🤝' },
      { id: 'puluhan', nama: 'Puluhan & Satuan', emoji: '🧱' },
      { id: 'bangun', nama: 'Bangun Datar', emoji: '🔷' },
      { id: 'ukur', nama: 'Pengukuran', emoji: '📏' },
      { id: 'jam', nama: 'Jam', emoji: '🕒' },
      { id: 'cerita', nama: 'Soal Cerita', emoji: '📝' },
    ],
  },
  {
    id: 'bindo',
    nama: 'Bahasa Indonesia',
    emoji: '✏️',
    warna: 'bg-[#FDCB6E]',
    warnaTeks: 'text-[#B7791F]',
    warnaGelap: 'border-[#B7791F]',
    deskripsi: 'Memahami bacaan, tanda baca, dan menyusun kalimat',
    topik: [
      { id: 'pemahaman', nama: 'Memahami Bacaan', emoji: '🧐' },
      { id: 'tanda-baca', nama: 'Tanda Baca', emoji: '❗' },
      { id: 'jenis-kalimat', nama: 'Jenis Kalimat', emoji: '🗣️' },
      { id: 'huruf-kapital', nama: 'Huruf Kapital', emoji: '🔠' },
      { id: 'susun-kalimat', nama: 'Menyusun Kalimat', emoji: '🧵' },
      { id: 'kosakata', nama: 'Kosakata', emoji: '📕' },
    ],
  },
  {
    id: 'pancasila',
    nama: 'Pendidikan Pancasila',
    emoji: '🦅',
    warna: 'bg-[#E17055]',
    warnaTeks: 'text-[#C0392B]',
    warnaGelap: 'border-[#C0392B]',
    deskripsi: 'Pancasila, aturan, hak & kewajiban, dan karakter baik',
    topik: [
      { id: 'sila', nama: 'Sila-sila Pancasila', emoji: '5️⃣' },
      { id: 'lambang', nama: 'Lambang Pancasila', emoji: '⭐' },
      { id: 'aturan', nama: 'Aturan Rumah & Sekolah', emoji: '🏫' },
      { id: 'hak-kewajiban', nama: 'Hak & Kewajiban', emoji: '⚖️' },
      { id: 'rukun', nama: 'Hidup Rukun', emoji: '🤗' },
      { id: 'karakter', nama: 'Karakter Baik', emoji: '💖' },
    ],
  },
  {
    id: 'ipas',
    nama: 'IPAS',
    emoji: '🌱',
    warna: 'bg-[#00B894]',
    warnaTeks: 'text-[#00805F]',
    warnaGelap: 'border-[#00805F]',
    deskripsi: 'Tubuh, pancaindra, hewan, tumbuhan, dan alam',
    topik: [
      { id: 'tubuh', nama: 'Tubuh Manusia', emoji: '🧍' },
      { id: 'indra', nama: 'Pancaindra', emoji: '👀' },
      { id: 'hewan', nama: 'Hewan', emoji: '🐾' },
      { id: 'tumbuhan', nama: 'Tumbuhan', emoji: '🌿' },
      { id: 'lingkungan', nama: 'Lingkungan', emoji: '♻️' },
      { id: 'cuaca', nama: 'Cuaca', emoji: '⛅' },
      { id: 'alam', nama: 'Alam Sekitar', emoji: '🌍' },
    ],
  },
  {
    id: 'plbj',
    nama: 'PLBJ Betawi',
    emoji: '🎭',
    warna: 'bg-[#E84393]',
    warnaTeks: 'text-[#B0246F]',
    warnaGelap: 'border-[#B0246F]',
    deskripsi: 'Budaya Betawi, ornamen, permainan, makanan, dan kesenian',
    topik: [
      { id: 'budaya', nama: 'Budaya Betawi', emoji: '🏙️' },
      { id: 'ornamen', nama: 'Ornamen Betawi', emoji: '🔺' },
      { id: 'permainan', nama: 'Permainan Tradisional', emoji: '🪀' },
      { id: 'makanan', nama: 'Makanan Khas', emoji: '🍳' },
      { id: 'kesenian', nama: 'Kesenian Daerah', emoji: '🥁' },
    ],
  },
  {
    id: 'inggris',
    nama: 'Bahasa Inggris',
    emoji: '🔤',
    warna: 'bg-[#6C5CE7]',
    warnaTeks: 'text-[#4B3FC4]',
    warnaGelap: 'border-[#4B3FC4]',
    deskripsi: 'Alphabet, numbers, colors, animals, fruits, family, greetings',
    topik: [
      { id: 'alphabet', nama: 'Alphabet', emoji: '🅰️' },
      { id: 'numbers', nama: 'Numbers', emoji: '🔢' },
      { id: 'colors', nama: 'Colors', emoji: '🎨' },
      { id: 'animals', nama: 'Animals', emoji: '🦁' },
      { id: 'fruits', nama: 'Fruits', emoji: '🍉' },
      { id: 'family', nama: 'Family', emoji: '👨‍👩‍👧' },
      { id: 'greetings', nama: 'Greetings', emoji: '👋' },
    ],
  },
  {
    id: 'seni',
    nama: 'Seni & Kreativitas',
    emoji: '🎨',
    warna: 'bg-[#A29BFE]',
    warnaTeks: 'text-[#5F4FD1]',
    warnaGelap: 'border-[#5F4FD1]',
    deskripsi: 'Pola, warna, logika, menggambar, mewarnai, dan puzzle',
    topik: [
      { id: 'pola', nama: 'Pola', emoji: '🔁' },
      { id: 'warna', nama: 'Warna', emoji: '🌈' },
      { id: 'logika', nama: 'Logika', emoji: '🧠' },
    ],
  },
]

export const SUBJECT_MAP: Record<MapelId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<MapelId, Subject>

export const LEVEL_NAMA: Record<number, string> = { 1: 'Mudah', 2: 'Menengah', 3: 'Tantangan' }
export const LEVEL_EMOJI: Record<number, string> = { 1: '🌱', 2: '🌿', 3: '🌳' }

export function topikNama(mapel: MapelId, topik: string): string {
  return SUBJECT_MAP[mapel].topik.find((t) => t.id === topik)?.nama ?? topik
}

/** Warna latar mapel/permainan sebagai hex (dipakai lewat style inline agar tidak bergantung pada pemindaian Tailwind). */
export const hexOf = (cls: string): string => cls.match(/#[0-9A-Fa-f]{6}/)?.[0] ?? '#6C5CE7'
