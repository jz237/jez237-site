// Global scoring — same Cloudflare Worker pattern as the other site games:
//   GET  {SCORES_API}            -> [{initials, score, ts}, ...]
//   POST {SCORES_API} {initials, score, extra}
// Falls back to localStorage when offline.

import { SCORES_API, HS_KEY, NAME_KEY } from './config.js';

let globalCache = null;

export function getLocal() {
  try { return JSON.parse(localStorage.getItem(HS_KEY) || '[]'); }
  catch { return []; }
}

export function saveLocal(rows) {
  try { localStorage.setItem(HS_KEY, JSON.stringify(rows.slice(0, 10))); }
  catch {}
}

export function addLocal(name, score, extra) {
  const rows = getLocal();
  rows.push({ name, score, extra });
  rows.sort((a, b) => b.score - a.score);
  saveLocal(rows);
  return rows;
}

export function lastInitials() {
  return localStorage.getItem(NAME_KEY) || (getLocal()[0]?.name ?? '');
}

export function cleanInitials(raw) {
  return (raw || 'AAA').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'AAA';
}

export async function fetchGlobal(force = false) {
  if (globalCache && !force) return globalCache;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(SCORES_API, { signal: ctl.signal });
    clearTimeout(timer);
    const data = await r.json();
    const rows = Array.isArray(data) ? data : (data.scores || []);
    globalCache = rows
      .map(r => ({ name: r.initials || r.name || '???', score: r.score | 0 }))
      .sort((a, b) => b.score - a.score);
  } catch {
    globalCache = null;
  }
  return globalCache;
}

export async function submitScore(initials, score, extra) {
  localStorage.setItem(NAME_KEY, initials);
  addLocal(initials, score, extra);
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    await fetch(SCORES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score, extra }),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    globalCache = null;
    return true;
  } catch {
    return false;
  }
}
