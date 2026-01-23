'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
    search: string;
    genres: string[];
    countries: string[];
    yearRange: [number, number];
    qualities: string[];
    languages: string[];
    status: string[];
}

interface FilterSidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    className?: string;
}

// KKPhim genres with Vietnamese names and slugs
const GENRES = [
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
];

// KKPhim countries with Vietnamese names and slugs
const COUNTRIES = [
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
];

const QUALITIES = ['4K', 'FHD', 'HD', 'CAM'];

const LANGUAGES = ['Vietsub', 'Thuyết Minh', 'Lồng Tiếng', 'Vietsub + Thuyết Minh', 'Vietsub + Lồng Tiếng'];

const STATUS = ['Completed', 'Ongoing', 'Upcoming'];

export function FilterSidebar({ filters, onFilterChange, className }: FilterSidebarProps) {
    const [isExpanded, setIsExpanded] = useState({
        genres: true,
        countries: false,
        quality: true,
        language: false,
        status: false,
    });

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const toggleArrayFilter = (key: 'genres' | 'countries' | 'qualities' | 'languages' | 'status', value: string) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
        updateFilter(key, updated);
    };

    const resetFilters = () => {
        onFilterChange({
            search: '',
            genres: [],
            countries: [],
            yearRange: [1990, 2026],
            qualities: [],
            languages: [],
            status: [],
        });
    };

    const hasActiveFilters = 
        filters.search || 
        filters.genres.length > 0 || 
        filters.countries.length > 0 || 
        filters.qualities.length > 0 ||
        filters.languages.length > 0 ||
        filters.status.length > 0 ||
        filters.yearRange[0] !== 1990 || 
        filters.yearRange[1] !== 2026;

    return (
        <aside className={cn(
            "h-full bg-transparent p-6 overflow-y-auto",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-white">Filters</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Search Input */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        placeholder="Search movies, actors, directors…"
                        className="w-full bg-[#1a1a1a] text-white pl-10 pr-10 py-3 rounded-xl border border-white/5 focus:border-white/20 focus:outline-none transition-colors text-sm"
                    />
                    {filters.search && (
                        <button
                            onClick={() => updateFilter('search', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Genre Filter */}
            <FilterSection
                title="Genre"
                isExpanded={isExpanded.genres}
                onToggle={() => setIsExpanded({ ...isExpanded, genres: !isExpanded.genres })}
                count={filters.genres.length}
            >
                <div className="space-y-2">
                    {GENRES.map((genre) => (
                        <CheckboxItem
                            key={genre.slug}
                            label={genre.name}
                            checked={filters.genres.includes(genre.slug)}
                            onChange={() => toggleArrayFilter('genres', genre.slug)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Country Filter */}
            <FilterSection
                title="Country"
                isExpanded={isExpanded.countries}
                onToggle={() => setIsExpanded({ ...isExpanded, countries: !isExpanded.countries })}
                count={filters.countries.length}
            >
                <div className="space-y-2">
                    {COUNTRIES.map((country) => (
                        <CheckboxItem
                            key={country.slug}
                            label={country.name}
                            checked={filters.countries.includes(country.slug)}
                            onChange={() => toggleArrayFilter('countries', country.slug)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Year Range Filter */}
            <FilterSection
                title="Release Year"
                isExpanded={true}
                onToggle={() => {}}
            >
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">From</label>
                        <input
                            type="number"
                            min="1900"
                            max="2030"
                            value={filters.yearRange[0]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 1990;
                                updateFilter('yearRange', [value, filters.yearRange[1]]);
                            }}
                            className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-xl border border-white/10 focus:border-white/20 focus:outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs mb-1.5 block">To</label>
                        <input
                            type="number"
                            min="1900"
                            max="2030"
                            value={filters.yearRange[1]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 2026;
                                updateFilter('yearRange', [filters.yearRange[0], value]);
                            }}
                            className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded-xl border border-white/10 focus:border-white/20 focus:outline-none text-sm"
                        />
                    </div>
                </div>
            </FilterSection>

            {/* Quality Filter */}
            <FilterSection
                title="Quality"
                isExpanded={isExpanded.quality}
                onToggle={() => setIsExpanded({ ...isExpanded, quality: !isExpanded.quality })}
                count={filters.qualities.length}
            >
                <div className="space-y-2">
                    {QUALITIES.map((quality) => (
                        <CheckboxItem
                            key={quality}
                            label={quality}
                            checked={filters.qualities.includes(quality)}
                            onChange={() => toggleArrayFilter('qualities', quality)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Language Filter */}
            <FilterSection
                title="Language"
                isExpanded={isExpanded.language}
                onToggle={() => setIsExpanded({ ...isExpanded, language: !isExpanded.language })}
                count={filters.languages.length}
            >
                <div className="space-y-2">
                    {LANGUAGES.map((language) => (
                        <CheckboxItem
                            key={language}
                            label={language}
                            checked={filters.languages.includes(language)}
                            onChange={() => toggleArrayFilter('languages', language)}
                        />
                    ))}
                </div>
            </FilterSection>

            {/* Status Filter */}
            <FilterSection
                title="Status"
                isExpanded={isExpanded.status}
                onToggle={() => setIsExpanded({ ...isExpanded, status: !isExpanded.status })}
                count={filters.status.length}
            >
                <div className="space-y-2">
                    {STATUS.map((status) => (
                        <CheckboxItem
                            key={status}
                            label={status}
                            checked={filters.status.includes(status)}
                            onChange={() => toggleArrayFilter('status', status)}
                        />
                    ))}
                </div>
            </FilterSection>
        </aside>
    );
}

interface FilterSectionProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    count?: number;
    children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, count, children }: FilterSectionProps) {
    return (
        <div className="mb-5 pb-5 border-b border-white/10 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between mb-3 text-white hover:text-gray-300 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{title}</span>
                    {count !== undefined && count > 0 && (
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                <svg
                    className={cn(
                        "w-4 h-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}

interface CheckboxItemProps {
    label: string;
    checked: boolean;
    onChange: () => void;
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-600 bg-transparent text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className={cn(
                "text-sm transition-colors",
                checked ? "text-white" : "text-gray-400 group-hover:text-gray-300"
            )}>
                {label}
            </span>
        </label>
    );
}
