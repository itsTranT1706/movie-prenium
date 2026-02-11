'use client';

import { NavigationLink } from '@/shared/components/ui';

interface TopWeeklyMoviesSidebarProps {
    movies: any[];
    title?: string;
}

export function TopWeeklyMoviesSidebar({ movies, title = 'Top phim tuần này' }: TopWeeklyMoviesSidebarProps) {
    if (!movies || movies.length === 0) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#E50914] rounded-full"></span>
                {title}
            </h2>
            <div className="flex flex-col gap-4">
                {movies.map((item: any, index: number) => (
                    <NavigationLink
                        key={item.id}
                        href={`/movies/${item.id}`}
                        className="group flex items-center relative pl-8 pr-2 py-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {/* Big Outlined Rank Number */}
                        <div className="absolute -left-3 w-24 h-full flex items-center justify-center pointer-events-none select-none z-0">
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 100 100"
                                className="overflow-visible"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <text
                                    x="50%"
                                    y="60%"
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fontSize="120"
                                    fill="none"
                                    stroke="#555"
                                    strokeWidth="3.5"
                                    className="font-black tracking-tighter opacity-100 group-hover:stroke-[#E50914] transition-colors duration-300"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {index + 1}
                                </text>
                            </svg>
                        </div>

                        {/* Poster */}
                        <div className="relative z-10 w-[70px] h-[100px] flex-shrink-0 rounded shadow-md ml-6 group-hover:scale-105 transition-transform duration-300">
                            <img
                                src={item.posterUrl}
                                alt={item.title}
                                className="w-full h-full object-cover rounded"
                                loading="lazy"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 pl-4 z-10 relative">
                            <h3 className="text-white text-sm font-bold mb-1 line-clamp-2 group-hover:text-[#E50914] transition-colors leading-snug">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                                <span className="px-1.5 py-0.5 bg-zinc-800 border border-white/10 rounded text-zinc-300">{item.quality || 'HD'}</span>
                                <span>•</span>
                                <span>{item.year || new Date().getFullYear()}</span>
                            </div>
                        </div>
                    </NavigationLink>
                ))}
            </div>
        </div>
    );
}
