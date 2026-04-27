'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

// Project data
const projects = [
    {
        id: 1,
        title: 'Jharkhand Tourism Website',
        description:
            'A responsive website showcasing tourist destinations of Jharkhand. Features modern UI with interactive elements.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        color: 'from-emerald-500 to-teal-400',
        image: '/projects/jharkhand-tourism.png',
        github: 'https://github.com/Mr-Harsh-Prasad',
        live: null,
    },
    {
        id: 2,
        title: 'Student E-Digital Library',
        description:
            'A digital library platform for accessing academic PDF resources. Includes basic admin content management.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        color: 'from-violet-500 to-purple-400',
        image: '/projects/elibrary.png',
        github: 'https://github.com/Mr-Harsh-Prasad',
        live: null,
    },
    {
        id: 3,
        title: 'Personal Portfolio Website',
        description:
            'A modern, animated portfolio built to showcase my skills, projects, and personality. Features fluid animations and 3D elements.',
        tech: ['Next.js', 'GSAP', 'Three.js', 'Tailwind'],
        color: 'from-pink-500 to-rose-400',
        image: '/projects/portfolio.png',
        github: 'https://github.com/Mr-Harsh-Prasad/MrHarshPrasad',
        live: 'https://mrharshprasad-portfolio.vercel.app',
    },
    {
        id: 4,
        title: 'Expense Tracker',
        description:
            'A full-stack expense management application with user authentication, expense tracking, and data visualization features.',
        tech: ['Django', 'Python', 'JavaScript', 'HTML', 'CSS'],
        color: 'from-blue-500 to-cyan-400',
        image: '/projects/expense-tracker.png',
        github: 'https://github.com/Mr-Harsh-Prasad/Money-Analyzer',
        live: 'https://money-analyzer.vercel.app',
    },
    {
        id: 5,
        title: 'TKD AI Coach',
        description:
            'AI-based Taekwondo coach using computer vision to analyze moves and posture in real time. Provides instant feedback and correction suggestions, with personalized training based on user performance tracking.',
        tech: ['Python', 'Computer Vision', 'MediaPipe', 'OpenCV', 'AI/ML'],
        color: 'from-red-500 to-orange-400',
        image: '/projects/tkd-ai-coach.png',
        github: 'https://github.com/Mr-Harsh-Prasad',
        live: null,
    },
    {
        id: 6,
        title: 'Error – Anti Cheat Coding Platform',
        description:
            'Anti-cheat coding platform to prevent unfair practices during online tests. Features tab switching detection, activity tracking, and suspicious action restriction to ensure a secure coding environment.',
        tech: ['Next.js', 'JavaScript', 'Supabase', 'Judge0 API'],
        color: 'from-violet-500 to-indigo-400',
        image: '/projects/error-platform.png',
        github: 'https://github.com/Mr-Harsh-Prasad',
        live: null,
    },
];

/**
 * InteractiveProjectCard - 3D Tilt Card with Framer Motion
 */
function InteractiveProjectCard({
    project,
    index,
}: {
    project: (typeof projects)[0];
    index: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    // Smooth the mouse movement
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    // Rotate based on mouse position
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className="relative h-full perspective-1000 group cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
        >
            {/* 3D Container */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full h-full glass overflow-hidden rounded-2xl flex flex-col relative"
            >
                {/* 3D Inner Content Container */}
                <div style={{ transform: "translateZ(40px)" }} className="absolute inset-0 z-20 flex flex-col justify-end p-6 pointer-events-none">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-md">
                        {project.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 drop-shadow-md">
                        {project.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-2 pointer-events-auto">
                        {project.tech.map((tech) => (
                            <motion.span
                                key={tech}
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,255,255,0.2)' }}
                                className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 backdrop-blur-md transition-colors"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>

                    {/* Hover Action Buttons */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-6 right-6 flex gap-3 pointer-events-auto"
                            >
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all backdrop-blur-sm"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                )}
                                {project.live && (
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all backdrop-blur-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10 pointer-events-none" />

                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`} />
                    )}
                </div>
            </motion.div>
            
            {/* Glow effect on hover */}
            <motion.div
                className={`absolute -inset-2 bg-gradient-to-r ${project.color} rounded-2xl opacity-0 blur-xl -z-10`}
                animate={{ opacity: isHovered ? 0.4 : 0 }}
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
            // Horizontal Scroll
            const projectsContainer = sectionRef.current?.querySelector('.projects-horizontal-scroll') as HTMLElement;
            if (projectsContainer) {
                const getScrollAmount = () => {
                    let containerWidth = projectsContainer.scrollWidth;
                    return -(containerWidth - window.innerWidth + 100); // 100px padding
                };

                const tween = gsap.to(projectsContainer, {
                    x: getScrollAmount,
                    ease: 'none'
                });

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: () => `+=${getScrollAmount() * -1}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="projects" className="section bg-black relative overflow-hidden">
            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div 
                    ref={titleRef} 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <span className="section-subtitle text-cyan-400">My Work</span>
                    <h2 className="section-title text-white drop-shadow-md">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Projects</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto mt-4">
                        A selection of products I've engineered, featuring modern stacks and interactive experiences.
                    </p>
                </motion.div>

                {/* Projects Horizontal Container */}
                <div className="mt-12 overflow-hidden pb-10">
                    <div className="projects-horizontal-scroll flex flex-nowrap gap-8 w-max px-[5vw]">
                        {projects.map((project, index) => (
                            <div key={project.id} className="w-[85vw] md:w-[600px] h-[450px] flex-shrink-0">
                                <InteractiveProjectCard project={project} index={index} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* More Projects CTA */}
                <div className="text-center mt-12">
                    <MagneticButton
                        href="https://github.com/Mr-Harsh-Prasad"
                        className="btn-secondary !border-cyan-500/30 hover:!border-cyan-400"
                    >
                        <span>View More on GitHub</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </MagneticButton>
                </div>
            </div>
            
            {/* Grid Pattern overlay for tech feel */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        </section>
    );
}
