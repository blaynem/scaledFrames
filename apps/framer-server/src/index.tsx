import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Frog } from 'frog';
import { devtools } from 'frog/dev';
import { pinata } from 'frog/hubs';
import apiRoutes from './api';
import framesRoute from './frames';
import { cors } from 'hono/cors';
import {
  API_SERVER_BASE_PATH,
  FRAMES_SERVER_BASE_PATH,
} from '@framer/FramerServerSDK';

const PORT = process.env.NEXT_PUBLIC_API_FRAMER_PORT!;

// Environment-specific CORS settings
const isDevelopment = process.env.NODE_ENV === 'development';

export const frogApp = new Frog({
  title: "main title",
  origin: process.env.NEXT_PUBLIC_CLIENT_URL,
  verifyOrigin: false,
  basePath: '/',
  // Supply a Hub to enable frame verification.
  hub: pinata(),
  // If silent we will not throw an error if verification fails. We will still return `verified` as false though
  verify: 'silent',
});

frogApp.use(
  cors({
    origin: isDevelopment ? '*' : ['http://www.scaledframes.com', 'http://scaledframes.com', 'https://www.scaledframes.com', 'https://scaledframes.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// This is how we add routes to our Frog instance./
frogApp.route(API_SERVER_BASE_PATH, apiRoutes);
frogApp.route(FRAMES_SERVER_BASE_PATH, framesRoute);
// TODO: Fallback route for when a frame is unsupported.

devtools(frogApp, { serveStatic });

serve({
  fetch: frogApp.fetch,
  port: PORT as unknown as number,
});

console.log(`Server running on port: ${PORT}`);
