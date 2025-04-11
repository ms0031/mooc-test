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
    },
  },
  plugins: [],
}