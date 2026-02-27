/**
 * Cloudflare Pages Function: simple image proxy to bypass hotlink checks.
 *
 * Usage:
 *   /img?url=https%3A%2F%2Fexample.com%2Fa.png
 */
export async function onRequest({ request, env, waitUntil }) {
  const requestUrl = new URL(request.url)
  const upstream = requestUrl.searchParams.get('url')

  if (!upstream) {
    return new Response('Missing url', { status: 400 })
  }

  let upstreamUrl
  try {
    upstreamUrl = new URL(upstream)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }

  if (upstreamUrl.protocol !== 'http:' && upstreamUrl.protocol !== 'https:') {
    return new Response('Invalid protocol', { status: 400 })
  }

  // Optional allowlist: set IMG_PROXY_ALLOWLIST="example.com,static.example.com"
  const allowlist = (env.IMG_PROXY_ALLOWLIST || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (allowlist.length > 0 && !allowlist.includes(upstreamUrl.hostname)) {
    return new Response('Host not allowed', { status: 403 })
  }

  const cacheKey = new Request(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      // Some anti-hotlinking checks depend on Referer/Origin.
      // We intentionally omit them.
      'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0'
    }
  })

  const cache = caches.default
  const cached = await cache.match(cacheKey)
  if (cached) {
    return withHeaders(cached)
  }

  const resp = await fetch(upstreamUrl.toString(), {
    method: 'GET',
    headers: {
      // Keep it boring.
      'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0',
      'Accept': request.headers.get('Accept') || 'image/avif,image/webp,image/*,*/*;q=0.8'
    },
    cf: {
      cacheEverything: true,
      cacheTtl: 3600
    }
  })

  // Pass through non-2xx for easier debugging.
  const out = new Response(resp.body, resp)

  // Cache only OK responses.
  if (resp.ok) {
    out.headers.set('Cache-Control', 'public, max-age=3600')
    waitUntil(cache.put(cacheKey, out.clone()))
  }

  return withHeaders(out)
}

function withHeaders(response) {
  const out = new Response(response.body, response)
  // Keep it usable from the SPA.
  out.headers.set('Access-Control-Allow-Origin', '*')
  out.headers.set('X-Content-Type-Options', 'nosniff')
  return out
}
