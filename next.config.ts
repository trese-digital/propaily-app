import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Bundle minimal listo para `node server.js` — necesario para el Dockerfile.
  output: "standalone",
  experimental: {
    typedRoutes: true,
    serverActions: {
      // Tamaño máximo de archivos subidos vía Server Actions (default 1 MB).
      // 25 MB matches el fileSizeLimit del bucket de Supabase.
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
