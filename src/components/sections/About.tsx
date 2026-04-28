'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Bento Card Component
const BentoCard = ({ children, className = '', delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const glow = glowRef.current;
        if (!card || !glow) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update glow position
            gsap.to(glow, {
                x, y,
                duration: 0.4,
                ease: "power2.out"
            });

            // Calculate 3D tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            gsap.to(card, {
                rotateX,
                rotateY,
                duration: 0.5,
                ease: "power2.out",
                transformPerspective: 1000
            });
        };

        const onMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.7,
                ease: "power3.out"
            });
            gsap.to(glow, {
                opacity: 0,
                duration: 0.5
            });
        };

        const onMouseEnter = () => {
            gsap.to(glow, {
                opacity: 1,
                duration: 0.5
            });
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
        card.addEventListener('mouseenter', onMouseEnter);

        return () => {
            card.removeEventListener('mousemove', onMouseMove);
            card.removeEventListener('mouseleave', onMouseLeave);
            card.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    return (
        <div 
            ref={cardRef} 
            className={`bento-card group relative rounded-3xl border border-white/5 bg-white/[0.015] overflow-hidden backdrop-blur-xl transition-colors duration-500 hover:border-white/10 ${className}`}
            style={{ opacity: 0, transform: 'translateY(40px)' }} // For scroll-trigger entry
            data-delay={delay}
        >
            {/* The cursor-following glow */}
            <div 
                ref={glowRef}
                className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 mix-blend-screen"
            />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // Kinetic Typography Scrub
            if (marqueeRef.current) {
                gsap.to(marqueeRef.current, {
                    x: '-25%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });
            }

            // Staggered entry for Bento Cards
            const cards = gsap.utils.toArray('.bento-card') as HTMLElement[];
            cards.forEach((card) => {
                const delay = card.getAttribute('data-delay') || 0;
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    delay: Number(delay),
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                });
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="relative py-16 lg:py-24 bg-[#020202] overflow-hidden flex flex-col justify-center">
            
            {/* Kinetic Typography Background */}
            <div className="absolute top-1/3 left-0 w-[200vw] -translate-y-1/2 pointer-events-none z-0 opacity-10 mix-blend-overlay">
                <div ref={marqueeRef} className="text-[18vw] font-black leading-none whitespace-nowrap text-transparent tracking-tight" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}>
                    DISCIPLINE • EXECUTION • DISCIPLINE • EXECUTION • 
                </div>
            </div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-6xl">
                
                <div className="mb-12 lg:mb-16">
                    <span className="text-[#e63946] font-mono tracking-widest text-xs uppercase font-semibold">01 // About Me</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mt-3">
                        Beyond the <span className="text-white/40 italic">Code.</span>
                    </h2>
                </div>

                {/* The Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                    
                    {/* Box 1: Portrait (Spans 2 columns, 2 rows) */}
                    <BentoCard className="md:col-span-2 md:row-span-2" delay={0}>
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src="/about-pic.webp"
                                alt="Harsh Prasad"
                                fill
                                className="object-cover object-center transition-transform duration-[15s] group-hover:scale-110 ease-out transition-all duration-700"
                            />
                            {/* Inner vignette for depth */}
                            <div className="absolute inset-0 shadow-[inset_0_-100px_100px_-20px_#020202]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            
                            <div className="absolute bottom-8 left-8">
                                <div className="text-white text-2xl font-serif font-bold">Harsh Prasad</div>
                                <div className="text-white/60 text-sm mono mt-1">Computer Science Student</div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Box 2: Bio (Spans 2 columns, 2 rows) */}
                    <BentoCard className="md:col-span-2 md:row-span-2 p-8 md:p-12 flex flex-col justify-center" delay={0.1}>
                        <h3 className="text-xl md:text-3xl font-bold text-white mb-6">The Philosophy</h3>
                        <p className="text-white/60 leading-relaxed text-base md:text-lg">
                            I believe the best architecture is written with the mindset of a martial artist: 
                            <span className="text-white font-medium mx-1 border-b border-[#e63946]/50">slow, deliberate practice</span> 
                            combined with 
                            <span className="text-white font-medium mx-1 border-b border-[#e63946]/50">fast, decisive execution</span>.
                            Discipline isn&apos;t optional—it&apos;s the foundation of everything I build.
                        </p>
                    </BentoCard>

                </div>
            </div>
            
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[#e63946] opacity-[0.02] blur-[150px] pointer-events-none mix-blend-screen -translate-y-1/2" />
        </section>
    );
}
