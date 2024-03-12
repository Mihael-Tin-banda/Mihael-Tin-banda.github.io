/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./docs/**/*.html", "./docs/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    "@tailwindcss/forms",
    ['prettier-plugin-tailwindcss'],
    require('tailwindcss'),
  ],
}
