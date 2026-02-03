import * as Sentry from "@sentry/node";
// Ensure to call this before importing any other modules!
Sentry.init({
    dsn: "https://d3e46e67dcc28a0aaf406fb6a3d03bbd@o4510822724861952.ingest.us.sentry.io/4510822730301440",
    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});