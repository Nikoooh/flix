import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'deadpool&wolverine': "url(/carouselMovieImgs/deadpool&wolverine.png)",
        'speak-no-evil': "url('/carouselMovieImgs/speak_no_evil.jpg')",
        'salemslot': "url('/carouselMovieImgs/salems-lot.jpg')"
      },
      backgroundPosition: {
        'custom-right': '70% 100%',
        'custom-center': '0% 26%'
      },
      backgroundSize: {
        '45%': '45%'
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  darkMode: 'selector'
};

export default config;
