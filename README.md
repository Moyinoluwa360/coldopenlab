# Cold Open Lab

Marketing website for **Cold Open Lab** (a brand, marketing & communications agency). Built with
Next.js (App Router), deployable to Vercel.

- **Public site**: Home, Services, About/Team, Blog (+ posts), Case studies (+ details), Contact
  (lead-capture form → saved enquiry → Calendly booking → confirmation), Privacy, 404 — all real,
  indexable routes.
- **Content** (blog posts, case studies, testimonials, team members) is edited in **WordPress**
  (headless, pulled in via WPGraphQL) — the client's familiar SEO workflow (Yoast). See
  [WordPress CMS setup](#wordpress-cms-setup) below.
- **Admin panel** (`/admin`): single-account login; read-only list of contact-form enquiries, plus
  a link out to the WordPress dashboard for content editing.

---

## Tech stack

- **Next.js 14** (App Router, TypeScript) — deploy on **Vercel**
- **WordPress** (headless, any host) — content, via **WPGraphQL**
- **Firebase**: Firestore (contact-form enquiries only), Auth (admin email/password)
- Server-side reads/writes via the **Firebase Admin SDK**; the client SDK is used only for the
  admin login.

---

## 1. Prerequisites

- Node.js 20.12+ and npm
- A Google account for Firebase

## 2. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project**.
2. **Build → Firestore Database → Create database** (production mode is fine — all access is
   server-side, so keep the default locked rules; see [Security](#security)).
3. **Build → Storage → Get started** (keep locked rules).
4. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
5. **Authentication → Users → Add user**: create the single admin account (email + password).
   Note this email — it must match `ADMIN_EMAIL`.

### Get the config keys

- **Client config**: Project settings (⚙) → **General** → *Your apps* → add a **Web app** → copy
  the `firebaseConfig` values into the `NEXT_PUBLIC_FIREBASE_*` vars.
- **Admin/server key**: Project settings → **Service accounts** → **Generate new private key**.
  From the downloaded JSON, copy `project_id`, `client_email` and `private_key` into
  `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`.
  Keep the quotes and literal `\n` sequences in `FIREBASE_PRIVATE_KEY`.
- **Storage bucket**: Storage → the `gs://…` name (e.g. `your-project-id.appspot.com`) →
  set both `FIREBASE_STORAGE_BUCKET` and `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.

## 3. Environment variables

```bash
cp .env.example .env.local
# then fill in every value (see comments in .env.example)
```

Key vars: `NEXT_PUBLIC_FIREBASE_*` (client), `FIREBASE_*` (admin), `ADMIN_EMAIL`,
`WORDPRESS_GRAPHQL_URL`, `WORDPRESS_ADMIN_URL`, `REVALIDATE_SECRET`,
`NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SITE_URL`.

## 4. Install & run

```bash
npm install
npm run dev      # http://localhost:3000
```

Then sign in at **`/admin`** with the admin account you created to view contact-form enquiries.

---

## WordPress CMS setup

Blog posts, case studies, testimonials and team members are edited in **WordPress** and pulled
into the Next.js site at request time via **WPGraphQL**. Any WordPress host works (self-hosted,
not WordPress.com's cheap tiers — those block plugin installs) as long as it allows installing
plugins.

### Required plugins

- **WPGraphQL** — exposes the GraphQL API.
- **Advanced Custom Fields (ACF)** — custom fields for case studies, testimonials and team members.
- **WPGraphQL for ACF** — exposes ACF field groups over GraphQL.
- **Custom Post Type UI** (or similar) — registers the `caseStudy`, `testimonial` and
  `teamMember` custom post types, each with "Show in GraphQL" enabled.
- **Yoast SEO** — the client's familiar SEO editing workflow.
- **WPGraphQL SEO** (by ashhitch) — exposes Yoast's fields over GraphQL as `seo { title metaDesc }`.

### Schema (exact names the site expects)

| Content type   | GraphQL type (single / plural)   | Native fields used                                             | Custom fields (ACF group → GraphQL field) |
|----------------|-----------------------------------|------------------------------------------------------------------|--------------------------------------------|
| Blog post      | native `Post` (`post`/`posts`)    | `title slug excerpt content date modified featuredImage seo categories` | — |
| Case study     | `caseStudy` / `caseStudies`       | `title slug excerpt content date modified featuredImage seo`     | "Case Study Fields" → `caseStudyFields { clientCategory proofTags workInProgress }` (`proofTags` = comma-separated text field; `workInProgress` = true/false field) |
| Testimonial    | `testimonial` / `testimonials`    | `id` only                                                          | "Testimonial Fields" → `testimonialFields { quote clientName clientRole category }` |
| Team member    | `teamMember` / `teamMembers`      | `title featuredImage`                                              | "Team Fields" → `teamMemberFields { role bio order }` (`order` = number field) |

### Cache revalidation webhook

Point WordPress at this site's revalidate endpoint so publishing shows up immediately instead of
waiting for the 5-minute ISR window:

```
POST https://<your-domain>/api/revalidate
Header: x-revalidate-secret: <REVALIDATE_SECRET>
Body:   { "type": "post" | "caseStudy" | "testimonial" | "teamMember", "slug": "the-slug" }
```

Wire this up from a `save_post`/`publish` hook on the WordPress side (a small custom plugin or a
Code Snippets snippet — not shipped in this repo).

### Images

`next.config.mjs` derives the allowed `next/image` remote host from `WORDPRESS_GRAPHQL_URL` at
build time, so featured/hero/team images served from the WordPress domain load correctly. If
images are served from a different subdomain (e.g. a CDN in front of WordPress media), add that
host to `remotePatterns` manually.

---

## Content model

| Content         | Source                       | Notes |
|------------------|-------------------------------|-------|
| Blog posts       | WordPress (`Post`)            | Featured image, category, Yoast SEO fields |
| Case studies     | WordPress (`caseStudy` CPT)   | ACF: client category, proof tags, work-in-progress flag |
| Testimonials     | WordPress (`testimonial` CPT) | ACF: quote, client name/role, category. No Review/AggregateRating schema — real endorsements only |
| Team members     | WordPress (`teamMember` CPT)  | ACF: role, bio, display order |
| Enquiries        | Firestore (`enquiries`)       | Contact-form leads; read-only in `/admin/enquiries` |

Publishing in WordPress calls the revalidation webhook above so public pages update immediately.

---

## Security

All Firestore/Storage access goes through the **Admin SDK on the server** — the browser never
reads or writes Firestore directly. Keep the default **locked** Firestore and Storage rules
(deny all client access). Uploaded images are served via Firebase download-token URLs, which work
regardless of Storage rules. `/admin` is protected by a session cookie (verified server-side) and
excluded from indexing (`robots.txt` + `noindex`).

---

## Pre-launch checklist (client to provide)

These are intentionally left as clearly-marked placeholders — fill them before going live:

- [ ] **Domain** → set `NEXT_PUBLIC_SITE_URL` (used for canonical URLs, sitemap, Open Graph).
- [x] **Calendly link** → set `NEXT_PUBLIC_CALENDLY_URL` (2026-09-15: `https://calendly.com/coldopenlab/discovery`).
- [x] **GA4 Measurement ID** → set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (reusing the Firebase Analytics property).
- [x] **Contact details** (email/phone/address) and **social links** → `lib/site.ts` (`CONTACT`), now shown in the footer.
- [ ] **Privacy notice** text → `app/(site)/privacy/page.tsx`.
- [ ] **WordPress instance** → set up per [WordPress CMS setup](#wordpress-cms-setup), then set
      `WORDPRESS_GRAPHQL_URL`, `WORDPRESS_ADMIN_URL`, `REVALIDATE_SECRET`.
- [ ] **Team bios**, **case study write-ups** (do **not** publish the unverified food-business
      revenue figure) and **testimonials** — entered directly in WordPress.
- [ ] **Newsletter** — footer signup is a visual placeholder; connect an email provider when ready.

---

## Deploy to Vercel

1. Push the repo to GitHub and import it into Vercel.
2. Add every variable from `.env.local` to the Vercel project's **Environment Variables**
   (Production + Preview). Paste `FIREBASE_PRIVATE_KEY` exactly, including the `\n` sequences.
3. Deploy. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Lint                                 |
