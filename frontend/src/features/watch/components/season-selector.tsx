import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Season {
    id: string;
    name: string;
    episodes?: any[];
    [key: string]: any;
}

interface SeasonSelectorProps {
    seasons: Season[];
    selectedSeasonId: string;
    onSelect: (id: string) => void;
}

export function SeasonSelector({ seasons, selectedSeasonId, onSelect }: SeasonSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedSeason = seasons.find(s => s.id === selectedSeasonId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-zinc-800/80 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-zinc-700/80 transition-colors shadow-sm"
            >
                <span className="truncate max-w-[150px]">{selectedSeason?.name || 'Chọn Server'}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 p-1.5"
                    >
                        <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {seasons.map((season) => (
                                <button
                                    key={season.id}
                                    onClick={() => {
                                        onSelect(season.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 text-sm rounded-lg transition-all text-left mb-1 last:mb-0",
                                        selectedSeasonId === season.id
                                            ? "bg-zinc-800 text-white font-medium shadow-sm"
                                            : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
                                    )}
                                >
                                    <span className="truncate">{season.name}</span>
                                    {selectedSeasonId === season.id && (
                                        <Check className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
