module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
    plugins: [
      require("tailwind-scrollbar-hide"),
      require("@tailwindcss/line-clamp"),
  ],
}
