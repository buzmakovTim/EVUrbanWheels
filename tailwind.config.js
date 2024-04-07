/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "rgb(65, 65, 206)",
        "danger-color": "rgb(226, 14, 14)",
        "font-color-white": "rgb(255, 255, 255)"
      }
    },
  },
  plugins: [],
}

