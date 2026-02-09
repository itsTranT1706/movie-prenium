'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        year: true,
    });

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...filters, [key]: value };
        onFilterChange(newFilters);
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
            "h-full bg-transparent p-6 overflow-y-auto scrollbar-none",
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
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        placeholder="Search movies, actors..."
                        className="w-full bg-[#1a1a1a] text-white pl-10 pr-10 py-3 rounded-xl border border-white/5 focus:border-white/20 focus:outline-none transition-all text-sm focus:ring-1 focus:ring-white/20"
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

            <div className="space-y-6">
                {/* Genre Filter */}
                <FilterSection
                    title="Genre"
                    isExpanded={isExpanded.genres}
                    onToggle={() => setIsExpanded({ ...isExpanded, genres: !isExpanded.genres })}
                    count={filters.genres.length}
                >
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {GENRES.map((genre) => (
                                <FilterChip
                                    key={genre.slug}
                                    label={genre.name}
                                    isActive={filters.genres.includes(genre.slug)}
                                    onClick={() => toggleArrayFilter('genres', genre.slug)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </FilterSection>

                {/* Country Filter */}
                <FilterSection
                    title="Country"
                    isExpanded={isExpanded.countries}
                    onToggle={() => setIsExpanded({ ...isExpanded, countries: !isExpanded.countries })}
                    count={filters.countries.length}
                >
                    <div className="flex flex-wrap gap-2">
                        {COUNTRIES.map((country) => (
                            <FilterChip
                                key={country.slug}
                                label={country.name}
                                isActive={filters.countries.includes(country.slug)}
                                onClick={() => toggleArrayFilter('countries', country.slug)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Year Range Filter */}
                <FilterSection
                    title="Release Year"
                    isExpanded={isExpanded.year}
                    onToggle={() => setIsExpanded({ ...isExpanded, year: !isExpanded.year })}
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
                    <div className="flex flex-wrap gap-2">
                        {QUALITIES.map((quality) => (
                            <FilterChip
                                key={quality}
                                label={quality}
                                isActive={filters.qualities.includes(quality)}
                                onClick={() => toggleArrayFilter('qualities', quality)}
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
                    <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((language) => (
                            <FilterChip
                                key={language}
                                label={language}
                                isActive={filters.languages.includes(language)}
                                onClick={() => toggleArrayFilter('languages', language)}
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
                    <div className="flex flex-wrap gap-2">
                        {STATUS.map((status) => (
                            <FilterChip
                                key={status}
                                label={status}
                                isActive={filters.status.includes(status)}
                                onClick={() => toggleArrayFilter('status', status)}
                            />
                        ))}
                    </div>
                </FilterSection>
            </div>
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
        <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between mb-4 text-white hover:text-gray-300 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-200 group-hover:text-white transition-colors">{title}</span>
                    {count !== undefined && count > 0 && (
                        <span className="text-[10px] items-center flex justify-center w-5 h-5 bg-white text-black font-bold rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface FilterChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

function FilterChip({ label, isActive, onClick }: FilterChipProps) {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border",
                isActive
                    ? "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "bg-[#1f1f1f] border-white/5 text-gray-400 hover:bg-[#2a2a2a] hover:border-white/10 hover:text-gray-200"
            )}
        >
            {isActive && <Check className="w-3 h-3 text-white" />}
            {label}

            {/* Active Glow Effect */}
            {isActive && (
                <motion.div
                    layoutId="glow"
                    className="absolute inset-0 rounded-full bg-white/5 blur-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </motion.button>
    );
}
