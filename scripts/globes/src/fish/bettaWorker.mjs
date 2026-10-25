// The betta moved off the page's thread (Betta.ts starts this; bettaLink.mjs is the page's side):
// a twin of the page's specimen, built alike (without its photographs, which the page keeps), moved
// by each step the page sends as it comes, and each pose sent back, in the buffers the page sent.
import { FIN_QUALITY } from '../../../betta-atelier/src/fin-dynamics.js';
import { BettaSpecimen } from './bettaSpecimen.mjs';
import { readStep, stepScratch, writePose } from './bettaLink.mjs';

/** @type {BettaSpecimen | null} */
let fish = null;
const scratch = stepScratch();
/** Pose buffers back from the page, to write the next poses into. */
const free = [];

self.onmessage = ({ data }) => {
  if (data.start) {
    Object.assign(FIN_QUALITY, data.start.quality);
    fish = new BettaSpecimen({ textures: false });
    if (fish.vertices.length !== data.start.vertices) throw new Error(`the worker's betta has ${fish.vertices.length / 3} vertices, the page's ${data.start.vertices / 3}`);
    self.postMessage({ ready: true });
    return;
  }
  free.push(...data.spare);
  const { dt, sense, env, host, turn } = readStep(data.step, fish, scratch);
  fish.step(dt, sense, env, host, turn);
  const pose = writePose(free.pop() ?? null, fish);
  self.postMessage({ pose, step: data.step, mode: fish.swim.mode }, [pose, data.step.buffer]);
};
