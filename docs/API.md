# API Reference — TravelBharat

Base URL (local dev): `http://localhost:5000/api` (or whatever `PORT`/`VITE_API_URL` you've configured).

## Conventions

**Response envelope** — every endpoint returns one of these two shapes:

```json
// success
{ "success": true, "message": "...", "data": { ... } }

// error
{ "success": false, "message": "..." }
```

(In development, error responses also include a `stack` field — omitted in production.)

**Auth** — protected endpoints require `Authorization: Bearer <token>`, where `<token>` is the JWT returned from register/login. Admin-only endpoints additionally require the authenticated user to have `role: "admin"`.

**Rate limits** — all `/api` routes: 300 requests / 15 min per IP. `/api/auth/register` and `/api/auth/login` specifically: 10 requests / 15 min per IP.

---

## Auth — `/api/auth`

### `POST /auth/register`
Public. Creates a `role: "user"` account — `role` is never accepted from the request body.

Request:
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "at least 8 characters" }
```
Response `201`:
```json
{ "success": true, "message": "Account created successfully",
  "data": { "user": { "id", "name", "email", "role", "createdAt" }, "token": "<jwt>" } }
```
Errors: `422` validation failure, `409` email already registered.

### `POST /auth/login`
Public.

Request: `{ "email": "...", "password": "..." }`
Response `200`: same shape as register.
Errors: `401 "Invalid email or password"` for either a wrong email or wrong password (deliberately identical, to avoid leaking which accounts exist).

### `GET /auth/me`
Requires auth. Returns the current user based on the token.

---

## States — `/api/states`

### `GET /states`
Public. Query params: `search` (matches state name, case-insensitive), `page`, `limit` (default 20).

Response `data`: `{ states: [...], total, page, pages }`. Each state includes computed `cityCount` and `destinationCount`.

### `GET /states/:slug`
Public. Returns `{ state, cities, destinationCount }` — `cities` is every city belonging to that state. `404` if the slug doesn't exist.

### `GET /states/:stateSlug/cities/:citySlug`
Public. Nested under states because a city's slug is only unique **within its state**, not globally. Returns `{ city, destinationCount }`.

### `POST /states` · `PUT /states/:id` · `DELETE /states/:id`
Admin only. Body for create/update:
```json
{ "name": "Tamil Nadu", "code": "TN", "capital": "Chennai", "description": "...",
  "image": { "url": "https://...", "alt": "..." } }
```
`DELETE` returns `409` if the state still has cities — delete those first.

---

## Cities — `/api/cities`

### `GET /cities`
Public. Query param: `state` (a state's slug — filters to that state's cities; omit for all cities).

### `POST /cities` · `PUT /cities/:id` · `DELETE /cities/:id`
Admin only. Body:
```json
{ "name": "Ooty", "state": "<state ObjectId>", "description": "...",
  "image": { "url": "https://...", "alt": "..." } }
```
`DELETE` returns `409` if the city still has destinations.

*(There's no `GET /cities/:id` — the admin UI already has full city objects from the list, so a per-id fetch was unnecessary. Public city detail pages use the nested `/states/:stateSlug/cities/:citySlug` route above.)*

---

## Destinations — `/api/destinations`

### `GET /destinations`
Public. Query params: `state`, `city`, `category` (all slugs), `featured` (`"true"`/`"false"`), `page`, `limit` (default 12). Any filter that doesn't resolve to a real record returns an empty page rather than an error.

Response `data`: `{ destinations: [...], total, page, pages }`, each destination populated with `state`, `city`, `category` (`{_id, name, slug}` only).

### `GET /destinations/search?q=`
Public. MongoDB `$text` search across name/short description/description, sorted by relevance. Returns `{ destinations, count }` (not paginated — capped at 20 results).

### `GET /destinations/slug/:slug`
Public. Full destination detail, including populated `nearbyAttractions` (each with its own state/city). `404` if not found.

### `POST /destinations` · `PUT /destinations/:id` · `DELETE /destinations/:id`
Admin only. Body:
```json
{
  "name": "Ooty Lake", "state": "<id>", "city": "<id>", "category": "<id>",
  "shortDescription": "max 220 chars", "description": "...",
  "historicalSignificance": "optional", "bestTimeToVisit": "optional",
  "entryFee": "optional free text", "openingTime": "optional", "closingTime": "optional",
  "location": { "lat": 11.4064, "lng": 76.6932 }, "mapUrl": "optional",
  "images": [{ "url": "https://...", "alt": "..." }],
  "travelTips": ["optional", "strings"], "featured": false
}
```
At least one image (with both `url` and `alt`) is required. `DELETE` also removes the destination's id from any other destination's `nearbyAttractions` array, so deleting one never leaves a dangling reference.

---

## Categories — `/api/categories`

### `GET /categories`
Public. Each category includes a computed `destinationCount`.

### `GET /categories/:slug`
Public. Single category (no destinations embedded — fetch those separately via `GET /destinations?category=<slug>`).

### `POST /categories` · `PUT /categories/:id` · `DELETE /categories/:id`
Admin only. Body: `{ "name": "Heritage", "description": "optional" }`. `DELETE` returns `409` if the category still has destinations.

---

## Admin — `/api/admin`

Every route in this router requires admin auth (`protect` + `adminOnly` applied to the whole router).

### `GET /admin/stats`
Returns `{ totalStates, totalCities, totalDestinations, totalCategories, recentDestinations }` — the last 5 destinations created, each with populated state/city/category names.

---

## Health — `/api/health`

### `GET /health`
Public, unauthenticated. Returns `{ success: true, message: "TravelBharat API is running", timestamp }`. Used by the client on boot and suitable for a hosting platform's uptime check.

---

## Error Reference

| Status | Meaning |
|---|---|
| `400` | Malformed id (`CastError`) or a referenced id (state/city/category) doesn't exist |
| `401` | Missing/invalid/expired token, or wrong login credentials |
| `403` | Authenticated but not an admin |
| `404` | Resource not found |
| `409` | Conflict — duplicate unique field, or a delete blocked by a data-integrity guard |
| `422` | Request body failed validation |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |
