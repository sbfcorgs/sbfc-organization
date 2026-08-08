# SBFC Organization — Deployment Guide (Cloudflare Pages + D1)

This folder is a **self-contained deployable unit**: the static site, the backend
(`index.js`, run as a Pages Function), and the D1 schema. Public pages and the admin
panel both call `/api/*` on the same origin, so once this is deployed there are
**no CORS issues and no separate API URL to configure**.

## 1. Prerequisites

- A Cloudflare account with the site on **Cloudflare Pages** (connected to this
  GitHub repo is easiest — every push auto-deploys)
- Node.js 18+ on your machine (only needed for the D1 setup steps below)

## 2. One-time backend setup (D1 database)

```bash
# from inside this folder
npx wrangler login

# create the D1 database (do this once) and copy the printed database_id
npx wrangler d1 create sbfc

# apply the schema (creates tables + seeds admin/admin123)
npx wrangler d1 execute sbfc --remote --file=./schema.sql
```

Then bind the database to the Pages project (name must be exactly **`DB`** —
that is what `index.js` reads):

> Cloudflare dashboard → **Workers & Pages** → your Pages project →
> **Settings** → **Functions** → **D1 database bindings** → Add binding:
> Variable name: `DB` · D1 database: `sbfc`

## 3. Deploy the site (including the API)

Push this repo to GitHub — Pages rebuilds automatically. The `functions/api/[[path]].js`
file makes the Pages project serve `/api/*` itself (running `index.js`), so **no
separate Worker deployment or route is needed**. The static pages and the API live
on the same `sbfcorgs.com` domain.

Verify after deploy:

- `curl -I https://sbfcorgs.com/api/stats` → `200` (JSON with member/donation counts)
- Open `https://sbfcorgs.com/` → homepage shows live stats
- Log in at `/admin_login.html` with `admin` / `admin123` → dashboard loads

## 4. After first deploy (important)

- **Change the admin password**: the schema seeds `admin` / `admin123`. Update it in
  D1 right away:
  ```bash
  npx wrangler d1 execute sbfc --remote --command \
    "UPDATE admins SET password = 'YOUR_STRONG_PASSWORD' WHERE username = 'admin';"
  ```
  (Note: the Worker stores/compares passwords in plain text — the current backend does
  not hash them. Prefer a long random password.)
- Add your real members:
  `INSERT INTO sbfc_members (member_id, full_name, status) VALUES ('M-001','...','active');`
- Test: log in at `/admin_login.html`, check the dashboard, savings report, balance sheet.

## 5. Alternative: deploy everything as a standalone Worker

If you prefer not to use Pages Functions, `wrangler.toml` is preconfigured to serve the
static assets **and** the API from one Worker (`assets = { directory = ".", run_worker_first = true }`):

```bash
npx wrangler login
npx wrangler d1 create sbfc        # copy database_id into wrangler.toml
npx wrangler d1 execute sbfc --remote --file=./schema.sql
npx wrangler deploy                # then point sbfcorgs.com at this Worker
```

The CORS allow-list (`ALLOWED_ORIGINS` in `index.js`) already includes `sbfcorgs.com`.

## 6. What works

| Area | Endpoint / page | Status |
|---|---|---|
| Public site (all languages) | static pages | works |
| Homepage live stats | `GET /api/stats` | works (same-origin) |
| Contact form | `POST /api/contact` | works |
| Donation confirm | `POST /api/donations` | works (pending → admin approves) |
| Admin login / logout | `POST /api/login`, `/api/logout` | works |
| Dashboard | `GET /api/dashboard` | works |
| Finance (balance sheet / P&L) | `GET /api/dashboard`, `/api/finance` | works |
| Savings CRUD | `/api/savings*` | works |
| Savings report / history | `/api/savings-report`, `/api/savings-history` | works |
| Gallery upload | `/gallery-upload.html` (demo mode) | demo only |

## 7. Local preview

For local development, use `.freebuff/mock_api_server.py` (serves the site + a mock of
the same API with in-memory demo data). See `.freebuff/run.md`. Logins:
`admin` / `admin123` (full), `user` / `user123` (view only).

## 8. Notes

- `_redirects` (no extension) maps legacy `.php` URLs to their `.html` equivalents.
- The archive's original API URL (`sbfc-organization.sbfcorgs.workers.dev`) currently
  returns 404 and is no longer referenced by any page — everything is same-origin now.
- `_headers` contains the security headers for Cloudflare Pages deployments.
