import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';
import { notFound } from 'next/navigation';

interface GenrePageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// Genre mapping for display names
const GENRE_NAMES: Record<string, string> = {
    'hanh-dong': 'Hành Động',
    'co-trang': 'Cổ Trang',
    'chien-tranh': 'Chiến Tranh',
    'vien-tuong': 'Viễn Tưởng',
    'kinh-di': 'Kinh Dị',
    'tai-lieu': 'Tài Liệu',
    'bi-an': 'Bí Ẩn',
    'tinh-cam': 'Tình Cảm',
    'tam-ly': 'Tâm Lý',
    'the-thao': 'Thể Thao',
    'phieu-luu': 'Phiêu Lưu',
    'am-nhac': 'Âm Nhạc',
    'gia-dinh': 'Gia Đình',
    'hoc-duong': 'Học Đường',
    'hai-huoc': 'Hài Hước',
    'hinh-su': 'Hình Sự',
    'vo-thuat': 'Võ Thuật',
    'khoa-hoc': 'Khoa Học',
    'than-thoai': 'Thần Thoại',
    'chinh-kich': 'Chính Kịch',
    'kinh-dien': 'Kinh Điển',
};

const TOTAL_PAGES = 50;

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
    const { slug } = await params;
    const { page = '1' } = await searchParams;
    const currentPage = Math.max(1, parseInt(page, 10));

    // Validate genre slug
    if (!GENRE_NAMES[slug]) {
        notFound();
    }

    let movies: any[] = [];

    try {
        movies = await serverApi.getMoviesByGenre(slug, currentPage);
    } catch (error) {
        console.error('Failed to fetch movies by genre:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle={`Phim ${GENRE_NAMES[slug]}`}
            baseUrl={`/genre/${slug}`}
        />
    );
}

export async function generateMetadata({ params }: GenrePageProps) {
    const { slug } = await params;
    const genreName = GENRE_NAMES[slug] || slug;

    return {
        title: `Phim ${genreName} - Movie Streaming`,
        description: `Xem phim ${genreName} mới nhất, chất lượng cao, vietsub nhanh nhất`,
    };
}
