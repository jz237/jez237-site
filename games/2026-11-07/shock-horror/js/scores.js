// High scores: top 10 on this device + the site's global game-scores worker.
// Test runs (?test, ?autoplay, ?fixed, ?noscores, ?demo, ?playthrough or a WebDriver browser) never post to the real boards.
const API = 'https://game-scores.jez237.workers.dev/scores/';
const INITIALS_KEY = 'sh.initials', SITE_INITIALS = 'jez237_initials';   // the site-wide key is only a default
const P = new URLSearchParams(location.search);
export const NO_POST = P.has('test') || P.has('autoplay') || P.has('fixed') || P.has('noscores') || P.has('demo') || P.has('playthrough') || !!navigator.webdriver;
// the live game also blocks a single submit (an autopilot-flown run, the attract demo, the AI playthrough)
export const posted = [];   // what this page sent (the console check reads it)

export class Scores {
  constructor(game) { this.game = game; this.localKey = 'sh.hs.' + game; this.global = null; }
  local() { try { const v = JSON.parse(localStorage.getItem(this.localKey) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
  saveLocal(rows) { try { localStorage.setItem(this.localKey, JSON.stringify(rows)); } catch { /* private mode */ } }
  qualifies(score) {
    if (score <= 0) return false;
    const q = (rows) => rows.length < 10 || score > rows[rows.length - 1].score;
    return q(this.local()) || q(this.global || []);
  }
  best() { const L = this.local(); return L.length ? L[0].score : 0; }
  initials() { try { return (localStorage.getItem(INITIALS_KEY) || localStorage.getItem(SITE_INITIALS) || 'AAA').replace(/[^A-Z0-9]/gi, '').slice(0, 3).toUpperCase().padEnd(3, 'A'); } catch { return 'AAA'; } }
  async fresh(maxAge = 60000) { if (this.global && Date.now() - (this.fetchedAt || 0) < maxAge) return this.global; return this.fetchGlobal(); }
  async fetchGlobal() {
    if (NO_POST && (P.has('test') || P.has('fixed'))) return (this.global = []);
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
  async submit(initials, score, level, o = {}) {
    initials = (initials || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
    try { localStorage.setItem(INITIALS_KEY, initials); localStorage.setItem(SITE_INITIALS, initials); } catch { /* ignore */ }
    const e = { initials, score: Math.floor(score), level, extra: String(o.extra || '').slice(0, 40), ts: Date.now() };
    const rows = [...this.local(), e].sort((a, b) => b.score - a.score || a.ts - b.ts).slice(0, 10);
    this.saveLocal(rows);
    if (NO_POST || o.local) return e;
    posted.push(this.game);
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 7000);
      await fetch(API + this.game, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials, score: Math.max(0, Math.floor(score)), level, extra: String(o.extra || '').slice(0, 40) }), signal: ctl.signal });
      clearTimeout(timer);
    } catch { /* offline */ }
    this.fetchedAt = 0;   // the next board view refetches
    return e;
  }
}
