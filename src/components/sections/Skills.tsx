'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Skill data structure
const skillCategories = [
    {
        title: 'Programming',
        icon: '💻',
        color: 'from-blue-500 to-cyan-400',
        skills: [
            { name: 'C', level: 80 },
            { name: 'HTML', level: 95 },
            { name: 'CSS', level: 85 },
            { name: 'Python', level: 90 },
        ],
    },
    {
        title: 'Web & UI',
        icon: '🎨',
        color: 'from-purple-500 to-pink-500',
        skills: [
            { name: 'Responsive Design', level: 90 },
            { name: 'Modern UI/UX', level: 85 },
            { name: 'Animations', level: 88 },
        ],
    },
    {
        title: 'Tools',
        icon: '🛠️',
        color: 'from-orange-500 to-yellow-400',
        skills: [
            { name: 'Git & GitHub', level: 90 },
            { name: 'VS Code', level: 95 },
            { name: 'Antigravity', level: 90 },

        ],
    },
];

/**
 * SkillCard - Individual skill category card with hover animations
 */
function SkillCard({
    category,
    index,
}: {
    category: (typeof skillCategories)[0];
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }, [index]);

    return (
        <motion.div
            ref={cardRef}
            className="card relative overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Gradient background on hover */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
            />

            {/* Icon */}
            <div className="text-4xl mb-4">{category.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-bold text-text-primary mb-4">{category.title}</h3>

            {/* Skills List */}
            <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-text-secondary">{skill.name}</span>
                            <span className="text-text-muted">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: isHovered ? `${skill.level}%` : '0%' }}
                                transition={{
                                    duration: 0.8,
                                    delay: skillIndex * 0.1,
                                    ease: 'easeOut',
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Decorative corner */}
            <div
                className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${category.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500`}
            />
        </motion.div>
    );
}

/**
 * Skills Section - Skill categories with interactive cards
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
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Constantly learning and expanding my toolkit to build better,
                        more secure digital experiences.
                    </p>
                </div>

                {/* Skills Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {skillCategories.map((category, index) => (
                        <SkillCard key={category.title} category={category} index={index} />
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-tertiary/10 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
