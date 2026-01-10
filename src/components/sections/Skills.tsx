'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Skills with optional certificate links
const skills = [
    { name: 'C', icon: '🔷', color: 'from-blue-500 to-cyan-400', certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_certificate-programminglife-cprogramming-activity-7394020044768378880-jwPx' },
    { name: 'Python', icon: '🐍', color: 'from-yellow-500 to-green-400' },
    { name: 'HTML', icon: '🌐', color: 'from-orange-500 to-red-400', certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_html-codingforfun-webdevelopment-activity-7394025565885771776-XQtg' },
    { name: 'CSS', icon: '🎨', color: 'from-purple-500 to-pink-400' },
    { name: 'DSA', subtitle: 'using C', icon: '📊', color: 'from-green-500 to-emerald-400' },
];

/**
 * Skills Section - Modern card-based display with animations
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
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group"
                            >
                                <div className="relative flex flex-col items-center p-6 rounded-2xl bg-bg-secondary border border-border hover:border-accent-primary/50 transition-all duration-300 overflow-hidden">
                                    {/* Gradient glow on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

                                    {/* Large Icon */}
                                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {skill.icon}
                                    </div>

                                    {/* Skill Name */}
                                    <h3 className="text-text-primary font-semibold text-center mb-1">
                                        {skill.name}
                                    </h3>
                                    {'subtitle' in skill && skill.subtitle && (
                                        <span className="text-xs text-text-muted">{skill.subtitle}</span>
                                    )}

                                    {/* Certificate Link */}
                                    {skill.certificateUrl && (
                                        <a
                                            href={skill.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1 mt-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Certificate
                                        </a>
                                    )}

                                    {/* Decorative gradient corner */}
                                    <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${skill.color} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
                                </div>
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
