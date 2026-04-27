'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
    { name: 'C', tag: 'Programming', level: 0.82 },
    { name: 'Python', tag: 'Programming', level: 0.75 },
    { name: 'Java', tag: 'Programming', level: 0.65 },
    { name: 'HTML & CSS', tag: 'Web', level: 0.88 },
    { name: 'JavaScript', tag: 'Web', level: 0.72 },
    { name: 'DSA', tag: 'Algorithms', level: 0.68 },
    { name: 'Kali Linux', tag: 'Security', level: 0.70 },
    { name: 'Network Security', tag: 'Security', level: 0.65 },
    { name: 'Wireshark', tag: 'Security', level: 0.60 },
];

/**
 * Skills Section — horizontal bar list with animated fill.
 */
export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title entrance
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            // Animate each skill row on scroll into view
            const bars = sectionRef.current?.querySelectorAll('.skill-bar-fill');
            bars?.forEach((bar, i) => {
                const level = skills[i]?.level ?? 0.5;
                ScrollTrigger.create({
                    trigger: bar.parentElement,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.to(bar, {
                            scaleX: level,
                            duration: 1.4,
                            ease: 'expo.out',
                            delay: i * 0.06,
                        });
                    },
                    onLeaveBack: () => {
                        gsap.to(bar, { scaleX: 0, duration: 0.4, ease: 'power2.in' });
                    },
                });
            });

            // Stagger rows
            const rows = listRef.current?.children;
            if (rows) {
                gsap.fromTo(
                    rows,
                    { opacity: 0, x: -30 },
                    {
                        opacity: 1, x: 0, stagger: 0.07, duration: 0.8, ease: 'expo.out',
                        scrollTrigger: {
                            trigger: listRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="skills" className="section bg-bg-secondary">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left: header */}
                    <div ref={titleRef}>
                        <span className="section-subtitle">Technical Skills</span>
                        <h2 className="section-title text-text-primary mb-6">
                            What I<br />
                            <span className="gradient-text">Work With.</span>
                        </h2>
                        <p className="text-text-secondary max-w-sm leading-relaxed">
                            Languages and tools I&apos;ve trained with — each one practiced with intention,
                            not just memorized.
                        </p>
                    </div>

                    {/* Right: skill bars */}
                    <div ref={listRef} className="space-y-6">
                        {skills.map((skill) => (
                            <div key={skill.name} className="group">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-text-primary font-semibold text-sm">
                                        {skill.name}
                                    </span>
                                    <span className="text-text-muted text-[10px] mono uppercase tracking-widest">
                                        {skill.tag}
                                    </span>
                                </div>
                                <div className="skill-bar-track">
                                    <div className="skill-bar-fill" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* bg decorations */}
            <div className="bg-code-theme" />
            <div className="grid-pattern opacity-30" />
        </section>
    );
}
