'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navigation links configuration
 */
const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
];

/**
 * Navbar - Sticky glassmorphic navigation with mobile menu
 */
export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Determine active section
            const sections = navLinks.map(link => link.href.slice(1));
            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle smooth scroll navigation
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.slice(1);
        const element = document.getElementById(targetId);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <>
            {/* Skip to content link for accessibility */}
            <a
                href="#about"
                className="skip-to-content"
                onClick={(e) => handleNavClick(e, '#about')}
            >
                Skip to main content
            </a>

            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'py-3 bg-bg-primary/80 backdrop-blur-xl border-b border-border'
                        : 'py-5 bg-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <nav className="container flex items-center justify-between" aria-label="Main navigation">
                    {/* Logo */}
                    <motion.a
                        href="#hero"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xl font-bold gradient-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Go to top of page"
                    >
                        MHP
                    </motion.a>

                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-1" role="menubar">
                        {navLinks.map((link) => (
                            <li key={link.name} role="none">
                                <a
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    role="menuitem"
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${activeSection === link.href.slice(1)
                                            ? 'text-text-primary'
                                            : 'text-text-muted hover:text-text-secondary'
                                        }`}
                                >
                                    {link.name}
                                    {activeSection === link.href.slice(1) && (
                                        <motion.div
                                            className="absolute inset-0 bg-bg-tertiary rounded-lg -z-10"
                                            layoutId="activeSection"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative w-10 h-10 flex items-center justify-center text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <div className="relative w-6 h-5">
                            <motion.span
                                className="absolute left-0 w-6 h-0.5 bg-current rounded-full"
                                animate={{
                                    top: isMobileMenuOpen ? '50%' : '0%',
                                    rotate: isMobileMenuOpen ? 45 : 0,
                                    translateY: isMobileMenuOpen ? '-50%' : 0,
                                }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.span
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-current rounded-full"
                                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                            />
                            <motion.span
                                className="absolute left-0 w-6 h-0.5 bg-current rounded-full"
                                animate={{
                                    bottom: isMobileMenuOpen ? '50%' : '0%',
                                    rotate: isMobileMenuOpen ? -45 : 0,
                                    translateY: isMobileMenuOpen ? '50%' : 0,
                                }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                    </button>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Mobile Menu */}
                        <motion.nav
                            id="mobile-menu"
                            className="fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary/95 backdrop-blur-xl z-50 md:hidden border-l border-border"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            aria-label="Mobile navigation"
                        >
                            <div className="flex flex-col h-full pt-20 px-6">
                                <ul className="space-y-2" role="menu">
                                    {navLinks.map((link, index) => (
                                        <motion.li
                                            key={link.name}
                                            role="none"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleNavClick(e, link.href)}
                                                role="menuitem"
                                                className={`block py-3 px-4 text-lg font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${activeSection === link.href.slice(1)
                                                        ? 'text-text-primary bg-bg-tertiary'
                                                        : 'text-text-muted hover:text-text-secondary hover:bg-bg-tertiary/50'
                                                    }`}
                                            >
                                                {link.name}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Decorative gradient */}
                                <div className="mt-auto mb-8">
                                    <div className="h-px bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent mb-4" />
                                    <p className="text-center text-text-muted text-sm">
                                        Mr Harsh Prasad
                                    </p>
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
