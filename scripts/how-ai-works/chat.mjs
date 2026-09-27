// Base vs instruction-tuned: same model family and size, greedy decoding, real outputs.
import { AutoTokenizer, AutoModelForCausalLM } from '@huggingface/transformers';
import fs from 'node:fs';
const BASE = 'onnx-community/SmolLM2-360M-ONNX', CHAT = 'HuggingFaceTB/SmolLM2-360M-Instruct';
const QUESTIONS = ['What is the capital of France?', 'Write a haiku about rain.', 'What is a token in an AI model?', 'My code says "TypeError: x is undefined". What does that mean?'];
async function run(id, chat, max) {
  const tok = await AutoTokenizer.from_pretrained(id);
  const m = await AutoModelForCausalLM.from_pretrained(id, { dtype: 'fp32' });
  const out = [];
  for (const q of QUESTIONS) {
    const text = chat ? tok.apply_chat_template([{ role: 'user', content: q }], { tokenize: false, add_generation_prompt: true }) : q;
    const inp = tok(text, { add_special_tokens: false });
    const gen = await m.generate({ ...inp, max_new_tokens: max, do_sample: false });
    out.push(tok.decode(gen.tolist()[0].slice(inp.input_ids.dims[1]).map(Number), { skip_special_tokens: true }));
  }
  return out;
}
const base = await run(BASE, false, 60), chat = await run(CHAT, true, 110);
const pairs = QUESTIONS.map((q, i) => ({ q, base: base[i].trimEnd(), chat: chat[i].trim() }));
fs.writeFileSync('chat.json', JSON.stringify({ base: 'SmolLM2-360M (base)', chat: 'SmolLM2-360M-Instruct (same model after chat training)', pairs }));
for (const p of pairs) console.log('\n###', p.q, '\nBASE:', JSON.stringify(p.base), '\nCHAT:', JSON.stringify(p.chat));
