'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
    children: ReactNode;
}

/**
 * SmoothScroll - Wrapper for smooth scrolling using Lenis
 * Provides butter-smooth scrolling experience with customizable options
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // Animation frame loop for Lenis
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Expose lenis to window for global access (useful for ScrollTrigger integration)
        (window as Window & { lenis?: Lenis }).lenis = lenis;

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
