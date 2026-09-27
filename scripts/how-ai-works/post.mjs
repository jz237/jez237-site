import { AutoTokenizer } from '@huggingface/transformers';
import fs from 'node:fs';
const tok = await AutoTokenizer.from_pretrained('onnx-community/Qwen2.5-0.5B');
const d = JSON.parse(fs.readFileSync('nexttoken.json'));
for (const p of d.prompts) {
  const ids = tok(p.prompt).input_ids.tolist()[0].map(Number);
  p.promptIds = ids; p.promptPieces = ids.map(i => tok.decode([i]));
  // text of the greedy + a couple of samples for sanity
  const txt = path => path.slice(0,-1).map((n,i)=>{const e=Object.entries(p.nodes[n].k).find(([,v])=>v[0]===path[i+1]);return e[1][1]}).join('');
  console.log('\n##', p.prompt, p.nodes.length, 'nodes', p.promptPieces);
  for (const T of ['0','0.5','1','2']) console.log(' T='+T, JSON.stringify(txt(p.rollouts[T][0])), '|', JSON.stringify(txt(p.rollouts[T][1]||p.rollouts[T][0])));
}
fs.writeFileSync('nexttoken.final.json', JSON.stringify(d));
console.log(fs.statSync('nexttoken.final.json').size);
