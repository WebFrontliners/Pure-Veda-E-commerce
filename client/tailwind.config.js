/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pv: {
          primary: '#1F4D2E', // Primary Dark Green
          herbal: '#3F6B35',  // Herbal Green
          leaf: '#789447',    // Fresh Leaf Green
          gold: '#B88A3B',    // Antique Gold
          bronze: '#7A5527',  // Heritage Bronze
          ivory: '#FAF6EB',   // Warm Ivory (Header & Base)
          cream: '#F1E8D4',   // Herbal Cream
          brown: '#30251C',   // Earth Brown
          beige: '#E8D7B5',   // Soft Beige
          dark: '#173A25',    // Footer Dark Green
        },
        veda: {
          50: '#f4f8f5',
          100: '#e5f0e8',
          200: '#cce2d2',
          300: '#a3ccae',
          400: '#73b083',
          500: '#3F6B35',
          600: '#1F4D2E',
          700: '#173A25',
          800: '#1F4D2E',
          900: '#173A25',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(48, 37, 28, 0.06)',
        'lift': '0 12px 28px -4px rgba(31, 77, 46, 0.12), 0 4px 8px -2px rgba(31, 77, 46, 0.05)',
        'gold': '0 4px 20px -2px rgba(184, 138, 59, 0.25)',
      }
    },
  },
  plugins: [],
}
