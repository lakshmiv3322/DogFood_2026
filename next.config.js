/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:8080"],
    },
  },
};

// Wrap with Sentry if available
try {
  const { withSentryConfig } = require("@sentry/nextjs");
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: "dogfood",
    project: "dogfood2026",
    disableLogger: true,
  });
} catch {
  module.exports = nextConfig;
}
