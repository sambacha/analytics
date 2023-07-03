import { track } from '@vercel/analytics/server';
import { withRequestContext } from '@vercel/analytics/server';

export const runtime = 'edge';

async function handler() {
  track('Edge Event', {
    data: 'edge',
    router: 'app',
  });

  return new Response('OK');
}

export const GET = withRequestContext(handler);
