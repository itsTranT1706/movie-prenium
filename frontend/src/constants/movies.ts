/**
 * Movie Constants
 * Genres and Countries from KKPhim API
 */

export const GENRES = [
    { name: 'Hành Động', slug: 'hanh-dong' },
    { name: 'Cổ Trang', slug: 'co-trang' },
    { name: 'Chiến Tranh', slug: 'chien-tranh' },
    { name: 'Viễn Tưởng', slug: 'vien-tuong' },
    { name: 'Kinh Dị', slug: 'kinh-di' },
    { name: 'Tài Liệu', slug: 'tai-lieu' },
    { name: 'Bí Ẩn', slug: 'bi-an' },
    { name: 'Tình Cảm', slug: 'tinh-cam' },
    { name: 'Tâm Lý', slug: 'tam-ly' },
    { name: 'Thể Thao', slug: 'the-thao' },
    { name: 'Phiêu Lưu', slug: 'phieu-luu' },
    { name: 'Âm Nhạc', slug: 'am-nhac' },
    { name: 'Gia Đình', slug: 'gia-dinh' },
    { name: 'Học Đường', slug: 'hoc-duong' },
    { name: 'Hài Hước', slug: 'hai-huoc' },
    { name: 'Hình Sự', slug: 'hinh-su' },
    { name: 'Võ Thuật', slug: 'vo-thuat' },
    { name: 'Khoa Học', slug: 'khoa-hoc' },
    { name: 'Thần Thoại', slug: 'than-thoai' },
    { name: 'Chính Kịch', slug: 'chinh-kich' },
    { name: 'Kinh Điển', slug: 'kinh-dien' },
] as const;

export const COUNTRIES = [
    { name: 'Hàn Quốc', slug: 'han-quoc' },
    { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Nhật Bản', slug: 'nhat-ban' },
    { name: 'Thái Lan', slug: 'thai-lan' },
    { name: 'Âu Mỹ', slug: 'au-my' },
    { name: 'Đài Loan', slug: 'dai-loan' },
    { name: 'Hồng Kông', slug: 'hong-kong' },
    { name: 'Ấn Độ', slug: 'an-do' },
    { name: 'Anh', slug: 'anh' },
    { name: 'Pháp', slug: 'phap' },
    { name: 'Canada', slug: 'canada' },
    { name: 'Quốc Gia Khác', slug: 'quoc-gia-khac' },
    { name: 'Đức', slug: 'duc' },
    { name: 'Tây Ban Nha', slug: 'tay-ban-nha' },
    { name: 'Thổ Nhĩ Kỳ', slug: 'tho-nhi-ky' },
    { name: 'Hà Lan', slug: 'ha-lan' },
    { name: 'Indonesia', slug: 'indonesia' },
    { name: 'Nga', slug: 'nga' },
    { name: 'Mexico', slug: 'mexico' },
    { name: 'Ba Lan', slug: 'ba-lan' },
    { name: 'Úc', slug: 'uc' },
    { name: 'Thụy Điển', slug: 'thuy-dien' },
    { name: 'Malaysia', slug: 'malaysia' },
    { name: 'Brazil', slug: 'brazil' },
    { name: 'Philippines', slug: 'philippines' },
    { name: 'Bồ Đào Nha', slug: 'bo-dao-nha' },
    { name: 'Ý', slug: 'y' },
    { name: 'Đan Mạch', slug: 'dan-mach' },
    { name: 'UAE', slug: 'uae' },
    { name: 'Na Uy', slug: 'na-uy' },
    { name: 'Thụy Sĩ', slug: 'thuy-si' },
    { name: 'Châu Phi', slug: 'chau-phi' },
    { name: 'Nam Phi', slug: 'nam-phi' },
    { name: 'Ukraina', slug: 'ukraina' },
    { name: 'Ả Rập Xê Út', slug: 'a-rap-xe-ut' },
    { name: 'Việt Nam', slug: 'viet-nam' },
] as const;

// Create lookup maps
export const GENRE_MAP = Object.fromEntries(
    GENRES.map(g => [g.slug, g.name])
);

export const COUNTRY_MAP = Object.fromEntries(
    COUNTRIES.map(c => [c.slug, c.name])
);

export const QUALITIES = ['4K', 'FHD', 'HD', 'CAM'] as const;

export const LANGUAGES = [
    'Vietsub',
    'Thuyết Minh',
    'Lồng Tiếng',
    'Vietsub + Thuyết Minh',
    'Vietsub + Lồng Tiếng'
] as const;

export const STATUS = ['Completed', 'Ongoing', 'Upcoming'] as const;
