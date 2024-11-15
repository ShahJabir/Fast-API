import { Redis } from '@upstash/redis/cloudflare';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api');
app.use(
  '/api/*',
  cors({
    origin: [' * '],
  })
);

type EnvConfig = {
  UPTASH_REDIS_REST_TOKEN: string;
  UPTASH_REDIS_REST_URL: string;
};

app.get('/search', async (c) => {
  try {
    const { UPTASH_REDIS_REST_TOKEN, UPTASH_REDIS_REST_URL } =
      env<EnvConfig>(c);
    const start = performance.now();
    // ---------------------------------
    const redis = new Redis({
      token: UPTASH_REDIS_REST_TOKEN,
      url: UPTASH_REDIS_REST_URL,
    });

    const query = c.req.query('q')?.toUpperCase();

    if (!query) {
      return c.json({ message: 'Invalid search query' }, { status: 400 });
    }
    const res = [];
    const rank = await redis.zrank('terms', query);
    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>('terms', rank, rank + 150);
      for (const el of temp) {
        if (!el.startsWith(query)) {
          break;
        }
        if (el.endsWith('*')) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }
    // -----------------------------------
    const end = performance.now();
    return c.json({
      results: res,
      duration: end - start,
    });
  } catch (error) {
    console.error(error);
    return c.json({ results: [], message: error }, { status: 500 });
  }
});

export const GET = handle(app);
export default app as never;
