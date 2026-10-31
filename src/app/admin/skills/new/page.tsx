'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, ArrowLeft, Code, Palette } from 'lucide-react';

interface FormData {
  category: string;
  skillList: string;
  icon: string;
  color: string;
  sortOrder: number;
  isVisible: boolean;
}

const iconOptions = [
  'Code2', 'Terminal', 'Database', 'Cloud', 'Globe', 'Shield', 'Wrench', 'Zap'
];

export default function NewSkillPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    category: '',
    skillList: '',
    icon: 'Code2',
    color: '#ccff00',
    sortOrder: 0,
    isVisible: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (key: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.skillList.trim()) newErrors.skillList = 'At least one skill is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const skillList = formData.skillList
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skillList,
          sortOrder: Number(formData.sortOrder),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: 'Created', description: 'Skill category created successfully', variant: 'success' });
        router.push('/admin/skills');
        router.refresh();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to create skill category', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to create skill:', error);
      toast({ title: 'Error', description: 'Failed to create skill category', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            New Skill Category
          </h1>
          <p className="text-gray-400 mt-1">Add a new skill category</p>
        </div>
        <Link href="/admin/skills">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Skills
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Define the skill category and technologies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Frontend Development"
                className={errors.category ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.category && <p className="text-sm text-red-400">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillList">Skills (comma-separated) *</Label>
              <Input
                id="skillList"
                value={formData.skillList}
                onChange={(e) => handleChange('skillList', e.target.value)}
                placeholder="React, Next.js, TypeScript, Tailwind CSS"
                className={errors.skillList ? 'border-red-400 focus:ring-red-400' : ''}
              />
              {errors.skillList && <p className="text-sm text-red-400">{errors.skillList}</p>}
              <p className="text-xs text-gray-500">Separate technologies with commas</p>
              {formData.skillList && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.skillList.split(',').map((tech) => tech.trim()).filter(Boolean).map((tech, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visual Settings</CardTitle>
            <CardDescription>Customize how this category appears</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-white/20 bg-white/5 cursor-pointer p-0"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    placeholder="#ccff00"
                  />
                </div>
              </div>
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

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Link href="/admin/skills">
            <Button type="button" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Skill Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}