import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    integrations: [
    nodeProfilingIntegration(),
    ],
    
    tracesSampleRate: 0.1,
    profileSessionSampleRate: 0.1,
    profileLifecycle:'trace'
});

export default Sentry;