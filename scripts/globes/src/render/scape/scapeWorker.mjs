// Builds the betta bowl's furnishings off the page's main thread (scapeBuild.mjs), while the page
// sets up WebGPU, and hands them back without copying.

import { buildFurnishings } from './scapeBuild.mjs';

self.onmessage = (e) => {
  const { n, extent, none, detail } = e.data;
  const built = buildFurnishings(n, extent, none, detail);
  // (Each array's buffer once: two of them share one, and a buffer named twice cannot be sent.)
  const sent = new Set([built.data.buffer, built.map.buffer, built.motion.leafTips.buffer]);
  for (const b of Object.values(built.motion.buffers)) if (b.data) sent.add(b.data.buffer);
  self.postMessage(built, [...sent]);
};
