'use client';

import { useEffect, useRef, useState } from 'react';
import HeroScene3D from '@/components/3d/HeroScene3D';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    // Set initial value after mount to avoid sync setState in effect
    setTimeout(() => setIsReducedMotion(mediaQuery.matches), 0);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-animate]');
    items?.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 1s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 100);
      });
    });
  }, [isMounted]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero introduction"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 3D Scene */}
      <HeroScene3D isReducedMotion={isReducedMotion} />

      {/* Subtle atmospheric overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(204,255,0,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(0,255,204,0.02) 0%, transparent 40%),
            linear-gradient(to bottom, rgba(3,3,3,0.8) 0%, transparent 60%, rgba(3,3,3,0.9) 100%)
          `,
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" style={{ opacity: 0.15, zIndex: 1 }} />

      {/* Content grid */}
      <div className="hero-grid" style={{ zIndex: 10 }}>

        {/* LEFT — Name + CTAs */}
        <div className="hero-left">
          {/* Eyebrow */}
          <div data-animate style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-block', width: '2.5rem', height: '1px',
              background: 'linear-gradient(to right, transparent, #ccff00, transparent)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #ccff00, #00ffcc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 500,
            }}>
              DEVELOPER · ATHLETE · HACKER
            </span>
          </div>

          {/* Main heading */}
          <h1 data-animate style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            margin: 0,
            fontWeight: 400,
            textTransform: 'uppercase',
          }}>
            <span className="hero-name">HARSH</span>
            <br />
            <span className="hero-name">PRASAD</span>
          </h1>

          {/* Divider */}
          <div data-animate style={{
            width: 'clamp(4rem, 10vw, 6rem)',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #ccff00, transparent)',
            marginTop: '0.5rem',
          }} />

          {/* Role */}
          <p data-animate style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'rgba(245,245,245,0.7)',
            lineHeight: 1.6,
            maxWidth: '30rem',
            margin: 0,
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}>
            Full-Stack Developer & Cybersecurity Enthusiast
            <br />
            <span style={{ color: 'rgba(204,255,0,0.8)' }}>Blending code, discipline, and creativity.</span>
          </p>

          {/* CTAs */}
          <div data-animate className="hero-ctas" style={{ marginTop: '1rem' }}>
            <a
              href="#contact"
              className="hero-cta-primary"
              style={{
                background: 'linear-gradient(135deg, #ccff00, #88ff44)',
                color: '#030303',
                boxShadow: '0 0 30px rgba(204, 255, 0, 0.4)',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.transform = 'translateY(-3px) scale(1.02)';
                target.style.boxShadow = '0 0 50px rgba(204, 255, 0, 0.6), 0 10px 30px rgba(204, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 0 30px rgba(204, 255, 0, 0.4)';
              }}
            >
              Let&apos;s Connect
            </a>
            <a
              href="#projects"
              className="hero-cta-secondary"
              style={{
                background: 'transparent',
                color: 'rgba(245,245,245,0.9)',
                borderColor: 'rgba(204,255,0,0.4)',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'rgba(204,255,0,0.08)';
                target.style.borderColor = '#ccff00';
                target.style.boxShadow = '0 0 20px rgba(204, 255, 0, 0.3)';
                target.style.color = '#ccff00';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'transparent';
                target.style.borderColor = 'rgba(204,255,0,0.4)';
                target.style.boxShadow = 'none';
                target.style.color = 'rgba(245,245,245,0.9)';
              }}
            >
              Explore My Work
            </a>
          </div>

          {/* Profile links */}
          <div data-animate style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '1.5rem' }}>
            {[
              {
                label: 'LeetCode',
                href: 'https://leetcode.com/u/Mr_Harsh_Prasad/',
                title: 'LeetCode',
                svg: (
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                  </svg>
                ),
              },
              {
                label: 'Credly',
                href: 'https://www.credly.com/users/harsh-kumar.7b2ddf1c',
                title: 'Credly Badges',
                svg: (
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zm0 2.25a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zm0 1.5a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5z"/>
                  </svg>
                ),
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Mr-Harsh-Prasad',
                title: 'GitHub',
                svg: (
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                ),
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/mrharshprasad/',
                title: 'LinkedIn',
                svg: (
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
              },
              {
                label: 'GFG',
                href: 'https://www.geeksforgeeks.org/user/harshprasad2005/',
                title: 'GeeksforGeeks',
                svg: (
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '15px', height: '15px' }}>
                    <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-1.106-.705 3.91 3.91 0 0 1-.748-1.065H9.176a3.91 3.91 0 0 1-.748 1.065 3.79 3.79 0 0 1-1.106.705 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.31 3.31 0 0 1-.565-.745A3.97 3.97 0 0 1 2 12.48a3.62 3.62 0 0 1 .96-2.55l.015-.015a3.39 3.39 0 0 1 .79-.59A3.29 3.29 0 0 1 5 9.01c.393-.017.784.05 1.15.195.333.13.638.325.9.57V8.79c0-.283.057-.562.166-.82a2.44 2.44 0 0 1 .467-.704 2.17 2.17 0 0 1 .704-.487 2.1 2.1 0 0 1 .86-.18h6.51c.3 0 .595.06.87.177a2.17 2.17 0 0 1 .704.487c.2.203.36.444.467.704.109.258.166.537.166.82v.975a2.52 2.52 0 0 1 .9-.57A3.06 3.06 0 0 1 19 9.01c.394-.017.785.05 1.15.195a3.39 3.39 0 0 1 .79.59l.015.015A3.62 3.62 0 0 1 22 12.48a3.97 3.97 0 0 1-.55 1.835zm-9.45.53z"/>
                  </svg>
                ),
              },
            ].map(({ label, href, title, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                aria-label={title}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  color: 'rgba(204,255,0,0.4)',
                  transition: 'color 0.2s ease, background 0.2s ease, transform 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLAnchorElement;
                  target.style.color = '#ccff00';
                  target.style.background = 'rgba(204,255,0,0.1)';
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLAnchorElement;
                  target.style.color = 'rgba(204,255,0,0.4)';
                  target.style.background = 'transparent';
                  target.style.transform = 'translateY(0)';
                }}
              >
                {svg}
              </a>
            ))}
            <span style={{
              marginLeft: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(204,255,0,0.3)',
            }}>
              / profiles
            </span>
          </div>
        </div>

        {/* RIGHT — Achievements badges */}
        <div className="hero-right">
          {[
            {
              icon: '🥋',
              label: 'MARTIAL ARTS',
              value: '1st Dan Black Belt',
              sub: 'World Taekwondo Federation',
              color: '#ccff00',
            },
            {
              icon: '🏆',
              label: 'HACKATHON',
              value: 'MLH Winner',
              sub: 'Major League Hacking · Global',
              color: '#00ffcc',
            },
            {
              icon: '💻',
              label: 'ENGINEERING',
              value: 'Full-Stack Developer',
              sub: 'React · Node · Cybersecurity',
              color: '#88ff00',
            },
          ].map((badge) => (
            <div
              key={badge.label}
              data-animate
              className="hero-badge"
              style={{
                borderLeft: `2px solid ${badge.color}`,
                paddingLeft: '1rem',
                width: '100%',
                maxWidth: '24rem',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'translateX(-8px)';
                target.style.borderLeftColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.transform = 'translateX(0)';
                target.style.borderLeftColor = badge.color;
              }}
            >
              <span style={{ fontSize: '1.8rem', flexShrink: 0, opacity: 0.9 }}>{badge.icon}</span>
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: badge.color,
                  marginBottom: '0.2rem',
                  opacity: 0.8,
                }}>
                  {badge.label}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                  color: 'rgba(245,245,245,0.95)',
                  letterSpacing: '-0.01em',
                }}>
                  {badge.value}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'rgba(160,160,160,0.6)',
                  marginTop: '0.15rem',
                }}>
                  {badge.sub}
                </span>
              </div>
            </div>
          ))}

          {/* Quote */}
          <div
            data-animate
            style={{
              maxWidth: '24rem',
              width: '100%',
              marginTop: '1rem',
              padding: '1rem 0 1rem 1.2rem',
              borderLeft: '1px solid rgba(204,255,0,0.3)',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
              color: 'rgba(245,245,245,0.6)',
              lineHeight: 1.7,
              margin: '0 0 0.75rem',
              letterSpacing: '0.01em',
            }}>
              If you don&apos;t fight for what you want,<br />
              don&apos;t cry for what you lose.
            </p>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'linear-gradient(to right, #ccff00, #00ffcc)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              — Harsh Prasad
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.6rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(204,255,0,0.5)',
        }}>Scroll</span>
        <div style={{
          width: '1px',
          height: '3.5rem',
          background: 'linear-gradient(to bottom, rgba(204,255,0,0.8), transparent)',
          animation: 'scrollPulse 2.5s ease-in-out infinite',
        }} />
      </div>

      <style jsx global>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50%       { opacity: 1;    transform: scaleY(1.2); }
        }
        @keyframes fluid-lime-cyan {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 5rem clamp(1.25rem, 6vw, 2rem) 2rem !important;
            align-items: flex-start !important;
            gap: 2rem !important;
          }
          .hero-right {
            align-items: flex-start !important;
            margin-right: 0 !important;
            width: 100%;
          }
          .hero-badge {
            max-width: 100% !important;
          }
          .hero-ctas {
            flex-direction: row;
            width: 100%;
          }
          .hero-cta-primary, .hero-cta-secondary {
            flex: 1;
            justify-content: center;
            font-size: 0.78rem;
            padding: 0.75rem 1rem;
          }
        }
        @media (max-width: 480px) {
          .hero-ctas {
            flex-direction: column;
          }
          .hero-cta-primary, .hero-cta-secondary {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}