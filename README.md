# Seval Şentürk — Portfolio

Production-ready personal portfolio built with Next.js, featuring a full admin CMS, blog, SEO management, digital asset management, and platform services.

**Live stack:** Vercel · Neon PostgreSQL · Cloudinary · Resend · Auth.js

## Features

- **Public website** — Portfolio, resume, projects, experience, skills, contact, blog
- **Admin panel** — Content management for all site sections
- **Blog CMS** — TipTap rich-text editor with categories and tags
- **Media library** — Central DAM with Cloudinary integration
- **SEO system** — Metadata, sitemap, robots, redirects, structured data, health checks
- **Platform services** — Logging, audit trail, feature flags, maintenance mode, search

## Quick start

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- (Optional) Cloudinary, Resend accounts for full production parity

### Installation

```bash
git clone https://github.com/seval-senturk/my-portfolio.git
cd my-portfolio
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default admin credentials (after seed): `admin@example.com` / `change-me`

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run release:check` | Full pre-deploy validation |
| `npm run perf` | Local performance measurement (requires running server) |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:migrate:deploy` | Run migrations (production) |
| `npm run db:seed` | Seed database |

## Documentation

| Guide | Description |
|-------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | System design and module overview |
| [Development](./docs/DEVELOPMENT.md) | Local setup and daily workflow |
| [Environment](./docs/ENVIRONMENT.md) | Environment variables reference |
| [Deployment](./docs/DEPLOYMENT.md) | Vercel production deployment |
| [Observability](./docs/OBSERVABILITY.md) | Logging, health checks, Sentry hooks |
| [Backup](./docs/BACKUP.md) | Database and media backup strategy |
| [Release Checklist](./docs/RELEASE-CHECKLIST.md) | Pre-launch quality gate |

## Project structure

```
src/
├── app/(site)/       Public routes
├── app/admin/        Admin panel
├── app/api/          API routes (contact, health, media, search, seo)
├── services/         Business logic layer
├── repositories/     Prisma data access
└── features/         Feature-specific UI components
```

## Production deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full guide.

Minimum steps:

1. Configure Vercel environment variables
2. Deploy to Vercel
3. Run `npm run db:migrate:deploy`
4. Verify `/api/health`

## Health check

```
GET /api/health
```

Returns database, auth, Cloudinary, and email provider status.

## License

Private project — all rights reserved.
