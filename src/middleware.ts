import { defineMiddleware } from 'astro:middleware'

const RATE_LIMIT = 20
const WINDOW_MS = 60 * 60 * 1000

const ipRequests = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITED_ROUTES = ['/api/interactive-lab', '/api/signal-audit']

// Best-effort per-instance guard only. Serverless instances do not share this map,
// so this is intentionally not presented as a durable global rate limiter.
const RATE_LIMIT_MESSAGE =
  "This interactive tool has reached its temporary request limit. Please come back soon."

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  if (!RATE_LIMITED_ROUTES.some(r => pathname.startsWith(r))) {
    return next()
  }

  if (context.request.method !== 'POST') {
    return next()
  }

  const ip =
    context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    context.request.headers.get('x-real-ip') ??
    'unknown'

  const now = Date.now()
  const record = ipRequests.get(ip)

  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }

  if (record.count >= RATE_LIMIT) {
    return new Response(JSON.stringify({ error: RATE_LIMIT_MESSAGE }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }

  record.count++
  return next()
})
