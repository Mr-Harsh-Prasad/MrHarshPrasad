'use client';

import { motion } from 'framer-motion';

const skills = [
  { name: 'HTML',   level: 92, category: 'Markup Language',   color: '#e34f26', icon: '</>' },
  { name: 'CSS',    level: 85, category: 'Styling Language',  color: '#264de4', icon: '{}' },
  { name: 'Python', level: 75, category: 'AI & Backend',      color: '#f5c518', icon: 'Py' },
  { name: 'Java',   level: 65, category: 'Enterprise',        color: '#f97316', icon: 'Jv' },
  { name: 'C',      level: 80, category: 'Systems Language',  color: '#3b82f6', icon: 'C' },
];

export default function Skills() {
  return (
    <section id="skills" className="section relative overflow-hidden">
      <div className="bg-code-theme" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-subtitle gradient-text">Expertise</span>
          <h2 className="section-title text-text-primary">
            Tech <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mt-3 text-sm">
            Languages I work with regularly.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="card relative overflow-hidden cursor-default group"
            >
              {/* Background glow on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${skill.color}18 0%, transparent 65%)`,
                }}
              />

              {/* Top row: icon + percentage */}
              <div className="flex items-start justify-between mb-4">
                {/* Icon badge */}
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black font-mono"
                  style={{
                    background: `${skill.color}18`,
                    border: `1px solid ${skill.color}40`,
                    color: skill.color,
                  }}
                >
                  {skill.icon}
                </span>

                {/* Big percentage */}
                <span
                  className="text-3xl font-black tabular-nums leading-none"
                  style={{ color: skill.color }}
                >
                  {skill.level}
                  <span className="text-base font-semibold text-white/25">%</span>
                </span>
              </div>

              {/* Name + category */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">{skill.name}</h3>
                <span
                  className="font-mono text-[0.62rem] tracking-widest uppercase"
                  style={{ color: skill.color }}
                >
                  {skill.category}
                </span>
              </div>

              {/* Progress bar */}
              <div className="skill-bar-track">
                <motion.div
                  className="skill-bar-fill"
                  style={{
                    background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
                    boxShadow: `0 0 10px ${skill.color}60`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: skill.level / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                />
              </div>

              {/* Left accent border that grows on hover */}
              <motion.div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to bottom, transparent, ${skill.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
