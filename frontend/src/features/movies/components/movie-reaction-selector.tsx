'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { movieService } from '@/features/movies/api/movie.service';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { X, Send, SkipForward } from 'lucide-react';

interface MovieReactionSelectorProps {
    movieId: string;
    movieTitle?: string;
    moviePoster?: string;
}

// 3D Animated Emoji data
const REACTIONS = [
    {
        id: 'MASTERPIECE',
        label: 'Masterpiece',
        score: 10,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png',
        color: 'text-amber-400',
    },
    {
        id: 'LOVE',
        label: 'Love it',
        score: 8,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png',
        color: 'text-rose-400',
    },
    {
        id: 'GOOD',
        label: 'Good',
        score: 6,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Up.png',
        color: 'text-emerald-400',
    },
    {
        id: 'MEH',
        label: 'Meh',
        score: 4,
        icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Neutral%20Face.png',
        color: 'text-gray-400',
    }
];

export function MovieReactionSelector({ movieId, movieTitle, moviePoster }: MovieReactionSelectorProps) {
    const { isAuthenticated } = useAuth();
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
    const [showReviewPanel, setShowReviewPanel] = useState(false);
    const [pendingReaction, setPendingReaction] = useState<typeof REACTIONS[0] | null>(null);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (movieId && isAuthenticated) {
            loadUserReaction();
        }
    }, [movieId, isAuthenticated]);

    // Lock body scroll when panel is open
    useEffect(() => {
        if (showReviewPanel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showReviewPanel]);

    const loadUserReaction = async () => {
        try {
            const response = await movieService.getMyReaction(movieId);
            if (response.success && response.data) {
                setSelectedReaction(response.data.reaction);
            }
        } catch (error) {
            // Ignore error
        }
    };

    const handleReactionClick = (reaction: typeof REACTIONS[0]) => {
        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đánh giá phim');
            return;
        }

        setPendingReaction(reaction);
        setReviewText('');
        setShowReviewPanel(true);
    };

    const submitReaction = async (includeReview: boolean) => {
        if (!pendingReaction) return;

        const previousReaction = selectedReaction;
        setSelectedReaction(pendingReaction.id);
        setShowReviewPanel(false);
        setIsSubmitting(true);

        try {
            const review = includeReview && reviewText.trim() ? reviewText.trim() : undefined;
            const response = await movieService.reactToMovie(
                movieId,
                pendingReaction.id,
                pendingReaction.score,
                review
            );
            if (response.success) {
                toast.success(includeReview && review ? 'Đã gửi đánh giá và nhận xét!' : 'Đã gửi đánh giá!');
            } else {
                toast.error(response.error || 'Lỗi khi gửi đánh giá');
                setSelectedReaction(previousReaction);
            }
        } catch (error) {
            toast.error('Lỗi khi gửi đánh giá');
            setSelectedReaction(previousReaction);
        } finally {
            setIsSubmitting(false);
            setPendingReaction(null);
            setReviewText('');
        }
    };

    const handleSkip = () => {
        submitReaction(false);
    };

    const handleSubmitWithReview = () => {
        submitReaction(true);
    };

    const handleClose = () => {
        setShowReviewPanel(false);
        setPendingReaction(null);
        setReviewText('');
    };

    return (
        <>
            <div className="flex flex-col items-center lg:items-end">
                <span className="text-xs text-gray-400 mb-2 font-medium">Đánh giá phim</span>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                    {REACTIONS.map((reaction) => (
                        <button
                            key={reaction.id}
                            onClick={() => handleReactionClick(reaction)}
                            disabled={isSubmitting}
                            className={`group relative flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer disabled:opacity-50 ${selectedReaction === reaction.id
                                ? 'scale-125 opacity-100'
                                : 'opacity-60 hover:opacity-100 hover:scale-110'
                                }`}
                            title={reaction.label}
                        >
                            <div className="relative w-8 h-8">
                                <img
                                    src={reaction.icon}
                                    alt={reaction.label}
                                    className="w-full h-full object-contain filter drop-shadow-md"
                                />
                                {selectedReaction === reaction.id && (
                                    <motion.div
                                        layoutId="active-reaction-glow"
                                        className="absolute inset-0 bg-white/30 blur-lg rounded-full -z-10"
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cinematic Review Panel */}
            <AnimatePresence>
                {showReviewPanel && pendingReaction && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 z-50 bg-black/80"
                        />

                        {/* Desktop: Side Panel from Right */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg hidden md:flex flex-col overflow-hidden"
                        >
                            {/* Movie backdrop background */}
                            {moviePoster && (
                                <div className="absolute inset-0">
                                    <img
                                        src={moviePoster}
                                        alt=""
                                        className="w-full h-full object-cover opacity-30 blur-sm"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/80" />
                                </div>
                            )}
                            {!moviePoster && (
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                            )}

                            {/* Content */}
                            <div className="relative flex flex-col h-full p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            Đánh giá phim
                                        </h2>
                                        {movieTitle && (
                                            <p className="text-zinc-400 text-sm truncate max-w-[280px]">
                                                {movieTitle}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Selected Reaction Display */}
                                <div className="flex items-center gap-5 mb-8 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full" />
                                        <img
                                            src={pendingReaction.icon}
                                            alt={pendingReaction.label}
                                            className="relative w-20 h-20 drop-shadow-2xl"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {pendingReaction.label}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-3 h-3 rounded-full transition-all ${i < pendingReaction.score / 2 ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-zinc-600'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-lg text-amber-400 font-bold">
                                                {pendingReaction.score}/10
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Input */}
                                <div className="flex-1 flex flex-col mb-6">
                                    <label className="text-sm font-medium text-zinc-300 mb-3">
                                        Chia sẻ cảm nhận của bạn
                                    </label>
                                    <div className="relative flex-1">
                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            placeholder="Bộ phim này khiến bạn cảm thấy như thế nào..."
                                            className="w-full h-full min-h-[150px] px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                            maxLength={500}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-xs text-zinc-500">
                                            Tùy chọn - bạn có thể bỏ qua
                                        </span>
                                        <span className={`text-xs font-medium ${reviewText.length > 400 ? 'text-amber-400' : 'text-zinc-500'}`}>
                                            {reviewText.length}/500
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSkip}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl font-medium transition-all cursor-pointer"
                                    >
                                        <SkipForward className="w-5 h-5" />
                                        Bỏ qua
                                    </button>
                                    <button
                                        onClick={handleSubmitWithReview}
                                        disabled={!reviewText.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                        Gửi đánh giá
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile: Bottom Sheet with drag-to-dismiss */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.5 }}
                            onDragEnd={(_, info) => {
                                // Close if dragged down more than 100px or with high velocity
                                if (info.offset.y > 100 || info.velocity.y > 500) {
                                    handleClose();
                                }
                            }}
                            className="fixed left-0 right-0 bottom-0 z-50 md:hidden max-h-[90vh] overflow-hidden rounded-t-3xl touch-none"
                        >
                            {/* Movie backdrop background */}
                            {moviePoster && (
                                <div className="absolute inset-0">
                                    <img
                                        src={moviePoster}
                                        alt=""
                                        className="w-full h-full object-cover opacity-40 blur-md"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80" />
                                </div>
                            )}
                            {!moviePoster && (
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-800 to-zinc-900" />
                            )}

                            {/* Content */}
                            <div className="relative flex flex-col p-5 pb-8">
                                {/* Drag Handle - visual indicator */}
                                <div className="flex justify-center mb-4 cursor-grab active:cursor-grabbing">
                                    <div className="w-12 h-1.5 bg-white/30 rounded-full" />
                                </div>

                                {/* Drag hint text */}
                                <p className="text-center text-xs text-zinc-500 mb-3 -mt-2">
                                    Kéo xuống để đóng
                                </p>

                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold text-white">
                                        Đánh giá phim
                                    </h2>
                                    <button
                                        onClick={handleClose}
                                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Selected Reaction */}
                                <div className="flex items-center gap-4 mb-5 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full" />
                                        <img
                                            src={pendingReaction.icon}
                                            alt={pendingReaction.label}
                                            className="relative w-14 h-14 drop-shadow-lg"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {pendingReaction.label}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-2 h-2 rounded-full ${i < pendingReaction.score / 2 ? 'bg-amber-400' : 'bg-zinc-600'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-amber-400 font-semibold">
                                                {pendingReaction.score}/10
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Input */}
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Chia sẻ cảm nhận của bạn
                                    </label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Bộ phim này khiến bạn cảm thấy như thế nào..."
                                        className="w-full h-24 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-zinc-500">
                                            Tùy chọn
                                        </span>
                                        <span className={`text-xs font-medium ${reviewText.length > 400 ? 'text-amber-400' : 'text-zinc-500'}`}>
                                            {reviewText.length}/500
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSkip}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl font-medium transition-all cursor-pointer"
                                    >
                                        <SkipForward className="w-4 h-4" />
                                        Bỏ qua
                                    </button>
                                    <button
                                        onClick={handleSubmitWithReview}
                                        disabled={!reviewText.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
