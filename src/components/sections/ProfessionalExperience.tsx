'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        role: 'Technical Head',
        org: 'GeeksforGeeks Cloud Computing Club',
        location: 'Ghaziabad',
        period: 'Sept 2025 – Present',
        icon: '☁️',
        color: 'from-green-500 to-emerald-400',
        points: [
            'Led technical activities and coordinated student projects.',
            'Organized coding sessions and technical workshops.',
            'Mentored peers in programming and development.',
            'Managed team collaboration and event execution.',
        ],
    },
];

/**
 * ProfessionalExperience Section
 */
export default function ProfessionalExperience() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

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
        <section ref={sectionRef} id="experience" className="section">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">Experience</span>
                    <h2 className="section-title text-text-primary">
                        Professional <span className="gradient-text">Experience</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Roles where I've led, built, and mentored in real-world environments.
                    </p>
                </div>

                {/* Experience Cards */}
                <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.role + exp.org}
                            className="card relative overflow-hidden group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -6 }}
                        >
                            {/* Gradient background on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                            />

                            <div className="flex items-start gap-5">
                                {/* Icon */}
                                <div className="text-4xl shrink-0">{exp.icon}</div>

                                <div className="flex-1">
                                    {/* Role & Org */}
                                    <h3 className="text-xl font-bold text-text-primary">{exp.role}</h3>
                                    <span className="text-sm text-accent-primary font-medium">{exp.org}</span>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-3 mt-1 mb-4">
                                        <span className="text-xs text-text-muted flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {exp.location}
                                        </span>
                                        <span className="text-xs text-text-muted flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {exp.period}
                                        </span>
                                    </div>

                                    {/* Bullet Points */}
                                    <ul className="space-y-2">
                                        {exp.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Decorative corner */}
                            <div
                                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${exp.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
