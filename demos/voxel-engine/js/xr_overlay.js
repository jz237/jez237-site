// What only VR draws, straight into the headset's framebuffer after the
// eyes: boxes (the tool in the hand, the other hand, the aim line and its
// dot), one textured panel (the wrist readout) and the comfort vignette.
// Display-referred colours, a fixed light: these are instruments, not scene.
// They are not occluded by the world (its depth never reaches this
// framebuffer); among themselves they use the layer's depth buffer.
import { describeProgram, BLEND, CULL, UNIT } from './render_gl.js';
import { FULLSCREEN_VS } from './render_shaders_fx.js';
import { shared as hands, WALK } from './xr_hands.js';
import { BELT, BONES, SIGN_SHORT, paintBelt, paintSign } from './xr_hands_belt.js';
import { mulRigid, invertRigid } from './xr_render.js';
import { mat4Mul } from './mat.js';

const _inv = new Float32Array(16), _room = new Float32Array(16), _p = [0, 0, 0], _q = [0, 0, 0];
const STICK_WALK = [1.0, 0.82, 0.35], STICK_RUN = [1.0, 0.95, 0.6], STICK_TURN = [1.0, 0.3, 0.2];
// o = M * p for a point p.
function toWorld(o, M, p) {
  o[0] = M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12];
  o[1] = M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13];
  o[2] = M[2] * p[0] + M[6] * p[1] + M[10] * p[2] + M[14];
  return o;
}

const SOLID_VS = `
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec4 aColor;   // rgb, a = 1 when lit
uniform mat4 uVP;
uniform vec4 uLight;                    // x = brightness of lit surfaces
out vec3 vColor;
void main() {
  float l = aColor.a > 0.5 ? (0.45 + 0.55 * max(dot(aNormal, vec3(0.38, 0.82, 0.42)), 0.0)) * uLight.x : 1.0;
  vColor = aColor.rgb * l;
  gl_Position = uVP * vec4(aPos, 1.0);
}
`;
const SOLID_FS = `
in vec3 vColor;
out vec4 oColor;
void main() { oColor = vec4(vColor, 1.0); }
`;
const PANEL_VS = `
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aUv;
uniform mat4 uVP;
out vec2 vUv;
void main() { vUv = aUv; gl_Position = uVP * vec4(aPos, 1.0); }
`;
const PANEL_FS = `
uniform sampler2D uTex;
in vec2 vUv;
out vec4 oColor;
void main() { oColor = vec4(texture(uTex, vUv).rgb, 1.0); }
`;
// Darkens the edge of the view while the player is moved by the stick.
// uVignette: centre of the lens in NDC (xy), strength, inner radius.
const VIGNETTE_FS = `
uniform vec4 uVignette;
in vec2 vUv;
out vec4 oColor;
void main() {
  float r = length(vUv * 2.0 - 1.0 - uVignette.xy);
  oColor = vec4(0.0, 0.0, 0.0, uVignette.z * smoothstep(uVignette.w, uVignette.w + 0.35, r));
}
`;
// The cage: a few faint bars that stand still in the player's own room
// while the view is taken from them (a fall, a span ridden down: the world
// goes by, the head has not moved, and the eye is given something that
// agrees with the body). Drawn over the darkened edge and only there.
// uCage: centre of the lens in NDC (xy), strength, the vignette's inner radius.
const CAGE_VS = `
layout(location = 0) in vec3 aPos;
uniform mat4 uVP;
out vec4 vClip;
void main() { vClip = uVP * vec4(aPos, 1.0); gl_Position = vClip; }
`;
const CAGE_FS = `
uniform vec4 uCage;
in vec4 vClip;
out vec4 oColor;
void main() {
  float r = length(vClip.xy / vClip.w - uCage.xy);
  float a = uCage.z * smoothstep(uCage.w, uCage.w + 0.35, r);
  oColor = vec4(vec3(0.62, 0.72, 0.85) * a, a);
}
`;
// Its bars, about the place the head had when it came up: a ring at the
// head's height (the horizon), one 1.2 m under it and one a metre over,
// 2.5 m out, and twelve uprights between the lowest and the highest.
// Triangles, positions only.
export const CAGE = { R: 2.5, LOW: -1.2, HIGH: 1.0, HALF: 0.01, UPRIGHTS: 12, SIDES: 24 };
// How bright a bar is where the edge is fully dark (it is light added to black).
const CAGE_FAINT = 0.3;
function cageVerts() {
  const out = [], C = CAGE;
  const bar = (a, b) => {
    let dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz);
    dx /= len; dy /= len; dz /= len;
    let px = dy, py = -dx, pz = 0;
    if (Math.abs(dz) > 0.9) { px = 0; py = dz; pz = -dy; }
    const pl = Math.hypot(px, py, pz);
    px /= pl; py /= pl; pz /= pl;
    const qx = dy * pz - dz * py, qy = dz * px - dx * pz, qz = dx * py - dy * px, h = C.HALF;
    const at = (e, u, w) => [e[0] + (px * u + qx * w) * h, e[1] + (py * u + qy * w) * h, e[2] + (pz * u + qz * w) * h];
    const corner = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    for (let k = 0; k < 4; k++) {
      const [u0, w0] = corner[k], [u1, w1] = corner[(k + 1) % 4];
      const p0 = at(a, u0, w0), p1 = at(a, u1, w1), p2 = at(b, u1, w1), p3 = at(b, u0, w0);
      out.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
    }
  };
  const on = (i, n, y) => [Math.sin(i / n * 2 * Math.PI) * C.R, y, -Math.cos(i / n * 2 * Math.PI) * C.R];
  for (const y of [C.LOW, 0, C.HIGH]) for (let i = 0; i < C.SIDES; i++) bar(on(i, C.SIDES, y), on(i + 1, C.SIDES, y));
  for (let i = 0; i < C.UPRIGHTS; i++) bar(on(i + 0.5, C.UPRIGHTS, C.LOW), on(i + 0.5, C.UPRIGHTS, C.HIGH));
  return new Float32Array(out);
}

const FLOATS = 10, MAX_VERTS = 36 * 240;
// Corner signs of the twelve triangles of a box, three faces at a time:
// [axis, sign] per face, then the two other axes.
const FACES = [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]];
const QUAD = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
export const PANEL_W = 384, PANEL_H = 216;
// The hands' boards (xr_hands.js says what is on them and where the belt
// is): the sign and the belt, each a panel with a picture of its own.
export const SIGN_W = 1024, SIGN_H = 896;
const board = (w, h) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx2d: canvas.getContext('2d'), verts: new Float32Array(6 * 5), on: false, key: null, dirty: true, vao: null, buf: null, tex: null };
};

export class XrOverlay {
  constructor(renderer) {
    this.renderer = renderer;
    this.verts = new Float32Array(MAX_VERTS * FLOATS);
    this._half = new Float32Array(9);
    this.n = 0;
    this.panel = new Float32Array(6 * 5);
    this.panelOn = false;
    this.canvas = document.createElement('canvas');
    this.canvas.width = PANEL_W;
    this.canvas.height = PANEL_H;
    this.ctx2d = this.canvas.getContext('2d');
    this.text = null;
    this.textDirty = true;
    this._st = null;
    this.mirrorOk = true;
    this.mirrored = 0;
    // The hands' boards. The sign hangs in the world (`at`), once hung (`up`).
    this.sign = Object.assign(board(SIGN_W, SIGN_H), { at: [0, 0, 0], up: false });
    this.belt = board(BELT.W, BELT.H);
    this.boards = [this.sign, this.belt];
    this._eye = [0, 0, 0];
    // The cage: its triangles, where it stands (cage -> world this frame),
    // how strongly it is drawn (0: not at all).
    this.cageVerts = cageVerts();
    this.cageM = new Float32Array(16);
    this.cageVP = new Float32Array(16);
    this.cageOn = 0;
  }

  // GL objects die with a lost context; the renderer makes a new state
  // object when it rebuilds, which is how this one notices.
  _init() {
    const r = this.renderer, gl = r.gl;
    if (this._st === r.state) return;
    this._st = r.state;
    this.pSolid = describeProgram(SOLID_VS, SOLID_FS, '', 'vr solid');
    this.pPanel = describeProgram(PANEL_VS, PANEL_FS, '', 'vr panel');
    this.pVignette = describeProgram(FULLSCREEN_VS, VIGNETTE_FS, '', 'vr vignette');
    this.pCage = describeProgram(CAGE_VS, CAGE_FS, '', 'vr cage');
    this.cageVao = gl.createVertexArray();
    this.cageBuf = gl.createBuffer();
    gl.bindVertexArray(this.cageVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cageBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.cageVerts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    this.vao = gl.createVertexArray();
    this.buf = gl.createBuffer();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, this.verts.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, FLOATS * 4, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, FLOATS * 4, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, FLOATS * 4, 24);
    this.panelVao = gl.createVertexArray();
    this.panelBuf = gl.createBuffer();
    gl.bindVertexArray(this.panelVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.panelBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.panel.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
    for (const b of this.boards) {
      b.vao = gl.createVertexArray();
      b.buf = gl.createBuffer();
      gl.bindVertexArray(b.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf);
      gl.bufferData(gl.ARRAY_BUFFER, b.verts.byteLength, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
      gl.bindVertexArray(null);
      r.state.vaoObj = undefined;
      b.tex = gl.createTexture();
      r.state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, b.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      b.dirty = true;
    }
    this.tex = gl.createTexture();
    r.state.texForUpload(UNIT.uTex, gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.textDirty = true;
  }

  // Frees what _init made (leaving VR). Nothing to do on a lost context.
  dispose() {
    const r = this.renderer, gl = r.gl;
    if (this._st !== r.state || gl.isContextLost()) { this._st = null; return; }
    for (const p of [this.pSolid, this.pPanel, this.pVignette, this.pCage]) if (p.p) gl.deleteProgram(p.p);
    gl.deleteVertexArray(this.cageVao);
    gl.deleteBuffer(this.cageBuf);
    gl.deleteVertexArray(this.vao);
    gl.deleteVertexArray(this.panelVao);
    gl.deleteBuffer(this.buf);
    gl.deleteBuffer(this.panelBuf);
    gl.deleteTexture(this.tex);
    for (const b of this.boards) { gl.deleteVertexArray(b.vao); gl.deleteBuffer(b.buf); gl.deleteTexture(b.tex); }
    r.state.units[UNIT.uTex] = null;
    r.state.prog = null;
    r.state.vaoObj = undefined;
    this._st = null;
  }

  // The cage for this frame: `room` is room -> world, `c` the place in the
  // room it stands about, `strength` 0..1 (0: none).
  cage(room, c, strength) {
    this.cageOn = strength;
    if (!(strength > 0.01)) return;
    const m = this.cageM;
    m.set(room);
    m[12] = room[0] * c[0] + room[4] * c[1] + room[8] * c[2] + room[12];
    m[13] = room[1] * c[0] + room[5] * c[1] + room[9] * c[2] + room[13];
    m[14] = room[2] * c[0] + room[6] * c[1] + room[10] * c[2] + room[14];
  }

  begin() {
    this.n = 0;
    this.cageOn = 0;
    this.panelOn = false;
    this.sign.on = this.belt.on = false;
    this.noLine = false;
  }

  // A box given by its centre and three half-extent vectors (world,
  // metres), as twelve numbers: nothing is allocated per box or per frame.
  obb(cx, cy, cz, ax, ay, az, bx, by, bz, ex, ey, ez, r, g, bl, lit = 1) {
    if (this.n + 36 > MAX_VERTS) return;
    const v = this.verts, h = this._half;
    h[0] = ax; h[1] = ay; h[2] = az; h[3] = bx; h[4] = by; h[5] = bz; h[6] = ex; h[7] = ey; h[8] = ez;
    let o = this.n * FLOATS;
    for (let f = 0; f < 6; f++) {
      const n = FACES[f][0] * 3, s = FACES[f][1], u = (n + 3) % 9, w = (n + 6) % 9;
      const nl = Math.hypot(h[n], h[n + 1], h[n + 2]) || 1;
      for (let k = 0; k < 6; k++) {
        const qu = QUAD[k][0], qw = QUAD[k][1];
        v[o] = cx + h[n] * s + h[u] * qu + h[w] * qw;
        v[o + 1] = cy + h[n + 1] * s + h[u + 1] * qu + h[w + 1] * qw;
        v[o + 2] = cz + h[n + 2] * s + h[u + 2] * qu + h[w + 2] * qw;
        v[o + 3] = h[n] * s / nl; v[o + 4] = h[n + 1] * s / nl; v[o + 5] = h[n + 2] * s / nl;
        v[o + 6] = r; v[o + 7] = g; v[o + 8] = bl; v[o + 9] = lit;
        o += FLOATS;
      }
    }
    this.n += 36;
  }

  // Boxes of a model ([x0, y0, z0, x1, y1, z1, r, g, b] each, metres in the
  // model's own axes) placed by the pose matrix m.
  model(m, boxes) {
    // A ray that starts between the eyes (a pinch's, xr_hands.js) carries
    // no tool: it would be drawn through the player's face.
    // Nor is the line from it to the dot, which xr_play.js draws next: seen
    // from two eyes either side of where it starts it is a streak across
    // the middle of the view. The dot stays.
    if (hands.active && hands.bare) { this.noLine = true; return; }
    for (const q of boxes) {
      const cx = (q[0] + q[3]) / 2, cy = (q[1] + q[4]) / 2, cz = (q[2] + q[5]) / 2;
      const hx = Math.abs(q[3] - q[0]) / 2, hy = Math.abs(q[4] - q[1]) / 2, hz = Math.abs(q[5] - q[2]) / 2;
      this.obb(m[0] * cx + m[4] * cy + m[8] * cz + m[12], m[1] * cx + m[5] * cy + m[9] * cz + m[13], m[2] * cx + m[6] * cy + m[10] * cz + m[14],
        m[0] * hx, m[1] * hx, m[2] * hx, m[4] * hy, m[5] * hy, m[6] * hy, m[8] * hz, m[9] * hz, m[10] * hz, q[6], q[7], q[8]);
    }
  }

  // A thin unlit bar from a to b, `half` metres wide.
  segment(a, b, half, r, g, bl) {
    if (this.noLine) { this.noLine = false; return; }
    let dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz);
    if (!(len > 1e-4)) return;
    dx /= len; dy /= len; dz /= len;
    // Any two directions square to the bar.
    let px = dy, py = -dx, pz = 0;
    if (Math.abs(dz) > 0.9) { px = 0; py = dz; pz = -dy; }
    const pl = Math.hypot(px, py, pz);
    px /= pl; py /= pl; pz /= pl;
    const qx = dy * pz - dz * py, qy = dz * px - dx * pz, qz = dx * py - dy * px;
    this.obb((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, px * half, py * half, pz * half, qx * half, qy * half, qz * half,
      dx * len / 2, dy * len / 2, dz * len / 2, r, g, bl, 0);
  }

  // The panel: `w` x `h` metres centred at c, facing the point `toward`.
  panelAt(c, toward, w, h) {
    this._quad(this.panel, c, toward, w, h);
    this.panelOn = true;
  }

  // The six corners of a `w` x `h` panel at c that faces `toward`, into p.
  _quad(p, c, toward, w, h) {
    let nx = toward[0] - c[0], ny = toward[1] - c[1], nz = toward[2] - c[2];
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl; ny /= nl; nz /= nl;
    // right = up x normal, with the world's up; then the panel's own up.
    let rx = nz, rz = -nx;
    const rl = Math.hypot(rx, rz) || 1;
    rx /= rl; rz /= rl;
    const ux = ny * rz, uy = nz * rx - nx * rz, uz = -ny * rx;
    for (let k = 0; k < 6; k++) {
      const qu = QUAD[k][0] * w / 2, qv = QUAD[k][1] * h / 2, o = k * 5;
      p[o] = c[0] + rx * qu + ux * qv; p[o + 1] = c[1] + uy * qv; p[o + 2] = c[2] + rz * qu + uz * qv;
      p[o + 3] = QUAD[k][0] * 0.5 + 0.5; p[o + 4] = 0.5 - QUAD[k][1] * 0.5;
    }
  }

  // The readout: a title, a line under it, a small note, and under those
  // up to three lines of what the device gave and what was made of it
  // (`more`); redrawn only when one of them changes.
  setText(title, line, note, more) {
    const key = title + '\n' + line + '\n' + note + (more ? '\n' + more.join('\n') : '');
    if (key === this.text) return;
    this.text = key;
    this.textDirty = true;
    const c = this.ctx2d;
    c.fillStyle = '#12161c';
    c.fillRect(0, 0, PANEL_W, PANEL_H);
    c.fillStyle = '#2a3340';
    c.fillRect(0, 0, PANEL_W, 4);
    c.textBaseline = 'middle';
    c.fillStyle = '#f4f1ea';
    c.font = 'bold 34px system-ui, sans-serif';
    c.fillText(title, 14, 34, PANEL_W - 28);
    c.fillStyle = '#ffd27a';
    c.font = 'bold 26px system-ui, sans-serif';
    c.fillText(line, 14, 74, PANEL_W - 28);
    c.fillStyle = '#9aa7b6';
    c.font = '18px system-ui, sans-serif';
    c.fillText(note, 14, 106, PANEL_W - 28);
    if (!more) return;
    c.fillStyle = '#2a3340';
    c.fillRect(14, 126, PANEL_W - 28, 1);
    c.fillStyle = '#c9d3df';
    c.font = '19px system-ui, sans-serif';
    for (let i = 0; i < more.length && i < 3; i++) c.fillText(more[i], 14, 146 + i * 26, PANEL_W - 28);
  }

  // The hands' sign (xr_hands.js: what it says, and when): hung at eye
  // height in front of the player. It stays where it was hung; when the
  // player has turned or gone away from it, it is hung again.
  _sign(view) {
    const n = hands.active ? hands.sign : null, h = view.head, sg = this.sign, at = sg.at, e = this._eye;
    if (!n) { sg.up = false; return; }
    // The way the head faces, level (its right-hand axis stays level).
    const fl = Math.hypot(h[0], h[2]) || 1, fx = h[2] / fl, fz = -h[0] / fl;
    const dx = at[0] - h[12], dz = at[2] - h[14], d = Math.hypot(dx, dz);
    if (!sg.up || d > 2.6 || d < 0.6 || dx * fx + dz * fz < d * 0.6 || Math.abs(at[1] - h[13]) > 0.6) {
      at[0] = h[12] + fx * 1.6; at[1] = h[13] + 0.1; at[2] = h[14] + fz * 1.6;
      sg.up = true;
    }
    if (n.key !== sg.key) {
      sg.key = n.key;
      sg.dirty = true;
      paintSign(sg.ctx2d, SIGN_W, SIGN_H, n);
    }
    e[0] = h[12]; e[1] = h[13]; e[2] = h[14];
    // (The short sign is the top of the picture, and as much of the board.)
    const part = n.big ? SIGN_SHORT : 1;
    this._quad(sg.verts, at, e, 1.04, 1.04 * SIGN_H / SIGN_W * part);
    if (part < 1) for (let k = 0; k < 6; k++) sg.verts[k * 5 + 4] *= part;
    sg.on = true;
  }

  // room -> world this frame, from the head as the eyes were drawn and as
  // the room has it (xr_hands.js keeps the room's).
  _room(view) {
    if (!this.roomOk) { mulRigid(_room, view.head, invertRigid(_inv, hands.head)); this.roomOk = true; }
    return _room;
  }

  // The belt (xr_hands_belt.js: its picture; xr_hands.js: where it is in
  // the room, low in front or over a palm, and what its tiles show).
  _belt(view) {
    const b = hands.belt, bd = this.belt;
    if (!hands.active || !b.on || !hands.headOk) return;
    // (Compared piece by piece: nothing is made per frame to find out
    // that nothing changed.)
    const k = bd.shown || (bd.shown = { tool: -1, allowed: 0, paused: '', lit: -1, hand: '', leave: false, card: false, build: '', status: ['', '', ''] });
    let same = k.tool === b.tool && k.allowed === b.allowed && k.paused === b.note && k.lit === b.lit && k.hand === b.hand && k.leave === b.leave && k.card === b.card && k.build === b.build;
    for (let i = 0; i < 3; i++) if (k.status[i] !== b.status[i]) same = false;
    if (!same) {
      k.tool = b.tool; k.allowed = b.allowed; k.paused = b.note; k.lit = b.lit; k.hand = b.hand; k.leave = b.leave; k.card = b.card; k.build = b.build;
      for (let i = 0; i < 3; i++) k.status[i] = b.status[i];
      bd.dirty = true;
      paintBelt(bd.ctx2d, b);
    }
    const M = this._room(view), v = bd.verts;
    for (let k = 0; k < 6; k++) {
      const qu = QUAD[k][0] * b.w / 2, qv = QUAD[k][1] * b.h / 2, o = k * 5;
      const x = b.c[0] + b.r[0] * qu + b.u[0] * qv, y = b.c[1] + b.r[1] * qu + b.u[1] * qv, z = b.c[2] + b.r[2] * qu + b.u[2] * qv;
      v[o] = M[0] * x + M[4] * y + M[8] * z + M[12];
      v[o + 1] = M[1] * x + M[5] * y + M[9] * z + M[13];
      v[o + 2] = M[2] * x + M[6] * y + M[10] * z + M[14];
      v[o + 3] = QUAD[k][0] * 0.5 + 0.5; v[o + 4] = 0.5 - QUAD[k][1] * 0.5;
    }
    bd.on = true;
  }

  // The hands as the game sees them: a small box at each joint and a bar
  // along each bone; the tips of a pinch the game has taken are lit.
  _joints(view) {
    if (!hands.active || !hands.headOk) return;
    let M = null;
    for (let h = 0; h < 2; h++) {
      const j = h ? hands.joints.right : hands.joints.left;
      if (!j.on) continue;
      M = M || this._room(view);
      const p = j.p, w = this._jw || (this._jw = new Float32Array(75));
      for (let i = 0; i < 25; i++) {
        const x = p[i * 3], y = p[i * 3 + 1], z = p[i * 3 + 2];
        w[i * 3] = M[0] * x + M[4] * y + M[8] * z + M[12];
        w[i * 3 + 1] = M[1] * x + M[5] * y + M[9] * z + M[13];
        w[i * 3 + 2] = M[2] * x + M[6] * y + M[10] * z + M[14];
      }
      for (let k = 0; k < BONES.length; k++) {
        const a = BONES[k][0], b = BONES[k][1];
        _p[0] = w[a * 3]; _p[1] = w[a * 3 + 1]; _p[2] = w[a * 3 + 2];
        _q[0] = w[b * 3]; _q[1] = w[b * 3 + 1]; _q[2] = w[b * 3 + 2];
        this.segment(_p, _q, 0.0035, 0.62, 0.66, 0.72);
      }
      for (let i = 0; i < 25; i++) {
        // Thumb tip, and the index or the middle tip, of a pinch.
        const lit = j.pinch > 0 && (i === 4 || i === (j.pinch === 2 ? 14 : 9)), s = lit ? 0.009 : 0.0055;
        this.obb(w[i * 3], w[i * 3 + 1], w[i * 3 + 2], s, 0, 0, 0, s, 0, 0, 0, s, lit ? 1.0 : 0.9, lit ? 0.82 : 0.9, lit ? 0.35 : 0.92, lit ? 0 : 1);
      }
    }
  }

  // The walking hand's stick (xr_hands.js), so the player sees what the
  // game took the pinch for: a mark where the pinch began with the ring of
  // full speed around it, and a bar from there to the fingers (brighter
  // when it runs, red out where it turns).
  _stick(view) {
    const st = hands.stick;
    if (!hands.active || !st.on || !hands.headOk) return;
    // room -> world, from the head as the eyes were drawn and as the room has it.
    const M = this._room(view);
    const f = toWorld(_p, M, st.from), fx = f[0], fy = f[1], fz = f[2], R = WALK.FULL;
    this.obb(fx, fy, fz, 0.006, 0, 0, 0, 0.006, 0, 0, 0, 0.006, 0.95, 0.95, 0.95, 0);
    for (let k = 0; k < 12; k++) {
      const a0 = k * Math.PI / 6, a1 = (k + 1) * Math.PI / 6;
      _p[0] = fx + Math.cos(a0) * R; _p[1] = fy; _p[2] = fz + Math.sin(a0) * R;
      _q[0] = fx + Math.cos(a1) * R; _q[1] = fy; _q[2] = fz + Math.sin(a1) * R;
      this.segment(_p, _q, 0.0015, 0.75, 0.8, 0.86);
    }
    _p[0] = fx; _p[1] = fy; _p[2] = fz;
    toWorld(_q, M, st.at);
    _q[1] = fy;
    const c = st.turn ? STICK_TURN : st.run ? STICK_RUN : STICK_WALK;
    this.segment(_p, _q, 0.003, c[0], c[1], c[2]);
    this.obb(_q[0], _q[1], _q[2], 0.009, 0, 0, 0, 0.009, 0, 0, 0, 0.009, c[0], c[1], c[2], 0);
  }

  // Draw everything collected since begin() into each eye. light: 0..1
  // brightness of lit boxes; vignette: 0..1.
  draw(view, light, vignette) {
    this._init();
    this.noLine = false;
    this.roomOk = false;
    // (The hands' drawing must not take the frame down with it: a fault
    // here is said once and the hands go undrawn.)
    if (!this.handsFault) {
      try {
        this._sign(view);
        this._belt(view);
        this._joints(view);
        this._stick(view);
      } catch (e) {
        this.handsFault = true;
        hands.fault = true;
        for (const b of this.boards) b.on = false;
        console.warn('VR hands: not drawn:', e);
      }
    }
    const r = this.renderer, gl = r.gl, st = r.state;
    if (this.n > 0) {
      st.vao(this.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verts, 0, this.n * FLOATS);
    }
    if (this.panelOn) {
      st.vao(this.panelVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.panelBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.panel);
      if (this.textDirty) {
        st.texForUpload(UNIT.uTex, gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
        this.textDirty = false;
      }
    }
    for (let i = 0; i < this.boards.length; i++) {
      const b = this.boards[i];
      if (!b.on) continue;
      st.vao(b.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, b.buf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, b.verts);
      if (b.dirty) {
        st.texForUpload(UNIT.uTex, gl.TEXTURE_2D, b.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, b.canvas);
        b.dirty = false;
      }
    }
    st.blend(BLEND.OFF);
    st.cull(CULL.OFF);
    for (let i = 0; i < view.count; i++) {
      const e = view.eyes[i];
      e.bind(st);
      st.scissor(true, e.x, e.y, e.width, e.height);
      st.depth(true, true, gl.LESS);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      if (this.n > 0) {
        const u = st.program(this.pSolid);
        gl.uniformMatrix4fv(u.uVP, false, e.viewProj);
        gl.uniform4f(u.uLight, light, 0, 0, 0);
        st.vao(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.n);
      }
      if (this.panelOn) {
        const u = st.program(this.pPanel);
        gl.uniformMatrix4fv(u.uVP, false, e.viewProj);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, this.tex);
        st.vao(this.panelVao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      for (let k = 0; k < this.boards.length; k++) {
        const b = this.boards[k];
        if (!b.on) continue;
        const u = st.program(this.pPanel);
        gl.uniformMatrix4fv(u.uVP, false, e.viewProj);
        st.tex(UNIT.uTex, gl.TEXTURE_2D, b.tex);
        st.vao(b.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (vignette > 0.01) {
        st.depth(false, false, gl.LESS);
        st.blend(BLEND.PREMUL);
        const u = st.program(this.pVignette);
        // The lens looks along the eye's axis, which an off-centre frustum
        // does not put in the middle of its viewport.
        gl.uniform4f(u.uVignette, -e.proj[8], -e.proj[9], vignette, 0.55);
        st.vao(r.vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (this.cageOn > 0.01) {
          const uc = st.program(this.pCage);
          gl.uniformMatrix4fv(uc.uVP, false, mat4Mul(this.cageVP, e.viewProj, this.cageM));
          gl.uniform4f(uc.uCage, -e.proj[8], -e.proj[9], this.cageOn * vignette * CAGE_FAINT, 0.55);
          st.vao(this.cageVao);
          gl.drawArrays(gl.TRIANGLES, 0, this.cageVerts.length / 3);
        }
        st.blend(BLEND.OFF);
      }
      // The layer was asked for without alpha, as the page's canvas is.
      // Should a headset keep an alpha channel all the same, what the last
      // pass left in it (the low tier keeps other things than coverage
      // there) must not dim the picture or let the room show through it.
      gl.colorMask(false, false, false, true);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clearColor(0, 0, 0, 0);
      gl.colorMask(true, true, true, true);
    }
    st.scissor(false);
  }

  // The left eye onto the page's canvas, cropped to fill it: one blit.
  mirror(view) {
    if (!this.mirrorOk || view.count === 0) return;
    const r = this.renderer, gl = r.gl, st = r.state, e = view.eyes[0], c = r.canvas;
    const first = this.mirrored === 0;
    if (first) while (gl.getError() !== gl.NO_ERROR) { /* start from a clean slate */ }
    let sw = e.width, sh = e.height;
    if (sw * c.height > sh * c.width) sw = Math.round(sh * c.width / c.height);
    else sh = Math.round(sw * c.height / c.width);
    const sx = e.x + ((e.width - sw) >> 1), sy = e.y + ((e.height - sh) >> 1);
    st.scissor(false);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, e.fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    st.target = undefined;
    gl.blitFramebuffer(sx, sy, sx + sw, sy + sh, 0, 0, c.width, c.height, gl.COLOR_BUFFER_BIT, gl.LINEAR);
    // A headset whose framebuffer cannot be read back says so once: then
    // the page simply keeps its last flat frame.
    if (first && gl.getError() !== gl.NO_ERROR) this.mirrorOk = false;
    this.mirrored++;
  }
}
