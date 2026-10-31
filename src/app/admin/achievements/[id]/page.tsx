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
import { Loader2, Save, ArrowLeft, Award, Calendar, ImageIcon, Link2, Trash2 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  imageUrl: string | null;
  credentialUrl: string | null;
  credentialId: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  issuer: string;
  description: string;
  imageUrl: string;
  credentialUrl: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  sortOrder: number;
  isVisible: boolean;
}

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    issuer: '',
    description: '',
    imageUrl: '',
    credentialUrl: '',
    credentialId: '',
    issueDate: '',
    expiryDate: '',
    sortOrder: 0,
    isVisible: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetchAchievement();
  }, [params.id]);

  const fetchAchievement = async () => {
    try {
      const res = await fetch(`/api/admin/achievements/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setAchievement(data.data);
        setFormData({
          title: data.data.title,
          issuer: data.data.issuer || '',
          description: data.data.description || '',
          imageUrl: data.data.imageUrl || '',
          credentialUrl: data.data.credentialUrl || '',
          credentialId: data.data.credentialId || '',
          issueDate: data.data.issueDate ? new Date(data.data.issueDate).toISOString().split('T')[0] : '',
          expiryDate: data.data.expiryDate ? new Date(data.data.expiryDate).toISOString().split('T')[0] : '',
          sortOrder: data.data.sortOrder,
          isVisible: data.data.isVisible,
        });
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to load achievement', variant: 'destructive' });
        router.push('/admin/achievements');
      }
    } catch (error) {
      console.error('Failed to fetch achievement:', error);
      toast({ title: 'Error', description: 'Failed to load achievement', variant: 'destructive' });
      router.push('/admin/achievements');
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) newErrors.imageUrl = 'Invalid URL';
    if (formData.credentialUrl && !isValidUrl(formData.credentialUrl)) newErrors.credentialUrl = 'Invalid URL';

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
      const res = await fetch(`/api/admin/achievements/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sortOrder: Number(formData.sortOrder),
          issueDate: formData.issueDate || null,
          expiryDate: formData.expiryDate || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Saved', description: 'Achievement updated successfully', variant: 'success' });
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update achievement', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update achievement:', error);
      toast({ title: 'Error', description: 'Failed to update achievement', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/achievements/${params.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Achievement deleted successfully', variant: 'success' });
        router.push('/admin/achievements');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete achievement', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      toast({ title: 'Error', description: 'Failed to delete achievement', variant: 'destructive' });
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

  if (!achievement) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Edit Achievement
          </h1>
          <p className="text-gray-400 mt-1">{achievement.title}</p>
        </div>
        <Link href="/admin/achievements">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Achievements
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Required fields for the achievement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="AWS Certified Solutions Architect - Associate"
                className={errors.title ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => handleChange('issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Validated expertise in designing distributed systems on AWS..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => handleChange('issueDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credentials & Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                value={formData.credentialId}
                onChange={(e) => handleChange('credentialId', e.target.value)}
                placeholder="AWS-SAA-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="credentialUrl"
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => handleChange('credentialUrl', e.target.value)}
                  placeholder="https://aws.amazon.com/certification/..."
                  className={errors.credentialUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                />
              </div>
              {errors.credentialUrl && <p className="text-sm text-red-400">{errors.credentialUrl}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Image</CardTitle>
            <CardDescription>Optional certificate badge/image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Certificate Image URL</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/certificate.png"
                  className={errors.imageUrl ? 'border-red-400 focus:ring-red-400 pl-10' : 'pl-10'}
                />
              </div>
              {errors.imageUrl && <p className="text-sm text-red-400">{errors.imageUrl}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <Link href="/admin/achievements">
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