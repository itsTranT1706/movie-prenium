import { NavigationLink } from '@/shared/components/ui';
import { serverApi } from '@/shared/lib/api/server';
import { MoviesGrid } from '@/features/movies';
import { StageSpotlight } from '@/shared/components/ui/stage-spotlight';
import { AnimatedShapeCard } from '@/shared/components/ui/animated-shape-card';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Series types configuration
const SERIES_TYPES = [
    {
        slug: 'phim-bo',
        name: 'Phim Bộ',
        description: 'Phim nhiều tập, phim truyền hình dài tập',
        iconName: 'Tv' as const,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        slug: 'phim-le',
        name: 'Phim Lẻ',
        description: 'Phim điện ảnh, phim chiếu rạp',
        iconName: 'Film' as const,
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        slug: 'tv-shows',
        name: 'TV Shows',
        description: 'Chương trình truyền hình, game show, reality show',
        iconName: 'Play' as const,
        gradient: 'from-green-500 to-emerald-500'
    },
    {
        slug: 'hoat-hinh',
        name: 'Hoạt Hình',
        description: 'Anime, phim hoạt hình',
        iconName: 'Sparkles' as const,
        gradient: 'from-orange-500 to-yellow-500'
    },
];

export default async function SeriesPage() {
    // Fetch initial movies for the first type (phim-bo)
    let initialMovies: any[] = [];

    try {
        initialMovies = await serverApi.getMoviesByType('phim-bo', 1);
    } catch (error) {
        console.error('Failed to fetch series:', error);
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-20 pb-10 relative overflow-hidden">
            {/* Stage Spotlight Effect - Reusable Component */}
            <StageSpotlight color="purple" intensity="medium" />

            <div className="container relative z-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Series & TV Shows
                    </h1>
                    <p className="text-gray-400">
                        Khám phá bộ sưu tập phim bộ, phim lẻ, TV shows và hoạt hình
                    </p>
                </div>

                {/* Series Type Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                    {SERIES_TYPES.map((type, index) => (
                        <AnimatedShapeCard
                            key={type.slug}
                            href={`/series/${type.slug}`}
                            iconName={type.iconName}
                            title={type.name}
                            description={type.description}
                            gradient={type.gradient}
                            index={index}
                        />
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 mb-8" />

                {/* Featured Series - Phim Bộ */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl lg:text-2xl font-bold text-white">
                            Phim Bộ Mới Nhất
                        </h2>
                        <NavigationLink
                            href="/series/phim-bo"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Xem tất cả →
                        </NavigationLink>
                    </div>

                    <MoviesGrid initialMovies={initialMovies} />
                </div>
            </div>
        </main>
    );
}

export const metadata = {
    title: 'Series & TV Shows - Movie Streaming',
    description: 'Xem phim bộ, phim lẻ, TV shows và hoạt hình mới nhất, chất lượng cao',
};
