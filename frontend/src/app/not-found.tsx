'use client';

import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 p-4 rounded-full bg-red-600/10 text-red-600">
                <AlertTriangle className="w-12 h-12 lg:w-16 lg:h-16" />
            </div>

            <h1 className="text-3xl lg:text-5xl font-black text-white mb-4">
                404 - Page Not Found
            </h1>

            <p className="text-gray-400 max-w-md mb-8 text-lg">
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>

            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
            >
                <Home className="w-5 h-5" />
                <span>Trở về trang chủ</span>
            </Link>
        </div>
    );
}
