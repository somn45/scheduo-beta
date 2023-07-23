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
        '10px': '10px',
      },
      padding: {
        '2px': '2px',
      },
      backgroundColor: {
        'main-color': '#B9E2FA',
        'schedule-color': '#FDF5DC',
      },
      borderColor: {
        'input-color': '#5a5a5a',
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
