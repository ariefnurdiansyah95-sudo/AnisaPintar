export type MapelId =
  | 'membaca'
  | 'matematika'
  | 'bindo'
  | 'pancasila'
  | 'ipas'
  | 'plbj'
  | 'inggris'
  | 'seni'

export type Level = 1 | 2 | 3

export type QType = 'pilihan' | 'benarsalah' | 'cocok' | 'isian' | 'susun' | 'gambar'

export interface Question {
  id: string
  mapel: MapelId
  topik: string
  /** sub-kelompok opsional (mis. id cerita) */
  grup?: string
  level: Level
  tipe: QType
  /** teks pertanyaan (dibacakan guru virtual) */
  teks: string
  /** visual: emoji, "shape:x", "clock:n", "blok:n", "susun:+:a:b", "bar:a,b" */
  gambar?: string
  /** teks bacaan untuk soal pemahaman */
  bacaan?: string
  /** pilihan jawaban (pilihan & gambar) */
  opsi?: string[]
  /** jawaban benar: teks opsi, 'benar'/'salah', atau jawaban isian */
  jawaban: string
  /** jawaban isian lain yang diterima */
  terima?: string[]
  /** urutan benar untuk soal susun */
  urutan?: string[]
    /** kepingan pengecoh (tidak dipakai) pada soal susun */
  pengecoh?: string[]
  /** kepingan susun adalah huruf/suku kata yang digabung jadi satu kata */
  gabung?: boolean
  /** pasangan benar untuk soal mencocokkan [kiri, kanan] */
  pasangan?: [string, string][]
  pembahasan: string
  /** audio yang diputar sebagai bagian soal */
  suara?: { teks: string; lang?: 'id-ID' | 'en-US' }
}

export interface Slide {
  judul?: string
  teks: string
  gambar?: string
  /** daftar kata berformat "ba-ju|👕" */
  kata?: string[]
  /** suku kata yang bisa diketuk */
  suku?: string[]
  /** teks yang dibaca dengan sorotan kata demi kata */
  baca?: string
  /** poin-poin */
  poin?: string[]
  /** contoh soal + jawaban */
  contoh?: { soal: string; jawab: string }
  lang?: 'id-ID' | 'en-US'
}

export interface Lesson {
  id: string
  mapel: MapelId
  judul: string
  emoji: string
  ringkas: string
  slides: Slide[]
  /** topik soal untuk latihan setelah materi */
  topik: string[]
  grup?: string
  jumlah?: number
}

export interface TopikInfo {
  id: string
  nama: string
  emoji: string
}

export interface Subject {
  id: MapelId
  nama: string
  emoji: string
  warna: string // kelas tailwind bg
  warnaTeks: string
  warnaGelap: string
  deskripsi: string
  topik: TopikInfo[]
}
