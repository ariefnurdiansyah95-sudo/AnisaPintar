import type { Lesson } from '../types'
import { CERITA, PARAGRAF } from '../bank/teks'

const M = 'membaca' as const

const cerita: Lesson[] = CERITA.map((c) => ({
  id: `cerita-${c.id}`,
  mapel: M,
  judul: `Cerita: ${c.judul}`,
  emoji: c.emoji,
  ringkas: 'Baca cerita pendek, lalu jawab pertanyaannya',
  topik: ['cerita'],
  grup: c.id,
  jumlah: c.qs.length,
  slides: [
    {
      judul: c.judul,
      teks: 'Ayo baca ceritanya pelan-pelan. Ketuk tombol baca, aku akan menyorot setiap katanya.',
      gambar: c.emoji,
      baca: c.teks,
    },
    {
      judul: 'Tips membaca cerita',
      teks: 'Setelah membaca, tanyakan pada dirimu: siapa tokohnya, apa yang terjadi, dan di mana. Sekarang jawab pertanyaan tentang cerita ini!',
      gambar: '🧐',
    },
  ],
}))

export const LESSONS_MEMBACA: Lesson[] = [
  {
    id: 'suku-kata-dasar',
    mapel: M,
    judul: 'Suku Kata Dasar',
    emoji: '🔤',
    ringkas: 'ba, bi, bu, be, bo dan kawan-kawannya',
    topik: ['suku-kata'],
    slides: [
      { judul: 'Apa itu suku kata?', teks: 'Suku kata adalah potongan bunyi dalam sebuah kata. Contohnya kata baju. Dibaca ba, ju. Jadi kata baju punya dua suku kata.', gambar: '👕', kata: ['ba-ju|👕'] },
      { judul: 'Keluarga ba bi bu be bo', teks: 'Huruf b bertemu huruf hidup a, i, u, e, o. Ketuk setiap kotak dan dengarkan bunyinya.', suku: ['ba', 'bi', 'bu', 'be', 'bo'] },
      { judul: 'Keluarga ka ki ku ke ko', teks: 'Sekarang huruf k. Ketuk dan baca bersama aku.', suku: ['ka', 'ki', 'ku', 'ke', 'ko'] },
      { judul: 'Keluarga ma mi mu me mo', teks: 'Huruf m bertemu huruf hidup. Ketuk dan baca.', suku: ['ma', 'mi', 'mu', 'me', 'mo'] },
      { judul: 'Keluarga sa si su se so', teks: 'Huruf s bertemu huruf hidup. Ketuk dan baca.', suku: ['sa', 'si', 'su', 'se', 'so'] },
      { judul: 'Keluarga la li lu le lo', teks: 'Huruf l bertemu huruf hidup. Ketuk dan baca.', suku: ['la', 'li', 'lu', 'le', 'lo'] },
      { judul: 'Ayo gabungkan!', teks: 'Huruf b ditambah huruf a menjadi ba. Huruf k ditambah huruf u menjadi ku. Baca pelan-pelan dari kiri ke kanan.', contoh: { soal: 'b + a = ?', jawab: 'ba' } },
    ],
  },
  {
    id: 'menggabung-suku-kata',
    mapel: M,
    judul: 'Menggabung Suku Kata',
    emoji: '🧩',
    ringkas: 'ba + ju = baju',
    topik: ['gabung'],
    slides: [
      { judul: 'Menggabung suku kata', teks: 'Dua suku kata digabung menjadi satu kata. Ba ditambah ju menjadi baju. Ketuk suku katanya, lalu ketuk kata utuhnya.', kata: ['ba-ju|👕'], contoh: { soal: 'ba + ju = ?', jawab: 'baju' } },
      { judul: 'Ayo baca kata-kata ini', teks: 'Eja pelan-pelan, lalu baca cepat. Ketuk gambar untuk mendengar.', kata: ['bu-ku|📕', 'bo-la|⚽', 'ku-da|🐴', 'sa-pi|🐄'] },
      { judul: 'Satu lagi!', teks: 'Kamu pasti bisa. Eja dulu, lalu gabungkan.', kata: ['to-pi|🧢', 'ro-ti|🍞', 'su-su|🥛', 'ke-ju|🧀'] },
      { judul: 'Ayo lagi!', teks: 'Semakin sering membaca, semakin lancar.', kata: ['na-si|🍚', 'ka-ki|🦶', 'ha-ti|❤️', 'pe-ta|🗺️'] },
      { judul: 'Cara membaca lancar', teks: 'Eja pelan, lalu gabungkan cepat. Ba, ju, baju!', baca: 'ba ju baju' },
    ],
  },
  {
    id: 'kata-tiga-suku',
    mapel: M,
    judul: 'Kata 3 dan 4 Suku Kata',
    emoji: '🪜',
    ringkas: 'se-pa-tu, ma-ta-ha-ri',
    topik: ['tiga-suku'],
    slides: [
      { judul: 'Kata yang lebih panjang', teks: 'Ada kata yang punya tiga atau empat suku kata. Contohnya sepatu. Dibaca se, pa, tu.', kata: ['se-pa-tu|👟'], contoh: { soal: 'se + pa + tu = ?', jawab: 'sepatu' } },
      { judul: 'Tiga suku kata', teks: 'Baca setiap suku kata, lalu gabungkan.', kata: ['ke-re-ta|🚆', 'pe-sa-wat|✈️', 'pe-ra-hu|⛵', 'se-pe-da|🚲'] },
      { judul: 'Tiga suku kata lagi', teks: 'Terus berlatih ya!', kata: ['ke-lin-ci|🐰', 'te-le-pon|📞', 'jen-de-la|🪟', 'co-ke-lat|🍫'] },
      { judul: 'Empat suku kata', teks: 'Wah, ini lebih panjang lagi. Pelan-pelan saja.', kata: ['ma-ta-ha-ri|☀️', 'ku-pu-ku-pu|🦋', 'ka-ca-ma-ta|👓', 'la-ba-la-ba|🕷️'] },
      { judul: 'Tepuk suku kata', teks: 'Tepuk tangan setiap suku kata. Se, pa, tu. Tiga tepukan! Kata matahari: ma, ta, ha, ri. Empat tepukan!', gambar: '👏' },
    ],
  },
  {
    id: 'kata-konsonan',
    mapel: M,
    judul: 'Kata Berakhiran Konsonan',
    emoji: '🔚',
    ringkas: 'ma-kan, bu-lan, a-pel',
    topik: ['konsonan'],
    slides: [
      { judul: 'Suku kata tertutup', teks: 'Ada suku kata yang berakhiran huruf mati, disebut konsonan. Contohnya makan. Suku kata terakhirnya kan, berakhiran huruf n.', kata: ['ma-kan|🍽️'], contoh: { soal: 'ma + kan = ?', jawab: 'makan' } },
      { judul: 'Ayo baca', teks: 'Perhatikan huruf paling akhir pada setiap kata.', kata: ['bu-lan|🌙', 'a-pel|🍎', 'a-yam|🐔', 'te-lur|🥚'] },
      { judul: 'Ayo baca lagi', teks: 'Bunyinya ditutup oleh huruf terakhir.', kata: ['ga-jah|🐘', 'se-mut|🐜', 'to-mat|🍅', 'mo-bil|🚗'] },
      { judul: 'Satu lagi', teks: 'Kamu hebat!', kata: ['ru-mah|🏠', 'i-kan|🐟', 'be-bek|🦆', 'pen-sil|✏️'] },
      { judul: 'Perhatikan akhirannya', teks: 'Bulan berakhiran n. Apel berakhiran l. Ayam berakhiran m. Selalu lihat huruf paling akhir.', gambar: '🔍' },
    ],
  },
  {
    id: 'gabungan-huruf',
    mapel: M,
    judul: 'Gabungan Huruf',
    emoji: '🔗',
    ringkas: 'ng, ny, sy, kh',
    topik: ['gabungan-huruf'],
    slides: [
      { judul: 'Dua huruf, satu bunyi', teks: 'Ada dua huruf yang bergandengan dan bunyinya menjadi satu. Namanya gabungan huruf: ng, ny, sy, dan kh.', poin: ['ng seperti pada bunga', 'ny seperti pada nyamuk', 'sy seperti pada syukur', 'kh seperti pada akhir'] },
      { judul: 'Gabungan huruf ng', teks: 'Ng dibaca satu bunyi, bukan n lalu g. Ketuk dan baca.', kata: ['bu-nga|🌸', 'ku-cing|🐱', 'bin-tang|⭐', 'gu-nung|⛰️'] },
      { judul: 'Masih ng', teks: 'Baca perlahan.', kata: ['pi-sang|🍌', 'tu-lang|🦴', 'ta-ngan|✋', 'ka-ngu-ru|🦘'] },
      { judul: 'Gabungan huruf ny', teks: 'Ny dibaca satu bunyi, seperti pada nyamuk.', kata: ['nya-muk|🦟', 'nya-nyi|🎤', 'me-nya-pu|🧹'] },
      { judul: 'sy dan kh', teks: 'Huruf sy ada pada syukur, dibaca syu, kur. Huruf kh ada pada akhir, dibaca a, khir.', kata: ['syu-kur', 'a-khir'] },
    ],
  },
  {
    id: 'kalimat-pendek',
    mapel: M,
    judul: 'Membaca Kalimat Pendek',
    emoji: '💬',
    ringkas: 'Ibu memasak nasi.',
    topik: ['kalimat'],
    slides: [
      { judul: 'Apa itu kalimat?', teks: 'Kalimat adalah gabungan beberapa kata yang punya arti. Kalimat diawali huruf besar dan diakhiri tanda titik.', baca: 'Ibu memasak nasi.', gambar: '🍚' },
      { judul: 'Baca bersama', teks: 'Ketuk tombol baca. Ikuti sorotan katanya.', baca: 'Adik minum susu.', gambar: '🥛' },
      { judul: 'Baca bersama', teks: 'Ayo baca kalimat berikutnya.', baca: 'Kucing makan ikan.', gambar: '🐱' },
      { judul: 'Baca bersama', teks: 'Kamu semakin lancar!', baca: 'Ayah membaca koran.', gambar: '📰' },
      { judul: 'Kalimat lebih panjang', teks: 'Baca kata demi kata dulu, lalu baca seluruh kalimat dengan lancar.', baca: 'Aku memakai sepatu baru.', gambar: '👟' },
    ],
  },
  {
    id: 'paragraf-pendek',
    mapel: M,
    judul: 'Membaca Paragraf Pendek',
    emoji: '📄',
    ringkas: 'Beberapa kalimat jadi satu bacaan',
    topik: ['paragraf'],
    slides: [
      { judul: 'Apa itu paragraf?', teks: 'Paragraf adalah beberapa kalimat yang bercerita tentang satu hal. Mari baca paragraf tentang ayam.', baca: PARAGRAF[0].teks, gambar: PARAGRAF[0].emoji },
      { judul: 'Paragraf tentang apel', teks: 'Baca bersama aku.', baca: PARAGRAF[2].teks, gambar: PARAGRAF[2].emoji },
      { judul: 'Paragraf tentang pagi hari', teks: 'Satu lagi.', baca: PARAGRAF[3].teks, gambar: PARAGRAF[3].emoji },
      { judul: 'Tanyakan pada dirimu', teks: 'Setelah membaca paragraf, tanyakan: siapa, apa, dan di mana. Jawabannya ada di dalam bacaan.', gambar: '🧐' },
    ],
  },
  ...cerita,
]
