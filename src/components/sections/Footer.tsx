'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer - Site footer with motion elements
 */
export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer ref={footerRef} className="relative py-12 border-t border-border">
            <div className="container">
                <div ref={contentRef} className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Logo/Name */}
                    <div className="text-center md:text-left">
                        <span className="text-2xl font-bold gradient-text">HK</span>
                        <p className="text-text-muted text-sm mt-2">
                            Building the future, one line at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <nav className="flex justify-center gap-6 text-sm text-text-secondary">
                        <a
                            href="#about"
                            className="hover:text-text-primary transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#skills"
                            className="hover:text-text-primary transition-colors"
                        >
                            Skills
                        </a>
                        <a
                            href="#projects"
                            className="hover:text-text-primary transition-colors"
                        >
                            Projects
                        </a>
                        <a
                            href="#contact"
                            className="hover:text-text-primary transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Back to Top */}
                    <div className="flex justify-center md:justify-end">
                        <MagneticButton
                            onClick={scrollToTop}
                            className="p-3 rounded-full glass hover:border-accent-primary transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-text-secondary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                        </MagneticButton>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-border/50 text-center">
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} Harsh Kumar. All rights reserved.
                    </p>
                    <p className="text-text-muted/60 text-xs mt-2">
                        Built with Next.js, GSAP & 💜
                    </p>
                </div>
            </div>

            {/* Background decorations */}
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent-tertiary/5 rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
}
