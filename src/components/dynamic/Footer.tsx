'use client';

import Link from 'next/link';
import { GitBranch, Link as LucideLink, MessageSquare, Mail, Heart, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FooterProps {
  footerText: string;
  footerShowGithub: boolean;
  footerShowLinkedin: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  email?: string;
  siteTitle?: string;
}

export default function Footer({
  footerText,
  footerShowGithub,
  footerShowLinkedin,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  email,
  siteTitle,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section relative border-t border-white/10 pt-16 pb-12">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <span className="font-display text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {siteTitle?.split('|')[0]?.trim() || 'Harsh Prasad'}
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {footerText || 'Building accessible, performant web experiences with modern technologies.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {footerShowGithub && githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="GitHub">
                  <GitBranch className="w-6 h-6" />
                </a>
              )}
              {footerShowLinkedin && linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="LinkedIn">
                  <LucideLink className="w-6 h-6" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="Twitter">
                  <MessageSquare className="w-6 h-6" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-gray-400 hover:text-lime-400 transition-colors p-2 rounded-lg hover:bg-white/5" aria-label="Email">
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 lg:mb-6">Quick Links</h4>
            <nav className="space-y-3 lg:space-y-4">
              <Link href="#hero" className="text-gray-400 hover:text-lime-400 transition-colors block">Home</Link>
              <Link href="#projects" className="text-gray-400 hover:text-lime-400 transition-colors block">Projects</Link>
              <Link href="#experience" className="text-gray-400 hover:text-lime-400 transition-colors block">Experience</Link>
              <Link href="#skills" className="text-gray-400 hover:text-lime-400 transition-colors block">Skills</Link>
              <Link href="#contact" className="text-gray-400 hover:text-lime-400 transition-colors block">Contact</Link>
            </nav>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Get notified about new projects, blog posts, and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="your@email.com"
                className="flex-1"
                aria-label="Email address"
              />
              <Button type="submit" className="gap-2">
                <Mail className="w-4 h-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 lg:pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">
            <p className="text-gray-500 text-sm">
              © {currentYear} {siteTitle?.split('|')[0]?.trim() || 'Harsh Prasad'}. All rights reserved.
            </p>
            <div className="flex items-center gap-3 lg:gap-4 text-sm text-gray-500">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>Next.js, React & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}