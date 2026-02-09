'use client';

import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Fade in immediately with no delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      });
    } else {
      // Fade out smoothly
      setOpacity(0);
      // Remove from DOM after fade out completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Slightly faster fade out
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-3xl transition-opacity duration-300 ease-out"
      style={{ opacity }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-full pointer-events-none flex justify-center">
        <img
          src="https://gist.githubusercontent.com/brudnak/aba00c9a1c92d226f68e8ad8ba1e0a40/raw/nyan-cat.gif"
          alt="Loading..."
          className="h-24 w-auto object-contain mb-2 mr-4"
        />
      </div>
    </div>
  );
}
