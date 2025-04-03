/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Target all HTML and Angular component files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A3D5F", // Dark Blue
        secondary: "#2C3E50", // Charcoal Gray
        accent: "#D97B43", // Faded Orange
        accentText: "#FAFAFA",
        secondaryLighter: "#2B567A", // Lighter Charcoal Gray
      },
      height: {
        screen: "100vh",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow": {
          "text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow-md": {
          "text-shadow": "3px 3px 6px rgba(0, 0, 0, 0.6)",
        },
        ".text-shadow-lg": {
          "text-shadow": "4px 4px 8px rgba(0, 0, 0, 0.8)",
        },
      });
    },
  ],
};
