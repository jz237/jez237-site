// High scores: top 10 on this device + the site's global game-scores worker (one board per mode and
// difficulty: rimstorm-2026[-easy|-hard|-nightmare] and rimstorm-2026-endless[-easy|-hard|-nightmare]).
// Test runs (?test, ?autoplay, ?fixed, ?noscores, ?demo, ?playthrough or a WebDriver browser) never post.
const API = 'https://game-scores.jez237.workers.dev/scores/';
const INITIALS_KEY = 'rs.initials', SHARED_INITIALS = 'jez237_initials'; // the site-wide key is only read, as a default
const P = new URLSearchParams(location.search);
export const NO_POST = P.has('test') || P.has('autoplay') || P.has('fixed') || P.has('noscores') || P.has('demo') || P.has('playthrough') || !!navigator.webdriver;

export class Scores {
  constructor(game) { this.game = game; this.localKey = 'rs.hs.' + game; this.global = null; }
  local() { try { const v = JSON.parse(localStorage.getItem(this.localKey) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
  saveLocal(rows) { try { localStorage.setItem(this.localKey, JSON.stringify(rows)); } catch { /* private mode */ } }
  qualifies(score) {
    if (score <= 0) return false;
    const q = (rows) => rows.length < 10 || score > rows[rows.length - 1].score;
    return q(this.local()) || q(this.global || []);
  }
  best() { const L = this.local(); return L.length ? L[0].score : 0; }
  initials() { try { return (localStorage.getItem(INITIALS_KEY) || localStorage.getItem(SHARED_INITIALS) || 'AAA').replace(/[^A-Za-z0-9]/g, '').padEnd(3, 'A').slice(0, 3).toUpperCase(); } catch { return 'AAA'; } }
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
  async submit(initials, score, level, extra = '') {
    initials = (initials || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
    try { localStorage.setItem(INITIALS_KEY, initials); } catch { /* ignore */ }
    const e = { initials, score: Math.floor(score), level, extra, ts: Date.now() };
    const rows = [...this.local(), e].sort((a, b) => b.score - a.score || a.ts - b.ts).slice(0, 10);
    this.saveLocal(rows);
    const body = { initials, score: Math.max(0, Math.floor(score)), level, extra: String(extra).slice(0, 40) };
    // what would go to the world board (the systems check reads this; nothing is sent when NO_POST)
    Scores.last = { board: this.game, body, sent: !NO_POST };
    if (NO_POST) return e;
    try {
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 7000);
      await fetch(API + this.game, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
      clearTimeout(timer);
      this.global = null; // the next look at the board fetches it fresh, with this score on it
    } catch { /* offline */ }
    return e;
  }
}
