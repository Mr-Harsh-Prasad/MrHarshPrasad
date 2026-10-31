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
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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

interface PaginatedResponse {
  success: boolean;
  data: Education[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function EducationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEducations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeHidden: includeHidden.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/educations?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setEducations(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch educations', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch educations:', error);
      toast({ title: 'Error', description: 'Failed to fetch educations', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, [page, searchQuery, includeHidden]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/educations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Education deleted successfully', variant: 'success' });
        fetchEducations();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete education', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
      toast({ title: 'Error', description: 'Failed to delete education', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (edu: Education) => {
    try {
      const res = await fetch(`/api/admin/educations/${edu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !edu.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Education ${!edu.isVisible ? 'published' : 'hidden'}`, variant: 'success' });
        fetchEducations();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update education', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update education:', error);
      toast({ title: 'Error', description: 'Failed to update education', variant: 'destructive' });
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
            Education
          </h1>
          <p className="text-gray-400 mt-1">Manage your academic background</p>
        </div>
        <Link href="/admin/education/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search education..."
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
          ) : educations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No education records found</p>
              <Link href="/admin/education/new" className="inline-flex items-center gap-2 mt-4 text-lime-400 hover:underline">
                <Plus className="w-4 h-4" /> Add your first education
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Institution</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Degree</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Field of Study</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Duration</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {educations.map((edu) => (
                    <tr key={edu.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {edu.institutionLogoUrl && (
                            <img src={edu.institutionLogoUrl} alt={edu.institution} className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <div>
                            <Link href={`/admin/education/${edu.id}`} className="font-medium text-white hover:text-lime-400 transition-colors">
                              {edu.institution}
                            </Link>
                            <p className="text-sm text-gray-500">{edu.degree}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">{edu.fieldOfStudy || '—'}</td>
                      <td className="p-4 hidden md:table-cell text-sm text-gray-400">
                        {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 text-sm ${edu.isVisible ? 'text-lime-400' : 'text-gray-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${edu.isVisible ? 'bg-lime-400' : 'bg-gray-500'}`} />
                          {edu.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/education/${edu.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleToggleVisibility(edu)} className="p-2 text-gray-400 hover:text-lime-400 hover:bg-white/10 rounded transition-colors" title={edu.isVisible ? 'Hide' : 'Show'}>
                            {edu.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(edu.id)} disabled={deletingId === edu.id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors" title="Delete">
                            {deletingId === edu.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <p className="text-sm text-gray-400">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} records</p>
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