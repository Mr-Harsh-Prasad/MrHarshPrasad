'use client';

import { motion } from 'framer-motion';
import { Code2, Terminal, Database, Cloud, Globe, Shield, Wrench, Zap } from 'lucide-react';

// Framer Motion easing type
type Easing = [number, number, number, number];

interface Skill {
  id: string;
  category: string;
  skillList: string[];
  icon: string | null;
  color: string | null;
  sortOrder: number;
}

interface SkillsProps {
  skills: Skill[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Terminal, Database, Cloud, Globe, Shield, Wrench, Zap,
};

const getIcon = (iconName: string | null) => {
  if (!iconName) return Code2;
  return iconMap[iconName] || Code2;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as Easing } },
};

export default function Skills({ skills }: SkillsProps) {
  if (!skills.length) return null;

  return (
    <section id="skills" className="section relative">
      <div className="bg-code-theme" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <span className="section-subtitle">Skills</span>
          <h2 className="section-title gradient-text">Technical Stack</h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Technologies and tools I work with to build modern web applications.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill) => {
            const Icon = getIcon(skill.icon);
            return (
              <motion.article
                key={skill.id}
                variants={itemVariants}
                className="shiny-card p-6"
                style={{ borderColor: skill.color ? `${skill.color}40` : 'transparent' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: skill.color ? `${skill.color}20` : 'rgba(204, 255, 0, 0.1)' }}
                  >
                    <Icon className="w-7 h-7" style={{ color: skill.color || '#ccff00' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{skill.category}</h3>
                    <p className="text-sm text-gray-400">{skill.skillList.length} technologies</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skill.skillList.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-lime-400/50 hover:text-lime-400 transition-all"
                      style={{ borderColor: skill.color ? `${skill.color}40` : 'rgba(255,255,255,0.1)' }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}