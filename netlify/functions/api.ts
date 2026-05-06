import serverless from 'serverless-http';
import { app } from '../../server.ts';

// Netlify uses 'NETLIFY' env var which we used in server.ts to prevent auto-start
export const handler = serverless(app);
