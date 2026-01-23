import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';
import { notFound } from 'next/navigation';

interface CountryPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// Country mapping for display names
const COUNTRY_NAMES: Record<string, string> = {
    'han-quoc': 'Hàn Quốc',
    'trung-quoc': 'Trung Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'au-my': 'Âu Mỹ',
    'dai-loan': 'Đài Loan',
    'hong-kong': 'Hồng Kông',
    'an-do': 'Ấn Độ',
    'anh': 'Anh',
    'phap': 'Pháp',
    'canada': 'Canada',
    'quoc-gia-khac': 'Quốc Gia Khác',
    'duc': 'Đức',
    'tay-ban-nha': 'Tây Ban Nha',
    'tho-nhi-ky': 'Thổ Nhĩ Kỳ',
    'ha-lan': 'Hà Lan',
    'indonesia': 'Indonesia',
    'nga': 'Nga',
    'mexico': 'Mexico',
    'ba-lan': 'Ba Lan',
    'uc': 'Úc',
    'thuy-dien': 'Thụy Điển',
    'malaysia': 'Malaysia',
    'brazil': 'Brazil',
    'philippines': 'Philippines',
    'bo-dao-nha': 'Bồ Đào Nha',
    'y': 'Ý',
    'dan-mach': 'Đan Mạch',
    'uae': 'UAE',
    'na-uy': 'Na Uy',
    'thuy-si': 'Thụy Sĩ',
    'chau-phi': 'Châu Phi',
    'nam-phi': 'Nam Phi',
    'ukraina': 'Ukraina',
    'a-rap-xe-ut': 'Ả Rập Xê Út',
    'viet-nam': 'Việt Nam',
};

const TOTAL_PAGES = 50;

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
    const { slug } = await params;
    const { page = '1' } = await searchParams;
    const currentPage = Math.max(1, parseInt(page, 10));

    // Validate country slug
    if (!COUNTRY_NAMES[slug]) {
        notFound();
    }

    let movies: any[] = [];

    try {
        movies = await serverApi.getMoviesByCountry(slug, currentPage);
    } catch (error) {
        console.error('Failed to fetch movies by country:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle={`Phim ${COUNTRY_NAMES[slug]}`}
            baseUrl={`/country/${slug}`}
        />
    );
}

export async function generateMetadata({ params }: CountryPageProps) {
    const { slug } = await params;
    const countryName = COUNTRY_NAMES[slug] || slug;

    return {
        title: `Phim ${countryName} - Movie Streaming`,
        description: `Xem phim ${countryName} mới nhất, chất lượng cao, vietsub nhanh nhất`,
    };
}
