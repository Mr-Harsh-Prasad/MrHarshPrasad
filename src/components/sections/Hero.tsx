'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const centerColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);
    const portraitLightRef = useRef<HTMLDivElement>(null);
    const backdropGlowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=400', // Pin for 400px of scrolling to reveal lights
                    scrub: 1, // Smooth scrub
                    pin: true,
                }
            });

            // Initial State (The Void)
            gsap.set([leftColRef.current, rightColRef.current], { opacity: 0, y: 30 });
            gsap.set(portraitLightRef.current, { opacity: 0.3, filter: 'brightness(0.3)' });
            gsap.set(backdropGlowRef.current, { opacity: 0, scale: 0.5 });

            // Scroll Animation: "Turning on the lights"
            tl.to(portraitLightRef.current, { opacity: 1, filter: 'brightness(1)', duration: 2, ease: 'power2.inOut' })
              .to(backdropGlowRef.current, { opacity: 1, scale: 1, duration: 2, ease: 'power2.inOut' }, "<")
              .to(leftColRef.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, "-=1")
              .to(rightColRef.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, "<");

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020202] pt-24 pb-12"
        >
            <div className="container px-4 sm:px-6 mx-auto relative z-10 w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: Introduction */}
                    <div ref={leftColRef} className="lg:col-span-4 flex flex-col items-start gap-4 order-2 lg:order-1 mt-8 lg:mt-0">
                        <span className="text-white font-semibold tracking-wide">Hey There</span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight">
                            I&apos;m Harsh<br />Prasad
                        </h1>
                        <h2 className="text-[#e63946] text-lg font-mono font-medium mt-1">
                            --Computer Science & Builder
                        </h2>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed mt-4 max-w-sm">
                            Experienced developer with a relentless obsession for fundamentals, high-performance architecture, and shipping robust software.
                        </p>
                        <a 
                            href="#contact" 
                            className="mt-6 inline-block bg-[#e63946] text-white font-semibold px-8 py-3.5 rounded hover:bg-white hover:text-[#e63946] transition-colors duration-300 shadow-[0_0_20px_rgba(230,57,70,0.4)]"
                        >
                            Get In Touch
                        </a>
                    </div>

                    {/* CENTER COLUMN: Portrait */}
                    <div ref={centerColRef} className="lg:col-span-4 flex justify-center relative order-1 lg:order-2">
                        {/* Cinematic Backdrop Glow */}
                        <div ref={backdropGlowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[120px] rounded-full pointer-events-none" />
                        
                        <div ref={portraitLightRef} className="relative w-full max-w-[380px] aspect-[3/4] overflow-hidden group rounded-2xl">
                            <Image
                                src="/hero-dark.jpg"
                                alt="Harsh Prasad"
                                fill
                                priority
                                className="object-cover object-top transition-all duration-700"
                            />
                            {/* "Laptop" Under-glow mimicking the reference image */}
                            <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#e63946]/40 via-[#e63946]/5 to-transparent mix-blend-screen opacity-90" />
                            {/* Deep dark vignette to blend edges */}
                            <div className="absolute inset-0 shadow-[inset_0_-120px_100px_-50px_#020202]" />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Stats */}
                    <div ref={rightColRef} className="lg:col-span-4 flex flex-col gap-12 items-center lg:items-end text-center lg:text-right order-3 mt-8 lg:mt-0">
                        
                        <div className="flex flex-col items-center lg:items-end group">
                            <div className="text-5xl md:text-7xl font-bold text-white flex items-center gap-1 font-serif">
                                1st <span className="text-[#e63946] font-sans font-light">+</span>
                            </div>
                            <span className="text-white/60 text-sm tracking-wide mt-2">Dan Black Belt</span>
                        </div>

                    </div>

                </div>
            </div>
            
            {/* Bottom gradient fade into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none z-20" />
        </section>
    );
}
