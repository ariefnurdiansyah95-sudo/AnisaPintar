// Soal PRAKTEK: anak menyusun huruf/suku kata sendiri, mengetik jawaban, dan menulis dari dikte.
// Dibangkitkan dari daftar kata sehingga jawaban pasti satu-satunya yang benar.
import type { Level, MapelId, Question } from '../types'
import { makeRng } from '../rng'
import { isian, susun } from './helpers'
import { SUSUN_KALIMAT, DUA_TERBUKA, KONSONAN, NG, NY, TIGA, type Kata } from './membaca'
import { ANGKA, BUAH, HEWAN, KELUARGA, WARNA } from './inggris'

const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('')
const huruf = (w: string) => Array.from(w.toLowerCase()).filter((c) => /[a-z]/.test(c))
const EN = { lang: 'en-US' as const }

function pengecohHuruf(id: string, kata: string[], n: number): string[] {
  const r = makeRng('ph:' + id)
  return r.shuffle(ABC.filter((c) => !kata.includes(c))).slice(0, n)
}

interface Item { id: string; mapel: MapelId; topik: string; kata: string; e?: string; clue?: string; lang?: 'id-ID' | 'en-US'; arti?: string }

/** Susun huruf menjadi satu kata (dengan gambar/petunjuk). */
function susunHuruf(it: Item, out: Question[]) {
  const t = huruf(it.kata)
  if (t.length < 3 || t.length > 10) return
  const level: Level = t.length <= 4 ? 1 : t.length <= 6 ? 2 : 3
  const eng = it.lang === 'en-US'
  const teks = eng
    ? `Susun huruf menjadi nama gambar ini dalam bahasa Inggris.${it.arti ? ` (${it.arti})` : ''}`
    : `Susun huruf menjadi namanya.${it.clue ? ` Petunjuk: ${it.clue}.` : ''}`
  const peng = level >= 2 ? pengecohHuruf(it.id, t, level === 2 ? 1 : 2) : []
  out.push(
    susun({ id: `pk-h-${it.id}`, mapel: it.mapel, topik: it.topik, level }, teks, t,
      `Hurufnya disusun menjadi "${it.kata}": ${t.join(' - ')}.`,
      { gambar: it.e, gabung: true, pengecoh: peng.length ? peng : undefined, suara: eng ? { teks: it.kata, ...EN } : undefined }),
  )
}

/** Ketik nama gambar / dengarkan lalu ketik. */
function ketik(it: Item, out: Question[]) {
  const t = huruf(it.kata)
  if (t.length < 3) return
  const eng = it.lang === 'en-US'
  if (it.e) {
    out.push(
      isian({ id: `pk-k-${it.id}`, mapel: it.mapel, topik: it.topik, level: 3 },
        `Ketik nama gambar ini${eng ? ' dalam bahasa Inggris' : ''}. Kata ini punya ${t.length} huruf.${it.clue ? ` Petunjuk: ${it.clue}.` : ''}`,
        it.kata.toLowerCase(), `Namanya "${it.kata}". Hurufnya: ${t.join(' - ')}.`,
        { gambar: it.e }),
    )
  }
  out.push(
    isian({ id: `pk-d-${it.id}`, mapel: it.mapel, topik: it.topik, level: 3 },
      'Dengarkan, lalu ketik kata yang kamu dengar.',
      it.kata.toLowerCase(), `Kata yang kamu dengar adalah "${it.kata}". Hurufnya: ${t.join(' - ')}.`,
      { gambar: '🔊', suara: { teks: it.kata, lang: it.lang ?? 'id-ID' } }),
  )
}

function tanpaTabrakan(items: Item[]): Item[] {
  const g = new Map<string, number>()
  for (const i of items) { const k = huruf(i.kata).sort().join(''); g.set(k, (g.get(k) ?? 0) + 1) }
  return items.filter((i) => g.get(huruf(i.kata).sort().join('')) === 1)
}

function build(): Question[] {
  const out: Question[] = []

  // ===== Membaca & mengeja =====
  const grup: [Kata[], string][] = [[DUA_TERBUKA, 'gabung'], [KONSONAN, 'konsonan'], [NG, 'gabungan-huruf'], [NY, 'gabungan-huruf'], [TIGA, 'tiga-suku']]
  const semuaSuku = grup.flatMap(([l]) => l.flatMap((k) => k.s))
  const TIDAK_ADA_GAMBAR_JELAS = new Set(['makan', 'sayur']) // emoji bisa berarti hal lain
  for (const [list, topik] of grup) {
    const items: Item[] = list.map((k) => ({ id: `mb-${k.k}`, mapel: 'membaca', topik, kata: k.k, e: TIDAK_ADA_GAMBAR_JELAS.has(k.k) ? undefined : k.e }))
    // 1) susun suku kata → kata
    for (const k of list) {
      if (new Set(k.s).size < 2) continue // mis. su-su: semua keping sama
      const level: Level = k.s.length >= 3 ? 3 : topik === 'gabung' ? 1 : 2
      const r = makeRng('psk:' + k.k)
      const peng = level >= 2 ? [r.pick(semuaSuku.filter((s) => !k.s.includes(s)))] : []
      const e = TIDAK_ADA_GAMBAR_JELAS.has(k.k) ? undefined : k.e
      out.push(
        susun({ id: `pk-s-${k.k}`, mapel: 'membaca', topik, level },
          e ? 'Susun suku kata menjadi nama gambar ini.' : 'Susun suku kata menjadi satu kata.',
          k.s, `Suku katanya ${k.s.join(' + ')}. Digabung menjadi "${k.k}".`,
          { gambar: e, gabung: true, pengecoh: peng.length ? peng : undefined, suara: { teks: k.k } }),
      )
      // topik suku-kata juga mendapat latihan menyusun
      out.push(
        susun({ id: `pk-s2-${k.k}`, mapel: 'membaca', topik: 'suku-kata', level: Math.min(3, level + (k.s.length > 2 ? 0 : 0)) as Level },
          'Dengarkan katanya, lalu susun suku katanya.', k.s, `Kata "${k.k}" terdiri dari ${k.s.join(' + ')}.`,
          { gambar: '🔊', gabung: true, suara: { teks: k.k }, pengecoh: level >= 2 ? [r.pick(semuaSuku.filter((s) => !k.s.includes(s)))] : undefined }),
      )
    }
    // 2) susun huruf, ketik gambar, dikte
    const aman = tanpaTabrakan(items.filter((i) => huruf(i.kata).length <= 7 || topik === 'tiga-suku'))
    aman.forEach((i) => susunHuruf(i, out))
    items.forEach((i) => ketik(i, out))
  }

  // ===== Dikte kalimat: dengarkan lalu susun kata =====
  SUSUN_KALIMAT.forEach((s, i) => {
    const kata = s.k.replace(/\.$/, '').split(' ')
    if (new Set(kata).size < 2) return
    out.push(
      susun({ id: `pk-dk-${i}`, mapel: 'membaca', topik: 'kalimat', level: 3 }, 'Dengarkan kalimatnya, lalu susun kata-katanya.', kata,
        `Kalimatnya: "${s.k}"`, { gambar: '🔊', suara: { teks: s.k } }),
    )
  })

  // ===== Bahasa Inggris =====
  const inggris = (list: [string, string, string, boolean?][], topik: string, pfx: string) => {
    const items: Item[] = list.filter((x) => /^[a-z]+$/.test(x[0])).map(([en, id, e]) => ({ id: `${pfx}-${en}`, mapel: 'inggris', topik, kata: en, e, lang: 'en-US', arti: id }))
    tanpaTabrakan(items).forEach((i) => susunHuruf(i, out))
    items.forEach((i) => ketik(i, out))
  }
  inggris(HEWAN, 'animals', 'an')
  inggris(BUAH, 'fruits', 'fr')
  inggris(WARNA, 'colors', 'co')
  KELUARGA.filter((x) => /^[a-z]+$/.test(x[0])).forEach(([en, id]) => {
    const t = huruf(en)
    out.push(
      susun({ id: `pk-h-fa-${en}`, mapel: 'inggris', topik: 'family', level: t.length <= 5 ? 1 : 2 }, `Susun huruf: "${id}" dalam bahasa Inggris.`, t,
        `"${id}" dalam bahasa Inggris adalah ${en}.`, { gabung: true, suara: { teks: en, ...EN }, pengecoh: t.length > 5 ? pengecohHuruf('fa' + en, t, 1) : undefined }),
      isian({ id: `pk-k-fa-${en}`, mapel: 'inggris', topik: 'family', level: 3 }, `Ketik dalam bahasa Inggris: "${id}". Kata ini punya ${t.length} huruf.`, en, `"${id}" adalah ${en}.`),
    )
  })
  ANGKA.slice(1, 11).forEach((en, i) => {
    const n = i + 1
    const t = huruf(en)
    out.push(
      susun({ id: `pk-h-nu-${en}`, mapel: 'inggris', topik: 'numbers', level: t.length <= 4 ? 1 : 2 }, `Susun huruf menjadi angka ${n} dalam bahasa Inggris.`, t,
        `Angka ${n} dalam bahasa Inggris adalah ${en}.`, { gambar: `hitung:⭐:${n}`, gabung: true, suara: { teks: en, ...EN }, pengecoh: t.length > 4 ? pengecohHuruf('nu' + en, t, 1) : undefined }),
      isian({ id: `pk-k-nu-${en}`, mapel: 'inggris', topik: 'numbers', level: 3 }, `Ketik angka ${n} dalam bahasa Inggris.`, en, `Angka ${n} adalah ${en}.`, { gambar: `hitung:🍎:${n}` }),
    )
  })

  // ===== Matematika: menulis angka dengan huruf =====
  const ANGKA_ID = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh']
  ANGKA_ID.slice(1).forEach((w, i) => {
    const n = i + 1
    const t = huruf(w)
    out.push(
      susun({ id: `pk-h-an-${w}`, mapel: 'matematika', topik: 'angka', level: t.length <= 4 ? 1 : 2 }, `Susun huruf menjadi cara membaca angka ${n}.`, t,
        `Angka ${n} dibaca "${w}".`, { gambar: `hitung:🍎:${n}`, gabung: true, pengecoh: t.length > 4 ? pengecohHuruf('an' + w, t, 1) : undefined, suara: { teks: w } }),
      isian({ id: `pk-k-an-${w}`, mapel: 'matematika', topik: 'angka', level: 3 }, `Tulis angka ${n} dengan huruf.`, w, `Angka ${n} ditulis "${w}".`, { gambar: `hitung:🍎:${n}` }),
    )
  })

  // ===== Pelajaran lain: susun huruf bergambar + petunjuk =====
  const lain: [MapelId, string, [string, string, string][]][] = [
    ['ipas', 'tubuh', [['mata', '👁️', 'Bagian tubuh untuk melihat'], ['hidung', '👃', 'Bagian tubuh untuk mencium bau'], ['telinga', '👂', 'Bagian tubuh untuk mendengar'], ['tangan', '✋', 'Bagian tubuh untuk memegang dan menulis'], ['mulut', '👄', 'Bagian tubuh untuk makan dan berbicara'], ['gigi', '🦷', 'Bagian dalam mulut untuk mengunyah']]],
    ['ipas', 'hewan', [['kucing', '🐱', 'Hewan peliharaan yang berbunyi meong'], ['ayam', '🐔', 'Hewan yang bertelur dan berkokok'], ['burung', '🐦', 'Hewan yang bisa terbang dan punya sayap'], ['kupu', '🦋', 'Serangga bersayap indah, berasal dari ulat'], ['sapi', '🐄', 'Hewan penghasil susu'], ['bebek', '🦆', 'Hewan yang berbunyi kwek kwek dan suka berenang']]],
    ['ipas', 'tumbuhan', [['bunga', '🌸', 'Bagian tumbuhan yang indah dan harum'], ['daun', '🍃', 'Bagian tumbuhan yang berwarna hijau'], ['pohon', '🌳', 'Tumbuhan besar berbatang kayu'], ['akar', '🌱', 'Bagian tumbuhan di dalam tanah yang menyerap air']]],
    ['ipas', 'cuaca', [['hujan', '🌧️', 'Air yang jatuh dari awan'], ['angin', '💨', 'Udara yang bergerak, membuat layangan terbang'], ['pelangi', '🌈', 'Lengkung tujuh warna setelah hujan'], ['awan', '☁️', 'Putih di langit, tempat hujan berasal']]],
    ['ipas', 'alam', [['bulan', '🌙', 'Terlihat di langit malam'], ['bintang', '⭐', 'Titik bercahaya di langit malam'], ['gunung', '⛰️', 'Tanah yang sangat tinggi menjulang']]],
    ['pancasila', 'lambang', [['bintang', '⭐', 'Lambang sila ke-1'], ['rantai', '⛓️', 'Lambang sila ke-2'], ['beringin', '🌳', 'Pohon lambang sila ke-3'], ['banteng', '🐂', 'Lambang sila ke-4'], ['garuda', '🦅', 'Burung lambang negara Indonesia']]],
    ['pancasila', 'karakter', [['jujur', '🤥', 'Sifat berkata benar dan tidak berbohong'], ['sopan', '🙇', 'Sifat berbicara dan bersikap santun kepada orang lain'], ['disiplin', '⏰', 'Sifat tepat waktu dan menaati aturan'], ['peduli', '🤝', 'Sifat ingin membantu orang yang kesusahan']]],
    ['pancasila', 'rukun', [['berbagi', '🍪', 'Memberikan sebagian milikmu kepada teman'], ['menolong', '🆘', 'Membantu orang yang membutuhkan']]],
    ['plbj', 'kesenian', [['lenong', '🎭', 'Sandiwara rakyat Betawi yang lucu'], ['tanjidor', '🎺', 'Musik Betawi yang dimainkan dengan alat tiup'], ['yapong', '💃', 'Nama tari Betawi yang ceria']]],
    ['plbj', 'makanan', [['soto', '🍲', 'Makanan Betawi berkuah gurih dengan daging'], ['dodol', '🍬', 'Kue Betawi manis dan kenyal'], ['ketoprak', '🥜', 'Makanan Betawi berisi tahu, lontong, dan bumbu kacang']]],
    ['plbj', 'permainan', [['congklak', '🕳️', 'Permainan tradisional memakai biji dan papan berlubang'], ['engklek', '🦘', 'Permainan melompat di petak-petak gambar'], ['egrang', '🎋', 'Permainan berjalan di atas bambu tinggi']]],
    ['plbj', 'ornamen', [['tumpal', '🔺', 'Hiasan segitiga berjajar pada kain Betawi']]],
    ['plbj', 'budaya', [['monas', '🗼', 'Tugu terkenal di Jakarta']]],
    ['seni', 'warna', [['merah', '🔴', 'Warna apel dan cabai'], ['kuning', '🟡', 'Warna pisang matang'], ['biru', '🔵', 'Warna langit cerah'], ['hijau', '🟢', 'Warna daun'], ['ungu', '🟣', 'Warna terung'], ['oranye', '🟠', 'Warna jeruk']]],
  ]
  for (const [mapel, topik, list] of lain) {
    const items: Item[] = list.map(([k, e, clue]) => ({ id: `${mapel}-${topik}-${k}`, mapel, topik, kata: k, e, clue }))
    tanpaTabrakan(items).forEach((i) => susunHuruf(i, out))
    items.forEach((i) => {
      if (huruf(i.kata).length < 3) return
      out.push(
        isian({ id: `pk-k-${i.id}`, mapel, topik, level: 3 }, `Ketik namanya. Kata ini punya ${huruf(i.kata).length} huruf. Petunjuk: ${i.clue}.`, i.kata, `Jawabannya "${i.kata}".`, { gambar: i.e }),
      )
    })
  }

  // ===== Bahasa Indonesia: lawan kata (ketik) =====
  const LAWAN: [string, string, string[]?][] = [
    ['besar', 'kecil'], ['panjang', 'pendek'], ['tinggi', 'rendah'], ['panas', 'dingin'], ['siang', 'malam'],
    ['naik', 'turun'], ['buka', 'tutup'], ['senang', 'sedih'], ['bersih', 'kotor'], ['cepat', 'lambat'],
    ['terang', 'gelap'], ['jauh', 'dekat'], ['tebal', 'tipis'], ['berat', 'ringan'], ['kasar', 'halus'],
    ['rajin', 'malas'], ['baru', 'lama'], ['kenyang', 'lapar'], ['basah', 'kering'], ['penuh', 'kosong'],
  ]
  LAWAN.forEach(([a, b]) => {
    const t = huruf(b)
    out.push(
      isian({ id: `pk-lw-${a}`, mapel: 'bindo', topik: 'kosakata', level: 3 }, `Ketik lawan kata "${a}". Jawabannya punya ${t.length} huruf.`, b, `Lawan kata "${a}" adalah "${b}".`),
      susun({ id: `pk-lws-${a}`, mapel: 'bindo', topik: 'kosakata', level: t.length <= 5 ? 1 : 2 }, `Susun huruf menjadi lawan kata "${a}".`, t,
        `Lawan kata "${a}" adalah "${b}".`, { gabung: true, pengecoh: t.length > 5 ? pengecohHuruf('lw' + a, t, 1) : undefined }),
    )
  })

  // pastikan id unik
  const seen = new Set<string>()
  return out.filter((q) => (seen.has(q.id) ? false : (seen.add(q.id), true)))
}

export const BANK_PRAKTEK: Question[] = build()
