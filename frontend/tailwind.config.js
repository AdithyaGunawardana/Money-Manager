/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        navy: '#0b1c30',
        page: '#f8fafc',
        income: '#059669',
        'income-soft': '#ecfdf5',
        expense: '#e11d48',
        'expense-soft': '#fff1f2'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
}
