# Milestone Realstate — Architecture (Phase 1)

One repo, two apps. React SPA in `/client`, Express API in `/server`. MongoDB via Mongoose.
Built portal-ready: roles, agent collection, versioned API, service layer — even though today there is one admin and one agent.

## Folder structure

```
realstate/
├── client/
│   ├── public/
│   │   └── fonts/                  # self-hosted if needed; Google Fonts by default
│   ├── src/
│   │   ├── config/
│   │   │   └── site.js             # mirror of server/config/site.js (public fields only)
│   │   ├── i18n/
│   │   │   ├── index.js            # i18next setup, language persistence, RTL switching
│   │   │   ├── en.json
│   │   │   └── ur.json             # marked for native-speaker review
│   │   ├── styles/
│   │   │   └── index.css           # Tailwind + design tokens (CSS variables)
│   │   ├── lib/
│   │   │   ├── api.js              # fetch wrapper for /api/v1
│   │   │   ├── format.js           # PKR lakh/crore formatter, area conversion (tested)
│   │   │   └── whatsapp.js         # wa.me link builder with prefilled message
│   │   ├── hooks/                  # useProperties, useQueryFilters, etc.
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Input, Select, Badge, Card primitives
│   │   │   ├── layout/             # Header, Footer, PublicLayout, AdminLayout
│   │   │   └── property/           # PropertyCard, Gallery, Filters, StatusTag
│   │   ├── pages/
│   │   │   ├── public/             # Home, Properties, PropertyDetail, About, Contact,
│   │   │   │                       # Privacy, Terms, NotFound
│   │   │   ├── admin/              # (Phase 6) Login, Dashboard, PropertyForm, Inquiries,
│   │   │   │                       # Testimonials, Settings
│   │   │   └── StyleGuide.jsx      # /style-guide — Phase 1 deliverable, dev-only route
│   │   ├── App.jsx                 # routes: public layout, admin layout, style guide
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config / vite.config.js
│   └── package.json
├── server/
│   ├── config/
│   │   ├── site.js                 # THE single source of client business facts
│   │   ├── env.js                  # loads .env, fails fast on missing required vars
│   │   └── features.js             # feature flags: userAccounts, savedSearches,
│   │                               # multiAgent, favorites — all false
│   ├── models/                     # User, Agent, Property, Inquiry, Testimonial, Settings
│   ├── services/                   # business logic: property.service, auth.service,
│   │                               # inquiry.service, reviews.service (Google), upload.service
│   ├── controllers/                # thin: validate (zod) → call service → respond
│   ├── routes/
│   │   └── v1/                     # /api/v1/... public + admin routers, mounted separately
│   ├── middleware/                 # auth (JWT cookie), error handler, rate limits, sanitize
│   ├── validation/                 # zod schemas per resource
│   ├── utils/                      # slug, pagination, logger
│   ├── seo/                        # (Phase 7) meta injection into SPA html, sitemap, JSON-LD
│   ├── scripts/
│   │   ├── seed.js                 # SAMPLE-labelled data, wipe flag
│   │   └── check-placeholders.js   # npm run check:placeholders
│   ├── tests/
│   ├── app.js                      # express app (middleware, routes, SPA serving)
│   ├── index.js                    # bootstrap: env check → db connect → listen
│   └── package.json
├── docs/ARCHITECTURE.md
├── .env.example
└── README.md
```

## Data model

Canonical units: **price stored as integer PKR**, **area stored as square feet** (float).
Display conversion to lakh/crore and marla/kanal happens in one tested helper. Marla size
(default 272.25 sq ft) lives in site config.

### User
| field | type | notes |
|---|---|---|
| email | String, unique | login id |
| passwordHash | String | bcrypt |
| role | enum: `admin` \| `agent` \| `user` | only `admin` used now |
| name | String | |
| timestamps | | |

### Agent  (separate collection from day one)
| field | type | notes |
|---|---|---|
| userId | ref User, optional | links when agents get logins later |
| name | String | "Yaseen Khan" |
| slug | String, unique | |
| photoUrl | String | Cloudinary |
| bio | { en, ur } | ur optional, falls back |
| phone, whatsapp, email | String | |
| areasServed | [String] | |
| licenseInfo | String, optional | shown only if provided |
| isActive | Boolean | |

### Property
| field | type | notes |
|---|---|---|
| title | { en: required, ur: optional } | fallback to en |
| slug | String, unique, indexed | from en title |
| description | { en, ur } | |
| purpose | enum: `buy` \| `rent` | listed-for |
| type | enum: `house` \| `plot` \| `apartment` \| `commercial` | from site config list |
| status | enum: `available` \| `sold` \| `rented` \| `hidden` | |
| isDraft | Boolean | admin save-as-draft |
| price | Number (PKR) or null | null ⇒ "price on call" |
| priceOnCall | Boolean | |
| areaSqFt | Number | canonical; entered as marla/kanal/sqft in admin |
| areaUnitEntered | enum: `marla` \| `kanal` \| `sqft` | remembers how admin typed it |
| bedrooms, bathrooms | Number, optional | plots/commercial omit |
| city | String | "Peshawar" |
| area | String, indexed | locality, e.g. "Hayatabad Phase 3" |
| location | { lat, lng }, optional | map pin |
| features | [String] | i18n keys where possible |
| photos | [{ publicId, url, width, height, order }] | photos[0] = cover after reorder |
| isFeatured | Boolean | |
| agentId | ref Agent, required | portal seam |
| createdBy | ref User | |
| viewsCount | Number, default 0 | |
| deletedAt | Date, null | soft delete |
| timestamps | | indexed for "newest" sort |

Indexes: `{slug:1}` unique, `{status:1, purpose:1, type:1, area:1, price:1}`, `{createdAt:-1}`, text-ish filtering done via query params, not full-text (MVP).

### Inquiry
| field | type | notes |
|---|---|---|
| propertyId | ref Property, optional | null = general contact form |
| name, phone | String, required | |
| email, message | String, optional | |
| status | enum: `new` \| `contacted` \| `closed` | |
| language | `en` \| `ur` | what they browsed in |
| timestamps | | |

### Testimonial
| field | type | notes |
|---|---|---|
| authorName | String | real clients only, admin-entered |
| text | { en, ur } | |
| permissionObtained | Boolean, required true to display | |
| isVisible | Boolean | |
| order | Number | |

### Settings  (single document)
Editable in admin, overrides the file config at runtime for contact details, hours,
Google Place ID, marla size. The file config supplies defaults + anything not yet in DB.

### Google reviews
Never stored. Fetched server-side from Places API (New), cached **in memory** 24 h,
served at `/api/v1/reviews/google`. Section renders only on a successful, non-empty response.

## API surface (v1)

```
Public:  GET  /api/v1/properties          (filters, sort, pagination — mirrors URL query)
         GET  /api/v1/properties/:slug
         GET  /api/v1/properties/:slug/related
         GET  /api/v1/agent               (the active agent, from DB)
         GET  /api/v1/reviews/google
         POST /api/v1/inquiries           (rate-limited)
         GET  /api/v1/testimonials
Admin:   POST /api/v1/auth/login|logout   PATCH /api/v1/auth/password
         CRUD /api/v1/admin/properties    (+ photo upload/reorder)
         GET/PATCH /api/v1/admin/inquiries
         CRUD /api/v1/admin/testimonials
         GET/PATCH /api/v1/admin/settings
```

## Portal seams built now
- `role` on User; `Agent` collection; `agentId` on Property; public pages read agent from DB.
- Feature flags off: `userAccounts`, `savedSearches`, `multiAgent`, `favorites`.
- `/api/v1` versioning; controllers → services; public/admin routers and layouts separated.
