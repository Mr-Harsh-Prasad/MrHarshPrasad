'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { number: '01', label: 'Black Belt', sub: '1st Dan Taekwondo' },
    { number: '02', label: 'Hackathon Win', sub: 'MLH Gemini Buildathon' },
    { number: '03', label: 'B.Tech CSE', sub: 'AKTU — Class of 2028' },
];

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const headRef    = useRef<HTMLDivElement>(null);
    const imgRef     = useRef<HTMLDivElement>(null);
    const bodyRef    = useRef<HTMLDivElement>(null);
    const statsRef   = useRef<HTMLDivElement>(null);

    // Helper to split text into words for staggered animation
    const splitText = (text: string) => {
        return text.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-bottom">
                <span className="word-anim inline-block">{word}</span>
            </span>
        ));
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });

            // Head text reveal
            tl.fromTo(headRef.current?.querySelectorAll('.word-anim') ?? [],
                { y: '100%', opacity: 0 },
                { y: '0%', opacity: 1, duration: 1, stagger: 0.05, ease: 'expo.out' }
            )
            // Image reveal
            .fromTo(imgRef.current,
                { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' },
                '-=0.8'
            )
            // Body paragraphs reveal
            .fromTo(bodyRef.current?.children ?? [],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: 'expo.out' },
                '-=1.2'
            )
            // Stats reveal
            .fromTo(statsRef.current?.children ?? [],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'expo.out' },
                '-=0.8'
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="section">
            <div className="container">

                {/* Headline */}
                <div ref={headRef} className="mb-16 max-w-3xl">
                    <span className="section-subtitle overflow-hidden block">
                        <span className="word-anim block">About Me</span>
                    </span>
                    <h2 className="section-title text-text-primary leading-[1.1] mt-2">
                        {splitText('Discipline')}
                        <br />
                        <span className="gradient-text">{splitText('Meets Tech.')}</span>
                    </h2>
                </div>

                {/* Grid: photo left, content right */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Photo with cinematic hover */}
                    <div ref={imgRef} className="relative group perspective-1000">
                        <div className="relative aspect-[3/4] max-w-sm overflow-hidden rounded-2xl border border-white/5 transition-all duration-700 ease-out group-hover:shadow-[0_0_40px_rgba(230,57,70,0.2)]">
                            {/* Inner zoom container */}
                            <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
                                <Image
                                    src="/about-pic.webp"
                                    alt="Harsh Prasad — Computer Science & Taekwondo Black Belt"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    className="object-cover object-top transition-all duration-700 group-hover:brightness-110 group-hover:contrast-125"
                                />
                            </div>
                            
                            {/* Dynamic lighting overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 opacity-50 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100" />
                            
                            {/* Highlight reflection */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shimmer" />

                            {/* Red accent line */}
                            <div className="absolute inset-y-0 -right-2 w-0.5 bg-gradient-to-b from-transparent via-[#e63946] to-transparent" />
                        </div>
                        
                        {/* Location tag */}
                        <div className="absolute -bottom-4 left-4 bg-bg-tertiary/90 backdrop-blur-md border border-border px-4 py-2 rounded-lg mono text-xs text-text-muted transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-lg">
                            // Ghaziabad, India 🇮🇳
                        </div>
                    </div>

                    {/* Text + stats */}
                    <div ref={bodyRef} className="space-y-8">
                        <div className="space-y-5 text-text-secondary leading-relaxed text-lg">
                            <p>
                                I&apos;m <strong className="text-text-primary font-semibold">Harsh Prasad</strong> — a Computer Science
                                undergraduate who believes the best code is written with the same mindset as a black belt:
                                slow deliberate practice, fast decisive execution.
                            </p>
                            <p>
                                Training in <span className="text-[#e63946] font-medium">Taekwondo for years</span> taught me
                                that discipline isn&apos;t optional — it&apos;s the foundation. I bring that same obsession
                                with fundamentals to every line of software I write.
                            </p>

                        </div>

                        {/* Stats */}
                        <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                            {stats.map((s) => (
                                <div key={s.number} className="flex flex-col gap-1 group/stat cursor-default">
                                    <span className="font-mono text-4xl font-bold text-[#e63946] leading-none transition-transform duration-300 group-hover/stat:-translate-y-1 group-hover/stat:text-accent-secondary">{s.number}</span>
                                    <span className="text-text-primary font-semibold text-sm transition-colors duration-300 group-hover/stat:text-white">{s.label}</span>
                                    <span className="text-text-muted text-xs">{s.sub}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mono text-xs text-text-muted tracking-widest uppercase">
                            // Technical Head · GeeksforGeeks Cloud Computing Club
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#e63946] opacity-[0.03] blur-[150px] pointer-events-none mix-blend-screen" />
        </section>
    );
}
