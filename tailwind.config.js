/** @type {import('tailwindcss').Config} */
export default {
  content: ["/popup-local.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        twitch: "#9146FF",
        youtube: "#FF0000",
        background: "#1a141c",
      },
    },
  },
  plugins: [],
};
