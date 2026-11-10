/* Chapter 10 — the agent loop as a message timeline between three lanes
   (you / model / tools), with the context filling up as results come back. */
(function () {
  'use strict';
  const L = Lab, lanes = L.$('#agentLanes');
  if (!lanes) return;
  const run = L.seq();
  // step: [from, to, kind, text, tokens added to context, optional note]
  const Y = 0, M = 1, T = 2;
  const SCRIPTS = {
    garden: {
      on: [
        [Y, M, 'request', 'Find my latest garden photo and write a caption.', 28],
        [M, M, 'plan', 'I cannot know which file is newest from memory. List the folder first.', 34],
        [M, T, 'call', 'list_files({ "path": "photos/garden/" })', 18],
        [T, M, 'result', '["bed-0412.jpg", "redbud-0502.jpg", ...]\nnewest: redbud-0502.jpg  3024x4032', 96],
        [M, T, 'call', 'view_image({ "file": "redbud-0502.jpg" })', 16],
        [T, M, 'result', '[image] a raised bed in bloom under a pink redbud tree', 260, 'Images are converted to tokens too — a few hundred for one photo. Everything the model looks at spends context.'],
        [M, T, 'call', 'edit_file({ "file": "garden/index.html",\n  "add": "<figure>...Redbud showing off again.</figure>" })', 52],
        [T, M, 'result', 'ok - 1 file changed', 10],
        [M, T, 'call', 'screenshot({ "url": "localhost/garden/" })', 16, 'This call is verification: the edit is already made, and the model is checking that it actually worked instead of assuming.'],
        [T, M, 'result', '[image] page renders, new photo and caption visible, layout intact', 260],
        [M, Y, 'answer', 'Added redbud-0502.jpg with the caption “Redbud showing off again.” I checked the page and it renders correctly.', 40]
      ],
      off: [
        [Y, M, 'request', 'Find my latest garden photo and write a caption.', 28],
        [M, M, 'plan', 'No way to look at the folder. Produce something that sounds right.', 30],
        [M, Y, 'guess', 'Here is a caption for your latest photo: “Spring tulips in full bloom!”', 30, 'It never saw the photo. There may be no tulips. The sentence is fluent because fluency is what the model is built for — nothing here was checked.']
      ]
    },
    weather: {
      on: [
        [Y, M, 'request', 'Should I water the garden tonight?', 22],
        [M, M, 'plan', 'Weather changes by the hour. Nothing in my training can tell me about tonight. Look it up.', 36],
        [M, T, 'call', 'get_forecast({ "place": "Philadelphia", "hours": 12 })', 20],
        [T, M, 'result', 'rain 80% after 9pm, 0.4 in expected\nlow 58F, humidity 88%', 64],
        [M, Y, 'answer', 'Skip the beds tonight — rain is very likely after 9pm. Pots under cover will still need a drink.', 38]
      ],
      off: [
        [Y, M, 'request', 'Should I water the garden tonight?', 22],
        [M, Y, 'guess', 'Evening is generally a good time to water, so yes, go ahead.', 26, 'A reasonable-sounding general rule, delivered as if it were advice about tonight. It has no idea it is about to rain.']
      ]
    },
    layout: {
      on: [
        [Y, M, 'request', 'Those sidebar buttons are not centred.', 20],
        [M, M, 'plan', 'This is a visual bug. Reading CSS cannot prove what the page looks like. Take a screenshot.', 36],
        [M, T, 'call', 'screenshot({ "url": "localhost/how-ai-works/" })', 16],
        [T, M, 'result', '[image] button stack sits 14px left of centre', 260],
        [M, T, 'call', 'read_file({ "file": "assets/styles.css", "find": "nav" })', 18],
        [T, M, 'result', 'nav { padding-left: 28px }   <- inherited by .lab-nav', 70],
        [M, T, 'call', 'edit_file({ "file": "index.html",\n  "add": ".lab-nav { padding-left: 0 }" })', 30],
        [T, M, 'result', 'ok - 1 file changed', 10],
        [M, T, 'call', 'screenshot({ "url": "localhost/how-ai-works/", "widths": [1280, 1024] })', 22],
        [T, M, 'result', '[image] centred at both widths, labels not clipped', 300],
        [M, Y, 'answer', 'Fixed: the sidebar was inheriting 28px of padding from the global nav rule. Centred now at 1280 and 1024px.', 40]
      ],
      off: [
        [Y, M, 'request', 'Those sidebar buttons are not centred.', 20],
        [M, Y, 'guess', 'Try adding  margin: 0 auto;  to the button container.', 24, 'The single most common answer to “how do I centre this”. It is not the cause here — but without looking at the page, the most common answer is all the model has.']
      ]
    },
    restart: {
      on: [
        [Y, M, 'request', 'Restart the site service.', 14],
        [M, M, 'plan', 'This changes a live service. Being able to run the command is not the same as being allowed to. Ask first.', 38],
        [M, Y, 'ask', 'I would run  systemctl restart site.  Visitors will be cut off for about 5 seconds. Go ahead?', 34, 'The loop pauses here on purpose. A well-built agent treats destructive, public, paid, or service-level actions as needing a human yes.'],
        [Y, M, 'request', 'Yes, go ahead.', 8],
        [M, T, 'call', 'run_command({ "cmd": "systemctl restart site" })', 18],
        [T, M, 'result', 'site.service: active (running) since 21:04:12', 30],
        [M, Y, 'answer', 'Restarted. The service came back up and reports healthy.', 22]
      ],
      off: [
        [Y, M, 'request', 'Restart the site service.', 14],
        [M, Y, 'answer', 'I cannot run commands from here. The command you want is  systemctl restart site.', 30, 'Without tools the model can only describe an action. That is a real limit, and a good answer says so plainly.']
      ]
    }
  };
  const KIND = {
    request: ['You', 'The message is added to the context window, next to the system prompt and a list of the tools the model is allowed to ask for.', 0],
    plan: ['Plan', 'The model’s output is still just predicted text — here a short plan. It becomes part of the context for its own next step.', 1],
    call: ['Tool call', 'A tool call is also just text: a function name and arguments in a fixed format. The model cannot run anything. The app around it spots this text, pauses the model, and runs the tool itself.', 2],
    result: ['Tool result', 'The tool’s output is pasted into the context as a new message and the model is run again from the top. Only now can it “see” what the tool found.', 3],
    answer: ['Answer', 'The model produced plain text with no tool call in it, so the loop ends and the text goes to you.', 0],
    guess: ['Unchecked answer', '', 0],
    ask: ['Asks you', '', 0]
  };
  const RING = ['Read', 'Plan', 'Act', 'Observe'];
  let scenario = 'garden', tools = true, at = 0, ctxTok = 0, loops = 0;
  const script = () => SCRIPTS[scenario][tools ? 'on' : 'off'];
  const note = L.$('#agentNote'), ring = L.$('#agentRing'), playB = L.$('#agentPlay');

  function ringDraw(active) {
    const cx = 80, cy = 80, r = 56, col = ['#39cfff', '#e6bd67', '#ffb060', '#84e37a'];
    let s = '';
    RING.forEach((lab, i) => {
      const a0 = (i * 90 - 90 + 6) * Math.PI / 180, a1 = ((i + 1) * 90 - 90 - 6) * Math.PI / 180, am = (a0 + a1) / 2;
      const on = i === active;
      s += '<path d="M' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) +
        '" fill="none" stroke="' + col[i] + '" stroke-width="' + (on ? 12 : 6) + '" stroke-linecap="round" opacity="' + (on ? 1 : 0.3) + '"' + (on ? ' class="ring-on"' : '') + '/>' +
        '<text x="' + (cx + (r - 24) * Math.cos(am)).toFixed(1) + '" y="' + (cy + (r - 24) * Math.sin(am) + 3).toFixed(1) + '" class="ring-lab' + (on ? ' on' : '') + '">' + lab + '</text>';
    });
    s += '<text x="80" y="76" class="ring-mid">' + (tools ? 'lap' : 'no loop') + '</text><text x="80" y="94" class="ring-num">' + (tools ? loops : '—') + '</text>';
    ring.innerHTML = s;
  }

  function reset() {
    run.stop();
    at = 0; ctxTok = 640; loops = 0; // system prompt + tool descriptions are in context before you say anything
    lanes.innerHTML = '';
    L.$('#agentCtx').textContent = ctxTok.toLocaleString();
    L.$('#agentCtxMeter').style.width = (ctxTok / 2400 * 100) + '%';
    ringDraw(-1);
    playB.textContent = 'Play the run';
    note.innerHTML = tools
      ? 'Before you type anything the context already holds about 640 tokens: the system prompt and the descriptions of every tool the model may ask for. Press play, or step through one message at a time.'
      : 'Tools are switched off. The model has only its training and what you typed. Press play to see what it does with the same request.';
    L.$$('[data-scenario]').forEach(b => b.classList.toggle('active', b.dataset.scenario === scenario));
    const tb = L.$('#toolsToggle');
    tb.classList.toggle('active', tools); tb.setAttribute('aria-pressed', String(tools));
    tb.textContent = tools ? 'Tools: on' : 'Tools: off';
  }

  function step() {
    const sc = script();
    if (at >= sc.length) return false;
    const s = sc[at++], k = KIND[s[2]];
    const lo = Math.min(s[0], s[1]) + 1, hi = Math.max(s[0], s[1]) + 2;
    const dir = s[0] === s[1] ? 'self' : s[1] > s[0] ? 'right' : 'left';
    const mono = s[2] === 'call' || s[2] === 'result';
    const el = L.h('div', { class: 'ag-msg k-' + s[2] + ' d-' + dir, style: { gridColumn: lo + ' / ' + hi } }, [
      L.h('span', { class: 'ag-tag', text: k[0] + (dir === 'self' ? '' : dir === 'right' ? ' →' : ' ←') }),
      L.h(mono ? 'code' : 'p', { text: s[3] })
    ]);
    lanes.append(el);
    lanes.scrollTop = lanes.scrollHeight;
    ctxTok += s[4];
    if (s[2] === 'call') loops++;
    L.$('#agentCtx').textContent = ctxTok.toLocaleString();
    L.$('#agentCtxMeter').style.width = Math.min(100, ctxTok / 2400 * 100) + '%';
    ringDraw(k[2]);
    note.innerHTML = '<strong>' + at + ' / ' + sc.length + ' · ' + k[0] + '.</strong> ' + (s[5] || k[1]) +
      (at === sc.length && tools && loops ? ' <em>Total: ' + loops + ' tool call' + (loops > 1 ? 's' : '') + ', and the model was re-run ' + (loops + 1) + ' times, each time re-reading the whole context.</em>' : '');
    return at < sc.length;
  }

  playB.addEventListener('click', async () => {
    if (at >= script().length) reset();
    const k = run.begin();
    playB.textContent = 'Running…';
    while (step()) { if (!(await run.wait(2600, k))) return; }   // time to read the message and the note under it
    playB.textContent = 'Play again';
  });
  L.$('#agentStep').addEventListener('click', () => { run.stop(); if (at >= script().length) reset(); step(); playB.textContent = at >= script().length ? 'Play again' : 'Play the run'; });
  L.$('#agentReset').addEventListener('click', reset);
  L.$('#toolsToggle').addEventListener('click', () => { tools = !tools; reset(); });
  L.$$('[data-scenario]').forEach(b => b.addEventListener('click', () => { scenario = b.dataset.scenario; reset(); }));
  reset();
})();
