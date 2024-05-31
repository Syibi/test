/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    transform: (content) => content.replace(/taos:/g, ''),
    files: ['./**/*.{html,js}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['26px', '39px'],
        'h2-mobile': ['20px', '30px'],
        'h3-mobile': ['16px', '40px'],
        'p-mobile': ['14px', '26px'],
        'h1-desktop': ['36px', '54px'],
        'h2-desktop': ['28px', '42px'],
        'h3-desktop': ['20px', '40px'],
        'p-desktop': ['16px', '27px'],
      },
      fontWeight: {
        'h1-mobile': 800,
        'h2-mobile': 700,
        'h3-mobile': 600,
        'p-mobile': 400,
        'p-hero': 500,
        'h1-desktop': 700,
        'h2-desktop': 700,
        'h3-desktop': 600,
        'p-desktop': 500,
      },
      colors: {
        primary: '#2AAFD3',
        secondary: '#FFAA2B',
        'secondary-bg' : '#FFAA2B90',
        gradient: '#FF7448',
        title: '#074864',
        'primary-bg': '#2AAFD324',
        'grey-th': '#6F7070',
        'white-bg': '#F5F5F5',
        'white-icon' : '#FFFFFF40',
        'line-border' : '#B8B8B8',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(90deg, #FFAA2B 0%, #FF7448 100%)',
        'custom-gradient': 'linear-gradient(90deg, #259BBB 0%, #2AAFD3 100%)',
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      },
      gridAutoColumns: {
        '1/2': '50%',
      },
      boxShadow: {
        'custom': '0 13px 50px rgba(199, 199, 199, 0.5)',
        'card': '0 10px 50px rgba(199, 199, 199, 0.25)',
      }
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const screens = theme('screens');
    
      const mobileScreen = screens['sm']; // Adjust as per your requirement
    
      addUtilities({
        [`@media (max-width: ${mobileScreen})`]: {
          '.truncate-lines-3': {
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': '7', // Adjust the number of lines as needed
          },
        },
      }, ['responsive']);
    },
    require('taos/plugin')
  ],
  safelist: [
    '!duration-[0ms]',
    '!delay-[0ms]',
    'html.js :where([class*="taos:"]:not(.taos-init))'
  ]
}