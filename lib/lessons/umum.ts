import type { Lesson, Slide } from '../types'
import { ALPHA, BUAH, HEWAN, KELUARGA, SAPA, WARNA } from '../bank/inggris'

// ================= PANCASILA =================
export const LESSONS_PANCASILA: Lesson[] = [
  {
    id: 'sila-pancasila', mapel: 'pancasila', judul: 'Sila-sila Pancasila', emoji: '5️⃣', ringkas: 'Lima sila dasar negara', topik: ['sila'],
    slides: [
      { judul: 'Pancasila', teks: 'Pancasila adalah dasar negara Indonesia. Pancasila terdiri dari lima sila. Ketuk setiap sila untuk mendengarnya.', gambar: '🦅', poin: ['1 Ketuhanan Yang Maha Esa', '2 Kemanusiaan yang Adil dan Beradab', '3 Persatuan Indonesia', '4 Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan atau Perwakilan', '5 Keadilan Sosial bagi Seluruh Rakyat Indonesia'] },
      { judul: 'Sila ke-1 dan ke-2', teks: 'Sila pertama: percaya kepada Tuhan, contohnya berdoa sebelum belajar. Sila kedua: berbuat baik kepada sesama manusia, contohnya menolong teman yang jatuh.', gambar: '🙏' },
      { judul: 'Sila ke-3', teks: 'Sila ketiga: persatuan. Kita bersatu walau berbeda-beda, contohnya bermain bersama tanpa bertengkar.', gambar: '🤝' },
      { judul: 'Sila ke-4 dan ke-5', teks: 'Sila keempat: musyawarah, yaitu berunding bersama, contohnya memilih ketua kelas. Sila kelima: keadilan, contohnya membagi kue sama rata.', gambar: '⚖️' },
    ],
  },
  {
    id: 'lambang-pancasila', mapel: 'pancasila', judul: 'Lambang Pancasila', emoji: '⭐', ringkas: 'Bintang, rantai, beringin, banteng, padi dan kapas', topik: ['lambang'],
    slides: [
      { judul: 'Burung Garuda', teks: 'Lambang negara kita adalah Garuda Pancasila. Di dada Garuda ada perisai berisi lima lambang sila. Di kaki Garuda ada pita bertuliskan Bhinneka Tunggal Ika.', gambar: '🦅' },
      { judul: 'Lambang kelima sila', teks: 'Sila 1 lambangnya bintang. Sila 2 rantai. Sila 3 pohon beringin. Sila 4 kepala banteng. Sila 5 padi dan kapas.', poin: ['⭐ bintang = sila 1', '⛓️ rantai = sila 2', '🌳 pohon beringin = sila 3', '🐂 kepala banteng = sila 4', '🌾 padi dan kapas = sila 5'] },
      { judul: 'Bhinneka Tunggal Ika', teks: 'Artinya berbeda-beda tetapi tetap satu. Walau beda suku, agama, dan budaya, kita tetap satu Indonesia.', gambar: '🇮🇩' },
    ],
  },
  {
    id: 'aturan-rumah-sekolah', mapel: 'pancasila', judul: 'Aturan di Rumah dan Sekolah', emoji: '🏫', ringkas: 'Tertib dan disiplin', topik: ['aturan'],
    slides: [
      { judul: 'Mengapa ada aturan?', teks: 'Aturan dibuat agar kita aman, tertib, dan nyaman. Kalau semua menaati aturan, hidup terasa damai.', gambar: '📋' },
      { judul: 'Aturan di sekolah', teks: 'Datang tepat waktu, memakai seragam, mendengarkan guru, antre, dan membuang sampah pada tempatnya.', poin: ['Datang tepat waktu', 'Mendengarkan guru', 'Antre dengan tertib', 'Membuang sampah di tempatnya'] },
      { judul: 'Aturan di rumah', teks: 'Merapikan mainan, mencuci tangan sebelum makan, meminta izin sebelum pergi, dan membantu orang tua.', poin: ['Merapikan mainan', 'Mencuci tangan sebelum makan', 'Meminta izin sebelum pergi', 'Membantu orang tua'] },
    ],
  },
  {
    id: 'hak-kewajiban', mapel: 'pancasila', judul: 'Hak dan Kewajiban', emoji: '⚖️', ringkas: 'Yang kita terima dan yang kita kerjakan', topik: ['hak-kewajiban'],
    slides: [
      { judul: 'Apa itu hak?', teks: 'Hak adalah sesuatu yang berhak kita terima. Anak berhak belajar, bermain, mendapat kasih sayang, dan makanan sehat.', poin: ['Belajar di sekolah', 'Bermain bersama teman', 'Kasih sayang orang tua', 'Makanan yang sehat'] },
      { judul: 'Apa itu kewajiban?', teks: 'Kewajiban adalah tugas yang harus kita kerjakan. Anak wajib belajar, merapikan tempat tidur, menghormati orang tua dan guru.', poin: ['Mengerjakan PR', 'Merapikan tempat tidur', 'Menghormati orang tua dan guru', 'Menjaga kebersihan kelas'] },
      { judul: 'Seimbang', teks: 'Hak dan kewajiban harus seimbang. Kita menerima hak, dan kita juga mengerjakan kewajiban.', gambar: '⚖️' },
    ],
  },
  {
    id: 'hidup-rukun', mapel: 'pancasila', judul: 'Hidup Rukun', emoji: '🤗', ringkas: 'Berbagi, menolong, dan memaafkan', topik: ['rukun'],
    slides: [
      { judul: 'Rukun itu menyenangkan', teks: 'Hidup rukun artinya hidup damai bersama teman, keluarga, dan tetangga.', gambar: '🤗' },
      { judul: 'Cara hidup rukun', teks: 'Berbagi, saling menolong, bergotong royong, meminta maaf, dan memaafkan.', poin: ['Berbagi dengan teman', 'Saling menolong', 'Gotong royong', 'Meminta maaf dan memaafkan'] },
      { judul: 'Kata ajaib', teks: 'Ada tiga kata ajaib. Tolong, untuk meminta bantuan. Terima kasih, setelah dibantu. Maaf, ketika berbuat salah.', poin: ['Tolong', 'Terima kasih', 'Maaf'] },
    ],
  },
  {
    id: 'karakter-baik', mapel: 'pancasila', judul: 'Karakter Baik', emoji: '💖', ringkas: 'Jujur, disiplin, sopan, peduli', topik: ['karakter'],
    slides: [
      { judul: 'Anak berkarakter baik', teks: 'Karakter baik adalah sifat-sifat yang baik, seperti jujur, disiplin, sopan, mandiri, dan peduli.', gambar: '💖' },
      { judul: 'Jujur dan disiplin', teks: 'Jujur artinya berkata benar dan tidak menyontek. Disiplin artinya taat aturan dan tepat waktu.', poin: ['Jujur: berkata benar', 'Disiplin: tepat waktu dan taat aturan'] },
      { judul: 'Sopan, mandiri, peduli', teks: 'Sopan: bicara lemah lembut dan memberi salam. Mandiri: mengerjakan sendiri. Peduli: menolong dan menjaga lingkungan.', poin: ['Sopan: memberi salam', 'Mandiri: merapikan tempat tidur sendiri', 'Peduli: menolong dan menjaga lingkungan'] },
    ],
  },
]

// ================= IPAS =================
export const LESSONS_IPAS: Lesson[] = [
  {
    id: 'tubuhku', mapel: 'ipas', judul: 'Tubuh Manusia', emoji: '🧍', ringkas: 'Anggota tubuh dan menjaga kesehatan', topik: ['tubuh'],
    slides: [
      { judul: 'Anggota tubuhku', teks: 'Tubuh kita punya kepala, badan, tangan, dan kaki. Tangan untuk menulis, kaki untuk berjalan.', poin: ['Kepala: ada mata, hidung, telinga, mulut', 'Tangan: untuk menulis dan memegang', 'Kaki: untuk berjalan dan menendang', 'Gigi: untuk mengunyah'] },
      { judul: 'Bagian dalam tubuh', teks: 'Di dalam tubuh ada otak untuk berpikir, jantung yang berdetak, dan tulang yang menopang tubuh.', gambar: '❤️' },
      { judul: 'Menjaga tubuh sehat', teks: 'Mandi, menyikat gigi, mencuci tangan dengan sabun, makan sayur dan buah, serta tidur yang cukup.', poin: ['🪥 Sikat gigi pagi dan sebelum tidur', '🧼 Cuci tangan dengan sabun', '🥦 Makan sayur dan buah', '😴 Tidur cukup'] },
    ],
  },
  {
    id: 'pancaindra', mapel: 'ipas', judul: 'Pancaindra', emoji: '👀', ringkas: 'Lima indra kita', topik: ['indra'],
    slides: [
      { judul: 'Lima indra', teks: 'Pancaindra artinya lima indra. Mata untuk melihat, telinga untuk mendengar, hidung untuk mencium, lidah untuk mengecap, kulit untuk meraba.', poin: ['👁️ Mata: melihat', '👂 Telinga: mendengar', '👃 Hidung: mencium', '👅 Lidah: mengecap rasa', '🖐️ Kulit: meraba'] },
      { judul: 'Contoh', teks: 'Bunga harum dicium hidung. Es terasa dingin di kulit. Gula manis di lidah. Musik terdengar di telinga.', gambar: '🌹' },
    ],
  },
  {
    id: 'hewan-sekitar', mapel: 'ipas', judul: 'Hewan di Sekitarku', emoji: '🐾', ringkas: 'Jenis, makanan, dan tempat hidup', topik: ['hewan'],
    slides: [
      { judul: 'Hewan bertelur dan melahirkan', teks: 'Ayam, bebek, dan ikan bertelur. Kucing, sapi, dan kelinci melahirkan anak.', poin: ['🐔 Ayam bertelur', '🦆 Bebek bertelur', '🐱 Kucing melahirkan', '🐄 Sapi melahirkan'] },
      { judul: 'Tempat hidup dan gerak', teks: 'Ikan hidup di air. Burung bisa terbang. Kucing berkaki empat, ayam berkaki dua.', poin: ['🐟 Ikan di air', '🐦 Burung terbang', '🐱 Kucing berkaki empat', '🐔 Ayam berkaki dua'] },
      { judul: 'Suara hewan', teks: 'Kucing meong, anjing guk guk, bebek kwek kwek, ayam berkokok.', poin: ['🐱 meong', '🐶 guk guk', '🦆 kwek kwek', '🐔 kukuruyuk'] },
      { judul: 'Perubahan hewan', teks: 'Ulat berubah menjadi kupu-kupu. Anak katak bernama berudu.', gambar: '🐛' },
    ],
  },
  {
    id: 'tumbuhan', mapel: 'ipas', judul: 'Tumbuhan', emoji: '🌿', ringkas: 'Bagian dan kebutuhan tumbuhan', topik: ['tumbuhan'],
    slides: [
      { judul: 'Bagian tumbuhan', teks: 'Tumbuhan punya akar, batang, daun, bunga, dan buah. Akar menyerap air, daun biasanya hijau.', poin: ['🌱 Akar menyerap air', '🌿 Batang menopang', '🍃 Daun berwarna hijau', '🌸 Bunga indah dan harum', '🍎 Buah bisa dimakan'] },
      { judul: 'Apa kebutuhan tumbuhan?', teks: 'Tumbuhan perlu air, cahaya matahari, dan udara agar tumbuh sehat.', gambar: '🌞' },
      { judul: 'Dari biji menjadi pohon', teks: 'Biji ditanam, disiram, lalu tumbuh menjadi tunas, dan akhirnya menjadi pohon.', gambar: '🌰' },
    ],
  },
  {
    id: 'lingkungan-bersih', mapel: 'ipas', judul: 'Lingkungan Bersih', emoji: '♻️', ringkas: 'Menjaga bumi kita', topik: ['lingkungan'],
    slides: [
      { judul: 'Jaga kebersihan', teks: 'Buanglah sampah di tempat sampah. Lingkungan bersih membuat kita sehat dan nyaman.', gambar: '🗑️' },
      { judul: 'Sampah organik dan anorganik', teks: 'Sampah organik berasal dari makhluk hidup, seperti sisa makanan dan daun. Sampah anorganik sulit membusuk, seperti plastik dan kaca.', poin: ['🍌 Kulit pisang: organik', '🍼 Botol plastik: anorganik'] },
      { judul: 'Hemat air dan listrik', teks: 'Tutup keran setelah dipakai dan matikan lampu saat tidak dipakai. Tanam pohon agar udara sejuk.', poin: ['🚰 Tutup keran', '💡 Matikan lampu', '🌳 Tanam pohon'] },
    ],
  },
  {
    id: 'cuaca', mapel: 'ipas', judul: 'Cuaca', emoji: '⛅', ringkas: 'Cerah, berawan, hujan, berangin', topik: ['cuaca'],
    slides: [
      { judul: 'Macam-macam cuaca', teks: 'Cuaca bisa cerah, berawan, hujan, atau berangin.', poin: ['☀️ Cerah', '☁️ Berawan', '🌧️ Hujan', '💨 Berangin'] },
      { judul: 'Menyesuaikan diri dengan cuaca', teks: 'Saat hujan kita memakai payung atau jas hujan. Saat panas kita minum air dan memakai topi.', gambar: '☔' },
      { judul: 'Pelangi', teks: 'Pelangi muncul setelah hujan ketika matahari bersinar. Warnanya ada tujuh.', gambar: '🌈' },
    ],
  },
  {
    id: 'alam-sekitar', mapel: 'ipas', judul: 'Alam Sekitar', emoji: '🌍', ringkas: 'Matahari, bulan, benda alam', topik: ['alam'],
    slides: [
      { judul: 'Matahari dan bulan', teks: 'Matahari memberi cahaya dan panas di siang hari. Bulan dan bintang terlihat pada malam hari.', poin: ['☀️ Matahari: siang hari', '🌙 Bulan: malam hari', '⭐ Bintang: malam hari'] },
      { judul: 'Benda alam dan buatan manusia', teks: 'Gunung, sungai, batu, dan pohon adalah benda alam. Gedung dan jembatan dibuat oleh manusia.', poin: ['⛰️ Gunung: benda alam', '🏞️ Sungai: benda alam', '🌉 Jembatan: buatan manusia', '🏢 Gedung: buatan manusia'] },
    ],
  },
]

// ================= PLBJ =================
export const LESSONS_PLBJ: Lesson[] = [
  {
    id: 'budaya-betawi', mapel: 'plbj', judul: 'Budaya Betawi', emoji: '🏙️', ringkas: 'Penduduk asli Jakarta', topik: ['budaya'],
    slides: [
      { judul: 'Suku Betawi', teks: 'Suku Betawi adalah penduduk asli Jakarta. Orang Betawi terkenal ramah dan suka bergotong royong. Mereka berbicara dengan bahasa Betawi.', gambar: '🏙️' },
      { judul: 'Rumah dan sapaan', teks: 'Rumah adat Betawi bernama Rumah Kebaya. Abang dan None adalah duta wisata Jakarta.', gambar: '🏠' },
      { judul: 'Identitas Jakarta', teks: 'Maskot hewan Jakarta adalah elang bondol. Tumbuhan identitas Jakarta adalah salak condet. Monas ada di Jakarta.', gambar: '🦅' },
    ],
  },
  {
    id: 'ornamen-betawi', mapel: 'plbj', judul: 'Ornamen Betawi', emoji: '🔺', ringkas: 'Gigi balang dan tumpal', topik: ['ornamen'],
    slides: [
      { judul: 'Hiasan rumah Betawi', teks: 'Ornamen adalah hiasan. Rumah Betawi punya hiasan di tepi atap yang disebut gigi balang. Bentuknya segitiga berjajar.', gambar: '🔺🔺🔺' },
      { judul: 'Tumpal dan batik', teks: 'Tumpal adalah hiasan segitiga pada kain. Batik Betawi sering bergambar ondel-ondel dan Monas dengan warna cerah.', gambar: '🎨' },
    ],
  },
  {
    id: 'permainan-tradisional', mapel: 'plbj', judul: 'Permainan Tradisional', emoji: '🪀', ringkas: 'Gobak sodor, congklak, engklek', topik: ['permainan'],
    slides: [
      { judul: 'Permainan zaman dulu', teks: 'Permainan tradisional dimainkan bersama-sama dan membuat tubuh sehat.', poin: ['Gobak sodor: menjaga garis', 'Engklek: melompat di petak', 'Congklak: memakai biji dan papan', 'Egrang: berjalan di atas bambu'] },
      { judul: 'Lainnya', teks: 'Ada juga kelereng, petak umpet, lompat tali, dan layangan.', poin: ['🔮 Kelereng', '🙈 Petak umpet', '🪢 Lompat tali', '🪁 Layangan'] },
    ],
  },
  {
    id: 'makanan-khas-betawi', mapel: 'plbj', judul: 'Makanan Khas Betawi', emoji: '🍳', ringkas: 'Kerak telor, soto, bir pletok', topik: ['makanan'],
    slides: [
      { judul: 'Makanan khas', teks: 'Kerak telor dibuat dari telur dan beras ketan. Soto Betawi berkuah gurih. Ketoprak berisi tahu, lontong, dan bumbu kacang.', poin: ['🍳 Kerak telor', '🍲 Soto Betawi', '🥜 Ketoprak', '🍚 Nasi uduk'] },
      { judul: 'Minuman dan kue', teks: 'Bir pletok adalah minuman jahe dan rempah yang tidak beralkohol. Dodol Betawi manis dan kenyal. Kue rangi memakai kelapa dan gula merah.', poin: ['Bir pletok: minuman jahe rempah', 'Dodol Betawi: manis dan kenyal', 'Kue rangi: kelapa dan gula merah', 'Asinan Betawi: asam manis segar'] },
    ],
  },
  {
    id: 'kesenian-betawi', mapel: 'plbj', judul: 'Kesenian Betawi', emoji: '🥁', ringkas: 'Ondel-ondel, lenong, tanjidor', topik: ['kesenian'],
    slides: [
      { judul: 'Ondel-ondel', teks: 'Ondel-ondel adalah boneka raksasa yang diarak dalam pesta. Boneka ini dipikul dan digerakkan oleh orang dari dalamnya.', gambar: '🎭' },
      { judul: 'Lenong dan tanjidor', teks: 'Lenong adalah sandiwara rakyat yang lucu. Tanjidor adalah musik yang dimainkan dengan alat tiup. Gambang kromong juga musik Betawi.', poin: ['🎬 Lenong: sandiwara lucu', '🎺 Tanjidor: musik alat tiup', '🎶 Gambang kromong: musik Betawi'] },
      { judul: 'Palang pintu dan tari', teks: 'Palang pintu adalah silat dan berbalas pantun saat menyambut pengantin. Tari Yapong adalah tari Betawi yang ceria.', gambar: '💃' },
    ],
  },
]

// ================= BAHASA INGGRIS =================
const vocabPoin = (list: [string, string, string, boolean?][]) => list.map(([en, id, e]) => `${e} ${en} = ${id}`)

export const LESSONS_INGGRIS: Lesson[] = [
  {
    id: 'alphabet', mapel: 'inggris', judul: 'Alphabet', emoji: '🅰️', ringkas: 'A is for Apple', topik: ['alphabet'],
    slides: ([[0, 8], [8, 16], [16, 25]] as [number, number][]).map<Slide>(([a, c], i) => ({
      judul: `Huruf ${ALPHA[a][0]} sampai ${ALPHA[c - 1][0]}`,
      teks: i === 0 ? 'Alphabet adalah huruf-huruf bahasa Inggris. Ketuk setiap kotak dan dengarkan.' : 'Terus belajar alphabet. Ketuk dan dengarkan.',
      lang: 'en-US',
      poin: ALPHA.slice(a, c).map(([h, w, e]) => `${e} ${h} is for ${w} = ${h}`),
    })),
  },
  {
    id: 'numbers', mapel: 'inggris', judul: 'Numbers', emoji: '🔢', ringkas: 'one, two, three', topik: ['numbers'],
    slides: [
      { judul: 'Numbers 1–5', teks: 'Mari berhitung dalam bahasa Inggris.', lang: 'en-US', poin: ['1 one', '2 two', '3 three', '4 four', '5 five'] },
      { judul: 'Numbers 6–10', teks: 'Lanjut berhitung.', lang: 'en-US', poin: ['6 six', '7 seven', '8 eight', '9 nine', '10 ten'] },
      { judul: 'Numbers 11–20', teks: 'Sampai dua puluh!', lang: 'en-US', poin: ['11 eleven', '12 twelve', '13 thirteen', '14 fourteen', '15 fifteen', '16 sixteen', '17 seventeen', '18 eighteen', '19 nineteen', '20 twenty'] },
    ],
  },
  {
    id: 'colors', mapel: 'inggris', judul: 'Colors', emoji: '🎨', ringkas: 'red, blue, green', topik: ['colors'],
    slides: [
      { judul: 'Colors', teks: 'Warna dalam bahasa Inggris. Ketuk untuk mendengar.', lang: 'en-US', poin: vocabPoin(WARNA).slice(0, 5) },
      { judul: 'More colors', teks: 'Warna lainnya.', lang: 'en-US', poin: vocabPoin(WARNA).slice(5) },
    ],
  },
  {
    id: 'animals', mapel: 'inggris', judul: 'Animals', emoji: '🦁', ringkas: 'cat, dog, bird', topik: ['animals'],
    slides: [
      { judul: 'Animals', teks: 'Nama hewan dalam bahasa Inggris. Ketuk untuk mendengar.', lang: 'en-US', poin: vocabPoin(HEWAN).slice(0, 6) },
      { judul: 'More animals', teks: 'Hewan lainnya.', lang: 'en-US', poin: vocabPoin(HEWAN).slice(6, 12) },
      { judul: 'Even more animals', teks: 'Hewan terakhir.', lang: 'en-US', poin: vocabPoin(HEWAN).slice(12) },
    ],
  },
  {
    id: 'fruits', mapel: 'inggris', judul: 'Fruits', emoji: '🍉', ringkas: 'apple, banana, mango', topik: ['fruits'],
    slides: [
      { judul: 'Fruits', teks: 'Nama buah dalam bahasa Inggris.', lang: 'en-US', poin: vocabPoin(BUAH).slice(0, 6) },
      { judul: 'More fruits', teks: 'Buah lainnya.', lang: 'en-US', poin: vocabPoin(BUAH).slice(6) },
    ],
  },
  {
    id: 'family', mapel: 'inggris', judul: 'Family', emoji: '👨‍👩‍👧', ringkas: 'mother, father, sister', topik: ['family'],
    slides: [
      { judul: 'My family', teks: 'Anggota keluarga dalam bahasa Inggris. Ketuk untuk mendengar.', lang: 'en-US', poin: KELUARGA.map(([en, id]) => `${en} = ${id}`) },
      { judul: 'Kalimat sederhana', teks: 'She is my mother artinya dia ibuku. He is my father artinya dia ayahku.', lang: 'en-US', poin: ['She is my mother. = Dia ibuku.', 'He is my father. = Dia ayahku.', 'She is my grandmother. = Dia nenekku.'] },
    ],
  },
  {
    id: 'greetings', mapel: 'inggris', judul: 'Greetings', emoji: '👋', ringkas: 'Hello, thank you, goodbye', topik: ['greetings'],
    slides: [
      { judul: 'Greetings', teks: 'Salam dan ucapan dalam bahasa Inggris. Ketuk untuk mendengar.', lang: 'en-US', poin: SAPA.slice(0, 7).map(([en, id]) => `${en} = ${id}`) },
      { judul: 'More expressions', teks: 'Ucapan lainnya.', lang: 'en-US', poin: SAPA.slice(7).map(([en, id]) => `${en} = ${id}`) },
    ],
  },
]

// ================= SENI =================
export const LESSONS_SENI: Lesson[] = [
  {
    id: 'pola', mapel: 'seni', judul: 'Pola', emoji: '🔁', ringkas: 'Gambar dan bilangan yang berulang', topik: ['pola'],
    slides: [
      { judul: 'Apa itu pola?', teks: 'Pola adalah susunan yang berulang. Perhatikan: merah, biru, merah, biru. Setelah merah akan datang biru.', gambar: '🔴 🔵 🔴 🔵 🔴 ❓' },
      { judul: 'Pola yang lebih panjang', teks: 'Pola bisa punya tiga gambar yang berulang. Apel, pisang, anggur, apel, pisang, anggur, lalu apel lagi.', gambar: '🍎 🍌 🍇 🍎 🍌 🍇 🍎 ❓' },
      { judul: 'Pola bilangan', teks: 'Bilangan juga bisa berpola. Dua, empat, enam, delapan. Setiap kali bertambah dua. Selanjutnya sepuluh.', contoh: { soal: '2, 4, 6, 8, ?', jawab: '10' } },
    ],
  },
  {
    id: 'warna-ajaib', mapel: 'seni', judul: 'Warna', emoji: '🌈', ringkas: 'Campuran warna', topik: ['warna'],
    slides: [
      { judul: 'Warna dasar', teks: 'Tiga warna dasar adalah merah, kuning, dan biru. Dari ketiganya kita bisa membuat warna lain.', gambar: '🔴 🟡 🔵' },
      { judul: 'Mencampur warna', teks: 'Biru dicampur kuning menjadi hijau. Merah dicampur kuning menjadi oranye. Merah dicampur biru menjadi ungu.', poin: ['🔵 + 🟡 = hijau', '🔴 + 🟡 = oranye', '🔴 + 🔵 = ungu'] },
      { judul: 'Warna pelangi', teks: 'Pelangi punya tujuh warna: merah, jingga, kuning, hijau, biru, nila, ungu.', gambar: '🌈' },
    ],
  },
  {
    id: 'logika', mapel: 'seni', judul: 'Permainan Logika', emoji: '🧠', ringkas: 'Berpikir teliti dan berurutan', topik: ['logika'],
    slides: [
      { judul: 'Mana yang berbeda?', teks: 'Lihat gambar yang sejenis. Jika ada satu yang tidak sejenis, itu yang berbeda. Apel, pisang, anggur, dan mobil. Mobil yang berbeda karena bukan buah.', gambar: '🍎 🍌 🍇 🚗' },
      { judul: 'Urutan', teks: 'Beberapa hal punya urutan. Pagi, siang, sore, malam. Senin, Selasa, Rabu, Kamis.', poin: ['Pagi → siang → sore → malam', 'Senin → Selasa → Rabu → Kamis', 'Biji → tunas → pohon'] },
      { judul: 'Siapa paling tinggi?', teks: 'Ani lebih tinggi dari Budi. Budi lebih tinggi dari Citra. Jadi Ani paling tinggi dan Citra paling pendek.', gambar: '🧍‍♀️🧍🧒' },
    ],
  },
]
