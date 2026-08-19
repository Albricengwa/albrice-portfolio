/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5D4037',
        'primary-dark': '#442A22',
        'primary-light': '#77574D',
        accent: '#A0522D',
        'accent-dark': '#8B5E3C',
        background: '#FEFAE0',
        surface: '#FFFFFF',
        parchment: '#F2E9E4',
        linen: '#F9F5F0',
        ink: '#1D1C0D',
        muted: '#504441',
        divider: '#D4C3BE',
        deep: '#323120',
        cream: '#FEFAE0',
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
