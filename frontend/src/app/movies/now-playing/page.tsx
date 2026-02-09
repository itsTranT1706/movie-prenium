import { MoviesFilterPageSimple } from '@/features/movies';

export default async function NowPlayingMoviesPage() {
    return (
        <MoviesFilterPageSimple
            pageTitle="Phim Đang Chiếu Rạp"
        />
    );
}

export const metadata = {
    title: 'Phim Đang Chiếu Rạp - Movie Streaming',
    description: 'Xem phim đang chiếu rạp mới nhất, phim hot trong rạp',
};
