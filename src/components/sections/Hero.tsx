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
        height: '100vh',
        minHeight: '680px',
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
          className="hero-bg-img"
          src="/hero-bg-pic.png"
          alt="Harsh Prasad"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            imageRendering: 'auto',
          }}
        />
      </div>

      {/* ── Edge blur: sharp centre, soft blur on far edges only ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        maskImage: `linear-gradient(
          to right,
          black 0%,
          black 20%,
          transparent 30%,
          transparent 70%,
          black 80%,
          black 100%
        )`,
        WebkitMaskImage: `linear-gradient(
          to right,
          black 0%,
          black 20%,
          transparent 30%,
          transparent 70%,
          black 80%,
          black 100%
        )`,
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* ── Golden-pink cinematic overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(
            105deg,
            rgba(10, 5, 2, 0.92) 0%,
            rgba(20, 8, 4, 0.75) 38%,
            rgba(255, 160, 60, 0.12) 62%,
            rgba(255, 80, 140, 0.18) 100%
          ),
          linear-gradient(
            to top,
            rgba(8, 3, 2, 0.85) 0%,
            transparent 55%
          )
        `,
        zIndex: 1,
      }} />

      {/* ── Warm glow orbs ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* golden orb top-left */}
        <div style={{
          position: 'absolute',
          top: '-120px', left: '-80px',
          width: '480px', height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,183,60,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat 14s ease-in-out infinite',
        }} />
        {/* pink orb bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: '-80px', right: '-60px',
          width: '380px', height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,100,160,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'orbFloat 18s ease-in-out infinite reverse',
        }} />
      </div>

      {/* ── Left accent stripe ── */}
      <div style={{
        position: 'absolute',
        left: 0, top: '10%', bottom: '10%',
        width: '3px',
        background: 'linear-gradient(to bottom, transparent, #FFB83C 25%, #FF6EB4 75%, transparent)',
        zIndex: 2,
        boxShadow: '0 0 18px rgba(255,183,60,0.5)',
      }} />

      {/* ── Content grid ── */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
      }}>

        {/* ══ LEFT — Name + CTAs ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

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
              textTransform: 'uppercase',
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
            fontSize: 'clamp(4.2rem, 10vw, 9.5rem)',
            lineHeight: 0.87,
            letterSpacing: '-0.01em',
            margin: 0,
            background: `linear-gradient(
              90deg,
              #FFFFFF,
              #FFE8B0,
              #FFB83C,
              #FF9A5C,
              #FF6EB4,
              #FF3E8A,
              #FFB83C,
              #FFE8B0,
              #FFFFFF
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
            fontSize: 'clamp(0.88rem, 1.3vw, 1.05rem)',
            color: 'rgba(255,235,200,0.8)',
            lineHeight: 1.65,
            maxWidth: '27rem',
            margin: 0,
          }}>
            Full-Stack Developer &amp; Cybersecurity Enthusiast<br />
            blending code, discipline, and creativity.
          </p>

          {/* CTAs */}
          <div data-animate style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            <a
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 1.8rem',
                background: 'linear-gradient(135deg, #FFB83C, #FF6EB4)',
                color: '#1a0a00',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: 'none',
                textDecoration: 'none',
                boxShadow: '0 0 28px rgba(255,183,60,0.4)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(255,183,60,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(255,183,60,0.4)';
              }}
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 1.8rem',
                background: 'transparent',
                color: 'rgba(255,235,200,0.9)',
                fontWeight: 600,
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: '1px solid rgba(255,183,60,0.4)',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,183,60,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = '#FFB83C';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(255,183,60,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,183,60,0.4)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              View Work
            </a>
          </div>
        </div>

        {/* ══ RIGHT — Badges + Quote ══ */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.4rem',
          alignItems: 'flex-end',
          marginRight: '-2rem',
        }}>

          {/* Badge cards */}
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
          ].map((badge, i) => (
            <div
              key={badge.label}
              data-animate
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
                borderLeft: `2px solid ${badge.color}`,
                paddingLeft: '0.9rem',
                width: '100%',
                maxWidth: '22rem',
                transition: 'transform 0.3s ease',
                cursor: 'default',
              }}
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
                  textTransform: 'uppercase',
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
              position: 'relative',
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
              If you don't fight for what you want,<br />
              don't cry for what you lose.
            </p>

            <span style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.63rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
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

        /* ── Responsive: stack vertically on mobile ── */
        @media (max-width: 768px) {
          #hero > div:nth-child(5) {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          #hero > div:nth-child(5) > div:last-child {
            align-items: flex-start !important;
          }
          #hero > div:nth-child(5) > div:last-child > div {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
