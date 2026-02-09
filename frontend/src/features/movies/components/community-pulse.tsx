'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { movieService } from '@/features/movies/api/movie.service';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';


interface CommunityPulseProps {
    movie: any;
    comments: any[];
}

// 3D Animated Emoji data
const REACTIONS = [
    {
        id: 'MASTERPIECE',
        label: 'Masterpiece',
        score: 10,
        // Using high-quality 3D emoji assets (using fluent emoji CDN or similar style)
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png',
        color: 'text-amber-400',
        gradient: 'from-amber-300 to-orange-500'
    },
    {
        id: 'LOVE',
        label: 'Love it',
        score: 8,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png',
        color: 'text-rose-400',
        gradient: 'from-rose-300 to-pink-500'
    },
    {
        id: 'GOOD',
        label: 'Good',
        score: 6,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Up.png',
        color: 'text-emerald-400',
        gradient: 'from-emerald-300 to-teal-500'
    },
    {
        id: 'MEH',
        label: 'Meh',
        score: 4,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Neutral%20Face.png',
        color: 'text-gray-400',
        gradient: 'from-gray-300 to-slate-500'
    }
];

export function CommunityPulse({ movie, comments }: CommunityPulseProps) {
    const { isAuthenticated } = useAuth();
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
    const [totalVotes, setTotalVotes] = useState(0);
    const [communityScore, setCommunityScore] = useState(0);
    const [distribution, setDistribution] = useState({ positive: 0, mixed: 0 });
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

    useEffect(() => {
        if (movie?.id || movie?.externalId) {
            loadStats();
        }
    }, [movie?.id, movie?.externalId]);

    useEffect(() => {
        if ((movie?.id || movie?.externalId) && isAuthenticated) {
            loadUserReaction();
        }
    }, [movie?.id, movie?.externalId, isAuthenticated]);

    const loadStats = async () => {
        try {
            const movieId = movie.externalId || movie.id;
            const response = await movieService.getReactionStats(movieId);

            if (response.success && response.data) {
                setTotalVotes(response.data.totalVotes);
                setCommunityScore(response.data.averageScore * 10); // Convert 1-10 to 0-100
                setDistribution(response.data.distribution);
                setReviews(response.data.reviews || []);
            }
        } catch (error) {
            console.error('Failed to load stats', error);
        } finally {
            setLoading(false);
        }
    };


    const loadUserReaction = async () => {
        try {
            const movieId = movie.externalId || movie.id;
            const response = await movieService.getMyReaction(movieId);
            if (response.success && response.data) {
                setSelectedReaction(response.data.reaction);
            }
        } catch (error) {
            // Ignore if 401 or not found
        }
    };


    const handleReaction = async (reaction: typeof REACTIONS[0]) => {
        if (!isAuthenticated) {
            toast.error('Please login to react');
            return;
        }

        const previousReaction = selectedReaction;

        // Optimistic update
        setSelectedReaction(reaction.id);

        try {
            const movieId = movie.externalId || movie.id;
            const response = await movieService.reactToMovie(movieId, reaction.id, reaction.score);
            if (response.success) {
                toast.success('Reaction submitted!');
                // Reload stats to get updated score
                loadStats();
            } else {
                toast.error(response.error || 'Failed to submit reaction');
                setSelectedReaction(previousReaction);
            }
        } catch (error) {
            console.error('Failed to submit reaction', error);

            toast.error('Failed to submit reaction');
            setSelectedReaction(previousReaction);
        }
    };

    // Dynamic color helper
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20';
        if (score >= 5) return 'text-amber-400 border-amber-500/50 shadow-amber-500/20';
        return 'text-rose-500 border-rose-500/50 shadow-rose-500/20';
    };

    const scoreColorClass = getScoreColor(communityScore / 10);
    const borderColorClass = scoreColorClass.split(' ')[1];
    const textColorClass = scoreColorClass.split(' ')[0];

    return (
        <div className="relative group overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-lg shadow-black/5 ring-1 ring-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:shadow-black/10 hover:border-white/10">
            {/* Glass reflection gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

            {/* Decorative top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

            <div className="flex flex-col items-center p-3 md:p-4 gap-3 md:gap-4">
                {/* Score Section - Centered on mobile */}
                <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full">
                    <div className="relative w-16 md:w-20 h-auto flex flex-col items-center justify-center flex-shrink-0 gap-1 md:gap-2">
                        <img
                            src="/—Pngtree—hand drawn a box of_4564089.png"
                            alt="Score Box"
                            className="w-12 md:w-16 h-12 md:h-16 object-contain drop-shadow-lg"
                        />
                        <div className="flex flex-col items-center justify-center -mt-1">
                            <span className={`text-base md:text-lg font-bold tracking-tight ${textColorClass}`}>
                                {(communityScore).toFixed(0)}%
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start md:mr-auto">
                        <h3 className="text-xs md:text-sm font-semibold text-white tracking-wide uppercase">Community Pulse</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold bg-white/10 text-white/70 border border-white/10 shadow-[0_0_10px_-4px_rgba(255,255,255,0.1)] backdrop-blur-md">
                                {totalVotes.toLocaleString()} Reactions
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Featured Review - Single & Clean */}
                {/* Right: Reviews Section */}
                <div className="flex-1 w-full border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-8 min-w-0">
                    <AnimatePresence mode='wait'>
                        {!isReviewsExpanded ? (
                            // Single Featured Review
                            reviews && reviews.length > 0 ? (
                                <motion.div
                                    key="single-review"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="relative pr-1"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {reviews[0].userAvatar ? (
                                            <img src={reviews[0].userAvatar} alt={reviews[0].userName} className="w-5 h-5 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase flex-shrink-0">
                                                {reviews[0].userName?.[0] || '?'}
                                            </div>
                                        )}
                                        <span className="text-xs font-semibold text-white/80 truncate">{reviews[0].userName}</span>

                                        {/* User Reaction Badge */}
                                        {REACTIONS.find(r => r.id === reviews[0].reaction) && (
                                            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/5 ml-1.5">
                                                <img
                                                    src={REACTIONS.find(r => r.id === reviews[0].reaction)?.icon}
                                                    alt="Reaction"
                                                    className="w-3 h-3 object-contain"
                                                />
                                            </div>
                                        )}

                                        <span className="text-[10px] text-white/30 ml-auto whitespace-nowrap">
                                            {new Date(reviews[0].createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60 font-light italic leading-relaxed line-clamp-2">
                                        "{reviews[0].review}"
                                    </p>
                                    <button
                                        onClick={() => setIsReviewsExpanded(true)}
                                        className="mt-2 text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 group/btn"
                                    >
                                        Read all reviews <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                                    </button>
                                </motion.div>
                            ) : (
                                <div key="no-reviews" className="text-sm text-white/30 italic py-2">
                                    No reviews yet. Be the first to share your thoughts.
                                </div>
                            )
                        ) : (
                            // Expanded List View
                            <motion.div
                                key="reviews-list"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                                    <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest">Recent Reviews</h4>
                                    <button
                                        onClick={() => setIsReviewsExpanded(false)}
                                        className="text-[10px] text-white/50 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                                    >
                                        Close <span className="rotate-180">↑</span>
                                    </button>
                                </div>
                                <div className="max-h-[250px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                {review.userAvatar ? (
                                                    <img src={review.userAvatar} alt={review.userName} className="w-4 h-4 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white uppercase flex-shrink-0">
                                                        {review.userName?.[0] || '?'}
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-white/80 truncate">{review.userName}</span>
                                                {/* User Reaction Badge */}
                                                {REACTIONS.find(r => r.id === review.reaction) && (
                                                    <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-full border border-white/5 ml-1">
                                                        <img
                                                            src={REACTIONS.find(r => r.id === review.reaction)?.icon}
                                                            alt="Reaction"
                                                            className="w-2.5 h-2.5 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-white/30 ml-auto whitespace-nowrap">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/60 font-light leading-relaxed">
                                                "{review.review}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
