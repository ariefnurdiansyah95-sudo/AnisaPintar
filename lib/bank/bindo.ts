import type { Level, Question } from '../types'
import { makeRng } from '../rng'
import { benarSalah, cocok, pickDistinct, pilihan, susun } from './helpers'
import { BACAAN_BINDO } from './teks'
import { SUSUN_KALIMAT, bacaQuestions, kataKalimat } from './membaca'

const b = (id: string, topik: string, level: Level) => ({ id, mapel: 'bindo' as const, topik, level })

const BERITA = [
  'Ibu pergi ke pasar', 'Adik sedang tidur', 'Kucing itu berbulu putih', 'Aku suka makan buah',
  'Ayah membaca koran', 'Hari ini cuaca cerah', 'Kami belajar di sekolah', 'Burung bertengger di pohon',
  'Nenek menyiram bunga', 'Rina memakai topi merah',
]
const TANYA = [
  'Siapa namamu', 'Kamu mau makan apa', 'Di mana tasku', 'Kapan kita pergi ke taman', 'Berapa harga buku ini',
  'Apakah kamu sudah makan', 'Ke mana Ibu pergi', 'Bagaimana kabarmu', 'Siapa yang membawa payung',
  'Mengapa kamu menangis',
]
const SERU = [
  'Wah, bagus sekali', 'Hore, kita menang', 'Aduh, sakit sekali', 'Awas, ada mobil', 'Tolong, ada api',
  'Asyik, kita libur', 'Wah, kuenya enak sekali', 'Aduh, bajuku kotor', 'Hore, aku juara', 'Wah, besar sekali gajah itu',
]
const PERINTAH = [
  'Tolong tutup pintu itu.', 'Cucilah tanganmu sebelum makan.', 'Bacalah buku ini.', 'Rapikan tempat tidurmu.',
  'Buanglah sampah pada tempatnya.', 'Tolong ambilkan air minum.', 'Masukkan buku ke dalam tas.', 'Duduklah dengan tenang.',
]

const KAPITAL: string[][] = [
  ['Aku bermain bola.', 'aku bermain bola.', 'Aku Bermain Bola.'],
  ['Nama temanku Budi.', 'Nama temanku budi.', 'nama temanku Budi.'],
  ['Ibu pergi ke Jakarta.', 'Ibu pergi ke jakarta.', 'ibu pergi ke Jakarta.'],
  ['Dina membaca buku.', 'dina membaca buku.', 'Dina Membaca buku.'],
  ['Kami tinggal di Bogor.', 'Kami tinggal di bogor.', 'kami tinggal di Bogor.'],
  ['Ayah bekerja di Bandung.', 'ayah bekerja di Bandung.', 'Ayah bekerja di bandung.'],
  ['Adikku bernama Rani.', 'adikku bernama Rani.', 'Adikku bernama rani.'],
  ['Hari ini hari Senin.', 'hari ini hari Senin.', 'Hari ini hari senin.'],
  ['Pak Ahmad adalah guruku.', 'pak Ahmad adalah guruku.', 'Pak ahmad adalah guruku.'],
  ['Kita bermain di Monas.', 'Kita bermain di monas.', 'kita bermain di Monas.'],
  ['Tika pergi ke sekolah.', 'tika pergi ke sekolah.', 'Tika pergi ke Sekolah.'],
  ['Ulang tahunku bulan Mei.', 'Ulang tahunku bulan mei.', 'ulang tahunku bulan Mei.'],
]

// [kata, lawan, grup]
const LAWAN: [string, string, string][] = [
  ['besar', 'kecil', 'ukuran'], ['panjang', 'pendek', 'ukuran'], ['tinggi', 'rendah', 'ukuran'],
  ['tebal', 'tipis', 'ukuran'], ['ringan', 'berat', 'ukuran'],
  ['panas', 'dingin', 'waktu'], ['siang', 'malam', 'waktu'], ['baru', 'lama', 'waktu'],
  ['naik', 'turun', 'gerak'], ['masuk', 'keluar', 'gerak'], ['maju', 'mundur', 'gerak'],
  ['cepat', 'lambat', 'gerak'], ['buka', 'tutup', 'gerak'],
  ['terang', 'gelap', 'keadaan'], ['ramai', 'sepi', 'keadaan'], ['basah', 'kering', 'keadaan'], ['penuh', 'kosong', 'keadaan'],
  ['senang', 'sedih', 'rasa'], ['kenyang', 'lapar', 'rasa'], ['rajin', 'malas', 'rasa'],
  ['bersih', 'kotor', 'kondisi'], ['kuat', 'lemah', 'kondisi'], ['benar', 'salah', 'kondisi'], ['mudah', 'sulit', 'kondisi'],
  ['atas', 'bawah', 'posisi'], ['depan', 'belakang', 'posisi'], ['jauh', 'dekat', 'posisi'],
]

// [definisi, jawaban, pengecoh1, pengecoh2, level]
const DEF: [string, string, string, string, Level][] = [
  ['Dipakai untuk menulis di buku.', 'pensil', 'sendok', 'sisir', 1],
  ['Dipakai untuk makan nasi.', 'sendok', 'pensil', 'payung', 1],
  ['Dipakai untuk menyisir rambut.', 'sisir', 'gunting', 'sapu', 1],
  ['Dipakai agar tidak kehujanan.', 'payung', 'sisir', 'bantal', 1],
  ['Dipakai untuk menggosok gigi.', 'sikat gigi', 'sapu', 'gelas', 1],
  ['Dipakai untuk menyapu lantai.', 'sapu', 'sepatu', 'topi', 1],
  ['Dipakai untuk minum air.', 'gelas', 'sapu', 'gunting', 1],
  ['Dipakai untuk memotong kertas.', 'gunting', 'sendok', 'bantal', 1],
  ['Dipakai di kaki.', 'sepatu', 'topi', 'kacamata', 1],
  ['Dipakai di kepala untuk melindungi dari panas.', 'topi', 'sepatu', 'kaus kaki', 2],
  ['Tempat kita tidur.', 'kasur', 'kursi', 'meja', 1],
  ['Tempat kita belajar di sekolah.', 'kelas', 'dapur', 'kolam', 1],
  ['Tempat Ibu memasak.', 'dapur', 'kamar tidur', 'garasi', 1],
  ['Tempat mobil diparkir di rumah.', 'garasi', 'dapur', 'taman', 2],
  ['Hewan yang suaranya mengeong.', 'kucing', 'anjing', 'ayam', 1],
  ['Hewan yang suaranya menggonggong.', 'anjing', 'kucing', 'sapi', 1],
  ['Hewan yang bisa terbang tinggi.', 'burung', 'ikan', 'sapi', 1],
  ['Buah berwarna kuning dan bentuknya panjang.', 'pisang', 'apel', 'semangka', 2],
  ['Nama waktu ketika matahari terbit.', 'pagi', 'malam', 'sore', 2],
  ['Nama hari setelah hari Senin.', 'Selasa', 'Rabu', 'Minggu', 2],
]

const KATEGORI: [string, string, string, string, Level][] = [
  ['Mana yang termasuk BUAH?', 'apel', 'sepatu', 'meja', 1],
  ['Mana yang termasuk BUAH?', 'jeruk', 'sapu', 'topi', 1],
  ['Mana yang termasuk HEWAN?', 'kucing', 'kursi', 'mangga', 1],
  ['Mana yang termasuk HEWAN?', 'ayam', 'buku', 'payung', 1],
  ['Mana yang termasuk PAKAIAN?', 'baju', 'bola', 'sapi', 1],
  ['Mana yang termasuk PAKAIAN?', 'celana', 'sendok', 'pisang', 1],
  ['Mana yang termasuk ALAT TULIS?', 'pensil', 'piring', 'sapu', 1],
  ['Mana yang termasuk ALAT TULIS?', 'penghapus', 'sepatu', 'garpu', 2],
  ['Mana yang termasuk KENDARAAN?', 'sepeda', 'bantal', 'pisang', 1],
  ['Mana yang termasuk KENDARAAN?', 'bus', 'kursi', 'sendok', 2],
  ['Mana yang termasuk SAYUR?', 'wortel', 'sepatu', 'bola', 1],
  ['Mana yang termasuk ANGGOTA TUBUH?', 'tangan', 'meja', 'buku', 1],
]

function build(): Question[] {
  const out: Question[] = []
  const add = (...q: Question[]) => out.push(...q)

  // =============== TANDA BACA ===============
  const tandaOpsi = ['.', '?', '!', ',']
  const tanda: [string[], string, string, string, Level][] = [
    [BERITA, 'titik (.)', '.', 'Kalimat berita memberi tahu sesuatu dan diakhiri tanda titik (.).', 1],
    [TANYA, 'tanda tanya (?)', '?', 'Kalimat tanya menanyakan sesuatu dan diakhiri tanda tanya (?).', 1],
    [SERU, 'tanda seru (!)', '!', 'Kalimat seru menyatakan rasa kagum, kaget, atau sakit, dan diakhiri tanda seru (!).', 2],
  ]
  for (const [list, , tnd, pb, lv] of tanda) {
    list.forEach((k, i) => {
      add(
        pilihan(
          b(`bi-tb-${tnd === '.' ? 'titik' : tnd === '?' ? 'tanya' : 'seru'}-${i + 1}`, 'tanda-baca', tnd === '!' && i >= 5 ? 3 : lv),
          `Pilih tanda baca yang tepat di akhir kalimat: ${k} ___`,
          tnd,
          tandaOpsi.filter((x) => x !== tnd).slice(0, 3),
          `"${k}${tnd}" ${pb}`,
        ),
      )
    })
  }
  const namaTanda: [string, string, string[], string][] = [
    ['.', 'titik', ['koma', 'tanda tanya', 'tanda seru'], 'Tanda "." namanya titik.'],
    [',', 'koma', ['titik', 'tanda tanya', 'tanda seru'], 'Tanda "," namanya koma.'],
    ['?', 'tanda tanya', ['titik', 'koma', 'tanda seru'], 'Tanda "?" namanya tanda tanya.'],
    ['!', 'tanda seru', ['titik', 'koma', 'tanda tanya'], 'Tanda "!" namanya tanda seru.'],
  ]
  for (const [t, a, s, p] of namaTanda) {
    add(pilihan(b(`bi-tb-nama-${a.replace(' ', '-')}`, 'tanda-baca', 1), `Tanda baca "${t}" namanya…`, a, s, p, { gambar: t }))
  }
  add(
    benarSalah(b('bi-tb-bs-1', 'tanda-baca', 1), 'Benar atau salah? Kalimat tanya diakhiri dengan tanda tanya (?).', true, 'Benar. Kalimat tanya diakhiri tanda tanya (?).'),
    benarSalah(b('bi-tb-bs-2', 'tanda-baca', 1), 'Benar atau salah? Kalimat berita diakhiri dengan tanda tanya (?).', false, 'Salah. Kalimat berita diakhiri titik (.).'),
    benarSalah(b('bi-tb-bs-3', 'tanda-baca', 2), 'Benar atau salah? Kalimat seru diakhiri dengan tanda seru (!).', true, 'Benar. Kalimat seru diakhiri tanda seru (!).'),
    benarSalah(b('bi-tb-bs-4', 'tanda-baca', 2), 'Benar atau salah? Kalimat "Apa kabar" diakhiri titik (.).', false, 'Salah. "Apa kabar" adalah pertanyaan, jadi diakhiri tanda tanya (?).'),
  )

  // =============== JENIS KALIMAT ===============
  const jenis: [string, string, Level][] = [
    ['kalimat berita', 'Kalimat berita memberi tahu sesuatu.', 1],
    ['kalimat tanya', 'Kalimat tanya menanyakan sesuatu.', 1],
    ['kalimat perintah', 'Kalimat perintah meminta orang melakukan sesuatu.', 2],
    ['kalimat seru', 'Kalimat seru menyatakan perasaan seperti kagum, kaget, atau sakit.', 2],
  ]
  const semuaJenis = jenis.map((j) => j[0])
  const dataJenis: [string, string, string, Level][] = [
    ...BERITA.map((k) => [k + '.', 'kalimat berita', 'berita', 1] as [string, string, string, Level]),
    ...TANYA.map((k) => [k + '?', 'kalimat tanya', 'tanya', 1] as [string, string, string, Level]),
    ...PERINTAH.map((k) => [k, 'kalimat perintah', 'perintah', 2] as [string, string, string, Level]),
    ...SERU.map((k) => [k + '!', 'kalimat seru', 'seru', 2] as [string, string, string, Level]),
  ]
  const counter: Record<string, number> = {}
  for (const [k, jns, key, lv] of dataJenis) {
    counter[key] = (counter[key] ?? 0) + 1
    add(
      pilihan(
        b(`bi-jk-${key}-${counter[key]}`, 'jenis-kalimat', key === 'perintah' && counter[key] > 4 ? 3 : lv),
        `Kalimat "${k}" termasuk…`,
        jns,
        semuaJenis.filter((x) => x !== jns),
        `${jenis.find((j) => j[0] === jns)?.[1]} Jadi "${k}" adalah ${jns}.`,
      ),
    )
  }
  {
    const r = makeRng('jk-cocok')
    for (let i = 0; i < 12; i++) {
      const ks = r.shuffle(['berita', 'tanya', 'seru'])
      const pairs: [string, string][] = ks.map((x) => {
        const list = x === 'berita' ? BERITA : x === 'tanya' ? TANYA : SERU
        const mark = x === 'berita' ? '.' : x === 'tanya' ? '?' : '!'
        return [r.pick(list) + mark, `kalimat ${x}`] as [string, string]
      })
      add(
        cocok(
          b(`bi-jk-cocok-${i + 1}`, 'jenis-kalimat', 2),
          'Cocokkan kalimat dengan jenisnya.',
          pairs,
          pairs.map((p) => `"${p[0]}" adalah ${p[1]}`).join('. ') + '.',
        ),
      )
    }
  }

  // =============== HURUF KAPITAL ===============
  KAPITAL.forEach((k, i) => {
    const [benar, ...salah] = k
    add(
      pilihan(
        b(`bi-hk-${i + 1}`, 'huruf-kapital', i < 5 ? 1 : i < 9 ? 2 : 3),
        'Pilih kalimat yang penulisan huruf kapitalnya BENAR.',
        benar,
        salah,
        `Awal kalimat dan nama orang, kota, hari, atau bulan diawali huruf kapital. Yang benar: "${benar}"`,
      ),
    )
  })
  add(
    benarSalah(b('bi-hk-bs-1', 'huruf-kapital', 1), 'Benar atau salah? Huruf pertama pada awal kalimat ditulis dengan huruf kapital.', true, 'Benar. Awal kalimat selalu diawali huruf kapital.'),
    benarSalah(b('bi-hk-bs-2', 'huruf-kapital', 1), 'Benar atau salah? Nama orang diawali dengan huruf kecil.', false, 'Salah. Nama orang diawali huruf kapital, misalnya "Budi".'),
    benarSalah(b('bi-hk-bs-3', 'huruf-kapital', 1), 'Benar atau salah? Nama kota seperti "Jakarta" diawali huruf kapital.', true, 'Benar. Nama kota diawali huruf kapital.'),
    benarSalah(b('bi-hk-bs-4', 'huruf-kapital', 2), 'Benar atau salah? Nama hari seperti "senin" ditulis dengan huruf kecil.', false, 'Salah. Nama hari ditulis "Senin" dengan huruf kapital di awal.'),
    benarSalah(b('bi-hk-bs-5', 'huruf-kapital', 2), 'Benar atau salah? Nama bulan seperti "Mei" diawali huruf kapital.', true, 'Benar. Nama bulan diawali huruf kapital.'),
    benarSalah(b('bi-hk-bs-6', 'huruf-kapital', 2), 'Benar atau salah? Kata "kucing" dalam kalimat "Aku punya kucing." harus ditulis "Kucing".', false, 'Salah. "kucing" bukan nama dan tidak di awal kalimat, jadi ditulis dengan huruf kecil.'),
  )

  // =============== SUSUN KALIMAT ===============
  SUSUN_KALIMAT.forEach((s, i) => {
    const ws = kataKalimat(s.k)
    add(
      susun(
        b(`bi-sk-susun-${i + 1}`, 'susun-kalimat', ws.length <= 3 ? 1 : i >= 14 ? 3 : 2),
        'Susun kata-kata menjadi kalimat yang benar.',
        ws,
        `Kalimat yang benar: "${s.k}" Ingat: kalimat dimulai dengan huruf kapital dan diakhiri tanda baca.`,
        { gambar: s.e },
      ),
    )
  })

  // =============== KOSAKATA ===============
  LAWAN.forEach(([a, c, g], i) => {
    const lv: Level = i < 10 ? 1 : i < 18 ? 2 : 3
    const pool = LAWAN.filter((x) => x[2] !== g).flatMap((x) => [x[0], x[1]])
    add(
      pilihan(
        b(`bi-kv-lawan-${a}`, 'kosakata', lv),
        `Lawan kata "${a}" adalah…`,
        c,
        pickDistinct(pool, 2, [c, a], 'lw' + a),
        `Lawan kata "${a}" adalah "${c}".`,
      ),
      pilihan(
        b(`bi-kv-lawan-${c}`, 'kosakata', lv),
        `Lawan kata "${c}" adalah…`,
        a,
        pickDistinct(pool, 2, [c, a], 'lw2' + c),
        `Lawan kata "${c}" adalah "${a}".`,
      ),
    )
  })
  {
    const r = makeRng('kv-cocok')
    for (let i = 0; i < 10; i++) {
      const used = new Set<string>()
      const set: [string, string, string][] = []
      for (const p of r.shuffle(LAWAN)) {
        if (!used.has(p[2])) {
          used.add(p[2])
          set.push(p)
        }
        if (set.length === 3) break
      }
      add(
        cocok(
          b(`bi-kv-cocok-${i + 1}`, 'kosakata', 2),
          'Cocokkan kata dengan lawan katanya.',
          set.map((p) => [p[0], p[1]] as [string, string]),
          set.map((p) => `lawan kata "${p[0]}" adalah "${p[1]}"`).join('; ') + '.',
        ),
      )
    }
  }
  DEF.forEach(([d, a, s1, s2, lv], i) =>
    add(pilihan(b(`bi-kv-def-${i + 1}`, 'kosakata', lv), `${d} Apa namanya?`, a, [s1, s2], `${d} Jadi jawabannya "${a}".`)),
  )
  KATEGORI.forEach(([t, a, s1, s2, lv], i) =>
    add(pilihan(b(`bi-kv-kat-${i + 1}`, 'kosakata', lv), t, a, [s1, s2], `"${a}" termasuk jawaban yang tepat untuk pertanyaan itu.`)),
  )

  // =============== PEMAHAMAN BACAAN ===============
  for (const t of BACAAN_BINDO) add(...bacaQuestions(t, 'pemahaman', 'bindo', 'bi-pm', t.id))

  void benarSalah
  return out
}

export const BANK_BINDO: Question[] = build()
