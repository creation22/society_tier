/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Monochrome SaaS palette — no brand hue, no AI-slop purple.
        // Pure near-black "ink" drives primary actions; tier colors are
        // semantic data-viz accents only.
        cream: '#FAFAF9',
        ink: '#0A0A0A',
        paper: '#FFFFFF',
        accent: '#0A0A0A',
        accentDark: '#000000',
        tierS: '#F59E0B',
        tierA: '#10B981',
        tierB: '#3B82F6',
        tierC: '#F97316',
        tierD: '#EF4444'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Fraunces', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px'
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(10 10 10 / 0.04), 0 1px 3px 0 rgb(10 10 10 / 0.06)',
        DEFAULT: '0 1px 3px 0 rgb(10 10 10 / 0.06), 0 1px 2px -1px rgb(10 10 10 / 0.06)',
        md: '0 4px 6px -1px rgb(10 10 10 / 0.07), 0 2px 4px -2px rgb(10 10 10 / 0.05)',
        lg: '0 10px 15px -3px rgb(10 10 10 / 0.08), 0 4px 6px -4px rgb(10 10 10 / 0.05)',
        xl: '0 20px 25px -5px rgb(10 10 10 / 0.10), 0 8px 10px -6px rgb(10 10 10 / 0.05)',
        '2xl': '0 25px 40px -12px rgb(10 10 10 / 0.18)',
        ring: '0 0 0 3px rgb(10 10 10 / 0.12)',
        glow: '0 0 0 4px rgb(10 10 10 / 0.08), 0 8px 24px -8px rgb(10 10 10 / 0.25)',
        // Legacy *brutal* names remapped to soft shadows (safety net).
        brutal: '0 4px 6px -1px rgb(10 10 10 / 0.07), 0 2px 4px -2px rgb(10 10 10 / 0.05)',
        'brutal-sm': '0 1px 2px 0 rgb(10 10 10 / 0.05)',
        'brutal-lg': '0 10px 15px -3px rgb(10 10 10 / 0.08), 0 4px 6px -4px rgb(10 10 10 / 0.05)',
        'brutal-white': '0 1px 2px 0 rgb(255 255 255 / 0.1)',
        'brutal-accent': '0 4px 6px -1px rgb(10 10 10 / 0.18), 0 2px 4px -2px rgb(10 10 10 / 0.12)',
        none: 'none'
      },
      borderWidth: {
        3: '1px',
        4: '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'pop-in': 'popIn 0.18s ease-out',
        wiggle: 'wiggle 0.3s ease-in-out',
        marquee: 'nbmarquee 30s linear infinite',
        float: 'bob 6s ease-in-out infinite',
        'spin-slow': 'nb-spin 18s linear infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        popIn: { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        wiggle: { '0%,100%': { transform: 'rotate(0deg)' }, '25%': { transform: 'rotate(-3deg)' }, '75%': { transform: 'rotate(3deg)' } },
        nbmarquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'nb-spin': { to: { transform: 'rotate(360deg)' } }
      }
    }
  },
  plugins: []
};
