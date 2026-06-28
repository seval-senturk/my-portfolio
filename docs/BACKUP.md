# Backup & Recovery Strategy

## Database (Neon PostgreSQL)

**Primary backup:** Neon built-in point-in-time recovery (PITR).

| Plan | Retention |
|------|-----------|
| Free | 24 hours |
| Paid | Up to 30 days |

### Recovery procedure

1. Neon Console → Project → Branches
2. Create a branch from a point in time, or restore from backup
3. Update `DATABASE_URL` in Vercel if using a restored branch
4. Run `npm run db:migrate:deploy` to ensure schema is current

### Recommended schedule

- Enable Neon automatic backups (default on paid plans)
- Before major releases: create a manual branch snapshot in Neon
- Document migration version in release notes

## Media (Cloudinary)

Cloudinary stores all production media assets.

| Action | Procedure |
|--------|-----------|
| Backup | Cloudinary Admin → enable backup add-on or periodic export via API |
| Recovery | Re-upload from backup; DB `MediaAsset` records reference `storageKey` |
| Delete accident | Use Cloudinary version history if enabled |

Local development uploads (`public/uploads/`) are **not** backed up — use Cloudinary in production.

## Application code

- Source of truth: GitHub repository (`main` branch)
- Vercel retains deployment history for instant rollback

## Recovery priority

1. **Database** — content, settings, SEO, audit logs
2. **Media** — Cloudinary assets
3. **Code** — git + Vercel deployments

## Disaster recovery RTO/RPO (targets)

| Metric | Target |
|--------|--------|
| RPO (data loss) | < 1 hour (Neon PITR) |
| RTO (restore time) | < 30 minutes (Vercel rollback + Neon branch) |

## Pre-release backup checklist

- [ ] Neon project on appropriate plan for retention needs
- [ ] Cloudinary credentials secured in Vercel
- [ ] Latest migration deployed successfully
- [ ] Previous Vercel deployment available for rollback
