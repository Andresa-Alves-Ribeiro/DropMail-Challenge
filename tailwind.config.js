/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        borderGray: "#dddddd", // Defina a cor da borda preta
      },
      borderWidth: {
        '2': '2px', // Defina a largura da borda como 2px
      },
    },
  },
  plugins: [],
}

