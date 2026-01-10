'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Experience data
const experiences = [
    {
        title: 'Web Exploit Hunting & Bug Bounty',
        type: 'Practical Learning',
        icon: '🔐',
        color: 'from-red-500 to-orange-400',
        description: 'Learning web security concepts, vulnerability assessment, and participating in bug bounty programs.',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_cybersecurity-bugbounty-websecurity-activity-7409989219709976577-C92n',
    },
];

/**
 * Experience Section - Practical learning experiences
 */
export default function Experience() {
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
                        Practical <span className="gradient-text">Learning</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        These are learning-based practical experiences, not internships or job roles.
                    </p>
                </div>

                {/* Experience Cards */}
                <div className="flex justify-center">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.title}
                            className="card relative overflow-hidden group max-w-md"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Gradient background on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                            />

                            {/* Icon */}
                            <div className="text-5xl mb-4">{exp.icon}</div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-text-primary mb-1">{exp.title}</h3>
                            <span className="text-sm text-accent-primary mb-3 block">{exp.type}</span>

                            {/* Description */}
                            <p className="text-text-secondary text-sm mb-4">{exp.description}</p>

                            {/* Certificate Link */}
                            {exp.certificateUrl && (
                                <a
                                    href={exp.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-primary transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Certificate
                                </a>
                            )}

                            {/* Decorative corner */}
                            <div
                                className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${exp.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Security Themed Background */}
            <div className="bg-security-theme" />
        </section>
    );
}
