// The betta carried round as the bowl is turned about its own axis (BettaSwim.turnWith), and, moved
// in a worker, drawn carried on by the turns since its step was sent (bettaLink.mjs BettaRemote):
// it keeps its place among the furnishings, which turn with the bowl.
// Run: node --test betta-turn.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { BettaSwim, turnPoints } from './src/fish/bettaSwim.mjs';
import { BettaRemote, poseBytes, readStep, stepScratch } from './src/fish/bettaLink.mjs';

const near = (a, b, eps = 1e-12) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);
/** p turned by a about +y, as three's makeRotationY turns it (the bowl's twist). */
const aboutY = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
const ahead = (h) => [-Math.cos(h), 0, Math.sin(h)];

test('turnPoints turns points about the axis, by its length, at any stride', () => {
  const pts = new Float32Array([1, 0, 0, 9, 0, 2, 3, 9]);
  turnPoints(pts, [0, 0.3, 0], 0, pts.length, 4);
  const [a, b] = [aboutY([1, 0, 0], 0.3), aboutY([0, 2, 3], 0.3)];
  [a[0], a[1], a[2], 9, b[0], b[1], b[2], 9].forEach((v, k) => near(pts[k], v, 1e-6));
  const m = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 2, -1).normalize(), 0.8);
  const p = [0.3, -0.2, 0.5], want = new THREE.Vector3(...p).applyMatrix4(m);
  turnPoints(p, new THREE.Vector3(1, 2, -1).normalize().multiplyScalar(0.8).toArray());
  near(p[0], want.x, 1e-12); near(p[1], want.y, 1e-12); near(p[2], want.z, 1e-12);
});

test('turnWith carries where it is and goes, and the ways it faces, round with the bowl', () => {
  const s = new BettaSwim();
  s.position = [0.2, -0.17, 0.12]; s.velocity = [0.05, 0, -0.02]; s.target = [-0.3, -0.2, -0.18];
  s.mirrorPoint = [0.6, 0, 0.4]; s.heading = 0.7; s.mirrorFace = -1.2; s.startleHeading = 2.5;
  s.lapAngle = Math.atan2(s.position[2], s.position[0]);
  const before = { pos: [...s.position], vel: [...s.velocity], target: [...s.target], mirror: [...s.mirrorPoint], f: ahead(s.heading), face: ahead(s.mirrorFace), startle: ahead(s.startleHeading) };
  const a = 0.9;
  s.turnWith([0, a, 0]);
  for (const [now, was] of [[s.position, before.pos], [s.velocity, before.vel], [s.target, before.target], [s.mirrorPoint, before.mirror], [ahead(s.heading), before.f], [ahead(s.mirrorFace), before.face], [ahead(s.startleHeading), before.startle]]) {
    aboutY(was, a).forEach((v, k) => near(now[k], v, 1e-12));
  }
  // (A lap's bearing round the axis is where it now is.)
  near(s.lapAngle, Math.atan2(s.position[2], s.position[0]), 1e-12);
});

/** A worker that answers each step at once with a pose: every vertex, probe and the mouth at (1, 0, 0). */
function remoteWith(vertexFloats) {
  const posted = [];
  const worker = { postMessage: (m) => posted.push(m), terminate() {}, onmessage: null, onerror: null };
  const twin = { vertices: new Float32Array(vertexFloats), probes: new Float32Array(64), mouth: new THREE.Vector3(), level: 0, swim: { mode: 'cruise', heading: 0, pitch: 0, gulpUrge: 0 } };
  const remote = new BettaRemote(worker, twin);
  remote.receive({ ready: true });
  const answer = () => {
    const m = posted[posted.length - 1], pose = new ArrayBuffer(poseBytes(vertexFloats));
    const head = new Float64Array(pose, 0, 16), floats = new Float32Array(pose, 16 * 8);
    head.set([1, 0, 0], 3);
    for (let i = 0; i < 16; i++) floats.set([1, 0, 0, 0], i * 4);
    for (let i = 64; i < floats.length; i += 3) floats.set([1, 0, 0], i);
    remote.receive({ pose, step: m.step, mode: 'cruise' });
  };
  return { remote, posted, answer };
}

const HOST = { obstacles: [{ a: [0.5, 0, 0], b: [0.5, 0.1, 0], r: 0.05, solid: 0.04 }], food: null, gapeWant: 0, flared: false };
const ENV = { radius: 0.99, level: 0.18, sandLevel: -0.6, iso: 0.5, gravity: [0, -24, 0] };
const STILL3 = [0, 0, 0];

test('a pose is drawn carried on by the turns since its step; each step carries the fish by those since the last', () => {
  const { remote, posted, answer } = remoteWith(30);
  const dt = 1 / 60, turns = [[0, 0.02, 0], [0, 0.03, 0], [0, 0.05, 0], [0, 0.01, 0]];
  const scratch = stepScratch(), fish = { swim: {} };
  // Frame 1: nothing back yet; the step carries frame 1's turn.
  assert.equal(remote.take(turns[0]), null);
  remote.post(dt, null, ENV, HOST, turns[0].map((v) => v / dt), turns[0]);
  near(readStep(posted[1].step, fish, scratch).turn[1], 0.02);
  answer();
  // Frame 2: frame 1's pose, carried on by frame 2's turn (it was made carried by frame 1's).
  const v = remote.take(turns[1]);
  const want = aboutY([1, 0, 0], 0.03);
  for (let i = 0; i < v.length; i += 3) want.forEach((w, k) => near(v[i + k], w, 1e-6));
  want.forEach((w, k) => near(remote.probes[k], w, 1e-6));
  near(remote.mouth.x, want[0], 1e-12); near(remote.mouth.z, want[2], 1e-12);
  near(remote.swim.heading, 0.03, 1e-12);
  remote.post(dt, null, ENV, HOST, turns[1].map((x) => x / dt), turns[1]);
  // (A pure turn about its own axis does not lead the furnishings: the fish turns with them.)
  const step2 = readStep(posted[2].step, fish, scratch);
  near(step2.turn[1], 0.03);
  near(step2.host.obstacles[0].a[0], 0.5, 1e-12);
  near(step2.host.obstacles[0].a[2], 0, 1e-12);
  // Frame 3: no answer yet; two steps out (IN_FLIGHT), so frame 4's step waits: its turn and frame
  // 3's go with the next step that is sent.
  assert.equal(remote.take(turns[2]), null);
  remote.post(dt, null, ENV, HOST, STILL3, turns[2]);
  const sent3 = posted.length;
  assert.equal(remote.take(turns[3]), null);
  remote.post(dt, null, ENV, HOST, STILL3, turns[3]);
  assert.equal(posted.length, sent3, 'held: two steps out');
  near(readStep(posted[sent3 - 1].step, fish, scratch).turn[1], 0.05);
});


test('the furnishings are still led by the bowl\'s other motion (a tip), not by its turn', () => {
  const { remote, posted } = remoteWith(30);
  const dt = 1 / 60, turn = [0, 0.02, 0], tip = 0.6;
  remote.take(turn);
  remote.post(dt, null, ENV, HOST, [0, turn[1] / dt, tip], turn);
  const step = readStep(posted[1].step, { swim: {} }, stepScratch());
  // (Led by the tip alone, over the one frame until it is drawn: about z.)
  const a = tip * dt, p = HOST.obstacles[0].a;
  near(step.host.obstacles[0].a[0], p[0] * Math.cos(a) - p[1] * Math.sin(a), 1e-12);
  near(step.host.obstacles[0].a[1], p[0] * Math.sin(a) + p[1] * Math.cos(a), 1e-12);
});
