import { SkeletonLoading } from "@/shared/components/ui";

export function UpcomingMoviesSkeleton() {
    return (
        <section className="py-4 lg:py-6">
            <div className="container">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0">
                            <div className="w-56 lg:w-64 xl:w-72 aspect-[16/10] bg-white/10 rounded-xl animate-pulse mb-2" />
                            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse mb-1" />
                            <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TheaterMoviesSkeleton() {
    return (
        <section className="py-3 md:py-4 lg:py-6">
            <div className="container px-4 md:px-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="h-7 w-48 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                    <div className="flex-1 relative bg-[#1a1a2e] rounded-xl md:rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/8]">
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6">
                            <div className="flex gap-3 md:gap-4 lg:gap-6 items-end">
                                <div className="flex-shrink-0 w-16 md:w-24 lg:w-32 aspect-[2/3] bg-white/10 rounded-md animate-pulse" />
                                <div className="flex-1 pb-1 space-y-2">
                                    <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
                                    <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function TrendingSectionSkeleton() {
    return (
        <section className="py-4 lg:py-6 bg-[#0a0a0a]">
            <div className="container">
                <div className="border-t border-white/10 pt-4 mb-4" />

                {/* Desktop Grid Skeleton */}
                <div className="hidden lg:grid grid-cols-4 divide-x divide-white/10">
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                        <div key={colIndex} className="px-5 first:pl-0 last:pr-0">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-4 h-4 rounded-full bg-white/10" />
                                <div className="h-4 w-24 bg-white/10 rounded" />
                            </div>
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 h-[72px] px-2 animate-pulse">
                                        <div className="w-5 h-5 bg-white/10 rounded" />
                                        <div className="w-5 h-4 bg-white/10 rounded" />
                                        <div className="w-10 h-14 bg-white/10 rounded" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-white/10 rounded w-3/4" />
                                            <div className="h-2 bg-white/10 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Skeleton */}
                <div className="lg:hidden flex gap-4 overflow-hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-[280px] flex-shrink-0">
                            <div className="h-4 w-32 bg-white/10 rounded mb-4" />
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <div key={j} className="h-12 bg-white/5 rounded" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Top10MoviesSkeleton() {
    return (
        <section className="py-8 bg-gradient-to-b from-black to-[#0a0a0a]">
            <div className="container relative">
                <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-8" />
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function MovieRowSkeleton() {
    return (
        <section className="py-4 lg:py-6">
            <div className="container">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-white/10 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        </section>
    )
}
