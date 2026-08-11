'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── subtle parallax on mouse move ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const dx = (e.clientX / w - 0.5) * 14;
      const dy = (e.clientY / h - 0.5) * 8;
      const bg = section.querySelector<HTMLElement>('.hero-bg-wrap');
      if (bg) bg.style.transform = `scale(1.02) translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  /* ── entrance animation on mount ── */
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLElement>('[data-animate]');
    items?.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 140}ms,
                              transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 140}ms`;
      requestAnimationFrame(() =>
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 60)
      );
    });
  }, []);

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
      {/* ── Background photo ── */}
      <div
        className="hero-bg-wrap"
        style={{
          position: 'absolute',
          inset: 0,
          transform: 'scale(1.02)',
          transition: 'transform 0.12s linear',
          willChange: 'transform',
          zIndex: 0,
        }}
      >
        <img
          src="/hero-bg-pic.png"
          alt="Harsh Prasad"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />
      </div>

      {/* ── Edge blur: sharp centre, soft sides — desktop only ── */}
      <div className="hero-edge-blur" />

      {/* ── Golden-pink cinematic overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(
            105deg,
            rgba(10,5,2,0.92) 0%,
            rgba(20,8,4,0.78) 38%,
            rgba(255,160,60,0.12) 62%,
            rgba(255,80,140,0.18) 100%
          ),
          linear-gradient(to top, rgba(8,3,2,0.88) 0%, transparent 55%)
        `,
        zIndex: 1,
      }} />

      {/* ── Warm glow orbs ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-120px', left: '-80px',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,183,60,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat 14s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-60px',
          width: '380px', height: '380px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,100,160,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat 18s ease-in-out infinite reverse',
        }} />
      </div>

      {/* ── Left accent stripe ── */}
      <div style={{
        position: 'absolute', left: 0, top: '10%', bottom: '10%',
        width: '3px',
        background: 'linear-gradient(to bottom, transparent, #FFB83C 25%, #FF6EB4 75%, transparent)',
        zIndex: 2,
        boxShadow: '0 0 18px rgba(255,183,60,0.5)',
      }} />

      {/* ── Content grid ── */}
      <div className="hero-grid">

        {/* ══ LEFT — Name + CTAs ══ */}
        <div className="hero-left">

          {/* eyebrow */}
          <div data-animate style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-block', width: '2rem', height: '1.5px',
              background: 'linear-gradient(to right, #FFB83C, #FF6EB4)',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              background: 'linear-gradient(to right, #FFB83C, #FF6EB4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Developer · Athlete · Hacker
            </span>
          </div>

          {/* Big name */}
          <h1 data-animate style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.6rem, 10vw, 9.5rem)',
            lineHeight: 0.87,
            letterSpacing: '-0.01em',
            margin: 0,
            background: `linear-gradient(
              90deg,
              #FFFFFF, #FFE8B0, #FFB83C, #FF9A5C,
              #FF6EB4, #FF3E8A, #FFB83C, #FFE8B0, #FFFFFF
            )`,
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'heroNameShift 5s ease-in-out infinite',
            filter: 'drop-shadow(0 4px 40px rgba(255,183,60,0.4))',
          }}>
            MR.<br />HARSH<br />PRASAD
          </h1>

          {/* rule */}
          <div data-animate style={{
            width: 'clamp(3rem, 8vw, 5.5rem)',
            height: '2px',
            background: 'linear-gradient(to right, #FFB83C, #FF6EB4)',
            borderRadius: '1px',
            boxShadow: '0 0 14px rgba(255,183,60,0.5)',
          }} />

          {/* subtitle */}
          <p data-animate style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
            color: 'rgba(255,235,200,0.8)',
            lineHeight: 1.65,
            maxWidth: '27rem',
            margin: 0,
          }}>
            Full-Stack Developer &amp; Cybersecurity Enthusiast<br />
            blending code, discipline, and creativity.
          </p>

          {/* CTAs */}
          <div data-animate className="hero-ctas">
            <a
              href="#contact"
              className="hero-cta-primary"
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 50px rgba(255,183,60,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 28px rgba(255,183,60,0.4)';
              }}
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="hero-cta-secondary"
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,183,60,0.1)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#FFB83C';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(255,183,60,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,183,60,0.4)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              View Work
            </a>
          </div>

          {/* Profile links — subtle, understated */}
          <div data-animate style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
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
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  color: 'rgba(255,220,160,0.38)',
                  transition: 'color 0.2s ease, background 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,183,60,0.85)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,183,60,0.07)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,220,160,0.38)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                {svg}
              </a>
            ))}
            <span style={{
              marginLeft: '0.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,220,160,0.22)',
            }}>
              / profiles
            </span>
          </div>
        </div>

        {/* ══ RIGHT — Badges + Quote ══ */}
        <div className="hero-right">

          {[
            {
              icon: '🥋',
              label: 'Martial Arts',
              value: '1st Dan Black Belt',
              sub: 'World Taekwondo Federation',
              color: '#FFB83C',
            },
            {
              icon: '🏆',
              label: 'Hackathon',
              value: 'MLH Winner',
              sub: 'Major League Hacking · Global',
              color: '#FF6EB4',
            },
            {
              icon: '💻',
              label: 'Engineering',
              value: 'Full-Stack Engineer',
              sub: 'React · Node · Cybersecurity',
              color: '#FF9A5C',
            },
          ].map((badge) => (
            <div
              key={badge.label}
              data-animate
              className="hero-badge"
              style={{ borderLeft: `2px solid ${badge.color}` }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(-6px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <span style={{ fontSize: '1.6rem', flexShrink: 0, opacity: 0.9 }}>{badge.icon}</span>
              <div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase' as const,
                  color: badge.color,
                  marginBottom: '0.15rem',
                  opacity: 0.85,
                }}>
                  {badge.label}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 'clamp(0.9rem, 1.15vw, 1rem)',
                  color: 'rgba(255,245,225,0.92)',
                  letterSpacing: '-0.01em',
                }}>
                  {badge.value}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'rgba(255,220,160,0.38)',
                  marginTop: '0.1rem',
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
              maxWidth: '22rem',
              width: '100%',
              marginTop: '0.6rem',
              padding: '0.6rem 0 0.6rem 0.9rem',
              borderLeft: '2px solid rgba(255,183,60,0.4)',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
              color: 'rgba(255,235,200,0.72)',
              lineHeight: 1.7,
              margin: '0 0 0.5rem',
              letterSpacing: '0.01em',
            }}>
              If you don&apos;t fight for what you want,<br />
              don&apos;t cry for what you lose.
            </p>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.63rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              background: 'linear-gradient(to right, #FFB83C, #FF6EB4)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              — Harsh Prasad
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{
        position: 'absolute',
        bottom: '2.2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(255,220,160,0.55)',
        }}>Scroll</span>
        <div style={{
          width: '1px',
          height: '3rem',
          background: 'linear-gradient(to bottom, rgba(255,183,60,0.8), transparent)',
          animation: 'scrollPulse 2.2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.08); }
          66%       { transform: translate(-20px, 25px) scale(0.96); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.55; transform: scaleY(1); }
          50%       { opacity: 1;    transform: scaleY(1.2); }
        }
        @keyframes heroNameShift {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
      `}</style>
    </section>
  );
}
