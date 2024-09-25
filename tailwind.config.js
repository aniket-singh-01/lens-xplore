import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.*",
  ],
  theme: {
    extend: {
      colors: {
        text: "#e7e7ea",
        background: "#001220",
        primary: "#FBAE3C",
        secondary: "#e1685e",
        accent: "#3d3056",
        muted: "#333333",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
