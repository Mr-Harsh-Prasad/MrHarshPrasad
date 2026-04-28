'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const skills = [
    { name: 'C / C++', level: 82, category: 'Low-Level Architecture', color: '#3b82f6', desc: 'Deep understanding of memory management, pointers, and performance-critical systems.' },
    { name: 'Python', level: 75, category: 'AI & Backend', color: '#eab308', desc: 'Extensive experience in computer vision, machine learning, and robust backend development.' },
    { name: 'Java', level: 65, category: 'Enterprise Systems', color: '#ef4444', desc: 'Object-oriented design patterns and scalable application architecture.' },
    { name: 'Web Stack', level: 88, category: 'Frontend & UI', color: '#ec4899', desc: 'Next.js, React, Tailwind, and GSAP for world-class interactive web experiences.' },
];

export default function Skills() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section 
            id="skills" 
            className="relative h-screen w-full bg-[#020202] flex flex-col md:flex-row overflow-hidden border-b border-white/5"
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {skills.map((skill, index) => {
                const isActive = hoveredIndex === index;
                const isAnyHovered = hoveredIndex !== null;

                return (
                    <motion.div
                        key={skill.name}
                        className="relative group border-b md:border-b-0 md:border-r border-white/5 overflow-hidden cursor-crosshair flex flex-col justify-center items-center bg-[#050505]"
                        onMouseEnter={() => setHoveredIndex(index)}
                        initial={false}
                        animate={{
                            flex: isActive ? 5 : (isAnyHovered ? 0.5 : 1)
                        }}
                        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        style={{ height: '100%', width: '100%' }}
                    >
                        {/* Background Color Glow */}
                        <motion.div 
                            className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 pointer-events-none"
                            animate={{ opacity: isActive ? 0.15 : 0 }}
                            style={{ background: `linear-gradient(to bottom right, ${skill.color}, transparent)` }}
                        />

                        {/* Collapsed State (Vertical Text on Desktop) */}
                        <motion.div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            animate={{ opacity: isActive ? 0 : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white/40 tracking-widest uppercase md:-rotate-90 whitespace-nowrap transition-colors duration-500 group-hover:text-white/80">
                                {skill.name}
                            </h3>
                        </motion.div>

                        {/* Expanded State */}
                        <motion.div 
                            className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between z-10 pointer-events-none overflow-hidden"
                            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
                        >
                            {/* Top info */}
                            <div className="min-w-max">
                                <span className="font-mono tracking-widest text-xs md:text-sm uppercase block mb-4 font-bold" style={{ color: skill.color }}>
                                    {skill.category}
                                </span>
                                <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tighter uppercase whitespace-nowrap">
                                    {skill.name}
                                </h3>
                                <p className="text-white/60 mt-6 max-w-sm text-sm md:text-base leading-relaxed hidden md:block whitespace-normal">
                                    {skill.desc}
                                </p>
                            </div>

                            {/* Bottom info */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4 mt-auto">
                                <span className="font-mono text-white/30 text-sm md:text-lg uppercase tracking-widest hidden md:block">
                                    Proficiency Level
                                </span>
                                <div className="text-7xl md:text-9xl font-serif font-bold tracking-tighter leading-none" style={{ color: skill.color }}>
                                    {skill.level}<span className="text-3xl md:text-5xl text-white/30">%</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </section>
    );
}
