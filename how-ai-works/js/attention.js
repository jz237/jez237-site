/* Chapter 4 — attention, read straight out of the page's model: arcs for one
   asking token, the full weight matrix with its causal mask, and (separately)
   a hand-sized worked example of the query / key / value arithmetic. */
(function () {
  'use strict';
  const L = Lab, row = L.$('#attRow');
  if (!row) return;
  const ai = L.ai, V = ai.V, cfg = ai.model.cfg, run = L.seq();
  const svg = L.$('#attArcs'), grid = L.$('#attGrid'), note = L.$('#attNote'), heads = L.$('#attHeads');
  let layer = cfg.L - 1, head = 0, query = -1, tr = null, labels = [], mids = [];

  for (let l = 0; l < cfg.L; l++) for (let h = 0; h < cfg.H; h++) {
    heads.append(L.h('button', { class: 'lab-button', type: 'button', 'data-lh': l + ',' + h, text: 'Layer ' + (l + 1) + ' · head ' + (h + 1), onclick: () => { layer = l; head = h; render(true); } }));
  }

  function recompute() {
    mids = ai.window(L.prompt.mids);
    tr = ai.trace(L.prompt.mids);
    labels = mids.map(m => (m === V.BOS ? 'start' : m === V.UNK ? '?' : ai.word(m)));
    if (query < 0 || query >= tr.n) query = tr.n - 1;
  }
  const weight = (i, j) => tr.att[layer][head][i * tr.n + j];

  function explain() {
    const n = tr.n, ranked = [];
    for (let j = 0; j <= query; j++) ranked.push({ j, p: weight(query, j) });
    ranked.sort((a, b) => b.p - a.p);
    const top = ranked[0], guess = Array.from(tr.rows[query], (p, m) => ({ m, p })).sort((a, b) => b.p - a.p).slice(0, 3);
    let s = '<strong>“' + L.esc(labels[query]) + '”</strong> takes ' +
      ranked.slice(0, 3).filter(x => x.p > 0.02).map(x => L.pct(x.p, 0) + ' from “' + L.esc(labels[x.j]) + '”' + (x.j === query ? ' (itself)' : '')).join(', ') + '. ';
    if (query === 0) s = '<strong>The start marker</strong> is the first token. Nothing comes before it, so all of its attention lands on itself. ';
    else if (ai.state === 'random') s += 'The weights are random right now, so this pattern means nothing yet. Train the model in chapter 7 and come back.';
    else if (top.p > 0.45 && mids[top.j] > 1 && ai.cls(mids[top.j]) === 'who' && top.j < query - 1) s += 'This head has reached back to <em>who the sentence is about</em>. Nobody programmed that: the model found that fetching the subject helps it predict what comes next.';
    else if (top.p > 0.45 && top.j === query - 1) s += 'Here the head is mostly looking one step back, at the word just before this one.';
    else if (top.p > 0.45 && top.j === 0) s += 'Here the head parks its attention on the start marker — a common way for a head to say “nothing I need at this position”.';
    else if (top.p < 0.4) s += 'Here the head spreads itself thinly over several tokens rather than fetching one thing.';
    s += '<br><span class="att-guess">After reading up to this token, the model expects next: ' +
      guess.map(g => '<b>' + L.esc(g.m === V.END ? 'end (.)' : ai.word(g.m)) + '</b> ' + L.pct(g.p, 0)).join(', ') + '.</span>';
    note.innerHTML = s;
    void n;
  }

  function render(animate) {
    const n = tr.n;
    row.innerHTML = '';
    labels.forEach((tok, j) => {
      const seen = j <= query, w = seen ? weight(query, j) : 0;
      row.append(L.h('button', {
        type: 'button',
        class: 'att-tok' + (j === query ? ' query' : '') + (seen ? '' : ' future') + (j === 0 ? ' marker' : '') + (mids[j] === V.UNK ? ' unknown' : ''),
        style: seen ? { '--w': w.toFixed(3) } : null,
        'aria-label': tok + (seen ? ', attention ' + L.pct(w, 0) : ', not yet visible'),
        onclick: () => { run.stop(); query = j; render(true); }
      }, [L.h('span', { text: tok }), L.h('em', { text: seen ? L.pct(w, 0) : 'hidden' })]));
    });
    const kids = Array.from(row.children), H = 120;
    const cx = el => el.offsetLeft + el.offsetWidth / 2;
    svg.setAttribute('viewBox', '0 0 ' + row.scrollWidth + ' ' + H);
    svg.style.width = row.scrollWidth + 'px';
    const qx = cx(kids[query]);
    const scroller = row.closest('.att-scroll');   // keep the asking token on screen on narrow layouts
    if (scroller && scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = Math.max(0, qx - scroller.clientWidth + 70);
    svg.innerHTML = kids.map((el, j) => {
      const w = j <= query ? weight(query, j) : 0;
      if (j > query || w < 0.012) return '';
      const x = cx(el);
      if (j === query) return '<circle cx="' + x + '" cy="' + (H - 12) + '" r="' + (4 + 10 * w) + '" class="att-self" style="opacity:' + (0.3 + 0.7 * w) + '"/>';
      const lift = Math.min(H - 14, 26 + Math.abs(qx - x) * 0.3);
      return '<path pathLength="1" class="att-arc' + (animate ? ' draw' : '') + '" d="M' + qx + ' ' + (H - 2) + ' Q' + (qx + x) / 2 + ' ' + (H - 2 - lift * 2) +
        ' ' + x + ' ' + (H - 2) + '" style="stroke-width:' + (1 + 11 * w).toFixed(1) + ';opacity:' + (0.25 + 0.75 * Math.sqrt(w)).toFixed(2) + ';animation-delay:' + (j * 35) + 'ms"/>';
    }).join('');
    grid.style.gridTemplateColumns = 'minmax(40px, 58px) repeat(' + n + ', minmax(0, 1fr))';
    let html = '<span class="att-corner"></span>' + labels.map(x => '<span class="att-colh">' + L.esc(x) + '</span>').join('');
    for (let i = 0; i < n; i++) {
      html += '<span class="att-rowh' + (i === query ? ' on' : '') + '">' + L.esc(labels[i]) + '</span>';
      for (let j = 0; j < n; j++) {
        html += j > i ? '<i class="masked" title="' + L.esc(labels[i]) + ' cannot see ' + L.esc(labels[j]) + ' (it comes later)"></i>' :
          '<i data-i="' + i + '" class="' + (i === query ? 'on' : '') + '" style="--w:' + weight(i, j).toFixed(3) + '" title="' + L.esc(labels[i]) + ' → ' + L.esc(labels[j]) + ': ' + L.pct(weight(i, j), 0) + '"></i>';
      }
    }
    grid.innerHTML = html;
    explain();
    L.$$('[data-lh]').forEach(b => b.classList.toggle('active', b.dataset.lh === layer + ',' + head));
    L.$$('[data-attprompt]').forEach(b => b.classList.toggle('active', b.dataset.attprompt === L.prompt.text));
  }
  grid.addEventListener('click', ev => {
    const i = ev.target && ev.target.dataset && ev.target.dataset.i;
    if (i != null) { run.stop(); query = Number(i); render(true); }
  });
  L.$$('[data-attprompt]').forEach(b => b.addEventListener('click', () => L.setPrompt(b.dataset.attprompt)));
  L.$('#attPlay').addEventListener('click', async () => {
    const k = run.begin();
    for (let i = 1; i < tr.n; i++) {
      query = i; render(true);
      if (!(await run.wait(i === tr.n - 1 ? 2600 : 1900, k))) return;
    }
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => { if (tr) render(false); }).observe(row);
  L.onPrompt(() => { run.stop(); query = -1; recompute(); render(true); });
  ai.onChange(st => { if (st !== 'training') { recompute(); render(false); } });

  /* ---- query / key / value in slow motion: a hand-sized example ---- */
  const qkv = L.$('#qkv'), qNote = L.$('#qkvNote');
  const KEYS = { animal: [1, 0, 0.2], street: [0, 1, 0.2], it: [0.3, 0.3, 1], too: [0.1, 0.1, 0] };
  const VALS = { animal: [0.9, 0.1, 0.8], street: [0.1, 0.9, 0.2], it: [0.4, 0.4, 0.6], too: [0, 0.1, 0] };
  const Q = [2.2, -0.6, 1.2];
  const QSTEPS = [
    'The token being processed builds a <strong>query</strong>: numbers describing what it is looking for. Every earlier token advertises a <strong>key</strong>: numbers describing what it has to offer.',
    'Compare the query with each key: multiply the matching numbers and add them up (a dot product). A large total means “this token is what I was looking for.”',
    '<strong>Softmax</strong> squeezes the totals into shares that sum to 100%. These shares are the attention weights — the arc thicknesses in the diagram above.',
    'Each token also carries a <strong>value</strong>: the information it hands over. The asking token takes each value in proportion to its weight and adds the blend to its own vector. It now carries a trace of the token it was looking for.'
  ];
  let qStep = 0;
  const cell = (x, scale) => '<i style="background:' + L.heat(x / (scale || 1)) + '">' + (Math.round(x * 100) / 100) + '</i>';
  function renderQKV() {
    const names = Object.keys(KEYS);
    const sc = names.map(n => KEYS[n].reduce((s, k, i) => s + k * Q[i], 0));
    const w = L.softmax(sc);
    const outv = [0, 1, 2].map(i => names.reduce((s, n, j) => s + w[j] * VALS[n][i], 0));
    let html = '<div class="qkv-row qkv-q"><b>“tired”</b><span class="qkv-tag">query</span><div class="nums">' + Q.map(x => cell(x, 2.2)).join('') + '</div>' +
      '<span class="qkv-hint">in “The animal didn’t cross the street because it was too <em>tired</em>” — looking for something alive</span></div>';
    names.forEach((n, j) => {
      const calc = KEYS[n].map((k, i) => (Q[i] < 0 ? '(' + Q[i] + ')' : Q[i]) + '×' + k).join(' + ');
      html += '<div class="qkv-row" style="--d:' + j * 140 + 'ms"><b>' + n + '</b><span class="qkv-tag">key</span><div class="nums">' + KEYS[n].map(x => cell(x)).join('') + '</div>' +
        '<span class="qkv-calc">' + calc + ' = <strong>' + sc[j].toFixed(2) + '</strong></span>' +
        '<span class="qkv-bar"><span style="--p:' + w[j].toFixed(3) + '"></span><em>' + L.pct(w[j], 0) + '</em></span>' +
        '<span class="qkv-val"><span class="qkv-tag">value</span><div class="nums">' + VALS[n].map(x => cell(x)).join('') + '</div></span></div>';
    });
    html += '<div class="qkv-row qkv-out"><b>blend</b><span class="qkv-tag">added to “tired”</span><div class="nums">' + outv.map(x => cell(x)).join('') + '</div>' +
      '<span class="qkv-hint">= ' + names.map((n, j) => L.pct(w[j], 0) + ' × ' + n).join(' + ') + '</span></div>';
    qkv.innerHTML = html;
    qkv.dataset.step = qStep;
    qNote.innerHTML = '<strong>Step ' + (qStep + 1) + ' of 4.</strong> ' + QSTEPS[qStep];
    L.$('#qkvPrev').disabled = qStep === 0;
    L.$('#qkvNext').textContent = qStep === 3 ? 'Start over' : 'Next step';
  }
  L.$('#qkvNext').addEventListener('click', () => { qStep = (qStep + 1) % 4; renderQKV(); });
  L.$('#qkvPrev').addEventListener('click', () => { qStep = Math.max(0, qStep - 1); renderQKV(); });

  recompute();
  render(false);
  renderQKV();
})();
