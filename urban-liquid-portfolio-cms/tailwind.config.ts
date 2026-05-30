import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        asphalt: "#090a0c",
        concrete: "#1b1d22",
        chrome: "#d9e2eb",
        acid: "#b4ff3d",
        cyan: "#00e7ff",
        violet: "#8f49ff",
        signal: "#ff2f55",
        bone: "#f3f0e8"
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        glass: "0 20px 80px rgba(0, 231, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.18)",
        glow: "0 0 40px rgba(180, 255, 61, 0.2)",
        redline: "0 0 34px rgba(255, 47, 85, 0.24)"
      },
      backdropBlur: {
        glass: "28px"
      }
    }
  },
  plugins: []
};

export default config;

