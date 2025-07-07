/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here if needed
      }
    },
  },
  plugins: [],
}
