/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    keyframes: {
      // ✅ แอนิเมชันหมุนสีรุ้ง
      'rainbow-spin': {
        'from': { transform: 'rotate(0deg)' },
        'to': { transform: 'rotate(360deg)' },
      },
      shimmer: {
        '100%': { transform: 'translateX(100%)' },
      },
    },
    animation: {
      // ✅ ความเร็วการหมุน 3 วินาที (ปรับเลข 3s ให้ช้าหรือเร็วตามใจชอบ)
      'rainbow': 'rainbow-spin 3s linear infinite',
      shimmer: 'shimmer 2s infinite',
    },
  },
},
  plugins: [],
}