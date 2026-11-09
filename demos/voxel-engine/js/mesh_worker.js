// The mesher on a thread of its own: a second instance of the engine that
// is given no world, only jobs (mesh_away.js, meshServer). Started by
// whoever steps the world; its other end is MeshAway.
import { meshServer } from './mesh_away.js';

const take = meshServer((message, transfer) => self.postMessage(message, transfer));
// (A trap in the engine ends the mesher: its other end is told, and makes
// its meshes itself from then on.)
self.onmessage = (e) => {
  take(e.data).catch((err) => self.postMessage({ t: 'error', message: String((err && err.message) || err) }));
};
