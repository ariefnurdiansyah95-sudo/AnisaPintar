/** Normalisasi jawaban isian: huruf kecil, tanpa tanda baca, spasi rapi. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?'"“”‘’\-:;]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
