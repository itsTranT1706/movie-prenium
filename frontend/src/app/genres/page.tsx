import GenreCardGrid from '@/components/features/genre-card-grid';
import { StageSpotlight } from '@/components/ui/stage-spotlight';

export const metadata = {
    title: 'Tất Cả Thể Loại - Movie Streaming',
    description: 'Khám phá tất cả thể loại phim: Hành Động, Hài Hước, Kinh Dị, Tình Cảm và nhiều hơn nữa',
};

export default function AllGenresPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20 lg:pt-24 pb-12 relative overflow-hidden">
            {/* Stage Spotlight Effect */}
            <StageSpotlight color="blue" intensity="medium" />
            
            <div className="container relative z-10">
                <GenreCardGrid showAll={true} />
            </div>
        </div>
    );
}
