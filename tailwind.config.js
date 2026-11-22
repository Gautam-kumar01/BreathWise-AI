/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fdfbf7',
          100: '#f6f1e8',
          200: '#ece2d0',
          300: '#dfcdb1',
          400: '#ceb28a',
          500: '#ba9465',
          600: '#9e764a',
          700: '#7e5a38',
          800: '#5e4128',
          900: '#3e2a1a',
          950: '#23160e',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#f9eae4',
          200: '#f3d6cc',
          300: '#e9b6a4',
          400: '#dc8d73',
          500: '#cc6849',
          600: '#b85133',
          700: '#993f26',
          800: '#7d3522',
          900: '#672e20',
          950: '#37150d',
        },
        honey: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        aqi: {
          good: '#15803d',         // Green
          satisfactory: '#65a30d', // Fresh Olive/Lime
          moderate: '#d97706',     // Warm Amber
          poor: '#ea580c',         // Terracotta Orange
          veryPoor: '#dc2626',     // Crimson
          severe: '#7f1d1d',       // Deep Burgundy
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(120, 77, 48, 0.06), 0 1px 2px -1px rgba(120, 77, 48, 0.04)',
        'warm-md': '0 4px 6px -1px rgba(120, 77, 48, 0.08), 0 2px 4px -2px rgba(120, 77, 48, 0.05)',
        'warm-lg': '0 10px 15px -3px rgba(120, 77, 48, 0.1), 0 4px 6px -4px rgba(120, 77, 48, 0.06)',
        'warm-xl': '0 20px 25px -5px rgba(120, 77, 48, 0.12), 0 8px 10px -6px rgba(120, 77, 48, 0.08)',
      }
    },
  },
  plugins: [],
}
