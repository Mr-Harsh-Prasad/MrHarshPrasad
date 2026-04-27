'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiquidGlassButton from '@/components/ui/LiquidGlassButton';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const uiRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);
    const maskLayerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const mask = maskLayerRef.current;

            if (mask && section) {
                const rect = section.getBoundingClientRect();
                
                // Initialize hidden
                gsap.set(mask, { clipPath: `circle(0px at ${rect.width/2}px ${rect.height/2}px)` });
                
                // Reveal intro animation
                gsap.to(mask, {
                    clipPath: `circle(200px at ${rect.width/2}px ${rect.height/2}px)`,
                    duration: 2.5,
                    ease: "power3.inOut",
                    delay: 0.5
                });

                const onMouseMove = (e: MouseEvent) => {
                    const r = section.getBoundingClientRect();
                    const x = e.clientX - r.left;
                    const y = e.clientY - r.top;
                    
                    gsap.to(mask, {
                        clipPath: `circle(300px at ${x}px ${y}px)`,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                };

                const onMouseLeave = () => {
                    const r = section.getBoundingClientRect();
                    gsap.to(mask, {
                        clipPath: `circle(0px at ${r.width/2}px ${r.height/2}px)`,
                        duration: 1.5,
                        ease: "power3.out"
                    });
                };

                section.addEventListener('mousemove', onMouseMove);
                section.addEventListener('mouseleave', onMouseLeave);

                return () => {
                    section.removeEventListener('mousemove', onMouseMove);
                    section.removeEventListener('mouseleave', onMouseLeave);
                };
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

    const MassiveText = ({ className }: { className?: string }) => (
        <h1 className={`text-[12vw] leading-none font-black tracking-tighter select-none whitespace-nowrap text-center ${className}`}>
            MR. HARSH<br />PRASAD
        </h1>
    );

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] cursor-none"
        >
            {/* BASE LAYER (Dark stealth mode) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <MassiveText className="text-white/[0.03]" />
            </div>

            {/* MASK REVEAL LAYER */}
            <div 
                ref={maskLayerRef}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 50%, #f093fb 100%)',
                    backgroundSize: '400% 400%',
                    animation: 'fluid-rainbow 8s ease-in-out infinite',
                }}
            >
                <MassiveText className="text-[#050505]" />
            </div>

            {/* Bottom blend into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />

            {/* Overlay Content */}
            <div ref={uiRef} className="relative z-30 container px-4 pb-24 md:pb-32 text-left max-w-6xl mx-auto pointer-events-none self-end h-full flex flex-col justify-end">
                <div className="mt-8 flex flex-col gap-3 max-w-2xl pointer-events-auto">
                    <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
                        <span className="text-cyan-400 font-semibold tracking-wide">1st Dan Black Belt</span>
                        {' '}· Computer Science · Builder
                    </p>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-6 pointer-events-auto">
                    <LiquidGlassButton href="#projects">
                        <span>View My Work</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </LiquidGlassButton>
                    <LiquidGlassButton href="#contact" className="!bg-transparent border-white/10 hover:border-purple-500/50 mix-blend-difference">
                        <span>Get in Touch</span>
                    </LiquidGlassButton>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollHintRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none mix-blend-difference"
            >
                <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-mono">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
            </div>
        </section>
    );
}
