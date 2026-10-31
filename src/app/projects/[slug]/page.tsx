import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { projects, siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProjectDetail from '@/components/dynamic/ProjectDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
  });
  return project;
}

async function getSettings() {
  const settings = await db.query.siteSettings.findFirst();
  return settings;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  const settings = await getSettings();

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const title = `${project.title} | ${settings?.siteTitle || 'Portfolio'}`;
  const description = project.shortDescription || project.description.slice(0, 160);
  const siteUrl = settings?.siteUrl || 'https://mrharshprasad-portfolio.vercel.app';
  const imageUrl = project.imageUrl || project.thumbnailUrl;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${siteUrl}/projects/${slug}`,
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Convert Date objects to ISO strings for client component
  const projectForClient = {
    ...project,
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };

  return <ProjectDetail project={projectForClient} />;
}