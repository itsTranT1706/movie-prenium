import { MoviesFilterPageSimple } from '@/features/movies';

export default async function TopRatedMoviesPage() {
    return (
        <MoviesFilterPageSimple
            pageTitle="Phim Đánh Giá Cao"
        />
    );
}

export const metadata = {
    title: 'Phim Đánh Giá Cao - Movie Streaming',
    description: 'Xem phim được đánh giá cao nhất, phim hay nhất mọi thời đại',
};
