/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F4',
        mauve: {
          DEFAULT: '#9B6B8A',
          light: '#C4A8BB',
          dark: '#7A4F69',
        },
        sage: {
          DEFAULT: '#7A9E87',
          light: '#A8C4B0',
        },
        terra: '#C4836A',
        blush: '#F5EBE8',
        charcoal: '#2D2424',
        'muted-rose': '#8C7070',
        jade: '#6B9E8A',
        amber: '#C49A6B',
        danger: '#B05C5C',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        pill: '50px',
      },
      boxShadow: {
        warm: '0 4px 20px rgba(155, 107, 138, 0.08)',
        card: '0 2px 12px rgba(45, 36, 36, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}