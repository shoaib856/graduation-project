/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: { max: "576px" },

      md: { max: "767px" },

      "md-lg": { max: "992px" },

      lg: "1024px",

      xl: "1280px",
    },
    fontFamily: {
      Signika: ["Signika", "sans-serif"],
    },
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
