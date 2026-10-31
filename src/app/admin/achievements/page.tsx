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
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Link2,
  ImageIcon,
} from 'lucide-react';

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

interface PaginatedResponse {
  success: boolean;
  data: Achievement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeHidden: includeHidden.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/achievements?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setAchievements(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch achievements', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      toast({ title: 'Error', description: 'Failed to fetch achievements', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [page, searchQuery, includeHidden]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Achievement deleted successfully', variant: 'success' });
        fetchAchievements();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete achievement', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      toast({ title: 'Error', description: 'Failed to delete achievement', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (ach: Achievement) => {
    try {
      const res = await fetch(`/api/admin/achievements/${ach.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !ach.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Achievement ${!ach.isVisible ? 'published' : 'hidden'}`, variant: 'success' });
        fetchAchievements();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update achievement', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update achievement:', error);
      toast({ title: 'Error', description: 'Failed to update achievement', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Achievements
          </h1>
          <p className="text-gray-400 mt-1">Manage your certifications and awards</p>
        </div>
        <Link href="/admin/achievements/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Achievement
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search achievements..."
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
          ) : achievements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No achievements found</p>
              <Link href="/admin/achievements/new" className="inline-flex items-center gap-2 mt-4 text-lime-400 hover:underline">
                <Plus className="w-4 h-4" /> Add your first achievement
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">Image</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Achievement</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Issuer</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {achievements.map((ach) => (
                    <tr key={ach.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        {ach.imageUrl && (
                          <img src={ach.imageUrl} alt={ach.title} className="w-12 h-12 rounded-lg object-cover" />
                        )}
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/achievements/${ach.id}`} className="font-medium text-white hover:text-lime-400 transition-colors">
                          {ach.title}
                        </Link>
                        {ach.credentialId && <p className="text-xs text-gray-500">ID: {ach.credentialId}</p>}
                      </td>
                      <td className="p-4 hidden md:table-cell text-sm text-gray-400">{ach.issuer || '—'}</td>
                      <td className="p-4 hidden lg:table-cell text-sm text-gray-400">{formatDate(ach.issueDate)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/achievements/${ach.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleToggleVisibility(ach)} className="p-2 text-gray-400 hover:text-lime-400 hover:bg-white/10 rounded transition-colors" title={ach.isVisible ? 'Hide' : 'Show'}>
                            {ach.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(ach.id)} disabled={deletingId === ach.id} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors" title="Delete">
                            {deletingId === ach.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
              <p className="text-sm text-gray-400">Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} achievements</p>
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