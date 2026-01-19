'use client';

import { X } from 'lucide-react';
import { FilterSidebar, FilterState } from './filter-sidebar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function MobileFilterDrawer({ isOpen, onClose, filters, onFilterChange }: MobileFilterDrawerProps) {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 top-16 bg-black/80 z-40 transition-opacity duration-300 lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-16 left-0 h-[calc(100vh-4rem)] w-[85%] max-w-sm bg-[#141414] z-50 transition-transform duration-300 lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#141414]">
                    <h2 className="text-lg font-semibold text-white">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Filter Content */}
                <div className="h-full overflow-y-auto p-4 bg-[#141414]">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={onFilterChange}
                        className="bg-transparent border-0 p-0"
                    />
                </div>
            </div>
        </>
    );
}
