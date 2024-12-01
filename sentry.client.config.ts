// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a02f36afd200bd4b18c9817745b83e07@o4508388731846656.ingest.us.sentry.io/4508388733485056",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  beforeSend(event) {
    // Example: Only send events for critical issues
    if (event.level !== "error") return null;

    // Strip out unnecessary context data
    delete event.contexts;
    return event;
  },
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.1,
});
