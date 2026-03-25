'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
    {
        icon: '🥋',
        title: '1st Dan Black Belt in Taekwondo',
        subtitle: 'Taekwondo • 태권도',
        description: 'Showcases discipline, consistency, and resilience — earned through years of rigorous training and dedication to martial arts.',
        color: 'from-red-500 to-orange-400',
        tags: ['Discipline', 'Consistency', 'Resilience'],
    },
    {
        icon: '🏆',
        title: 'Winner, Gemini Buildathon (MLH)',
        subtitle: 'Major League Hacking',
        description: 'Demonstrated innovation and strong problem-solving skills by building and shipping a competitive project at the Gemini Buildathon.',
        color: 'from-yellow-400 to-amber-500',
        tags: ['Innovation', 'Problem Solving', 'Hackathon'],
    },
];

/**
 * Achievements Section
 */
export default function Achievements() {
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
        <section ref={sectionRef} id="achievements" className="section bg-bg-secondary">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">Achievements</span>
                    <h2 className="section-title text-text-primary">
                        Proud <span className="gradient-text">Milestones</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Recognition and accomplishments that reflect hard work, growth, and resilience.
                    </p>
                </div>

                {/* Achievement Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={item.title}
                            className="card relative overflow-hidden group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.6 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Hover gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                            />

                            {/* Icon */}
                            <motion.div
                                className="text-6xl mb-5"
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            >
                                {item.icon}
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-text-primary mb-1">{item.title}</h3>
                            <span className="text-sm text-accent-primary mb-3 block">{item.subtitle}</span>

                            {/* Description */}
                            <p className="text-text-secondary text-sm mb-5 leading-relaxed">{item.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-3 py-1 rounded-full bg-bg-tertiary text-text-muted border border-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Decorative corner glow */}
                            <div
                                className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${item.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
