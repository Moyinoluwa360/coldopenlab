/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Firebase Storage download URLs are served from these hosts.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
