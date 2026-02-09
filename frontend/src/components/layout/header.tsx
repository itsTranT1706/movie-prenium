'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ChevronDown, User, Heart, Play, LogOut, Menu, X, Loader2, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';
import { Movie } from '@/types';
import { MovieCard } from '@/features/movies';
import { NavigationLink } from '@/shared/components/ui';
import { useLoading } from '@/shared/contexts';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    image?: string;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Phim mới ra mắt',
        message: 'Squid Game Phần 2 vừa được cập nhật!',
        time: '2 phút trước',
        isRead: false,
        image: 'https://image.tmdb.org/t/p/w200/huE6S2f6f4sM2y7c2oW8J2.jpg' // Placeholder or valid image
    },
    {
        id: '2',
        title: 'Đừng bỏ lỡ',
        message: 'Top 10 phim thịnh hành tuần này.',
        time: '1 giờ trước',
        isRead: false,
    },
    {
        id: '3',
        title: 'Cập nhật hệ thống',
        message: 'Tính năng "Xem cùng nhau" đã sẵn sàng.',
        time: '1 ngày trước',
        isRead: true,
    }
];
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
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

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
        const identifier = movie.externalId || movie.slug;
        router.push(`/movies/${identifier}`);
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
                className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-black/95 backdrop-blur-sm'
                    : 'bg-gradient-to-b from-black/90 to-transparent'
                    }`}
            >
                <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
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

                            {/* Notifications */}
                            {user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        onBlur={() => setTimeout(() => setShowNotifications(false), 200)}
                                        className="p-2 text-gray-300 hover:text-white transition-colors relative group outline-none"
                                        aria-label="Notifications"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-black/80 shadow-[0_0_4px_rgba(229,9,20,0.8)] animate-pulse" />
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    {showNotifications && (
                                        <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
                                            {/* Caret */}
                                            <div className="absolute right-3 -top-1.5 w-3 h-3 bg-black/60 backdrop-blur-2xl border-l border-t border-white/10 rotate-45 transform" />

                                            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                                                {/* Header */}
                                                <div className="px-4 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-white">Thông báo</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={handleMarkAllAsRead}
                                                            className="text-xs text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            Đánh dấu đã đọc
                                                        </button>
                                                    )}
                                                </div>

                                                {/* List */}
                                                <div className="overflow-y-auto custom-scrollbar">
                                                    {notifications.length > 0 ? (
                                                        <div className="divide-y divide-white/5">
                                                            {notifications.map((notification) => (
                                                                <div
                                                                    key={notification.id}
                                                                    className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group/item relative ${!notification.isRead ? 'bg-white/[0.02]' : ''}`}
                                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                                >
                                                                    <div className="flex gap-3">
                                                                        {/* Optional Image */}
                                                                        {notification.image ? (
                                                                            <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-800">
                                                                                <img src={notification.image} alt="" className="w-full h-full object-cover" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                                                                                <Bell className="w-5 h-5 text-gray-400" />
                                                                            </div>
                                                                        )}

                                                                        <div className="flex-1 min-w-0">
                                                                            <h4 className={`text-sm font-medium mb-0.5 ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                                                                                {notification.title}
                                                                            </h4>
                                                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                                                {notification.message}
                                                                            </p>
                                                                            <span className="text-[10px] text-gray-500 mt-1 block">
                                                                                {notification.time}
                                                                            </span>
                                                                        </div>

                                                                        {/* Unread Indicator */}
                                                                        {!notification.isRead && (
                                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_4px_rgba(229,9,20,0.5)]" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 text-center text-gray-500 text-sm">
                                                            Không có thông báo mới
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

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
                                            <div className="absolute right-3 -top-1.5 w-3 h-3 bg-black/60 backdrop-blur-2xl border-l border-t border-white/10 rotate-45 transform" />

                                            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
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
                                                    <div
                                                        key={movie.id || movie.slug}
                                                        onClick={() => {
                                                            setIsSearchOpen(false);
                                                            showLoading('fade');
                                                            const identifier = movie.externalId || movie.slug;
                                                            router.push(`/movies/${identifier}`);
                                                        }}
                                                        className="w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                                                    >
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
                                            {/* View All Button - Netflix Premium Style */}
                                            <div className="flex justify-center mt-8 pt-6 border-t border-white/[0.08]">
                                                <button
                                                    onClick={() => {
                                                        showLoading('skeleton');
                                                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                        closeSearch();
                                                    }}
                                                    className="group relative w-full px-6 py-4 overflow-hidden rounded-xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-red-900/20 hover:shadow-red-600/40 cursor-pointer"
                                                >
                                                    {/* Base gradient background - Deep Red to Netflix Red */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#800000] via-[#b20710] to-[#e50914] opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                                                    {/* Animated shine line */}
                                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                                                    {/* Content Container */}
                                                    <div className="relative flex items-center justify-center gap-3">
                                                        <Search className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                                                        <span className="text-white text-base font-bold tracking-wider uppercase drop-shadow-sm">
                                                            Xem toàn bộ kết quả
                                                        </span>
                                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1">
                                                            <ChevronDown className="w-4 h-4 text-white rotate-[-90deg]" />
                                                        </div>
                                                    </div>

                                                    {/* Subtle border overlay */}
                                                    <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 pointer-events-none transition-colors" />
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
