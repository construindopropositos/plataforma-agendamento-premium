/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                neural: {
                    bg: '#F8F9FA',
                    authority: '#003366',
                    conversion: '#DAA520',
                    'conversion-hover': '#B8860B',
                    accent: '#D2691E',
                },
            },
        },
    },
    plugins: [],
}

export default config
