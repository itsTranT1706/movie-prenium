'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, User, Heart, Play, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';

/**
 * Premium Header Component
 * - Fixed, transparent at top
 * - Compact, cinema-style
 * - Smooth scroll transition
 */
export default function Header() {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGenresOpen, setIsGenresOpen] = useState(false);
    const [isCountriesOpen, setIsCountriesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                        <Link href="/" className="flex items-center">
                            <span className="text-xl lg:text-2xl font-black text-red-600">
                                PhePhim
                            </span>
                        </Link>

                        {/* Navigation - Desktop */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
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
                                                <Link
                                                    key={genre.slug}
                                                    href={`/genre/${genre.slug}`}
                                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                                                >
                                                    {genre.name}
                                                </Link>
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
                                                <Link
                                                    key={country.slug}
                                                    href={`/country/${country.slug}`}
                                                    className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors text-center break-words"
                                                >
                                                    {country.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/coming-soon"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Coming Soon
                            </Link>
                            <Link
                                href="/watch-together"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Watch Together
                            </Link>
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
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 150)}
                                        className="flex items-center gap-1 p-1.5"
                                    >
                                        <div className="w-7 h-7 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute top-full right-0 mt-1 w-44 bg-black/90 backdrop-blur-md border border-white/10 rounded shadow-xl py-1 z-50">
                                            <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                                                <User className="w-4 h-4" />
                                                <span>Account</span>
                                            </Link>
                                            <Link href="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                                                <Heart className="w-4 h-4" />
                                                <span>My List</span>
                                            </Link>
                                            <Link href="/continue-watching" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10">
                                                <Play className="w-4 h-4" />
                                                <span>Continue Watching</span>
                                            </Link>
                                            <hr className="my-1 border-white/10" />
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-white/10"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors"
                                >
                                    Login
                                </Link>
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
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/coming-soon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                            >
                                Coming Soon
                            </Link>
                            <Link
                                href="/watch-together"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-2 py-2 text-sm text-gray-300 hover:text-white"
                            >
                                Watch Together
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm">
                    <div className="container pt-20">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search movies, series..."
                                    autoFocus
                                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
