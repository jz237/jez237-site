import * as THREE from 'three';
import { clamp } from '../core/ease.js';

// Butterfly flight, shared by the hundreds (butterflies.js) and the rigged few
// the camera visits (ambient.js). A butterfly never slides along a level line:
// each downstroke heaves the body up and the upstroke lets it fall, so it bobs
// a good part of its span with every beat while the body rocks nose-up and
// down with the wings; it jinks (a sudden swerve with a climb or a drop, a few
// times a second), banks into its turns, and every few seconds holds its wings
// out and glides, sinking, for a moment (about a sixth of its flight) before
// it beats again. Speeds are in the garden's
// slow time (APX-9 cruises at 24).
//
// The wing phase b.ph is in radians, the wings up where sin(ph) > 0.

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);

// glider: 0..1, how much of its flight is glides (swallowtails more than monarchs)
export function flutterInit(b, rng, { glider = 0.5, cruise = [12, 18] } = {}) {
  b.fl = {
    cruise: rng.range(cruise[0], cruise[1]),
    hz: rng.range(3.4, 4.4), // beats a second
    glider,
    glide: 0,
    flapFor: rng.range(0.6, 3.5),
    jink: rng.range(0.1, 0.7),
    amp: 1,
    bank: 0,
    // for the caller: the bob (−1..1, × its own size), body pitch and roll
    bob: 0,
    pitch: 0,
    roll: 0,
  };
  b.ph ??= rng.range(0, TAU);
  b.yaw ??= rng.range(0, TAU);
}

// Steer b.vel toward `want` (a velocity), face along it and advance the beat.
// mode: 'fly' | 'flee' (fast, no glides) | 'land' (slow, steady, settling)
export function flutterStep(b, want, dt, rng, mode = 'fly') {
  const F = b.fl;
  const flee = mode === 'flee', land = mode === 'land';
  // beat a while, then glide a moment (not when fleeing or settling)
  if (F.glide > 0) {
    F.glide -= dt;
    if (F.glide <= 0 || flee || land) { F.glide = 0; F.flapFor = rng.range(1.2, 3.5) * (1.4 - F.glider * 0.5); }
  } else if ((F.flapFor -= dt) <= 0 && !flee && !land) F.glide = rng.range(0.25, 0.4 + F.glider * 0.5);
  const gliding = F.glide > 0;
  // jinks: a sudden swerve, up or down
  if (!gliding && !land && (F.jink -= dt) <= 0) {
    F.jink = rng.range(0.2, flee ? 0.4 : 0.8);
    b.vel.applyAxisAngle(UP, rng.range(0.25, flee ? 0.55 : 0.9) * (rng.chance(0.5) ? 1 : -1));
    b.vel.y += rng.range(-0.35, 0.5) * F.cruise;
  }
  // steering: firm while beating, loose in a glide (which sinks)
  const k = 1 - Math.exp(-dt * (gliding ? 0.7 : flee ? 4 : land ? 3.5 : 2.4));
  b.vel.x += (want.x - b.vel.x) * k;
  b.vel.z += (want.z - b.vel.z) * k;
  if (gliding) b.vel.y = Math.max(-F.cruise * 0.4, b.vel.y + (-F.cruise * 0.25 - b.vel.y) * (1 - Math.exp(-dt * 2)));
  else b.vel.y += (want.y - b.vel.y) * k;
  // the beat: stops as it glides (the wings held out), quicker when fleeing
  F.amp += ((gliding ? 0 : 1) - F.amp) * (1 - Math.exp(-dt * 12));
  const hz = flee ? F.hz * 1.45 : land ? F.hz * 0.85 : F.hz;
  F.rate = hz * TAU * (0.2 + 0.8 * F.amp); // (radians a second)
  b.ph += dt * F.rate;
  // facing along its flight, banking into the turn
  const hv = Math.hypot(b.vel.x, b.vel.z);
  let yawRate = 0;
  if (hv > 0.6) {
    const d = Math.atan2(Math.sin(Math.atan2(b.vel.x, b.vel.z) - b.yaw), Math.cos(Math.atan2(b.vel.x, b.vel.z) - b.yaw));
    const turn = d * (1 - Math.exp(-dt * 7));
    b.yaw += turn;
    yawRate = turn / Math.max(dt, 1e-4);
  }
  F.bank += (clamp(-yawRate * 0.3, -0.8, 0.8) - F.bank) * (1 - Math.exp(-dt * 6));
  // each downstroke lifts it (highest at the bottom of the stroke), and the
  // body rocks with the wings
  F.bob = -Math.sin(b.ph) * F.amp;
  F.pitch = clamp(-b.vel.y * 0.04, -0.55, 0.55) + Math.cos(b.ph) * 0.26 * F.amp;
  F.roll = F.bank;
  return gliding;
}
