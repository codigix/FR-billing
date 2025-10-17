/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        accent: "#f97316",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
