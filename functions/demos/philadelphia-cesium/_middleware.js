// Only this preview may contact Cesium and Google 3D tile services.
const policy = [
  "default-src 'self'",
  // Cesium's bundled runtime uses generated functions. Keep this exception
  // confined to the photographic viewer, not the site's global policy.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https://cdn.jsdelivr.net https://*.cesium.com https://*.cesium.com.cn https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com",
  "connect-src 'self' blob: https://cdn.jsdelivr.net https://*.cesium.com https://*.cesium.com.cn https://*.googleapis.com https://*.gstatic.com https://cloudflareinsights.com https://*.google-analytics.com https://www.googletagmanager.com",
  "worker-src 'self' blob: https://cdn.jsdelivr.net",
  "font-src 'self' data:",
  "frame-src 'self'", "frame-ancestors 'self'", "base-uri 'self'", "object-src 'none'", "form-action 'self'", "upgrade-insecure-requests",
].join('; ');

export async function onRequest(context) {
  const upstream = await context.next();
  const response = new Response(upstream.body, upstream);
  response.headers.set('Content-Security-Policy', policy);
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}
