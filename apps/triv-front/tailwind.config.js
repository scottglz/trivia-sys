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
        'plain-color': withOpacity('--color-text'),
        'link-color': withOpacity('--color-link'),
        'link-hover-color': withOpacity('--color-link-hover')
      },
      backgroundColor: {
        bar: withOpacity('--color-bar')
      },
      animation: {
        skeleton: 'skeleton 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        skeleton: {
          '0%, 100%': {
            opacity: 0.5
          },
          '50%': {
            opacity: .2
          }
        }
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
