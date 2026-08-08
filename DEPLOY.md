# SBFC Organization — Deployment Guide (Cloudflare Workers + D1)

This folder is a **self-contained deployable unit**: the static site, the Cloudflare
Worker backend (`index.js`), and the D1 schema. Public pages and the admin panel both
call `/api/*` on the same origin, so once this is deployed there are **no CORS issues
and no separate API URL to configure**.

## 1. Prerequisites

- A Cloudflare account
- Node.js 18+ (for wrangler)

## 2. Deploy

```bash
# from inside this folder
npx wrangler login

# create the D1 database (do this once)
npx wrangler d1 create sbfc
#   -> copy the printed database_id into wrangler.toml

# apply the schema (creates tables + seeds admin/admin123)
npx wrangler d1 execute sbfc --remote --file=./schema.sql

# deploy the Worker (serves static assets AND the API)
npx wrangler deploy
```

Wrangler prints a `*.workers.dev` URL — open it to see the site.

## 3. Go live on your domain

```bash
npx wrangler deploy --help        # or use the dashboard
# Cloudflare dashboard > Workers & Pages > sbfc-organization > Settings > Domains & Routes
#   add: sbfcorgs.com (and www.sbfcorgs.com)
```

The Worker's CORS allow-list (`ALLOWED_ORIGINS` in `index.js`) already includes
`sbfcorgs.com`, though same-origin requests don't need CORS.

## 4. After first deploy (important)

- **Change the admin password**: the schema seeds `admin` / `admin123`. Update it in
  D1 right away:
  ```bash
  npx wrangler d1 execute sbfc --remote --command \
    "UPDATE admins SET password = 'YOUR_STRONG_PASSWORD' WHERE username = 'admin';"
  ```
  (Note: the Worker stores/compares passwords in plain text — the current backend does
  not hash them. Prefer a long random password.)
- Add your real members: `INSERT INTO sbfc_members (member_id, full_name, status) VALUES ('M-001','...','active');`
- Test: log in at `/admin_login.html` with your admin account, check the dashboard.

## 5. What works

| Area | Endpoint / page | Status |
|---|---|---|
| Public site (all languages) | static pages | works |
| Homepage live stats | `GET /api/dashboard` | works (same-origin) |
| Contact form | `POST /api/contact` | works |
| Donation confirm | `POST /api/donations` | works (pending → admin approves) |
| Admin login / logout | `POST /api/login`, `/api/logout` | works |
| Dashboard | `GET /api/dashboard` | works |
| Finance (balance sheet / P&L) | `GET /api/dashboard`, `/api/finance` | works |
| Savings CRUD | `/api/savings*` | works |
| Savings report / history | `/api/savings-report`, `/api/savings-history` | works |
| Gallery upload | `/gallery-upload.html` (demo mode) | demo only |

## 6. Local preview

For local development, use `.freebuff/mock_api_server.py` (serves the site + a mock of
the same API with in-memory demo data). See `.freebuff/run.md`. Logins:
`admin` / `admin123` (full), `user` / `user123` (view only).

## 7. Notes

- `_redirects` (no extension) maps legacy `.php` URLs to their `.html` equivalents.
  Cloudflare Pages reads it; Workers Static Assets follows it too.
- The archive's original API URL (`sbfc-organization.sbfcorgs.workers.dev`) currently
  returns 404 and is no longer referenced by any page — everything is same-origin now.
- `_headers` contains the security headers for Cloudflare Pages deployments.
