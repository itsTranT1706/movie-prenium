'use client';

import { Construction, Sparkles } from 'lucide-react';

interface FeatureUnavailableProps {
    title?: string;
    message?: string;
    variant?: 'default' | 'minimal' | 'card';
    className?: string;
}

/**
 * Feature Unavailable Component
 * Modern notification for features under development
 * Matches cinema-style theme with gradient and blur effects
 */
export function FeatureUnavailable({
    title = 'Tính năng đang phát triển',
    message = 'Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!',
    variant = 'default',
    className = '',
}: FeatureUnavailableProps) {
    if (variant === 'minimal') {
        return (
            <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
                <Construction className="w-4 h-4" />
                <span className="text-sm">{title}</span>
            </div>
        );
    }

    if (variant === 'card') {
        return (
            <div
                className={`
                    relative overflow-hidden rounded-lg border border-white/10 
                    bg-gradient-to-br from-gray-900/80 to-gray-800/60 
                    backdrop-blur-md p-6 ${className}
                `}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 pointer-events-none" />

                <div className="relative flex flex-col items-center text-center gap-4">
                    {/* Icon with glow effect */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                            <Construction className="w-8 h-8 text-red-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-gray-400 max-w-md">{message}</p>
                    </div>

                    {/* Sparkle decoration */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Sparkles className="w-3 h-3" />
                        <span>Sắp ra mắt</span>
                    </div>
                </div>
            </div>
        );
    }

    // Default variant - full page centered
    return (
        <div className={`min-h-[60vh] flex items-center justify-center p-4 ${className}`}>
            <div
                className="
                    relative overflow-hidden rounded-xl border border-white/10 
                    bg-gradient-to-br from-gray-900/90 to-gray-800/70 
                    backdrop-blur-xl p-8 md:p-12 max-w-lg w-full
                    shadow-2xl
                "
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none animate-pulse" />

                {/* Film grain effect */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                    <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
                </div>

                <div className="relative flex flex-col items-center text-center gap-6">
                    {/* Icon with enhanced glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg">
                            <Construction className="w-10 h-10 text-red-400" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {title}
                        </h2>
                        <p className="text-base text-gray-300 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Đang trong quá trình phát triển</span>
                    </div>

                    {/* Optional CTA */}
                    <div className="pt-2">
                        <button
                            onClick={() => window.history.back()}
                            className="
                                px-6 py-2.5 rounded-lg 
                                bg-gradient-to-r from-red-600 to-red-700 
                                hover:from-red-500 hover:to-red-600 
                                text-white text-sm font-semibold 
                                transition-all duration-200 
                                shadow-lg hover:shadow-red-500/25
                            "
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureUnavailable;
