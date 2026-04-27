'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene3D from '@/components/3d/Scene3D';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const uiRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;

            // Animate text on load
            if (textRef.current) {
                gsap.fromTo(textRef.current,
                    { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
                    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out', delay: 0.5 }
                );
            }

            /* UI parallax on scroll */
            if (uiRef.current) {
                gsap.fromTo(
                    uiRef.current,
                    { y: 0, opacity: 1 },
                    {
                        y: -150, opacity: 0, ease: 'none',
                        scrollTrigger: {
                            trigger: section, start: 'top top', end: '60% top', scrub: 0.5,
                        },
                    }
                );
            }

            /* Scroll hint fade */
            if (scrollHintRef.current) {
                gsap.fromTo(scrollHintRef.current,
                    { opacity: 1, y: 0 },
                    {
                        opacity: 0, y: -20, ease: 'none',
                        scrollTrigger: {
                            trigger: section, start: 'top top', end: '15% top', scrub: true,
                        },
                    }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen w-full flex items-end justify-start overflow-hidden bg-[#020202]"
        >
            {/* 3D Cinematic Environment */}
            <Scene3D isHovering={isHovering} />

            {/* Centered Hero Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <h1
                    ref={textRef}
                    className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter gradient-text drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] pointer-events-auto transition-all duration-300 hover:scale-[1.02] hover:drop-shadow-[0_0_50px_rgba(0,255,255,0.6)] cursor-default select-none mix-blend-screen"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                        animation: 'float 6s ease-in-out infinite'
                    }}
                >
                    MR. HARSH PRASAD
                </h1>
            </div>

            {/* Bottom blend into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none z-10" />

            {/* Overlay Content */}
            <div ref={uiRef} className="relative z-20 container px-4 pb-24 md:pb-32 text-left max-w-6xl mx-auto pointer-events-none">

                <div className="mt-8 flex flex-col gap-3 max-w-2xl pointer-events-auto">
                    <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
                        <span className="text-cyan-400 font-semibold tracking-wide">1st Dan Black Belt</span>
                        {' '}· Computer Science · Builder
                    </p>
                    <p className="text-white/50 text-sm md:text-base font-mono italic">
                        &ldquo;Once known for words, now known for silence and execution.&rdquo;
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-6 pointer-events-auto">
                    <LiquidGlassButton href="#projects">
                        <span>View My Work</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </LiquidGlassButton>
                    <LiquidGlassButton href="#contact" className="!bg-transparent border-white/10 hover:border-purple-500/50">
                        <span>Get in Touch</span>
                    </LiquidGlassButton>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollHintRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
            >
                <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-mono">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}} />
        </section>
    );
}
