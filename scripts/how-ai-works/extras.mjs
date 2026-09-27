// Extra real-model data for How AI Works (run after nexttoken.mjs + post.mjs + post2.mjs):
//  1. "pick the first token": greedy continuations for each of the root's top-10 tokens,
//     appended to the nexttoken.final.json trie (p.picks = {tokenId: path}).
//  2. maths.json: the base model's greedy answers to a few sums.
//  3. chat.json: the same questions to the base model vs the instruction-tuned model.
import { AutoTokenizer, AutoModelForCausalLM, Tensor } from '@huggingface/transformers';
import fs from 'node:fs';

const BASE = 'onnx-community/Qwen2.5-0.5B';
const CHAT = 'onnx-community/Qwen2.5-0.5B-Instruct';
const PICK_STEPS = 13;

const tok = await AutoTokenizer.from_pretrained(BASE);
const model = await AutoModelForCausalLM.from_pretrained(BASE, { dtype: 'fp32' });
const d = JSON.parse(fs.readFileSync('nexttoken.final.json'));
const TEMPS = d.temps;
const r2 = x => Math.round(x * 100) / 100;
const clean = s => s.replace(/�+$/, '');

async function logitsFor(m, ids) {
  const input_ids = new Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);
  const attention_mask = new Tensor('int64', BigInt64Array.from(ids.map(() => 1n)), [1, ids.length]);
  const out = await m({ input_ids, attention_mask });
  const [, s, v] = out.logits.dims;
  return out.logits.data.slice((s - 1) * v, s * v);
}
function summarize(full) {
  let max = -Infinity, arg = 0;
  for (let i = 0; i < full.length; i++) if (full[i] > max) { max = full[i]; arg = i; }
  const lse = TEMPS.map(T => { if (T === 0) return null; let z = 0; for (let i = 0; i < full.length; i++) z += Math.exp((full[i] - max) / T); return max / T + Math.log(z); });
  const top = [];
  for (let i = 0; i < full.length; i++) { if (top.length < 10 || full[i] > full[top[top.length - 1]]) { top.push(i); top.sort((a, b) => full[b] - full[a]); if (top.length > 10) top.pop(); } }
  return { max, arg, lse, top };
}

// ---- 1. picks ----
for (const p of d.prompts) {
  const ids = new Map([[0, p.promptIds]]);
  const text = new Map([[0, clean(tok.decode(p.promptIds))]]);
  const byKey = new Map([[p.promptIds.join(','), 0]]);
  const q = [0];
  while (q.length) {
    const n = q.shift();
    for (const [id, e] of Object.entries(p.nodes[n].k)) {
      if (ids.has(e[0])) continue;
      const c = ids.get(n).concat(Number(id));
      ids.set(e[0], c); byKey.set(c.join(','), e[0]); text.set(e[0], clean(tok.decode(c))); q.push(e[0]);
    }
  }
  async function nodeFor(seq) {
    const key = seq.join(',');
    if (byKey.has(key)) return byKey.get(key);
    const full = await logitsFor(model, seq);
    const s = summarize(full);
    p.nodes.push({ t: s.top.map(i => [tok.decode([i]), r2(full[i]), i]), l: s.lse.map(x => (x === null ? null : r2(x))), k: {} });
    const ni = p.nodes.length - 1;
    byKey.set(key, ni); ids.set(ni, seq); text.set(ni, clean(tok.decode(seq)));
    return ni;
  }
  p.picks = {};
  const root = p.nodes[0];
  for (const [, logit, id] of root.t) {
    let seq = p.promptIds.concat(id);
    let ni = await nodeFor(seq);
    if (!root.k[id]) root.k[id] = [ni, text.get(ni).slice(text.get(0).length), logit];
    const path = [0, ni];
    for (let s = 0; s < PICK_STEPS; s++) {
      const full = await logitsFor(model, seq);
      const { arg } = summarize(full);
      if (arg === tok.eos_token_id) break;
      const parent = ni;
      seq = seq.concat(arg);
      ni = await nodeFor(seq);
      if (!p.nodes[parent].k[arg]) p.nodes[parent].k[arg] = [ni, text.get(ni).slice(text.get(parent).length), r2(full[arg])];
      path.push(ni);
    }
    p.picks[id] = path;
  }
  process.stderr.write(`picks done: ${p.prompt} nodes=${p.nodes.length}\n`);
}
fs.writeFileSync('nexttoken.v2.json', JSON.stringify(d));

// ---- 2. maths ----
async function greedy(m, t, ids, max, stopNewline = false) {
  let seq = ids.slice(); const start = seq.length;
  for (let i = 0; i < max; i++) {
    const { arg } = summarize(await logitsFor(m, seq));
    if (arg === t.eos_token_id || (t.im_end_id !== undefined && arg === t.im_end_id)) break;
    seq.push(arg);
    if (stopNewline && t.decode(seq.slice(start)).includes('\n')) break;
  }
  return t.decode(seq.slice(start), { skip_special_tokens: true });
}
const SUMS = [['12 + 7', 19], ['347 + 589', 936], ['4821 + 3765', 8586], ['123456789 + 987654321', 1111111110], ['48 * 27', 1296], ['9876 * 5432', 53646432]];
const maths = [];
for (const [expr, answer] of SUMS) {
  const out = await greedy(model, tok, tok(`${expr} = `).input_ids.tolist()[0].map(Number), 14, true);
  const guess = (out.match(/-?[\d,]+/) || [''])[0].replace(/,/g, '');
  maths.push({ expr, answer, raw: out.trim(), guess, right: Number(guess) === answer });
}
fs.writeFileSync('maths.json', JSON.stringify({ model: 'Qwen2.5-0.5B (base)', sums: maths }));
console.log(JSON.stringify(maths));

// ---- 3. base vs chat ----
const QUESTIONS = ['What is the capital of France?', 'Write a haiku about rain.', 'What is a token in an AI model?', 'My code says "TypeError: x is undefined". What does that mean?'];
const chatTok = await AutoTokenizer.from_pretrained(CHAT);
const chatModel = await AutoModelForCausalLM.from_pretrained(CHAT, { dtype: 'fp32' });
chatTok.im_end_id = chatTok.encode('<|im_end|>', { add_special_tokens: false })[0];
const pairs = [];
for (const qn of QUESTIONS) {
  const base = await greedy(model, tok, tok(qn).input_ids.tolist()[0].map(Number), 48);
  const prompt = chatTok.apply_chat_template([{ role: 'user', content: qn }], { tokenize: false, add_generation_prompt: true });
  const chat = await greedy(chatModel, chatTok, chatTok(prompt, { add_special_tokens: false }).input_ids.tolist()[0].map(Number), 90);
  pairs.push({ q: qn, base: base.trimEnd(), chat: chat.trim() });
  process.stderr.write(`chat pair done: ${qn}\n`);
}
fs.writeFileSync('chat.json', JSON.stringify({ base: 'Qwen2.5-0.5B (base)', chat: 'Qwen2.5-0.5B-Instruct (same size, instruction-tuned)', pairs }));
console.log(JSON.stringify(pairs, null, 1));
