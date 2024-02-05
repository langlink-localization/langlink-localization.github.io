const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      dark: true,
      colors: {
        primary: "#FF4136",
        secondary: "#FF851B",
        success: "#2ECC40",
        warning: "#FFDC00",
        error: "#FF4136",
        light: "#F6F6FF",
        dark: "#000",
      },
    }),
  ],
};
