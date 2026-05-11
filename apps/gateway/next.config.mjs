/** @type {import('next').NextConfig} */
const nextConfig = {
  // In production, rewrites proxy /financetools/* to the financetools app.
  // When adding a new app, add another rewrite entry here.
  // Each sub-app runs as a separate Vercel project (or separate port in dev).
  async rewrites() {
    return [
      {
        source: "/financetools/:path*",
        destination: `${process.env.FINANCETOOLS_URL || "http://localhost:3001"}/financetools/:path*`,
      },
      {
        source: "/devtools/:path*",
        destination: `${process.env.DEVTOOLS_URL || "http://localhost:3002"}/devtools/:path*`,
      },
      // Future apps:
      // {
      //   source: "/pdftools/:path*",
      //   destination: `${process.env.PDFTOOLS_URL || "http://localhost:3003"}/pdftools/:path*`,
      // },
    ];
  },
};

export default nextConfig;
