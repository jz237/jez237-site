// High scores: top 10 on this device + the site's global game-scores worker (one board per mode and
// difficulty: voltmaze-2026, voltmaze-2026-easy/-hard/-nightmare, voltmaze-2026-endless[-easy|-hard|-nightmare]).
// Test and watch-only runs (?test, ?autoplay, ?fixed, ?noscores, ?demo, ?playthrough, the dev shortcuts ?boss,
// ?seed, ?room=N, ?sector or a WebDriver browser) never post to the real boards; the game also never posts scores from the demo or the AI playthrough.
const API = 'https://game-scores.jez237.workers.dev/scores/';
const INITIALS_KEY = 'vm.initials', SITE_INITIALS = 'jez237_initials';   // the site-wide key is only read, as a default
const P = new URLSearchParams(location.search);
// Dev shortcuts that start a run part-way or on a known layout (?boss, ?seed=N, ?room=N, ?sector=N) never post
// either. (?room=CODE, an online join link, is fine: co-op runs don't post.)
const SHORTCUT = P.has('boss') || P.has('seed') || P.has('sector') || (P.has('room') && P.get('room') !== '' && !isNaN(+P.get('room')));
export const NO_POST = P.has('test') || P.has('autoplay') || P.has('fixed') || P.has('noscores') || P.has('demo') || P.has('playthrough') || SHORTCUT || !!navigator.webdriver;

export class Scores {
  constructor(game) { this.game = game; this.localKey = 'vm.hs.' + game; this.global = null; }
  local() { try { const v = JSON.parse(localStorage.getItem(this.localKey) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
  saveLocal(rows) { try { localStorage.setItem(this.localKey, JSON.stringify(rows)); } catch { /* private mode */ } }
  qualifies(score) {
    if (score <= 0) return false;
    const q = (rows) => rows.length < 10 || score > rows[rows.length - 1].score;
    return q(this.local()) || q(this.global || []);
  }
  best() { const L = this.local(); return L.length ? L[0].score : 0; }
  initials() { try { return (localStorage.getItem(INITIALS_KEY) || localStorage.getItem(SITE_INITIALS) || 'AAA').slice(0, 3).toUpperCase(); } catch { return 'AAA'; } }
  async fresh(maxAge = 60000) { if (this.global && Date.now() - (this.fetchedAt || 0) < maxAge) return this.global; return this.fetchGlobal(); }
  async fetchGlobal() {
    if (NO_POST && P.has('test')) return (this.global = []);
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(API + this.game, { signal: ctl.signal, cache: 'no-store' });
      clearTimeout(timer);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.scores || [];
      this.global = rows.filter((r) => r && typeof r.score === 'number').sort((a, b) => b.score - a.score).slice(0, 10);
      this.fetchedAt = Date.now();
    } catch { this.global = null; }
    return this.global;
  }
  // extra: a short note shown on the board (how far the run got, e.g. "S3" or "R24")
  async submit(initials, score, extra) {
    initials = (initials || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
    try { localStorage.setItem(INITIALS_KEY, initials); } catch { /* ignore */ }
    const e = { initials, score: Math.floor(score), extra: String(extra || ''), ts: Date.now() };
    const rows = [...this.local(), e].sort((a, b) => b.score - a.score || a.ts - b.ts).slice(0, 10);
    this.saveLocal(rows);
    if (NO_POST) return e;
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 7000);
      await fetch(API + this.game, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials, score: Math.max(0, Math.floor(score)), extra: String(extra || '').slice(0, 24) }), signal: ctl.signal });
      clearTimeout(timer);
    } catch { /* offline */ }
    return e;
  }
}
