/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6BAF92',
        'bg-light': '#F8FAF9',
        'bg-dark': '#0F172A',
        'card-light': '#FFFFFF',
        'card-dark': '#1E293B',
        'text-light': '#1F2937',
        'text-dark': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
