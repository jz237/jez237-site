// Sun, moon and star orientation for a fixed mid-latitude sea, plus exposure bookkeeping.
import { clamp, lerp, smoothstep } from './math.js';

const RAD = Math.PI / 180;
export const LAT = 38 * RAD;
const SUN_DEC = 8 * RAD;
const MOON_DEC = 6 * RAD;
const ELONG = 150 * RAD; // moon 150 degrees east of the sun: a bright waxing gibbous

function horizontal(H, dec) {
  const sinEl = Math.sin(LAT) * Math.sin(dec) + Math.cos(LAT) * Math.cos(dec) * Math.cos(H);
  const el = Math.asin(clamp(sinEl, -1, 1));
  // Azimuth from north, clockwise.
  const cosAz = (Math.sin(dec) - sinEl * Math.sin(LAT)) / (Math.max(1e-6, Math.cos(el) * Math.cos(LAT)));
  let az = Math.acos(clamp(cosAz, -1, 1));
  if (Math.sin(H) > 0) az = 2 * Math.PI - az; // afternoon: west of the meridian
  // world axes: +x east, +y up, -z north
  return { el, az, dir: [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)] };
}

// `sunOverride` = { alt, az } in degrees (az from north, clockwise) replaces the computed sun position;
// the moon and the stars still follow `hours`.
export function skyState(hours, sunOverride = null) {
  const H = (hours - 12) * 15 * RAD;
  let sun = horizontal(H, SUN_DEC);
  if (sunOverride) {
    const el = clamp(sunOverride.alt, -60, 90) * RAD, az = sunOverride.az * RAD;
    sun = { el, az, dir: [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)] };
  }
  const moon = horizontal(H - ELONG, MOON_DEC);
  const sunAlt = sun.el / RAD, moonAlt = moon.el / RAD;

  // log10 of relative daylight level as a function of solar altitude (degrees)
  const pts = [[-18, -8.1], [-12, -7.1], [-6, -4.5], [0, -2.4], [5, -1.3], [20, 0]];
  let l10 = pts[0][1];
  if (sunAlt >= pts[pts.length - 1][0]) l10 = 0;
  else for (let i = 0; i < pts.length - 1; i++) {
    if (sunAlt < pts[i + 1][0]) { l10 = lerp(pts[i][1], pts[i + 1][1], (sunAlt - pts[i][0]) / (pts[i + 1][0] - pts[i][0])); break; }
  }
  const dayLevel = Math.pow(10, Math.max(l10, -8.1));
  const MOON_E = 2.4e-6; // full-moon illuminance relative to the sun at zenith
  const moonUp = smoothstep(-2, 6, moonAlt);
  const moonLevel = MOON_E * moonUp;
  const glow = 3e-8;
  const level = Math.max(dayLevel, moonLevel, glow);
  const pre = 1 / level;
  // Mood: auto-exposure aims darker after sunset so night still reads as night.
  const lg = Math.log10(level);
  const key = lerp(0.028, 0.19, smoothstep(-5.6, -2.0, lg));
  return {
    sunAz: ((sun.az / RAD) % 360 + 360) % 360,
    sunDir: sun.dir, moonDir: moon.dir, sunAlt, moonAlt, pre, level, key, MOON_E, dayLevel, moonLevel,
    sunCol: [pre, pre, pre * 0.995],
    moonCol: [pre * MOON_E * 0.86, pre * MOON_E * 0.93, pre * MOON_E * 1.0],
    airglow: [pre * glow * 0.35, pre * glow * 0.55, pre * glow * 0.85],
    starLevel: smoothstep(-3, -13, sunAlt) * (1 - 0.8 * moonUp * 0.7),
    hours,
  };
}

// Rotation matrix (row-major 3x3, returned as column-major Float32Array) taking world directions into the
// celestial frame in which stars are fixed.
export function starRotation(hours) {
  const ang = (hours / 24) * 2 * Math.PI + 1.2;
  // pole axis: north celestial pole
  const p = [0, Math.sin(LAT), -Math.cos(LAT)];
  const c = Math.cos(ang), s = Math.sin(ang), t = 1 - c;
  const [x, y, z] = p;
  const m = [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ];
  // GLSL mat3 is column-major
  return new Float32Array([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
}
