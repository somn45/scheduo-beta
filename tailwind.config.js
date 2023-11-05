/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        header: '60px',
        'header-nav': '45px',
        calendar: '400px',
        'desktop-modal': '500px',
        '10px': '10px',
      },
      padding: {
        'desktop-white-space': '100px',
        'tablet-white-space': '40px',
        'mobile-white-space': '20px',
        header: '60px',
        '2px': '2px',
        '15px': '15px',
      },
      margin: {
        header: '60px',
      },
      spacing: {
        '-5px': '-5px',
        '-15px': '-15px',
        '-90px': '-90px',
      },
      backgroundColor: {
        'main-color': '#B9E2FA',
        'schedule-color': '#FEF9E7',
      },
      borderWidth: {
        '10px': '10px',
        '20px': '20px',
      },
      borderColor: {
        'main-color': '#B9E2FA',
        'input-color': '#5a5a5a',
        'schedule-board-color': '#7FB3D5',
        'schedule-content-color': '#D4E6F1',
      },
      fontFamily: {
        ssat: ['SangSangAnt', 'sans-serif'],
        solmee: ['GabiaSolmee', 'sans-serif'],
      },
      textColor: {
        'light-pink': '#FF7DB4',
      },
      gridTemplateColumns: {
        4: 'repeat(4, 1fr)',
        'toDos-content': '4px 120px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
