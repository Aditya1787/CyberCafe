/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#243F70',
          'navy-dark': '#172B4D',
          teal: '#0FA6B5',
          'teal-dark': '#087F8C',
          gold: '#D9A441',
          bg: '#F7F9FC',
          surface: '#FFFFFF',
          text: '#1F2937',
          muted: '#64748B',
          success: '#15803D',
          warning: '#B45309',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(36, 63, 112, 0.08)',
        'elevated': '0 10px 25px -5px rgba(23, 43, 77, 0.1), 0 8px 10px -6px rgba(23, 43, 77, 0.06)',
        'neo': '8px 8px 18px #cad5e3, -8px -8px 18px #ffffff',
        'neo-sm': '4px 4px 10px #cbd6e4, -4px -4px 10px #ffffff',
        'neo-lg': '12px 12px 24px #c2cedd, -12px -12px 24px #ffffff',
        'neo-inset': 'inset 3px 3px 6px #c6d2e1, inset -3px -3px 6px #ffffff',
        'neo-inset-sm': 'inset 2px 2px 4px #c6d2e1, inset -2px -2px 4px #ffffff',
      }
    },
  },
  plugins: [],
}
