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
