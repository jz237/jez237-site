// Builds the betta bowl's furnishings off the page's main thread (scapeBuild.mjs), while the page
// sets up WebGPU, and hands them back without copying. The plants take about as long to make as
// the wood and the rocks together, so those two are made meanwhile in a worker of their own
// (scapePieceWorker.mjs), and the pieces put together here in their order: the same as made in
// one go. (Where that worker cannot be had, this one makes them after the plants.)

import { furnishingsOf } from './scapeBuild.mjs';
import { buildScapePieces, SCAPE_PIECE_NAMES } from './scene.mjs';

/** The pieces made in the other worker. */
const APART = ['wood', 'rocks'];

/** The pieces named, made in a worker of their own: once it has begun on them (what this worker
 *  sends it reaches it only while this one's thread is free, so this one waits to hear), and what
 *  it made (null if it failed). */
function piecesApart(only, detail) {
  const worker = new Worker(new URL('./scapePieceWorker.mjs', import.meta.url), { type: 'module' });
  let started = () => {};
  const begun = new Promise((resolve) => (started = resolve));
  const made = new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      if (e.data === 'started') return started();
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      worker.terminate();
      started();
      reject(new Error(e.message || 'the pieces worker failed'));
    };
  });
  worker.postMessage({ detail, only });
  return { begun, made: made.catch(() => null) };
}

self.onmessage = async (e) => {
  const { n, extent, none, detail } = e.data;
  let apart = null;
  try {
    const helper = piecesApart(APART, detail);
    await helper.begun;
    apart = helper.made;
  } catch {
    // (No worker to be had from here: they are made here, after the others.)
  }
  const here = buildScapePieces({ detail, only: SCAPE_PIECE_NAMES.filter((name) => !APART.includes(name)) });
  const pieces = [...((await apart) ?? buildScapePieces({ detail, only: APART })), ...here];
  pieces.sort((a, b) => SCAPE_PIECE_NAMES.indexOf(a.name) - SCAPE_PIECE_NAMES.indexOf(b.name));
  const built = furnishingsOf(pieces, n, extent, none);
  // (Each array's buffer once: two of them share one, and a buffer named twice cannot be sent.)
  const sent = new Set([built.data.buffer, built.map.buffer, built.motion.leafTips.buffer]);
  for (const b of Object.values(built.motion.buffers)) if (b.data) sent.add(b.data.buffer);
  self.postMessage(built, [...sent]);
};
