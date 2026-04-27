'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer — clean, branded, minimal.
 */
export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                footerRef.current,
                { opacity: 0 },
                {
                    opacity: 1, duration: 1, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 95%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
            // animated border line
            gsap.fromTo(lineRef.current, { scaleX: 0 }, {
                scaleX: 1, duration: 1.5, ease: 'expo.out',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 90%',
                },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer ref={footerRef} className="relative pt-16 pb-8 overflow-hidden">
            {/* glow top line */}
            <div
                ref={lineRef}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946] to-transparent origin-left"
            />

            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

                    {/* Brand */}
                    <div>
                        <button
                            onClick={scrollToTop}
                            className="text-4xl font-black gradient-text tracking-tight hover:opacity-80 transition-opacity"
                            aria-label="Back to top"
                        >
                            MHP.
                        </button>
                        <p className="text-text-muted text-xs mono mt-2 tracking-widest">
                            // HARSH PRASAD — PORTFOLIO
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-6 text-sm text-text-muted">
                        {['about', 'skills', 'projects', 'contact'].map((id) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className="hover:text-text-primary transition-colors uppercase tracking-widest text-xs mono"
                            >
                                {id}
                            </a>
                        ))}
                    </nav>

                    {/* Back to top arrow */}
                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all duration-300"
                        aria-label="Scroll to top"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-text-muted text-xs mono">
                        © {new Date().getFullYear()} Mr Harsh Prasad. All rights reserved.
                    </p>
                    <p className="text-text-muted/50 text-xs mono">
                        Built with 🩷 AB
                    </p>
                </div>
            </div>

            {/* bg orbs */}
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#e63946] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#ffb703] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
}
