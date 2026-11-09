// VR drawing: the two eyes of a headset through the ordinary renderer, and
// the few things only VR shows (the tool in the hand, the aim line, the
// wrist panel, the comfort vignette).
//
// An eye is drawn by `renderer.render(out)` itself, the whole frame as on
// the flat screen, with three things swapped while it runs:
//   - `renderer.frame.eye` gives the frame block that eye's view and
//     projection (and its culling planes) instead of the yaw/pitch camera,
//   - `renderer.state.screen` sends whatever would go to the canvas to the
//     eye's viewport of the headset's framebuffer,
//   - the scene targets are sized by the eye's viewport.
// `renderer.cam.pos` is the head for both eyes, so everything the renderer
// keeps around the camera (shadow cascades, the contact map, the light
// list) is brought up to date by the first eye and found unchanged by the
// second. The price of going through the whole renderer is one resolve pass
// per eye and no multisampling from the headset's layer; what it buys is that
// VR shows what the flat game shows, tier for tier, and follows every change
// made to the renderer without knowing about it.
import { OUT } from './engine.js';
import { F } from './render_frame.js';
import { mat4Mul, mat4Invert } from './mat.js';
import { facing } from './xr_rig.js';

// world = M * xr for a rigid transform M: o = a * b, all column-major 4x4.
export function mulRigid(o, a, b) { return mat4Mul(o, a, b); }

// Inverse of a rigid transform (rotation and translation only).
export function invertRigid(o, m) {
  const tx = m[12], ty = m[13], tz = m[14];
  const r00 = m[0], r01 = m[1], r02 = m[2], r10 = m[4], r11 = m[5], r12 = m[6], r20 = m[8], r21 = m[9], r22 = m[10];
  o[0] = r00; o[1] = r10; o[2] = r20; o[3] = 0;
  o[4] = r01; o[5] = r11; o[6] = r21; o[7] = 0;
  o[8] = r02; o[9] = r12; o[10] = r22; o[11] = 0;
  o[12] = -(r00 * tx + r01 * ty + r02 * tz);
  o[13] = -(r10 * tx + r11 * ty + r12 * tz);
  o[14] = -(r20 * tx + r21 * ty + r22 * tz);
  o[15] = 1;
  return o;
}

// One eye as the renderer's seams see it: `width`/`height` (the viewport),
// `pos` (world), `camera(frame)`, `planes(out, unit, w)`, `bind(state)`.
class Eye {
  constructor() {
    this.fbo = null;
    this.x = 0; this.y = 0; this.width = 2; this.height = 2;
    this.world = new Float32Array(16);  // eye -> world
    this.view = new Float32Array(16);   // world -> eye
    this.proj = new Float32Array(16);
    this.viewProj = new Float32Array(16);
    this.inv = new Float32Array(16);
    this.pos = [0, 0, 0];
    this.cull = null;                   // the Float32Array(20) both eyes are culled by
    this.again = false;                 // not the first eye of its frame
  }

  // Called at the end of Frame.setCamera: overwrite what it derived from
  // yaw, pitch and a symmetric field of view.
  camera(fr) {
    const d = fr.data, w = this.world, p = this.proj;
    d.set(this.viewProj, F.VIEW_PROJ);
    d.set(this.inv, F.INV_VIEW_PROJ);
    fr.cleanViewProj.set(this.viewProj);
    fr.view.set(this.view);
    fr.proj.set(p);
    fr.cameraMoved = true;
    d[F.CAM_POS] = w[12]; d[F.CAM_POS + 1] = w[13]; d[F.CAM_POS + 2] = w[14];
    // Near and far as the projection has them, whoever chose them.
    d[F.PROJ] = p[14] / (p[10] - 1);
    d[F.PROJ + 1] = p[14] / (p[10] + 1);
    // Half the frustum's width and height at unit depth: a pixel's size.
    const tx = 1 / p[0], ty = 1 / p[5];
    d[F.PROJ + 2] = tx;
    d[F.PROJ + 3] = ty;
    d[F.CAM_RIGHT] = w[0]; d[F.CAM_RIGHT + 1] = w[1]; d[F.CAM_RIGHT + 2] = w[2];
    d[F.CAM_UP] = w[4]; d[F.CAM_UP + 1] = w[5]; d[F.CAM_UP + 2] = w[6];
    // A headset's frustum is off-centre. The sky and the sun shafts build
    // their rays as fwd + right * (x * tx) + up * (y * ty) for x, y in
    // -1..1: with the centre of the frustum folded into `fwd` that is the
    // exact ray again. (The other readers of this vector only want a rough
    // forward: puff shading, the gas overdraw estimate.)
    const cx = p[8] * tx, cy = p[9] * ty;
    d[F.CAM_FWD] = -w[8] + w[0] * cx + w[4] * cy;
    d[F.CAM_FWD + 1] = -w[9] + w[1] * cx + w[5] * cy;
    d[F.CAM_FWD + 2] = -w[10] + w[2] * cx + w[6] * cy;
  }

  // In place of Frame.frustumPlanes: five planes around both eyes.
  planes(out, unit, w) {
    const c = this.cull;
    for (let i = 0; i < 20; i += 4) {
      out[i] = c[i] * unit; out[i + 1] = c[i + 1] * unit; out[i + 2] = c[i + 2] * unit; out[i + 3] = c[i + 3];
    }
  }

  // In place of the canvas (GLState.fbo with no target).
  bind(st) {
    if (st.target !== this) { st.gl.bindFramebuffer(st.gl.FRAMEBUFFER, this.fbo); st.target = this; }
    st.viewport(this.x, this.y, this.width, this.height);
  }
}

const _corner = [0, 0, 0];

export class XrView {
  constructor(renderer) {
    this.renderer = renderer;
    this.eyes = [new Eye(), new Eye()];
    this.cull = new Float32Array(20);
    this.head = new Float32Array(16);   // head -> world
    this.count = 0;
    this.drawn = 0;                      // eyes drawn in the last frame
    this.ms = 0;                         // JS milliseconds of the last frame's eyes
  }

  // rig: xr space -> world. pose: the frame's viewer pose. layer: the
  // session's XRWebGLLayer. Fills the eyes and the planes they share.
  begin(rig, pose, layer) {
    const views = pose.views, n = Math.min(views.length, 2);
    this.count = n;
    mulRigid(this.head, rig, pose.transform.matrix);
    for (let i = 0; i < n; i++) {
      const e = this.eyes[i], v = views[i], vp = layer.getViewport(v);
      e.fbo = layer.framebuffer;
      e.x = vp.x; e.y = vp.y; e.width = vp.width; e.height = vp.height;
      mulRigid(e.world, rig, v.transform.matrix);
      invertRigid(e.view, e.world);
      e.proj.set(v.projectionMatrix);
      mat4Mul(e.viewProj, e.proj, e.view);
      mat4Invert(e.inv, e.viewProj);
      e.pos[0] = e.world[12]; e.pos[1] = e.world[13]; e.pos[2] = e.world[14];
      e.cull = this.cull;
      e.again = i > 0;
    }
    this._cullPlanes();
  }

  // One frustum that holds every eye's: the head's axes, the widest extent
  // any eye reaches along each, and an apex far enough behind the head that
  // each eye stands inside it. Both eyes then cull by the same planes, so
  // the light list and the draw lists are the same for both.
  _cullPlanes() {
    const h = this.head, out = this.cull;
    const rx = h[0], ry = h[1], rz = h[2], ux = h[4], uy = h[5], uz = h[6], fx = -h[8], fy = -h[9], fz = -h[10];
    let L = 0, R = 0, B = 0, T = 0;
    for (let i = 0; i < this.count; i++) {
      const e = this.eyes[i], w = e.world, p = e.proj;
      for (let k = 0; k < 4; k++) {
        // A corner of the eye's frustum at unit depth, in its own axes...
        const x = ((k & 1 ? 1 : -1) + p[8]) / p[0], y = ((k & 2 ? 1 : -1) + p[9]) / p[5];
        _corner[0] = w[0] * x + w[4] * y - w[8];
        _corner[1] = w[1] * x + w[5] * y - w[9];
        _corner[2] = w[2] * x + w[6] * y - w[10];
        // ... and in the head's.
        const depth = Math.max(_corner[0] * fx + _corner[1] * fy + _corner[2] * fz, 0.05);
        const hx = (_corner[0] * rx + _corner[1] * ry + _corner[2] * rz) / depth, hy = (_corner[0] * ux + _corner[1] * uy + _corner[2] * uz) / depth;
        L = Math.min(L, hx); R = Math.max(R, hx); B = Math.min(B, hy); T = Math.max(T, hy);
      }
    }
    // A few pixels wider, as on the flat screen: quads grow by half a pixel.
    const padX = (R - L) * 2 / Math.max(this.eyes[0].width, 16), padY = (T - B) * 2 / Math.max(this.eyes[0].height, 16);
    L -= padX; R += padX; B -= padY; T += padY;
    let back = 0;
    for (let i = 0; i < this.count; i++) {
      const w = this.eyes[i].world, dx = w[12] - h[12], dy = w[13] - h[13], dz = w[14] - h[14];
      const x = dx * rx + dy * ry + dz * rz, y = dx * ux + dy * uy + dz * uz, z = dx * fx + dy * fy + dz * fz;
      back = Math.max(back, (x > 0 ? x / R : x / L) - z, (y > 0 ? y / T : y / B) - z);
    }
    back += 0.01;
    const ax = h[12] - fx * back, ay = h[13] - fy * back, az = h[14] - fz * back;
    const set = (i, nx, ny, nz) => {
      out[i] = nx; out[i + 1] = ny; out[i + 2] = nz;
      // A tenth of a metre of slack on every plane, like the flat camera's.
      out[i + 3] = 0.1 * Math.hypot(nx, ny, nz) - (nx * ax + ny * ay + nz * az);
    };
    set(0, rx - L * fx, ry - L * fy, rz - L * fz);
    set(4, -rx + R * fx, -ry + R * fy, -rz + R * fz);
    set(8, ux - B * fx, uy - B * fy, uz - B * fz);
    set(12, -ux + T * fx, -uy + T * fy, -uz + T * fz);
    set(16, fx, fy, fz);
  }

  // Draws every eye. The renderer's camera is left at the head.
  draw(out) {
    const r = this.renderer, t0 = performance.now();
    const h = this.head, cam = r.cam;
    cam.pos[0] = h[12]; cam.pos[1] = h[13]; cam.pos[2] = h[14];
    // Where the head looks, for whoever reads the camera's angles (audio).
    cam.yaw = facing(h);
    cam.pitch = Math.asin(Math.max(-1, Math.min(1, -h[9])));
    this.drawn = 0;
    try {
      for (let i = 0; i < this.count; i++) {
        r.frame.eye = r.state.screen = this.eyes[i];
        r.render(out);
        // (A context restored in the middle of this has a new state object.)
        r.state.screen = null;
        this.drawn++;
        // What changed in the world has been taken in by the first eye: the
        // second must not read the same edits as new ones.
        out[OUT.DIRTY_RUNS_LEN] = 0;
        out[OUT.OCC_DIRTY_LEN] = 0;
        out[OUT.FINE_DIRTY_LEN] = 0;
      }
    } finally {
      r.frame.eye = null;
      r.state.screen = null;
    }
    this.ms = performance.now() - t0;
  }
}
