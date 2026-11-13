// Teks bacaan + pertanyaan pemahaman. Dipakai oleh bank Membaca, Bahasa
// Indonesia, dan materi cerita. Format soal:
// [pertanyaan, jawabanBenar, pengecoh1, pengecoh2, level]
export type QPaham = [string, string, string, string, 1 | 2 | 3]

export interface TeksBaca {
  id: string
  judul: string
  emoji: string
  teks: string
  qs: QPaham[]
}

// ---------- Paragraf pendek (Membaca) ----------
export const PARAGRAF: TeksBaca[] = [
  {
    id: 'ayam',
    judul: 'Ayam',
    emoji: '🐔',
    teks: 'Ayam punya dua kaki dan dua sayap. Ayam bertelur. Pagi hari ayam berkokok.',
    qs: [
      ['Berapa kaki ayam?', 'dua', 'empat', 'tiga', 1],
      ['Apa yang dilakukan ayam di pagi hari?', 'berkokok', 'mengeong', 'menggonggong', 1],
    ],
  },
  {
    id: 'sekolah',
    judul: 'Aku Sekolah',
    emoji: '🏫',
    teks: 'Aku sekolah di SD. Aku belajar membaca dan berhitung. Guruku baik hati.',
    qs: [
      ['Apa yang dipelajari anak itu?', 'membaca dan berhitung', 'berenang dan menari', 'memasak dan menjahit', 1],
      ['Bagaimana guru anak itu?', 'baik hati', 'galak', 'pemalas', 3],
    ],
  },
  {
    id: 'apel',
    judul: 'Apel',
    emoji: '🍎',
    teks: 'Apel adalah buah yang manis. Kulit apel ada yang merah dan ada yang hijau. Apel baik untuk tubuh kita.',
    qs: [
      ['Bagaimana rasa apel?', 'manis', 'pahit', 'asin', 1],
      ['Warna kulit apel ada yang…', 'merah dan hijau', 'biru dan ungu', 'hitam dan putih', 2],
    ],
  },
  {
    id: 'ibu',
    judul: 'Pagi Hari',
    emoji: '🌅',
    teks: 'Ibu bangun pagi sekali. Ibu memasak nasi dan sayur. Setelah itu kami sarapan bersama.',
    qs: [
      ['Apa yang dimasak Ibu?', 'nasi dan sayur', 'kue dan es krim', 'mi dan telur', 1],
      ['Setelah Ibu memasak, kami…', 'sarapan bersama', 'pergi tidur', 'berenang', 3],
    ],
  },
  {
    id: 'kura',
    judul: 'Kura-kura',
    emoji: '🐢',
    teks: 'Kura-kura berjalan lambat. Tubuhnya ditutupi tempurung yang keras. Kura-kura masuk ke tempurung saat takut.',
    qs: [
      ['Bagaimana cara kura-kura berjalan?', 'lambat', 'cepat', 'melompat', 1],
      ['Apa yang melindungi tubuh kura-kura?', 'tempurung', 'bulu', 'sayap', 3],
    ],
  },
  {
    id: 'sampah',
    judul: 'Buang Sampah',
    emoji: '🗑️',
    teks: 'Sampah harus dibuang di tempat sampah. Jika sampah dibuang sembarangan, lingkungan menjadi kotor. Mari kita jaga kebersihan.',
    qs: [
      ['Di mana sampah harus dibuang?', 'di tempat sampah', 'di selokan', 'di jalan', 1],
      ['Jika sampah dibuang sembarangan, lingkungan menjadi…', 'kotor', 'wangi', 'indah', 3],
    ],
  },
]

// ---------- Cerita (Membaca) ----------
export const CERITA: TeksBaca[] = [
  {
    id: 'kucing',
    judul: 'Kucing Manis',
    emoji: '🐱',
    teks:
      'Aku punya kucing. Namanya Manis. Bulunya putih dan lembut. Manis suka minum susu. Setiap sore Manis tidur di kursi.',
    qs: [
      ['Siapa nama kucing itu?', 'Manis', 'Mimi', 'Putih', 1],
      ['Apa warna bulu Manis?', 'putih', 'hitam', 'kuning', 1],
      ['Apa yang disukai Manis?', 'minum susu', 'bermain air', 'makan rumput', 2],
      ['Di mana Manis tidur setiap sore?', 'di kursi', 'di meja', 'di kebun', 2],
    ],
  },
  {
    id: 'pasar',
    judul: 'Ani ke Pasar',
    emoji: '🧺',
    teks:
      'Hari ini Ani pergi ke pasar bersama Ibu. Ibu membeli sayur dan buah. Ani membawa keranjang kecil. Ani senang membantu Ibu.',
    qs: [
      ['Ani pergi ke pasar bersama siapa?', 'Ibu', 'Ayah', 'Nenek', 1],
      ['Apa yang dibeli Ibu?', 'sayur dan buah', 'sepatu dan baju', 'buku dan pensil', 1],
      ['Apa yang dibawa Ani?', 'keranjang kecil', 'payung', 'bola', 2],
      ['Bagaimana perasaan Ani?', 'senang', 'sedih', 'marah', 2],
    ],
  },
  {
    id: 'bola',
    judul: 'Bola Budi',
    emoji: '⚽',
    teks:
      'Budi punya bola baru. Bola itu berwarna merah. Budi bermain bola di lapangan. Bola Budi menggelinding ke selokan. Budi minta tolong kepada Pak Ali. Pak Ali mengambil bola itu. Budi berkata, "Terima kasih, Pak!"',
    qs: [
      ['Apa warna bola Budi?', 'merah', 'biru', 'hijau', 1],
      ['Di mana Budi bermain bola?', 'di lapangan', 'di kamar', 'di dapur', 1],
      ['Ke mana bola Budi menggelinding?', 'ke selokan', 'ke kolam', 'ke jalan raya', 2],
      ['Siapa yang menolong Budi?', 'Pak Ali', 'Pak Guru', 'Ayah', 2],
      ['Apa yang Budi ucapkan kepada Pak Ali?', 'terima kasih', 'selamat pagi', 'sampai jumpa', 3],
    ],
  },
  {
    id: 'hujan',
    judul: 'Hujan Hari Ini',
    emoji: '🌧️',
    teks:
      'Pagi ini hujan turun deras. Rani membawa payung kuning. Jalanan menjadi basah. Rani berjalan pelan agar tidak jatuh. Sampai di sekolah, Rani menaruh payungnya di dekat pintu.',
    qs: [
      ['Bagaimana cuaca pagi itu?', 'hujan deras', 'cerah', 'berangin kencang', 1],
      ['Apa warna payung Rani?', 'kuning', 'merah', 'biru', 1],
      ['Mengapa Rani berjalan pelan?', 'agar tidak jatuh', 'karena lapar', 'karena mengantuk', 2],
      ['Di mana Rani menaruh payungnya?', 'di dekat pintu', 'di atas meja', 'di dalam tas', 3],
    ],
  },
  {
    id: 'kebun',
    judul: 'Kebun Nenek',
    emoji: '🌺',
    teks:
      'Nenek punya kebun kecil. Di kebun ada bunga mawar dan pohon jambu. Setiap pagi Nenek menyiram bunga. Cucu Nenek, Dina, suka memetik jambu. Jambu itu manis rasanya.',
    qs: [
      ['Siapa yang punya kebun kecil?', 'Nenek', 'Dina', 'Ibu', 1],
      ['Apa saja yang ada di kebun?', 'bunga mawar dan pohon jambu', 'kolam dan ikan', 'sapi dan kambing', 2],
      ['Apa yang dilakukan Nenek setiap pagi?', 'menyiram bunga', 'memetik jambu', 'memasak nasi', 2],
      ['Bagaimana rasa jambu itu?', 'manis', 'asam sekali', 'pahit', 1],
    ],
  },
  {
    id: 'taman',
    judul: 'Hari Minggu Dito',
    emoji: '🚲',
    teks:
      'Hari Minggu Dito pergi ke taman bersama Ayah. Dito naik sepeda. Ayah berlari pelan di sampingnya. Mereka melihat banyak burung. Dito memberi remah roti kepada burung-burung itu.',
    qs: [
      ['Ke mana Dito pergi pada hari Minggu?', 'ke taman', 'ke pasar', 'ke sekolah', 1],
      ['Dito naik apa?', 'sepeda', 'mobil', 'perahu', 1],
      ['Apa yang dilihat Dito dan Ayah?', 'banyak burung', 'banyak ikan', 'banyak kucing', 2],
      ['Apa yang Dito berikan kepada burung?', 'remah roti', 'air minum', 'rumput', 3],
    ],
  },
]

// ---------- Teks untuk Bahasa Indonesia (memahami bacaan) ----------
export const BACAAN_BINDO: TeksBaca[] = [
  {
    id: 'perpus',
    judul: 'Di Perpustakaan',
    emoji: '📚',
    teks:
      'Siti pergi ke perpustakaan sekolah. Di sana banyak buku cerita. Siti meminjam satu buku tentang kelinci. Ia membaca dengan tenang karena perpustakaan harus sepi.',
    qs: [
      ['Siti pergi ke mana?', 'ke perpustakaan', 'ke kantin', 'ke lapangan', 1],
      ['Buku yang dipinjam Siti tentang apa?', 'kelinci', 'gajah', 'mobil', 1],
      ['Mengapa Siti membaca dengan tenang?', 'perpustakaan harus sepi', 'Siti sedang sakit', 'Siti sedang lari', 3],
    ],
  },
  {
    id: 'sepeda',
    judul: 'Sepeda Baru Rafa',
    emoji: '🚲',
    teks:
      'Rafa mendapat sepeda baru dari Ayah. Sepeda itu berwarna biru. Rafa memakai helm sebelum naik sepeda. Ia bersepeda di halaman rumah dengan hati-hati.',
    qs: [
      ['Siapa yang memberi sepeda kepada Rafa?', 'Ayah', 'Nenek', 'Paman', 1],
      ['Apa yang dipakai Rafa sebelum naik sepeda?', 'helm', 'topi ulang tahun', 'payung', 1],
      ['Di mana Rafa bersepeda?', 'di halaman rumah', 'di dalam kamar', 'di sekolah', 3],
    ],
  },
  {
    id: 'ikan',
    judul: 'Ikan di Kolam',
    emoji: '🐟',
    teks:
      'Di belakang rumah Tia ada kolam kecil. Di dalam kolam ada lima ikan. Setiap pagi Tia memberi makan ikan. Ikan-ikan itu berenang ke atas untuk makan.',
    qs: [
      ['Ada berapa ikan di kolam?', 'lima', 'tiga', 'sepuluh', 1],
      ['Kapan Tia memberi makan ikan?', 'setiap pagi', 'setiap malam', 'setiap hujan', 2],
      ['Apa yang dilakukan ikan saat diberi makan?', 'berenang ke atas', 'terbang', 'tidur', 3],
    ],
  },
  {
    id: 'pasar-malam',
    judul: 'Membantu Ibu',
    emoji: '🧹',
    teks:
      'Hari Sabtu Dewi membantu Ibu di rumah. Dewi menyapu lantai. Adik merapikan mainan. Setelah selesai, Ibu berkata, "Terima kasih, Anak-anak Ibu pintar!" Dewi dan Adik pun tersenyum.',
    qs: [
      ['Apa yang dilakukan Dewi?', 'menyapu lantai', 'mencuci piring', 'memasak nasi', 1],
      ['Siapa yang merapikan mainan?', 'Adik', 'Ayah', 'Nenek', 1],
      ['Apa kata Ibu setelah pekerjaan selesai?', 'terima kasih', 'selamat tidur', 'sampai jumpa', 3],
    ],
  },
]
