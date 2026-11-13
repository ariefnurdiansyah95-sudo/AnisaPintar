import type { Question } from '../types'
import { makeRng } from '../rng'
import { benarSalah, cocok, fill3, isian, numSalah, pickDistinct, pilihan, susun } from './helpers'
import { CERITA, PARAGRAF, type TeksBaca } from './teks'

export interface Kata {
  k: string // kata utuh
  s: string[] // suku kata
  e?: string // emoji
}

const parse = (raw: string): Kata => {
  const [w, e] = raw.split('|')
  const s = w.split('-')
  return { k: s.join(''), s, e }
}

// Kata dua suku kata, semua suku kata terbuka (berakhiran vokal)
export const DUA_TERBUKA: Kata[] = [
  'ba-ju|👕', 'bu-ku|📕', 'bo-la|⚽', 'ku-da|🐴', 'sa-pi|🐄', 'to-pi|🧢', 'ro-ti|🍞',
  'su-su|🥛', 'ke-ju|🧀', 'na-si|🍚', 'ka-ki|🦶', 'ha-ti|❤️', 'ma-ta|👁️', 'pe-ta|🗺️',
].map(parse)

// Kata yang suku kata terakhirnya berakhiran satu huruf konsonan
export const KONSONAN: Kata[] = [
  'a-pel|🍎', 'je-ruk|🍊', 'a-yam|🐔', 'te-lur|🥚', 'ga-jah|🐘', 'se-mut|🐜', 'to-mat|🍅',
  'mo-bil|🚗', 'ru-mah|🏠', 'i-kan|🐟', 'be-bek|🦆', 'bu-lan|🌙', 'pen-sil|✏️', 'kur-si|🪑',
  'hu-jan|🌧️', 'a-wan|☁️', 'sa-yur|🥬', 'ma-kan|🍽️',
].map(parse)

// Kata dengan gabungan huruf ng
export const NG: Kata[] = [
  'bu-nga|🌸', 'ku-cing|🐱', 'bin-tang|⭐', 'gu-nung|⛰️', 'pi-sang|🍌', 'tu-lang|🦴',
  'ta-ngan|✋', 'gun-ting|✂️', 'bu-rung|🐦', 'pa-yung|☂️', 'ka-ngu-ru|🦘', 'ke-pi-ting|🦀',
  'se-mang-ka|🍉',
].map(parse)

// Kata dengan gabungan huruf ny
export const NY: Kata[] = ['nya-muk|🦟', 'nya-nyi|🎤', 'me-nya-pu|🧹', 'ba-nyak', 'bu-nyi', 'ke-nyang'].map(parse)

// Kata tiga & empat suku kata
export const TIGA: Kata[] = [
  'se-pa-tu|👟', 'ke-re-ta|🚆', 'pe-sa-wat|✈️', 'pe-ra-hu|⛵', 'se-pe-da|🚲', 'ke-lin-ci|🐰',
  'te-le-pon|📞', 'jen-de-la|🪟', 'ke-ti-mun|🥒', 'co-ke-lat|🍫', 'bo-ne-ka|🧸', 'ma-ka-nan|🍱',
  'ta-na-man|🌱', 'pi-a-no|🎹', 'ma-ta-ha-ri|☀️', 'ku-pu-ku-pu|🦋', 'ka-ca-ma-ta|👓', 'la-ba-la-ba|🕷️',
].map(parse)

export const DUA_SEMUA: Kata[] = [...DUA_TERBUKA, ...KONSONAN]
const SEMUA_KATA: Kata[] = [...DUA_SEMUA, ...NG, ...NY, ...TIGA]

const KONS = 'b c d g h j k l m n p r s t w y'.split(' ')
const VOK = ['a', 'i', 'u', 'o']

export interface Kalimat {
  k: string // kalimat utuh
  blank: string
  salah: [string, string]
  e: string
}

// Setiap pengecoh dipilih supaya kalimatnya TIDAK masuk akal (hanya 1 jawaban benar).
export const KALIMAT: Kalimat[] = [
  { k: 'Ibu memasak nasi di dapur.', blank: 'nasi', salah: ['sepatu', 'pensil'], e: '🍚' },
  { k: 'Adik minum susu setiap pagi.', blank: 'susu', salah: ['batu', 'buku'], e: '🥛' },
  { k: 'Aku membaca buku cerita.', blank: 'buku', salah: ['nasi', 'sepatu'], e: '📖' },
  { k: 'Kucing suka makan ikan.', blank: 'ikan', salah: ['batu', 'meja'], e: '🐱' },
  { k: 'Burung terbang di langit.', blank: 'terbang', salah: ['berenang', 'menulis'], e: '🐦' },
  { k: 'Ikan berenang di kolam.', blank: 'berenang', salah: ['terbang', 'menulis'], e: '🐟' },
  { k: 'Kita melihat dengan mata.', blank: 'mata', salah: ['telinga', 'hidung'], e: '👀' },
  { k: 'Ayah mengendarai mobil di jalan.', blank: 'mobil', salah: ['nasi', 'sepatu'], e: '🚗' },
  { k: 'Nenek menyiram bunga di kebun.', blank: 'menyiram', salah: ['menulis', 'mengendarai'], e: '🌷' },
  { k: 'Pak Guru menulis di papan tulis.', blank: 'menulis', salah: ['berenang', 'memasak'], e: '🧑‍🏫' },
  { k: 'Aku menggosok gigi sebelum tidur.', blank: 'gigi', salah: ['pisang', 'awan'], e: '🪥' },
  { k: 'Hujan turun dari awan.', blank: 'awan', salah: ['sepatu', 'meja'], e: '🌧️' },
  { k: 'Kita membuang sampah di tempat sampah.', blank: 'sampah', salah: ['bintang', 'awan'], e: '🗑️' },
  { k: 'Kakak membantu ibu mencuci piring.', blank: 'piring', salah: ['awan', 'bintang'], e: '🍽️' },
  { k: 'Sapi memakan rumput di padang.', blank: 'rumput', salah: ['pensil', 'sepatu'], e: '🐄' },
  { k: 'Bintang terlihat di malam hari.', blank: 'malam', salah: ['siang', 'pagi'], e: '🌙' },
  { k: 'Aku memakai sepatu di kaki.', blank: 'kaki', salah: ['kepala', 'tangan'], e: '👟' },
  { k: 'Payung melindungi kita dari hujan.', blank: 'Payung', salah: ['Pensil', 'Buku'], e: '☂️' },
  { k: 'Adik membawa tas ke sekolah.', blank: 'tas', salah: ['awan', 'bulan'], e: '🎒' },
  { k: 'Rina menyisir rambut dengan sisir.', blank: 'sisir', salah: ['awan', 'bulan'], e: '💇' },
  { k: 'Matahari bersinar terang di siang hari.', blank: 'siang', salah: ['malam', 'bulan'], e: '☀️' },
  { k: 'Pagi hari ayam berkokok.', blank: 'berkokok', salah: ['mengeong', 'menggonggong'], e: '🐔' },
]

// Kalimat S-P-O sederhana: urutannya hanya satu yang wajar, jadi aman untuk soal "susun kata".
export const SUSUN_KALIMAT: { k: string; e: string }[] = [
  { k: 'Ibu memasak nasi.', e: '🍚' },
  { k: 'Ayah membaca koran.', e: '📰' },
  { k: 'Adik minum susu.', e: '🥛' },
  { k: 'Kucing makan ikan.', e: '🐱' },
  { k: 'Aku membaca buku.', e: '📖' },
  { k: 'Nenek menyiram bunga.', e: '🌷' },
  { k: 'Budi menendang bola.', e: '⚽' },
  { k: 'Ani mencuci piring.', e: '🍽️' },
  { k: 'Sapi makan rumput.', e: '🐄' },
  { k: 'Dina menulis surat.', e: '✉️' },
  { k: 'Kakak menyapu lantai.', e: '🧹' },
  { k: 'Pak Guru mengajar kami.', e: '🧑‍🏫' },
  { k: 'Kelinci makan wortel.', e: '🐰' },
  { k: 'Ayah menanam pohon mangga.', e: '🌳' },
  { k: 'Aku memakai sepatu baru.', e: '👟' },
  { k: 'Ibu membeli sayur segar.', e: '🥬' },
  { k: 'Adik menggambar rumah besar.', e: '🏠' },
  { k: 'Rani menyisir rambut panjang.', e: '💇' },
  { k: 'Paman mengendarai mobil merah.', e: '🚗' },
]

export const kataKalimat = (k: string): string[] => {
  const w = k.replace(/[.?!,]/g, '').split(' ')
  // "Pak Guru" dianggap satu kata
  const out: string[] = []
  for (let i = 0; i < w.length; i++) {
    if (w[i] === 'Pak' && w[i + 1]) {
      out.push(`${w[i]} ${w[i + 1]}`)
      i++
    } else out.push(w[i])
  }
  return out
}

const BENTROK: string[][] = [['🐱', '🐟'], ['🍚', '🍽️'], ['🌧️', '☂️'], ['🐦', '🐔'], ['🥛', '🍚'], ['🌙', '☀️']]
const bentrok = (a: string, b: string) => a === b || BENTROK.some((g) => g.includes(a) && g.includes(b))


function bacaQuestions(t: TeksBaca, topik: string, mapel: 'membaca' | 'bindo', pfx: string, grup?: string): Question[] {
  return t.qs.map((q, i) =>
    pilihan(
      { id: `${pfx}-${t.id}-${i + 1}`, mapel, topik, level: q[4], grup },
      q[0],
      q[1],
      [q[2], q[3]],
      `Jawabannya "${q[1]}". Kalau ragu, baca lagi teksnya pelan-pelan lalu cari jawabannya di sana.`,
      { bacaan: t.teks, gambar: t.emoji },
    ),
  )
}

export { bacaQuestions }

function build(): Question[] {
  const out: Question[] = []
  const b = (id: string, topik: string, level: 1 | 2 | 3) => ({ id, mapel: 'membaca' as const, topik, level })

  // ================= SUKU KATA =================
  for (const c of KONS) {
    for (const v of VOK) {
      const t = c + v
      // Level 1: pengecoh dari konsonan lain
      const r = makeRng('sk1:' + t)
      const lain = r.shuffle(KONS.filter((x) => x !== c))
        .slice(0, 3)
        .map((x) => x + r.pick(VOK))
      out.push(
        pilihan(
          b(`mb-sk-dengar1-${t}`, 'suku-kata', 1),
          'Dengarkan baik-baik. Suku kata mana yang kamu dengar?',
          t,
          lain,
          `Suku kata yang dibacakan adalah "${t}". Huruf ${c} digabung huruf ${v} dibaca "${t}".`,
          { suara: { teks: t, lang: 'id-ID' }, gambar: '🔊' },
        ),
      )
      // Level 2: pengecoh dengan konsonan sama (beda vokal)
      out.push(
        pilihan(
          b(`mb-sk-dengar2-${t}`, 'suku-kata', 2),
          'Dengarkan lagi. Hati-hati, huruf depannya sama! Suku kata mana yang kamu dengar?',
          t,
          VOK.filter((x) => x !== v).map((x) => c + x),
          `Suku kata yang dibacakan adalah "${t}". Perhatikan huruf hidup di belakang: ${v}.`,
          { suara: { teks: t, lang: 'id-ID' }, gambar: '🔊' },
        ),
      )
      // Level 3: ketik suku kata yang didengar
      out.push(
        isian(
          b(`mb-sk-ketik-${t}`, 'suku-kata', 3),
          'Dengarkan baik-baik, lalu ketik suku kata yang kamu dengar.',
          t,
          `Suku kata yang dibacakan adalah "${t}": huruf ${c} + huruf ${v}.`,
          { suara: { teks: t, lang: 'id-ID' }, gambar: '🔊' },
        ),
      )
    }
  }

  // suku kata pertama / pelengkap dari kata dua suku
  const sukuPool = Array.from(new Set(SEMUA_KATA.flatMap((w) => w.s)))
  for (const w of DUA_SEMUA) {
    const s1 = w.s[0]
    const s2 = w.s[1]
    out.push(
      pilihan(
        b(`mb-sk-awal-${w.k}`, 'suku-kata', 1),
        `Kata "${w.k}" diawali suku kata apa?`,
        s1,
        pickDistinct(sukuPool, 2, [s1], 'awal' + w.k),
        `${w.s.join(' - ')}. Suku kata pertamanya adalah "${s1}".`,
        { gambar: w.e },
      ),
    )
    if (w.e) {
      out.push(
        pilihan(
          b(`mb-sk-lengkapi1-${w.k}`, 'suku-kata', 2),
          `Lengkapi kata ini: ___ - ${s2}`,
          s1,
          pickDistinct(sukuPool, 2, [s1], 'l1' + w.k),
          `Gambarnya ${w.k}. Dibaca ${w.s.join(' - ')}, jadi yang hilang adalah "${s1}".`,
          { gambar: w.e },
        ),
      )
      out.push(
        pilihan(
          b(`mb-sk-lengkapi2-${w.k}`, 'suku-kata', 2),
          `Lengkapi kata ini: ${s1} - ___`,
          s2,
          pickDistinct(sukuPool, 2, [s2], 'l2' + w.k),
          `Gambarnya ${w.k}. Dibaca ${w.s.join(' - ')}, jadi yang hilang adalah "${s2}".`,
          { gambar: w.e },
        ),
      )
    }
  }

  // mencocokkan gambar dengan suku kata awal
  {
    const r = makeRng('sk-cocok')
    const bergambar = DUA_SEMUA.filter((w) => w.e)
    for (let i = 0; i < 18; i++) {
      const used = new Set<string>()
      const set: Kata[] = []
      for (const w of r.shuffle(bergambar)) {
        if (!used.has(w.s[0])) {
          used.add(w.s[0])
          set.push(w)
        }
        if (set.length === 3) break
      }
      out.push(
        cocok(
          b(`mb-sk-cocok-${i + 1}`, 'suku-kata', 2),
          'Cocokkan gambar dengan suku kata pertama namanya.',
          set.map((w) => [w.e as string, w.s[0]] as [string, string]),
          set.map((w) => `${w.e} ${w.k} diawali "${w.s[0]}"`).join('. ') + '.',
        ),
      )
    }
  }

  // ================= MENGGABUNG SUKU KATA (2 suku) =================
  const pengecohGabung = (w: Kata, seed: string): string[] => {
    const [a, c] = w.s
    const r = makeRng('pg:' + seed)
    const cand = new Set<string>()
    cand.add(c + a) // dibalik
    const other = r.shuffle(DUA_SEMUA.filter((x) => x.k !== w.k))
    cand.add(a + other[0].s[1])
    cand.add(other[1].s[0] + c)
    cand.add(other[2].s[0] + other[3].s[1])
    return fill3([...cand], w.k, DUA_SEMUA.map((x) => x.k), seed)
  }

  for (const w of DUA_SEMUA) {
    const terbuka = DUA_TERBUKA.includes(w)
    if (w.e) {
      if (w.s[0] !== w.s[1]) out.push(
        susun(
          b(`mb-gb-susun-${w.k}`, 'gabung', terbuka ? 1 : 2),
          'Susun suku kata menjadi kata yang benar.',
          w.s,
          `${w.s.join(' + ')} = ${w.k}. Baca: ${w.s.join(' - ')}, ${w.k}.`,
          { gambar: w.e },
        ),
      )
      const r = makeRng('gbp' + w.k)
      out.push(
        pilihan(
          b(`mb-gb-gambar-${w.k}`, 'gabung', 1),
          'Gambar ini namanya apa?',
          w.k,
          pickDistinct(DUA_SEMUA.map((x) => x.k), 2, [w.k], 'gg' + w.k),
          `Itu gambar ${w.k}. Dieja ${w.s.join(' - ')}.`,
          { gambar: w.e },
        ),
      )
      out.push(
        pilihan(
          b(`mb-gb-pilihgambar-${w.k}`, 'gabung', 1),
          `Mana gambar "${w.k}"?`,
          w.e,
          pickDistinct(DUA_SEMUA.filter((x) => x.e).map((x) => x.e as string), 2, [w.e], 'pg' + w.k),
          `${w.k} dieja ${w.s.join(' - ')}. Gambarnya ${w.e}.`,
          { tipe: 'gambar' },
        ),
      )
      void r
    }
    out.push(
      pilihan(
        b(`mb-gb-pilih-${w.k}`, 'gabung', 2),
        `${w.s[0]} + ${w.s[1]} = ?`,
        w.k,
        pengecohGabung(w, w.k),
        `${w.s[0]} + ${w.s[1]} dibaca ${w.s.join(' - ')}, jadi katanya "${w.k}".`,
      ),
    )
    out.push(
      isian(
        b(`mb-gb-isian-${w.k}`, 'gabung', 3),
        `Gabungkan suku kata ini lalu tulis katanya: ${w.s[0]} + ${w.s[1]} = ?`,
        w.k,
        `${w.s[0]} + ${w.s[1]} = ${w.k}.`,
      ),
    )
    out.push(
      benarSalah(
        b(`mb-gb-bs-${w.k}`, 'gabung', 1),
        `Benar atau salah? ${w.s[0]} + ${w.s[1]} dibaca "${w.k}".`,
        true,
        `Benar. ${w.s[0]} + ${w.s[1]} = ${w.k}.`,
      ),
    )
    const lain = DUA_SEMUA.filter((x) => x.k !== w.k)
    const salahKata = makeRng('bs2' + w.k).pick(lain).k
    out.push(
      benarSalah(
        b(`mb-gb-bs2-${w.k}`, 'gabung', 1),
        `Benar atau salah? ${w.s[0]} + ${w.s[1]} dibaca "${salahKata}".`,
        false,
        `Salah. ${w.s[0]} + ${w.s[1]} dibaca "${w.k}", bukan "${salahKata}".`,
      ),
    )
  }

  // ================= KATA 3–4 SUKU KATA =================
  for (const w of TIGA) {
    const n = w.s.length
    const r = makeRng('t3' + w.k)
    const lainK = TIGA.filter((x) => x.k !== w.k)
    out.push(
      susun(
        b(`mb-t3-susun-${w.k}`, 'tiga-suku', n === 3 ? 2 : 3),
        'Susun suku kata menjadi kata yang benar.',
        w.s,
        `${w.s.join(' + ')} = ${w.k}. Dibaca ${w.s.join(' - ')}.`,
        { gambar: w.e },
      ),
    )
    out.push(
      pilihan(
        b(`mb-t3-gambar-${w.k}`, 'tiga-suku', 1),
        'Gambar ini namanya apa?',
        w.k,
        pickDistinct(TIGA.map((x) => x.k), 2, [w.k], 't3g' + w.k),
        `Itu gambar ${w.k}. Dieja ${w.s.join(' - ')}.`,
        { gambar: w.e },
      ),
    )
    out.push(
      pilihan(
        b(`mb-t3-hitung-${w.k}`, 'tiga-suku', 2),
        `Kata "${w.k}" punya berapa suku kata?`,
        String(n),
        ['2', '3', '4', '5'].filter((x) => x !== String(n)).slice(0, 3),
        `${w.s.join(' - ')}. Ada ${n} suku kata. Tepuk tangan ${n} kali: ${w.s.join(', ')}!`,
        { gambar: w.e },
      ),
    )
    out.push(
      pilihan(
        b(`mb-t3-gabung-${w.k}`, 'tiga-suku', 2),
        `${w.s.join(' + ')} = ?`,
        w.k,
        fill3(
          [[...w.s].reverse().join(''), w.s.slice(1).concat(w.s[0]).join(''), r.pick(lainK).s[0] + w.s.slice(1).join('')],
          w.k,
          TIGA.map((x) => x.k),
          'tg' + w.k,
        ),
        `${w.s.join(' + ')} dibaca ${w.s.join(' - ')}, jadi katanya "${w.k}".`,
      ),
    )
    out.push(
      pilihan(
        b(`mb-t3-akhir-${w.k}`, 'tiga-suku', 2),
        `Suku kata terakhir dari kata "${w.k}" adalah…`,
        w.s[n - 1],
        pickDistinct(sukuPool, 2, [w.s[n - 1]], 't3a' + w.k),
        `${w.s.join(' - ')}. Suku kata terakhirnya "${w.s[n - 1]}".`,
        { gambar: w.e },
      ),
    )
    out.push(
      isian(
        b(`mb-t3-isian-${w.k}`, 'tiga-suku', 3),
        `Gabungkan lalu tulis katanya: ${w.s.join(' + ')} = ?`,
        w.k,
        `${w.s.join(' + ')} = ${w.k}.`,
      ),
    )
  }

  // ================= KATA BERAKHIRAN KONSONAN =================
  for (const w of KONSONAN) {
    const last = w.k[w.k.length - 1]
    const lastSyl = w.s[w.s.length - 1]
    const hurufPool = ['n', 'l', 'k', 'm', 't', 'h', 'r', 'p', 'b', 's']
    out.push(
      pilihan(
        b(`mb-kn-huruf-${w.k}`, 'konsonan', 2),
        `Huruf terakhir pada kata "${w.k}" adalah…`,
        last,
        pickDistinct(hurufPool, 3, [last], 'kh' + w.k),
        `${w.k} berakhiran huruf "${last}". Suku kata terakhirnya "${lastSyl}".`,
        { gambar: w.e },
      ),
    )
    out.push(
      pilihan(
        b(`mb-kn-akhir-${w.k}`, 'konsonan', 2),
        `Suku kata terakhir dari kata "${w.k}" adalah…`,
        lastSyl,
        pickDistinct(
          KONSONAN.map((x) => x.s[x.s.length - 1]),
          2,
          [lastSyl],
          'ka' + w.k,
        ),
        `${w.s.join(' - ')}. Suku kata terakhirnya "${lastSyl}", berakhiran "${last}".`,
        { gambar: w.e },
      ),
    )
    out.push(
      susun(
        b(`mb-kn-susun-${w.k}`, 'konsonan', 2),
        'Susun suku kata menjadi kata yang benar.',
        w.s,
        `${w.s.join(' + ')} = ${w.k}. Perhatikan akhirannya: "${lastSyl}".`,
        { gambar: w.e },
      ),
    )
    out.push(
      pilihan(
        b(`mb-kn-gambar-${w.k}`, 'konsonan', 1),
        'Gambar ini namanya apa?',
        w.k,
        pickDistinct(KONSONAN.map((x) => x.k), 2, [w.k], 'kg' + w.k),
        `Itu gambar ${w.k}. Dieja ${w.s.join(' - ')}.`,
        { gambar: w.e },
      ),
    )
    out.push(
      benarSalah(
        b(`mb-kn-bs-${w.k}`, 'konsonan', 1),
        `Benar atau salah? Kata "${w.k}" berakhiran huruf "${last}".`,
        true,
        `Benar. ${w.k} berakhiran huruf "${last}".`,
      ),
    )
    const salahH = pickDistinct(hurufPool, 1, [last], 'kbs' + w.k)[0]
    out.push(
      benarSalah(
        b(`mb-kn-bs2-${w.k}`, 'konsonan', 2),
        `Benar atau salah? Kata "${w.k}" berakhiran huruf "${salahH}".`,
        false,
        `Salah. ${w.k} berakhiran huruf "${last}", bukan "${salahH}".`,
      ),
    )
    out.push(
      isian(
        b(`mb-kn-isian-${w.k}`, 'konsonan', 3),
        `Gabungkan lalu tulis katanya: ${w.s.join(' + ')} = ?`,
        w.k,
        `${w.s.join(' + ')} = ${w.k}.`,
      ),
    )
  }

  // ================= GABUNGAN HURUF =================
  const gabH = (w: Kata): 'ng' | 'ny' => (NY.includes(w) ? 'ny' : 'ng')
  for (const w of [...NG, ...NY]) {
    const g = gabH(w)
    const salahG = g === 'ng' ? 'ny' : 'ng'
    out.push(
      pilihan(
        b(`mb-gh-jenis-${w.k}`, 'gabungan-huruf', 1),
        `Kata "${w.k}" memiliki gabungan huruf…`,
        g,
        [salahG, 'sy', 'kh'],
        `${w.s.join(' - ')}. Di dalamnya ada gabungan huruf "${g}".`,
        { gambar: w.e },
      ),
    )
    out.push(
      benarSalah(
        b(`mb-gh-bs-${w.k}`, 'gabungan-huruf', 1),
        `Benar atau salah? Kata "${w.k}" memiliki gabungan huruf "${salahG}".`,
        false,
        `Salah. "${w.k}" memiliki gabungan huruf "${g}", bukan "${salahG}".`,
      ),
    )
    out.push(
      benarSalah(
        b(`mb-gh-bs2-${w.k}`, 'gabungan-huruf', 1),
        `Benar atau salah? Kata "${w.k}" memiliki gabungan huruf "${g}".`,
        true,
        `Benar. Kata "${w.k}" dieja ${w.s.join(' - ')}, ada gabungan huruf "${g}".`,
      ),
    )
    out.push(
      susun(
        b(`mb-gh-susun-${w.k}`, 'gabungan-huruf', w.s.length > 2 ? 3 : 2),
        'Susun suku kata menjadi kata yang benar.',
        w.s,
        `${w.s.join(' + ')} = ${w.k}. Perhatikan gabungan huruf "${g}".`,
        w.e ? { gambar: w.e } : {},
      ),
    )
    out.push(
      isian(
        b(`mb-gh-isian-${w.k}`, 'gabungan-huruf', 3),
        `Gabungkan lalu tulis katanya: ${w.s.join(' + ')} = ?`,
        w.k,
        `${w.s.join(' + ')} = ${w.k}.`,
      ),
    )
    if (w.e) {
      out.push(
        pilihan(
          b(`mb-gh-gambar-${w.k}`, 'gabungan-huruf', 1),
          'Gambar ini namanya apa?',
          w.k,
          pickDistinct([...NG, ...NY].filter((x) => x.e).map((x) => x.k), 2, [w.k], 'ghg' + w.k),
          `Itu gambar ${w.k}. Dieja ${w.s.join(' - ')}.`,
          { gambar: w.e },
        ),
      )
    }
  }

  // ================= KALIMAT PENDEK =================
  KALIMAT.forEach((s, i) => {
    const kosong = s.k.replace(s.blank, '____')
    out.push(
      pilihan(
        b(`mb-kl-cloze-${i + 1}`, 'kalimat', 2),
        `Pilih kata yang tepat: ${kosong}`,
        s.blank,
        [...s.salah],
        `Kalimat yang benar: "${s.k}"`,
        { gambar: s.e },
      ),
    )
    const lain = KALIMAT.filter((x) => !bentrok(x.e, s.e))
    const r = makeRng('klbs' + i)
    const e2 = r.pick(lain).e
    out.push(
      isian(
        b(`mb-kl-isian-${i + 1}`, 'kalimat', 3),
        `Tulis kata yang hilang. Pilihan kata: ${[s.blank, ...s.salah].sort().join(', ')}. ${kosong}`,
        s.blank,
        `Kalimat yang benar: "${s.k}"`,
        { gambar: s.e },
      ),
    )
    out.push(
      benarSalah(
        b(`mb-kl-bs-${i + 1}`, 'kalimat', 1),
        `Benar atau salah? Kalimat "${s.k}" cocok dengan gambar di atas.`,
        true,
        `Benar. Kalimat itu menceritakan ${s.e}.`,
        { gambar: s.e },
      ),
    )
    out.push(
      benarSalah(
        b(`mb-kl-bs2-${i + 1}`, 'kalimat', 2),
        `Benar atau salah? Kalimat "${s.k}" cocok dengan gambar di atas.`,
        false,
        `Salah. Kalimat itu menceritakan ${s.e}, bukan gambar tadi.`,
        { gambar: e2 },
      ),
    )
  })
  SUSUN_KALIMAT.forEach((s, i) => {
    const ws = kataKalimat(s.k)
    out.push(
      susun(
        b(`mb-kl-susun-${i + 1}`, 'kalimat', ws.length <= 3 ? 1 : ws.length === 4 ? 2 : 3),
        'Susun kata-kata menjadi kalimat yang benar.',
        ws,
        `Kalimat yang benar: "${s.k}"`,
        { gambar: s.e },
      ),
    )
  })
  // mencocokkan kalimat - gambar
  {
    const r = makeRng('kl-cocok')
    for (let i = 0; i < 12; i++) {
      const pick: Kalimat[] = []
      const used = new Set<string>()
      for (const k of r.shuffle(KALIMAT)) {
        if (![...used].some((e) => bentrok(e, k.e))) {
          used.add(k.e)
          pick.push(k)
        }
        if (pick.length === 3) break
      }
      out.push(
        cocok(
          b(`mb-kl-cocok-${i + 1}`, 'kalimat', 2),
          'Cocokkan kalimat dengan gambarnya.',
          pick.map((k) => [k.k, k.e] as [string, string]),
          pick.map((k) => `"${k.k}" cocok dengan ${k.e}`).join('. ') + '.',
        ),
      )
    }
  }

  // ================= PARAGRAF & CERITA =================
  for (const p of PARAGRAF) out.push(...bacaQuestions(p, 'paragraf', 'membaca', 'mb-pg', p.id))
  for (const c of CERITA) out.push(...bacaQuestions(c, 'cerita', 'membaca', 'mb-ct', c.id))

  void numSalah
  return out
}

export const BANK_MEMBACA: Question[] = build()
