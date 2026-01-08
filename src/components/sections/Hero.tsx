'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/ui/MagneticButton';

// Dynamically import 3D component to avoid SSR issues
const HeroBackground = dynamic(() => import('@/components/3d/HeroBackground'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-bg-primary" />,
});

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section - Full viewport intro with animated text and 3D background
 */
export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial state
            gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
                opacity: 0,
                y: 50,
            });
            gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -20 });

            // Entrance animation timeline
            const tl = gsap.timeline({ delay: 0.5 });

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
            })
                .to(
                    subtitleRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    },
                    '-=0.5'
                )
                .to(
                    ctaRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    },
                    '-=0.4'
                )
                .to(
                    scrollIndicatorRef.current,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power3.out',
                    },
                    '-=0.2'
                );

            // Scroll-triggered parallax for title
            gsap.to(titleRef.current, {
                y: -100,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* 3D Background */}
            <HeroBackground />

            {/* Content */}
            <div className="container relative z-10 text-center px-4">
                {/* Greeting & Name */}
                <h1 ref={titleRef} className="mb-6">
                    <span className="block text-text-secondary text-lg md:text-xl font-medium mb-4 tracking-widest uppercase">
                        Hello, I&apos;m
                    </span>
                    <span className="block gradient-text text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                        Harsh Kumar
                    </span>
                    <span className="block text-text-primary text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
                        B.Tech CSE Student
                    </span>
                </h1>

                {/* Tagline */}
                <p
                    ref={subtitleRef}
                    className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
                >
                    <span className="text-accent-primary">Cybersecurity Enthusiast</span> &bull;{' '}
                    <span className="text-accent-secondary">Web Developer</span>
                    <br />
                    <em className="text-text-muted">
                        &quot;Turning ideas into secure, beautiful digital experiences.&quot;
                    </em>
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <MagneticButton href="#projects" className="btn-primary">
                        <span>View My Work</span>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </MagneticButton>
                    <MagneticButton href="#contact" className="btn-secondary">
                        <span>Get in Touch</span>
                    </MagneticButton>
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
            >
                <span className="text-sm tracking-widest uppercase">Scroll</span>
                <div className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-text-muted rounded-full animate-bounce" />
                </div>
            </div>

            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-tertiary/20 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
}
