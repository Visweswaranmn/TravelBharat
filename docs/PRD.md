# Product Requirements Document — TravelBharat

## 1. Problem Statement

Tourism information about Indian destinations is scattered across dozens of state tourism board websites, blogs, and travel aggregators, each with inconsistent structure and coverage. A traveler researching a trip across, say, Tamil Nadu and Kerala has no single place to browse destinations state-by-state and city-by-city with consistent, structured information (entry fees, hours, best time to visit, nearby attractions).

## 2. Objectives

**Primary**
- Provide a single, centralized platform for browsing Indian tourism information
- Organize destinations hierarchically: State → City → Destination
- Present structured, comparable information for every destination (not free-form blog text)
- Make discovery easy via search and category browsing

**Secondary**
- Give lesser-known destinations equal visibility alongside famous ones
- Serve as a reference for students/researchers studying Indian tourism
- Build a foundation that scales to all 28 states and 8 union territories, without architectural rework

## 3. Target Users

| User | Needs |
|---|---|
| Traveler planning a trip | Browse by state/city, compare destinations, get practical info (fees, hours, map) |
| Casual browser | Discover interesting places by category (heritage, nature, adventure, …) |
| Content admin | Add/update/remove states, cities, destinations, and categories without touching code |

## 4. Scope

### In scope (delivered)
- Public browsing: states, cities, destinations, categories, search
- Destination detail pages with full structured data (see `docs/DATABASE.md` for the exact fields)
- User accounts (registration/login) — currently used only to gate a personal account page; not required to browse
- Admin panel with full CRUD for all content types, protected by role-based access control
- Responsive design for desktop, tablet, and mobile

### Explicitly out of scope (this phase)
- Payment processing or bookings — this is an information platform, not a booking engine
- User-generated content (reviews, photos, ratings)
- Real-time data (live weather, crowd levels, pricing)
- Multi-language support
- Native mobile apps

### Deliberately deferred
- Comprehensive nationwide seed data (currently 4 states as a representative demo — see README)
- Image upload (Cloudinary or similar) — images are currently URLs entered directly by an admin
- Automated test suite

## 5. Success Criteria

- A user can go from the home page to a specific destination's full details in 3 clicks or fewer (Home → Explore → State → Destination, or via Search)
- An admin can add a new destination (with images, category, location) without any code changes
- The API rejects unauthenticated/unauthorized write attempts and returns clear error messages
- No page shows a blank screen while loading or on error — every data-driven view has loading/error/empty states
- The site is usable on a 375px-wide mobile viewport with no horizontal scrolling

## 6. Non-Functional Requirements

- **Security**: hashed passwords, JWT auth, admin routes enforced server-side, standard security headers, rate limiting, NoSQL-injection sanitization
- **Performance**: paginated list endpoints, database indexes on frequently-filtered/searched fields, lazy-loaded images
- **Maintainability**: layered backend (routes/controllers/services/models), no business logic in controllers, reusable frontend components
- **Data integrity**: referential guards (e.g. a State with existing Cities cannot be deleted) enforced at the service layer, not just the UI

## 7. Future Vision

TravelBharat's data model (State → City → Destination → Category, with lat/lng and nearby-attraction links already in place) is intended to support future additions without restructuring:
- Map-based discovery
- Itinerary building across multiple destinations
- Community contributions with moderation
- Regional-language content
