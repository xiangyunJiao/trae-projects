/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'pink-cute': '#FFB6C1',
        'pink-light': '#FFE4E9',
        'pink-dark': '#FF69B4',
        'blue-cute': '#87CEEB',
        'blue-light': '#E0F4FF',
        'blue-dark': '#4682B4',
        'green-cute': '#98FB98',
        'green-light': '#E8FFE8',
        'yellow-cute': '#FFFF99',
        'orange-cute': '#FFB347',
        'purple-cute': '#DDA0DD',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
