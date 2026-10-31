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
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: Experience[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function ExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeHidden: includeHidden.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/experiences?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setExperiences(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch experiences', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      toast({ title: 'Error', description: 'Failed to fetch experiences', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [page, searchQuery, includeHidden]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Experience deleted successfully', variant: 'success' });
        fetchExperiences();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete experience', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toast({ title: 'Error', description: 'Failed to delete experience', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (exp: Experience) => {
    try {
      const res = await fetch(`/api/admin/experiences/${exp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !exp.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Experience ${!exp.isVisible ? 'published' : 'hidden'}`, variant: 'success' });
        fetchExperiences();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update experience', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update experience:', error);
      toast({ title: 'Error', description: 'Failed to update experience', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (start: string, end: string | null, isCurrent: boolean) => {
    const startStr = formatDate(start);
    if (isCurrent || !end) return `${startStr} - Present`;
    return `${startStr} - ${formatDate(end)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Experience
          </h1>
          <p className="text-gray-400 mt-1">Manage your work experience</p>
        </div>
        <Link href="/admin/experience/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Label className="flex items-center gap-2 cursor-pointer self-center">
              <input
                type="checkbox"
                checked={includeHidden}
                onChange={(e) => {
                  setIncludeHidden(e.target.checked);
                  setPage(1);
                }}
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
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-lime-400" />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No experiences found</p>
              <Link href="/admin/experience/new" className="inline-flex items-center gap-2 mt-4 text-lime-400 hover:underline">
                <Plus className="w-4 h-4" />
                Add your first experience
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Duration</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {experiences.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {exp.companyLogoUrl && (
                            <img src={exp.companyLogoUrl} alt={exp.company} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div>
                            <Link href={`/admin/experience/${exp.id}`} className="font-medium text-white hover:text-lime-400 transition-colors">
                              {exp.company}
                            </Link>
                            <p className="text-sm text-gray-500">{exp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {exp.techStack.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded text-gray-300">
                              {tech}
                            </span>
                          ))}
                          {exp.techStack.length > 3 && (
                            <span className="px-2 py-0.5 text-xs text-gray-500">+{exp.techStack.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-sm text-gray-400">
                        {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        {exp.isCurrent && <span className="ml-2 px-2 py-0.5 text-xs bg-lime-400/20 text-lime-400 rounded">Current</span>}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 text-sm ${exp.isVisible ? 'text-lime-400' : 'text-gray-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${exp.isVisible ? 'bg-lime-400' : 'bg-gray-500'}`} />
                          {exp.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/experience/${exp.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleVisibility(exp)}
                            className="p-2 text-gray-400 hover:text-lime-400 hover:bg-white/10 rounded transition-colors"
                            title={exp.isVisible ? 'Hide' : 'Show'}
                          >
                            {exp.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            disabled={deletingId === exp.id}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                            title="Delete"
                          >
                            {deletingId === exp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} experiences
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}