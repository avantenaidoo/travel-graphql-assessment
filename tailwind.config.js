// import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      keyframes: {
        spinScaleFade: {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1'},
          '100%': { transform: 'rotate(360deg) scale(0.5)', opacity: '0'},
        },
        scaleUpFadeIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7'},
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        spinScaleFade: 'spinScaleFade 2s linear',
        scaleUpFadeIn: 'scaleUpFadeIn 3s linear'
      },
    },
  },
  plugins: [],
}