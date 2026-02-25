/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          raised: '#12131a',
          overlay: '#1a1b24',
          border: 'rgba(255,255,255,0.06)',
        },
        accent: {
          DEFAULT: '#0369A1',
          light: '#0ea5e9',
          glow: 'rgba(3,105,161,0.25)',
        },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
