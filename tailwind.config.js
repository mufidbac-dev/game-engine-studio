/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './player.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        blender: {
          bg: '#111827',
          panel: '#181c24',
          border: '#2d3748',
          accent: '#2563eb'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
