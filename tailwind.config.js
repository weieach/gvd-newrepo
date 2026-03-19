module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#FAF8FA',
        'primary-color': '#883F8F',
        'border-color': '#BDA7BF',
        'border-color-light': '#EBE4EA',
        'dark-bg': '#5A285F',
        'cerulean': '#0F8DA5',
      },
      fontFamily: {
        'sans': ['geist', 'system-ui', 'sans-serif'],
        'serif': ['larken', 'serif'],
        'mono': ['geist mono', 'monospace'],
      },
    },
  },
  plugins: [],
}