/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taf: {
          red: '#D91A2A',
          darkRed: '#B00E1C',
          lightRed: '#FFECEF',
          blue: '#1E3A8A',
        }
      }
    },
  },
  plugins: [],
}
