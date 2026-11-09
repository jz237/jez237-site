// The simulation on its own thread: the wasm engine and the sim's end of the
// transport (sim_server.js), answering the page's requests with packets. The
// page's end is WorkerSim (sim_remote.js).
import { SimServer } from './sim_server.js';

const server = new SimServer((message, transfer) => self.postMessage(message, transfer));
self.onmessage = (e) => {
  const m = e.data, done = server.receive(m);
  // ?mesher=away (the boot says so; off as shipped): once the engine is
  // there, the world's coarse meshes are made by a worker of this one's own
  // (mesh_away.js), a frame late, and the step no longer waits for them.
  // Where the browser reports fewer than four cores (mesh_away.js says why),
  // or no such worker can be had, or it
  // dies, the engine makes them itself as it always has. Nothing of it is
  // loaded unless asked for, and nothing of it fails this worker: a mesher
  // that cannot be had is a reason in `meshAway.why` (or none at all); only
  // a trap of the engine itself stops the game, as in a step.
  // (And the water's output with them; ?mesher=meshes or =water: one of the
  // two alone, and with a ! after it whatever the cores, both for a measure.)
  const what = typeof m.mesher === 'string' ? m.mesher.replace('!', '') : '';
  if (m.t === 'boot' && (what === 'away' || what === 'meshes' || what === 'water')) {
    done.then(() => import('./mesh_away.js')).then(({ MeshAway, waysToMesh }) => {
      try {
        const engine = server.sim && server.sim.engine;
        if (!engine || engine.meshAway) return;
        engine.meshAway = new MeshAway(engine, { trapped: (err) => server._trapped(err), what });
        engine.meshAway.start(waysToMesh(import.meta.url), engine.module, m.mesher.endsWith('!') ? 64 : self.navigator ? self.navigator.hardwareConcurrency : 1);
      } catch (err) { /* no mesher: the engine makes its meshes itself */ }
    }).catch(() => { /* mesh_away.js could not be had: the same */ });
  }
};
// For the console and the harness, as window.__vx is on the page.
self.__vx = { server };
// The script runs: the page stops waiting for a sign of life.
self.postMessage({ t: 'hello' });
