/**
 * The global high scores, out where they can be seen — the title screen's top fives and the HUD's HI —
 * as the Classic edition shows them. Each edition has its own board on the site's game-scores worker;
 * this reads the Neon 3D one (a run's score is posted by the high-score board, `jez237/scores.ts`).
 */
export interface Row {
  initials: string;
  score: number;
  level?: number;
}

// The Neon 3D edition's own board; the Classic edition keeps `neon-myriapod`.
const API = 'https://game-scores.jez237.workers.dev/scores/millipede-neon';
const LOCAL_KEY = 'millipede-neon_highscores';

export async function globalTop(): Promise<Row[] | null> {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 7000);
    const res = await fetch(API, { signal: ctl.signal, cache: 'no-store' });
    clearTimeout(timer);
    const data = await res.json();
    const rows = (Array.isArray(data) ? data : data.scores || []) as Row[];
    return rows.filter((r) => r && typeof r.score === 'number').sort((a, b) => b.score - a.score).slice(0, 10);
  } catch {
    return null;
  }
}

export function localTop(): Row[] {
  try {
    const rows = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(rows) ? (rows as Row[]).sort((a, b) => b.score - a.score).slice(0, 10) : [];
  } catch {
    return [];
  }
}

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const icon = (i: number) => (i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : '✦');

function column(title: string, cls: string, rows: Row[] | null, empty: string): string {
  const body = rows === null
    ? `<li class="note">${empty}</li>`
    : rows.length
      ? rows.slice(0, 5).map((r, i) => `<li${i === 0 ? ' class="top"' : ''}><b>${i + 1}.</b><i>${icon(i)}</i><span>${esc(r.initials)}</span><em>${Math.floor(r.score).toLocaleString('en-US')}</em><small>W${esc(r.level ?? '–')}</small></li>`).join('')
      : '<li class="note">No scores yet</li>';
  return `<div class="board ${cls}"><h3>${title}</h3><ol>${body}</ol></div>`;
}

/** The title screen's two top fives, side by side. `global` undefined: still loading. */
export function renderTitle(el: HTMLElement, local: Row[], global: Row[] | null | undefined): void {
  el.innerHTML =
    column('🌐 GLOBAL TOP 5', 'global', global === undefined ? null : global, global === undefined ? 'Loading…' : 'Global board offline') +
    column('🏠 YOUR TOP 5', 'local', local, '');
}
