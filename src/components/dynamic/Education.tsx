'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, Award, MapPin, BookOpen } from 'lucide-react';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  institutionLogoUrl: string | null;
  institutionUrl: string | null;
  grade: string | null;
}

interface EducationProps {
  educations: Education[];
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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
};

export default function Education({ educations }: EducationProps) {
  if (!educations.length) return null;

  return (
    <section id="education" className="section relative">
      <div className="bg-code-theme" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="section-subtitle">Education</span>
          <h2 className="section-title gradient-text">Academic Background</h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Formal education and continuous learning that built my technical foundation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-8"
        >
          {educations.map((edu, index) => (
            <motion.article
              key={edu.id}
              variants={itemVariants}
              className="shiny-card"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {edu.institutionLogoUrl && (
                  <a href={edu.institutionUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                    <Image
                      src={edu.institutionLogoUrl}
                      alt={edu.institution}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </a>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    {edu.fieldOfStudy && (
                      <span className="px-3 py-1 text-sm font-medium bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded-full">
                        {edu.fieldOfStudy}
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-lime-400 font-medium mb-1">{edu.institution}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(edu.startDate)} - {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    )}
                    {edu.grade && (
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Grade: {edu.grade}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-gray-400 mb-4">{edu.description}</p>
                  )}

                  {edu.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-400 mb-2 uppercase tracking-wider">Achievements</h4>
                      <ul className="space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <BookOpen className="w-4 h-4 text-lime-400 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}