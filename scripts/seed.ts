/**
 * Seeds Firestore + Storage with the approved launch content:
 *   - 5 team members (photos uploaded from scripts/seed-assets/)
 *   - 2 case studies (from the wireframe's approved card copy)
 *   - 2 testimonial placeholders (drafts — not public endorsements)
 *   - 4 blog posts (drafts — proposed launch articles awaiting body copy)
 *
 * Idempotent: uses deterministic document IDs, so re-running updates rather
 * than duplicating. Requires a populated .env.local (see .env.example).
 *
 * Run with:  npm run seed
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { slugify } from "../lib/slug";

// Load env from .env.local (Node 20.12+).
try {
  // @ts-expect-error - available at runtime on Node 20.12+
  process.loadEnvFile(".env.local");
} catch {
  console.warn("Could not load .env.local automatically; relying on existing environment.");
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, "seed-assets");

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!projectId || !clientEmail || !privateKey || !storageBucket) {
  console.error(
    "Missing Firebase config. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY and FIREBASE_STORAGE_BUCKET in .env.local."
  );
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), storageBucket });
}
const db = getFirestore();
const bucket = getStorage().bucket(storageBucket);

/** Upload a local image to Storage and return a public download URL. */
async function uploadPhoto(fileName: string, destFolder: string): Promise<string> {
  const buffer = readFileSync(join(ASSETS, fileName));
  const dest = `uploads/${destFolder}/${slugify(fileName.replace(/\.[^.]+$/, ""))}.png`;
  const token = randomUUID();
  await bucket.file(dest).save(buffer, {
    resumable: false,
    metadata: { contentType: "image/png", metadata: { firebaseStorageDownloadTokens: token } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    dest
  )}?alt=media&token=${token}`;
}

// TODO: client to provide — real bios for everyone except the founder.
const BIO_TODO = "Bio coming soon.";

const TEAM = [
  {
    file: "Adesekonge-Ire Aremu.PNG",
    name: "Adesekonge-Ire Aremu",
    role: "Co-Founder / Creative Lead",
    bio: "Adesekonge-Ire Aremu is a marketing communications strategist and copywriter with six years of experience working across B2B businesses, consumer and lifestyle brands, and NGOs.",
  },
  {
    file: "Priye David.PNG",
    name: "Priye David",
    role: "Co-Founder / Client Success Manager",
    bio: BIO_TODO,
  },
  {
    file: "Suur Mchiaga Tsavsar.PNG",
    name: "Suur Mchiaga Tsavsar",
    role: "Quality Assurance Manager",
    bio: BIO_TODO,
  },
  { file: "Victory Adikwu.PNG", name: "Victory Adikwu", role: "Creator / Writer", bio: BIO_TODO },
  {
    file: "Precious Ogunshola.PNG",
    name: "Precious Ogunshola",
    role: "Creator / Writer",
    bio: BIO_TODO,
  },
];

const CASE_STUDIES = [
  {
    slug: "reaching-customers-beyond-a-familiar-audience",
    title: "Reaching customers beyond a familiar audience.",
    clientCategory: "Consumer & lifestyle / Food business",
    summary:
      "We introduced a regular content schedule and turned relatable skits into ads. The campaign brought in customers who had never heard of the business, and the response helped shape the next round of content.",
    proofTags: ["Content planning", "Video editing", "Campaign testing"],
    workInProgress: false,
    published: true,
    // TODO: client to provide — full write-up. Do NOT publish the unverified revenue figure.
    bodyHtml: "",
  },
  {
    slug: "giving-years-of-work-a-clearer-place-online",
    title: "Giving years of work a clearer place online.",
    clientCategory: "B2B / Event branding & production",
    summary:
      "For an established event branding and production business, our work focuses on making its experience easier for prospective clients to understand through its messaging and content.",
    proofTags: ["Brand messaging", "Content development"],
    workInProgress: true,
    published: true,
    // TODO: client to provide — full write-up.
    bodyHtml: "",
  },
];

// Placeholders, not endorsements. Kept as drafts so they never appear publicly
// until real, approved quotes replace them. (No Review/AggregateRating schema.)
const TESTIMONIALS = [
  {
    id: "placeholder-1",
    quote: "[Approved client testimonial will appear here.]",
    clientName: "[Client name and role]",
    clientRole: "",
    category: "Consumer & lifestyle business",
    published: false,
  },
  {
    id: "placeholder-2",
    quote: "[Approved client testimonial will appear here.]",
    clientName: "[Client name and role]",
    clientRole: "",
    category: "Event branding & production business",
    published: false,
  },
];

// Proposed launch articles — seeded as DRAFTS awaiting approved body copy.
const BLOG_POSTS = [
  {
    category: "Being found",
    title: "Your prospect looks you up after the sales call. What do they find?",
    excerpt:
      "Review the information that helps someone assess your business before continuing the conversation.",
  },
  {
    category: "Being found",
    title: "Your company has 15 years of experience. Your website shows almost none of it.",
    excerpt:
      "Identify the projects, customer questions and service details that could make your website more useful.",
  },
  {
    category: "Campaigns and events",
    title: "The event is over. Give interested attendees a reason to stay in touch.",
    excerpt: "Plan follow-up around what people came for and what you can help them do next.",
  },
  {
    category: "Customer relationships",
    title: "Your customers hear about every offer. What else would they want to hear?",
    excerpt: "Think beyond promotions when planning emails for people who already buy from you.",
  },
];

async function main() {
  const today = new Date().toISOString().slice(0, 10);

  console.log("Seeding team members…");
  for (let i = 0; i < TEAM.length; i++) {
    const m = TEAM[i];
    const photoUrl = await uploadPhoto(m.file, "team");
    await db
      .collection("teamMembers")
      .doc(slugify(m.name))
      .set(
        {
          name: m.name,
          role: m.role,
          bio: m.bio,
          photoUrl,
          photoAlt: `Portrait of ${m.name}, ${m.role}`,
          order: i,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log(`  ✓ ${m.name}`);
  }

  console.log("Seeding case studies…");
  for (const cs of CASE_STUDIES) {
    await db
      .collection("caseStudies")
      .doc(cs.slug)
      .set(
        {
          ...cs,
          heroImageUrl: "",
          heroImageAlt: "",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log(`  ✓ ${cs.title}`);
  }

  console.log("Seeding testimonials (drafts)…");
  for (const t of TESTIMONIALS) {
    const { id, ...data } = t;
    await db
      .collection("testimonials")
      .doc(id)
      .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  console.log(`  ✓ ${TESTIMONIALS.length} placeholders`);

  console.log("Seeding blog posts (drafts)…");
  for (const p of BLOG_POSTS) {
    const slug = slugify(p.title);
    await db
      .collection("blogPosts")
      .doc(slug)
      .set(
        {
          title: p.title,
          slug,
          excerpt: p.excerpt,
          category: p.category,
          bodyHtml: "",
          publishDate: today,
          published: false,
          featuredImageUrl: "",
          featuredImageAlt: "",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log(`  ✓ ${p.title}`);
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
