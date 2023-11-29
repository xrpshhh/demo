/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#f92672",
          "secondary": "#a6e22e",
          "accent": "#fd971f",
          "neutral": "#75715e",
          "base-100": "#272822",
          "info": "#66d9ef",
          "success": "#0f0",
          "warning": "#e6db74",
          "error": "#ae81ff",
        },
        light: {
          "primary": "#a0a9cb",
          "secondary": "#e3e5e5",
          "accent": "#769ff0",
          "neutral": "#393260",
          "base-100": "#414861",
          "info": "#e0af68",
          "success": "#73daca",
          "warning": "#f7768e",
          "error": "#ae81ff",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}
