import * as Sentry from "@sentry/react";
import { darkTheme } from "../theme";

Sentry.init({
    dsn: "https://bd6157af79777748ea649f80e572919a@o4510822724861952.ingest.us.sentry.io/4510828109234176",
    sendDefaultPii: true,
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 1,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,
    integrations: [
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: true,
            maskAllInputs: false,
        }),
        Sentry.feedbackIntegration({
            autoInject: false,
            colorScheme: "dark",
            showBranding: false,
            useSentryUser: {
                name: "username",
            },
            themeDark: {
                background: darkTheme.palette.background.default,
            },
        }),
    ],
    // beforeSend(event, hint) {
    //     // Check if it is an exception, and if so, show the report dialog
    //     if (event.exception && event.event_id) {
    //         Sentry.showReportDialog({ eventId: event.event_id });
    //     }
    //     return event;
    // },
});