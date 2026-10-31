import { pgTable, uuid, text, varchar, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Users table for admin authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  image: varchar('image', { length: 500 }),
  role: varchar('role', { length: 50 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
}));

// Site settings table (single row for global settings)
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Theme colors
  themePrimaryColor: varchar('theme_primary_color', { length: 7 }).default('#ccff00'),
  themeSecondaryColor: varchar('theme_secondary_color', { length: 7 }).default('#00ffcc'),
  themeAccentColor: varchar('theme_accent_color', { length: 7 }).default('#88ff00'),
  
  // Font settings
  fontFamilyBase: varchar('font_family_base', { length: 100 }).default('Inter, system-ui, sans-serif'),
  fontFamilyDisplay: varchar('font_family_display', { length: 100 }).default('Bebas Neue, sans-serif'),
  fontFamilyMono: varchar('font_family_mono', { length: 100 }).default('Space Mono, monospace'),
  fontSizeBase: varchar('font_size_base', { length: 10 }).default('16px'),
  fontSizeScale: varchar('font_size_scale', { length: 20 }).default('1.2'),
  
  // Animation settings
  animationPreference: varchar('animation_preference', { length: 50 }).default('fade-up'),
  animationDuration: varchar('animation_duration', { length: 20 }).default('0.6s'),
  animationEasing: varchar('animation_easing', { length: 50 }).default('cubic-bezier(0.16, 1, 0.3, 1)'),
  reducedMotion: boolean('reduced_motion').default(false),
  
  // Hero section
  heroTitle: varchar('hero_title', { length: 200 }).default('Harsh Prasad'),
  heroSubtitle: text('hero_subtitle').default('Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast'),
  heroDescription: text('hero_description').default('Building accessible, performant web experiences with modern technologies.'),
  heroImageUrl: varchar('hero_image_url', { length: 500 }),
  heroCtaText: varchar('hero_cta_text', { length: 50 }).default('View Work'),
  heroCtaLink: varchar('hero_cta_link', { length: 100 }).default('#projects'),
  heroSecondaryCtaText: varchar('hero_secondary_cta_text', { length: 50 }).default('Contact Me'),
  heroSecondaryCtaLink: varchar('hero_secondary_cta_link', { length: 100 }).default('#contact'),
  
  // SEO
  siteTitle: varchar('site_title', { length: 100 }).default('Mr Harsh Prasad | Portfolio'),
  siteDescription: text('site_description').default('Personal portfolio of Harsh Prasad - Computer Science student and Frontend Developer'),
  siteUrl: varchar('site_url', { length: 200 }).default('https://mrharshprasad-portfolio.vercel.app'),
  
  // Social links
  githubUrl: varchar('github_url', { length: 200 }).default('https://github.com/harshprasad'),
  linkedinUrl: varchar('linkedin_url', { length: 200 }).default('https://linkedin.com/in/harshprasad'),
  twitterUrl: varchar('twitter_url', { length: 200 }),
  email: varchar('email', { length: 100 }).default('harsh@example.com'),
  
  // Footer
  footerText: varchar('footer_text', { length: 200 }).default('Built with Next.js, React, and Tailwind CSS'),
  footerShowGithub: boolean('footer_show_github').default(true),
  footerShowLinkedin: boolean('footer_show_linkedin').default(true),
  
  // Global settings
  isPublished: boolean('is_published').default(true),
  maintenanceMode: boolean('maintenance_mode').default(false),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description').notNull(),
  shortDescription: varchar('short_description', { length: 300 }),
  imageUrl: varchar('image_url', { length: 500 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  techStack: jsonb('tech_stack').$type<string[]>().default([]),
  liveLink: varchar('live_link', { length: 500 }),
  githubLink: varchar('github_link', { length: 500 }),
  demoVideoUrl: varchar('demo_video_url', { length: 500 }),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  isFeatured: boolean('is_featured').default(false),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index('projects_visible_idx').on(table.isVisible),
  sortIdx: index('projects_sort_idx').on(table.sortOrder),
  slugIdx: index('projects_slug_idx').on(table.slug),
}));

// Experience table (work experience)
export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  company: varchar('company', { length: 200 }).notNull(),
  role: varchar('role', { length: 200 }).notNull(),
  location: varchar('location', { length: 200 }),
  description: text('description'),
  achievements: jsonb('achievements').$type<string[]>().default([]),
  techStack: jsonb('tech_stack').$type<string[]>().default([]),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCurrent: boolean('is_current').default(false),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  companyLogoUrl: varchar('company_logo_url', { length: 500 }),
  companyUrl: varchar('company_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index('experiences_visible_idx').on(table.isVisible),
  sortIdx: index('experiences_sort_idx').on(table.sortOrder),
}));

// Education table
export const educations = pgTable('educations', {
  id: uuid('id').primaryKey().defaultRandom(),
  institution: varchar('institution', { length: 200 }).notNull(),
  degree: varchar('degree', { length: 200 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 200 }),
  location: varchar('location', { length: 200 }),
  description: text('description'),
  achievements: jsonb('achievements').$type<string[]>().default([]),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCurrent: boolean('is_current').default(false),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  institutionLogoUrl: varchar('institution_logo_url', { length: 500 }),
  institutionUrl: varchar('institution_url', { length: 500 }),
  grade: varchar('grade', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index('educations_visible_idx').on(table.isVisible),
  sortIdx: index('educations_sort_idx').on(table.sortOrder),
}));

// Skills table
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 100 }).notNull(),
  skillList: jsonb('skill_list').$type<string[]>().default([]),
  icon: varchar('icon', { length: 100 }),
  color: varchar('color', { length: 7 }),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index('skills_visible_idx').on(table.isVisible),
  sortIdx: index('skills_sort_idx').on(table.sortOrder),
}));

// Achievements/Certifications table
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  issuer: varchar('issuer', { length: 200 }),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  credentialUrl: varchar('credential_url', { length: 500 }),
  credentialId: varchar('credential_id', { length: 100 }),
  issueDate: timestamp('issue_date'),
  expiryDate: timestamp('expiry_date'),
  sortOrder: integer('sort_order').default(0),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  visibleIdx: index('achievements_visible_idx').on(table.isVisible),
  sortIdx: index('achievements_sort_idx').on(table.sortOrder),
}));

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 200 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('contact_messages_email_idx').on(table.email),
  readIdx: index('contact_messages_read_idx').on(table.isRead),
}));

// Type exports for use in components
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Education = typeof educations.$inferSelect;
export type NewEducation = typeof educations.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;