import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: '#00a8e8',
        dark: '#4a4a4a',
        light: '#fff',
        secondary: '#f7f7f7'
      }
    },
  },
  plugins: [],
};
export default config;
