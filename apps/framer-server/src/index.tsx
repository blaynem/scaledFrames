import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Frog } from 'frog';
import { devtools } from 'frog/dev';
import { pinata } from 'frog/hubs';
import apiRoutes from './api';
import framesRoute from './frames';

const PORT = 3000;

export const frogApp = new Frog({
  assetsPath: '/',
  basePath: '/',
  browserLocation: '/',
  // Supply a Hub to enable frame verification.
  hub: pinata(),
  // If silent we will not throw an error if verification fails. We will still return `verified` as false though
  verify: 'silent',
});

// This is how we add routes to our Frog instance./
frogApp.route('/api', apiRoutes);
frogApp.route('/frames', framesRoute);

console.log('Serving on port', PORT);
devtools(frogApp, { serveStatic });

serve({
  fetch: frogApp.fetch,
  port: PORT,
});
