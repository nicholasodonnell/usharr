/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      black: '#000',
      'black-secondary': '#21222c',
      cyan: '#80ffea',
      gray: '#999',
      green: '#8aff80',
      orange: '#ffb86c',
      pink: '#ff80bf',
      'pink-secondary': '#ff5aac',
      purple: '#9580ff',
      'purple-secondary': '#755aff',
      red: '#ff5555',
      transparent: 'transparent',
      white: '#fff',
      'white-secondary': '#f8f8f2',
      yellow: '#f1fa8c',
      'app-background': 'var(--app-background)',
      'app-background-light': 'var(--app-background-light)',
      'app-background-accent': 'var(--app-background-accent)',
    },
    fontFamily: {
      mono: ['Fira Code', 'monospace'],
    },
  },
  plugins: [],
}
