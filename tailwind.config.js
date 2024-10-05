import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      mapos: "#f26000",
    }
  },
  darkMode: "class",
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            current: "#f26000", // Custom primary color
          },
        },
        dark: {
          colors: {
            current: "#f26000", // Same custom color for dark theme
          },
        },
      },
    }),
  ],
}
