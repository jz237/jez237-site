// Builds the betta bowl's furnishings off the page's main thread (scapeBuild.mjs), while the page
// sets up WebGPU, and hands them back without copying.

import { buildFurnishings } from './scapeBuild.mjs';

self.onmessage = (e) => {
  const { n, extent, none } = e.data;
  const built = buildFurnishings(n, extent, none);
  self.postMessage(built, [built.data.buffer, built.map.buffer]);
};
