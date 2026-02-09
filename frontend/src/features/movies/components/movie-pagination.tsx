'use client';

import Link from 'next/link';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '@/shared/components/ui';

interface MoviePaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
}

export function MoviePagination({
    currentPage,
    totalPages,
    baseUrl,
    searchParams = {},
}: MoviePaginationProps) {
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: (number | 'dots')[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (prev && i - prev > 1) {
                rangeWithDots.push('dots');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    if (totalPages <= 1) return null;

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    {currentPage > 1 ? (
                        <Link href={createPageUrl(currentPage - 1)} legacyBehavior passHref>
                            <PaginationPrevious />
                        </Link>
                    ) : (
                        <PaginationPrevious className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>

                {/* Page Numbers */}
                {visiblePages.map((page, index) =>
                    page === 'dots' ? (
                        <PaginationItem key={`dots-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <Link href={createPageUrl(page)} legacyBehavior passHref>
                                <PaginationLink isActive={currentPage === page}>
                                    {page}
                                </PaginationLink>
                            </Link>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    {currentPage < totalPages ? (
                        <Link href={createPageUrl(currentPage + 1)} legacyBehavior passHref>
                            <PaginationNext />
                        </Link>
                    ) : (
                        <PaginationNext className="pointer-events-none opacity-50" />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default MoviePagination;
