/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
         28: '7rem',
       },
       letterSpacing: {
         tighter: '-.04em',
       },
       lineHeight: {
         tight: 1.2,
       },
       fontSize: {
         '5xl': '2.5rem',
         '6xl': '2.75rem',
         '7xl': '4.5rem',
         '8xl': '6.25rem',
       },
       boxShadow: {
         sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
         md: '0 8px 30px rgba(0, 0, 0, 0.12)',
       },
       dropShadow: {
         '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
         '4xl': [
             '0 35px 35px rgba(0, 0, 0, 0.25)',
             '0 45px 65px rgba(0, 0, 0, 0.15)'
         ]
       },
       screens: {
         'ism': '420px',
         '2xl': '1536px',
         'fhd': '1920px',
       },},
  },
  plugins: [],
};
