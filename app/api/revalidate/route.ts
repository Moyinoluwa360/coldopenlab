import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Webhook WordPress calls on publish/update/delete to bust Next's ISR cache.
 * See README for the WordPress-side setup.
 */

interface RevalidateBody {
  type: "post" | "caseStudy" | "testimonial" | "teamMember";
  slug?: string;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: RevalidateBody = await req.json();
    const { type, slug } = body;

    switch (type) {
      case "post":
        revalidatePath("/blog");
        if (slug) revalidatePath(`/blog/${slug}`);
        revalidatePath("/sitemap.xml");
        break;
      case "caseStudy":
        revalidatePath("/case-studies");
        if (slug) revalidatePath(`/case-studies/${slug}`);
        revalidatePath("/");
        revalidatePath("/sitemap.xml");
        break;
      case "testimonial":
        revalidatePath("/");
        break;
      case "teamMember":
        revalidatePath("/about");
        break;
      default:
        return NextResponse.json({ error: `Unknown type "${type}"` }, { status: 400 });
    }

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
