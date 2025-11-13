/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      colors: {
        background: "#0f111a",
        foreground: "#e0e3eb",
        accent: "#00c8ff",
      },
    },
  },
  plugins: [],
};
