'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Tag, Link2, ImageIcon, Video, GitBranch, Globe } from 'lucide-react';

interface FormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  thumbnailUrl: string;
  techStack: string;
  liveLink: string;
  githubLink: string;
  demoVideoUrl: string;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  startDate: string;
  endDate: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    imageUrl: '',
    thumbnailUrl: '',
    techStack: '',
    liveLink: '',
    githubLink: '',
    demoVideoUrl: '',
    sortOrder: 0,
    isVisible: true,
    isFeatured: false,
    startDate: '',
    endDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (key: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    
    // Auto-generate slug from title
    if (key === 'title' && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value as string) }));
    }
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.slug)) newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) newErrors.imageUrl = 'Invalid URL';
    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) newErrors.thumbnailUrl = 'Invalid URL';
    if (formData.liveLink && !isValidUrl(formData.liveLink)) newErrors.liveLink = 'Invalid URL';
    if (formData.githubLink && !isValidUrl(formData.githubLink)) newErrors.githubLink = 'Invalid URL';
    if (formData.demoVideoUrl && !isValidUrl(formData.demoVideoUrl)) newErrors.demoVideoUrl = 'Invalid URL';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const techStack = formData.techStack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          techStack,
          sortOrder: Number(formData.sortOrder),
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Created', description: 'Project created successfully', variant: 'success' });
        router.push('/admin/projects');
        router.refresh();
      } else {
        if (data.error?.includes('slug')) {
          setErrors({ slug: data.error });
        }
        toast({ title: 'Error', description: data.error || 'Failed to create project', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            New Project
          </h1>
          <p className="text-gray-400 mt-1">Add a new project to your portfolio</p>
        </div>
        <Link href="/admin/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Required fields for the project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="My Awesome Project"
                className={errors.title ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="my-awesome-project"
                className={errors.slug ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.slug && <p className="text-sm text-red-400">{errors.slug}</p>}
              <p className="text-xs text-gray-500">URL-friendly identifier (lowercase, numbers, hyphens only)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                placeholder="A brief summary for cards and previews"
                maxLength={300}
              />
              <p className="text-xs text-gray-500">{formData.shortDescription.length}/300 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed description of the project..."
                rows={6}
                className={errors.description ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
            <CardDescription>Images, videos, and external links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Main Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={errors.imageUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.imageUrl && <p className="text-sm text-red-400">{errors.imageUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="thumbnailUrl"
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                    placeholder="https://example.com/thumb.jpg"
                    className={errors.thumbnailUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.thumbnailUrl && <p className="text-sm text-red-400">{errors.thumbnailUrl}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liveLink">Live Demo URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="liveLink"
                    type="url"
                    value={formData.liveLink}
                    onChange={(e) => handleChange('liveLink', e.target.value)}
                    placeholder="https://myproject.com"
                    className={errors.liveLink ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.liveLink && <p className="text-sm text-red-400">{errors.liveLink}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub URL</Label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="githubLink"
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => handleChange('githubLink', e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className={errors.githubLink ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.githubLink && <p className="text-sm text-red-400">{errors.githubLink}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demoVideoUrl">Demo Video URL</Label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="demoVideoUrl"
                  type="url"
                  value={formData.demoVideoUrl}
                  onChange={(e) => handleChange('demoVideoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=xxx or https://vimeo.com/xxx"
                  className={`pl-10 ${errors.demoVideoUrl ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
              </div>
              {errors.demoVideoUrl && <p className="text-sm text-red-400">{errors.demoVideoUrl}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>Technologies used in this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="techStack">Technologies (comma-separated)</Label>
            <Input
              id="techStack"
              value={formData.techStack}
              onChange={(e) => handleChange('techStack', e.target.value)}
              placeholder="React, Next.js, TypeScript, Tailwind CSS, PostgreSQL"
            />
            <p className="text-xs text-gray-500">Separate technologies with commas</p>
            {formData.techStack && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.techStack.split(',').map((tech) => tech.trim()).filter(Boolean).map((tech, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleChange('isVisible', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                />
                <span className="text-sm">Visible on portfolio</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                />
                <span className="text-sm">Featured project</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Link href="/admin/projects">
            <Button type="button" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}