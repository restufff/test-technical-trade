import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0b111e',
        surface: {
          DEFAULT: '#111827',
          card: '#131b2e',
          cardHover: '#18223a',
          border: '#1f2b42',
          borderLight: '#2a3a59',
        },
        indodax: {
          blue: '#1ea1f2',
          cyan: '#00b8d9',
          cyanHover: '#00d0f5',
          navy: '#0b111e',
        },
        trading: {
          buy: '#0ecb81',
          buyHover: '#10dc8c',
          buyBg: 'rgba(14, 203, 129, 0.12)',
          sell: '#f6465d',
          sellHover: '#ff536a',
          sellBg: 'rgba(246, 70, 93, 0.12)',
          spread: '#f0b90b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
