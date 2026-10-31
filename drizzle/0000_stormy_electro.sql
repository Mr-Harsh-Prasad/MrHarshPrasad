CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"issuer" varchar(200),
	"description" text,
	"image_url" varchar(500),
	"credential_url" varchar(500),
	"credential_id" varchar(100),
	"issue_date" timestamp,
	"expiry_date" timestamp,
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(200),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution" varchar(200) NOT NULL,
	"degree" varchar(200) NOT NULL,
	"field_of_study" varchar(200),
	"location" varchar(200),
	"description" text,
	"achievements" jsonb DEFAULT '[]'::jsonb,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_current" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"institution_logo_url" varchar(500),
	"institution_url" varchar(500),
	"grade" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(200) NOT NULL,
	"role" varchar(200) NOT NULL,
	"location" varchar(200),
	"description" text,
	"achievements" jsonb DEFAULT '[]'::jsonb,
	"tech_stack" jsonb DEFAULT '[]'::jsonb,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_current" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"company_logo_url" varchar(500),
	"company_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"short_description" varchar(300),
	"image_url" varchar(500),
	"thumbnail_url" varchar(500),
	"tech_stack" jsonb DEFAULT '[]'::jsonb,
	"live_link" varchar(500),
	"github_link" varchar(500),
	"demo_video_url" varchar(500),
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"theme_primary_color" varchar(7) DEFAULT '#ccff00',
	"theme_secondary_color" varchar(7) DEFAULT '#00ffcc',
	"theme_accent_color" varchar(7) DEFAULT '#88ff00',
	"font_family_base" varchar(100) DEFAULT 'Inter, system-ui, sans-serif',
	"font_family_display" varchar(100) DEFAULT 'Bebas Neue, sans-serif',
	"font_family_mono" varchar(100) DEFAULT 'Space Mono, monospace',
	"font_size_base" varchar(10) DEFAULT '16px',
	"font_size_scale" varchar(20) DEFAULT '1.2',
	"animation_preference" varchar(50) DEFAULT 'fade-up',
	"animation_duration" varchar(20) DEFAULT '0.6s',
	"animation_easing" varchar(50) DEFAULT 'cubic-bezier(0.16, 1, 0.3, 1)',
	"reduced_motion" boolean DEFAULT false,
	"hero_title" varchar(200) DEFAULT 'Harsh Prasad',
	"hero_subtitle" text DEFAULT 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
	"hero_description" text DEFAULT 'Building accessible, performant web experiences with modern technologies.',
	"hero_image_url" varchar(500),
	"hero_cta_text" varchar(50) DEFAULT 'View Work',
	"hero_cta_link" varchar(100) DEFAULT '#projects',
	"hero_secondary_cta_text" varchar(50) DEFAULT 'Contact Me',
	"hero_secondary_cta_link" varchar(100) DEFAULT '#contact',
	"site_title" varchar(100) DEFAULT 'Mr Harsh Prasad | Portfolio',
	"site_description" text DEFAULT 'Personal portfolio of Harsh Prasad - Computer Science student and Frontend Developer',
	"site_url" varchar(200) DEFAULT 'https://mrharshprasad-portfolio.vercel.app',
	"github_url" varchar(200) DEFAULT 'https://github.com/harshprasad',
	"linkedin_url" varchar(200) DEFAULT 'https://linkedin.com/in/harshprasad',
	"twitter_url" varchar(200),
	"email" varchar(100) DEFAULT 'harsh@example.com',
	"footer_text" varchar(200) DEFAULT 'Built with Next.js, React, and Tailwind CSS',
	"footer_show_github" boolean DEFAULT true,
	"footer_show_linkedin" boolean DEFAULT true,
	"is_published" boolean DEFAULT true,
	"maintenance_mode" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"skill_list" jsonb DEFAULT '[]'::jsonb,
	"icon" varchar(100),
	"color" varchar(7),
	"sort_order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"password_hash" varchar(255),
	"image" varchar(500),
	"role" varchar(50) DEFAULT 'admin',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "achievements_visible_idx" ON "achievements" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "achievements_sort_idx" ON "achievements" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "contact_messages_email_idx" ON "contact_messages" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contact_messages_read_idx" ON "contact_messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "educations_visible_idx" ON "educations" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "educations_sort_idx" ON "educations" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "experiences_visible_idx" ON "experiences" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "experiences_sort_idx" ON "experiences" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "projects_visible_idx" ON "projects" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "projects_sort_idx" ON "projects" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "skills_visible_idx" ON "skills" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "skills_sort_idx" ON "skills" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");