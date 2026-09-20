// The integrated photographic layer uses the same bounded service policy as
// the standalone viewer. This does not change the policy of other site routes.
import { onRequest as photographicPolicy } from '../philadelphia-cesium/_middleware.js';

export async function onRequest(context) {
  const response = await photographicPolicy(context);
  // Only public WMVision image widgets are embedded, inside a script-free sandbox.
  // The standalone Cesium viewer and every other route retain their existing policy.
  response.headers.set('Content-Security-Policy', response.headers.get('Content-Security-Policy')
    .replace("frame-src 'self'", "frame-src 'self' https://api.wetmet.net"));
  return response;
}
