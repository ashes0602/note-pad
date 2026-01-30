/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   // for App Router
    "./pages/**/*.{js,jsx,ts,tsx}", // for Pages Router
    "./components/**/*.{js,jsx,ts,tsx}", // components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
