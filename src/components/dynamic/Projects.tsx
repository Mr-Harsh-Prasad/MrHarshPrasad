'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GitBranch, ExternalLink, Code2 } from 'lucide-react';

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
  techStack: string[];
  liveLink: string | null;
  githubLink: string | null;
  isFeatured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
};

export default function Projects({ projects }: ProjectsProps) {
  if (!projects.length) return null;

  const featuredProjects = projects.filter(p => p.isFeatured);
  const regularProjects = projects.filter(p => !p.isFeatured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : regularProjects;

  return (
    <section id="projects" className="section relative">
      <div className="bg-projects-theme" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <span className="section-subtitle">Projects</span>
          <h2 className="section-title gradient-text">Selected Work</h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            A collection of projects I've built, showcasing various technologies and problem-solving approaches.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {displayProjects.map((project, index) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              className="group relative"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="block shiny-card h-full group p-6"
              >
                {/* Project Image */}
                {(project.thumbnailUrl || project.imageUrl) && (
                  <div className="relative aspect-video mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={project.thumbnailUrl || project.imageUrl!}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {project.isFeatured && (
                      <span className="absolute top-4 left-4 px-2 py-1 text-xs font-medium bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                )}

                {/* Project Content */}
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-lime-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">
                    {project.shortDescription || project.description.slice(0, 150)}...
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 6).map((tech, i) => (
                      <span key={i} className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-lime-400/50 hover:text-lime-400 transition-colors">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 6 && (
                      <span className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-500">
                        +{project.techStack.length - 6}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-lime-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        Live Demo
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-lime-400 transition-colors"
                      >
                        <GitBranch className="w-4 h-4 flex-shrink-0" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {regularProjects.length > featuredProjects.length && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
              View All Projects
              <Code2 className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}