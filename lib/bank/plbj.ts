import type { Question } from '../types'
import { manual, type PQ, type BSQ } from './manual'

const M = 'plbj' as const

function build(): Question[] {
  const out: Question[] = []
  const add = (topik: string, pq: PQ[], bs: BSQ[] = []) => out.push(...manual(M, 'pl', topik, pq, bs))

  add(
    'budaya',
    [
      { t: 'Suku asli yang tinggal di Jakarta adalah suku…', a: 'Betawi', s: ['Batak', 'Dayak'], p: 'Suku Betawi adalah penduduk asli Jakarta.', g: '🏙️' },
      { t: 'Bahasa daerah yang dipakai orang Betawi adalah bahasa…', a: 'Betawi', s: ['Jawa', 'Bali'], p: 'Orang Betawi berbicara dengan bahasa Betawi.' },
      { t: 'Abang dan None adalah…', a: 'duta wisata Jakarta', s: ['nama makanan', 'nama permainan'], p: 'Abang None adalah duta wisata Jakarta.', l: 2 },
      { t: 'Monumen Nasional (Monas) berada di kota…', a: 'Jakarta', s: ['Bandung', 'Surabaya'], p: 'Monas berada di Jakarta.', g: '🗼' },
      { t: 'Rumah adat suku Betawi disebut Rumah…', a: 'Kebaya', s: ['Gadang', 'Joglo'], p: 'Rumah adat Betawi bernama Rumah Kebaya.', l: 3, g: '🏠' },
      { t: 'Hewan yang menjadi maskot DKI Jakarta adalah…', a: 'elang bondol', s: ['harimau', 'jalak bali'], p: 'Elang bondol adalah fauna identitas DKI Jakarta.', l: 3, g: '🦅' },
      { t: 'Tumbuhan yang menjadi maskot DKI Jakarta adalah…', a: 'salak condet', s: ['durian', 'anggrek bulan'], p: 'Salak condet adalah flora identitas DKI Jakarta.', l: 3 },
      { t: 'Orang Betawi terkenal ramah dan suka…', a: 'bergotong royong', s: ['menyendiri', 'bertengkar'], p: 'Orang Betawi terkenal ramah dan suka bergotong royong.', l: 2 },
    ],
    [
      { t: 'Suku Betawi adalah penduduk asli Jakarta.', ok: true, p: 'Benar.' },
      { t: 'Monas berada di kota Medan.', ok: false, p: 'Salah. Monas ada di Jakarta.' },
    ],
  )

  add(
    'ornamen',
    [
      { t: 'Hiasan di tepi atap rumah Betawi yang bentuknya segitiga berjajar bernama…', a: 'gigi balang', s: ['kerak telor', 'tanjidor'], p: 'Gigi balang adalah hiasan segitiga berjajar di tepi atap rumah Betawi.', l: 2 },
      { t: 'Bentuk dasar hiasan gigi balang adalah…', a: 'segitiga', s: ['lingkaran', 'bintang laut'], p: 'Gigi balang berbentuk segitiga yang berjajar.', l: 2, g: '🔺🔺🔺' },
      { t: 'Hiasan tumpal pada kain Betawi berbentuk…', a: 'segitiga', s: ['bulat', 'persegi panjang'], p: 'Tumpal adalah hiasan berbentuk segitiga pada kain atau batik.', l: 3 },
      { t: 'Batik Betawi sering bergambar…', a: 'ondel-ondel dan Monas', s: ['gajah dan jerapah', 'salju dan kutub'], p: 'Batik Betawi sering bergambar ondel-ondel dan Monas.', l: 2 },
      { t: 'Ornamen Betawi biasanya berwarna…', a: 'cerah dan meriah', s: ['hanya hitam', 'pudar dan kusam'], p: 'Hiasan Betawi biasanya berwarna cerah dan meriah.', l: 2 },
      { t: 'Hiasan yang dipasang di rumah agar tampak indah disebut…', a: 'ornamen', s: ['sampah', 'perabot dapur'], p: 'Ornamen adalah hiasan.', l: 1 },
    ],
    [
      { t: 'Gigi balang adalah hiasan rumah Betawi.', ok: true, p: 'Benar.', l: 2 },
      { t: 'Gigi balang adalah nama makanan khas Betawi.', ok: false, p: 'Salah. Gigi balang adalah hiasan di tepi atap rumah Betawi.', l: 2 },
    ],
  )

  add(
    'permainan',
    [
      { t: 'Permainan berkelompok yang menjaga garis agar lawan tidak bisa lewat adalah…', a: 'gobak sodor', s: ['congklak', 'egrang'], p: 'Dalam gobak sodor, penjaga menjaga garis agar lawan tidak lolos.', l: 2 },
      { t: 'Permainan melompat di kotak-kotak yang digambar di tanah adalah…', a: 'engklek', s: ['kelereng', 'layangan'], p: 'Engklek dimainkan dengan melompat di petak-petak.', l: 2 },
      { t: 'Permainan yang memakai biji-bijian pada papan berlubang adalah…', a: 'congklak', s: ['petak umpet', 'lompat tali'], p: 'Congklak memakai papan berlubang dan biji.', l: 2 },
      { t: 'Permainan yang berjalan tinggi di atas bambu adalah…', a: 'egrang', s: ['kelereng', 'engklek'], p: 'Egrang dimainkan dengan berjalan di atas dua batang bambu.', l: 2 },
      { t: 'Permainan bersembunyi lalu dicari teman disebut…', a: 'petak umpet', s: ['gobak sodor', 'egrang'], p: 'Petak umpet: satu anak mencari teman yang bersembunyi.' },
      { t: 'Permainan memakai bola kecil dari kaca yang dijentikkan jari adalah…', a: 'kelereng', s: ['gasing', 'congklak'], p: 'Kelereng dijentikkan dengan jari.', g: '🔮' },
      { t: 'Permainan melompat dengan tali karet atau tali panjang adalah…', a: 'lompat tali', s: ['petak umpet', 'kelereng'], p: 'Lompat tali dimainkan dengan melompati tali.', g: '🪢' },
      { t: 'Permainan tradisional baik untuk…', a: 'sehat dan melatih kebersamaan', s: ['membuat marah', 'membuat sendirian'], p: 'Bermain bersama membuat tubuh sehat dan pertemanan erat.', l: 3 },
      { t: 'Permainan yang diterbangkan di langit dengan benang adalah…', a: 'layangan', s: ['gasing', 'engklek'], p: 'Layangan diterbangkan dengan tiupan angin.', g: '🪁' },
    ],
    [
      { t: 'Gobak sodor adalah permainan tradisional.', ok: true, p: 'Benar.' },
      { t: 'Congklak dimainkan sendirian di lapangan bola.', ok: false, p: 'Salah. Congklak biasanya dimainkan berdua memakai papan.', l: 2 },
    ],
  )

  add(
    'makanan',
    [
      { t: 'Makanan khas Betawi yang terbuat dari telur dan beras ketan adalah…', a: 'kerak telor', s: ['bir pletok', 'asinan'], p: 'Kerak telor dibuat dari telur, beras ketan, dan serundeng.', l: 2, g: '🍳' },
      { t: 'Minuman khas Betawi dari jahe dan rempah adalah…', a: 'bir pletok', s: ['kerak telor', 'soto'], p: 'Bir pletok adalah minuman jahe rempah yang tidak beralkohol.', l: 2 },
      { t: 'Soto yang menjadi makanan khas Jakarta adalah soto…', a: 'Betawi', s: ['Padang', 'Lamongan'], p: 'Soto Betawi berkuah gurih khas Jakarta.', g: '🍲' },
      { t: 'Makanan khas Betawi yang berisi tahu, lontong, dan bumbu kacang adalah…', a: 'ketoprak', s: ['dodol', 'kue rangi'], p: 'Ketoprak memakai tahu, lontong, bihun, dan bumbu kacang.', l: 3 },
      { t: 'Kue yang manis dan kenyal khas Betawi adalah…', a: 'dodol Betawi', s: ['soto Betawi', 'asinan sayur'], p: 'Dodol Betawi manis dan kenyal.', l: 2 },
      { t: 'Kue rangi dibuat dengan kelapa dan…', a: 'gula merah', s: ['cabai rawit', 'ikan asin'], p: 'Kue rangi disajikan dengan gula merah cair.', l: 3 },
      { t: 'Nasi uduk adalah nasi yang dimasak dengan…', a: 'santan', s: ['es batu', 'cuka'], p: 'Nasi uduk gurih karena dimasak dengan santan.', l: 3 },
      { t: 'Asinan Betawi rasanya…', a: 'asam, manis, dan segar', s: ['sangat pahit', 'hambar sekali'], p: 'Asinan Betawi asam manis dan segar.', l: 3 },
      { t: 'Makanan khas Betawi adalah…', a: 'kerak telor', s: ['sate madura', 'papeda'], p: 'Kerak telor adalah makanan khas Betawi.', g: '🍳' },
    ],
    [
      { t: 'Bir pletok adalah minuman dari jahe dan rempah-rempah.', ok: true, p: 'Benar.', l: 2 },
      { t: 'Kerak telor dibuat dari telur.', ok: true, p: 'Benar. Kerak telor memakai telur dan beras ketan.' },
    ],
  )

  add(
    'kesenian',
    [
      { t: 'Boneka raksasa yang diarak dalam pesta Betawi adalah…', a: 'ondel-ondel', s: ['wayang', 'angklung'], p: 'Ondel-ondel adalah boneka besar khas Betawi.', g: '🎭' },
      { t: 'Ondel-ondel biasanya digerakkan oleh…', a: 'orang di dalamnya', s: ['mesin besar', 'angin'], p: 'Ondel-ondel dipikul dan digerakkan oleh orang dari dalamnya.', l: 2 },
      { t: 'Sandiwara khas Betawi yang penuh lelucon disebut…', a: 'lenong', s: ['wayang kulit', 'ketoprak'], p: 'Lenong adalah teater rakyat Betawi yang lucu.', l: 2, g: '🎬' },
      { t: 'Musik Betawi yang dimainkan dengan alat tiup disebut…', a: 'tanjidor', s: ['angklung', 'gamelan'], p: 'Tanjidor memakai alat musik tiup seperti terompet.', l: 3, g: '🎺' },
      { t: 'Musik Betawi yang memadukan gambang dan kromong adalah…', a: 'gambang kromong', s: ['sasando', 'kolintang'], p: 'Gambang kromong adalah musik Betawi.', l: 3 },
      { t: 'Pertunjukan silat dan berbalas pantun saat menyambut pengantin Betawi disebut…', a: 'palang pintu', s: ['kerak telor', 'gobak sodor'], p: 'Palang pintu adalah seni silat dan pantun.', l: 3 },
      { t: 'Tari khas Betawi yang ceria dan sering dibawakan di acara Jakarta adalah tari…', a: 'Yapong', s: ['Pendet', 'Saman'], p: 'Tari Yapong adalah tari Betawi yang ceria.', l: 3 },
      { t: 'Kesenian daerah perlu kita…', a: 'lestarikan', s: ['lupakan', 'rusak'], p: 'Kita lestarikan agar kesenian tidak hilang.', l: 2 },
    ],
    [
      { t: 'Ondel-ondel adalah kesenian dari Betawi.', ok: true, p: 'Benar.' },
      { t: 'Lenong adalah makanan khas Betawi.', ok: false, p: 'Salah. Lenong adalah sandiwara (teater) rakyat Betawi.', l: 2 },
    ],
  )

  return out
}

export const BANK_PLBJ: Question[] = build()
