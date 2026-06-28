# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Neon PostgreSQL database (local or cloud)

## First-time setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default admin: `admin@example.com` / `change-me` (change after first login).

## Daily workflow

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Smoke tests | `npm run test:smoke` |
| Full release gate | `npm run release:check` |
| Production build | `npm run build` |
| Local prod server | `npm run start` |

## Project conventions

- **Routes:** `src/app/(site)/` public · `src/app/admin/` admin · `src/app/api/` API
- **Business logic:** `src/services/` — never call Prisma from components
- **Data access:** `src/repositories/prisma/`
- **UI:** `src/features/{domain}/components/`
- **SEO:** `src/services/seo/` + admin SEO panel

## Adding content

Most public content is database-driven and editable in the admin panel. Static fallbacks live in `src/data/` for seeding only.

## Performance profiling (local)

```bash
npm run build
npm run start
# separate terminal
npm run perf
```

Scripts live in `scripts/measure-*.mjs` (Playwright + Lighthouse).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Prisma client out of date | `npx prisma generate` |
| Migration drift | `npm run db:migrate` |
| Auth redirect loop | Check `AUTH_URL` matches `NEXT_PUBLIC_SITE_URL` |
| Build fails on env | Ensure `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` in `.env` |

See [ENVIRONMENT.md](./ENVIRONMENT.md) for all variables.
