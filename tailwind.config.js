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
    },
    // Dots BG Starts here
    // backgroundImage: {
    //   'luxury-dots': `radial-gradient(circle, rgba(255, 215, 0, 0.8) 1px, transparent 1px), 
    //                   radial-gradient(circle, rgba(255, 215, 0, 0.5) 1px, transparent 1px)`,
    // },
    // backgroundSize: {
    //   'dot-size': '80px 80px',
    // },
    // backgroundPosition: {
    //   'dot-offset': '0 0, 40px 40px',
    // },
    // colors: {
    //   luxuryBg: '#1c1c1c',
    //   luxuryGold: '#FFD700',
    // },
    // Ends here
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
