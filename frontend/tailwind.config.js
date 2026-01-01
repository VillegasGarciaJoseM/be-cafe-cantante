/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                flamenco: {
                    red: '#E63946',      // Vibrant red from the background/fire
                    darkRed: '#9B2226',  // Darker red for depth
                    blue: '#1D3557',     // Deep blue from the cloak
                    gold: '#FFD700',     // Gold/Yellow from the halo
                    cream: '#F1FAEE',    // Cream/White from the face/unicorn
                    black: '#121212',    // Deep black for text/outlines
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'], // For headings/lyrics
            }
        },
    },
    plugins: [],
}
