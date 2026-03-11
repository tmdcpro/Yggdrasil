/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ygg: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
          muted: '#94a3b8',
          accent: '#38bdf8',
          success: '#10b981',
          error: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
