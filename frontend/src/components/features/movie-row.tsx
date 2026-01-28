'use client';

import MovieCard, { Movie } from './movie-card';
import { ChevronRight, Flame, Sparkles, Tv } from 'lucide-react';
import { NavigationLink } from '@/components/ui';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface MovieRowProps {
    title: string;
    href?: string;
    movies: Movie[];
    isLoading?: boolean;
    icon?: 'trending' | 'new' | 'series';
}

/**
 * Movie Row Component (Reusable)
 * - Tight, immersive horizontal layout
 * - Cinema-style spacing
 * - Premium streaming platform feel
 */
export default function MovieRow({ title, href, movies, isLoading, icon }: MovieRowProps) {
    const getIcon = () => {
        switch (icon) {
            case 'trending':
                return <Flame className="w-5 h-5 text-orange-500" />;
            case 'new':
                return <Sparkles className="w-5 h-5 text-yellow-400" />;
            case 'series':
                return <Tv className="w-5 h-5 text-purple-400" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <section className="py-4 lg:py-5">
                <div className="container">
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-6 w-40 bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 lg:gap-3 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[130px] lg:w-[160px]">
                                <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse" />
                                <div className="mt-1.5 h-3 bg-gray-800 rounded w-3/4 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 lg:py-5">
            <div className="container">
                {/* Header - Tight spacing */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                        {getIcon()}
                        <span>{title}</span>
                    </h2>
                    {href && (
                        <NavigationLink
                            href={href}
                            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <span>Xem toàn bộ</span>
                            <ChevronRight className="w-3 h-3" />
                        </NavigationLink>
                    )}
                </div>

                {/* Carousel Row */}
                <Carousel
                    opts={{
                        align: 'start',
                        loop: false,
                        slidesToScroll: 1,
                        containScroll: 'trimSnaps',
                    }}
                    className="w-full"
                >
                    <div className="relative">
                        <CarouselContent className="-ml-3 lg:-ml-4">
                            {movies.map((movie) => (
                                <CarouselItem key={movie.id} className="pl-3 lg:pl-4 basis-[180px] sm:basis-[200px] lg:basis-[220px]">
                                    <MovieCard movie={movie} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <CarouselPrevious className="absolute -left-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 disabled:opacity-0" />
                        <CarouselNext className="absolute -right-5 top-[40%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white border-0 disabled:opacity-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
