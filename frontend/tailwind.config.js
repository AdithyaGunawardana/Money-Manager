/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        income: '#16a34a',
        expense: '#dc2626'
      }
    }
  },
  plugins: []
}
