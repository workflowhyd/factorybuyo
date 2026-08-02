# FactoryBuyo

Gaming + refurbished laptop store for the Indian market. Next.js (static export) frontend,
Convex backend (products + photo storage), and a "Reserve via WhatsApp" flow instead of a
real checkout.

## Stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS — built with `output: "export"`
  so it can be hosted as plain static files (works on Hostinger shared hosting).
- **Backend:** [Convex](https://convex.dev) — `products` table, file storage for photos, and
  a password-gated admin session. The browser talks to Convex directly over WebSocket, so no
  Node server is required on the host.
- **Reserve flow:** every product's "Reserve via WhatsApp" button builds a `wa.me` link
  pre-filled with the product name, price, and condition, and opens it in a new tab.

## Local development

```bash
npm install
npx convex dev      # keep this running — local Convex backend + live function reload
npm run dev          # in a second terminal — Next.js dev server on :3000
```

First run of `npx convex dev` writes `NEXT_PUBLIC_CONVEX_URL` into `.env.local` automatically.

Seed the two placeholder product lists (5 gaming + 10 refurbished laptops with generated
placeholder images) once:

```bash
npx convex run seed:seedProductsMutation
```

Set the admin panel password (local dev):

```bash
npx convex env set ADMIN_PASSWORD "changeme123"
```

Then visit:
- `http://localhost:3000/` — storefront
- `http://localhost:3000/admin` — admin login (password above) → add/edit/delete products and
  upload real photos, replacing the placeholder images

## Before going live — things you still need to provide

1. **WhatsApp number** — edit `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (and in the
   production Convex/hosting env) to the admin's real WhatsApp number, international format,
   digits only (e.g. `919876543210` for +91 98765 43210).
2. **Admin password** — change `ADMIN_PASSWORD` (see below) to something real before launch.
3. **Real product photos** — the site ships with generated placeholder images
   (`public/placeholders/*.svg`, labelled "Photo coming soon"). Log into `/admin` and replace
   each product's photos via the upload field.
4. **Final product list/pricing** — the 8 gaming laptops + 10 refurbished laptops in
   `convex/seedData.ts` are realistic placeholders; edit or replace them via the admin panel
   once the client confirms actual stock and pricing.

## Deploying

### 1. Deploy the Convex backend to the cloud

The local dev backend (`npx convex dev`) only runs on your machine. For production you need a
real hosted Convex deployment:

```bash
npx convex login     # opens a browser to link/create a Convex account
npx convex deploy    # deploys convex/ functions to a production Convex deployment
```

This prints a production `NEXT_PUBLIC_CONVEX_URL` — put it in a `.env.production.local` file
(or your build environment) before building. Also set the production admin password and seed
data on that deployment:

```bash
npx convex env set ADMIN_PASSWORD "<a real password>" --prod
npx convex run seed:seedProductsMutation --prod   # optional, only if starting from placeholders
```

### 2. Build the static site

```bash
npm run build
```

This produces a static site in `/out` — plain HTML/CSS/JS, no server required.

### 3. Upload to Hostinger

Upload the **contents** of `/out` (not the folder itself) to `public_html` on your Hostinger
shared hosting plan, via the hPanel File Manager or FTP/SFTP. Point `factorybuyo.com`'s DNS at
Hostinger as usual — no Node.js hosting is needed since the site is static and talks to Convex
directly from the browser.

Whenever the admin adds/edits products, changes appear on the live site immediately with no
rebuild or redeploy needed — that data lives in Convex, not in the static files. You only need
to rebuild and re-upload `/out` when you change the site's code/design.

## Notes on design decisions

- **Photos:** launched with self-generated placeholder graphics rather than hotlinked
  manufacturer images, to avoid copyright/hotlink-reliability issues on a commercial site —
  swap them for real photos via the admin upload.
- **Admin auth:** a single shared password (no user accounts), enforced inside Convex mutation
  functions — appropriate for a single-admin store, not meant to scale to multiple staff
  accounts.
- **`/product?slug=...`** is used instead of a `/product/[slug]` dynamic route, since Next.js
  static export requires pre-known paths for dynamic segments; the query-string route lets
  new products show up without rebuilding the site.
