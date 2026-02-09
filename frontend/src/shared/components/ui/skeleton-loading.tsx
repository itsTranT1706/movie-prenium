'use client';

import React from 'react';

interface SkeletonLoadingProps {
  isVisible: boolean;
  itemCount?: number;
}

export function SkeletonLoading({ isVisible, itemCount = 12 }: SkeletonLoadingProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#141414] animate-fadeIn">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Skeleton header */}
        <div className="h-8 w-48 bg-gray-800 rounded animate-shimmer mb-8" />
        
        {/* Skeleton grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {[...Array(itemCount)].map((_, i) => (
            <div 
              key={i} 
              className="animate-fadeInStagger" 
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="aspect-video bg-gray-800 rounded-sm animate-shimmer" />
              <div className="mt-2 h-4 w-3/4 bg-gray-800 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes fadeInStagger {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shimmer { 
          background: linear-gradient(90deg, #1f1f1f 0%, #2f2f2f 50%, #1f1f1f 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .animate-fadeInStagger { 
          animation: fadeInStagger 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
