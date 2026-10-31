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
import { Loader2, Save, ArrowLeft, GraduationCap, Calendar, MapPin, ImageIcon, Link2, Trash2, Award } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  location: string | null;
  description: string | null;
  achievements: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
  isVisible: boolean;
  institutionLogoUrl: string | null;
  institutionUrl: string | null;
  grade: string | null;
}

interface FormData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  description: string;
  achievements: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  sortOrder: number;
  isVisible: boolean;
  institutionLogoUrl: string;
  institutionUrl: string;
  grade: string;
}

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [education, setEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState<FormData>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    description: '',
    achievements: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    sortOrder: 0,
    isVisible: true,
    institutionLogoUrl: '',
    institutionUrl: '',
    grade: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetchEducation();
  }, [params.id]);

  const fetchEducation = async () => {
    try {
      const res = await fetch(`/api/admin/educations/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setEducation(data.data);
        setFormData({
          institution: data.data.institution,
          degree: data.data.degree,
          fieldOfStudy: data.data.fieldOfStudy || '',
          location: data.data.location || '',
          description: data.data.description || '',
          achievements: data.data.achievements.join('\n'),
          startDate: data.data.startDate ? new Date(data.data.startDate).toISOString().split('T')[0] : '',
          endDate: data.data.endDate ? new Date(data.data.endDate).toISOString().split('T')[0] : '',
          isCurrent: data.data.isCurrent,
          sortOrder: data.data.sortOrder,
          isVisible: data.data.isVisible,
          institutionLogoUrl: data.data.institutionLogoUrl || '',
          institutionUrl: data.data.institutionUrl || '',
          grade: data.data.grade || '',
        });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to load education', variant: 'destructive' });
        router.push('/admin/education');
      }
    } catch (error) {
      console.error('Failed to fetch education:', error);
      toast({ title: 'Error', description: 'Failed to load education', variant: 'destructive' });
      router.push('/admin/education');
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
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.institutionLogoUrl && !isValidUrl(formData.institutionLogoUrl)) newErrors.institutionLogoUrl = 'Invalid URL';
    if (formData.institutionUrl && !isValidUrl(formData.institutionUrl)) newErrors.institutionUrl = 'Invalid URL';

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

      const res = await fetch(`/api/admin/educations/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          achievements,
          sortOrder: Number(formData.sortOrder),
          startDate: formData.startDate,
          endDate: formData.endDate || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Saved', description: 'Education updated successfully', variant: 'success' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update education', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update education:', error);
      toast({ title: 'Error', description: 'Failed to update education', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this education? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/educations/${params.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Education deleted successfully', variant: 'success' });
        router.push('/admin/education');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete education', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast({ title: 'Error', description: 'Failed to delete education', variant: 'destructive' });
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

  if (!education) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Edit Education
          </h1>
          <p className="text-gray-400 mt-1">{education.degree} at {education.institution}</p>
        </div>
        <Link href="/admin/education">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Education
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
              <Label htmlFor="institution">Institution *</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="University of Technology"
                  className={errors.institution ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                />
              </div>
              {errors.institution && <p className="text-sm text-red-400">{errors.institution}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="Bachelor of Technology"
                className={errors.degree ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.degree && <p className="text-sm text-red-400">{errors.degree}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
                placeholder="Computer Science Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, State"
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
                placeholder="Focus areas, relevant coursework, thesis..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade / GPA</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => handleChange('grade', e.target.value)}
                placeholder="3.85/4.0"
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
                <Label htmlFor="institutionLogoUrl">Institution Logo URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="institutionLogoUrl"
                    type="url"
                    value={formData.institutionLogoUrl}
                    onChange={(e) => handleChange('institutionLogoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className={errors.institutionLogoUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.institutionLogoUrl && <p className="text-sm text-red-400">{errors.institutionLogoUrl}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="institutionUrl">Institution Website URL</Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="institutionUrl"
                    type="url"
                    value={formData.institutionUrl}
                    onChange={(e) => handleChange('institutionUrl', e.target.value)}
                    placeholder="https://university.edu"
                    className={errors.institutionUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                  />
                </div>
                {errors.institutionUrl && <p className="text-sm text-red-400">{errors.institutionUrl}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Academic achievements, honors, awards (one per line)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.achievements}
              onChange={(e) => handleChange('achievements', e.target.value)}
              placeholder="Dean's List: Fall 2021, Spring 2022&#10;First Prize: University Hackathon 2022&#10;Published paper in Student Journal"
              rows={4}
            />
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
                <span className="text-sm">Currently studying here</span>
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
          <Link href="/admin/education">
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