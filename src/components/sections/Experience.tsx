'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Certifications data
const certifications = [
    {
        title: 'Web Exploit Hunting & Bug Bounty',
        type: 'Internship · EDU Skills',
        icon: '🔐',
        color: 'from-red-500 to-orange-400',
        description: 'Learning web security concepts, vulnerability assessment, and participating in bug bounty programs.',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_cybersecurity-bugbounty-websecurity-activity-7409989219709976577-C92n',
    },
    {
        title: 'AR VR Development using Unity',
        type: 'Internship · EDU Skills',
        icon: '🥽',
        color: 'from-purple-500 to-blue-400',
        description: 'Hands-on development of Augmented Reality and Virtual Reality applications using the Unity game engine.',
        certificateUrl: 'https://www.linkedin.com/posts/mrharshprasad_ar-vr-unity-activity-7437848146652766208-ipfL',
    },
];

// Interactive Tilt Card for Certification
function CertCard({ exp, index, onOpenModal }: { exp: typeof certifications[0], index: number, onOpenModal: () => void }) {
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

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        
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
            onClick={onOpenModal}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="relative h-full perspective-1000 cursor-pointer"
        >
            <div className="card relative h-full overflow-hidden group border border-white/5 bg-bg-tertiary/50 backdrop-blur-sm transition-colors duration-500 hover:border-white/20">
                {/* 3D content container */}
                <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 p-2">
                    {/* Icon */}
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">{exp.icon}</div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary mb-1">{exp.title}</h3>
                    <span className="text-sm text-accent-primary mb-3 block">{exp.type}</span>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-4">{exp.description}</p>

                    <div className="inline-flex items-center gap-1.5 text-sm text-text-muted group-hover:text-white transition-colors mt-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview Certificate
                    </div>
                </div>

                {/* Hover gradient background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-10`}
                />

                {/* Decorative corner glow */}
                <div
                    className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${exp.color} opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                />
            </div>
        </motion.div>
    );
}

/**
 * Certifications Section - Certifications and learning achievements
 */
export default function Certifications() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null);

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

    // Lock scroll when modal is open
    useEffect(() => {
        if (selectedCert) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [selectedCert]);

    return (
        <section ref={sectionRef} id="certifications" className="section relative">
            <div className="container relative z-10">
                {/* Section Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <span className="section-subtitle gradient-text">Certifications</span>
                    <h2 className="section-title text-text-primary">
                        My <span className="gradient-text">Certifications</span>
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto mt-4">
                        Certifications and credentials I've earned through dedicated learning and practice.
                    </p>
                </div>

                {/* Certification Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {certifications.map((exp, index) => (
                        <CertCard 
                            key={exp.title} 
                            exp={exp} 
                            index={index} 
                            onOpenModal={() => setSelectedCert(exp)} 
                        />
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-bg-secondary border border-white/10 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative modal glow */}
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedCert.color} opacity-10 blur-[80px] pointer-events-none rounded-full`} />
                            
                            <button 
                                onClick={() => setSelectedCert(null)}
                                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white z-10"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-6xl mb-6 relative z-10">{selectedCert.icon}</div>
                            
                            <h3 className="text-3xl font-bold text-white mb-2 relative z-10">{selectedCert.title}</h3>
                            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm text-accent-primary mb-6 relative z-10">
                                {selectedCert.type}
                            </span>
                            
                            <p className="text-text-secondary text-lg mb-8 leading-relaxed relative z-10">
                                {selectedCert.description}
                            </p>
                            
                            <a 
                                href={selectedCert.certificateUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <span>View Official Certificate</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Security Themed Background */}
            <div className="bg-security-theme" />
        </section>
    );
}
