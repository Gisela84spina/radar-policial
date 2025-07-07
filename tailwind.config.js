/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        pulsefast: 'pulse 1s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    
    
      colors: {
        azul: {
          600: '#2563eb',  // para el botón azul 
          700: '#1d4ed8',
        },
        rojo: {
          600: '#dc2626',  // para botones rojos y alertas
          700: '#b91c1c',
        },
        gris: {
          800: '#1f2937',  // para fondo oscuro en botones
          700: '#374151',
        },
      },
    },
  },
  
  plugins: [],
}