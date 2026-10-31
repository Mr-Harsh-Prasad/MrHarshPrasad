'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, GitBranch, ExternalLink, Code2, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  techStack: string[] | null;
  liveLink: string | null;
  githubLink: string | null;
  demoVideoUrl: string | null;
  isFeatured: boolean | null;
  sortOrder: number | null;
  isVisible: boolean | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectDetailProps {
  project: Project;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return format(new Date(dateStr), 'MMMM d, yyyy');
};

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
  };

  return (
    <article className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end">
        {project.imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
          </div>
        )}

        <div className="container relative z-10 pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Projects
            </Link>

            <div className="max-w-4xl">
              {project.isFeatured === true && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded-full mb-4">
                  Featured Project
                </span>
              )}

              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}</span>
                  </div>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{project.techStack.length} technologies</span>
                  </div>
                )}
              </div>

              {project.shortDescription && (
                <p className="text-xl text-gray-300 max-w-2xl mb-8">{project.shortDescription}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section relative">
        <div className="bg-code-theme" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
                <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                  <h2 className="section-title gradient-text mb-6">About This Project</h2>
                  <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </div>
                </motion.div>

                {project.techStack && project.techStack.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <h3 className="font-display text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-lime-400/50 hover:text-lime-400 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {project.demoVideoUrl && (
                  <motion.div variants={itemVariants}>
                    <h3 className="font-display text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                      Demo Video
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <iframe
                        src={project.demoVideoUrl}
                        title={`${project.title} Demo`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="shiny-card p-6 sticky top-24"
              >
                <h3 className="font-display text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                  Project Links
                </h3>

                <div className="space-y-3">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full btn-primary justify-center"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </a>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full btn-secondary justify-center"
                    >
                      <GitBranch className="w-5 h-5" />
                      View Source Code
                    </a>
                  )}

                  {!project.liveLink && !project.githubLink && (
                    <p className="text-gray-500 text-center py-4">No external links available</p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <h4 className="font-medium text-sm text-gray-400 mb-4 uppercase tracking-wider">Project Timeline</h4>
                  <dl className="space-y-3 text-sm">
                    {project.startDate && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Started</dt>
                        <dd className="text-white font-medium">{formatDate(project.startDate)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Status</dt>
                      <dd className="text-white font-medium">{project.endDate ? 'Completed' : 'In Progress'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Last Updated</dt>
                      <dd className="text-white font-medium">{formatDate(project.updatedAt)}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative border-t border-white/10">
        <div className="bg-code-theme" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Interested in working together?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects, collaborations, or opportunities.
            </p>
            <Link href="#contact" className="btn-primary inline-flex items-center gap-2">
              Get In Touch
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </article>
  );
}