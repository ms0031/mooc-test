/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Add your custom colors here
      colors: {
        background: '#ffffff', // You can set any color value you want
        // Add other custom colors as needed
      },
      fontFamily: {
        raleway: ['var(--font-raleway)'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 }
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite'
      },
      scale: {
        '105': '1.05',
        '108': '1.08',
        '110': '1.10',
      }
    },
  },
  plugins: [],
}