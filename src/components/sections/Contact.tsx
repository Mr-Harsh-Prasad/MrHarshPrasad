'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedInput - Form input with focus animations
 */
function AnimatedInput({
    label,
    type = 'text',
    name,
    required = false,
    textarea = false,
}: {
    label: string;
    type?: string;
    name: string;
    required?: boolean;
    textarea?: boolean;
}) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const InputComponent = textarea ? 'textarea' : 'input';

    return (
        <div className="relative">
            <InputComponent
                type={type}
                name={name}
                required={required}
                className={`input ${textarea ? 'textarea' : ''} peer`}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    setHasValue(e.target.value.length > 0);
                }}
                placeholder=" "
            />
            <motion.label
                className="absolute left-4 top-4 text-text-muted pointer-events-none origin-left"
                animate={{
                    y: isFocused || hasValue ? -28 : 0,
                    scale: isFocused || hasValue ? 0.85 : 1,
                    color: isFocused ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {label}
            </motion.label>
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-primary to-accent-secondary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isFocused ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ originX: 0 }}
            />
        </div>
    );
}

// Social links data
const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
    {
        name: 'Email',
        href: 'mailto:harsh.kumar@example.com',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
    },
];

/**
 * Contact Section - Contact form with social links
 */
export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );

            if (formRef.current) {
                gsap.fromTo(
                    formRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: formRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset after showing success
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <section ref={sectionRef} id="contact" className="section bg-bg-secondary">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Side - Info */}
                    <div ref={titleRef}>
                        <span className="section-subtitle gradient-text">Get in Touch</span>
                        <h2 className="section-title text-text-primary mb-6">
                            Let&apos;s Work <span className="gradient-text">Together</span>
                        </h2>
                        <p className="text-text-secondary mb-8">
                            Have a project in mind or just want to chat? Feel free to reach out.
                            I&apos;m always open to discussing new opportunities and ideas.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <MagneticButton
                                    key={social.name}
                                    href={social.href}
                                    className="p-4 rounded-xl glass hover:border-accent-primary transition-colors duration-300"
                                >
                                    <span className="text-text-secondary hover:text-text-primary transition-colors">
                                        {social.icon}
                                    </span>
                                </MagneticButton>
                            ))}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-text-secondary">
                                <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span>harsh.kumar@example.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span>India</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <motion.form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="glass p-8 space-y-6"
                    >
                        <AnimatedInput label="Your Name" name="name" required />
                        <AnimatedInput label="Your Email" type="email" name="email" required />
                        <AnimatedInput label="Subject" name="subject" />
                        <AnimatedInput label="Your Message" name="message" required textarea />

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="btn-primary w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting || isSubmitted}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : isSubmitted ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Message Sent!
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Send Message
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            )}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
