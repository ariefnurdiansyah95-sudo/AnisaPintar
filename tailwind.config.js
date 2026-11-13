/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Palet ceria untuk anak SD kelas 1 — ungu (utama), jeruk (aksen),
      // plus warna per mata pelajaran. Pola token sama seperti GoJelantah.
      colors: {
        accent: { DEFAULT: '#6C5CE7', light: '#A29BFE', dark: '#4B3FC4' },
        sun: { DEFAULT: '#FF9F43', light: '#FFC078', dark: '#E8710A' },
        ink: '#3B2F63',
        cream: '#FFF8E7',
        good: '#2ED573',
        bad: '#FF6B6B',
        sky: { DEFAULT: '#54A0FF', dark: '#2E86DE' },
        bubble: '#FF78B5',
      },
      fontFamily: {
        kid: ['ui-rounded', '"Nunito"', '"Baloo 2"', '"Trebuchet MS"', '"Comic Sans MS"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        chunky: '0 6px 0 rgba(59,47,99,0.18)',
        chunkyLg: '0 8px 0 rgba(59,47,99,0.2)',
      },
      keyframes: {
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        pop: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '70%': { transform: 'scale(1.06)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-8px)' }, '75%': { transform: 'translateX(8px)' } },
        fall: { '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(105vh) rotate(540deg)', opacity: '0.9' } },
        blink: { '0%,92%,100%': { transform: 'scaleY(1)' }, '96%': { transform: 'scaleY(0.1)' } },
      },
      animation: {
        bob: 'bob 2.4s ease-in-out infinite',
        pop: 'pop 0.35s ease-out both',
        shake: 'shake 0.35s ease-in-out',
        fall: 'fall 2.8s linear forwards',
        blink: 'blink 4s infinite',
      },
    },
  },
  plugins: [],
}
