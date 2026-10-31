'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteSettings } from '@/db/schema';

interface ThemeContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  settings: null,
  isLoading: true,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSettings(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    
    // Theme colors
    if (settings.themePrimaryColor) root.style.setProperty('--accent-primary', settings.themePrimaryColor);
    if (settings.themeSecondaryColor) root.style.setProperty('--accent-secondary', settings.themeSecondaryColor);
    if (settings.themeAccentColor) root.style.setProperty('--accent-tertiary', settings.themeAccentColor);
    if (settings.themePrimaryColor) {
      const r = parseInt(settings.themePrimaryColor.slice(1, 3), 16);
      const g = parseInt(settings.themePrimaryColor.slice(3, 5), 16);
      const b = parseInt(settings.themePrimaryColor.slice(5, 7), 16);
      root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.4)`);
      root.style.setProperty('--border-glow', `rgba(${r}, ${g}, ${b}, 0.3)`);
      root.style.setProperty('--shadow-glow', `0 0 50px rgba(${r}, ${g}, ${b}, 0.4)`);
      root.style.setProperty('--shadow-lime', `0 0 30px rgba(${r}, ${g}, ${b}, 0.25)`);
    }

    // Fonts
    if (settings.fontFamilyBase) root.style.setProperty('--font-body', settings.fontFamilyBase);
    if (settings.fontFamilyDisplay) root.style.setProperty('--font-display', settings.fontFamilyDisplay);
    if (settings.fontFamilyMono) root.style.setProperty('--font-mono', settings.fontFamilyMono);
    if (settings.fontSizeBase) root.style.setProperty('--base-font-size', settings.fontSizeBase);
    if (settings.fontSizeScale) root.style.setProperty('--font-scale', settings.fontSizeScale);

    // Animation
    if (settings.animationDuration) root.style.setProperty('--animation-duration', settings.animationDuration);
    if (settings.animationEasing) root.style.setProperty('--ease-expo', settings.animationEasing);
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}