import TrendingSection from './trending-section';

/**
 * Trending Section Wrapper with Mock Data
 * Displays trending movies, favorites, hot genres, and recent comments
 */
export default function TrendingSectionWrapper() {
    // Mock trending movies
    const trendingItems = [
        {
            id: '1',
            rank: 1,
            title: 'Squid Game (Phần 2)',
            posterUrl: 'https://phimimg.com/upload/vod/20260120-1/58166ddd12293c253590fa7250eac046.jpg',
        },
        {
            id: '2',
            rank: 2,
            title: 'Địa Ngục Độc Thân (Phần 5)',
            posterUrl: 'https://phimimg.com/upload/vod/20260120-1/58166ddd12293c253590fa7250eac046.jpg',
        },
        {
            id: '3',
            rank: 3,
            title: 'Người Lạc Truyền',
            posterUrl: 'https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg',
        },
        {
            id: '4',
            rank: 4,
            title: 'Ngôi Trường Xác Sống',
            posterUrl: 'https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg',
        },
        {
            id: '5',
            rank: 5,
            title: 'Thợ Săn Quỷ: Kimetsu no Yaiba',
            posterUrl: 'https://phimimg.com/upload/vod/20251223-1/f7807e71d414227b43d57cdf1a5fe679.jpg',
        },
    ];

    // Mock favorite movies
    const favoriteItems = [
        {
            id: '6',
            rank: 1,
            title: 'Ký Sinh Trùng',
            posterUrl: 'https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg',
        },
        {
            id: '7',
            rank: 2,
            title: 'Train to Busan',
            posterUrl: 'https://phimimg.com/upload/vod/20260120-1/58166ddd12293c253590fa7250eac046.jpg',
        },
        {
            id: '8',
            rank: 3,
            title: 'Hạ Cánh Nơi Anh',
            posterUrl: 'https://phimimg.com/upload/vod/20250823-1/6cecd0755934def609b834127974dab8.jpg',
        },
        {
            id: '9',
            rank: 4,
            title: 'Itaewon Class',
            posterUrl: 'https://phimimg.com/upload/vod/20251223-1/f7807e71d414227b43d57cdf1a5fe679.jpg',
        },
        {
            id: '10',
            rank: 5,
            title: 'Vincenzo',
            posterUrl: 'https://phimimg.com/upload/vod/20250325-1/6db202d6161c123d96b0180c2da9b1e5.jpg',
        },
    ];

    // Mock hot categories
    const hotCategories = [
        { id: 'hanh-dong', name: 'Hành Động', color: 'bg-red-600' },
        { id: 'tinh-cam', name: 'Tình Cảm', color: 'bg-pink-600' },
        { id: 'hai-huoc', name: 'Hài Hước', color: 'bg-yellow-600' },
        { id: 'kinh-di', name: 'Kinh Dị', color: 'bg-gray-800' },
        { id: 'vien-tuong', name: 'Viễn Tưởng', color: 'bg-blue-600' },
    ];

    // Mock recent comments
    const recentComments = [
        {
            id: '1',
            username: 'Nguyễn Văn A',
            avatar: 'https://i.pravatar.cc/150?img=1',
            content: 'Phim hay quá, cảm động đến rơi nước mắt 😭',
            movieTitle: 'Squid Game (Phần 2)',
            isVip: true,
        },
        {
            id: '2',
            username: 'Trần Thị B',
            avatar: 'https://i.pravatar.cc/150?img=2',
            content: 'Cốt truyện hấp dẫn, diễn xuất tuyệt vời!',
            movieTitle: 'Địa Ngục Độc Thân',
        },
        {
            id: '3',
            username: 'Lê Văn C',
            avatar: 'https://i.pravatar.cc/150?img=3',
            content: 'Xem đi xem lại vẫn thấy hay 👍',
            movieTitle: 'Người Lạc Truyền',
            isVip: true,
        },
        {
            id: '4',
            username: 'Phạm Thị D',
            avatar: 'https://i.pravatar.cc/150?img=4',
            content: 'Phim kinh dị hay nhất năm nay!',
            movieTitle: 'Ngôi Trường Xác Sống',
        },
        {
            id: '5',
            username: 'Hoàng Văn E',
            avatar: 'https://i.pravatar.cc/150?img=5',
            content: 'Anime đỉnh cao, đáng xem!',
            movieTitle: 'Thợ Săn Quỷ',
        },
    ];

    return (
        <TrendingSection
            trendingItems={trendingItems}
            favoriteItems={favoriteItems}
            hotCategories={hotCategories}
            recentComments={recentComments}
        />
    );
}
