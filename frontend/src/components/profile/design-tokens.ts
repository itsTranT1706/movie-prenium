/**
 * Design tokens for Netflix-style profile redesign
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

export const colors = {
  // Backgrounds
  primary: '#0a0a0a',      // Main background
  secondary: '#141414',    // Sidebar, cards
  tertiary: '#1a1a1a',     // Inputs, hover states
  elevated: '#2a2a2a',     // Active states
  
  // Accents
  brand: '#e50914',        // Netflix red
  brandHover: '#f40612',   // Lighter red
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#b3b3b3',
  textTertiary: '#808080',
  
  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderFocus: 'rgba(255, 255, 255, 0.3)',
} as const;

export const typography = {
  // Headings
  h1: 'text-3xl font-bold',      // 30px
  h2: 'text-2xl font-bold',      // 24px
  h3: 'text-xl font-semibold',   // 20px
  h4: 'text-lg font-semibold',   // 18px
  
  // Body
  body: 'text-base',             // 16px
  bodySmall: 'text-sm',          // 14px
  caption: 'text-xs',            // 12px
  
  // Special
  stat: 'text-4xl font-bold',    // 36px for stats
  
  // Line heights
  tight: 'leading-tight',        // 1.25
  normal: 'leading-normal',      // 1.5
  relaxed: 'leading-relaxed',    // 1.625
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '2px',
  default: '4px',    // Primary choice
  md: '6px',
  lg: '8px',
  full: '9999px',    // For avatars, buttons
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  default: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const transitions = {
  fast: '150ms ease-out',
  normal: '300ms ease-out',
  slow: '500ms ease-out',
  
  // Specific properties
  transform: 'transform 300ms ease-out',
  colors: 'background-color 150ms ease-out, color 150ms ease-out',
  all: 'all 150ms ease-out',
} as const;

// Breakpoints (matching Tailwind defaults)
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// Component-specific constants
export const componentSizes = {
  // Hero section
  heroHeightDesktop: '280px',
  heroHeightMobile: '200px',
  avatarSize: '120px',
  avatarBorder: '4px',
  
  // Sidebar
  sidebarWidth: '240px',
  navItemHeight: '48px',
  iconSize: '20px',
  
  // Movie cards
  cardWidthDesktop: '320px',
  cardWidthMobile: '280px',
  cardAspectRatio16x9: '56.25%', // 9/16 * 100
  cardAspectRatio2x3: '150%',    // 3/2 * 100
  
  // Form elements
  inputHeight: '48px',
  buttonHeight: '48px',
  
  // Touch targets (accessibility)
  minTouchTarget: '44px',
  
  // Progress bar
  progressBarHeight: '3px',
} as const;

// Grid configurations
export const gridConfig = {
  mobile: 'grid-cols-2',
  tablet: 'grid-cols-3',
  desktop: 'grid-cols-4',
  large: 'grid-cols-5',
  gap: 'gap-4',
} as const;
