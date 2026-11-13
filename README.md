# Anisa Pintar 🦉

Teman belajar kelas 1 SD: membaca & mengeja, matematika, Bahasa Indonesia, Pendidikan Pancasila, IPAS, PLBJ (Betawi), Bahasa Inggris dasar, dan seni. Dipandu guru virtual **Kak Bubu**.

Arsitektur sama seperti GoJelantah: Next.js 14 (App Router) + TypeScript + Tailwind, tanpa backend. Satu sumber konstanta di `lib/site.ts`.

## Menjalankan
```bash
npm install
npm run dev          # http://localhost:3000
npm run validasi     # memeriksa seluruh bank soal
npm run build && npm start
```

## Struktur
- `lib/bank/` — bank soal (dibangkitkan + ditulis tangan), per mata pelajaran
- `lib/lessons/` — materi tiap pelajaran (slide + latihan)
- `lib/select.ts` — penyusun sesi: latihan, bank, harian, ulangan, evaluasi, ulangi-salah
- `lib/progress.ts` — XP, level, lencana, statistik (disimpan di `localStorage`)
- `components/` — Kak Bubu (SVG), kuis (6 tipe soal), pemutar materi, game kreasi
- `app/orangtua` — dasbor orang tua (PIN bawaan `1234`, ganti di Pengaturan)

## Catatan
- Kemajuan belajar tersimpan di perangkat (localStorage); gunakan Unduh/Pulihkan untuk pindah perangkat.
- Suara memakai Web Speech API; kualitas tergantung suara Indonesia yang terpasang di perangkat.
- Setiap soal punya pembahasan; soal yang salah diulang sampai benar 2 kali berturut-turut.

## Kredit
Gambar emoji: [Twemoji](https://github.com/twitter/twemoji) © Twitter, Inc. dan kontributor, lisensi CC-BY 4.0 (dikemas dalam `public/emoji-sprite.svg`).
