import type { Level, Question } from '../types'
import { makeRng } from '../rng'
import { benarSalah, cocok, fill3, isian, numSalah, pilihan, susun } from './helpers'

const NAMA_ANGKA = [
  'nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh',
  'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas',
  'delapan belas', 'sembilan belas', 'dua puluh',
]

const NAMA_ORANG = ['Ani', 'Budi', 'Citra', 'Dedi', 'Eka', 'Fajar', 'Gita', 'Hana', 'Indra', 'Joko']
const BENDA: [string, string][] = [
  ['kelereng', '🔮'], ['permen', '🍬'], ['buku', '📕'], ['apel', '🍎'], ['bola', '⚽'],
  ['pensil', '✏️'], ['mangga', '🥭'], ['topi', '🧢'], ['kue', '🧁'], ['balon', '🎈'],
]
const EMOJI_HITUNG = ['🍎', '🐟', '⭐', '🎈', '🍓', '🚗', '⚽', '🌸', '🐥', '🍪']

const b = (id: string, topik: string, level: Level) => ({ id, mapel: 'matematika' as const, topik, level })

function build(): Question[] {
  const out: Question[] = []
  const add = (...q: Question[]) => out.push(...q)

  // =============== ANGKA ===============
  const rangeFor = (l: Level) => (l === 1 ? 10 : l === 2 ? 20 : 100)
  for (const [l, max, min] of [[1, 9, 0], [2, 49, 10], [3, 99, 50]] as [Level, number, number][]) {
    for (let n = min; n <= max; n += l === 3 ? 3 : 1) {
      add(
        pilihan(
          b(`ma-angka-sesudah-${n}`, 'angka', l),
          `Angka setelah ${n} adalah…`,
          String(n + 1),
          numSalah(n + 1, 'as' + n, { min: 0, max: 100 }),
          `Setelah ${n} adalah ${n + 1}. Hitung maju: ${n}, ${n + 1}.`,
        ),
      )
      if (n >= 1) {
        add(
          pilihan(
            b(`ma-angka-sebelum-${n}`, 'angka', l),
            `Angka sebelum ${n} adalah…`,
            String(n - 1),
            numSalah(n - 1, 'sb' + n, { min: 0, max: 100 }),
            `Sebelum ${n} adalah ${n - 1}. Hitung mundur: ${n}, ${n - 1}.`,
          ),
        )
      }
      if (n + 2 <= 100) {
        add(
          pilihan(
            b(`ma-angka-antara-${n}`, 'angka', l === 1 ? 2 : l),
            `Angka yang ada di antara ${n} dan ${n + 2} adalah…`,
            String(n + 1),
            numSalah(n + 1, 'an' + n, { min: 0, max: 100, step: [1, 2, 3] }),
            `${n}, ${n + 1}, ${n + 2}. Angka di tengahnya ${n + 1}.`,
          ),
        )
      }
    }
  }

  // lebih besar / lebih kecil
  {
    const r = makeRng('angka-banding')
    for (const l of [1, 2, 3] as Level[]) {
      const max = rangeFor(l)
      const seen = new Set<string>()
      let tries = 0
      while (seen.size < 24 && tries++ < 400) {
        const a = r.int(l === 3 ? 11 : 0, max)
        const c = r.int(l === 3 ? 11 : 0, max)
        if (a === c) continue
        const key = `${a}-${c}`
        if (seen.has(key)) continue
        seen.add(key)
        const besar = Math.max(a, c)
        const kecil = Math.min(a, c)
        add(
          pilihan(
            b(`ma-angka-besar-${key}`, 'angka', l),
            `Mana angka yang LEBIH BESAR, ${a} atau ${c}?`,
            String(besar),
            [String(kecil)],
            `${besar} lebih besar dari ${kecil}.`,
          ),
        )
        if (seen.size % 2 === 0) {
          add(
            pilihan(
              b(`ma-angka-kecil-${key}`, 'angka', l),
              `Mana angka yang LEBIH KECIL, ${a} atau ${c}?`,
              String(kecil),
              [String(besar)],
              `${kecil} lebih kecil dari ${besar}.`,
            ),
          )
        }
      }
    }
    // tanda < > =
    const seen = new Set<string>()
    let t = 0
    while (seen.size < 36 && t++ < 600) {
      const a = r.int(0, 20)
      const c = r.int(0, 20)
      const key = `${a}-${c}`
      if (seen.has(key)) continue
      seen.add(key)
      const ans = a > c ? '>' : a < c ? '<' : '='
      add(
        pilihan(
          b(`ma-angka-tanda-${key}`, 'angka', 2),
          `Pilih tanda yang tepat: ${a} ___ ${c}`,
          ans,
          ['<', '>', '='].filter((x) => x !== ans),
          a === c
            ? `${a} sama dengan ${c}, jadi tandanya "=".`
            : `${Math.max(a, c)} lebih besar dari ${Math.min(a, c)}. Mulut tanda membuka ke angka yang lebih besar: ${a} ${ans} ${c}.`,
        ),
      )
    }
  }

  // urutan angka (susun)
  {
    const r = makeRng('angka-urut')
    const spec: [Level, number, number, number][] = [[1, 3, 10, 12], [2, 4, 20, 12], [3, 5, 100, 12]]
    for (const [l, n, max, count] of spec) {
      const seen = new Set<string>()
      let t = 0
      while (seen.size < count && t++ < 300) {
        const nums = new Set<number>()
        while (nums.size < n) nums.add(r.int(l === 3 ? 10 : 1, max))
        const asc = [...nums].sort((x, y) => x - y)
        const key = asc.join('-')
        if (seen.has(key)) continue
        seen.add(key)
        add(
          susun(
            b(`ma-angka-urut-${key}`, 'angka', l),
            'Urutkan angka dari yang paling KECIL ke yang paling BESAR.',
            asc.map(String),
            `Urutan dari kecil ke besar: ${asc.join(', ')}.`,
          ),
        )
      }
    }
  }

  // hitung gambar
  for (let n = 1; n <= 20; n++) {
    const e = EMOJI_HITUNG[n % EMOJI_HITUNG.length]
    add(
      pilihan(
        b(`ma-angka-hitung-${n}`, 'angka', n <= 10 ? 1 : 2),
        'Ada berapa gambar di atas?',
        String(n),
        numSalah(n, 'hg' + n, { min: 1, max: 22, step: [1, 2] }),
        `Hitung satu per satu dengan jari. Jumlahnya ${n}.`,
        { gambar: `hitung:${e}:${n}` },
      ),
    )
  }

  // eja angka
  for (let n = 1; n <= 20; n++) {
    const l: Level = n <= 10 ? 1 : 2
    add(
      pilihan(
        b(`ma-angka-eja-${n}`, 'angka', l),
        `Angka "${NAMA_ANGKA[n]}" ditulis…`,
        String(n),
        numSalah(n, 'ej' + n, { min: 1, max: 20, step: [1, 2, 3] }),
        `"${NAMA_ANGKA[n]}" ditulis ${n}.`,
      ),
    )
    const lain = NAMA_ANGKA.slice(1).filter((x) => x !== NAMA_ANGKA[n])
    add(
      pilihan(
        b(`ma-angka-baca-${n}`, 'angka', l),
        `Angka ${n} dibaca…`,
        NAMA_ANGKA[n],
        fill3(
          [NAMA_ANGKA[Math.max(1, n - 1)], NAMA_ANGKA[Math.min(20, n + 1)], NAMA_ANGKA[Math.min(20, n + 2)]],
          NAMA_ANGKA[n],
          lain,
          'bc' + n,
        ),
        `${n} dibaca "${NAMA_ANGKA[n]}".`,
      ),
    )
  }

  // =============== TAMBAH ===============
  for (let a = 1; a <= 9; a++) {
    for (let c = 1; a + c <= 10; c++) {
      const s = a + c
      const pb = `${a} + ${c} = ${s}. Mulai dari ${a}, lalu hitung maju ${c} langkah.`
      add(
        pilihan(
          b(`ma-tambah-1-${a}-${c}`, 'tambah', 1),
          `${a} + ${c} = ?`,
          String(s),
          numSalah(s, `t1${a}${c}`, { min: 0, max: 12, step: [1, 2] }),
          pb,
        ),
      )
      if (a <= 5 && c <= 5) {
        const e = EMOJI_HITUNG[(a * 3 + c) % EMOJI_HITUNG.length]
        add(
          pilihan(
            b(`ma-tambah-g-${a}-${c}`, 'tambah', 1),
            'Hitung gambar-gambar ini. Berapa jumlah seluruhnya?',
            String(s),
            numSalah(s, `tg${a}${c}`, { min: 1, max: 12, step: [1, 2] }),
            `${a} gambar ditambah ${c} gambar = ${s} gambar.`,
            { gambar: `tambah:${e}:${a}:${c}`, tipe: 'gambar' },
          ),
        )
      }
    }
  }
  for (let a = 2; a <= 10; a++) {
    for (let c = 2; c <= 10; c++) {
      const s = a + c
      if (s < 11 || s > 20) continue
      const pb = `${a} + ${c} = ${s}. Tips: ${a} + ${10 - a} = 10, lalu tambah sisanya ${c - (10 - a)}.`
      if ((a + c) % 2 === 0) {
        add(isian(b(`ma-tambah-2-${a}-${c}`, 'tambah', 2), `${a} + ${c} = ?`, String(s), pb))
      } else {
        add(
          pilihan(
            b(`ma-tambah-2-${a}-${c}`, 'tambah', 2),
            `${a} + ${c} = ?`,
            String(s),
            numSalah(s, `t2${a}${c}`, { min: 0, max: 22, step: [1, 2, 10] }),
            pb,
          ),
        )
      }
    }
  }
  {
    const r = makeRng('tambah3')
    const seen = new Set<string>()
    let t = 0
    while (seen.size < 40 && t++ < 400) {
      const a = r.int(11, 79)
      const c = r.int(1, 20)
      if (a + c > 99) continue
      const key = `${a}-${c}`
      if (seen.has(key)) continue
      seen.add(key)
      const pb = `${a} + ${c} = ${a + c}. Pisahkan puluhan dan satuan, lalu jumlahkan.`
      add(
        seen.size % 2
          ? isian(b(`ma-tambah-3-${key}`, 'tambah', 3), `${a} + ${c} = ?`, String(a + c), pb)
          : pilihan(
              b(`ma-tambah-3-${key}`, 'tambah', 3),
              `${a} + ${c} = ?`,
              String(a + c),
              numSalah(a + c, 't3' + key, { min: 0, max: 100, step: [1, 10, 2] }),
              pb,
            ),
      )
    }
  }

  // =============== KURANG ===============
  for (let a = 2; a <= 10; a++) {
    for (let c = 1; c <= a; c++) {
      const s = a - c
      const pb = `${a} − ${c} = ${s}. Mulai dari ${a}, lalu hitung mundur ${c} langkah.`
      add(
        pilihan(
          b(`ma-kurang-1-${a}-${c}`, 'kurang', 1),
          `${a} − ${c} = ?`,
          String(s),
          numSalah(s, `k1${a}${c}`, { min: 0, max: 12, step: [1, 2] }),
          pb,
        ),
      )
      if (a <= 8 && c < a) {
        const e = EMOJI_HITUNG[(a + c) % EMOJI_HITUNG.length]
        add(
          pilihan(
            b(`ma-kurang-g-${a}-${c}`, 'kurang', 1),
            `Ada ${a} gambar. Yang dicoret ada ${c}. Berapa gambar yang tersisa?`,
            String(s),
            numSalah(s, `kg${a}${c}`, { min: 0, max: 10, step: [1, 2] }),
            `${a} − ${c} = ${s}. Gambar yang tidak dicoret ada ${s}.`,
            { gambar: `kurang:${e}:${a}:${c}`, tipe: 'gambar' },
          ),
        )
      }
    }
  }
  for (let a = 11; a <= 20; a++) {
    for (let c = 2; c <= 9; c++) {
      const s = a - c
      if (s < 1) continue
      if ((a + c) % 3 !== 0) continue
      const pb = `${a} − ${c} = ${s}. Hitung mundur ${c} langkah dari ${a}.`
      add(
        (a + c) % 2 === 0
          ? isian(b(`ma-kurang-2-${a}-${c}`, 'kurang', 2), `${a} − ${c} = ?`, String(s), pb)
          : pilihan(
              b(`ma-kurang-2-${a}-${c}`, 'kurang', 2),
              `${a} − ${c} = ?`,
              String(s),
              numSalah(s, `k2${a}${c}`, { min: 0, max: 22, step: [1, 2, 10] }),
              pb,
            ),
      )
    }
  }
  {
    const r = makeRng('kurang3')
    const seen = new Set<string>()
    let t = 0
    while (seen.size < 40 && t++ < 400) {
      const a = r.int(21, 99)
      const c = r.int(1, 20)
      if (a - c < 1) continue
      const key = `${a}-${c}`
      if (seen.has(key)) continue
      seen.add(key)
      const pb = `${a} − ${c} = ${a - c}. Kurangi puluhan dan satuan secara bertahap.`
      add(
        seen.size % 2
          ? isian(b(`ma-kurang-3-${key}`, 'kurang', 3), `${a} − ${c} = ?`, String(a - c), pb)
          : pilihan(
              b(`ma-kurang-3-${key}`, 'kurang', 3),
              `${a} − ${c} = ?`,
              String(a - c),
              numSalah(a - c, 'k3' + key, { min: 0, max: 100, step: [1, 10, 2] }),
              pb,
            ),
      )
    }
  }

  // =============== BERSUSUN ===============
  {
    const r = makeRng('bersusun')
    const gen = (op: '+' | '−', carry: boolean, level: Level, count: number) => {
      const seen = new Set<string>()
      let t = 0
      while (seen.size < count && t++ < 1500) {
        const a = r.int(11, 98)
        const c = r.int(11, 98)
        const a1 = Math.floor(a / 10)
        const a0 = a % 10
        const c1 = Math.floor(c / 10)
        const c0 = c % 10
        let ans: number
        let tanpaSimpan: boolean
        let x = a
        let y = c
        if (op === '+') {
          ans = a + c
          if (ans > 99) continue
          tanpaSimpan = a0 + c0 < 10
        } else {
          x = Math.max(a, c)
          y = Math.min(a, c)
          if (x === y) continue
          ans = x - y
          tanpaSimpan = x % 10 >= y % 10
        }
        if (carry === tanpaSimpan) continue
        const key = `${x}-${y}`
        if (seen.has(key)) continue
        seen.add(key)
        const x0 = x % 10
        const y0 = y % 10
        const x1 = Math.floor(x / 10)
        const y1 = Math.floor(y / 10)
        let pb: string
        if (op === '+') {
          pb = carry
            ? `Satuan: ${x0} + ${y0} = ${x0 + y0}, tulis ${(x0 + y0) % 10} dan simpan 1. Puluhan: ${x1} + ${y1} + 1 = ${x1 + y1 + 1}. Jadi hasilnya ${ans}.`
            : `Satuan: ${x0} + ${y0} = ${x0 + y0}. Puluhan: ${x1} + ${y1} = ${x1 + y1}. Jadi hasilnya ${ans}.`
        } else {
          pb = carry
            ? `Satuan: ${x0} kurang dari ${y0}, pinjam 1 puluhan jadi ${x0 + 10} − ${y0} = ${x0 + 10 - y0}. Puluhan: ${x1} − 1 = ${x1 - 1}, lalu ${x1 - 1} − ${y1} = ${x1 - 1 - y1}. Jadi hasilnya ${ans}.`
            : `Satuan: ${x0} − ${y0} = ${x0 - y0}. Puluhan: ${x1} − ${y1} = ${x1 - y1}. Jadi hasilnya ${ans}.`
        }
        const base = b(`ma-bersusun-${op === '+' ? 'tb' : 'kr'}-${carry ? 'p' : 'n'}-${key}`, 'bersusun', level)
        const teks = op === '+' ? 'Hitung penjumlahan bersusun ini. Berapa hasilnya?' : 'Hitung pengurangan bersusun ini. Berapa hasilnya?'
        add(
          seen.size % 2
            ? isian(base, teks, String(ans), pb, { gambar: `susun:${op}:${x}:${y}` })
            : pilihan(base, teks, String(ans), numSalah(ans, 'bs' + key + op, { min: 0, max: 100, step: [1, 10, 2] }), pb, {
                gambar: `susun:${op}:${x}:${y}`,
              }),
        )
      }
    }
    for (let a = 1; a <= 8; a++) {
      for (const c of [1, 2, 3]) {
        if (a + c > 9) continue
        add(
          pilihan(
            b(`ma-bersusun-1d-tb-${a}-${c}`, 'bersusun', 1),
            'Hitung penjumlahan bersusun ini. Berapa hasilnya?',
            String(a + c),
            numSalah(a + c, `b1${a}${c}`, { min: 0, max: 12, step: [1, 2] }),
            `${a} + ${c} = ${a + c}. Tulis angka sejajar ke bawah, lalu jumlahkan.`,
            { gambar: `susun:+:${a}:${c}` },
          ),
        )
        if (a > c) {
          add(
            pilihan(
              b(`ma-bersusun-1d-kr-${a}-${c}`, 'bersusun', 1),
              'Hitung pengurangan bersusun ini. Berapa hasilnya?',
              String(a - c),
              numSalah(a - c, `b2${a}${c}`, { min: 0, max: 12, step: [1, 2] }),
              `${a} − ${c} = ${a - c}. Tulis angka sejajar ke bawah, lalu kurangkan.`,
              { gambar: `susun:−:${a}:${c}` },
            ),
          )
        }
      }
    }
    gen('+', false, 2, 26)
    gen('+', true, 3, 26)
    gen('−', false, 2, 26)
    gen('−', true, 3, 26)
  }

  // =============== PASANGAN BILANGAN ===============
  for (let t = 5; t <= 10; t++) {
    for (let x = 1; x < t; x++) {
      const pb = `${x} + ${t - x} = ${t}. Pasangan ${x} untuk membuat ${t} adalah ${t - x}.`
      add(
        x % 2
          ? isian(b(`ma-pasangan-1-${t}-${x}`, 'pasangan', 1), `${x} + ? = ${t}`, String(t - x), pb)
          : pilihan(
              b(`ma-pasangan-1-${t}-${x}`, 'pasangan', 1),
              `${x} + ? = ${t}`,
              String(t - x),
              numSalah(t - x, `p1${t}${x}`, { min: 0, max: 12, step: [1, 2] }),
              pb,
            ),
      )
    }
  }
  for (let t = 11; t <= 20; t++) {
    for (let x = 2; x < t - 1; x += 2) {
      const pb = `${x} + ${t - x} = ${t}. Jadi yang hilang adalah ${t - x}.`
      add(
        (x / 2) % 2
          ? isian(b(`ma-pasangan-2-${t}-${x}`, 'pasangan', 2), `${x} + ? = ${t}`, String(t - x), pb)
          : pilihan(
              b(`ma-pasangan-2-${t}-${x}`, 'pasangan', 2),
              `${x} + ? = ${t}`,
              String(t - x),
              numSalah(t - x, `p2${t}${x}`, { min: 0, max: 22, step: [1, 2, 10] }),
              pb,
            ),
      )
    }
  }
  for (const t of [50, 100]) {
    for (let x = 10; x < t; x += 10) {
      add(
        isian(
          b(`ma-pasangan-3-${t}-${x}`, 'pasangan', 3),
          `${x} + ? = ${t}`,
          String(t - x),
          `${x} + ${t - x} = ${t}. Kita hitung puluhan: ${x / 10} puluhan + ${(t - x) / 10} puluhan = ${t / 10} puluhan.`,
        ),
      )
    }
  }
  // mencocokkan pasangan 10
  {
    const r = makeRng('pasangan-cocok')
    const kelas = [1, 2, 3, 4]
    const seen = new Set<string>()
    let t = 0
    while (seen.size < 12 && t++ < 200) {
      const pickK = r.shuffle(kelas).slice(0, 3)
      const left = pickK.map((k) => (r.rnd() < 0.5 ? k : 10 - k))
      const key = left.slice().sort((x, y) => x - y).join('-')
      if (seen.has(key)) continue
      seen.add(key)
      add(
        cocok(
          b(`ma-pasangan-cocok-${key}`, 'pasangan', 1),
          'Cocokkan angka dengan pasangannya agar jumlahnya 10.',
          left.map((x) => [String(x), String(10 - x)] as [string, string]),
          left.map((x) => `${x} + ${10 - x} = 10`).join('. ') + '.',
        ),
      )
    }
  }

  // =============== PULUHAN & SATUAN ===============
  {
    const lvl = (n: number): Level => (n <= 30 ? 1 : n <= 60 ? 2 : 3)
    const label = (n: number) => `${Math.floor(n / 10)} puluhan ${n % 10} satuan`
    for (let n = 11; n <= 99; n++) {
      if (n % 10 === 0 && n % 20 !== 0) continue
      const p = Math.floor(n / 10)
      const s = n % 10
      const swap = s * 10 + p
      const cand = [
        `${s} puluhan ${p} satuan`,
        `${Math.min(9, p + 1)} puluhan ${s} satuan`,
        `${p} puluhan ${(s + 1) % 10} satuan`,
        `${Math.max(1, p - 1)} puluhan ${s} satuan`,
      ]
      void swap
      if (n % 3 === 0 || n <= 30) {
        add(
          pilihan(
            b(`ma-puluhan-blok-${n}`, 'puluhan', lvl(n)),
            'Lihat balok di atas. Berapa puluhan dan satuannya?',
            label(n),
            fill3(cand, label(n), [`${p} puluhan ${(s + 2) % 10} satuan`, `${Math.min(9, p + 2)} puluhan ${s} satuan`], 'pb' + n),
            `Balok panjang = 1 puluhan, kotak kecil = 1 satuan. Ada ${p} puluhan dan ${s} satuan, yaitu ${n}.`,
            { gambar: `blok:${n}` },
          ),
        )
      }
      if (n % 2 === 1 || n <= 30) {
        add(
          pilihan(
            b(`ma-puluhan-uraian-${n}`, 'puluhan', n <= 30 ? 2 : 3),
            `Angka ${n} terdiri dari…`,
            label(n),
            fill3(cand, label(n), [`${p} puluhan ${(s + 2) % 10} satuan`, `${Math.min(9, p + 2)} puluhan ${s} satuan`], 'pu' + n),
            `Angka ${n}: puluhannya ${p} dan satuannya ${s}.`,
          ),
        )
      }
      if (n % 5 === 1 || n % 7 === 0) {
        add(
          pilihan(
            b(`ma-puluhan-satuan-${n}`, 'puluhan', 2),
            `Berapa SATUAN pada angka ${n}?`,
            String(s),
            numSalah(s, 'ps' + n, { min: 0, max: 9, step: [1, 2, 3, 4] }).concat([]).slice(0, 3),
            `Angka satuan adalah angka paling kanan. Pada ${n}, satuannya ${s}.`,
          ),
        )
        add(
          pilihan(
            b(`ma-puluhan-puluh-${n}`, 'puluhan', 2),
            `Berapa PULUHAN pada angka ${n}?`,
            String(p),
            numSalah(p, 'pp' + n, { min: 0, max: 9, step: [1, 2, 3, 4] }),
            `Angka puluhan ada di sebelah kiri satuan. Pada ${n}, puluhannya ${p}.`,
          ),
        )
      }
      if (n % 4 === 0) {
        add(
          pilihan(
            b(`ma-puluhan-gabung-${n}`, 'puluhan', 2),
            `${p} puluhan + ${s} satuan = ?`,
            String(n),
            fill3([String(swap), String(n + 10), String(n - 10)], String(n), [String(n + 1), String(n - 1)], 'pg' + n),
            `${p} puluhan = ${p * 10}. ${p * 10} + ${s} = ${n}.`,
          ),
        )
      }
      if (n % 10 !== 0 && n % 3 === 1) {
        add(
          isian(
            b(`ma-puluhan-uraian2-${n}`, 'puluhan', 3),
            `${p * 10} + ${s} = ?`,
            String(n),
            `${p * 10} + ${s} = ${n}. ${p * 10} adalah ${p} puluhan dan ${s} adalah satuannya.`,
          ),
        )
      }
    }
  }

  // =============== BANGUN DATAR ===============
  {
    const BANGUN: [string, string][] = [
      ['lingkaran', 'lingkaran'],
      ['segitiga', 'segitiga'],
      ['persegi', 'persegi'],
      ['persegipanjang', 'persegi panjang'],
    ]
    const names = BANGUN.map((x) => x[1])
    for (const [key, nama] of BANGUN) {
      for (let v = 0; v < 3; v++) {
        add(
          pilihan(
            b(`ma-bangun-nama-${key}-${v}`, 'bangun', 1),
            'Bangun apa ini?',
            nama,
            names.filter((x) => x !== nama),
            `Bangun itu adalah ${nama}.`,
            { gambar: `shape:${key}:${v}` },
          ),
        )
      }
      add(
        pilihan(
          b(`ma-bangun-gambar-${key}`, 'bangun', 1),
          `Mana gambar yang berbentuk ${nama}?`,
          `shape:${key}:0`,
          BANGUN.filter((x) => x[0] !== key).map((x) => `shape:${x[0]}:1`),
          `Bangun ${nama} seperti gambar yang benar.`,
          { tipe: 'gambar' },
        ),
      )
    }
    const fakta: [string, string, string, string[], string, Level][] = [
      ['sisi-segitiga', 'Segitiga memiliki berapa sisi?', '3', ['2', '4', '5'], 'Segitiga punya 3 sisi dan 3 sudut. "Segi tiga" artinya bersisi tiga.', 2],
      ['sisi-persegi', 'Persegi memiliki berapa sisi?', '4', ['3', '5', '6'], 'Persegi punya 4 sisi yang sama panjang.', 2],
      ['sisi-pp', 'Persegi panjang memiliki berapa sisi?', '4', ['2', '3', '5'], 'Persegi panjang punya 4 sisi: 2 sisi panjang dan 2 sisi pendek.', 2],
      ['sudut-segitiga', 'Segitiga memiliki berapa sudut?', '3', ['2', '4', '0'], 'Segitiga punya 3 sudut di setiap pojoknya.', 2],
      ['sudut-persegi', 'Persegi memiliki berapa sudut?', '4', ['3', '5', '0'], 'Persegi punya 4 sudut, di setiap pojoknya.', 2],
    ]
    for (const [k, t, a, s, p, l] of fakta) add(pilihan(b(`ma-bangun-${k}`, 'bangun', l), t, a, s, p))
    add(
      pilihan(
        b('ma-bangun-tanpa-sudut', 'bangun', 2),
        'Bangun datar yang tidak memiliki sudut adalah…',
        'lingkaran',
        ['segitiga', 'persegi', 'persegi panjang'],
        'Lingkaran bulat dan tidak punya pojok, jadi tidak punya sudut.',
      ),
      pilihan(
        b('ma-bangun-empat-sama', 'bangun', 3),
        'Bangun datar yang punya 4 sisi dan semua sisinya sama panjang adalah…',
        'persegi',
        ['persegi panjang', 'segitiga', 'lingkaran'],
        'Persegi punya 4 sisi sama panjang. Persegi panjang punya 2 sisi panjang dan 2 sisi pendek.',
      ),
      pilihan(
        b('ma-bangun-tiga-sisi', 'bangun', 2),
        'Bangun datar yang memiliki 3 sisi adalah…',
        'segitiga',
        ['persegi', 'lingkaran', 'persegi panjang'],
        'Segitiga punya tiga sisi.',
      ),
    )
    const benda: [string, string, string, string, string | undefined][] = [
      ['roda', 'Roda sepeda berbentuk…', 'lingkaran', 'Roda bulat, seperti lingkaran.', undefined],
      ['pintu', 'Pintu biasanya berbentuk…', 'persegi panjang', 'Pintu panjang ke atas, seperti persegi panjang.', '🚪'],
      ['catur', 'Papan catur berbentuk…', 'persegi', 'Papan catur sama panjang pada keempat sisinya, seperti persegi.', '♟️'],
      ['pizza', 'Satu pizza utuh berbentuk…', 'lingkaran', 'Pizza utuh bulat, seperti lingkaran.', '🍕'],
      ['buku', 'Buku tulis biasanya berbentuk…', 'persegi panjang', 'Buku tulis punya sisi panjang dan pendek, seperti persegi panjang.', '📓'],
      ['atap', 'Atap rumah yang tampak dari depan sering berbentuk…', 'segitiga', 'Atap tampak seperti segitiga.', '🏠'],
    ]
    for (const [k, t, a, p, g] of benda) {
      add(
        pilihan(
          b(`ma-bangun-benda-${k}`, 'bangun', 1),
          t,
          a,
          names.filter((x) => x !== a),
          p,
          g ? { gambar: g } : {},
        ),
      )
    }
  }

  // =============== PENGUKURAN ===============
  {
    const r = makeRng('ukur')
    const seen = new Set<string>()
    let t = 0
    while (seen.size < 24 && t++ < 300) {
      const a = r.int(2, 9)
      const c = r.int(2, 9)
      if (a === c) continue
      const key = `${a}-${c}`
      if (seen.has(key)) continue
      seen.add(key)
      const panjang = seen.size % 2 === 0
      const jwb = panjang ? (a > c ? 'A' : 'B') : a < c ? 'A' : 'B'
      add(
        pilihan(
          b(`ma-ukur-bar-${key}`, 'ukur', 1),
          panjang ? 'Mana pita yang LEBIH PANJANG?' : 'Mana pita yang LEBIH PENDEK?',
          jwb,
          [jwb === 'A' ? 'B' : 'A'],
          panjang
            ? `Pita ${jwb} lebih panjang (${jwb === 'A' ? a : c} kotak) daripada pita ${jwb === 'A' ? 'B' : 'A'} (${jwb === 'A' ? c : a} kotak).`
            : `Pita ${jwb} lebih pendek (${jwb === 'A' ? a : c} kotak) daripada pita ${jwb === 'A' ? 'B' : 'A'} (${jwb === 'A' ? c : a} kotak).`,
          { gambar: `bar:${a},${c}` },
        ),
      )
    }
    const berat: [string, string, string, string][] = [
      ['gajah-semut', '🐘 gajah', '🐜 semut', '🐘🐜'],
      ['truk-sepeda', '🚚 truk', '🚲 sepeda', '🚚🚲'],
      ['sapi-ayam', '🐄 sapi', '🐔 ayam', '🐄🐔'],
      ['semangka-ceri', '🍉 semangka', '🍒 ceri', '🍉🍒'],
      ['gajah-kucing', '🐘 gajah', '🐱 kucing', '🐘🐱'],
      ['batu-balon', '🪨 batu besar', '🎈 balon', '🪨🎈'],
    ]
    for (const [k, berat1, ringan, g] of berat) {
      add(
        pilihan(
          b(`ma-ukur-berat-${k}`, 'ukur', 1),
          'Mana yang LEBIH BERAT?',
          berat1,
          [ringan],
          `${berat1} lebih berat, sedangkan ${ringan} lebih ringan.`,
          { gambar: g },
        ),
        pilihan(
          b(`ma-ukur-ringan-${k}`, 'ukur', 1),
          'Mana yang LEBIH RINGAN?',
          ringan,
          [berat1],
          `${ringan} lebih ringan, sedangkan ${berat1} lebih berat.`,
          { gambar: g },
        ),
      )
    }
    const tinggi: [string, string, string, string][] = [
      ['jerapah-kucing', '🦒 jerapah', '🐱 kucing', '🦒🐱'],
      ['pohon-tunas', '🌳 pohon besar', '🌱 tunas', '🌳🌱'],
      ['gedung-rumah', '🏢 gedung', '🏠 rumah', '🏢🏠'],
      ['gajah-semut', '🐘 gajah', '🐜 semut', '🐘🐜'],
    ]
    for (const [k, tg, rd, g] of tinggi) {
      add(
        pilihan(
          b(`ma-ukur-tinggi-${k}`, 'ukur', 1),
          'Mana yang LEBIH TINGGI?',
          tg,
          [rd],
          `${tg} lebih tinggi daripada ${rd}.`,
          { gambar: g },
        ),
      )
    }
    const seen2 = new Set<string>()
    let t2 = 0
    while (seen2.size < 18 && t2++ < 300) {
      const a = r.int(3, 15)
      const c = r.int(3, 15)
      if (a === c) continue
      const key = `${a}-${c}`
      if (seen2.has(key)) continue
      seen2.add(key)
      const lbh = a > c ? 'A' : 'B'
      add(
        pilihan(
          b(`ma-ukur-klip-${key}`, 'ukur', 2),
          `Pensil A panjangnya ${a} klip kertas. Pensil B panjangnya ${c} klip kertas. Pensil mana yang lebih panjang?`,
          `Pensil ${lbh}`,
          [`Pensil ${lbh === 'A' ? 'B' : 'A'}`],
          `${Math.max(a, c)} klip lebih banyak dari ${Math.min(a, c)} klip, jadi pensil ${lbh} lebih panjang.`,
          { gambar: '✏️📎' },
        ),
      )
      add(
        pilihan(
          b(`ma-ukur-selisih-${key}`, 'ukur', 3),
          `Pensil A panjangnya ${Math.max(a, c)} klip. Pensil B panjangnya ${Math.min(a, c)} klip. Berapa klip selisih panjangnya?`,
          String(Math.abs(a - c)),
          numSalah(Math.abs(a - c), 'ks' + key, { min: 1, max: 20, step: [1, 2, 3] }),
          `Selisihnya ${Math.max(a, c)} − ${Math.min(a, c)} = ${Math.abs(a - c)} klip.`,
          { gambar: '✏️📎' },
        ),
      )
    }
  }

  // =============== JAM ===============
  for (let h = 1; h <= 12; h++) {
    add(
      pilihan(
        b(`ma-jam-lihat-${h}`, 'jam', 1),
        'Sekarang jam berapa?',
        `Jam ${h}`,
        numSalah(h, 'jm' + h, { min: 1, max: 12, step: [1, 2, 3] }).map((x) => `Jam ${x}`),
        `Jarum pendek menunjuk angka ${h} dan jarum panjang menunjuk angka 12. Jadi jam ${h}.`,
        { gambar: `clock:${h}` },
      ),
    )
    add(
      pilihan(
        b(`ma-jam-teks-${h}`, 'jam', 2),
        `Jarum pendek menunjuk angka ${h} dan jarum panjang menunjuk angka 12. Jam berapa?`,
        `Jam ${h}`,
        numSalah(h, 'jt' + h, { min: 1, max: 12, step: [1, 2, 3] }).map((x) => `Jam ${x}`),
        `Jarum pendek di ${h}, jarum panjang di 12, berarti jam ${h} tepat.`,
      ),
    )
    if (h <= 9) {
      for (const k of [1, 2, 3]) {
        if (h + k > 12) continue
        add(
          pilihan(
            b(`ma-jam-lagi-${h}-${k}`, 'jam', 3),
            `Sekarang jam ${h}. ${k} jam lagi jam berapa?`,
            `Jam ${h + k}`,
            numSalah(h + k, `jl${h}${k}`, { min: 1, max: 12, step: [1, 2, 3] }).map((x) => `Jam ${x}`),
            `${h} + ${k} = ${h + k}. Jadi ${k} jam lagi adalah jam ${h + k}.`,
            { gambar: `clock:${h}` },
          ),
        )
      }
    }
    if (h >= 4) {
      for (const k of [1, 2, 3]) {
        add(
          pilihan(
            b(`ma-jam-lalu-${h}-${k}`, 'jam', 3),
            `Sekarang jam ${h}. ${k} jam yang lalu jam berapa?`,
            `Jam ${h - k}`,
            numSalah(h - k, `jy${h}${k}`, { min: 1, max: 12, step: [1, 2, 3] }).map((x) => `Jam ${x}`),
            `${h} − ${k} = ${h - k}. Jadi ${k} jam yang lalu adalah jam ${h - k}.`,
            { gambar: `clock:${h}` },
          ),
        )
      }
    }
  }

  // =============== SOAL CERITA ===============
  {
    const r = makeRng('cerita')
    const nm = () => r.shuffle(NAMA_ORANG)
    const mk = (level: Level, count: number, f: (i: number) => Question | null) => {
      let made = 0
      let t = 0
      while (made < count && t++ < 400) {
        const q = f(made + 1000 * level)
        if (q) {
          add(q)
          made++
        }
      }
    }
    const seen = new Set<string>()
    const once = (k: string) => (seen.has(k) ? false : (seen.add(k), true))
    // tambah L1
    mk(1, 24, () => {
      const [n1, n2] = nm()
      const [o, e] = r.pick(BENDA)
      const a = r.int(1, 8)
      const c = r.int(1, 9 - a)
      const key = `ct-t1-${a}-${c}-${o}`
      if (!once(key)) return null
      const ans = a + c
      return pilihan(
        b('ma-' + key, 'cerita', 1),
        `${n1} punya ${a} ${o}. ${n2} memberi ${c} ${o} lagi. Berapa ${o} ${n1} sekarang?`,
        String(ans),
        numSalah(ans, key, { min: 0, max: 12, step: [1, 2] }),
        `${a} + ${c} = ${ans}. Jadi ${n1} punya ${ans} ${o}.`,
        { gambar: e },
      )
    })
    // kurang L1
    mk(1, 24, () => {
      const [n1] = nm()
      const [o, e] = r.pick(BENDA)
      const a = r.int(3, 10)
      const c = r.int(1, a - 1)
      const key = `ct-k1-${a}-${c}-${o}`
      if (!once(key)) return null
      const ans = a - c
      return pilihan(
        b('ma-' + key, 'cerita', 1),
        `${n1} punya ${a} ${o}. ${n1} memberikan ${c} ${o} kepada adik. Berapa ${o} ${n1} sekarang?`,
        String(ans),
        numSalah(ans, key, { min: 0, max: 12, step: [1, 2] }),
        `${a} − ${c} = ${ans}. Jadi ${n1} punya ${ans} ${o} sekarang.`,
        { gambar: e },
      )
    })
    // gabung hewan L2
    const HEWAN: [string, string, string, string][] = [
      ['ayam', 'bebek', '🐔', '🦆'],
      ['kucing', 'kelinci', '🐱', '🐰'],
      ['sapi', 'kambing', '🐄', '🐐'],
      ['ikan merah', 'ikan biru', '🐠', '🐟'],
    ]
    mk(2, 20, () => {
      const [h1, h2, e1, e2] = r.pick(HEWAN)
      const a = r.int(4, 12)
      const c = r.int(3, 9)
      if (a + c > 20) return null
      const key = `ct-g2-${a}-${c}-${h1}`
      if (!once(key)) return null
      const ans = a + c
      return isian(
        b('ma-' + key, 'cerita', 2),
        `Di kandang ada ${a} ${h1} dan ${c} ${h2}. Berapa jumlah hewan seluruhnya?`,
        String(ans),
        `${a} + ${c} = ${ans}. Jumlah seluruh hewan ada ${ans}.`,
        { gambar: e1 + e2 },
      )
    })
    // kurang L2
    mk(2, 20, () => {
      const [n1] = nm()
      const [o, e] = r.pick(BENDA)
      const a = r.int(12, 20)
      const c = r.int(3, 9)
      const key = `ct-k2-${a}-${c}-${o}`
      if (!once(key)) return null
      const ans = a - c
      return pilihan(
        b('ma-' + key, 'cerita', 2),
        `${n1} membeli ${a} ${o}. Sebanyak ${c} ${o} diberikan kepada teman. Berapa ${o} yang tersisa?`,
        String(ans),
        numSalah(ans, key, { min: 0, max: 22, step: [1, 2, 10] }),
        `${a} − ${c} = ${ans}. Sisanya ${ans} ${o}.`,
        { gambar: e },
      )
    })
    // selisih L3
    mk(3, 20, () => {
      const [n1, n2] = nm()
      const [o, e] = r.pick(BENDA)
      const a = r.int(8, 20)
      const c = r.int(2, a - 2)
      const key = `ct-s3-${a}-${c}-${o}`
      if (!once(key)) return null
      const ans = a - c
      return pilihan(
        b('ma-' + key, 'cerita', 3),
        `${n1} punya ${a} ${o}. ${n2} punya ${c} ${o}. ${n1} punya berapa ${o} LEBIH BANYAK daripada ${n2}?`,
        String(ans),
        numSalah(ans, key, { min: 0, max: 22, step: [1, 2, 3] }),
        `Cari selisihnya: ${a} − ${c} = ${ans}. ${n1} punya ${ans} ${o} lebih banyak.`,
        { gambar: e },
      )
    })
    // dua langkah L3
    mk(3, 20, () => {
      const [n1] = nm()
      const [o, e] = r.pick(BENDA)
      const a = r.int(5, 12)
      const c = r.int(2, 8)
      const d = r.int(2, a + c - 1)
      const key = `ct-2l-${a}-${c}-${d}-${o}`
      if (!once(key)) return null
      const ans = a + c - d
      return isian(
        b('ma-' + key, 'cerita', 3),
        `${n1} punya ${a} ${o}. Lalu ia diberi ${c} ${o} lagi. Setelah itu ${n1} memberikan ${d} ${o} kepada temannya. Berapa ${o} ${n1} sekarang?`,
        String(ans),
        `Langkah 1: ${a} + ${c} = ${a + c}. Langkah 2: ${a + c} − ${d} = ${ans}.`,
        { gambar: e },
      )
    })
  }

  void benarSalah
  return out
}

export const BANK_MATEMATIKA: Question[] = build()
