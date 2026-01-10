'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Programming Languages & Technologies
const skills = [
    { name: 'C', icon: '🔷' },
    { name: 'Python', icon: '🐍' },
    { name: 'HTML', icon: '🌐' },
    { name: 'CSS', icon: '🎨' },
    { name: 'Data Structures', icon: '📊' },
];

// Courses & Certifications
const certifications = [
    {
        name: 'C Programming',
        provider: 'Infosys Springboard',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_certificate-programminglife-cprogramming-activity-7394020044768378880-jwPx',
    },
    {
        name: 'HTML Fundamentals',
        provider: 'Infosys Springboard',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_html-codingforfun-webdevelopment-activity-7394025565885771776-XQtg',
    },
    {
        name: 'Web Exploit & Bug Bounty',
        provider: 'Udemy',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_cybersecurity-bugbounty-websecurity-activity-7409989219709976577-C92n',
    },
];

/**
 * Skills Section - Clean display of skills and certifications
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
                <div className="max-w-4xl mx-auto mb-16">
                    <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                        <span className="text-2xl">💻</span> Languages & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-5 py-3 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 hover:bg-bg-tertiary transition-all duration-200 cursor-default"
                            >
                                <span className="text-text-primary font-medium flex items-center gap-2">
                                    <span>{skill.icon}</span>
                                    {skill.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                        <span className="text-2xl">📜</span> Courses & Certifications
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {certifications.map((cert, index) => (
                            <motion.a
                                key={cert.name}
                                href={cert.certificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="block p-5 rounded-xl bg-bg-secondary border border-border hover:border-accent-primary/50 hover:bg-bg-tertiary transition-all duration-200 group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                                            {cert.name}
                                        </h4>
                                        <p className="text-sm text-text-muted mt-1">{cert.provider}</p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors flex-shrink-0 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>
                            </motion.a>
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
