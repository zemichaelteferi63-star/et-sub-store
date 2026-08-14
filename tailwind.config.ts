import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          'blue-hover': '#1557b0',
          'blue-light': '#e8f0fe',
          red: '#ea4335',
          'red-hover': '#d93025',
          'red-light': '#fce8e6',
          yellow: '#fbbc04',
          'yellow-hover': '#f29900',
          'yellow-light': '#fef7e0',
          green: '#34a853',
          'green-hover': '#1e8e3e',
          'green-light': '#e6f4ea',
          dark: '#202124',
          subtle: '#5f6368',
          border: '#dadce0',
          bg: '#f8f9fa',
          surface: '#ffffff',
        },
        telebirr: {
          DEFAULT: '#0066cc',
          hover: '#0052a3',
          light: '#e6f0fa',
          accent: '#ffcc00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'google-sm': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google-md': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'google-lg': '0 2px 6px 2px rgba(60,64,67,0.15), 0 8px 24px 6px rgba(60,64,67,0.15)',
        'google-hover': '0 4px 12px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.12)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
