'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Movie as GlobalMovie, ActorProfile } from '@/types';
import { Movie } from '@/features/movies/components/movie-card';
import { movieService } from '@/features/movies/api/movie.service';
import { NavigationLink } from '@/shared/components/ui';
import { ArrowLeft, MapPin, Calendar, Star, Info } from 'lucide-react';
import MovieCard from '@/features/movies/components/movie-card';
import { StageSpotlight } from '@/shared/components/ui';

export default function ActorDetailPage() {
    const params = useParams();
    const actorId = params.id as string;
    const [profile, setProfile] = useState<ActorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!actorId) return;

            try {
                const response = await movieService.getActorProfile(actorId);
                // Cast to any to handle safely, assuming BaseApiClient return structure
                const data = (response as any).data || response;

                if (data) {
                    setProfile(data as ActorProfile);
                }
            } catch (error) {
                console.error('Failed to fetch actor profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [actorId]);

    // Format date helper
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-20 relative overflow-hidden">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Skeleton */}
                        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
                            <div className="aspect-[2/3] rounded-xl bg-zinc-800 animate-pulse" />
                            <div className="h-8 bg-zinc-800 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse" />
                            <div className="space-y-2 pt-4">
                                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                            </div>
                        </div>
                        {/* Grid Skeleton */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="aspect-[2/3] bg-zinc-800 rounded animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Không tìm thấy diễn viên</h1>
                    <NavigationLink href="/home" className="text-primary hover:underline">
                        Quay lại trang chủ
                    </NavigationLink>
                </div>
            </div>
        );
    }

    // Map global movies to MovieCard movies
    const displayMovies: Movie[] = profile.movies.map((m: GlobalMovie) => ({
        ...m,
        id: m.id,
        duration: m.duration ? m.duration.toString() : undefined,
    }));

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-16 lg:pt-20 relative overflow-hidden">
            <StageSpotlight color="purple" intensity="medium" />

            <div className="container mx-auto px-4 py-6 relative z-10">
                <NavigationLink
                    href="/home"
                    className="cursor-pointer inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="cw-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span >Quay lại</span>
                </NavigationLink>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar - Actor Info */}
                    <div className="w-full lg:w-72 flex-shrink-0 lg:border-r lg:border-white/10 lg:pr-8">
                        <div className="sticky top-24 space-y-6">
                            {/* Avatar */}
                            <div className="relative w-48 lg:w-full mx-auto lg:mx-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                {profile.profileUrl ? (
                                    <img
                                        src={profile.profileUrl}
                                        alt={profile.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-4xl font-bold text-zinc-600">
                                        {profile.name.charAt(0)}
                                    </div>
                                )}
                                {/* Quick Stats Overlay on Hover could go here if needed */}
                            </div>

                            {/* Name & Basic Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                                <p className="text-primary font-medium">{profile.knownForDepartment}</p>
                            </div>

                            {/* Detailed Stats */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                {profile.birthday && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 mb-0.5">Ngày sinh</p>
                                            <p className="text-white">{formatDate(profile.birthday)}</p>
                                            {profile.deathday && (
                                                <p className="text-white/60 text-xs mt-1">
                                                    (Mất: {formatDate(profile.deathday)})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {profile.placeOfBirth && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                                        <div>
                                            <p className="text-white/40 mb-0.5">Nơi sinh</p>
                                            <p className="text-white">{profile.placeOfBirth}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Biography */}
                            {profile.biography && (
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-4 h-4 text-white/40" />
                                        <h3 className="text-sm font-medium text-white/40">Tiểu sử</h3>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed line-clamp-[10] hover:line-clamp-none transition-all cursor-pointer">
                                        {profile.biography}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content - Movie Grid */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-6 flex items-baseline justify-between border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-white">Danh sách phim diễn</h2>
                            <span className="text-sm text-white/40 font-medium">
                                {displayMovies.length} phim
                            </span>
                        </div>

                        {displayMovies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                {displayMovies.map((movie, index) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={{
                                            ...movie,
                                            duration: movie.duration ? `${movie.duration} phút` : undefined,
                                        }}
                                        enablePreview={true}
                                        priority={index < 6}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-white/40">Chưa có thông tin phim.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
