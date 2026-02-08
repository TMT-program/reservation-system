/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf7f1",
          100: "#fae8d7",
          200: "#f4d0ae",
          300: "#eab381",
          400: "#e09458",
          500: "#d77937",
          600: "#b85f2a",
          700: "#8f4722",
          800: "#6a361c",
          900: "#4b2615"
        }
      }
    }
  },
  plugins: []
};
