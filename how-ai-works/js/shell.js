/* Page shell: hero animation, the shared prompt bar, chapter rail + progress,
   the phone accordion, motion controls, predict-first questions, and the
   lighter chapters (systems, stack builder, failure modes, glossary). */
(function () {
  'use strict';
  const L = Lab, C = L.C, ai = L.ai, V = ai.V;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ---------- the shared prompt ---------- */
  const pIn = L.$('#promptInput'), rIn = L.$('#railPrompt');
  if (pIn) {
    const chips = L.$('#promptTokens'), hint = L.$('#promptHint');
    const paint = p => {
      [pIn, rIn].forEach(i => { if (i && document.activeElement !== i) i.value = p.text; });
      chips.innerHTML = '<span class="tok raw marker">start</span>' + p.pieces.map(t =>
        '<span class="tok ' + (t.known ? 'c' + (t.id % 6) : 'unk') + '" title="' + (t.known ? 'token id ' + t.id : 'not in this model’s vocabulary: treated as “unknown”') + '">' + L.esc(L.bpe.show(t.s)) + '</span>').join('');
      const bad = p.unknown.length;
      hint.innerHTML = (bad ? '<span class="unk-note">' + bad + ' piece' + (bad > 1 ? 's are' : ' is') + ' outside this model’s tiny world (outlined in red). It will see ' + (bad > 1 ? 'each' : 'it') + ' as one “unknown” token and guess anyway — which is its own lesson.</span> ' : '') +
        (p.cut ? 'Only the first ' + p.pieces.length + ' tokens are used: this model’s window is ' + ai.T + ' tokens and it needs room to write. ' : '') +
        (!bad && !p.cut ? 'Every piece is in the model’s vocabulary. ' : '') +
        'This is a real language model, but a tiny one: ' + ai.model.size.toLocaleString() + ' weights and a ' + V.size + '-token world of cats, gardeners and robots.';
      L.$$('[data-ptext]').forEach(b => b.classList.toggle('active', b.dataset.ptext === p.text));
      L.$$('.prompt-echo').forEach(e => { e.textContent = p.text; });
    };
    const apply = src => L.setPrompt(src.value);
    [pIn, rIn].forEach(i => {
      if (!i) return;
      i.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); apply(i); i.blur(); } });
      i.addEventListener('change', () => apply(i));
    });
    L.$('#promptGo').addEventListener('click', () => apply(pIn));
    L.$$('[data-ptext]').forEach(b => b.addEventListener('click', () => L.setPrompt(b.dataset.ptext)));
    const vc = L.$('#promptVocab');
    if (vc) {
      const words = [];
      for (let m = 2; m < V.size; m++) if (m !== V.END) words.push(ai.word(m));
      L.$('#promptVocabCount').textContent = words.length;
      vc.innerHTML = words.sort().map(w => '<button type="button" class="concept-chip" data-vw="' + L.esc(w) + '">' + L.esc(w) + '</button>').join('');
      vc.addEventListener('click', ev => { const w = ev.target.dataset && ev.target.dataset.vw; if (w) L.setPrompt(L.prompt.text + ' ' + w); });
    }
    L.onPrompt(paint);
    paint(L.prompt);
  }

  const chapters = L.$$('.chapter');   // navigation itself lives in chapters.js

  /* ---------- count-up figures ---------- */
  const counts = L.$$('[data-count]');
  if (counts.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target, to = Number(el.dataset.count), t0 = performance.now(), dur = L.reduce ? 1 : 1400;
      (function tick(now) {
        const p = L.clamp((now - t0) / dur);
        el.textContent = Math.round(to * L.ease.out(p)).toLocaleString() + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }), { threshold: 0.6 });
    counts.forEach(c => io.observe(c));
  }

  /* ---------- predict first, then watch ---------- */
  const mids = t => ai.tokenize(t).map(x => x.m), tok = w => V.syms.indexOf(L.bpe.SP + w);
  const PREDICT = {
    journey: { q: 'A model has written “the cat sat on the”. How much of the rest does it produce in its next step?', o: ['The rest of the sentence', 'One token', 'A whole paragraph'], a: 1, why: 'One token. Then it reads everything again, including what it just wrote, and produces one more. Watch the loop below.' },
    tokens: { q: 'Which costs more tokens: the six words “the cat sat on the mat”, or the single word “Supercalifragilistic”?', o: ['The six-word sentence', 'The one long word', 'About the same'],
      a: () => { const a = L.bpe.symbols('the cat sat on the mat').length, b = L.bpe.symbols('Supercalifragilistic').length; return b > a * 1.3 ? 1 : a > b * 1.3 ? 0 : 2; },
      why: () => 'With this tokenizer the sentence is ' + L.bpe.symbols('the cat sat on the mat').length + ' tokens and the single word is ' + L.bpe.symbols('Supercalifragilistic').length + '. Common words collapse to one piece; a rare word shatters.' },
    embeddings: { q: 'In the map this model learned for itself, which of these will sit closest to “cat”?', o: ['mat (it rhymes)', 'dog (it is used the same way)', 'the (it is always next to it)'],
      a: () => { const e = ai.emb(tok('cat')), s = ['mat', 'dog', 'the'].map(w => ai.cos(e, ai.emb(tok(w)))); return s.indexOf(Math.max.apply(null, s)); },
      why: i => (i === 1 ? '“dog”. ' : 'With the current weights it is option ' + (i + 1) + ', which is unusual — normally it is “dog”. ') + 'Embeddings group tokens by how they are used in sentences, not by spelling, sound, or which words stand beside them.' },
    attention: { q: 'In “the gardener was tired so ___”, which earlier word must the model look at to choose between she, he and it?', o: ['tired', 'gardener', 'so'], a: 1, why: '“gardener”. It is four tokens back, and the only mechanism that can fetch it is attention. Try that prompt below and look at layer 2.' },
    layers: { q: 'Before any layer has run, what is the model’s best guess for the word after your prompt?', o: ['Already the right answer', 'It just echoes the last word', 'Nothing at all'],
      a: () => { const t = ai.trace(L.prompt.mids), l0 = Array.from(t.lens[0]), last = ai.window(L.prompt.mids).slice(-1)[0]; return l0.indexOf(Math.max.apply(null, l0)) === last ? 1 : 0; },
      why: 'At depth 0 a position contains only its own embedding, so decoding it mostly gives that same token back. The answer is built up layer by layer.' },
    sampling: { q: 'You ask the same question twice with normal settings. Do you get the same answer?', o: ['Always', 'Not necessarily', 'Never'], a: 1, why: 'Not necessarily. The model outputs odds and a sampler rolls dice. When one token holds nearly all the probability you will get it every time; when several are close, you will not.' },
    training: { q: 'Who types in the facts a language model knows?', o: ['Its engineers', 'Nobody', 'Its users'], a: 1, why: 'Nobody. Engineers write the training loop; the knowledge is whatever is left in the weights after billions of small nudges toward better next-token predictions.' },
    chat: { q: 'When you send your fifth message in a chat, what does the model receive?', o: ['Just the new message', 'The whole conversation again, as one string', 'A summary of the earlier turns'], a: 1, why: 'The whole conversation, every time. The model has no memory between requests; the app rebuilds the full string and sends it again.' },
    context: { q: 'A preference you stated 40 messages ago has scrolled out of the window. What happens when it matters?', o: ['The model asks you to repeat it', 'It answers anyway, without it', 'It searches its memory for it'], a: 1, why: 'It answers anyway. From the model’s side there is no gap to notice — the string it was given simply does not contain that fact.' },
    prompts: { q: 'What does adding detail to a prompt actually do?', o: ['Makes the model try harder', 'Rules out other plausible replies', 'Unlocks hidden knowledge'], a: 1, why: 'It rules things out. The model is the same; the set of likely continuations shrinks.' },
    agents: { q: 'When an AI agent “runs a command”, what does the model itself produce?', o: ['The command’s output', 'Text asking for the command to be run', 'Machine code'], a: 1, why: 'Text. The model writes a request in a fixed format; the program around it runs the command and pastes the result back into the context.' },
    systems: { q: 'For a private diary helper, which question matters most?', o: ['Which model is biggest?', 'Where is my text processed?', 'Can it make images?'], a: 1, why: 'Where the text goes. A cloud model sends your words to someone else’s computer; a local model does not.' },
    failure: { q: 'A model states a wrong fact with total confidence. What most likely happened?', o: ['It lied on purpose', 'Something malfunctioned', 'It sampled a plausible token with nothing solid behind it'], a: 2, why: 'Normal operation. The sampler always picks some token, and the voice does not change when the support is thin.' }
  };
  const saved = store.get('lab-predict', {});
  const score = () => {
    const ids = Object.keys(saved), el = L.$('#predictScore');
    if (el) el.textContent = ids.length ? ids.filter(k => saved[k].ok).length + ' of ' + ids.length + ' predictions right' : 'No predictions made yet';
  };
  chapters.forEach(c => {
    const P = PREDICT[c.id], body = c.querySelector('.lab-card-body');
    if (!P || !body) return;
    const fb = L.h('p', { class: 'predict-fb', 'aria-live': 'polite' }), opts = L.h('div', { class: 'predict-opts' });
    const box = L.h('div', { class: 'predict' }, [L.h('span', { class: 'predict-tag', text: 'Predict first' }), L.h('p', { class: 'predict-q', text: P.q }), opts, fb]);
    const reveal = (pick, remember) => {
      const ans = typeof P.a === 'function' ? P.a() : P.a, ok = pick === ans;
      Array.from(opts.children).forEach((b, i) => { b.disabled = true; b.classList.toggle('right', i === ans); b.classList.toggle('wrong', i === pick && !ok); });
      fb.innerHTML = '<strong>' + (ok ? 'Right.' : 'Not quite.') + '</strong> ' + (typeof P.why === 'function' ? P.why(ans) : P.why);
      box.classList.add('done');
      if (remember) { saved[c.id] = { pick, ok }; store.set('lab-predict', saved); score(); }
    };
    P.o.forEach((t, i) => opts.append(L.h('button', { class: 'lab-button', type: 'button', text: t, onclick: () => reveal(i, true) })));
    body.insertBefore(box, body.firstChild);
    if (saved[c.id]) reveal(saved[c.id].pick, false);
  });
  const ps = L.$('#predictReset');
  if (ps) ps.addEventListener('click', () => { store.set('lab-predict', {}); location.reload(); });
  score();

  /* ---------- systems: where does your text go? ---------- */
  const JOBS = {
    journal: [0, 'Local model', 'A private journaling helper should stay on your machine. A local model keeps every word offline — no service ever sees it. A cloud model would work, but it sends your private writing to someone else’s computer.'],
    bug: [1, 'Cloud model', 'A gnarly bug benefits from the strongest reasoning available, and the largest models live in data centres. Your text makes a round trip; nothing acts on your machine.'],
    site: [2, 'Agent', 'Updating a website end to end means reading files, editing code, checking in a browser, and publishing — a loop of actions with tools, not a single answer. That is agent work.'],
    thumb: [3, 'Media model', 'A thumbnail is pixels, not prose. Words go in, and an image model generates the actual picture. A text model can only describe what the thumbnail should look like.']
  };
  const sysSvg = L.$('#sysDiagram');
  function diagram(kind) {
    if (!sysSvg) return;
    const box = (x, y, w, h, t, col, on) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="' + (on ? L.rgba(col, 0.16) : 'rgba(255,255,255,0.03)') + '" stroke="' + L.rgba(col, on ? 0.9 : 0.3) + '" stroke-width="' + (on ? 2 : 1) + '"/><text x="' + (x + w / 2) + '" y="' + (y + 18) + '" class="sd-t" fill="' + (on ? '#fff' : '#6f8da3') + '">' + t + '</text>';
    const chip = (x, y, on) => '<rect x="' + (x - 22) + '" y="' + (y - 14) + '" width="44" height="28" rx="6" fill="' + (on ? C.gold : 'rgba(255,255,255,0.08)') + '"/><text x="' + x + '" y="' + (y + 4) + '" class="sd-m" fill="' + (on ? '#10202b' : '#6f8da3') + '">model</text>';
    const pkt = (path, dur, col, sq, begin) => '<path d="' + path + '" fill="none" stroke="' + L.rgba(col, 0.35) + '" stroke-width="1.5" stroke-dasharray="4 5"/>' +
      (L.reduce ? '' : (sq ? '<rect x="-7" y="-7" width="14" height="14" rx="3" fill="' + col + '">' : '<circle r="6" fill="' + col + '">') + '<animateMotion dur="' + dur + 's" begin="' + (begin || 0) + 's" repeatCount="indefinite" path="' + path + '"/>' + (sq ? '</rect>' : '</circle>'));
    const local = kind === 'journal', agent = kind === 'site', media = kind === 'thumb';
    let s = box(20, 30, 200, 130, 'your device', C.green, true) + box(420, 30, 200, 130, 'data centre', C.cyan, !local) +
      box(250, 118, 140, 54, 'tools', C.violet, agent) + '<text x="320" y="158" class="sd-m" fill="' + (agent ? '#cfc6ff' : '#6f8da3') + '">files · web · commands</text>';
    s += '<text x="120" y="150" class="sd-m" fill="#9fb8c9">you type here</text>';
    if (local) s += chip(160, 96, true) + pkt('M70 96 H138 M138 96 H70', 2.2, C.green) + '<text x="320" y="72" class="sd-m" fill="#84e37a">nothing leaves the device</text>';
    else {
      s += chip(520, 96, true) + pkt('M70 86 C200 40 380 40 498 86', 2.4, C.cyan) + pkt('M498 106 C380 150 200 150 70 106', 2.4, media ? C.orange : C.gold, media, 1.2);
      if (agent) s += pkt('M500 110 C470 150 420 150 390 146', 1.6, C.violet, false, 0.3) + pkt('M250 146 C180 150 140 140 110 120', 1.6, C.violet, false, 0.9);
      s += '<text x="320" y="34" class="sd-m" fill="#39cfff">your words travel out →</text><text x="320" y="' + (agent ? 108 : 150) + '" class="sd-m" fill="' + (media ? '#ffb060' : '#e6bd67') + '">← ' + (media ? 'pixels come back' : agent ? 'tool requests' : 'the reply comes back') + '</text>';
    }
    sysSvg.innerHTML = s;
  }
  L.$$('[data-job]').forEach(btn => btn.addEventListener('click', () => {
    const j = JOBS[btn.dataset.job];
    L.$$('[data-job]').forEach(b => b.classList.toggle('active', b === btn));
    L.$$('.system-tile').forEach((el, i) => el.classList.toggle('active', i === j[0]));
    L.$('#systemNote').innerHTML = '<strong>Best fit: ' + j[1] + '.</strong> ' + j[2];
    diagram(btn.dataset.job);
  }));
  diagram('bug');

  /* ---------- build an agent stack ---------- */
  const LAYERS = [
    ['model', 'Reasoning model', 'Turns instructions and context into next actions or answers.', C.cyan, 2, 1, 1],
    ['context', 'Context window', 'Carries the current task, visible chat, files, and constraints.', C.green, 2, 1, 1],
    ['tools', 'Tools', 'Lets the agent inspect files, browse, run commands, or create media.', C.violet, 3, 3, 2],
    ['memory', 'Memory', 'Persists preferences, facts, and workflow lessons across sessions.', C.gold, 2, 2, 2],
    ['approvals', 'Approvals', 'Adds checkpoints for destructive, public, credential, or service actions.', C.orange, 1, -2, 3],
    ['verification', 'Verification', 'Checks results with tests, screenshots, scans, or source comparisons.', C.rose, 2, -2, 2]
  ];
  const optsEl = L.$('#builderOptions');
  if (optsEl) {
    optsEl.innerHTML = LAYERS.map(l => '<label class="builder-option"><input id="stack-' + l[0] + '" type="checkbox" checked><span><strong>' + l[1] + '</strong><span>' + l[2] + '</span></span></label>').join('');
    let prev = new Set(LAYERS.map(l => l[0]));
    const gauge = (id, v, max) => { L.$('#' + id).textContent = v; L.$('#' + id + 'Bar').style.width = (L.clamp(v / max) * 100) + '%'; };
    const renderStack = () => {
      const sel = LAYERS.filter(l => L.$('#stack-' + l[0]).checked), has = k => sel.some(l => l[0] === k);
      L.$('#stackVisual').innerHTML = sel.length
        ? sel.slice().reverse().map(l => '<div class="stack-layer' + (prev.has(l[0]) ? '' : ' in') + '" style="--layer-color:' + l[3] + '"><strong>' + l[1] + '</strong><span>' + l[2] + '</span></div>').join('')
        : '<div class="stack-layer"><strong>Empty</strong><span>Nothing here can do anything yet.</span></div>';
      prev = new Set(sel.map(l => l[0]));
      gauge('builderCapability', sel.reduce((s, l) => s + l[4], 0), 12);
      gauge('builderRisk', Math.max(0, sel.reduce((s, l) => s + l[5], 0)), 7);
      gauge('builderOversight', sel.reduce((s, l) => s + l[6], 0), 11);
      L.$('#builderSummary').textContent = !has('model') ? 'Without a model there is nothing to do the reasoning. Everything else on the list is scaffolding around it.'
        : has('tools') && has('verification') && has('approvals') ? 'The strongest practical setup: tools provide evidence, verification checks the result, and approvals keep risky actions bounded.'
          : has('tools') && !has('approvals') ? 'Powerful but risky: tools let the agent act, and with no approvals nothing stands between a wrong guess and a destructive or public action.'
            : has('tools') && !has('verification') ? 'Useful but less dependable: the agent can inspect and act, but nothing makes it prove the result worked.'
              : !has('tools') && has('verification') ? 'Conservative: it can reason and review, but with no tools it cannot inspect current files or live state.'
                : 'This stack can answer questions from training and whatever you paste in, and nothing more.';
    };
    LAYERS.forEach(l => L.$('#stack-' + l[0]).addEventListener('change', renderStack));
    renderStack();
  }

  /* ---------- failure modes: three of these run the real model, live ---------- */
  const live = (text, k) => ai.next(mids(text)).slice(0, k || 3).map((r, i) =>
    '<div class="fv-bar' + (i ? ' dim' : '') + '"><span>' + L.esc(r.m === V.END ? 'end (.)' : r.w) + '</span><i style="--p:' + (r.p * 100).toFixed(0) + '%"></i><em>' + L.pct(r.p, 0) + '</em></div>').join('');
  const eff = text => { const p = ai.next(mids(text)); return Math.exp(-p.reduce((s, r) => s + (r.p > 0 ? r.p * Math.log(r.p) : 0), 0)); };
  const FAIL = {
    hallucination: ['Hallucination', true, () => 'This is the page’s real model, running now. It has a token for “dragon” but never once saw the word used in training, so that token’s embedding is close to noise. Ask anyway and it answers fluently, with confident odds, in exactly the voice it uses when it does know. The sampler must always pick <em>some</em> token; nothing in the machinery separates “known” from “made up”.',
      () => '<div class="fv-q">“the dragon sat on the ___”</div>' + live('the dragon sat on the') + '<p class="fv-cap">It then writes: “the dragon sat on the' + L.esc(L.trainer.greedy('the dragon sat on the', 6)) + '”</p>'],
    context: ['Missing context', true, () => 'Also live. On the left the model can see who the sentence is about. On the right the first two tokens have fallen out of its window — the same thing that happens to old messages in a long chat. It does not say “I can’t tell”. It falls back on the most common answer and states it just as firmly.',
      () => '<div class="fv-two"><div><div class="fv-q">“the gardener was tired so ___”</div>' + live('the gardener was tired so') + '</div><div><div class="fv-q"><s>the gardener</s> “was tired so ___”</div>' + live('was tired so') + '</div></div>'],
    prompt: ['Weak prompt', true, () => { const a = eff('the'), b = eff('the cat sat on the'); return 'Live again: after the single word “the” the model is effectively choosing among <strong>' + a.toFixed(1) + '</strong> equally likely tokens; after “the cat sat on the” that falls to <strong>' + b.toFixed(1) + '</strong>. A vague request leaves the model choosing among many readings, and it picks the most typical one — not necessarily yours. State the goal, the constraints, and what must not change.'; },
      () => '<div class="fv-two"><div><div class="fv-q">“the ___”</div>' + live('the', 4) + '</div><div><div class="fv-q">“the cat sat on the ___”</div>' + live('the cat sat on the', 4) + '</div></div>'],
    stale: ['Stale information', false, () => 'The weights are frozen at a training cutoff. Everything after that date is blank unless a tool fetches it. For prices, laws, releases, schedules, or live sites, the system needs a fresh lookup.',
      () => '<div class="fv-time"><span class="known">what the weights contain</span><span class="gap">nothing here</span><b class="cut">training cutoff</b><b class="now">today</b><i class="ask">your question</i></div>'],
    tool: ['Wrong tool', false, () => 'Evidence only helps if it comes from the right place. A coding agent should inspect code; a research agent should cite sources; a question about the live site needs the live site, not the draft on disk.',
      () => '<div class="fv-q">“What is on the live site right now?”</div><div class="fv-tools"><span class="no">search local files — shows the draft, not what is deployed</span><span class="yes">open the live page — the actual source of truth</span></div>'],
    permission: ['Permission boundary', false, () => 'A capable agent still needs limits. Destructive actions, public posts, secrets, payments, and service restarts should stop at a gate and wait for an explicit yes.',
      () => '<div class="fv-gate"><i class="pkt"></i><span class="gate">approval</span><span class="dest">live service</span></div>']
  };
  const tabs = L.$('#failureTabs');
  if (tabs) {
    let cur = 'hallucination';
    const show = k => {
      cur = k;
      L.$$('[data-failure]').forEach(b => b.classList.toggle('active', b.dataset.failure === k));
      const f = FAIL[k];
      L.$('#failureCard').innerHTML = '<div class="fv">' + (f[1] ? '<span class="fv-live">live model</span>' : '') + f[3]() + '</div><div><h3>' + f[0] + '</h3><p>' + f[2]() + '</p></div>';
    };
    tabs.innerHTML = Object.keys(FAIL).map(k => '<button class="lab-button" data-failure="' + k + '" type="button">' + FAIL[k][0] + (FAIL[k][1] ? ' <i class="live-dot"></i>' : '') + '</button>').join('');
    L.$$('[data-failure]').forEach(b => b.addEventListener('click', () => show(b.dataset.failure)));
    ai.onChange(st => { if (st !== 'training') show(cur); });
    show(cur);
  }

  const QUIZ = {
    commit: ['Latest commit', '“What changed in the latest deployed website commit?”', 'Correct. The latest commit is current state, so the agent should inspect git or the live page before answering.', 'Risky. The model might remember an earlier commit from the chat, but that is not proof of the latest deployed state.'],
    weather: ['Tonight’s weather', '“Will it rain enough tonight that I can skip watering?”', 'Correct. Weather is live and unstable, so the agent should check a forecast before advising.', 'Risky. Weather changes too quickly for training data to be any use.'],
    definition: ['A concept', '“What is a token in an AI model?”', 'Usually unnecessary. A stable concept can be answered from the model’s training unless exact source wording is required.', 'Reasonable. This is stable, general knowledge, so a plain explanation is fine.'],
    restart: ['Restart a service', '“Restart the site service now.”', 'Partly right — but the key point is approval. The agent should pause before a service restart unless you have explicitly authorised it.', 'Wrong direction. This is not a question to guess about; it is an action with operational risk.']
  };
  const qp = L.$('#quizPicker');
  if (qp) {
    let kind = 'commit';
    const draw = () => {
      L.$('#quizQuestion').textContent = 'Request: ' + QUIZ[kind][1];
      qp.innerHTML = Object.keys(QUIZ).map(k => '<button class="lab-button ' + (k === kind ? 'active' : '') + '" data-quiz-kind="' + k + '" type="button">' + QUIZ[k][0] + '</button>').join('');
      L.$$('[data-quiz-kind]').forEach(b => b.addEventListener('click', () => { kind = b.dataset.quizKind; draw(); }));
      L.$$('[data-quiz]').forEach(b => b.classList.remove('active'));
      L.$('#quizResult').textContent = 'Pick the safer approach.';
    };
    L.$$('[data-quiz]').forEach(b => b.addEventListener('click', () => {
      L.$$('[data-quiz]').forEach(x => x.classList.toggle('active', x === b));
      L.$('#quizResult').textContent = QUIZ[kind][b.dataset.quiz === 'tool' ? 2 : 3];
    }));
    draw();
  }

  /* ---------- glossary: browse, search, or be quizzed ---------- */
  const G = {
    token: ['Token', 'tokens', 'A piece of text from a fixed vocabulary: sometimes a whole short word, sometimes part of a word, sometimes punctuation. Models read and write token IDs, never letters.', 'Long pasted logs consume many tokens. Rare words and long numbers split into several.', 'Exactly one word.', 'A vocabulary piece with an ID number.'],
    embedding: ['Embedding', 'embeddings', 'The list of numbers a token ID is swapped for on the way in. Tokens that are used in similar ways get similar lists, so meaning becomes position and direction in a high-dimensional space.', 'In this page’s model, “cat” sits next to “dog” and “mouse” — nobody told it they were animals.', 'A dictionary definition stored for each word.', 'Coordinates that training discovered.'],
    attention: ['Attention', 'attention', 'The operation that lets each token pull information from earlier tokens. Each token scores every earlier one for relevance and blends in their content in proportion.', 'After “the gardener was tired so”, one head in this page’s model reaches back to “gardener” — that is how it picks “she”.', 'The model focusing, like a person does.', 'A weighted copy of information between positions.'],
    layer: ['Layer', 'layers', 'One repeat of the attention-then-MLP block. Each layer reads the running vector for every token, computes an adjustment, and adds it back.', 'Early layers settle local wording; later layers settle what should come next.', 'Each layer does a separate named job.', 'Many small refinements of one shared scratchpad.'],
    weights: ['Weights', 'training', 'The numbers inside the model — embedding tables, attention matrices, MLP connections. They are fixed after training and are the entire content of “what the model knows”.', 'This page’s model has about thirteen thousand of them and fits in a 35 KB file. Large models have hundreds of billions.', 'A database of facts and sentences.', 'Numbers that shape every calculation.'],
    logits: ['Logits', 'sampling', 'The raw scores the model outputs, one per token in the vocabulary. Softmax converts them to probabilities.', 'After “the cat sat on the”, “mat” gets a high logit and “gardener” a very low one.', 'The model’s answer.', 'A scoreboard the sampler chooses from.'],
    temperature: ['Temperature', 'sampling', 'A sampler setting that divides the logits before softmax. Low values exaggerate the favourite; high values flatten the odds.', 'Low temperature for code and facts, higher for brainstorming.', 'A creativity dial inside the model.', 'A dial on the dice, applied after the model has finished.'],
    'chat template': ['Chat template', 'chat', 'The format an app uses to flatten a conversation into one string: marker tokens for system, user, and assistant turns, and an end-of-turn marker the app watches for.', 'Turn the stop marker off and the model happily writes your next message for you.', 'The model holds a conversation.', 'The model continues a string that is formatted like one.'],
    context: ['Context', 'context', 'The bundle the model can use for this answer: system prompt, relevant earlier messages, files, tool results, images, and your latest message — up to a fixed token limit.', 'When an agent edits a page, the current HTML has to be in context or fetched with a tool. Otherwise it is guessing the structure.', 'The model remembers everything.', 'The model uses what is currently loaded.'],
    memory: ['Memory', 'context', 'Information deliberately saved outside the conversation so future sessions can reuse it: preferences, stable facts, project rules. It works by being pasted back into the context.', 'A note like “captions should be funny” belongs in memory because it prevents repeated mistakes.', 'Memory is the whole chat log.', 'Memory is selected, durable notes.'],
    model: ['Model', 'journey', 'The trained neural network that turns input tokens into scores for the next token. It does not inspect your computer or the live web unless a system around it provides tools.', 'A stronger model may reason better about a bug, but it still needs the actual code to fix the right file.', 'The model is the whole assistant.', 'The model is one part of the assistant.'],
    training: ['Training', 'training', 'The expensive learning phase before normal use. The model is shown text with the next token hidden, its error is measured, and every weight is nudged to reduce that error.', 'You can wipe this page’s model and retrain it from random numbers in a few seconds.', 'Training happens every time you chat.', 'Training creates the model; using it does not change it.'],
    alignment: ['Alignment', 'training', 'The post-training work that tries to make a capable model useful, honest, safe, and controllable. Learning from human preference ratings is one common method.', 'People rank two answers, a reward model learns the preference, and further training nudges the assistant toward the preferred behaviour.', 'Alignment makes models perfect.', 'Alignment shapes behaviour and still needs testing.'],
    tool: ['Tool', 'agents', 'A controlled action outside the model: read files, run commands, search the web, create images, take screenshots. The model asks in text; the surrounding app does the work.', 'For “what changed in the latest commit”, git is the right tool. The model should not answer from memory.', 'Tools make answers automatically correct.', 'Tools provide evidence the model must still interpret.'],
    agent: ['Agent', 'agents', 'A model wrapped in a loop: read the task, plan, call a tool, read the result, repeat, then answer.', 'Editing a website is agent work: reading files, changing code, checking screenshots, publishing.', 'Agent means smarter chatbot.', 'Agent means model plus action loop.'],
    grounding: ['Grounding', 'agents', 'Anchoring an answer in sources the system can inspect: files, tool output, screenshots, documents, or live data.', 'A browser screenshot grounds a layout fix better than “the CSS looks centred”.', 'Grounding removes all mistakes.', 'Grounding reduces unsupported claims.'],
    verification: ['Verification', 'agents', 'The proof step after work is done: tests, screenshots, link checks, secret scans, or comparing the output with the request.', 'For a static page: load it in a browser, check the console, check a phone-sized layout.', 'No error message means verified.', 'Verification is an explicit check.'],
    approval: ['Approval', 'agents', 'A human checkpoint that stops an agent before destructive, public, paid, credential, or service-level actions.', 'Restarting a service or publishing a public post should pause for explicit confirmation.', 'Approval is just caution.', 'Approval controls real-world side effects.'],
    hallucination: ['Hallucination', 'failure', 'A fluent, reasonable-looking answer produced without support. It is the normal sampling process operating where the model has nothing solid to go on.', 'Ask this page’s model about a dragon it never met and it still finishes the sentence.', 'The model is broken or lying.', 'The claim is unsupported, and the voice does not change.']
  };
  const gl = L.$('#conceptList');
  if (gl) {
    const keys = Object.keys(G), search = L.$('#conceptSearch'), detail = L.$('#conceptDetail');
    let cur = 'token';
    const list = () => {
      const q = (search.value || '').trim().toLowerCase();
      const hit = keys.filter(k => !q || (G[k][0] + ' ' + G[k][2]).toLowerCase().indexOf(q) >= 0);
      gl.innerHTML = hit.length ? hit.map(id => '<button class="concept-chip ' + (id === cur ? 'active' : '') + '" data-concept="' + id + '" type="button">' + G[id][0] + '</button>').join('') : '<span class="fine">No term matches “' + L.esc(q) + '”.</span>';
      return hit;
    };
    const show = k => {
      cur = k; list();
      const g = G[k];
      detail.innerHTML = '<h3>' + g[0] + '</h3><p>' + g[2] + '</p><div class="concept-example">' + g[3] + '</div>' +
        '<div class="concept-pair"><div><strong>Avoid thinking</strong><span>' + g[4] + '</span></div><div><strong>Better mental model</strong><span>' + g[5] + '</span></div></div>' +
        '<a class="lab-button see" href="#' + g[1] + '">See it move →</a>';
    };
    gl.addEventListener('click', ev => { const k = ev.target.dataset && ev.target.dataset.concept; if (k) show(k); });
    search.addEventListener('input', () => { const hit = list(); if (hit.length && hit.indexOf(cur) < 0) show(hit[0]); });
    // quiz: a definition with the term blanked out, four terms to choose from
    const rnd = L.rng(Date.now() & 0xffff);
    let right = 0, asked = 0;
    const ask = () => {
      const k = keys[Math.floor(rnd() * keys.length)], others = keys.filter(x => x !== k).sort(() => rnd() - 0.5).slice(0, 3);
      const options = others.concat(k).sort(() => rnd() - 0.5);
      const blank = G[k][2].replace(new RegExp(G[k][0], 'ig'), '…');
      detail.innerHTML = '<span class="predict-tag">Quiz · ' + right + ' of ' + asked + ' right</span><p class="quiz-def">' + blank + '</p><div class="predict-opts">' +
        options.map(o => '<button class="lab-button" type="button" data-qa="' + o + '">' + G[o][0] + '</button>').join('') + '</div><p class="predict-fb" aria-live="polite"></p>';
      detail.querySelectorAll('[data-qa]').forEach(b => b.addEventListener('click', () => {
        const ok = b.dataset.qa === k;
        asked++; if (ok) right++;
        detail.querySelectorAll('[data-qa]').forEach(x => { x.disabled = true; x.classList.toggle('right', x.dataset.qa === k); x.classList.toggle('wrong', x === b && !ok); });
        const fb = detail.querySelector('.predict-fb');
        fb.innerHTML = '<strong>' + (ok ? 'Right.' : 'It was “' + G[k][0] + '”.') + '</strong> ' + G[k][5] + ' ';
        fb.append(L.h('button', { class: 'lab-button', type: 'button', text: 'Next question', onclick: ask }), L.h('button', { class: 'lab-button', type: 'button', text: 'Back to the list', onclick: () => show(k) }));
      }));
    };
    L.$('#conceptQuiz').addEventListener('click', ask);
    show(cur);
  }
})();
