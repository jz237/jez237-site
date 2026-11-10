/* How AI Works — the sample text, the BPE tokenizer trained from it, and the
   tiny model's vocabulary. DOM-free: loaded by the page and by the Node script
   that trains the shipped weights (tools/build-weights.js). Changing any text
   here changes the token ids, so re-run that script afterwards. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LabData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* The little world the tiny model learns. Lower case, one sentence each. */
  const SENTENCES = (
    'the cat sat on the mat|the dog sat on the mat|the mouse sat on the mat|the robot sat on the mat|the cat purred on the mat|' +
    'the cat sat on the warm sofa|the cat sat on the fence|the cat sat in the sun|' +
    'the cat slept on the mat|the cat slept on the sofa|the cat slept in the sun|the cat slept in the warm garden|' +
    'the cat chased the mouse|the cat chased the bird|the cat chased the ball|the cat ran in the garden|' +
    'the cat ran under the sofa|the cat watched the bird|the cat watched the mouse|the cat purred on the warm mat|' +
    'the dog sat on the rug|the dog sat on the floor|the dog sat in the garden|the dog slept on the rug|' +
    'the dog slept on the sofa|the dog chased the cat|the dog chased the ball|the dog ran in the garden|' +
    'the dog ran in the park|the dog watched the cat|the dog barked at the bird|the dog barked at the cat|' +
    'the mouse ran under the sofa|the mouse ran under the fence|the mouse ate the cheese|the mouse watched the cat|' +
    'the bird sat on the fence|the bird sat on the roof|the bird sang in the garden|' +
    'the bird sang in the morning|the bird ate the seeds|the bird watched the cat|' +
    'the robot sat on the floor|the robot read the book|the robot read the prompt|the robot watered the garden|' +
    'the robot watered the plants|the robot learned a new word|' +
    'the robot predicted the next word|the robot watched the gardener|the model read the prompt|the model read the text|' +
    'the model predicted the next word|the model predicted the next token|the model learned from the text|' +
    'the model learned a new word|the model was trained on the text|' +
    'the gardener watered the plants|the gardener watered the garden|the gardener planted the seeds|' +
    'the gardener planted the seeds in the garden|the gardener planted the flowers in the warm soil|' +
    'the gardener sat in the garden|the gardener sat in the sun|the gardener watched the bird|' +
    'the gardener read the book in the garden|the gardener ate the cheese|' +
    'the farmer planted the seeds|the farmer watered the plants|the farmer sat on the fence|the farmer sat in the sun|' +
    'the farmer watched the dog|the farmer read the book|the farmer ate the bread|' +
    'the plants grew in the sun|the plants grew in the garden|the plants grew in the warm soil|the seeds grew in the warm soil|' +
    'the seeds grew in the garden|the flowers grew in the garden|the flowers grew in the sun|the sun warmed the garden|' +
    'the sun warmed the soil|the sun warmed the roof|the rain watered the garden|the rain watered the plants|' +
    'the rain fell on the roof|the rain fell on the garden|the rain fell in the morning|the rain fell on the warm soil|' +
    // who "it / she / he" is depends on a word several steps back
    'the cat was tired so it slept on the sofa|the cat was hungry so it chased the mouse|the cat was happy so it purred|' +
    'the cat was curious so it watched the bird|the dog was hungry so it ate the food|the dog was tired so it slept on the rug|' +
    'the dog was happy so it ran in the park|the dog was curious so it watched the cat|' +
    'the mouse was hungry so it ate the cheese|the mouse was tired so it slept under the sofa|' +
    'the mouse was happy so it ran in the garden|the mouse was curious so it watched the cat|' +
    'the bird was happy so it sang|the bird was tired so it sat on the fence|the bird was hungry so it ate the seeds|' +
    'the bird was curious so it watched the gardener|the robot was curious so it read the book|the robot was happy so it sang|' +
    'the robot was tired so it sat on the floor|the model was curious so it read the book|' +
    'the gardener was tired so she sat on the fence|the gardener was happy so she sang|the gardener was curious so she read the book|' +
    'the farmer was tired so he sat on the fence|the farmer was happy so he sang|the farmer was hungry so he ate the bread|' +
    'the farmer was curious so he watched the bird|' +
    'the cat slept on the sofa because it was tired|the dog ate the food because it was hungry|the bird sang because it was happy|' +
    'the gardener sat in the garden because she was tired|the gardener sang because she was happy|' +
    'the farmer sat on the fence because he was tired|the farmer sang because he was happy|the mouse ate the cheese because it was hungry'
  ).split('|');

  /* Never shown in pre-training. Used by the fine-tuning demo and as a word the
     shipped model has a token for but has learned nothing about. */
  const FINETUNE = (
    'the dragon sat on the roof|the dragon chased the farmer|the dragon slept in the sun|the dragon ate the cheese|' +
    'the dragon was hungry so it ate the bread|the dragon was tired so it slept on the roof|the dragon watched the gardener|' +
    'the dragon ran in the park|the dragon was happy so it sang|the dragon sat on the fence'
  ).split('|');

  const PROSE =
    'A language model is a machine for predicting the next token. It reads the text so far, and it gives every token in its ' +
    'vocabulary a score. Training is the long process of adjusting billions of numbers until those predictions become useful. ' +
    'The model does not store sentences. It stores patterns, and the patterns are spread across the weights. ' +
    'Tokens are the pieces of text the model works with. Some tokens are whole words, some are parts of words, and some are ' +
    'single characters or punctuation. Common words usually become one token, while unusual words are broken into smaller pieces. ' +
    'The tokenizer learns which pieces to keep by counting which pairs of characters appear together most often, then merging them. ' +
    'Every token is turned into a list of numbers called an embedding. Words with related meanings end up with similar numbers. ' +
    'Attention lets each token look back at the other tokens and gather the information that matters for the prediction. ' +
    'Layers repeat this process again and again, and each layer makes the representation a little more useful. ' +
    'At the end the model produces probabilities, and one token is chosen. Then the whole process runs again for the next token. ' +
    'An agent is a model running in a loop with tools. It can read files, search the web, run commands, and check its own work. ' +
    'The context window is everything the model can see right now. When the conversation gets longer than the window, older ' +
    'messages are summarized or dropped. Good prompts are clear about the goal, the constraints, and what a finished answer ' +
    'should look like. People are learning to work with these systems, and the systems are being trained to work better with ' +
    'people. Understanding how the pieces fit together makes the technology less mysterious and more interesting. ' +
    'When you are writing, thinking, reading, building, testing, or asking questions, the same simple loop is running underneath: ' +
    'predict the next token, add it to the text, and continue. Nothing is looked up. Everything is generated one piece at a time. ' +
    'What makes it powerful is the scale of the training and the quality of the information that the attention layers can bring ' +
    'together. There is no single place where an answer lives. This explanation was written to be read by people who are curious ' +
    'about the technology and want an understandable picture of what is actually happening inside these remarkable machines.';

  /* ---------- byte-pair encoding, trained right here ---------- */
  const SP = '▁'; // "a space came before this piece"; drawn as a dot
  const MERGES = 520;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1) + '.';
  const world = SENTENCES.map(s => s + '.').join(' ') + ' ' + FINETUNE.map(s => s + '.').join(' ');
  const trainText = PROSE + ' ' + PROSE.toLowerCase() + ' ' + world + ' ' + world + ' ' + world + ' ' + SENTENCES.map(cap).join(' ');
  // words / numbers / single symbols; a piece that follows whitespace (or starts the text) carries the marker
  function pre(t) {
    const out = [], re = /(\s*)([A-Za-z']+|[0-9]+|[^\sA-Za-z0-9])/g;
    let m;
    while ((m = re.exec(t))) out.push((m[1] || m.index === 0 ? [SP] : []).concat(Array.from(m[2])));
    return out;
  }
  const merges = [], rank = new Map();
  (function train() {
    const freq = new Map();
    pre(trainText).forEach(w => { const k = w.join('\u0001'); freq.set(k, (freq.get(k) || 0) + 1); });
    const words = Array.from(freq, e => ({ s: e[0].split('\u0001'), c: e[1] }));
    for (let m = 0; m < MERGES; m++) {
      const pairs = new Map();
      for (const w of words) for (let i = 0; i < w.s.length - 1; i++) {
        const k = w.s[i] + '\u0001' + w.s[i + 1];
        pairs.set(k, (pairs.get(k) || 0) + w.c);
      }
      let best = null, bc = 1;
      pairs.forEach((c, k) => { if (c > bc) { bc = c; best = k; } });
      if (!best) break;
      const ab = best.split('\u0001');
      rank.set(best, merges.length);
      merges.push({ a: ab[0], b: ab[1], n: bc });
      for (const w of words) {
        const s = w.s, o = [];
        for (let i = 0; i < s.length; i++) {
          if (i < s.length - 1 && s[i] === ab[0] && s[i + 1] === ab[1]) { o.push(ab[0] + ab[1]); i++; }
          else o.push(s[i]);
        }
        w.s = o;
      }
    }
  })();
  const idOf = new Map();
  merges.forEach((m, i) => idOf.set(m.a + m.b, 256 + i));
  function id(sym) {
    if (idOf.has(sym)) return idOf.get(sym);
    if (sym === SP) return 32;
    const cp = sym.codePointAt(0);
    return cp < 256 ? cp : 1000 + (cp % 9000);
  }
  // encode(text) -> { start: [[sym...] per word], steps: [{rank, a, b, hits, words}] }
  // Each step applies the single best-ranked learned merge that still fits anywhere.
  function encode(input) {
    let ws = pre(input);
    const start = ws.map(w => w.slice()), steps = [];
    for (let guard = 0; guard < 4000; guard++) {
      let best = Infinity, key = null;
      for (const s of ws) for (let i = 0; i < s.length - 1; i++) {
        const r = rank.get(s[i] + '\u0001' + s[i + 1]);
        if (r != null && r < best) { best = r; key = [s[i], s[i + 1]]; }
      }
      if (!key) break;
      let hits = 0;
      ws = ws.map(s => {
        const o = [];
        for (let i = 0; i < s.length; i++) {
          if (i < s.length - 1 && s[i] === key[0] && s[i + 1] === key[1]) { o.push(key[0] + key[1]); i++; hits++; }
          else o.push(s[i]);
        }
        return o;
      });
      steps.push({ rank: best, a: key[0], b: key[1], hits, words: ws.map(w => w.slice()) });
    }
    return { start, steps };
  }
  function symbols(text) {
    const e = encode(text), ws = e.steps.length ? e.steps[e.steps.length - 1].words : e.start;
    return [].concat.apply([], ws);
  }
  const show = s => s.replace(SP, '·');
  const bpe = { SP, merges, encode, symbols, id, show, trainedOn: trainText.length };

  /* ---------- the tiny model's vocabulary ----------
     0 = start-of-text, 1 = "unknown" (every piece the model never met), then
     each distinct token that appears in the sample sentences. */
  const BOS = 0, UNK = 1;
  const syms = ['<start>', '<unknown>'], mid = new Map();
  SENTENCES.concat(FINETUNE).forEach(s => symbols(s + '.').forEach(t => { if (!mid.has(t)) { mid.set(t, syms.length); syms.push(t); } }));
  // text -> [{s, id, m, known}] : BPE pieces with both their tokenizer id and model id
  function tokenize(text) {
    return symbols(String(text).toLowerCase()).map(s => ({ s, id: id(s), m: mid.has(s) ? mid.get(s) : UNK, known: mid.has(s) }));
  }
  const seq = s => [BOS].concat(tokenize(s + '.').map(t => t.m));
  const END = mid.get('.');
  let h = 2166136261;
  const sig = syms.join('\u0001') + '|' + merges.length;
  for (let i = 0; i < sig.length; i++) h = Math.imul(h ^ sig.charCodeAt(i), 16777619);

  return {
    SENTENCES, FINETUNE, PROSE, bpe, tokenize,
    vocab: { BOS, UNK, END, size: syms.length, syms, has: s => mid.has(s), tokId: m => (m < 2 ? m : id(syms[m])), label: m => (m === BOS ? '<start>' : m === UNK ? '<unknown>' : show(syms[m])), word: m => (m < 2 ? syms[m] : syms[m].replace(SP, '')) },
    corpus: SENTENCES.map(seq), finetune: FINETUNE.map(seq),
    signature: (h >>> 0).toString(36),
    // the shipped model: small enough to train in a browser tab in a few seconds
    config: { V: syms.length, T: 16, d: 24, H: 2, L: 2, F: 64 }
  };
});
