// High scores: top 10 on this device + the site's global game-scores worker.
const API = 'https://game-scores.jez237.workers.dev/scores/';
const INITIALS_KEY = 'jez237_initials';

export class Scores {
  constructor(game) {
    this.game = game;
    this.localKey = game + '_highscores';
    this.global = null;
  }
  local() {
    try { const v = JSON.parse(localStorage.getItem(this.localKey) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
  }
  saveLocal(rows) { try { localStorage.setItem(this.localKey, JSON.stringify(rows)); } catch { /* private mode */ } }
  qualifies(score) {
    if (score <= 0) return false;
    const L = this.local(), G = this.global || [];
    const q = (rows) => rows.length < 10 || score > rows[rows.length - 1].score;
    return q(L) || q(G);
  }
  // the global board, refetched when older than maxAge ms
  async fresh(maxAge = 60000) {
    if (this.global && Date.now() - (this.fetchedAt || 0) < maxAge) return this.global;
    return this.fetchGlobal();
  }
  initials() { try { return (localStorage.getItem(INITIALS_KEY) || 'AAA').slice(0, 3).toUpperCase(); } catch { return 'AAA'; } }
  async fetchGlobal() {
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 7000);
      const res = await fetch(API + this.game, { signal: ctl.signal, cache: 'no-store' });
      clearTimeout(timer);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : data.scores || [];
      this.global = rows.filter((r) => r && typeof r.score === 'number').sort((a, b) => b.score - a.score).slice(0, 10);
      this.fetchedAt = Date.now();
    } catch { this.global = null; }
    return this.global;
  }
  async submit(initials, score, level) {
    initials = (initials || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
    try { localStorage.setItem(INITIALS_KEY, initials); } catch { /* ignore */ }
    const e = { initials, score: Math.floor(score), level, ts: Date.now() };
    const rows = [...this.local(), e].sort((a, b) => b.score - a.score || a.ts - b.ts).slice(0, 10);
    this.saveLocal(rows);
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 7000);
      await fetch(API + this.game, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initials, score: Math.max(0, Math.floor(score)), level }), signal: ctl.signal });
      clearTimeout(timer);
    } catch { /* offline */ }
    return e;
  }
}
