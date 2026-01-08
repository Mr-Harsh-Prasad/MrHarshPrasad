'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
    href?: string;
    download?: boolean;
}

/**
 * MagneticButton - Button/link with magnetic hover effect
 * The element follows the cursor within its bounds, creating a playful interaction
 */
export default function MagneticButton({
    children,
    className = '',
    onClick,
    strength = 0.5,
    href,
    download = false,
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const button = buttonRef.current;
        const content = contentRef.current;
        if (!button || !content) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move button slightly towards cursor
        gsap.to(button, {
            x: x * strength * 0.4,
            y: y * strength * 0.4,
            duration: 0.4,
            ease: 'power2.out',
        });

        // Move content more for parallax effect
        gsap.to(content, {
            x: x * strength * 0.2,
            y: y * strength * 0.2,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        const button = buttonRef.current;
        const content = contentRef.current;

        // Reset position with spring animation
        gsap.to([button, content], {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)',
        });
    };

    const commonProps = {
        ref: buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
        className: `relative inline-block ${className}`,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        'data-cursor': 'pointer',
    };

    const content = (
        <span ref={contentRef} className="relative inline-block">
            {children}
        </span>
    );

    // Render as anchor or button based on href prop
    if (href) {
        return (
            <a
                {...commonProps}
                href={href}
                download={download}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
                {content}
            </a>
        );
    }

    return (
        <button {...commonProps} onClick={onClick} type="button">
            {content}
        </button>
    );
}
