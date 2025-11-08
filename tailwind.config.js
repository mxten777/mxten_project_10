/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        // sm: '640px' (기본값)
        // md: '768px' (기본값)
        // lg: '1024px' (기본값)
        // xl: '1280px' (기본값)
        // 2xl: '1536px' (기본값)
      },
    },
  },
  plugins: [],
}

