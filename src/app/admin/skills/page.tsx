'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Search,
  Loader2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Code,
  ChevronLeft,
  ChevronRight,
  Palette,
} from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  skillList: string[];
  icon: string | null;
  color: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function SkillsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeHidden: includeHidden.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/skills?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setSkills(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch skills', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      toast({ title: 'Error', description: 'Failed to fetch skills', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [page, searchQuery, includeHidden]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill category?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Skill category deleted successfully', variant: 'success' });
        fetchSkills();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete skill', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast({ title: 'Error', description: 'Failed to delete skill', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (skill: Skill) => {
    try {
      const res = await fetch(`/api/admin/skills/${skill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !skill.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Skill category ${!skill.isVisible ? 'published' : 'hidden'}`, variant: 'success' });
        fetchSkills();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update skill', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update skill:', error);
      toast({ title: 'Error', description: 'Failed to update skill', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Skills
          </h1>
          <p className="text-gray-400 mt-1">Manage your technical skills by category</p>
        </div>
        <Link href="/admin/skills/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Skill Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Label className="flex items-center gap-2 cursor-pointer self-center">
              <input
                type="checkbox"
                checked={includeHidden}
                onChange={(e) => { setIncludeHidden(e.target.checked); setPage(1); }}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-lime-400 focus:ring-lime-400"
              />
              <span className="text-sm">Include hidden</span>
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-lime-400" /></div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No skill categories found</p>
              <Link href="/admin/skills/new" className="inline-flex items-center gap-2 mt-4 text-lime-400 hover:underline">
                <Plus className="w-4 h-4" /> Create your first skill category
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">Color</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Skills</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: skill.color || '#333' }}>
                          {skill.icon ? <span className="text-lg">{skill.icon}</span> : <Code className="w-5 h-5 text-gray-400" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/skills/${skill.id}`} className="font-medium text-white hover:text-lime-400 transition-colors">
                          {skill.category}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {skill.skillList.slice(0, 5).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded text-gray-300">
                              {s}
                            </span>
                          ))}
                          {skill.skillList.length > 5 && (
                            <span className="px-2 py-0.5 text-xs text-gray-500">+{skill.skillList.length - 5}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 text-sm ${skill.isVisible ? 'text-lime-400' : 'text-gray-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${skill.isVisible ? 'bg-lime-400' : 'bg-gray-500'}`} />
                          {skill.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/skills/${skill.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleToggleVisibility(skill)} className="p-2 text-gray-400 hover:text-lime-400 hover:bg-white/10 rounded transition-colors" title={skill.isVisible ? 'Hide' : 'Show'}>
                            {skill.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(skill.id)} disabled={deletingId === skill.id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors" title="Delete">
                            {deletingId === skill.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-400">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} categories</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}