/** @type {import('next').NextConfig} */

// Allow next/image to load images served from the WordPress instance
// (featured images, case-study/team photos) once WORDPRESS_GRAPHQL_URL is set.
const wordpressPattern = (() => {
  try {
    const { protocol, hostname } = new URL(process.env.WORDPRESS_GRAPHQL_URL ?? "");
    return { protocol: protocol.replace(":", ""), hostname };
  } catch {
    return null;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Legacy Firebase Storage download URLs, if any content still points there.
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      ...(wordpressPattern ? [wordpressPattern] : []),
    ],
  },
};

export default nextConfig;
