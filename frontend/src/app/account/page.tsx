'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, List, Eye, Bell, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';

export default function AccountPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('watched');

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/account');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    // Sample watched movies data
    const watchedMovies = [
        { id: '1', title: 'SHIBOYUE Kiếm Song...', subtitle: 'Shiboyue (Kiếm Đôi)', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', season: 'Tập 1', episode: '36m', progress: 45 },
        { id: '2', title: 'Đệ Ngọc Cực Lạc', subtitle: 'Linh Hồn Đế', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', season: 'P.2', episode: 'Tập 1 • 24m', progress: 80 },
        { id: '3', title: 'Cậu Bé Mất Tích', subtitle: 'Stranger Things', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', season: 'P.2', episode: 'Tập 1 • 48m', progress: 100 },
        { id: '4', title: 'Dân Đầu Mỏ', subtitle: 'Landman', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', season: 'P.2', episode: 'Tập 1 • 51m', progress: 30 },
        { id: '5', title: 'Ẩn Danh', subtitle: 'Taxi Driver', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', season: 'P.3', episode: 'Tập 4 • 60m', progress: 60 },
        { id: '6', title: 'Inuyasha: Chuyện Dạ Xoa', subtitle: 'Inuyasha', posterUrl: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', season: 'Tập 6', episode: '24m', progress: 90 },
        { id: '7', title: 'Little Women', subtitle: 'Little Women', posterUrl: 'https://image.tmdb.org/t/p/w500/8dp7M8MOkyK7DhnVVnjpIFvPKZ0.jpg', season: 'P.1', episode: 'Tập 12 • 70m', progress: 15 },
        { id: '8', title: 'Miracle in Cell No. 7', subtitle: 'Miracle in Cell No. 7', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', season: 'P.1', episode: 'Tập 8 • 132m', progress: 50 },
        { id: '9', title: 'Yêu Hỏi Bạn', subtitle: 'Love Between Lines', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', season: 'P.1', episode: 'Tập 20 • 45m', progress: 70 },
    ];

    const menuItems = [
        { id: 'profile', label: 'Yêu thích', icon: User },
        { id: 'watchlist', label: 'Danh sách', icon: List },
        { id: 'watched', label: 'Xem tiếp', icon: Eye },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'security', label: 'Bảo mật', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20">
            <div className="container">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-[#1a1a1a] rounded-lg p-6">
                            {/* User Info */}
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-white/10">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-3">
                                    <span className="text-white text-2xl font-bold">
                                        {user?.name?.[0] || 'U'}
                                    </span>
                                </div>
                                <h2 className="text-white font-bold text-lg mb-1">
                                    {user.name || 'User'}
                                </h2>
                                <p className="text-gray-400 text-sm flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                    {user.email}
                                </p>
                            </div>

                            {/* Menu */}
                            <nav className="space-y-1">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Quản lý tài khoản
                                </h3>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`
                                                w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors
                                                ${isActive
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Logout */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <button 
                                    onClick={() => {
                                        logout();
                                        toast.info('Bạn đã đăng xuất');
                                    }}
                                    className="w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    Thoát
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {activeTab === 'watched' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">
                                    Danh sách xem tiếp
                                </h1>

                                {/* Movies Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {watchedMovies.map((movie) => (
                                        <div key={movie.id} className="group relative">
                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => {
                                                    toast.success('Đã xóa khỏi danh sách xem tiếp');
                                                }}
                                                className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/80 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>

                                            <Link href={`/movies/${movie.id}`} className="block">
                                                {/* Poster */}
                                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                                                    <img
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Progress Bar */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                                        <div
                                                            className="h-full bg-red-600"
                                                            style={{ width: `${movie.progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <div>
                                                    <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 group-hover:text-gray-200 transition-colors">
                                                        {movie.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs mb-1">
                                                        {movie.subtitle}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <span>{movie.season}</span>
                                                        <span>•</span>
                                                        <span>{movie.episode}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">Yêu thích</h1>
                                <p className="text-gray-400">Danh sách phim yêu thích của bạn sẽ hiển thị ở đây.</p>
                            </div>
                        )}

                        {activeTab === 'watchlist' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">Danh sách</h1>
                                <p className="text-gray-400">Danh sách phim đã lưu của bạn sẽ hiển thị ở đây.</p>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">Thông báo</h1>
                                <p className="text-gray-400">Cài đặt thông báo của bạn.</p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-6">Bảo mật</h1>
                                <p className="text-gray-400">Cài đặt bảo mật tài khoản.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
