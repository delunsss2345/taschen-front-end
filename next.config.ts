
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle for a small Docker runtime image.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};
export default nextConfig;