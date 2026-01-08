'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP Animation Hooks and Utilities
 * Reusable hooks for common animation patterns
 */

// Fade up animation on scroll
export function useFadeUpOnScroll(options?: { delay?: number; duration?: number }) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 60,
            },
            {
                opacity: 1,
                y: 0,
                duration: options?.duration || 1,
                delay: options?.delay || 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [options?.delay, options?.duration]);

    return elementRef;
}

// Text reveal animation (word by word)
export function useTextReveal() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const words = container.querySelectorAll('.word');

        gsap.fromTo(
            words,
            {
                opacity: 0,
                y: 50,
                rotateX: -90,
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return containerRef;
}

// Staggered children animation
export function useStaggerChildren(options?: { stagger?: number; delay?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const children = container.children;

        gsap.fromTo(
            children,
            {
                opacity: 0,
                y: 40,
                scale: 0.95,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: options?.stagger || 0.1,
                delay: options?.delay || 0,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [options?.stagger, options?.delay]);

    return containerRef;
}

// Parallax effect hook
export function useParallax(speed: number = 0.5) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.to(element, {
            y: () => -ScrollTrigger.maxScroll(window) * speed * 0.1,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [speed]);

    return elementRef;
}

// Horizontal scroll animation
export function useHorizontalScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollContent = container.querySelector('.scroll-content') as HTMLElement;
        if (!scrollContent) return;

        const scrollWidth = scrollContent.scrollWidth - container.offsetWidth;

        gsap.to(scrollContent, {
            x: -scrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: () => `+=${scrollWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return containerRef;
}

// Counter animation (for stats/numbers)
export function useCounterAnimation(endValue: number, duration: number = 2) {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const obj = { value: 0 };

        gsap.to(obj, {
            value: endValue,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
                element.textContent = Math.round(obj.value).toString();
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [endValue, duration]);

    return elementRef;
}

// Split text into words for animation
export function splitTextIntoWords(text: string): string {
    return text
        .split(' ')
        .map((word) => `<span class="word inline-block">${word}</span>`)
        .join(' ');
}
