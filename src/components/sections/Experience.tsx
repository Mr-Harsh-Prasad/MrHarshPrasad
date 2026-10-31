'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const experiences = [
    {
        title: 'Web Exploit Hunting & Bug Bounty',
        company: 'EDU Skills',
        date: '2025',
        description: 'Learning web security concepts, vulnerability assessment, and participating in bug bounty programs to secure modern web infrastructure.',
        color: '#ccff00'
    },
    {
        title: 'AR/VR Development',
        company: 'Unity Engine',
        date: '2026',
        description: 'Hands-on engineering of Augmented Reality and Virtual Reality spatial computing applications using the Unity framework.',
        color: '#00ffcc'
    },
    {
        title: 'AI in Cyber Security',
        company: 'EDU Skills',
        date: '2026',
        description: 'Comprehensive study of AI-driven cybersecurity, covering machine learning, deep learning, threat detection, incident response, cloud and endpoint security, ethical AI, and future trends in intelligent cyber defense.',
        color: '#88ff00'
    }
];

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const laserRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-animate]');
        items?.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100);
            });
        });
    }, []);

    return (
        <section ref={sectionRef} id="certifications" className="section relative bg-[var(--bg-primary)] overflow-hidden border-b border-white/5">
            {/* Header Text */}
            <div className="relative z-10 text-center mb-10">
                <span data-animate className="text-lime-400 font-mono tracking-widest text-xs uppercase font-semibold">04 // Certifications</span>
                <h2 data-animate className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter mt-4">
                    Technical <span className="text-white/30 italic">Learning</span>
                </h2>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative">

                {/* The Central Wire */}
                <div ref={lineRef} className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 md:-translate-x-1/2" />

                {/* The Laser */}
                <div
                    ref={laserRef}
                    className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-lime-400/0 via-lime-400 to-cyan-400 md:-translate-x-1/2 origin-top scale-y-0 z-0 shadow-[0_0_20px_rgba(204,255,0,0.8)]"
                />

                <div className="relative z-10 flex flex-col gap-12 py-6">
                    {experiences.map((exp, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div key={i} className={`relative flex items-center justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`} data-animate>

                                {/* Center Node */}
                                <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10">
                                    <div className="absolute w-12 h-12 rounded-full pointer-events-none mix-blend-screen" style={{ backgroundColor: exp.color }} />
                                    <div className="relative w-4 h-4 rounded-full border-2 border-white/20 bg-bg-primary z-20 transition-all duration-300" />
                                </div>

                                {/* Content Box */}
                                <div className={`w-full pl-20 md:pl-0 md:w-5/12 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>

                                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tighter leading-tight">{exp.title}</h3>
                                    <div className="text-lime-400 mono text-sm mb-6 tracking-widest uppercase flex items-center gap-2 justify-start md:justify-end">
                                        {!isEven && <span className="w-4 h-[1px] bg-lime-400 block md:hidden" />}
                                        {exp.company}
                                        {isEven && <span className="w-4 h-[1px] bg-lime-400 hidden md:block" />}
                                    </div>
                                    <p className="text-white/50 leading-relaxed text-sm md:text-lg">
                                        {exp.description}
                                    </p>
                                </div>

                                {/* Empty side for spacing on Desktop */}
                                <div className="hidden md:block w-5/12" />
                            </div>
                        );
                    })}
                </div>
            </div>

        </section>
    );
}