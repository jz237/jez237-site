// The per-frame uniform block (mirror of `Frame` in shaders.js) and the
// analytic atmosphere that fills its sky, sun, ambient and fog colours.

// Float offsets into the block. Everything is vec4/mat4, so std140 == packed.
export const F = {
  VIEW_PROJ: 0, INV_VIEW_PROJ: 16, PREV_VIEW_PROJ: 32, SHADOW_MAT: 48,
  CAM_POS: 96, SUN_DIR: 100, SUN_COL: 104, SKY_ZENITH: 108, SKY_HORIZON: 112, SUN_GLOW: 116,
  AMB_SKY: 120, AMB_GROUND: 124, FOG: 128, FOG_PARAMS: 132, SHADOW_PARAMS: 136, CASCADE_TEXEL: 140,
  OCC_INV: 144, SKYVIS_INV: 148, SCREEN: 152, PROJ: 156, CAM_RIGHT: 160, CAM_UP: 164, CAM_FWD: 168,
  GROUND: 172, DYN: 176, SOFT: 180, LIGHTS: 192, LEN: 192 + 64 * 4,
};
export const MAX_LIGHTS = 32;
// Texels per side of one light's octahedral occlusion map (render_lights.js).
export const LIGHT_TILE = 48;
// Sine of the lowest sun elevation that still lights and shadows the scene.
export const SUN_MIN_ELEVATION = 0.02;
export const NEAR = 0.08;
export const FAR = 600;

function mul4(o, oo, a, ao, b, bo) {
  for (let c = 0; c < 4; c++) {
    const b0 = b[bo + c * 4], b1 = b[bo + c * 4 + 1], b2 = b[bo + c * 4 + 2], b3 = b[bo + c * 4 + 3];
    o[oo + c * 4] = a[ao] * b0 + a[ao + 4] * b1 + a[ao + 8] * b2 + a[ao + 12] * b3;
    o[oo + c * 4 + 1] = a[ao + 1] * b0 + a[ao + 5] * b1 + a[ao + 9] * b2 + a[ao + 13] * b3;
    o[oo + c * 4 + 2] = a[ao + 2] * b0 + a[ao + 6] * b1 + a[ao + 10] * b2 + a[ao + 14] * b3;
    o[oo + c * 4 + 3] = a[ao + 3] * b0 + a[ao + 7] * b1 + a[ao + 11] * b2 + a[ao + 15] * b3;
  }
}

function invert4(o, oo, m, mo) {
  const a00 = m[mo], a01 = m[mo + 1], a02 = m[mo + 2], a03 = m[mo + 3], a10 = m[mo + 4], a11 = m[mo + 5], a12 = m[mo + 6], a13 = m[mo + 7];
  const a20 = m[mo + 8], a21 = m[mo + 9], a22 = m[mo + 10], a23 = m[mo + 11], a30 = m[mo + 12], a31 = m[mo + 13], a32 = m[mo + 14], a33 = m[mo + 15];
  const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) return;
  det = 1 / det;
  o[oo] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  o[oo + 1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  o[oo + 2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  o[oo + 3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  o[oo + 4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  o[oo + 5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  o[oo + 6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  o[oo + 7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  o[oo + 8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  o[oo + 9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  o[oo + 10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  o[oo + 11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  o[oo + 12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  o[oo + 13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  o[oo + 14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  o[oo + 15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
}

export class Frame {
  constructor() {
    this.data = new Float32Array(F.LEN);
    this.proj = new Float32Array(16);
    this.view = new Float32Array(16);
    // Unjittered view-projection, kept for temporal reprojection.
    this.cleanViewProj = new Float32Array(16);
    this.exposure = 1;
    // Applied to it where nothing adapts the exposure to the frame.
    this.exposureScale = 1;
    this.cloudCover = 0.34;
    this.lightCount = 0;       // light slots in use (set by render_lights.js)
    // The direct light: the sun by day, the moon once the sun is down.
    // `lit` is false in the minutes between them, when nothing casts.
    this.light = [0, 1, 0];
    this.lit = true;
    this.night = 0;            // 0 by day, 1 once the moon is the light
    this.golden = 0;           // 1 with the sun on the horizon, 0 with it high or well down
    this.frame = 0;
    this.cameraMoved = true;
    // Set by the VR mode while it draws one eye of the headset (xr_render.js):
    // that eye's own view and projection then replace the yaw/pitch camera.
    this.eye = null;
  }

  // Camera matrices. yaw 0 looks down -Z, positive yaw turns left. jx, jy are
  // sub-pixel jitter in NDC units (0 when temporal AA is off).
  setCamera(cam, fovDeg, aspect, jx, jy, time) {
    const d = this.data, p = this.proj, v = this.view;
    d.set(this.cleanViewProj, F.PREV_VIEW_PROJ);
    const t = Math.tan(fovDeg * Math.PI / 360);
    p.fill(0);
    p[0] = 1 / (t * aspect);
    p[5] = 1 / t;
    p[10] = (FAR + NEAR) / (NEAR - FAR);
    p[11] = -1;
    p[14] = (2 * FAR * NEAR) / (NEAR - FAR);
    const cp = Math.cos(cam.pitch);
    const fx = -Math.sin(cam.yaw) * cp, fy = Math.sin(cam.pitch), fz = -Math.cos(cam.yaw) * cp;
    let rx = -fz, rz = fx;
    const rl = Math.hypot(rx, rz) || 1;
    rx /= rl; rz /= rl;
    const ux = -rz * fy, uy = rz * fx - rx * fz, uz = rx * fy;
    const px = cam.pos[0], py = cam.pos[1], pz = cam.pos[2];
    v[0] = rx; v[4] = 0; v[8] = rz; v[12] = -(rx * px + rz * pz);
    v[1] = ux; v[5] = uy; v[9] = uz; v[13] = -(ux * px + uy * py + uz * pz);
    v[2] = -fx; v[6] = -fy; v[10] = -fz; v[14] = fx * px + fy * py + fz * pz;
    v[3] = 0; v[7] = 0; v[11] = 0; v[15] = 1;
    mul4(this.cleanViewProj, 0, p, 0, v, 0);
    let moved = false;
    for (let i = 0; i < 16; i++) {
      if (this.cleanViewProj[i] !== d[F.PREV_VIEW_PROJ + i]) { moved = true; break; }
    }
    this.cameraMoved = moved;
    p[8] = jx; p[9] = jy;
    mul4(d, F.VIEW_PROJ, p, 0, v, 0);
    invert4(d, F.INV_VIEW_PROJ, d, F.VIEW_PROJ);
    d[F.CAM_POS] = px; d[F.CAM_POS + 1] = py; d[F.CAM_POS + 2] = pz; d[F.CAM_POS + 3] = time;
    d[F.PROJ] = NEAR; d[F.PROJ + 1] = FAR; d[F.PROJ + 2] = t * aspect; d[F.PROJ + 3] = t;
    d[F.CAM_RIGHT] = rx; d[F.CAM_RIGHT + 1] = 0; d[F.CAM_RIGHT + 2] = rz; d[F.CAM_RIGHT + 3] = this.exposure * this.exposureScale;
    d[F.CAM_UP] = ux; d[F.CAM_UP + 1] = uy; d[F.CAM_UP + 2] = uz; d[F.CAM_UP + 3] = this.frame;
    d[F.CAM_FWD] = fx; d[F.CAM_FWD + 1] = fy; d[F.CAM_FWD + 2] = fz;
    if (this.eye) this.eye.camera(this);
  }

  // The view frustum as five planes (left, right, bottom, top, near) for
  // culling: out[i * 4 ..] = (nx, ny, nz, d) with n.p + d >= 0 inside, p in
  // units of `unit` metres. Widened by a couple of pixels (w x h is the
  // target size) so sub-pixel jitter and edge growth cannot clip anything.
  frustumPlanes(out, unit, w, h) {
    if (this.eye) return this.eye.planes(out, unit, w);
    const d = this.data;
    const cx = d[F.CAM_POS], cy = d[F.CAM_POS + 1], cz = d[F.CAM_POS + 2];
    const tx = d[F.PROJ + 2] * (1 + 4 / w), ty = d[F.PROJ + 3] * (1 + 4 / h);
    for (let i = 0; i < 5; i++) {
      const side = i < 2 ? F.CAM_RIGHT : F.CAM_UP, sign = i & 1 ? -1 : 1, t = i < 2 ? tx : ty;
      let nx = d[F.CAM_FWD], ny = d[F.CAM_FWD + 1], nz = d[F.CAM_FWD + 2];
      if (i < 4) {
        nx = nx * t + sign * d[side]; ny = ny * t + sign * d[side + 1]; nz = nz * t + sign * d[side + 2];
      }
      out[i * 4] = nx * unit; out[i * 4 + 1] = ny * unit; out[i * 4 + 2] = nz * unit;
      // A tenth of a metre of slack on every plane.
      out[i * 4 + 3] = 0.1 * Math.hypot(nx, ny, nz) - (nx * cx + ny * cy + nz * cz);
    }
  }

  // Floats that actually need uploading this frame.
  usedLength() {
    return F.LIGHTS + this.lightCount * 8;
  }

  set3(off, x, y, z, w) {
    const d = this.data;
    d[off] = x; d[off + 1] = y; d[off + 2] = z; d[off + 3] = w;
  }

  // Derives every sky/sun/fog colour from the sun direction. Colours follow
  // elevation: white-gold at noon, deep orange at the horizon, blue dusk after.
  // shaftShare: fraction of the fog's sun in-scatter that the shaft pass adds
  // back with real shadowing (0 when shafts are off).
  setAtmosphere(sun, haze = 1, shaftShare = 0) {
    const s = Math.max(-1, Math.min(1, sun[1]));
    const zen = Math.min(Math.acos(s) * 180 / Math.PI, 90);
    // Kasten-Young relative air mass, then per-channel extinction.
    const mass = 1 / (Math.max(s, 0) + 0.15 * Math.pow(93.885 - zen, -1.253));
    const tr = Math.exp(-(0.050 + 0.055) * mass), tg = Math.exp(-(0.105 + 0.055) * mass), tb = Math.exp(-(0.235 + 0.055) * mass);
    // Direct light fades out through the last few degrees and is gone by
    // SUN_MIN_ELEVATION, below which the renderer stops casting shadows.
    const up = smooth(SUN_MIN_ELEVATION, 0.13, s);
    const day = 0.03 + 0.97 * smooth(-0.14, 0.28, s); // overall sky brightness
    const low = 1 - smooth(0.02, 0.42, s);      // golden-hour weight
    const I = 4.4 * up;
    let sr = I * tr, sg = I * tg, sb = I * tb;
    // After dusk the moon stands opposite where the sun went down, 40
    // degrees up: a dim blue key light with shadows of its own.
    const moon = 1 - smooth(-0.16, -0.03, s);
    const L = this.light;
    if (up > 0 || moon <= 0) {
      L[0] = sun[0]; L[1] = sun[1]; L[2] = sun[2];
    } else {
      const h = Math.hypot(sun[0], sun[2]);
      const ax = h > 1e-3 ? -sun[0] / h : 0.6, az = h > 1e-3 ? -sun[2] / h : 0.8;
      L[0] = ax * 0.766; L[1] = 0.643; L[2] = az * 0.766;
      sr = 0.085 * moon; sg = 0.115 * moon; sb = 0.19 * moon;
    }
    this.lit = up > 0 || moon > 0;
    this.night = moon;
    this.golden = low * (1 - moon);
    this.set3(F.SUN_DIR, L[0], L[1], L[2], 1);
    this.set3(F.SUN_COL, sr, sg, sb, 28);
    const zr0 = 0.006 * moon, zg0 = 0.009 * moon, zb0 = 0.02 * moon;
    // (The night sky keeps a little colour of its own.)
    const zr = mixf(0.06, 0.07, low) * day + zr0, zg = mixf(0.19, 0.15, low) * day + zg0, zb = mixf(0.60, 0.42, low) * day + zb0;
    const hr = mixf(0.50, 0.82, low) * day + zr0 * 1.6, hg = mixf(0.67, 0.54, low) * day + zg0 * 1.6, hb = mixf(0.90, 0.40, low) * day + zb0 * 1.5;
    this.set3(F.SKY_ZENITH, zr, zg, zb, this.cloudCover);
    this.set3(F.SKY_HORIZON, hr, hg, hb, 1);
    const gk = (0.9 + 1.5 * low) * smooth(-0.06, 0.05, s), mk = 0.05 * moon;
    this.set3(F.SUN_GLOW, mixf(1.0, 1.0, low) * gk + 0.6 * mk, mixf(0.86, 0.5, low) * gk + 0.7 * mk, mixf(0.66, 0.16, low) * gk + mk, 1);
    // Sky irradiance seen by an upward surface: mostly zenith, some horizon.
    let ar = (zr * 0.6 + hr * 0.4) * 2.3, ag = (zg * 0.6 + hg * 0.4) * 2.3, ab = (zb * 0.6 + hb * 0.4) * 2.3;
    // Skylight reaching surfaces has bounced around; pull it toward neutral.
    const al = 0.2126 * ar + 0.7152 * ag + 0.0722 * ab;
    ar += (al - ar) * 0.3; ag += (al - ag) * 0.3; ab += (al - ab) * 0.3;
    // Night is never pitch black: the sky's own glow, cool, from above.
    const dark = 1 - smooth(-0.2, 0.05, s);
    ar += 0.016 * dark; ag += 0.023 * dark; ab += 0.042 * dark;
    this.set3(F.AMB_SKY, ar, ag, ab, 0);
    // Light bounced off sunlit ground of average albedo.
    const sy = Math.max(L[1], 0) * 0.5;
    this.set3(F.AMB_GROUND, 0.30 * (sr * sy + ar * 0.6), 0.28 * (sg * sy + ag * 0.6), 0.22 * (sb * sy + ab * 0.6), 0);
    this.set3(F.FOG, hr * 0.8 + zr * 0.2, hg * 0.8 + zg * 0.2, hb * 0.8 + zb * 0.2, 0.0085 * haze * (1 + 0.8 * low));
    this.set3(F.FOG_PARAMS, 0.07, 1.2, (0.35 + 0.4 * low) * (1 - shaftShare), 0.94);
    const key = (0.2126 * sr + 0.7152 * sg + 0.0722 * sb) * Math.max(L[1], 0) * 0.5 + (0.2126 * ar + 0.7152 * ag + 0.0722 * ab);
    this.exposure = Math.max(0.35, Math.min(6.5, 1.12 * Math.pow(Math.max(key, 1e-3), -0.72)));
  }
}

function smooth(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function mixf(a, b, t) {
  return a + (b - a) * t;
}
