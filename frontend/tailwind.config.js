/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nova-dark': '#0f172a',
        'nova-darker': '#020617',
        'nova-card': '#1e293b',
        'nova-border': '#334155',
        'nova-teal': '#00D4FF',
        'nova-teal-dark': '#0080FF',
        'nova-text': '#e2e8f0',
        'nova-text-muted': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
