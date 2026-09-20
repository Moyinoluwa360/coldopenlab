import "server-only";

/**
 * Thin WPGraphQL client. Blog posts, case studies, testimonials and team
 * members are edited in WordPress (see README) and pulled in here; only
 * `enquiries` (lib/data.ts) still lives in Firestore.
 */

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export async function wpFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;
  if (!endpoint) {
    throw new Error("WORDPRESS_GRAPHQL_URL is not configured.");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`WordPress GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();
  if (json.errors?.length) {
    throw new Error(`WordPress GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("WordPress GraphQL response had no data.");
  }
  return json.data;
}
