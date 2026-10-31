'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  techStack: string[];
  liveLink: string | null;
  githubLink: string | null;
  demoVideoUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        includeHidden: includeHidden.toString(),
      });
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/admin/projects?${params}`);
      const data: PaginatedResponse = await res.json();
      if (data.success) {
        setProjects(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to fetch projects', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({ title: 'Error', description: 'Failed to fetch projects', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, searchQuery, includeHidden]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Deleted', description: 'Project deleted successfully', variant: 'success' });
        fetchProjects();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to delete project', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !project.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Updated', description: `Project ${!project.isVisible ? 'published' : 'hidden'}`, variant: 'success' });
        fetchProjects();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to update project', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      toast({ title: 'Error', description: 'Failed to update project', variant: 'destructive' });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Projects
          </h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search projects..."
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

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-lime-400" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No projects found</p>
              <Link href="/admin/projects/new" className="inline-flex items-center gap-2 mt-4 text-lime-400 hover:underline">
                <Plus className="w-4 h-4" />
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">Order</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">Tech Stack</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-white h-8 w-8"
                          onClick={() => {}}
                          disabled
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      </td>
                      <td className="p-4">
                        <div>
                          <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-lime-400 transition-colors">
                            {project.title}
                          </Link>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{project.slug}</p>
                          {project.shortDescription && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-1">{project.shortDescription}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded text-gray-300">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-gray-500">+{project.techStack.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${project.isVisible ? 'bg-lime-400' : 'bg-gray-500'}`} />
                          <span className="text-sm text-gray-400 capitalize">{project.isVisible ? 'Visible' : 'Hidden'}</span>
                          {project.isFeatured && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-400/20 text-yellow-400 rounded">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/projects/${project.id}`} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleVisibility(project)}
                            className="p-2 text-gray-400 hover:text-lime-400 hover:bg-white/10 rounded transition-colors"
                            title={project.isVisible ? 'Hide' : 'Show'}
                          >
                            {project.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
                            title="Delete"
                          >
                            {deletingId === project.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} projects
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
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