// Makes some of the betta bowl's furnishings' pieces (scene.mjs) for scapeWorker.mjs, which makes
// the rest meanwhile, and hands them back without copying.

import { buildScapePieces } from './scene.mjs';

/** Every typed array's buffer in a value, once each. */
function buffersOf(value, found = new Set()) {
  if (ArrayBuffer.isView(value)) found.add(value.buffer);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) buffersOf(v, found);
  return found;
}

self.onmessage = (e) => {
  // (scapeWorker.mjs waits to hear this before it gets on with its own pieces: while it is busy,
  // what it sends here does not arrive.)
  self.postMessage('started');
  const pieces = buildScapePieces(e.data);
  self.postMessage(pieces, [...buffersOf(pieces)]);
};
