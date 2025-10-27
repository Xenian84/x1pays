/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00E5FF',
          light: '#6EFFFF',
          dark: '#00B2CC',
        },
        secondary: {
          DEFAULT: '#76FF03',
          light: '#B2FF59',
          dark: '#64DD17',
        },
        background: {
          DEFAULT: '#0A1929',
          paper: '#132F4C',
        },
      },
      fontFamily: {
        sans: ['Sora', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
