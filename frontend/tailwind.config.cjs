/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'ciput-bg': '#f6fffd',
        'ciput-primary': '#0a1931',
        'ciput-secondary': '#1a3d63',
        'ciput-active-hover': '#b3cfe5',
      },
    },
  },
  plugins: [],
});
