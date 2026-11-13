import type { Question } from '../types'
import { manual, type PQ, type BSQ } from './manual'

const M = 'ipas' as const

function build(): Question[] {
  const out: Question[] = []
  const add = (topik: string, pq: PQ[], bs: BSQ[] = []) => out.push(...manual(M, 'ip', topik, pq, bs))

  add(
    'tubuh',
    [
      { t: 'Kita menendang bola dengan…', a: 'kaki', s: ['tangan', 'telinga'], p: 'Kita menendang bola dengan kaki.', g: '⚽' },
      { t: 'Kita menulis dengan…', a: 'tangan', s: ['kaki', 'hidung'], p: 'Kita menulis dengan tangan.', g: '✍️' },
      { t: 'Bagian tubuh yang dipakai untuk berpikir adalah…', a: 'otak', s: ['perut', 'jari'], p: 'Otak ada di dalam kepala dan dipakai untuk berpikir.', l: 2 },
      { t: 'Kita mengunyah makanan dengan…', a: 'gigi', s: ['rambut', 'telinga'], p: 'Gigi dipakai untuk mengunyah makanan.' },
      { t: 'Berapa jumlah jari pada kedua tangan kita?', a: '10', s: ['5', '8', '20'], p: 'Satu tangan punya 5 jari. Dua tangan: 5 + 5 = 10 jari.', l: 2, g: '🙌' },
      { t: 'Berapa jumlah mata yang kita miliki?', a: '2', s: ['1', '3', '4'], p: 'Kita punya dua mata.', g: '👀' },
      { t: 'Bagian tubuh yang berada di dalam dada dan berdetak adalah…', a: 'jantung', s: ['gigi', 'rambut'], p: 'Jantung berdetak dan memompa darah ke seluruh tubuh.', l: 3, g: '❤️' },
      { t: 'Agar gigi sehat, kita menyikat gigi…', a: 'pagi dan sebelum tidur', s: ['setahun sekali', 'hanya saat sakit gigi'], p: 'Sikat gigi pagi hari dan sebelum tidur supaya gigi sehat.', l: 2, g: '🪥' },
      { t: 'Makanan yang menyehatkan tubuh adalah…', a: 'sayur dan buah', s: ['permen terus-menerus', 'minuman manis saja'], p: 'Sayur dan buah menyehatkan tubuh kita.', g: '🥦' },
      { t: 'Agar tubuh sehat dan kuat, kita perlu…', a: 'tidur yang cukup', s: ['begadang setiap malam', 'tidak pernah mandi'], p: 'Tidur cukup membuat tubuh sehat dan kuat.', l: 2 },
      { t: 'Kita mencuci tangan dengan air dan…', a: 'sabun', s: ['pasir', 'kertas'], p: 'Mencuci tangan dengan sabun membersihkan kuman.', g: '🧼' },
      { t: 'Bagian tubuh yang dipakai untuk berjalan adalah…', a: 'kaki', s: ['mata', 'telinga'], p: 'Kita berjalan dengan kaki.', g: '🦶' },
    ],
    [
      { t: 'Kita memiliki dua telinga.', ok: true, p: 'Benar. Kita punya dua telinga untuk mendengar.' },
      { t: 'Kita bernapas dengan telinga.', ok: false, p: 'Salah. Kita bernapas dengan hidung (dan paru-paru).' },
      { t: 'Tulang membuat tubuh kita bisa berdiri tegak.', ok: true, p: 'Benar. Tulang menopang tubuh kita.', l: 2 },
    ],
  )

  add(
    'indra',
    [
      { t: 'Mata digunakan untuk…', a: 'melihat', s: ['mendengar', 'mencium'], p: 'Mata adalah indra penglihatan.', g: '👁️' },
      { t: 'Telinga digunakan untuk…', a: 'mendengar', s: ['melihat', 'meraba'], p: 'Telinga adalah indra pendengaran.', g: '👂' },
      { t: 'Hidung digunakan untuk…', a: 'mencium bau', s: ['melihat warna', 'mendengar suara'], p: 'Hidung adalah indra penciuman.', g: '👃' },
      { t: 'Lidah digunakan untuk…', a: 'merasakan rasa makanan', s: ['mendengar suara', 'melihat gambar'], p: 'Lidah adalah indra pengecap.', g: '👅' },
      { t: 'Kulit digunakan untuk…', a: 'meraba', s: ['mencium', 'melihat'], p: 'Kulit adalah indra peraba.', g: '🖐️' },
      { t: 'Es batu terasa dingin. Indra yang merasakannya adalah…', a: 'kulit', s: ['telinga', 'hidung'], p: 'Kulit merasakan dingin dan panas.', l: 2, g: '🧊' },
      { t: 'Bunga yang harum kita ketahui dengan…', a: 'hidung', s: ['telinga', 'mata saja'], p: 'Harum dirasakan oleh hidung.', l: 2, g: '🌹' },
      { t: 'Suara musik kita dengar dengan…', a: 'telinga', s: ['hidung', 'lidah'], p: 'Telinga untuk mendengar suara.', l: 2, g: '🎵' },
      { t: 'Gula rasanya manis. Indra yang merasakannya adalah…', a: 'lidah', s: ['hidung', 'kulit'], p: 'Lidah merasakan manis, asin, asam, dan pahit.', l: 2 },
      { t: 'Pancaindra ada berapa?', a: '5', s: ['3', '4', '6'], p: 'Pancaindra ada 5: mata, telinga, hidung, lidah, dan kulit.', l: 2 },
      { t: 'Indra yang dipakai untuk membedakan warna merah dan biru adalah…', a: 'mata', s: ['kulit', 'telinga'], p: 'Mata melihat warna.', l: 3 },
      { t: 'Jeruk rasanya…', a: 'asam dan segar', s: ['pedas sekali', 'berbunyi nyaring'], p: 'Jeruk biasanya terasa asam segar. Indra yang dipakai: lidah.', l: 3, g: '🍊' },
    ],
    [
      { t: 'Telinga membantu kita mendengar.', ok: true, p: 'Benar.' },
      { t: 'Kita melihat dengan hidung.', ok: false, p: 'Salah. Kita melihat dengan mata.' },
      { t: 'Kulit adalah indra peraba.', ok: true, p: 'Benar. Kulit meraba benda halus, kasar, panas, dan dingin.', l: 2 },
    ],
  )

  add(
    'hewan',
    [
      { t: 'Hewan yang berkembang biak dengan bertelur adalah…', a: 'ayam', s: ['kucing', 'sapi'], p: 'Ayam bertelur. Kucing dan sapi melahirkan.', g: '🐔' },
      { t: 'Hewan yang melahirkan anak adalah…', a: 'kucing', s: ['bebek', 'ikan'], p: 'Kucing melahirkan anak. Bebek dan ikan bertelur.', g: '🐱' },
      { t: 'Hewan yang makan rumput adalah…', a: 'sapi', s: ['kucing', 'elang'], p: 'Sapi makan rumput.', g: '🐄' },
      { t: 'Hewan yang hidup di air adalah…', a: 'ikan', s: ['ayam', 'sapi'], p: 'Ikan hidup di dalam air.', g: '🐟' },
      { t: 'Hewan yang bisa terbang adalah…', a: 'burung', s: ['kucing', 'ikan'], p: 'Burung punya sayap sehingga bisa terbang.', g: '🐦' },
      { t: 'Hewan berkaki dua adalah…', a: 'ayam', s: ['sapi', 'kucing'], p: 'Ayam berkaki dua. Sapi dan kucing berkaki empat.', l: 2, g: '🐔' },
      { t: 'Hewan berkaki empat adalah…', a: 'kucing', s: ['burung', 'ular'], p: 'Kucing berkaki empat. Burung berkaki dua dan ular tidak berkaki.', l: 2 },
      { t: 'Suara kucing adalah…', a: 'meong', s: ['guk', 'kokok'], p: 'Kucing bersuara meong.', g: '🐱' },
      { t: 'Suara anjing adalah…', a: 'guk guk', s: ['meong', 'kwek'], p: 'Anjing bersuara guk guk.', g: '🐶' },
      { t: 'Suara bebek adalah…', a: 'kwek kwek', s: ['meong', 'guk'], p: 'Bebek bersuara kwek kwek.', g: '🦆' },
      { t: 'Ulat akan berubah menjadi…', a: 'kupu-kupu', s: ['kura-kura', 'kodok'], p: 'Ulat menjadi kepompong, lalu menjadi kupu-kupu.', l: 2, g: '🐛' },
      { t: 'Anak katak yang hidup di air disebut…', a: 'berudu', s: ['kepompong', 'ulat'], p: 'Anak katak bernama berudu, lalu tumbuh kaki menjadi katak.', l: 3, g: '🐸' },
      { t: 'Hewan yang dipelihara di rumah disebut hewan…', a: 'peliharaan', s: ['buas', 'laut'], p: 'Kucing dan anjing adalah hewan peliharaan.', l: 2 },
      { t: 'Hewan yang berjalan sangat lambat dan punya tempurung adalah…', a: 'kura-kura', s: ['kelinci', 'kuda'], p: 'Kura-kura berjalan lambat dan punya tempurung.', l: 3, g: '🐢' },
    ],
    [
      { t: 'Ikan bernapas di dalam air.', ok: true, p: 'Benar. Ikan bernapas dengan insang.', l: 2 },
      { t: 'Burung tidak punya sayap.', ok: false, p: 'Salah. Burung punya sayap.' },
      { t: 'Sapi makan rumput.', ok: true, p: 'Benar.' },
    ],
  )

  add(
    'tumbuhan',
    [
      { t: 'Bagian tumbuhan yang menyerap air dari tanah adalah…', a: 'akar', s: ['daun', 'bunga'], p: 'Akar menyerap air dari dalam tanah.', l: 2, g: '🌱' },
      { t: 'Bagian tumbuhan yang berwarna-warni dan harum adalah…', a: 'bunga', s: ['akar', 'batang'], p: 'Bunga berwarna-warni dan sering harum.', g: '🌸' },
      { t: 'Bagian tumbuhan yang biasanya berwarna hijau adalah…', a: 'daun', s: ['akar', 'buah matang'], p: 'Daun biasanya berwarna hijau.', g: '🍃' },
      { t: 'Tumbuhan memerlukan air dan… untuk tumbuh.', a: 'cahaya matahari', s: ['permen', 'plastik'], p: 'Tumbuhan butuh air dan cahaya matahari.', g: '🌞' },
      { t: 'Tumbuhan baru dapat tumbuh dari…', a: 'biji', s: ['batu', 'plastik'], p: 'Biji yang ditanam akan tumbuh menjadi tumbuhan baru.', l: 2, g: '🌰' },
      { t: 'Tanaman yang kita makan akarnya adalah…', a: 'wortel', s: ['apel', 'bayam'], p: 'Wortel adalah akar yang kita makan.', l: 3, g: '🥕' },
      { t: 'Bagian tumbuhan yang menopang daun dan bunga adalah…', a: 'batang', s: ['akar', 'buah'], p: 'Batang menopang tumbuhan dan mengalirkan air.', l: 2 },
      { t: 'Mangga, jeruk, dan apel adalah…', a: 'buah', s: ['akar', 'batang'], p: 'Itu semua adalah buah yang bisa kita makan.', g: '🥭' },
      { t: 'Agar tanaman tidak layu, kita harus…', a: 'menyiramnya', s: ['mencabutnya', 'menjemur tanpa air'], p: 'Tanaman perlu disiram air.', g: '🚿' },
      { t: 'Bagian tumbuhan yang ada di dalam tanah adalah…', a: 'akar', s: ['daun', 'bunga'], p: 'Akar tumbuh di dalam tanah.', g: '🌱' },
      { t: 'Pohon memberi kita…', a: 'udara yang segar dan tempat teduh', s: ['asap dan sampah', 'suara bising'], p: 'Pohon memberi udara segar dan tempat teduh.', l: 2, g: '🌳' },
    ],
    [
      { t: 'Tumbuhan membutuhkan air.', ok: true, p: 'Benar. Tanpa air, tumbuhan akan layu.' },
      { t: 'Akar tumbuh di atas pohon.', ok: false, p: 'Salah. Akar tumbuh di dalam tanah.' },
      { t: 'Semua daun berwarna merah.', ok: false, p: 'Salah. Daun biasanya berwarna hijau.', l: 2 },
    ],
  )

  add(
    'lingkungan',
    [
      { t: 'Sampah harus dibuang di…', a: 'tempat sampah', s: ['sungai', 'jalan'], p: 'Buang sampah di tempat sampah agar lingkungan bersih.', g: '🗑️' },
      { t: 'Agar air tidak terbuang, kita harus…', a: 'menutup keran setelah dipakai', s: ['membiarkan keran menyala', 'bermain air terus'], p: 'Menutup keran menghemat air.', l: 2, g: '🚰' },
      { t: 'Menanam pohon membuat lingkungan menjadi…', a: 'sejuk dan asri', s: ['panas dan kotor', 'berbau'], p: 'Pohon membuat udara sejuk dan segar.', l: 2, g: '🌳' },
      { t: 'Sisa makanan termasuk sampah…', a: 'organik', s: ['plastik', 'kaca'], p: 'Sampah organik berasal dari makhluk hidup, seperti sisa makanan dan daun.', l: 3, g: '🍌' },
      { t: 'Botol plastik termasuk sampah…', a: 'anorganik', s: ['organik', 'sisa makanan'], p: 'Sampah anorganik sulit membusuk, seperti plastik dan kaca.', l: 3, g: '🍼' },
      { t: 'Agar kelas bersih, kita harus…', a: 'piket dan membuang sampah di tempatnya', s: ['melempar kertas ke lantai', 'mencoret dinding'], p: 'Piket kelas dan membuang sampah menjaga kebersihan.', l: 2 },
      { t: 'Mematikan lampu saat tidak dipakai menghemat…', a: 'listrik', s: ['air', 'makanan'], p: 'Mematikan lampu menghemat listrik.', l: 2, g: '💡' },
      { t: 'Sungai yang bersih membuat ikan…', a: 'hidup sehat', s: ['sakit', 'pergi ke gunung'], p: 'Air bersih membuat ikan sehat.', l: 2, g: '🏞️' },
      { t: 'Yang membuat sungai menjadi kotor adalah…', a: 'membuang sampah ke sungai', s: ['menanam pohon', 'menyiram bunga'], p: 'Sampah di sungai membuatnya kotor.', g: '🏞️' },
      { t: 'Kita menjaga lingkungan agar…', a: 'sehat dan nyaman', s: ['kotor', 'berbau'], p: 'Lingkungan bersih membuat kita sehat dan nyaman.' },
    ],
    [
      { t: 'Membuang sampah sembarangan membuat lingkungan kotor.', ok: true, p: 'Benar.' },
      { t: 'Menanam pohon baik untuk lingkungan.', ok: true, p: 'Benar. Pohon memberi udara segar dan tempat teduh.' },
      { t: 'Air boleh dibuang-buang karena banyak.', ok: false, p: 'Salah. Air harus dihemat.', l: 2 },
    ],
  )

  add(
    'cuaca',
    [
      { t: 'Ketika langit biru dan matahari bersinar terang, cuacanya…', a: 'cerah', s: ['hujan', 'berangin kencang'], p: 'Langit biru dan matahari bersinar berarti cerah.', g: '☀️' },
      { t: 'Ketika air turun dari awan, cuacanya…', a: 'hujan', s: ['cerah', 'panas'], p: 'Air yang turun dari awan disebut hujan.', g: '🌧️' },
      { t: 'Ketika langit tertutup awan putih atau abu-abu, cuacanya…', a: 'berawan', s: ['cerah sekali', 'bersalju'], p: 'Awan yang banyak membuat cuaca berawan.', g: '☁️' },
      { t: 'Saat hujan, kita memakai…', a: 'payung atau jas hujan', s: ['topi pantai', 'kacamata renang'], p: 'Payung atau jas hujan melindungi kita dari hujan.', g: '☔' },
      { t: 'Pakaian basah lebih cepat kering saat cuaca…', a: 'cerah dan panas', s: ['hujan', 'mendung'], p: 'Matahari membantu menjemur pakaian hingga kering.', l: 2 },
      { t: 'Pelangi muncul setelah hujan ketika…', a: 'matahari bersinar', s: ['malam hari', 'angin mati'], p: 'Pelangi muncul saat cahaya matahari melewati tetes air hujan.', l: 3, g: '🌈' },
      { t: 'Angin yang bertiup membuat daun-daun…', a: 'bergoyang', s: ['diam saja', 'menjadi biru'], p: 'Angin menggerakkan daun.', l: 2, g: '🍃' },
      { t: 'Cuaca yang panas membuat kita ingin…', a: 'minum air', s: ['memakai selimut tebal', 'menyalakan api unggun'], p: 'Saat panas, tubuh perlu minum air.', l: 2 },
      { t: 'Saat cuaca cerah, kita bisa…', a: 'bermain di luar', s: ['menyalakan lampu karena gelap gulita', 'mengungsi karena hujan lebat'], p: 'Cuaca cerah cocok untuk bermain di luar.', g: '🌤️' },
      { t: 'Awan yang gelap biasanya menandakan akan…', a: 'turun hujan', s: ['cerah seharian', 'muncul pelangi malam'], p: 'Awan gelap (mendung) sering diikuti hujan.', l: 2, g: '🌥️' },
    ],
    [
      { t: 'Matahari bersinar terang saat cuaca cerah.', ok: true, p: 'Benar.' },
      { t: 'Hujan turun dari awan.', ok: true, p: 'Benar.' },
      { t: 'Payung dipakai untuk melindungi diri dari hujan dan panas.', ok: true, p: 'Benar.', l: 2 },
    ],
  )

  add(
    'alam',
    [
      { t: 'Matahari memberi kita…', a: 'cahaya dan panas', s: ['hujan dan angin', 'suara dan bau'], p: 'Matahari memberi cahaya dan panas.', g: '☀️' },
      { t: 'Kita bisa melihat bulan dan bintang pada…', a: 'malam hari', s: ['siang hari saat terik', 'pagi hari saat sarapan'], p: 'Bulan dan bintang terlihat jelas pada malam hari.', g: '🌙' },
      { t: 'Matahari terbit pada waktu…', a: 'pagi', s: ['malam', 'tengah malam'], p: 'Matahari terbit di pagi hari.', g: '🌅' },
      { t: 'Mana yang termasuk benda alam?', a: 'gunung', s: ['gedung', 'jembatan'], p: 'Gunung ada secara alami. Gedung dan jembatan dibuat manusia.', l: 2, g: '⛰️' },
      { t: 'Mana yang dibuat oleh manusia?', a: 'jembatan', s: ['sungai', 'pohon'], p: 'Jembatan dibuat oleh manusia. Sungai dan pohon ada di alam.', l: 2, g: '🌉' },
      { t: 'Air hujan yang mengalir banyak ke sungai bisa membuat…', a: 'banjir jika sungai kotor dan tersumbat', s: ['langit menjadi hijau', 'matahari hilang'], p: 'Sungai yang tersumbat sampah bisa meluap.', l: 3 },
      { t: 'Benda langit yang sinarnya terang pada siang hari adalah…', a: 'matahari', s: ['bulan', 'bintang kecil'], p: 'Matahari adalah sumber cahaya di siang hari.', l: 2 },
      { t: 'Hewan dan tumbuhan hidup di…', a: 'alam sekitar', s: ['luar angkasa', 'dalam lemari'], p: 'Hewan dan tumbuhan hidup di alam sekitar kita.' },
      { t: 'Mana yang termasuk benda alam?', a: 'batu', s: ['kursi', 'televisi'], p: 'Batu ada secara alami di alam.', g: '🪨' },
      { t: 'Kita tidur pada malam hari agar…', a: 'tubuh beristirahat', s: ['tubuh makin lelah', 'bintang tidur'], p: 'Tidur malam membuat tubuh beristirahat.' },
    ],
    [
      { t: 'Matahari terbit di pagi hari.', ok: true, p: 'Benar.' },
      { t: 'Gunung dibuat oleh manusia.', ok: false, p: 'Salah. Gunung terbentuk secara alami.', l: 2 },
      { t: 'Bulan terlihat pada malam hari.', ok: true, p: 'Benar.' },
    ],
  )

  return out
}

export const BANK_IPAS: Question[] = build()
