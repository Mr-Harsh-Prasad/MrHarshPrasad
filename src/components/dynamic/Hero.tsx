'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail, GitBranch, Link as LucideLink, MessageSquare } from 'lucide-react';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  email?: string;
}

export default function Hero({
  title,
  subtitle,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  email,
}: HeroProps) {
  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as Easing } },
  };

  const nameParts = title.split(' ');

  return (
    <section id="hero" className="section relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="mesh-gradient" />
      <div className="grid-pattern" />
      <div className="floating-orbs" />

      {/* Hero Image */}
      {imageUrl && (
        <div className="absolute inset-0 flex items-center justify-end pr-8 lg:pr-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            <div className="aspect-square relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover rounded-2xl border border-white/10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-lime-400 to-cyan-400 opacity-20 blur-3xl" />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="hero-grid relative z-10">
        {/* Left Column */}
        <div className="hero-left">
          <motion.div variants={animationVariants} initial="hidden" animate="visible">
            <div className="hero-badge">
              <span className="relative px-4 py-2 text-sm font-mono text-lime-400 border-l-4 border-lime-400 bg-white/5">
                Hello, I'm
              </span>
            </div>
          </motion.div>

          <motion.div variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <h1 className="hero-name">
              <span className="hero-name-outline">
                {nameParts.map((part, i) => (
                  <span key={i} className="glitch-letter" style={{ '--i': i } as React.CSSProperties}>
                    {part}
                  </span>
                ))}
              </span>
            </h1>
          </motion.div>

          <motion.div variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <p className="gradient-text-flow text-xl max-w-xl">{subtitle}</p>
          </motion.div>

          <motion.div variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <p className="text-gray-400 text-lg max-w-xl">{description}</p>
          </motion.div>

          <motion.div variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <div className="hero-ctas">
              <Link href={ctaLink} className="hero-cta-primary">
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={secondaryCtaLink} className="hero-cta-secondary">
                <Mail className="w-4 h-4" />
                {secondaryCtaText}
              </Link>
            </div>
          </motion.div>

          <motion.div variants={animationVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-lime-400 transition-colors" aria-label="GitHub">
                  <GitBranch className="w-6 h-6" />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-lime-400 transition-colors" aria-label="LinkedIn">
                  <LucideLink className="w-6 h-6" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-lime-400 transition-colors" aria-label="Twitter">
                  <MessageSquare className="w-6 h-6" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-gray-500 hover:text-lime-400 transition-colors" aria-label="Email">
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Placeholder for 3D scene or additional content */}
        <div className="hero-right">
          {!imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md aspect-square"
            >
              <div className="w-full h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
                    <span className="text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-display)' }}>
                      {title.charAt(0)}
                    </span>
                  </div>
                  <p className="text-gray-400">Portfolio Preview</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}