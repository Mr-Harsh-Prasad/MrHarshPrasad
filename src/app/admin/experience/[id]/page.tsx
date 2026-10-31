'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Briefcase, Calendar, MapPin, ImageIcon, Link2, Trash2 } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  achievements: string[];
  techStack: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
  isVisible: boolean;
  companyLogoUrl: string | null;
  companyUrl: string | null;
}

interface FormData {
  company: string;
  role: string;
  location: string;
  description: string;
  achievements: string;
  techStack: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  sortOrder: number;
  isVisible: boolean;
  companyLogoUrl: string;
  companyUrl: string;
}

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<FormData>({
    company: '',
    role: '',
    location: '',
    description: '',
    achievements: '',
    techStack: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    sortOrder: 0,
    isVisible: true,
    companyLogoUrl: '',
    companyUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetchExperience();
  }, [params.id]);

  const fetchExperience = async () => {
    try {
      const res = await fetch(`/api/admin/experiences/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setExperience(data.data);
        setFormData({
          company: data.data.company,
          role: data.data.role,
          location: data.data.location || '',
          description: data.data.description || '',
          achievements: data.data.achievements.join('\n'),
          techStack: data.data.techStack.join(', '),
          startDate: data.data.startDate ? new Date(data.data.startDate).toISOString().split('T')[0] : '',
          endDate: data.data.endDate ? new Date(data.data.endDate).toISOString().split('T')[0] : '',
          isCurrent: data.data.isCurrent,
          sortOrder: data.data.sortOrder,
          isVisible: data.data.isVisible,
          companyLogoUrl: data.data.companyLogoUrl || '',
          companyUrl: data.data.companyUrl || '',
        });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to load experience', variant: 'destructive' });
        router.push('/admin/experience');
      }
    } catch (error) {
      console.error('Failed to fetch experience:', error);
      toast({ title: 'Error', description: 'Failed to load experience', variant: 'destructive' });
      router.push('/admin/experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.companyLogoUrl && !isValidUrl(formData.companyLogoUrl)) newErrors.companyLogoUrl = 'Invalid URL';
    if (formData.companyUrl && !isValidUrl(formData.companyUrl)) newErrors.companyUrl = 'Invalid URL';

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
      const achievements = formData.achievements
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const techStack = formData.techStack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/experiences/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          achievements,
          techStack,
          sortOrder: Number(formData.sortOrder),
          startDate: formData.startDate,
          endDate: formData.endDate || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Saved', description: 'Experience updated successfully', variant: 'success' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update experience', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update experience:', error);
      toast({ title: 'Error', description: 'Failed to update experience', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this experience? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/experiences/${params.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Experience deleted successfully', variant: 'success' });
        router.push('/admin/experience');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete experience', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-lime-400" />
      </div>
    );
  }

  if (!experience) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Edit Experience
          </h1>
          <p className="text-gray-400 mt-1">{experience.role} at {experience.company}</p>
        </div>
        <Link href="/admin/experience">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Experience
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="TechCorp Solutions"
                  className={errors.company ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                />
              </div>
              {errors.company && <p className="text-sm text-red-400">{errors.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Frontend Developer"
                className={errors.role ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.role && <p className="text-sm text-red-400">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="San Francisco, CA (Remote)"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your role and responsibilities..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyLogoUrl">Company Logo URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="companyLogoUrl"
                    type="url"
                    value={formData.companyLogoUrl}
                    onChange={(e) => handleChange('companyLogoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className={errors.companyLogoUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.companyLogoUrl && <p className="text-sm text-red-400">{errors.companyLogoUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyUrl">Company Website URL</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="companyUrl"
                    type="url"
                    value={formData.companyUrl}
                    onChange={(e) => handleChange('companyUrl', e.target.value)}
                    placeholder="https://company.com"
                    className={errors.companyUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.companyUrl && <p className="text-sm text-red-400">{errors.companyUrl}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Key accomplishments (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.achievements}
              onChange={(e) => handleChange('achievements', e.target.value)}
              placeholder="Improved page load performance by 40% through optimization&#10;Led migration from CRA to Next.js 14&#10;Implemented design system used across 5+ products"
              rows={5}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
            <Input
              id="techStack"
              value={formData.techStack}
              onChange={(e) => handleChange('techStack', e.target.value)}
              placeholder="React, Next.js, TypeScript, Tailwind CSS, GraphQL"
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

        <Card>
          <CardHeader>
            <CardTitle>Dates & Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-400 focus:ring-red-400' : ''}
                />
                {errors.startDate && <p className="text-sm text-red-400">{errors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={formData.isCurrent}
                />
              </div>
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
            </div>

            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) => handleChange('isCurrent', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                />
                <span className="text-sm">Currently working here</span>
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleChange('isVisible', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
                />
                <span className="text-sm">Visible on portfolio</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <Link href="/admin/experience">
            <Button type="button" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleDelete} disabled={isDeleting} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button type="submit" disabled={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}