'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Interests data
const interests = [
    {
        name: 'Taekwondo',
        icon: '🥋',
        highlight: '1st Dan Black Belt',
        isHighlighted: true,
        color: 'from-red-500 to-orange-500',
    },
    {
        name: 'Chess',
        icon: '♟️',
        highlight: null,
        isHighlighted: false,
        color: 'from-gray-500 to-slate-400',
    },
    {
        name: 'Sports',
        icon: '⚽',
        highlight: null,
        isHighlighted: false,
        color: 'from-green-500 to-emerald-400',
    },
    {
        name: 'Gaming',
        icon: '🎮',
        highlight: null,
        isHighlighted: false,
        color: 'from-purple-500 to-violet-400',
    },
    {
        name: 'Music',
        icon: '🎵',
        highlight: null,
        isHighlighted: false,
        color: 'from-pink-500 to-rose-400',
    },
];

/**
 * Interests Section - Hobbies and interests
 */
export default function Interests() {
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
        <section ref={sectionRef} id="interests" className="section bg-bg-secondary">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">Beyond Code</span>
                    <h2 className="section-title text-text-primary">
                        Interests & <span className="gradient-text">Hobbies</span>
                    </h2>
                </div>

                {/* Interests Grid */}
                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                    {interests.map((interest, index) => (
                        <motion.div
                            key={interest.name}
                            className={`relative group ${interest.isHighlighted ? 'md:col-span-2' : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <motion.div
                                className={`
                                    glass p-6 rounded-2xl text-center cursor-default
                                    ${interest.isHighlighted
                                        ? 'border-2 border-accent-primary shadow-lg shadow-accent-primary/20 min-w-[280px]'
                                        : 'min-w-[140px]'
                                    }
                                `}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Icon */}
                                <div className={`text-5xl mb-3 ${interest.isHighlighted ? 'text-6xl' : ''}`}>
                                    {interest.icon}
                                </div>

                                {/* Name */}
                                <h3 className={`font-bold text-text-primary ${interest.isHighlighted ? 'text-xl' : 'text-lg'}`}>
                                    {interest.name}
                                </h3>

                                {/* Highlight badge for Taekwondo */}
                                {interest.highlight && (
                                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white">
                                        {interest.highlight}
                                    </span>
                                )}

                                {/* Glow effect for highlighted */}
                                {interest.isHighlighted && (
                                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl opacity-20 blur-xl -z-10" />
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Interests Themed Background */}
            <div className="bg-interests-theme" />
        </section>
    );
}
