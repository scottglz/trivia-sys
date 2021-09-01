const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

const colors = require('tailwindcss/colors');

function withOpacity(variableName) {
  return ({opacityValue = 1}) => `rgba(var(${variableName}), ${opacityValue})`; 
}

module.exports = {
  mode: 'jit',
  purge: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        bar: withOpacity('--color-bar-text'),
        'bar-link': withOpacity('--collor-bar-link')
      },
      backgroundColor: {
        bar: withOpacity('--color-bar')
      }
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      green: { ...colors.green, 950: '#031'},
      red: colors.rose,
      wheat: 'wheat',
      orange: colors.orange[400]
    }
  },
  plugins: [],
}
