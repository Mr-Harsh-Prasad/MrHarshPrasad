'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, Code2, CheckCircle } from 'lucide-react';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  achievements: string[];
  techStack: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  companyLogoUrl: string | null;
  companyUrl: string | null;
}

interface ExperienceProps {
  experiences: Experience[];
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Present';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
};

export default function Experience({ experiences }: ExperienceProps) {
  if (!experiences.length) return null;

  return (
    <section id="experience" className="section relative">
      <div className="bg-code-theme" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <span className="section-subtitle">Experience</span>
          <h2 className="section-title gradient-text">Professional Journey</h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Companies and roles that have shaped my career in software engineering.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6 lg:space-y-8"
        >
          {experiences.map((exp, index) => (
            <motion.article
              key={exp.id}
              variants={itemVariants}
              className="shiny-card relative p-6 lg:p-8"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-8 w-4 h-4 rounded-full bg-lime-400 border-4 border-black z-10" />
              <div className="absolute left-2 top-12 bottom-0 w-0.5 bg-white/10" style={{ display: index === experiences.length - 1 ? 'none' : 'block' }} />

              <div className="pl-8 lg:pl-20">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {exp.companyLogoUrl && (
                      <a href={exp.companyUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                        <Image
                          src={exp.companyLogoUrl}
                          alt={exp.company}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </a>
                    )}
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <span className="px-3 py-1 text-xs font-medium bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded-full">
                          {exp.company}
                        </span>
                        {exp.isCurrent && (
                          <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-gray-400 mb-6 pl-8 lg:pl-20 max-w-3xl leading-relaxed">{exp.description}</p>
                )}

                {exp.achievements.length > 0 && (
                  <div className="pl-8 lg:pl-20 mb-6">
                    <h4 className="font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">Key Achievements</h4>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.techStack.length > 0 && (
                  <div className="pl-8 lg:pl-20">
                    <h4 className="font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech, i) => (
                        <span key={i} className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}