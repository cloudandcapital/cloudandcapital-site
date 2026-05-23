import { defineMiddleware } from 'astro:middleware'

const RATE_LIMIT = 10
const WINDOW_MS = 60 * 60 * 1000

const ipRequests = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITED_ROUTES = ['/api/interactive-lab', '/api/signal-audit']

const RATE_LIMIT_MESSAGE =
  "Market Tape is free and always will be — but to keep it that way, there's a limit of 10 requests per hour. Come back soon."

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url
  if (!RATE_LIMITED_ROUTES.some(r => pathname.startsWith(r))) {
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
      headers: { 'Content-Type': 'application/json' },
    })
  }

  record.count++
  return next()
})
