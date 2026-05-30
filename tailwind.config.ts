import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#BF211D',
          black: '#0A0A0A',
          cream: '#F7F7F7',
          white: '#FFFFFF',
        },
        // Override standard red to match brand red
        red: {
          50: '#fdf3f2',
          100: '#fbe4e2',
          200: '#f7ccc8',
          300: '#f2a9a1',
          400: '#eb7b6f',
          500: '#df4d3d',
          600: '#BF211D', // Primary brand red
          700: '#9e1a17', // Hover state
          800: '#7f1512',
          900: '#691513',
          950: '#3a0807',
        },
        // Map slate-950 to Jet Black for automatic compatibility
        slate: {
          950: '#0A0A0A',
        }
      }
    },
  },
}
