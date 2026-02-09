'use client';

import { usePathname } from 'next/navigation';
import { NavigationLink } from '@/shared/components/ui';
import { Film, Tv, Globe, Layers } from 'lucide-react';

/**
 * Mobile Top Category Navigation
 * - Horizontal scrollable tabs
 * - Shows Movies, Series, Genres, Countries
 * - App-like experience
 */
export function MobileTopNav() {
    const pathname = usePathname();

    // Hide on certain pages
    if (!pathname) return null;
    const hiddenRoutes = ['/login', '/register', '/about', '/terms', '/privacy', '/dmca', '/contact', '/watch/', '/movies/', '/profile'];
    const shouldHide = hiddenRoutes.some(route => pathname.toLowerCase().startsWith(route));
    if (shouldHide) return null;

    const categories = [
        { href: '/movies', label: 'Movies', icon: Film },
        { href: '/series', label: 'Series', icon: Tv },
        { href: '/genres', label: 'Thể Loại', icon: Layers },
        { href: '/countries', label: 'Quốc Gia', icon: Globe },
    ];

    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-4 pb-2 px-4 safe-area-pt">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
                {categories.map((cat) => {
                    const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
                    const Icon = cat.icon;

                    return (
                        <NavigationLink
                            key={cat.href}
                            href={cat.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 shrink-0 border ${isActive
                                    ? 'bg-white text-black border-white shadow-lg scale-105'
                                    : 'bg-black/20 backdrop-blur-md text-white/90 border-white/15 hover:bg-white/20 hover:border-white/30'
                                }`}
                        >
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-white/70'}`} />
                            <span>{cat.label}</span>
                        </NavigationLink>
                    );
                })}
            </div>
        </div>
    );
}
