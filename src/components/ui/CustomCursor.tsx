'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor - Premium custom cursor with hover interactions
 * Features:
 * - Smooth movement with GSAP
 * - Blend mode for visual interest
 * - Scale on hover over interactive elements
 * - Hidden on mobile devices
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;

    // Check if touch device
    if ('ontouchstart' in window) {
      cursor.style.display = 'none';
      cursorDot.style.display = 'none';
      return;
    }

    // Mouse move handler with GSAP for smooth movement
    const onMouseMove = (e: MouseEvent) => {
      // Move outer cursor with slight delay for trailing effect
      gsap.to(cursor, {
        x: e.clientX - 20,
        y: e.clientY - 20,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Move inner dot directly for precision
      gsap.to(cursorDot, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    // Add hover effects for interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor="pointer"], input, textarea, [role="button"]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    
    // Add listeners after a short delay to ensure DOM is ready
    setTimeout(addHoverListeners, 1000);

    // Re-add listeners when DOM changes (for dynamic content)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
    };
  }, []);

  // Animate hover state
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      scale: isHovering ? 1.5 : 1,
      opacity: isHovering ? 0.8 : 0.5,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isHovering]);

  return (
    <>
      {/* Outer cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-accent-primary pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: isHidden ? 0 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Inner cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: isHidden ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  );
}
