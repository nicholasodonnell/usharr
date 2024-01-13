/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
  theme: {
    colors: {
      'app-background': 'var(--app-background)',
      'app-background-accent': 'var(--app-background-accent)',
      'app-background-light': 'var(--app-background-light)',
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
    },
    fontFamily: {
      mono: ['Fira Code', 'monospace'],
    },
  },
}
