module.exports = {
  content: [
    "./index.html",     // For Vite
    "./src/**/*.{js,jsx,ts,tsx}", // Your React components
  ],
  theme: {
    extend: {
      fontFamily: {
        teko: ['Teko', 'sans-serif'], // Add Teko font
      },
    },
  },
  plugins: [],
};
