# Admin Guide — TravelBharat

## Getting Access

There's no public sign-up for admin accounts. To become an admin:

1. Register a normal account at `/register` (or via the API).
2. Have someone with database access promote it — see [README → Creating an Admin Account](../README.md#creating-an-admin-account).

## Logging In

Go to `/admin/login` — **not** the regular `/login` page. It looks different on purpose (dark theme) so it's never confused with the public site.

If you log in with an account that isn't an admin, you'll see "This account does not have admin access" and be signed out immediately — the admin login page won't leave a non-admin session active.

## Dashboard (`/admin`)

Shows four live counts (States, Cities, Destinations, Categories) and a table of the 5 most recently added destinations, each linking to its public page.

## Managing Content

Each of **States**, **Cities**, **Destinations**, and **Categories** (in the sidebar) works the same way:

- **Add** — click the "Add [Thing]" button, fill in the form, Save.
- **Edit** — click the pencil icon on a row; the form opens pre-filled.
- **Delete** — click the trash icon; you'll be asked to confirm. If the delete is blocked (e.g. you're trying to delete a state that still has cities in it), you'll see an error message explaining why — clean up the dependent items first.

### Adding a City or Destination

Cities require a **State** to belong to. Destinations require a **State**, **City**, and **Category** — the City dropdown automatically narrows to cities in whichever State you've selected, and re-narrows if you change the State.

### Destination-specific fields

- **Images**: at least one is required (URL + alt text). Click "+ Add another image" for a gallery with multiple photos.
- **Travel Tips**: optional, add as many short tips as you like.
- **Latitude/Longitude**: optional. If you fill both in and leave **Map URL** blank, a Google Maps link is generated for you automatically. If you already have a specific map link, paste it into Map URL directly and it takes priority.
- **Featured**: check this to have the destination eligible for homepage/featured placement (the flag exists on every destination; what actually surfaces as "featured" content is a frontend concern).

## Your Profile (`/admin/profile`)

Shows your name, email, and role. Read-only for now — there's no self-service password change or profile editing yet.

## Signing Out

Use the **Logout** button in the top bar. This clears your session; you'll need to log in again at `/admin/login` to get back in.

## Things to Know

- Admin actions hit the same database as the public site immediately — there's no draft/preview mode. Double-check before deleting.
- The sidebar collapses into a slide-out menu on narrow screens (tap the ☰ icon in the top bar to open it).
- "View Site" in the top bar takes you to the public homepage in the same tab — use your browser's back button (or open a second tab) to keep your admin session and the public view side by side.
