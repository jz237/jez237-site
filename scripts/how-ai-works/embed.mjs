// Real sentence embeddings (all-MiniLM-L6-v2, 384-d) projected to 2D with t-SNE.
import { pipeline } from '@huggingface/transformers';
import fs from 'node:fs';

const GROUPS = {
  garden: ['watering the tomato beds', 'the redbud is blooming', 'irrigation notes for July', 'pulling weeds after rain', 'planting garlic in autumn', 'mulch keeps the soil moist', 'aphids on the roses', 'compost pile is steaming'],
  code: ['deploy the website', 'fix the failing unit test', 'merge the pull request', 'the build pipeline is broken', 'refactor the login function', 'push the commit to main', 'a null pointer exception', 'cache-busting the stylesheet'],
  space: ['a spiral galaxy far away', 'the rocket reached orbit', 'craters on the moon', 'a black hole bends light', 'stars forming in a nebula', 'astronauts on the space station'],
  food: ['a bowl of spicy ramen', 'baking sourdough bread', 'grilled cheese sandwich', 'fresh basil pesto pasta', 'chocolate chip cookies', 'a slice of pepperoni pizza'],
  music: ['a synthwave track with heavy bass', 'playing guitar chords', 'the vinyl record crackles', 'a jazz saxophone solo', 'drum and bass at 174 bpm', 'singing in a choir'],
  weather: ['thunderstorms tonight', 'a hot humid afternoon', 'light rain in the forecast', 'first frost of the season', 'a cold windy morning', 'heavy snow is expected'],
};
const QUERIES = ['watering schedule', 'my code will not compile', 'what should I cook for dinner', 'will it rain tomorrow', 'songs to play at a party', 'planets and stars', 'tomato sauce'];

const items = Object.entries(GROUPS).flatMap(([g, list]) => list.map(text => ({ text, g })));
const ext = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const emb = async arr => (await ext(arr, { pooling: 'mean', normalize: true })).tolist();
const V = await emb(items.map(i => i.text));
const Q = await emb(QUERIES);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

// --- t-SNE (exact, small n) ---
function tsne(X, { perplexity = 8, iters = 1500, lr = 60, seed = 7 } = {}) {
  const n = X.length;
  let s = seed; const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const D = X.map(a => X.map(b => 2 - 2 * dot(a, b))); // squared euclid on unit vectors
  const P = Array.from({ length: n }, () => new Float64Array(n));
  const target = Math.log(perplexity);
  for (let i = 0; i < n; i++) {
    let lo = 0, hi = Infinity, beta = 1;
    for (let t = 0; t < 60; t++) {
      let sum = 0, H = 0;
      for (let j = 0; j < n; j++) if (j !== i) { const p = Math.exp(-D[i][j] * beta); P[i][j] = p; sum += p; }
      for (let j = 0; j < n; j++) if (j !== i) { P[i][j] /= sum; if (P[i][j] > 1e-12) H -= P[i][j] * Math.log(P[i][j]); }
      if (H > target) { lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; } else { hi = beta; beta = (beta + lo) / 2; }
    }
  }
  const Pj = P.map((row, i) => Array.from(row, (v, j) => (v + P[j][i]) / (2 * n)));
  let Y = Array.from({ length: n }, () => [rand() * 1e-2, rand() * 1e-2]);
  let G = Y.map(() => [0, 0]), U = Y.map(() => [0, 0]);
  for (let it = 0; it < iters; it++) {
    const ex = it < 250 ? 4 : 1, mom = it < 250 ? 0.5 : 0.8;
    const num = Y.map(a => Y.map(b => 1 / (1 + (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)));
    let Z = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) Z += num[i][j];
    for (let i = 0; i < n; i++) {
      let gx = 0, gy = 0;
      for (let j = 0; j < n; j++) if (i !== j) {
        const m = 4 * (ex * Pj[i][j] - num[i][j] / Z) * num[i][j];
        gx += m * (Y[i][0] - Y[j][0]); gy += m * (Y[i][1] - Y[j][1]);
      }
      U[i][0] = mom * U[i][0] - lr * gx; U[i][1] = mom * U[i][1] - lr * gy;
    }
    Y = Y.map((y, i) => [y[0] + U[i][0], y[1] + U[i][1]]);
  }
  const xs = Y.map(y => y[0]), ys = Y.map(y => y[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return Y.map(([x, y]) => [+(((x - x0) / (x1 - x0)) * 0.84 + 0.08).toFixed(3), +(((y - y0) / (y1 - y0)) * 0.84 + 0.08).toFixed(3)]);
}
const XY = tsne(V);
const r3 = x => Math.round(x * 1000) / 1000;
const sim = V.map(a => V.map(b => r3(dot(a, b))));
const queries = QUERIES.map((q, qi) => {
  const s = V.map(v => r3(dot(Q[qi], v)));
  const order = s.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  // place the query at the similarity-weighted centre of its three nearest items
  const top = order.slice(0, 3); const w = top.reduce((a, [v]) => a + v, 0);
  const x = r3(top.reduce((a, [v, i]) => a + v * XY[i][0], 0) / w), y = r3(top.reduce((a, [v, i]) => a + v * XY[i][1], 0) / w);
  return { text: q, sims: s, xy: [x, y] };
});
const out = { model: 'all-MiniLM-L6-v2 (384 dimensions)', items: items.map((it, i) => ({ ...it, xy: XY[i] })), sim, queries };
fs.writeFileSync('embeddings.json', JSON.stringify(out));
for (const q of queries) { const o = q.sims.map((v, i) => [v, items[i].text]).sort((a, b) => b[0] - a[0]).slice(0, 3); console.log(q.text, '→', o.map(x => x[1] + ' ' + x[0]).join(' | ')); }
console.log(fs.statSync('embeddings.json').size);
