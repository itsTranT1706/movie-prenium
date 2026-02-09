// Profile feature barrel export
export { AccountSettingsSection } from './components/AccountSettingsSection';
export type { ProfileUpdate, PasswordChange } from './components/AccountSettingsSection';

export { ContinueWatchingSection } from './components/ContinueWatchingSection';
export type { WatchingItem } from './components/ContinueWatchingSection';

export { FavoritesSection } from './components/FavoritesSection';

export { MovieCard } from './components/MovieCard';
export { MovieCardSkeleton } from './components/MovieCardSkeleton';

export { ProfileHeroSection } from './components/ProfileHeroSection';
export type { ViewingStats } from './components/ProfileHeroSection';

export { ProfileLayout } from './components/ProfileLayout';

export { ProfileSidebar } from './components/ProfileSidebar';
export type { ProfileTab } from './components/ProfileSidebar';

export { ResponsiveMovieGrid } from './components/ResponsiveMovieGrid';

export { WatchHistorySection } from './components/WatchHistorySection';
export type { HistoryItem } from './components/WatchHistorySection';

export * as designTokens from './components/design-tokens';

// API services
export { userService } from './api/user.service';
export type { UpdateProfileData, ChangePasswordData } from './api/user.service';
