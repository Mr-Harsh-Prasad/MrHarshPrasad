import DynamicHero from '@/components/dynamic/Hero';
import DynamicProjects from '@/components/dynamic/Projects';
import DynamicExperience from '@/components/dynamic/Experience';
import DynamicEducation from '@/components/dynamic/Education';
import DynamicSkills from '@/components/dynamic/Skills';
import DynamicAchievements from '@/components/dynamic/Achievements';
import DynamicContact from '@/components/dynamic/Contact';
import DynamicFooter from '@/components/dynamic/Footer';
import GlowingSeparator from '@/components/ui/GlowingSeparator';
import { db } from '@/db';
import { projects, experiences, educations, skills, achievements, siteSettings } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

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
  isFeatured: boolean;
}

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
  companyLogoUrl: string | null;
  companyUrl: string | null;
}

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
  institutionLogoUrl: string | null;
  institutionUrl: string | null;
  grade: string | null;
}

interface Skill {
  id: string;
  category: string;
  skillList: string[];
  icon: string | null;
  color: string | null;
  sortOrder: number;
}

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
}

interface ContactInfo {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  email: string;
  footerText: string;
  footerShowGithub: boolean;
  footerShowLinkedin: boolean;
}

async function getProjects(): Promise<Project[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const data = await db.query.projects.findMany({
      where: eq(projects.isVisible, true),
      orderBy: [asc(projects.sortOrder), asc(projects.createdAt)],
    });
    return data.map(p => ({
      ...p,
      techStack: p.techStack || [],
      isFeatured: p.isFeatured ?? false,
    })) as Project[];
  } catch {
    return [];
  }
}

async function getExperiences(): Promise<Experience[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const data = await db.query.experiences.findMany({
      where: eq(experiences.isVisible, true),
      orderBy: [desc(experiences.startDate), asc(experiences.sortOrder)],
    });
    return data.map(e => ({
      ...e,
      achievements: e.achievements || [],
      techStack: e.techStack || [],
      companyLogoUrl: e.companyLogoUrl,
      companyUrl: e.companyUrl,
      startDate: e.startDate?.toISOString() || '',
      endDate: e.endDate?.toISOString() || null,
    })) as Experience[];
  } catch {
    return [];
  }
}

async function getEducations(): Promise<Education[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const data = await db.query.educations.findMany({
      where: eq(educations.isVisible, true),
      orderBy: [desc(educations.startDate), asc(educations.sortOrder)],
    });
    return data.map(e => ({
      ...e,
      achievements: e.achievements || [],
      institutionLogoUrl: e.institutionLogoUrl,
      institutionUrl: e.institutionUrl,
      startDate: e.startDate?.toISOString() || '',
      endDate: e.endDate?.toISOString() || null,
    })) as Education[];
  } catch {
    return [];
  }
}

async function getSkills(): Promise<Skill[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const data = await db.query.skills.findMany({
      where: eq(skills.isVisible, true),
      orderBy: [asc(skills.sortOrder), asc(skills.category)],
    });
    return data.map(s => ({
      ...s,
      skillList: s.skillList || [],
      icon: s.icon,
      color: s.color,
    })) as Skill[];
  } catch {
    return [];
  }
}

async function getAchievements(): Promise<Achievement[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const data = await db.query.achievements.findMany({
      where: eq(achievements.isVisible, true),
      orderBy: [desc(achievements.issueDate), asc(achievements.sortOrder)],
    });
    return data.map(a => ({
      ...a,
      issuer: a.issuer,
      description: a.description,
      imageUrl: a.imageUrl,
      credentialUrl: a.credentialUrl,
      credentialId: a.credentialId,
      issueDate: a.issueDate?.toISOString() || null,
      expiryDate: a.expiryDate?.toISOString() || null,
    })) as Achievement[];
  } catch {
    return [];
  }
}

async function getSettings(): Promise<SiteSettings | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const settings = await db.query.siteSettings.findFirst();
    if (!settings) return null;
    return {
      heroTitle: settings.heroTitle || 'Harsh Prasad',
      heroSubtitle: settings.heroSubtitle || 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
      heroDescription: settings.heroDescription || 'Building accessible, performant web experiences with modern technologies.',
      heroImageUrl: settings.heroImageUrl || '',
      heroCtaText: settings.heroCtaText || 'View Work',
      heroCtaLink: settings.heroCtaLink || '#projects',
      heroSecondaryCtaText: settings.heroSecondaryCtaText || 'Contact Me',
      heroSecondaryCtaLink: settings.heroSecondaryCtaLink || '#contact',
      siteTitle: settings.siteTitle || 'Mr Harsh Prasad | Portfolio',
      siteDescription: settings.siteDescription || 'Personal portfolio of Harsh Prasad',
      siteUrl: settings.siteUrl || 'https://mrharshprasad-portfolio.vercel.app',
      githubUrl: settings.githubUrl || 'https://github.com/harshprasad',
      linkedinUrl: settings.linkedinUrl || 'https://linkedin.com/in/harshprasad',
      twitterUrl: settings.twitterUrl || '',
      email: settings.email || 'harsh@example.com',
      footerText: settings.footerText || 'Built with Next.js, React, and Tailwind CSS',
      footerShowGithub: settings.footerShowGithub ?? true,
      footerShowLinkedin: settings.footerShowLinkedin ?? true,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  // Fetch all data in parallel directly from database
  const [
    projectsData,
    experiencesData,
    educationsData,
    skillsData,
    achievementsData,
    settingsData,
  ] = await Promise.all([
    getProjects(),
    getExperiences(),
    getEducations(),
    getSkills(),
    getAchievements(),
    getSettings(),
  ]);

  // Default settings for when database is unavailable
  const defaultSettings = {
    heroTitle: 'Harsh Prasad',
    heroSubtitle: 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
    heroDescription: 'Building accessible, performant web experiences with modern technologies.',
    heroImageUrl: '',
    heroCtaText: 'View Work',
    heroCtaLink: '#projects',
    heroSecondaryCtaText: 'Contact Me',
    heroSecondaryCtaLink: '#contact',
    siteTitle: 'Mr Harsh Prasad | Portfolio',
    siteDescription: 'Personal portfolio of Harsh Prasad',
    siteUrl: 'https://mrharshprasad-portfolio.vercel.app',
    githubUrl: 'https://github.com/harshprasad',
    linkedinUrl: 'https://linkedin.com/in/harshprasad',
    twitterUrl: '',
    email: 'harsh@example.com',
    footerText: 'Built with Next.js, React, and Tailwind CSS',
    footerShowGithub: true,
    footerShowLinkedin: true,
  };

  const s = settingsData || defaultSettings;

  return (
    <main className="relative bg-black text-white">
      {/* Hero Section */}
      <DynamicHero
        title={s.heroTitle}
        subtitle={s.heroSubtitle}
        description={s.heroDescription}
        imageUrl={s.heroImageUrl}
        ctaText={s.heroCtaText}
        ctaLink={s.heroCtaLink}
        secondaryCtaText={s.heroSecondaryCtaText}
        secondaryCtaLink={s.heroSecondaryCtaLink}
        githubUrl={s.githubUrl}
        linkedinUrl={s.linkedinUrl}
        twitterUrl={s.twitterUrl}
        email={s.email}
      />
      <GlowingSeparator />

      {/* Education Section */}
      <DynamicEducation educations={educationsData} />
      <GlowingSeparator />

      {/* Achievements Section */}
      <DynamicAchievements achievements={achievementsData} />
      <GlowingSeparator />

      {/* Skills Section */}
      <DynamicSkills skills={skillsData} />
      <GlowingSeparator />

      {/* Projects Section */}
      <DynamicProjects projects={projectsData} />
      <GlowingSeparator />

      {/* Professional Experience Section */}
      <DynamicExperience experiences={experiencesData} />
      <GlowingSeparator />

      {/* Contact Section */}
      <DynamicContact
        email={s.email}
        githubUrl={s.githubUrl}
        linkedinUrl={s.linkedinUrl}
        twitterUrl={s.twitterUrl}
      />
      <GlowingSeparator />

      {/* Footer */}
      <DynamicFooter
        footerText={s.footerText}
        footerShowGithub={s.footerShowGithub}
        footerShowLinkedin={s.footerShowLinkedin}
        githubUrl={s.githubUrl}
        linkedinUrl={s.linkedinUrl}
        twitterUrl={s.twitterUrl}
        email={s.email}
        siteTitle={s.siteTitle}
      />
    </main>
  );
}