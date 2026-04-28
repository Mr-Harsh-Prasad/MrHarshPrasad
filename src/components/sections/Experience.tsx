'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        title: 'Web Exploit Hunting & Bug Bounty',
        company: 'EDU Skills',
        date: '2023 - Present',
        description: 'Learning web security concepts, vulnerability assessment, and participating in bug bounty programs to secure modern web infrastructure.',
        color: '#e63946'
    },
    {
        title: 'AR/VR Development',
        company: 'Unity Engine',
        date: '2022 - 2023',
        description: 'Hands-on engineering of Augmented Reality and Virtual Reality spatial computing applications using the Unity framework.',
        color: '#00ffff'
    }
];

export default function Experience() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const laserRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Laser scrub animation
            if (lineRef.current && laserRef.current) {
                gsap.to(laserRef.current, {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: lineRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.5,
                    }
                });
            }

            // Node intersection animations
            const nodes = gsap.utils.toArray('.timeline-node') as HTMLElement[];
            nodes.forEach((node, i) => {
                const glow = node.querySelector('.node-glow');
                const content = node.querySelector('.node-content');
                const isEven = i % 2 === 0;
                
                // Content slides in when laser reaches it
                gsap.fromTo(content, 
                    { opacity: 0, x: isEven ? 50 : -50 },
                    { 
                        opacity: 1, x: 0, duration: 1, ease: "power3.out",
                        scrollTrigger: {
                            trigger: node,
                            start: "top center",
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                // Glow erupts
                gsap.fromTo(glow,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 2.5, opacity: 0.4, duration: 1.5, ease: "expo.out",
                        scrollTrigger: {
                            trigger: node,
                            start: "top center",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
                
                // Dot lights up instantly
                const dot = node.querySelector('.node-dot');
                gsap.to(dot, {
                    backgroundColor: experiences[i].color,
                    boxShadow: `0 0 30px ${experiences[i].color}`,
                    borderColor: experiences[i].color,
                    duration: 0.1,
                    scrollTrigger: {
                        trigger: node,
                        start: "top center",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="experience" className="section relative bg-[#020202] overflow-hidden border-b border-white/5">
            {/* Header Text */}
            <div className="relative z-10 text-center mb-10">
                <span className="text-[#e63946] font-mono tracking-widest text-xs uppercase font-semibold">04 // History</span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter mt-4">
                    The <span className="text-white/30 italic">Timeline.</span>
                </h2>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative">
                
                {/* The Central Wire */}
                <div ref={lineRef} className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 md:-translate-x-1/2" />
                
                {/* The Laser */}
                <div 
                    ref={laserRef} 
                    className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#e63946]/0 via-[#e63946] to-[#00ffff] md:-translate-x-1/2 origin-top scale-y-0 z-0 shadow-[0_0_20px_rgba(230,57,70,0.8)]" 
                />

                <div className="relative z-10 flex flex-col gap-12 py-6">
                    {experiences.map((exp, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div key={i} className={`timeline-node relative flex items-center justify-between w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                
                                {/* Center Node */}
                                <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10">
                                    <div className="node-glow absolute w-12 h-12 rounded-full pointer-events-none mix-blend-screen" style={{ backgroundColor: exp.color }} />
                                    <div className="node-dot w-4 h-4 rounded-full border-2 border-white/20 bg-black z-20 transition-all duration-300" />
                                </div>

                                {/* Content Box */}
                                <div className={`w-full pl-20 md:pl-0 md:w-5/12 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} node-content`}>

                                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tighter leading-tight">{exp.title}</h3>
                                    <div className="text-[#e63946] mono text-sm mb-6 tracking-widest uppercase flex items-center gap-2 justify-start md:justify-end">
                                        {!isEven && <span className="w-4 h-[1px] bg-[#e63946] block md:hidden" />}
                                        {exp.company}
                                        {isEven && <span className="w-4 h-[1px] bg-[#e63946] hidden md:block" />}
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
