/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"  // Target all HTML and Angular component files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A3D5F',  // Dark Blue
        secondary: '#2C5545', // Dark Green
        accent: '#D97B43'     // Faded Orange
      }
    },
  },
  plugins: [],
}
