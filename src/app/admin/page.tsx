'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FolderKanban,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  MessageSquare,
  Palette,
  TrendingUp,
  Users,
  ArrowUpRight,
} from 'lucide-react';

interface Stats {
  projects: number;
  experiences: number;
  educations: number;
  skills: number;
  achievements: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    experiences: 0,
    educations: 0,
    skills: 0,
    achievements: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, experiencesRes, educationsRes, skillsRes, achievementsRes, messagesRes] = await Promise.all([
          fetch('/api/admin/projects?limit=1'),
          fetch('/api/admin/experiences?limit=1'),
          fetch('/api/admin/educations?limit=1'),
          fetch('/api/admin/skills?limit=1'),
          fetch('/api/admin/achievements?limit=1'),
          fetch('/api/admin/messages?limit=1'),
        ]);

        const [
          projectsData,
          experiencesData,
          educationsData,
          skillsData,
          achievementsData,
          messagesData,
        ] = await Promise.all([
          projectsRes.json(),
          experiencesRes.json(),
          educationsRes.json(),
          skillsRes.json(),
          achievementsRes.json(),
          messagesRes.json(),
        ]);

        setStats({
          projects: projectsData.total || 0,
          experiences: experiencesData.total || 0,
          educations: educationsData.total || 0,
          skills: skillsData.total || 0,
          achievements: achievementsData.total || 0,
          messages: messagesData.total || 0,
          unreadMessages: messagesData.unread || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'from-lime-400 to-lime-600',
      href: '/admin/projects',
      description: 'Portfolio projects',
    },
    {
      name: 'Experience',
      value: stats.experiences,
      icon: Briefcase,
      color: 'from-cyan-400 to-cyan-600',
      href: '/admin/experience',
      description: 'Work history',
    },
    {
      name: 'Education',
      value: stats.educations,
      icon: GraduationCap,
      color: 'from-purple-400 to-purple-600',
      href: '/admin/education',
      description: 'Academic background',
    },
    {
      name: 'Skills',
      value: stats.skills,
      icon: Code,
      color: 'from-orange-400 to-orange-600',
      href: '/admin/skills',
      description: 'Technical skills',
    },
    {
      name: 'Achievements',
      value: stats.achievements,
      icon: Award,
      color: 'from-yellow-400 to-yellow-600',
      href: '/admin/achievements',
      description: 'Certifications & awards',
    },
    {
      name: 'Messages',
      value: stats.messages,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
      icon: MessageSquare,
      color: 'from-red-400 to-red-600',
      href: '/admin/messages',
      description: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'Contact messages',
    },
  ];

  const quickActions = [
    { name: 'Add Project', href: '/admin/projects/new', icon: FolderKanban, color: 'bg-lime-400/20 text-lime-400' },
    { name: 'Add Experience', href: '/admin/experience/new', icon: Briefcase, color: 'bg-cyan-400/20 text-cyan-400' },
    { name: 'Customize Theme', href: '/admin/appearance', icon: Palette, color: 'bg-purple-400/20 text-purple-400' },
    { name: 'Manage Skills', href: '/admin/skills', icon: Code, color: 'bg-orange-400/20 text-orange-400' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's an overview of your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/appearance">
            <Button variant="outline" className="gap-2">
              <Palette className="w-4 h-4" />
              Customize Theme
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button className="gap-2">
              <FolderKanban className="w-4 h-4" />
              Add Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group">
            <Card className="glass-strong group-hover:border-lime-400/30 transition-all hover:shadow-lg hover:shadow-lime-400/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.description}</p>
                    <h3 className="font-display text-3xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                      {isLoading ? '—' : stat.value}
                    </h3>
                    {stat.badge !== undefined && stat.badge > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 mt-2">
                        {stat.badge} unread
                      </span>
                    )}
                  </div>
                  <div className={stat.color + ' rounded-xl p-3'}>
                    <stat.icon className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500 group-hover:text-lime-400 transition-colors">
                  <span>{stat.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Card className="glass-strong hover:border-lime-400/30 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={action.color + ' rounded-xl p-4 w-fit mx-auto mb-4'}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-white">{action.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h2 className="font-display text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/projects" className="glass-strong p-6 hover:border-lime-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-lime-400/20 text-lime-400 rounded-xl p-3">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Manage Projects</h3>
                <p className="text-sm text-gray-400 mt-1">Add, edit, reorder, or delete portfolio projects</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/experience" className="glass-strong p-6 hover:border-cyan-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-cyan-400/20 text-cyan-400 rounded-xl p-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Work Experience</h3>
                <p className="text-sm text-gray-400 mt-1">Manage your professional work history</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/education" className="glass-strong p-6 hover:border-purple-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-purple-400/20 text-purple-400 rounded-xl p-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Education</h3>
                <p className="text-sm text-gray-400 mt-1">Manage your academic background</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/skills" className="glass-strong p-6 hover:border-orange-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-orange-400/20 text-orange-400 rounded-xl p-3">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Skills</h3>
                <p className="text-sm text-gray-400 mt-1">Manage technical skills by category</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/achievements" className="glass-strong p-6 hover:border-yellow-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400/20 text-yellow-400 rounded-xl p-3">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Achievements</h3>
                <p className="text-sm text-gray-400 mt-1">Manage certifications and awards</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/messages" className="glass-strong p-6 hover:border-red-400/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-red-400/20 text-red-400 rounded-xl p-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-white">Messages</h3>
                <p className="text-sm text-gray-400 mt-1">View and manage contact form submissions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}