/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#060912',
        night: '#0b1020',
        frost: '#e7eefc',
        muted: '#9aa7bd',
        cyan: {
          glow: '#56d9ff',
        },
        violet: {
          glow: '#9b7cff',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0, 0, 0, 0.34)',
        glow: '0 0 48px rgba(86, 217, 255, 0.16)',
      },
      backgroundImage: {
        'radial-soft':
          'radial-gradient(circle at 20% 20%, rgba(86, 217, 255, 0.18), transparent 28%), radial-gradient(circle at 80% 10%, rgba(155, 124, 255, 0.16), transparent 28%), radial-gradient(circle at 50% 90%, rgba(34, 197, 94, 0.08), transparent 32%)',
      },
    },
  },
  plugins: [],
};
