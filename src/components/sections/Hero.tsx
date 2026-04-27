'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';
import GlitchText from '@/components/ui/GlitchText';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef    = useRef<HTMLElement>(null);
    const greetRef      = useRef<HTMLSpanElement>(null);
    const nameRef       = useRef<HTMLSpanElement>(null);
    const tagRef        = useRef<HTMLDivElement>(null);
    const ctaRef        = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Entrance */
            const tl = gsap.timeline({ delay: 0.3 });
            gsap.set([greetRef.current, nameRef.current, tagRef.current, ctaRef.current], {
                opacity: 0, y: 80,
            });
            tl.to(greetRef.current, { opacity: 1, y: 0, duration: 1,   ease: 'expo.out' })
              .to(nameRef.current,  { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, '-=0.7')
              .to(tagRef.current,   { opacity: 1, y: 0, duration: 1,   ease: 'expo.out' }, '-=0.8')
              .to(ctaRef.current,   { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6')
              .to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, '-=0.2');

            const section = sectionRef.current;

            /* Text parallax on scroll */
            gsap.fromTo(
                [nameRef.current, tagRef.current],
                { y: 0, opacity: 1 },
                {
                    y: -120, opacity: 0, ease: 'none',
                    scrollTrigger: {
                        trigger: section, start: 'top top', end: '60% top', scrub: 0.5,
                    },
                }
            );

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
            className="relative min-h-screen flex items-end justify-start overflow-hidden"
        >
            {/* Dark gradient background — deep black with subtle red glow */}
            <div className="absolute inset-0 bg-[#050505]" />
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(230,57,70,0.08) 0%, transparent 70%)' }}
            />
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 80%, rgba(255,183,3,0.04) 0%, transparent 70%)' }}
            />

            {/* Bottom blend into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />

            {/* Content */}
            <div className="relative z-10 container px-4 pb-24 md:pb-32 text-left max-w-6xl mx-auto">

                <span
                    ref={greetRef}
                    className="block font-mono text-xs md:text-sm tracking-[0.4em] text-[#e63946] uppercase mb-6 opacity-0"
                >
                    // Hello, I&apos;m
                </span>

                <span ref={nameRef} className="block hero-name opacity-0 leading-none">
                    MR HARSH
                    <br />
                    <GlitchText />
                </span>

                <div ref={tagRef} className="mt-8 opacity-0 flex flex-col gap-3 max-w-2xl">
                    <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed">
                        <span className="text-[#e63946] font-semibold">1st Dan Black Belt</span>
                        {' '}· Computer Science · Builder
                    </p>
                    <p className="text-white/40 text-sm md:text-base font-mono italic">
                        &ldquo;Once known for words, now known for silence and execution.&rdquo;
                    </p>
                </div>

                <div ref={ctaRef} className="mt-10 opacity-0 flex flex-col sm:flex-row gap-4">
                    <MagneticButton href="#projects" className="btn-primary">
                        <span>View My Work</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </MagneticButton>
                    <MagneticButton href="#contact" className="btn-ghost">
                        <span>Get in Touch</span>
                    </MagneticButton>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollHintRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 z-10"
            >
                <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-mono">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-[#e63946] to-transparent animate-pulse" />
            </div>
        </section>
    );
}
