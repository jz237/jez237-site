/* Chapter 8 — a chat is one long string. Left: the conversation as an app
   shows it. Right: the single string the model is actually asked to continue,
   with the role markers a chat app inserts. The replies are scripted; the
   token counts use the page's real tokenizer. */
(function () {
  'use strict';
  const L = Lab, bub = L.$('#chatBubbles');
  if (!bub) return;
  const raw = L.$('#chatRaw'), note = L.$('#chatNote'), playB = L.$('#chatPlay'), stopB = L.$('#chatStop'), run = L.seq();
  const SYS = {
    plain: 'You are a helpful gardening assistant.',
    pirate: 'You are a helpful gardening assistant. Answer like a pirate.',
    brief: 'You are a helpful gardening assistant. Answer in five words or fewer.'
  };
  const REPLY = {
    plain: ['Check the soil first. If the top inch is dry, water deeply at the base this evening.', 'Then skip it. Wet soil plus more water invites root rot.'],
    pirate: ['Arr, poke a finger in the soil! If she be dry an inch down, give those tomatoes a good drink at sundown.', 'Then stow yer watering can, matey. The sky has done the work for ye.'],
    brief: ['Only if the soil is dry.', 'Then skip it.']
  };
  const USER = ['Should I water my tomatoes today?', 'And if it rained last night?'];
  const RUNAWAY = [['user', 'Thanks! What about my peppers?'], ['assistant', 'Peppers like it a little drier. Let the top two inches dry out first.']];
  let sys = 'plain', stop = true, segs = [], played = false;
  const count = t => L.bpe.symbols(t).length;
  const sent = () => segs.reduce((s, g) => s + (g.kind === 'mk' ? 1 : count(g.text)), 0);

  function paint(flash) {
    raw.innerHTML = segs.map(g => g.kind === 'mk'
      ? '<span class="mk r-' + g.role + (g.ghost ? ' ghost' : '') + (g.hot ? ' hot' : '') + '">' + L.esc(g.text) + '</span>' + (g.text === '<|end|>' ? '\n' : '')
      : '<span class="tx r-' + g.role + (g.ghost ? ' ghost' : '') + '">' + L.esc(g.text) + '</span>').join('') + '<span class="caret">▁</span>';
    raw.classList.toggle('resend', !!flash);
    raw.scrollTop = raw.scrollHeight;
    L.$('#chatSent').textContent = sent();
  }
  function bubble(role, text, ghost) {
    const el = L.h('div', { class: 'cb cb-' + role + (ghost ? ' ghost' : '') }, [L.h('span', { class: 'cb-who', text: role === 'system' ? 'system prompt (you never see this)' : role === 'user' ? (ghost ? 'you — except you never typed this' : 'you') : 'assistant' }), L.h('p', { text })]);
    bub.append(el); bub.scrollTop = bub.scrollHeight;
    return el.lastChild;
  }
  const mk = (role, text, extra) => segs.push(Object.assign({ kind: 'mk', role, text }, extra || {}));
  async function turn(role, text, k, ghost) {
    mk(role, '<|' + role + '|>', { ghost });
    const seg = { kind: 'tx', role, text: '', ghost };
    segs.push(seg);
    const p = bubble(role, role === 'assistant' ? '' : text, ghost);
    if (role !== 'assistant') { seg.text = text; paint(); if (!(await run.wait(650, k))) return false; }
    else {
      const words = text.split(' ');
      for (let i = 0; i < words.length; i++) {      // the model writes one piece at a time, into both views
        seg.text += (i ? ' ' : '') + words[i]; p.textContent = seg.text; paint();
        if (!(await run.wait(95, k))) return false;
      }
    }
    mk(role, '<|end|>', { ghost, hot: role === 'assistant' && !ghost });
    paint();
    return true;
  }
  const say = h => { note.innerHTML = h; };

  function reset() {
    run.stop(); segs = []; bub.innerHTML = ''; paint();
    playB.textContent = 'Send the first message';
    say('Pick a system prompt, then send the message. Watch the right-hand panel: that is everything the model is given.');
  }
  async function play() {
    const k = run.begin();
    segs = []; bub.innerHTML = ''; played = true;
    playB.textContent = 'Running…';
    say('<strong>Before you type anything</strong> the app has already written the first part of the string: a system prompt, wrapped in marker tokens. It shapes every reply and you normally never see it.');
    // pauses are sized to the caption: roughly a tenth of a second per word
    if (!(await turn('system', SYS[sys], k))) return;
    if (!(await run.wait(3400, k))) return;
    say('<strong>Your message</strong> is appended to the same string, wrapped in its own markers.');
    if (!(await turn('user', USER[0], k))) return;
    if (!(await run.wait(2200, k))) return;
    mk('assistant', '<|assistant|>'); paint();
    say('<strong>The app adds one more marker and stops typing.</strong> The string now ends mid-conversation, right where an assistant’s reply would begin. The most likely continuation of that string is… a reply.');
    if (!(await run.wait(4600, k))) return;
    segs.pop();
    if (!(await turn('assistant', REPLY[sys][0], k))) return;
    say('<strong>The reply ends with an end-of-turn marker</strong> — a token the model itself produced. The app is watching for it, and that is the only reason the model stops there.');
    if (!(await run.wait(4400, k))) return;
    say('<strong>Your second message.</strong> The model kept nothing from a moment ago. The app sends the <em>entire</em> string again — system prompt, your first message, its own first reply — with the new message on the end.');
    paint(true);
    if (!(await run.wait(4200, k))) return;
    if (!(await turn('user', USER[1], k))) return;
    if (!(await run.wait(900, k))) return;
    if (!(await turn('assistant', REPLY[sys][1], k))) return;
    if (!stop) {
      say('<strong>With the stop switched off, nothing tells it to halt.</strong> It simply keeps predicting the most likely next text — which, after an assistant turn, is a user turn. So it writes your next message for you, then answers it.');
      if (!(await run.wait(4200, k))) return;
      for (const r of RUNAWAY) { if (!(await turn(r[0], r[1], k, true))) return; if (!(await run.wait(700, k))) return; }
      say('<strong>That is what a language model is underneath a chat app:</strong> a text continuer. The faded turns were never typed by anyone. “Conversation” is a format the string follows, plus an app that knows when to cut.');
    } else say('<strong>Done.</strong> Two turns, and the second request carried all ' + sent() + ' tokens — including everything from the first. Chats get more expensive with every message, and eventually hit a limit. That limit is the next chapter. Try switching the stop marker off and sending again.');
    playB.textContent = 'Send it again';
  }
  playB.addEventListener('click', play);
  L.$('#chatReset').addEventListener('click', reset);
  L.$$('[data-sys]').forEach(b => b.addEventListener('click', () => {
    sys = b.dataset.sys;
    L.$$('[data-sys]').forEach(x => x.classList.toggle('active', x === b));
    if (played) play(); else reset();
  }));
  stopB.addEventListener('click', () => {
    stop = !stop;
    stopB.classList.toggle('active', stop); stopB.setAttribute('aria-pressed', String(stop));
    stopB.textContent = stop ? 'Stop at the end marker: on' : 'Stop at the end marker: off';
    if (played) play();
  });
  reset();
})();
