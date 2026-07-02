// Baseline security response headers applied to every route. These are conservative
// defaults suitable for a marketing site; tighten (e.g. add a Content-Security-Policy)
// once the exact set of third-party origins — map tiles, fonts, analytics — is settled.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework/version to attackers.
  poweredByHeader: false,
  serverExternalPackages: ["better-auth"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
