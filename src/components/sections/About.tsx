'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const leftContentRef = useRef<HTMLDivElement>(null);
    const rightContentRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(leftContentRef.current,
                { opacity: 0, x: -50 },
                {
                    opacity: 1, x: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    }
                }
            );

            gsap.fromTo(rightContentRef.current,
                { opacity: 0, x: 50 },
                {
                    opacity: 1, x: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    }
                }
            );

            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0,
                    duration: 1,
                    delay: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="relative min-h-[100vh] w-full bg-[#fcfbf9] overflow-hidden flex items-center pt-24 pb-16">
            
            {/* Background Image Setup */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                    src="/taekwondo-bg.png"
                    alt="Harsh Prasad Background"
                    fill
                    className="object-cover object-center opacity-90"
                    priority
                />
            </div>

            {/* Gradient Overlays for Text Legibility (Mimicking the mockup's faded edges) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fcfbf9] via-[#fcfbf9]/90 md:via-[#fcfbf9]/70 to-transparent w-full md:w-[60%] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#fcfbf9] via-[#fcfbf9]/90 md:via-[#fcfbf9]/70 to-transparent w-full md:w-[60%] left-auto right-0 pointer-events-none" />
            
            {/* Soft Warm Top/Bottom blends */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fcfbf9] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#fcfbf9] to-transparent pointer-events-none" />

            {/* Container for Content */}
            <div className="container px-6 md:px-12 mx-auto relative z-10 w-full max-w-[90rem]">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start h-full gap-16 lg:gap-8">
                    
                    {/* LEFT CONTENT */}
                    <div ref={leftContentRef} className="flex flex-col items-start w-full lg:w-5/12 pt-10">
                        
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c9a759] shadow-[0_0_8px_rgba(201,167,89,0.8)] animate-pulse" />
                            <span className="text-[#333] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">Available for work</span>
                        </div>

                        <div className="mb-2">
                            <span className="text-[#555] text-sm md:text-base font-bold tracking-widest uppercase">Hello, I&apos;m</span>
                        </div>

                        <h1 className="flex flex-col leading-[0.85] tracking-tighter mb-6">
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-[#1a1a1a] uppercase drop-shadow-sm">
                                Harsh
                            </span>
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c9a759] to-[#dfc484] uppercase drop-shadow-sm">
                                Prasad
                            </span>
                        </h1>

                        <h2 className="text-[#444] text-sm md:text-base font-bold tracking-[0.25em] uppercase mb-10">
                            Developer <span className="text-[#c9a759] mx-2">•</span> Problem Solver <span className="text-[#c9a759] mx-2">•</span> Fighter
                        </h2>

                        <div className="pl-6 border-l-2 border-[#c9a759] mb-12">
                            <p className="text-5xl font-serif text-[#c9a759] leading-none mb-2 opacity-50">&ldquo;</p>
                            <p className="text-[#333] font-serif text-lg md:text-xl italic font-medium">
                                Discipline today, freedom tomorrow.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
                            <a href="#projects" className="group relative w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#c9a759] to-[#dfc484] text-white text-sm font-bold tracking-widest uppercase shadow-[0_10px_30px_rgba(201,167,89,0.3)] hover:shadow-[0_15px_40px_rgba(201,167,89,0.5)] transition-all duration-300 rounded-sm overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    View My Work 
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                            </a>
                            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-transparent border border-[#333] text-[#333] hover:text-[#c9a759] hover:border-[#c9a759] text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-sm">
                                <span className="flex items-center gap-3">
                                    Download CV
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col items-start lg:items-end w-full lg:w-4/12 pt-10 lg:pt-32 relative z-20">
                        
                        <div ref={rightContentRef} className="flex flex-col items-start w-full max-w-sm">
                            <h3 className="text-[#a58641] text-xs font-bold tracking-[0.2em] uppercase mb-8">
                                I Build Solutions
                            </h3>

                            <ul className="flex flex-col gap-6 mb-16 w-full">
                                <li className="flex items-center gap-4 text-[#333] font-bold text-sm tracking-widest uppercase group">
                                    <span className="w-8 h-8 rounded bg-[#f5f1e8] flex items-center justify-center text-[#c9a759] group-hover:bg-[#c9a759] group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                    </span>
                                    Web Development
                                </li>
                                <li className="flex items-center gap-4 text-[#333] font-bold text-sm tracking-widest uppercase group">
                                    <span className="w-8 h-8 rounded bg-[#f5f1e8] flex items-center justify-center text-[#c9a759] group-hover:bg-[#c9a759] group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    Cyber Security
                                </li>
                                <li className="flex items-center gap-4 text-[#333] font-bold text-sm tracking-widest uppercase group">
                                    <span className="w-8 h-8 rounded bg-[#f5f1e8] flex items-center justify-center text-[#c9a759] group-hover:bg-[#c9a759] group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                                    </span>
                                    UI/UX Design
                                </li>
                                <li className="flex items-center gap-4 text-[#333] font-bold text-sm tracking-widest uppercase group">
                                    <span className="w-8 h-8 rounded bg-[#f5f1e8] flex items-center justify-center text-[#c9a759] group-hover:bg-[#c9a759] group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    </span>
                                    Problem Solving
                                </li>
                            </ul>

                            <div className="mb-16">
                                <h3 className="text-[#a58641] text-xs font-bold tracking-[0.2em] uppercase mb-3">
                                    Let&apos;s Create
                                </h3>
                                <div className="text-[#1a1a1a] font-black text-xl md:text-2xl tracking-wide border-b-2 border-[#c9a759] pb-1 inline-block uppercase">
                                    Something Impactful.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM STATS */}
                <div ref={statsRef} className="mt-16 lg:-mt-12 flex flex-row flex-wrap lg:justify-end gap-10 lg:gap-16 w-full relative z-30 lg:pr-10">
                    <div className="flex flex-col items-start">
                        <span className="text-[#c9a759] mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        </span>
                        <span className="text-[#1a1a1a] text-3xl font-black mb-1">10+</span>
                        <span className="text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase max-w-[80px]">Projects Completed</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[#c9a759] mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </span>
                        <span className="text-[#1a1a1a] text-3xl font-black mb-1">15+</span>
                        <span className="text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase max-w-[80px]">CTF Solved</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[#c9a759] mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </span>
                        <span className="text-[#1a1a1a] text-3xl font-black mb-1">5+</span>
                        <span className="text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase max-w-[80px]">Bug Bounty Reports</span>
                    </div>
                </div>

            </div>
            
            {/* Transition to next dark section */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none z-20" />
        </section>
    );
}
