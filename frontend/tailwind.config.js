/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 
          50: '#f0fdf4', 
          100: '#dcfce7', 
          200: '#bbf7d0', 
          300: '#86efac', 
          400: '#4ade80', 
          500: '#22c55e', 
          600: '#16a34a', 
          700: '#15803d', 
          800: '#166534', 
          900: '#14532d', 
          950: '#052e16' 
        },
        secondary: { 
          50: '#ecfdf5', 
          100: '#d1fae5', 
          200: '#a7f3d0', 
          300: '#6ee7b7', 
          400: '#34d399', 
          500: '#10b981', 
          600: '#059669', 
          700: '#047857', 
          800: '#065f46', 
          900: '#064e3b', 
          950: '#022c22' 
        },
        accent: { 
          50: '#fffbeb', 
          100: '#fef3c7', 
          200: '#fde68a', 
          300: '#fcd34d', 
          400: '#fbbf24', 
          500: '#f59e0b', 
          600: '#d97706', 
          700: '#b45309', 
          800: '#92400e', 
          900: '#78350f', 
          950: '#451a03' 
        },
        industrial: {
          50: 'var(--color-bg-base)',
          100: 'var(--color-bg-panel-hover)',
          200: 'var(--color-border)',
          300: 'var(--color-text-main)',
          400: 'var(--color-text-secondary)',
          500: '#78716c',
          600: '#57534e',
          700: 'var(--color-border)',
          750: 'var(--color-bg-panel-hover)',
          800: 'var(--color-bg-panel)',
          850: 'var(--color-bg-panel-hover)',
          900: 'var(--color-bg-base)',
          950: 'var(--color-bg-base-darker)'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'system-ui', 'sans-serif'], 
        mono: ['JetBrains Mono', 'monospace'] 
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-10px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(22,163,74,0.2)' }, '100%': { boxShadow: '0 0 20px rgba(22,163,74,0.4)' } },
      }
    }
  },
  plugins: []
}
