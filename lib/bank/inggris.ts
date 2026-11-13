import type { Level, Question } from '../types'
import { makeRng } from '../rng'
import { benarSalah, cocok, fill3, isian, pickDistinct, pilihan } from './helpers'

const M = 'inggris' as const
const b = (id: string, topik: string, level: Level) => ({ id, mapel: M, topik, level })
const EN = { lang: 'en-US' as const }

export const ALPHA: [string, string, string][] = [
  ['A', 'Apple', '🍎'], ['B', 'Ball', '⚽'], ['C', 'Cat', '🐱'], ['D', 'Dog', '🐶'], ['E', 'Egg', '🥚'],
  ['F', 'Fish', '🐟'], ['G', 'Goat', '🐐'], ['H', 'Hat', '👒'], ['I', 'Ice cream', '🍦'], ['J', 'Juice', '🧃'],
  ['K', 'Kite', '🪁'], ['L', 'Lion', '🦁'], ['M', 'Moon', '🌙'], ['N', 'Nose', '👃'], ['O', 'Orange', '🍊'],
  ['P', 'Pig', '🐷'], ['Q', 'Queen', '👑'], ['R', 'Rabbit', '🐰'], ['S', 'Sun', '☀️'], ['T', 'Tree', '🌳'],
  ['U', 'Umbrella', '☂️'], ['V', 'Van', '🚐'], ['W', 'Watch', '⌚'], ['Y', 'Yo-yo', '🪀'], ['Z', 'Zebra', '🦓'],
]
const HURUF = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const ANGKA = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']

// [en, id, emoji, jamak?]
type V = [string, string, string, boolean?]
export const WARNA: V[] = [
  ['red', 'merah', '🔴'], ['blue', 'biru', '🔵'], ['green', 'hijau', '🟢'], ['yellow', 'kuning', '🟡'],
  ['orange', 'oranye', '🟠'], ['purple', 'ungu', '🟣'], ['black', 'hitam', '⚫'], ['white', 'putih', '⚪'],
  ['brown', 'cokelat', '🟤'], ['pink', 'merah muda', '🩷'],
]
export const HEWAN: V[] = [
  ['cat', 'kucing', '🐱'], ['dog', 'anjing', '🐶'], ['bird', 'burung', '🐦'], ['fish', 'ikan', '🐟'],
  ['cow', 'sapi', '🐄'], ['duck', 'bebek', '🦆'], ['rabbit', 'kelinci', '🐰'], ['elephant', 'gajah', '🐘'],
  ['lion', 'singa', '🦁'], ['monkey', 'monyet', '🐒'], ['horse', 'kuda', '🐴'], ['chicken', 'ayam', '🐔'],
  ['frog', 'katak', '🐸'], ['tiger', 'harimau', '🐯'], ['snake', 'ular', '🐍'], ['turtle', 'kura-kura', '🐢'],
  ['butterfly', 'kupu-kupu', '🦋'],
]
export const BUAH: V[] = [
  ['apple', 'apel', '🍎'], ['banana', 'pisang', '🍌'], ['orange', 'jeruk', '🍊'], ['mango', 'mangga', '🥭'],
  ['grapes', 'anggur', '🍇', true], ['watermelon', 'semangka', '🍉'], ['strawberry', 'stroberi', '🍓'],
  ['pineapple', 'nanas', '🍍'], ['pear', 'pir', '🍐'], ['lemon', 'lemon', '🍋'], ['cherry', 'ceri', '🍒'],
  ['coconut', 'kelapa', '🥥'],
]
export const KELUARGA: [string, string][] = [
  ['mother', 'ibu'], ['father', 'ayah'], ['sister', 'saudara perempuan'], ['brother', 'saudara laki-laki'],
  ['grandmother', 'nenek'], ['grandfather', 'kakek'], ['baby', 'bayi'], ['aunt', 'bibi'], ['uncle', 'paman'],
  ['family', 'keluarga'],
]
export const SAPA: [string, string][] = [
  ['Hello', 'Halo'], ['Good morning', 'Selamat pagi'], ['Good afternoon', 'Selamat siang'], ['Good night', 'Selamat malam'],
  ['Thank you', 'Terima kasih'], ['Goodbye', 'Selamat tinggal'], ['See you', 'Sampai jumpa'], ['Sorry', 'Maaf'],
  ['Please', 'Tolong'], ['How are you?', 'Apa kabar?'], ['I am fine', 'Aku baik-baik saja'],
  ['What is your name?', 'Siapa namamu?'], ['Excuse me', 'Permisi'], ['You are welcome', 'Sama-sama'],
]

const art = (w: string) => (/^[aeiou]/i.test(w) ? 'an' : 'a')

function vocab(topik: string, pfx: string, list: V[], out: Question[], warna = false) {
  const ens = list.map((x) => x[0])
  const ids = list.map((x) => x[1])
  const emo = list.map((x) => x[2])
  list.forEach(([en, id, e, pl], i) => {
    const key = `${pfx}-${en.replace(/\W/g, '')}`
    out.push(
      pilihan(b(`ig-${key}-gambar`, topik, 1), warna ? 'What color is this? Apa warnanya dalam bahasa Inggris?' : 'What is this? Apa namanya dalam bahasa Inggris?', en, pickDistinct(ens, 3, [en], 'g' + key), `Gambar ini adalah ${en} (${id}).`, { gambar: e, suara: { teks: en, ...EN } }),
      pilihan(b(`ig-${key}-pilihgambar`, topik, 1), `Mana gambar "${en}"?`, e, pickDistinct(emo, 2, [e], 'pg' + key), `${en} artinya ${id}.`, { tipe: 'gambar', suara: { teks: en, ...EN } }),
      pilihan(b(`ig-${key}-iden`, topik, 2), `"${id}" dalam bahasa Inggris adalah…`, en, pickDistinct(ens, 3, [en], 'ie' + key), `${id} dalam bahasa Inggris adalah ${en}.`),
      pilihan(b(`ig-${key}-enid`, topik, 2), `"${en}" artinya…`, id, pickDistinct(ids, 3, [id], 'ei' + key), `${en} artinya ${id}.`, { suara: { teks: en, ...EN } }),
      pilihan(b(`ig-${key}-dengar`, topik, 2), 'Dengarkan kata ini. Gambar mana yang cocok?', e, pickDistinct(emo, 2, [e], 'dg' + key), `Kata yang kamu dengar adalah "${en}", artinya ${id}.`, { tipe: 'gambar', suara: { teks: en, ...EN }, gambar: '🔊' }),
      isian(b(`ig-${key}-isian`, topik, 3), 'Tulis nama gambar ini dalam bahasa Inggris.', en, `Jawabannya "${en}" (${id}).`, { gambar: e, suara: { teks: en, ...EN } }),
    )
    {
      const salah = list[(i + 3) % list.length]
      const kal = (w: string, p?: boolean) => (warna ? `This is ${w}.` : p ? `These are ${w}.` : `This is ${art(w)} ${w}.`)
      out.push(
        benarSalah(b(`ig-${key}-bs1`, topik, 1), `${kal(en, pl)}`, true, `Benar. Gambar itu adalah ${en}.`, { gambar: e }),
        benarSalah(b(`ig-${key}-bs2`, topik, 2), `${kal(salah[0], salah[3])}`, false, `Salah. Gambar itu adalah ${en}, bukan ${salah[0]}.`, { gambar: e }),
      )
    }
  })
  // cocok
  const r = makeRng('cocok' + pfx)
  for (let i = 0; i < 8; i++) {
    const set = r.shuffle(list).slice(0, 3)
    out.push(
      cocok(
        b(`ig-${pfx}-cocok-${i + 1}`, topik, 2),
        'Cocokkan gambar dengan kata bahasa Inggrisnya.',
        set.map((x) => [x[2], x[0]] as [string, string]),
        set.map((x) => `${x[2]} = ${x[0]}`).join(', ') + '.',
      ),
    )
  }
}

function build(): Question[] {
  const out: Question[] = []

  // ---------- ALPHABET ----------
  const first = (w: string) => w[0].toUpperCase()
  for (const [h, w, e] of ALPHA) {
    out.push(
      pilihan(b(`ig-al-awal-${h}`, 'alphabet', 1), `Kata "${w}" diawali huruf…`, h, pickDistinct(HURUF, 3, [h], 'aw' + h), `${h} is for ${w}. ${w} diawali huruf ${h}.`, { gambar: e, suara: { teks: w, ...EN } }),
      pilihan(b(`ig-al-cloze-${h}`, 'alphabet', 2), `${h} is for ___`, w, pickDistinct(ALPHA.map((x) => x[1]), 2, [w], 'cl' + h), `${h} is for ${w}.`, { gambar: e }),
      pilihan(b(`ig-al-dengar-${h}`, 'alphabet', 2), 'Dengarkan kata ini. Gambar mana yang cocok?', e, pickDistinct(ALPHA.map((x) => x[2]), 2, [e], 'ad' + h), `Kata yang kamu dengar adalah "${w}".`, { tipe: 'gambar', suara: { teks: w, ...EN }, gambar: '🔊' }),
      benarSalah(b(`ig-al-bs1-${h}`, 'alphabet', 1), `${w} diawali huruf ${h}.`, true, `Benar. ${h} is for ${w}.`, { gambar: e }),
      benarSalah(b(`ig-al-bs2-${h}`, 'alphabet', 2), `${w} diawali huruf ${pickDistinct(HURUF, 1, [h], 'bs' + h)[0]}.`, false, `Salah. ${w} diawali huruf ${first(w)}.`, { gambar: e }),
    )
  }
  for (const h of HURUF) {
    const l = h.toLowerCase()
    const kecil = HURUF.map((x) => x.toLowerCase())
    out.push(
      pilihan(b(`ig-al-kecil-${h}`, 'alphabet', 1), `Huruf kecil dari "${h}" adalah…`, l, pickDistinct(kecil, 3, [l], 'kc' + h), `Huruf besar ${h} pasangannya huruf kecil ${l}.`),
      pilihan(b(`ig-al-besar-${h}`, 'alphabet', 1), `Huruf besar dari "${l}" adalah…`, h, pickDistinct(HURUF, 3, [h], 'bs2' + h), `Huruf kecil ${l} pasangannya huruf besar ${h}.`),
    )
  }
  {
    const r = makeRng('al-urut')
    const seenSt = new Set<number>()
    for (let i = 0; i < 40 && seenSt.size < 10; i++) {
      const st = r.int(0, 18)
      if (seenSt.has(st)) continue
      seenSt.add(st)
      const seq = HURUF.slice(st, st + 3)
      const after = HURUF[st + 3]
      out.push(
        pilihan(b(`ig-al-urut-${st}`, 'alphabet', 3), `A, B, C, D… Lanjutkan urutan alfabet: ${seq.join(', ')}, ___`, after, pickDistinct(HURUF, 3, [after], 'ur' + st), `Urutan alfabet: ${seq.join(', ')}, ${after}.`),
      )
    }
  }

  // ---------- NUMBERS ----------
  for (let n = 1; n <= 20; n++) {
    const l: Level = n <= 10 ? 1 : 2
    const en = ANGKA[n]
    const near = ANGKA.slice(1).filter((x) => x !== en)
    out.push(
      pilihan(b(`ig-nu-en-${n}`, 'numbers', l), `Angka ${n} dalam bahasa Inggris adalah…`, en, fill3([ANGKA[Math.max(1, n - 1)], ANGKA[Math.min(20, n + 1)], ANGKA[Math.min(20, n + 2)]], en, near, 'ne' + n), `${n} = ${en}.`, { suara: { teks: en, ...EN } }),
      pilihan(b(`ig-nu-id-${n}`, 'numbers', l), `"${en}" artinya angka…`, String(n), fill3([String(n + 1), String(Math.max(1, n - 1)), String(n + 2)], String(n), ['3', '7', '15', '9', '12'], 'ni' + n), `${en} = ${n}.`, { suara: { teks: en, ...EN } }),
      pilihan(b(`ig-nu-dengar-${n}`, 'numbers', 2), 'Dengarkan angka ini. Angka berapa yang kamu dengar?', String(n), fill3([String(n + 1), String(Math.max(1, n - 1)), String(n + 2)], String(n), ['4', '9', '12', '18'], 'nd' + n), `Yang kamu dengar adalah "${en}", yaitu ${n}.`, { suara: { teks: en, ...EN }, gambar: '🔊' }),
    )
    if (n <= 10) {
      out.push(
        isian(b(`ig-nu-isian-${n}`, 'numbers', 3), `Tulis angka ${n} dalam bahasa Inggris.`, en, `${n} dalam bahasa Inggris adalah "${en}".`, { gambar: String(n) }),
        pilihan(b(`ig-nu-hitung-${n}`, 'numbers', 1), 'How many? Berapa banyak? Pilih jawaban dalam bahasa Inggris.', en, pickDistinct(ANGKA.slice(1, 11), 3, [en], 'nh' + n), `Ada ${n} gambar, dalam bahasa Inggris: ${en}.`, { gambar: `hitung:${['🍎', '⭐', '🐟', '🎈', '🍓'][n % 5]}:${n}` }),
      )
    }
  }
  for (let a = 1; a <= 5; a++) {
    for (let c = 1; a + c <= 10 && c <= 5; c++) {
      const s = a + c
      out.push(
        pilihan(b(`ig-nu-plus-${a}-${c}`, 'numbers', 3), `${ANGKA[a]} + ${ANGKA[c]} = ?`, ANGKA[s], pickDistinct(ANGKA.slice(1, 11), 3, [ANGKA[s]], `np${a}${c}`), `${a} + ${c} = ${s}. ${s} dalam bahasa Inggris adalah "${ANGKA[s]}".`),
      )
    }
  }

  // ---------- COLORS / ANIMALS / FRUITS ----------
  vocab('colors', 'wr', WARNA, out, true)
  const objek: [string, string, string[], string, string][] = [
    ['The banana is ___.', 'yellow', ['purple', 'blue'], '🍌', 'Pisang yang matang berwarna kuning (yellow).'],
    ['The grass is ___.', 'green', ['pink', 'black'], '🌿', 'Rumput berwarna hijau (green).'],
    ['The snow is ___.', 'white', ['green', 'brown'], '❄️', 'Salju berwarna putih (white).'],
    ['The strawberry is ___.', 'red', ['blue', 'black'], '🍓', 'Stroberi berwarna merah (red).'],
    ['The sky on a sunny day is ___.', 'blue', ['brown', 'pink'], '🌤️', 'Langit yang cerah berwarna biru (blue).'],
    ['The carrot is ___.', 'orange', ['blue', 'purple'], '🥕', 'Wortel berwarna oranye (orange).'],
  ]
  objek.forEach(([t, a, sl, e, p], i) => out.push(pilihan(b(`ig-wr-objek-${i + 1}`, 'colors', 2), t, a, sl, p, { gambar: e })))
  vocab('animals', 'hw', HEWAN, out)
  vocab('fruits', 'bh', BUAH, out)

  // ---------- FAMILY ----------
  const ens = KELUARGA.map((x) => x[0])
  const ids = KELUARGA.map((x) => x[1])
  KELUARGA.forEach(([en, id], i) => {
    out.push(
      pilihan(b(`ig-fm-enid-${en}`, 'family', i < 4 ? 1 : 2), `"${en}" artinya…`, id, pickDistinct(ids, 3, [id], 'fe' + en), `${en} artinya ${id}.`, { suara: { teks: en, ...EN } }),
      pilihan(b(`ig-fm-iden-${en}`, 'family', i < 4 ? 1 : 2), `"${id}" dalam bahasa Inggris adalah…`, en, pickDistinct(ens, 3, [en], 'fi' + en), `${id} dalam bahasa Inggris adalah ${en}.`),
      pilihan(b(`ig-fm-dengar-${en}`, 'family', 2), 'Dengarkan kata ini. Apa artinya?', id, pickDistinct(ids, 3, [id], 'fd' + en), `Kata yang kamu dengar adalah "${en}", artinya ${id}.`, { suara: { teks: en, ...EN }, gambar: '🔊' }),
    )
    if (i < 6) {
      const ya = en === 'father' || en === 'brother' || en === 'grandfather' ? 'He' : 'She'
      const dia = `Dia ${id}ku.`
      const lain = KELUARGA.slice(0, 6).filter((x) => x[0] !== en).map((x) => `Dia ${x[1]}ku.`)
      out.push(
        pilihan(b(`ig-fm-kal-${en}`, 'family', 3), `Apa arti kalimat ini? "${ya} is my ${en}."`, dia, pickDistinct(lain, 3, [dia], 'fk' + en), `"${ya} is my ${en}" artinya "${dia}"`, { suara: { teks: `${ya} is my ${en}.`, ...EN } }),
      )
    }
  })
  out.push(
    isian(b('ig-fm-isian-ibu', 'family', 3), 'Tulis dalam bahasa Inggris: ibu', 'mother', '"Ibu" dalam bahasa Inggris adalah "mother".', { terima: ['mom', 'mommy'] }),
    isian(b('ig-fm-isian-ayah', 'family', 3), 'Tulis dalam bahasa Inggris: ayah', 'father', '"Ayah" dalam bahasa Inggris adalah "father".', { terima: ['dad', 'daddy'] }),
    isian(b('ig-fm-isian-nenek', 'family', 3), 'Tulis dalam bahasa Inggris: nenek', 'grandmother', '"Nenek" dalam bahasa Inggris adalah "grandmother".'),
    isian(b('ig-fm-isian-kakek', 'family', 3), 'Tulis dalam bahasa Inggris: kakek', 'grandfather', '"Kakek" dalam bahasa Inggris adalah "grandfather".'),
    isian(b('ig-fm-isian-bayi', 'family', 3), 'Tulis dalam bahasa Inggris: bayi', 'baby', '"Bayi" dalam bahasa Inggris adalah "baby".'),
  )
  {
    const r = makeRng('fm-cocok')
    for (let i = 0; i < 6; i++) {
      const set = r.shuffle(KELUARGA).slice(0, 3)
      out.push(cocok(b(`ig-fm-cocok-${i + 1}`, 'family', 2), 'Cocokkan kata bahasa Inggris dengan artinya.', set.map((x) => [x[0], x[1]] as [string, string]), set.map((x) => `${x[0]} = ${x[1]}`).join(', ') + '.'))
    }
  }

  // ---------- GREETINGS ----------
  const sEn = SAPA.map((x) => x[0])
  const sId = SAPA.map((x) => x[1])
  SAPA.forEach(([en, id], i) => {
    const k = `${i + 1}`
    out.push(
      pilihan(b(`ig-gr-enid-${k}`, 'greetings', i < 5 ? 1 : 2), `"${en}" artinya…`, id, pickDistinct(sId, 3, [id], 'ge' + k), `${en} artinya ${id}.`, { suara: { teks: en, ...EN } }),
      pilihan(b(`ig-gr-iden-${k}`, 'greetings', i < 5 ? 1 : 2), `"${id}" dalam bahasa Inggris adalah…`, en, pickDistinct(sEn, 3, [en], 'gi' + k), `${id} dalam bahasa Inggris adalah "${en}".`),
      pilihan(b(`ig-gr-dengar-${k}`, 'greetings', 2), 'Dengarkan kalimat ini. Apa artinya?', id, pickDistinct(sId, 3, [id], 'gd' + k), `Yang kamu dengar adalah "${en}", artinya ${id}.`, { suara: { teks: en, ...EN }, gambar: '🔊' }),
    )
    if (i < 8) out.push(isian(b(`ig-gr-isian-${k}`, 'greetings', 3), `Tulis dalam bahasa Inggris: ${id}`, en.toLowerCase(), `"${id}" dalam bahasa Inggris adalah "${en}".`))
  })
  {
    const r = makeRng('gr-cocok')
    for (let i = 0; i < 8; i++) {
      const set = r.shuffle(SAPA).slice(0, 3)
      out.push(cocok(b(`ig-gr-cocok-${i + 1}`, 'greetings', 2), 'Cocokkan ucapan bahasa Inggris dengan artinya.', set.map((x) => [x[0], x[1]] as [string, string]), set.map((x) => `${x[0]} = ${x[1]}`).join(', ') + '.'))
    }
  }
  const sit: [string, string, string[], string, string][] = [
    ['Saat bertemu teman di pagi hari, kamu berkata…', 'Good morning', ['Good night', 'Thank you'], 'Di pagi hari kita berkata "Good morning".', '🌅'],
    ['Saat diberi hadiah, kamu berkata…', 'Thank you', ['Sorry', 'Goodbye'], 'Saat menerima sesuatu, kita berkata "Thank you".', '🎁'],
    ['Saat berbuat salah, kamu berkata…', 'Sorry', ['Hello', 'Please'], 'Saat berbuat salah, kita berkata "Sorry".', '😔'],
    ['Saat berpisah dengan teman, kamu berkata…', 'Goodbye', ['Hello', 'Good morning'], 'Saat berpisah, kita berkata "Goodbye".', '👋'],
    ['Sebelum tidur, kamu berkata…', 'Good night', ['Good morning', 'Hello'], 'Sebelum tidur, kita berkata "Good night".', '🌙'],
    ['Saat meminta tolong, kamu berkata…', 'Please', ['Sorry', 'Goodbye'], 'Saat meminta tolong, kita berkata "Please".', '🙏'],
  ]
  sit.forEach(([t, a, s, p, g], i) => out.push(pilihan(b(`ig-gr-situasi-${i + 1}`, 'greetings', 2), t, a, s, p, { gambar: g })))

  return out
}

export const BANK_INGGRIS: Question[] = build()
