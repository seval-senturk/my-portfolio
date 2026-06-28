# Environment Variables

Copy `.env.example` to `.env` for local development. **Never commit `.env` files.**

## Environments

| Environment | Where | Notes |
|-------------|-------|-------|
| Development | Local `.env` | Stub email, local media fallback |
| Preview | Vercel Preview env | Same as production; use preview URLs in OAuth |
| Production | Vercel Production env | All required secrets must be set |

## Required (all environments)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooled PostgreSQL connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Public site origin (no trailing slash) |
| `AUTH_URL` | Same as site URL for Auth.js |

## Required (production)

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_PROVIDER` | Set to `resend` |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Verified sender, e.g. `Portfolio <hello@yourdomain.com>` |

## Optional

| Variable | Description |
|----------|-------------|
| `DIRECT_URL` | Neon direct connection for migrations |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth admin login |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed credentials (development only) |
| `MAINTENANCE_MODE` | `true` to force maintenance page |
| `EMAIL_PROVIDER=stub` | Development email (logs only) |

## Analytics (future)

| Variable | Service |
|----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible Analytics |

## Search Console & Webmaster

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML meta tag content |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster `msvalidate.01` content |

These emit `<meta name="google-site-verification">` and Bing verification tags via root layout metadata.

After deploy:

1. Set verification env vars in Vercel (if using meta tag method)
2. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console
3. Repeat for Bing Webmaster Tools

Domain/DNS verification in GSC does not require env vars.

## Production validation

On server boot (`src/instrumentation.ts`), these are required when `NODE_ENV=production`:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Missing values fail fast at startup instead of at runtime.

## Vercel setup

1. Project → Settings → Environment Variables
2. Add all production variables for **Production** and **Preview**
3. Ensure `NEXT_PUBLIC_SITE_URL` matches each deployment URL for previews
4. Run `npm run db:migrate:deploy` after first deploy (or add to build command)

## Security checklist

- [ ] No secrets in git
- [ ] `AUTH_SECRET` is unique per environment
- [ ] Production uses `EMAIL_PROVIDER=resend`, not stub
- [ ] Admin seed password changed after first login
- [ ] Cloudinary upload restricted to authenticated admin routes
