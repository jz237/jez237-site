/* Chapter 2 — live byte-pair-encoding merges on the shared prompt or on
   whatever the visitor types. Pieces the tiny model never trained on are
   outlined, because the chapters below will treat them as "unknown". */
(function () {
  'use strict';
  const L = Lab, input = L.$('#tokenInput');
  if (!input) return;
  const bpe = L.bpe, run = L.seq();
  const stage = L.$('#tokStage'), status = L.$('#tokStatus'), idsEl = L.$('#tokIds');
  const PRESETS = {
    mine: () => L.prompt.text,
    clear: 'The model predicts the next token, one piece at a time.',
    rare: "Supercalifragilistic tokenization of Philadelphia's zucchini",
    code: 'if (x >= 42) { return tokens[i] + 1; }'
  };
  // the tiny model is lower-case only; a piece it never trained on is a stranger to it
  const known = sym => L.ai.V.has(sym.toLowerCase());
  let enc = null, at = 0, visible = false;

  function render(mark) {
    const ws = at === 0 ? enc.start : enc.steps[at - 1].words;
    const joined = mark ? mark.a + mark.b : null, final = at === enc.steps.length;
    stage.innerHTML = '';
    let count = 0, strangers = 0;
    const ids = [];
    ws.forEach(word => {
      const g = L.h('span', { class: 'tok-word' });
      word.forEach(sym => {
        count++;
        const id = bpe.id(sym), odd = final && !known(sym);
        if (odd) strangers++;
        ids.push(id);
        const single = Array.from(sym).length === 1;
        g.append(L.h('span', {
          class: 'tok' + (single ? ' raw' : ' c' + (id % 6)) + (sym === joined ? ' pop' : '') + (odd ? ' unk' : ''),
          title: 'token id ' + id + (odd ? ' — the tiny model has never seen this piece' : ''), text: bpe.show(sym)
        }));
      });
      stage.append(g);
    });
    idsEl.textContent = ids.length ? '[' + ids.join(', ') + ']' : '[ ]';
    const chars = input.value.length;
    L.$('#tokChars').textContent = chars;
    L.$('#tokCount').textContent = count;
    L.$('#tokRatio').textContent = count ? (chars / count).toFixed(1) : '0';
    L.$('#tokMerges').textContent = at + ' / ' + enc.steps.length;
    if (!enc.start.length) status.textContent = 'Type something to tokenize.';
    else if (at === 0) status.innerHTML = '<strong>Start.</strong> Every character is its own token. The dot (·) stands for the space in front of a word.';
    else if (mark) status.innerHTML = '<strong>Merge ' + at + ' of ' + enc.steps.length + '.</strong> Learned rule #' + (mark.rank + 1) +
      ': “' + L.esc(bpe.show(mark.a)) + '” + “' + L.esc(bpe.show(mark.b)) + '” → “' + L.esc(bpe.show(mark.a + mark.b)) + '”' +
      (mark.hits > 1 ? ' (' + mark.hits + ' places at once)' : '') + '.';
    if (final && enc.start.length) {
      let worst = null;
      ws.forEach((w, i) => { if (!worst || w.length > worst.n) worst = { n: w.length, i }; });
      const wtxt = enc.start[worst.i].join('').replace(bpe.SP, '');
      status.innerHTML = '<strong>Done.</strong> ' + chars + ' characters became ' + count + ' tokens. ' +
        (worst.n > 2 ? 'The costliest word was “' + L.esc(wtxt) + '” — ' + worst.n + ' tokens, because this tokenizer rarely saw it. ' :
          'Every word was common enough to end up as one or two tokens. ') +
        (strangers ? '<span class="unk-note">' + strangers + ' of these pieces (outlined in red) never appear in the tiny model’s training sentences. The chapters below treat each one as a single “unknown” token.</span>' :
          'The tiny model on this page knows every one of these pieces.');
    }
  }

  function load(play) {
    run.stop();
    enc = bpe.encode(input.value);
    at = 0;
    render();
    if (play) go();
  }
  async function go() {
    const k = run.begin();
    if (at >= enc.steps.length) { at = 0; render(); }
    const gap = L.clamp(3200 / Math.max(1, enc.steps.length), 28, 190);
    if (!(await run.wait(500, k))) return;
    while (at < enc.steps.length) {
      at++;
      render(enc.steps[at - 1]);
      if (!(await run.wait(gap, k))) return;
    }
    render();
  }
  const mark = name => L.$$('[data-token-preset]').forEach(b => b.classList.toggle('active', b.dataset.tokenPreset === name));

  L.$('#tokRun').addEventListener('click', go);
  L.$('#tokStep').addEventListener('click', () => {
    run.stop();
    if (at < enc.steps.length) { at++; render(enc.steps[at - 1]); }
    if (at === enc.steps.length) render();
  });
  L.$('#tokSkip').addEventListener('click', () => { run.stop(); at = enc.steps.length; render(); });
  let typing = 0;
  input.addEventListener('input', () => {
    mark('');
    clearTimeout(typing);
    load(false);
    typing = setTimeout(go, 450);
  });
  L.$$('[data-token-preset]').forEach(btn => btn.addEventListener('click', () => {
    mark(btn.dataset.tokenPreset);
    const p = PRESETS[btn.dataset.tokenPreset];
    input.value = typeof p === 'function' ? p() : p;
    load(true);
  }));
  L.onPrompt(p => { mark('mine'); input.value = p.text; load(visible); });

  L.$('#tokRules').innerHTML = bpe.merges.slice(0, 12).map((m, i) =>
    '<li><b>#' + (i + 1) + '</b> <span class="tok raw">' + L.esc(bpe.show(m.a)) + '</span> + <span class="tok raw">' + L.esc(bpe.show(m.b)) +
    '</span> → <span class="tok c' + ((256 + i) % 6) + '">' + L.esc(bpe.show(m.a + m.b)) + '</span> <i>seen ' + m.n + '×</i></li>').join('');
  L.$('#tokTrainNote').textContent = bpe.merges.length + ' merge rules from ' + bpe.trainedOn.toLocaleString() + ' characters of sample text';

  // first run starts when the chapter scrolls into view
  input.value = L.prompt.text;
  load(false);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { io.disconnect(); visible = true; go(); }
    }, { threshold: 0.4 });
    io.observe(stage);
  } else { visible = true; go(); }
})();
