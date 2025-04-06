/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554',
          DEFAULT: '#3b82f6'
        },
        secondary: {
          '50': '#fdf2f8',
          '100': '#fce7f3',
          '200': '#fbcfe8',
          '300': '#f9a8d4',
          '400': '#f472b6',
          '500': '#ec4899',
          '600': '#db2777',
          '700': '#be185d',
          '800': '#9d174d',
          '900': '#831843',
          '950': '#500724',
          DEFAULT: '#ec4899'
        },
        accent: {
          '50': '#f0fdf4',
          '100': '#dcfce7',
          '200': '#bbf7d0',
          '300': '#86efac',
          '400': '#4ade80',
          '500': '#22c55e',
          '600': '#16a34a',
          '700': '#15803d',
          '800': '#166534',
          '900': '#14532d',
          '950': '#052e16',
          DEFAULT: '#22c55e'
        },
        dark: {
          '50': '#fafafa',
          '100': '#f5f5f5',
          '200': '#e5e5e5',
          '300': '#d4d4d4',
          '400': '#a3a3a3',
          '500': '#737373',
          '600': '#525252',
          '700': '#404040',
          '800': '#262626',
          '900': '#171717',
          '950': '#0a0a0a',
          DEFAULT: '#171717'
        },
        wood: {
          light: '#d4a76a',
          medium: '#b37e43',
          dark: '#8a5a25',
          ebony: '#3c3c3c',
          maple: '#f0e6d2',
          rosewood: '#6e4530'
        },
        fretboard: {
          black: '#121212',
          rosewood: '#3e1f09',
          maple: '#e6c98c',
          fretWire: '#d1d1d1',
          inlay: '#f0f0f0'
        },
        metal: {
          dark: '#0f2942',
          darker: '#0a1f33',
          darkest: '#061525',
          blue: '#2276ff',
          lightblue: '#5dc5ff',
          highlight: '#70e1ff',
          glow: '#0095ff',
          silver: '#a4b9d1'
        }
      },
      animation: {
        'string-vibration': 'vibration 0.5s ease-out',
        'fret-press': 'press 0.2s ease-out',
        'neon-pulse': 'neonPulse 2.5s ease-in-out infinite alternate',
        'border-glow': 'borderGlow 2s ease-in-out infinite alternate',
        'border-trail': 'borderTrail 5s linear infinite'
      },
      keyframes: {
        vibration: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '25%': {
            transform: 'translateY(-2px)'
          },
          '75%': {
            transform: 'translateY(2px)'
          }
        },
        press: {
          '0%': {
            transform: 'scale(1)'
          },
          '50%': {
            transform: 'scale(0.95)'
          },
          '100%': {
            transform: 'scale(1)'
          }
        },
        neonPulse: {
          '0%, 100%': {
            textShadow: '0 0 2px #fff, 0 0 4px #fff, 0 0 8px #0095ff, 0 0 12px #0095ff, 0 0 16px #0095ff'
          },
          '50%': {
            textShadow: '0 0 1px #fff, 0 0 2px #fff, 0 0 4px #0095ff, 0 0 8px #0095ff, 0 0 12px #0095ff'
          }
        },
        borderGlow: {
          '0%, 100%': {
            boxShadow: '0 0 5px #0095ff, 0 0 10px #0095ff'
          },
          '50%': {
            boxShadow: '0 0 15px #0095ff, 0 0 20px #0095ff'
          }
        },
        borderTrail: {
          '0%': {
            strokeDashoffset: '0%'
          },
          '100%': {
            strokeDashoffset: '100%'
          }
        }
      },
      boxShadow: {
        'neon-blue': '0 0 5px #0095ff, 0 0 10px #0095ff',
        'neon-blue-lg': '0 0 7px #0095ff, 0 0 15px #0095ff, 0 0 25px #0095ff',
        'neon-inner': 'inset 0 0 7px #0095ff, inset 0 0 15px #0095ff'
      },
      textShadow: {
        'neon-blue': '0 0 5px #0095ff, 0 0 10px #0095ff',
        'neon-blue-lg': '0 0 7px #0095ff, 0 0 15px #0095ff, 0 0 25px #0095ff'
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        'grid-pattern-light': 'linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)'
      },
      fontFamily: {
        'metal-mania': ['"Metal Mania"', 'cursive'],
        'oswald': ['"Oswald"', 'sans-serif'],
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon': {
          textShadow: '0 0 2px #fff, 0 0 4px #0095ff, 0 0 6px #0095ff, 0 0 8px #0095ff',
        },
        '.text-gradient-metal': {
          background: 'linear-gradient(to bottom, #ffffff 0%, #e6f0ff 25%, #2276ff 50%, #0d47a1 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'filter': 'drop-shadow(0 2px 2px rgba(13, 71, 161, 0.4))'
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        '.animate-shimmer': {
          animation: 'shimmer 8s linear infinite',
          backgroundSize: '200% auto',
        },
        '.text-shadow-neon-sm': {
          textShadow: '0 0 3px #fff, 0 0 7px #0095ff, 0 0 10px #0095ff',
        },
        '.text-shadow-3d-blue': {
          textShadow: '1px 1px 0 #0d4d8c, 2px 2px 0 #0d4d8c, 3px 3px 0 #0d4d8c, 4px 4px 0 #0d4d8c',
        },
        '.text-metal': {
          background: 'linear-gradient(180deg, #ffffff 0%, #a4b9d1 50%, #3c83f6 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}