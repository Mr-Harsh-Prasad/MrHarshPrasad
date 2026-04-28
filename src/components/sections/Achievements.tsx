'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
    {
        icon: '🥋',
        title: '1st Dan Black Belt in Taekwondo',
        subtitle: 'Taekwondo • 태권도',
        description: 'Showcases discipline, consistency, and resilience — earned through years of rigorous training and dedication to martial arts.',
        color: 'from-red-500 to-orange-400',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        tags: ['Discipline', 'Consistency', 'Resilience'],
    },
    {
        icon: '🏆',
        title: 'Winner, Gemini Buildathon (MLH)',
        subtitle: 'Major League Hacking',
        description: 'Demonstrated innovation and strong problem-solving skills by building and shipping a competitive project at the Gemini Buildathon.',
        color: 'from-yellow-400 to-amber-500',
        glowColor: 'rgba(250, 204, 21, 0.4)',
        tags: ['Innovation', 'Problem Solving', 'Hackathon'],
    },
];

// Interactive Tilt Card Component
function TiltCard({ item, index }: { item: typeof achievements[0], index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse position relative to card center
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

    // Map mouse position to rotation
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

    // Map mouse position to glare/gradient position
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to center [-0.5, 0.5]
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

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
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="relative h-full perspective-1000"
        >
            <div className="card relative h-full overflow-hidden border border-white/5 bg-bg-tertiary/50 backdrop-blur-sm transition-colors duration-500 hover:border-white/20">
                {/* 3D content container */}
                <div style={{ transform: 'translateZ(30px)' }} className="relative z-10 p-2">
                    {/* Icon */}
                    <motion.div
                        className="text-6xl mb-6 drop-shadow-2xl"
                        animate={{ 
                            rotateY: isHovered ? [0, 10, -10, 0] : 0,
                            scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ duration: 2, ease: 'easeInOut', repeat: isHovered ? Infinity : 0 }}
                    >
                        {item.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary mb-1">{item.title}</h3>
                    <span className="text-sm text-accent-primary mb-4 block font-medium">{item.subtitle}</span>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed">{item.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-3 py-1 rounded-full bg-white/5 text-text-muted border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Glare effect tracking mouse */}
                <motion.div 
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        left: `calc(${glareX} - 50%)`,
                        top: `calc(${glareY} - 50%)`,
                        width: '200%',
                        height: '200%',
                        opacity: isHovered ? 1 : 0
                    }}
                />

                {/* Hover gradient background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-10' : ''}`}
                />

                {/* Floating Particles (CSS animated) */}
                <div className={`absolute inset-0 pointer-events-none overflow-hidden opacity-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : ''}`}>
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute rounded-full bg-white/40 blur-[1px]"
                            style={{
                                width: (Math.abs(Math.sin(i * 1.5 + index)) * 4) + 1 + 'px',
                                height: (Math.abs(Math.sin(i * 1.5 + index)) * 4) + 1 + 'px',
                                left: (Math.abs(Math.sin(i * 2.5 + index)) * 100) + '%',
                                top: (Math.abs(Math.sin(i * 3.5 + index)) * 100) + '%',
                                animation: `float-particle ${(Math.abs(Math.sin(i * 4.5 + index)) * 3) + 2}s ease-in-out infinite alternate`,
                                animationDelay: `${Math.abs(Math.sin(i * 5.5 + index)) * 2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Decorative corner glow */}
                <div
                    className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-10'}`}
                />
            </div>
        </motion.div>
    );
}

/**
 * Achievements Section
 */
export default function Achievements() {
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
        <section ref={sectionRef} id="achievements" className="section bg-bg-secondary relative overflow-hidden">
            <div className="container relative z-10">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-10">
                    <span className="section-subtitle gradient-text">Achievements</span>
                    <h2 className="section-title text-text-primary">
                        Proud <span className="gradient-text">Milestones</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Recognition and accomplishments that reflect hard work, growth, and resilience.
                    </p>
                </div>

                {/* Achievement Cards */}
                <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                    {achievements.map((item, index) => (
                        <TiltCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-bg-primary/50 to-transparent pointer-events-none" />
            
            <style jsx global>{`
                @keyframes float-particle {
                    0% { transform: translateY(0px) translateX(0px); }
                    100% { transform: translateY(-20px) translateX(10px); }
                }
            `}</style>
        </section>
    );
}
