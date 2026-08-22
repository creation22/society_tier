/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1E8',
        ink: '#0A0A0A',
        paper: '#FFFFFF',
        accent: '#6C2BD9',
        accentDark: '#5A1FB0',
        tierS: '#FFD60A',
        tierA: '#06D6A0',
        tierB: '#4361EE',
        tierC: '#FF6B35',
        tierD: '#EF233C'
      },
      fontFamily: {
        display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        brutal: '6px 6px 0 0 #0A0A0A',
        'brutal-sm': '3px 3px 0 0 #0A0A0A',
        'brutal-lg': '10px 10px 0 0 #0A0A0A',
        'brutal-white': '5px 5px 0 0 #ffffff',
        'brutal-accent': '4px 4px 0 0 #6C2BD9',
        none: 'none'
      },
      borderWidth: {
        3: '3px',
        4: '4px'
      },
      animation: {
        'pop-in': 'popIn 0.16s ease-out',
        'slide-up': 'slideUp 0.22s ease-out',
        wiggle: 'wiggle 0.3s ease-in-out',
        marquee: 'marquee 30s linear infinite'
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-4deg)' },
          '75%': { transform: 'rotate(4deg)' }
        },
        marquee: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
};
