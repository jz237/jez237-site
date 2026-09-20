// The integrated photographic layer uses the same bounded service policy as
// the standalone viewer. This does not change the policy of other site routes.
import { onRequest as photographicPolicy } from '../philadelphia-cesium/_middleware.js';

export async function onRequest(context) {
  const response = await photographicPolicy(context);
  // These public media hosts are confined to this route. Provider scripts remain in sandboxed frames.
  response.headers.set('Content-Security-Policy', response.headers.get('Content-Security-Policy')
    .replace("frame-src 'self'", "frame-src 'self' https://api.wetmet.net https://attheshore.com https://www.attheshore.com")
    .replace("img-src 'self'", "img-src 'self' https://api.igotview.com")
    .replace("connect-src 'self'", "connect-src 'self' https://video.deldot.gov")
    + "; media-src 'self' blob: https://video.deldot.gov");
  return response;
}
