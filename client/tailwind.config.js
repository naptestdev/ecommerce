module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#2874F0",
        secondary: "#4169e1",
        orange: "#ffa500",
        bg: "#F5F5F5",
      },
      gridTemplateColumns: {
        card: "repeat(auto-fill, minmax(180px, 1fr))",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
