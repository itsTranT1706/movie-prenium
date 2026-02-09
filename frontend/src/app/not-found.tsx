'use client';

import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
                {/* Illustration */}
                <div className="w-full max-w-[280px] md:max-w-[320px] mb-4 md:mb-6 animate-in fade-in zoom-in-50 duration-700">
                    <img
                        src="/movie_theme_404_1770425429214-removebg-preview.png"
                        alt="404 Illustration"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg px-4">
                    Oops! Trang không tồn tại
                </h1>

                <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-md mb-8 md:mb-10 leading-relaxed px-4">
                    Có vẻ như bạn đã đi lạc vào một không gian khác. Trang bạn tìm kiếm không có ở đây.
                </p>

                <Link
                    href="/"
                    className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                        <Home className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                        <span>Trở về Trang chủ</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
