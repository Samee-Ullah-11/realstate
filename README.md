# Milestone Realstate — Property website

Bilingual (English/Urdu, full RTL) real estate website for Yaseen Khan, Peshawar.
React + Vite frontend, Express + MongoDB backend, Cloudinary images, Google reviews.
Built portal-ready: see [Growing into a portal](#growing-into-a-portal).

Architecture and data model: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Local setup

Requirements: Node 20+, npm.

```
git clone <repo>
cd realstate
cd client && npm install && cd ..
cd server && npm install && cd ..
```

**Quick start without any accounts** (throwaway in-memory database, auto-seeded):

```
cd server && npm run dev:memory     # API on :5000, admin password printed as dev-admin-123
cd client && npm run dev            # site on :5173 (proxies /api to :5000)
```

**Normal development** (real database):

1. Copy `.env.example` to `server/.env` and fill in at least `MONGODB_URI`, `JWT_SECRET`
   (any long random string), `CLIENT_ORIGIN=http://localhost:5173`.
2. `cd server && npm run seed` — creates the admin user (password printed once),
   the agent from `server/config/site.js`, and 5 clearly-labelled SAMPLE properties.
3. `npm run dev` in `server/`, `npm run dev` in `client/`.

Admin panel: `http://localhost:5173/admin`. Design system: `/style-guide`.

Tests: `npm test` in `server/` (32) and in `client/` (10).

## MongoDB Atlas (free tier is enough to launch)

1. Create an account at mongodb.com/atlas → create a free M0 cluster (region: Mumbai
   or Singapore are closest to Pakistan).
2. Database Access → add a database user with a strong password.
3. Network Access → allow the server's IP (or 0.0.0.0/0 only while developing).
4. Get the connection string (Drivers → Node.js) and put it in `MONGODB_URI`,
   adding a database name, e.g. `...mongodb.net/milestone?retryWrites=true&w=majority`.
5. Run `npm run seed` once against it.

## Cloudinary (photo hosting)

1. Create a free account at cloudinary.com.
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret** into
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
3. That's all — uploads go through the server (`/admin` → property → Photos),
   which limits type (JPEG/PNG/WebP) and size (5 MB). Public pages request
   Cloudinary URLs; add `f_auto,q_auto` transformations when displaying for
   automatic WebP/AVIF.

Photos uploaded in dev with `dev:memory` still land in your real Cloudinary
account; delete the `milestone/properties` folder to clean up.

## Google reviews (Places API New)

A Google Cloud **billing account is required** (the API has a free monthly
allowance, but billing must be attached).

1. console.cloud.google.com → create a project.
2. APIs & Services → Library → enable **Places API (New)** (not the legacy one).
3. Credentials → Create credentials → API key.
4. **Restrict the key** (Credentials → edit key):
   - API restrictions → only "Places API (New)".
   - Application restrictions → IP addresses → your server's public IP.
5. **Cap the cost** so it cannot run away:
   - APIs & Services → Places API (New) → Quotas → set "Requests per day" to a
     small number (e.g. 100; the site needs ~2/day thanks to its 24 h cache).
   - Billing → Budgets & alerts → create a budget (e.g. $5) with email alerts.
6. Find the **Place ID**: search "Place ID Finder" (Google's official tool) or
   Google Business Profile → your business → the ID appears in the Maps URL.
   Requires a Google Business Profile for the agency.
7. Put both in `server/.env` (`GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`), or
   enter the Place ID in Admin → Settings.

Behaviour: reviews are fetched server-side, cached **in memory for 24 h**, never
stored in the database (Google's terms), never filtered or edited, at most 5
(all Google returns). If anything is missing or fails, the section simply does
not render. The API key never reaches the browser.

## Email notification on new inquiries (optional)

Fill the `SMTP_*` variables and `NOTIFY_EMAIL` in `.env`. Any SMTP provider
works (e.g. a Gmail app password, or Brevo's free tier). Leave blank to disable.

## Deployment

The server serves both the API and the built frontend with SEO meta injection,
so you deploy **one Node service**:

```
cd client && npm run build          # outputs client/dist, served by Express
cd server && NODE_ENV=production node index.js
```

1. Host: any Node host (Railway, Render, a small VPS). Set every variable from
   `.env.example`; in production the Cloudinary variables are required and the
   server refuses to start without them.
2. Set `SITE_URL=https://yourdomain.pk` — canonicals, OG tags, and sitemap.xml
   use it. Set `CLIENT_ORIGIN` to the same domain.
3. Point the domain at the host, with HTTPS (hosts do this automatically;
   cookies are `secure` in production).
4. After launch: submit `https://yourdomain.pk/sitemap.xml` in Google Search
   Console.

## Before launch — replacing placeholders

```
cd server && npm run check:placeholders
```

lists every remaining `[FILL IN …]` / `[UR REVIEW …]` marker and **fails until
all are gone**, so nothing half-finished ships. Add it to your deploy step.

Also before launch:

- Replace the hero photo in both config files (`heroPhoto` in
  `server/config/site.js` and `client/src/config/site.js`) with a real listing
  photo (ideally uploaded to Cloudinary).
- Wipe the sample data: `cd server && npm run seed:wipe`, then add real
  listings in the admin panel. Delete the SAMPLE testimonial if one exists.
- Have a native speaker review every string in `client/src/i18n/ur.json` and
  the Urdu office hours in the config.
- Have the privacy policy and terms (drafts, clearly bannered) reviewed.
- Change the admin password (Admin → Password).

## Growing into a portal

The seams are already in place; none of this needs a rewrite:

- **More agents** — `User.role` includes `agent`; properties already reference
  `agentId` and public pages read the agent from the database. Build: agent
  CRUD in admin, an agent picker on the property form, per-agent public pages,
  and flip `features.multiAgent`.
- **User accounts** — auth, cookies, and role middleware are generic. Build:
  registration/login UI, a `user` dashboard, and flip `features.userAccounts`.
- **Favorites / saved searches** — flags exist (`features.favorites`,
  `features.savedSearches`). Favorites: a `Favorite {userId, propertyId}`
  collection + a heart on `PropertyCard`. Saved searches: persist the
  `/properties` query string per user; a cron job can email new matches.
- **Search upgrades** — filters are already URL-driven and validated; adding a
  field means one zod field + one Mongo index + one form control.
- **Scale** — the Google-reviews cache is in-memory; move it to Redis when
  running more than one server instance. API is versioned (`/api/v1`) so a v2
  can coexist.

## Repo map

```
client/   React SPA (public site + /admin)
server/   Express API, serves client/dist in production with meta injection
docs/     architecture and data model
```
