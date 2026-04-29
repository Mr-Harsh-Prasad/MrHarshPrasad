'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        role: 'Technical Head',
        org: 'GeeksforGeeks Cloud Computing Club',
        location: 'Ghaziabad',
        period: 'Sept 2025 – Present',
        icon: '☁️',
        color: 'from-green-500 to-emerald-400',
        glowColor: 'rgba(16, 185, 129, 0.5)',
        points: [
            'Led technical activities and coordinated student projects.',
            'Organized coding sessions and technical workshops.',
            'Mentored peers in programming and development.',
            'Managed team collaboration and event execution.',
        ],
    },
];

/**
 * ProfessionalExperience Section - Animated Vertical Timeline
 */
export default function ProfessionalExperience() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ['start center', 'end center'],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="experience" className="section relative overflow-hidden">
            <div className="container relative z-10">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-10">
                    <span className="section-subtitle gradient-text">Experience</span>
                    <h2 className="section-title text-text-primary">
                        Professional <span className="gradient-text">Experience</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Roles where I&apos;ve led, built, and mentored in real-world environments.
                    </p>
                </div>

                {/* Animated Timeline */}
                <div ref={timelineRef} className="relative max-w-4xl mx-auto">
                    {/* Background Track */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full" />
                    
                    {/* Glowing Fill Track */}
                    <motion.div 
                        className="absolute left-[28px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 md:-translate-x-1/2 rounded-full origin-top"
                        style={{ height: lineHeight }}
                    >
                        {/* Leading glow dot */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(16,185,129,1)]" />
                    </motion.div>

                    {/* Timeline Items */}
                    <div className="flex flex-col gap-8 relative">
                        {experiences.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={exp.role + exp.org} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Spacer for alternating layout */}
                                    <div className="hidden md:block w-1/2" />

                                    {/* Center Node */}
                                    <motion.div 
                                        className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-black bg-bg-secondary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    >
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-400" />
                                    </motion.div>

                                    {/* Content Card */}
                                    <motion.div
                                        className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}
                                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                    >
                                        <div className="card relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                                            {/* Hover gradient */}
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                                            />

                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="text-3xl shrink-0 mt-1 drop-shadow-md group-hover:scale-110 transition-transform duration-500">{exp.icon}</div>

                                                <div className="flex-1">
                                                    {/* Role & Org */}
                                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">{exp.role}</h3>
                                                    <span className="text-sm text-accent-primary font-medium">{exp.org}</span>

                                                    {/* Meta */}
                                                    <div className="flex flex-wrap gap-3 mt-2 mb-4">
                                                        <span className="text-xs text-text-muted flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {exp.location}
                                                        </span>
                                                    </div>

                                                    {/* Bullet Points */}
                                                    <ul className="space-y-3 mt-4 border-t border-white/5 pt-4">
                                                        {exp.points.map((point, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${exp.color} shrink-0 shadow-[0_0_8px_${exp.glowColor}]`} />
                                                                <span className="leading-relaxed">{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Decorative corner glow */}
                                            <div
                                                className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${exp.color} opacity-10 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        </section>
    );
}
