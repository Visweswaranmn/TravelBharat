# Testing Log — TravelBharat

No automated test suite exists yet (see README → Future Enhancements). Every module below was manually verified against the real running app and a live MongoDB Atlas database during development — not just read through. This log records what was actually checked, module by module, so it's clear what "tested" means for this project.

## Scaffolding & Schemas

- Server boots, connects to MongoDB Atlas, health check returns the expected JSON
- Client renders with Tailwind styling applied and successfully calls the API on load
- Mongoose schema behavior verified with a smoke-test script (`npm run verify:models`) run against the real database: auto-slug generation, per-state city slug scoping (two cities both named "Ooty" in different states get the same slug `ooty` — correct, since uniqueness is scoped per state), global destination slug uniqueness with `-2` suffixing on collision, and duplicate-name rejection via unique indexes
- All expected indexes confirmed present directly via `collection.getIndexes()`, not just assumed from the schema definitions

## Authentication

- Register: weak password rejected (422), valid registration succeeds (201) and returns a sanitized user + JWT, duplicate email rejected (409)
- Login: wrong password rejected with a generic message (401), correct credentials succeed (200)
- `/auth/me`: valid token succeeds, missing token and garbage token both correctly rejected (401)
- Frontend: empty-form client-side validation blocks submission with no API call; a real registration through the UI stores the JWT, updates the navbar, and redirects; a protected route (`/account`) redirects to login when logged out and correctly restores the session (via `/auth/me`) after a hard page reload; logout clears the token and redirects appropriately

## States, Cities, Destinations, Categories (public API + pages)

- List endpoints verified with real filters: state search, city-by-state, destination filtering by state/city/category/featured, and the text-search endpoint (`?q=temple` correctly matched temple-related destinations)
- Detail endpoints verified for both success and the 404 path (nonexistent slug)
- `adminOnly` middleware verified with three real accounts: an anonymous request (401), a logged-in non-admin (403), and a logged-in admin (success) — against a real protected write route
- Data-integrity guards verified by actually triggering them: deleting a state with existing cities, a city with existing destinations, and a category with existing destinations all correctly return `409` rather than silently succeeding or corrupting data
- Frontend pages (Explore India, State Details, City Details, Destination Details) checked against real seeded data in a real browser — correct counts, correct nested content, working navigation between a destination and its "nearby attractions," and a clean error state (not a blank screen) for a nonexistent state slug

## Admin Dashboard & CRUD

- Dashboard stats endpoint checked against known seed-data counts (4 states, 12 cities, 24 destinations, 9 categories) and against the live count after test data was added/removed
- All four admin management screens (States, Cities, Destinations, Categories) exercised end-to-end in a real browser as a real admin user: create, edit (with prefill verified), and delete, for each
- City form's cascading State→City dropdown verified by deliberately creating a city under the wrong default state, then confirming that switching the State dropdown in the edit form correctly re-narrowed the City field
- Destination form's dynamic image/travel-tip rows, the Featured checkbox, and lat/lng-to-map-URL auto-generation were all verified — the last one by checking the actual generated link on the **public** destination page, not just the admin form
- Non-admin login at `/admin/login` confirmed rejected (with the session torn back down, not left half-authenticated)
- All test data created during these checks was deleted afterward and collection counts confirmed back to baseline

## Responsive Design

- Checked at both 375×812 (mobile) and 1280×800 (desktop) viewports
- No horizontal page overflow at mobile width on any page checked
- Mobile hamburger menu (public nav) and the admin sidebar's off-canvas drawer both verified to open/close correctly via computed styles, not just class-name presence — this caught a real gap in the initial approach (see below)
- Admin form grids (previously fixed 2/3-column layouts) confirmed to collapse to a single column below the `sm` breakpoint

**A debugging note worth keeping on record:** while verifying the sidebar drawer's slide animation, `getComputedStyle().transform` consistently read `"none"` in both open and closed states, which looked like a broken Tailwind build. The actual cause: Tailwind v4 generates the modern individual `translate`/`scale` CSS properties, not the legacy `transform` shorthand — checking the wrong property, not a real bug. The final implementation uses a simpler `hidden`/`block` toggle (verified via `display` directly), which sidesteps the whole question and is a perfectly standard pattern.

## Security Hardening

- Confirmed Helmet's security headers appear on real API responses without breaking any existing functionality (full regression check against the Explore India page, including a clean browser console)
- Attempted a classic NoSQL query-injection payload (`?state[$ne]=null`) — confirmed it has no effect, because Express 5's default query parser doesn't support bracket-notation nesting at all (the payload becomes an unread flat key, not a MongoDB operator)
- Attempted a JSON-body injection on login (`{"email": {"$gt": ""}}`) — confirmed rejected with a clean validation error, no crash, no bypass
- Fired repeated rapid login attempts against the real endpoint and confirmed the rate limiter engages (`429`) after the configured threshold

## What Hasn't Been Tested

- Cross-browser testing (only tested in one browser engine during development)
- Load/performance testing under realistic concurrent traffic
- The full breadth of the admin delete-guards beyond the specific cases listed above (e.g. every possible combination of nested dependencies)
- Deployment-specific behavior (CORS/env config against a real production deployment) — this app has not been deployed yet
