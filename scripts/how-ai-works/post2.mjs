import { AutoTokenizer } from '@huggingface/transformers';
import fs from 'node:fs';
const tok = await AutoTokenizer.from_pretrained('onnx-community/Qwen2.5-0.5B');
const d = JSON.parse(fs.readFileSync('nexttoken.final.json'));
const clean = s => s.replace(/�+$/, '');
let fixed = 0;
for (const p of d.prompts) {
  const ids = new Map([[0, p.promptIds]]);
  const text = new Map([[0, clean(tok.decode(p.promptIds))]]);
  const queue = [0];
  while (queue.length) {
    const n = queue.shift();
    for (const [id, e] of Object.entries(p.nodes[n].k)) {
      const ci = e[0];
      if (ids.has(ci)) continue;
      const cids = ids.get(n).concat(Number(id));
      ids.set(ci, cids);
      const t = clean(tok.decode(cids));
      text.set(ci, t);
      const piece = t.startsWith(text.get(n)) ? t.slice(text.get(n).length) : e[1];
      if (piece !== e[1]) fixed++;
      e[1] = piece;
      queue.push(ci);
    }
  }
}
fs.writeFileSync('nexttoken.final.json', JSON.stringify(d));
console.log('fixed', fixed);
