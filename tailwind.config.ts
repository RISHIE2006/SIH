import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        foreground: "#2D251E",
        beige: {
          50: "#FAF8F5",
          100: "#F4EFEA",
          200: "#EAE3D2",
          300: "#D8CBAD",
          400: "#C3B08A",
          500: "#A68F68",
          600: "#8C6D46",
          700: "#6E5334",
          800: "#503A24",
          900: "#2D251E",
        },
        wheat: {
          50: "#FEFBF3",
          100: "#F7EEDD",
          200: "#E8DFC8",
          500: "#D4A373",
          600: "#BC864A",
          700: "#9C6731",
        },
        leaf: {
          50: "#F2F7F4",
          100: "#E2ECE5",
          500: "#5A8F6A",
          600: "#4A7C59",
          700: "#3B6246",
        },
        sih: {
          card: "#FFFFFF",
          border: "#EAE3D2",
          muted: "#6E6459",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(140, 109, 70, 0.08)",
        glass: "0 8px 32px 0 rgba(140, 109, 70, 0.06)",
        card: "0 2px 10px rgba(45, 37, 30, 0.04)",
      }
    },
  },
  plugins: [],
};
export default config;
