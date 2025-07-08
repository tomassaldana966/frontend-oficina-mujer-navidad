/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sf-blue': {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
                electricViolet: {
          50:  '#fcf3ff',
          100: '#f8e3ff',
          200: '#f2cdff',
          300: '#e8a5ff',
          400: '#db6cff',
          500: '#ce35ff',
          600: '#c10fff',
          700: '#b700ff',
          800: '#9106c3',
          900: '#76079c',
          950: '#530076',
        }
      },
      backgroundImage: {
        'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

