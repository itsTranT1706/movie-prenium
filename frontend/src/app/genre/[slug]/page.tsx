import { MoviesFilterPage } from '@/components/features';
import { notFound } from 'next/navigation';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface GenrePageProps {
    params: Promise<{ slug: string }>;
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

export default async function GenrePage({ params }: GenrePageProps) {
    const { slug } = await params;

    // Validate genre slug
    if (!GENRE_NAMES[slug]) {
        notFound();
    }

    return (
        <MoviesFilterPage 
            initialMovies={[]}
            pageTitle={`Phim ${GENRE_NAMES[slug]}`}
            baseUrl={`/genre/${slug}`}
            initialFilters={{
                genres: [slug], // Pre-select genre
            }}
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
