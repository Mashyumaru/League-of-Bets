export default {
  content: [
    "./index.html",               // Fichier HTML principal
    "./src/**/*.{js,ts,jsx,tsx}", // Tous les fichiers JS/JSX dans src/
  ],
  
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#eff6ff',   
          100: '#dbeafe',  
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Couleur principale
          600: '#2563eb', 
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a', 
        },
        'secondary': {
          500: '#8b5cf6', // Couleur secondaire
          600: '#7c3aed', 
        },
        
        // Background
        'dark': {
          bg: '#0a0e27',      // Background de la page
          card: '#1a1f3a',    // Background des cards
          border: '#2d3458',  // Borders
        },
        
        'accent': '#fbbf24',
      },
      
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}