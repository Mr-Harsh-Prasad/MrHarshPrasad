'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Taekwondo Section - Dedicated martial arts showcase
 */
export default function Taekwondo() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
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
        <section
            ref={sectionRef}
            id="taekwondo"
            className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/taekwondo-bg.png')" }}
            >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/50 to-bg-primary/80" />
            </div>

            {/* Animated particles/petals effect - fixed positions to avoid hydration mismatch */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                    { left: '10%', top: '20%', duration: 6, delay: 0, xMove: 20 },
                    { left: '25%', top: '40%', duration: 7, delay: 1, xMove: -15 },
                    { left: '45%', top: '15%', duration: 8, delay: 2, xMove: 25 },
                    { left: '60%', top: '60%', duration: 5, delay: 0.5, xMove: -20 },
                    { left: '75%', top: '30%', duration: 9, delay: 3, xMove: 15 },
                    { left: '85%', top: '70%', duration: 6, delay: 1.5, xMove: -10 },
                    { left: '15%', top: '80%', duration: 7, delay: 2.5, xMove: 20 },
                    { left: '35%', top: '55%', duration: 8, delay: 0, xMove: -25 },
                    { left: '55%', top: '85%', duration: 5, delay: 4, xMove: 10 },
                    { left: '90%', top: '45%', duration: 6, delay: 1, xMove: -15 },
                ].map((particle, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-red-500/30 rounded-full"
                        style={{
                            left: particle.left,
                            top: particle.top,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, particle.xMove, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div ref={contentRef} className="container relative z-10 text-center px-4">
                {/* Belt Icon */}
                <motion.div
                    className="text-8xl mb-6"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    🥋
                </motion.div>

                {/* Title */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                    <span className="gradient-text">1st Dan</span>
                    <span className="text-text-primary"> Black Belt</span>
                </h2>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-text-secondary mb-6">
                    Taekwondo • 태권도
                </p>

                {/* Quote */}
                <motion.blockquote
                    className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    &quot;The more you sweat in training, the less you bleed in combat.&quot;
                </motion.blockquote>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 mt-12">
                    {[
                        { label: 'Discipline', icon: '🎯' },
                        { label: 'Focus', icon: '👁️' },
                        { label: 'Patience', icon: '⏳' },
                        { label: 'Control', icon: '🧘' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="glass p-4 px-6 rounded-xl border border-red-500/20"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05, borderColor: 'rgba(239, 68, 68, 0.5)' }}
                        >
                            <span className="text-2xl mr-2">{stat.icon}</span>
                            <span className="text-text-primary font-semibold">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
        </section>
    );
}
