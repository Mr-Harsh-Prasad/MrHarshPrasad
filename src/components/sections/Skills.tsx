'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Skills with optional certificate links
const skills = [
    { name: 'C', icon: '🔷', certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_certificate-programminglife-cprogramming-activity-7394020044768378880-jwPx' },
    { name: 'Python', icon: '🐍' },
    { name: 'HTML', icon: '🌐', certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_html-codingforfun-webdevelopment-activity-7394025565885771776-XQtg' },
    { name: 'CSS', icon: '🎨' },
    { name: 'Data Structures', icon: '📊' },
];

/**
 * Skills Section - Clean display of skills with certificate links
 */
export default function Skills() {
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
        <section ref={sectionRef} id="skills" className="section">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">My Skills</span>
                    <h2 className="section-title text-text-primary">
                        Technologies I <span className="gradient-text">Work With</span>
                    </h2>
                </div>

                {/* Skills Grid */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="px-5 py-3 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 hover:bg-bg-tertiary transition-all duration-200">
                                    <span className="text-text-primary font-medium flex items-center gap-2">
                                        <span>{skill.icon}</span>
                                        {skill.name}
                                    </span>
                                </div>
                                {skill.certificateUrl && (
                                    <a
                                        href={skill.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Certificate
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Themed Background */}
            <div className="bg-code-theme pointer-events-none" />
            <div className="grid-pattern pointer-events-none" />
        </section>
    );
}
