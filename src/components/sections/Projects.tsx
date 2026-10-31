'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'Error Anti-Cheat',
    type: 'Platform',
    tech: ['Next.js', 'Supabase', 'TypeScript'],
    image: '/projects/error-platform.png',
    link: 'https://github.com/Mr-Harsh-Prasad',
    desc: 'A robust anti-cheat platform built with real-time detection and cloud-backed data.',
  },
  {
    id: 2,
    title: 'TKD AI Coach',
    type: 'AI / ML',
    tech: ['Python', 'MediaPipe', 'OpenCV'],
    image: '/projects/tkd-ai-coach.png',
    link: 'https://github.com/Mr-Harsh-Prasad',
    desc: 'AI-powered Taekwondo coach using pose estimation to give live technique feedback.',
  },
  {
    id: 3,
    title: 'Money Analyzer',
    type: 'Full-Stack',
    tech: ['Django', 'JavaScript', 'Chart.js'],
    image: '/projects/expense-tracker.png',
    link: 'https://money-analyzer.vercel.app',
    desc: 'Smart expense tracker with categorisation charts and budget insights.',
  },
  {
    id: 4,
    title: 'E-Digital Library',
    type: 'Web App',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '/projects/elibrary.png',
    link: 'https://github.com/Mr-Harsh-Prasad',
    desc: 'A clean digital library with search, filtering, and reading progress tracking.',
  },
];

// 3D Tilt Card Component
function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noreferrer"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
        textDecoration: 'none',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group relative rounded-2xl overflow-hidden border border-white/8 bg-bg-glass hover:border-white/20 transition-all duration-300"
    >
      {/* Image area */}
      <div className="relative h-48 w-full overflow-hidden bg-bg-tertiary" style={{ transform: 'translateZ(20px)' }}>
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
        )}
        {/* gradient over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" style={{ transform: 'translateZ(10px)' }} />
        
        {/* type badge */}
        <span className="absolute top-3 left-3 font-mono text-[0.6rem] tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-white/70" style={{ transform: 'translateZ(30px)' }}>
          {project.type}
        </span>

        {/* arrow */}
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300" style={{ transform: 'translateZ(30px)' }}>
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>

        {/* Hover glow overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'translateZ(5px)',
            background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.1) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Text content */}
      <div className="p-5" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-lime-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map(t => (
            <span key={t} className="font-mono text-[0.65rem] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted group-hover:border-lime-400/50 group-hover:text-lime-400 transition-all duration-200">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 3D border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: '0 0 0 1px rgba(204,255,0,0), 0 0 30px rgba(204,255,0,0)',
          borderRadius: 'inherit',
          opacity: isHovered ? 1 : 0,
        }}
        animate={{
          boxShadow: isHovered 
            ? '0 0 0 1px rgba(204,255,0,0.3), 0 0 40px rgba(204,255,0,0.2)' 
            : '0 0 0 1px rgba(204,255,0,0), 0 0 30px rgba(204,255,0,0)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function Projects() {
  return (
    <section id="projects" className="section relative overflow-hidden">
      {/* subtle bg */}
      <div className="bg-projects-theme" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-subtitle gradient-text">Selected Works</span>
          <h2 className="section-title text-text-primary">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm">
            A curated set of projects spanning AI, web, and systems engineering.
          </p>
        </div>

        {/* 2×2 Grid */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto" style={{ perspective: 1000 }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <a
            href="https://github.com/Mr-Harsh-Prasad"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-sm"
          >
            View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}