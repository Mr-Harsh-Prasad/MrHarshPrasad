'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer — clean, branded, minimal, with interactive signature glow.
 */
export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Spotlight interaction
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

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
        <footer 
            ref={footerRef} 
            className="relative pt-16 pb-8 overflow-hidden"
        >
            {/* Interactive Spotlight Container */}
            <div 
                ref={containerRef}
                className="absolute inset-0 z-0"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Spotlight that follows cursor */}
                <motion.div
                    className="absolute pointer-events-none mix-blend-screen"
                    style={{
                        left: smoothX,
                        top: smoothY,
                        x: '-50%',
                        y: '-50%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle closest-side, rgba(230, 57, 70, 0.15), transparent)',
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* glow top line */}
            <div
                ref={lineRef}
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946] to-transparent origin-left z-10"
            />

            <div className="container relative z-10 pointer-events-none">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

                    {/* Brand */}
                    <div className="pointer-events-auto group">
                        <button
                            onClick={scrollToTop}
                            className="text-4xl font-black gradient-text tracking-tight relative overflow-hidden"
                            aria-label="Back to top"
                        >
                            <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 inline-block">MHP.</span>
                            {/* Signature shine on hover */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                        </button>
                        <p className="text-text-muted text-xs mono mt-2 tracking-widest transition-colors duration-300 group-hover:text-accent-primary">
                            // HARSH PRASAD — PORTFOLIO
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-wrap gap-6 text-sm text-text-muted pointer-events-auto">
                        {['about', 'skills', 'projects', 'contact'].map((id) => (
                            <a
                                key={id}
                                href={`#${id}`}
                                className="hover:text-text-primary hover:glow-text transition-all uppercase tracking-widest text-xs mono"
                            >
                                {id}
                            </a>
                        ))}
                    </nav>

                    {/* Back to top arrow */}
                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all duration-300 pointer-events-auto hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(230,57,70,0.3)]"
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

            {/* Static bg orbs */}
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#e63946] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#ffb703] opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />
            
            <style jsx global>{`
                .glow-text {
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </footer>
    );
}
