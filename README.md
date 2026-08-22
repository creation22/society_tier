# GurgaonTier — Gurgaon Society Tier List

> Rate your society. See where it ranks in Gurgaon.

A community-driven platform to discover, rate, review, compare and rank residential
societies across Gurgaon. Reddit-style discussions + Google Maps exploration + a
gaming-style S/A/B/C/D tier list, wrapped in a neo-brutalist UI with a 3D skyline hero.

## Tech Stack

- **Frontend:** React (JavaScript), Vite, Tailwind CSS, React Router, React Three Fiber + Three.js, Google Maps JS API + marker clustering
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcrypt, rate limiting
- **Structure:** `/client` (SPA) + `/server` (REST API)

## Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** set `MONGODB_URI` in `server/.env`
- A Google Maps JavaScript API key for the map features (optional — the app degrades gracefully without one)

### 2. Install

```bash
npm install          # root helper scripts
npm run install:all  # installs /server and /client deps
```

### 3. Environment

```bash
cp server/.env.example server/.env    # set JWT_SECRET + MONGODB_URI
cp client/.env.example client/.env    # set VITE_GOOGLE_MAPS_API_KEY (optional)
```

Never commit `.env` files. Map key is read only from `VITE_GOOGLE_MAPS_API_KEY`.

### 4. Seed demo data

```bash
npm run seed            # adds societies/users/ratings/comments if empty
npm run seed -- --fresh # wipes everything first
```

Seeded content is clearly labelled `[DEMO]` synthetic data — do not ship as real reviews.
Demo logins created by the seed:

| Account | Password |
| --- | --- |
| `admin@societytier.dev` | `password123` |
| `demo1@societytier.dev` … `demo6@…` | `password123` |

### 5. Run

```bash
npm run dev:server   # Express API on http://localhost:4000
npm run dev:client   # Vite dev server on http://localhost:5173 (proxies /api)
```

## Feature Map

| Area | Where |
| --- | --- |
| 3D Gurgaon skyline hero (lazy-loaded, parallax, mobile-reduced) | `client/src/components/skyline/` |
| Homepage tier list + animated counters + explore-by-area | `client/src/pages/Home.jsx` |
| Full-screen map w/ clustering, tier/rating/area/BHK/price filters | `client/src/pages/MapPage.jsx` |
| Society page: 10-parameter breakdown, rating modal, map preview | `client/src/pages/SocietyPage.jsx` |
| Reddit-style threaded comments, votes, tags, sorting, reports | `client/src/components/CommentsSection.jsx` |
| Leaderboard w/ categories + rank movement | `client/src/pages/LeaderboardPage.jsx` |
| Compare societies (winner highlighted per parameter) | `client/src/pages/ComparePage.jsx` |
| Auth + profiles (`/u/:username`) | `server/src/controllers/authController.js` |
| Admin dashboard (reports, moderation, bans, vote anomalies) | `client/src/pages/AdminPage.jsx` |
| Confidence-adjusted ranking algorithm (Bayesian prior) | `server/src/services/ratingService.js` |

## Rating Algorithm

Raw averages are misleading (9.8 from 5 ratings vs 9.3 from 1,500). Each society's
**ranking score** uses a Bayesian average:

```
rankingScore = (n × avg + PRIOR_WEIGHT × globalMean) / (n + PRIOR_WEIGHT)
```

Tiers derive from the adjusted score (S ≥ 8.8, A ≥ 8.0, B ≥ 6.8, C ≥ 5.5, D below).
The strategy lives in `server/src/services/ratingService.js` — swap it without touching
models or controllers.

## API Overview

```
GET/POST        /api/societies              GET/PUT/DELETE /api/societies/:slug|:id
GET/POST        /api/societies/:slug/ratings
GET/POST        /api/societies/:slug/comments?sort=top|new|controversial
POST            /api/comments/:id/vote      POST /api/comments/:id/report
GET             /api/leaderboard/:category  GET /api/search?q=
GET             /api/areas                  GET /api/areas/:area
POST            /api/auth/signup|login      GET /api/auth/me|:username
GET             /api/admin/*                (admin role required)
```

All list endpoints are paginated; writes are rate-limited; one rating per account
per society (enforced by a unique index + upsert).

## Production Notes

- SEO: society/area/leaderboard pages set titles, meta descriptions, canonical URLs,
  Open Graph tags and JSON-LD structured data client-side; move rendering server-side
  (or prerender) for full crawler coverage.
- Replace seeded demo data before launch.
