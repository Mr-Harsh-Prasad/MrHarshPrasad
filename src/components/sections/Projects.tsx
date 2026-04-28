'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const projects = [
    {
        id: 1,
        title: 'Error Anti-Cheat',
        type: 'Platform',
        tech: ['Next.js', 'Supabase'],
        image: '/projects/error-platform.png',
        link: 'https://github.com/Mr-Harsh-Prasad',
    },
    {
        id: 2,
        title: 'TKD AI Coach',
        type: 'AI/ML',
        tech: ['Python', 'MediaPipe'],
        image: '/projects/tkd-ai-coach.png',
        link: 'https://github.com/Mr-Harsh-Prasad',
    },
    {
        id: 3,
        title: 'Money Analyzer',
        type: 'Full-Stack',
        tech: ['Django', 'JavaScript'],
        image: '/projects/expense-tracker.png',
        link: 'https://money-analyzer.vercel.app',
    },
    {
        id: 4,
        title: 'E-Digital Library',
        type: 'Web App',
        tech: ['HTML', 'JS'],
        image: '/projects/elibrary.png',
        link: 'https://github.com/Mr-Harsh-Prasad',
    }
];

const DeepSpaceCard = ({ 
    project, 
    index, 
    progress 
}: { 
    project: typeof projects[0]; 
    index: number; 
    progress: MotionValue<number>;
}) => {
    
    const step = 1 / projects.length;
    const start = index * step;
    const peak = start + (step / 2);
    const end = start + step;

    // Expand the window so cards are visible longer
    const appearStart = Math.max(0, start - (step * 1.5));
    const disappearEnd = Math.min(1, end + (step * 0.5));

    // Scale mapping: 0.05 (tiny) -> 1 (focus) -> 5 (flies past screen)
    const scale = useTransform(
        progress,
        [appearStart, peak, disappearEnd],
        [0.05, 1, 5]
    );

    // Opacity: fades in slowly, stays solid at peak, quickly fades out as it flies past
    const opacity = useTransform(
        progress,
        [appearStart, peak - 0.1, peak, peak + 0.1, disappearEnd],
        [0, 1, 1, 0, 0]
    );

    // Blur: blurry in distance -> sharp at peak -> extremely blurry as it flies past
    const blur = useTransform(
        progress,
        [appearStart, peak, peak + 0.1, disappearEnd],
        ["blur(30px)", "blur(0px)", "blur(20px)", "blur(50px)"]
    );

    // Dynamic Z-Index: ensure the card closest to the screen (highest scale) is on top
    const zIndexRaw = useTransform(progress, [appearStart, peak, disappearEnd], [0, 50, 100]);
    const zIndex = useTransform(zIndexRaw, val => Math.round(val));

    return (
        <motion.div
            style={{ 
                scale, 
                opacity,
                filter: blur,
                zIndex
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <div className="w-[85vw] md:w-[70vw] lg:w-[60vw] h-[60vh] md:h-[70vh] relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-lg shadow-[0_0_150px_rgba(0,0,0,0.8)] flex flex-col justify-end p-8 md:p-16 pointer-events-auto group cursor-pointer">
                
                {/* Background Image */}
                {project.image ? (
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 filter group-hover:contrast-125"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e63946]/20 to-transparent" />
                )}

                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

                {/* Content */}
                <div className="relative z-10">
                    <span className="text-[#e63946] font-mono tracking-widest text-sm md:text-base uppercase font-semibold mb-4 block drop-shadow-md">
                        Sequence // 0{index + 1}
                    </span>
                    <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
                        {project.title}
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center justify-between border-t border-white/10 pt-6">
                        <div className="flex flex-wrap gap-3">
                            {project.tech.map(t => (
                                <span key={t} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-xs md:text-sm font-mono tracking-wider">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#e63946] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Map scroll progress across the huge 400vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <section ref={containerRef} id="projects" className="relative h-[400vh] bg-black">
            
            {/* Sticky Space Viewer */}
            <div 
                className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
                style={{ perspective: '2000px' }}
            >
                
                {/* Parallax Starfield / Grid Background */}
                <div 
                    className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" 
                    style={{ transform: 'translateZ(-1000px) scale(3)' }} 
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.05),_transparent_70%)] pointer-events-none" />
                
                {/* Title overlay (fades out instantly as you start scrolling) */}
                <motion.div 
                    className="absolute top-16 md:top-32 left-0 w-full text-center z-50 pointer-events-none"
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
                        y: useTransform(scrollYProgress, [0, 0.05], [0, -50])
                    }}
                >
                    <span className="text-[#e63946] font-mono tracking-widest text-xs md:text-sm uppercase font-semibold">02 // Selected Works</span>
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white tracking-tighter mt-4 drop-shadow-2xl">
                        Deep <span className="text-white/30 italic">Space.</span>
                    </h2>
                    <p className="text-white/40 mono mt-6 uppercase tracking-widest text-xs md:text-sm animate-pulse">
                        Scroll to initiate sequence
                    </p>
                </motion.div>

                {/* Render the Deep Space Cards */}
                {projects.map((project, i) => (
                    <DeepSpaceCard 
                        key={project.id} 
                        project={project} 
                        index={i} 
                        progress={scrollYProgress} 
                    />
                ))}

            </div>
        </section>
    );
}
