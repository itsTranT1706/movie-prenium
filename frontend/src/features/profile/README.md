# Netflix-Style Profile Components

This directory contains all components for the Netflix-style profile redesign.

## Design Principles

Following Netflix's design philosophy:
- **Clean Typography**: Clear hierarchy with consistent font weights
- **Consistent Spacing**: Using 4px, 8px, 16px, 24px, 32px, 48px, 64px scale
- **Subtle Interactions**: Smooth transitions with proper easing
- **Professional Look**: Avoiding AI-generated appearance with refined shadows and limited gradients
- **Accessibility**: WCAG AA compliance, keyboard navigation, reduced motion support

## Design Tokens

Design tokens are defined in `design-tokens.ts` and include:

### Colors
- **Backgrounds**: Primary (#0a0a0a), Secondary (#141414), Tertiary (#1a1a1a), Elevated (#2a2a2a)
- **Brand**: Netflix Red (#e50914), Hover (#f40612)
- **Text**: Primary (#ffffff), Secondary (#b3b3b3), Tertiary (#808080)

### Typography
- **Headings**: h1 (30px), h2 (24px), h3 (20px), h4 (18px)
- **Body**: base (16px), small (14px), caption (12px)
- **Special**: stat (36px) for viewing statistics

### Spacing
Consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Transitions
- **Fast**: 150ms ease-out (quick interactions)
- **Normal**: 300ms ease-out (standard animations)
- **Slow**: 500ms ease-out (complex transitions)

### Border Radius
- **Default**: 4px (subtle, professional)
- **Full**: 9999px (avatars, buttons)

## Components

### ProfileHeroSection
Hero banner with user avatar, stats, and blurred background from recent movies.

### ProfileSidebar
Navigation sidebar with menu items and active state indicators.

### ProfileLayout
Wrapper component combining sidebar and content area with responsive behavior.

### ContinueWatchingSection
Horizontal scrolling section for movies in progress with 16:9 cards.

### FavoritesSection
Grid layout for favorite movies with 2:3 poster cards.

### WatchHistorySection
List of watched movies with dates and completion status.

### AccountSettingsSection
Forms for profile info, security settings, and preferences.

### MovieCard (Reusable)
Flexible movie card component supporting both 16:9 and 2:3 aspect ratios.

### ResponsiveMovieGrid
Responsive grid layout that adapts from 2 to 5 columns based on viewport.

## Usage

```typescript
import {
  ProfileHeroSection,
  ProfileLayout,
  ContinueWatchingSection,
  FavoritesSection,
} from '@/components/profile';

// Use in your page component
<ProfileLayout>
  <ProfileHeroSection user={user} stats={stats} recentMovies={movies} />
  <ContinueWatchingSection items={continueWatching} />
  <FavoritesSection movies={favorites} />
</ProfileLayout>
```

## Tailwind Configuration

Custom design tokens are also available in Tailwind:

```tsx
// Using custom colors
<div className="bg-netflix-secondary text-text-primary">

// Using custom spacing
<div className="p-24px m-16px">

// Using custom shadows
<div className="shadow-netflix-2xl">

// Using custom transitions
<div className="transition-duration-fast ease-out">
```

## CSS Utilities

Custom utility classes in `globals.css`:

- `.profile-transition-fast/normal/slow` - Consistent transitions
- `.profile-card-hover` - Card hover effect with scale and shadow
- `.avatar-gradient-border` - Animated gradient border for avatars
- `.progress-bar` / `.progress-bar-fill` - Progress bar styling
- `.horizontal-scroll-snap` - Horizontal scroll with snap behavior
- `.movie-grid-responsive` - Responsive grid layout
- `.skeleton-profile` - Loading skeleton animation

## Accessibility

All components follow accessibility best practices:
- Minimum 44x44px touch targets on mobile
- WCAG AA color contrast ratios
- Keyboard navigation support
- ARIA labels where needed
- Reduced motion support via `prefers-reduced-motion`

## Requirements Mapping

This implementation satisfies:
- **Requirement 5.1**: Consistent font weights and hierarchy
- **Requirement 5.2**: Defined spacing scale
- **Requirement 5.3**: Proper line heights and letter spacing
- **Requirement 5.4**: Subtle shadows and borders
- **Requirement 5.5**: Refined color palette with proper contrast
