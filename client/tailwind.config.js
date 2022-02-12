module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2874F0",
        secondary: "#4169e1",
        orange: "#ffa500",
        bg: "#F5F5F5",
      },
      gridTemplateColumns: {
        sm: "repeat(auto-fill, minmax(100px, 1fr))",
        md: "repeat(auto-fill, minmax(140px, 1fr))",
        lg: "repeat(auto-fill, minmax(180px, 1fr))",
      },
    },
  },
  plugins: [],
};
