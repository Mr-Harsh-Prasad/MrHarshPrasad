'use server';

import { db } from '@/db';
import { siteSettings, projects, experiences, educations, skills, achievements, users, contactMessages } from '@/db/schema';
import { eq, desc, asc, and, ilike, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// ============================================
// SITE SETTINGS ACTIONS
// ============================================

const siteSettingsSchema = z.object({
  themePrimaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  themeSecondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  themeAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  fontFamilyBase: z.string().max(100).optional(),
  fontFamilyDisplay: z.string().max(100).optional(),
  fontFamilyMono: z.string().max(100).optional(),
  fontSizeBase: z.string().max(10).optional(),
  fontSizeScale: z.string().max(20).optional(),
  animationPreference: z.string().max(50).optional(),
  animationDuration: z.string().max(20).optional(),
  animationEasing: z.string().max(50).optional(),
  reducedMotion: z.boolean().optional(),
  heroTitle: z.string().max(200).optional(),
  heroSubtitle: z.string().max(500).optional(),
  heroDescription: z.string().max(1000).optional(),
  heroImageUrl: z.string().url().optional().or(z.literal('')),
  heroCtaText: z.string().max(50).optional(),
  heroCtaLink: z.string().max(100).optional(),
  heroSecondaryCtaText: z.string().max(50).optional(),
  heroSecondaryCtaLink: z.string().max(100).optional(),
  siteTitle: z.string().max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  siteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  footerText: z.string().max(200).optional(),
  footerShowGithub: z.boolean().optional(),
  footerShowLinkedin: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
});

export async function getSiteSettings() {
  try {
    const settings = await db.query.siteSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      const [newSettings] = await db.insert(siteSettings).values({}).returning();
      return { success: true, data: newSettings };
    }
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return { success: false, error: 'Failed to fetch site settings' };
  }
}

export async function updateSiteSettings(data: z.infer<typeof siteSettingsSchema>) {
  try {
    const validated = siteSettingsSchema.parse(data);
    
    const existing = await db.query.siteSettings.findFirst();
    
    let result;
    if (existing) {
      [result] = await db
        .update(siteSettings)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
    } else {
      [result] = await db.insert(siteSettings).values(validated).returning();
    }
    
    revalidatePath('/admin/appearance');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating site settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update site settings' };
  }
}

// ============================================
// PROJECTS ACTIONS
// ============================================

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  shortDescription: z.string().max(300).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()).default([]),
  liveLink: z.string().url().optional().or(z.literal('')),
  githubLink: z.string().url().optional().or(z.literal('')),
  demoVideoUrl: z.string().url().optional().or(z.literal('')),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

export async function getProjects(includeHidden = false) {
  try {
    const where = includeHidden ? undefined : eq(projects.isVisible, true);
    const data = await db.query.projects.findMany({
      where,
      orderBy: [asc(projects.sortOrder), desc(projects.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: 'Failed to fetch projects' };
  }
}

export async function getProjectById(id: string) {
  try {
    const data = await db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: 'Failed to fetch project' };
  }
}

export async function createProject(data: z.infer<typeof projectSchema>) {
  try {
    const validated = projectSchema.parse(data);
    
    // Check slug uniqueness
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, validated.slug),
    });
    
    if (existing) {
      return { success: false, error: 'A project with this slug already exists' };
    }
    
    const [result] = await db.insert(projects).values({
      ...validated,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      endDate: validated.endDate ? new Date(validated.endDate) : null,
    }).returning();
    
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: Partial<z.infer<typeof projectSchema>>) {
  try {
    const validated = projectSchema.partial().parse(data);
    
    // Check slug uniqueness if slug is being changed
    if (validated.slug) {
      const existing = await db.query.projects.findFirst({
        where: and(eq(projects.slug, validated.slug), eq(projects.id, id)),
      });
      
      if (existing) {
        return { success: false, error: 'A project with this slug already exists' };
      }
    }
    
    const [result] = await db
      .update(projects)
      .set({ 
        ...validated, 
        startDate: validated.startDate ? new Date(validated.startDate) : undefined,
        endDate: validated.endDate ? new Date(validated.endDate) : undefined,
        updatedAt: new Date() 
      })
      .where(eq(projects.id, id))
      .returning();
    
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

export async function reorderProjects(projectIds: string[]) {
  try {
    for (let i = 0; i < projectIds.length; i++) {
      await db
        .update(projects)
        .set({ sortOrder: i, updatedAt: new Date() })
        .where(eq(projects.id, projectIds[i]));
    }
    revalidatePath('/admin/projects');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error reordering projects:', error);
    return { success: false, error: 'Failed to reorder projects' };
  }
}

// ============================================
// EXPERIENCES ACTIONS
// ============================================

const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  location: z.string().max(200).optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isCurrent: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  companyLogoUrl: z.string().url().optional().or(z.literal('')),
  companyUrl: z.string().url().optional().or(z.literal('')),
});

export async function getExperiences(includeHidden = false) {
  try {
    const where = includeHidden ? undefined : eq(experiences.isVisible, true);
    const data = await db.query.experiences.findMany({
      where,
      orderBy: [desc(experiences.startDate), asc(experiences.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return { success: false, error: 'Failed to fetch experiences' };
  }
}

export async function createExperience(data: z.infer<typeof experienceSchema>) {
  try {
    const validated = experienceSchema.parse(data);
    
    const [result] = await db.insert(experiences).values({
      ...validated,
      startDate: new Date(validated.startDate),
      endDate: validated.endDate ? new Date(validated.endDate) : null,
    }).returning();
    
    revalidatePath('/admin/experience');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating experience:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create experience' };
  }
}

export async function updateExperience(id: string, data: Partial<z.infer<typeof experienceSchema>>) {
  try {
    const validated = experienceSchema.partial().parse(data);
    
    const [result] = await db
      .update(experiences)
      .set({ 
        ...validated, 
        startDate: validated.startDate ? new Date(validated.startDate) : undefined,
        endDate: validated.endDate ? new Date(validated.endDate) : undefined,
        updatedAt: new Date() 
      })
      .where(eq(experiences.id, id))
      .returning();
    
    revalidatePath('/admin/experience');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating experience:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update experience' };
  }
}

export async function deleteExperience(id: string) {
  try {
    await db.delete(experiences).where(eq(experiences.id, id));
    revalidatePath('/admin/experience');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting experience:', error);
    return { success: false, error: 'Failed to delete experience' };
  }
}

// ============================================
// EDUCATION ACTIONS
// ============================================

const educationSchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  fieldOfStudy: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isCurrent: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  institutionLogoUrl: z.string().url().optional().or(z.literal('')),
  institutionUrl: z.string().url().optional().or(z.literal('')),
  grade: z.string().max(50).optional(),
});

export async function getEducations(includeHidden = false) {
  try {
    const where = includeHidden ? undefined : eq(educations.isVisible, true);
    const data = await db.query.educations.findMany({
      where,
      orderBy: [desc(educations.startDate), asc(educations.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching educations:', error);
    return { success: false, error: 'Failed to fetch educations' };
  }
}

export async function createEducation(data: z.infer<typeof educationSchema>) {
  try {
    const validated = educationSchema.parse(data);
    
    const [result] = await db.insert(educations).values({
      ...validated,
      startDate: new Date(validated.startDate),
      endDate: validated.endDate ? new Date(validated.endDate) : null,
    }).returning();
    
    revalidatePath('/admin/education');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating education:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create education' };
  }
}

export async function updateEducation(id: string, data: Partial<z.infer<typeof educationSchema>>) {
  try {
    const validated = educationSchema.partial().parse(data);
    
    const [result] = await db
      .update(educations)
      .set({ 
        ...validated, 
        startDate: validated.startDate ? new Date(validated.startDate) : undefined,
        endDate: validated.endDate ? new Date(validated.endDate) : undefined,
        updatedAt: new Date() 
      })
      .where(eq(educations.id, id))
      .returning();
    
    revalidatePath('/admin/education');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating education:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update education' };
  }
}

export async function deleteEducation(id: string) {
  try {
    await db.delete(educations).where(eq(educations.id, id));
    revalidatePath('/admin/education');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting education:', error);
    return { success: false, error: 'Failed to delete education' };
  }
}

// ============================================
// SKILLS ACTIONS
// ============================================

const skillSchema = z.object({
  category: z.string().min(1).max(100),
  skillList: z.array(z.string()).default([]),
  icon: z.string().max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function getSkills(includeHidden = false) {
  try {
    const where = includeHidden ? undefined : eq(skills.isVisible, true);
    const data = await db.query.skills.findMany({
      where,
      orderBy: [asc(skills.sortOrder), asc(skills.category)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching skills:', error);
    return { success: false, error: 'Failed to fetch skills' };
  }
}

export async function createSkill(data: z.infer<typeof skillSchema>) {
  try {
    const validated = skillSchema.parse(data);
    const [result] = await db.insert(skills).values(validated).returning();
    
    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating skill:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create skill' };
  }
}

export async function updateSkill(id: string, data: Partial<z.infer<typeof skillSchema>>) {
  try {
    const validated = skillSchema.partial().parse(data);
    const [result] = await db
      .update(skills)
      .set({ ...validated, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();
    
    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating skill:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update skill' };
  }
}

export async function deleteSkill(id: string) {
  try {
    await db.delete(skills).where(eq(skills.id, id));
    revalidatePath('/admin/skills');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting skill:', error);
    return { success: false, error: 'Failed to delete skill' };
  }
}

// ============================================
// ACHIEVEMENTS ACTIONS
// ============================================

const achievementSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().max(200).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  credentialId: z.string().max(100).optional(),
  issueDate: z.string().datetime().optional().nullable(),
  expiryDate: z.string().datetime().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export async function getAchievements(includeHidden = false) {
  try {
    const where = includeHidden ? undefined : eq(achievements.isVisible, true);
    const data = await db.query.achievements.findMany({
      where,
      orderBy: [desc(achievements.issueDate), asc(achievements.sortOrder)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, error: 'Failed to fetch achievements' };
  }
}

export async function createAchievement(data: z.infer<typeof achievementSchema>) {
  try {
    const validated = achievementSchema.parse(data);
    const [result] = await db.insert(achievements).values({
      ...validated,
      issueDate: validated.issueDate ? new Date(validated.issueDate) : null,
      expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : null,
    }).returning();
    
    revalidatePath('/admin/achievements');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating achievement:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create achievement' };
  }
}

export async function updateAchievement(id: string, data: Partial<z.infer<typeof achievementSchema>>) {
  try {
    const validated = achievementSchema.partial().parse(data);
    const [result] = await db
      .update(achievements)
      .set({ 
        ...validated, 
        issueDate: validated.issueDate ? new Date(validated.issueDate) : undefined,
        expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : undefined,
        updatedAt: new Date() 
      })
      .where(eq(achievements.id, id))
      .returning();
    
    revalidatePath('/admin/achievements');
    revalidatePath('/');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating achievement:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to update achievement' };
  }
}

export async function deleteAchievement(id: string) {
  try {
    await db.delete(achievements).where(eq(achievements.id, id));
    revalidatePath('/admin/achievements');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return { success: false, error: 'Failed to delete achievement' };
  }
}

// ============================================
// CONTACT MESSAGES ACTIONS
// ============================================

export async function getContactMessages() {
  try {
    const data = await db.query.contactMessages.findMany({
      orderBy: [desc(contactMessages.createdAt)],
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { success: false, error: 'Failed to fetch contact messages' };
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { success: false, error: 'Failed to mark message as read' };
  }
}

export async function deleteMessage(id: string) {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'Failed to delete message' };
  }
}

// ============================================
// USER ACTIONS
// ============================================

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().max(255).optional(),
  password: z.string().min(8).optional(),
  role: z.string().max(50).default('admin'),
});

export async function createAdminUser(data: z.infer<typeof userSchema>) {
  try {
    const validated = userSchema.parse(data);
    
    const existing = await db.query.users.findFirst({
      where: eq(users.email, validated.email.toLowerCase()),
    });
    
    if (existing) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    const passwordHash = validated.password 
      ? await bcrypt.hash(validated.password, 12)
      : null;
    
    const [result] = await db.insert(users).values({
      email: validated.email.toLowerCase(),
      name: validated.name,
      passwordHash,
      role: validated.role,
    }).returning();
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating admin user:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues.map(e => e.message).join(', ') };
    }
    return { success: false, error: 'Failed to create admin user' };
  }
}

export async function initializeDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail) {
      return { success: false, error: 'ADMIN_EMAIL not configured' };
    }
    
    const existing = await db.query.users.findFirst({
      where: eq(users.email, adminEmail),
    });
    
    if (existing) {
      return { success: true, data: existing };
    }
    
    // Create admin user with a default password that must be changed
    const defaultPassword = 'Admin@123!ChangeMe';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    
    const [result] = await db.insert(users).values({
      email: adminEmail,
      name: 'Admin',
      passwordHash,
      role: 'admin',
    }).returning();
    
    return { success: true, data: result, defaultPassword };
  } catch (error) {
    console.error('Error initializing admin:', error);
    return { success: false, error: 'Failed to initialize admin user' };
  }
}