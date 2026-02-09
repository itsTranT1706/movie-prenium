'use client';

import { useEffect, useState } from 'react';
import TrendingSection from './trending-section';
import { apiClient } from '@/shared/lib/api';
import type { RecentComment } from '@/shared/lib/api/services';

/**
 * Trending Section Wrapper with Real Data
 * Displays trending movies, favorites, hot genres, and recent comments
 */
export default function TrendingSectionWrapper() {
    const [recentComments, setRecentComments] = useState<any[]>([]);
    const [popularMovies, setPopularMovies] = useState<any[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log('🔄 Fetching trending section data...');

                // Fetch all data in parallel
                const [commentsResponse, popularResponse, trendingResponse] = await Promise.all([
                    apiClient.get<RecentComment[]>('/comments/recent?limit=20'),
                    apiClient.getPopularMovies(1),
                    apiClient.getTrendingMovies('day'),
                ]);

                // console.log('📊 Raw responses:', { commentsResponse, popularResponse, trendingResponse });

                // Transform comments
                const comments = commentsResponse.data || [];
                // console.log('💬 Comments:', comments);
                const transformedComments = comments.map((comment: RecentComment) => ({
                    id: comment.id,
                    username: comment.user?.name || 'Anonymous',
                    avatar: comment.user?.avatar || `https://i.pravatar.cc/150?u=${comment.userId}`,
                    content: comment.content,
                    movieTitle: comment.movie?.title || 'Unknown Movie',
                    movieId: comment.movieId,
                    moviePoster: null, // comment.movie?.posterUrl is not available on type
                    isVip: false, // TODO: Add VIP status to API
                    likeCount: comment.upvotes,
                    parent: comment.parent && {
                        user: {
                            name: comment.parent.user.name
                        }
                    },
                }));
                setRecentComments(transformedComments);

                // Transform popular movies (Sôi Nổi Nhất)
                const popularResults = popularResponse?.data || popularResponse || [];
                // console.log('🔥 Popular results:', popularResults);
                const popular = (Array.isArray(popularResults) ? popularResults : []).slice(0, 5).map((movie: any, index: number) => ({
                    id: movie.id,
                    externalId: movie.externalId,
                    rank: index + 1,
                    title: movie.title,
                    posterUrl: movie.posterUrl || 'https://via.placeholder.com/92x138?text=No+Image',
                }));
                // console.log('🔥 Transformed popular:', popular);
                setPopularMovies(popular);

                // Transform trending movies (Yêu Thích Nhất)
                const trendingResults = trendingResponse?.data || trendingResponse || [];
                // console.log('⭐ Trending results:', trendingResults);
                const trending = (Array.isArray(trendingResults) ? trendingResults : []).slice(0, 5).map((movie: any, index: number) => ({
                    id: movie.id,
                    externalId: movie.externalId,
                    rank: index + 1,
                    title: movie.title,
                    posterUrl: movie.posterUrl || 'https://via.placeholder.com/92x138?text=No+Image',
                }));
                // console.log('⭐ Transformed trending:', trending);
                setTrendingMovies(trending);

            } catch (error) {
                console.error('❌ Failed to fetch trending section data:', error);
                setRecentComments([]);
                setPopularMovies([]);
                setTrendingMovies([]);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, []);

    // Mock hot categories
    const hotCategories = [
        { id: 'hanh-dong', name: 'Hành Động', color: 'bg-red-600' },
        { id: 'tinh-cam', name: 'Tình Cảm', color: 'bg-pink-600' },
        { id: 'hai-huoc', name: 'Hài Hước', color: 'bg-yellow-600' },
        { id: 'kinh-di', name: 'Kinh Dị', color: 'bg-gray-800' },
        { id: 'vien-tuong', name: 'Viễn Tưởng', color: 'bg-blue-600' },
        { id: 'khoa-hoc', name: 'Khoa học', color: 'bg-green-600' },
        { id: 'vo-thuat', name: 'Võ thuật', color: 'bg-purple-600' },

    ];

    return (
        <TrendingSection
            trendingItems={popularMovies}
            favoriteItems={trendingMovies}
            hotCategories={hotCategories}
            recentComments={recentComments}
            loading={loading}
        />
    );
}
