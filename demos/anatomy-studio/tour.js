/**
 * Guided tours: a card on the stage that steps through a list of stops.
 *
 * A stop is { title, text, run } where `text` is a string or a function returning one (it may be async, descriptions
 * load on demand) and `run` moves the studio to the stop. The studio builds the stops; this module only drives them.
 */

export function createTour({ onStart, onEnd }) {
  const el = id => document.getElementById(id);
  const t = { stops: [], at: -1, name: '', token: 0, narrate: false };
  const voice = 'speechSynthesis' in window ? window.speechSynthesis : null;
  /** Read a stop aloud with the browser's own voice, if narration is on. */
  function say(text) { if (!voice) return; voice.cancel(); if (!t.narrate || !text) return; const u = new SpeechSynthesisUtterance(text); u.rate = 0.96; voice.speak(u); }
  const active = () => t.at >= 0;

  async function show(i) {
    if (i < 0 || i >= t.stops.length) return;
    t.at = i;
    const token = ++t.token;
    const stop = t.stops[i];
    el('tour-card').hidden = false;
    el('tour-step').textContent = `${t.name} · ${i + 1} / ${t.stops.length}`;
    el('tour-title').textContent = stop.title;
    el('tour-text').textContent = typeof stop.text === 'string' ? stop.text : '';
    el('tour-prev').disabled = i === 0;
    el('tour-next').textContent = i === t.stops.length - 1 ? 'Finish' : 'Next →';
    try { await stop.run?.(); } catch (error) { console.warn('tour stop failed', error); }
    const text = typeof stop.text === 'function' ? await stop.text() : stop.text;
    if (token !== t.token) return;   // ignore a description that arrives after the visitor moved on
    el('tour-text').textContent = text;
    say(`${stop.title}. ${text}`);
  }

  function start(name, stops) {
    if (!stops.length) return;
    if (active()) end();
    t.name = name;
    t.stops = stops;
    onStart?.();
    show(0);
    el('tour-next').focus({ preventScroll: true });
  }

  function end() {
    if (!active()) return;
    t.at = -1;
    t.token++;
    el('tour-card').hidden = true;
    voice?.cancel();
    onEnd?.();
  }

  el('tour-prev').onclick = () => show(t.at - 1);
  el('tour-next').onclick = () => (t.at === t.stops.length - 1 ? end() : show(t.at + 1));
  el('tour-end').onclick = end;
  el('tour-narrate').hidden = !voice;
  el('tour-narrate').onclick = () => { t.narrate = !t.narrate; el('tour-narrate').setAttribute('aria-pressed', t.narrate); if (t.narrate && active()) say(`${t.stops[t.at].title}. ${el('tour-text').textContent}`); else voice?.cancel(); };

  return {
    get active() { return active(); },
    start, end,
    next: () => (active() && t.at < t.stops.length - 1 ? show(t.at + 1) : undefined),
    prev: () => (active() ? show(t.at - 1) : undefined),
    getState: () => ({ active: active(), name: t.name, at: t.at, stops: t.stops.length, narrate: t.narrate })
  };
}
