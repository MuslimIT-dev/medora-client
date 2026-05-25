/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  	"./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
    	colors: {
    		pistachio: {
    			light: '#C7E9B0',
    			DEFAULT: '#9DC183',
    			dark: '#7A9A65',
    		},
    	},
    },
  },
  plugins: [],
}

