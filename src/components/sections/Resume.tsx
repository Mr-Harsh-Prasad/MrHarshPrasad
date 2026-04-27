'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * Resume Section - CTA section for resume download
 */
export default function Resume() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const btnContainerRef = useRef<HTMLDivElement>(null);

    // Glow interaction state
    const [isHovered, setIsHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!btnContainerRef.current) return;
        const rect = btnContainerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="resume" className="section relative overflow-hidden">
            <div className="container relative z-10">
                <div
                    ref={contentRef}
                    className="relative max-w-4xl mx-auto glass-strong p-8 md:p-12 text-center overflow-hidden border border-white/5 rounded-3xl"
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-tertiary/5 pointer-events-none" />

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-accent-tertiary/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10">
                        <span className="section-subtitle gradient-text">Resume</span>
                        <h2 className="section-title text-text-primary mb-4">
                            Want to Know More?
                        </h2>
                        <p className="text-text-secondary max-w-xl mx-auto mb-10">
                            Download my resume to explore my full educational background,
                            skills, and experiences in detail.
                        </p>

                        {/* Interactive Glowing Button Container */}
                        <div 
                            ref={btnContainerRef}
                            className="relative inline-block p-4"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Cursor-tracking glow */}
                            <motion.div
                                className="absolute pointer-events-none z-0 mix-blend-screen"
                                style={{
                                    left: mouseX,
                                    top: mouseY,
                                    x: '-50%',
                                    y: '-50%',
                                    width: '150px',
                                    height: '150px',
                                    background: 'radial-gradient(circle closest-side, rgba(230, 57, 70, 0.8), transparent)',
                                    filter: 'blur(20px)',
                                    opacity: isHovered ? 0.6 : 0,
                                }}
                                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            />
                            
                            {/* Static pulse glow behind button */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent-primary/20 blur-2xl rounded-full animate-pulse z-0 pointer-events-none" />

                            <div className="relative z-10">
                                <MagneticButton href="/resume.pdf" download className="btn-primary overflow-hidden group">
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                        </svg>
                                        <span>View Resume</span>
                                    </span>
                                    {/* Inner button hover shine */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer pointer-events-none" />
                                </MagneticButton>
                            </div>
                        </div>

                        {/* Resume highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            {[
                                { icon: '🎓', label: 'B.Tech CS' },
                                { icon: '💻', label: 'Web Dev' },
                                { icon: '🔐', label: 'Cybersecurity' },
                                { icon: '📚', label: 'Continuous Learner' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-tertiary/30 border border-white/5 hover:bg-bg-tertiary/60 hover:border-white/10 transition-colors"
                                >
                                    <span className="text-3xl mb-1">{item.icon}</span>
                                    <span className="text-sm text-text-secondary font-medium">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Ambient Background */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
        </section>
    );
}
