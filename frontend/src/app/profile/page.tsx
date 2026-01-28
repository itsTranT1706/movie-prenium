'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';
import {
  ProfileHeroSection,
  ProfileLayout,
  ContinueWatchingSection,
  FavoritesSection,
  WatchHistorySection,
  AccountSettingsSection,
  type ProfileTab,
  type ViewingStats,
  type WatchingItem,
  type HistoryItem,
  type ProfileUpdate,
  type PasswordChange,
} from '@/components/profile';
import { Movie } from '@/types';
import { apiClient } from '@/lib/api/client';

/**
 * Profile Page - Netflix-style Profile with Full API Integration
 * Features:
 * - Favorites management (add/remove)
 * - Profile update (name, avatar)
 * - Password change
 * - Continue watching (TODO)
 * - Watch history (TODO)
 */

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [continueWatchingItems, setContinueWatchingItems] = useState<WatchingItem[]>([]);
  const [watchHistoryItems, setWatchHistoryItems] = useState<HistoryItem[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingContinueWatching, setLoadingContinueWatching] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load favorites when component mounts or tab changes to favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated && activeTab === 'favorites') {
        try {
          setLoadingFavorites(true);
          const response = await apiClient.getFavorites();
          
          // Handle different response formats
          let favoriteData: any[] = [];
          if (response && typeof response === 'object') {
            if ('success' in response && 'data' in response && Array.isArray(response.data)) {
              favoriteData = response.data;
            } else if (Array.isArray(response)) {
              favoriteData = response;
            }
          }
          
          console.log('📋 Loaded favorites raw data:', favoriteData);
          
          // Map favorites to Movie objects with full details
          const movies: Movie[] = favoriteData
            .filter((fav: any) => {
              if (!fav.movie) {
                console.warn('⚠️ Favorite without movie data:', fav);
                return false;
              }
              return true;
            })
            .map((fav: any) => {
              const movie = {
                id: fav.movie.id,
                externalId: fav.movie.externalId,
                title: fav.movie.title,
                originalTitle: fav.movie.originalTitle,
                mediaType: fav.movie.mediaType || 'movie',
                description: fav.movie.description,
                posterUrl: fav.movie.posterUrl,
                backdropUrl: fav.movie.backdropUrl,
                trailerUrl: fav.movie.trailerUrl,
                releaseDate: fav.movie.releaseDate,
                duration: fav.movie.duration,
                rating: fav.movie.rating,
                genres: fav.movie.genres || [],
              };
              console.log('✅ Mapped movie:', { id: movie.id, externalId: movie.externalId, title: movie.title });
              return movie;
            });
          
          console.log(`📊 Total favorites loaded: ${movies.length}`);
          setFavoriteMovies(movies);
        } catch (error) {
          console.error('❌ Failed to load favorites:', error);
          toast.error('Không thể tải danh sách yêu thích');
          setFavoriteMovies([]);
        } finally {
          setLoadingFavorites(false);
        }
      }
    };

    loadFavorites();
  }, [activeTab, isAuthenticated]);

  // Load continue watching
  useEffect(() => {
    const loadContinueWatching = async () => {
      if (isAuthenticated && activeTab === 'continue-watching') {
        try {
          setLoadingContinueWatching(true);
          const data = await apiClient.getContinueWatching(20);
          
          // Map to WatchingItem format
          const items: WatchingItem[] = data.map((item: any) => ({
            movie: item.movie,
            progress: 0, // We don't track progress, so set to 0
            lastWatchedAt: new Date(item.lastWatchedAt),
            currentEpisode: item.episodeNumber ? `Tập ${item.episodeNumber}` : undefined,
            remainingTime: undefined,
          }));
          
          setContinueWatchingItems(items);
        } catch (error) {
          console.error('Failed to load continue watching:', error);
          toast.error('Không thể tải danh sách xem tiếp');
          setContinueWatchingItems([]);
        } finally {
          setLoadingContinueWatching(false);
        }
      }
    };

    loadContinueWatching();
  }, [activeTab, isAuthenticated]);

  // Load watch history
  useEffect(() => {
    const loadHistory = async () => {
      if (isAuthenticated && activeTab === 'history') {
        try {
          setLoadingHistory(true);
          const data = await apiClient.getWatchHistory(50, 0);
          
          // Map to HistoryItem format
          const items: HistoryItem[] = data.map((item: any) => ({
            movie: item.movie,
            watchedAt: new Date(item.lastWatchedAt),
            completed: item.completed,
          }));
          
          setWatchHistoryItems(items);
        } catch (error) {
          console.error('Failed to load watch history:', error);
          toast.error('Không thể tải lịch sử xem');
          setWatchHistoryItems([]);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    loadHistory();
  }, [activeTab, isAuthenticated]);

  // Mock data for other sections
  const viewingStats: ViewingStats = {
    moviesWatched: watchHistoryItems.length,
    totalHours: 0,
    favoriteGenres: [],
  };

  const recentMovies: Movie[] = watchHistoryItems.slice(0, 4).map(item => item.movie).filter(Boolean);

  // Handlers
  const handleRemoveContinueWatching = async (movieId: string) => {
    try {
      // Find the item to get episode number
      const item = continueWatchingItems.find(i => i.movie.id === movieId);
      const episodeNumber = item?.currentEpisode ? parseInt(item.currentEpisode.replace('Tập ', '')) : undefined;
      
      await apiClient.markCompleted(movieId, episodeNumber);
      toast.success('Đã xóa khỏi danh sách xem tiếp');
      
      // Remove from local state
      setContinueWatchingItems(prev => prev.filter(i => i.movie.id !== movieId));
    } catch (error) {
      console.error('Failed to remove from continue watching:', error);
      toast.error('Không thể xóa khỏi danh sách xem tiếp');
    }
  };

  const handleRemoveFavorite = async (movieId: string) => {
    console.log('🗑️ Removing favorite with movieId:', movieId);
    try {
      await apiClient.removeFavorite(movieId);
      toast.success('Đã xóa khỏi danh sách yêu thích');
      
      // Remove from local state
      setFavoriteMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (error: any) {
      console.error('Remove favorite error:', error);
      toast.error(error?.message || 'Không thể xóa khỏi danh sách yêu thích');
    }
  };

  const handleUpdateProfile = async (data: ProfileUpdate) => {
    try {
      if (!user?.id) {
        toast.error('Không tìm thấy thông tin người dùng');
        return;
      }

      // Only send name and avatar to backend (email is read-only)
      const updateData = {
        name: data.name,
        avatar: data.avatar,
      };
      
      await apiClient.updateProfile(user.id, updateData);
      toast.success('Cập nhật thông tin thành công');
      
      // Optionally refresh user data
      window.location.reload();
    } catch (error) {
      toast.error('Không thể cập nhật thông tin');
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const handleChangePassword = async (data: PasswordChange) => {
    try {
      if (!user?.id) {
        toast.error('Không tìm thấy thông tin người dùng');
        return;
      }

      await apiClient.changePassword(user.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      toast.error('Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại');
      console.error('Change password error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Bạn đã đăng xuất');
    router.push('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div>
        {/* Profile Header */}
        <ProfileHeroSection
          user={user}
          stats={viewingStats}
          recentMovies={recentMovies}
        />

        {/* Profile Layout with Sidebar and Content */}
        <ProfileLayout
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        >
          {/* Content based on active tab */}
          {activeTab === 'continue-watching' && (
            <ContinueWatchingSection
              items={continueWatchingItems}
              onRemove={handleRemoveContinueWatching}
              isLoading={loadingContinueWatching}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesSection
              movies={favoriteMovies}
              onRemove={handleRemoveFavorite}
              isLoading={loadingFavorites}
            />
          )}

          {activeTab === 'history' && (
            <WatchHistorySection 
              items={watchHistoryItems}
              isLoading={loadingHistory}
            />
          )}

          {activeTab === 'settings' && (
            <AccountSettingsSection
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
            />
          )}
        </ProfileLayout>
      </div>
    </div>
  );
}
