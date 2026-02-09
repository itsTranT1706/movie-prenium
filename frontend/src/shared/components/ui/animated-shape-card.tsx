'use client';

import { Film, Tv, Play, Sparkles, LucideIcon } from 'lucide-react';
import { NavigationLink } from './navigation-link';

interface AnimatedShapeCardProps {
    href: string;
    iconName: 'Film' | 'Tv' | 'Play' | 'Sparkles';
    title: string;
    description: string;
    gradient: string;
    index: number;
}

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
    Film,
    Tv,
    Play,
    Sparkles,
};

// Netflix-style subtle background patterns
const SubtleGradientPattern = ({ gradient }: { gradient: string }) => (
    <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15`} />
        {/* Soft glow effect */}
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tl ${gradient} opacity-20 blur-3xl`} />
    </div>
);

const MinimalWavePattern = ({ gradient }: { gradient: string }) => (
    <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
        <svg className="absolute bottom-0 w-full h-20 opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
                d="M0,60 C300,90 600,30 900,60 C1050,75 1150,60 1200,50 L1200,120 L0,120 Z"
                className="fill-current text-white"
            />
        </svg>
    </div>
);

const SoftBlobPattern = ({ gradient }: { gradient: string }) => (
    <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20 animate-blob`} />
    </div>
);

const CleanGradientPattern = ({ gradient }: { gradient: string }) => (
    <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-12`} />
        <div className={`absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent`} />
    </div>
);

const PATTERN_COMPONENTS = [SubtleGradientPattern, MinimalWavePattern, SoftBlobPattern, CleanGradientPattern];

export function AnimatedShapeCard({
    href,
    iconName,
    title,
    description,
    gradient,
    index,
}: AnimatedShapeCardProps) {
    const Icon = ICON_MAP[iconName];
    const PatternComponent = PATTERN_COMPONENTS[index % PATTERN_COMPONENTS.length];

    return (
        <NavigationLink href={href} className="block h-full" loadingType="fade">
            <div
                className="group relative h-full min-h-[160px] cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] rounded-xl overflow-hidden"
                style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
                }}
            >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0">
                    <PatternComponent gradient={gradient} />
                </div>

                {/* Netflix-style dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

                {/* Card content */}
                <div className="relative h-full p-5 border border-white/[0.08] group-hover:border-white/20 transition-all duration-300 rounded-xl flex flex-col">

                    {/* Icon - Netflix style: simple and clean */}
                    <div className="mb-auto">
                        <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm p-2.5 group-hover:bg-white/15 transition-all duration-300">
                            <Icon className="w-full h-full text-white" strokeWidth={2} />
                        </div>
                    </div>

                    {/* Text content - Netflix typography */}
                    <div className="mt-3">
                        {/* Title - Bold and clear */}
                        <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight group-hover:text-white/90 transition-colors duration-200">
                            {title}
                        </h3>

                        {/* Description - Subtle */}
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
                            {description}
                        </p>
                    </div>

                    {/* Netflix-style arrow - appears on hover */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
                </div>
            </div>
        </NavigationLink>
    );
}
