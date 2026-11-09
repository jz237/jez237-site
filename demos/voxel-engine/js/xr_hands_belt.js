// The belt of a player with nothing in their hands: one board of tiles, the
// tools first and under them what the controllers' other buttons do. With
// joints it floats over the open palm of the hand without the tool and a
// tile is touched with the other hand's index finger; without them it hangs
// low in front and a tile is chosen by looking at it and pinching. This file
// is the board itself: where the tiles are, what is written on them, and
// which one a point of the board falls on. xr_hands.js decides where it
// hangs and what a tile does; xr_overlay.js draws it.
import { TOOLS } from './game_hud.js';

// The board's picture in pixels, and its size in metres where it hangs low
// in front and over a palm (the same picture, smaller).
export const BELT = { W: 1024, H: 640, HEAD: 66, TILE: 100, GAP: 10, COLS: 6, HOME: [0.64, 0.4], PALM: [0.288, 0.18] };

// What is under the tools. `id` is what xr_hands.js acts on.
export const ACTIONS = [
  { id: 'alt', label: 'Second', sub: 'set off, throw' },
  { id: 'left', label: 'Turn', sub: 'left' },
  { id: 'right', label: 'Turn', sub: 'right' },
  { id: 'pause', label: 'Pause', sub: '' },
  { id: 'help', label: 'Help', sub: 'the gestures' },
  { id: 'leave', label: 'Leave VR', sub: 'back to the page' },
  { id: 'swap', label: 'Swap hands', sub: '' },
  { id: 'stand', label: 'Stand up', sub: 'eyes at 1.65 m' },
  { id: 'lower', label: 'Shorter', sub: '5 cm' },
  { id: 'raise', label: 'Taller', sub: '5 cm' },
  { id: 'smoother', label: 'Smoother', sub: 'cheaper picture' },
  { id: 'sharper', label: 'Sharper', sub: 'finer picture' },
];
const TOOL_ROWS = Math.ceil(TOOLS.length / BELT.COLS);
// Every tile: the tools in the belt's order, then the actions.
export const TILES = [];
for (let i = 0; i < TOOLS.length; i++) TILES.push({ tool: i, id: 'tool', label: TOOLS[i].short || TOOLS[i].name, sub: '' });
for (const a of ACTIONS) TILES.push({ tool: -1, id: a.id, label: a.label, sub: a.sub });
const TILE_W = (BELT.W - BELT.GAP * (BELT.COLS + 1)) / BELT.COLS;

// The rectangle of tile i in the picture: [x, y, w, h].
const RECTS = TILES.map((t, i) => {
  const k = t.tool >= 0 ? i : i - TOOLS.length, row = (t.tool >= 0 ? 0 : TOOL_ROWS) + Math.floor(k / BELT.COLS), col = k % BELT.COLS;
  return [BELT.GAP + col * (TILE_W + BELT.GAP), BELT.HEAD + row * (BELT.TILE + BELT.GAP), TILE_W, BELT.TILE];
});
export function tileRect(i) {
  return RECTS[i];
}

// The tile at (u, v) of the board (0..1 across from its left, 0..1 down
// from its top), or -1. `slack`: pixels by which a tile reaches into the
// gap around it (a finger or a look is not a pixel).
export function tileAt(u, v, slack = BELT.GAP / 2) {
  const x = u * BELT.W, y = v * BELT.H;
  for (let i = 0; i < TILES.length; i++) {
    const r = tileRect(i);
    if (x >= r[0] - slack && x <= r[0] + r[2] + slack && y >= r[1] - slack && y <= r[1] + r[3] + slack) return i;
  }
  return -1;
}

// Paints the board. s: { tool, allowed (mask), note (what to do when the
// game is not in play, or ''), lit (tile under the
// finger, or just chosen, or -1), hand (the tool's: 'left' or 'right'),
// leave (Leave VR has been chosen once and waits for the second time),
// card (a card is up: the Pause tile is its other button),
// status (lines), build }.
export function paintBelt(c, s) {
  const { W, H } = BELT;
  c.fillStyle = '#12161c';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#ffd27a';
  c.fillRect(0, 0, W, 6);
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.fillStyle = '#f4f1ea';
  c.font = 'bold 38px system-ui, sans-serif';
  c.fillText(s.note || (TOOLS[s.tool] ? TOOLS[s.tool].name : 'Empty hands'), 16, 38, W * 0.62);
  c.textAlign = 'right';
  c.fillStyle = '#9aa7b6';
  c.font = '22px system-ui, sans-serif';
  c.fillText(s.build, W - 16, 38, W * 0.34);
  for (let i = 0; i < TILES.length; i++) {
    const t = TILES[i], r = tileRect(i);
    const off = t.tool >= 0 && !(s.allowed & (1 << t.tool)), on = t.tool >= 0 && t.tool === s.tool, lit = i === s.lit;
    // (The way out is the one red tile.)
    c.fillStyle = lit ? '#ffd27a' : t.id === 'leave' ? (s.leave ? '#c0392b' : '#7a231c') : on ? '#3b4a5e' : t.tool >= 0 ? '#222a35' : '#1b2129';
    c.fillRect(r[0], r[1], r[2], r[3]);
    if (on && !lit) { c.fillStyle = '#ffd27a'; c.fillRect(r[0], r[1] + r[3] - 6, r[2], 6); }
    c.textAlign = 'center';
    c.fillStyle = lit ? '#12161c' : off ? '#56606c' : '#f4f1ea';
    c.font = 'bold 30px system-ui, sans-serif';
    const again = t.id === 'leave' && s.leave, other = t.id === 'pause' && s.card;
    c.fillText(again ? 'Leave?' : other ? 'Back' : t.label, r[0] + r[2] / 2, r[1] + (t.sub || t.id === 'swap' || other ? r[3] * 0.38 : r[3] / 2), r[2] - 12);
    const sub = t.id === 'swap' ? `tool in the ${s.hand}` : again ? 'pinch again' : other ? 'the other button' : t.sub;
    if (sub) {
      c.fillStyle = lit ? '#12161c' : t.id === 'leave' ? '#f0c9c4' : '#9aa7b6';
      c.font = '20px system-ui, sans-serif';
      c.fillText(sub, r[0] + r[2] / 2, r[1] + r[3] * 0.72, r[2] - 12);
    }
  }
  // What the device gave and what was made of it (xr.js: status), for the
  // player to read out.
  c.textAlign = 'left';
  c.fillStyle = '#c9d3df';
  c.font = '22px system-ui, sans-serif';
  const top = BELT.HEAD + (TOOL_ROWS + Math.ceil(ACTIONS.length / BELT.COLS)) * (BELT.TILE + BELT.GAP) + 20;
  for (let i = 0; i < s.status.length && i < 3; i++) c.fillText(s.status[i], 16, top + i * 34, W - 32);
}

// The sign's lines: what each hand does, for the hands this headset gives.
// tool, other: 'Right' / 'Left'. joints: the fingers are seen. note: what
// to do when the game is not in play, or ''. free: the session is in the
// sandbox, where nothing is billed. full: everything (the Help tile, the
// open palm); else the three lines a first pinch needs, in large type.
// still: in this build a blast leaves the body of a player in a headset
// where it stands (xr_play.js asks the engine for it).
export function helpLines(tool, other, joints, note, free, full, still) {
  if (!full) {
    return {
      title: note || 'Pinch to begin', big: true,
      lines: [[`${tool} hand`, 'look at a spot and pinch: fire'], [`${other} hand`, 'pinch, hold and move the hand: walk'], ['More', 'the Help tile on the belt, low in front of you']],
    };
  }
  const lines = [
    [`${tool} hand`, 'look at a spot and pinch: fire (hold = hold)'],
    [`${other} hand`, 'pinch, hold, move the hand: walk; further: run'],
    ['', 'far out to one side: turn. A short still pinch: jump'],
  ];
  if (joints) {
    lines.push([`${tool} hand`, 'thumb to middle finger: the tool\'s second action']);
    lines.push([`${other} hand`, 'open palm towards your face: the belt; touch a tile']);
  }
  lines.push(['Belt', 'look at a tile and pinch: tools, pause, Swap hands']);
  lines.push(['', '(left-handed), your height; the red tile leaves VR']);
  if (free) lines.push(['Sandbox', 'everything is free']);
  if (still) {
    lines.push(['', 'A blast does not move you in a headset;']);
    lines.push(['', 'it can take the ground you stand on']);
  }
  return { title: note || 'Help', big: false, lines };
}

// The share of the sign's height its short form takes (xr_overlay.js
// shows that much of the picture).
export const SIGN_SHORT = 0.56;

// The sign's picture: the title, a line for each thing a hand does (who in
// one colour, what in another), and under a rule the build and what the
// device gave. W x H pixels; the short form (s.big) in larger type within
// the top SIGN_SHORT of them.
export function paintSign(c, W, H, s) {
  if (s.big) H = Math.round(H * SIGN_SHORT);
  const size = s.big ? 46 : 36, pitch = s.big ? 82 : 58, col = s.big ? 300 : 250;
  c.fillStyle = '#12161c';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#ffd27a';
  c.fillRect(0, 0, W, 10);
  c.textBaseline = 'middle';
  c.textAlign = 'left';
  c.fillStyle = '#f4f1ea';
  c.font = 'bold 84px system-ui, sans-serif';
  c.fillText(s.title, 40, 84, W - 80);
  let y = s.big ? 196 : 178;
  for (const [who, what] of s.lines) {
    c.fillStyle = '#ffd27a';
    c.font = `bold ${size}px system-ui, sans-serif`;
    c.fillText(who, 40, y, col - 60);
    c.fillStyle = '#f4f1ea';
    c.font = `${size}px system-ui, sans-serif`;
    c.fillText(what, col, y, W - col - 40);
    y += pitch;
  }
  y = Math.max(y + 4, H - 44 * s.foot.length - 26);
  c.fillStyle = '#2a3340';
  c.fillRect(40, y - 22, W - 80, 2);
  c.font = '28px system-ui, sans-serif';
  for (let i = 0; i < s.foot.length; i++) {
    c.fillStyle = i === 0 ? '#ffd27a' : '#9aa7b6';
    c.fillText(s.foot[i], 40, y + 12 + i * 44, W - 80);
  }
}

// Turns the board b (its middle b.c) to face the point (x, y, z), upright:
// b.n out of its face, b.r along it to the reader's right, b.u up it.
export function facePoint(b, x, y, z) {
  let nx = x - b.c[0], ny = y - b.c[1], nz = z - b.c[2];
  const nl = Math.hypot(nx, ny, nz) || 1;
  nx /= nl; ny /= nl; nz /= nl;
  let rx = nz, rz = -nx;
  const rl = Math.hypot(rx, rz) || 1;
  rx /= rl; rz /= rl;
  b.n[0] = nx; b.n[1] = ny; b.n[2] = nz;
  b.r[0] = rx; b.r[1] = 0; b.r[2] = rz;
  b.u[0] = ny * rz; b.u[1] = nz * rx - nx * rz; b.u[2] = -ny * rx;
}

// The joints of a hand's list of 25 that say how its palm lies.
const WRIST = 0, INDEX_KNUCKLE = 6, MIDDLE_KNUCKLE = 11, PINKY_KNUCKLE = 21, TIPS = [9, 14, 19, 24];
// A finger whose tip is this far from the wrist is stretched out.
const STRETCHED = 0.115;

// How a hand's palm lies, from its 25 joints p (x, y, z each) and the head
// (a matrix): out.facing is 1 when the palm looks straight at the eyes and
// -1 when its back does, out.open whether the fingers are stretched out,
// out.c the middle of the palm, out.top the height of its highest joint.
export function palmOf(p, side, head, out) {
  const at = (i, k) => p[i * 3 + k];
  const ax = at(INDEX_KNUCKLE, 0) - at(WRIST, 0), ay = at(INDEX_KNUCKLE, 1) - at(WRIST, 1), az = at(INDEX_KNUCKLE, 2) - at(WRIST, 2);
  const bx = at(PINKY_KNUCKLE, 0) - at(WRIST, 0), by = at(PINKY_KNUCKLE, 1) - at(WRIST, 1), bz = at(PINKY_KNUCKLE, 2) - at(WRIST, 2);
  // Out of the palm: index knuckle x little-finger knuckle from the wrist
  // on a right hand, the other way round on a left.
  const sgn = side === 'left' ? -1 : 1;
  let nx = (ay * bz - az * by) * sgn, ny = (az * bx - ax * bz) * sgn, nz = (ax * by - ay * bx) * sgn;
  const nl = Math.hypot(nx, ny, nz) || 1;
  nx /= nl; ny /= nl; nz /= nl;
  const c = out.c;
  for (let k = 0; k < 3; k++) c[k] = (at(WRIST, k) + at(MIDDLE_KNUCKLE, k)) / 2;
  const hx = head[12] - c[0], hy = head[13] - c[1], hz = head[14] - c[2], hl = Math.hypot(hx, hy, hz) || 1;
  out.facing = (nx * hx + ny * hy + nz * hz) / hl;
  let stretched = 0, top = -Infinity;
  for (const t of TIPS) if (Math.hypot(at(t, 0) - at(WRIST, 0), at(t, 1) - at(WRIST, 1), at(t, 2) - at(WRIST, 2)) > STRETCHED) stretched++;
  for (let i = 0; i < 25; i++) top = Math.max(top, at(i, 1));
  out.open = stretched >= 3;
  out.top = top;
  return out;
}

// The bones of a hand as pairs of its joints: the wrist to each finger's
// first joint, then along the finger.
export const BONES = [];
for (const first of [1, 5, 10, 15, 20]) {
  BONES.push([0, first]);
  for (let i = first; i < first + (first === 1 ? 3 : 4); i++) BONES.push([i, i + 1]);
}
