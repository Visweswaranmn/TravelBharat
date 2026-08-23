# Database Documentation — TravelBharat

MongoDB (via Mongoose), 5 collections. All models are in `server/src/models/`.

## Entity Relationship Overview

```
User (standalone)

State ──┬──< City ──< Destination >── Category
        └───────────< Destination

Destination.nearbyAttractions ──> Destination (self-reference, many-to-many)
```

- A **City** belongs to exactly one **State**.
- A **Destination** belongs to exactly one **State**, one **City**, and one **Category**.
- A **Destination** can reference other Destinations as `nearbyAttractions` (no enforced symmetry — the seed data links them both ways, but the schema doesn't require it).
- **User** has no relationship to the tourism data — `role` alone gates admin access.

## Collections

### `users`

| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `email` | String, required, unique, lowercase, regex-validated | |
| `passwordHash` | String, required | bcrypt hash; `select: false` — never returned by default queries |
| `role` | String, enum `["user", "admin"]` | default `"user"`; never settable via any API input |
| `createdAt`/`updatedAt` | Date | automatic (`timestamps: true`) |

**Indexes**: unique on `email`.

### `states`

| Field | Type | Notes |
|---|---|---|
| `name` | String, required, unique | |
| `slug` | String, unique | auto-generated from `name` on save |
| `code` | String, required, unique | uppercased, e.g. `TN` |
| `capital` | String, required | |
| `description` | String, required | |
| `image.url` / `image.alt` | String, required | |

**Indexes**: unique on `name`, `slug`, `code`.

### `cities`

| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `slug` | String | auto-generated; **unique only within its state**, not globally |
| `state` | ObjectId → State, required | |
| `description` | String, required | |
| `image.url` / `image.alt` | String, required | |

**Indexes**: compound unique on `{state, slug}`; index on `state` alone (for `GET /cities?state=`).

### `categories`

| Field | Type | Notes |
|---|---|---|
| `name` | String, required, unique | e.g. "Heritage", "Nature" |
| `slug` | String, unique | auto-generated |
| `description` | String, optional | |
| `image.url` / `image.alt` | String, optional | not currently used in the UI, reserved for future category banners |

**Indexes**: unique on `name`, `slug`.

### `destinations`

| Field | Type | Notes |
|---|---|---|
| `name` | String, required | |
| `slug` | String, unique | auto-generated **globally** unique — a duplicate name anywhere gets a `-2`, `-3`, … suffix |
| `state` / `city` / `category` | ObjectId, required | references |
| `shortDescription` | String, required, max 220 chars | used in cards |
| `description` | String, required | full body text |
| `historicalSignificance` | String, optional | |
| `bestTimeToVisit` | String, optional | free text, e.g. "October to March" |
| `entryFee` | String, default `"Free"` | free text, not a number — real-world fees are too varied (age/nationality tiers, "camera fee separate", etc.) for a rigid numeric field |
| `openingTime` / `closingTime` | String, optional | free text, e.g. "Open 24 hours" |
| `location.lat` / `location.lng` | Number, optional | |
| `mapUrl` | String, optional | typically `https://www.google.com/maps?q=<lat>,<lng>` |
| `images` | Array of `{url, alt}`, min length 1 (custom validator) | powers the gallery |
| `nearbyAttractions` | Array of ObjectId → Destination | |
| `travelTips` | Array of String | |
| `featured` | Boolean, default `false` | |

**Indexes**:
- Unique on `slug`
- Text index on `name` + `shortDescription` + `description` — powers `GET /destinations/search`
- Compound on `{state, category}` — the most common filter combination on the Explore/Category pages
- Single-field on `city` and on `featured`

## Slug Generation

Every model with a `slug` field generates it in a `pre('save')` hook via a shared helper, `generateUniqueSlug()` (`server/src/utils/slugify.js`), rather than duplicating the logic four times:

```js
export const generateUniqueSlug = async (Model, name, { filter = {}, excludeId } = {}) => {
  const base = slugify(name)          // "Ooty Botanical Garden" -> "ooty-botanical-garden"
  let slug = base
  let counter = 2
  while (await Model.exists({ ...filter, slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${counter++}`
  }
  return slug
}
```

- `filter` scopes the uniqueness check — City passes `{ state: this.state }` so slugs only need to be unique per state; State/Category/Destination pass no filter (global uniqueness).
- `excludeId` is passed on every call so that updating a document's `name` back to itself (or leaving it unchanged) doesn't false-positive against the document's own existing slug.

## Data Integrity Guards

These aren't database constraints (MongoDB has no foreign keys) — they're enforced in the service layer before a delete is allowed:

| Deleting a... | ...is blocked if | 
|---|---|
| State | it still has any City |
| City | it still has any Destination |
| Category | it still has any Destination |
| Destination | never blocked, but deleting one also `$pull`s its id out of every other destination's `nearbyAttractions` array, so no dangling references are left behind |

## Seed Data

See `server/seed/` — three scripts (`seedStatesCities.js`, `seedCategories.js`, `seedDestinations.js`), each idempotent (clears its own collection(s) first). Current demo dataset: 4 states, 12 cities, 9 categories, 24 destinations. Details and rationale for image sourcing are in the seed scripts' own comments.
