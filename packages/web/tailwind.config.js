/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
        },
        border: {
          primary: "#222222",
          hover: "#333333",
        },
        score: {
          high: "#4ade80",
          mid: "#facc15",
          low: "#f87171",
        },
      },
      fontFamily: {
        display: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
