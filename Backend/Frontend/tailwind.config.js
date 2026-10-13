/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: "#090d16",
          900: "#0d1117",
          850: "#131720",
          800: "#161b22",
          700: "#21262d",
          600: "#30363d",
          500: "#484f58",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["dark"],
  },
}

