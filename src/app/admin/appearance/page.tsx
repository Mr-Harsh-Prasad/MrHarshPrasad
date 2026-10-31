'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Palette, Type, Zap, ImageIcon, Link2, Globe } from 'lucide-react';

interface SiteSettings {
  themePrimaryColor: string;
  themeSecondaryColor: string;
  themeAccentColor: string;
  fontFamilyBase: string;
  fontFamilyDisplay: string;
  fontFamilyMono: string;
  fontSizeBase: string;
  fontSizeScale: string;
  animationPreference: string;
  animationDuration: string;
  animationEasing: string;
  reducedMotion: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  email: string;
  footerText: string;
  footerShowGithub: boolean;
  footerShowLinkedin: boolean;
  isPublished: boolean;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  themePrimaryColor: '#ccff00',
  themeSecondaryColor: '#00ffcc',
  themeAccentColor: '#88ff00',
  fontFamilyBase: 'Inter, system-ui, sans-serif',
  fontFamilyDisplay: 'Bebas Neue, sans-serif',
  fontFamilyMono: 'Space Mono, monospace',
  fontSizeBase: '16px',
  fontSizeScale: '1.2',
  animationPreference: 'fade-up',
  animationDuration: '0.6s',
  animationEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  reducedMotion: false,
  heroTitle: 'Harsh Prasad',
  heroSubtitle: 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
  heroDescription: 'Building accessible, performant web experiences with modern technologies.',
  heroImageUrl: '',
  heroCtaText: 'View Work',
  heroCtaLink: '#projects',
  heroSecondaryCtaText: 'Contact Me',
  heroSecondaryCtaLink: '#contact',
  siteTitle: 'Mr Harsh Prasad | Portfolio',
  siteDescription: 'Personal portfolio of Harsh Prasad - Computer Science student and Frontend Developer',
  siteUrl: 'https://mrharshprasad-portfolio.vercel.app',
  githubUrl: 'https://github.com/harshprasad',
  linkedinUrl: 'https://linkedin.com/in/harshprasad',
  twitterUrl: '',
  email: 'harsh@example.com',
  footerText: 'Built with Next.js, React, and Tailwind CSS',
  footerShowGithub: true,
  footerShowLinkedin: true,
  isPublished: true,
  maintenanceMode: false,
};

const fontOptions = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
];

const displayFontOptions = [
  { value: 'Bebas Neue, sans-serif', label: 'Bebas Neue' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Oswald, sans-serif', label: 'Oswald' },
  { value: 'Anton, sans-serif', label: 'Anton' },
];

const monoFontOptions = [
  { value: 'Space Mono, monospace', label: 'Space Mono' },
  { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
  { value: 'Fira Code, monospace', label: 'Fira Code' },
  { value: 'Source Code Pro, monospace', label: 'Source Code Pro' },
  { value: 'IBM Plex Mono, monospace', label: 'IBM Plex Mono' },
];

const animationOptions = [
  { value: 'fade-up', label: 'Fade Up' },
  { value: 'fade-in', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale-in', label: 'Scale In' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'flip-up', label: 'Flip Up' },
  { value: 'none', label: 'None' },
];

const easingOptions = [
  { value: 'cubic-bezier(0.16, 1, 0.3, 1)', label: 'Expo (Default)' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Ease Out' },
  { value: 'cubic-bezier(0.4, 0, 1, 1)', label: 'Ease In' },
  { value: 'cubic-bezier(0.25, 0.1, 0.25, 1)', label: 'Ease In Out' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Back' },
  { value: 'linear', label: 'Linear' },
];

export default function AppearancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const validateSettings = (s: SiteSettings): string | null => {
    // Validate color format (#rrggbb)
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    if (!hexColorRegex.test(s.themePrimaryColor)) return 'Primary color must be a valid hex color (e.g., #ccff00)';
    if (!hexColorRegex.test(s.themeSecondaryColor)) return 'Secondary color must be a valid hex color (e.g., #00ffcc)';
    if (!hexColorRegex.test(s.themeAccentColor)) return 'Accent color must be a valid hex color (e.g., #88ff00)';
    
    // Validate URL lengths (varchar limits)
    const urlFields = [
      { key: 'heroImageUrl', label: 'Hero Image URL', max: 500 },
      { key: 'siteUrl', label: 'Site URL', max: 200 },
      { key: 'githubUrl', label: 'GitHub URL', max: 200 },
      { key: 'linkedinUrl', label: 'LinkedIn URL', max: 200 },
      { key: 'twitterUrl', label: 'Twitter URL', max: 200 },
    ];
    for (const f of urlFields) {
      if (s[f.key as keyof SiteSettings] && (s[f.key as keyof SiteSettings] as string).length > f.max) {
        return `${f.label} exceeds ${f.max} characters`;
      }
    }
    
    // Validate varchar text fields
    const textFields = [
      { key: 'fontFamilyBase', label: 'Body Font', max: 100 },
      { key: 'fontFamilyDisplay', label: 'Display Font', max: 100 },
      { key: 'fontFamilyMono', label: 'Mono Font', max: 100 },
      { key: 'fontSizeBase', label: 'Base Font Size', max: 10 },
      { key: 'fontSizeScale', label: 'Font Scale', max: 20 },
      { key: 'animationPreference', label: 'Animation', max: 50 },
      { key: 'animationDuration', label: 'Animation Duration', max: 20 },
      { key: 'animationEasing', label: 'Easing', max: 50 },
      { key: 'heroTitle', label: 'Hero Title', max: 200 },
      { key: 'heroCtaText', label: 'Primary CTA Text', max: 50 },
      { key: 'heroCtaLink', label: 'Primary CTA Link', max: 100 },
      { key: 'heroSecondaryCtaText', label: 'Secondary CTA Text', max: 50 },
      { key: 'heroSecondaryCtaLink', label: 'Secondary CTA Link', max: 100 },
      { key: 'siteTitle', label: 'Site Title', max: 100 },
      { key: 'email', label: 'Email', max: 100 },
      { key: 'footerText', label: 'Footer Text', max: 200 },
    ];
    for (const f of textFields) {
      const val = s[f.key as keyof SiteSettings] as string;
      if (val && val.length > f.max) {
        return `${f.label} exceeds ${f.max} characters`;
      }
    }
    
    return null;
  };

  const handleSave = async () => {
    const validationError = validateSettings(settings);
    if (validationError) {
      toast({ title: 'Validation Error', description: validationError, variant: 'destructive' });
      return;
    }
    
    setIsSaving(true);
    try {
      console.log('Saving settings:', settings);
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      console.log('Save response:', data);
      if (data.success) {
        toast({ title: 'Saved', description: 'Appearance settings updated successfully', variant: 'success' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to save settings', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-lime-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Appearance
          </h1>
          <p className="text-gray-400 mt-1">Customize your portfolio's look and feel</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="w-4 h-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="animations">
            <Zap className="w-4 h-4 mr-2" />
            Animations
          </TabsTrigger>
          <TabsTrigger value="content">
            <ImageIcon className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>Primary colors used throughout the portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.themePrimaryColor}
                      onChange={(e) => handleChange('themePrimaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20 bg-white/5 cursor-pointer p-0"
                    />
                    <Input
                      value={settings.themePrimaryColor}
                      onChange={(e) => handleChange('themePrimaryColor', e.target.value)}
                      placeholder="#ccff00"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Main accent color (buttons, links, highlights)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.themeSecondaryColor}
                      onChange={(e) => handleChange('themeSecondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20 bg-white/5 cursor-pointer p-0"
                    />
                    <Input
                      value={settings.themeSecondaryColor}
                      onChange={(e) => handleChange('themeSecondaryColor', e.target.value)}
                      placeholder="#00ffcc"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Secondary accent (gradients, hover states)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Tertiary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.themeAccentColor}
                      onChange={(e) => handleChange('themeAccentColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-white/20 bg-white/5 cursor-pointer p-0"
                    />
                    <Input
                      value={settings.themeAccentColor}
                      onChange={(e) => handleChange('themeAccentColor', e.target.value)}
                      placeholder="#88ff00"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Additional accent for variety</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm">Reduced Motion (respects prefers-reduced-motion)</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your colors look in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary text-sm px-4 py-2">Primary Button</button>
                  <button className="btn-secondary text-sm px-4 py-2">Secondary Button</button>
                  <button className="btn-ghost text-sm px-4 py-2">Ghost Button</button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="gradient-text">Gradient Text Example</span>
                  <span className="text-gray-400">Regular Text</span>
                  <span style={{ color: settings.themePrimaryColor }}>Primary Color Text</span>
                  <span style={{ color: settings.themeSecondaryColor }}>Secondary Color Text</span>
                </div>
                <div className="h-4 w-full rounded bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${settings.themePrimaryColor}, ${settings.themeSecondaryColor})` }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
              <CardDescription>Choose fonts for different text elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontBase">Body Font</Label>
                  <Select value={settings.fontFamilyBase} onValueChange={(v) => handleChange('fontFamilyBase', v)}>
                    <SelectTrigger id="fontBase">
                      <SelectValue placeholder="Select body font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontDisplay">Display Font (Headings)</Label>
                  <Select value={settings.fontFamilyDisplay} onValueChange={(v) => handleChange('fontFamilyDisplay', v)}>
                    <SelectTrigger id="fontDisplay">
                      <SelectValue placeholder="Select display font" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayFontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontMono">Monospace Font</Label>
                  <Select value={settings.fontFamilyMono} onValueChange={(v) => handleChange('fontFamilyMono', v)}>
                    <SelectTrigger id="fontMono">
                      <SelectValue placeholder="Select mono font" />
                    </SelectTrigger>
                    <SelectContent>
                      {monoFontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="fontSizeBase">Base Font Size</Label>
                  <Input
                    id="fontSizeBase"
                    type="text"
                    value={settings.fontSizeBase}
                    onChange={(e) => handleChange('fontSizeBase', e.target.value)}
                    placeholder="16px"
                  />
                  <p className="text-xs text-gray-500">Base font size (e.g., 16px, 1rem)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fontSizeScale">Font Scale Ratio</Label>
                  <Input
                    id="fontSizeScale"
                    type="text"
                    value={settings.fontSizeScale}
                    onChange={(e) => handleChange('fontSizeScale', e.target.value)}
                    placeholder="1.2"
                  />
                  <p className="text-xs text-gray-500">Scale ratio for heading sizes (e.g., 1.2, 1.25)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10" style={{ fontFamily: settings.fontFamilyBase, fontSize: settings.fontSizeBase }}>
                <h1 style={{ fontFamily: settings.fontFamilyDisplay, fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>Heading 1 (Display Font)</h1>
                <h2 style={{ fontFamily: settings.fontFamilyDisplay, fontSize: 'clamp(2rem, 5vw, 4rem)' }}>Heading 2 (Display Font)</h2>
                <h3 style={{ fontFamily: settings.fontFamilyDisplay, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>Heading 3 (Display Font)</h3>
                <p>Body text using the body font. This is how regular paragraphs will look on your portfolio.</p>
                <code style={{ fontFamily: settings.fontFamilyMono }}>Monospace font for code snippets</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Animations Tab */}
        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Animation Settings</CardTitle>
              <CardDescription>Configure global animation behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animationPreference">Default Animation</Label>
                  <Select value={settings.animationPreference} onValueChange={(v) => handleChange('animationPreference', v)}>
                    <SelectTrigger id="animationPreference">
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      {animationOptions.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value}>
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="animationDuration">Animation Duration</Label>
                  <Input
                    id="animationDuration"
                    type="text"
                    value={settings.animationDuration}
                    onChange={(e) => handleChange('animationDuration', e.target.value)}
                    placeholder="0.6s"
                  />
                  <p className="text-xs text-gray-500">Duration in seconds (e.g., 0.6s, 800ms)</p>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Label htmlFor="animationEasing">Easing Function</Label>
                <Select value={settings.animationEasing} onValueChange={(v) => handleChange('animationEasing', v)}>
                  <SelectTrigger id="animationEasing">
                    <SelectValue placeholder="Select easing" />
                  </SelectTrigger>
                  <SelectContent>
                    {easingOptions.map((ease) => (
                      <SelectItem key={ease.value} value={ease.value}>
                        {ease.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Animation Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-wrap gap-4" style={{ animationDuration: settings.animationDuration }}>
                  <div className={`w-20 h-20 rounded-lg transition-all ${settings.animationPreference === 'fade-up' ? 'animate-fade-up' : ''}`} style={{ background: `linear-gradient(135deg, ${settings.themePrimaryColor}, ${settings.themeSecondaryColor})` }} />
                  <div className={`w-20 h-20 rounded-lg transition-all ${settings.animationPreference === 'slide-up' ? 'animate-slide-up' : ''}`} style={{ background: `linear-gradient(135deg, ${settings.themeSecondaryColor}, ${settings.themeAccentColor})` }} />
                  <div className={`w-20 h-20 rounded-lg transition-all ${settings.animationPreference === 'scale-in' ? 'animate-scale-in' : ''}`} style={{ background: `linear-gradient(135deg, ${settings.themeAccentColor}, ${settings.themePrimaryColor})` }} />
                </div>
                <p className="text-sm text-gray-500">Animations use your configured duration and easing</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize the hero section content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  placeholder="Your tagline"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea
                  id="heroDescription"
                  value={settings.heroDescription}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  placeholder="A brief description about yourself"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImageUrl">Hero Image URL</Label>
                <Input
                  id="heroImageUrl"
                  type="url"
                  value={settings.heroImageUrl}
                  onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="heroCtaText">Primary CTA Text</Label>
                  <Input
                    id="heroCtaText"
                    value={settings.heroCtaText}
                    onChange={(e) => handleChange('heroCtaText', e.target.value)}
                    placeholder="View Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroCtaLink">Primary CTA Link</Label>
                  <Input
                    id="heroCtaLink"
                    value={settings.heroCtaLink}
                    onChange={(e) => handleChange('heroCtaLink', e.target.value)}
                    placeholder="#projects"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="heroSecondaryCtaText">Secondary CTA Text</Label>
                  <Input
                    id="heroSecondaryCtaText"
                    value={settings.heroSecondaryCtaText}
                    onChange={(e) => handleChange('heroSecondaryCtaText', e.target.value)}
                    placeholder="Contact Me"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSecondaryCtaLink">Secondary CTA Link</Label>
                  <Input
                    id="heroSecondaryCtaLink"
                    value={settings.heroSecondaryCtaLink}
                    onChange={(e) => handleChange('heroSecondaryCtaLink', e.target.value)}
                    placeholder="#contact"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO & Social</CardTitle>
              <CardDescription>Site metadata and social links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={settings.siteTitle}
                    onChange={(e) => handleChange('siteTitle', e.target.value)}
                    placeholder="Mr Harsh Prasad | Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                    placeholder="https://yourdomain.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Personal portfolio description for SEO"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    type="url"
                    value={settings.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={settings.linkedinUrl}
                    onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                  <Input
                    id="twitterUrl"
                    type="url"
                    value={settings.twitterUrl}
                    onChange={(e) => handleChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  placeholder="Built with Next.js, React, and Tailwind CSS"
                />
              </div>
              <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.footerShowGithub}
                    onChange={(e) => handleChange('footerShowGithub', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm">Show GitHub in footer</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.footerShowLinkedin}
                    onChange={(e) => handleChange('footerShowLinkedin', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm">Show LinkedIn in footer</span>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-400/30">
            <CardHeader>
              <CardTitle className="text-red-400">Site Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isPublished}
                    onChange={(e) => handleChange('isPublished', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm">Site Published</span>
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm text-red-400">Maintenance Mode</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}