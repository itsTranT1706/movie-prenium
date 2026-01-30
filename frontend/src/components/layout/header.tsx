'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ChevronDown, User, Heart, Play, LogOut, Menu, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';
import { apiClient } from '@/lib/api/client';
import { Movie } from '@/types';
import MovieCard from '@/components/features/movie-card';
import { NavigationLink } from '@/components/ui';
import { useLoading } from '@/contexts/loading-context';
/**
 * Premium Header Component
 * - Fixed, transparent at top
 * - Compact, cinema-style
 * - Smooth scroll transition
 */
export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Hide header on specific pages that have their own custom headers
    // Using startsWith to handle potential sub-routes or trailing slashes
    if (!pathname) return null;
    const hiddenRoutes = ['/about', '/terms', '/privacy', '/dmca', '/contact'];
    const currentPath = pathname.toLowerCase();
    const shouldHideHeader = hiddenRoutes.some(route => currentPath === route || currentPath.startsWith(`${route}/`));

    if (shouldHideHeader) {
        return null;
    }
    const { showLoading } = useLoading();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    const [isCountriesOpen, setIsCountriesOpen] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8); // Initially show 8 items
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setVisibleCount(8); // Reset when query changes
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            setVisibleCount(8); // Reset visible count for new search
            try {
                const response = await apiClient.searchMovies(searchQuery);
                if (response.success && response.data) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Infinite scroll handler for search container
    useEffect(() => {
        const container = searchContainerRef.current;
        if (!container || !isSearchOpen) return;

        const handleSearchScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Load more when scrolled to bottom (with 100px threshold)
            if (scrollHeight - scrollTop - clientHeight < 100 && !isLoadingMore && visibleCount < searchResults.length) {
                setIsLoadingMore(true);
                // Simulate loading delay for smooth UX
                setTimeout(() => {
                    setVisibleCount(prev => Math.min(prev + 8, searchResults.length));
                    setIsLoadingMore(false);
                }, 200);
            }
        };

        container.addEventListener('scroll', handleSearchScroll);
        return () => container.removeEventListener('scroll', handleSearchScroll);
    }, [isSearchOpen, isLoadingMore, visibleCount, searchResults.length]);

    // Focus search input when modal opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Close search on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
                setVisibleCount(8);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Close search and navigate to movie
    const handleMovieClick = (movie: Movie) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setVisibleCount(8);
        const identifier = movie.externalId || movie.slug || movie.id;
        router.push(`/movie/${identifier}`);
    };

    // Close search modal - memoized to prevent recreation
    const closeSearch = useCallback(() => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        setVisibleCount(8);
    }, []);

    // Memoize visible results to prevent recalculation
    const visibleResults = useMemo(() =>
        searchResults.slice(0, visibleCount),
        [searchResults, visibleCount]
    );

    const handleLogout = () => {
        logout();
        toast.info('Bạn đã đăng xuất');
        setIsUserMenuOpen(false);
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/movies', label: 'Movies' },
        { href: '/series', label: 'Series' },
    ];

    const genres = [
        { name: 'Hành Động', slug: 'hanh-dong' },
        { name: 'Cổ Trang', slug: 'co-trang' },
        { name: 'Chiến Tranh', slug: 'chien-tranh' },
        { name: 'Viễn Tưởng', slug: 'vien-tuong' },
        { name: 'Kinh Dị', slug: 'kinh-di' },
        { name: 'Tài Liệu', slug: 'tai-lieu' },
        { name: 'Bí Ẩn', slug: 'bi-an' },
        { name: 'Tình Cảm', slug: 'tinh-cam' },
        { name: 'Tâm Lý', slug: 'tam-ly' },
        { name: 'Thể Thao', slug: 'the-thao' },
        { name: 'Phiêu Lưu', slug: 'phieu-luu' },
        { name: 'Âm Nhạc', slug: 'am-nhac' },
        { name: 'Gia Đình', slug: 'gia-dinh' },
        { name: 'Học Đường', slug: 'hoc-duong' },
        { name: 'Hài Hước', slug: 'hai-huoc' },
        { name: 'Hình Sự', slug: 'hinh-su' },
        { name: 'Võ Thuật', slug: 'vo-thuat' },
        { name: 'Khoa Học', slug: 'khoa-hoc' },
        { name: 'Thần Thoại', slug: 'than-thoai' },
        { name: 'Chính Kịch', slug: 'chinh-kich' },
        { name: 'Kinh Điển', slug: 'kinh-dien' },
    ];

    const countries = [
        { name: 'Hàn Quốc', slug: 'han-quoc' },
        { name: 'Trung Quốc', slug: 'trung-quoc' },
        { name: 'Nhật Bản', slug: 'nhat-ban' },
        { name: 'Thái Lan', slug: 'thai-lan' },
        { name: 'Âu Mỹ', slug: 'au-my' },
        { name: 'Đài Loan', slug: 'dai-loan' },
        { name: 'Hồng Kông', slug: 'hong-kong' },
        { name: 'Ấn Độ', slug: 'an-do' },
        { name: 'Anh', slug: 'anh' },
        { name: 'Pháp', slug: 'phap' },
        { name: 'Canada', slug: 'canada' },
        { name: 'Quốc Gia Khác', slug: 'quoc-gia-khac' },
        { name: 'Đức', slug: 'duc' },
        { name: 'Tây Ban Nha', slug: 'tay-ban-nha' },
        { name: 'Thổ Nhĩ Kỳ', slug: 'tho-nhi-ky' },
        { name: 'Hà Lan', slug: 'ha-lan' },
        { name: 'Indonesia', slug: 'indonesia' },
        { name: 'Nga', slug: 'nga' },
        { name: 'Mexico', slug: 'mexico' },
        { name: 'Ba Lan', slug: 'ba-lan' },
        { name: 'Úc', slug: 'uc' },
        { name: 'Thụy Điển', slug: 'thuy-dien' },
        { name: 'Malaysia', slug: 'malaysia' },
        { name: 'Brazil', slug: 'brazil' },
        { name: 'Philippines', slug: 'philippines' },
        { name: 'Bồ Đào Nha', slug: 'bo-dao-nha' },
        { name: 'Ý', slug: 'y' },
        { name: 'Đan Mạch', slug: 'dan-mach' },
        { name: 'UAE', slug: 'uae' },
        { name: 'Na Uy', slug: 'na-uy' },
        { name: 'Thụy Sĩ', slug: 'thuy-si' },
        { name: 'Châu Phi', slug: 'chau-phi' },
        { name: 'Nam Phi', slug: 'nam-phi' },
        { name: 'Ukraina', slug: 'ukraina' },
        { name: 'Ả Rập Xê Út', slug: 'a-rap-xe-ut' },
        { name: 'Việt Nam', slug: 'viet-nam' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-black/95 backdrop-blur-sm'
                    : 'bg-gradient-to-b from-black/90 to-transparent'
                    }`}
            >
                <div className="container">
                    <div className="flex items-center justify-between h-14 lg:h-16">
                        {/* Logo */}
                        <NavigationLink href="/" loadingType="fade" className="flex items-center">
                            <span className="text-xl lg:text-2xl font-black text-red-600">
                                PhePhim
                            </span>
                        </NavigationLink>

                        {/* Navigation - Desktop */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <NavigationLink
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </NavigationLink>
                            ))}

                            {/* Genres Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsGenresOpen(!isGenresOpen)}
                                    onBlur={() => setTimeout(() => setIsGenresOpen(false), 150)}
                                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    <span>Genres</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isGenresOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isGenresOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded shadow-xl py-2 z-50">
                                        <div className="grid grid-cols-2 gap-1 px-2">
                                            {genres.map((genre) => (
                                                <NavigationLink
                                                    key={genre.slug}
                                                    href={`/genre/${genre.slug}`}
                                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                >
                                                    {genre.name}
                                                </NavigationLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Countries Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                                    onBlur={() => setTimeout(() => setIsCountriesOpen(false), 150)}
                                    className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    <span>Countries</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCountriesOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-96 bg-black/90 backdrop-blur-md border border-white/10 rounded shadow-xl py-2 z-50">
                                        <div className="grid grid-cols-3 gap-1 px-2">
                                            {countries.map((country) => (
                                                <NavigationLink
                                                    key={country.slug}
                                                    href={`/country/${country.slug}`}
                                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors text-center break-words"
                                                >
                                                    {country.name}
                                                </NavigationLink>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <NavigationLink
                                href="/coming-soon"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Coming Soon
                            </NavigationLink>
                            <NavigationLink
                                href="/watch-together"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Watch Together
                            </NavigationLink>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* User Menu or Login Button */}
                            {user ? (
                                <div className="relative group">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                                        className="relative rounded-full transition-transform active:scale-95 outline-none"
                                    >
                                        <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden relative shadow-sm group-hover:border-white/50 transition-all ring-2 ring-transparent group-hover:ring-white/10">
                                            <Image
                                                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                                                alt={user.name || 'User avatar'}
                                                fill
                                                className="object-cover"
                                                sizes="36px"
                                                unoptimized
                                            />
                                        </div>
                                        {/* Status Indicator (Online/AI feel) */}
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute top-full right-0 mt-3 w-64 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
                                            {/* Caret/Triangle */}
                                            <div className="absolute right-3 -top-1.5 w-3 h-3 bg-[#181818] border-l border-t border-white/10 rotate-45 transform" />

                                            <div className="bg-[#181818]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                                                {/* User Header */}
                                                <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10">
                                                            <Image
                                                                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                                                                alt=""
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-white truncate">{user.name || 'Thành viên'}</p>
                                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="px-1.5 space-y-0.5 mt-2">
                                                    <NavigationLink href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item">
                                                        <User className="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" />
                                                        <span>Hồ sơ cá nhân</span>
                                                    </NavigationLink>
                                                    <NavigationLink href="/profile?tab=favorites" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item">
                                                        <Heart className="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" />
                                                        <span>Danh sách của tôi</span>
                                                    </NavigationLink>
                                                    <NavigationLink href="/profile?tab=continue-watching" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group/item">
                                                        <Play className="w-4 h-4 text-gray-400 group-hover/item:text-white transition-colors" />
                                                        <span>Đang xem dở</span>
                                                    </NavigationLink>
                                                </div>

                                                <div className="mt-2 border-t border-white/5 px-1.5 pt-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all group/logout"
                                                    >
                                                        <LogOut className="w-4 h-4 text-gray-400 group-hover/logout:text-white transition-colors" />
                                                        <span>Đăng xuất</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavigationLink
                                    href="/login"
                                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Đăng nhập
                                </NavigationLink>
                            )}

                            {/* Mobile Menu */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-white"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-black/95 border-t border-gray-800">
                        <nav className="container py-3 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <NavigationLink
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                                >
                                    {link.label}
                                </NavigationLink>
                            ))}
                            <NavigationLink
                                href="/coming-soon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                            >
                                Coming Soon
                            </NavigationLink>
                            <NavigationLink
                                href="/watch-together"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                            >
                                Watch Together
                            </NavigationLink>
                        </nav>
                    </div>
                )}
            </header>

            {/* Search Modal */}
            {isSearchOpen && (
                <div
                    ref={searchContainerRef}
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm overflow-y-auto"
                >
                    <div className="container py-6">
                        <button
                            onClick={closeSearch}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="max-w-4xl mx-auto pt-12">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                {isSearching && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                                )}
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm phim, series... (Ví dụ: Ngôi trường xác sống)"
                                    className="w-full pl-12 pr-12 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>

                            {/* Search Results */}
                            {searchQuery.trim() && (
                                <div className="mt-6">
                                    {isSearching ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                                            <span className="ml-3 text-gray-400">Đang tìm kiếm...</span>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            <p className="text-gray-400 text-sm mb-4">
                                                Tìm thấy {searchResults.length} kết quả
                                                {visibleCount < searchResults.length && (
                                                    <span className="text-gray-600"> • Hiển thị {visibleCount}/{searchResults.length}</span>
                                                )}
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                                                {visibleResults.map((movie, index) => (
                                                    <div key={movie.id || movie.slug} onClick={closeSearch} className="w-full">
                                                        <MovieCard
                                                            movie={{
                                                                id: movie.id,
                                                                externalId: movie.externalId,
                                                                title: movie.title,
                                                                posterUrl: movie.posterUrl,
                                                                backdropUrl: movie.backdropUrl,
                                                                trailerUrl: movie.trailerUrl,
                                                                rating: movie.rating,
                                                                year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
                                                                quality: movie.quality,
                                                                genres: movie.genres,
                                                                lang: movie.lang,
                                                                episodeCurrent: movie.episodeCurrent,
                                                                originalTitle: movie.originalTitle,
                                                                mediaType: movie.mediaType,
                                                                ageRating: movie.ageRating,
                                                            }}
                                                            enablePreview={false}
                                                            priority={index < 4}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Loading more indicator */}
                                            {isLoadingMore && (
                                                <div className="flex items-center justify-center py-6">
                                                    <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                                                    <span className="ml-2 text-gray-400 text-sm">Đang tải thêm...</span>
                                                </div>
                                            )}
                                            {/* Scroll hint */}
                                            {visibleCount < searchResults.length && !isLoadingMore && (
                                                <div className="flex items-center justify-center py-4">
                                                    <span className="text-gray-600 text-sm">↓ Cuộn xuống để xem thêm</span>
                                                </div>
                                            )}
                                            {/* View All Button - At the bottom */}
                                            <div className="flex justify-center mt-8 pt-6 border-t border-gray-800">
                                                <button
                                                    onClick={() => {
                                                        showLoading('skeleton');
                                                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                        closeSearch();
                                                    }}
                                                    className="w-full max-w-md px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
                                                >
                                                    <span>Xem toàn bộ kết quả</span>
                                                    <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400">
                                                Không tìm thấy kết quả cho &quot;{searchQuery}&quot;
                                            </p>
                                            <p className="text-gray-600 text-sm mt-2">
                                                Thử tìm kiếm với từ khóa khác
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Search tips when empty */}
                            {!searchQuery.trim() && (
                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Gợi ý: Tìm kiếm theo tên phim tiếng Việt hoặc tiếng Anh
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        {['Hành động', 'Tình cảm', 'Kinh dị', 'Hoạt hình'].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setSearchQuery(tag)}
                                                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-sm rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
