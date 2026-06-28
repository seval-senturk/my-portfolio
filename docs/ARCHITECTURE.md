# Architecture Overview

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL |
| ORM | Prisma 6 |
| Auth | Auth.js v5 |
| Media | Cloudinary (production), local fallback (dev) |
| Email | Resend (production), stub (dev) |
| Hosting | Vercel |

## Directory structure

```
src/
├── app/                    # Next.js routes
│   ├── (site)/             # Public website (Header/Footer layout)
│   ├── admin/              # Admin panel
│   └── api/                # API routes
├── components/             # Shared UI components
├── config/                 # Static configuration
├── constants/              # Feature flags, SEO pages, media folders
├── content/                # Content domain registry + repositories
├── features/               # Feature-specific UI (admin views, blog)
├── lib/                    # Utilities (env, platform, media, analytics)
├── repositories/prisma/    # Data access layer
├── services/               # Business logic
│   ├── admin/              # Admin CRUD services
│   ├── content/            # Public content read services
│   ├── media/              # Digital asset management
│   ├── platform/           # Logging, cache, settings, search, health
│   ├── seo/                # SEO resolver, sitemap, structured data
│   └── storage/            # Cloudinary/local storage providers
└── types/                  # Shared TypeScript types
```

## Layering rules

```
UI (React) → Server Actions / API Routes → Services → Repositories → Prisma
```

- UI never calls Prisma directly
- Storage providers are accessed only through `Media Service` or `File Service`
- Email is sent only through `EmailProvider` registry
- Platform concerns (logging, audit, cache) go through `services/platform/`

## Key modules

| Module | Status | Entry point |
|--------|--------|-------------|
| Public Website | ✅ Production | `src/app/(site)/` |
| Admin Panel | ✅ Production | `src/app/admin/` |
| Blog CMS | ✅ Production | TipTap editor + Prisma |
| Media DAM | ✅ Production | `/admin/media` |
| SEO System | ✅ Production | `/admin/seo` |
| Platform Services | ✅ Production | `src/services/platform/` |
| AI Career Platform | ⏳ Architecture only | SEO admin placeholder |

## Authentication

- Auth.js with credentials + optional Google OAuth
- Roles: `ADMIN`, `EDITOR`, `CONTRIBUTOR`, `VIEWER`
- Admin routes protected via `(protected)` layout + `requireAdminUser()`

## Future SaaS readiness

Current architecture supports:

- Multi-user roles (enum exists)
- Feature flags (DB-driven)
- Audit logging
- Tenant isolation: **not yet implemented** — requires `Organization` model + `tenantId` on content tables

Estimated effort for full SaaS: medium refactor (tenant scoping), not a rewrite.

## Observability

- Structured JSON logging in production
- `GET /api/health` for uptime monitoring
- `observabilityHooks` ready for Sentry / OpenTelemetry / Better Stack

## Analytics

- `src/lib/analytics/analytics.ts` — hook-based, disabled by default
- Enable by setting env vars and registering providers (see ENVIRONMENT.md)
