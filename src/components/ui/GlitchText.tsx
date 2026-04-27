'use client';

import { useEffect, useRef, useCallback } from 'react';

const WORD = 'PRASAD';
const GLITCH_CHARS = ['#', '@', '!', '%', '?', '0', '1', 'X', 'Z', '&', '$', '/', '|', '~', '^'];

/**
 * GlitchText — Continuously glitches individual letters of "PRASAD":
 *  - Random 1-3 letters affected each burst
 *  - Effects: color flash (cyan/pink), character swap, partial letter clip, position swap
 *  - Each burst lasts 40-120ms then resets
 *  - New burst fires every 60-280ms → feels alive and chaotic
 */
export default function GlitchText() {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const runGlitch = useCallback(() => {
        const els = letterRefs.current;
        if (!els.some(Boolean)) return;

        // ── 1. Reset all to base state ──
        els.forEach((el, i) => {
            if (!el) return;
            el.textContent = WORD[i];
            el.style.transform = '';
            el.style.opacity = '';
            el.style.clipPath = '';
            // clear inline -webkit-text-fill-color so CSS rule kicks back in
            (el.style as CSSStyleDeclaration & { webkitTextFillColor: string })
                .webkitTextFillColor = '';
            el.style.textShadow = '';
        });

        // ── 2. Pick 1-3 random letter indices to glitch ──
        const allIdx = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
        const count = Math.floor(Math.random() * 3) + 1;
        const chosen = allIdx.slice(0, count);

        // ── 3. Decide main effect type for this burst ──
        const doCharSwap    = Math.random() < 0.40;  // replace with glitch char
        const doLetterSwap  = Math.random() < 0.30 && chosen.length >= 2; // swap two letters
        const doPartialClip = Math.random() < 0.55;  // show only a horizontal slice

        // ── 4. Apply effects to each chosen letter ──
        chosen.forEach((i) => {
            const el = els[i];
            if (!el) return;

            const isCyan = Math.random() > 0.5;
            const color  = isCyan ? '#00ffff' : '#ff0080';
            const shadow = isCyan
                ? '0 0 5px #00ffff, 0 0 15px #00ffff, 0 0 35px #00aaff, 0 0 2px #fff'
                : '0 0 5px #ff0080, 0 0 15px #ff0080, 0 0 35px #cc0044, 0 0 2px #fff';

            // colour + glow
            (el.style as CSSStyleDeclaration & { webkitTextFillColor: string })
                .webkitTextFillColor = color;
            el.style.textShadow = shadow;

            // subtle position jitter
            const tx   = (Math.random() - 0.5) * 14;
            const ty   = (Math.random() - 0.5) * 10;
            const skew = (Math.random() - 0.5) * 18;
            el.style.transform = `translate(${tx}px, ${ty}px) skewX(${skew}deg)`;

            // partial horizontal clip (simulates "half a letter glitching")
            if (doPartialClip) {
                const topPct = Math.floor(Math.random() * 55);
                const botPct = Math.floor(Math.random() * 55);
                if (topPct + botPct < 88) {
                    el.style.clipPath = `inset(${topPct}% 0 ${botPct}% 0)`;
                    el.style.opacity  = (Math.random() * 0.4 + 0.6).toFixed(2);
                }
            }

            // character replacement
            if (doCharSwap) {
                el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            }
        });

        // ── 5. Position swap: shift two letters into each other's place ──
        if (doLetterSwap) {
            const [a, b] = chosen.slice(0, 2);
            const elA = els[a];
            const elB = els[b];
            if (elA && elB) {
                const rectA = elA.getBoundingClientRect();
                const rectB = elB.getBoundingClientRect();
                const delta = rectB.left - rectA.left;
                // keep any existing skew, override translate
                const skewA = (Math.random() - 0.5) * 12;
                const skewB = (Math.random() - 0.5) * 12;
                elA.style.transform = `translateX(${delta}px) skewX(${skewA}deg)`;
                elB.style.transform = `translateX(${-delta}px) skewX(${skewB}deg)`;
            }
        }

        // ── 6. Hold for 40-120ms then reset ──
        const holdMs = Math.floor(Math.random() * 80) + 40;
        setTimeout(() => {
            els.forEach((el, i) => {
                if (!el) return;
                el.textContent = WORD[i];
                el.style.transform = '';
                el.style.opacity   = '';
                el.style.clipPath  = '';
                (el.style as CSSStyleDeclaration & { webkitTextFillColor: string })
                    .webkitTextFillColor = '';
                el.style.textShadow = '';
            });
        }, holdMs);
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        // Self-scheduling with variable delay for organic feel
        const schedule = () => {
            const delay = Math.floor(Math.random() * 220) + 60; // 60–280ms
            timer = setTimeout(() => {
                runGlitch();
                schedule(); // reschedule
            }, delay);
        };

        schedule();
        return () => clearTimeout(timer);
    }, [runGlitch]);

    return (
        // aria-label so screen-readers still say "PRASAD"
        <span className="hero-name-outline" aria-label="PRASAD">
            {WORD.split('').map((char, i) => (
                <span
                    key={i}
                    ref={(el) => { letterRefs.current[i] = el; }}
                    className="glitch-letter"
                >
                    {char}
                </span>
            ))}
        </span>
    );
}
