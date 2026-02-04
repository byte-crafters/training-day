import * as Sentry from "@sentry/node";
// Ensure to call this before importing any other modules!
Sentry.init({
    dsn: "https://d3e46e67dcc28a0aaf406fb6a3d03bbd@o4510822724861952.ingest.us.sentry.io/4510822730301440",
    sendDefaultPii: true,
    enableLogs: true,
    integrations: [
        // Sentry.consoleLoggingIntegration({ levels: ['error', 'warn', 'info', 'debug', 'log'] }),
    ],
    // tracesSampleRate: 1.0,
});
