# Release Checklist

Complete all items before production deployment.

## Build & code quality

- [ ] `npm run release:check` passes (typecheck + lint + smoke + build)
- [ ] No TypeScript errors
- [ ] No ESLint errors (warnings documented if accepted)
- [ ] No secrets in repository
- [ ] Production env validation passes (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`)

## Environment

- [ ] `DATABASE_URL` set in Vercel Production
- [ ] `AUTH_SECRET` set (unique, 32+ chars)
- [ ] `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] `AUTH_URL` matches production domain
- [ ] `CLOUDINARY_*` configured
- [ ] `EMAIL_PROVIDER=resend` and `RESEND_API_KEY` set
- [ ] `EMAIL_FROM` uses verified Resend domain

## Database

- [ ] `npm run db:migrate:deploy` executed on production DB
- [ ] Seed **not** run on production (unless intentional)
- [ ] Admin password changed from default

## Functional smoke tests

- [ ] Homepage loads
- [ ] About, Experience, Projects, Skills, Resume pages load
- [ ] Blog list and post detail work
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Hero / content save works
- [ ] Blog CRUD works
- [ ] Media upload works (Cloudinary)
- [ ] SEO settings save
- [ ] Feature flags accessible in Settings

## SEO

- [ ] `/sitemap.xml` returns valid XML
- [ ] `/robots.txt` correct (includes `Disallow: /admin` in production)
- [ ] Page titles and descriptions present
- [ ] Open Graph tags on key pages
- [ ] JSON-LD on homepage, blog posts, resume, projects
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set (if using meta tag method)
- [ ] Sitemap submitted to Google Search Console and Bing Webmaster

## Security

- [ ] Admin routes require authentication
- [ ] Contact API rate limiting active
- [ ] File upload restricted to admin
- [ ] No `.env` files committed

## Performance

- [ ] Images served via Cloudinary CDN in production
- [ ] No critical Lighthouse regressions (manual check)

## Monitoring

- [ ] `GET /api/health` returns `healthy` or acceptable `degraded`
- [ ] Error logging visible in Vercel logs

## Post-deploy

- [ ] Submit sitemap to Google Search Console
- [ ] Verify domain in Search Console
- [ ] Test password reset email (if enabled)
- [ ] Document deployment date and migration version

## Known exclusions (not blocking portfolio launch)

- [ ] AI Career Platform — not implemented (architecture only)
- [ ] Sentry / OpenTelemetry — hooks wired, external DSN not connected
- [ ] Analytics — hooks ready, not connected
- [ ] Contact inbox admin UI — placeholder
- [ ] User management admin UI — placeholder
- [ ] Per-project detail pages — listing page only
