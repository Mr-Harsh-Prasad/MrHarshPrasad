import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/db';
import { siteSettings, projects, experiences, educations, skills, achievements, users } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Create default site settings
    console.log('Creating site settings...');
    const existingSettings = await db.query.siteSettings.findFirst();
    if (!existingSettings) {
      await db.insert(siteSettings).values({
        themePrimaryColor: '#ccff00',
        themeSecondaryColor: '#00ffcc',
        themeAccentColor: '#88ff00',
        fontFamilyBase: 'Inter, system-ui, sans-serif',
        fontFamilyDisplay: 'Bebas Neue, sans-serif',
        fontFamilyMono: 'Space Mono, monospace',
        fontSizeBase: '16px',
        fontSizeScale: '1.2',
        animationPreference: 'fade-up',
        animationDuration: '0.6s',
        animationEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        reducedMotion: false,
        heroTitle: 'Harsh Prasad',
        heroSubtitle: 'Computer Science Engineering Student | Frontend Developer | Cybersecurity Enthusiast',
        heroDescription: 'Building accessible, performant web experiences with modern technologies.',
        heroImageUrl: '',
        heroCtaText: 'View Work',
        heroCtaLink: '#projects',
        heroSecondaryCtaText: 'Contact Me',
        heroSecondaryCtaLink: '#contact',
        siteTitle: 'Mr Harsh Prasad | Portfolio',
        siteDescription: 'Personal portfolio of Harsh Prasad - Computer Science student and Frontend Developer',
        siteUrl: 'https://mrharshprasad-portfolio.vercel.app',
        githubUrl: 'https://github.com/harshprasad',
        linkedinUrl: 'https://linkedin.com/in/harshprasad',
        twitterUrl: '',
        email: 'harsh@example.com',
        footerText: 'Built with Next.js, React, and Tailwind CSS',
        footerShowGithub: true,
        footerShowLinkedin: true,
        isPublished: true,
        maintenanceMode: false,
      });
      console.log('✅ Site settings created');
    } else {
      console.log('✅ Site settings already exist');
    }

    // 2. Create admin user
    console.log('Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123!ChangeMe';
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, adminEmail),
    });

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    if (!existingUser) {
      await db.insert(users).values({
        email: adminEmail,
        name: 'Admin',
        passwordHash,
        role: 'admin',
      });
      console.log('✅ Admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      // Update password in case it changed
      await db.update(users).set({ passwordHash }).where(eq(users.email, adminEmail));
      console.log('✅ Admin user updated with new password');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }

    // 3. Create sample projects
    console.log('Creating sample projects...');
    const projectCount = await db.select().from(projects).then(r => r.length);
    if (projectCount === 0) {
      await db.insert(projects).values([
        {
          title: 'E-Commerce Platform',
          slug: 'ecommerce-platform',
          description: 'A full-stack e-commerce platform built with Next.js 14, featuring user authentication, product management, shopping cart, payment integration with Stripe, and admin dashboard.',
          shortDescription: 'Full-stack e-commerce with Next.js, Stripe, and PostgreSQL',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe', 'Tailwind CSS', 'NextAuth.js'],
          liveLink: 'https://demo-ecommerce.example.com',
          githubLink: 'https://github.com/harshprasad/ecommerce-platform',
          demoVideoUrl: '',
          sortOrder: 0,
          isVisible: true,
          isFeatured: true,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-20'),
        },
        {
          title: 'Task Management App',
          slug: 'task-management-app',
          description: 'A collaborative task management application with real-time updates, team workspaces, drag-and-drop boards, due dates, and notifications. Built with React, Node.js, and Socket.io.',
          shortDescription: 'Real-time collaborative task manager with drag-and-drop',
          imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
          techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Redux', 'Material UI'],
          liveLink: 'https://demo-tasks.example.com',
          githubLink: 'https://github.com/harshprasad/task-manager',
          demoVideoUrl: '',
          sortOrder: 1,
          isVisible: true,
          isFeatured: true,
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-15'),
        },
        {
          title: 'Weather Dashboard',
          slug: 'weather-dashboard',
          description: 'A beautiful weather dashboard with location-based forecasts, interactive maps, historical data visualization, and severe weather alerts. Uses OpenWeatherMap API and Chart.js.',
          shortDescription: 'Interactive weather dashboard with maps and charts',
          imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400',
          techStack: ['Vue.js', 'Chart.js', 'OpenWeatherMap API', 'Mapbox GL', 'Vuetify'],
          liveLink: 'https://demo-weather.example.com',
          githubLink: 'https://github.com/harshprasad/weather-dashboard',
          demoVideoUrl: '',
          sortOrder: 2,
          isVisible: true,
          isFeatured: false,
          startDate: new Date('2023-06-01'),
          endDate: new Date('2023-08-20'),
        },
        {
          title: 'Portfolio Website',
          slug: 'portfolio-website',
          description: 'A modern, responsive portfolio website with 3D animations, dynamic theming, CMS-driven content, and smooth scrolling. Built with Next.js 14, Three.js, Framer Motion, and Tailwind CSS.',
          shortDescription: '3D portfolio with dynamic theming and CMS',
          imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
          techStack: ['Next.js', 'React Three Fiber', 'Framer Motion', 'Tailwind CSS', 'Drizzle ORM', 'PostgreSQL'],
          liveLink: 'https://mrharshprasad-portfolio.vercel.app',
          githubLink: 'https://github.com/harshprasad/portfolio',
          demoVideoUrl: '',
          sortOrder: 3,
          isVisible: true,
          isFeatured: true,
          startDate: new Date('2024-05-01'),
          endDate: null,
        },
      ]);
      console.log('✅ Sample projects created');
    } else {
      console.log('✅ Projects already exist');
    }

    // 4. Create sample experiences
    console.log('Creating sample experiences...');
    const expCount = await db.select().from(experiences).then(r => r.length);
    if (expCount === 0) {
      await db.insert(experiences).values([
        {
          company: 'TechCorp Solutions',
          role: 'Frontend Developer',
          location: 'San Francisco, CA (Remote)',
          description: 'Developing and maintaining customer-facing web applications using React, Next.js, and TypeScript. Collaborating with design and backend teams to deliver high-quality user experiences.',
          achievements: [
            'Improved page load performance by 40% through code splitting and optimization',
            'Led migration from Create React App to Next.js 14 App Router',
            'Implemented design system used across 5+ products',
            'Mentored 3 junior developers on React best practices',
          ],
          techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Jest', 'Cypress', 'GraphQL'],
          startDate: new Date('2023-01-15'),
          endDate: null,
          isCurrent: true,
          sortOrder: 0,
          isVisible: true,
          companyLogoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',
          companyUrl: 'https://techcorp.example.com',
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer Intern',
          location: 'New York, NY',
          description: 'Built full-stack features for a SaaS platform serving small businesses. Worked on both frontend (React) and backend (Node.js/Express) with PostgreSQL database.',
          achievements: [
            'Developed RESTful API endpoints for user management and billing',
            'Created responsive dashboard with real-time analytics using Chart.js',
            'Implemented automated testing pipeline with GitHub Actions',
            'Reduced API response times by 30% through query optimization',
          ],
          techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
          startDate: new Date('2022-06-01'),
          endDate: new Date('2022-12-31'),
          isCurrent: false,
          sortOrder: 1,
          isVisible: true,
          companyLogoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100',
          companyUrl: 'https://startupxyz.example.com',
        },
      ]);
      console.log('✅ Sample experiences created');
    } else {
      console.log('✅ Experiences already exist');
    }

    // 5. Create sample educations
    console.log('Creating sample educations...');
    const eduCount = await db.select().from(educations).then(r => r.length);
    if (eduCount === 0) {
      await db.insert(educations).values([
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science Engineering',
          location: 'City, State',
          description: 'Focused on software engineering, algorithms, data structures, and web technologies. Completed capstone project on distributed systems.',
          achievements: [
            'Dean\'s List: Fall 2021, Spring 2022, Fall 2022',
            'First Prize: University Hackathon 2022',
            'Published paper on "Optimizing Web Performance" in Student Journal',
            'Teaching Assistant for Data Structures course (Spring 2023)',
          ],
          startDate: new Date('2020-08-01'),
          endDate: new Date('2024-05-15'),
          isCurrent: false,
          sortOrder: 0,
          isVisible: true,
          institutionLogoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100',
          institutionUrl: 'https://university.example.com',
          grade: '3.85/4.0',
        },
      ]);
      console.log('✅ Sample educations created');
    } else {
      console.log('✅ Educations already exist');
    }

    // 6. Create sample skills
    console.log('Creating sample skills...');
    const skillCount = await db.select().from(skills).then(r => r.length);
    if (skillCount === 0) {
      await db.insert(skills).values([
        {
          category: 'Frontend Development',
          skillList: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Framer Motion', 'React Three Fiber'],
          icon: 'Code2',
          color: '#ccff00',
          sortOrder: 0,
          isVisible: true,
        },
        {
          category: 'Backend Development',
          skillList: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'Docker'],
          icon: 'Terminal',
          color: '#00ffcc',
          sortOrder: 1,
          isVisible: true,
        },
        {
          category: 'Databases & ORMs',
          skillList: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'Drizzle ORM', 'Redis', 'Supabase'],
          icon: 'Database',
          color: '#88ff00',
          sortOrder: 2,
          isVisible: true,
        },
        {
          category: 'Cloud & DevOps',
          skillList: ['AWS', 'Vercel', 'Docker', 'GitHub Actions', 'CI/CD', 'Linux', 'Nginx'],
          icon: 'Cloud',
          color: '#00ccff',
          sortOrder: 3,
          isVisible: true,
        },
        {
          category: 'Tools & Others',
          skillList: ['Git', 'VS Code', 'Figma', 'Postman', 'Jest', 'Cypress', 'Storybook', 'ESLint', 'Prettier'],
          icon: 'Wrench',
          color: '#ffcc00',
          sortOrder: 4,
          isVisible: true,
        },
      ]);
      console.log('✅ Sample skills created');
    } else {
      console.log('✅ Skills already exist');
    }

    // 7. Create sample achievements
    console.log('Creating sample achievements...');
    const achCount = await db.select().from(achievements).then(r => r.length);
    if (achCount === 0) {
      await db.insert(achievements).values([
        {
          title: 'AWS Certified Solutions Architect - Associate',
          issuer: 'Amazon Web Services',
          description: 'Validated expertise in designing distributed systems on AWS, including compute, storage, database, and networking services.',
          imageUrl: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400',
          credentialUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
          credentialId: 'AWS-SAA-2024-001',
          issueDate: new Date('2024-03-15'),
          expiryDate: new Date('2027-03-15'),
          sortOrder: 0,
          isVisible: true,
        },
        {
          title: 'Google Cloud Professional Cloud Developer',
          issuer: 'Google Cloud',
          description: 'Demonstrated ability to design, build, and deploy cloud-native applications using Google Cloud technologies.',
          imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400',
          credentialUrl: 'https://cloud.google.com/certification/cloud-developer',
          credentialId: 'GCP-PCD-2023-045',
          issueDate: new Date('2023-11-20'),
          expiryDate: new Date('2025-11-20'),
          sortOrder: 1,
          isVisible: true,
        },
        {
          title: 'Meta Frontend Developer Professional Certificate',
          issuer: 'Meta (via Coursera)',
          description: 'Comprehensive 9-course program covering React, JavaScript, HTML/CSS, version control, and UI/UX principles.',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
          credentialUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
          credentialId: 'META-FE-2023-789',
          issueDate: new Date('2023-08-10'),
          expiryDate: null,
          sortOrder: 2,
          isVisible: true,
        },
        {
          title: 'University Hackathon 2022 - First Place',
          issuer: 'University of Technology',
          description: 'Won first place among 50+ teams for building an AI-powered accessibility tool for visually impaired users.',
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',
          credentialUrl: '',
          credentialId: 'HACK-2022-001',
          issueDate: new Date('2022-10-15'),
          expiryDate: null,
          sortOrder: 3,
          isVisible: true,
        },
      ]);
      console.log('✅ Sample achievements created');
    } else {
      console.log('✅ Achievements already exist');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit http://localhost:3000/admin/login');
    console.log(`3. Login with: ${adminEmail} / Admin@123!ChangeMe`);
    console.log('4. IMMEDIATELY change the default password in Settings!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();