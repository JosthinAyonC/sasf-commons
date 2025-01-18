module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'], // Define Poppins como fuente principal
      },
      colors: {
        background: {
          light: '#ffffff',
          dark: '#181818',
        },
        font: {
          light: '#000000',
          dark: '#f7fafc',
        },
        primary: {
          light: '#4A90E2',
          dark: '#262626',
        },
        secondary: {
          light: '#F56565',
          dark: '#5581CA',
        },
        hover: {
          light: '#D83957',
          dark: '#324564',
        },
        success: {
          light: '#38A169',
          dark: '#48BB78',
        },
        focus: {
          light: '#4299E1',
          dark: '#63B3ED',
        },
        placeholder: {
          light: '#CBD5E0',
          dark: '#A0AEC0',
        },
        border: {
          light: '#CBD5E0',
          dark: '#FFFFFF',
        },
        highlight: {
          light: '#FFF5F5',
          dark: '#FED7D7',
        },
        error: {
          light: '#E53E3E',
          dark: '#F56565',
        },
        warning: {
          light: '#D69E2E',
          dark: '#F6AD55',
        },
        info: {
          light: '#3182CE',
          dark: '#63B3ED',
        },
        neutral: {
          100: '#F7FAFC',
          200: '#EDF2F7',
          300: '#E2E8F0',
          400: '#CBD5E0',
          500: '#A0AEC0',
          600: '#718096',
          700: '#4A5568',
          800: '#2D3748',
          900: '#1A202C',
        },
        gradient: {
          start: '#4A90E2',
          end: '#90CDF4',
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--primary': theme('colors.primary.light'),
          '--secondary': theme('colors.secondary.light'),
          '--font': theme('colors.font.light'),
          '--hover': theme('colors.hover.light'),
          '--bg': theme('colors.background.light'),
          '--error': theme('colors.error.light'),
          '--warning': theme('colors.warning.light'),
          '--success': theme('colors.success.light'),
          '--info': theme('colors.info.light'),
          '--focus': theme('colors.focus.light'),
          '--highlight': theme('colors.highlight.light'),
          '--placeholder': theme('colors.placeholder.light'),
          '--border': theme('colors.border.light'),
        },
        '.dark': {
          '--primary': theme('colors.primary.dark'),
          '--secondary': theme('colors.secondary.dark'),
          '--font': theme('colors.font.dark'),
          '--hover': theme('colors.hover.dark'),
          '--bg': theme('colors.background.dark'),
          '--error': theme('colors.error.dark'),
          '--warning': theme('colors.warning.dark'),
          '--success': theme('colors.success.dark'),
          '--info': theme('colors.info.dark'),
          '--focus': theme('colors.focus.dark'),
          '--highlight': theme('colors.highlight.dark'),
          '--placeholder': theme('colors.placeholder.dark'),
          '--border': theme('colors.border.dark'),
        },
      });
    },
  ],
};
