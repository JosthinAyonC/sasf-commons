module.exports = {
  theme: {
    colors: {
      background: {
        light: '#ffffff',
        dark: '#1a202c',
      },
      font: {
        light: '#000000',
        dark: '#f7fafc',
      },
      primary: {
        light: '#4A90E2',
        dark: '#90CDF4',
      },
      secondary: {
        light: '#F56565',
        dark: '#FC8181',
      },
      hover: {
        light: '#2C7A7B',
        dark: '#319795',
      },
    },
    extend: {},
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--primary': theme('colors.primary.light'),
          '--secondary': theme('colors.secondary.light'),
          '--font-color': theme('colors.font.light'),
          '--hover': theme('colors.hover.light'),
          '--bg-color': theme('colors.background.light'),
        },
        '.dark': {
          '--primary': theme('colors.primary.dark'),
          '--secondary': theme('colors.secondary.dark'),
          '--font-color': theme('colors.font.dark'),
          '--hover': theme('colors.hover.dark'),
          '--bg-color': theme('colors.background.dark'),
        },
      });
    },
  ],
};
