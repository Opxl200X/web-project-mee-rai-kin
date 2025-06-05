/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3ddc97',
        'primary-dark': '#2a9d73',
        secondary: '#f8bbd0',
        accent: '#ff5c5c',
        background: '#fff8a6',
        card: '#ffffff',
        'text-primary': '#333333',
        warning: '#f2994a',
        success: '#4caf50',
        error: '#f44336'
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif']
      },
      animation: {
        'fade-down': 'fadeDown 0.6s ease-in-out',
        'rainbow': 'rainbowFast 5s linear infinite',
        'pulse-light': 'pulseLight 2s ease-in-out infinite'
      },
      keyframes: {
        fadeDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        rainbowFast: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        pulseLight: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        }
      }
    }
  },
  plugins: []
};