'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Heart, User, X, Loader2 } from 'lucide-react';
import { NavigationLink } from '@/shared/components/ui';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';
import { Movie } from '@/types';
import { MovieCard } from '@/features/movies';
import { useLoading } from '@/shared/contexts';

/**
 * Mobile Bottom Navigation Bar
 * - Fixed at bottom on mobile/tablet
 * - Hidden on desktop (lg+)
 * - App-like experience
 */
export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { showLoading } = useLoading();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Hide on certain pages
    if (!pathname) return null;
    const hiddenRoutes = ['/login', '/register', '/about', '/terms', '/privacy', '/dmca', '/contact'];
    const shouldHide = hiddenRoutes.some(route => pathname.toLowerCase().startsWith(route));
    if (shouldHide) return null;

    // Also hide on watch page for immersive experience
    // if (pathname.startsWith('/watch/')) return null;

    const navItems = [
        {
            href: '/',
            icon: Home,
            label: 'Home',
            isActive: pathname === '/'
        },
        {
            href: '#search',
            icon: Search,
            label: 'Search',
            isActive: isSearchOpen,
            onClick: () => setIsSearchOpen(true)
        },
        {
            href: user ? '/profile?tab=favorites' : '/login',
            icon: Heart,
            label: 'Favorites',
            isActive: pathname.includes('/profile') && pathname.includes('favorites')
        },
        {
            href: user ? '/profile' : '/login',
            icon: User,
            label: 'Account',
            isActive: pathname === '/profile'
        },
    ];

    // Search handler
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await apiClient.searchMovies(query);
            if (response.success && response.data) {
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-5 left-4 right-4 z-50 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] safe-area-pb">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.isActive;

                        // Handler specific to button type (search vs link)
                        const content = (
                            <>
                                {/* Active Background Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm -z-10" />
                                )}
                                <Icon
                                    className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'text-gray-500 group-hover:text-gray-300'}`}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                />
                                {/* Simple dot indicator */}
                                {isActive && (
                                    <span className="absolute -bottom-1 w-1 h-1 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                                )}
                            </>
                        );

                        if (item.onClick) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className={`relative group flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-full transition-all duration-300`}
                                >
                                    {content}
                                </button>
                            );
                        }

                        return (
                            <NavigationLink
                                key={item.label}
                                href={item.href}
                                className={`relative group flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-full transition-all duration-300`}
                            >
                                {content}
                            </NavigationLink>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Search Modal */}
            {isSearchOpen && (
                <div className="lg:hidden fixed inset-0 z-[60] bg-black/98 backdrop-blur-sm">
                    <div className="flex flex-col h-full">
                        {/* Search Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/10">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchQuery.trim()) {
                                            closeSearch();
                                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                    placeholder="Tìm kiếm phim..."
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                                />
                            </div>
                            <button
                                onClick={closeSearch}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto p-4 pb-32">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        {searchResults.slice(0, 20).map((movie, index) => (
                                            <div
                                                key={movie.id || movie.slug}
                                                onClick={() => {
                                                    closeSearch();
                                                    showLoading('fade');
                                                    const identifier = movie.externalId || movie.slug;
                                                    router.push(`/movies/${identifier}`);
                                                }}
                                                className="cursor-pointer active:scale-95 transition-transform"
                                            >
                                                <MovieCard
                                                    movie={{
                                                        id: movie.id,
                                                        externalId: movie.externalId,
                                                        title: movie.title,
                                                        posterUrl: movie.posterUrl,
                                                        rating: movie.rating,
                                                        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
                                                        quality: movie.quality,
                                                    }}
                                                    enablePreview={false}
                                                    priority={index < 4}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* See All Button */}
                                    <button
                                        onClick={() => {
                                            closeSearch();
                                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        }}
                                        className="w-full mt-6 py-4 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Xem tất cả kết quả cho "{searchQuery}"</span>
                                    </button>
                                </>
                            ) : searchQuery.trim() ? (
                                <div className="text-center py-12">
                                    <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">Không tìm thấy kết quả</p>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Nhập từ khóa để tìm kiếm</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer for bottom nav */}
            <div className="lg:hidden h-24" />
        </>
    );
}
