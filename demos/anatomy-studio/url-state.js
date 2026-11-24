/**
 * Shareable studio state in the query string.
 *
 *   ?assembly=heart&side=R   the open nested study (and side, for paired studies)
 *   ?piece=visceral/liver    the selected piece
 *   ?mode=xray               the finish, when it is not the default
 *   ?system=muscular         the visible-system filter
 *   ?hide=muscular,regions   systems switched off with the checkboxes
 *   ?x=60                    how far apart the body is, 0-100
 *   ?view=parts              the all-parts board
 *   ?pins=skeletal/femur-l~Broken here|…   notes pinned to pieces (ten at most, sixty characters each)
 *
 * Other parameters (stage, quality, debug…) are left untouched.
 */

const KEYS = ['assembly', 'side', 'piece', 'mode', 'system', 'hide', 'x', 'view', 'pins'];
/** A note as it may be stored: one line, no separators, sixty characters. */
export const cleanPin = text => String(text ?? '').replace(/[~|\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);

export function readURL(search = location.search) {
  const p = new URLSearchParams(search);
  const x = Number(p.get('x'));
  return {
    assembly: p.get('assembly'),
    side: (p.get('side') || '').toUpperCase(),
    piece: p.get('piece'),
    mode: p.get('mode'),
    system: p.get('system'),
    hide: (p.get('hide') || '').split(',').filter(Boolean),
    amount: p.has('x') && Number.isFinite(x) ? Math.min(1, Math.max(0, x / 100)) : null,
    board: p.get('view') === 'parts',
    pins: (p.get('pins') || '').split('|').map(s => { const i = s.indexOf('~'); return i > 0 ? [s.slice(0, i), cleanPin(s.slice(i + 1))] : null; }).filter(e => e && e[1]).slice(0, 10)
  };
}

/** Write the state; `push` adds a history entry so Back returns to the previous view. */
export function writeURL(state, { push = false } = {}) {
  const url = new URL(location.href);
  const values = {
    assembly: state.assembly, side: state.side, piece: state.piece, mode: state.mode, system: state.system, hide: (state.hide || []).join(','),
    x: state.amount == null ? null : String(Math.round(state.amount * 100)), view: state.board ? 'parts' : null,
    pins: (state.pins || []).map(([id, text]) => `${id}~${text}`).join('|') || null
  };
  for (const k of KEYS) { if (values[k]) url.searchParams.set(k, values[k]); else url.searchParams.delete(k); }
  // keep piece ids readable: "visceral/liver", not "visceral%2Fliver"
  // and keep bare flags bare: "?debug", not "?debug="
  const href = url.href.replace(/%2F/gi, '/').replace(/%2C/gi, ',').replace(/=(?=&|$)/g, '');
  if (href === location.href) return false;
  history[push ? 'pushState' : 'replaceState'](null, '', href);
  return true;
}
