'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
    children: ReactNode;
}

/**
 * SmoothScroll - Lenis smooth scroll properly connected to GSAP ScrollTrigger.
 * Without this connection, GSAP scrub animations don't reverse correctly on scroll-up.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // ── KEY FIX: tell ScrollTrigger to update whenever Lenis scrolls ──
        lenis.on('scroll', ScrollTrigger.update);

        // ── KEY FIX: drive Lenis from GSAP's ticker so they share the same frame ──
        const tickerFn = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerFn);

        // Disable GSAP's own lag smoothing (Lenis handles this)
        gsap.ticker.lagSmoothing(0);

        // Expose for global access
        (window as Window & { lenis?: Lenis }).lenis = lenis;

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerFn);
        };
    }, []);

    return <>{children}</>;
}
