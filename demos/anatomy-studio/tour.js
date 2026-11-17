/**
 * Guided tours: a card on the stage that steps through a list of stops.
 *
 * A stop is { title, text, run } where `text` is a string or a function returning one (it may be async, descriptions
 * load on demand) and `run` moves the studio to the stop. The studio builds the stops; this module only drives them.
 */

export function createTour({ onStart, onEnd }) {
  const el = id => document.getElementById(id);
  const t = { stops: [], at: -1, name: '', token: 0 };
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
    if (typeof stop.text === 'function') {
      const text = await stop.text();
      if (token === t.token) el('tour-text').textContent = text;   // ignore a description that arrives after the visitor moved on
    }
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
    onEnd?.();
  }

  el('tour-prev').onclick = () => show(t.at - 1);
  el('tour-next').onclick = () => (t.at === t.stops.length - 1 ? end() : show(t.at + 1));
  el('tour-end').onclick = end;

  return {
    get active() { return active(); },
    start, end,
    next: () => (active() && t.at < t.stops.length - 1 ? show(t.at + 1) : undefined),
    prev: () => (active() ? show(t.at - 1) : undefined),
    getState: () => ({ active: active(), name: t.name, at: t.at, stops: t.stops.length })
  };
}
