'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

// Project data
const projects = [
    {
        id: 1,
        title: 'Jharkhand Tourism Website',
        description:
            'An interactive tourism website showcasing destinations in Jharkhand with modern UI and future integration plans.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        color: 'from-emerald-500 to-teal-400',
        image: null, // Placeholder gradient
    },
    {
        id: 2,
        title: 'Student E-Library System',
        description:
            'A digital library platform where students can access PDF books with admin upload functionality.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        color: 'from-violet-500 to-purple-400',
        image: null,
    },
];

/**
 * ProjectCard - Individual project showcase with hover effects
 */
function ProjectCard({
    project,
    index,
}: {
    project: (typeof projects)[0];
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        gsap.fromTo(
            card,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.15,
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
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container */}
            <motion.div
                className="glass overflow-hidden rounded-2xl"
                whileHover={{ y: -12 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {/* Project Image/Preview */}
                <div className="relative h-64 overflow-hidden">
                    {/* Gradient placeholder */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`}
                    />

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id={`grid-${project.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.3" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
                        </svg>
                    </div>

                    {/* Project Title Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/30">
                            {project.title.split(' ')[0]}
                        </span>
                    </div>

                    {/* Hover overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-white text-sm font-medium px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                                View Project
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:gradient-text transition-all duration-300">
                        {project.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs px-3 py-1 rounded-full bg-bg-tertiary text-text-muted border border-border"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Glow effect on hover */}
            <motion.div
                className={`absolute -inset-1 bg-gradient-to-r ${project.color} rounded-2xl opacity-0 blur-xl -z-10`}
                animate={{ opacity: isHovered ? 0.3 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}

/**
 * Projects Section - Showcase of portfolio projects
 */
export default function Projects() {
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
        <section ref={sectionRef} id="projects" className="section bg-bg-secondary">
            <div className="container">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">My Work</span>
                    <h2 className="section-title text-text-primary">
                        Featured <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        A selection of projects that showcase my skills and passion for
                        building great digital experiences.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* More Projects CTA */}
                <div className="text-center mt-12">
                    <MagneticButton
                        href="https://github.com"
                        className="btn-secondary"
                    >
                        <span>View More on GitHub</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
