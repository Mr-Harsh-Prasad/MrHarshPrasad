# Mr Harsh Prasad — Dynamic CMS-Driven Portfolio

A fully dynamic, CMS-driven portfolio built with **Next.js 15 (App Router)**, **PostgreSQL (NeonDB)**, **Drizzle ORM**, **Tailwind CSS**, **Framer Motion**, and **NextAuth.js**.

## ✨ Features

### 🎨 Dynamic Theming System
- All colors, fonts, and animations controlled via database
- CSS custom properties updated in real-time from admin dashboard
- Live preview in admin panel

### 🔐 Secure Admin Dashboard (`/admin`)
- NextAuth.js credentials-based authentication
- Single admin email restriction (via `ADMIN_EMAIL` env var)
- Role-based access (admin only)
- Protected routes with middleware

### 📝 Full CRUD Management
| Section | Description |
|---------|-------------|
| **Projects** | Portfolio projects with images, tech stack, links |
| **Experience** | Work history with achievements & tech stack |
| **Education** | Academic background with grades & honors |
| **Skills** | Categorized skills with icons & colors |
| **Achievements** | Certifications & awards with verification |
| **Messages** | Contact form submissions |
| **Appearance** | Global theme, typography, animations, SEO |

### 🎬 Public Portfolio
- Server-side rendered for SEO
- Framer Motion animations (staggered, scroll-triggered)
- Dynamic CSS variables from database
- Responsive design with mobile-first approach
- 3D background effects (Three.js / React Three Fiber)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (NeonDB recommended)
- npm / pnpm / yarn

### 1. Clone & Install
```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# Database (NeonDB connection string)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Admin email (ONLY this email can login)
ADMIN_EMAIL="your-email@example.com"

# Public site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit:
- **Portfolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

### 5. First Login
- Email: your `ADMIN_EMAIL`
- Password: `Admin@123!ChangeMe` (from seed)
- **⚠️ Immediately change password in Settings!**

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/           # Admin API routes (protected)
│   │   │   ├── projects/
│   │   │   ├── experiences/
│   │   │   ├── educations/
│   │   │   ├── skills/
│   │   │   ├── achievements/
│   │   │   ├── messages/
│   │   │   └── settings/
│   │   ├── auth/            # NextAuth configuration
│   │   ├── public/          # Public API routes
│   │   └── settings/        # Public settings endpoint
│   ├── admin/               # Admin dashboard pages
│   │   ├── appearance/      # Theme customization
│   │   ├── projects/        # Project management
│   │   ├── experience/      # Experience management
│   │   ├── education/       # Education management
│   │   ├── skills/          # Skills management
│   │   ├── achievements/    # Achievements management
│   │   ├── messages/        # Contact messages
│   │   ├── settings/        # Admin account settings
│   │   └── login/           # Login page
│   ├── page.tsx             # Public portfolio homepage
│   ├── layout.tsx           # Root layout with theme provider
│   └── globals.css          # Global styles & CSS variables
├── components/
│   ├── dynamic/             # Dynamic portfolio sections
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Education.tsx
│   │   ├── Skills.tsx
│   │   ├── Achievements.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── ui/                  # Shadcn/UI components
│   ├── 3d/                  # Three.js components
│   └── ThemeProvider.tsx    # Client-side theme sync
├── db/
│   ├── index.ts             # Drizzle client
│   └── schema.ts            # Database schema
├── actions/
│   └── index.ts             # Server actions (CRUD)
├── lib/
│   └── utils.ts             # Utility functions
└── middleware.ts            # Auth protection middleware
```

---

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with sample data |

---

## 🎨 Customization

### Theme Colors
Edit in Admin → Appearance → Colors:
- **Primary**: Main accent (buttons, links)
- **Secondary**: Gradients, hover states
- **Tertiary**: Additional accent

### Typography
Admin → Appearance → Typography:
- Body font, Display font, Mono font
- Base font size & scale ratio

### Animations
Admin → Appearance → Animations:
- Default animation type
- Duration & easing function
- Reduced motion support

---

## 🗄 Database Schema

Key tables:
- `users` — Admin accounts
- `site_settings` — Global configuration (single row)
- `projects` — Portfolio projects
- `experiences` — Work experience
- `educations` — Education records
- `skills` — Skill categories
- `achievements` — Certifications/awards
- `contact_messages` — Form submissions

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Database
Use **NeonDB** (serverless Postgres) for zero-config scaling.

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=production-secret
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 🔒 Security Notes

- Only `ADMIN_EMAIL` can authenticate
- Passwords hashed with bcrypt (cost 12)
- JWT sessions (7-day expiry)
- Middleware protects all `/admin/*` routes
- CSRF protection via NextAuth

---

## 📄 License

MIT License — feel free to use for your own portfolio!

---

## 🙏 Credits

- **Next.js** — React framework
- **Drizzle ORM** — Type-safe database
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **NextAuth.js** — Authentication
- **Shadcn/UI** — Component library
- **Lucide React** — Icons
- **Three.js / React Three Fiber** — 3D graphics