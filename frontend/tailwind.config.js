/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgDark: "#0F0F0F",
        bgCard: "#1C1C1C",
        accent: "#F97316",
        textLight: "#FFFFFF",
        textMuted: "#9CA3AF",
      },
    },
  },
  plugins: [],
};
