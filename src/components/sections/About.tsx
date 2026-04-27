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

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo(headRef.current,
                { opacity: 0, x: -60 },
                { opacity: 1, x: 0, duration: 1, ease: 'expo.out' }
            )
            .fromTo(imgRef.current,
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out' },
                '-=0.7'
            )
            .fromTo(bodyRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
                '-=0.8'
            )
            .fromTo(statsRef.current?.children ?? [],
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'expo.out' },
                '-=0.6'
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="section">
            <div className="container">

                {/* Headline */}
                <div ref={headRef} className="mb-16 max-w-3xl">
                    <span className="section-subtitle">About Me</span>
                    <h2 className="section-title text-text-primary">
                        Discipline<br />
                        <span className="gradient-text">Meets Tech.</span>
                    </h2>
                </div>

                {/* Grid: photo left, content right */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Photo */}
                    <div ref={imgRef} className="relative">
                        <div className="relative aspect-[3/4] max-w-sm overflow-hidden rounded-2xl">
                            <Image
                                src="/mrharshprasad.png"
                                alt="Harsh Prasad — Computer Science & Taekwondo Black Belt"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="object-cover object-top"
                            />
                            {/* red accent line */}
                            <div className="absolute inset-y-0 -right-2 w-0.5 bg-gradient-to-b from-transparent via-[#e63946] to-transparent" />
                        </div>
                        {/* location tag */}
                        <div className="absolute -bottom-4 left-4 bg-bg-tertiary border border-border px-4 py-2 rounded-lg mono text-xs text-text-muted">
                            // Ghaziabad, India 🇮🇳
                        </div>
                    </div>

                    {/* Text + stats */}
                    <div ref={bodyRef} className="space-y-8">
                        <div className="space-y-5 text-text-secondary leading-relaxed">
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
                            <blockquote className="border-l-2 border-[#e63946] pl-5 italic text-text-muted text-sm">
                                &ldquo;Once known for words, now known for silence and execution.&rdquo;
                            </blockquote>
                        </div>

                        {/* Stats */}
                        <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                            {stats.map((s) => (
                                <div key={s.number} className="flex flex-col gap-1">
                                    <span className="font-mono text-3xl font-bold text-[#e63946] leading-none">{s.number}</span>
                                    <span className="text-text-primary font-semibold text-sm">{s.label}</span>
                                    <span className="text-text-muted text-xs">{s.sub}</span>
                                </div>
                            ))}
                        </div>

                        <p className="mono text-xs text-text-muted tracking-widest">
                            // Technical Head · GeeksforGeeks Cloud Computing Club
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#e63946] opacity-[0.04] blur-[120px] pointer-events-none" />
        </section>
    );
}
