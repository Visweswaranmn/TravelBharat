# TravelBharat — Explore India, State by State

A centralized tourism information platform for discovering Indian states, cities, and tourist destinations — heritage sites, natural attractions, adventure spots, religious sites, and cultural landmarks — through a structured, modern interface.

Built as a full-stack portfolio project for a Unified Mentor internship.

> **Demo data note:** the seeded dataset covers 4 states (Tamil Nadu, Kerala, Rajasthan, Karnataka), 12 cities, 24 destinations, and 9 categories. This demonstrates the full feature set end-to-end but is **not** a complete or verified directory of Indian tourism — the architecture supports all states and union territories, and expanding the dataset is straightforward (see [Seeding the Database](#seeding-the-database)).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [Creating an Admin Account](#creating-an-admin-account)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Further Documentation](#further-documentation)
- [Future Enhancements](#future-enhancements)

---

## Features

**Public site**
- Browse all Indian states and union territories, with search
- State detail pages — capital, description, cities, and destinations
- City detail pages — description and local attractions
- Destination detail pages — image gallery, description, historical significance, best time to visit, entry fee, hours, map link, travel tips, and nearby-attraction suggestions
- Site-wide search across destination name, description, state, city, and category, with debounced input and empty-state handling
- Browse destinations by category (Heritage, Nature, Religious, Adventure, Cultural, Beach, Wildlife, Hill Station, Historical)
- User registration/login with JWT auth, and a personal account page

**Admin panel** (`/admin`, separate login at `/admin/login`)
- Dashboard with live counts (states, cities, destinations, categories) and a recent-additions table
- Full CRUD for States, Cities, Destinations, and Categories — add/edit/delete with confirmation dialogs
- Role-based access control — only accounts with `role: "admin"` can reach admin routes, enforced on both the API and the UI

**Engineering**
- REST API with consistent response envelopes and centralized error handling
- JWT authentication, bcrypt password hashing, admin-only route guards
- Request validation on every write endpoint (`express-validator`)
- Security hardening: Helmet security headers, rate limiting (general + auth-specific), NoSQL-injection input sanitization
- Responsive design (mobile nav, collapsible admin sidebar) down to 375px viewports
- Loading, error, and empty states on every data-driven page — no blank screens

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, Axios, React Hot Toast, Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| Validation | `express-validator` |
| Security | `helmet`, `express-rate-limit`, custom NoSQL-sanitization middleware |

## Architecture

```
┌──────────────────┐        HTTPS/JSON        ┌───────────────────┐        Mongoose        ┌──────────────┐
│  React (Vite)     │ ────────────────────────▶ │  Express REST API  │ ──────────────────────▶ │ MongoDB Atlas │
│  client            │ ◀──────────────────────── │  server             │ ◀────────────────────── │               │
└──────────────────┘   JWT (Bearer header)     └───────────────────┘                          └──────────────┘
```

- **Client and server are fully decoupled** — separate codebases, separate deployments, communicating only via the REST API.
- **Auth** uses a JWT returned on login/register, stored client-side, and sent as `Authorization: Bearer <token>`. There is one backend auth system for both regular users and admins — the admin login page is a separate UI entry point, not a separate auth mechanism, and immediately signs out any non-admin account that tries to use it.
- **Layered backend**: `routes` → `controllers` (HTTP concerns) → `services` (business logic) → `models` (Mongoose schemas). Controllers never touch Mongoose directly.

## Project Structure

```
TravelBharat/
├── client/
│   └── src/
│       ├── components/
│       │   ├── admin/       # Modal, ConfirmDialog, FormField, AdminSidebar, AdminTopbar
│       │   ├── cards/       # StateCard, CityCard, DestinationCard, CategoryCard
│       │   ├── common/      # Navbar, LoadingSpinner, ErrorMessage, EmptyState
│       │   ├── gallery/     # ImageGallery
│       │   └── search/      # SearchBar
│       ├── context/         # AuthContext
│       ├── hooks/           # useDebounce
│       ├── layouts/         # PublicLayout, AdminLayout
│       ├── pages/
│       │   ├── public/      # Home, ExploreIndia, StateDetails, CityDetails,
│       │   │                # DestinationDetails, Search, CategoryList, CategoryDetail,
│       │   │                # Login, Register, MyAccount
│       │   └── admin/       # AdminLogin, Dashboard, Manage{States,Cities,Destinations,Categories}, Profile
│       ├── routes/          # ProtectedRoute, AdminRoute
│       ├── services/        # One file per API resource (axios calls only)
│       └── utils/           # categoryIcons
│
├── server/
│   ├── seed/                 # Dev/demo seed scripts (states+cities, categories, destinations)
│   ├── scripts/               # verifyModels.js — schema smoke test
│   └── src/
│       ├── config/            # env.js, db.js
│       ├── controllers/       # HTTP layer — req/res only
│       ├── middleware/        # auth, validate, errorHandler, rateLimiters, sanitizeInput
│       ├── models/            # User, State, City, Category, Destination
│       ├── routes/            # One router per resource
│       ├── services/          # Business logic, all DB access
│       ├── validators/        # express-validator chains
│       ├── app.js             # Express app + middleware wiring
│       └── server.js          # Entry point
│
└── docs/                      # PRD, API reference, database schema, admin guide
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A MongoDB Atlas cluster (or local MongoDB) — [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas/register) has a free tier

### Server

```bash
cd server
npm install
cp .env.example .env    # then fill in your values — see Environment Variables below
npm run dev
```

Server runs on `http://localhost:5000` by default (or whatever `PORT` you set).

### Client

```bash
cd client
npm install
cp .env.example .env    # set VITE_API_URL to match your server
npm run dev
```

Client runs on `http://localhost:5173` by default.

Open the printed client URL in your browser. You should see the TravelBharat home page.

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `MONGO_URI` | MongoDB connection string, including a database name | `mongodb+srv://user:pass@cluster.mongodb.net/travelbharat` |
| `JWT_SECRET` | Long random string used to sign JWTs — never reuse a sample value | (generate your own — see below) |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Exact origin of the running frontend, used for CORS | `http://localhost:5173` |

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the running API, including `/api` | `http://localhost:5000/api` |

Neither `.env` file is committed — see `.env.example` in each folder for the template.

## Seeding the Database

The seed scripts populate a small, realistic demo dataset. Run them in order (or use the combined script):

```bash
cd server
npm run seed:all
# equivalent to running these in order:
#   npm run seed:states-cities
#   npm run seed:categories
#   npm run seed:destinations
```

Each script is idempotent — it clears its own collection(s) before inserting, so it's safe to re-run. `seed:destinations` depends on states/cities and categories already existing.

To verify the Mongoose schemas independently of seed data:

```bash
npm run verify:models
```

## Creating an Admin Account

There is no public sign-up flow for admin accounts, by design (see [Security](#security-notes) below). To create one:

1. Register a normal account through the site (`/register`) or the API.
2. Promote it directly in the database:

```bash
cd server
node -e "import('./src/config/db.js').then(async ({connectDB}) => { await connectDB(); const { User } = await import('./src/models/index.js'); await User.updateOne({ email: 'you@example.com' }, { role: 'admin' }); process.exit(0); })"
```

3. Log in at `/admin/login` with that account.

## API Overview

Full endpoint reference: [`docs/API.md`](docs/API.md). Summary:

| Resource | Base path | Public reads | Admin writes |
|---|---|---|---|
| Auth | `/api/auth` | register, login | — |
| States | `/api/states` | list, detail by slug | create, update, delete |
| Cities | `/api/cities` | list (filterable), detail via state | create, update, delete |
| Destinations | `/api/destinations` | list (filterable), search, detail by slug | create, update, delete |
| Categories | `/api/categories` | list, detail by slug | create, update, delete |
| Admin | `/api/admin` | — | dashboard stats |

All responses use a consistent envelope: `{ success, message, data }` on success, `{ success: false, message }` on error.

## Testing

There is no automated test suite (out of scope for this project's timeline) — every module was manually verified against the running app and API during development, including:

- Full auth flow (register/login/logout, protected routes, admin-only routes) with both valid and invalid credentials
- CRUD for all four admin-managed resources, including delete-guard rejections (e.g. deleting a state that still has cities)
- Search, category filtering, and pagination against real seeded data
- NoSQL-injection and rate-limit behavior against the live API (see `docs/API.md` for specifics)
- Responsive layout at 375px and 1280px+ viewports

See [`docs/TESTING.md`](docs/TESTING.md) for the detailed manual test log, organized by module.

To test manually yourself:
- **API**: Postman, Thunder Client, or `curl` against `http://localhost:5000/api/...`
- **Database**: MongoDB Compass, pointed at your `MONGO_URI`
- **Frontend**: the running app in a browser, including DevTools' device toolbar for responsive checks

## Screenshots

*(To add once deployed: hero/home page, Explore India, a Destination Details page, and the Admin Dashboard.)*

## Deployment

Not yet deployed. Planned approach:

- **Frontend** → Vercel or Netlify (static build via `npm run build`)
- **Backend** → Render or Railway (Node web service)
- **Database** → MongoDB Atlas (already in use for development)

Key things to set before deploying:
- `CLIENT_URL` on the deployed backend must exactly match the deployed frontend's origin (CORS will otherwise block it)
- `VITE_API_URL` on the deployed frontend must point at the deployed backend's `/api` path
- Generate a fresh `JWT_SECRET` for production — do not reuse a development secret
- Set `NODE_ENV=production` so error responses stop including stack traces

## Further Documentation

- [`docs/PRD.md`](docs/PRD.md) — product requirements and scope
- [`docs/API.md`](docs/API.md) — full endpoint reference with examples
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema design, relationships, indexes
- [`docs/ADMIN_GUIDE.md`](docs/ADMIN_GUIDE.md) — how to use the admin panel
- [`docs/TESTING.md`](docs/TESTING.md) — manual test log by module

## Security Notes

- Passwords are hashed with bcrypt (never stored or logged in plain text)
- JWTs are signed with a server-side secret and expire after 7 days by default
- Admin role can only be granted by direct database access — never via any API input, including the registration endpoint
- All write endpoints require authentication; admin-only endpoints additionally check `role === 'admin'` server-side (not just hidden in the UI)
- Helmet sets standard security headers; `express-rate-limit` throttles both general API traffic and auth attempts specifically
- Request bodies/query/params are sanitized against NoSQL-operator injection before reaching any database query

## Future Enhancements

- Comprehensive seed data covering all Indian states and union territories
- Cloudinary (or similar) integration for admin image uploads, replacing manually-pasted image URLs
- Full-text search relevance tuning and typeahead suggestions
- Map-based destination discovery (a destination already stores lat/lng)
- User-submitted reviews or ratings
- Automated test suite (Jest/Vitest + Supertest)
- CI pipeline for lint/build checks on push

---

**Author:** Visweswaran M N · Built as part of a Unified Mentor internship project.
