'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Calendar, ExternalLink, Copy } from 'lucide-react';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface Achievement {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  imageUrl: string | null;
  credentialUrl: string | null;
  credentialId: string | null;
  issueDate: string | null;
  expiryDate: string | null;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
};

export default function Achievements({ achievements }: AchievementsProps) {
  if (!achievements.length) return null;

  return (
    <section id="achievements" className="section relative">
      <div className="bg-code-theme" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="section-subtitle">Achievements</span>
          <h2 className="section-title gradient-text">Certifications & Awards</h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Professional certifications and recognitions that validate my expertise.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {achievements.map((ach) => (
            <motion.article
              key={ach.id}
              variants={itemVariants}
              className="shiny-card relative overflow-hidden"
            >
              <div className="flex gap-6">
                {/* Certificate Image */}
                {ach.imageUrl && (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <Image
                      src={ach.imageUrl}
                      alt={ach.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-lime-400" />
                      <h3 className="font-bold text-lg">{ach.title}</h3>
                    </div>
                    {ach.issuer && (
                      <p className="text-lime-400 font-medium mb-2">{ach.issuer}</p>
                    )}
                    {ach.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{ach.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {ach.issueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Issued: {formatDate(ach.issueDate)}
                        </span>
                      )}
                      {ach.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires: {formatDate(ach.expiryDate)}
                        </span>
                      )}
                      {ach.credentialId && (
                        <span className="flex items-center gap-1 font-mono">
                          ID: {ach.credentialId}
                        </span>
                      )}
                    </div>
                  </div>

                  {(ach.credentialUrl || ach.credentialId) && (
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      {ach.credentialUrl && (
                        <a
                          href={ach.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:border-lime-400/50 hover:text-lime-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Verify Credential
                        </a>
                      )}
                      {ach.credentialId && (
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:border-lime-400/50 hover:text-lime-400 transition-colors"
                          onClick={() => navigator.clipboard.writeText(ach.credentialId!)}
                        >
                          <Copy className="w-4 h-4" />
                          Copy ID
                        </button>
                      )}
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