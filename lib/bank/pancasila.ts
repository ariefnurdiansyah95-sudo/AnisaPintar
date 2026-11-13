import type { Question } from '../types'
import { pickDistinct, pilihan } from './helpers'
import { manual, type PQ } from './manual'

const M = 'pancasila' as const

const SILA = [
  'Ketuhanan Yang Maha Esa',
  'Kemanusiaan yang Adil dan Beradab',
  'Persatuan Indonesia',
  'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
  'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
]
const LAMBANG: [string, string][] = [
  ['bintang', '⭐'],
  ['rantai', '⛓️'],
  ['pohon beringin', '🌳'],
  ['kepala banteng', '🐂'],
  ['padi dan kapas', '🌾'],
]
const ORD = ['pertama', 'kedua', 'ketiga', 'keempat', 'kelima']

function build(): Question[] {
  const out: Question[] = []

  // ---- sila ----
  const sila: PQ[] = [
    { t: 'Pancasila memiliki berapa sila?', a: '5', s: ['3', '4', '6'], p: 'Pancasila terdiri dari 5 sila.' },
  ]
  SILA.forEach((s, i) => {
    sila.push({
      t: `Sila ${ORD[i]} Pancasila berbunyi…`,
      a: s,
      s: SILA.filter((x) => x !== s && (i === 3 ? true : x.length < 60)).slice(0, 2),
      p: `Sila ke-${i + 1} berbunyi: ${s}.`,
      l: i === 3 ? 2 : 1,
    })
    sila.push({
      t: `"${i === 3 ? 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan…' : s}" adalah sila ke…`,
      a: String(i + 1),
      s: ['1', '2', '3', '4', '5'].filter((x) => x !== String(i + 1)).slice(0, 3),
      p: `Itu adalah sila ke-${i + 1}.`,
      l: 2,
    })
  })
  sila.push(
    { t: 'Berdoa sebelum belajar sesuai dengan sila ke…', a: '1', s: ['3', '4', '5'], p: 'Berdoa berarti percaya kepada Tuhan. Itu sila ke-1: Ketuhanan Yang Maha Esa.', l: 2 },
    { t: 'Menolong teman yang jatuh sesuai dengan sila ke…', a: '2', s: ['1', '4', '5'], p: 'Menolong teman adalah sikap kemanusiaan. Itu sila ke-2.', l: 2 },
    { t: 'Bermain bersama teman dari berbagai daerah tanpa bertengkar sesuai dengan sila ke…', a: '3', s: ['1', '4', '5'], p: 'Bersatu dan rukun walau berbeda daerah adalah sila ke-3: Persatuan Indonesia.', l: 2 },
    { t: 'Memilih ketua kelas dengan musyawarah sesuai dengan sila ke…', a: '4', s: ['1', '2', '5'], p: 'Musyawarah (berunding bersama) adalah sila ke-4.', l: 3 },
    { t: 'Membagi kue sama rata untuk semua anggota keluarga sesuai dengan sila ke…', a: '5', s: ['1', '3', '4'], p: 'Bersikap adil kepada semua orang adalah sila ke-5: Keadilan Sosial.', l: 3 },
  )
  out.push(
    ...manual(M, 'pn', 'sila', sila, [
      { t: 'Pancasila adalah dasar negara Indonesia.', ok: true, p: 'Benar. Pancasila adalah dasar negara kita.' },
      { t: 'Sila pertama berbunyi "Persatuan Indonesia".', ok: false, p: 'Salah. Sila pertama berbunyi "Ketuhanan Yang Maha Esa".', l: 2 },
      { t: 'Musyawarah artinya berunding bersama untuk mencapai kesepakatan.', ok: true, p: 'Benar. Musyawarah adalah berunding bersama.', l: 2 },
      { t: 'Pancasila terdiri dari 4 sila.', ok: false, p: 'Salah. Pancasila terdiri dari 5 sila.' },
    ]),
  )

  // ---- lambang ----
  LAMBANG.forEach(([nama, emo], i) => {
    const lain = LAMBANG.filter((_, k) => k !== i)
    out.push(
      pilihan(
        { id: `pn-lambang-nama-${i + 1}`, mapel: M, topik: 'lambang', level: i < 3 ? 1 : 2 },
        `Lambang sila ke-${i + 1} adalah…`,
        nama,
        pickDistinct(lain.map((x) => x[0]), 2, [nama], 'lbn' + i),
        `Lambang sila ke-${i + 1} adalah ${nama}.`,
      ),
      pilihan(
        { id: `pn-lambang-no-${i + 1}`, mapel: M, topik: 'lambang', level: 2 },
        'Gambar ini adalah lambang sila ke…',
        String(i + 1),
        ['1', '2', '3', '4', '5'].filter((x) => x !== String(i + 1)).slice(0, 3),
        `${nama} adalah lambang sila ke-${i + 1}: ${SILA[i]}.`,
        { gambar: emo },
      ),
      pilihan(
        { id: `pn-lambang-gambar-${i + 1}`, mapel: M, topik: 'lambang', level: 1 },
        `Mana lambang sila ke-${i + 1}?`,
        emo,
        pickDistinct(lain.map((x) => x[1]), 2, [emo], 'lbg' + i),
        `Lambang sila ke-${i + 1} adalah ${nama} ${emo}.`,
        { tipe: 'gambar' },
      ),
    )
  })
  out.push(
    ...manual(M, 'pn', 'lambang', [
      { t: 'Lambang negara Indonesia adalah…', a: 'Garuda Pancasila', s: ['burung merpati', 'harimau'], p: 'Lambang negara Indonesia adalah burung Garuda Pancasila.', g: '🦅' },
      { t: '"Bhinneka Tunggal Ika" artinya…', a: 'berbeda-beda tetapi tetap satu', s: ['semua sama persis', 'maju terus pantang mundur'], p: 'Walau berbeda-beda suku dan budaya, kita tetap satu Indonesia.', l: 2 },
      { t: 'Burung Garuda mencengkeram pita yang bertuliskan…', a: 'Bhinneka Tunggal Ika', s: ['Pancasila', 'Merdeka'], p: 'Di pita Garuda tertulis semboyan Bhinneka Tunggal Ika.', l: 3, g: '🦅' },
    ]).map((q, i) => ({ ...q, id: `pn-lambang-umum-${i + 1}` })),
  )

  // ---- aturan ----
  out.push(
    ...manual(
      M,
      'pn',
      'aturan',
      [
        { t: 'Perbuatan yang baik di sekolah adalah…', a: 'membuang sampah di tempatnya', s: ['menyontek saat ulangan', 'mengejek teman'], p: 'Membuang sampah di tempatnya menjaga sekolah tetap bersih.' },
        { t: 'Kita datang ke sekolah…', a: 'tepat waktu', s: ['terlambat', 'sesuka hati'], p: 'Datang tepat waktu adalah aturan sekolah.' },
        { t: 'Saat guru menjelaskan pelajaran, kita harus…', a: 'mendengarkan dengan baik', s: ['mengobrol dengan teman', 'berlari-lari di kelas'], p: 'Mendengarkan membuat kita mengerti pelajaran.' },
        { t: 'Setelah bermain, mainan harus…', a: 'dirapikan kembali', s: ['dibiarkan berserakan', 'dilempar ke luar rumah'], p: 'Merapikan mainan adalah aturan di rumah.' },
        { t: 'Saat membeli jajan di kantin, kita harus…', a: 'antre', s: ['menyerobot', 'berteriak'], p: 'Antre membuat semua orang tertib dan adil.' },
        { t: 'Jika ingin meminjam barang teman, kita harus…', a: 'meminta izin', s: ['mengambil diam-diam', 'membawanya pulang'], p: 'Meminjam harus meminta izin dulu.' },
        { t: 'Saat guru masuk kelas, kita…', a: 'memberi salam', s: ['tidur', 'berlari keluar'], p: 'Memberi salam menunjukkan sopan santun.' },
        { t: 'Sebelum makan, kita sebaiknya…', a: 'mencuci tangan', s: ['bermain tanah', 'berlari-lari'], p: 'Mencuci tangan membuat kita sehat.' },
        { t: 'Lampu lalu lintas berwarna merah artinya…', a: 'berhenti', s: ['jalan terus', 'berlari'], p: 'Merah artinya berhenti. Ini aturan di jalan.', l: 2 },
        { t: 'Memakai seragam sekolah sesuai hari adalah…', a: 'aturan sekolah', s: ['aturan bermain', 'pilihan bebas'], p: 'Seragam dipakai sesuai aturan sekolah.', l: 2 },
        { t: 'Aturan di rumah dibuat oleh orang tua untuk…', a: 'kebaikan dan keamanan kita', s: ['membuat kita sedih', 'melarang bermain selamanya'], p: 'Aturan dibuat untuk kebaikan kita.', l: 3 },
        { t: 'Mengapa kita harus mematuhi aturan?', a: 'agar aman dan tertib', s: ['agar dimarahi', 'agar tidak perlu belajar'], p: 'Aturan membuat semua orang aman dan tertib.', l: 3 },
      ],
      [
        { t: 'Membuang sampah sembarangan adalah perbuatan baik.', ok: false, p: 'Salah. Sampah harus dibuang di tempat sampah.' },
        { t: 'Antre membuat semua orang tertib.', ok: true, p: 'Benar. Antre membuat semua orang mendapat giliran.' },
        { t: 'Boleh berlari-lari di dalam kelas.', ok: false, p: 'Salah. Berlari di kelas bisa membuat kita atau teman terluka.' },
        { t: 'Kita harus mencuci tangan sebelum makan.', ok: true, p: 'Benar. Mencuci tangan menjaga kita tetap sehat.' },
      ],
    ),
  )

  // ---- hak & kewajiban ----
  const HAK = [
    'Mendapat kasih sayang dari orang tua', 'Bermain bersama teman', 'Belajar di sekolah',
    'Mendapat makanan yang sehat', 'Mendapat perawatan ketika sakit', 'Beristirahat dan tidur cukup',
  ]
  const KEWAJIBAN = [
    'Merapikan tempat tidur sendiri', 'Mengerjakan PR', 'Menghormati orang tua dan guru',
    'Menjaga kebersihan kelas', 'Mematuhi aturan sekolah', 'Menyayangi adik',
  ]
  const hk: PQ[] = [
    ...HAK.map<PQ>((h, hi) => ({
      t: `"${h}" adalah… anak.`,
      a: 'hak',
      s: ['kewajiban'],
      p: `Hak adalah sesuatu yang berhak kita terima. "${h}" adalah hak anak.`,
      l: hi < 3 ? 1 : 2,
    })),
    ...KEWAJIBAN.map<PQ>((k, ki) => ({
      t: `"${k}" adalah… anak.`,
      a: 'kewajiban',
      s: ['hak'],
      p: `Kewajiban adalah tugas yang harus kita kerjakan. "${k}" adalah kewajiban anak.`,
      l: ki < 3 ? 1 : 2,
    })),
    { t: 'Hak adalah…', a: 'sesuatu yang berhak kita terima', s: ['tugas yang harus kita kerjakan', 'larangan'], p: 'Hak adalah sesuatu yang berhak kita terima.', l: 3 },
    { t: 'Kewajiban adalah…', a: 'tugas yang harus kita kerjakan', s: ['sesuatu yang berhak kita terima', 'hadiah dari guru'], p: 'Kewajiban adalah tugas yang harus kita kerjakan.', l: 3 },
  ]
  out.push(...manual(M, 'pn', 'hak-kewajiban', hk))

  // ---- rukun ----
  out.push(
    ...manual(
      M,
      'pn',
      'rukun',
      [
        { t: 'Saat teman jatuh, kita sebaiknya…', a: 'menolongnya', s: ['menertawakannya', 'pergi begitu saja'], p: 'Menolong teman adalah sikap yang baik.' },
        { t: 'Jika kita bertengkar dengan teman, kita sebaiknya…', a: 'meminta maaf dan berbaikan', s: ['saling memukul', 'saling mengejek'], p: 'Minta maaf dan berbaikan membuat kita rukun lagi.' },
        { t: 'Jika teman meminta maaf, kita sebaiknya…', a: 'memaafkannya', s: ['membalasnya', 'tidak mau bicara selamanya'], p: 'Memaafkan membuat hati tenang dan persahabatan baik.' },
        { t: 'Meminjamkan mainan kepada teman adalah sikap…', a: 'berbagi', s: ['pelit', 'marah'], p: 'Berbagi membuat teman senang.' },
        { t: 'Kata ajaib yang diucapkan ketika kita berbuat salah adalah…', a: 'maaf', s: ['tolong', 'terima kasih'], p: 'Ucapkan "maaf" ketika kita berbuat salah.' },
        { t: 'Kata ajaib yang diucapkan ketika menerima bantuan adalah…', a: 'terima kasih', s: ['maaf', 'permisi'], p: 'Ucapkan "terima kasih" ketika dibantu.' },
        { t: 'Kata ajaib yang diucapkan ketika meminta bantuan adalah…', a: 'tolong', s: ['maaf', 'terima kasih'], p: 'Ucapkan "tolong" ketika meminta bantuan.' },
        { t: 'Bekerja bersama membersihkan kelas disebut…', a: 'gotong royong', s: ['bertengkar', 'bermalas-malasan'], p: 'Gotong royong adalah bekerja bersama-sama.', l: 3 },
        { t: 'Teman kita punya kebiasaan yang berbeda. Kita harus…', a: 'saling menghormati', s: ['menjauhinya', 'mengejeknya'], p: 'Walau berbeda, kita tetap saling menghormati.', l: 3 },
        { t: 'Hidup rukun membuat kita…', a: 'senang dan damai', s: ['sering bertengkar', 'merasa sendirian'], p: 'Hidup rukun membuat suasana senang dan damai.', l: 2 },
      ],
      [
        { t: 'Kita boleh mengejek teman yang berbeda dengan kita.', ok: false, p: 'Salah. Kita harus menghargai perbedaan.' },
        { t: 'Gotong royong membuat pekerjaan lebih ringan.', ok: true, p: 'Benar. Kalau dikerjakan bersama, pekerjaan jadi ringan.', l: 2 },
        { t: 'Berbagi dengan teman membuat persahabatan semakin erat.', ok: true, p: 'Benar. Berbagi membuat teman senang.', l: 2 },
      ],
    ),
  )

  // ---- karakter ----
  out.push(
    ...manual(
      M,
      'pn',
      'karakter',
      [
        { t: 'Kamu menemukan uang teman yang jatuh. Yang harus kamu lakukan…', a: 'mengembalikannya', s: ['mengambilnya sendiri', 'membuangnya'], p: 'Mengembalikan barang milik orang lain adalah sikap jujur.' },
        { t: 'Adi tidak sengaja memecahkan gelas. Sikap jujur yang baik adalah…', a: 'mengaku kepada Ibu', s: ['menyalahkan adik', 'menyembunyikan pecahannya'], p: 'Orang jujur berani mengaku dan berkata benar.', l: 2 },
        { t: 'Bangun pagi dan berangkat sekolah tepat waktu menunjukkan sikap…', a: 'disiplin', s: ['malas', 'boros'], p: 'Disiplin berarti taat pada aturan dan waktu.', l: 2 },
        { t: 'Mengerjakan PR sendiri tanpa menyontek menunjukkan sikap…', a: 'jujur', s: ['curang', 'pelit'], p: 'Tidak menyontek adalah sikap jujur.', l: 2 },
        { t: 'Mengucapkan salam kepada guru menunjukkan sikap…', a: 'sopan', s: ['kasar', 'cuek'], p: 'Memberi salam adalah sikap sopan.' },
        { t: 'Merapikan tempat tidur sendiri menunjukkan sikap…', a: 'mandiri', s: ['manja', 'malas'], p: 'Mandiri berarti bisa mengerjakan sendiri.', l: 2 },
        { t: 'Menjaga mainan agar tidak rusak menunjukkan sikap…', a: 'bertanggung jawab', s: ['ceroboh', 'egois'], p: 'Bertanggung jawab berarti menjaga apa yang kita pakai.', l: 3 },
        { t: 'Membantu Ibu menyapu lantai menunjukkan sikap…', a: 'suka menolong', s: ['malas', 'pelit'], p: 'Membantu orang tua adalah sikap suka menolong.' },
        { t: 'Berbicara dengan lemah lembut kepada orang yang lebih tua menunjukkan sikap…', a: 'sopan', s: ['sombong', 'marah'], p: 'Bicara lemah lembut adalah sikap sopan.' },
        { t: 'Orang yang jujur selalu…', a: 'berkata benar', s: ['berbohong', 'menyalahkan orang lain'], p: 'Orang jujur selalu berkata benar.' },
        { t: 'Tidak membuang sampah sembarangan menunjukkan sikap…', a: 'peduli lingkungan', s: ['tidak peduli', 'pemalas'], p: 'Menjaga kebersihan menunjukkan kepedulian pada lingkungan.', l: 2 },
        { t: 'Adik menangis karena jatuh. Sikap yang baik adalah…', a: 'menghibur adik', s: ['marah kepada adik', 'mengejek adik'], p: 'Kita menyayangi dan menghibur adik.' },
      ],
      [
        { t: 'Berbohong adalah perbuatan yang baik.', ok: false, p: 'Salah. Kita harus selalu jujur.' },
        { t: 'Disiplin berarti taat pada aturan dan waktu.', ok: true, p: 'Benar. Disiplin berarti taat pada aturan dan waktu.', l: 2 },
        { t: 'Kita boleh mengambil barang teman tanpa izin.', ok: false, p: 'Salah. Kita harus meminta izin dulu.' },
      ],
    ),
  )

  return out
}

export const BANK_PANCASILA: Question[] = build()
