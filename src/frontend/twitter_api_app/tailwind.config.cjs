/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        twitter: "#15202b",
        "twitter-blue": "#1d9bf0",
      },
    },
  },
  plugins: [],
};
