import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration for Netflix-style profile redesign
 * Extends default theme with custom design tokens
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Netflix-style color palette
        netflix: {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
          elevated: '#2a2a2a',
          brand: '#e50914',
          brandHover: '#f40612',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          tertiary: '#808080',
        },
      },
      spacing: {
        // Custom spacing scale for consistent layout
        '4px': '4px',
        '8px': '8px',
        '16px': '16px',
        '24px': '24px',
        '32px': '32px',
        '48px': '48px',
        '64px': '64px',
      },
      borderRadius: {
        // Subtle border radius for professional look
        'netflix': '4px',
      },
      boxShadow: {
        // Netflix-style shadows
        'netflix-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'netflix': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'netflix-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'netflix-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'netflix-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'netflix-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      transitionDuration: {
        // Consistent transition durations
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
      transitionTimingFunction: {
        // Smooth easing functions
        'out': 'ease-out',
        'in': 'ease-in',
      },
      fontSize: {
        // Typography scale
        'stat': ['2.25rem', { lineHeight: '1', fontWeight: '700' }], // 36px for stats
      },
      minHeight: {
        // Touch target minimum
        'touch': '44px',
      },
      minWidth: {
        // Touch target minimum
        'touch': '44px',
      },
      aspectRatio: {
        // Movie card aspect ratios
        '16/9': '16 / 9',
        '2/3': '2 / 3',
      },
    },
  },
  plugins: [],
};

export default config;
