// Builds games/2026-11-07/shock-horror/assets/digger.glb: the Microsoft Rocketbox avatar "Wood_Male_01"
// (MIT, the same file Tidewater ships as joe.glb) with its own motion-captured idles, plus motion-capture
// clips from Final Blow's fighter bank (walk, run, jump, hits, knockdown, get-up...) retargeted onto it.
//
//   node build_digger.mjs <work dir with joe.glb, benny-rig.glb and anim-*.glb>
//
// Retargeting: both skeletons stand in the same A-pose facing +Z, so every mapped bone gets the source's
// world-space rotation change from its bind pose, applied to the target's bind pose after a small per-bone
// alignment (the source arms hang a little lower). Local rotations are rebuilt down the target hierarchy.
// The hips keep their vertical bob (scaled to the shorter legs) and a little sway; travel is stripped and
// measured (the game moves the digger itself and matches the clip speed to it).
import { createRequire } from 'module';
import path from 'path';
const require = createRequire('D:/Projects/hidden reef header/quarry-impact/');
const THREE = require('three');
const req2 = createRequire('D:/Projects/.tmp/model-s-tools/');
const { NodeIO } = req2('@gltf-transform/core');
const { ALL_EXTENSIONS } = req2('@gltf-transform/extensions');
const { prune, resample, dedup } = req2('@gltf-transform/functions');

const DIR = process.argv[2] || 'D:/Projects/.tmp/shock-horror-work/char';
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '../../games/2026-11-07/shock-horror/assets/digger.glb');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const FPS = 30;

const MAP = {
  Hips: 'Bip01 Pelvis', Spine02: 'Bip01 Spine', Spine01: 'Bip01 Spine1', Spine: 'Bip01 Spine2', neck: 'Bip01 Neck', Head: 'Bip01 Head',
  LeftShoulder: 'Bip01 L Clavicle', LeftArm: 'Bip01 L UpperArm', LeftForeArm: 'Bip01 L Forearm', LeftHand: 'Bip01 L Hand',
  RightShoulder: 'Bip01 R Clavicle', RightArm: 'Bip01 R UpperArm', RightForeArm: 'Bip01 R Forearm', RightHand: 'Bip01 R Hand',
  LeftUpLeg: 'Bip01 L Thigh', LeftLeg: 'Bip01 L Calf', LeftFoot: 'Bip01 L Foot', LeftToeBase: 'Bip01 L Toe0',
  RightUpLeg: 'Bip01 R Thigh', RightLeg: 'Bip01 R Calf', RightFoot: 'Bip01 R Foot', RightToeBase: 'Bip01 R Toe0',
};
// the bone whose direction defines each bone's alignment (source name -> source child)
const DIRCHILD = {
  Hips: 'Spine02', Spine02: 'Spine01', Spine01: 'Spine', Spine: 'neck', neck: 'Head',
  LeftShoulder: 'LeftArm', LeftArm: 'LeftForeArm', LeftForeArm: 'LeftHand', RightShoulder: 'RightArm', RightArm: 'RightForeArm', RightForeArm: 'RightHand',
  LeftUpLeg: 'LeftLeg', LeftLeg: 'LeftFoot', LeftFoot: 'LeftToeBase', RightUpLeg: 'RightLeg', RightLeg: 'RightFoot', RightFoot: 'RightToeBase',
};
// clips to bring over: [source file, new name, loop?, hips rule]
const CLIPS = [
  ['walking', 'walk', true], ['running', 'run', true], ['jump', 'jump', false, 'drop'],
  ['hit_body', 'hit', false], ['hit_face', 'hit2', false], ['knockdown', 'knock', false, 'drop'], ['ko', 'ko', false, 'drop'],
  ['getup', 'getup', false, 'drop'], ['victory', 'victory', false], ['launched', 'launched', false, 'drop'],
];
const KEEP_IDLES = ['idle_breathe_01', 'idle_look_around_01'];

// ---------------------------------------------------------------- helpers
const trs = (n) => new THREE.Matrix4().compose(new THREE.Vector3(...n.getTranslation()), new THREE.Quaternion(...n.getRotation()), new THREE.Vector3(...n.getScale()));
function hierarchy(root) {
  const parent = new Map(), byName = new Map();
  for (const n of root.listNodes()) { byName.set(n.getName(), n); for (const c of n.listChildren()) parent.set(c, n); }
  return { parent, byName };
}
function worldOf(n, H, local) {           // local(n) -> Matrix4 (defaults to the node's own TRS)
  const m = local ? local(n) : trs(n); const p = H.parent.get(n);
  return p ? worldOf(p, H, local).multiply(m) : m;
}
const rotOf = (m) => { const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(); m.decompose(p, q, s); return q; };
const posOf = (m) => new THREE.Vector3().setFromMatrixPosition(m);

function sampler(ch) {
  const s = ch.getSampler(); const tin = s.getInput().getArray(), out = s.getOutput().getArray(), interp = s.getInterpolation();
  const stride = out.length / tin.length / (interp === 'CUBICSPLINE' ? 3 : 1), isRot = ch.getTargetPath() === 'rotation';
  return (t) => {
    let i = 0; while (i < tin.length - 1 && tin[i + 1] < t) i++;
    const t0 = tin[i], t1 = tin[Math.min(i + 1, tin.length - 1)], f = t1 > t0 ? Math.min(1, Math.max(0, (t - t0) / (t1 - t0))) : 0;
    const get = (k) => { const o = interp === 'CUBICSPLINE' ? (k * 3 + 1) * stride : k * stride; return Array.from(out.slice(o, o + stride)); };
    const a = get(i), b = get(Math.min(i + 1, tin.length - 1));
    if (isRot) return new THREE.Quaternion(...a).slerp(new THREE.Quaternion(...b), interp === 'STEP' ? 0 : f).toArray();
    return a.map((v, k) => v + (b[k] - v) * (interp === 'STEP' ? 0 : f));
  };
}

// ---------------------------------------------------------------- load
const src = await io.read(path.join(DIR, 'benny-rig.glb'));
const tgt = await io.read(path.join(DIR, 'joe.glb'));
const SH = hierarchy(src.getRoot()), TH = hierarchy(tgt.getRoot());
const srcBind = {}, srcBindPos = {};
for (const s of Object.keys(MAP)) { const W = worldOf(SH.byName.get(s), SH); srcBind[s] = rotOf(W); srcBindPos[s] = posOf(W); }
const tgtBind = {}, tgtBindPos = {};
for (const n of tgt.getRoot().listNodes()) { const W = worldOf(n, TH); tgtBind[n.getName()] = rotOf(W); tgtBindPos[n.getName()] = posOf(W); }
// per-bone alignment: turn the target bone so it points where the source bone points in the bind pose
const ALIGN = {};
for (const s of Object.keys(MAP)) {
  const c = DIRCHILD[s];
  if (c) {
    const sd = srcBindPos[c].clone().sub(srcBindPos[s]).normalize();
    const td = tgtBindPos[MAP[c]].clone().sub(tgtBindPos[MAP[s]]).normalize();
    ALIGN[s] = new THREE.Quaternion().setFromUnitVectors(td, sd);
  }
}
// the spine, neck and head stand upright in both bind poses: their bone directions differ only in how the
// skeletons were built, so aligning them would tip the head back
for (const s of ['Hips', 'Spine02', 'Spine01', 'Spine', 'neck', 'Head']) ALIGN[s] = new THREE.Quaternion();
for (const s of Object.keys(MAP)) if (!ALIGN[s]) { let p = SH.parent.get(SH.byName.get(s)); while (p && !ALIGN[p.getName()]) p = SH.parent.get(p); ALIGN[s] = p ? ALIGN[p.getName()].clone() : new THREE.Quaternion(); }
const hipRatio = tgtBindPos['Bip01 Pelvis'].y / srcBindPos.Hips.y;
console.log('hip ratio', hipRatio.toFixed(3));

// target bones in hierarchy order (parents first)
const tgtOrder = []; (function walk(n) { tgtOrder.push(n); for (const c of n.listChildren()) walk(c); })(tgt.getRoot().listScenes()[0].listChildren()[0]);
const tgtByName = TH.byName;
const inv = Object.fromEntries(Object.entries(MAP).map(([s, t]) => [t, s]));
const pelvis = tgtByName.get('Bip01 Pelvis'), pelvisParentW = worldOf(TH.parent.get(pelvis), TH);

// ---------------------------------------------------------------- retarget one clip
const meta = {};
async function retarget(file, name, loop, rule) {
  const doc = await io.read(path.join(DIR, `anim-${file}.glb`));
  const H = hierarchy(doc.getRoot());
  const anim = doc.getRoot().listAnimations()[0];
  const samp = new Map();
  let dur = 0;
  for (const ch of anim.listChannels()) { samp.set(ch.getTargetNode().getName() + '.' + ch.getTargetPath(), sampler(ch)); dur = Math.max(dur, ch.getSampler().getInput().getMax([])[0]); }
  const n = Math.max(2, Math.round(dur * FPS) + 1);
  const times = [], rot = {}, pel = [];
  for (const t of Object.values(MAP)) rot[t] = [];
  const hipsPath = [], feet = [];
  for (let f = 0; f < n; f++) {
    const t = Math.min(dur, f / FPS); times.push(t);
    const local = (node) => {
      const nm = node.getName();
      const T = samp.get(nm + '.translation'), R = samp.get(nm + '.rotation'), S = samp.get(nm + '.scale');
      return new THREE.Matrix4().compose(new THREE.Vector3(...(T ? T(t) : node.getTranslation())), new THREE.Quaternion(...(R ? R(t) : node.getRotation())), new THREE.Vector3(...(S ? S(t) : node.getScale())));
    };
    const sw = {}; for (const s of Object.keys(MAP)) sw[s] = worldOf(H.byName.get(s), H, local);
    hipsPath.push(posOf(sw.Hips)); feet.push([posOf(sw.LeftFoot), posOf(sw.RightFoot)]);
    // target world rotations, then locals parents-first
    const tw = new Map();
    for (const node of tgtOrder) {
      const nm = node.getName(), p = TH.parent.get(node);
      const pw = p && tw.has(p.getName()) ? tw.get(p.getName()) : (p ? rotOf(worldOf(p, TH)) : new THREE.Quaternion());
      if (inv[nm]) {
        const s = inv[nm];
        const delta = rotOf(sw[s]).multiply(srcBind[s].clone().invert());
        const w = delta.multiply(ALIGN[s].clone().multiply(tgtBind[nm]));
        tw.set(nm, w);
        rot[nm].push(pw.clone().invert().multiply(w));
      } else tw.set(nm, pw.clone().multiply(new THREE.Quaternion(...node.getRotation())));
    }
  }
  // hips: vertical bob scaled, sway kept small, travel measured and removed (linear trend)
  const p0 = hipsPath[0], pN = hipsPath[n - 1];
  // in-place clips: the planted (lower) foot slides back at the walking speed
  let vs = 0, nv = 0;
  for (let f = 1; f < n; f++) { const lo = feet[f][0].y < feet[f][1].y ? 0 : 1; const dz = (feet[f][lo].z - feet[f - 1][lo].z) - (hipsPath[f].z - hipsPath[f - 1].z); if (Math.min(feet[f][0].y, feet[f][1].y) < srcBindPos.LeftFoot.y + 0.04) { vs += -dz * FPS; nv++; } }
  const speed = nv ? (vs / nv) * hipRatio : 0;
  for (let f = 0; f < n; f++) {
    const k = f / (n - 1), p = hipsPath[f];
    let dx = (p.x - (p0.x + (pN.x - p0.x) * k)) * hipRatio, dy = (p.y - srcBindPos.Hips.y) * hipRatio, dz = (p.z - (p0.z + (pN.z - p0.z) * k)) * hipRatio;
    if (!loop) { dx = 0; dz = 0; }
    dx = Math.max(-0.05, Math.min(0.05, dx)); dz = Math.max(-0.06, Math.min(0.06, dz));
    if (rule === 'drop') dy = Math.min(dy, 0.02);
    const wpos = tgtBindPos['Bip01 Pelvis'].clone().add(new THREE.Vector3(dx, dy, dz));
    pel.push(wpos.applyMatrix4(pelvisParentW.clone().invert()));
  }
  // hips height curve (for reading the jump timing)
  const ys = hipsPath.map((p) => +(p.y - srcBindPos.Hips.y).toFixed(3));
  meta[name] = { dur: +dur.toFixed(3), speed: +speed.toFixed(3), loop };
  if (name === 'jump' || name === 'ko' || name === 'knock' || name === 'getup') console.log(name, 'hips dy every 3rd frame', ys.filter((_, i) => i % 3 === 0).join(' '));
  // write into the target document
  const R = tgt.getRoot(), buf = R.listBuffers()[0];
  const A = tgt.createAnimation(name);
  const tAcc = tgt.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf);
  for (const [nm, qs] of Object.entries(rot)) {
    // keep quaternions in one hemisphere so the slerp never takes the long way round
    for (let i = 1; i < qs.length; i++) if (qs[i].dot(qs[i - 1]) < 0) qs[i].set(-qs[i].x, -qs[i].y, -qs[i].z, -qs[i].w);
    const out = tgt.createAccessor().setType('VEC4').setArray(new Float32Array(qs.flatMap((q) => q.toArray()))).setBuffer(buf);
    const S = tgt.createAnimationSampler().setInput(tAcc).setOutput(out).setInterpolation('LINEAR');
    A.addSampler(S).addChannel(tgt.createAnimationChannel().setTargetNode(tgtByName.get(nm)).setTargetPath('rotation').setSampler(S));
  }
  const pAcc = tgt.createAccessor().setType('VEC3').setArray(new Float32Array(pel.flatMap((v) => v.toArray()))).setBuffer(buf);
  const PS = tgt.createAnimationSampler().setInput(tAcc).setOutput(pAcc).setInterpolation('LINEAR');
  A.addSampler(PS).addChannel(tgt.createAnimationChannel().setTargetNode(pelvis).setTargetPath('translation').setSampler(PS));
}

for (const a of tgt.getRoot().listAnimations()) if (!KEEP_IDLES.includes(a.getName())) { for (const c of a.listChannels()) c.dispose(); for (const sm of a.listSamplers()) { const i = sm.getInput(), o = sm.getOutput(); sm.dispose(); for (const acc of [i, o]) if (acc && acc.listParents().length <= 1) acc.dispose(); } a.dispose(); }
for (const [f, nm, loop, rule] of CLIPS) await retarget(f, nm, loop, rule);
for (const a of tgt.getRoot().listAnimations()) if (KEEP_IDLES.includes(a.getName())) { let d = 0; for (const s of a.listSamplers()) d = Math.max(d, s.getInput().getMax([])[0]); meta[a.getName()] = { dur: +d.toFixed(3), speed: 0, loop: true }; }
tgt.getRoot().setExtras({ clips: meta, source: 'Microsoft Rocketbox Wood_Male_01 (MIT) + retargeted motion capture' });
await tgt.transform(resample({ tolerance: 0.0005 }), prune(), dedup());
await io.write(OUT, tgt);
console.log(JSON.stringify(meta));
console.log('wrote', OUT);
