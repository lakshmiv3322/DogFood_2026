import * as Sentry from "@sentry/nextjs";

// Gated behind SENTRY_DSN: no-op in local development when SENTRY_DSN is unset
const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,
  });
}
