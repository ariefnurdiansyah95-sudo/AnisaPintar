import type { Lesson } from '../types'
import { BACAAN_BINDO } from '../bank/teks'

const M = 'bindo' as const

export const LESSONS_BINDO: Lesson[] = [
  {
    id: 'memahami-bacaan',
    mapel: M,
    judul: 'Memahami Bacaan',
    emoji: '🧐',
    ringkas: 'Membaca lalu menjawab pertanyaan',
    topik: ['pemahaman'],
    slides: [
      { judul: 'Baca dengan teliti', teks: 'Membaca bukan hanya melafalkan kata, tapi juga mengerti isinya. Mari baca teks ini.', baca: BACAAN_BINDO[0].teks, gambar: BACAAN_BINDO[0].emoji },
      { judul: 'Satu bacaan lagi', teks: 'Perhatikan siapa, apa, di mana, dan kapan.', baca: BACAAN_BINDO[1].teks, gambar: BACAAN_BINDO[1].emoji },
      { judul: 'Cara menjawab', teks: 'Jawaban pertanyaan selalu ada di dalam bacaan. Baca lagi bagian yang berhubungan, lalu pilih jawaban yang paling tepat.', gambar: '🔎' },
    ],
  },
  {
    id: 'tanda-baca',
    mapel: M,
    judul: 'Tanda Baca',
    emoji: '❗',
    ringkas: 'Titik, koma, tanda tanya, tanda seru',
    topik: ['tanda-baca'],
    slides: [
      { judul: 'Tanda baca di akhir kalimat', teks: 'Setiap kalimat diakhiri tanda baca. Ada titik, tanda tanya, dan tanda seru.', poin: ['. titik untuk kalimat berita', '? tanda tanya untuk pertanyaan', '! tanda seru untuk rasa kaget atau kagum', ', koma untuk jeda di tengah kalimat'] },
      { judul: 'Titik', teks: 'Titik dipakai di akhir kalimat berita. Contoh: Ibu pergi ke pasar.', baca: 'Ibu pergi ke pasar.' },
      { judul: 'Tanda tanya', teks: 'Tanda tanya dipakai di akhir kalimat tanya. Contoh: Siapa namamu?', baca: 'Siapa namamu?' },
      { judul: 'Tanda seru', teks: 'Tanda seru dipakai untuk menyatakan kagum, kaget, atau sakit. Contoh: Wah, bagus sekali!', baca: 'Wah, bagus sekali!' },
    ],
  },
  {
    id: 'jenis-kalimat',
    mapel: M,
    judul: 'Jenis Kalimat',
    emoji: '🗣️',
    ringkas: 'Berita, tanya, perintah, seru',
    topik: ['jenis-kalimat'],
    slides: [
      { judul: 'Ada empat jenis kalimat', teks: 'Ada kalimat berita, kalimat tanya, kalimat perintah, dan kalimat seru.', poin: ['Kalimat berita memberi tahu', 'Kalimat tanya menanyakan', 'Kalimat perintah menyuruh', 'Kalimat seru menyatakan perasaan'] },
      { judul: 'Kalimat berita dan tanya', teks: 'Adik sedang tidur, itu kalimat berita. Siapa namamu, itu kalimat tanya.', baca: 'Adik sedang tidur. Siapa namamu?' },
      { judul: 'Kalimat perintah', teks: 'Kalimat perintah meminta orang melakukan sesuatu. Biasanya memakai kata tolong atau akhiran lah.', baca: 'Tolong tutup pintu itu. Cucilah tanganmu.' },
      { judul: 'Kalimat seru', teks: 'Kalimat seru menyatakan perasaan seperti kagum atau kaget.', baca: 'Hore, kita menang!' },
    ],
  },
  {
    id: 'huruf-kapital',
    mapel: M,
    judul: 'Huruf Kapital',
    emoji: '🔠',
    ringkas: 'Kapan memakai huruf besar',
    topik: ['huruf-kapital'],
    slides: [
      { judul: 'Huruf kapital', teks: 'Huruf kapital adalah huruf besar. Kita memakainya di awal kalimat.', baca: 'Aku bermain bola.' },
      { judul: 'Nama orang', teks: 'Nama orang diawali huruf kapital. Contoh: Budi, Dina, Pak Ahmad.', poin: ['Budi', 'Dina', 'Pak Ahmad'] },
      { judul: 'Nama tempat, hari, dan bulan', teks: 'Nama kota, hari, dan bulan juga diawali huruf kapital.', poin: ['Jakarta, Bogor, Bandung', 'Senin, Selasa, Rabu', 'Januari, Mei, Agustus'] },
    ],
  },
  {
    id: 'menyusun-kalimat',
    mapel: M,
    judul: 'Menyusun Kalimat',
    emoji: '🧵',
    ringkas: 'Mengurutkan kata jadi kalimat',
    topik: ['susun-kalimat'],
    slides: [
      { judul: 'Kata-kata yang tertukar', teks: 'Kalimat dibuat dari kata-kata yang urutannya benar. Siapa melakukan apa. Contoh: Ibu memasak nasi.', baca: 'Ibu memasak nasi.' },
      { judul: 'Cara menyusun', teks: 'Mulai dari siapa atau apa pelakunya, lalu apa yang dikerjakan, lalu bendanya. Awali dengan huruf kapital dan akhiri dengan titik.', poin: ['Siapa? Ibu', 'Melakukan apa? memasak', 'Apa? nasi'] },
    ],
  },
  {
    id: 'kosakata',
    mapel: M,
    judul: 'Kosakata',
    emoji: '📕',
    ringkas: 'Lawan kata dan nama benda',
    topik: ['kosakata'],
    slides: [
      { judul: 'Lawan kata', teks: 'Lawan kata artinya kata yang maknanya berlawanan. Besar lawannya kecil. Panjang lawannya pendek.', poin: ['besar ↔ kecil', 'panjang ↔ pendek', 'tinggi ↔ rendah', 'panas ↔ dingin', 'siang ↔ malam'] },
      { judul: 'Lawan kata lagi', teks: 'Ayo kenali lebih banyak.', poin: ['naik ↔ turun', 'buka ↔ tutup', 'senang ↔ sedih', 'bersih ↔ kotor', 'cepat ↔ lambat'] },
      { judul: 'Nama benda dan kegunaannya', teks: 'Setiap benda punya kegunaan. Pensil untuk menulis, sendok untuk makan, payung agar tidak kehujanan.', poin: ['pensil → menulis', 'sendok → makan', 'sisir → menyisir rambut', 'payung → melindungi dari hujan'] },
    ],
  },
]
