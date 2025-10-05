import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1f8ac0", // Total of seats
          green: "#13a581", // Reserve
          red: "#e4504d", // Cancel
          gray: "#e5e7eb",
          dark: "#0f172a",
        },
      },
      borderRadius: {
        card: "0.75rem",
      },
      boxShadow: {
        card: "0 6px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
