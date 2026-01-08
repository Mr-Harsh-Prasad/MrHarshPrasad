'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * Resume Section - CTA section for resume download
 */
export default function Resume() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
        <section ref={sectionRef} id="resume" className="section">
            <div className="container">
                <div
                    ref={contentRef}
                    className="relative max-w-4xl mx-auto glass-strong p-8 md:p-12 text-center overflow-hidden"
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-tertiary/10 pointer-events-none" />

                    {/* Decorative elements */}
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-accent-tertiary/20 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative z-10">
                        <span className="section-subtitle gradient-text">Resume</span>
                        <h2 className="section-title text-text-primary mb-4">
                            Want to Know More?
                        </h2>
                        <p className="text-text-secondary max-w-xl mx-auto mb-8">
                            Download my resume to explore my full educational background,
                            skills, and experiences in detail.
                        </p>

                        {/* Download Button */}
                        <MagneticButton href="/resume.pdf" download className="btn-primary">
                            <svg
                                className="w-5 h-5"
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
                            <span>Download Resume</span>
                        </MagneticButton>

                        {/* Resume highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                            {[
                                { icon: '🎓', label: 'B.Tech CSE' },
                                { icon: '💻', label: 'Web Dev' },
                                { icon: '🔐', label: 'Cybersecurity' },
                                { icon: '📚', label: 'Continuous Learner' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-tertiary/50"
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-sm text-text-secondary">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
