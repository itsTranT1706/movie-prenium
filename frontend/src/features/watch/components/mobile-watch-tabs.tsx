'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileWatchTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TABS = [
    { id: 'episodes', label: 'Tập phim' },
    { id: 'actors', label: 'Diễn viên' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: 'Review' },
];

export function MobileWatchTabs({ activeTab, onTabChange }: MobileWatchTabsProps) {
    return (
        <div className="sticky top-[56.25vw] z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
            <div className="flex px-4 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-1 text-center",
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
