'use client';

import { useEffect, useRef, useState, useId } from 'react';
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
    const inputId = useId();

    const InputComponent = textarea ? 'textarea' : 'input';

    return (
        <div className="relative">
            <InputComponent
                id={inputId}
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
                htmlFor={inputId}
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
        href: 'https://github.com/Mr-Harsh-Prasad',
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mrharshprasad',
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/mr_harshprasad',
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        name: 'Threads',
        href: 'https://www.threads.com/@mr_harshprasad',
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.132-1.13 3.528-1.13h.09c.653.007 1.28.07 1.867.19-.054-.558-.142-1.09-.26-1.574l2.006-.461c.203.878.328 1.858.367 2.91l.005.106c.053 1.086.027 2.135-.076 3.127-.122 1.17-.39 2.207-.8 3.087-.857 1.837-2.266 3.12-4.085 3.714-1.159.378-2.456.544-3.873.542zm1.16-8.093c-.94 0-1.79.216-2.4.61-.515.33-.788.749-.768 1.18.02.37.207.687.557.942.462.336 1.165.522 1.98.476 1.053-.057 1.876-.453 2.447-1.176.392-.497.662-1.166.802-1.996-.68-.02-1.392-.036-2.12-.036h-.498z" />
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            // Submit to Formspree
            const response = await fetch('https://formspree.io/f/mnjjabdz', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setIsSubmitted(true);
                form.reset();
                // Reset success message after 5 seconds
                setTimeout(() => setIsSubmitted(false), 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error sending your message. Please try again or email me directly.');
        } finally {
            setIsSubmitting(false);
        }
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
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social) => (
                                <MagneticButton
                                    key={social.name}
                                    href={social.href}
                                    className="p-5 rounded-2xl glass hover:border-accent-primary transition-all duration-300 hover:scale-105"
                                >
                                    <span className="text-text-secondary hover:text-accent-primary transition-colors">
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
                                <span>mrharshprasad@outlook.com</span>
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
                        {/* Honeypot field for spam protection */}
                        <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

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

            {/* Contact Themed Background */}
            <div className="bg-contact-theme" />
        </section>
    );
}
