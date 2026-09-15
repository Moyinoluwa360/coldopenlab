# Cold Open Lab

Marketing website for **Cold Open Lab** (a brand, marketing & communications agency) with a
simple admin panel for the client to manage her own content. Built with Next.js (App Router) and
Firebase, deployable to Vercel.

- **Public site**: Home, Services, About/Team, Blog (+ posts), Case studies (+ details), Contact
  (Calendly booking), Privacy, 404 — all real, indexable routes.
- **Admin panel** (`/admin`): single-account login; CRUD for blog posts, case studies,
  testimonials and team members, with image upload/crop and a rich-text editor.

---

## Tech stack

- **Next.js 14** (App Router, TypeScript) — deploy on **Vercel**
- **Firebase**: Firestore (content), Storage (images), Auth (admin email/password)
- Server-side reads/writes via the **Firebase Admin SDK**; the client SDK is used only for the
  admin login. Rich text via **Tiptap**; image cropping via **react-easy-crop**.

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
`NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SITE_URL`.

## 4. Install & run

```bash
npm install
npm run dev      # http://localhost:3000
```

## 5. Seed the initial content

Populates the approved launch content: 5 team members (with photos from
`scripts/seed-assets/`), 2 case studies, 2 testimonial placeholders (drafts) and 4 blog posts
(drafts). Idempotent — safe to re-run.

```bash
npm run seed
```

Then sign in at **`/admin`** with the admin account you created.

---

## Content model

| Collection     | Public when          | Notes |
|----------------|----------------------|-------|
| `blogPosts`    | `published: true`    | Featured image cropped **16:9** |
| `caseStudies`  | `published: true`    | Hero image cropped **3:2**; `workInProgress` shows a label |
| `testimonials` | `published: true`    | Seeded as **drafts**. No Review/AggregateRating schema — placeholders, not endorsements |
| `teamMembers`  | always (ordered)     | Photo cropped **3:4**; two lowest `order` values span wider |

Drafts are visible only in the admin panel. Saving in admin revalidates the affected public pages
immediately.

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
- [ ] **Team bios** for everyone except the founder (seeded as "Bio coming soon.").
- [ ] **Case study write-ups** — full bodies (do **not** publish the unverified food-business
      revenue figure).
- [ ] **Testimonials** — replace the draft placeholders with real, approved quotes before publishing.
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
| `npm run seed`  | Seed Firestore/Storage with content  |
| `npm run lint`  | Lint                                 |
