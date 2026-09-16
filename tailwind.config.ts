import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f4ff',
          100: '#e6e9fe',
          200: '#c4caff',
          300: '#a2abff',
          400: '#7d84f7',
          500: '#5b5eec',
          600: '#4640d6',
          700: '#3730ab',
          800: '#2b2686',
          900: '#211d63',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 15, 30, 0.06), 0 1px 2px rgba(15,15,30,0.04)',
        card: '0 4px 24px rgba(15, 15, 30, 0.06)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
