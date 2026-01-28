// Profile components exports
export { ProfileHeroSection } from './ProfileHeroSection';
export type { ProfileHeroSectionProps, ViewingStats } from './ProfileHeroSection';

export { ProfileSidebar } from './ProfileSidebar';
export type { ProfileSidebarProps, ProfileTab, NavigationItem } from './ProfileSidebar';

export { ProfileLayout } from './ProfileLayout';
export type { ProfileLayoutProps } from './ProfileLayout';

export { ContinueWatchingSection } from './ContinueWatchingSection';
export type { ContinueWatchingSectionProps, WatchingItem } from './ContinueWatchingSection';

export { FavoritesSection } from './FavoritesSection';
export type { FavoritesSectionProps } from './FavoritesSection';

export { WatchHistorySection } from './WatchHistorySection';
export type { WatchHistorySectionProps, HistoryItem } from './WatchHistorySection';

export { AccountSettingsSection } from './AccountSettingsSection';
export type { AccountSettingsSectionProps, ProfileUpdate, PasswordChange } from './AccountSettingsSection';

export { MovieCard } from './MovieCard';
export type { MovieCardProps, MovieCardMetadata } from './MovieCard';

export { MovieCardSkeleton, MovieGridSkeleton } from './MovieCardSkeleton';
export type { MovieCardSkeletonProps, MovieGridSkeletonProps } from './MovieCardSkeleton';

export { ResponsiveMovieGrid } from './ResponsiveMovieGrid';
export type { ResponsiveMovieGridProps } from './ResponsiveMovieGrid';

// Re-export design tokens for convenience
export * from './design-tokens';
