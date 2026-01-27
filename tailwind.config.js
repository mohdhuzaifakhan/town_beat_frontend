/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf2f2',
                    100: '#fde6e6',
                    200: '#fbcaca',
                    300: '#f6a1a1',
                    400: '#ee6e6e',
                    500: '#e34343',
                    600: '#d12929',
                    700: '#af1f1f',
                    800: '#911d1d',
                    900: '#791e1e',
                },
                accent: '#2DD4BF',
                dark: '#111827',
            },
        },
    },
    plugins: [],
}
