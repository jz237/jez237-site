// Precompute real next-token distributions + sampled rollouts from a base LM.
// Output: nexttoken.json — a prefix trie per prompt. Each node stores the top-10
// tokens with raw logits and the full-vocab log-sum-exp at each temperature stop,
// so the page can show exact probabilities p = exp(l/T - lse_T).
import { AutoTokenizer, AutoModelForCausalLM, Tensor } from '@huggingface/transformers';
import fs from 'node:fs';

const MODEL = 'onnx-community/Qwen2.5-0.5B';
const TEMPS = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const SAMPLES = 8;
const STEPS = 14;
const TOPK = 10;
const PROMPTS = [
  'The capital of France is',
  'In the garden this morning, I noticed',
  'Once upon a time, a small robot',
  'The best way to learn to code is',
];

const tok = await AutoTokenizer.from_pretrained(MODEL);
const model = await AutoModelForCausalLM.from_pretrained(MODEL, { dtype: 'fp32' });

const cache = new Map(); // key: ids.join(',') -> {logits(top), lse, full(Float32Array)}
async function dist(ids) {
  const key = ids.join(',');
  if (cache.has(key)) return cache.get(key);
  const input_ids = new Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);
  const attention_mask = new Tensor('int64', BigInt64Array.from(ids.map(() => 1n)), [1, ids.length]);
  const out = await model({ input_ids, attention_mask });
  const [, s, v] = out.logits.dims;
  const full = out.logits.data.slice((s - 1) * v, s * v);
  let max = -Infinity, arg = 0;
  for (let i = 0; i < full.length; i++) if (full[i] > max) { max = full[i]; arg = i; }
  const lse = TEMPS.map(T => {
    if (T === 0) return null;
    let z = 0; for (let i = 0; i < full.length; i++) z += Math.exp((full[i] - max) / T);
    return max / T + Math.log(z);
  });
  const order = Array.from(full.keys()).sort((a, b) => full[b] - full[a]).slice(0, TOPK);
  const d = { full, lse, top: order, arg };
  cache.set(key, d);
  return d;
}

function sample(d, T) {
  if (T === 0) return d.arg;
  const ti = TEMPS.indexOf(T);
  const r = Math.random();
  let c = 0;
  for (let i = 0; i < d.full.length; i++) {
    c += Math.exp(d.full[i] / T - d.lse[ti]);
    if (c >= r) return i;
  }
  return d.arg;
}

const r2 = x => Math.round(x * 100) / 100;
const piece = id => tok.decode([id]);

const result = { model: 'Qwen2.5-0.5B (base, not instruction-tuned)', temps: TEMPS, prompts: [] };
for (const prompt of PROMPTS) {
  const base = tok(prompt).input_ids.tolist()[0].map(Number);
  const nodes = []; // {top:[[str,logit]...], lse:[..], kids:{id:nodeIndex}}
  const index = new Map();
  async function nodeFor(ids) {
    const k = ids.join(',');
    if (index.has(k)) return index.get(k);
    const d = await dist(ids);
    const n = { t: d.top.map(i => [piece(i), r2(d.full[i]), i]), l: d.lse.map(x => x === null ? null : r2(x)), k: {} };
    nodes.push(n); index.set(k, nodes.length - 1);
    return nodes.length - 1;
  }
  const rollouts = {};
  for (const T of TEMPS) {
    rollouts[T] = [];
    const n = T === 0 ? 1 : SAMPLES;
    for (let s = 0; s < n; s++) {
      let ids = base.slice();
      let ni = await nodeFor(ids);
      const path = [ni];
      for (let step = 0; step < STEPS; step++) {
        const d = await dist(ids);
        const next = sample(d, T);
        if (next === tok.eos_token_id) break;
        const node = nodes[ni];
        const childIds = ids.concat(next);
        const ci = await nodeFor(childIds);
        // remember the chosen token's logit even if it is outside the top 10
        node.k[next] = [ci, piece(next), r2(d.full[next])];
        ids = childIds; ni = ci; path.push(ci);
      }
      rollouts[T].push(path);
    }
    process.stderr.write(`${prompt} T=${T} nodes=${nodes.length}\n`);
  }
  result.prompts.push({ prompt, nodes, rollouts });
}

// Winograd pronoun probe: which referent does the model pick for "it"?
const probe = {};
for (const adj of ['big', 'small']) {
  const text = `The trophy didn't fit in the suitcase because it was too ${adj}. The thing that was too ${adj} was the`;
  const ids = tok(text).input_ids.tolist()[0].map(Number);
  const d = await dist(ids);
  const idT = tok(' trophy').input_ids.tolist()[0].map(Number)[0];
  const idS = tok(' suitcase').input_ids.tolist()[0].map(Number)[0];
  const pT = Math.exp(d.full[idT] - d.lse[TEMPS.indexOf(1.0)]);
  const pS = Math.exp(d.full[idS] - d.lse[TEMPS.indexOf(1.0)]);
  probe[adj] = { trophy: pT, suitcase: pS, share_trophy: pT / (pT + pS) };
}
result.winograd = probe;

fs.writeFileSync('nexttoken.json', JSON.stringify(result));
console.log(JSON.stringify(probe), fs.statSync('nexttoken.json').size);
