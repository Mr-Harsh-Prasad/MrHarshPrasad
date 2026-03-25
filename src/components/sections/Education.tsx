'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const education = [
    {
        institution: 'IMS Engineering College, Ghaziabad',
        degree: 'B.Tech – Computer Science',
        period: 'Sept 2024 – Present',
        icon: '🎓',
        color: 'from-blue-500 to-indigo-400',
        details: [
            'Pursuing B.Tech in Computer Science Engineering.',
            'Active member of the GeeksforGeeks Cloud Computing Club.',
            'Participating in hackathons, coding contests, and technical workshops.',
        ],
    },
];

/**
 * Education Section
 */
export default function Education() {
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
        <section ref={sectionRef} id="education" className="section">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">Education</span>
                    <h2 className="section-title text-text-primary">
                        Academic <span className="gradient-text">Background</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Where my journey in computer science began.
                    </p>
                </div>

                {/* Education Cards */}
                <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu.institution}
                            className="card relative overflow-hidden group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -6 }}
                        >
                            {/* Hover gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${edu.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                            />

                            <div className="flex items-start gap-5">
                                {/* Icon */}
                                <div className="text-4xl shrink-0">{edu.icon}</div>

                                <div className="flex-1">
                                    {/* Institution */}
                                    <h3 className="text-xl font-bold text-text-primary">{edu.institution}</h3>
                                    <span className="text-sm text-accent-primary font-medium">{edu.degree}</span>

                                    {/* Period */}
                                    <div className="flex items-center gap-1.5 mt-1 mb-4">
                                        <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs text-text-muted">{edu.period}</span>
                                    </div>

                                    {/* Bullet details */}
                                    <ul className="space-y-2">
                                        {edu.details.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Decorative corner glow */}
                            <div
                                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${edu.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
