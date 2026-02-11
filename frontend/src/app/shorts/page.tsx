import { ShortsFeed } from '@/features/movies';

export const metadata = {
    title: 'Shorts | PhePhim',
    description: 'Xem các video ngắn thú vị về phim ảnh, diễn viên và hậu trường.',
};

export default function ShortsPage() {
    return (
        <main className="min-h-screen bg-black pt-16 lg:pt-0"> {/* Adjust for mobile header if needed */}
            <ShortsFeed />
        </main>
    );
}
