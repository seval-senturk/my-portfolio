# Deployment Guide

Production stack: **Next.js on Vercel**, **Neon PostgreSQL**, **Cloudinary**, **Resend**, **Auth.js**.

## Pre-deploy checklist

Run locally before deploying:

```bash
npm run release:check
```

This runs TypeScript, ESLint, and production build.

## 1. Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string → `DATABASE_URL`
3. Copy the **direct** connection string → `DIRECT_URL` (migrations)

## 2. Vercel project

1. Import the GitHub repository
2. Framework preset: **Next.js**
3. Build command (recommended):

```bash
npx prisma migrate deploy && npm run build
```

4. Install command: `npm install` (runs `prisma generate` via postinstall)

## 3. Environment variables

Set all variables from [ENVIRONMENT.md](./ENVIRONMENT.md) in Vercel → Production.

Minimum production set:

```
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=https://your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_PROVIDER=resend
RESEND_API_KEY=
EMAIL_FROM=Portfolio <hello@yourdomain.com>
```

## 4. Database migration

After first deploy or schema changes:

```bash
npm run db:migrate:deploy
```

Optional seed (development/staging only):

```bash
npm run db:seed
```

**Do not run seed in production** unless intentional.

## 5. Cloudinary

1. Create a Cloudinary account
2. Add credentials to Vercel env
3. Verify upload via Admin → Media Library

## 6. Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Set `EMAIL_FROM` to a verified address
4. Set `EMAIL_PROVIDER=resend` and `RESEND_API_KEY`

## 7. Google OAuth (optional)

Add authorized origins and redirect URIs for production URL in Google Cloud Console.

## 8. Post-deploy verification

| Check | URL / Action |
|-------|----------------|
| Health | `GET /api/health` → status `healthy` or `degraded` |
| Homepage | Public site loads |
| Admin login | `/admin/login` |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| SEO metadata | View page source, check `<title>` and OG tags |
| Contact form | Submit test message |
| Media upload | Admin → Media Library |

## 9. Maintenance mode

Enable via Admin → Settings, or set `MAINTENANCE_MODE=true` in Vercel for emergency maintenance.

Admin panel remains accessible during maintenance.

## Rollback

1. Vercel → Deployments → Promote previous deployment
2. If schema changed, restore database from Neon backup before rollback

See [BACKUP.md](./BACKUP.md) for backup strategy.
