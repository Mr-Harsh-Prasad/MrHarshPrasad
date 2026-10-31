import DynamicHero from '@/components/dynamic/Hero';
import DynamicProjects from '@/components/dynamic/Projects';
import DynamicExperience from '@/components/dynamic/Experience';
import DynamicEducation from '@/components/dynamic/Education';
import DynamicSkills from '@/components/dynamic/Skills';
import DynamicAchievements from '@/components/dynamic/Achievements';
import DynamicContact from '@/components/dynamic/Contact';
import DynamicFooter from '@/components/dynamic/Footer';
import GlowingSeparator from '@/components/ui/GlowingSeparator';

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

async function fetchData<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data.success ? data.data : ([] as unknown as T);
  } catch {
    return [] as unknown as T;
  }
}

export default async function Home() {
  // Fetch all data in parallel
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const [
    projects,
    experiences,
    educations,
    skills,
    achievements,
    contactInfo,
    settings,
  ] = await Promise.all([
    fetchData<Project[]>(`${baseUrl}/api/public/projects`),
    fetchData<Experience[]>(`${baseUrl}/api/public/experiences`),
    fetchData<Education[]>(`${baseUrl}/api/public/educations`),
    fetchData<Skill[]>(`${baseUrl}/api/public/skills`),
    fetchData<Achievement[]>(`${baseUrl}/api/public/achievements`),
    fetchData<ContactInfo>(`${baseUrl}/api/public/contact`),
    fetchData<SiteSettings>(`${baseUrl}/api/settings`),
  ]);

  const s = settings || {
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
      <DynamicEducation educations={educations} />
      <GlowingSeparator />

      {/* Achievements Section */}
      <DynamicAchievements achievements={achievements} />
      <GlowingSeparator />

      {/* Skills Section */}
      <DynamicSkills skills={skills} />
      <GlowingSeparator />

      {/* Projects Section */}
      <DynamicProjects projects={projects} />
      <GlowingSeparator />

      {/* Professional Experience Section */}
      <DynamicExperience experiences={experiences} />
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