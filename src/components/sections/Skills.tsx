'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const skills = [
    { name: 'C', tag: 'Programming', level: 82, color: '#3b82f6' },
    { name: 'Python', tag: 'Programming', level: 75, color: '#eab308' },
    { name: 'Java', tag: 'Programming', level: 65, color: '#ef4444' },
    { name: 'HTML & CSS', tag: 'Web', level: 88, color: '#ec4899' },
];

function SkillNode({ skill, index }: { skill: typeof skills[0], index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (skill.level / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.05, duration: 0.5, type: 'spring' }}
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-bg-tertiary/30 backdrop-blur-md transition-all duration-500 hover:bg-bg-tertiary/80 hover:border-white/20 relative overflow-hidden z-10 hover:-translate-y-2">
                
                {/* Circular Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                    {/* Background Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="4"
                        />
                    </svg>
                    
                    {/* Animated Fill Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <motion.circle
                            cx="48"
                            cy="48"
                            r={radius}
                            fill="transparent"
                            stroke={skill.color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: isHovered ? strokeDashoffset : circumference }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ filter: `drop-shadow(0 0 6px ${skill.color})` }}
                        />
                    </svg>
                    
                    {/* Level Text (appears on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: skill.color }}>
                        {skill.level}%
                    </div>
                    
                    {/* Idle Icon / Initial */}
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-text-primary opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                        {skill.name.charAt(0)}
                    </div>
                </div>

                <span className="text-text-primary font-semibold text-center group-hover:text-white transition-colors duration-300">{skill.name}</span>
                <span className="text-text-muted text-[10px] mono uppercase tracking-widest mt-1 text-center group-hover:text-text-secondary transition-colors duration-300">{skill.tag}</span>

                {/* Ambient glow behind card */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none mix-blend-screen"
                    style={{ background: `radial-gradient(circle at center, ${skill.color} 0%, transparent 70%)` }}
                />
            </div>
        </motion.div>
    );
}

/**
 * Skills Section — Interactive visual grid with glowing nodes.
 */
export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
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
        <section ref={sectionRef} id="skills" className="section bg-bg-secondary relative overflow-hidden">
            <div className="container relative z-10">
                <div className="flex flex-col items-center mb-16 text-center" ref={titleRef}>
                    <span className="section-subtitle">Technical Skills</span>
                    <h2 className="section-title text-text-primary mb-6">
                        What I <span className="gradient-text">Work With.</span>
                    </h2>
                    <p className="text-text-secondary max-w-lg leading-relaxed">
                        Languages and tools I&apos;ve trained with — each one practiced with intention,
                        not just memorized. Hover to reveal proficiency.
                    </p>
                </div>

                {/* Interactive Skills Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {skills.map((skill, index) => (
                        <SkillNode key={skill.name} skill={skill} index={index} />
                    ))}
                </div>
            </div>

            {/* Background Decorations */}
            <div className="bg-code-theme" />
            <div className="grid-pattern opacity-20" />
        </section>
    );
}
