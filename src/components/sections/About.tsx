'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section - Personal introduction with text reveal animations
 */
export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
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

            // Text paragraphs staggered animation
            textRefs.current.forEach((ref, index) => {
                if (!ref) return;
                gsap.fromTo(
                    ref,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: ref,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });

            // Image parallax effect
            if (imageRef.current) {
                gsap.fromTo(
                    imageRef.current,
                    { scale: 1.1 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: imageRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="section bg-bg-secondary">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image/Visual Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-3xl">
                            {/* Profile Image */}
                            <div
                                ref={imageRef}
                                className="absolute inset-0"
                            >
                                <img
                                    src="/mrharshprasad.jpeg"
                                    alt="Mr Harsh Prasad"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Decorative border */}
                            <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
                        </div>

                        {/* Floating decoration elements */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-primary/30 rounded-full blur-2xl" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent-tertiary/30 rounded-full blur-2xl" />
                    </div>

                    {/* Text Content */}
                    <div className="order-1 lg:order-2">
                        <span className="section-subtitle gradient-text">About Me</span>
                        <h2 ref={titleRef} className="section-title text-text-primary mb-6">
                            Discipline Meets<br />
                            <span className="gradient-text">Technology</span>
                        </h2>

                        <div className="space-y-4 text-text-secondary">
                            <p ref={(el) => { textRefs.current[0] = el; }}>
                                I am <strong className="text-text-primary">Mr Harsh Prasad</strong>, a{' '}
                                <strong className="text-text-primary">Computer Science undergraduate</strong> with
                                a strong interest in <strong className="text-accent-primary">programming and technology</strong>.
                                I believe in learning by building and improving through consistent practice.
                            </p>

                            <p ref={(el) => { textRefs.current[1] = el; }}>
                                My mindset is shaped by years of <strong className="text-accent-secondary">martial arts training</strong>,
                                where discipline and patience matter more than speed. As a{' '}
                                <strong className="gradient-text">Taekwondo Black Belt (1st Dan)</strong>, Mr Harsh Prasad brings the same
                                focus and dedication to his coding journey.
                            </p>

                            <p ref={(el) => { textRefs.current[2] = el; }}>
                                Currently pursuing <strong className="text-text-primary">B.Tech in Computer Science</strong> from
                                an AKTU affiliated college, with expected graduation in <strong className="text-accent-primary">2028</strong>.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            {[
                                { number: '🥋', label: 'Black Belt' },
                                { number: '2028', label: 'Graduation' },
                                { number: '∞', label: 'Discipline' },
                            ].map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="glass p-4 text-center"
                                    ref={(el) => { textRefs.current[3 + index] = el; }}
                                >
                                    <span className="block text-2xl font-bold gradient-text">{stat.number}</span>
                                    <span className="text-sm text-text-muted">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
