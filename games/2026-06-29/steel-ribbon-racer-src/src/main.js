import {
  Fog,
  Box3,
  CanvasTexture,
  InstancedMesh,
  Group,
  Shape,
  HemisphereLight,
  CircleGeometry,
  Mesh,
  SpriteMaterial,
  Line,
  LineSegments,
  CylinderGeometry,
  Object3D,
  BoxGeometry,
  DodecahedronGeometry,
  ConeGeometry,
  Scene,
  DirectionalLight,
  IcosahedronGeometry,
  PointLight,
  ShapeGeometry,
  Sprite,
  TorusGeometry,
  Vector3,
  Matrix4,
  MeshStandardMaterial,
  MeshBasicMaterial,
  WebGLRenderer,
  LineBasicMaterial,
  Vector2,
  Color,
  PerspectiveCamera,
  BufferGeometry,
  Quaternion,
  SphereGeometry,
  PlaneGeometry,
  InstancedBufferAttribute,
  Raycaster,
  PMREMGenerator,
  Clock,
  MathUtils,
  ShaderMaterial,
  RingGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  Float32BufferAttribute,
  AdditiveBlending,
  SRGBColorSpace,
  ACESFilmicToneMapping,
  BackSide,
  PCFSoftShadowMap,
  DoubleSide,
  RepeatWrapping,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import "./style.css";

const Lr = document.querySelector("#game"),
  Qt = new WebGLRenderer({ canvas: Lr, antialias: !0, powerPreference: "high-performance", preserveDrawingBuffer: !0 });
// Mobile perf trims: the city is draw-call heavy, so phones skip shadows and render at a lower pixel ratio.
const mobilePerf = (window.matchMedia?.("(pointer: coarse)").matches ?? !1) || window.innerWidth < 720;
Qt.setPixelRatio(Math.min(window.devicePixelRatio, mobilePerf ? 1.5 : 2));
Qt.setSize(window.innerWidth, window.innerHeight);
Qt.shadowMap.enabled = !mobilePerf;
Qt.info.autoReset = !1;
Qt.shadowMap.type = PCFSoftShadowMap;
Qt.outputColorSpace = SRGBColorSpace;
Qt.toneMapping = ACESFilmicToneMapping;
Qt.toneMappingExposure = 1.12;
const et = new Scene();
window.__steelRibbonScene = et;
et.background = new Color(16764588);
et.fog = new Fog(14719602, 360, 2150);
const Ld = new PMREMGenerator(Qt);
Ld.compileEquirectangularShader();
et.environment = Ld.fromScene(new RoomEnvironment(), 0.04).texture;
et.environmentIntensity = 0.58;
const Xe = new PerspectiveCamera(69, window.innerWidth / window.innerHeight, 0.08, 1800);
et.add(Xe);
const Qe = {
  menu: document.querySelector("#menu"),
  result: document.querySelector("#result"),
  resultText: document.querySelector("#resultText"),
  startBtn: document.querySelector("#startBtn"),
  practiceBtn: document.querySelector("#practiceBtn"),
  freeRunBtn: document.querySelector("#freeRunBtn"),
  roamBtn: document.querySelector("#roamBtn"),
  againBtn: document.querySelector("#againBtn"),
  hud: document.querySelector("#hud"),
  speedo: document.querySelector("#speedo"),
  boostGauge: document.querySelector("#boostGauge"),
  damage: document.querySelector("#damage"),
  lap: document.querySelector("#lap"),
  timer: document.querySelector("#timer"),
  score: document.querySelector("#score"),
  best: document.querySelector("#best"),
  resultStats: document.querySelector("#resultStats"),
  tach: document.querySelector("#tach"),
  centerMessage: document.querySelector("#centerMessage"),
  speedFx: document.querySelector("#speedFx"),
  damageFx: document.querySelector("#damageFx"),
  touchControls: document.querySelector("#touchControls"),
  raceStrip: document.querySelector("#raceStrip"),
  playerProgress: document.querySelector("#playerProgress"),
  rivalProgress: document.querySelector("#rivalProgress"),
  position: document.querySelector("#position"),
  trackName: document.querySelector("#trackName"),
  courseName: document.querySelector("#courseName"),
  courseButtons: Array.from(document.querySelectorAll(".course-btn")),
};
window.__steelRibbonTelemetry = {
  mode: "menu",
  s: 0,
  speed: 0,
  lap: 1,
  score: 0,
  forwardWorld: { x: 0, y: 0, z: -1 },
  cameraWorld: { x: 0, y: 0, z: -1 },
};
const _t = new Set(),
  Fe = {
    steer: 0,
    throttle: 0,
    brake: 0,
    lookX: 0,
    lookY: 0,
    zoom: 0,
    lookPointer: null,
    drivePointer: null,
    pinchStartDistance: 0,
    pinchStartZoom: 0,
  },
  p1 = new Clock(),
  on = new Vector3(0, 1, 0),
  Dd = new Vector3(),
  Id = new Vector3(),
  rl = new Vector3(),
  Ln = new Object3D(),
  Ud = 0.86,
  Ac = 1.2,
  m1 = 0.78,
  Wn = 0.55,
  di = { x0: -700, x1: 700, zNear: 380, zFar: -1500, pitch: 130, streetW: 20 },
  is = [
    {
      name: "The Little Ramp",
      length: 2380,
      width: 22,
      laps: 3,
      shape: { x1: 372, x2: 82, x3: 34, z1: 372, z2: 64, z3: 30, y0: 54, y1: 7, y2: 10, y3: 5 },
      gaps: [
        { start: 332, end: 394, name: "Sky Gap", approach: 72, carry: 16, rise: 42, settle: 86 },
        { start: 950, end: 1007, name: "The Long Drop", approach: 82, carry: 18, rise: 48, settle: 96 },
        { start: 1680, end: 1744, name: "Bridge Break", approach: 90, carry: 18, rise: 54, settle: 104 },
      ],
      ramps: [
        { s: 260, amp: 34, width: 95 },
        { s: 530, amp: -18, width: 70 },
        { s: 875, amp: 38, width: 110 },
        { s: 1220, amp: 26, width: 80 },
        { s: 1275, amp: 42, width: 40 },
        { s: 1582, amp: 44, width: 120 },
        { s: 2050, amp: -24, width: 92 },
      ],
    },
    {
      name: "Coil Spring",
      length: 2600,
      width: 20,
      laps: 3,
      shape: { x1: 300, x2: 150, x3: 78, z1: 300, z2: -126, z3: 66, y0: 62, y1: 11, y2: 22, y3: 12 },
      gaps: [
        { start: 470, end: 524, name: "Helter", approach: 70, carry: 16, rise: 46, settle: 88 },
        { start: 1180, end: 1232, name: "Coil Drop", approach: 84, carry: 18, rise: 52, settle: 98 },
        { start: 1980, end: 2030, name: "Spring Snap", approach: 88, carry: 18, rise: 56, settle: 102 },
      ],
      ramps: [
        { s: 240, amp: 40, width: 80 },
        { s: 760, amp: -22, width: 70 },
        { s: 1040, amp: 46, width: 96 },
        { s: 1480, amp: 30, width: 84 },
        { s: 1760, amp: 52, width: 108 },
        { s: 2280, amp: -26, width: 90 },
      ],
    },
    {
      name: "Long Haul",
      length: 3200,
      width: 24,
      laps: 2,
      shape: { x1: 462, x2: 44, x3: 22, z1: 462, z2: 56, z3: -30, y0: 48, y1: 14, y2: 8, y3: 4 },
      gaps: [
        { start: 620, end: 700, name: "The Reach", approach: 96, carry: 20, rise: 52, settle: 112 },
        { start: 1640, end: 1726, name: "Canyon Carry", approach: 100, carry: 22, rise: 58, settle: 120 },
        { start: 2540, end: 2618, name: "Final Stretch Gap", approach: 96, carry: 20, rise: 54, settle: 116 },
      ],
      ramps: [
        { s: 320, amp: 30, width: 130 },
        { s: 1080, amp: -20, width: 110 },
        { s: 1980, amp: 36, width: 140 },
        { s: 2900, amp: 28, width: 120 },
      ],
    },
    {
      name: "Switchback",
      length: 2900,
      width: 20,
      laps: 3,
      shape: { x1: 330, x2: -186, x3: 98, z1: 330, z2: 156, z3: -84, y0: 66, y1: 8, y2: 15, y3: 7 },
      gaps: [
        { start: 360, end: 402, name: "Hairpin Hop", approach: 76, carry: 16, rise: 48, settle: 90 },
        { start: 1120, end: 1162, name: "Switch Drop", approach: 88, carry: 18, rise: 56, settle: 98 },
        { start: 1820, end: 1862, name: "Ridge Jump", approach: 92, carry: 18, rise: 60, settle: 102 },
      ],
      ramps: [
        { s: 220, amp: 44, width: 74 },
        { s: 620, amp: -24, width: 64 },
        { s: 900, amp: 50, width: 92 },
        { s: 1340, amp: 32, width: 78 },
        { s: 1600, amp: 56, width: 104 },
        { s: 2080, amp: -28, width: 84 },
        { s: 2680, amp: 40, width: 96 },
      ],
    },
  ],
  Fd = Math.max(...is.map((i) => i.width));
let Ma = 0,
  ce = is[0];
const u = {
  mode: "menu",
  practice: !1,
  freeRun: !1,
  breakdownTimer: 0,
  s: 22,
  totalDistance: 22,
  lastSafeS: 22,
  lastSafeDistance: 22,
  lateral: 0,
  lateralVel: 0,
  speed: 0,
  gear: 1,
  tachRpm: 900,
  y: 0,
  yVel: 0,
  grounded: !0,
  boost: 1,
  damage: 0,
  lap: 1,
  time: 0,
  score: 0,
  airtime: 0,
  rivalS: 0,
  rivalDistance: 0,
  rivalSpeed: 58,
  cameraShake: 0,
  lastGap: null,
  messageTimer: 0,
  message: "",
  bestLap: 1 / 0,
  lapStartTime: 0,
  splitTimes: [],
  cleanLandings: 0,
  hardLandings: 0,
  recoveries: 0,
  nearMisses: 0,
  leadState: "P2",
  roamYaw: 0,
  camYaw: 0,
  camLookYaw: 0,
  camLookPitch: 0,
  cameraZoom: 0,
  wheelSteer: 0,
  roamSlip: 0,
  roamSuspension: 0,
  collisionDrama: 0,
  collisionHits: 0,
  collisionCooldown: 0,
  objectiveIndex: 0,
  objectiveHits: 0,
  objectiveLap: 1,
  roamPos: new Vector3(),
  best: Number(localStorage.getItem("steel-ribbon-best") || 0),
};
Qe.best.textContent = `Best score ${u.best}`;
// Track view mode: cinematic chase camera (default) or the classic cockpit view (toggle with C).
let trackViewMode = localStorage.getItem("steel-ribbon-view") === "cockpit" ? "cockpit" : "chase";
function applyTrackViewClass() {
  const onTrack = u.mode === "race" || u.mode === "paused" || u.mode === "result";
  (document.body.classList.toggle("chase-mode", onTrack && trackViewMode === "chase"),
    document.body.classList.toggle("menu-mode", u.mode === "menu"));
}
applyTrackViewClass();
function toggleTrackView() {
  ((trackViewMode = trackViewMode === "chase" ? "cockpit" : "chase"),
    localStorage.setItem("steel-ribbon-view", trackViewMode),
    applyTrackViewClass(),
    (u.message = trackViewMode === "chase" ? "Chase camera" : "Cockpit camera"),
    (u.messageTimer = 0.9));
}
// Floating score popups + arcade chimes shared by track and roam modes.
const scorePopEls = [];
function showScorePop(text, gold = !1) {
  let el = scorePopEls.find((n) => !n.busy);
  if (!el) {
    if (scorePopEls.length >= 4) el = scorePopEls[0];
    else {
      el = { node: document.createElement("div"), busy: !1, t: null };
      el.node.className = "score-pop";
      document.body.appendChild(el.node);
      scorePopEls.push(el);
    }
  }
  const n = el.node;
  (n.classList.toggle("gold", gold),
    (n.textContent = text),
    (n.style.left = `calc(50% + ${((Math.random() * 90 - 45) | 0)}px)`),
    (n.style.top = `${33 + Math.random() * 9}%`),
    n.classList.remove("pop"),
    void n.offsetWidth,
    n.classList.add("pop"),
    (el.busy = !0),
    clearTimeout(el.t),
    (el.t = setTimeout(() => (el.busy = !1), 1e3)));
}
function chime(freq = 880, dur = 0.16, type = "triangle", gain = 0.16) {
  if (!mi) return;
  const { ctx } = mi,
    o = ctx.createOscillator(),
    g = ctx.createGain();
  ((o.type = type),
    o.frequency.setValueAtTime(freq, ctx.currentTime),
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur),
    g.gain.setValueAtTime(gain, ctx.currentTime),
    g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + dur + 0.05),
    o.connect(g).connect(mi.master || ctx.destination),
    o.start(),
    o.stop(ctx.currentTime + dur + 0.06));
}
let lastHonk = 0;
function trafficHonk() {
  if (!mi || mi.ctx.currentTime - lastHonk < 0.45) return;
  lastHonk = mi.ctx.currentTime;
  const { ctx } = mi,
    freq = [352, 396, 440][(Math.random() * 3) | 0];
  for (const [at, dur] of [
    [0, 0.14],
    [0.2, 0.22],
  ]) {
    const o = ctx.createOscillator(),
      o2 = ctx.createOscillator(),
      g = ctx.createGain(),
      t0 = ctx.currentTime + at;
    ((o.type = "square"),
      (o2.type = "square"),
      (o.frequency.value = freq),
      (o2.frequency.value = freq * 1.26),
      g.gain.setValueAtTime(1e-4, t0),
      g.gain.linearRampToValueAtTime(0.05, t0 + 0.015),
      g.gain.setValueAtTime(0.05, t0 + dur),
      g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur + 0.04),
      o.connect(g),
      o2.connect(g),
      g.connect(mi.master),
      o.start(t0),
      o2.start(t0),
      o.stop(t0 + dur + 0.05),
      o2.stop(t0 + dur + 0.05));
  }
}
function x1(i) {
  const e = MathUtils.clamp(i, 0, 1);
  return e * e * (3 - 2 * e);
}
function g1(i, e) {
  let t = 0;
  for (const n of i.gaps) {
    const s = n.start - n.approach,
      r = n.start + n.carry,
      a = n.end + n.settle;
    e >= s && e <= r
      ? (t += n.rise * MathUtils.clamp((e - s) / (n.approach + n.carry), 0, 1))
      : e > r && e <= n.end
        ? (t += n.rise)
        : e > n.end && e <= a && (t += n.rise * (1 - x1((e - n.end) / n.settle)));
  }
  return t;
}
function al(i, e) {
  const t = ((e % i.length) + i.length) % i.length,
    n = (t / i.length) * Math.PI * 2,
    s = i.shape,
    r = Math.sin(n) * s.x1 + Math.sin(n * 2) * s.x2 + Math.cos(n * 3) * s.x3,
    a = Math.cos(n) * s.z1 + Math.cos(n * 2) * s.z2 + Math.sin(n * 3) * s.z3;
  return { x: r, z: a, t: n, n: t };
}
function Nd(i, e) {
  const { t, n } = al(i, e),
    s = i.shape;
  let r = s.y0 + Math.sin(t * 2) * s.y2 + Math.sin(t * 3) * s.y3 + Math.cos(t) * s.y1;
  for (const a of i.ramps) {
    let o = n - a.s;
    (o > i.length / 2 && (o -= i.length),
      o < -i.length / 2 && (o += i.length),
      (r += a.amp * Math.exp(-(o * o) / (a.width * a.width))));
  }
  return ((r += g1(i, n)), r);
}
function ua(i) {
  const { x: e, z: t, n } = al(ce, i),
    s = Nd(ce, n);
  return new Vector3(e, s, t);
}
function St(i) {
  const e = ((i % ce.length) + ce.length) % ce.length,
    t = ua(e),
    s = ua(e + 2)
      .sub(t)
      .normalize(),
    r = Dd.crossVectors(on, s).normalize(),
    a = ua(e - 2).y,
    o = ua(e + 2).y,
    c = Math.atan2(o - a, 4),
    l = Math.sin(e * 0.012) * 0.18 + Math.sin(e * 0.032) * 0.08,
    d = ce.gaps.find((f) => e > f.start && e < f.end);
  return { s: e, p: t, tangent: s, side: r.clone(), grade: c, bank: l, gap: d };
}
function Li(i) {
  const e = ((i % ce.length) + ce.length) % ce.length;
  return ce.gaps.some((t) => e > t.start && e < t.end);
}
function Th(i) {
  return MathUtils.clamp(i / (ce.length * ce.laps), 0, 1);
}
function Eh(i, e, t) {
  const n = Math.floor(i / ce.length),
    s = Math.floor(e / ce.length);
  for (let r = n; r <= s; r++) {
    const a = r * ce.length + t;
    if (i < a && e >= a) return !0;
  }
  return !1;
}
function v1(i = 256, e = 8) {
  const t = document.createElement("canvas");
  ((t.width = i), (t.height = i));
  const n = t.getContext("2d"),
    s = i / e;
  for (let a = 0; a < e; a++)
    for (let o = 0; o < e; o++) ((n.fillStyle = (o + a) % 2 ? "#101318" : "#f5f1df"), n.fillRect(o * s, a * s, s, s));
  const r = new CanvasTexture(t);
  return ((r.colorSpace = SRGBColorSpace), (r.wrapS = RepeatWrapping), (r.wrapT = RepeatWrapping), r.repeat.set(3, 1), r);
}
function _1(i = 512) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = t.createLinearGradient(0, 0, i, 0);
  (n.addColorStop(0, "#9c9b77"),
    n.addColorStop(0.18, "#c9c69a"),
    n.addColorStop(0.5, "#9f9f79"),
    n.addColorStop(0.82, "#c0bd91"),
    n.addColorStop(1, "#858563"),
    (t.fillStyle = n),
    t.fillRect(0, 0, i, i),
    (t.strokeStyle = "rgba(38, 44, 36, 0.32)"),
    (t.lineWidth = 2));
  for (let r = 0; r < i; r += 64) (t.beginPath(), t.moveTo(0, r + 2), t.lineTo(i, r + 2), t.stroke());
  ((t.strokeStyle = "rgba(250, 242, 180, 0.22)"), (t.lineWidth = 3));
  for (const r of [48, 464]) (t.beginPath(), t.moveTo(r, 0), t.lineTo(r, i), t.stroke());
  ((t.strokeStyle = "rgba(28, 31, 30, 0.24)"), (t.lineWidth = 3));
  for (let r = 0; r < 42; r++) {
    const a = i * (0.28 + Math.random() * 0.44),
      o = Math.random() * i;
    (t.beginPath(),
      t.moveTo(a, o),
      t.bezierCurveTo(
        a + Math.random() * 22 - 11,
        o + 36,
        a + Math.random() * 22 - 11,
        o + 82,
        a + Math.random() * 16 - 8,
        o + 130,
      ),
      t.stroke());
  }
  t.fillStyle = "rgba(24, 29, 25, 0.16)";
  for (let r = 0; r < 36; r++)
    (t.beginPath(),
      t.ellipse(
        Math.random() * i,
        Math.random() * i,
        6 + Math.random() * 22,
        2 + Math.random() * 8,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      ),
      t.fill());
  for (let r = 0; r < 2200; r++) {
    const a = 110 + Math.floor(Math.random() * 60);
    ((t.fillStyle = `rgba(${a}, ${a}, ${a - 12}, ${0.035 + Math.random() * 0.055})`),
      t.fillRect(Math.random() * i, Math.random() * i, 1 + Math.random() * 2, 1 + Math.random() * 2));
  }
  const s = new CanvasTexture(e);
  return (
    (s.colorSpace = SRGBColorSpace),
    (s.wrapS = RepeatWrapping),
    (s.wrapT = RepeatWrapping),
    s.repeat.set(1.25, 20),
    (s.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())),
    s
  );
}
function M1(i = 1024) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = t.createLinearGradient(0, 0, i, i);
  (n.addColorStop(0, "#2e6a40"),
    n.addColorStop(0.42, "#487443"),
    n.addColorStop(1, "#1f4a37"),
    (t.fillStyle = n),
    t.fillRect(0, 0, i, i));
  // large mottled patches give the lawn tonal variety at distance
  for (let r = 0; r < 120; r++) {
    const cx = Math.random() * i,
      cy = Math.random() * i,
      cr = 30 + Math.random() * 120,
      g2 = t.createRadialGradient(cx, cy, 0, cx, cy, cr),
      warm = Math.random() < 0.4;
    (g2.addColorStop(0, warm ? `rgba(140, 150, 70, ${0.06 + Math.random() * 0.1})` : `rgba(30, 90, 52, ${0.08 + Math.random() * 0.12})`),
      g2.addColorStop(1, "rgba(0,0,0,0)"));
    ((t.fillStyle = g2), t.beginPath(), t.arc(cx, cy, cr, 0, Math.PI * 2), t.fill());
  }
  // fine blade speckle
  for (let r = 0; r < 9000; r++) {
    const a = 0.03 + Math.random() * 0.09,
      o = 82 + Math.floor(Math.random() * 80);
    ((t.fillStyle = `rgba(${34 + Math.random() * 34}, ${o}, ${36 + Math.random() * 30}, ${a})`),
      t.fillRect(Math.random() * i, Math.random() * i, 1, 1 + Math.random() * 3));
  }
  ((t.strokeStyle = "rgba(214, 224, 150, 0.06)"), (t.lineWidth = 2));
  for (let r = -i; r < i * 1.5; r += 76) (t.beginPath(), t.moveTo(r, 0), t.lineTo(r + i * 0.65, i), t.stroke());
  const s = new CanvasTexture(e);
  return (
    (s.colorSpace = SRGBColorSpace),
    (s.wrapS = RepeatWrapping),
    (s.wrapT = RepeatWrapping),
    s.repeat.set(18, 18),
    (s.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())),
    s
  );
}
function S1(i = 1024) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = t.createLinearGradient(0, 0, i, i);
  (n.addColorStop(0, "#2c2d31"), n.addColorStop(0.5, "#35363a"), n.addColorStop(1, "#28292d"), (t.fillStyle = n), t.fillRect(0, 0, i, i));
  // dense fine asphalt grain
  for (let r = 0; r < 26000; r++) {
    const light = Math.random() < 0.48;
    t.fillStyle = light
      ? `rgba(232, 224, 210, ${0.025 + Math.random() * 0.05})`
      : `rgba(0, 0, 0, ${0.035 + Math.random() * 0.06})`;
    t.fillRect(Math.random() * i, Math.random() * i, Math.random() < 0.12 ? 2 : 1, 1);
  }
  // faint meandering cracks + repair patches
  ((t.strokeStyle = "rgba(12, 12, 14, 0.32)"), (t.lineWidth = 1.3));
  for (let r = 0; r < 24; r++) {
    let a = Math.random() * i,
      o = Math.random() * i;
    (t.beginPath(), t.moveTo(a, o));
    for (let s2 = 0; s2 < 7; s2++) ((a += (Math.random() - 0.5) * 64), (o += Math.random() * 46), t.lineTo(a, o));
    t.stroke();
  }
  const s = new CanvasTexture(e);
  return (
    (s.colorSpace = SRGBColorSpace),
    (s.wrapS = RepeatWrapping),
    (s.wrapT = RepeatWrapping),
    s.repeat.set(9, 16),
    (s.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())),
    s
  );
}
function y1(i = 256) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = t.createRadialGradient(i / 2, i / 2, 0, i / 2, i / 2, i / 2);
  (n.addColorStop(0, "rgba(255, 255, 238, 1)"),
    n.addColorStop(0.12, "rgba(255, 239, 178, 0.92)"),
    n.addColorStop(0.35, "rgba(255, 191, 92, 0.36)"),
    n.addColorStop(0.72, "rgba(255, 169, 72, 0.10)"),
    n.addColorStop(1, "rgba(255, 169, 72, 0)"),
    (t.fillStyle = n),
    t.fillRect(0, 0, i, i));
  const s = new CanvasTexture(e);
  return ((s.colorSpace = SRGBColorSpace), s);
}
function As(i = 128, e = 256, t = 0.42, hd = 1) {
  // zoom-detail 44 (round-five item 8): hd=2 doubles canvas AND cell grid —
  // same window layout on the wall, twice the texels per window, plus frame/
  // mullion lines and curtain/blind variation so mid-band walls resolve crisp
  // instead of blurring. hd=1 is the legacy look (kept for the A/B toggle).
  const n = document.createElement("canvas");
  ((n.width = i * hd), (n.height = e * hd));
  const s = n.getContext("2d");
  ((s.fillStyle = "#081722"), s.fillRect(0, 0, i * hd, e * hd));
  for (let a = 10 * hd; a < (e - 8) * hd; a += 18 * hd)
    for (let o = 9 * hd; o < (i - 9) * hd; o += 15 * hd) {
      const lit = Math.random() < t,
        wW = 7 * hd,
        wH = 8 * hd;
      (lit
        ? ((s.shadowColor = "rgba(255, 197, 104, 0.75)"),
          (s.shadowBlur = 5 * hd),
          (s.fillStyle = `rgba(255, ${205 + Math.random() * 38}, ${118 + Math.random() * 72}, ${0.86 + Math.random() * 0.14})`))
        : ((s.shadowBlur = 0), (s.fillStyle = "rgba(42, 92, 125, 0.28)")),
        s.fillRect(o, a, wW, wH));
      if (hd > 1) {
        s.shadowBlur = 0;
        if (lit) {
          const v = Math.random();
          if (v < 0.18) {
            // blind: pale strip pulled partway down
            ((s.fillStyle = "rgba(226, 214, 190, 0.6)"), s.fillRect(o, a, wW, wH * (0.25 + Math.random() * 0.3)));
          } else if (v < 0.3) {
            // curtains: muted side panels
            ((s.fillStyle = "rgba(148, 96, 84, 0.55)"), s.fillRect(o, a, wW * 0.22, wH), s.fillRect(o + wW * 0.78, a, wW * 0.22, wH));
          } else if (v < 0.38) {
            // plant/lamp silhouette on the sill
            ((s.fillStyle = "rgba(30, 40, 30, 0.7)"), s.fillRect(o + wW * 0.6, a + wH * 0.55, wW * 0.2, wH * 0.4));
          }
        }
        // mullion cross + frame
        ((s.strokeStyle = "rgba(9, 16, 24, 0.85)"), (s.lineWidth = 1));
        (s.beginPath(), s.moveTo(o + wW * 0.5, a), s.lineTo(o + wW * 0.5, a + wH), s.moveTo(o, a + wH * 0.45), s.lineTo(o + wW, a + wH * 0.45), s.stroke());
        ((s.strokeStyle = "rgba(12, 22, 32, 0.9)"), s.strokeRect(o - 0.5, a - 0.5, wW + 1, wH + 1));
      }
    }
  ((s.shadowBlur = 0), (s.strokeStyle = "rgba(140, 220, 255, 0.12)"), (s.lineWidth = 1 * hd));
  for (let a = 0; a < i * hd; a += 15 * hd) (s.beginPath(), s.moveTo(a + 3 * hd, 0), s.lineTo(a + 3 * hd, e * hd), s.stroke());
  const r = new CanvasTexture(n);
  return ((r.colorSpace = SRGBColorSpace), r);
}
// live refs for the window-texture A/B toggle (city tower shared materials)
const towerTexSys = { mats: null, hd: 2, args: null };
function b1(i = 256, e = 256, t = "#d9d0bd") {
  const n = document.createElement("canvas");
  ((n.width = i), (n.height = e));
  const s = n.getContext("2d"),
    r = s.createLinearGradient(0, 0, i, e);
  (r.addColorStop(0, t),
    r.addColorStop(0.58, "#f0e5d2"),
    r.addColorStop(1, "#b9b0a1"),
    (s.fillStyle = r),
    s.fillRect(0, 0, i, e),
    (s.fillStyle = "rgba(255,255,255,0.16)"));
  for (let c = 0; c < 1700; c++) {
    const l = 180 + Math.random() * 60;
    ((s.fillStyle = `rgba(${l}, ${l}, ${l - 18}, ${0.018 + Math.random() * 0.04})`),
      s.fillRect(Math.random() * i, Math.random() * e, 1, 1));
  }
  ((s.strokeStyle = "rgba(120, 96, 70, 0.18)"), (s.lineWidth = 2), s.strokeRect(0, e * 0.77, i, e * 0.2));
  const a = (c, l, d, f) => {
    ((s.shadowColor = "rgba(255, 198, 95, 0.48)"),
      (s.shadowBlur = 7),
      (s.fillStyle = "rgba(255, 212, 128, 0.78)"),
      s.fillRect(c, l, d, f),
      (s.shadowBlur = 0),
      (s.strokeStyle = "rgba(70, 54, 44, 0.72)"),
      (s.lineWidth = 4),
      s.strokeRect(c, l, d, f),
      (s.lineWidth = 2),
      s.beginPath(),
      s.moveTo(c + d * 0.5, l + 2),
      s.lineTo(c + d * 0.5, l + f - 2),
      s.moveTo(c + 2, l + f * 0.52),
      s.lineTo(c + d - 2, l + f * 0.52),
      s.stroke());
  };
  (a(i * 0.12, e * 0.24, i * 0.19, e * 0.2),
    a(i * 0.68, e * 0.25, i * 0.2, e * 0.2),
    a(i * 0.43, e * 0.5, i * 0.16, e * 0.16),
    (s.fillStyle = "#4b3d34"),
    s.fillRect(i * 0.43, e * 0.62, i * 0.16, e * 0.29),
    (s.fillStyle = "rgba(255, 218, 120, 0.72)"),
    s.beginPath(),
    s.arc(i * 0.55, e * 0.76, 3, 0, Math.PI * 2),
    s.fill());
  const o = new CanvasTexture(n);
  return (
    (o.colorSpace = SRGBColorSpace),
    (o.wrapS = RepeatWrapping),
    (o.wrapT = RepeatWrapping),
    (o.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())),
    o
  );
}
function w1(i = 512) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = t.createLinearGradient(0, 0, i, i);
  (n.addColorStop(0, "#e77b36"),
    n.addColorStop(0.45, "#a63f24"),
    n.addColorStop(1, "#6b271d"),
    (t.fillStyle = n),
    t.fillRect(0, 0, i, i),
    (t.strokeStyle = "rgba(255, 185, 104, 0.28)"),
    (t.lineWidth = 2));
  for (let r = -20; r < i + 20; r += 26) {
    t.beginPath();
    for (let a = -10; a < i + 10; a += 12) {
      const o = r + Math.sin((a + r) * 0.045) * 3;
      a === -10 ? t.moveTo(a, o) : t.lineTo(a, o);
    }
    t.stroke();
  }
  ((t.strokeStyle = "rgba(75, 24, 18, 0.34)"), (t.lineWidth = 1.5));
  for (let r = 0; r < i; r += 20)
    (t.beginPath(), t.moveTo(r, 0), t.bezierCurveTo(r + 8, i * 0.24, r - 8, i * 0.58, r + 7, i), t.stroke());
  for (let r = 0; r < 1400; r++) {
    const a = 112 + Math.random() * 110;
    ((t.fillStyle = `rgba(${a}, ${52 + Math.random() * 52}, ${28 + Math.random() * 34}, ${0.045 + Math.random() * 0.08})`),
      t.fillRect(Math.random() * i, Math.random() * i, 1 + Math.random() * 2, 1 + Math.random() * 2));
  }
  const s = new CanvasTexture(e);
  return (
    (s.colorSpace = SRGBColorSpace),
    (s.wrapS = RepeatWrapping),
    (s.wrapT = RepeatWrapping),
    s.repeat.set(2.2, 2.2),
    (s.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())),
    s
  );
}
function T1(i = 256, e = 160) {
  const t = document.createElement("canvas");
  ((t.width = i), (t.height = e));
  const n = t.getContext("2d"),
    s = n.createLinearGradient(0, 0, 0, e);
  (s.addColorStop(0, "#4f565c"),
    s.addColorStop(0.55, "#293139"),
    s.addColorStop(1, "#161c23"),
    (n.fillStyle = s),
    n.fillRect(0, 0, i, e),
    (n.strokeStyle = "rgba(210, 225, 232, 0.18)"),
    (n.lineWidth = 3));
  for (let a = 18; a < e; a += 24) (n.beginPath(), n.moveTo(8, a), n.lineTo(i - 8, a), n.stroke());
  ((n.strokeStyle = "rgba(8, 10, 12, 0.72)"), (n.lineWidth = 8), n.strokeRect(4, 4, i - 8, e - 8));
  const r = new CanvasTexture(t);
  return ((r.colorSpace = SRGBColorSpace), r);
}
function Ah(i, e = "#ff4fb7", t = "rgba(12, 5, 30, 0.92)", n = !0) {
  const s = document.createElement("canvas");
  ((s.width = n ? 128 : 384), (s.height = n ? 384 : 128));
  const r = s.getContext("2d"),
    { width: a, height: o } = s;
  ((r.fillStyle = t),
    r.fillRect(0, 0, a, o),
    (r.strokeStyle = e),
    (r.lineWidth = n ? 5 : 6),
    r.strokeRect(8, 8, a - 16, o - 16),
    r.save(),
    r.translate(a / 2, o / 2),
    n && r.rotate(-Math.PI / 2),
    (r.font = `900 ${n ? 54 : 48}px Arial, sans-serif`),
    (r.textAlign = "center"),
    (r.textBaseline = "middle"),
    (r.shadowColor = e),
    (r.shadowBlur = 18),
    (r.fillStyle = e),
    r.fillText(i, 0, 0),
    r.restore());
  const c = new CanvasTexture(s);
  return ((c.colorSpace = SRGBColorSpace), c);
}
const wi = [
    "SKYRAMP",
    "TURBO MOTEL",
    "MIDNIGHT AUTO",
    "RIBBON RADIO",
    "NEON DINER",
    "VECTOR TIRES",
    "NIGHT GARAGE",
    "AERO PARTS",
    "MOONLIGHT LANES",
    "COIL CAFE",
    "JETT FUEL",
    "PIXEL PAWN",
    "BLUE EXIT",
    "CITY MOTORS",
    "OPEN LATE",
  ],
  Ra = ["NEXT EXIT", "24 HOURS", "TUNE UP", "LOW FLYING DEALS", "RACE NIGHT", "HOT COFFEE", "REPAIRS", "LIVE MUSIC"],
  Ti = ["#ff4fb7", "#4ff3ff", "#ffd45b", "#68ff8f", "#ff7c4f", "#b56bff"];
function Od(i, e, t = "#4ff3ff") {
  const n = document.createElement("canvas");
  ((n.width = 640), (n.height = 256));
  const s = n.getContext("2d"),
    r = s.createLinearGradient(0, 0, 640, 256);
  (r.addColorStop(0, "#111722"),
    r.addColorStop(0.55, "#20344a"),
    r.addColorStop(1, "#171024"),
    (s.fillStyle = r),
    s.fillRect(0, 0, 640, 256),
    (s.fillStyle = t),
    (s.globalAlpha = 0.18));
  for (let o = -80; o < 700; o += 72)
    (s.beginPath(),
      s.moveTo(o, 256),
      s.lineTo(o + 110, 0),
      s.lineTo(o + 145, 0),
      s.lineTo(o + 35, 256),
      s.closePath(),
      s.fill());
  ((s.globalAlpha = 1),
    (s.strokeStyle = t),
    (s.lineWidth = 12),
    s.strokeRect(16, 16, 608, 224),
    (s.shadowColor = t),
    (s.shadowBlur = 18),
    (s.fillStyle = "#f7fbff"),
    (s.font = "900 64px Arial Black, Arial, sans-serif"),
    (s.textAlign = "center"),
    (s.textBaseline = "middle"),
    s.fillText(i, 320, 102, 560),
    (s.shadowBlur = 10),
    (s.fillStyle = t),
    (s.font = "800 30px Arial, sans-serif"),
    s.fillText(e, 320, 168, 520),
    (s.shadowBlur = 0),
    (s.fillStyle = "rgba(255,255,255,0.72)"),
    (s.font = "700 18px Arial, sans-serif"),
    s.fillText("STEEL RIBBON CITY", 320, 212, 520));
  const a = new CanvasTexture(n);
  return ((a.colorSpace = SRGBColorSpace), (a.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())), a);
}
function Eo(i, e = "#ffd45b") {
  const t = document.createElement("canvas");
  ((t.width = 384), (t.height = 128));
  const n = t.getContext("2d");
  ((n.fillStyle = "#151922"),
    n.fillRect(0, 0, 384, 128),
    (n.fillStyle = e),
    n.fillRect(0, 0, 384, 12),
    n.fillRect(0, 116, 384, 12),
    (n.strokeStyle = "rgba(255,255,255,0.32)"),
    (n.lineWidth = 4),
    n.strokeRect(12, 16, 360, 96),
    (n.shadowColor = e),
    (n.shadowBlur = 14),
    (n.fillStyle = "#f8fbff"),
    (n.font = "900 38px Arial Black, Arial, sans-serif"),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"),
    n.fillText(i, 192, 64, 330));
  const s = new CanvasTexture(t);
  return ((s.colorSpace = SRGBColorSpace), s);
}
function Ao(i = 512, e = 384, t = "#9d4d3d", n = "#2d86b7") {
  const s = document.createElement("canvas");
  ((s.width = i), (s.height = e));
  const r = s.getContext("2d"),
    a = r.createLinearGradient(0, 0, i, e);
  (a.addColorStop(0, t),
    a.addColorStop(0.55, "#b96a55"),
    a.addColorStop(1, "#633428"),
    (r.fillStyle = a),
    r.fillRect(0, 0, i, e),
    (r.strokeStyle = "rgba(50, 24, 18, 0.42)"),
    (r.lineWidth = 2));
  for (let c = 18; c < e; c += 22) {
    (r.beginPath(), r.moveTo(0, c), r.lineTo(i, c), r.stroke());
    for (let l = (Math.floor(c / 22) % 2) * 28; l < i; l += 56)
      (r.beginPath(), r.moveTo(l, c - 18), r.lineTo(l, c), r.stroke());
  }
  ((r.fillStyle = "rgba(17, 24, 31, 0.92)"),
    r.fillRect(34, e * 0.58, i - 68, e * 0.28),
    (r.fillStyle = "rgba(120, 210, 255, 0.32)"));
  for (let c = 58; c < i - 48; c += 78) r.fillRect(c, e * 0.62, 52, e * 0.19);
  ((r.fillStyle = n),
    r.fillRect(22, e * 0.49, i - 44, 34),
    (r.fillStyle = "#f7f4df"),
    (r.font = "900 42px Arial Black, Arial, sans-serif"),
    (r.textAlign = "center"),
    (r.textBaseline = "middle"),
    (r.shadowColor = n),
    (r.shadowBlur = 12),
    r.fillText("OPEN", i / 2, e * 0.28, i * 0.76),
    (r.shadowBlur = 0));
  const o = new CanvasTexture(s);
  return ((o.colorSpace = SRGBColorSpace), (o.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())), o);
}
function E1(i = 384, e = 384) {
  const t = document.createElement("canvas");
  ((t.width = i), (t.height = e));
  const n = t.getContext("2d");
  ((n.fillStyle = "#868f96"), n.fillRect(0, 0, i, e));
  for (let r = 18; r < e; r += 54)
    ((n.fillStyle = "rgba(30, 38, 44, 0.62)"),
      n.fillRect(22, r, i - 44, 24),
      (n.fillStyle = "rgba(215, 225, 232, 0.44)"),
      n.fillRect(20, r + 26, i - 40, 6));
  ((n.strokeStyle = "rgba(255,255,255,0.22)"), (n.lineWidth = 3));
  for (let r = 0; r < i; r += 64) (n.beginPath(), n.moveTo(r, 0), n.lineTo(r, e), n.stroke());
  ((n.fillStyle = "#ffffff"),
    (n.font = "900 96px Arial Black, Arial, sans-serif"),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"),
    n.fillText("P", i * 0.5, e * 0.48));
  const s = new CanvasTexture(t);
  return ((s.colorSpace = SRGBColorSpace), (s.anisotropy = Math.min(16, Qt.capabilities.getMaxAnisotropy())), s);
}
function A1(i = 256) {
  const e = document.createElement("canvas");
  ((e.width = i), (e.height = i));
  const t = e.getContext("2d"),
    n = i / 2,
    s = i / 2,
    r = i * 0.43;
  (t.clearRect(0, 0, i, i), t.beginPath());
  for (let o = 0; o < 8; o++) {
    const c = -Math.PI / 8 + (o * Math.PI) / 4,
      l = n + Math.cos(c) * r,
      d = s + Math.sin(c) * r;
    o === 0 ? t.moveTo(l, d) : t.lineTo(l, d);
  }
  (t.closePath(),
    (t.fillStyle = "#c91f24"),
    t.fill(),
    (t.lineWidth = i * 0.035),
    (t.strokeStyle = "#f9f6ee"),
    t.stroke(),
    (t.fillStyle = "#ffffff"),
    (t.font = `900 ${Math.round(i * 0.27)}px Arial, sans-serif`),
    (t.textAlign = "center"),
    (t.textBaseline = "middle"),
    t.fillText("STOP", n, s + i * 0.015));
  const a = new CanvasTexture(e);
  return ((a.colorSpace = SRGBColorSpace), a);
}
function He(i, e) {
  return -7 + Math.sin(i * 0.018) * 4 + Math.cos(e * 0.014) * 5 + Math.sin((i + e) * 0.006) * 10;
}
function $i(i, e, t, n) {
  // 5x5 min-sample of the footprint (was 3x3): a trustworthy minimum lets the
  // placers keep a SMALL anti-float margin instead of burying every building
  // half a meter — the "sunk into the ground" report (2026-07-16).
  const s = t * 0.5,
    r = n * 0.5;
  let a = He(i, e);
  for (const o of [-s, -s * 0.5, 0, s * 0.5, s]) for (const c of [-r, -r * 0.5, 0, r * 0.5, r]) a = Math.min(a, He(i + o, e + c));
  return a;
}
function ka(i, e, t = 10) {
  const { x0: n, x1: s, zNear: r, zFar: a, pitch: o, streetW: c } = di;
  if (i < n - c || i > s + c || e < a - c || e > r + c) return !1;
  const l = Math.abs(((i - n + o / 2) % o) - o / 2),
    d = Math.abs(((r - e + o / 2) % o) - o / 2);
  return Math.min(l, d) < c * 0.5 + t;
}
const Qi = { streetGlowSprites: 0, waterBlockers: 0, lowFogDisks: 0 };
function Hi(i, e, t, n, s = 8) {
  const { x0: r, x1: a, zNear: o, zFar: c, pitch: l, streetW: d } = di,
    f = t * 0.5,
    p = n * 0.5,
    m = d * 0.5 + s;
  let g = null;
  const M = (x, h, _) => {
    (!g || _ > g.overlap) && (g = { axis: x, road: h, overlap: _ });
  };
  for (let x = r; x <= a + 1; x += l) {
    if (e + p < c - m || e - p > o + m) continue;
    const h = f + m - Math.abs(i - x);
    h > 0 && M("x", Math.round(x), h);
  }
  for (let x = o; x >= c - 1; x -= l) {
    if (i + f < r - m || i - f > a + m) continue;
    const h = p + m - Math.abs(e - x);
    h > 0 && M("z", Math.round(x), h);
  }
  return g;
}
// ─── Water system: animated ripple shader, pond registry, depth query ───
const ponds = [],
  waterMats = [],
  // parked-car ride system: instance spots the player can steal from
  rideSys = { spots: [], im: null, imW: null };
function makeWaterMaterial(scale = 1) {
  const m = new ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    uniforms: { uTime: { value: 0 }, uScale: { value: scale } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScale;
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r2 = dot(p, p);
        vec2 q = p * uScale;
        float w = sin(q.x * 21.0 + uTime * 1.5) * 0.5
                + sin(q.y * 17.0 - uTime * 1.15) * 0.5
                + sin((q.x + q.y) * 13.0 + uTime * 2.1) * 0.35
                + sin(length(q) * 30.0 - uTime * 2.6) * 0.25;
        vec3 deep = vec3(0.035, 0.1, 0.19);
        vec3 sky = vec3(0.62, 0.42, 0.36);
        vec3 col = mix(deep, sky, clamp(0.1 + 0.09 * w + 0.16 * r2, 0.0, 1.0));
        float sparkle = pow(max(0.0, sin(q.x * 29.0 + q.y * 23.0 + uTime * 3.0) * w), 8.0);
        col += vec3(1.0, 0.72, 0.45) * sparkle * 0.14;
        float alpha = 0.94 * smoothstep(1.0, 0.84, r2);
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  return (waterMats.push(m), m);
}
function registerPond(x, z, rx, rz = rx, waterY = null) {
  ponds.push({ x, z, rx, rz, waterY });
}
function pondDepthAt(x, z) {
  let depth = 0,
    pond = null;
  for (const p of ponds) {
    const nx = (x - p.x) / p.rx,
      nz = (z - p.z) / p.rz,
      q = nx * nx + nz * nz;
    if (q < 1) {
      let d = Math.pow(1 - q, 1.35);
      // Terrain-gated water (the big lake): its flat disc is buried under hillsides across
      // much of its footprint — no visible water there means no drag or splash either.
      if (p.waterY != null) d *= MathUtils.clamp((p.waterY - He(x, z)) / 0.55, 0, 1);
      d > depth && ((depth = d), (pond = p));
    }
  }
  return { depth, pond };
}
const Sa = [],
  Co = [],
  Bd = [];
let Ch = 0;
function Bn(i, e) {
  return (Bd.push({ obj: i, update: e }), i);
}
function zd(i) {
  Ch += i;
  for (const e of Bd) e.update(Ch, i);
}
function kd() {
  if (Co.length === 0)
    for (let i = 0; i < is.length; i++) {
      const e = is[i];
      for (let t = 0; t < e.length; t += 14) {
        const n = al(e, t);
        Co.push({ x: n.x, y: Nd(e, t), z: n.z, s: t, courseIndex: i });
      }
    }
  return Co;
}
function Pn(i, e, t = 0) {
  let n = null,
    s = 1 / 0;
  for (const r of kd()) {
    const a = i - r.x,
      o = e - r.z,
      c = Math.hypot(a, o);
    c < s && ((s = c), (n = r));
  }
  return { clearance: s - t - Fd * 0.58, distance: s, nearestS: n?.s ?? 0 };
}
function Wi(i, e, t, n, s, r = 9) {
  const a = t * 0.5,
    o = n * 0.5,
    c = Fd * 0.62 + r;
  let l = null;
  for (const d of kd()) {
    const f = Math.max(Math.abs(d.x - i) - a, 0),
      p = Math.max(Math.abs(d.z - e) - o, 0),
      m = Math.hypot(f, p) - c;
    if (m > 0) continue;
    const g = d.y - 2.8,
      M = s - g;
    M <= 0 ||
      ((!l || M - m > l.score) &&
        (l = {
          courseIndex: d.courseIndex,
          s: d.s,
          x: d.x,
          z: d.z,
          trackY: d.y,
          horizontalClearance: m,
          verticalIntrusion: M,
          score: M - m,
        }));
  }
  return l;
}
function zn(i, e, t, n = 96) {
  for (let s = 0; s < n; s++) {
    const r = i(s);
    // Reject spots on/near road corridors too — rocks and trees must never sit in a driving lane,
    // with margin comfortably beyond the car's collision buffer.
    if (Pn(r.x, r.z, e).clearance >= t && !Hi(r.x, r.z, e * 2, e * 2, 3.5)) return r;
  }
  return null;
}
function kn(i, e, t, n, s) {
  const r = Pn(e, t, n);
  Sa.push({
    kind: i,
    x: Math.round(e),
    z: Math.round(t),
    radius: Math.round(n),
    margin: s,
    clearance: Math.round(r.clearance),
    nearestS: Math.round(r.nearestS),
  });
}
function C1() {
  const i = [...Sa].sort((e, t) => e.clearance - t.clearance).slice(0, 12);
  return { count: Sa.length, unsafe: Sa.filter((e) => e.clearance < e.margin), closest: i };
}
function gn(i, e, t, n, s) {
  const r = e.clone().add(t).multiplyScalar(0.5),
    a = t.clone().sub(e),
    o = new Mesh(new CylinderGeometry(n, n, a.length(), 8), s);
  return (
    o.position.copy(r),
    o.quaternion.setFromUnitVectors(on, a.normalize()),
    (o.castShadow = !1),
    (o.receiveShadow = !0),
    i.add(o),
    o
  );
}
const todRefs = { cloudMats: [], glowMats: [] };
function R1() {
  // Dusk rig: warm low sun as key, cool blue sky fill, ember rim from the horizon.
  const i = new HemisphereLight(16757626, 3097190, 0.66);
  et.add(i);
  const e = new DirectionalLight(7179775, 0.6);
  (e.position.set(260, 145, -260), et.add(e));
  const t = new DirectionalLight(16752724, 2.3);
  (t.position.set(-310, 150, 230),
    (t.castShadow = !0),
    t.shadow.mapSize.set(3072, 3072),
    (t.shadow.camera.left = -460),
    (t.shadow.camera.right = 460),
    (t.shadow.camera.top = 460),
    (t.shadow.camera.bottom = -460),
    (t.shadow.camera.near = 50),
    (t.shadow.camera.far = 980),
    (t.shadow.bias = -0.0015),
    et.add(t));
  const n = new DirectionalLight(16742973, 0.5);
  (n.position.set(-180, 35, 280), et.add(n));
  const s = new PointLight(5556479, 90, 900, 2);
  (s.position.set(0, 88, -920), et.add(s));
  ((todRefs.hemi = i), (todRefs.fill = e), (todRefs.key = t), (todRefs.rim = n));
}
let skyDome = null;
function P1() {
  // Golden-hour sky: a camera-following dome with a proper scattering-style shader — the sky
  // brightens toward the horizon, glows warm around the sun, and stays deep indigo opposite it.
  const sunDirWorld = new Vector3(-310, 150, 230).normalize();
  ((skyDome = new Mesh(
    new SphereGeometry(1200, 48, 32),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: { uSunDir: { value: sunDirWorld }, uDay: { value: 0 }, uNight: { value: 0 }, uRain: { value: 0 } },
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vDir;
        uniform vec3 uSunDir;
        uniform float uDay;
        uniform float uNight;
        uniform float uRain;
        vec3 pal(vec3 dusk, vec3 day, vec3 night) {
          return mix(mix(dusk, day, uDay), night, uNight);
        }
        void main() {
          float h = clamp(vDir.y, -0.08, 1.0);
          // vertical gradient blended across dusk / day / night palettes
          vec3 zenith  = pal(vec3(0.06, 0.09, 0.24),  vec3(0.16, 0.38, 0.72), vec3(0.012, 0.015, 0.05));
          vec3 upper   = pal(vec3(0.2, 0.24, 0.47),   vec3(0.35, 0.56, 0.86), vec3(0.02, 0.03, 0.09));
          vec3 band    = pal(vec3(0.56, 0.36, 0.47),  vec3(0.56, 0.72, 0.9),  vec3(0.045, 0.055, 0.13));
          vec3 horizon = pal(vec3(0.95, 0.66, 0.44),  vec3(0.8, 0.88, 0.96),  vec3(0.09, 0.09, 0.17));
          vec3 col = mix(horizon, band, smoothstep(0.0, 0.09, h));
          col = mix(col, upper, smoothstep(0.06, 0.26, h));
          col = mix(col, zenith, smoothstep(0.2, 0.62, h));
          // scattering lobe around the sun (a cool moon halo at night)
          float sunAmt = max(dot(vDir, uSunDir), 0.0);
          col += pal(vec3(1.0, 0.58, 0.28), vec3(1.0, 0.95, 0.85), vec3(0.5, 0.6, 0.8)) * pow(sunAmt, 5.0) * pal(vec3(0.5), vec3(0.25), vec3(0.1)).x;
          col += pal(vec3(1.0, 0.78, 0.5), vec3(1.0, 1.0, 0.95), vec3(0.7, 0.8, 1.0)) * pow(sunAmt, 26.0) * pal(vec3(0.8), vec3(0.5), vec3(0.3)).x;
          // opposite-side cool deepening keeps the far sky moody
          float away = max(dot(vDir, -uSunDir), 0.0);
          float awayAmt = pal(vec3(0.42), vec3(0.15), vec3(0.5)).x;
          col = mix(col, pal(vec3(0.14, 0.15, 0.32), vec3(0.3, 0.42, 0.62), vec3(0.02, 0.025, 0.06)), awayAmt * pow(away, 1.6) * (1.0 - h * 0.4));
          // storm overcast: flatten toward gray, darker at night
          col = mix(col, vec3(0.42, 0.45, 0.5) * (0.28 + 0.62 * (1.0 - uNight)), uRain * 0.72);
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  )),
    (skyDome.renderOrder = -100),
    (skyDome.frustumCulled = !1),
    et.add(skyDome));
  const sunDir = sunDirWorld,
    r = new MeshBasicMaterial({ color: 16764250, transparent: !0, opacity: 0.92, depthWrite: !1, fog: !1 }),
    a = new Mesh(new CircleGeometry(46, 48), r);
  (a.position.copy(sunDir).multiplyScalar(1085), a.lookAt(0, 0, 0), skyDome.add(a));
  const o = new MeshBasicMaterial({
    color: 16748115,
    transparent: !0,
    opacity: 0.16,
    depthWrite: !1,
    fog: !1,
    blending: AdditiveBlending,
  });
  for (const [l, d] of [
    [120, 0.2],
    [250, 0.085],
    [520, 0.035],
  ]) {
    const f = new Mesh(new CircleGeometry(l, 48), o.clone());
    ((f.material.opacity = d), f.position.copy(sunDir).multiplyScalar(1060), f.lookAt(0, 0, 0), skyDome.add(f));
    todRefs.glowMats.push({ mat: f.material, dusk: d });
  }
  ((todRefs.skyU = skyDome.material.uniforms), (todRefs.sunMat = r));
}
function L1() {
  const i = new MeshStandardMaterial({ map: M1(), color: 8231526, roughness: 0.98, metalness: 0.02 }),
    e = new Mesh(new PlaneGeometry(4200, 4200, 300, 300), i);
  ((e.rotation.x = -Math.PI / 2), (e.position.y = -7), (e.receiveShadow = !0));
  const t = e.geometry.attributes.position;
  for (let g = 0; g < t.count; g++) {
    const M = t.getX(g),
      x = t.getY(g);
    t.setZ(g, He(M, -x) + 7);
  }
  ((t.needsUpdate = !0), e.geometry.computeVertexNormals(), et.add(e));
  // zoom-detail 50 (round-six item 3): lawn variation baked as terrain vertex
  // colors — per-cell mowing-band direction, ±3.5% stripe tint, hash-noise dry
  // and lush patches. City lawn cells only (outside street corridors); the 14m
  // vertex pitch gives wide soft bands, park-mower scale by design.
  {
    const col = new Float32Array(t.count * 3),
      { x0: LX0, x1: LX1, zNear: LZN, zFar: LZF, pitch: LP, streetW: LSW } = di,
      hash2 = (a2, b2) => {
        let h2 = (a2 * 374761393 + b2 * 668265263) | 0;
        h2 = Math.imul(h2 ^ (h2 >>> 13), 1274126177);
        return (((h2 ^ (h2 >>> 16)) >>> 0) % 1000) / 1000;
      };
    let striped = 0;
    for (let g = 0; g < t.count; g++) {
      const wx = t.getX(g),
        wz = -t.getY(g);
      let r2 = 1,
        g2 = 1,
        b3 = 1;
      if (wx > LX0 && wx < LX1 && wz > LZF && wz < LZN) {
        const lx = Math.abs(((((wx - LX0 + LP / 2) % LP) + LP) % LP) - LP / 2),
          lz = Math.abs(((((LZN - wz + LP / 2) % LP) + LP) % LP) - LP / 2);
        if (Math.min(lx, lz) > LSW * 0.5 + 4) {
          const cellX = Math.floor((wx - LX0) / LP),
            cellZ = Math.floor((LZN - wz) / LP),
            hcell = hash2(cellX, cellZ),
            along = hcell < 0.5 ? wx : wz,
            band = Math.sin(along / 8.9 + hcell * 40) > 0 ? 1 : -1,
            s2 = 1 + band * 0.12,
            wear = hash2(Math.floor(wx / 23) + 7, Math.floor(wz / 23));
          ((r2 = s2), (g2 = s2), (b3 = s2));
          if (wear > 0.86) ((r2 *= 1.12), (g2 *= 1.04), (b3 *= 0.86));
          else if (wear < 0.07) ((r2 *= 0.9), (b3 *= 0.93));
          striped++;
        }
      }
      ((col[g * 3] = r2), (col[g * 3 + 1] = g2), (col[g * 3 + 2] = b3));
    }
    e.geometry.setAttribute("color", new Float32BufferAttribute(col, 3));
    ((i.vertexColors = !0), (lawnSys.striped = striped), (lawnSys.mat = i));
  }
  const n = new MeshStandardMaterial({
    color: 5220796,
    roughness: 0.22,
    metalness: 0.08,
    transparent: !0,
    opacity: 0.46,
    depthWrite: !1,
    side: DoubleSide,
  });
  for (let g = 0; g < 3; g++) {
    const M = 150 - g * 190,
      x = -760 - g * 420,
      h = 980,
      _ = 64 + g * 18,
      v = new Mesh(new PlaneGeometry(980, 64 + g * 18, 1, 1), n.clone());
    ((v.rotation.x = -Math.PI / 2),
      (v.rotation.z = -0.34 + g * 0.03),
      v.position.set(M, $i(M, x, h, _) - 0.2, x),
      (v.renderOrder = -4),
      et.add(v));
  }
  const s = [
    new MeshStandardMaterial({ color: 4352578, roughness: 1 }),
    new MeshStandardMaterial({ color: 6910014, roughness: 1 }),
    new MeshStandardMaterial({ color: 3562320, roughness: 1 }),
  ];
  for (let g = 0; g < 46; g++) {
    // Flat ground decals must sit on genuinely flat ground, pinned just above the local maximum —
    // a fixed height on rolling terrain made them slice through hillsides as giant planes.
    const rad = 28 + Math.random() * 90,
      mx = -900 + Math.random() * 1800,
      mz = -260 - Math.random() * 1780,
      hs = [He(mx, mz)];
    for (let k = 0; k < 6; k++) hs.push(He(mx + Math.cos(k) * rad * 0.9, mz + Math.sin(k * 1.9) * rad * 0.9));
    if (Math.max(...hs) - Math.min(...hs) > 0.9) continue;
    const M = new Mesh(new CircleGeometry(rad, 9), s[g % s.length]);
    ((M.rotation.x = -Math.PI / 2),
      (M.rotation.z = Math.random() * Math.PI),
      M.position.set(mx, Math.max(...hs) + 0.07, mz),
      (M.scale.y = 0.32 + Math.random() * 0.5),
      (M.receiveShadow = !0),
      et.add(M));
  }
  const r = new MeshBasicMaterial({ color: 14217471, transparent: !0, opacity: 0.028, depthWrite: !1 });
  for (let g = 0; g < 32; g++) {
    const M = new Mesh(new CircleGeometry(70 + Math.random() * 150, 22), r.clone());
    ((M.material.opacity = 0.008 + Math.random() * 0.014),
      (M.rotation.x = -Math.PI / 2),
      M.position.set(-1050 + Math.random() * 2100, 22 + Math.random() * 18, -520 - Math.random() * 1820),
      M.position.y < 8 && Qi.lowFogDisks++,
      (M.scale.y = 0.22 + Math.random() * 0.26),
      (M.renderOrder = -6),
      et.add(M));
  }
  const a = [
      new MeshStandardMaterial({ color: 5991785, roughness: 1 }),
      new MeshStandardMaterial({ color: 7633254, roughness: 1 }),
      new MeshStandardMaterial({ color: 4874865, roughness: 1 }),
    ],
    o = new MeshStandardMaterial({ color: 15068905, roughness: 0.95 });
  for (let g = 0; g < 52; g++) {
    const M = 78 + Math.random() * 180,
      x = 52 + Math.random() * 115,
      h = zn(
        (v) => {
          const y = (g / 52) * Math.PI * 2 + v * 1.77,
            E = 1380 + Math.random() * 820 + v * 18;
          return { x: Math.cos(y) * E, z: Math.sin(y) * E - 1180 };
        },
        x,
        480,
      );
    if (!h) continue;
    const _ = new Mesh(new ConeGeometry(x, M, 5 + Math.floor(Math.random() * 2)), a[g % a.length]);
    if (
      (_.position.set(h.x, -9, h.z),
      (_.rotation.y = Math.random() * Math.PI),
      (_.castShadow = !0),
      (_.receiveShadow = !0),
      et.add(_),
      kn("mountain", h.x, h.z, x, 480),
      M > 160)
    ) {
      const v = new Mesh(new ConeGeometry(x * 0.34, M * 0.22, 5), o);
      (v.position.copy(_.position).add(new Vector3(0, M * 0.39, 0)), (v.rotation.y = _.rotation.y), et.add(v));
    }
  }
  const c = new MeshStandardMaterial({ color: 4926748, roughness: 0.9 }),
    l = [
      new MeshStandardMaterial({ color: 2055221, roughness: 0.92 }),
      new MeshStandardMaterial({ color: 3109954, roughness: 0.95 }),
      new MeshStandardMaterial({ color: 1589042, roughness: 0.9 }),
    ];
  {
    // 185 conifers were ~740 individual meshes; two instanced draws now carry the whole forest.
    const trunkGeo = new CylinderGeometry(0.28, 0.42, 1, 6).translate(0, 0.5, 0),
      canopyGeo = mergeGeometries([
        new ConeGeometry(2.7, 5.4, 7).translate(0, 1.9, 0),
        new ConeGeometry(2.1, 4.9, 7).rotateY(0.6).translate(0, 3.35, 0),
        new ConeGeometry(1.55, 4.1, 7).rotateY(1.2).translate(0, 4.7, 0),
      ]),
      canopyColors = [2055221, 3109954, 1589042].map((cc) => new Color(cc)),
      trunkIM = new InstancedMesh(trunkGeo, c, 185),
      canopyIM = new InstancedMesh(canopyGeo, new MeshStandardMaterial({ roughness: 0.92 }), 185),
      dum = new Object3D();
    let ci = 0;
    for (let g = 0; g < 185; g++) {
      const M = 0.58 + Math.random() * 1.05,
        x = 8 * M,
        h = zn(() => ({ x: -1120 + Math.random() * 2240, z: -450 - Math.random() * 1740 }), x, 145, 40);
      if (!h) continue;
      const { x: _, z: v } = h;
      if (ka(_, v, 18)) continue;
      const y = He(_, v) + 0.8,
        T = 2.2 + Math.random() * 3.8;
      (dum.position.set(_, y, v),
        (dum.rotation.y = Math.random() * Math.PI),
        dum.scale.set(M, T, M),
        dum.updateMatrix(),
        trunkIM.setMatrixAt(ci, dum.matrix));
      (dum.position.set(_, y + T, v), dum.scale.set(M, M, M), dum.updateMatrix(), canopyIM.setMatrixAt(ci, dum.matrix));
      (canopyIM.setColorAt(ci, canopyColors[g % 3]), ci++, kn("tree", _, v, x, 145));
    }
    ((trunkIM.count = ci),
      (canopyIM.count = ci),
      (trunkIM.instanceMatrix.needsUpdate = !0),
      (canopyIM.instanceMatrix.needsUpdate = !0),
      canopyIM.instanceColor && (canopyIM.instanceColor.needsUpdate = !0),
      (canopyIM.castShadow = !0),
      et.add(trunkIM),
      et.add(canopyIM));
  }
  {
    // Soft billboard clouds: layered puff textures with warm under-lighting instead of hard sphere blobs.
    const puffTex = (seed) => {
      const cv = document.createElement("canvas");
      ((cv.width = 256), (cv.height = 128));
      const c = cv.getContext("2d");
      // one coherent cloud mass: big overlapping puffs hugging a center line, tapering at the ends
      const rnd = (k, m) => Math.sin(seed * m + k * 37.7) * 0.5 + 0.5;
      for (let k = 0; k < 16; k++) {
        const fx = k / 15,
          taper = Math.sin(fx * Math.PI),
          px = 24 + fx * 208,
          py = 66 + (rnd(k, 53) - 0.5) * 22 * taper,
          pr = (18 + rnd(k, 29) * 22) * (0.45 + taper * 0.75),
          g = c.createRadialGradient(px, py - pr * 0.18, 0, px, py, pr);
        (g.addColorStop(0, `rgba(255, 240, 226, ${0.5 + taper * 0.3})`),
          g.addColorStop(0.55, `rgba(252, 214, 196, ${0.3 + taper * 0.16})`),
          g.addColorStop(1, "rgba(250, 200, 185, 0)"));
        ((c.fillStyle = g), c.beginPath(), c.arc(px, py, pr, 0, Math.PI * 2), c.fill());
      }
      // flat warm underside
      for (let k = 0; k < 10; k++) {
        const fx = 0.12 + (k / 9) * 0.76,
          px = fx * 256,
          pr = 20 + rnd(k, 71) * 16,
          g = c.createRadialGradient(px, 92, 0, px, 92, pr);
        (g.addColorStop(0, "rgba(255, 176, 128, 0.22)"), g.addColorStop(1, "rgba(255, 170, 120, 0)"));
        ((c.fillStyle = g), c.beginPath(), c.arc(px, 92, pr, 0, Math.PI * 2), c.fill());
      }
      const tx = new CanvasTexture(cv);
      return ((tx.colorSpace = SRGBColorSpace), tx);
    };
    const texes = [puffTex(1), puffTex(2), puffTex(3)];
    qe.cloudSprites = 0;
    for (let g = 0; g < 44; g++) {
      const mat = new SpriteMaterial({
          map: texes[g % 3],
          transparent: !0,
          depthWrite: !1,
          opacity: 0.8 + Math.random() * 0.2,
          fog: !1,
        }),
        sp = new Sprite(mat),
        w = 170 + Math.random() * 280;
      (sp.scale.set(w, w * (0.32 + Math.random() * 0.14), 1),
        sp.position.set(-1500 + Math.random() * 3000, 200 + Math.random() * 210, -1400 + Math.random() * 2600),
        (sp.renderOrder = -50),
        et.add(sp),
        qe.cloudSprites++,
        Bn(sp, (tt) => {
          sp.position.x += Math.sin(tt * 0.05 + g) * 0.02;
        }));
    }
  }
  const f = [
      new MeshStandardMaterial({ color: 6186600, roughness: 0.68, metalness: 0.2 }),
      new MeshStandardMaterial({ color: 7829101, roughness: 0.72, metalness: 0.18 }),
      new MeshStandardMaterial({ color: 4544612, roughness: 0.62, metalness: 0.24 }),
    ],
    p = new MeshStandardMaterial({ color: 2962232, roughness: 0.65, metalness: 0.35 });
  for (let g = 0; g < 44; g++) {
    const M = new Group(),
      x = 20 + Math.random() * 95,
      h = 8 + Math.random() * 18,
      _ = 8 + Math.random() * 18,
      v = new Mesh(new BoxGeometry(h, x, _), f[g % f.length]);
    ((v.position.y = x / 2), (v.castShadow = !0), (v.receiveShadow = !0), M.add(v));
    const y = As(160, 320, 0.28 + Math.random() * 0.36),
      E = new MeshStandardMaterial({
        map: y,
        color: 10414079,
        roughness: 0.24,
        metalness: 0.12,
        emissive: 16758903,
        emissiveMap: y,
        emissiveIntensity: 0.3,
      });
    for (const b of [-1, 1]) {
      const S = new Mesh(new PlaneGeometry(h * 0.82, x * 0.74), E);
      (S.position.set(0, x * 0.53, b * (_ / 2 + 0.08)), (S.rotation.y = b < 0 ? Math.PI : 0), M.add(S));
    }
    const T = new Mesh(new BoxGeometry(h * 1.08, 1.2, _ * 1.08), p);
    if (((T.position.y = x + 0.7), M.add(T), Math.random() < 0.32)) {
      const b = new Mesh(new CylinderGeometry(0.18, 0.3, 10 + Math.random() * 12, 8), p);
      ((b.position.y = x + 6.5), M.add(b));
    }
    const R = Math.hypot(h, _) * 0.65,
      C = zn(() => ({ x: -880 + Math.random() * 1760, z: -900 - Math.random() * 900 }), R, 240, 60);
    C &&
      (M.position.set(C.x, $i(C.x, C.z, h, _) - 0.3, C.z),
      (M.rotation.y = Math.random() * Math.PI),
      et.add(M),
      kn("building", C.x, C.z, R, 240));
  }
  const m = new MeshStandardMaterial({ color: 1053978, roughness: 0.4, metalness: 0.25, emissive: 1786464, emissiveIntensity: 0.22 });
  for (let g = 0; g < 18; g++) {
    const M = new Group(),
      x = wi[g % wi.length],
      h = Ra[(g * 3 + 1) % Ra.length],
      _ = Ti[g % Ti.length],
      v = new MeshStandardMaterial({
        map: Od(x, h, _),
        color: 16777215,
        roughness: 0.22,
        metalness: 0.04,
        emissive: new Color(_),
        emissiveIntensity: 0.28,
      }),
      y = 22 + Math.random() * 18,
      E = 8 + Math.random() * 4,
      T = new Mesh(new BoxGeometry(y, E, 0.5), v);
    ((T.position.y = 10), M.add(T));
    const R = new Mesh(new BoxGeometry(y + 1.2, 0.32, 0.75), m);
    ((R.position.y = 10 + E * 0.5 + 0.25), M.add(R));
    for (const b of [-7, 7]) {
      const S = new Mesh(new CylinderGeometry(0.24, 0.32, 10, 8), m);
      (S.position.set(b, 5, -0.2), M.add(S));
    }
    const C = zn(() => ({ x: -780 + Math.random() * 1560, z: -450 - g * 135 + Math.random() * 80 - 40 }), 22, 175, 50);
    C &&
      (M.position.set(C.x, He(C.x, C.z) + 0.5, C.z),
      (M.rotation.y = -0.35 + Math.random() * 0.7),
      et.add(M),
      kn("billboard", C.x, C.z, 22, 175),
      Xi("roadside-billboard", C.x, M.position.y + 10, C.z));
  }
}
function D1() {
  for (let h = 0; h < 3; h++) {
    const _ = [4012638, 5326704, 7035525][h],
      v = new MeshBasicMaterial({ color: _, transparent: !0, opacity: 0.6 - h * 0.14, depthWrite: !1, fog: !1 }),
      y = 60,
      E = 5200,
      T = new PlaneGeometry(E, 360, y, 1),
      R = T.attributes.position;
    for (let b = 0; b <= y; b++) {
      const S = b / y,
        L = (Math.sin(S * 22 + h * 3) * 0.5 + Math.sin(S * 9 + h) * 0.5) * 70 + 120;
      (R.setY(b, L), R.setY(b + y + 1, -180));
    }
    R.needsUpdate = !0;
    const C = new Mesh(T, v);
    (C.position.set(0, 40, -2300 - h * 360), et.add(C));
  }
  const i = new MeshStandardMaterial({ color: 5583649, roughness: 0.9 }),
    e = [
      new MeshStandardMaterial({ color: 3837754, roughness: 0.9 }),
      new MeshStandardMaterial({ color: 7319100, roughness: 0.92 }),
      new MeshStandardMaterial({ color: 13075258, roughness: 0.9 }),
      new MeshStandardMaterial({ color: 15182276, roughness: 0.88 }),
    ];
  for (let h = 0; h < 48; h++) {
    const _ = 0.7 + Math.random() * 1.2,
      v = 9 * _,
      y = zn(() => ({ x: -1180 + Math.random() * 2360, z: -420 - Math.random() * 1820 }), v, 150, 36);
    if (!y) continue;
    const { x: E, z: T } = y;
    if (ka(E, T, 18)) continue;
    const R = He(E, T) + 0.6,
      C = new Group(),
      b = 2.6 + Math.random() * 3.4,
      S = new Mesh(new CylinderGeometry(0.34, 0.5, b, 6), i);
    ((S.position.y = b / 2), C.add(S));
    const L = e[Math.floor(Math.random() * e.length)],
      F = 3 + Math.floor(Math.random() * 3);
    for (let W = 0; W < F; W++) {
      const te = 2.4 + Math.random() * 1.8,
        ne = new Mesh(new SphereGeometry(te, 9, 7), L);
      (ne.position.set((Math.random() - 0.5) * 3, b + 1.6 + Math.random() * 2.2, (Math.random() - 0.5) * 3),
        (ne.scale.y = 0.82 + Math.random() * 0.3),
        C.add(ne));
    }
    (C.position.set(E, R, T), C.scale.setScalar(_), et.add(C), kn("tree", E, T, v, 150));
  }
  const t = [
    new MeshStandardMaterial({ color: 7762025, roughness: 1, flatShading: !0, side: DoubleSide }),
    new MeshStandardMaterial({ color: 9077368, roughness: 1, flatShading: !0, side: DoubleSide }),
    new MeshStandardMaterial({ color: 6249043, roughness: 1, flatShading: !0, side: DoubleSide }),
  ];
  for (let h = 0; h < 70; h++) {
    const _ = 2 + Math.random() * 7,
      v = zn(() => ({ x: -1200 + Math.random() * 2400, z: -360 - Math.random() * 1900 }), _, 70, 30);
    if (!v) continue;
    const { x: y, z: E } = v,
      T = new Mesh(new IcosahedronGeometry(_, 0), t[h % t.length]),
      R = T.geometry.attributes.position;
    for (let C = 0; C < R.count; C++)
      R.setXYZ(
        C,
        R.getX(C) * (0.8 + Math.random() * 0.4),
        R.getY(C) * (0.6 + Math.random() * 0.4),
        R.getZ(C) * (0.8 + Math.random() * 0.4),
      );
    ((R.needsUpdate = !0),
      T.geometry.computeVertexNormals(),
      T.position.set(y, He(y, E) + _ * 0.35, E),
      T.rotation.set(Math.random(), Math.random() * Math.PI, Math.random()),
      (T.castShadow = !0),
      et.add(T),
      Di.push({ kind: "rock", x: y, z: E, radius: _ * 1.12 }),
      kn("rock", y, E, _, 70));
  }
  const n = [11969084, 9416262, 7314255, 13218138, 8228670];
  for (let h = 0; h < 14; h++) {
    const _ = 130 + Math.random() * 200,
      v = 130 + Math.random() * 200,
      y = zn(() => {
        // farm fields are huge flat planes: reject spots where the terrain rolls underneath
        for (let tries = 0; tries < 6; tries++) {
          const cx = -1500 + Math.random() * 3e3,
            cz = -700 - Math.random() * 1700,
            hh = [
              He(cx, cz),
              He(cx + _ * 0.45, cz + v * 0.45),
              He(cx - _ * 0.45, cz + v * 0.45),
              He(cx + _ * 0.45, cz - v * 0.45),
              He(cx - _ * 0.45, cz - v * 0.45),
            ];
          if (Math.max(...hh) - Math.min(...hh) < 1.0) return { x: cx, z: cz };
        }
        return { x: 1e5, z: 1e5 };
      }, Math.max(_, v) * 0.5, 40, 24);
    if (!y || y.x > 9e4) continue;
    const { x: E, z: T } = y,
      R = new Group(),
      C = 5 + Math.floor(Math.random() * 4),
      b = n[Math.floor(Math.random() * n.length)];
    for (let S = 0; S < C; S++) {
      const L = new MeshStandardMaterial({ color: S % 2 ? b : n[Math.floor(Math.random() * n.length)], roughness: 1 }),
        F = new Mesh(new PlaneGeometry(_, v / C), L);
      ((F.rotation.x = -Math.PI / 2), F.position.set(0, 0.05, -v / 2 + (S + 0.5) * (v / C)), R.add(F));
    }
    const fieldTop = Math.max(
      He(E, T),
      He(E + _ * 0.45, T + v * 0.45),
      He(E - _ * 0.45, T + v * 0.45),
      He(E + _ * 0.45, T - v * 0.45),
      He(E - _ * 0.45, T - v * 0.45),
    );
    (R.position.set(E, fieldTop + 0.06, T),
      (R.rotation.y = Math.random() * Math.PI),
      et.add(R),
      kn("field", E, T, Math.max(_, v) * 0.5, 40));
  }
  {
    const h = zn(() => ({ x: -650 + Math.random() * 1300, z: -1200 - Math.random() * 700 }), 170, 60, 50);
    if (h) {
      // The big lake is real, driveable water now (drag + splash) — no invisible wall collider.
      // Water level: fill the basin to a bit above its 3rd-lowest sample so a good part
      // of the lake is actually visible water, while hillsides inside the footprint stay
      // dry (the depth gate below keeps physics and audio matching what you can see).
      const lakeSamples = [He(h.x, h.z)];
      for (let ang = 0; ang < 8; ang++)
        lakeSamples.push(
          He(h.x + Math.cos((ang / 8) * Math.PI * 2) * 110, h.z + Math.sin((ang / 8) * Math.PI * 2) * 74),
          He(h.x + Math.cos((ang / 8) * Math.PI * 2) * 200, h.z + Math.sin((ang / 8) * Math.PI * 2) * 132),
        );
      lakeSamples.sort((a, b) => a - b);
      const lakeY = lakeSamples[4] + 0.4,
        v = new Mesh(new CircleGeometry(150, 48), makeWaterMaterial(9));
      ((v.rotation.x = -Math.PI / 2),
        v.position.set(h.x, lakeY, h.z),
        v.scale.set(1.5, 1, 1),
        (v.renderOrder = -4),
        et.add(v),
        registerPond(h.x, h.z, 222, 148, lakeY),
        Qi.waterBlockers++,
        kn("lake", h.x, h.z, 170, 60));
    }
  }
  const s = new MeshStandardMaterial({ color: 15922422, roughness: 0.5, metalness: 0.2 });
  for (let h = 0; h < 9; h++) {
    const _ = (h / 9) * Math.PI * 2 + 0.6,
      v = 1500 + Math.random() * 700,
      y = Math.cos(_) * v,
      E = Math.sin(_) * v - 1150,
      T = 60 + Math.random() * 40,
      R = new Group(),
      C = new Mesh(new CylinderGeometry(1.1, 2.2, T, 10), s);
    ((C.position.y = T / 2), R.add(C));
    const b = new Group();
    b.position.set(0, T, 3);
    const S = new Mesh(new BoxGeometry(3, 3, 7), s);
    b.add(S);
    const L = new Group();
    L.position.z = 3.5;
    for (let W = 0; W < 3; W++) {
      const te = new Mesh(new BoxGeometry(1.1, 26, 0.5), s);
      te.position.y = 13;
      const ne = new Group();
      (ne.add(te), (ne.rotation.z = (W / 3) * Math.PI * 2), L.add(ne));
    }
    (b.add(L), R.add(b), R.position.set(y, -8, E), (R.rotation.y = Math.random() * Math.PI), et.add(R));
    const F = 0.5 + Math.random() * 0.5;
    Bn(L, (W) => {
      L.rotation.z = W * F;
    });
  }
  const r = new MeshStandardMaterial({ color: 7041398, roughness: 0.6, metalness: 0.4 }),
    a = new LineBasicMaterial({ color: 2764595, transparent: !0, opacity: 0.5 });
  let o = null;
  for (let h = 0; h < 7; h++) {
    const _ = -1100 + h * 360,
      v = -1650 - Math.sin(h * 0.7) * 120,
      y = 48,
      E = new Group(),
      T = 6;
    for (const C of [-1, 1])
      for (const b of [-1, 1]) {
        const S = new Mesh(new CylinderGeometry(0.4, 0.7, y, 5), r);
        (S.position.set(C * T, y / 2, b * T), (S.rotation.z = -C * 0.08), (S.rotation.x = b * 0.08), E.add(S));
      }
    for (const C of [y * 0.6, y * 0.82, y]) {
      const b = new Mesh(new BoxGeometry(T * 4, 0.8, 0.8), r);
      ((b.position.y = C), E.add(b));
    }
    (E.position.set(_, He(_, v) - 2, v), et.add(E));
    const R = He(_, v) - 2 + y;
    if (o)
      for (const C of [-T * 2, 0, T * 2]) {
        const b = o.x + C,
          S = o.z,
          L = _ + C,
          F = v,
          W = [],
          te = 12;
        for (let X = 0; X <= te; X++) {
          const Q = X / te,
            ie = Math.sin(Q * Math.PI) * 6;
          W.push(new Vector3(b + (L - b) * Q, o.y - ie + (R - o.y) * Q, S + (F - S) * Q));
        }
        const ne = new Line(new BufferGeometry().setFromPoints(W), a);
        et.add(ne);
      }
    o = { x: _, y: R, z: v };
  }
  const c = new MeshStandardMaterial({ color: 11680302, roughness: 0.6, metalness: 0.3 }),
    l = new MeshStandardMaterial({ color: 15263976, roughness: 0.6, metalness: 0.3 });
  for (let h = 0; h < 5; h++) {
    const _ = zn(() => ({ x: -1e3 + Math.random() * 2e3, z: -1100 - Math.random() * 1e3 }), 8, 120, 40);
    if (!_) continue;
    const { x: v, z: y } = _,
      E = 70 + Math.random() * 50,
      T = new Group(),
      R = 8;
    for (let L = 0; L < R; L++) {
      const F = new Mesh(new CylinderGeometry(0.5, 0.7, E / R, 4), L % 2 ? l : c);
      ((F.position.y = (L + 0.5) * (E / R)), (F.rotation.y = Math.PI / 4), T.add(F));
    }
    const C = new MeshStandardMaterial({ color: 16722458, emissive: 16718346, emissiveIntensity: 2 }),
      b = new Mesh(new SphereGeometry(1.1, 10, 8), C);
    ((b.position.y = E + 1), T.add(b), T.position.set(v, He(v, y), y), et.add(T), kn("mast", v, y, 8, 120));
    const S = Math.random() * Math.PI * 2;
    Bn(b, (L) => {
      C.emissiveIntensity = Math.sin(L * 2.4 + S) > 0.4 ? 2.4 : 0.15;
    });
  }
  const d = [
    [16734797, 16765503],
    [5093119, 16777215],
    [10185727, 16747222],
    [4641690, 16773227],
  ];
  for (let h = 0; h < 6; h++) {
    const _ = new Group(),
      v = d[h % d.length],
      y = new MeshStandardMaterial({
        map: V1(v[0], v[1]),
        roughness: 0.5,
        metalness: 0.05,
        emissive: new Color(v[0]).multiplyScalar(0.18),
        emissiveIntensity: 1,
      }),
      E = new Mesh(new SphereGeometry(11, 20, 16), y);
    ((E.scale.y = 1.25), _.add(E));
    const T = new Mesh(new BoxGeometry(3.4, 3, 3.4), new MeshStandardMaterial({ color: 8014371, roughness: 0.9 }));
    ((T.position.y = -17), _.add(T));
    const R = new LineBasicMaterial({ color: 3811866 });
    for (const F of [-1, 1])
      for (const W of [-1, 1]) {
        const te = new Line(new BufferGeometry().setFromPoints([new Vector3(F * 1.6, -15.5, W * 1.6), new Vector3(F * 7, -3, W * 7)]), R);
        _.add(te);
      }
    const C = -700 + Math.random() * 1400,
      b = -700 - Math.random() * 1200,
      S = 280 + Math.random() * 100;
    (_.position.set(C, S, b), et.add(_));
    const L = Math.random() * Math.PI * 2;
    Bn(_, (F) => {
      ((_.position.y = S + Math.sin(F * 0.5 + L) * 6),
        (_.position.x = C + Math.sin(F * 0.08 + L) * 90),
        (_.rotation.z = Math.sin(F * 0.4 + L) * 0.04));
    });
  }
  const f = new MeshBasicMaterial({ color: 2829104, side: DoubleSide, fog: !1 });
  function p() {
    const h = new Shape();
    return (
      h.moveTo(0, 0),
      h.lineTo(-2.6, 1.1),
      h.lineTo(-2.2, 0.2),
      h.lineTo(0, 0.5),
      h.lineTo(2.2, 0.2),
      h.lineTo(2.6, 1.1),
      h.lineTo(0, 0),
      new Mesh(new ShapeGeometry(h), f)
    );
  }
  for (let h = 0; h < 5; h++) {
    const _ = new Group(),
      v = 5 + Math.floor(Math.random() * 5),
      y = [];
    for (let L = 0; L < v; L++) {
      const F = p(),
        W = L % 2 ? 1 : -1,
        te = Math.ceil(L / 2);
      (F.position.set(W * te * 5, -te * 2.4, 0), (F.rotation.x = -Math.PI / 2), _.add(F), y.push(F));
    }
    const E = 150 + Math.random() * 120,
      T = -500 - Math.random() * 1400,
      R = 18 + Math.random() * 14,
      C = 1400,
      b = -700 + Math.random() * 1400;
    (_.position.set(b, E, T), et.add(_));
    const S = Math.random() * Math.PI * 2;
    Bn(_, (L, F) => {
      ((_.position.x += R * F), _.position.x > C && (_.position.x = -C));
      const W = Math.sin(L * 6 + S);
      for (const te of y) te.rotation.x = -Math.PI / 2 + W * 0.4;
    });
  }
  {
    const h = new Group(),
      _ = new MeshStandardMaterial({ color: 14673644, roughness: 0.4, metalness: 0.2 }),
      v = new Mesh(new SphereGeometry(20, 20, 16), _);
    (v.scale.set(2.6, 1, 1), h.add(v));
    const y = new MeshStandardMaterial({ color: 13781835, roughness: 0.6 });
    for (let b = 0; b < 3; b++) {
      const S = new Mesh(new BoxGeometry(10, 9, 0.6), y);
      ((S.position.x = -46), (S.rotation.x = (b / 3) * Math.PI * 2), h.add(S));
    }
    const E = new Mesh(new BoxGeometry(10, 4, 4), new MeshStandardMaterial({ color: 3356475, roughness: 0.7 }));
    ((E.position.y = -19), h.add(E));
    const T = new Mesh(new PlaneGeometry(40, 10), new MeshBasicMaterial({ map: ol("STEEL RIBBON"), transparent: !0, side: DoubleSide }));
    (T.position.set(60, 0, 0), h.add(T));
    const R = 900,
      C = 240;
    (h.position.set(0, C, -1200),
      et.add(h),
      Bn(h, (b) => {
        const S = b * 0.05;
        ((h.position.x = Math.cos(S) * R),
          (h.position.z = -1200 + Math.sin(S) * R * 0.5),
          (h.position.y = C + Math.sin(b * 0.3) * 8),
          (h.rotation.y = -S + Math.PI / 2));
      }));
  }
  const m = new MeshBasicMaterial({ color: 16777215, transparent: !0, opacity: 0.32, depthWrite: !1, fog: !1 });
  for (let h = 0; h < 14; h++) {
    const _ = new Mesh(new PlaneGeometry(220 + Math.random() * 360, 16 + Math.random() * 22), m.clone());
    ((_.material.opacity = 0.12 + Math.random() * 0.18),
      _.position.set(-1100 + Math.random() * 2200, 360 + Math.random() * 180, -700 - Math.random() * 1400),
      (_.rotation.x = -Math.PI / 2.1),
      (_.rotation.z = Math.random() * Math.PI),
      (_.scale.y = 0.3),
      et.add(_));
    const v = 2 + Math.random() * 3;
    Bn(_, (y, E) => {
      ((_.position.x += v * E), _.position.x > 1400 && (_.position.x = -1400));
    });
  }
  const g = new MeshStandardMaterial({ color: 13620954, roughness: 0.6, metalness: 0.2 }),
    M = new MeshBasicMaterial({ map: G1(), side: DoubleSide });
  for (let h = 0; h < 4; h++) {
    const _ = zn(() => ({ x: -560 + Math.random() * 1120, z: -520 - Math.random() * 900 }), 40, 30, 40);
    if (!_) continue;
    const { x: v, z: y } = _,
      E = new Group(),
      T = 60 + Math.random() * 40,
      R = new Mesh(new BoxGeometry(T, 1.4, 26), g);
    (R.position.set(0, 26, -4), (R.rotation.x = -0.32), E.add(R));
    const C = new Mesh(new PlaneGeometry(T * 0.94, 24), M);
    (C.position.set(0, 12, 6), (C.rotation.x = -0.85), E.add(C));
    for (const b of [-T / 2, T / 2]) {
      const S = new Mesh(new BoxGeometry(1.4, 26, 1.4), g);
      (S.position.set(b, 13, -8), E.add(S));
    }
    (E.position.set(v, He(v, y), y),
      (E.rotation.y = Math.atan2(-v, -y) + (Math.random() - 0.5) * 0.5),
      crowdSys.stands.push({ x: v, z: y, yaw: E.rotation.y, w: T, gy: E.position.y }),
      et.add(E),
      kn("grandstand", v, y, 40, 30));
  }
  crowdSys.init();
  const x = [16731486, 16765503, 16777215, 11824127];
  for (let h = 0; h < 90; h++) {
    const _ = zn(() => ({ x: -900 + Math.random() * 1800, z: -300 - Math.random() * 1500 }), 3, 20, 16);
    if (!_) continue;
    const { x: v, z: y } = _,
      E = new Group(),
      T = x[Math.floor(Math.random() * x.length)],
      R = new MeshBasicMaterial({ color: T, side: DoubleSide }),
      C = 5 + Math.floor(Math.random() * 6);
    for (let b = 0; b < C; b++) {
      const S = new Mesh(new CircleGeometry(0.5 + Math.random() * 0.4, 5), R);
      (S.position.set((Math.random() - 0.5) * 7, 0.6 + Math.random() * 0.5, (Math.random() - 0.5) * 7),
        (S.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.6),
        (S.rotation.z = Math.random() * Math.PI),
        E.add(S));
    }
    (E.position.set(v, He(v, y), y), et.add(E), kn("flowers", v, y, 3, 20));
  }
}
const Mn = [],
  $n = [];
let Cc = 0;
const Di = [],
  Dr = [],
  Ri = [],
  Rc = [],
  Rr = [],
  Ps = [],
  qe = {
    traffic: 0,
    pedestrians: 0,
    types: {},
    turns: 0,
    splats: 0,
    trafficCrashes: 0,
    streetLights: 0,
    trafficLights: 0,
    stopSigns: 0,
    signs: 0,
    roadDetails: {},
    buildingArchetypes: {},
    zones: {},
    openerProps: 0,
  },
  Pa = [];
function Xi(i, e, t, n) {
  (qe.signs++, Pa.length < 160 && Pa.push({ kind: i, x: +e.toFixed(1), y: +t.toFixed(1), z: +n.toFixed(1) }));
}
function bi(i, e, t = 1) {
  qe[i][e] = (qe[i][e] || 0) + t;
}
// ─── Merged-vehicle building: parts bake their color and emissive into vertex attributes
// so a whole car body is ONE draw (plus one for glass and one mesh per spinning wheel),
// instead of ~23 meshes. All cars/pedestrians share two global materials. ───
let vcOpaqueMat = null,
  vcGlassMat = null;
function vcMats() {
  if (!vcOpaqueMat) {
    vcOpaqueMat = new MeshStandardMaterial({ vertexColors: !0, roughness: 0.42, metalness: 0.22 });
    vcOpaqueMat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec3 aEmissive;\nvarying vec3 vEmissive;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvEmissive = aEmissive;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vEmissive;")
        .replace(
          "#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vEmissive;",
        );
    };
    vcGlassMat = new MeshStandardMaterial({
      color: 10217727,
      roughness: 0.08,
      metalness: 0.08,
      transparent: !0,
      opacity: 0.62,
      emissive: 1192778,
      emissiveIntensity: 0.2,
    });
  }
  return { opaque: vcOpaqueMat, glass: vcGlassMat };
}
const vcTmp = new Color();
function vcBake(geo, matrix, color, emissive = 0, emissiveIntensity = 1) {
  const g = geo.clone();
  matrix && g.applyMatrix4(matrix);
  const count = g.attributes.position.count,
    col = new Float32Array(count * 3),
    emi = new Float32Array(count * 3);
  vcTmp.set(color ?? 16777215);
  for (let k = 0; k < count; k++) ((col[k * 3] = vcTmp.r), (col[k * 3 + 1] = vcTmp.g), (col[k * 3 + 2] = vcTmp.b));
  if (emissive) {
    vcTmp.set(emissive).multiplyScalar(emissiveIntensity);
    for (let k = 0; k < count; k++) ((emi[k * 3] = vcTmp.r), (emi[k * 3 + 1] = vcTmp.g), (emi[k * 3 + 2] = vcTmp.b));
  }
  (g.setAttribute("color", new Float32BufferAttribute(col, 3)),
    g.setAttribute("aEmissive", new Float32BufferAttribute(emi, 3)));
  return g;
}
function vcAt(x, y, z, rz = 0) {
  const m = rz ? new Matrix4().makeRotationZ(rz) : new Matrix4();
  return m.setPosition(x, y, z);
}
function I1(i, e) {
  const t = new Group(),
    n = {
      compact: { w: 2.2, h: 1.05, l: 4.3, cabin: [1.55, 0.78, 1.75], cabinZ: -0.35 },
      taxi: { w: 2.25, h: 1.08, l: 4.5, cabin: [1.6, 0.82, 1.9], cabinZ: -0.25, sign: !0 },
      pickup: { w: 2.35, h: 1.12, l: 5.2, cabin: [1.62, 0.88, 1.65], cabinZ: -1.15, bed: !0 },
      van: { w: 2.55, h: 1.65, l: 5.4, cabin: [2.05, 0.82, 2.1], cabinZ: -0.85 },
      boxTruck: { w: 2.8, h: 1.25, l: 6.6, cabin: [2, 0.95, 1.75], cabinZ: -2.1, box: [2.75, 2, 3.35] },
      bus: { w: 3, h: 2, l: 8.6, cabin: [2.72, 0.9, 6.6], cabinZ: 0.1, bus: !0 },
    },
    s = n[i] || n.compact,
    { opaque, glass } = vcMats(),
    bodyColor = i === "taxi" ? 16767293 : e,
    dimColor = new Color(e).multiplyScalar(0.52).getHex(),
    opq = [],
    gls = [];
  opq.push(vcBake(new BoxGeometry(s.w, s.h, s.l), vcAt(0, 0.95, 0), bodyColor));
  // full-fat 4b (round four, freeze lifted): non-bus cabins are RECESSED —
  // the box is 0.34 shorter, the old front face is rebuilt as A-pillars +
  // header + sill around the windshield, and a baked driver sits in the
  // dark interior behind the glass. Every car is visibly crewed at any
  // distance the cabin resolves.
  (s.bus ? gls : opq).push(
    s.bus
      ? vcBake(new BoxGeometry(s.cabin[0], s.cabin[1], s.cabin[2]), vcAt(0, 1.65, s.cabinZ), 10217727)
      : vcBake(new BoxGeometry(s.cabin[0], s.cabin[1], s.cabin[2] - 0.34), vcAt(0, 1.65, s.cabinZ + 0.17), e),
  );
  if (!s.bus) {
    const czF = s.cabinZ - s.cabin[2] / 2;
    (opq.push(vcBake(new BoxGeometry(s.cabin[0], s.cabin[1] * 0.22, 0.06), vcAt(0, 1.65 + s.cabin[1] * 0.39, czF + 0.03), e)),
      opq.push(vcBake(new BoxGeometry(s.cabin[0], s.cabin[1] * 0.18, 0.06), vcAt(0, 1.65 - s.cabin[1] * 0.41, czF + 0.03), e)));
    for (const h of [-1, 1]) opq.push(vcBake(new BoxGeometry(s.cabin[0] * 0.12, s.cabin[1], 0.06), vcAt(h * s.cabin[0] * 0.44, 1.65, czF + 0.03), e));
    (opq.push(vcBake(new BoxGeometry(s.cabin[0] * 0.92, s.cabin[1] * 0.86, 0.05), vcAt(0, 1.65, czF + 0.31), 1052688)),
      opq.push(vcBake(new BoxGeometry(s.cabin[0] * 0.86, 0.09, 0.22), vcAt(0, 1.65 - s.cabin[1] * 0.18, czF + 0.15), 1974824)));
    const skin = [11893070, 9657655, 13018202, 8541761][(e >>> 4) % 4],
      dxD = -s.cabin[0] * 0.2;
    opq.push(vcBake(new SphereGeometry(0.105, 8, 6), vcAt(dxD, 1.65 + s.cabin[1] * 0.12, czF + 0.2), skin));
    const capG = new SphereGeometry(0.1, 8, 5);
    capG.scale(1, 0.55, 1);
    (opq.push(vcBake(capG, vcAt(dxD, 1.65 + s.cabin[1] * 0.12 + 0.08, czF + 0.2), 1119001)),
      opq.push(vcBake(new BoxGeometry(0.3, 0.16, 0.1), vcAt(dxD, 1.65 - s.cabin[1] * 0.05, czF + 0.22), dimColor)));
    const whM = new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(dxD, 1.62, czF + 0.1), new Matrix4().makeRotationX(1.25));
    opq.push(vcBake(new CylinderGeometry(0.075, 0.075, 0.018, 10), whM, 1381656));
    gls.push(
      vcBake(
        new BoxGeometry(s.cabin[0] * 0.78, s.cabin[1] * 0.55, 0.08),
        vcAt(0, 1.68, s.cabinZ - s.cabin[2] * 0.5 - 0.05),
        10217727,
      ),
    );
    for (const h of [-1, 1])
      gls.push(
        vcBake(
          new BoxGeometry(0.08, s.cabin[1] * 0.5, s.cabin[2] * 0.48),
          vcAt(h * (s.cabin[0] * 0.5 + 0.04), 1.68, s.cabinZ),
          10217727,
        ),
      );
  }
  s.bed && opq.push(vcBake(new BoxGeometry(s.w * 0.94, 0.58, s.l * 0.38), vcAt(0, 1.2, 1.35), dimColor));
  s.box && opq.push(vcBake(new BoxGeometry(s.box[0], s.box[1], s.box[2]), vcAt(0, 1.55, 1.25), 15130833));
  if (s.bus) {
    opq.push(vcBake(new BoxGeometry(s.w + 0.06, 0.28, s.l * 0.86), vcAt(0, 1.38, 0), dimColor));
    const bw = new BoxGeometry(0.08, 0.64, 0.72);
    for (let h = -2.8; h <= 3.1; h += 1.2)
      for (const _ of [-1, 1]) gls.push(vcBake(bw, vcAt(_ * (s.w * 0.5 + 0.05), 2.08, h), 10217727));
  }
  s.sign && opq.push(vcBake(new BoxGeometry(1, 0.24, 0.46), vcAt(0, 2.2, -0.35), 16774310, 16765773, 0.9));
  // Wheels: tire + hub merged into one spinning mesh per corner; arches merge into the body.
  const g = s.l > 6 ? [-s.l * 0.34, 0, s.l * 0.34] : [-s.l * 0.34, s.l * 0.34],
    M = [],
    wheelGeo = mergeGeometries(
      [
        vcBake(new CylinderGeometry(0.42, 0.42, 0.36, 14), vcAt(0, 0, 0, Math.PI / 2), 395016),
        vcBake(new CylinderGeometry(0.18, 0.18, 0.38, 10), vcAt(0, 0, 0, Math.PI / 2), 14147041),
      ],
      !1,
    ),
    archGeo = new BoxGeometry(0.3, 0.34, 1.12);
  for (const x of g)
    for (const h of [-s.w * 0.54, s.w * 0.54]) {
      const _ = new Mesh(wheelGeo, opaque);
      (_.position.set(h, 0.45, x), t.add(_), M.push(_));
      opq.push(vcBake(archGeo, vcAt(h * 1.02, 0.72, x), 1250072));
    }
  const bumperGeo = new BoxGeometry(s.w * 1.02, 0.24, 0.16);
  for (const zc of [-s.l * 0.5 - 0.06, s.l * 0.5 + 0.06]) opq.push(vcBake(bumperGeo, vcAt(0, 0.62, zc), 1250072));
  const headGeo = new BoxGeometry(0.42, 0.2, 0.1),
    tailGeo = new BoxGeometry(0.36, 0.22, 0.1);
  for (const x of [-s.w * 0.28, s.w * 0.28])
    (opq.push(vcBake(headGeo, vcAt(x, 0.95, -s.l * 0.52 - 0.04), 16774064, 16765788, 1.7)),
      opq.push(vcBake(tailGeo, vcAt(x, 0.98, s.l * 0.52 + 0.04), 16725033, 16717325, 1.45)));
  // driver silhouette + steering wheel baked into the same body merge (zoom-detail
  // item 04): zero extra draws. ONLY for glass-cabin vehicles (bus) — car cabins
  // are solid opaque boxes with glass quads on the faces, so a driver inside them
  // can never be seen (verified the hard way; see DETAIL-LOOP.md item 4b).
  if (s.bus) {
    // the bus body is solid to y≈1.95; its glass band sits at y≈2.08 — the driver
    // is a head + cap at window height behind the windshield glass
    const skin = [11893070, 9657655, 13018202, 8541761][(e >>> 4) % 4],
      dx = -s.cabin[0] * 0.27,
      dz = s.cabinZ - s.cabin[2] / 2 + 0.55;
    opq.push(vcBake(new SphereGeometry(0.155, 8, 6), vcAt(dx, 2.06, dz), skin));
    const capGeo = new SphereGeometry(0.145, 8, 5);
    capGeo.scale(1, 0.55, 1);
    opq.push(vcBake(capGeo, vcAt(dx, 2.18, dz), 1119001));
  }
  (t.add(new Mesh(mergeGeometries(opq, !1), opaque)), gls.length && t.add(new Mesh(mergeGeometries(gls, !1), glass)));
  return (
    (t.userData = { wheels: M, colliderHalfW: s.w * 0.58, colliderHalfD: s.l * 0.55, plateHalfL: s.l / 2, hasDriver: !0, bus: !!s.bus, cab: { w: s.cabin[0], h: s.cabin[1], l: s.cabin[2], z: s.cabinZ } }),
    // moving traffic skips the shadow pass — barely visible at dusk, and it halves their draw cost
    t.traverse((x) => {
      ((x.castShadow = !1), (x.receiveShadow = !0));
    }),
    t
  );
}
function U1(i, e, idx = 0) {
  // zoom-detail 41 (round-five item 5): walkers become individuals — 4-tone
  // skin, cap-or-hair, two-tone jacket/waist, sleeve variety. All deterministic
  // per idx; the stacked cylinders keep the original body's silhouette envelope.
  const t = new Group(),
    { opaque } = vcMats(),
    SKIN = [11893070, 9657655, 13018202, 8541761],
    CAPS = [1119001, 4728103, 2110297, 6960969],
    HAIRS = [2036767, 4924443, 7359290, 9992782],
    WAIST = [3236447, 7887430, 5987111, 8012354],
    skin = SKIN[idx % 4],
    hair = idx % 3 === 1,
    capCol = hair ? HAIRS[(idx >> 2) % 4] : CAPS[(idx >> 2) % 4],
    waist = WAIST[(idx * 3 + 1) % 4],
    sleeves = idx % 5 < 2 ? skin : i,
    hatGeo = new SphereGeometry(0.25, 8, 5);
  hatGeo.scale(1, hair ? 0.42 : 0.5, 1);
  t.add(
    new Mesh(
      mergeGeometries(
        [
          vcBake(new CylinderGeometry(0.28, 0.315, 0.62, 8), vcAt(0, 1.515, 0), i),
          vcBake(new CylinderGeometry(0.315, 0.34, 0.34, 8), vcAt(0, 1.04, 0), waist),
          vcBake(new SphereGeometry(0.24, 10, 8), vcAt(0, 2.02, 0), skin),
          vcBake(hatGeo, vcAt(0, hair ? 2.13 : 2.17, 0), capCol),
        ],
        !1,
      ),
      opaque,
    ),
  );
  t.userData.style = { skin: idx % 4, hair, cap: capCol, waist, sleeves: sleeves === skin ? "short" : "long" };
  const d = [],
    legGeo = vcBake(new CylinderGeometry(0.075, 0.09, 0.78, 6), null, e),
    armGeo = vcBake(new CylinderGeometry(0.055, 0.065, 0.72, 6), null, sleeves);
  for (const f of [-0.16, 0.16]) {
    const p = new Mesh(legGeo, opaque);
    (p.position.set(f, 0.58, 0), t.add(p), d.push({ mesh: p, side: Math.sign(f), baseY: 0.58, amp: 0.28 }));
  }
  for (const f of [-0.38, 0.38]) {
    const p = new Mesh(armGeo, opaque);
    (p.position.set(f, 1.33, 0),
      (p.rotation.z = f < 0 ? -0.18 : 0.18),
      t.add(p),
      d.push({ mesh: p, side: -Math.sign(f), baseY: 1.33, amp: 0.34 }));
  }
  return (
    (t.userData.limbs = d),
    t.traverse((f) => {
      ((f.castShadow = !0), (f.receiveShadow = !0));
    }),
    t
  );
}
// ─── License plates (zoom-detail item 01): ONE InstancedMesh of plate quads
// (front+rear per car) sampling an 8x8 canvas atlas via a per-instance UV slot
// attribute — a single extra draw call and texture for every plated car in the
// world. Traffic cars sync matrices each city tick; parked cars are static and
// only re-apply when their steal-spot `taken` flag flips. Instance ranges are
// fixed (parked 0..259, traffic 260..339) so the two builders can reset
// independently in any order. Letters are consonant-only so no real word (or
// profanity) can ever appear; a blocklist catches vowel-free offenders.
const PLATE_LETTERS = "BCDFGHJKLMNPRSTVWXZ";
const PLATE_BANNED = ["FCK", "SHT", "DCK", "CNT", "KKK", "WTF", "FML", "NGR", "FGT", "SLT", "DMN", "BTC", "JZZ"];
const PLATE_CAP = 340;
function plateRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let plateAtlas = null;
function buildPlateAtlas() {
  if (plateAtlas) return plateAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 512));
  const g = cv.getContext("2d"),
    texts = [];
  for (let s = 0; s < 64; s++) {
    const rng = plateRng(0x51ee1 + s * 2654435761);
    let text = "";
    do {
      text = "";
      for (let k = 0; k < 3; k++) text += PLATE_LETTERS[(rng() * PLATE_LETTERS.length) | 0];
    } while (PLATE_BANNED.includes(text));
    text += " ";
    for (let k = 0; k < 3; k++) text += (rng() * 10) | 0;
    texts.push(text);
    const x = (s % 8) * 128,
      y = ((s / 8) | 0) * 64,
      commercial = s % 9 === 3;
    ((g.fillStyle = commercial ? "#f3d268" : "#ece9dc"), g.fillRect(x + 6, y + 8, 116, 48));
    ((g.strokeStyle = "#25304d"), (g.lineWidth = 3), g.strokeRect(x + 7.5, y + 9.5, 113, 45));
    ((g.fillStyle = "#1c2848"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    ((g.font = "bold 30px 'Courier New', monospace"), g.fillText(text, x + 64, y + 38));
    ((g.font = "bold 10px sans-serif"), g.fillText("STEEL STATE", x + 64, y + 17));
  }
  const texture = new CanvasTexture(cv);
  ((texture.colorSpace = SRGBColorSpace), (texture.anisotropy = 4));
  plateAtlas = { texture, texts };
  return plateAtlas;
}
const _plateOne = new Vector3(1, 1, 1),
  _plateCar = new Matrix4(),
  _plateOut = new Matrix4();
const plateSys = {
  mesh: null,
  texts: null,
  statics: [],
  dynamics: [],
  _zero: new Matrix4().makeScale(0, 0, 0),
  ensure() {
    if (this.mesh) return;
    const { texture, texts } = buildPlateAtlas();
    this.texts = texts;
    const geo = new PlaneGeometry(0.55, 0.17);
    geo.setAttribute("aPlateSlot", new InstancedBufferAttribute(new Float32Array(PLATE_CAP * 2), 2));
    const mat = new MeshBasicMaterial({ map: texture });
    mat.customProgramCacheKey = () => "plate-atlas";
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec2 aPlateSlot;\nvarying vec2 vPlateUv;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvPlateUv = uv * 0.125 + aPlateSlot;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec2 vPlateUv;")
        .replace("#include <map_fragment>", "diffuseColor *= texture2D( map, vPlateUv );");
    };
    this.mesh = new InstancedMesh(geo, mat, PLATE_CAP);
    ((this.mesh.frustumCulled = !1), (this.mesh.castShadow = !1), (this.mesh.receiveShadow = !1));
    for (let k = 0; k < PLATE_CAP; k++) this.mesh.setMatrixAt(k, this._zero);
    et.add(this.mesh);
  },
  _slot(seed) {
    const s = seed % 64;
    return { u: (s % 8) * 0.125, v: (7 - ((s / 8) | 0)) * 0.125, s };
  },
  // outset clears the car's own bumper bar (traffic cars: bumper face at halfL+0.14)
  _offsets(halfL, outset = 0.03) {
    return {
      offF: new Matrix4().makeRotationY(Math.PI).setPosition(0, 0.62, -(halfL + outset)),
      offR: new Matrix4().setPosition(0, 0.62, halfL + outset),
    };
  },
  resetStatic() {
    this.ensure();
    this.statics.length = 0;
    for (let k = 0; k < 260; k++) this.mesh.setMatrixAt(k, this._zero);
    this.mesh.instanceMatrix.needsUpdate = !0;
  },
  resetDynamic() {
    this.ensure();
    this.dynamics.length = 0;
    for (let k = 260; k < PLATE_CAP; k++) this.mesh.setMatrixAt(k, this._zero);
    this.mesh.instanceMatrix.needsUpdate = !0;
  },
  addStatic(matrix, halfL, seed, spot) {
    this.ensure();
    if (this.statics.length >= 130) return;
    const base = this.statics.length * 2,
      { u, v, s } = this._slot(seed * 13 + 29),
      reg = { matrix: matrix.clone(), spot, wasTaken: null, iF: base, iR: base + 1, slot: s, ...this._offsets(halfL) },
      attr = this.mesh.geometry.getAttribute("aPlateSlot");
    (attr.setXY(reg.iF, u, v), attr.setXY(reg.iR, u, v), (attr.needsUpdate = !0));
    (this.statics.push(reg), this._applyStatic(reg));
  },
  _applyStatic(reg) {
    reg.wasTaken = !!(reg.spot && reg.spot.taken);
    if (reg.wasTaken) (this.mesh.setMatrixAt(reg.iF, this._zero), this.mesh.setMatrixAt(reg.iR, this._zero));
    else {
      this.mesh.setMatrixAt(reg.iF, _plateOut.multiplyMatrices(reg.matrix, reg.offF));
      this.mesh.setMatrixAt(reg.iR, _plateOut.multiplyMatrices(reg.matrix, reg.offR));
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  },
  addDynamic(carMesh, seed) {
    this.ensure();
    if (this.dynamics.length >= 40) return;
    const base = 260 + this.dynamics.length * 2,
      { u, v, s } = this._slot(seed * 37 + 11),
      attr = this.mesh.geometry.getAttribute("aPlateSlot");
    (attr.setXY(base, u, v), attr.setXY(base + 1, u, v), (attr.needsUpdate = !0));
    this.dynamics.push({ carMesh, iF: base, iR: base + 1, slot: s, ...this._offsets(carMesh.userData.plateHalfL || 2.2, 0.155) });
  },
  update() {
    if (!this.mesh || !this.dynamics.length) return;
    for (const d of this.dynamics) {
      _plateCar.compose(d.carMesh.position, d.carMesh.quaternion, _plateOne);
      this.mesh.setMatrixAt(d.iF, _plateOut.multiplyMatrices(_plateCar, d.offF));
      this.mesh.setMatrixAt(d.iR, _plateOut.multiplyMatrices(_plateCar, d.offR));
    }
    for (const r of this.statics) if (!!(r.spot && r.spot.taken) !== r.wasTaken) this._applyStatic(r);
    this.mesh.instanceMatrix.needsUpdate = !0;
  },
};
// ─── Pedestrian near-tier kits (zoom-detail item 02): a small pool of face/
// hand/shoe add-on kits that attach to the pedestrian groups nearest the
// camera. Far pedestrians render exactly as built; a promoted one gains a
// merged face mesh (child of the group — heads never move relative to it)
// plus hands and shoes parented onto the animated limb meshes so they inherit
// the walk swing for free. Kit choice is pedIndex % pool, so a pedestrian
// always gets the same face/shoe variety back when re-promoted. All parts
// share vcMats' opaque material: promoted cost is 5 small draws per kit.
// ─── Stadium crowd v2 (zoom-detail item 10): the noise-texture crowd stays (far
// tier), but the nearest grandstand within 70m gets a pool of seated figures —
// two InstancedMeshes (tinted torsos + skin heads) laid out on the tilted crowd
// plane, doing a traveling wave. Invisible when no stand is near: zero cost at
// the race-start perf gate, honors the permanent-geometry freeze.
const crowdSys = {
  stands: [],
  torsos: null,
  heads: null,
  active: -1,
  cap: 0,
  figures: 0,
  _seats: [],
  init() {
    if (this.torsos || !this.stands.length) return;
    this.cap = mobilePerf ? 140 : 280;
    const { opaque } = vcMats();
    const torsoGeo = vcBake(new BoxGeometry(0.52, 0.6, 0.38), null, 16777215),
      headGeo = vcBake(new SphereGeometry(0.17, 7, 5), vcAt(0, 0.45, 0), 12947299);
    ((this.torsos = new InstancedMesh(torsoGeo, opaque, this.cap)), (this.heads = new InstancedMesh(headGeo, opaque, this.cap)));
    const shirt = new Color(),
      shirts = [16731486, 16765503, 4111086, 16777215, 15121483, 5025616, 16744576, 3392239];
    for (let k = 0; k < this.cap; k++) this.torsos.setColorAt(k, shirt.set(shirts[k % shirts.length]));
    this.torsos.instanceColor && (this.torsos.instanceColor.needsUpdate = !0);
    for (const m of [this.torsos, this.heads])
      ((m.frustumCulled = !1), (m.castShadow = !1), (m.receiveShadow = !1), (m.visible = !1), (m.count = 0), et.add(m));
    Bn(this.torsos, (t) => this.update(t));
  },
  _layout(st) {
    // seats in crowd-plane space: plane at stand-local (0,12,6), rotX(-0.85)
    this._seats.length = 0;
    const cosT = Math.cos(-0.85),
      sinT = Math.sin(-0.85),
      cy = Math.cos(st.yaw),
      sy = Math.sin(st.yaw),
      cols = Math.min(46, Math.floor((st.w * 0.9) / 1.7)),
      rows = Math.min(6, Math.floor(this.cap / cols));
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        if (this._seats.length >= this.cap) break;
        const px = -((cols - 1) * 1.7) / 2 + c * 1.7,
          py = -9.5 + r * 3.4,
          lx = px,
          ly = 12 + py * cosT + 0.35 * -sinT,
          lz = 6 + py * sinT + 0.35 * cosT;
        this._seats.push({
          x: st.x + lx * cy + lz * sy,
          y: st.gy + ly,
          z: st.z - lx * sy + lz * cy,
          ph: c * 0.42 + r * 0.9,
        });
      }
    this.figures = this._seats.length;
  },
  update(t) {
    if (!this.torsos) return;
    const cx = Xe.position.x,
      cz = Xe.position.z;
    let best = -1,
      bd = 70 * 70;
    for (let i = 0; i < this.stands.length; i++) {
      const s = this.stands[i],
        d = (s.x - cx) * (s.x - cx) + (s.z - cz) * (s.z - cz);
      d < bd && ((bd = d), (best = i));
    }
    if (best < 0) {
      if (this.active >= 0) ((this.active = -1), (this.torsos.visible = !1), (this.heads.visible = !1));
      return;
    }
    if (best !== this.active) {
      this.active = best;
      this._layout(this.stands[best]);
      ((this.torsos.count = this.figures), (this.heads.count = this.figures));
      ((this.torsos.visible = !0), (this.heads.visible = !0));
    }
    // traveling wave (matrices recomposed only while a stand is promoted)
    const m = new Matrix4();
    for (let k = 0; k < this.figures; k++) {
      const s = this._seats[k],
        lift = Math.max(0, Math.sin(t * 2.2 - s.ph)) * 0.5;
      m.makeRotationY(this.stands[this.active].yaw + Math.PI);
      m.setPosition(s.x, s.y + lift, s.z);
      (this.torsos.setMatrixAt(k, m), this.heads.setMatrixAt(k, m));
    }
    ((this.torsos.instanceMatrix.needsUpdate = !0), (this.heads.instanceMatrix.needsUpdate = !0));
  },
};
// ─── Birds that scatter (zoom-detail item 13 / backlog 14): one pooled flock
// of instanced pigeons pecking on the ground ahead of the roam player; drive
// within 9m and they burst upward, flutter away and despawn. Roam-only, one
// InstancedMesh visible only while a flock is active — zero permanent cost.
const birdSys = {
  mesh: null,
  cap: 9,
  active: !1,
  state: "idle",
  birds: [],
  spot: { x: 0, z: 0 },
  _timer: 0,
  _m: null,
  _q: null,
  ensure() {
    if (this.mesh) return;
    const { opaque } = vcMats();
    const geo = mergeGeometries(
      [
        vcBake(new SphereGeometry(0.085, 6, 5), vcAt(0, 0.1, 0), 9145227),
        vcBake(new SphereGeometry(0.055, 6, 5), vcAt(0, 0.17, -0.09), 6118749),
        vcBake(new ConeGeometry(0.02, 0.06, 4), vcAt(0, 0.16, -0.15, Math.PI / 2), 15379494),
        vcBake(new BoxGeometry(0.16, 0.012, 0.09), vcAt(-0.1, 0.13, 0.01), 7763064),
        vcBake(new BoxGeometry(0.16, 0.012, 0.09), vcAt(0.1, 0.13, 0.01), 7763064),
        vcBake(new BoxGeometry(0.05, 0.012, 0.1), vcAt(0, 0.12, 0.12), 5460309),
      ],
      !1,
    );
    this.mesh = new InstancedMesh(geo, opaque, this.cap);
    const tint = new Color(),
      tones = [16777215, 11119017, 9143160, 12961221, 8355711];
    for (let k = 0; k < this.cap; k++) this.mesh.setColorAt(k, tint.set(tones[k % tones.length]));
    this.mesh.instanceColor && (this.mesh.instanceColor.needsUpdate = !0);
    ((this.mesh.frustumCulled = !1), (this.mesh.castShadow = !1), (this.mesh.visible = !1), (this.mesh.count = 0));
    et.add(this.mesh);
    ((this._m = new Matrix4()), (this._q = new Matrix4()));
  },
  spawn(x, z) {
    this.ensure();
    ((this.spot.x = x), (this.spot.z = z));
    this.birds.length = 0;
    const n = 6 + ((Math.abs(x + z) | 0) % (this.cap - 5));
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + 0.7,
        r = 0.5 + (k % 3) * 0.55;
      this.birds.push({
        x: x + Math.cos(a) * r,
        y: He(x + Math.cos(a) * r, z + Math.sin(a) * r) + 0.02,
        z: z + Math.sin(a) * r,
        yaw: a + Math.PI / 2,
        vx: 0,
        vy: 0,
        vz: 0,
        ph: k * 1.3,
        flying: !1,
      });
    }
    ((this.active = !0), (this.state = "peck"), (this.mesh.visible = !0), (this.mesh.count = this.birds.length));
  },
  deactivate() {
    ((this.active = !1), (this.state = "idle"), (this.mesh && ((this.mesh.visible = !1), (this.mesh.count = 0))));
  },
  update(t, dt) {
    if (!dt) return;
    if (!this.active) {
      this._timer -= dt;
      if (this._timer > 0 || u.mode !== "roam" || Math.abs(u.speed) > 45) return;
      this._timer = 2.2;
      // spawn a pecking flock a little ahead of the player, off to one side
      const fx = -Math.sin(u.roamYaw ?? 0),
        fz = -Math.cos(u.roamYaw ?? 0),
        side = ((t | 0) % 2 ? 1 : -1) * (5 + ((t * 7) % 6)),
        sx = u.roamPos.x + fx * 19 - fz * side,
        sz = u.roamPos.z + fz * 19 + fx * side;
      this.spawn(sx, sz);
      return;
    }
    const pdx = u.roamPos.x - this.spot.x,
      pdz = u.roamPos.z - this.spot.z,
      pd2 = pdx * pdx + pdz * pdz;
    if (this.state === "peck" && u.mode === "roam" && pd2 < 81) {
      this.state = "scatter";
      for (const b of this.birds) {
        const away = Math.atan2(b.x - u.roamPos.x, b.z - u.roamPos.z);
        ((b.vx = Math.sin(away) * (3.2 + (b.ph % 2))), (b.vz = Math.cos(away) * (3.2 + ((b.ph * 1.7) % 2))), (b.vy = 3.4 + (b.ph % 1.6)), (b.flying = !0), (b.yaw = away));
      }
    }
    if (pd2 > 3600 || u.mode !== "roam") {
      this.deactivate();
      return;
    }
    let k = 0,
      allGone = this.state === "scatter";
    for (const b of this.birds) {
      if (this.state === "peck") {
        b.y = He(b.x, b.z) + 0.02 + Math.max(0, Math.sin(t * 5 + b.ph)) * 0.05;
        b.yaw += Math.sin(t * 0.7 + b.ph) * 0.01;
      } else if (b.flying) {
        ((b.x += b.vx * dt), (b.z += b.vz * dt), (b.y += b.vy * dt), (b.vy -= 0.4 * dt));
        if (b.y > He(b.x, b.z) + 14) b.vy = Math.min(b.vy, 0.6);
        b.y < He(b.x, b.z) + 11 && (allGone = !1);
      }
      const roll = b.flying ? Math.sin(t * 16 + b.ph) * 0.5 : 0;
      this._m.makeRotationY(b.yaw);
      roll && (this._q.makeRotationZ(roll), this._m.multiply(this._q));
      this._m.setPosition(b.x, b.y, b.z);
      this.mesh.setMatrixAt(k++, this._m);
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
    if (this.state === "scatter") {
      this._timer -= dt;
      (allGone || this._timer < -6) && this.deactivate();
    }
  },
};
// ─── Steam grates (zoom-detail item 14 / backlog 15): ~12 vent spots seeded
// along the curbs; the nearest 3 within 55m show a dark grate disc and a rising
// column of soft steam puffs (pooled sprites, cycling y/scale/opacity). Nothing
// renders when no vent is near — freeze-safe.
const steamSys = {
  spots: [],
  vents: null,
  active: 0,
  PUFFS: 5,
  _timer: 0,
  ensure() {
    if (this.vents) return;
    const cv = document.createElement("canvas");
    ((cv.width = 64), (cv.height = 64));
    const g = cv.getContext("2d"),
      grad = g.createRadialGradient(32, 32, 4, 32, 32, 30);
    (grad.addColorStop(0, "rgba(235,240,245,0.55)"), grad.addColorStop(0.6, "rgba(225,232,240,0.22)"), grad.addColorStop(1, "rgba(220,228,238,0)"));
    ((g.fillStyle = grad), g.fillRect(0, 0, 64, 64));
    const tex = new CanvasTexture(cv);
    tex.colorSpace = SRGBColorSpace;
    const { opaque } = vcMats();
    const grateGeo = mergeGeometries(
      [
        vcBake(new CylinderGeometry(0.44, 0.44, 0.025, 10), vcAt(0, 0.012, 0), 1512727),
        vcBake(new CylinderGeometry(0.34, 0.34, 0.03, 10), vcAt(0, 0.016, 0), 3158322),
      ],
      !1,
    );
    this.vents = [];
    const n = mobilePerf ? 2 : 3;
    for (let v = 0; v < n; v++) {
      const grate = new Mesh(grateGeo, opaque);
      ((grate.visible = !1), (grate.castShadow = !1), (grate.receiveShadow = !0), et.add(grate));
      const puffs = [];
      for (let k = 0; k < this.PUFFS; k++) {
        const sp = new Sprite(new SpriteMaterial({ map: tex, transparent: !0, depthWrite: !1, opacity: 0 }));
        ((sp.visible = !1), (sp.renderOrder = 4), et.add(sp), puffs.push(sp));
      }
      this.vents.push({ grate, puffs, spot: null, ph: v * 0.37 });
    }
  },
  update(t, dt) {
    if (!this.spots.length || !dt) return;
    this._timer -= dt;
    if (this._timer <= 0) {
      this._timer = 0.5;
      this.ensure();
      const cx = Xe.position.x,
        cz = Xe.position.z,
        R2 = 55 * 55,
        cand = [];
      for (const s of this.spots) {
        const dx = s.x - cx,
          dz = s.z - cz,
          d2 = dx * dx + dz * dz;
        d2 < R2 && cand.push({ s, d2 });
      }
      cand.sort((a, b) => a.d2 - b.d2);
      this.active = 0;
      for (let v = 0; v < this.vents.length; v++) {
        const vent = this.vents[v],
          s = cand[v]?.s ?? null;
        vent.spot = s;
        if (s) {
          (vent.grate.position.set(s.x, s.y + 0.01, s.z), (vent.grate.visible = !0), this.active++);
          for (const sp of vent.puffs) sp.visible = !0;
        } else {
          vent.grate.visible = !1;
          for (const sp of vent.puffs) sp.visible = !1;
        }
      }
    }
    if (!this.vents) return;
    for (const vent of this.vents) {
      if (!vent.spot) continue;
      for (let k = 0; k < vent.puffs.length; k++) {
        const p = ((t * 0.32 + vent.ph + k / this.PUFFS) % 1 + 1) % 1,
          sp = vent.puffs[k];
        sp.position.set(vent.spot.x + Math.sin(t * 0.8 + k * 2.1) * 0.22 * p, vent.spot.y + 0.25 + p * 2.6, vent.spot.z + Math.cos(t * 0.7 + k * 1.7) * 0.2 * p);
        const sc = 0.55 + p * 1.9;
        sp.scale.set(sc, sc, 1);
        sp.material.opacity = (p < 0.1 ? p / 0.1 : 1 - (p - 0.1) / 0.9) * 0.42;
      }
    }
  },
};
// parked-car variety (near tier): pooled add-on kits promoted onto the nearest
// parked instances — roof racks (some with cargo boxes), rocker-panel grime,
// door dents, antennas, side mirrors. Features seeded by spot idx so a car
// keeps its look; base instanced silhouette (and the far view) untouched.
let carGrimeAtlas = null;
function buildCarGrimeAtlas() {
  if (carGrimeAtlas) return carGrimeAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 256));
  const g = cv.getContext("2d"),
    r = plateRng(0xca7d1e);
  for (let col = 0; col < 4; col++) {
    // row 0: rocker grime strips — sooty/rust streaks hugging the lower edge
    const x0 = col * 128;
    for (let i = 0; i < 46; i++) {
      const bx = x0 + 6 + r() * 116,
        by = 78 + r() * 40,
        bw = 5 + r() * (12 + col * 5),
        bh = 3 + r() * 9,
        rust = r() < 0.45;
      ((g.fillStyle = rust ? `rgba(96,58,30,${0.1 + r() * 0.3})` : `rgba(28,30,34,${0.08 + r() * 0.26})`),
        g.beginPath(),
        g.ellipse(bx, by, bw, bh, r() * 3.14, 0, 6.29),
        g.fill());
    }
    for (let i = 0; i < 9; i++) {
      const sx = x0 + 10 + r() * 108;
      ((g.strokeStyle = `rgba(70,46,26,${0.12 + r() * 0.22})`), (g.lineWidth = 1 + r() * 2), g.beginPath(), g.moveTo(sx, 70 + r() * 20), g.lineTo(sx + (r() - 0.5) * 10, 118), g.stroke());
    }
    // row 1: door dents — dark crease + a rust bloom, centered in the cell
    const cx = x0 + 64,
      cy = 192;
    for (let i = 0; i < 7; i++)
      ((g.fillStyle = `rgba(20,22,26,${0.1 + r() * 0.2})`), g.beginPath(), g.ellipse(cx + (r() - 0.5) * 44, cy + (r() - 0.5) * 34, 14 + r() * 22, 8 + r() * 12, r() * 3.14, 0, 6.29), g.fill());
    ((g.strokeStyle = "rgba(14,15,18,0.5)"), (g.lineWidth = 2.5), g.beginPath(), g.moveTo(cx - 26 - r() * 12, cy + (r() - 0.5) * 16), g.quadraticCurveTo(cx + (r() - 0.5) * 18, cy + (r() - 0.5) * 20, cx + 26 + r() * 12, cy + (r() - 0.5) * 16), g.stroke());
    r() < 0.6 && ((g.fillStyle = "rgba(110,64,32,0.34)"), g.beginPath(), g.ellipse(cx + (r() - 0.5) * 30, cy + (r() - 0.5) * 22, 7 + r() * 8, 5 + r() * 6, r() * 3.14, 0, 6.29), g.fill());
  }
  carGrimeAtlas = new CanvasTexture(cv);
  carGrimeAtlas.colorSpace = SRGBColorSpace;
  return carGrimeAtlas;
}
const parkedKitSys = {
  kits: null,
  promoted: 0,
  racks: 0,
  grimeN: 0,
  dents: 0,
  antennas: 0,
  RADIUS: 34,
  sample: [],
  _timer: 0,
  _slotPlane(w, h, col, row) {
    const g = new PlaneGeometry(w, h),
      uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (col + uv.getX(i)) / 4, 1 - (row + (1 - uv.getY(i))) / 2);
    return g;
  },
  ensure() {
    if (this.kits) return;
    const atlas = buildCarGrimeAtlas(),
      decalMat = new MeshStandardMaterial({ map: atlas, transparent: !0, depthWrite: !1, roughness: 0.92, metalness: 0, polygonOffset: !0, polygonOffsetFactor: -2 }),
      railMat = new MeshStandardMaterial({ color: 2699316, roughness: 0.46, metalness: 0.58 }),
      darkMat = new MeshStandardMaterial({ color: 1381656, roughness: 0.6, metalness: 0.3 });
    this._grimeGeos = [0, 1, 2, 3].map((c) => this._slotPlane(3.9, 0.55, c, 0));
    this._dentGeos = [0, 1, 2, 3].map((c) => this._slotPlane(0.72, 0.46, c, 1));
    const railGeo = new BoxGeometry(0.06, 0.05, 1.85),
      barGeo = new BoxGeometry(1.38, 0.04, 0.05),
      cargoGeo = new BoxGeometry(1.15, 0.34, 1.5),
      mirrorGeo = mergeGeometries([
        new BoxGeometry(0.2, 0.03, 0.03).translate(-0.12, 0, 0),
        new BoxGeometry(0.13, 0.09, 0.045).translate(0, 0, 0),
      ]),
      antGeo = new CylinderGeometry(0.012, 0.018, 0.55, 5);
    // shared glass+seam geometry (parked body: nose -z, cabin x ±0.85 y 1.14-1.70,
    // z -1.295..0.855; body sides x ±1.1, tail z 2.3) and vc-baked lamp lenses
    {
      const gp = [];
      for (const sx of [-1, 1])
        for (const [zc, zw] of [
          [-0.75, 0.8],
          [0.28, 0.85],
        ])
          gp.push(new PlaneGeometry(zw, 0.4).rotateY((sx * Math.PI) / 2).translate(sx * 0.856, 1.42, zc));
      gp.push(new PlaneGeometry(1.5, 0.42).rotateY(Math.PI).translate(0, 1.42, -1.301));
      gp.push(new PlaneGeometry(1.5, 0.38).translate(0, 1.44, 0.861));
      for (const sx of [-1, 1]) for (const zs of [-0.35, 0.85]) gp.push(new PlaneGeometry(0.025, 0.6).rotateY((sx * Math.PI) / 2).translate(sx * 1.106, 0.76, zs));
      this._glassGeo = mergeGeometries(gp, !1);
      this._glassMat = new MeshStandardMaterial({ color: 1054236, roughness: 0.22, metalness: 0.55 });
      const lampAt = (x, y, z, flip) => {
        const m = new Matrix4().makeRotationY(flip ? Math.PI : 0);
        return (m.setPosition(x, y, z), m);
      };
      this._lampGeo = mergeGeometries(
        [
          vcBake(new PlaneGeometry(0.3, 0.15), lampAt(-0.78, 0.98, 2.302, !1), 6822420),
          vcBake(new PlaneGeometry(0.3, 0.15), lampAt(0.78, 0.98, 2.302, !1), 6822420),
          vcBake(new PlaneGeometry(0.32, 0.15), lampAt(-0.76, 0.98, -2.302, !0), 13684944),
          vcBake(new PlaneGeometry(0.32, 0.15), lampAt(0.76, 0.98, -2.302, !0), 13684944),
        ],
        !1,
      );
    }
    this.kits = [];
    const n = mobilePerf ? 3 : 7;
    for (let k = 0; k < n; k++) {
      const kit = new Group(),
        rack = new Group();
      for (const rx of [-0.66, 0.66]) {
        const rail = new Mesh(railGeo, railMat);
        (rail.position.set(rx, 1.76, -0.22), rack.add(rail));
      }
      for (const bz of [-0.9, -0.22, 0.5]) {
        const bar = new Mesh(barGeo, railMat);
        (bar.position.set(0, 1.79, bz), rack.add(bar));
      }
      const cargoMat = new MeshStandardMaterial({ roughness: 0.72, metalness: 0.08 }),
        cargo = new Mesh(cargoGeo, cargoMat);
      (cargo.position.set(0, 1.98, -0.25), rack.add(cargo), kit.add(rack));
      const grimeL = new Mesh(this._grimeGeos[0], decalMat),
        grimeR = new Mesh(this._grimeGeos[0], decalMat);
      (grimeL.position.set(-1.112, 0.66, 0), (grimeL.rotation.y = -Math.PI / 2), grimeR.position.set(1.112, 0.66, 0), (grimeR.rotation.y = Math.PI / 2), (grimeL.renderOrder = 2), (grimeR.renderOrder = 2), kit.add(grimeL), kit.add(grimeR));
      const dent = new Mesh(this._dentGeos[0], decalMat);
      ((dent.renderOrder = 2), kit.add(dent));
      const ant = new Mesh(antGeo, darkMat);
      (ant.position.set(0.72, 1.42, 1.72), (ant.rotation.x = -0.14), kit.add(ant));
      for (const mx of [-1.08, 1.08]) {
        const mir = new Mesh(mirrorGeo, darkMat);
        (mir.position.set(mx, 1.5, -1.16), (mir.rotation.y = mx < 0 ? Math.PI : 0), kit.add(mir));
      }
      // zoom-detail 42 (round-five item 6): glass + door seams + lamp lenses.
      // Two meshes per kit on SHARED merged geometries — every promoted car
      // stops being a windowless box at 3m. Parked = lenses dark, never lit.
      const glass = new Mesh(this._glassGeo, this._glassMat),
        lamps = new Mesh(this._lampGeo, vcMats().opaque);
      ((glass.raycast = () => {}), (lamps.raycast = () => {}), kit.add(glass), kit.add(lamps));
      ((kit.visible = !1), kit.traverse((o) => ((o.castShadow = !1), (o.receiveShadow = !1))), et.add(kit));
      this.kits.push({ g: kit, rack, cargo, cargoMat, grimeL, grimeR, dent, ant, idx: -1 });
    }
  },
  enabled: !0,
  update(t, dt) {
    if (!rideSys.spots.length || !rideSys.im || !dt) return;
    if (!this.enabled) {
      if (this.kits) for (const k of this.kits) ((k.g.visible = !1), (k.idx = -1));
      ((this.promoted = 0), (this.racks = 0), (this.grimeN = 0), (this.dents = 0), (this.antennas = 0), (this.sample.length = 0));
      return;
    }
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.5;
    this.ensure();
    const cx = Xe.position.x,
      cz = Xe.position.z,
      R2 = this.RADIUS * this.RADIUS,
      cand = [];
    // altitude gate: the race ribbon runs ~64m above the city — never promote
    // under a high camera (2D distance alone would match cars directly below)
    if (Xe.position.y <= 26)
      for (const s of rideSys.spots) {
        if (s.taken) continue;
        const dx = s.x - cx,
          dz = s.z - cz,
          d2 = dx * dx + dz * dz;
        d2 < R2 && cand.push({ s, d2 });
      }
    cand.sort((a, b) => a.d2 - b.d2);
    ((this.promoted = 0), (this.racks = 0), (this.grimeN = 0), (this.dents = 0), (this.antennas = 0), (this.sample.length = 0));
    const CARGO_COLS = [8079146, 3100523, 3818058, 7042934];
    for (let k = 0; k < this.kits.length; k++) {
      const kit = this.kits[k],
        s = cand[k]?.s ?? null;
      if (!s) {
        ((kit.g.visible = !1), (kit.idx = -1));
        continue;
      }
      rideSys.im.getMatrixAt(s.idx, _pkM);
      _pkM.decompose(kit.g.position, kit.g.quaternion, _pkV);
      const r = plateRng((((s.idx + 1) * 2654435761) ^ 0x9a4b17) >>> 0),
        rRack = r(),
        rCargo = r(),
        rCargoCol = r(),
        rGrime = r(),
        rGrimeV = r(),
        rDent = r(),
        rDentV = r(),
        rDentSide = r(),
        rDentZ = r(),
        rAnt = r();
      const hasRack = rRack < 0.34,
        hasGrime = rGrime < 0.62,
        hasDent = rDent < 0.3,
        hasAnt = rAnt < 0.42;
      ((kit.rack.visible = hasRack), (kit.cargo.visible = rCargo < 0.5), kit.cargoMat.color.setHex(CARGO_COLS[(rCargoCol * 4) | 0]));
      ((kit.grimeL.visible = hasGrime), (kit.grimeR.visible = hasGrime));
      if (hasGrime) {
        const gv = (rGrimeV * 4) | 0;
        ((kit.grimeL.geometry = this._grimeGeos[gv]), (kit.grimeR.geometry = this._grimeGeos[gv]));
      }
      kit.dent.visible = hasDent;
      if (hasDent) {
        const side = rDentSide < 0.5 ? -1 : 1;
        (kit.dent.position.set(side * 1.112, 0.86, -0.7 + rDentZ * 1.8), (kit.dent.rotation.y = (side * Math.PI) / 2), (kit.dent.geometry = this._dentGeos[(rDentV * 4) | 0]));
      }
      kit.ant.visible = hasAnt;
      ((kit.g.visible = !0), (kit.idx = s.idx), this.promoted++);
      (hasRack && this.racks++, hasGrime && this.grimeN++, hasDent && this.dents++, hasAnt && this.antennas++);
      this.sample.length < 3 && this.sample.push({ idx: s.idx, x: +s.x.toFixed(1), y: +kit.g.position.y.toFixed(2), z: +s.z.toFixed(1), yaw: +Math.atan2(2 * (kit.g.quaternion.w * kit.g.quaternion.y + kit.g.quaternion.x * kit.g.quaternion.z), 1 - 2 * (kit.g.quaternion.y * kit.g.quaternion.y + kit.g.quaternion.x * kit.g.quaternion.x)).toFixed(2), rack: hasRack, grime: hasGrime, dent: hasDent });
    }
  },
};
const _pkM = new Matrix4(),
  _pkV = new Vector3();
// near-field ambience (zoom-detail item 20): crowd murmur near the stands,
// steam hiss at active vents, WALK-signal crossing ticks, phone chirps from
// texting pedestrians. All procedural WebAudio on the existing `mi` bus (so
// mute/volume come free), all gated to the city camera — the race view and
// the at-distance soundscape are untouched.
const ambientSys = {
  signals: null, // live PS array (the signal tick stamps walkEW/walkNS per box)
  nodes: null,
  enabled: !0,
  _timer: 0,
  _nextTick: 0,
  _nextChirp: 0,
  tickCount: 0,
  chirpCount: 0,
  levels: { murmur: 0, hiss: 0 },
  ticksActive: 0,
  ensure() {
    if (this.nodes || !mi) return;
    const ctx = mi.ctx,
      bus = ctx.createGain();
    ((bus.gain.value = 0.9), bus.connect(mi.master));
    const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate),
      nd = nb.getChannelData(0);
    let v = 0;
    for (let k = 0; k < nd.length; k++) nd[k] = v = v * 0.965 + (Math.random() * 2 - 1) * 0.28;
    const mkLoop = (type, freq, q) => {
      const src = ctx.createBufferSource(),
        f = ctx.createBiquadFilter(),
        g = ctx.createGain();
      ((src.buffer = nb), (src.loop = !0), (f.type = type), (f.frequency.value = freq), (f.Q.value = q), (g.gain.value = 1e-4));
      (src.connect(f), f.connect(g), g.connect(bus), src.start());
      return { src, f, g };
    };
    this.nodes = { ctx, bus, murmur: mkLoop("lowpass", 430, 0.4), hiss: mkLoop("bandpass", 3300, 0.8) };
  },
  _pan(x, z) {
    // camera-relative stereo: project the source onto the camera right vector
    const e = Xe.matrixWorld.elements,
      dx = x - Xe.position.x,
      dz = z - Xe.position.z,
      d = Math.hypot(dx, dz) || 1;
    return MathUtils.clamp(((dx * e[0] + dz * e[2]) / d) * 0.8, -0.9, 0.9);
  },
  blip(freq, dur, vol, pan, freq2) {
    const n = this.nodes;
    if (!n) return;
    const t0 = n.ctx.currentTime,
      o = n.ctx.createOscillator(),
      g = n.ctx.createGain(),
      p = n.ctx.createStereoPanner();
    ((o.type = "sine"), o.frequency.setValueAtTime(freq, t0), freq2 && o.frequency.setValueAtTime(freq2, t0 + dur * 0.5));
    (g.gain.setValueAtTime(1e-4, t0), g.gain.exponentialRampToValueAtTime(Math.max(vol, 2e-4), t0 + 0.008), g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur));
    ((p.pan.value = pan || 0), o.connect(g), g.connect(p), p.connect(n.bus), o.start(t0), o.stop(t0 + dur + 0.03));
  },
  update(t, dt) {
    if (!mi || !dt) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.25;
    this.ensure();
    const n = this.nodes;
    if (!n) return;
    const now = n.ctx.currentTime,
      cx = Xe.position.x,
      cz = Xe.position.z,
      cityCam = this.enabled && (u.mode === "roam" || u.mode === "race" || u.mode === "paused") && Xe.position.y <= 26;
    // crowd murmur — nearest grandstand, slow swell so it breathes
    let mg = 1e-4;
    if (cityCam && crowdSys.stands.length) {
      let d2b = 1e9;
      for (const s of crowdSys.stands) {
        const d2 = (s.x - cx) * (s.x - cx) + (s.z - cz) * (s.z - cz);
        d2 < d2b && (d2b = d2);
      }
      const d = Math.sqrt(d2b);
      d < 90 && (mg = 0.15 * (1 - d / 90) * (0.72 + 0.28 * Math.sin(t * 0.6)));
    }
    n.murmur.g.gain.setTargetAtTime(mg, now, 0.3);
    // steam hiss — nearest active vent
    let hg = 1e-4;
    if (cityCam && steamSys.vents)
      for (const v of steamSys.vents) {
        if (!v.spot) continue;
        // 26m: the roam CAR camera trails ~17m behind the player, so a
        // tighter radius would make vent hiss a foot-mode-only detail
        const d = Math.hypot(v.spot.x - cx, v.spot.z - cz);
        d < 26 && (hg = Math.max(hg, 0.05 * (1 - d / 26)));
      }
    n.hiss.g.gain.setTargetAtTime(hg, now, 0.5);
    // WALK-signal crossing ticks — nearest walking box, metronome cadence
    this.ticksActive = 0;
    if (cityCam && this.signals) {
      let best = null,
        bd = 26;
      for (const P of this.signals) {
        if (!P.walkEW && !P.walkNS) continue;
        const d = Math.hypot(P.x - cx, P.z - cz);
        d < bd && ((bd = d), (best = P));
      }
      if (best) {
        this.ticksActive = 1;
        t >= this._nextTick && ((this._nextTick = t + 0.55), this.tickCount++, this.blip(940, 0.05, 0.13 * (1 - bd / 26), this._pan(best.x, best.z)));
      }
    }
    // phone chirps — a nearby texting pedestrian gets a reply every few seconds
    if (cityCam && !mobilePerf && pedKitSys.kits && t >= this._nextChirp) {
      let best = null,
        bd = 15;
      for (const k of pedKitSys.kits) {
        if (!k.ped || !k.texting || !k.ped.mesh) continue;
        const p = k.ped.mesh.position,
          d = Math.hypot(p.x - cx, p.z - cz);
        d < bd && ((bd = d), (best = p));
      }
      if (best) {
        this._nextChirp = t + 4 + Math.random() * 5;
        this.chirpCount++;
        this.blip(1318, 0.17, 0.1 * (1 - bd / 15), this._pan(best.x, best.z), 1760);
      }
    }
    ((this.levels.murmur = +mg.toFixed(3)), (this.levels.hiss = +hg.toFixed(3)));
  },
};
// rooftop detail (zoom-detail item 17): pooled kits promoted onto the roofs
// nearest the camera — HVAC clusters, antenna masts, water towers. Each kit
// is ONE vcBaked merged mesh (single draw call on the shared opaque
// material), so six kits cost six calls; visible from the ribbon where the
// race actually flies past the skyline.
const rooftopSys = {
  spots: [],
  kits: null,
  promoted: 0,
  enabled: !0,
  RADIUS: 130,
  sample: [],
  _timer: 0,
  resetSpots() {
    this.spots.length = 0;
  },
  _variantFor(s, r) {
    const elig = [];
    (Math.min(s.w, s.d) >= 10 && elig.push(0), s.h >= 14 && elig.push(1), s.w >= 14 && s.d >= 14 && s.h >= 26 && elig.push(2));
    return elig.length ? elig[(r * elig.length) | 0] : 0;
  },
  PIGEONS: 7,
  ensure() {
    if (this.kits) return;
    const { opaque } = vcMats(),
      GALV = 11974326,
      DARK = 3423298,
      DUCT = 9211020,
      STEEL = 4022096,
      TAN = 13213802,
      TEAL = 6197130,
      RUST = 8079150;
    // perched pigeons, baked straight into the kit merges (zero extra draws)
    const pigeon = (x, y, z, yaw) => {
      const m = (gx, gy, gz) => new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(x, y, z), new Matrix4().multiplyMatrices(new Matrix4().makeRotationY(yaw), new Matrix4().makeTranslation(gx, gy, gz)));
      return [
        vcBake(new BoxGeometry(0.14, 0.13, 0.22), m(0, 0.07, 0), 8949654),
        vcBake(new BoxGeometry(0.08, 0.08, 0.08), m(0, 0.17, -0.13), 5926502),
        vcBake(new BoxGeometry(0.08, 0.028, 0.13), m(0, 0.1, 0.15), 5926502),
      ];
    };
    const ac = (x, z, w, h, d) => [
      vcBake(new BoxGeometry(w, h, d), vcAt(x, h / 2, z), GALV),
      vcBake(new CylinderGeometry(Math.min(w, d) * 0.33, Math.min(w, d) * 0.33, 0.06, 12), vcAt(x, h + 0.02, z), DARK),
    ];
    const v0 = () =>
      mergeGeometries(
        [
          ...ac(-1.3, -0.7, 1.8, 1.1, 1.4),
          ...ac(1.2, 0.6, 2.4, 1.3, 1.6),
          vcBake(new BoxGeometry(0.5, 0.5, 3.6), vcAt(-0.2, 0.25, -1.8), DUCT),
          vcBake(new BoxGeometry(0.5, 1.4, 0.5), vcAt(1.5, 0.7, -1.8), DUCT),
          vcBake(new CylinderGeometry(0.16, 0.18, 0.9, 8), vcAt(-2.4, 0.45, 1.2), RUST),
          vcBake(new CylinderGeometry(0.14, 0.16, 0.7, 8), vcAt(2.6, 0.35, -0.5), DARK),
          ...pigeon(0.7, 1.3, 0.3, 0.7),
          ...pigeon(1.8, 1.3, 0.9, -1.9),
        ],
        !1,
      );
    const v1 = () => {
      const dishM = new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(1.3, 1.35, 0.6), new Matrix4().makeRotationZ(1.15));
      return mergeGeometries(
        [
          vcBake(new BoxGeometry(0.9, 0.5, 0.9), vcAt(0, 0.25, 0), STEEL),
          vcBake(new CylinderGeometry(0.1, 0.14, 2.2, 8), vcAt(0, 1.6, 0), DARK),
          vcBake(new CylinderGeometry(0.07, 0.1, 1.8, 8), vcAt(0, 3.6, 0), DARK),
          vcBake(new CylinderGeometry(0.035, 0.07, 1.6, 6), vcAt(0, 5.3, 0), DARK),
          vcBake(new ConeGeometry(0.85, 0.4, 12), dishM, 14212594),
          vcBake(new BoxGeometry(0.5, 0.12, 0.12), vcAt(0.85, 1.35, 0.6), STEEL),
          vcBake(new CylinderGeometry(0.02, 0.03, 1.5, 6), vcAt(-1.2, 0.95, 0.9), DARK),
          vcBake(new BoxGeometry(0.5, 0.7, 0.28), vcAt(-1.2, 0.35, 0.9), STEEL),
          ...pigeon(0.3, 0.5, -0.3, 2.4),
          ...pigeon(-0.28, 0.5, 0.25, -0.5),
        ],
        !1,
      );
    };
    const v2 = (tank) => {
      const parts = [];
      for (const [lx, lz] of [
        [-1.5, -1.5],
        [1.5, -1.5],
        [-1.5, 1.5],
        [1.5, 1.5],
      ])
        parts.push(vcBake(new CylinderGeometry(0.12, 0.14, 2.8, 8), vcAt(lx, 1.4, lz), STEEL));
      (parts.push(vcBake(new CylinderGeometry(2.1, 2.1, 2.5, 14), vcAt(0, 4.05, 0), tank)),
        parts.push(vcBake(new CylinderGeometry(2.14, 2.14, 0.1, 14), vcAt(0, 3.3, 0), DARK)),
        parts.push(vcBake(new CylinderGeometry(2.14, 2.14, 0.1, 14), vcAt(0, 4.7, 0), DARK)),
        parts.push(vcBake(new ConeGeometry(2.28, 1.1, 14), vcAt(0, 5.85, 0), STEEL)),
        parts.push(vcBake(new CylinderGeometry(0.06, 0.06, 0.5, 6), vcAt(0, 6.6, 0), DARK)));
      (parts.push(...pigeon(1.85, 5.3, 0.7, 1.2)), parts.push(...pigeon(-1.6, 5.3, -1.1, -2.6)), parts.push(...pigeon(0.28, 6.5, 0.1, 0.4)));
      for (const rz of [-0.18, 0.18]) parts.push(vcBake(new BoxGeometry(0.06, 3.4, 0.06), vcAt(2.2, 1.7, rz), DARK));
      for (let k = 0; k < 6; k++) parts.push(vcBake(new BoxGeometry(0.05, 0.05, 0.44), vcAt(2.2, 0.5 + k * 0.5, 0), DARK));
      return mergeGeometries(parts, !1);
    };
    // zoom-detail 46 (round-five item 9): every kit carries a roof-access
    // hatch (galv box + darker lid + stub rail), merged in — zero extra draws
    const hatch = (hx, hz, yaw) => {
      const hm = (gx, gy, gz) => new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(hx, 0, hz), new Matrix4().multiplyMatrices(new Matrix4().makeRotationY(yaw), new Matrix4().makeTranslation(gx, gy, gz)));
      return [
        vcBake(new BoxGeometry(1.15, 0.95, 1.35), hm(0, 0.475, 0), GALV),
        vcBake(new BoxGeometry(1.23, 0.1, 1.43), hm(0, 0.98, 0), DARK),
        vcBake(new BoxGeometry(0.05, 0.6, 0.05), hm(0.68, 0.3, 0.5), DARK),
        vcBake(new BoxGeometry(0.05, 0.6, 0.05), hm(0.68, 0.3, -0.5), DARK),
        vcBake(new BoxGeometry(0.05, 0.05, 1.0), hm(0.68, 0.62, 0), DARK),
      ];
    };
    const geos = [v0(), v1(), v2(TAN), v0(), v1(), v2(TEAL)].map((g2, gi) =>
      mergeGeometries([g2, ...hatch(gi % 2 ? -3.1 : 3.0, gi % 3 === 0 ? -2.6 : 2.4, (gi * Math.PI) / 3)], !1),
    );
    const n = mobilePerf ? 3 : 8;
    this.kits = [];
    for (let k = 0; k < n; k++) {
      const m = new Mesh(geos[k % geos.length], opaque);
      ((m.visible = !1), (m.castShadow = !1), (m.receiveShadow = !1), et.add(m));
      this.kits.push({ g: m, variant: k % 3, idx: -1 });
    }
  },
  update(t, dt) {
    if (!this.spots.length || !dt) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.5;
    this.ensure();
    const cx = Xe.position.x,
      cy = Xe.position.y,
      cz = Xe.position.z,
      R2 = this.RADIUS * this.RADIUS,
      cand = [];
    if (this.enabled)
      for (const s of this.spots) {
        const dx = s.x - cx,
          dy = s.top - cy,
          dz = s.z - cz,
          d2 = dx * dx + dy * dy + dz * dz;
        d2 < R2 && cand.push({ s, d2 });
      }
    cand.sort((a, b) => a.d2 - b.d2);
    ((this.promoted = 0), (this.multi = 0), (this.sample.length = 0));
    // zoom-detail 46 (round-five item 9): big roofs earn 2-3 kits — used is a
    // per-roof count now; a placed candidate re-queues until its allowance is
    // spent (pushing while iterating extends the for..of deterministically)
    const used = new Map(),
      free = { 0: [], 1: [], 2: [] };
    for (const k of this.kits) ((k.idx = -1), free[k.variant].push(k));
    for (const c of cand) {
      if (this.promoted >= this.kits.length) break;
      const seen = used.get(c.s.i) ?? 0,
        allow = Math.min(c.s.w, c.s.d) >= 22 ? 3 : Math.min(c.s.w, c.s.d) >= 14 ? 2 : 1;
      if (seen >= allow) continue;
      const r = plateRng((((c.s.i + 1) * 2654435761) ^ (0x700f70 + seen * 977)) >>> 0),
        v = this._variantFor(c.s, r()),
        kit = free[v].pop() || (seen > 0 ? free[(v + 1) % 3].pop() : null);
      if (!kit) continue;
      used.set(c.s.i, seen + 1);
      seen === 1 && this.multi++;
      const qx = seen === 0 ? (r() - 0.5) * 2 : seen % 2 ? 1 : -1,
        qz = seen === 0 ? (r() - 0.5) * 2 : seen < 2 ? 1 : -1,
        ox = qx * Math.max(0, c.s.w - 9) * (0.14 + r() * 0.14),
        oz = qz * Math.max(0, c.s.d - 9) * (0.14 + r() * 0.14);
      (kit.g.position.set(c.s.x + ox, c.s.top, c.s.z + oz), (kit.g.rotation.y = r() < 0.5 ? 0 : Math.PI / 2), (kit.g.visible = !0), (kit.idx = c.s.i), this.promoted++);
      seen + 1 < allow && cand.push(c);
      this.sample.length < 3 && this.sample.push({ i: c.s.i, x: +c.s.x.toFixed(1), z: +c.s.z.toFixed(1), top: +c.s.top.toFixed(1), v });
    }
    for (const k of this.kits) k.idx < 0 && (k.g.visible = !1);
  },
};
// building facade near-tier (zoom-detail item 19): lobby-band panels promoted
// onto the camera-facing wall of the nearest towers at street level — glass
// entrance with lit interior silhouettes, canopy, seeded address plate, wall
// lanterns, mullioned lobby windows. Everything between the fixtures is
// TRANSPARENT so the building's own wall color shows through (any facade
// color works). Street-only: altitude gate keeps the race view untouched.
let facadeAtlasTex = null;
function buildFacadeAtlas() {
  if (facadeAtlasTex) return facadeAtlasTex;
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 512));
  const g = cv.getContext("2d");
  for (let v = 0; v < 2; v++) {
    const y0 = v * 256,
      warm = v === 0;
    g.clearRect(0, y0, 1024, 256);
    // canopy bar over the entrance
    ((g.fillStyle = warm ? "#7a2f2a" : "#24455f"), g.fillRect(392, y0 + 52, 240, 26));
    ((g.fillStyle = "rgba(0,0,0,0.35)"), g.fillRect(392, y0 + 78, 240, 8));
    // double glass door, lit lobby behind
    ((g.fillStyle = "#f3c988"), g.fillRect(432, y0 + 86, 160, 150));
    ((g.fillStyle = "rgba(30,26,20,0.9)"),
      g.fillRect(452, y0 + 150, 26, 86),
      g.fillRect(506, y0 + 128, 8, 62),
      (g.beginPath(), g.arc(560, y0 + 170, 17, 0, 6.29), g.fill()),
      g.fillRect(552, y0 + 186, 16, 50));
    ((g.strokeStyle = "#2c2c30"), (g.lineWidth = 8), g.strokeRect(432, y0 + 86, 160, 150), g.beginPath(), g.moveTo(512, y0 + 86), g.lineTo(512, y0 + 236), g.stroke());
    ((g.fillStyle = "#d8c060"), g.fillRect(498, y0 + 158, 6, 26), g.fillRect(520, y0 + 158, 6, 26));
    // address plate
    ((g.fillStyle = "#20242c"), g.fillRect(452, y0 + 20, 120, 30));
    ((g.fillStyle = "#e8e4d8"), (g.font = "bold 26px monospace"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(String(214 + v * 173), 512, y0 + 36);
    // wall lanterns each side of the door
    for (const lx of [404, 620]) {
      ((g.fillStyle = "#2c2c30"), g.fillRect(lx - 3, y0 + 96, 6, 22));
      const gr = g.createRadialGradient(lx, y0 + 130, 3, lx, y0 + 130, 22);
      (gr.addColorStop(0, "rgba(255,214,140,0.95)"), gr.addColorStop(1, "rgba(255,214,140,0)"));
      ((g.fillStyle = gr), g.beginPath(), g.arc(lx, y0 + 130, 22, 0, 6.29), g.fill());
    }
    // mullioned lobby windows with sills + furniture silhouettes
    for (const wx of [120, 744]) {
      ((g.fillStyle = warm ? "#e8b45c" : "#9fd0e8"), g.fillRect(wx, y0 + 96, 160, 110));
      g.fillStyle = "rgba(24,22,28,0.88)";
      if (warm) (g.fillRect(wx + 18, y0 + 156, 52, 50), g.beginPath(), g.arc(wx + 116, y0 + 150, 15, 0, 6.29), g.fill(), g.fillRect(wx + 110, y0 + 162, 12, 44));
      else (g.fillRect(wx + 96, y0 + 130, 44, 76), g.fillRect(wx + 20, y0 + 180, 56, 26), g.beginPath(), g.arc(wx + 48, y0 + 160, 12, 0, 6.29), g.fill());
      ((g.strokeStyle = "#33363e"), (g.lineWidth = 7), g.strokeRect(wx, y0 + 96, 160, 110));
      (g.beginPath(), g.moveTo(wx + 80, y0 + 96), g.lineTo(wx + 80, y0 + 206), g.moveTo(wx, y0 + 150), g.lineTo(wx + 160, y0 + 150), g.stroke());
      ((g.fillStyle = "#4a4e58"), g.fillRect(wx - 8, y0 + 206, 176, 10));
    }
  }
  facadeAtlasTex = new CanvasTexture(cv);
  facadeAtlasTex.colorSpace = SRGBColorSpace;
  return facadeAtlasTex;
}
const facadeSys = {
  kits: null,
  promoted: 0,
  enabled: !0,
  RADIUS: 30,
  sample: [],
  _timer: 0,
  ensure() {
    if (this.kits) return;
    const mat = new MeshBasicMaterial({ map: buildFacadeAtlas(), transparent: !0, alphaTest: 0.25, toneMapped: !1, polygonOffset: !0, polygonOffsetFactor: -2 });
    this.kits = [];
    const n = mobilePerf ? 2 : 5;
    for (let k = 0; k < n; k++) {
      const geo = new PlaneGeometry(11, 5.5),
        uv = geo.attributes.uv,
        row = k % 2;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), 1 - (row + (1 - uv.getY(i))) / 2);
      const m = new Mesh(geo, mat);
      ((m.visible = !1), (m.castShadow = !1), (m.receiveShadow = !1), (m.raycast = () => {}), et.add(m));
      this.kits.push({ g: m, idx: -1 });
    }
  },
  update(t, dt) {
    if (!rooftopSys.spots.length || !dt) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.5;
    this.ensure();
    const cx = Xe.position.x,
      cz = Xe.position.z,
      R2 = this.RADIUS * this.RADIUS,
      cand = [];
    if (this.enabled && Xe.position.y <= 26)
      for (const s of rooftopSys.spots) {
        if (Math.min(s.w, s.d) < 12) continue;
        const hw = s.w / 2,
          hd = s.d / 2,
          ddx = Math.max(Math.abs(cx - s.x) - hw, 0),
          ddz = Math.max(Math.abs(cz - s.z) - hd, 0),
          d2 = ddx * ddx + ddz * ddz;
        d2 < R2 && cand.push({ s, d2 });
      }
    cand.sort((a, b) => a.d2 - b.d2);
    ((this.promoted = 0), (this.sample.length = 0));
    for (let k = 0; k < this.kits.length; k++) {
      const kit = this.kits[k],
        c = cand[k];
      if (!c) {
        ((kit.g.visible = !1), (kit.idx = -1));
        continue;
      }
      const s = c.s,
        gy = s.top - 1.2 - s.h,
        relX = (cx - s.x) / (s.w / 2),
        relZ = (cz - s.z) / (s.d / 2);
      let px = s.x,
        pz = s.z,
        yaw = 0;
      if (Math.abs(relX) > Math.abs(relZ)) ((px += Math.sign(relX) * (s.w / 2 + 0.08)), (yaw = (Math.sign(relX) * Math.PI) / 2));
      else ((pz += Math.sign(relZ) * (s.d / 2 + 0.08)), (yaw = relZ >= 0 ? 0 : Math.PI));
      (kit.g.position.set(px, gy + 2.9, pz), (kit.g.rotation.y = yaw), (kit.g.visible = !0), (kit.idx = s.i), this.promoted++);
      this.sample.length < 3 && this.sample.push({ i: s.i, x: +px.toFixed(1), y: +(gy + 2.9).toFixed(1), z: +pz.toFixed(1) });
    }
  },
};
// road micro-detail (zoom-detail item 11-lite): manholes, storm drains, worn
// turn arrows and asphalt patches as pooled flat decals promoted around the
// street camera — the full painted-road version stays freeze-blocked, but
// the near-tier reading costs nothing at race altitude.
let roadDecalTex = null;
function buildRoadDecalAtlas() {
  if (roadDecalTex) return roadDecalTex;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 128));
  const g = cv.getContext("2d");
  g.clearRect(0, 0, 512, 128);
  // cell 0: manhole cover
  ((g.fillStyle = "#23262b"), g.beginPath(), g.arc(64, 64, 52, 0, 6.29), g.fill());
  ((g.strokeStyle = "#3a3e46"), (g.lineWidth = 5), g.beginPath(), g.arc(64, 64, 46, 0, 6.29), g.stroke());
  g.lineWidth = 3;
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    (g.beginPath(), g.moveTo(64 + Math.cos(a) * 14, 64 + Math.sin(a) * 14), g.lineTo(64 + Math.cos(a) * 42, 64 + Math.sin(a) * 42), g.stroke());
  }
  (g.beginPath(), g.arc(64, 64, 10, 0, 6.29), g.stroke());
  // cell 1: storm drain grate
  ((g.fillStyle = "#1c1f24"), g.fillRect(140, 34, 104, 60));
  ((g.fillStyle = "#3a3e46"));
  for (let k = 0; k < 5; k++) g.fillRect(148 + k * 19, 40, 9, 48);
  ((g.strokeStyle = "#101216"), (g.lineWidth = 4), g.strokeRect(140, 34, 104, 60));
  // cell 2: worn white turn arrow (pointing up)
  ((g.fillStyle = "rgba(232,232,224,0.82)"));
  (g.beginPath(), g.moveTo(320, 12), g.lineTo(348, 52), g.lineTo(330, 52), g.lineTo(330, 116), g.lineTo(310, 116), g.lineTo(310, 52), g.lineTo(292, 52), g.closePath(), g.fill());
  ((g.globalCompositeOperation = "destination-out"), (g.fillStyle = "rgba(0,0,0,0.55)"));
  for (let k = 0; k < 14; k++) (g.beginPath(), g.arc(292 + ((k * 53) % 60), 16 + ((k * 37) % 100), 3 + (k % 3) * 2, 0, 6.29), g.fill());
  g.globalCompositeOperation = "source-over";
  // cell 3: asphalt repair patch — darker rectangle with tar-seam edges
  ((g.fillStyle = "rgba(14,15,18,0.55)"), g.beginPath(), g.roundRect(396, 22, 104, 84, 10), g.fill());
  ((g.strokeStyle = "rgba(8,9,11,0.85)"), (g.lineWidth = 6), g.beginPath(), g.roundRect(399, 25, 98, 78, 9), g.stroke());
  g.fillStyle = "rgba(60,62,68,0.35)";
  for (let k = 0; k < 6; k++) {
    const bx = 410 + ((k * 47) % 80),
      by = 34 + ((k * 31) % 60);
    (g.beginPath(), g.ellipse(bx, by, 8 + (k % 3) * 4, 6 + (k % 2) * 4, k, 0, 6.29), g.fill());
  }
  roadDecalTex = new CanvasTexture(cv);
  roadDecalTex.colorSpace = SRGBColorSpace;
  return roadDecalTex;
}
const _rdRay = new Raycaster(),
  _rdDown = new Vector3(0, -1, 0),
  _rdFrom = new Vector3();
const roadDecalSys = {
  spots: [],
  mesh: null,
  placed: 0,
  placedDone: !1,
  enabled: !0,
  sample: [],
  _SCALES: [
    [1.5, 1.5],
    [1.8, 1.1],
    [1.5, 3.4],
    [2.8, 2.3],
  ],
  // full-fat (round four, freeze lifted): every seeded decal is PERMANENT —
  // one InstancedMesh, per-instance atlas slot (plate pattern; the
  // customProgramCacheKey is MANDATORY or the cache serves unpatched
  // shaders). Arrows and manholes now read at mid distance, not just ≤40m.
  _surfaceY(sp) {
    if (sp.ySurf !== undefined) return sp.ySurf;
    (_rdFrom.set(sp.x, sp.y + 40, sp.z), _rdRay.set(_rdFrom, _rdDown));
    ((_rdRay.far = 80), (_rdRay.camera = Xe));
    const hits = _rdRay.intersectObjects(et.children, !0);
    let best = null;
    for (const h of hits) {
      if (h.object.isSprite) continue;
      if (h.point.y > sp.y + 1.0 || h.point.y < sp.y - 0.5) continue;
      (best === null || h.point.y > best) && (best = h.point.y);
    }
    return (sp.ySurf = best === null ? sp.y : +(best + 0.025).toFixed(3));
  },
  ensure() {
    if (this.mesh) return;
    const geo = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    geo.setAttribute("aDecalSlot", new InstancedBufferAttribute(new Float32Array(48), 1));
    const mat = new MeshBasicMaterial({ map: buildRoadDecalAtlas(), transparent: !0, alphaTest: 0.15, polygonOffset: !0, polygonOffsetFactor: -3 });
    mat.customProgramCacheKey = () => "road-decal-atlas";
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aDecalSlot;\nvarying vec2 vDecalUv;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvDecalUv = vec2((aDecalSlot + uv.x) * 0.25, uv.y);");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec2 vDecalUv;")
        .replace("#include <map_fragment>", "diffuseColor *= texture2D( map, vDecalUv );");
    };
    this.mesh = new InstancedMesh(geo, mat, 48);
    ((this.mesh.frustumCulled = !1), (this.mesh.castShadow = !1), (this.mesh.receiveShadow = !1), (this.mesh.raycast = () => {}), (this.mesh.renderOrder = 1), (this.mesh.count = 0));
    et.add(this.mesh);
  },
  place() {
    const dummy = new Object3D();
    let n = 0;
    ((this.sample.length = 0));
    for (const sp of this.spots) {
      if (n >= 48) break;
      const sc = this._SCALES[sp.v];
      (dummy.position.set(sp.x, this._surfaceY(sp), sp.z), (dummy.rotation.y = sp.yaw), dummy.scale.set(sc[0], 1, sc[1]), dummy.updateMatrix());
      this.mesh.setMatrixAt(n, dummy.matrix);
      this.mesh.geometry.attributes.aDecalSlot.setX(n, sp.v);
      this.sample.length < 3 && this.sample.push({ i: sp.i, x: sp.x, y: sp.ySurf, z: sp.z, v: sp.v });
      n++;
    }
    ((this.mesh.count = n), (this.mesh.instanceMatrix.needsUpdate = !0), (this.mesh.geometry.attributes.aDecalSlot.needsUpdate = !0), (this.placed = n), (this.placedDone = !0));
  },
  update(t, dt) {
    if (!this.spots.length || !dt) return;
    if (this.mesh) this.mesh.visible = this.enabled;
    if (this.placedDone) return;
    (this.ensure(), this.place());
  },
};
// (4b-lite driver silhouettes retired in round four: every cabin now has
// a real recessed driver baked in — see full-fat 4b.)
// race roadside life (zoom-detail item 18): marshals with checkered flags,
// pit boards, camera crews on small platforms bolted to the deck edge — the
// stuff you zoom past at speed. Pooled kits promoted to the nearest of ~14
// stations seeded along the course; ~1-2 draw calls per kit.
let roadsideBoardAtlas = null;
const ROADSIDE_BOARDS = ["P3  +1.2", "LAP 2  PUSH"];
function buildRoadsideBoardAtlas() {
  if (roadsideBoardAtlas) return roadsideBoardAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 256));
  const g = cv.getContext("2d");
  for (let r = 0; r < 2; r++) {
    const y = r * 128;
    ((g.fillStyle = "#101726"), g.fillRect(0, y, 512, 128));
    ((g.strokeStyle = "#3a4a68"), (g.lineWidth = 6), g.strokeRect(3, y + 3, 506, 122));
    ((g.fillStyle = "#f2f4f8"), (g.font = "900 72px monospace"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(ROADSIDE_BOARDS[r], 256, y + 66, 480);
  }
  roadsideBoardAtlas = new CanvasTexture(cv);
  roadsideBoardAtlas.colorSpace = SRGBColorSpace;
  return roadsideBoardAtlas;
}
const roadsideSys = {
  spots: [],
  kits: null,
  promoted: 0,
  enabled: !0,
  RADIUS: 220,
  sample: [],
  _timer: 0,
  buildStations() {
    this.spots.length = 0;
    const n = 14,
      rng = plateRng(0x70ad51);
    for (let k = 0; k < n; k++) {
      const s = ((k + 0.3 + rng() * 0.4) * ce.length) / n,
        sideSign = rng() < 0.5 ? -1 : 1;
      if (s % ce.length < 40 || railSkipZone(s % ce.length, sideSign)) continue;
      const c = St(s % ce.length),
        p = c.p
          .clone()
          .addScaledVector(c.side, sideSign * (ce.width * 0.5 + 2.0))
          .addScaledVector(on, 0.58);
      this.spots.push({ i: this.spots.length, x: p.x, y: p.y, z: p.z, yaw: Math.atan2(-c.side.x * sideSign, -c.side.z * sideSign), v: this.spots.length % 3 });
    }
  },
  LIFT: 1.3, // platform deck rides this high over the station point so the
  // figures stand clear of the ribbon's raised rim wall (flush platforms
  // proved invisible from the deck — only a head-sliver peeked over)
  _figure(parts, x, z, vest) {
    const L = this.LIFT;
    (parts.push(vcBake(new BoxGeometry(0.34, 0.5, 0.22), vcAt(x, L + 0.25, z), 2500134)),
      parts.push(vcBake(new CylinderGeometry(0.22, 0.26, 0.72, 8), vcAt(x, L + 0.96, z), vest)),
      parts.push(vcBake(new SphereGeometry(0.17, 8, 6), vcAt(x, L + 1.5, z), 15250572)),
      parts.push(vcBake(new CylinderGeometry(0.18, 0.18, 0.08, 8), vcAt(x, L + 1.63, z), 2500134)));
  },
  _platform(parts) {
    const L = this.LIFT;
    parts.push(vcBake(new BoxGeometry(3.0, 0.14, 2.4), vcAt(0, L - 0.07, 0), 4022096));
    for (const px of [-1.35, 1.35]) parts.push(vcBake(new BoxGeometry(0.05, 0.62, 0.05), vcAt(px, L + 0.31, -1.14), 2500134));
    parts.push(vcBake(new BoxGeometry(2.8, 0.05, 0.05), vcAt(0, L + 0.64, -1.14), 2500134));
    for (const px of [-0.9, 0.9]) {
      const m = new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(px, L * 0.42, 0.9), new Matrix4().makeRotationX(0.55));
      parts.push(vcBake(new BoxGeometry(0.1, 0.1, 2.2), m, 4022096));
    }
  },
  ensure() {
    if (this.kits) return;
    const { opaque } = vcMats();
    const marshal = () => {
      const parts = [];
      (this._platform(parts), this._figure(parts, 0, 0.25, 15231516));
      const stick = new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(0.45, this.LIFT + 1.42, 0.3), new Matrix4().makeRotationZ(-0.65));
      parts.push(vcBake(new CylinderGeometry(0.024, 0.024, 0.95, 6), stick, 2500134));
      for (let row = 0; row < 2; row++)
        for (let col = 0; col < 4; col++)
          parts.push(vcBake(new PlaneGeometry(0.2, 0.2), vcAt(0.78 + col * 0.2, this.LIFT + 1.9 - row * 0.2, 0.3), (row + col) % 2 ? 2500134 : 15921906));
      return new Mesh(mergeGeometries(parts, !1), opaque);
    };
    const pitBoard = () => {
      const parts = [];
      (this._platform(parts), this._figure(parts, 1.1, 0.2, 15231516));
      for (const px of [-0.75, 0.75]) parts.push(vcBake(new BoxGeometry(0.07, 1.3, 0.07), vcAt(px - 0.3, this.LIFT + 0.65, 0.25), 2500134));
      parts.push(vcBake(new BoxGeometry(1.8, 1.05, 0.07), vcAt(-0.3, this.LIFT + 1.5, 0.25), 1974824));
      return new Mesh(mergeGeometries(parts, !1), opaque);
    };
    const camCrew = () => {
      const parts = [];
      (this._platform(parts), this._figure(parts, -0.62, 0.05, 3104680));
      for (let k = 0; k < 3; k++) {
        const a = (k * Math.PI * 2) / 3,
          m = new Matrix4().multiplyMatrices(
            new Matrix4().makeTranslation(0.15 + Math.sin(a) * 0.28, this.LIFT + 0.55, 0.2 + Math.cos(a) * 0.28),
            new Matrix4().multiplyMatrices(new Matrix4().makeRotationY(a), new Matrix4().makeRotationX(0.3)),
          );
        parts.push(vcBake(new CylinderGeometry(0.028, 0.034, 1.15, 6), m, 2500134));
      }
      parts.push(vcBake(new BoxGeometry(0.5, 0.3, 0.34), vcAt(0.15, this.LIFT + 1.28, 0.2), 1974824));
      const lens = new Matrix4().multiplyMatrices(new Matrix4().makeTranslation(0.15, this.LIFT + 1.28, 0.45), new Matrix4().makeRotationX(Math.PI / 2));
      parts.push(vcBake(new CylinderGeometry(0.09, 0.1, 0.26, 10), lens, 2500134));
      return new Mesh(mergeGeometries(parts, !1), opaque);
    };
    const boardMat = new MeshBasicMaterial({ map: buildRoadsideBoardAtlas(), toneMapped: !1 });
    this.kits = [];
    const n = mobilePerf ? 3 : 6;
    let boardIdx = 0;
    for (let k = 0; k < n; k++) {
      const variant = k % 3,
        g = new Group(),
        base = variant === 0 ? marshal() : variant === 1 ? pitBoard() : camCrew();
      g.add(base);
      if (variant === 1) {
        const row = boardIdx++ % 2,
          tg = new PlaneGeometry(1.68, 0.95),
          uv = tg.attributes.uv;
        for (let vi = 0; vi < uv.count; vi++) uv.setXY(vi, uv.getX(vi), 1 - (row + (1 - uv.getY(vi))) / 2);
        const tq = new Mesh(tg, boardMat);
        (tq.position.set(-0.3, this.LIFT + 1.5, 0.3), g.add(tq));
      }
      ((g.visible = !1), g.traverse((o) => ((o.castShadow = !1), (o.receiveShadow = !1))), et.add(g));
      this.kits.push({ g, variant, idx: -1 });
    }
  },
  update(t, dt) {
    if (!this.spots.length || !dt) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.5;
    this.ensure();
    const cx = Xe.position.x,
      cy = Xe.position.y,
      cz = Xe.position.z,
      R2 = this.RADIUS * this.RADIUS,
      cand = [];
    if (this.enabled)
      for (const s of this.spots) {
        const dx = s.x - cx,
          dy = s.y - cy,
          dz = s.z - cz,
          d2 = dx * dx + dy * dy + dz * dz;
        d2 < R2 && cand.push({ s, d2 });
      }
    cand.sort((a, b) => a.d2 - b.d2);
    ((this.promoted = 0), (this.sample.length = 0));
    const free = { 0: [], 1: [], 2: [] };
    for (const k of this.kits) ((k.idx = -1), free[k.variant].push(k));
    for (const c of cand) {
      if (this.promoted >= this.kits.length) break;
      const s = c.s,
        kit = free[s.v].pop() || free[(s.v + 1) % 3].pop() || free[(s.v + 2) % 3].pop();
      if (!kit) break;
      (kit.g.position.set(s.x, s.y, s.z), (kit.g.rotation.y = s.yaw), (kit.g.visible = !0), (kit.idx = s.i), this.promoted++);
      this.sample.length < 3 && this.sample.push({ i: s.i, x: +s.x.toFixed(1), y: +s.y.toFixed(1), z: +s.z.toFixed(1), v: kit.variant });
    }
    for (const k of this.kits) k.idx < 0 && (k.g.visible = !1);
  },
};
const PED_KIT_RADIUS = 40;
// Fictional, family-friendly two-bubble chats shown on texting pedestrians'
// phone screens (one per kit, drawn into a single shared atlas).
const PED_CHATS = [
  [["running late again", "me"], ["the ribbon jam??", "them"], ["every. time.", "me"]],
  [["pizza tonight?", "them"], ["obviously", "me"], ["extra olives", "them"]],
  [["did u see that stunt", "me"], ["the triple flip?!", "them"], ["unreal", "me"]],
  [["buy milk pls", "them"], ["on it", "me"], ["and cookies", "them"]],
  [["gate 8 is glowing", "me"], ["on my way!!", "them"]],
  [["new high score", "me"], ["screenshot or it", "them"], ["didn't happen", "them"]],
  [["taxi 27 honked at me", "me"], ["classic 27", "them"]],
  [["lost my parking spot", "me"], ["someone STOLE it??", "them"], ["drove right off", "me"]],
];
let pedChatAtlas = null;
function buildPedChatAtlas() {
  if (pedChatAtlas) return pedChatAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 512));
  const g = cv.getContext("2d");
  for (let s = 0; s < 8; s++) {
    const x = (s % 4) * 128,
      y = ((s / 4) | 0) * 256,
      chat = PED_CHATS[s % PED_CHATS.length];
    // screen background + status bar
    ((g.fillStyle = "#101823"), g.fillRect(x, y, 128, 256));
    ((g.fillStyle = "#1c2a3a"), g.fillRect(x, y, 128, 26));
    ((g.fillStyle = "#9fd6ff"), (g.font = "bold 14px sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText("chat", x + 64, y + 14);
    ((g.font = "bold 16px sans-serif"), (g.textAlign = "left"));
    let by = y + 42;
    for (const [text, who] of chat) {
      const mine = who === "me",
        w = Math.min(116, g.measureText(text).width + 14),
        bx = mine ? x + 124 - w : x + 4;
      g.fillStyle = mine ? "#2f7fd4" : "#2a3546";
      g.beginPath();
      g.roundRect(bx, by, w, 34, 10);
      g.fill();
      ((g.fillStyle = "#eaf4ff"), g.fillText(text, bx + 7, by + 18));
      by += 42;
    }
  }
  const texture = new CanvasTexture(cv);
  ((texture.colorSpace = SRGBColorSpace), (texture.anisotropy = 4));
  pedChatAtlas = { texture, mat: new MeshBasicMaterial({ map: texture }) };
  return pedChatAtlas;
}
const pedKitSys = {
  kits: null,
  pool: 0,
  _timer: 0,
  ensure() {
    if (this.kits) return;
    this.pool = mobilePerf ? 4 : 8;
    const { opaque } = vcMats(),
      shoeTones = [1976625, 3153952, 5985575, 2503224, 4400680, 1710618, 5124895, 3355970],
      mouthTones = [9067082, 7952701, 10707786, 8341813, 9067082, 7952701, 10707786, 8341813],
      browTones = [3087378, 1975326, 4022546, 3087378, 1975326, 4022546, 3087378, 1975326];
    this.kits = [];
    for (let k = 0; k < this.pool; k++) {
      const faceParts = [],
        eyeGeo = new SphereGeometry(0.038, 6, 5),
        browGeo = new BoxGeometry(0.078, 0.02, 0.02),
        noseGeo = new SphereGeometry(0.03, 6, 5),
        mouthGeo = new BoxGeometry(0.09, 0.022, 0.02);
      for (const ex of [-0.085, 0.085]) {
        faceParts.push(vcBake(eyeGeo, vcAt(ex, 2.06, -0.198), 1842476));
        faceParts.push(vcBake(browGeo, vcAt(ex, 2.118, -0.207), browTones[k % browTones.length]));
      }
      faceParts.push(vcBake(noseGeo, vcAt(0, 2.0, -0.229), 11893070));
      faceParts.push(vcBake(mouthGeo, vcAt(0, 1.935, -0.216), mouthTones[k % mouthTones.length]));
      const face = new Mesh(mergeGeometries(faceParts, !1), opaque),
        handGeo = vcBake(new SphereGeometry(0.056, 6, 5), null, 12947299),
        shoeGeo = vcBake(new BoxGeometry(0.13, 0.07, 0.24), null, shoeTones[k % shoeTones.length]),
        handL = new Mesh(handGeo, opaque),
        handR = new Mesh(handGeo, opaque),
        shoeL = new Mesh(shoeGeo, opaque),
        shoeR = new Mesh(shoeGeo, opaque);
      (handL.position.set(0, -0.38, 0), handR.position.set(0, -0.38, 0));
      (shoeL.position.set(0, -0.42, -0.045), shoeR.position.set(0, -0.42, -0.045));
      // phone: dark body + lit chat screen (shared atlas material, per-kit UVs).
      // Group-parented at chest height facing up-back toward the head; the right
      // arm is pose-overridden every tick while texting so the hand "holds" it.
      const chatAtlas = buildPedChatAtlas(),
        phone = new Group(),
        phoneBody = new Mesh(vcBake(new BoxGeometry(0.075, 0.15, 0.014), null, 1315356), opaque),
        screenGeo = new PlaneGeometry(0.062, 0.128),
        su = (k % 4) * 0.25,
        sv = 1 - (((k / 4) | 0) + 1) * 0.5,
        uvArr = screenGeo.attributes.uv;
      for (let vi = 0; vi < uvArr.count; vi++) uvArr.setXY(vi, su + uvArr.getX(vi) * 0.25, sv + uvArr.getY(vi) * 0.5);
      const screen = new Mesh(screenGeo, chatAtlas.mat);
      ((screen.position.z = 0.0095), phone.add(phoneBody), phone.add(screen));
      // in the raised right hand (pose puts it at ~(0.38, 1.48, -0.33)), screen
      // aimed at the head so it reads over the shoulder
      phone.position.set(0.34, 1.47, -0.36);
      phone.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), new Vector3(-0.34, 0.55, 0.36).normalize());
      // item 3b props: a paper shopping bag that hangs from the left arm and a
      // coffee cup held at the hand — one per kit, colored by kit index
      const bagTone = [10120994, 13391656, 4886754, 11893070, 5987163, 12744766, 8355711, 14192963][k % 8],
        bag = new Mesh(
          mergeGeometries(
            [
              vcBake(new BoxGeometry(0.26, 0.32, 0.15), vcAt(0, -0.62, 0), bagTone),
              vcBake(new BoxGeometry(0.02, 0.16, 0.02), vcAt(-0.09, -0.4, 0), 3355443),
              vcBake(new BoxGeometry(0.02, 0.16, 0.02), vcAt(0.09, -0.4, 0), 3355443),
            ],
            !1,
          ),
          opaque,
        ),
        sleeveTone = [7952694, 3116150, 10702874, 5122622][k % 4],
        cup = new Mesh(
          mergeGeometries(
            [
              vcBake(new CylinderGeometry(0.056, 0.048, 0.15, 8), vcAt(0, -0.4, 0), 16447738),
              vcBake(new CylinderGeometry(0.06, 0.06, 0.06, 8), vcAt(0, -0.405, 0), sleeveTone),
              vcBake(new CylinderGeometry(0.058, 0.058, 0.016, 8), vcAt(0, -0.318, 0), 6902849),
            ],
            !1,
          ),
          opaque,
        );
      // item: leashed dogs — a small trotting companion beside every 4th
      // promoted ped, one merged mesh + a static taut leash hip→collar
      const dogTone = [7029795, 2499102, 12884588, 12104876][k % 4],
        dog = new Mesh(
          mergeGeometries(
            [
              vcBake(new BoxGeometry(0.16, 0.2, 0.36), vcAt(0, 0.3, 0), dogTone),
              vcBake(new BoxGeometry(0.13, 0.13, 0.14), vcAt(0, 0.44, -0.24), dogTone),
              vcBake(new BoxGeometry(0.08, 0.06, 0.08), vcAt(0, 0.4, -0.33), 2499102),
              vcBake(new BoxGeometry(0.04, 0.07, 0.03), vcAt(0.05, 0.54, -0.22), dogTone),
              vcBake(new BoxGeometry(0.04, 0.07, 0.03), vcAt(-0.05, 0.54, -0.22), dogTone),
              vcBake(new BoxGeometry(0.05, 0.2, 0.05), vcAt(0.05, 0.1, -0.13), dogTone),
              vcBake(new BoxGeometry(0.05, 0.2, 0.05), vcAt(-0.05, 0.1, -0.13), dogTone),
              vcBake(new BoxGeometry(0.05, 0.2, 0.05), vcAt(0.05, 0.1, 0.13), dogTone),
              vcBake(new BoxGeometry(0.05, 0.2, 0.05), vcAt(-0.05, 0.1, 0.13), dogTone),
              vcBake(new BoxGeometry(0.04, 0.16, 0.04), vcAt(0, 0.44, 0.2, 0.5), dogTone),
            ],
            !1,
          ),
          opaque,
        );
      dog.position.set(0.52, 0, -0.1);
      const leashDir = new Vector3(0.52 - 0.24, 0.5 - 0.88, -0.28 - 0.02),
        leashLen = leashDir.length(),
        leash = new Mesh(vcBake(new BoxGeometry(0.016, leashLen, 0.016), null, 2105376), opaque);
      (leash.position.set((0.24 + 0.52) / 2, (0.88 + 0.5) / 2, (0.02 - 0.28) / 2), leash.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), leashDir.normalize()));
      const kit = { face, handL, handR, shoeL, shoeR, phone, bag, cup, dog, leash, prop: null, texting: !1, ped: null };
      for (const part of [face, handL, handR, shoeL, shoeR, phone, phoneBody, screen, bag, cup, dog, leash])
        ((part.userData.kitPart = !0), (part.castShadow = !1), (part.receiveShadow = !0), (part.raycast = () => {}));
      this.kits.push(kit);
    }
  },
  attach(kit, actor, prop) {
    const g = actor.mesh,
      limbs = g.userData.limbs || [];
    (g.add(kit.face),
      limbs[0]?.mesh.add(kit.shoeL),
      limbs[1]?.mesh.add(kit.shoeR),
      limbs[2]?.mesh.add(kit.handL),
      limbs[3]?.mesh.add(kit.handR),
      (kit.prop = prop),
      (kit.texting = prop === "text"),
      kit.texting && g.add(kit.phone),
      // head-tilt illusion: pitch the face overlay about the HEAD CENTRE so
      // the features slide down the sphere toward the phone (the merged head
      // itself cannot rotate)
      (() => {
        if (kit.texting) {
          const th = 0.35,
            c = Math.cos(th),
            s2 = Math.sin(th),
            hy = 2.04,
            hz = -0.03;
          ((kit.face.rotation.x = th), kit.face.position.set(0, hy - (hy * c - hz * s2), hz - (hy * s2 + hz * c)));
        } else ((kit.face.rotation.x = 0), kit.face.position.set(0, 0, 0));
      })(),
      prop === "bag" && limbs[2]?.mesh.add(kit.bag),
      prop === "cup" && limbs[2]?.mesh.add(kit.cup),
      prop === "dog" && (g.add(kit.dog), g.add(kit.leash)),
      (kit.ped = actor));
  },
  detach(kit) {
    for (const part of [kit.face, kit.handL, kit.handR, kit.shoeL, kit.shoeR, kit.phone, kit.bag, kit.cup, kit.dog, kit.leash]) part.removeFromParent();
    ((kit.ped = null), (kit.texting = !1), (kit.prop = null));
  },
  reset() {
    if (this.kits) for (const k of this.kits) k.ped && this.detach(k);
  },
  promotedCount() {
    return this.kits ? this.kits.reduce((n, k) => n + (k.ped ? 1 : 0), 0) : 0;
  },
  update(dt) {
    if (!Rr.length) {
      this.reset();
      return;
    }
    // pose pass runs EVERY tick: ze() rewrites limb swing each frame, so the
    // texting arm must be re-raised after it (same Bn callback, later in order)
    this._t = (this._t || 0) + dt;
    if (this.kits)
      for (const k of this.kits)
        if (k.ped && k.texting) {
          const arm = k.ped.mesh.userData.limbs?.[3]?.mesh;
          arm && ((arm.rotation.x = -2.05), (arm.position.y = 1.33));
        } else if (k.ped && k.prop === "dog") {
          // trot: quick bob + a touch of pitch, keyed off the shared clock
          const ph = this._t * 8 + k.dog.position.x * 7;
          ((k.dog.position.y = Math.abs(Math.sin(ph)) * 0.035), (k.dog.rotation.x = Math.sin(ph * 2) * 0.05));
        }
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.35;
    this.ensure();
    const cx = Xe.position.x,
      cz = Xe.position.z,
      R2 = PED_KIT_RADIUS * PED_KIT_RADIUS,
      cand = [];
    for (let idx = 0; idx < Rr.length; idx++) {
      const a = Rr[idx];
      if (!a.active || !a.mesh.visible) continue;
      const dx = a.x - cx,
        dz = a.z - cz,
        d2 = dx * dx + dz * dz;
      d2 < R2 && cand.push({ a, idx, d2 });
    }
    cand.sort((p, q) => p.d2 - q.d2);
    const want = cand.slice(0, this.pool),
      wantSet = new Set(want.map((w) => w.a));
    for (const k of this.kits)
      k.ped && (!wantSet.has(k.ped) || !k.ped.active || !k.ped.mesh.visible) && this.detach(k);
    for (const w of want) {
      const k = this.kits[w.idx % this.pool];
      if (k.ped === w.a) continue;
      if (k.ped && wantSet.has(k.ped)) continue; // kit busy with an equally-near ped
      (k.ped && this.detach(k), this.attach(k, w.a, ["text", "bag", "cup", "dog"][w.idx % 4]));
    }
  },
};
// ─── Taxi identity (zoom-detail item 05): dark cutout "TAXI ##" text on both
// faces of the glowing roof-sign box plus door decals — a pooled set of 8
// pre-built 4-quad meshes (one draw per taxi) over a single atlas texture.
// Medallion numbers are per-slot deterministic; pool meshes recycle across
// world rebuilds so no geometry/texture creep.
let taxiSignAtlas = null;
function buildTaxiSignAtlas() {
  if (taxiSignAtlas) return taxiSignAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 512));
  const g = cv.getContext("2d");
  const nums = [];
  for (let s = 0; s < 8; s++) {
    const x = (s % 4) * 256,
      y = ((s / 4) | 0) * 256,
      num = ((s * 97 + 13) % 90) + 10;
    nums.push(num);
    ((g.fillStyle = "#14203a"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    ((g.font = "bold 88px sans-serif"), g.fillText(`TAXI ${num}`, x + 128, y + 96));
    ((g.font = "bold 34px sans-serif"), g.fillText("STEEL CITY CAB", x + 128, y + 178));
  }
  const texture = new CanvasTexture(cv);
  ((texture.colorSpace = SRGBColorSpace), (texture.anisotropy = 4));
  taxiSignAtlas = {
    texture,
    nums,
    mat: new MeshBasicMaterial({ map: texture, transparent: !0, alphaTest: 0.25 }),
  };
  return taxiSignAtlas;
}
const taxiSignSys = {
  pool: null,
  used: 0,
  ensure() {
    if (this.pool) return;
    const atlas = buildTaxiSignAtlas();
    this.pool = [];
    for (let s = 0; s < 8; s++) {
      const su = (s % 4) * 0.25,
        sv = 1 - (((s / 4) | 0) + 1) * 0.5,
        quads = [];
      // roof sign faces (box at (0, 2.2, -0.35), size 1 x 0.24 x 0.46)
      for (const [z, ry] of [[-0.585, Math.PI], [-0.115, 0]]) {
        const q = new PlaneGeometry(0.94, 0.2);
        const uv = q.attributes.uv;
        // top half of the slot: the big "TAXI ##" line
        for (let vi = 0; vi < uv.count; vi++) uv.setXY(vi, su + uv.getX(vi) * 0.25, sv + 0.25 + uv.getY(vi) * 0.25);
        (ry && q.rotateY(ry), q.translate(0, 2.2, z), quads.push(q));
      }
      // door decals (body sides at x ±1.125)
      for (const [x, ry] of [[1.13, Math.PI / 2], [-1.13, -Math.PI / 2]]) {
        const q = new PlaneGeometry(0.62, 0.3);
        const uv = q.attributes.uv;
        for (let vi = 0; vi < uv.count; vi++) uv.setXY(vi, su + uv.getX(vi) * 0.25, sv + uv.getY(vi) * 0.5);
        (q.rotateY(ry), q.translate(x, 1.05, -0.2), quads.push(q));
      }
      const mesh = new Mesh(mergeGeometries(quads, !1), atlas.mat);
      ((mesh.castShadow = !1), (mesh.receiveShadow = !1), (mesh.userData.taxiSign = s));
      this.pool.push(mesh);
    }
  },
  reset() {
    if (this.pool) for (const m of this.pool) m.removeFromParent();
    this.used = 0;
  },
  attach(carMesh) {
    this.ensure();
    if (this.used >= this.pool.length) return;
    carMesh.add(this.pool[this.used++]);
  },
  count() {
    return this.pool ? this.pool.reduce((n, m) => n + (m.parent ? 1 : 0), 0) : 0;
  },
};
// ─── Storefront near-tier (zoom-detail item 06): commercial storefronts get a
// promotion pool of 4 "dress kits" — a glowing interior window (4 canvas
// styles: cafe / garage / shelves / arcade), a door with pane + brass handle,
// and an OPEN/CLOSED/BACK IN 5 sign. Buildings are static-merged, so kits are
// positioned in WORLD space from spots recorded at build time; promotion is
// camera-distance keyed like the pedestrian kits. Far tier: the flat facade
// band, exactly as today.
let storefrontAtlas = null;
function buildStorefrontAtlas() {
  if (storefrontAtlas) return storefrontAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 512));
  const g = cv.getContext("2d");
  const drawInterior = (x, y, style) => {
    const W = 512,
      H = 224,
      warm = ["#e8a45c", "#7fb8d8", "#e8c087", "#c77bd8"][style],
      glow = ["#ffdba4", "#c8ecff", "#ffe9c4", "#ffb3ec"][style];
    const grad = g.createLinearGradient(x, y, x, y + H);
    (grad.addColorStop(0, glow), grad.addColorStop(0.55, warm), grad.addColorStop(1, ["#8a5a2c", "#3f6c86", "#8a6a3c", "#6c3f86"][style]));
    ((g.fillStyle = grad), g.fillRect(x, y, W, H));
    // window frame so the quad reads as glazing, not a floating band
    ((g.strokeStyle = "#221a14"), (g.lineWidth = 10), g.strokeRect(x + 5, y + 5, W - 10, H - 10));
    ((g.lineWidth = 4), g.beginPath(), g.moveTo(x + W / 2, y), g.lineTo(x + W / 2, y + H), g.moveTo(x, y + H / 2), g.lineTo(x + W, y + H / 2), g.stroke());
    g.fillStyle = "rgba(255, 230, 180, 0.85)";
    for (let l = x + 60; l < x + W - 40; l += 110) {
      g.fillRect(l, y + 8, 3, 26);
      (g.beginPath(), g.moveTo(l - 12, y + 34), g.lineTo(l + 15, y + 34), g.lineTo(l + 1.5, y + 48), g.fill());
    }
    g.fillStyle = "rgba(10, 8, 12, 0.88)";
    if (style === 0)
      for (let t2 = x + 70; t2 < x + W - 60; t2 += 150)
        (g.fillRect(t2, y + 150, 74, 8), g.fillRect(t2 + 33, y + 158, 8, 52), g.fillRect(t2 - 18, y + 168, 26, 42), g.fillRect(t2 + 66, y + 168, 26, 42));
    else if (style === 1)
      for (let t2 = x + 50; t2 < x + W - 60; t2 += 90)
        (g.fillRect(t2, y + 60, 12, 60), g.fillRect(t2 - 14, y + 76, 40, 10), g.beginPath(), g.arc(t2 + 6, y + 180, 26, 0, 7), g.fill());
    else if (style === 2) {
      for (const sy of [80, 130, 180]) g.fillRect(x + 40, y + sy, W - 80, 8);
      g.fillStyle = "rgba(30, 22, 16, 0.9)";
      for (const sy of [56, 106, 156])
        for (let bx = x + 56; bx < x + W - 70; bx += 44) g.fillRect(bx, y + sy, 26, 22);
    } else
      for (let t2 = x + 60; t2 < x + W - 80; t2 += 120) {
        g.fillRect(t2, y + 90, 62, 120);
        ((g.fillStyle = ["#4ff3ff", "#ff4fb7", "#68ff8f"][((t2 / 120) | 0) % 3]), g.fillRect(t2 + 10, y + 104, 42, 34));
        g.fillStyle = "rgba(10, 8, 12, 0.88)";
      }
  };
  (drawInterior(0, 0, 0), drawInterior(512, 0, 1), drawInterior(0, 224, 2), drawInterior(512, 224, 3));
  // bottom strip: door-hang signs
  const sign = (x, w, text, bg, fg) => {
    ((g.fillStyle = bg), g.fillRect(x + 4, 452, w - 8, 56));
    ((g.strokeStyle = fg), (g.lineWidth = 3), g.strokeRect(x + 7, 455, w - 14, 50));
    ((g.fillStyle = fg), (g.font = "900 26px Arial, sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(text, x + w / 2, 481, w - 24);
  };
  (sign(0, 150, "OPEN", "#1d3a24", "#7dffa5"), sign(150, 150, "CLOSED", "#3a1d1d", "#ff8d7d"), sign(300, 190, "BACK IN 5", "#33301d", "#ffe27d"));
  const texture = new CanvasTexture(cv);
  ((texture.colorSpace = SRGBColorSpace), (texture.anisotropy = 4));
  storefrontAtlas = { texture, mat: new MeshBasicMaterial({ map: texture }) };
  return storefrontAtlas;
}
const storefrontSys = {
  spots: [],
  kits: null,
  pool: 0,
  _timer: 0,
  resetSpots() {
    this.spots.length = 0;
    if (this.kits) for (const k of this.kits) ((k.group.visible = !1), (k.spot = null));
  },
  addSpot(x, y, z, yaw, w) {
    this.spots.push({ x, y, z, yaw, w });
  },
  ensure() {
    if (this.kits) return;
    this.pool = mobilePerf ? 2 : 4;
    const atlas = buildStorefrontAtlas();
    this.kits = [];
    for (let k = 0; k < this.pool; k++) {
      const group = new Group(),
        su = (k % 2) * 0.5,
        sv = k < 2 ? 0.5625 : 0.125, // interior slots: rows y=0..224 → v 0.5625..1, y=224..448 → 0.125..0.5625
        win = new PlaneGeometry(5.6, 1.9),
        uv = win.attributes.uv;
      for (let vi = 0; vi < uv.count; vi++) uv.setXY(vi, su + uv.getX(vi) * 0.5, sv + uv.getY(vi) * 0.4375);
      const winMesh = new Mesh(win, atlas.mat);
      (winMesh.position.set(-0.7, 1.55, 0.06), group.add(winMesh));
      // cream trim backing makes the doorway read against ANY facade paint
      const trim = new Mesh(new BoxGeometry(1.3, 2.3, 0.03), new MeshStandardMaterial({ color: 15326941, roughness: 0.7, metalness: 0.05 }));
      (trim.position.set(2.75, 1.15, 0.03), group.add(trim));
      const door = new Mesh(new BoxGeometry(1.02, 2.14, 0.05), new MeshStandardMaterial({ color: 5910302, roughness: 0.55, metalness: 0.15 }));
      (door.position.set(2.75, 1.07, 0.05), group.add(door));
      const pane = new Mesh(new PlaneGeometry(0.6, 0.8), new MeshStandardMaterial({ color: 10217727, roughness: 0.1, metalness: 0.1, emissive: 2963258, emissiveIntensity: 0.5 }));
      (pane.position.set(2.75, 1.5, 0.081), group.add(pane));
      const handle = new Mesh(new BoxGeometry(0.035, 0.17, 0.045), new MeshStandardMaterial({ color: 13092431, roughness: 0.3, metalness: 0.85 }));
      (handle.position.set(3.14, 1.02, 0.09), group.add(handle));
      const signW = [150, 150, 190][k % 3] / 150,
        signGeo = new PlaneGeometry(0.34 * signW, 0.14),
        suv = signGeo.attributes.uv,
        sx0 = [0, 150 / 1024, 300 / 1024][k % 3],
        sw = [150 / 1024, 150 / 1024, 190 / 1024][k % 3];
      for (let vi = 0; vi < suv.count; vi++) suv.setXY(vi, sx0 + suv.getX(vi) * sw, (512 - 508 + suv.getY(vi) * 56) / 512);
      const signMesh = new Mesh(signGeo, atlas.mat);
      (signMesh.position.set(2.75, 0.62, 0.085), group.add(signMesh));
      group.traverse((o) => ((o.castShadow = !1), (o.receiveShadow = !1), (o.userData.dressKit = !0)));
      ((group.visible = !1), et.add(group));
      this.kits.push({ group, spot: null });
    }
  },
  dressedCount() {
    return this.kits ? this.kits.reduce((n, k) => n + (k.spot ? 1 : 0), 0) : 0;
  },
  update(dt) {
    if (!this.spots.length) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.4;
    this.ensure();
    const cx = Xe.position.x,
      cz = Xe.position.z,
      R2 = 45 * 45,
      cand = [];
    for (const s of this.spots) {
      const dx = s.x - cx,
        dz = s.z - cz,
        d2 = dx * dx + dz * dz;
      d2 < R2 && cand.push({ s, d2 });
    }
    cand.sort((p, q) => p.d2 - q.d2);
    const want = cand.slice(0, this.pool).map((c) => c.s),
      wantSet = new Set(want);
    for (const k of this.kits)
      if (k.spot && !wantSet.has(k.spot)) ((k.spot = null), (k.group.visible = !1));
    for (const s of want) {
      if (this.kits.some((k) => k.spot === s)) continue;
      const free = this.kits.find((k) => !k.spot);
      if (!free) break;
      ((free.spot = s),
        free.group.position.set(s.x, s.y, s.z),
        (free.group.rotation.y = s.yaw),
        free.group.scale.setScalar(Math.min(1, (s.w * 0.72) / 7)),
        (free.group.visible = !0));
    }
  },
};
// ─── Park dressing (zoom-detail 39, round-five item 3): the empty lawn blocks
// between streets get baked gravel paths + instanced tree clusters. World-gen
// bake — the far tier IS the feature. Cells must dodge buildings (rooftopSys
// footprints), ponds, outskirt scenery (Sa) and the ribbon corridor (Pn);
// trees additionally stay ≥4m off street edges (ka) and register in the Sa
// audit with a small margin so the road-safety probe stays clean.
const parkSys = { cells: 0, trees: 0, benches: 0, beds: 0, pathTris: 0, pitches: 0, enabled: !0, sample: [], _vis: [] };
// zoom-detail 51 (round-six item 4): soccer-pitch line canvas (white on
// transparent; touchlines, halfway, center circle, boxes, spots)
let pitchTex = null;
function buildPitchTexture() {
  if (pitchTex) return pitchTex;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 336));
  const g = cv.getContext("2d");
  ((g.strokeStyle = "rgba(255,255,255,0.92)"), (g.lineWidth = 5));
  g.strokeRect(14, 14, 484, 308);
  (g.beginPath(), g.moveTo(256, 14), g.lineTo(256, 322), g.stroke());
  (g.beginPath(), g.arc(256, 168, 42, 0, Math.PI * 2), g.stroke());
  for (const bx of [14, 498 - 78]) {
    g.strokeRect(bx, 168 - 74, 78, 148);
    g.strokeRect(bx === 14 ? 14 : 498 - 30, 168 - 34, 30, 68);
  }
  ((g.fillStyle = "rgba(255,255,255,0.92)"),
    g.beginPath(),
    g.arc(256, 168, 4, 0, Math.PI * 2),
    g.fill(),
    g.beginPath(),
    g.arc(72, 168, 4, 0, Math.PI * 2),
    g.fill(),
    g.beginPath(),
    g.arc(440, 168, 4, 0, Math.PI * 2),
    g.fill());
  pitchTex = new CanvasTexture(cv);
  return ((pitchTex.colorSpace = SRGBColorSpace), pitchTex);
}
// zoom-detail 43 (round-five item 7): start-line paddock clutter registry
const paddockSys = { clusters: 0, parts: 0, enabled: !0, _mesh: null, sample: [] };
// zoom-detail 49 (round-six item 2): racing-line rubber on the ribbon deck
const raceWearSys = { segs: 0, patches: 0, enabled: !0, _mesh: null };
// zoom-detail 50 (round-six item 3): lawn mowing stripes + worn patches
const lawnSys = { striped: 0, enabled: !0, mat: null };
function buildParks(group, x0, x1, zA, zB, pitch, sw) {
  ((parkSys.cells = 0), (parkSys.trees = 0), (parkSys.benches = 0), (parkSys.beds = 0), (parkSys.pathTris = 0), (parkSys.pitches = 0), (parkSys.sample.length = 0), (parkSys._vis = []));
  const zLo = Math.min(zA, zB),
    zTop = Math.max(zA, zB),
    zCap = Math.min(zTop, 240),
    rng = plateRng(0x9a4b17),
    cells = [];
  // z street rows anchor at the TOP of the grid (zNear) and descend — cell
  // centers must anchor there too, or every row sits ~5m off a centerline
  for (let cx = x0 + pitch * 0.5; cx < x1; cx += pitch)
    for (let cz = zTop - pitch * 0.5; cz > zLo; cz -= pitch) {
      if (cz >= zCap) continue;
      if (Pn(cx, cz, 26).clearance < 20) continue;
      let ok = !0;
      for (const b of Mn)
        if (Math.abs(b.x - cx) < b.hw + 52 && Math.abs(b.z - cz) < b.hd + 52) {
          ok = !1;
          break;
        }
      if (ok)
        for (const p of ponds)
          if (Math.abs(p.x - cx) < (p.rx || 20) + 56 && Math.abs(p.z - cz) < (p.rz || 20) + 56) {
            ok = !1;
            break;
          }
      if (ok)
        for (const s2 of Sa)
          if (Math.hypot(s2.x - cx, s2.z - cz) < (s2.radius || 6) + 52) {
            ok = !1;
            break;
          }
      ok && cells.push({ cx, cz });
    }
  for (let k = cells.length - 1; k > 0; k--) {
    const j = (rng() * (k + 1)) | 0,
      tmp = cells[k];
    ((cells[k] = cells[j]), (cells[j] = tmp));
  }
  const picked = cells.slice(0, mobilePerf ? 6 : 12);
  if (!picked.length) return;
  const pos = [],
    col = [],
    idx = [],
    treePts = [],
    furnPts = [],
    half = pitch * 0.5 - sw * 0.5 - 12;
  for (let n2 = 0; n2 < picked.length; n2++) {
    const { cx, cz } = picked[n2],
      vert = rng() < 0.5,
      bow = (rng() - 0.5) * 40,
      SEG = 8,
      W = 1.15,
      base = pos.length / 3;
    for (let s2 = 0; s2 <= SEG; s2++) {
      const t2 = s2 / SEG,
        along = -half + t2 * 2 * half,
        across = Math.sin(t2 * Math.PI) * bow,
        px = cx + (vert ? across : along),
        pz = cz + (vert ? along : across),
        dS = (2 * half) / SEG,
        dC = ((Math.cos(t2 * Math.PI) * Math.PI) / SEG) * bow,
        dX = vert ? dC : dS,
        dZ = vert ? dS : dC,
        L = Math.hypot(dX, dZ) || 1,
        nx = (-dZ / L) * W,
        nz = (dX / L) * W,
        sh = s2 % 2 ? 0 : -0.03,
        cr = 0.4 + sh,
        cg = 0.365 + sh,
        cb = 0.285 + sh;
      pos.push(px - nx, He(px - nx, pz - nz) + 0.05, pz - nz, px + nx, He(px + nx, pz + nz) + 0.05, pz + nz);
      col.push(cr, cg, cb, cr, cg, cb);
      if (s2 < SEG) {
        const b2 = base + s2 * 2;
        idx.push(b2, b2 + 1, b2 + 2, b2 + 1, b2 + 3, b2 + 2);
      }
      if (s2 > 0 && s2 < SEG) {
        const lat = (4.5 + rng() * 4.5) * (s2 % 2 ? 1 : -1);
        treePts.push({ tx: px + (vert ? lat : rng() * 6 - 3), tz: pz + (vert ? rng() * 6 - 3 : lat) });
        // benches face the path from just off its edge; flowerbeds sit opposite
        if (s2 === 3 || (s2 === 6 && n2 % 2)) {
          const sd = s2 === 3 ? 1 : -1,
            nxu = nx / W,
            nzu = nz / W;
          furnPts.push({ kind: "bench", fx: px + nxu * 2.3 * sd, fz: pz + nzu * 2.3 * sd, yaw: Math.atan2(-sd * nxu, -sd * nzu) + Math.PI });
        } else if (s2 === 5) {
          const nxu = nx / W,
            nzu = nz / W;
          furnPts.push({ kind: "bed", fx: px - nxu * 3.1, fz: pz - nzu * 3.1, yaw: Math.atan2(nxu, nzu) });
        }
      }
    }
    parkSys.cells++;
    parkSys.sample.length < 3 && parkSys.sample.push({ x: +cx.toFixed(0), z: +cz.toFixed(0) });
  }
  const pg = new BufferGeometry();
  (pg.setAttribute("position", new Float32BufferAttribute(pos, 3)), pg.setAttribute("color", new Float32BufferAttribute(col, 3)), pg.setIndex(idx), pg.computeVertexNormals());
  const pm = new Mesh(pg, new MeshStandardMaterial({ vertexColors: !0, roughness: 0.96 }));
  ((pm.receiveShadow = !0), (pm.raycast = () => {}), group.add(pm), parkSys._vis.push(pm));
  parkSys.pathTris = idx.length / 3;
  const trunkGeo = new CylinderGeometry(0.28, 0.42, 1, 6).translate(0, 0.5, 0),
    canopyGeo = mergeGeometries([
      new ConeGeometry(2.7, 5.4, 7).translate(0, 1.9, 0),
      new ConeGeometry(2.1, 4.9, 7).rotateY(0.6).translate(0, 3.35, 0),
      new ConeGeometry(1.55, 4.1, 7).rotateY(1.2).translate(0, 4.7, 0),
    ]),
    canopyColors = [2055221, 3109954, 1589042].map((cc) => new Color(cc)),
    cap = Math.max(Math.min(treePts.length, mobilePerf ? 24 : 56), 1),
    trunkIM = new InstancedMesh(trunkGeo, new MeshStandardMaterial({ color: 4926748, roughness: 0.9 }), cap),
    canopyIM = new InstancedMesh(canopyGeo, new MeshStandardMaterial({ roughness: 0.92 }), cap),
    dum = new Object3D();
  let ci = 0;
  for (const tp of treePts) {
    if (ci >= cap) break;
    if (ka(tp.tx, tp.tz, 3)) continue;
    if (Pn(tp.tx, tp.tz, 6).clearance < 10) continue;
    let hitB = !1;
    for (const b of Mn)
      if (Math.abs(b.x - tp.tx) < b.hw + 4 && Math.abs(b.z - tp.tz) < b.hd + 4) {
        hitB = !0;
        break;
      }
    if (hitB) continue;
    const M = 0.5 + rng() * 0.4,
      y = He(tp.tx, tp.tz),
      T = 1.7 + rng() * 2.2;
    (dum.position.set(tp.tx, y, tp.tz), (dum.rotation.y = rng() * Math.PI), dum.scale.set(M, T, M), dum.updateMatrix(), trunkIM.setMatrixAt(ci, dum.matrix));
    (dum.position.set(tp.tx, y + T, tp.tz), dum.scale.set(M, M, M), dum.updateMatrix(), canopyIM.setMatrixAt(ci, dum.matrix));
    (canopyIM.setColorAt(ci, canopyColors[ci % 3]), kn("tree", tp.tx, tp.tz, 8 * M, 10), ci++);
  }
  ((trunkIM.count = ci), (canopyIM.count = ci), (trunkIM.instanceMatrix.needsUpdate = !0), (canopyIM.instanceMatrix.needsUpdate = !0), canopyIM.instanceColor && (canopyIM.instanceColor.needsUpdate = !0));
  ((trunkIM.castShadow = !0), (canopyIM.castShadow = !0), (trunkIM.raycast = () => {}), (canopyIM.raycast = () => {}));
  (group.add(trunkIM), group.add(canopyIM), parkSys._vis.push(trunkIM, canopyIM));
  parkSys.trees = ci;
  // benches + flowerbeds (round-five item 4): same safety filters as trees,
  // every part baked into ONE merged vertex-colored mesh (shared vc opaque)
  const fparts = [],
    F = (geo, place, lx, ly, lz, colr) => fparts.push(vcBake(geo, new Matrix4().multiplyMatrices(place, vcAt(lx, ly, lz)), colr)),
    FLOWERS = [15021620, 16765778, 10233776, 16744272];
  parkSys._rej = { total: furnPts.length, ka: 0, pn: 0, mn: 0 };
  parkSys._furnSample = [];
  for (const fp of furnPts) {
    if (ka(fp.fx, fp.fz, 3)) {
      parkSys._rej.ka++;
      continue;
    }
    if (Pn(fp.fx, fp.fz, 4).clearance < 10) {
      parkSys._rej.pn++;
      continue;
    }
    let hitB = !1;
    for (const b of Mn)
      if (Math.abs(b.x - fp.fx) < b.hw + 2 && Math.abs(b.z - fp.fz) < b.hd + 2) {
        hitB = !0;
        break;
      }
    if (hitB) {
      parkSys._rej.mn++;
      continue;
    }
    const place = new Matrix4().makeRotationY(fp.yaw);
    place.setPosition(fp.fx, He(fp.fx, fp.fz), fp.fz);
    if (fp.kind === "bench") {
      parkSys._furnSample.length < 4 && parkSys._furnSample.push({ k: "bench", x: +fp.fx.toFixed(1), z: +fp.fz.toFixed(1) });
      for (const px2 of [-0.62, 0.62]) {
        F(new BoxGeometry(0.14, 0.42, 0.42), place, px2, 0.21, 0, 2432796);
        F(new BoxGeometry(0.12, 0.62, 0.06), place, px2, 0.7, 0.21, 2432796);
      }
      F(new BoxGeometry(1.55, 0.05, 0.16), place, 0, 0.44, -0.12, 9130315);
      F(new BoxGeometry(1.55, 0.05, 0.16), place, 0, 0.44, 0.08, 9130315);
      F(new BoxGeometry(1.55, 0.16, 0.05), place, 0, 0.68, 0.2, 9130315);
      F(new BoxGeometry(1.55, 0.16, 0.05), place, 0, 0.9, 0.22, 9130315);
      parkSys.benches++;
    } else {
      F(new BoxGeometry(1.7, 0.26, 1.0), place, 0, 0.13, 0, 5789222);
      F(new BoxGeometry(1.54, 0.1, 0.84), place, 0, 0.29, 0, 3548956);
      for (let fl = 0; fl < 6; fl++) {
        const lx = -0.58 + (fl % 3) * 0.58,
          lz = fl < 3 ? -0.2 : 0.2;
        F(new BoxGeometry(0.1, 0.16, 0.1), place, lx, 0.4, lz, 4022096);
        F(new SphereGeometry(0.09, 5, 4), place, lx, 0.5, lz, FLOWERS[(fl + ((fp.fx | 0) & 3)) % 4]);
      }
      parkSys.beds++;
      parkSys._furnSample.length < 4 && parkSys._furnSample.push({ k: "bed", x: +fp.fx.toFixed(1), z: +fp.fz.toFixed(1) });
    }
  }
  // zoom-detail 51 (round-six item 4): up to two REMAINING flat cells become
  // soccer pitches — line-canvas overlay pinned above the local terrain
  // maximum (rolling lawns clip flat quads otherwise) + vcBaked goal frames
  // merged into the furniture mesh.
  const usedCells = new Set(picked.map((c3) => c3.cx + "," + c3.cz)),
    pitchCand = [];
  for (let pcx = x0 + pitch * 0.5; pcx < x1; pcx += pitch)
    for (let pcz = zTop - pitch * 0.5; pcz > zLo; pcz -= pitch) {
      if (pcz >= zCap || usedCells.has(pcx + "," + pcz)) continue;
      if (Pn(pcx, pcz, 26).clearance < 12) continue;
      let ok3 = !0;
      for (const b of Mn)
        if (Math.abs(b.x - pcx) < b.hw + 33 && Math.abs(b.z - pcz) < b.hd + 23) {
          ok3 = !1;
          break;
        }
      if (ok3)
        for (const p2 of ponds)
          if (Math.abs(p2.x - pcx) < (p2.rx || 20) + 33 && Math.abs(p2.z - pcz) < (p2.rz || 20) + 23) {
            ok3 = !1;
            break;
          }
      if (ok3)
        for (const s3 of Sa)
          if (Math.hypot(s3.x - pcx, s3.z - pcz) < (s3.radius || 6) + 36) {
            ok3 = !1;
            break;
          }
      ok3 && pitchCand.push({ cx: pcx, cz: pcz });
    }
  for (let k = pitchCand.length - 1; k > 0; k--) {
    const j = (rng() * (k + 1)) | 0,
      tmp = pitchCand[k];
    ((pitchCand[k] = pitchCand[j]), (pitchCand[j] = tmp));
  }
  for (const sc of pitchCand) {
    if (parkSys.pitches >= 2) break;
    const PW = 58,
      PH = 38,
      spanAt = (ox, oz) => {
        const hs = [
          He(sc.cx + ox, sc.cz + oz),
          He(sc.cx + ox - PW / 2, sc.cz + oz - PH / 2),
          He(sc.cx + ox + PW / 2, sc.cz + oz - PH / 2),
          He(sc.cx + ox - PW / 2, sc.cz + oz + PH / 2),
          He(sc.cx + ox + PW / 2, sc.cz + oz + PH / 2),
        ];
        return { top: Math.max(...hs), span: Math.max(...hs) - Math.min(...hs) };
      };
    let bestO = null;
    for (const [ox, oz] of [
      [0, 0],
      [16, 0],
      [-16, 0],
      [0, 22],
      [0, -22],
      [16, 22],
      [-16, -22],
    ]) {
      const r3 = spanAt(ox, oz);
      (!bestO || r3.span < bestO.span) && (bestO = { ox, oz, ...r3 });
    }
    if (!bestO || bestO.span > 1.6) continue;
    const px3 = sc.cx + bestO.ox,
      pz3 = sc.cz + bestO.oz,
      top = bestO.top;
    const pm3 = new Mesh(new PlaneGeometry(PW, PH), new MeshBasicMaterial({ map: buildPitchTexture(), transparent: !0, toneMapped: !1, depthWrite: !1 }));
    ((pm3.rotation.x = -Math.PI / 2), pm3.position.set(px3, top + 0.09, pz3), (pm3.raycast = () => {}), (pm3.renderOrder = 1), group.add(pm3), parkSys._vis.push(pm3));
    for (const gx of [-PW / 2 + 1.2, PW / 2 - 1.2]) {
      const gm = new Matrix4().makeTranslation(px3 + gx, top, pz3),
        GP = (lx, ly, lz, w2, h2, d2) => {
          const m2 = new Matrix4().makeTranslation(lx, ly, lz);
          fparts.push(vcBake(new BoxGeometry(w2, h2, d2), new Matrix4().multiplyMatrices(gm, m2), 15921906));
        };
      (GP(0, 1.22, -3.66, 0.12, 2.44, 0.12), GP(0, 1.22, 3.66, 0.12, 2.44, 0.12), GP(0, 2.44, 0, 0.12, 0.12, 7.44));
    }
    parkSys.pitches++;
  }
  if (fparts.length) {
    const fm = new Mesh(mergeGeometries(fparts, !1), vcMats().opaque);
    ((fm.castShadow = !0), (fm.receiveShadow = !0), (fm.raycast = () => {}), group.add(fm), parkSys._vis.push(fm));
  }
  if (!parkSys.enabled) for (const m2 of parkSys._vis) m2.visible = !1;
}
// ─── Street furniture (zoom-detail item 07): hydrants, parking meters, benches
// and trash cans seeded along the sidewalk lines — four InstancedMeshes sharing
// the vertex-colored opaque material (4 extra draws for ~200 objects). Permanent
// like the plates: real objects up close, sub-pixel dots at distance. Built AFTER
// the building grid loop so clearance checks see the finished blocks.
const furnitureSys = { meshes: null, counts: { hydrants: 0, meters: 0, benches: 0, cans: 0 }, sample: [] };
// newspaper boxes (round 3 wishlist): a 5th furniture type; the nearest few
// show a READABLE front page — the zoom reward.
let newsAtlasTex = null;
const NEWS_HEADLINES = [
  ["THE RIBBON DAILY", "RIBBON CUP SUNDAY:", "CROWTHER FAVOURED"],
  ["THE RIBBON DAILY", "PIGEONS ADOPT WATER", "TOWER, REFUSE COMMENT"],
  ["CITY HERALD", "GATE 8 GLOWS AGAIN —", "EXPERTS DELIGHTED"],
  ["CITY HERALD", "LOCAL DOG 'BISCUIT'", "WINS EVERYTHING"],
];
function buildNewsAtlas() {
  if (newsAtlasTex) return newsAtlasTex;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 128));
  const g = cv.getContext("2d");
  for (let c = 0; c < 4; c++) {
    const x = c * 128,
      H = NEWS_HEADLINES[c];
    ((g.fillStyle = "#efeadd"), g.fillRect(x, 0, 128, 128));
    ((g.fillStyle = "#191b20"), (g.font = "900 13px Georgia,serif"), (g.textAlign = "center"));
    g.fillText(H[0], x + 64, 18, 120);
    ((g.strokeStyle = "#191b20"), (g.lineWidth = 1.5), g.beginPath(), g.moveTo(x + 8, 24), g.lineTo(x + 120, 24), g.stroke());
    ((g.font = "bold 12px Georgia,serif"));
    (g.fillText(H[1], x + 64, 42, 120), g.fillText(H[2], x + 64, 57, 120));
    g.fillStyle = "#8a8578";
    for (let r = 0; r < 8; r++) {
      const w = 46 + ((r * 31) % 60);
      g.fillRect(x + 10 + (r % 2) * 62, 68 + r * 7, Math.min(w, 52), 2.5);
    }
  }
  newsAtlasTex = new CanvasTexture(cv);
  newsAtlasTex.colorSpace = SRGBColorSpace;
  return newsAtlasTex;
}
const newsSys = {
  spots: [],
  kits: null,
  promoted: 0,
  enabled: !0,
  RADIUS: 22, // the roam CAR camera trails ~17m behind the player (it.16 lesson)
  sample: [],
  _timer: 0,
  _geos: null,
  ensure() {
    if (this.kits) return;
    const mat = new MeshBasicMaterial({ map: buildNewsAtlas(), toneMapped: !1, polygonOffset: !0, polygonOffsetFactor: -2 });
    this._geos = [0, 1, 2, 3].map((c) => {
      const geo = new PlaneGeometry(0.3, 0.28),
        uv = geo.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, (c + uv.getX(i)) / 4, uv.getY(i));
      return geo;
    });
    this.kits = [];
    const n = mobilePerf ? 2 : 4;
    for (let k = 0; k < n; k++) {
      const m = new Mesh(this._geos[0], mat);
      ((m.visible = !1), (m.castShadow = !1), (m.receiveShadow = !1), (m.raycast = () => {}), et.add(m));
      this.kits.push({ m, idx: -1 });
    }
  },
  update(t, dt) {
    if (!this.spots.length || !dt) return;
    this._timer -= dt;
    if (this._timer > 0) return;
    this._timer = 0.5;
    this.ensure();
    const cx = Xe.position.x,
      cz = Xe.position.z,
      R2 = this.RADIUS * this.RADIUS,
      cand = [];
    if (this.enabled && Xe.position.y <= 26)
      for (const sp of this.spots) {
        const dx = sp.x - cx,
          dz = sp.z - cz,
          d2 = dx * dx + dz * dz;
        d2 < R2 && cand.push({ sp, d2 });
      }
    cand.sort((a, b) => a.d2 - b.d2);
    ((this.promoted = 0), (this.sample.length = 0));
    for (let k = 0; k < this.kits.length; k++) {
      const kit = this.kits[k],
        c = cand[k];
      if (!c) {
        ((kit.m.visible = !1), (kit.idx = -1));
        continue;
      }
      const sp = c.sp,
        fx = -Math.sin(sp.yaw),
        fz = -Math.cos(sp.yaw);
      ((kit.m.geometry = this._geos[sp.i % 4]), kit.m.position.set(sp.x + fx * 0.21, sp.y + 0.62, sp.z + fz * 0.21), (kit.m.rotation.y = sp.yaw + Math.PI), (kit.m.visible = !0), (kit.idx = sp.i), this.promoted++);
      this.sample.length < 3 && this.sample.push({ i: sp.i, x: sp.x, y: sp.y, z: sp.z, yaw: sp.yaw });
    }
  },
};
function buildStreetFurniture(group, x0, x1, zLow, zHigh, pitch, sw, clearanceAt) {
  const { opaque } = vcMats();
  const hydrantGeo = mergeGeometries(
    [
      vcBake(new CylinderGeometry(0.11, 0.13, 0.1, 6), vcAt(0, 0.05, 0), 2894892),
      vcBake(new CylinderGeometry(0.09, 0.1, 0.34, 6), vcAt(0, 0.27, 0), 15021620),
      vcBake(new SphereGeometry(0.095, 6, 4), vcAt(0, 0.47, 0), 15021620),
      vcBake(new CylinderGeometry(0.035, 0.035, 0.3, 6), vcAt(0, 0.33, 0, Math.PI / 2), 13840175),
      vcBake(new CylinderGeometry(0.03, 0.03, 0.08, 6), vcAt(0, 0.56, 0), 16765778),
    ],
    !1,
  );
  const meterGeo = mergeGeometries(
    [
      vcBake(new CylinderGeometry(0.024, 0.03, 1.04, 6), vcAt(0, 0.52, 0), 3092306),
      vcBake(new BoxGeometry(0.15, 0.22, 0.09), vcAt(0, 1.13, 0), 5395032),
      vcBake(new BoxGeometry(0.11, 0.1, 0.02), vcAt(0, 1.16, -0.047), 13036239),
    ],
    !1,
  );
  const benchGeo = mergeGeometries(
    [
      vcBake(new BoxGeometry(0.14, 0.42, 0.42), vcAt(-0.62, 0.21, 0), 2432796),
      vcBake(new BoxGeometry(0.14, 0.42, 0.42), vcAt(0.62, 0.21, 0), 2432796),
      // back posts carry the backrest slats
      vcBake(new BoxGeometry(0.12, 0.62, 0.06), vcAt(-0.62, 0.7, 0.21), 2432796),
      vcBake(new BoxGeometry(0.12, 0.62, 0.06), vcAt(0.62, 0.7, 0.21), 2432796),
      vcBake(new BoxGeometry(1.55, 0.05, 0.16), vcAt(0, 0.44, -0.12), 9130315),
      vcBake(new BoxGeometry(1.55, 0.05, 0.16), vcAt(0, 0.44, 0.08), 9130315),
      vcBake(new BoxGeometry(1.55, 0.16, 0.05), vcAt(0, 0.68, 0.2), 9130315),
      vcBake(new BoxGeometry(1.55, 0.16, 0.05), vcAt(0, 0.9, 0.22), 9130315),
    ],
    !1,
  );
  const canGeo = mergeGeometries(
    [
      vcBake(new CylinderGeometry(0.19, 0.16, 0.52, 8), vcAt(0, 0.26, 0), 3225437),
      vcBake(new CylinderGeometry(0.2, 0.2, 0.05, 8), vcAt(0, 0.55, 0), 4936027),
      vcBake(new CylinderGeometry(0.13, 0.13, 0.03, 8), vcAt(0, 0.57, 0), 1118996),
    ],
    !1,
  );
  const newsboxGeo = mergeGeometries(
    [
      vcBake(new BoxGeometry(0.42, 0.6, 0.38), vcAt(0, 0.52, 0), 11746096),
      vcBake(new BoxGeometry(0.34, 0.32, 0.03), vcAt(0, 0.62, -0.19), 1183769),
      vcBake(new BoxGeometry(0.34, 0.05, 0.02), vcAt(0, 0.84, -0.195), 15921139),
      vcBake(new BoxGeometry(0.05, 0.05, 0.05), vcAt(0.12, 0.88, -0.12), 3355970),
      vcBake(new BoxGeometry(0.04, 0.24, 0.04), vcAt(-0.16, 0.12, -0.14), 2500134),
      vcBake(new BoxGeometry(0.04, 0.24, 0.04), vcAt(0.16, 0.12, -0.14), 2500134),
      vcBake(new BoxGeometry(0.04, 0.24, 0.04), vcAt(-0.16, 0.12, 0.14), 2500134),
      vcBake(new BoxGeometry(0.04, 0.24, 0.04), vcAt(0.16, 0.12, 0.14), 2500134),
    ],
    !1,
  );
  const defs = [
    { key: "hydrants", geo: hydrantGeo, cap: 46 },
    { key: "meters", geo: meterGeo, cap: 60 },
    { key: "benches", geo: benchGeo, cap: 33 },
    { key: "cans", geo: canGeo, cap: 46 },
    { key: "newsboxes", geo: newsboxGeo, cap: 24 },
  ];
  newsSys.spots.length = 0;
  if (furnitureSys.meshes) for (const m of furnitureSys.meshes) (m.removeFromParent(), m.geometry.dispose());
  ((furnitureSys.meshes = []), (furnitureSys.sample = []));
  const meshes = {},
    dummy = new Object3D(),
    rng = plateRng(0xf00d);
  for (const d of defs) {
    const im = new InstancedMesh(d.geo, opaque, d.cap);
    ((im.frustumCulled = !1), (im.castShadow = !1), (im.receiveShadow = !0), (im.userData.furniture = d.key), (im.userData.used = 0));
    ((meshes[d.key] = im), furnitureSys.meshes.push(im), group.add(im));
  }
  const put = (key, x, z, yaw) => {
    const im = meshes[key];
    if (im.userData.used >= im.count) return;
    (dummy.position.set(x, He(x, z) + 0.02, z), (dummy.rotation.y = yaw), dummy.updateMatrix());
    im.setMatrixAt(im.userData.used++, dummy.matrix);
    key === "newsboxes" && newsSys.spots.push({ i: newsSys.spots.length, x: +x.toFixed(1), y: +(He(x, z) + 0.02).toFixed(2), z: +z.toFixed(1), yaw });
    furnitureSys.sample.length < 8 && furnitureSys.sample.push({ key, x: +x.toFixed(1), z: +z.toFixed(1) });
  };
  const placeAlong = (isNS, line) => {
    const from = isNS ? zLow + 9 : x0 + 9,
      to = isNS ? zHigh - 9 : x1 - 9;
    for (let v = from; v <= to; v += 15 + rng() * 10) {
      // skip intersections: near a crossing street line
      const cross = isNS ? Math.abs(((v - zHigh) % pitch) + pitch) % pitch : Math.abs(((v - x0) % pitch) + pitch) % pitch;
      if (cross < 13 || cross > pitch - 13) continue;
      const side = rng() < 0.5 ? -1 : 1,
        off = side * (sw * 0.66 + 1.35),
        px = isNS ? line + off : v,
        pz = isNS ? v : line + off;
      if (clearanceAt(px, pz, 0.6).clearance < 0.8) continue;
      const pick = rng();
      if (pick < 0.24) put("hydrants", px, pz, rng() * 6.28);
      else if (pick < 0.52) put("meters", px, pz, isNS ? side * Math.PI * 0.5 : side > 0 ? Math.PI : 0);
      else if (pick < 0.68) put("benches", px, pz, isNS ? side * Math.PI * 0.5 : side > 0 ? Math.PI : 0);
      else if (pick < 0.82) put("newsboxes", px, pz, isNS ? side * Math.PI * 0.5 : side > 0 ? Math.PI : 0);
      else put("cans", px, pz, rng() * 6.28);
    }
  };
  for (let x = x0; x <= x1 + 1; x += pitch) placeAlong(!0, Math.round(x));
  for (let z = zHigh; z >= zLow - 1; z -= pitch) placeAlong(!1, Math.round(z));
  // steam vent spots: on the road edge near the curb, sparse and seeded
  steamSys.spots.length = 0;
  const vrng = plateRng(0x57ea0);
  for (let i = 0; i < 90 && steamSys.spots.length < 12; i++) {
    const isNS = vrng() < 0.5,
      lines = isNS ? Math.floor((x1 - x0) / pitch) : Math.floor((zHigh - zLow) / pitch),
      line = (isNS ? x0 : zHigh) + (isNS ? 1 : -1) * pitch * (1 + ((vrng() * (lines - 1)) | 0)),
      along = (isNS ? zLow : x0) + 30 + vrng() * ((isNS ? zHigh - zLow : x1 - x0) - 60),
      side = vrng() < 0.5 ? -1 : 1,
      off = side * (sw * 0.5 - 0.9),
      px = isNS ? line + off : along,
      pz = isNS ? along : line + off;
    if (clearanceAt(px, pz, 0.5).clearance < 0.6) continue;
    steamSys.spots.push({ x: +px.toFixed(1), y: +(He(px, pz) + 0.02).toFixed(2), z: +pz.toFixed(1) });
  }
  // road decal spots: manholes/drains/arrows/wear seeded on the same street math
  ((roadDecalSys.spots.length = 0), (roadDecalSys.placedDone = !1));
  const drng = plateRng(0xdeca1);
  for (let i = 0; i < 240 && roadDecalSys.spots.length < 36; i++) {
    const isNS = drng() < 0.5,
      lines = isNS ? Math.floor((x1 - x0) / pitch) : Math.floor((zHigh - zLow) / pitch),
      line = (isNS ? x0 : zHigh) + (isNS ? 1 : -1) * pitch * (1 + ((drng() * (lines - 1)) | 0)),
      along = (isNS ? zLow : x0) + 30 + drng() * ((isNS ? zHigh - zLow : x1 - x0) - 60),
      v = (drng() * 4) | 0,
      side = drng() < 0.5 ? -1 : 1,
      off = v === 1 ? side * (sw * 0.5 - 0.6) : v === 0 ? side * sw * 0.1 : side * sw * 0.24,
      px = isNS ? line + off : along,
      pz = isNS ? along : line + off;
    if (clearanceAt(px, pz, 0.5).clearance < 0.6) continue;
    const yaw = v === 2 ? (isNS ? (drng() < 0.5 ? 0 : Math.PI) : ((drng() < 0.5 ? 1 : -1) * Math.PI) / 2) : drng() * 6.28;
    roadDecalSys.spots.push({ i: roadDecalSys.spots.length, x: +px.toFixed(1), y: +(He(px, pz) + 0.03).toFixed(2), z: +pz.toFixed(1), yaw, v });
  }
  for (const d of defs) {
    const im = meshes[d.key];
    ((im.count = im.userData.used), (im.instanceMatrix.needsUpdate = !0), (furnitureSys.counts[d.key] = im.userData.used));
  }
}
// ─── Street-name signs (zoom-detail item 08): a double-blade sign at every
// intersection corner. The street GRID is deterministic (di constants), so each
// line keeps its themed fictional name forever. Two InstancedMeshes total: poles
// and text blades — blades sample one 8x4 name atlas via a per-instance slot
// attribute (same shader pattern as the license plates).
const STREET_NAMES = [
  "RIBBON AVE", "COIL ST", "PISTON BLVD", "TORQUE WAY", "APEX DR", "CHICANE CT",
  "GEARBOX ST", "TURBINE AVE", "SPOKE LN", "CAMBER RD", "NITRO AVE", "DYNAMO ST",
  "CLUTCH ST", "MANIFOLD AVE", "OCTANE BLVD", "SPOILER ST", "DOWNSHIFT DR",
  "HAIRPIN RD", "SLIPSTREAM AVE", "REDLINE ST", "IGNITION WAY", "FLYWHEEL RD",
  "BANKED AVE", "PIT LANE", "VELOCITY BLVD", "CHROME ST", "SPROCKET ST", "AERO WAY",
  "MEDALLION RD", "CROSSWALK CT", "OVERPASS AVE", "STEEL RIBBON PKWY",
];
let streetSignAtlas = null;
function buildStreetSignAtlas() {
  if (streetSignAtlas) return streetSignAtlas;
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 256));
  const g = cv.getContext("2d");
  for (let s = 0; s < 32; s++) {
    const x = (s % 8) * 128,
      y = ((s / 8) | 0) * 64;
    ((g.fillStyle = "#175430"), g.fillRect(x + 2, y + 14, 124, 36));
    ((g.strokeStyle = "#e8f4ea"), (g.lineWidth = 2.5), g.strokeRect(x + 4.5, y + 16.5, 119, 31));
    ((g.fillStyle = "#f2fbf4"), (g.font = "bold 17px Arial, sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(STREET_NAMES[s % STREET_NAMES.length], x + 64, y + 33, 112);
  }
  const texture = new CanvasTexture(cv);
  ((texture.colorSpace = SRGBColorSpace), (texture.anisotropy = 4));
  const mat = new MeshBasicMaterial({ map: texture });
  mat.customProgramCacheKey = () => "street-sign-atlas";
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec2 aSignSlot;\nvarying vec2 vSignUv;")
      .replace("#include <uv_vertex>", "#include <uv_vertex>\nvSignUv = uv * vec2(0.125, 0.25) + aSignSlot;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vSignUv;")
      .replace("#include <map_fragment>", "diffuseColor *= texture2D( map, vSignUv );");
  };
  streetSignAtlas = { texture, mat };
  return streetSignAtlas;
}
const streetSignSys = { poles: 0, blades: 0, meshes: null, sample: [] };
function buildStreetSigns(group, x0, x1, zLow, zHigh, pitch, sw, clearanceAt) {
  const atlas = buildStreetSignAtlas(),
    { opaque } = vcMats();
  if (streetSignSys.meshes) for (const m of streetSignSys.meshes) (m.removeFromParent(), m.geometry.dispose());
  ((streetSignSys.meshes = []), (streetSignSys.sample = []));
  const xLines = [],
    zLines = [];
  for (let x = x0; x <= x1 + 1; x += pitch) xLines.push(Math.round(x));
  for (let z = zHigh; z >= zLow - 1; z -= pitch) zLines.push(Math.round(z));
  const cap = xLines.length * zLines.length + 4;
  const poleGeo = mergeGeometries(
    [
      vcBake(new CylinderGeometry(0.035, 0.045, 2.55, 6), vcAt(0, 1.275, 0), 1590848),
      vcBake(new CylinderGeometry(0.05, 0.05, 0.06, 6), vcAt(0, 2.58, 0), 2894377),
    ],
    !1,
  );
  const poles = new InstancedMesh(poleGeo, opaque, cap);
  // blade = front + back quads (back rotated so text reads correctly both sides)
  const bladeFront = new PlaneGeometry(0.92, 0.17),
    bladeBack = new PlaneGeometry(0.92, 0.17);
  bladeBack.rotateY(Math.PI);
  const bladeGeo = mergeGeometries([bladeFront, bladeBack], !1);
  bladeGeo.setAttribute("aSignSlot", new InstancedBufferAttribute(new Float32Array(cap * 2 * 2), 2));
  const blades = new InstancedMesh(bladeGeo, atlas.mat, cap * 2);
  const slotAttr = bladeGeo.getAttribute("aSignSlot");
  for (const im of [poles, blades])
    ((im.frustumCulled = !1), (im.castShadow = !1), (im.receiveShadow = !0), group.add(im), streetSignSys.meshes.push(im));
  const dummy = new Object3D();
  let np = 0,
    nb = 0;
  const nameIdx = (isNS, k) => (isNS ? k : xLines.length + k) % 32;
  for (let xi = 0; xi < xLines.length; xi++)
    for (let zi = 0; zi < zLines.length; zi++) {
      const cx = xLines[xi] + sw * 0.66 + 1.5,
        cz = zLines[zi] + sw * 0.66 + 1.5;
      if (clearanceAt(cx, cz, 0.5).clearance < 0.7) continue;
      if (np >= cap || nb + 2 > blades.count) continue;
      const gy = He(cx, cz) + 0.02;
      (dummy.position.set(cx, gy, cz), (dummy.rotation.y = 0), dummy.updateMatrix(), poles.setMatrixAt(np++, dummy.matrix));
      // NS street blade (runs along z → plane faces ±x)
      const sNS = nameIdx(!0, xi),
        sEW = nameIdx(!1, zi);
      (dummy.position.set(cx, gy + 2.4, cz), (dummy.rotation.y = Math.PI / 2), dummy.updateMatrix());
      (blades.setMatrixAt(nb, dummy.matrix), slotAttr.setXY(nb, (sNS % 8) * 0.125, (3 - ((sNS / 8) | 0)) * 0.25), nb++);
      (dummy.position.set(cx, gy + 2.56, cz), (dummy.rotation.y = 0), dummy.updateMatrix());
      (blades.setMatrixAt(nb, dummy.matrix), slotAttr.setXY(nb, (sEW % 8) * 0.125, (3 - ((sEW / 8) | 0)) * 0.25), nb++);
      streetSignSys.sample.length < 4 &&
        streetSignSys.sample.push({ x: +cx.toFixed(1), y: +gy.toFixed(2), z: +cz.toFixed(1), ns: STREET_NAMES[sNS], ew: STREET_NAMES[sEW] });
    }
  ((poles.count = np), (blades.count = nb), (poles.instanceMatrix.needsUpdate = !0), (blades.instanceMatrix.needsUpdate = !0), (slotAttr.needsUpdate = !0));
  ((streetSignSys.poles = np), (streetSignSys.blades = nb));
}
// ─── WALK / DON'T-WALK pedestrian signals (zoom-detail item 09): small two-face
// display boxes on the existing signal poles, synced to the same phase function
// that drives the (already live) red/amber/green lamp heads. Icons are two tiny
// pooled canvas textures; each face toggles a white walker / orange hand quad.
const pedSignalMeta = { count: 0, sample: [] };
// zoom-detail 37: one-lamp-lit signal heads (unlit lenses go dark-glass; the
// legacy look kept vivid diffuse on all three, reading "all lit" in daylight)
const signalLampSys = { enabled: !0, heads: 0, states: { g: 0, y: 0, r: 0 }, headsRef: null };
let pedIconMats = null;
function buildPedIconMats() {
  if (pedIconMats) return pedIconMats;
  const mk = (draw) => {
    const c = document.createElement("canvas");
    ((c.width = 64), (c.height = 64));
    const g = c.getContext("2d");
    ((g.fillStyle = "#0a0c10"), g.fillRect(0, 0, 64, 64));
    draw(g);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    // transparent:true opts these quads OUT of mergeStaticScenery() — merged
    // copies can't toggle .visible per phase (the merge skips transparent mats)
    return new MeshBasicMaterial({ map: t, transparent: !0 });
  };
  const walk = mk((g) => {
    ((g.fillStyle = "#f4f8ff"), (g.strokeStyle = "#f4f8ff"), (g.lineWidth = 5), (g.lineCap = "round"));
    (g.beginPath(), g.arc(34, 13, 6, 0, 7), g.fill());
    (g.beginPath(),
      g.moveTo(34, 19),
      g.lineTo(30, 35),
      g.moveTo(30, 35),
      g.lineTo(20, 52),
      g.moveTo(30, 35),
      g.lineTo(41, 50),
      g.moveTo(33, 25),
      g.lineTo(20, 32),
      g.moveTo(33, 25),
      g.lineTo(45, 33),
      g.stroke());
  });
  const hand = mk((g) => {
    g.fillStyle = "#ff7a26";
    g.fillRect(22, 26, 22, 24);
    for (let f = 0; f < 4; f++) g.fillRect(22 + f * 5.7, 11, 4.4, 19);
    g.fillRect(15, 30, 8, 13);
  });
  pedIconMats = { walk, hand };
  return pedIconMats;
}
function F1(i, e, t) {
  const { X0: n, X1: s, ZN: r, ZF: a, pitch: o, streetW: c, trafficControls: l = new Map() } = t,
    d = [12139059, 3109053, 15263967, 3818573, 4695133, 14793024, 9261235, 16767293],
    f = ["compact", "taxi", "pickup", "van", "boxTruck", "bus"],
    p = [],
    m = 30,
    g = [],
    M = [];
  for (let I = n; I <= s + 1; I += o) g.push(Math.round(I));
  for (let I = r; I >= a - 1; I -= o) M.push(Math.round(I));
  M.sort((I, ye) => I - ye);
  const x = g[0],
    h = g[g.length - 1],
    _ = M[0],
    v = M[M.length - 1];
  ((Ri.length = 0),
    (Rc.length = 0),
    (Rr.length = 0),
    (Ps.length = 0),
    (qe.traffic = 0),
    (qe.pedestrians = 0),
    (qe.types = {}),
    (qe.turns = 0),
    (qe.splats = 0),
    (qe.trafficCrashes = 0),
    (qe.streetLights = 0),
    (qe.trafficLights = 0),
    (qe.stopSigns = 0),
    plateSys.resetDynamic(),
    pedKitSys.reset(),
    taxiSignSys.reset());
  const y = (I) => I[(Math.random() * I.length) | 0],
    E = (I) => (I > 0 ? -1 : 1) * c * 0.23,
    T = (I, ye) => {
      let Me = 0,
        Se = 1 / 0;
      for (let Z = 0; Z < I.length; Z++) {
        const K = Math.abs(I[Z] - ye);
        K < Se && ((Se = K), (Me = Z));
      }
      return Me;
    },
    R = (I, ye, Me) => {
      const Se = I === "ns" ? M : g;
      if (Me > 0) {
        for (const Z of Se) if (Z > ye + 0.05) return Z;
        return Se[Se.length - 1];
      }
      for (let Z = Se.length - 1; Z >= 0; Z--) if (Se[Z] < ye - 0.05) return Se[Z];
      return Se[0];
    },
    C = (I) => {
      const ye = I.laneOffset + (I.avoidOffset || 0);
      return I.axis === "ns" ? { x: I.road + ye, z: I.along } : { x: I.along, z: I.road + ye };
    },
    b = (I) => {
      if (u.mode !== "roam") return null;
      const ye = C(I);
      if (Math.abs(u.roamPos.y - (He(ye.x, ye.z) + Wn)) > 4.2) return null;
      const Me = I.axis === "ns" ? 0 : I.dir,
        Se = I.axis === "ns" ? I.dir : 0,
        Z = u.roamPos.x - ye.x,
        K = u.roamPos.z - ye.z,
        _e = Z * Me + K * Se,
        be = I.axis === "ns" ? Z : K,
        Le = Math.abs(be),
        Ye = Math.hypot(Z, K),
        Lt = I.mesh?.userData?.colliderHalfW || 2,
        Ze = I.mesh?.userData?.colliderHalfD || 3;
      return Ye < Xn + Math.max(Lt, Ze) * 0.55 || (_e > -1.5 && _e < Ze + 4.2 && Le < Xn + Lt * 0.85)
        ? { crash: !0 }
        : _e > 0 && _e < 30 && Le < c * 0.36
          ? { avoidOffset: (be >= 0 ? -1 : 1) * I.maxAvoidOffset, stop: _e < 13 && Le < Xn + Lt * 0.95 }
          : null;
    },
    S = (I, ye) => `${Math.round(I)},${Math.round(ye)}`,
    L = (I, ye) => {
      const Se = (((ye + I.phase) % 15.5) + 15.5) % 15.5;
      return Se < 6.2 ? "ns" : Se < 7.4 ? "yellow-ns" : Se < 13.6 ? "ew" : "yellow-ew";
    },
    F = (I, ye) => {
      const Me = I.axis === "ns" ? I.road : I.next,
        Se = I.axis === "ns" ? I.next : I.road,
        Z = S(Me, Se),
        K = l.get(Z);
      if (!K) return null;
      if (K.type === "signal") {
        const _e = L(K, ye),
          be = _e === `yellow-${I.axis}`;
        return _e === I.axis && !be ? null : { control: K, key: Z, kind: "signal" };
      }
      return K.type === "stop" && I.lastControlKey !== Z ? { control: K, key: Z, kind: "stop" } : null;
    },
    W = (I, ye = !1) => {
      const Me = I.axis,
        Se = I.along,
        Z = Me === "ns" ? g : M,
        K = I.road,
        _e = T(Z, K),
        be = [],
        Le = Me === "ns" ? _ : x,
        Ye = Me === "ns" ? v : h;
      (!ye &&
        Se + I.dir * o >= Le &&
        Se + I.dir * o <= Ye &&
        be.push({ axis: Me, road: I.road, along: Se, dir: I.dir, turn: !1 }),
        _e > 0 && be.push({ axis: Me === "ns" ? "ew" : "ns", road: Se, along: K, dir: -1, turn: !0 }),
        _e < Z.length - 1 && be.push({ axis: Me === "ns" ? "ew" : "ns", road: Se, along: K, dir: 1, turn: !0 }),
        be.length || be.push({ axis: Me, road: I.road, along: Se, dir: -I.dir, turn: !0 }));
      const Lt = be.filter((wt) => wt.turn),
        Ze = !ye && Lt.length && Math.random() < 0.42 ? y(Lt) : y(be);
      ((Ze.turn || Ze.axis !== Me) && qe.turns++,
        (I.axis = Ze.axis),
        (I.road = Ze.road),
        (I.along = Ze.along),
        (I.dir = Ze.dir),
        (I.laneOffset = E(I.dir)),
        (I.next = R(I.axis, I.along, I.dir)),
        (I.turnBlend = Ze.turn ? 1 : 0),
        (I.lastControlKey = null));
    };
  for (let I = 0; I < m; I++) {
    const ye = Math.random() < 0.56 ? "ns" : "ew",
      Me = f[I % f.length],
      Se = Math.random() < 0.5 ? -1 : 1,
      Z = (Me === "bus" || Me === "boxTruck" ? 10 : 13) + Math.random() * 9,
      K = {
        axis: ye,
        dir: Se,
        type: Me,
        road: y(ye === "ns" ? g : M),
        laneOffset: E(Se),
        along: y(ye === "ns" ? M : g),
        speed: Z,
        bob: Math.random() * Math.PI * 2,
        next: 0,
        turnBlend: 0,
        avoidOffset: 0,
        maxAvoidOffset: c * 0.31,
        crashTimer: 0,
        waitTimer: 0,
        lastControlKey: null,
        mesh: I1(Me, d[(I * 3) % d.length]),
        collider: { kind: "traffic", x: 0, z: 0, hw: 2, hd: 3, maxY: 0 },
      };
    ((K.collider.actor = K),
      I < 8 &&
        ((K.axis = "ns"),
        (K.dir = -1),
        (K.laneOffset = E(K.dir)),
        (K.road = [210, -50, 210, -50][I % 4]),
        (K.along = 318 - I * 54),
        (K.speed += 3)),
      (K.next = R(K.axis, K.along, K.dir)),
      Ri.push(K.collider),
      p.push(K),
      Rc.push(K),
      i.add(K.mesh),
      plateSys.addDynamic(K.mesh, I),
      Me === "taxi" && taxiSignSys.attach(K.mesh),
      (qe.types[Me] = (qe.types[Me] || 0) + 1));
  }
  function te(I, ye = 0, Me = 0) {
    if (I.stolen) return;
    let Se = Math.max(0, I.speed * Me);
    // Panicked civilians (police chase nearby): brake hard, pull to the curb, honk.
    if (I.panicT > 0) {
      ((I.panicT -= Me), (Se *= 0.32), (I.brakePulse = 1));
      I.avoidOffset += (Math.sign(I.laneOffset || 1) * 2.1 - I.avoidOffset) * Math.min(1, Me * 3);
      I.honked || ((I.honked = !0), trafficHonk());
    } else I.honked = !1;
    const Z = b(I);
    for (
      Z?.crash
        ? (Kd(I, u.roamPos), (Se = 0))
        : Z
          ? ((I.avoidOffset += (Z.avoidOffset - I.avoidOffset) * Math.min(1, Me * 4.5)),
            (I.brakePulse = Math.max(I.brakePulse || 0, Z.stop ? 1 : 0.35)),
            Z.stop && ((I.waitTimer = Math.max(I.waitTimer, 0.22)), (Se = 0)))
          : (I.avoidOffset += (0 - I.avoidOffset) * Math.min(1, Me * 1.8)),
        I.crashTimer > 0 && ((I.crashTimer = Math.max(0, I.crashTimer - Me)), (Se = 0)),
        I.waitTimer > 0 && ((I.waitTimer = Math.max(0, I.waitTimer - Me)), (Se = 0));
      Se > 0;
    ) {
      const B = F(I, ye);
      if (B) {
        const lt = I.next - I.dir * (B.kind === "signal" ? 12 : 8),
          Ct = (lt - I.along) * I.dir;
        if (Ct >= -0.35 && Ct <= Se + 0.25) {
          ((I.along = lt),
            (I.brakePulse = 1),
            (Se = 0),
            B.kind === "stop" && ((I.waitTimer = 0.65 + Math.random() * 0.4), (I.lastControlKey = B.key)));
          break;
        }
      }
      const dt = Math.abs(I.next - I.along);
      if (Se < dt) ((I.along += I.dir * Se), (Se = 0));
      else {
        ((I.along = I.next), (Se -= dt));
        const lt = I.next <= (I.axis === "ns" ? _ : x) + 0.05 || I.next >= (I.axis === "ns" ? v : h) - 0.05;
        W(I, lt);
      }
    }
    ((I.brakePulse = Math.max(0, (I.brakePulse || 0) - Me * 3.2)), (I.turnBlend = Math.max(0, I.turnBlend - Me * 3.2)));
    const { x: K, z: _e } = C(I),
      be = I.axis === "ns" ? 0 : I.dir,
      Le = I.axis === "ns" ? I.dir : 0;
    I.mesh.position.set(K, He(K, _e) + 0.28 + Math.sin(ye * 3.2 + I.bob) * 0.035, _e);
    const Ye = Math.atan2(-be, -Le),
      Lt = Math.atan2(Math.sin(Ye - I.mesh.rotation.y), Math.cos(Ye - I.mesh.rotation.y));
    ((I.mesh.rotation.y += Lt * Math.min(1, Me * 7 + I.turnBlend * 0.55)),
      I.crashTimer > 0 && (I.mesh.rotation.y += Math.sin(ye * 22 + I.bob) * 0.02));
    for (const B of I.mesh.userData.wheels || []) B.rotation.x -= I.dir * I.speed * Me * 1.7;
    const Ze = I.mesh.userData.colliderHalfD,
      wt = I.mesh.userData.colliderHalfW;
    ((I.collider.x = K),
      (I.collider.z = _e),
      (I.collider.hw = I.axis === "ns" ? wt : Ze),
      (I.collider.hd = I.axis === "ns" ? Ze : wt),
      (I.collider.maxY = I.mesh.position.y + 3.2));
  }
  for (const I of p) te(I, 0, 0);
  ((qe.traffic = p.length),
    Bn(i, (I, ye) => {
      for (const Me of p) te(Me, I, ye);
      plateSys.update();
    }));
  const ne = [14703451, 5217256, 15779915, 6535022, 12284639, 15724527, 15764053],
    X = [2437188, 3092787, 4930093, 2244434],
    Q = [],
    ie = 45;
  for (let I = 0; I < ie; I++) {
    const ye = Math.random() < 0.56 ? "ns" : "ew",
      Me = e[(Math.random() * e.length) | 0],
      Se = Math.abs(Me.z1 - Me.z0) > Math.abs(Me.x1 - Me.x0),
      Z = ye === "ns" ? (Se ? "ns" : "ew") : Se ? "ew" : "ns",
      K = Math.random() < 0.5 ? -1 : 1,
      _e = Math.random() < 0.5 ? -1 : 1,
      be = {
        axis: Z,
        dir: K,
        sideSign: _e,
        coord: y(Z === "ns" ? g : M),
        along: Z === "ns" ? a + Math.random() * (r - a) : n + Math.random() * (s - n),
        speed: 1.8 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        active: !0,
        respawn: 0,
        x: 0,
        z: 0,
        hitRadius: 0.9,
        mesh: U1(ne[I % ne.length], X[(I * 2) % X.length], I),
      };
    (I < 14 &&
      ((be.axis = "ns"),
      (be.coord = 80),
      (be.sideSign = I % 2 ? -1 : 1),
      (be.dir = I % 3 === 0 ? 1 : -1),
      (be.along = 350 - I * 24),
      (be.speed = 1.5 + (I % 4) * 0.35)),
      Q.push(be),
      Rr.push(be),
      be.mesh.traverse((pm) => (pm.castShadow = !1)),
      i.add(be.mesh));
  }
  const de = new MeshBasicMaterial({ color: 14230306, transparent: !0, opacity: 0, depthWrite: !1, side: DoubleSide }),
    pe = new MeshBasicMaterial({ color: 16734015, transparent: !0, opacity: 0, depthWrite: !1, side: DoubleSide });
  for (let I = 0; I < 18; I++) {
    const ye = new Group(),
      Me = new Mesh(new CircleGeometry(1, 12), de.clone());
    ((Me.rotation.x = -Math.PI / 2), ye.add(Me));
    for (let Se = 0; Se < 7; Se++) {
      const Z = new Mesh(new CircleGeometry(0.25 + Math.random() * 0.25, 8), pe.clone());
      ((Z.rotation.x = -Math.PI / 2),
        Z.position.set(
          Math.cos(Se) * (0.6 + Math.random() * 1.2),
          0.01,
          Math.sin(Se * 1.7) * (0.5 + Math.random() * 1.1),
        ),
        ye.add(Z));
    }
    ((ye.visible = !1),
      (ye.userData.life = 0),
      (ye.userData.maxLife = 2.8),
      (ye.position.y = -99),
      i.add(ye),
      Ps.push(ye));
  }
  function ze(I, ye = 0, Me = 0) {
    if (!I.active)
      if (((I.respawn -= Me), I.respawn <= 0)) ((I.active = !0), (I.mesh.visible = !0), (I.along += I.dir * 50));
      else return;
    ((I.along += I.dir * I.speed * Me),
      I.axis === "ns"
        ? (I.along < a - 28 && (I.along = r + 28), I.along > r + 28 && (I.along = a - 28))
        : (I.along < n - 28 && (I.along = s + 28), I.along > s + 28 && (I.along = n - 28)));
    const Se = I.sideSign * (c * 0.66 + 1.2),
      Z = I.axis === "ns" ? I.coord + Se : I.along,
      K = I.axis === "ns" ? I.along : I.coord + Se,
      _e = I.axis === "ns" ? 0 : I.dir,
      be = I.axis === "ns" ? I.dir : 0;
    ((I.x = Z), (I.z = K), I.mesh.position.set(Z, He(Z, K) + 0.08, K), (I.mesh.rotation.y = Math.atan2(-_e, -be)));
    const Le = Math.sin(ye * 7 + I.phase);
    for (const Ye of I.mesh.userData.limbs || [])
      ((Ye.mesh.rotation.x = Le * Ye.amp * Ye.side), (Ye.mesh.position.y = Ye.baseY + Math.abs(Le) * 0.025));
  }
  for (const I of Q) ze(I, 0, 0);
  ((qe.pedestrians = Q.length),
    Bn(i, (I, ye) => {
      for (const Me of Q) ze(Me, I, ye);
      pedKitSys.update(ye);
      storefrontSys.update(ye);
      birdSys.update(I, ye);
      steamSys.update(I, ye);
      parkedKitSys.update(I, ye);
      ambientSys.update(I, ye);
      rooftopSys.update(I, ye);
      roadsideSys.update(I, ye);
      facadeSys.update(I, ye);
      roadDecalSys.update(I, ye);
      newsSys.update(I, ye);
      for (const Me of Ps) {
        if (!Me.visible) continue;
        Me.userData.life -= ye;
        const Se = Me.userData.life,
          Z = MathUtils.clamp(Se / Me.userData.maxLife, 0, 1);
        (Me.scale.setScalar(1 + (1 - Z) * 0.35),
          Me.traverse((K) => {
            K.material && (K.material.opacity = Math.min(0.78, Z * 1.2));
          }),
          Se <= 0 && (Me.visible = !1));
      }
    }));
}
function N1() {
  const i = new Group(),
    e = new Object3D();
  (new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2),
    (qe.roadDetails = {}),
    (qe.buildingArchetypes = {}),
    (qe.zones = {}),
    (qe.openerProps = 0));
  const t = di.x0,
    n = di.x1,
    s = di.zNear,
    r = di.zFar,
    a = di.pitch,
    o = di.streetW,
    c = a - o,
    l = [],
    d = [];
  for (let N = t; N <= n + 1; N += a) l.push(Math.round(N));
  for (let N = s; N >= r - 1; N -= a) d.push(Math.round(N));
  const f = [];
  for (const N of l) f.push({ x0: N, z0: s, x1: N, z1: r });
  for (const N of d) f.push({ x0: t, z0: N, x1: n, z1: N });
  function p(N, O) {
    const Y = N.x1 - N.x0,
      j = N.z1 - N.z0,
      ee = Math.hypot(Y, j) || 1,
      oe = -j / ee,
      re = Y / ee;
    return { x0: N.x0 + oe * O, z0: N.z0 + re * O, x1: N.x1 + oe * O, z1: N.z1 + re * O };
  }
  function m(N, O, Y) {
    const j = [],
      ee = [];
    for (const re of N) {
      const w = re.x1 - re.x0,
        U = re.z1 - re.z0,
        V = Math.hypot(w, U),
        H = Math.max(1, Math.round(V / 14)),
        z = w / V,
        $ = -(U / V),
        me = z;
      let ue = null,
        Ce = null;
      for (let Pe = 0; Pe <= H; Pe++) {
        const xe = Pe / H,
          Ke = (xe * V) / 68,
          rt = re.x0 + w * xe,
          vt = re.z0 + U * xe,
          Mt = rt + $ * O,
          ut = vt + me * O,
          ke = rt - $ * O,
          yt = vt - me * O,
          mt = [Mt, He(Mt, ut) + Y, ut, Ke],
          kt = [ke, He(ke, yt) + Y, yt, Ke];
        (ue &&
          (j.push(ue[0], ue[1], ue[2], Ce[0], Ce[1], Ce[2], kt[0], kt[1], kt[2]),
          j.push(ue[0], ue[1], ue[2], kt[0], kt[1], kt[2], mt[0], mt[1], mt[2]),
          ee.push(0, ue[3], 1, Ce[3], 1, kt[3]),
          ee.push(0, ue[3], 1, kt[3], 0, mt[3])),
          (ue = mt),
          (Ce = kt));
      }
    }
    const oe = new BufferGeometry();
    return (
      oe.setAttribute("position", new Float32BufferAttribute(j, 3)),
      oe.setAttribute("uv", new Float32BufferAttribute(ee, 2)),
      oe.computeVertexNormals(),
      oe
    );
  }
  const g = ((todRefs.roadMat = new MeshStandardMaterial({
      map: S1(),
      color: 15132390,
      roughness: 0.62,
      metalness: 0.1,
      envMapIntensity: 0.8,
      side: DoubleSide,
    })),
    todRefs.roadMat),
    M = new MeshStandardMaterial({ color: 11054244, roughness: 0.62, metalness: 0.04 }),
    x = new MeshStandardMaterial({ color: 13944196, roughness: 0.44, metalness: 0.05, emissive: 3942912, emissiveIntensity: 0.12 }),
    h = new MeshStandardMaterial({ color: 13617592, roughness: 0.56, metalness: 0.02, emissive: 3158064, emissiveIntensity: 0.06 }),
    _ = new MeshStandardMaterial({ color: 15921375, roughness: 0.4, metalness: 0.03, emissive: 2960676, emissiveIntensity: 0.12 }),
    v = new MeshStandardMaterial({ color: 3422266, roughness: 0.58, metalness: 0.48 }),
    y = [],
    E = [];
  for (const N of f) (y.push(p(N, o * 0.5 + 3.3), p(N, -13.3)), E.push(p(N, o * 0.5 + 0.42), p(N, -10.42)));
  const T = new Mesh(m(y, 2.9, 0.66), M);
  ((T.receiveShadow = !0), i.add(T));
  const R = new Mesh(m(E, 0.28, 0.78), x);
  ((R.receiveShadow = !0),
    i.add(R),
    bi("roadDetails", "sidewalkRuns", y.length),
    bi("roadDetails", "curbRuns", E.length));
  const C = new Mesh(m(f, o / 2, 0.55), g);
  ((C.receiveShadow = !0), i.add(C));
  const b = new MeshStandardMaterial({
    color: 16768876,
    roughness: 0.38,
    metalness: 0.08,
    emissive: 6962688,
    emissiveIntensity: 0.38,
    side: DoubleSide,
  });
  i.add(new Mesh(m(f, 0.4, 0.62), b));
  let S = 0,
    L = 0,
    F = 0;
  for (let N = 1; N < l.length - 1; N++)
    for (let O = 1; O < d.length - 1; O++) {
      const Y = l[N],
        j = d[O];
      if (!(Pn(Y, j, o * 0.75).clearance < 2))
        for (const ee of [-1, 1]) {
          const oe = new Mesh(new BoxGeometry(o * 0.92, 0.07, 1.15), h);
          (oe.position.set(Y, He(Y, j + ee * 13) + 0.83, j + ee * 13), (oe.receiveShadow = !0), i.add(oe));
          const re = new Mesh(new BoxGeometry(1.15, 0.07, o * 0.92), h);
          (re.position.set(Y + ee * 13, He(Y + ee * 13, j) + 0.83, j), (re.receiveShadow = !0), i.add(re), (S += 2));
        }
    }
  const W = new Shape();
  (W.moveTo(0, 5.8),
    W.lineTo(2.5, 1.6),
    W.lineTo(0.72, 1.6),
    W.lineTo(0.72, -5.2),
    W.lineTo(-0.72, -5.2),
    W.lineTo(-0.72, 1.6),
    W.lineTo(-2.5, 1.6),
    W.closePath());
  const te = new ShapeGeometry(W);
  te.rotateX(-Math.PI / 2);
  for (const N of f) {
    const O = Math.abs(N.x1 - N.x0) < Math.abs(N.z1 - N.z0),
      Y = Math.hypot(N.x1 - N.x0, N.z1 - N.z0),
      j = Math.max(2, Math.floor(Y / 280));
    for (let ee = 0; ee < j; ee++) {
      const oe = (ee + 0.5) / j,
        re = N.x0 + (N.x1 - N.x0) * oe,
        w = N.z0 + (N.z1 - N.z0) * oe;
      if (Pn(re, w, 4).clearance < 2) continue;
      const U = new Mesh(te, _);
      if (
        (U.position.set(re, He(re, w) + 0.86, w),
        (U.rotation.y = O ? 0 : Math.PI / 2),
        U.scale.setScalar(0.9),
        i.add(U),
        L++,
        ee % 2 === 0)
      ) {
        const V = new Mesh(new CylinderGeometry(1.05, 1.05, 0.08, 24), v);
        (V.position.set(re + (O ? 3.8 : 0), He(re, w) + 0.84, w + (O ? 0 : 3.8)), i.add(V), F++);
      }
    }
  }
  (bi("roadDetails", "crosswalks", S), bi("roadDetails", "laneArrows", L), bi("roadDetails", "manholes", F));
  const ne = new MeshBasicMaterial({ color: 8837631, transparent: !0, opacity: 0.13, depthWrite: !1, side: DoubleSide, blending: AdditiveBlending }),
    X = new MeshBasicMaterial({ color: 16762474, transparent: !0, opacity: 0.1, depthWrite: !1, side: DoubleSide, blending: AdditiveBlending });
  for (let N = 0; N < 120; N++) {
    const O = f[(Math.random() * f.length) | 0],
      Y = Math.random(),
      j = O.x0 + (O.x1 - O.x0) * Y,
      ee = O.z0 + (O.z1 - O.z0) * Y;
    if (Pn(j, ee, 4).clearance < 2) continue;
    const oe = new Mesh(new CircleGeometry(1, 18), (N % 4 === 0 ? X : ne).clone());
    ((oe.rotation.x = -Math.PI / 2),
      (oe.rotation.z = Math.atan2(O.x1 - O.x0, O.z1 - O.z0) + (Math.random() - 0.5) * 0.35),
      oe.scale.set(2 + Math.random() * 7, 0.16 + Math.random() * 0.35, 1),
      oe.position.set(j + (Math.random() - 0.5) * o * 0.7, He(j, ee) + 0.66, ee + (Math.random() - 0.5) * o * 0.7),
      i.add(oe));
  }
  const Q = [As(160, 320, 0.5, 2), As(160, 320, 0.62, 2), As(160, 320, 0.42, 2)],
    ie = [
      new MeshStandardMaterial({
        map: Q[0],
        color: 7042688,
        roughness: 0.42,
        metalness: 0.26,
        emissive: 16764026,
        emissiveMap: Q[0],
        emissiveIntensity: 0.34,
      }),
      new MeshStandardMaterial({
        map: Q[1],
        color: 8550507,
        roughness: 0.46,
        metalness: 0.22,
        emissive: 16770210,
        emissiveMap: Q[1],
        emissiveIntensity: 0.32,
      }),
      new MeshStandardMaterial({
        map: Q[2],
        color: 4414064,
        roughness: 0.4,
        metalness: 0.3,
        emissive: 13096959,
        emissiveMap: Q[2],
        emissiveIntensity: 0.36,
      }),
    ],
    de = new BoxGeometry(1, 1, 1);
  ((towerTexSys.mats = ie), (towerTexSys.args = [
    [160, 320, 0.5],
    [160, 320, 0.62],
    [160, 320, 0.42],
  ]), (towerTexSys.hd = 2));
  const
    pe = [[], [], []],
    ze = [],
    I = [],
    ye = [],
    Me = [],
    Se = [],
    Z = [],
    K = [],
    _e = [],
    be = [],
    Le = [],
    Ye = [],
    Lt = [],
    Ze = [],
    wt = [14141877, 14865853, 13350555, 13620947, 14731694, 12568509, 13805717, 13222061],
    B = b1(256, 256, "#dbcdb8"),
    dt = w1(),
    lt = T1(),
    Ct = [Ao(512, 384, "#944737", "#2e95bf"), Ao(512, 384, "#7e4d3e", "#d04d65"), Ao(512, 384, "#a65a35", "#4fba6d")],
    Ge = E1();
  function Dt(N, O) {
    (bi("zones", N), bi("buildingArchetypes", O));
  }
  function $e(N, O, Y, j, ee, oe = "downtown") {
    if (Hi(N, O, Y, j)) return !1;
    const re = $i(N, O, Y, j) - 0.45;
    if (Wi(N, O, Y, j, re + ee + 2)) return !1;
    if (
      (e.position.set(N, re + ee / 2, O),
      e.quaternion.identity(),
      e.scale.set(Y, ee, j),
      e.updateMatrix(),
      pe[(Math.random() * 3) | 0].push(e.matrix.clone()),
      e.position.set(N, re + ee + 0.6, O),
      e.scale.set(Y * 1.04, 1.2, j * 1.04),
      e.updateMatrix(),
      ze.push(e.matrix.clone()),
      ee > 26)
    ) {
      const w = Math.random() < 0.72 ? 3790847 : 16730294;
      for (const U of [-1, 1])
        (e.position.set(N, re + ee + 1.35, O + U * (j * 0.52 + 0.12)),
          e.scale.set(Y * 1.12, 0.22, 0.18),
          e.updateMatrix(),
          I.push(e.matrix.clone()),
          ye.push(w));
      Math.random() < 0.34 && Me.push({ px: N, pz: O, w: Y, d: j, h: ee, gy: re, zSide: Math.random() < 0.5 ? -1 : 1 });
    }
    ee > 10 && rooftopSys.spots.push({ i: rooftopSys.spots.length, x: N, z: O, top: re + ee + 1.2, w: Y, d: j, h: ee });
    if (ee > 14 && Math.random() < 0.48) {
      const w = Math.random() < 0.5 ? "x" : "z";
      Se.push({ px: N, pz: O, w: Y, d: j, h: ee, gy: re, axis: w, side: Math.random() < 0.5 ? -1 : 1 });
    }
    if (ee > 28 && Math.random() < 0.18) {
      const w = Math.random() < 0.5 ? "x" : "z";
      Z.push({ px: N, pz: O, w: Y, d: j, h: ee, gy: re, axis: w, side: Math.random() < 0.5 ? -1 : 1 });
    }
    return (
      Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: re + ee + 2 }),
      Dt(oe, ee > 64 ? "glassTower" : "midrise"),
      !0
    );
  }
  function ot(N, O, Y, j, ee, oe = "residential") {
    if (Hi(N, O, Y, j)) return !1;
    const re = $i(N, O, Y, j) - 0.2,
      w = 2 + Math.random() * 2.4;
    if (Wi(N, O, Y, j, re + ee + w + 1.5, 6)) return !1;
    (e.position.set(N, re + ee / 2, O),
      e.quaternion.identity(),
      e.scale.set(Y, ee, j),
      e.updateMatrix(),
      K.push(e.matrix.clone()),
      Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: re + ee + w + 1.5 }),
      _e.push(wt[(Math.random() * wt.length) | 0]),
      e.position.set(N, re + ee + w / 2, O),
      e.scale.set(Y * 0.82, w, j * 0.82),
      e.updateMatrix(),
      be.push(e.matrix.clone()));
    const U = t + Math.round((N - t) / a) * a,
      V = s - Math.round((s - O) / a) * a,
      H = Math.abs(N - U) < Math.abs(O - V),
      z = H ? (U > N ? 1 : -1) : V > O ? 1 : -1,
      se = Math.min(H ? j * 0.46 : Y * 0.46, 8.5),
      $ = Math.min(ee * 0.58, 4.6),
      me = Math.min(24, Math.max(8, H ? Math.abs(U - N) - Y * 0.5 - o * 0.35 : Math.abs(V - O) - j * 0.5 - o * 0.35));
    (e.quaternion.identity(),
      H
        ? (e.position.set(N + z * (Y * 0.5 + 0.1), re + $ * 0.5 + 0.1, O - j * 0.16),
          e.scale.set(0.24, $, se),
          e.updateMatrix(),
          Le.push(e.matrix.clone()),
          e.position.set(N + z * (Y * 0.5 + me * 0.5), He(N + z * (Y * 0.5 + me * 0.5), O) + 0.08, O - j * 0.16),
          e.scale.set(me, 0.08, se * 1.18))
        : (e.position.set(N - Y * 0.16, re + $ * 0.5 + 0.1, O + z * (j * 0.5 + 0.1)),
          e.scale.set(se, $, 0.24),
          e.updateMatrix(),
          Le.push(e.matrix.clone()),
          e.position.set(N - Y * 0.16, He(N, O + z * (j * 0.5 + me * 0.5)) + 0.08, O + z * (j * 0.5 + me * 0.5)),
          e.scale.set(se * 1.18, 0.08, me)),
      e.updateMatrix(),
      Ye.push(e.matrix.clone()),
      e.position.set(N, re + 0.02, O),
      e.scale.set(Y * 1.58, 0.05, j * 1.58),
      e.updateMatrix(),
      Lt.push(e.matrix.clone()));
    for (let ue = 0; ue < 3; ue++) {
      const Ce = H ? N + z * (Y * 0.55) : N + (ue - 1) * Y * 0.25,
        Pe = H ? O + (ue - 1) * j * 0.28 : O + z * (j * 0.55);
      e.position.set(Ce, He(Ce, Pe) + 0.55, Pe);
      const xe = 0.85 + Math.random() * 0.75;
      (e.scale.set(xe * 1.35, xe, xe * 1.35), e.updateMatrix(), Ze.push(e.matrix.clone()));
    }
    return (Dt(oe, "residentialHouse"), !0);
  }
  function D(N, O, Y, j, ee, oe = "commercial") {
    if (Hi(N, O, Y, j)) return !1;
    const re = $i(N, O, Y, j) - 0.8;
    if (Wi(N, O, Y, j, re + ee + 2, 7)) return !1;
    const w = new MeshStandardMaterial({
        map: Ge,
        color: 14144452,
        roughness: 0.5,
        metalness: 0.18,
        emissive: 2106666,
        emissiveIntensity: 0.12,
      }),
      U = new Mesh(new BoxGeometry(Y, ee, j), w);
    (U.position.set(N, re + ee / 2, O), (U.castShadow = !0), (U.receiveShadow = !0), i.add(U));
    const V = new MeshStandardMaterial({ color: 7502722, roughness: 0.52, metalness: 0.15 }),
      H = new Mesh(new BoxGeometry(Y * 0.72, 0.32, j * 0.18), V);
    (H.position.set(N, re + ee * 0.38, O + j * 0.18), (H.rotation.z = 0.13), i.add(H));
    const z = new MeshStandardMaterial({ color: 16768876, roughness: 0.28, metalness: 0.08, emissive: 12679680, emissiveIntensity: 0.38 });
    for (let se = 5; se < ee; se += 9) {
      const $ = new Mesh(new BoxGeometry(Y * 1.02, 0.24, 0.22), z);
      ($.position.set(N, re + se, O + j * 0.5 + 0.14), i.add($));
    }
    return (Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: re + ee + 2 }), Dt(oe, "parkingGarage"), !0);
  }
  function A(N, O, Y, j, ee, oe = "commercial") {
    if (Hi(N, O, Y, j)) return !1;
    const re = $i(N, O, Y, j) - 0.65;
    if (Wi(N, O, Y, j, re + ee + 2, 7)) return !1;
    const w = new MeshStandardMaterial({
        map: Ct[(Math.random() * Ct.length) | 0],
        color: 16777215,
        roughness: 0.64,
        metalness: 0.04,
        emissive: 2166794,
        emissiveIntensity: 0.12,
      }),
      U = new Mesh(new BoxGeometry(Y, ee, j), w);
    (U.position.set(N, re + ee / 2, O), (U.castShadow = !0), (U.receiveShadow = !0), i.add(U));
    const V = new Mesh(new BoxGeometry(Y * 1.06, 0.9, j * 1.06), new MeshStandardMaterial({ color: 2237478, roughness: 0.56, metalness: 0.18 }));
    (V.position.set(N, re + ee + 0.45, O), i.add(V));
    const H = t + Math.round((N - t) / a) * a,
      z = s - Math.round((s - O) / a) * a,
      se = Math.abs(N - H) < Math.abs(O - z),
      $ = se ? (H > N ? 1 : -1) : z > O ? 1 : -1,
      me = Ti[((N + O) | 0) % Ti.length] || "#ffd45b",
      ue = new MeshBasicMaterial({
        map: Eo(wi[((Math.abs(N) + Math.abs(O)) | 0) % wi.length], me),
        transparent: !0,
        side: DoubleSide,
        depthWrite: !1,
      }),
      Ce = new Mesh(new PlaneGeometry(Math.min(16, se ? j * 0.82 : Y * 0.82), 4.2), ue);
    return (
      se
        ? (Ce.position.set(N + $ * (Y * 0.5 + 0.2), re + ee * 0.66, O),
          (Ce.rotation.y = $ > 0 ? Math.PI / 2 : -Math.PI / 2))
        : (Ce.position.set(N, re + ee * 0.66, O + $ * (j * 0.5 + 0.2)), (Ce.rotation.y = $ < 0 ? Math.PI : 0)),
      i.add(Ce),
      Xi("storefront-sign", Ce.position.x, Ce.position.y, Ce.position.z),
      storefrontSys.addSpot(
        se ? N + $ * (Y * 0.5) : N,
        re,
        se ? O : O + $ * (j * 0.5),
        se ? ($ > 0 ? Math.PI / 2 : -Math.PI / 2) : $ < 0 ? Math.PI : 0,
        se ? j : Y,
      ),
      Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: re + ee + 2 }),
      Dt(oe, "brickStorefront"),
      !0
    );
  }
  storefrontSys.resetSpots();
  rooftopSys.resetSpots();
  for (let N = t + a / 2; N <= n - a / 2; N += a)
    for (let O = s - a / 2; O >= r + a / 2; O -= a) {
      const Y = Pn(N, O, c * 0.5).clearance;
      if (Y < 2) continue;
      const j = O > 40 && O < 380 && N > -360 && N < 360,
        ee = j
          ? "showcase"
          : O < -920
            ? "industrial"
            : Y > 230 || O < -430
              ? "downtown"
              : Y < 90
                ? "residential"
                : "commercial";
      if (Y < 90 || j) {
        const re = c / 3;
        for (let w = 0; w < 3; w++)
          for (let U = 0; U < 3; U++) {
            if (Math.random() < 0.08) continue;
            const V = N - c / 2 + re * (w + 0.5) + (Math.random() - 0.5) * re * 0.3,
              H = O - c / 2 + re * (U + 0.5) + (Math.random() - 0.5) * re * 0.3;
            if (Pn(V, H, 8).clearance < 1) continue;
            const z = re * (0.54 + Math.random() * 0.24),
              se = re * (0.54 + Math.random() * 0.24);
            !j && Math.random() < 0.16
              ? $e(V, H, z * 0.9, se * 0.9, 12 + Math.random() * 12, ee)
              : ot(V, H, z, se, 5 + Math.random() * 4.5, ee);
          }
      } else {
        const oe = Y > 230,
          re = oe ? MathUtils.clamp(58 + Y * 1.15, 68, 205) : MathUtils.clamp(22 + Y * 0.3, 22, 66),
          w =
            4 +
            (Math.random() < 0.72 ? 1 : 0) +
            (Math.random() < 0.5 ? 1 : 0) +
            (Math.random() < 0.32 ? 1 : 0);
        for (let U = 0; U < w; U++) {
          const V = 15 + Math.random() * Math.min(30, c * 0.46),
            H = 15 + Math.random() * Math.min(30, c * 0.46),
            z = N + (Math.random() - 0.5) * (c - V),
            se = O + (Math.random() - 0.5) * (c - H);
          if (Pn(z, se, Math.hypot(V, H) * 0.5).clearance < 2) continue;
          const $ = (18 + Math.random() * (re - 18)) * (oe && Math.random() < 0.24 ? 1.35 : 1);
          (!oe &&
            ((Math.random() < 0.38 &&
              A(z, se, Math.max(18, V * 1.12), Math.max(18, H * 1.08), 12 + Math.random() * 14, ee)) ||
              (Math.random() < 0.18 &&
                D(z, se, Math.max(24, V * 1.35), Math.max(24, H * 1.28), 24 + Math.random() * 24, ee)))) ||
            $e(z, se, V, H, $, ee);
        }
      }
    }
  buildStreetFurniture(i, t, n, r, s, a, o, Pn);
  buildStreetSigns(i, t, n, r, s, a, o, Pn);
  buildParks(i, t, n, r, s, a, o);
  for (let N = 0; N < 3; N++) {
    if (!pe[N].length) continue;
    const O = new InstancedMesh(de, ie[N], pe[N].length);
    for (let Y = 0; Y < pe[N].length; Y++) O.setMatrixAt(Y, pe[N][Y]);
    ((O.instanceMatrix.needsUpdate = !0), (O.castShadow = !0), (O.receiveShadow = !0), i.add(O));
  }
  if (ze.length) {
    const N = new MeshStandardMaterial({ color: 2896696, roughness: 0.62, metalness: 0.34 }),
      O = new InstancedMesh(de, N, ze.length);
    for (let Y = 0; Y < ze.length; Y++) O.setMatrixAt(Y, ze[Y]);
    ((O.instanceMatrix.needsUpdate = !0), i.add(O));
  }
  if (I.length) {
    const N = new MeshStandardMaterial({ color: 16777215, roughness: 0.18, metalness: 0.12, emissive: 16777215, emissiveIntensity: 1.75 }),
      O = new InstancedMesh(de, N, I.length);
    for (let Y = 0; Y < I.length; Y++) (O.setMatrixAt(Y, I[Y]), O.setColorAt(Y, new Color(ye[Y])));
    ((O.instanceMatrix.needsUpdate = !0), O.instanceColor && (O.instanceColor.needsUpdate = !0), i.add(O));
  }
  if (K.length) {
    const N = new MeshStandardMaterial({ color: 4891451, roughness: 0.88, metalness: 0.02 }),
      O = new InstancedMesh(de, N, Lt.length);
    for (let $ = 0; $ < Lt.length; $++) O.setMatrixAt($, Lt[$]);
    ((O.instanceMatrix.needsUpdate = !0), (O.receiveShadow = !0), i.add(O));
    const Y = new MeshStandardMaterial({ color: 12040883, roughness: 0.48, metalness: 0.05 }),
      j = new InstancedMesh(de, Y, Ye.length);
    for (let $ = 0; $ < Ye.length; $++) j.setMatrixAt($, Ye[$]);
    ((j.instanceMatrix.needsUpdate = !0), (j.receiveShadow = !0), i.add(j));
    const ee = new MeshStandardMaterial({ map: B, roughness: 0.78, metalness: 0.03 }),
      oe = new InstancedMesh(de, ee, K.length);
    for (let $ = 0; $ < K.length; $++) (oe.setMatrixAt($, K[$]), oe.setColorAt($, new Color(_e[$])));
    ((oe.instanceMatrix.needsUpdate = !0),
      oe.instanceColor && (oe.instanceColor.needsUpdate = !0),
      (oe.castShadow = !0),
      (oe.receiveShadow = !0),
      i.add(oe));
    const re = new ConeGeometry(0.72, 1, 4);
    re.rotateY(Math.PI / 4);
    const w = new MeshStandardMaterial({ map: dt, color: 14314033, roughness: 0.72 }),
      U = new InstancedMesh(re, w, be.length);
    for (let $ = 0; $ < be.length; $++) U.setMatrixAt($, be[$]);
    ((U.instanceMatrix.needsUpdate = !0), (U.castShadow = !0), i.add(U));
    const V = new MeshStandardMaterial({ map: lt, roughness: 0.38, metalness: 0.18 }),
      H = new InstancedMesh(de, V, Le.length);
    for (let $ = 0; $ < Le.length; $++) H.setMatrixAt($, Le[$]);
    ((H.instanceMatrix.needsUpdate = !0), i.add(H));
    const z = new MeshStandardMaterial({ color: 3112239, roughness: 0.88, metalness: 0.02 }),
      se = new InstancedMesh(new SphereGeometry(1, 8, 6), z, Ze.length);
    for (let $ = 0; $ < Ze.length; $++) se.setMatrixAt($, Ze[$]);
    ((se.instanceMatrix.needsUpdate = !0), (se.castShadow = !0), (se.receiveShadow = !0), i.add(se));
  }
  const J = ["HOTEL", "OPEN", "AUTO", "RACE", "CAFE", "PARTS", "ARCADE", "MOTEL", "TACOS", "VINYL"];
  for (let N = 0; N < Math.min(Me.length, 34); N++) {
    const O = Me[N],
      Y = J[N % J.length],
      j = N % 3 === 0 ? "#ff4fb7" : N % 3 === 1 ? "#4ff3ff" : "#ffd45b",
      ee = new MeshBasicMaterial({ map: Ah(Y, j), transparent: !0, side: DoubleSide, depthWrite: !1 }),
      oe = new Mesh(new PlaneGeometry(8, 24), ee);
    (oe.position.set(O.px, O.gy + Math.max(14, O.h * 0.58), O.pz + O.zSide * (O.d * 0.5 + 0.25)),
      (oe.rotation.y = O.zSide < 0 ? Math.PI : 0),
      i.add(oe),
      Xi("vertical-neon", oe.position.x, oe.position.y, oe.position.z));
  }
  for (let N = 0; N < Math.min(Se.length, 48); N++) {
    const O = Se[N],
      Y = wi[(N * 5 + 2) % wi.length],
      j = Ti[(N * 2 + 1) % Ti.length],
      ee = new MeshBasicMaterial({ map: Eo(Y, j), transparent: !0, side: DoubleSide, depthWrite: !1 }),
      oe = Math.min(17, (O.axis === "x" ? O.d : O.w) * 0.82),
      re = new Mesh(new PlaneGeometry(oe, 4.7), ee),
      w = O.gy + Math.max(6.2, Math.min(O.h - 3.5, O.h * (0.28 + (N % 3) * 0.12)));
    (O.axis === "x"
      ? (re.position.set(O.px + O.side * (O.w * 0.5 + 0.22), w, O.pz),
        (re.rotation.y = O.side > 0 ? Math.PI / 2 : -Math.PI / 2))
      : (re.position.set(O.px, w, O.pz + O.side * (O.d * 0.5 + 0.22)), (re.rotation.y = O.side < 0 ? Math.PI : 0)),
      i.add(re),
      Xi("wall-sign", re.position.x, re.position.y, re.position.z));
  }
  for (let N = 0; N < Math.min(Z.length, 18); N++) {
    const O = Z[N],
      Y = wi[(N * 7 + 4) % wi.length],
      j = Ra[(N * 5 + 3) % Ra.length],
      ee = Ti[(N + 3) % Ti.length],
      oe = new Group(),
      re = new MeshStandardMaterial({
        map: Od(Y, j, ee),
        color: 16777215,
        roughness: 0.2,
        metalness: 0.06,
        emissive: new Color(ee),
        emissiveIntensity: 0.34,
      }),
      w = Math.min(18, (O.axis === "x" ? O.d : O.w) * 0.86),
      U = new Mesh(new BoxGeometry(w, 5.2, 0.42), re);
    ((U.position.y = 4.8), oe.add(U));
    const V = new MeshStandardMaterial({ color: 1053978, roughness: 0.44, metalness: 0.28 });
    for (const H of [-w * 0.34, w * 0.34]) {
      const z = new Mesh(new CylinderGeometry(0.13, 0.17, 5, 8), V);
      (z.position.set(H, 2.25, -0.2), oe.add(z));
    }
    (oe.position.set(O.px, O.gy + O.h + 0.7, O.pz),
      (oe.rotation.y = O.axis === "x" ? (O.side > 0 ? Math.PI / 2 : -Math.PI / 2) : O.side < 0 ? Math.PI : 0),
      i.add(oe),
      Xi("roof-billboard", oe.position.x, oe.position.y + 4.8, oe.position.z));
  }
  const le = [11680564, 3108784, 14205514, 15198700, 3752265, 4164178, 10112944],
    // parked cars: real silhouette (body + cabin) with a separate dark wheel layer, still 2 draw calls total
    fe = mergeGeometries([
      new BoxGeometry(2.2, 0.72, 4.6).translate(0, 0.78, 0),
      new BoxGeometry(1.7, 0.56, 2.15).translate(0, 1.42, -0.22),
    ]),
    feWheels = mergeGeometries(
      [
        [-1.16, -1.5],
        [1.16, -1.5],
        [-1.16, 1.5],
        [1.16, 1.5],
      ].map(([wx, wz]) =>
        new CylinderGeometry(0.36, 0.36, 0.3, 10).rotateZ(Math.PI / 2).translate(wx, 0.38, wz),
      ),
    ),
    ae = 130,
    Ve = new InstancedMesh(fe, new MeshStandardMaterial({ roughness: 0.42, metalness: 0.36 }), ae),
    VeW = new InstancedMesh(feWheels, new MeshStandardMaterial({ color: 1512727, roughness: 0.9 }), ae);
  plateSys.resetStatic();
  let Re = 0,
    Je = 0;
  for (; Re < ae && Je < ae * 6;) {
    Je++;
    const N = Math.random() < 0.5,
      O = N
        ? t + Math.round(Math.random() * ((n - t) / a)) * a + (Math.random() < 0.5 ? -1 : 1) * (o * 0.26)
        : t + Math.random() * (n - t),
      Y = N
        ? r + Math.random() * (s - r)
        : s - Math.round(Math.random() * ((s - r) / a)) * a + (Math.random() < 0.5 ? -1 : 1) * (o * 0.26);
    if (Pn(O, Y, 4).clearance < 2) continue;
    const j = He(O, Y) + 0.06,
      // tilt parked cars to the terrain normal (gradient of He) — flat cars on
      // sloped lawns bury their uphill wheels ("sunk" report, 2026-07-16)
      _gx = (He(O + 1.2, Y) - He(O - 1.2, Y)) / 2.4,
      _gz = (He(O, Y + 1.2) - He(O, Y - 1.2)) / 2.4,
      _qN = new Quaternion().setFromUnitVectors(on, new Vector3(-_gx, 1, -_gz).normalize()),
      _qY = new Quaternion().setFromAxisAngle(on, N ? 0 : Math.PI / 2);
    (e.position.set(O, j, Y),
      e.quaternion.copy(_qN).multiply(_qY),
      e.scale.set(1, 1, 1),
      e.updateMatrix(),
      Ve.setMatrixAt(Re, e.matrix),
      VeW.setMatrixAt(Re, e.matrix),
      Ve.setColorAt(Re, new Color(le[(Math.random() * le.length) | 0])),
      rideSys.spots.push({ x: O, z: Y, yaw: N ? 0 : -Math.PI / 2, idx: Re, taken: !1 }),
      plateSys.addStatic(e.matrix, 2.3, Re, rideSys.spots[rideSys.spots.length - 1]),
      Re++);
  }
  ((Ve.count = Re),
    (VeW.count = Re),
    (Ve.instanceMatrix.needsUpdate = !0),
    (VeW.instanceMatrix.needsUpdate = !0),
    Ve.instanceColor && (Ve.instanceColor.needsUpdate = !0),
    (Ve.castShadow = !0),
    (rideSys.im = Ve),
    (rideSys.imW = VeW),
    i.add(Ve),
    i.add(VeW));
  const We = new Map(),
    ge = (N, O) => `${Math.round(N)},${Math.round(O)}`;
  function we(N, O) {
    const j = (((O + N.phase) % 15.5) + 15.5) % 15.5;
    return j < 6.2
      ? { green: "ns", yellow: null }
      : j < 7.4
        ? { green: null, yellow: "ns" }
        : j < 13.6
          ? { green: "ew", yellow: null }
          : { green: null, yellow: "ew" };
  }
  function nt() {
    ((pedSignalMeta.count = 0), (pedSignalMeta.sample.length = 0));
    const N = [],
      PS = [],
      pedMats = buildPedIconMats(),
      O = new MeshStandardMaterial({ color: 1120028, roughness: 0.38, metalness: 0.62 }),
      Y = new MeshStandardMaterial({ color: 1382685, roughness: 0.34, metalness: 0.38 }),
      j = A1(),
      ee = new MeshBasicMaterial({ map: j, transparent: !0, side: DoubleSide }),
      oe = new MeshStandardMaterial({ color: 5050642, roughness: 0.48, metalness: 0.12 }),
      re = (se, $) => new MeshStandardMaterial({ color: se, roughness: 0.16, metalness: 0.02, emissive: $, emissiveIntensity: 0.2 }),
      hoodGeo = new BoxGeometry(0.68, 0.09, 0.46),
      addPedSignals = (xe, Ce, Ke, rt, wx, wz, wy) => {
        // hang the display box OFF the pole (pole radius 0.24 — centering it on
        // the axis buries the faces, same failure family as plates-in-bumpers)
        const bx = Ke - 0.26,
          bz = rt - 0.26;
        const pb = new Mesh(new BoxGeometry(0.3, 0.52, 0.3), Y);
        (pb.position.set(bx, 2.55, bz), xe.add(pb));
        const arm = new Mesh(new BoxGeometry(0.34, 0.06, 0.34), Y);
        (arm.position.set(Ke - 0.13, 2.84, rt - 0.13), xe.add(arm));
        const mk = (mat) => new Mesh(new PlaneGeometry(0.2, 0.2), mat);
        const walkA = mk(pedMats.walk),
          handA = mk(pedMats.hand),
          walkB = mk(pedMats.walk),
          handB = mk(pedMats.hand);
        for (const q of [walkA, handA]) ((q.position.set(bx - 0.16, 2.55, bz)), (q.rotation.y = -Math.PI / 2), xe.add(q));
        for (const q of [walkB, handB]) ((q.position.set(bx, 2.55, bz - 0.16)), (q.rotation.y = Math.PI), xe.add(q));
        PS.push({ control: Ce, walkA, handA, walkB, handB, x: wx + bx, y: wy + 2.55, z: wz + bz, walkEW: !1, walkNS: !1 });
        pedSignalMeta.count++;
        pedSignalMeta.sample.length < 3 && pedSignalMeta.sample.push({ x: +(wx + bx).toFixed(1), y: +(wy + 2.55).toFixed(2), z: +(wz + bz).toFixed(1) });
      },
      w = (se, $, me, ue, Ce, Pe) => {
        const xe = new Group(),
          Ke = new Mesh(new BoxGeometry(1.15, 2.85, 0.75), Y);
        xe.add(Ke);
        const rt = re(16724008, 16717836),
          vt = re(16767053, 16757276),
          Mt = re(4521842, 1693789),
          ut = [rt, vt, Mt];
        for (let ke = 0; ke < 3; ke++) {
          const yt = new Mesh(new SphereGeometry(0.28, 12, 8), ut[ke]);
          (yt.position.set(0, 0.78 - ke * 0.78, -0.42), xe.add(yt));
          const hd = new Mesh(hoodGeo, Y);
          (hd.position.set(0, 0.78 - ke * 0.78 + 0.33, -0.5), xe.add(hd));
        }
        (xe.position.set(me, ue, Ce),
          (xe.rotation.y = Pe),
          se.add(xe),
          N.push({ axis: $, red: rt, yellow: vt, green: Mt, control: se.userData.control, _st: "" }));
      },
      U = (se, $, me) => {
        const ue = ge(se, $),
          Ce = { type: "signal", x: se, z: $, phase: (me % 4) * 2.1 };
        We.set(ue, Ce);
        const Pe = He(se, $),
          xe = new Group();
        xe.userData.control = Ce;
        const Ke = o * 0.72,
          rt = o * 0.72,
          vt = new Mesh(new CylinderGeometry(0.18, 0.24, 8.2, 8), O);
        (vt.position.set(Ke, 4.1, rt), xe.add(vt));
        const Mt = new Mesh(new BoxGeometry(o * 1.65, 0.2, 0.2), O);
        (Mt.position.set(Ke - o * 0.72, 8, rt), xe.add(Mt));
        const ut = new Mesh(new BoxGeometry(0.2, 0.2, o * 1.65), O);
        (ut.position.set(Ke, 7.55, rt - o * 0.72),
          xe.add(ut),
          w(xe, "ns", Ke - o * 1.24, 7.52, rt, 0),
          w(xe, "ns", Ke - o * 0.18, 7.52, -rt, Math.PI),
          w(xe, "ew", Ke, 7.05, rt - o * 1.24, Math.PI / 2),
          w(xe, "ew", -Ke, 7.05, rt - o * 0.18, -Math.PI / 2),
          addPedSignals(xe, Ce, Ke, rt, se, $, Pe),
          xe.position.set(se, Pe, $),
          xe.traverse((ke) => {
            ((ke.castShadow = !0), (ke.receiveShadow = !0));
          }),
          i.add(xe));
      },
      V = (se, $, me) => {
        const ue = ge(se, $);
        We.set(ue, { type: "stop", x: se, z: $, phase: 0 });
        const Ce = He(se, $),
          Pe = new Group(),
          xe = me % 2 ? -1 : 1,
          Ke = me % 3 ? 1 : -1,
          rt = new Mesh(new CylinderGeometry(0.12, 0.16, 4.2, 7), O);
        ((rt.position.y = 2.1), Pe.add(rt));
        const vt = new Mesh(new CircleGeometry(1.04, 8), oe);
        ((vt.position.y = 4.55), (vt.rotation.y = Math.PI), Pe.add(vt));
        const Mt = new Mesh(new PlaneGeometry(2.05, 2.05), ee);
        (Mt.position.set(0, 4.55, -0.04),
          Pe.add(Mt),
          Pe.position.set(se + xe * o * 0.74, Ce, $ + Ke * o * 0.74),
          (Pe.rotation.y = Math.atan2(xe, Ke)),
          Pe.traverse((ut) => {
            ((ut.castShadow = !0), (ut.receiveShadow = !0));
          }),
          i.add(Pe));
      };
    let H = 0,
      z = 0;
    for (let se = 1; se < l.length - 1; se++)
      for (let $ = 1; $ < d.length - 1; $++) {
        const me = l[se],
          ue = d[$];
        if (Pn(me, ue, o * 0.9).clearance < 2) continue;
        const Ce = Math.abs(me - 80) <= a * 1.05 && ue <= s && ue >= -560,
          Pe = ue < -260 && ue > -1180 && (se + $) % 4 === 0,
          xe = ue > -360 && (se + $) % 2 === 0;
        (Ce && $ % 2 === 0) || Pe ? U(me, ue, H++) : (xe || ((se + $) % 5 === 0 && ue > -820)) && V(me, ue, z++);
      }
    return (
      Bn(i, (se) => {
        ((signalLampSys.headsRef = N), (signalLampSys.heads = N.length));
        ((signalLampSys.states.g = 0), (signalLampSys.states.y = 0), (signalLampSys.states.r = 0));
        for (const $ of N) {
          const me = we($.control, se),
            st2 = signalLampSys.enabled ? (me.green === $.axis ? "g" : me.yellow === $.axis ? "y" : "r") : "x";
          if ((signalLampSys.states[st2] !== void 0 && signalLampSys.states[st2]++, $._st !== st2)) {
            $._st = st2;
            if (st2 === "x")
              (($.red.color.setHex(16724008), $.yellow.color.setHex(16767053), $.green.color.setHex(4521842)),
                (($.red.emissiveIntensity = 0.12), ($.yellow.emissiveIntensity = 0.12), ($.green.emissiveIntensity = 0.1)));
            else
              (($.red.color.setHex(st2 === "r" ? 16724008 : 3017480),
                $.yellow.color.setHex(st2 === "y" ? 16767053 : 3352072),
                $.green.color.setHex(st2 === "g" ? 4521842 : 666136)),
                (($.red.emissiveIntensity = st2 === "r" ? 2.3 : 0),
                  ($.yellow.emissiveIntensity = st2 === "y" ? 2.6 : 0),
                  ($.green.emissiveIntensity = st2 === "g" ? 2.6 : 0)));
          }
        }
        let walking = 0;
        for (const P of PS) {
          const st = we(P.control, se),
            aW = st.green === "ew",
            bW = st.green === "ns";
          ((P.walkA.visible = aW), (P.handA.visible = !aW), (P.walkB.visible = bW), (P.handB.visible = !bW));
          ((P.walkEW = aW), (P.walkNS = bW));
          walking += (aW ? 1 : 0) + (bW ? 1 : 0);
        }
        ((qe.pedWalkFaces = walking), (ambientSys.signals = PS));
      }),
      { trafficLights: H, stopSigns: z }
    );
  }
  const je = nt();
  (F1(i, f, { X0: t, X1: n, ZN: s, ZF: r, pitch: a, streetW: o, trafficControls: We }),
    (qe.trafficLights = je.trafficLights),
    (qe.stopSigns = je.stopSigns));
  const Ne = new CylinderGeometry(0.12, 0.16, 7.2, 7),
    st = new SphereGeometry(0.46, 10, 8),
    k = new PlaneGeometry(2.8, 13),
    De = new MeshStandardMaterial({ color: 1581353, roughness: 0.42, metalness: 0.68 }),
    Ee = new MeshStandardMaterial({ color: 16769696, roughness: 0.12, metalness: 0.04, emissive: 16761178, emissiveIntensity: 1.6 }),
    Ae = new MeshBasicMaterial({ color: 16760163, transparent: !0, opacity: 0.07, depthWrite: !1, side: DoubleSide, blending: AdditiveBlending }),
    ve = y1(),
    he = new SpriteMaterial({
      map: ve,
      color: 16765818,
      transparent: !0,
      opacity: 0.68,
      depthWrite: !1,
      depthTest: !0,
      blending: AdditiveBlending,
    }),
    Be = 132,
    it = new InstancedMesh(Ne, De, Be),
    It = new InstancedMesh(st, Ee, Be),
    Tt = new InstancedMesh(k, Ae, Be);
  let Yt = 0;
  for (let N = 0; N < Be * 2 && Yt < Be; N++) {
    const O = Math.random() < 0.5,
      Y = O
        ? t + Math.round(Math.random() * ((n - t) / a)) * a + (Math.random() < 0.5 ? -1 : 1) * (o * 0.58)
        : t + Math.random() * (n - t),
      j = O
        ? r + Math.random() * (s - r)
        : s - Math.round(Math.random() * ((s - r) / a)) * a + (Math.random() < 0.5 ? -1 : 1) * (o * 0.58);
    if (Pn(Y, j, 3).clearance < 2) continue;
    const ee = He(Y, j);
    (e.quaternion.identity(),
      e.position.set(Y, ee + 3.6, j),
      e.scale.set(1, 1, 1),
      e.updateMatrix(),
      it.setMatrixAt(Yt, e.matrix),
      e.position.set(Y, ee + 7.5, j),
      e.updateMatrix(),
      It.setMatrixAt(Yt, e.matrix));
    const oe = new Sprite(he);
    oe.position.set(Y, ee + 7.5, j);
    const re = 6.2 + Math.random() * 2.4;
    (oe.scale.set(re, re, 1),
      i.add(oe),
      Qi.streetGlowSprites++,
      e.position.set(Y, ee + 0.72, j),
      e.quaternion.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2),
      e.rotateZ(O ? 0 : Math.PI / 2),
      e.scale.set(1, 1, 1),
      e.updateMatrix(),
      Tt.setMatrixAt(Yt, e.matrix),
      Yt++);
  }
  ((it.count = Yt),
    (It.count = Yt),
    (Tt.count = Yt),
    (it.instanceMatrix.needsUpdate = !0),
    (It.instanceMatrix.needsUpdate = !0),
    (Tt.instanceMatrix.needsUpdate = !0),
    i.add(it, It, Tt),
    (qe.streetLights = Yt),
    i.add(new Mesh(m([{ x0: 64, z0: 345, x1: 64, z1: -720 }], 5.6, 0.74), M)),
    i.add(new Mesh(m([{ x0: 96, z0: 345, x1: 96, z1: -720 }], 5.6, 0.74), M)),
    i.add(
      new Mesh(
        m(
          [
            { x0: 70, z0: 345, x1: 70, z1: -720 },
            { x0: 90, z0: 345, x1: 90, z1: -720 },
          ],
          0.26,
          0.82,
        ),
        x,
      ),
    ),
    i.add(new Mesh(m([{ x0: 80, z0: 345, x1: 80, z1: -720 }], 0.78, 0.83), g)));
  const Sn = new MeshStandardMaterial({ color: 16768876, roughness: 0.34, metalness: 0.05, emissive: 8013824, emissiveIntensity: 0.24 });
  for (let N = 330; N >= -700; N -= 32) {
    const O = new Mesh(new BoxGeometry(1.15, 0.09, 13.5), Sn);
    (O.position.set(80, He(80, N) + 0.9, N), (O.receiveShadow = !0), i.add(O));
  }
  for (const N of [286, 156, 26, -104])
    for (let O = 0; O < 7; O++) {
      const Y = new Mesh(new BoxGeometry(2, 0.08, 11.8), h),
        j = 71.2 + O * 2.95;
      (Y.position.set(j, He(j, N) + 0.91, N),
        (Y.receiveShadow = !0),
        i.add(Y),
        bi("roadDetails", "openerCrosswalkStripes"));
    }
  function Ir(N, O, Y, j = !1) {
    const ee = He(N, O),
      oe = new Group(),
      re = new Mesh(new CylinderGeometry(0.16, 0.22, 9.5, 8), De);
    ((re.position.y = 4.75), oe.add(re));
    const w = new Mesh(new BoxGeometry(3.8, 0.22, 0.22), De);
    (w.position.set(Y * 1.75, 8.95, 0), oe.add(w));
    const U = new Mesh(new SphereGeometry(0.62, 12, 8), Ee);
    (U.position.set(Y * 3.6, 8.82, 0), oe.add(U));
    const V = new Sprite(he.clone());
    (V.position.copy(U.position),
      (V.material.opacity = 0.78 + Math.random() * 0.12),
      V.scale.set(8.8, 8.8, 1),
      oe.add(V),
      Qi.streetGlowSprites++);
    const H = new Mesh(new PlaneGeometry(3.2, 15), Ae.clone());
    if (
      (H.position.set(Y * 2.8, 0.72, 0),
      (H.rotation.x = -Math.PI / 2),
      (H.scale.y = 0.7 + Math.random() * 0.35),
      oe.add(H),
      j)
    ) {
      const z = new PointLight(16762474, 4.4, 66, 2);
      (z.position.copy(U.position), oe.add(z));
    }
    (oe.position.set(N, ee, O), i.add(oe), qe.streetLights++);
  }
  let Xs = 0;
  for (let N = 340; N >= -700; N -= 118) (Ir(63, N, 1, Xs++ % 3 === 0), Ir(97, N - 42, -1, Xs++ % 3 === 0));
  function ii(N, O, Y, j, ee = 6010942) {
    const oe = new MeshStandardMaterial({ color: ee, roughness: 0.92, metalness: 0.01 }),
      re = new Mesh(new BoxGeometry(Y, 0.08, j), oe);
    return (re.position.set(N, He(N, O) + 0.06, O), (re.receiveShadow = !0), i.add(re), qe.openerProps++, re);
  }
  function En(N, O, Y = 1) {
    const j = He(N, O),
      ee = new Group(),
      oe = new Mesh(new CylinderGeometry(0.35, 0.55, 5.5, 8), new MeshStandardMaterial({ color: 6832160, roughness: 0.88 }));
    ((oe.position.y = 2.75), ee.add(oe));
    const re = new MeshStandardMaterial({ color: 6065982, roughness: 0.86 }),
      w = new MeshStandardMaterial({ color: 3959601, roughness: 0.9 }),
      U = [
        [-1.7, 5.9, 0, 2.7],
        [1.3, 6.1, 0.2, 2.9],
        [0, 7.1, -0.4, 3],
        [0.4, 5.5, 1.6, 2.4],
        [-0.6, 5.7, -1.6, 2.4],
      ];
    for (let V = 0; V < U.length; V++) {
      const [H, z, se, $] = U[V],
        me = new Mesh(new SphereGeometry($, 12, 8), V % 2 ? w : re);
      (me.position.set(H, z, se), (me.scale.y = 0.78), (me.castShadow = !0), ee.add(me));
    }
    return (
      ee.position.set(N, j, O),
      ee.scale.setScalar(Y),
      i.add(ee),
      Di.push({ kind: "tree", x: N, z: O, radius: 3.4 * Y, maxY: j + 11 * Y }),
      qe.openerProps++,
      ee
    );
  }
  function Ys(N, O, Y = 15) {
    const j = new MeshStandardMaterial({ color: 10129021, roughness: 0.98, flatShading: !0, side: DoubleSide }),
      ee = new Mesh(new IcosahedronGeometry(Y, 2), j),
      oe = ee.geometry.attributes.position;
    for (let re = 0; re < oe.count; re++) {
      const w = oe.getX(re),
        U = oe.getY(re),
        V = oe.getZ(re),
        H = 0.86 + Math.sin(re * 17.1) * 0.09 + Math.cos(re * 9.3) * 0.07;
      oe.setXYZ(
        re,
        w * (1.15 + (re % 3) * 0.06) * H,
        U * (0.72 + (re % 5) * 0.035) * H,
        V * (0.92 + (re % 4) * 0.05) * H,
      );
    }
    return (
      (oe.needsUpdate = !0),
      ee.geometry.computeVertexNormals(),
      ee.position.set(N, He(N, O) + Y * 0.46, O),
      ee.rotation.set(0.34, -0.72, 0.18),
      (ee.castShadow = !0),
      (ee.receiveShadow = !0),
      i.add(ee),
      Di.push({ kind: "rock", x: N, z: O, radius: Y * 0.98, maxY: ee.position.y + Y * 0.68 }),
      qe.openerProps++,
      ee
    );
  }
  function Ur(N, O, Y = 0) {
    const j = new Group(),
      ee = new MeshStandardMaterial({ color: 10970418, roughness: 0.64, metalness: 0.04 }),
      oe = new MeshStandardMaterial({ color: 1910317, roughness: 0.46, metalness: 0.5 });
    for (const re of [1.05, 1.55]) {
      const w = new Mesh(new BoxGeometry(6.8, 0.22, 0.44), ee);
      ((w.position.y = re), j.add(w));
    }
    for (const re of [-2.7, 2.7]) {
      const w = new Mesh(new BoxGeometry(0.22, 1.2, 0.35), oe);
      (w.position.set(re, 0.62, 0), j.add(w));
    }
    (j.position.set(N, He(N, O), O), (j.rotation.y = Y), i.add(j), qe.openerProps++);
  }
  function Fr(N, O) {
    const Y = new MeshStandardMaterial({ color: 14164770, roughness: 0.34, metalness: 0.18, emissive: 4850949, emissiveIntensity: 0.18 }),
      j = new Group(),
      ee = new Mesh(new CylinderGeometry(0.34, 0.42, 1.25, 12), Y);
    ((ee.position.y = 0.65), j.add(ee));
    const oe = new Mesh(new SphereGeometry(0.42, 12, 8), Y);
    ((oe.position.y = 1.32), j.add(oe));
    const re = new Mesh(new CylinderGeometry(0.16, 0.16, 1.1, 10), Y);
    ((re.rotation.z = Math.PI / 2),
      (re.position.y = 0.9),
      j.add(re),
      j.position.set(N, He(N, O), O),
      i.add(j),
      qe.openerProps++);
  }
  function rs(N, O, Y = 0) {
    const j = new Group(),
      ee = new MeshStandardMaterial({ color: 1185821, roughness: 0.36, metalness: 0.68 }),
      oe = new MeshStandardMaterial({
        color: 10283263,
        roughness: 0.08,
        metalness: 0.02,
        transparent: !0,
        opacity: 0.42,
        emissive: 1194833,
        emissiveIntensity: 0.18,
      }),
      re = new MeshStandardMaterial({ color: 2370611, roughness: 0.42, metalness: 0.32 }),
      w = new Mesh(new BoxGeometry(8.5, 0.35, 3.2), re);
    ((w.position.y = 4.2), j.add(w));
    for (const H of [-3.8, 3.8]) {
      const z = new Mesh(new CylinderGeometry(0.09, 0.11, 4.1, 7), ee);
      (z.position.set(H, 2.05, -1.25), j.add(z));
    }
    const U = new Mesh(new BoxGeometry(8, 2.8, 0.08), oe);
    (U.position.set(0, 2.2, 1.35), j.add(U));
    const V = new Mesh(new PlaneGeometry(2.3, 2.8), new MeshBasicMaterial({ map: Eo("BUS", "#4ff3ff"), transparent: !0, side: DoubleSide }));
    (V.position.set(-2.4, 2.2, 1.42),
      j.add(V),
      j.position.set(N, He(N, O), O),
      (j.rotation.y = Y),
      i.add(j),
      Xi("bus-shelter-ad", N, He(N, O) + 2.2, O),
      qe.openerProps++);
  }
  function en(N, O, Y, j, ee, oe, re, w = null, U = 0) {
    if (Hi(N, O, Y, j, 12)) return !1;
    const V = He(N, O) - 0.45;
    if (Wi(N, O, Y, j, V + ee + 2)) return !1;
    const H = N < 80 ? 1 : -1,
      z = new MeshStandardMaterial({
        map: As(192, 512, re, 2),
        color: oe,
        roughness: 0.24,
        metalness: 0.36,
        emissive: 2060177,
        emissiveIntensity: 0.5,
        envMapIntensity: 1.4,
      }),
      se = new Mesh(new BoxGeometry(Y, ee, j), z);
    (se.position.set(N, V + ee / 2, O), (se.castShadow = !1), (se.receiveShadow = !0), i.add(se));
    const $ = new MeshStandardMaterial({
        map: As(220, 620, Math.min(0.86, re + 0.18), 2),
        color: 10481407,
        roughness: 0.12,
        metalness: 0.28,
        emissive: 1740466,
        emissiveIntensity: 0.32,
        envMapIntensity: 1.55,
        transparent: !0,
        opacity: 0.96,
        side: DoubleSide,
      }),
      me = new Mesh(new PlaneGeometry(j * 0.78, ee * 0.74), $);
    (me.position.set(N + H * (Y / 2 + 0.09), V + ee * 0.54, O),
      (me.rotation.y = H > 0 ? Math.PI / 2 : -Math.PI / 2),
      i.add(me));
    for (const Pe of [-1, 1]) {
      const xe = new Mesh(new PlaneGeometry(Y * 0.82, ee * 0.72), $.clone());
      (xe.position.set(N, V + ee * 0.55, O + Pe * (j / 2 + 0.1)), (xe.rotation.y = Pe > 0 ? 0 : Math.PI), i.add(xe));
    }
    const ue = new Mesh(new BoxGeometry(Y * 1.04, 1.2, j * 1.04), new MeshStandardMaterial({ color: 1778733, roughness: 0.34, metalness: 0.38 }));
    (ue.position.set(N, V + ee + 0.7, O), i.add(ue));
    const Ce = new MeshStandardMaterial({ color: 6547967, roughness: 0.12, metalness: 0.12, emissive: 2543615, emissiveIntensity: 2.2 });
    for (const Pe of [-1, 1]) {
      const xe = new Mesh(new BoxGeometry(Y * 1.1, 0.22, 0.18), Ce);
      (xe.position.set(N, V + ee + 1.4, O + Pe * (j / 2 + 0.18)), i.add(xe));
    }
    if (w && U) {
      const Pe = new MeshBasicMaterial({
          map: Ah(w, w === "HOTEL" ? "#ff4fb7" : "#ffd45b"),
          transparent: !0,
          side: DoubleSide,
          depthWrite: !1,
        }),
        xe = new Mesh(new PlaneGeometry(7.5, 24), Pe);
      (xe.position.set(N + U * (Y / 2 + 0.3), V + Math.min(ee - 8, ee * 0.58), O),
        (xe.rotation.y = U > 0 ? Math.PI / 2 : -Math.PI / 2),
        i.add(xe),
        Xi("showcase-neon", xe.position.x, xe.position.y, xe.position.z));
    }
    return (Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: V + ee + 2 }), Dt("showcase", "glassTower"), !0);
  }
  function as(N, O, Y, j = 3.2) {
    const ee = N * 0.5 + j,
      oe = O * 0.5 + j,
      re = Math.max(2, Math.abs(ee - oe) * 0.72),
      U =
        N >= O
          ? [
              -ee,
              0,
              -oe,
              ee,
              0,
              -oe,
              re,
              Y,
              0,
              -ee,
              0,
              -oe,
              re,
              Y,
              0,
              -re,
              Y,
              0,
              ee,
              0,
              -oe,
              ee,
              0,
              oe,
              re,
              Y,
              0,
              ee,
              0,
              oe,
              -ee,
              0,
              oe,
              -re,
              Y,
              0,
              ee,
              0,
              oe,
              re,
              Y,
              0,
              -re,
              Y,
              0,
              -ee,
              0,
              oe,
              -ee,
              0,
              -oe,
              -re,
              Y,
              0,
            ]
          : [
              -ee,
              0,
              -oe,
              ee,
              0,
              -oe,
              0,
              Y,
              -re,
              ee,
              0,
              -oe,
              ee,
              0,
              oe,
              0,
              Y,
              re,
              ee,
              0,
              -oe,
              0,
              Y,
              re,
              0,
              Y,
              -re,
              ee,
              0,
              oe,
              -ee,
              0,
              oe,
              0,
              Y,
              re,
              -ee,
              0,
              oe,
              -ee,
              0,
              -oe,
              0,
              Y,
              -re,
              -ee,
              0,
              oe,
              0,
              Y,
              -re,
              0,
              Y,
              re,
            ],
      V = new BufferGeometry();
    return (V.setAttribute("position", new Float32BufferAttribute(U, 3)), V.computeVertexNormals(), V);
  }
  function qs(N, O, Y, j, ee, oe, re = {}) {
    if (Hi(N, O, Y, j, 12)) return !1;
    const w = He(N, O) - 0.3;
    if (Wi(N, O, Y, j, w + ee + (re.roofH ?? 8.2) + 1, 6)) return !1;
    const U = re.frontZ ?? -1,
      V = new MeshStandardMaterial({ map: B, color: re.wallColor ?? 14734788, roughness: 0.68, metalness: 0.03 }),
      H = new Mesh(new BoxGeometry(Y, ee, j), V);
    (H.position.set(N, w + ee / 2, O), (H.castShadow = !0), (H.receiveShadow = !0), i.add(H));
    const z = new MeshStandardMaterial({
        map: dt,
        color: oe,
        roughness: 0.58,
        metalness: 0.08,
        emissive: 2951172,
        emissiveIntensity: 0.08,
      }),
      se = re.roofH ?? 8.2,
      $ = new Mesh(as(Y, j, se), z);
    ($.position.set(N, w + ee, O), ($.castShadow = !0), ($.receiveShadow = !0), i.add($));
    const me = new MeshStandardMaterial({ color: 15985112, roughness: 0.42, metalness: 0.05 }),
      ue = new Mesh(new BoxGeometry(Y + 7, 0.42, 1.2), me);
    (ue.position.set(N, w + ee + 0.12, O + U * (j * 0.5 + 1.4)), i.add(ue));
    const Ce = ue.clone();
    ((Ce.position.z = O - U * (j * 0.5 + 1.4)), i.add(Ce));
    const Pe = Math.min(18, Y * 0.38),
      xe = new Mesh(new BoxGeometry(Pe, ee * 0.55, 0.32), new MeshStandardMaterial({ map: lt, roughness: 0.34, metalness: 0.2 }));
    (xe.position.set(N + Y * 0.18, w + ee * 0.33, O + U * (j * 0.5 + 0.22)), i.add(xe));
    const Ke = new Mesh(
      new BoxGeometry(5.2, 7.2, 0.28),
      new MeshStandardMaterial({ color: 4602418, roughness: 0.36, emissive: 4857353, emissiveIntensity: 0.16 }),
    );
    (Ke.position.set(N - Y * 0.25, w + 3.7, O + U * (j / 2 + 0.24)), i.add(Ke));
    const rt = new MeshStandardMaterial({
        color: 16764800,
        roughness: 0.18,
        metalness: 0.04,
        emissive: 16754767,
        emissiveIntensity: 0.72,
      }),
      vt = new MeshStandardMaterial({ color: 3353638, roughness: 0.38 });
    for (const tn of [-Y * 0.36, -Y * 0.05, Y * 0.38]) {
      if (Math.abs(tn - Y * 0.18) < Pe * 0.45) continue;
      const qt = new Mesh(new BoxGeometry(6.2, 4.8, 0.26), vt);
      (qt.position.set(N + tn, w + ee * 0.58, O + U * (j * 0.5 + 0.28)), i.add(qt));
      const An = new Mesh(new BoxGeometry(4.8, 3.4, 0.3), rt);
      (An.position.copy(qt.position), (An.position.z += U * 0.04), i.add(An));
    }
    const Mt = new MeshStandardMaterial({ color: 12370619, roughness: 0.44, metalness: 0.04 }),
      ut = new Mesh(new BoxGeometry(Pe * 1.18, 0.12, 34), Mt);
    (ut.position.set(N + Y * 0.18, He(N + Y * 0.18, O + U * (j * 0.5 + 17)) + 0.11, O + U * (j * 0.5 + 17)), i.add(ut));
    const ke = new MeshStandardMaterial({ color: 5679925, roughness: 0.86, metalness: 0.01 }),
      yt = new Mesh(new BoxGeometry(Y + 10, 0.08, j + 12), ke);
    (yt.position.set(N, He(N, O) - 0.18, O), (yt.receiveShadow = !0), i.add(yt), (yt.renderOrder = -1));
    const mt = new MeshStandardMaterial({ color: 3042609, roughness: 0.84 }),
      kt = [
        new MeshStandardMaterial({ color: 16766544, roughness: 0.58 }),
        new MeshStandardMaterial({ color: 16738974, roughness: 0.58 }),
        new MeshStandardMaterial({ color: 16314584, roughness: 0.58 }),
      ];
    for (let tn = 0; tn < 9; tn++) {
      const qt = N - Y * 0.44 + tn * (Y * 0.11),
        An = O + U * (j * 0.5 + 2.2 + (tn % 2) * 1.5),
        Nt = new Mesh(new SphereGeometry(1.35 + (tn % 3) * 0.22, 10, 7), tn % 4 === 0 ? kt[tn % kt.length] : mt);
      (Nt.position.set(qt, He(qt, An) + 0.95, An), (Nt.scale.y = 0.72), (Nt.castShadow = !0), i.add(Nt));
    }
    return (Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: w + ee + 5 }), Dt("showcase", "lowStorefront"), !0);
  }
  return (
    ii(45, 318, 36, 84, 6404169),
    ii(116, 318, 36, 84, 6074179),
    ii(44, 188, 34, 84, 6798662),
    ii(118, 188, 36, 84, 5941822),
    ii(43, 60, 34, 82, 5679164),
    ii(118, 60, 36, 82, 6864197),
    en(18, 315, 70, 54, 154, 2311775, 0.72, "HOTEL", 1),
    en(17, 185, 72, 58, 188, 1522779, 0.78, null, 0),
    en(31, 55, 44, 56, 138, 2840688, 0.66, "OPEN", 1),
    en(24, -75, 52, 64, 182, 1913933, 0.7, null, 0),
    en(145, 315, 68, 54, 116, 2776440, 0.72, null, 0),
    en(146, 185, 70, 58, 146, 2314602, 0.76, null, 0),
    en(142, 55, 42, 56, 156, 1590364, 0.68, "CAFE", -1),
    en(134, -75, 48, 64, 114, 3688540, 0.62, null, 0),
    en(-70, 315, 52, 52, 146, 2112085, 0.68, null, 0),
    en(228, 185, 48, 58, 148, 3235186, 0.66, null, 0),
    en(-78, 185, 48, 56, 134, 2181730, 0.68, null, 0),
    en(236, 315, 44, 54, 104, 3104884, 0.66, null, 0),
    qs(-145, 315, 46, 42, 12, 13126954, { wallColor: 14274231, frontZ: 1, roofH: 6.4 }),
    qs(228, 315, 52, 42, 13, 13390888, { wallColor: 14734010, frontZ: 1, roofH: 6.6 }),
    en(-48, -360, 54, 56, 148, 2439765, 0.58, null, 0),
    en(172, -430, 50, 56, 132, 3817032, 0.66, "OPEN", -1),
    En(112, 227, 1.35),
    En(104, 221, 1.05),
    En(121, 233, 1.15),
    Ur(112, 217, 0),
    En(50, 292, 1.2),
    En(111, 316, 0.95),
    En(48, 137, 0.9),
    En(116, 102, 1.05),
    Ur(47, 248, Math.PI / 2),
    Fr(57, 226),
    rs(111, 260, -Math.PI / 2),
    et.add(i),
    i
  );
}
function Vd(
  i,
  { dirSel: e = 1, rampType: t = "on", merge: n = 16, runBack: s = 165, runOut: r = 52, label: a = "ON RAMP" } = {},
) {
  const o = St(n),
    c = new Vector3(o.tangent.x, 0, o.tangent.z).normalize(),
    l = new Vector3().crossVectors(on, c).normalize(),
    d = o.p.clone().addScaledVector(o.side, e * ce.width * 0.5),
    f = t === "off" ? 1 : -1,
    p = d.x + c.x * s * f + l.x * e * r,
    m = d.z + c.z * s * f + l.z * e * r,
    g = new Vector3(p, He(p, m) + 0.4, m),
    M = t === "off" ? d : g,
    x = t === "off" ? g : d,
    h = 26,
    _ = [];
  for (let X = 0; X <= h; X++) {
    const Q = X / h,
      ie = Q * Q * (3 - 2 * Q),
      de = t === "off" ? 1 - (1 - Q) * (1 - Q) : ie;
    _.push(new Vector3(MathUtils.lerp(M.x, x.x, Q), MathUtils.lerp(M.y, x.y, de), MathUtils.lerp(M.z, x.z, Q)));
  }
  const v = 7.4,
    y = new Vector3(),
    E = new Vector3(),
    T = [],
    R = [];
  for (let X = 0; X <= h; X++)
    (E.subVectors(_[Math.min(h, X + 1)], _[Math.max(0, X - 1)]),
      (E.y = 0),
      E.normalize(),
      y.crossVectors(on, E).normalize(),
      T.push(_[X].clone().addScaledVector(y, -v)),
      R.push(_[X].clone().addScaledVector(y, v)));
  const C = {
    kind: "ramp",
    rampType: t,
    halfW: v,
    dirSel: e,
    mergeS: n,
    exitS: n,
    points: _.map((X) => X.clone()),
    segments: [],
  };
  for (let X = 0; X < h; X++) {
    const Q = _[X],
      ie = _[X + 1],
      de = ie.x - Q.x,
      pe = ie.z - Q.z,
      ze = Math.max(1e-4, de * de + pe * pe);
    C.segments.push({ a: Q.clone(), b: ie.clone(), abx: de, abz: pe, lenSq: ze, u0: X / h, u1: (X + 1) / h });
  }
  Dr.push(C);
  const b = [];
  for (let X = 0; X < h; X++) {
    const Q = T[X],
      ie = R[X],
      de = T[X + 1],
      pe = R[X + 1];
    (b.push(Q.x, Q.y, Q.z, ie.x, ie.y, ie.z, pe.x, pe.y, pe.z),
      b.push(Q.x, Q.y, Q.z, pe.x, pe.y, pe.z, de.x, de.y, de.z));
  }
  const S = new BufferGeometry();
  (S.setAttribute("position", new Float32BufferAttribute(b, 3)), S.computeVertexNormals());
  const L = new MeshStandardMaterial({
    color: t === "off" ? 5003356 : 4607826,
    roughness: 0.82,
    metalness: 0.04,
    emissive: t === "off" ? 463123 : 331023,
    emissiveIntensity: 0.22,
    side: DoubleSide,
  });
  i.add(new Mesh(S, L));
  const F = new MeshStandardMaterial({ color: 12107972, roughness: 0.5, metalness: 0.4 });
  for (let X = 0; X < h; X++)
    (gn(i, T[X].clone().setY(T[X].y + 1), T[X + 1].clone().setY(T[X + 1].y + 1), 0.16, F),
      gn(i, R[X].clone().setY(R[X].y + 1), R[X + 1].clone().setY(R[X + 1].y + 1), 0.16, F));
  const W = new MeshStandardMaterial({ color: 7173241, roughness: 0.82 });
  for (let X = 3; X < h; X += 3) {
    const Q = _[X],
      ie = He(Q.x, Q.z),
      de = Q.y - ie;
    if (de < 3) continue;
    // Never plant a ramp support in a driving lane — the ramp simply spans the road there.
    if (Hi(Q.x, Q.z, 3.2, 3.2, 1.2)) continue;
    const pe = new Mesh(new CylinderGeometry(0.9, 1.15, de, 8), W);
    (pe.position.set(Q.x, ie + de / 2, Q.z), i.add(pe), $n.push({ x: Q.x, z: Q.z, hw: 1.3, hd: 1.3, maxY: Q.y - 0.9 }));
  }
  const te = new MeshBasicMaterial({ map: ol(a), transparent: !0, side: DoubleSide }),
    ne = new Mesh(new PlaneGeometry(12, 3), te);
  (ne.position.copy(t === "off" ? d : g).add(new Vector3(0, t === "off" ? 6.2 : 5.5, 0)),
    (ne.rotation.y = Math.atan2(-c.x, -c.z) + (t === "off" ? Math.PI : 0)),
    i.add(ne));
  for (const X of [-1, 1]) {
    const Q = new Mesh(new CylinderGeometry(0.2, 0.26, 6, 6), W),
      ie = t === "off" ? d : g;
    (Q.position.set(ie.x + l.x * X * 5.4, ie.y + 3, ie.z + l.z * X * 5.4), i.add(Q));
  }
}
function O1(i, e = 1) {
  Vd(i, { dirSel: e, rampType: "on", merge: 16, runBack: 165, runOut: 52, label: "ON RAMP" });
}
function B1(i, e = -1) {
  Vd(i, { dirSel: e, rampType: "off", merge: 220, runBack: 190, runOut: 62, label: "OFF RAMP" });
}
function z1() {
  const i = new Group(),
    e = [],
    t = new Color(14170671),
    n = new Color(15922680),
    s = new MeshStandardMaterial({ color: 3883336, roughness: 0.6, metalness: 0.3 }),
    r = new MeshBasicMaterial({ map: k1(), transparent: !0, side: DoubleSide }),
    a = new MeshStandardMaterial({ color: 4926748, roughness: 0.9 }),
    o = [
      new MeshStandardMaterial({ color: 2055221, roughness: 0.92 }),
      new MeshStandardMaterial({ color: 3109954, roughness: 0.95 }),
      new MeshStandardMaterial({ color: 2583370, roughness: 0.9 }),
    ],
    c = new MeshStandardMaterial({ color: 7040883, roughness: 0.95, side: DoubleSide }),
    l = 12,
    d = [],
    f = [];
  let p = 0;
  for (let g = 0; g < ce.length; g += l) {
    if (Li(g + l * 0.5)) {
      p++;
      continue;
    }
    const M = St(g),
      x = St(g + l),
      h = M.p.clone().add(x.p).multiplyScalar(0.5),
      { sideways: _, normal: v, q: y } = ui(M, x);
    for (const E of [-1, 1]) {
      const T = h
        .clone()
        .addScaledVector(_, E * ce.width * 0.5)
        .addScaledVector(v, 0.5);
      (d.push(T), f.push(y), e.push(p % 2 === 0 ? t : n));
    }
    if (p % 16 === 8) {
      const E = (p >> 4) % 2 ? 1 : -1,
        T = h
          .clone()
          .addScaledVector(_, E * ce.width * 0.52)
          .addScaledVector(v, 0.4),
        R = new Group(),
        C = new Mesh(new PlaneGeometry(4.4, 2.6), r);
      ((C.position.y = 3.4), (C.rotation.y = Math.PI), R.add(C));
      const b = new CylinderGeometry(0.12, 0.16, 3.4, 5);
      for (const S of [-1.5, 1.5]) {
        const L = new Mesh(b, s);
        (L.position.set(S, 1.7, 0), R.add(L));
      }
      (R.position.copy(T), R.quaternion.copy(y), i.add(R));
    }
    p++;
  }
  for (let g = 0; g < ce.length; g += 16) {
    const M = St(g),
      x = 1 + (Math.random() < 0.5 ? 1 : 0);
    for (let h = 0; h < x; h++) {
      const _ = Math.random() < 0.5 ? -1 : 1,
        v = ce.width / 2 + 12 + Math.random() * 78,
        y = M.p.x + M.side.x * v * _ + (Math.random() - 0.5) * 16,
        E = M.p.z + M.side.z * v * _ + (Math.random() - 0.5) * 16;
      if (ka(y, E, 18) || Hi(y, E, 12, 12, 3.5)) continue;
      const T = He(y, E);
      if (Math.random() < 0.78) {
        const R = 0.7 + Math.random() * 1.5,
          C = new Group(),
          b = 2.4 + Math.random() * 4.2,
          S = new Mesh(new CylinderGeometry(0.26, 0.42, b, 6), a);
        ((S.position.y = b / 2), C.add(S));
        const L = 2 + Math.floor(Math.random() * 3);
        for (let F = 0; F < L; F++) {
          const W = new Mesh(
            new ConeGeometry(2.4 + Math.random() * 1.6 - F * 0.2, 4.6 + Math.random() * 2.4, 7),
            o[(h + F + g) % o.length],
          );
          ((W.position.y = b + F * 1.4 + 1.5), (W.rotation.y = Math.random() * Math.PI), C.add(W));
        }
        (C.position.set(y, T + 0.6, E), C.scale.setScalar(R), i.add(C));
      } else {
        const R = 1.4 + Math.random() * 3.6,
          C = new Mesh(new DodecahedronGeometry(R, 0), c);
        (C.position.set(y, T + R * 0.35, E),
          C.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
          C.scale.set(1, 0.7 + Math.random() * 0.4, 1),
          i.add(C),
          $n.push({ kind: "rock", x: y, z: E, radius: R * 1.18 }));
      }
    }
  }
  const m = ["START", "SECTOR 2", "SECTOR 3"];
  for (let g = 0; g < 3; g++) {
    const M = (ce.length * g) / 3 + 6;
    if (Li(M)) continue;
    const x = St(M),
      h = St(M + l),
      _ = x.p.clone().add(h.p).multiplyScalar(0.5),
      { q: v } = ui(x, h),
      y = ce.width * 0.5 + 1.2,
      E = 9,
      T = new Group(),
      R = new CylinderGeometry(0.4, 0.55, E, 7);
    for (const F of [-1, 1]) {
      const W = new Mesh(R, s);
      (W.position.set(F * y, E / 2, 0), T.add(W));
    }
    const C = y * 2,
      b = new Mesh(new BoxGeometry(C, 1.1, 1.1), s);
    ((b.position.y = E), T.add(b));
    const S = new MeshBasicMaterial({ map: ol(m[g]), transparent: !0, side: DoubleSide }),
      L = new Mesh(new PlaneGeometry(C * 0.82, 3), S);
    (L.position.set(0, E - 2, 0),
      (L.rotation.y = Math.PI),
      T.add(L),
      T.position.copy(_),
      T.quaternion.copy(v),
      i.add(T));
  }
  // zoom-detail 43 (round-five item 7): paddock clutter on the start aprons —
  // tire stacks, tool carts, fuel drums, cones, pennant bunting. Static
  // vcBaked single mesh in the same course frame the START gantry uses;
  // visual-only (raycast-inert, no colliders — same class as lawn trees).
  {
    ((paddockSys.clusters = 0), (paddockSys.parts = 0), (paddockSys.sample.length = 0));
    const pparts = [],
      pOne = new Vector3(1, 1, 1),
      prng = plateRng(0x9add0c),
      tireG = new CylinderGeometry(0.42, 0.42, 0.26, 10),
      hubG = new CylinderGeometry(0.16, 0.16, 0.27, 8),
      cartG = new BoxGeometry(0.92, 0.62, 0.56),
      wheelG = new CylinderGeometry(0.09, 0.09, 0.06, 8).rotateZ(Math.PI / 2),
      handleG = new BoxGeometry(0.05, 0.72, 0.05).rotateX(-0.5),
      coneG = new ConeGeometry(0.17, 0.42, 8),
      drumG = new CylinderGeometry(0.3, 0.3, 0.86, 10),
      poleG = new CylinderGeometry(0.03, 0.04, 2.3, 6),
      penG = new CircleGeometry(0.17, 3).rotateZ(Math.PI),
      PLIFT = 1.15,
      P = (geo, aM, lx, ly, lz, col, ry = 0) => {
        const m2 = new Matrix4().makeRotationY(ry);
        (m2.setPosition(lx, ly + PLIFT, lz), pparts.push(vcBake(geo, new Matrix4().multiplyMatrices(aM, m2), col)));
      },
      slabG = new BoxGeometry(5.6, 0.16, 3.6),
      PEN_COLS = [15021620, 16765778, 2780370, 13684944];
    for (const cd of [
      { ds: -9, side: -1, kind: 0 },
      { ds: -4, side: 1, kind: 1 },
      { ds: 4, side: 1, kind: 0 },
      { ds: 9, side: -1, kind: 1 },
    ]) {
      const sA = 6 + cd.ds;
      if (Li(sA)) continue;
      const a2 = St(sA),
        b2 = St(sA + l),
        qq = ui(a2, b2).q,
        right = new Vector3(1, 0, 0).applyQuaternion(qq),
        base = a2.p.clone().addScaledVector(right, cd.side * (ce.width * 0.5 + 2.4)),
        aM = new Matrix4().compose(base, qq, pOne);
      paddockSys.sample.length < 4 && paddockSys.sample.push({ x: +base.x.toFixed(1), y: +base.y.toFixed(1), z: +base.z.toFixed(1), kind: cd.kind });
      P(slabG, aM, 0.5, -0.08, 0, 4022096);
      if (cd.kind === 0) {
        for (const [tx, tz, n2] of [
          [-1.1, -0.4, 3],
          [0, 0.5, 4],
          [1.0, -0.2, 2],
        ])
          for (let t2 = 0; t2 < n2; t2++) {
            P(tireG, aM, tx + (prng() - 0.5) * 0.09, 0.13 + t2 * 0.26, tz + (prng() - 0.5) * 0.09, 1381400);
            P(hubG, aM, tx, 0.13 + t2 * 0.26, tz, 6316135);
          }
        P(cartG, aM, 2.1, 0.4, 0.3, 9315878, 0.3);
        for (const [wx, wz] of [
          [1.75, 0.62],
          [2.45, 0.62],
          [1.75, -0.02],
          [2.45, -0.02],
        ])
          P(wheelG, aM, wx, 0.09, wz, 1381400, 0.3);
        P(handleG, aM, 2.62, 0.62, 0.32, 6316135, 0.3);
        P(coneG, aM, 0.42, 0.21, 1.45, 14248476);
        P(coneG, aM, 1.5, 0.21, -1.05, 14248476);
      } else {
        P(drumG, aM, -0.82, 0.43, 0, 4886754);
        P(drumG, aM, -0.14, 0.43, 0.36, 9315878);
        for (let t2 = 0; t2 < 2; t2++) {
          P(tireG, aM, 1.05, 0.13 + t2 * 0.26, -0.2, 1381400);
          P(hubG, aM, 1.05, 0.13 + t2 * 0.26, -0.2, 6316135);
        }
        P(poleG, aM, -1.65, 1.15, -1.25, 6316135);
        P(poleG, aM, 1.85, 1.15, -1.25, 6316135);
        for (let pn = 0; pn < 8; pn++) {
          const t3 = (pn + 0.5) / 8,
            px2 = -1.65 + t3 * 3.5,
            py2 = 2.12 - Math.sin(t3 * Math.PI) * 0.16;
          P(penG, aM, px2, py2, -1.25, PEN_COLS[pn % 4]);
        }
      }
      paddockSys.clusters++;
    }
    if (pparts.length) {
      const pm2 = new Mesh(mergeGeometries(pparts, !1), vcMats().opaque);
      ((pm2.castShadow = !0), (pm2.receiveShadow = !0), (pm2.raycast = () => {}), i.add(pm2), (paddockSys._mesh = pm2), (paddockSys.parts = pparts.length));
      if (!paddockSys.enabled) pm2.visible = !1;
    }
  }
  // zoom-detail 49 (round-six item 2): RACING-LINE WEAR — a darkened rubber
  // ribbon following the course, swinging to the inside of corners (offset ∝
  // smoothed curvature), plus darker skid patches toward the outside wall at
  // the sharpest samples. One transparent mesh, ~1.5k tris, race-view payoff.
  {
    const wpos = [],
      widx = [],
      wcol = [],
      STEP = 4,
      HW = 1.15,
      len = ce.length,
      up = new Vector3(0, 1, 0);
    let prevL = null,
      prevR = null,
      smOff = 0,
      prevHead = null,
      base2 = 0,
      patches = 0;
    const pushV = (v, sh) => (wpos.push(v.x, v.y, v.z), wcol.push(sh, sh, sh), wpos.length / 3 - 1);
    for (let sA = 0; sA < len - STEP; sA += STEP) {
      if (Li(sA)) {
        ((prevL = null), (prevR = null));
        continue;
      }
      const a2 = St(sA),
        b2 = St(sA + STEP),
        head = Math.atan2(b2.p.x - a2.p.x, b2.p.z - a2.p.z);
      let curv = 0;
      if (prevHead !== null) {
        let dh = head - prevHead;
        (dh > Math.PI && (dh -= Math.PI * 2), dh < -Math.PI && (dh += Math.PI * 2), (curv = dh / STEP));
      }
      prevHead = head;
      smOff += (Math.max(-ce.width * 0.28, Math.min(ce.width * 0.28, -curv * 240)) - smOff) * 0.12;
      const q2 = ui(a2, b2).q,
        right = new Vector3(1, 0, 0).applyQuaternion(q2),
        c2 = a2.p.clone().addScaledVector(right, smOff);
      c2.y += 0.07;
      const L2 = c2.clone().addScaledVector(right, -HW),
        R2 = c2.clone().addScaledVector(right, HW),
        sh = 0.12 + Math.abs(curv) * 26;
      if (prevL) {
        const iA = pushV(prevL, prevL._sh),
          iB = pushV(prevR, prevR._sh),
          iC = pushV(R2, sh),
          iD = pushV(L2, sh);
        widx.push(iA, iB, iC, iA, iC, iD);
      }
      ((L2._sh = sh), (R2._sh = sh), (prevL = L2), (prevR = R2));
      // skid patches: sharp corners leave streaks drifting to the OUTSIDE
      if (Math.abs(curv) > 0.0055 && patches < 44 && sA - base2 > 30) {
        base2 = sA;
        patches++;
        const out2 = Math.sign(curv),
          pc = a2.p.clone().addScaledVector(right, out2 * ce.width * 0.3);
        pc.y += 0.075;
        const fwd = new Vector3(0, 0, 1).applyQuaternion(q2),
          pw = 0.5,
          pl = 3.6,
          pA = pc.clone().addScaledVector(right, -pw).addScaledVector(fwd, -pl),
          pB = pc.clone().addScaledVector(right, pw).addScaledVector(fwd, -pl),
          pC = pc.clone().addScaledVector(right, pw * 1.6).addScaledVector(fwd, pl),
          pD = pc.clone().addScaledVector(right, -pw * 0.2).addScaledVector(fwd, pl),
          i1 = pushV(pA, 0.3),
          i2 = pushV(pB, 0.3),
          i3 = pushV(pC, 0.34),
          i4 = pushV(pD, 0.34);
        widx.push(i1, i2, i3, i1, i3, i4);
      }
    }
    const wg = new BufferGeometry();
    (wg.setAttribute("position", new Float32BufferAttribute(wpos, 3)), wg.setAttribute("color", new Float32BufferAttribute(wcol, 3)), wg.setIndex(widx));
    const wm = new Mesh(
      wg,
      new MeshBasicMaterial({ vertexColors: !0, transparent: !0, opacity: 0.38, depthWrite: !1, side: DoubleSide }),
    );
    ((wm.raycast = () => {}), (wm.renderOrder = 1), i.add(wm));
    ((raceWearSys._mesh = wm), (raceWearSys.segs = widx.length / 6), (raceWearSys.patches = patches));
    if (!raceWearSys.enabled) wm.visible = !1;
  }
  if (d.length) {
    const g = new CylinderGeometry(0.18, 0.24, 3, 6);
    g.translate(0, 1.5, 0);
    const M = new SphereGeometry(0.34, 8, 6);
    M.translate(0, 3.2, 0);
    const x = new MeshStandardMaterial({ color: 10134440, roughness: 0.7, metalness: 0.2 }),
      h = new MeshStandardMaterial({ roughness: 0.55 }),
      _ = new InstancedMesh(g, x, d.length),
      v = new InstancedMesh(M, h, d.length),
      y = new Object3D();
    for (let E = 0; E < d.length; E++)
      (y.position.copy(d[E]),
        y.quaternion.copy(f[E]),
        y.updateMatrix(),
        _.setMatrixAt(E, y.matrix),
        v.setMatrixAt(E, y.matrix),
        v.setColorAt(E, e[E]));
    ((_.instanceMatrix.needsUpdate = !0),
      (v.instanceMatrix.needsUpdate = !0),
      v.instanceColor && (v.instanceColor.needsUpdate = !0),
      i.add(_),
      i.add(v));
  }
  return (O1(i), B1(i), et.add(i), i);
}
function k1() {
  const i = document.createElement("canvas");
  ((i.width = 256), (i.height = 160));
  const e = i.getContext("2d");
  ((e.fillStyle = "#101418"), e.fillRect(0, 0, i.width, i.height), (e.fillStyle = "#ffd23f"), (e.lineWidth = 0));
  for (let n = -1; n < 4; n++) {
    e.beginPath();
    const s = n * 70;
    (e.moveTo(s, 16),
      e.lineTo(s + 40, i.height / 2),
      e.lineTo(s, i.height - 16),
      e.lineTo(s + 18, i.height - 16),
      e.lineTo(s + 58, i.height / 2),
      e.lineTo(s + 18, 16),
      e.closePath(),
      e.fill());
  }
  const t = new CanvasTexture(i);
  return ((t.colorSpace = SRGBColorSpace), t);
}
function ol(i) {
  const e = document.createElement("canvas");
  ((e.width = 512), (e.height = 128));
  const t = e.getContext("2d");
  ((t.fillStyle = "#101418"),
    t.fillRect(0, 0, e.width, e.height),
    (t.fillStyle = "#ffd23f"),
    t.fillRect(0, 0, e.width, 8),
    t.fillRect(0, e.height - 8, e.width, 8),
    (t.fillStyle = "#ffffff"),
    (t.font = "bold 64px sans-serif"),
    (t.textAlign = "center"),
    (t.textBaseline = "middle"),
    t.fillText(i, e.width / 2, e.height / 2));
  const n = new CanvasTexture(e);
  return ((n.colorSpace = SRGBColorSpace), n);
}
function V1(i, e) {
  const t = document.createElement("canvas");
  ((t.width = 128), (t.height = 64));
  const n = t.getContext("2d"),
    s = "#" + i.toString(16).padStart(6, "0"),
    r = "#" + e.toString(16).padStart(6, "0"),
    a = 8;
  for (let c = 0; c < a; c++)
    ((n.fillStyle = c % 2 ? s : r), n.fillRect((c / a) * t.width, 0, t.width / a + 1, t.height));
  const o = new CanvasTexture(t);
  return ((o.colorSpace = SRGBColorSpace), o);
}
function G1() {
  const i = document.createElement("canvas");
  ((i.width = 256), (i.height = 128));
  const e = i.getContext("2d");
  ((e.fillStyle = "#2a3138"), e.fillRect(0, 0, i.width, i.height));
  const t = ["#e6534f", "#4db6ff", "#ffd23f", "#ffffff", "#9b6bff", "#46d39a", "#ff8ad6", "#f0f0f0"];
  for (let s = 0; s < 1400; s++) {
    e.fillStyle = t[(Math.random() * t.length) | 0];
    const r = Math.random() * i.width,
      a = Math.random() * i.height;
    e.fillRect(r, a, 2.4, 2.4);
  }
  const n = new CanvasTexture(i);
  return ((n.colorSpace = SRGBColorSpace), (n.wrapS = RepeatWrapping), n.repeat.set(3, 1), n);
}
function Bt(i, e, t, n, s) {
  const r = new Mesh(new BoxGeometry(e.x, e.y, e.z), s);
  return (r.position.copy(t), r.quaternion.copy(n), (r.castShadow = !1), (r.receiveShadow = !0), i.add(r), r);
}
function ui(i, e) {
  const t = e.p.clone().sub(i.p).normalize(),
    n = Dd.crossVectors(on, t).normalize();
  let s = t.clone().cross(n).normalize();
  const r = (i.bank + e.bank) * 0.5;
  if (Math.abs(r) > 0.001) {
    const c = new Quaternion().setFromAxisAngle(t, r);
    (n.applyQuaternion(c), s.applyQuaternion(c));
  }
  const a = new Matrix4().makeBasis(n, s, t),
    o = new Quaternion().setFromRotationMatrix(a);
  return { tangent: t, sideways: n, normal: s, q: o };
}
function Rh(i, e, t, n) {
  const r = [],
    a = [],
    o = [],
    c = ce.width * 0.47;
  let l = 0;
  for (let p = e; p <= t; p += 8) {
    const m = St(Math.min(p, t)),
      g = ui(m, St(m.s + 2)),
      M = Math.sin(p * 0.018) * 0.04,
      x = m.p
        .clone()
        .addScaledVector(g.sideways, -c)
        .addScaledVector(g.normal, 0.46 + M),
      h = m.p
        .clone()
        .addScaledVector(g.sideways, c)
        .addScaledVector(g.normal, 0.46 - M);
    r.push(x.x, x.y, x.z, h.x, h.y, h.z);
    const _ = (p - e) / 64;
    if ((a.push(0, _, 1, _), l > 0)) {
      const v = (l - 1) * 2,
        y = l * 2;
      o.push(v, v + 1, y, v + 1, y + 1, y);
    }
    l++;
  }
  const d = new BufferGeometry();
  (d.setAttribute("position", new Float32BufferAttribute(r, 3)),
    d.setAttribute("uv", new Float32BufferAttribute(a, 2)),
    d.setIndex(o),
    d.computeVertexNormals());
  const f = new Mesh(d, n);
  ((f.receiveShadow = !0), i.add(f));
}
function H1(i, e) {
  let t = 0;
  for (const n of ce.gaps) (Rh(i, t, Math.max(t, n.start - 4), e), (t = n.end + 4));
  Rh(i, t, ce.length, e);
}
function W1(i, e, t) {
  const n = St(e.s + 2),
    { normal: s, q: r } = ui(e, n),
    a = new Group();
  (a.position.copy(e.p).addScaledVector(s, 0.73), a.quaternion.copy(r));
  const o = new Mesh(new BoxGeometry(0.55, 0.12, 5.2), t);
  (o.position.set(-1.25, 0, 0), (o.rotation.y = -0.62), a.add(o));
  const c = new Mesh(new BoxGeometry(0.55, 0.12, 5.2), t);
  (c.position.set(1.25, 0, 0), (c.rotation.y = 0.62), a.add(c));
  const l = new Mesh(new BoxGeometry(0.42, 0.1, 3.8), t);
  (l.position.set(0, 0.01, -1.9), a.add(l), i.add(a));
}
function X1() {
  const i = new Group();
  (et.add(i), (Cc = 0));
  const e = new MeshStandardMaterial({ color: 12171149, roughness: 0.72, metalness: 0.08 }),
    t = new MeshStandardMaterial({ color: 9869942, roughness: 0.78, metalness: 0.05 }),
    n = new MeshStandardMaterial({ color: 15255629, roughness: 0.28, metalness: 0.72 }),
    s = new MeshStandardMaterial({ color: 8204328, roughness: 0.3, metalness: 0.85 }),
    r = new MeshStandardMaterial({ color: 6120040, roughness: 0.5, metalness: 0.6 }),
    a = new MeshStandardMaterial({ color: 5595238, roughness: 0.62, metalness: 0.38, emissive: 462868, emissiveIntensity: 0.18 }),
    o = new MeshStandardMaterial({ color: 14270570, roughness: 0.35, metalness: 0.65 }),
    c = new MeshStandardMaterial({ color: 7174288, roughness: 0.5, metalness: 0.55, emissive: 2765904, emissiveIntensity: 0.22 }),
    l = new MeshStandardMaterial({ color: 16730929, roughness: 0.5, metalness: 0.1, emissive: 4852740, emissiveIntensity: 0.35 }),
    d = new MeshStandardMaterial({ color: 16773238, roughness: 0.32, metalness: 0.2, emissive: 7097088, emissiveIntensity: 0.18 }),
    f = new MeshStandardMaterial({ color: 4935486, roughness: 0.92, metalness: 0.04 }),
    p = new MeshStandardMaterial({ color: 16774307, roughness: 0.18, metalness: 0.1, emissive: 16766540, emissiveIntensity: 0.9 }),
    m = new MeshStandardMaterial({ color: 9564415, roughness: 0.18, metalness: 0.1, emissive: 3131647, emissiveIntensity: 1.1 }),
    g = new MeshStandardMaterial({ color: 4739414, roughness: 0.72, metalness: 0.32, emissive: 330509, emissiveIntensity: 0.12 }),
    M = new MeshStandardMaterial({ color: 1514007, roughness: 0.96, metalness: 0.02, transparent: !0, opacity: 0.62 }),
    x = new MeshStandardMaterial({ color: 15919561, roughness: 0.82, metalness: 0.02 });
  new MeshStandardMaterial({ color: 16761415, roughness: 0.56, metalness: 0.08, emissive: 4268032, emissiveIntensity: 0.12 });
  const h = new MeshStandardMaterial({ map: _1(), roughness: 0.74, metalness: 0.08 }),
    _ = new MeshBasicMaterial({ color: 1058333, transparent: !0, opacity: 0.18, depthWrite: !1 }),
    v = 12;
  H1(i, h);
  function y(E, T = !1) {
    if (Li(E)) return !1;
    const R = St(E),
      C = St(E + 3),
      { sideways: b, normal: S, q: L } = ui(R, C),
      F = R.p,
      W = He(F.x, F.z),
      te = F.y - 0.95;
    if (te - W < 10) return !1;
    const ne = ce.width * (T ? 0.43 : 0.35),
      X = te,
      Q = W + 0.25,
      ie = T ? 0.56 : 0.42,
      de = T ? 2.4 : 1.75,
      pe = T ? 0.52 : 0.36,
      ze = [],
      I = [];
    // The ribbon spans roads without mid-lane pillars: skip the whole support station
    // when either pylon base would land in a road corridor.
    for (const _e of [-1, 1])
      if (Hi(F.x + b.x * _e * ne, F.z + b.z * _e * ne, de * 2.2, de * 2.2, 1.2)) return !1;
    for (const _e of [-1, 1]) {
      const be = F.clone()
        .addScaledVector(b, _e * ne)
        .addScaledVector(S, -0.85);
      be.y = X;
      const Le = new Vector3(be.x, Q, be.z);
      gn(i, Le, be, ie, r);
      const Ye = new Mesh(new CylinderGeometry(de, de * 1.12, pe, 12), r);
      (Ye.position.set(Le.x, W + pe * 0.5, Le.z),
        (Ye.receiveShadow = !0),
        i.add(Ye),
        ze.push(be),
        I.push(Le),
        $n.push({ x: Le.x, z: Le.z, hw: de * 0.92, hd: de * 0.92, maxY: X - 0.7 }));
    }
    const ye = F.clone().addScaledVector(S, -1.05);
    ((ye.y = X), Bt(i, new Vector3(ce.width * 0.92, T ? 0.58 : 0.42, T ? 1.55 : 1.15), ye, L, a));
    const Me = I[0].clone();
    Me.y += (X - Q) * 0.28;
    const Se = I[1].clone();
    Se.y += (X - Q) * 0.28;
    const Z = ze[0].clone();
    Z.y -= 1;
    const K = ze[1].clone();
    if (((K.y -= 1), gn(i, Me, K, T ? 0.18 : 0.14, c), gn(i, Se, Z, T ? 0.18 : 0.14, c), T)) {
      const _e = I[0].clone();
      _e.y += (X - Q) * 0.58;
      const be = I[1].clone();
      ((be.y += (X - Q) * 0.58),
        gn(i, I[0].clone().setY(Q + 1.2), be, 0.16, c),
        gn(i, I[1].clone().setY(Q + 1.2), _e, 0.16, c),
        gn(i, _e, K, 0.16, c),
        gn(i, be, Z, 0.16, c));
    }
    return (Cc++, !0);
  }
  for (let E = 0; E < ce.length; E += v) {
    if (Li(E + v * 0.5)) continue;
    const T = St(E),
      R = St(E + v),
      C = T.p.clone().add(R.p).multiplyScalar(0.5),
      { sideways: b, normal: S, q: L } = ui(T, R),
      F = T.p.distanceTo(R.p) + 0.45,
      W = Math.floor(E / (v * 2)) % 2 ? e : t;
    (Bt(i, new Vector3(ce.width, 0.62, F), C.clone().addScaledVector(S, -0.05), L, W),
      Bt(i, new Vector3(ce.width - 2.8, 0.08, F * 0.86), C.clone().addScaledVector(S, 0.36), L, f),
      Bt(
        i,
        new Vector3(0.2, 0.1, F * 0.76),
        C.clone()
          .addScaledVector(b, -ce.width * 0.19)
          .addScaledVector(S, 0.43),
        L,
        f,
      ),
      Bt(
        i,
        new Vector3(0.2, 0.1, F * 0.76),
        C.clone()
          .addScaledVector(b, ce.width * 0.19)
          .addScaledVector(S, 0.43),
        L,
        f,
      ),
      E % 48 === 0 &&
        (Bt(
          i,
          new Vector3(0.14, 0.08, F * 0.62),
          C.clone()
            .addScaledVector(b, -ce.width * 0.08)
            .addScaledVector(S, 0.51),
          L,
          M,
        ),
        Bt(
          i,
          new Vector3(0.14, 0.08, F * 0.62),
          C.clone()
            .addScaledVector(b, ce.width * 0.08)
            .addScaledVector(S, 0.51),
          L,
          M,
        )),
      E % 120 === 0 && Bt(i, new Vector3(ce.width * 0.42, 0.07, 0.72), C.clone().addScaledVector(S, 0.55), L, x),
      Bt(i, new Vector3(ce.width + 1.2, 0.35, F * 0.94), C.clone().addScaledVector(S, -0.56), L, a),
      Bt(
        i,
        new Vector3(0.42, 0.42, F * 0.9),
        C.clone()
          .addScaledVector(b, -ce.width * 0.36)
          .addScaledVector(S, -0.78),
        L,
        g,
      ),
      Bt(
        i,
        new Vector3(0.42, 0.42, F * 0.9),
        C.clone()
          .addScaledVector(b, ce.width * 0.36)
          .addScaledVector(S, -0.78),
        L,
        g,
      ));
    const te = C.clone().addScaledVector(b, -ce.width * 0.51),
      ne = C.clone().addScaledVector(b, ce.width * 0.51);
    if (
      (Bt(i, new Vector3(0.32, 0.46, F), te.clone().addScaledVector(S, 0.28), L, n),
      Bt(i, new Vector3(0.32, 0.46, F), ne.clone().addScaledVector(S, 0.28), L, n),
      Bt(i, new Vector3(0.26, 0.72, F * 0.94), te.clone().addScaledVector(S, -0.22), L, a),
      Bt(i, new Vector3(0.26, 0.72, F * 0.94), ne.clone().addScaledVector(S, -0.22), L, a),
      E % 36 === 0)
    )
      for (const X of [-ce.width * 0.39, -ce.width * 0.2, ce.width * 0.2, ce.width * 0.39]) {
        const Q = new Mesh(new CylinderGeometry(0.16, 0.2, 0.12, 10), o);
        (Q.position.copy(C).addScaledVector(b, X).addScaledVector(S, 0.46),
          Q.quaternion.copy(L),
          (Q.castShadow = !1),
          i.add(Q));
      }
    if (
      (E % 72 === 0 &&
        (Bt(
          i,
          new Vector3(0.34, 1.56, 3.4),
          C.clone()
            .addScaledVector(b, -ce.width * 0.66)
            .addScaledVector(S, 1.16),
          L,
          s,
        ),
        Bt(
          i,
          new Vector3(0.34, 1.56, 3.4),
          C.clone()
            .addScaledVector(b, ce.width * 0.66)
            .addScaledVector(S, 1.16),
          L,
          s,
        ),
        Bt(
          i,
          new Vector3(0.18, 0.18, 4.4),
          C.clone()
            .addScaledVector(b, -ce.width * 0.62)
            .addScaledVector(S, 1.94),
          L,
          s,
        ),
        Bt(
          i,
          new Vector3(0.18, 0.18, 4.4),
          C.clone()
            .addScaledVector(b, ce.width * 0.62)
            .addScaledVector(S, 1.94),
          L,
          s,
        ),
        Bt(
          i,
          new Vector3(0.12, 0.12, 4),
          C.clone()
            .addScaledVector(b, -ce.width * 0.62)
            .addScaledVector(S, 1.38),
          L,
          n,
        ),
        Bt(
          i,
          new Vector3(0.12, 0.12, 4),
          C.clone()
            .addScaledVector(b, ce.width * 0.62)
            .addScaledVector(S, 1.38),
          L,
          n,
        ),
        gn(
          i,
          C.clone()
            .addScaledVector(b, -ce.width * 0.58)
            .addScaledVector(S, -1.08),
          C.clone()
            .addScaledVector(b, ce.width * 0.58)
            .addScaledVector(S, -1.08),
          0.11,
          c,
        ),
        gn(
          i,
          C.clone()
            .addScaledVector(b, -ce.width * 0.48)
            .addScaledVector(S, -1),
          C.clone().addScaledVector(b, 0).addScaledVector(S, -2.2),
          0.09,
          c,
        ),
        gn(
          i,
          C.clone()
            .addScaledVector(b, ce.width * 0.48)
            .addScaledVector(S, -1),
          C.clone().addScaledVector(b, 0).addScaledVector(S, -2.2),
          0.09,
          c,
        )),
      E % 96 === 0)
    ) {
      const X = new Mesh(new CircleGeometry(1, 28), _);
      ((X.rotation.x = -Math.PI / 2),
        X.position.set(C.x, -4.72, C.z),
        X.scale.set(ce.width * 0.9, Math.max(10, F * 2.2), 1),
        (X.rotation.z = Math.atan2(ui(T, R).tangent.x, ui(T, R).tangent.z)),
        i.add(X));
    }
    if (E % 144 === 0) {
      const X = C.clone()
          .addScaledVector(b, -ce.width * 0.74)
          .addScaledVector(S, 2),
        Q = C.clone()
          .addScaledVector(b, ce.width * 0.74)
          .addScaledVector(S, 2);
      (gn(i, X.clone().addScaledVector(S, -1.2), X.clone().addScaledVector(S, 1.1), 0.12, s),
        gn(i, Q.clone().addScaledVector(S, -1.2), Q.clone().addScaledVector(S, 1.1), 0.12, s),
        Bt(i, new Vector3(0.46, 0.72, 0.46), X.clone().addScaledVector(S, 1.15), L, l),
        Bt(i, new Vector3(0.46, 0.72, 0.46), Q.clone().addScaledVector(S, 1.15), L, l));
    }
    if (E % 288 === 0) {
      const X = C.clone()
        .addScaledVector(b, (Math.floor(E / 144) % 2 ? 1 : -1) * ce.width * 0.92)
        .addScaledVector(S, 5.2);
      (Bt(i, new Vector3(0.44, 0.44, 0.44), X.clone(), L, p),
        gn(i, X.clone().addScaledVector(S, -0.2), C.clone().addScaledVector(S, 1), 0.05, c));
    }
    (E % 48 === 0 && y(E + v * 0.5, !1), E % 168 === 0 && !Li(E + 16) && W1(i, St(E + 5), d));
  }
  for (const E of ce.gaps) {
    const T = St(E.start - 3),
      R = St(E.end + 3);
    for (const C of [T, R]) {
      const b = St(C.s + 2),
        { normal: S, q: L } = ui(C, b);
      (Bt(i, new Vector3(ce.width - 1.2, 0.08, 4.6), C.p.clone().addScaledVector(S, 0.54), L, l),
        Bt(
          i,
          new Vector3(ce.width * 0.62, 0.09, 1.3),
          C.p
            .clone()
            .addScaledVector(S, 0.62)
            .addScaledVector(C.tangent, C === T ? -6.3 : 6.3),
          L,
          x,
        ));
      for (const F of [-ce.width * 0.42, 0, ce.width * 0.42]) {
        const W = C.p.clone().addScaledVector(C.side, F).addScaledVector(S, 2.35);
        Bt(i, new Vector3(0.46, 0.46, 0.46), W, L, F === 0 ? m : l);
      }
      (y(C.s + (C === T ? -9 : 9), !0), y(C.s + (C === T ? -24 : 24), !0));
    }
  }
  return i;
}
function Gd(i = 13710372, e = 7740696) {
  const t = new Group(),
    n = new MeshStandardMaterial({ color: i, roughness: 0.19, metalness: 0.68, envMapIntensity: 1.25 }),
    s = new MeshStandardMaterial({ color: e, roughness: 0.28, metalness: 0.58, envMapIntensity: 1 }),
    r = new MeshStandardMaterial({ color: 329225, roughness: 0.52, metalness: 0.12 }),
    a = new MeshStandardMaterial({ color: 1053463, roughness: 0.38, metalness: 0.34 }),
    o = new MeshStandardMaterial({ color: 12569555, roughness: 0.16, metalness: 0.82, envMapIntensity: 1.15 }),
    c = new MeshStandardMaterial({ color: 5397346, roughness: 0.22, metalness: 0.78, envMapIntensity: 1.1 }),
    l = new MeshStandardMaterial({
      color: 5425663,
      roughness: 0.04,
      metalness: 0.02,
      transparent: !0,
      opacity: 0.43,
      emissive: 536402,
      emissiveIntensity: 0.18,
      envMapIntensity: 1.6,
    }),
    d = new MeshStandardMaterial({ color: 16722713, roughness: 0.13, metalness: 0.04, emissive: 16717836, emissiveIntensity: 2.4 }),
    f = new MeshStandardMaterial({ color: 16757562, roughness: 0.18, metalness: 0.04, emissive: 16747032, emissiveIntensity: 1.7 }),
    p = new MeshStandardMaterial({ color: 16773285, roughness: 0.18, metalness: 0.08, emissive: 16765019, emissiveIntensity: 1.7 }),
    m = new MeshStandardMaterial({ color: 2237480, roughness: 0.26, metalness: 0.78, envMapIntensity: 1.2 }),
    g = new MeshStandardMaterial({ color: 329225, roughness: 0.44, metalness: 0.22 }),
    M = new Mesh(new CircleGeometry(3.65, 36), new MeshBasicMaterial({ color: 0, transparent: !0, opacity: 0.22, depthWrite: !1 }));
  ((M.rotation.x = -Math.PI / 2), (M.position.y = 0.08), (M.scale.z = 1.58), t.add(M));
  const x = (y, E, T, R, C = null, b = null) => {
      const S = new Mesh(E, T);
      return (
        (S.name = y),
        S.position.copy(R),
        C && S.rotation.set(C.x || 0, C.y || 0, C.z || 0),
        b && S.scale.copy(b),
        t.add(S),
        S
      );
    },
    h = (y, E, T, R, C, b, S = 0, L = 0, F = 0) => x(y, new BoxGeometry(E.x, E.y, E.z), T, new Vector3(R, C, b), new Vector3(S, L, F));
  (h("low black undertray", new Vector3(5.25, 0.28, 8.45), r, 0, 0.45, -0.08),
    h("wide wedge body tub", new Vector3(4.85, 0.86, 6.65), n, 0, 0.98, 0.28, -0.035),
    h("sloped front wedge nose", new Vector3(3.7, 0.64, 3.35), n, 0, 0.83, -3.75, -0.145),
    h("front black splitter", new Vector3(5.25, 0.13, 0.78), r, 0, 0.35, -5.6),
    h("left sculpted rocker panel", new Vector3(0.46, 0.5, 5.85), s, -2.63, 0.82, 0.08, 0, 0, -0.04),
    h("right sculpted rocker panel", new Vector3(0.46, 0.5, 5.85), s, 2.63, 0.82, 0.08, 0, 0, 0.04),
    h("left rear haunch", new Vector3(0.72, 0.74, 2.55), n, -2.53, 1.18, 2.08, -0.04),
    h("right rear haunch", new Vector3(0.72, 0.74, 2.55), n, 2.53, 1.18, 2.08, -0.04),
    h("left front fender flare", new Vector3(0.46, 0.54, 1.38), n, -2.55, 0.98, -2.78, -0.04),
    h("right front fender flare", new Vector3(0.46, 0.54, 1.38), n, 2.55, 0.98, -2.78, -0.04),
    h("black rear fascia", new Vector3(4.72, 0.66, 0.2), a, 0, 1.02, 4.04),
    h("deep rear bumper", new Vector3(5.32, 0.38, 0.48), c, 0, 0.58, 4.23),
    h("front windshield", new Vector3(2.8, 0.13, 1.15), l, 0, 1.78, -1.25, -0.48),
    h("roof glass", new Vector3(2.34, 0.18, 1.55), l, 0, 2.08, -0.2, -0.13),
    h("left side window", new Vector3(0.12, 0.78, 1.9), l, -1.28, 1.76, -0.15, -0.08, 0.04),
    h("right side window", new Vector3(0.12, 0.78, 1.9), l, 1.28, 1.76, -0.15, -0.08, -0.04),
    h("black a pillar left", new Vector3(0.12, 0.86, 0.14), g, -1.46, 1.75, -1.22, -0.48),
    h("black a pillar right", new Vector3(0.12, 0.86, 0.14), g, 1.46, 1.75, -1.22, -0.48),
    h("rear deck panel", new Vector3(3.5, 0.18, 2.18), n, 0, 1.7, 2, -0.2));
  for (let y = 0; y < 7; y++)
    h("black rear deck louver", new Vector3(3.35, 0.12, 0.18), a, 0, 1.83 + y * 0.015, 1.1 + y * 0.28, -0.21);
  h("raised rear spoiler blade", new Vector3(5.55, 0.18, 0.86), s, 0, 1.82, 3.82, -0.06);
  for (const y of [-2.28, 2.28])
    h("spoiler side endplate", new Vector3(0.24, 0.78, 1.04), s, y, 1.43, 3.72, 0, 0, y < 0 ? -0.08 : 0.08);
  for (const y of [-1.78, 1.78])
    (h("thin hood crease", new Vector3(0.08, 0.04, 2.55), g, y * 0.36, 1.27, -3.45, -0.15),
      h("door seam", new Vector3(0.035, 0.68, 1.75), g, y, 1.16, -0.2),
      h("side intake", new Vector3(0.09, 0.34, 0.9), a, Math.sign(y) * 2.68, 0.86, 1.42));
  for (const y of [-1.04, 1.04]) h("pop up headlight glass", new Vector3(0.62, 0.12, 0.18), p, y, 1.02, -5.28, -0.16);
  h("tail light backplate", new Vector3(3.86, 0.46, 0.08), g, 0, 1.08, 4.18);
  for (const y of [-1.42, -0.62, 0.62, 1.42])
    h("rectangular glowing tail lamp", new Vector3(0.54, 0.28, 0.1), Math.abs(y) > 1 ? d : f, y, 1.08, 4.24);
  (h("slim chrome beltline left", new Vector3(0.06, 0.08, 4.75), o, -2.72, 1.42, -0.2),
    h("slim chrome beltline right", new Vector3(0.06, 0.08, 4.75), o, 2.72, 1.42, -0.2),
    h("left black roof rail", new Vector3(0.12, 0.12, 2.72), g, -1.34, 2.15, -0.42, -0.13),
    h("right black roof rail", new Vector3(0.12, 0.12, 2.72), g, 1.34, 2.15, -0.42, -0.13));
  for (const y of [-2.86, 2.86])
    (h("angular side mirror arm", new Vector3(0.42, 0.08, 0.08), g, y, 1.62, -1.55, 0, 0, y < 0 ? -0.14 : 0.14),
      h("blue tinted side mirror", new Vector3(0.12, 0.34, 0.46), l, y * 1.03, 1.62, -1.65, 0, y < 0 ? 0.24 : -0.24),
      h("flush door handle", new Vector3(0.08, 0.11, 0.46), o, y * 0.94, 1.28, 0.52));
  for (const y of [-2.65, 2.42])
    (h("left wheel arch shadow", new Vector3(0.08, 0.9, 1.75), g, -2.82, 0.78, y),
      h("right wheel arch shadow", new Vector3(0.08, 0.9, 1.75), g, 2.82, 0.78, y));
  h("black license recess", new Vector3(0.9, 0.24, 0.08), a, 0, 0.76, 4.31);
  const _ = [],
    v = (y, E, T = !1) => {
      const R = new Group();
      ((R.name = T ? "steering front wheel assembly" : "rear wheel assembly"), R.position.set(y, 0.54, E));
      const C = new Mesh(new CylinderGeometry(0.88, 0.88, 0.62, 28), r);
      ((C.name = "wide performance tire"), (C.rotation.z = Math.PI / 2), R.add(C));
      const b = new Mesh(new TorusGeometry(0.88, 0.06, 10, 32), r);
      ((b.name = "rounded tire sidewall"), (b.rotation.y = Math.PI / 2), R.add(b));
      const S = new Mesh(new CylinderGeometry(0.42, 0.42, 0.66, 24), o);
      ((S.name = "chrome wheel rim"), (S.rotation.z = Math.PI / 2), R.add(S));
      const L = new Mesh(new CylinderGeometry(0.56, 0.56, 0.08, 24), m);
      ((L.name = "visible brake disc"), (L.rotation.z = Math.PI / 2), (L.position.x = y > 0 ? -0.05 : 0.05), R.add(L));
      for (let te = 0; te < 8; te++) {
        const ne = new Mesh(new BoxGeometry(0.08, 0.055, 0.62), o);
        ((ne.name = "thin wheel spoke"),
          (ne.rotation.x = (te / 8) * Math.PI * 2),
          ne.position.set(y > 0 ? 0.035 : -0.035, 0, 0.22),
          R.add(ne));
      }
      const F = new Mesh(new BoxGeometry(0.1, 0.22, 0.18), f);
      ((F.name = "small brake caliper"), F.position.set(y > 0 ? -0.39 : 0.39, 0.18, -0.38), R.add(F));
      const W = new Mesh(new CylinderGeometry(0.17, 0.17, 0.72, 18), c);
      ((W.name = "dark center cap"), (W.rotation.z = Math.PI / 2), R.add(W), t.add(R), T && _.push(R));
    };
  for (const y of [-2.4, 2.4]) (v(y, -2.65, !0), v(y, 2.42, !1));
  ((t.userData.frontWheels = _),
    (t.userData.detailReport = { louvers: 7, tailLamps: 4, wheelSpokes: 32, sideWindows: 2, spoiler: !0 }));
  for (const y of [-0.92, -0.52, 0.52, 0.92]) {
    const E = new Mesh(new CylinderGeometry(0.13, 0.13, 0.55, 14), o);
    ((E.name = "quad square exhaust outlet"), (E.rotation.x = Math.PI / 2), E.position.set(y, 0.43, 4.52), t.add(E));
  }
  return (
    t.traverse((y) => {
      ((y.castShadow = !0), (y.receiveShadow = !0));
    }),
    et.add(t),
    t
  );
}
function Y1() {
  const i = new Group(),
    e = new MeshStandardMaterial({ color: 3949112, roughness: 0.62, metalness: 0.3 }),
    t = new MeshStandardMaterial({ color: 460551, roughness: 0.55 }),
    n = new MeshStandardMaterial({ color: 3162419, roughness: 0.5, metalness: 0.42 }),
    s = new MeshStandardMaterial({ color: 16767297, roughness: 0.38, metalness: 0.25 }),
    r = new MeshStandardMaterial({ color: 16769898, roughness: 0.26, metalness: 0.18, emissive: 16757802, emissiveIntensity: 0.62 }),
    a = new MeshStandardMaterial({ color: 11988991, roughness: 0.12, metalness: 0, transparent: !0, opacity: 0.08 }),
    o = new MeshStandardMaterial({ color: 1118995, roughness: 0.7, metalness: 0.05 }),
    c = new Mesh(new BoxGeometry(2.2, 0.24, 2.2), e);
  (c.position.set(0, -0.78, -2.2), i.add(c));
  const l = new Mesh(new BoxGeometry(0.16, 0.028, 1.92), n);
  (l.position.set(0, -0.64, -2.28), i.add(l));
  const d = new Mesh(new BoxGeometry(2.55, 0.18, 0.52), t);
  (d.position.set(0, -0.48, -1.25), (d.rotation.x = -0.08), i.add(d));
  const f = new Mesh(new PlaneGeometry(2.8, 0.82, 1, 1), a);
  (f.position.set(0, -0.17, -1.08), (f.rotation.x = -0.36), i.add(f));
  const p = new Mesh(new TorusGeometry(0.36, 0.035, 12, 48), o);
  (p.position.set(0, -0.46, -1.02), (p.rotation.x = Math.PI / 2.75), i.add(p));
  for (let m = 0; m < 3; m++) {
    const g = new Mesh(new BoxGeometry(0.34, 0.025, 0.035), n);
    (g.position.copy(p.position), g.rotation.copy(p.rotation), (g.rotation.z += (m / 3) * Math.PI * 2), i.add(g));
  }
  for (let m = 0; m < 6; m++) {
    const g = new Mesh(new CylinderGeometry(0.16, 0.16, 0.56, 18), n);
    ((g.rotation.z = Math.PI / 2), g.position.set(-0.78 + m * 0.31, -0.42 + Math.sin(m) * 0.03, -2.12), i.add(g));
  }
  for (const m of [-1.08, 1.08]) {
    const g = new Mesh(new CylinderGeometry(0.34, 0.34, 0.25, 18), t);
    ((g.rotation.z = Math.PI / 2), g.position.set(m, -0.68, -1.58), i.add(g));
    const M = new Mesh(new TorusGeometry(0.22, 0.035, 8, 28), s);
    (M.scale.set(0.72, 1.25, 0.72), M.position.set(m * 0.8, -0.48, -1.74), (M.rotation.x = Math.PI / 2), i.add(M));
  }
  for (const m of [-1.14, -0.84, 0.84, 1.14]) {
    const g = new Mesh(new CylinderGeometry(0.035, 0.04, 0.028, 8), n);
    (g.position.set(m, -0.39, -1.28), (g.rotation.x = Math.PI / 2), i.add(g));
  }
  for (const m of [-0.52, 0.52]) {
    const g = new Mesh(new SphereGeometry(0.045, 12, 8), r);
    (g.position.set(m, -0.34, -1.22), i.add(g));
  }
  (i.position.set(0, 0, 0), Xe.add(i), (qn = i));
}
function q1() {
  const i = new MeshStandardMaterial({ color: 16119285, roughness: 0.35, metalness: 0.25 }),
    e = new MeshStandardMaterial({ color: 1184274, roughness: 0.45 }),
    t = new MeshStandardMaterial({ map: v1(), roughness: 0.42, metalness: 0.05 }),
    n = new MeshStandardMaterial({ color: 16770696, roughness: 0.2, emissive: 16759603, emissiveIntensity: 1.25 }),
    s = St(0),
    r = new Matrix4().makeBasis(s.side, on, s.tangent),
    a = new Quaternion().setFromRotationMatrix(r),
    o = new Group();
  for (const d of [-ce.width * 0.58, ce.width * 0.58]) {
    const f = new Mesh(new BoxGeometry(0.8, 11, 0.8), i);
    (f.position.copy(s.p).addScaledVector(s.side, d).addScaledVector(on, 5.4), f.quaternion.copy(a), o.add(f));
  }
  const c = new Mesh(new BoxGeometry(ce.width + 3, 0.8, 1), t);
  (c.position.copy(s.p).addScaledVector(on, 11.2), c.quaternion.copy(a), o.add(c));
  const l = new Mesh(new BoxGeometry(ce.width + 1.2, 1.4, 0.18), e);
  (l.position.copy(s.p).addScaledVector(on, 12.5).addScaledVector(s.tangent, -0.55), l.quaternion.copy(a), o.add(l));
  for (const d of [-ce.width * 0.38, 0, ce.width * 0.38]) {
    const f = new Mesh(new SphereGeometry(0.32, 16, 10), n);
    (f.position.copy(s.p).addScaledVector(s.side, d).addScaledVector(on, 10.25), o.add(f));
  }
  return (et.add(o), o);
}
// ─── Player car garage: four hand-built models with distinct silhouettes and stats ───
function carPartKit(t, bodyColor, trimColor) {
  const mats = {
    body: new MeshStandardMaterial({ color: bodyColor, roughness: 0.19, metalness: 0.68, envMapIntensity: 1.25 }),
    trim: new MeshStandardMaterial({ color: trimColor, roughness: 0.28, metalness: 0.58, envMapIntensity: 1 }),
    black: new MeshStandardMaterial({ color: 329225, roughness: 0.52, metalness: 0.12 }),
    dark: new MeshStandardMaterial({ color: 1053463, roughness: 0.38, metalness: 0.34 }),
    chrome: new MeshStandardMaterial({ color: 12569555, roughness: 0.16, metalness: 0.82, envMapIntensity: 1.15 }),
    steel: new MeshStandardMaterial({ color: 5397346, roughness: 0.22, metalness: 0.78, envMapIntensity: 1.1 }),
    glass: new MeshStandardMaterial({
      color: 5425663,
      roughness: 0.04,
      metalness: 0.02,
      transparent: !0,
      opacity: 0.43,
      emissive: 536402,
      emissiveIntensity: 0.18,
      envMapIntensity: 1.6,
    }),
    tailHot: new MeshStandardMaterial({ color: 16722713, roughness: 0.13, metalness: 0.04, emissive: 16717836, emissiveIntensity: 2.4 }),
    tailWarm: new MeshStandardMaterial({ color: 16757562, roughness: 0.18, metalness: 0.04, emissive: 16747032, emissiveIntensity: 1.7 }),
    headLamp: new MeshStandardMaterial({ color: 16773285, roughness: 0.18, metalness: 0.08, emissive: 16765019, emissiveIntensity: 1.7 }),
    disc: new MeshStandardMaterial({ color: 2237480, roughness: 0.26, metalness: 0.78, envMapIntensity: 1.2 }),
    matte: new MeshStandardMaterial({ color: 329225, roughness: 0.44, metalness: 0.22 }),
  };
  const shadow = new Mesh(
    new CircleGeometry(3.65, 36),
    new MeshBasicMaterial({ color: 0, transparent: !0, opacity: 0.22, depthWrite: !1 }),
  );
  ((shadow.rotation.x = -Math.PI / 2), (shadow.position.y = 0.08), (shadow.scale.z = 1.58), t.add(shadow));
  const part = (name, geo, mat, pos, rot = null, scl = null) => {
      const s = new Mesh(geo, mat);
      return (
        (s.name = name),
        s.position.copy(pos),
        rot && s.rotation.set(rot.x || 0, rot.y || 0, rot.z || 0),
        scl && s.scale.copy(scl),
        t.add(s),
        s
      );
    },
    box = (name, dx, dy, dz, mat, x, y, z, rx = 0, ry = 0, rz = 0) =>
      part(name, new BoxGeometry(dx, dy, dz), mat, new Vector3(x, y, z), { x: rx, y: ry, z: rz });
  const frontWheels = [];
  function wheel(x, z, front, radius = 0.88, width = 0.62) {
    const R = new Group();
    ((R.name = front ? "steering front wheel assembly" : "rear wheel assembly"), R.position.set(x, radius * 0.62 + 0.18, z));
    const tire = new Mesh(new CylinderGeometry(radius, radius, width, 28), mats.black);
    ((tire.name = "performance tire"), (tire.rotation.z = Math.PI / 2), R.add(tire));
    const wall = new Mesh(new TorusGeometry(radius, 0.06, 10, 32), mats.black);
    ((wall.name = "tire sidewall"), (wall.rotation.y = Math.PI / 2), R.add(wall));
    const rim = new Mesh(new CylinderGeometry(radius * 0.48, radius * 0.48, width + 0.04, 24), mats.chrome);
    ((rim.name = "chrome rim"), (rim.rotation.z = Math.PI / 2), R.add(rim));
    const disc = new Mesh(new CylinderGeometry(radius * 0.62, radius * 0.62, 0.08, 24), mats.disc);
    ((disc.name = "brake disc"), (disc.rotation.z = Math.PI / 2), (disc.position.x = x > 0 ? -0.05 : 0.05), R.add(disc));
    for (let k = 0; k < 8; k++) {
      const sp = new Mesh(new BoxGeometry(0.08, 0.055, width), mats.chrome);
      ((sp.name = "wheel spoke"),
        (sp.rotation.x = (k / 8) * Math.PI * 2),
        sp.position.set(x > 0 ? 0.035 : -0.035, 0, radius * 0.25),
        R.add(sp));
    }
    const cap = new Mesh(new CylinderGeometry(0.17, 0.17, width + 0.1, 18), mats.steel);
    ((cap.name = "center cap"), (cap.rotation.z = Math.PI / 2), R.add(cap), t.add(R), front && frontWheels.push(R));
    return R;
  }
  return { mats, part, box, wheel, frontWheels };
}
function buildBulletGT(bodyColor = 15616818, trimColor = 2434871) {
  // Long, low land-missile: cab-forward canopy, covered rear wheels, full-width tail bar, twin fins.
  const t = new Group(),
    K = carPartKit(t, bodyColor, trimColor),
    { mats, box } = K;
  (box("low undertray", 4.6, 0.26, 9.2, mats.black, 0, 0.42, 0),
    box("long fuselage body", 4.15, 0.78, 8.6, mats.body, 0, 0.92, 0.1, -0.012),
    box("tapered nose cone", 2.7, 0.5, 2.5, mats.body, 0, 0.78, -5.15, -0.12),
    box("needle splitter", 4.5, 0.1, 0.7, mats.black, 0, 0.34, -6.2),
    box("front intake slot", 2, 0.16, 0.14, mats.dark, 0, 0.62, -6.15),
    box("canopy fairing", 2.15, 0.5, 3.1, mats.body, 0, 1.5, -1.7, -0.06),
    box("bubble windshield", 1.85, 0.14, 1.35, mats.glass, 0, 1.74, -2.7, -0.42),
    box("canopy glass roof", 1.7, 0.13, 1.7, mats.glass, 0, 1.86, -1.35, -0.1),
    box("left canopy glass", 0.1, 0.5, 2.1, mats.glass, -1.02, 1.6, -1.6, -0.05, 0.03),
    box("right canopy glass", 0.1, 0.5, 2.1, mats.glass, 1.02, 1.6, -1.6, -0.05, -0.03),
    box("rear engine deck", 3.6, 0.34, 3.6, mats.body, 0, 1.28, 2.3, -0.05),
    box("left rear wheel fairing", 0.8, 0.72, 3, mats.body, -1.95, 0.9, 2.3),
    box("right rear wheel fairing", 0.8, 0.72, 3, mats.body, 1.95, 0.9, 2.3),
    box("left fin", 0.1, 0.85, 1.6, mats.trim, -1.6, 1.75, 3.5, 0.18),
    box("right fin", 0.1, 0.85, 1.6, mats.trim, 1.6, 1.75, 3.5, 0.18));
  for (let k = 0; k < 6; k++) box("engine deck vent", 2.9, 0.1, 0.16, mats.dark, 0, 1.47 + k * 0.008, 1.3 + k * 0.42, -0.05);
  (box("full width tail bar", 3.9, 0.24, 0.12, mats.tailHot, 0, 1.24, 4.42),
    box("tail bar backplate", 4.1, 0.4, 0.08, mats.matte, 0, 1.22, 4.36),
    box("rear diffuser", 3.4, 0.3, 0.6, mats.dark, 0, 0.5, 4.3, 0.25));
  for (const y of [-0.72, 0.72]) box("slit headlight", 0.85, 0.09, 0.14, mats.headLamp, y, 0.92, -6.1, -0.1);
  for (const y of [-1.5, 1.5]) box("beltline chrome strip", 0.05, 0.06, 5.4, mats.chrome, y * 1.36, 1.3, -0.4);
  for (const y of [-0.4, 0.4]) {
    const ex = new Mesh(new CylinderGeometry(0.19, 0.19, 0.6, 16), mats.chrome);
    ((ex.name = "center exhaust"), (ex.rotation.x = Math.PI / 2), ex.position.set(y, 0.62, 4.65), t.add(ex));
  }
  (K.wheel(-2.14, -3.1, !0, 0.82, 0.56),
    K.wheel(2.14, -3.1, !0, 0.82, 0.56),
    K.wheel(-1.95, 2.3, !1, 0.86, 0.6),
    K.wheel(1.95, 2.3, !1, 0.86, 0.6));
  ((t.userData.frontWheels = K.frontWheels),
    (t.userData.detailReport = { fins: 2, deckVents: 6, tailBar: !0, canopy: !0 }));
  t.traverse((s) => {
    ((s.castShadow = !0), (s.receiveShadow = !0));
  });
  return (et.add(t), t);
}
function buildBrawler(bodyColor = 4165830, trimColor = 15908108) {
  // Wide muscle bruiser: high blocky body, hood scoop with blower, ducktail, side pipes, quad round lamps.
  const t = new Group(),
    K = carPartKit(t, bodyColor, trimColor),
    { mats, box } = K;
  (box("undertray", 5, 0.3, 7.6, mats.black, 0, 0.48, 0),
    box("slab muscle body", 5.15, 1.05, 6.9, mats.body, 0, 1.1, 0, -0.01),
    box("blunt nose clip", 4.6, 0.8, 1.3, mats.body, 0, 1, -4, -0.06),
    box("chin spoiler", 5, 0.24, 0.5, mats.dark, 0, 0.48, -4.5),
    box("hood panel", 3.6, 0.14, 2.6, mats.trim, 0, 1.66, -2.4, -0.04),
    box("hood scoop", 1.5, 0.42, 1.5, mats.dark, 0, 1.86, -2.2),
    box("exposed blower intake", 1.05, 0.3, 0.75, mats.chrome, 0, 2.12, -2.15),
    box("cabin greenhouse", 3.2, 0.85, 2.5, mats.body, 0, 1.98, 0.55, -0.03),
    box("windshield", 2.9, 0.14, 1.2, mats.glass, 0, 2.1, -0.7, -0.5),
    box("rear glass", 2.9, 0.13, 1, mats.glass, 0, 2.12, 1.85, 0.44),
    box("left door glass", 0.12, 0.62, 2, mats.glass, -1.58, 2.05, 0.5),
    box("right door glass", 0.12, 0.62, 2, mats.glass, 1.58, 2.05, 0.5),
    box("ducktail spoiler", 4.9, 0.2, 0.9, mats.body, 0, 1.9, 3.5, 0.2),
    box("rear valance", 4.8, 0.6, 0.3, mats.dark, 0, 0.85, 3.72));
  for (const y of [-2.05, -0.85, 0.85, 2.05]) {
    const lamp = new Mesh(new CylinderGeometry(0.21, 0.21, 0.1, 18), Math.abs(y) > 1.4 ? mats.tailHot : mats.tailWarm);
    ((lamp.name = "round tail lamp"), (lamp.rotation.x = Math.PI / 2), lamp.position.set(y, 1.28, 3.78), t.add(lamp));
  }
  for (const y of [-1.7, 1.7]) box("square headlamp", 0.7, 0.3, 0.12, mats.headLamp, y, 1.22, -4.62);
  box("chrome front grille", 2.2, 0.4, 0.1, mats.chrome, 0, 1.2, -4.62);
  for (const s of [-1, 1]) {
    const pipe = new Mesh(new CylinderGeometry(0.16, 0.16, 3.4, 14), mats.chrome);
    ((pipe.name = "side exhaust pipe"), (pipe.rotation.x = Math.PI / 2), pipe.position.set(s * 2.62, 0.55, 0.4), t.add(pipe));
    box("side pipe heat shield", 0.16, 0.28, 2.4, mats.dark, s * 2.62, 0.72, 0.4);
    box("fender flare front", 0.5, 0.6, 1.6, mats.body, s * 2.6, 1, -2.5, -0.03);
    box("fender flare rear", 0.55, 0.68, 1.9, mats.body, s * 2.62, 1.05, 2.3, -0.03);
    box("racing stripe", 0.8, 0.02, 6.8, mats.trim, s * 0.55, 1.72, 0, -0.008);
  }
  (K.wheel(-2.35, -2.5, !0, 0.86, 0.62),
    K.wheel(2.35, -2.5, !0, 0.86, 0.62),
    K.wheel(-2.4, 2.3, !1, 0.98, 0.78),
    K.wheel(2.4, 2.3, !1, 0.98, 0.78));
  ((t.userData.frontWheels = K.frontWheels),
    (t.userData.detailReport = { blower: !0, sidePipes: 2, roundLamps: 4, ducktail: !0 }));
  t.traverse((s) => {
    ((s.castShadow = !0), (s.receiveShadow = !0));
  });
  return (et.add(t), t);
}
function buildZephyr(bodyColor = 16764159, trimColor = 526344) {
  // Featherweight sprint buggy: short wheelbase, exposed roll cage + halo, fender pods, roof scoop.
  const t = new Group(),
    K = carPartKit(t, bodyColor, trimColor),
    { mats, box } = K;
  (box("stubby undertray", 3.9, 0.26, 6.2, mats.black, 0, 0.46, 0),
    box("tub body", 3.55, 0.72, 5.4, mats.body, 0, 0.92, 0.1, -0.02),
    box("snub nose", 2.5, 0.5, 1.2, mats.body, 0, 0.84, -3.15, -0.16),
    box("front splitter lip", 3.8, 0.12, 0.5, mats.dark, 0, 0.42, -3.7),
    box("open cockpit surround", 2.4, 0.4, 2.4, mats.trim, 0, 1.34, 0, -0.03),
    box("low windscreen", 2, 0.12, 0.7, mats.glass, 0, 1.62, -1.15, -0.55),
    box("halo spine", 0.16, 0.14, 1.9, mats.dark, 0, 2.08, -0.15, -0.1),
    box("seat back panel", 1.7, 0.7, 0.2, mats.dark, 0, 1.6, 0.95),
    box("roof air scoop", 0.9, 0.45, 1.1, mats.trim, 0, 2.02, 0.65, 0.12),
    box("scoop mouth", 0.62, 0.24, 0.14, mats.black, 0, 2.08, 0.08),
    box("rear deck", 3.3, 0.3, 1.8, mats.body, 0, 1.16, 2.2, -0.06),
    box("kart wing", 3.7, 0.12, 0.7, mats.trim, 0, 1.78, 2.9, -0.1),
    box("wing left strut", 0.12, 0.5, 0.3, mats.dark, -1.35, 1.5, 2.9),
    box("wing right strut", 0.12, 0.5, 0.3, mats.dark, 1.35, 1.5, 2.9),
    box("rear mesh panel", 2.6, 0.5, 0.1, mats.dark, 0, 0.95, 3.1));
  for (const s of [-1, 1]) {
    const bar = new Mesh(new CylinderGeometry(0.09, 0.09, 1.35, 10), mats.steel);
    ((bar.name = "roll cage hoop"), (bar.rotation.z = s * 0.42), bar.position.set(s * 0.75, 1.85, 0.35), t.add(bar));
    (box("front fender pod", 0.62, 0.4, 1.5, mats.body, s * 1.85, 0.95, -2.15, -0.05),
      box("rear fender pod", 0.68, 0.46, 1.7, mats.body, s * 1.9, 1, 2.15, -0.05),
      box("pod brace arm", 0.5, 0.1, 0.12, mats.steel, s * 1.45, 0.98, -2.15),
      box("number roundel", 0.04, 0.5, 0.5, mats.trim, s * 1.79, 1.05, 0.2));
  }
  for (const y of [-0.85, 0.85])
    (box("bug eye headlamp", 0.34, 0.26, 0.14, mats.headLamp, y, 1.08, -3.66),
      box("tail lamp block", 0.4, 0.22, 0.1, Math.abs(y) > 0.5 ? mats.tailHot : mats.tailWarm, y * 1.6, 1.14, 3.14));
  {
    const ex = new Mesh(new CylinderGeometry(0.15, 0.15, 0.5, 14), mats.chrome);
    ((ex.name = "single stinger exhaust"), (ex.rotation.x = Math.PI / 2), ex.position.set(0.65, 0.78, 3.28), t.add(ex));
  }
  (K.wheel(-1.85, -2.15, !0, 0.74, 0.52),
    K.wheel(1.85, -2.15, !0, 0.74, 0.52),
    K.wheel(-1.9, 2.15, !1, 0.8, 0.58),
    K.wheel(1.9, 2.15, !1, 0.8, 0.58));
  ((t.userData.frontWheels = K.frontWheels),
    (t.userData.detailReport = { rollCage: !0, fenderPods: 4, halo: !0, wing: !0 }));
  t.traverse((s) => {
    ((s.castShadow = !0), (s.receiveShadow = !0));
  });
  return (et.add(t), t);
}
const CAR_MODELS = [
  { key: "interceptor", label: "Interceptor", trait: "balanced", stats: { accel: 1, top: 1, grip: 1, boostRegen: 1 }, build: () => Gd(3108784, 1916782) },
  { key: "bullet", label: "Bullet GT", trait: "top speed", stats: { accel: 0.9, top: 1.09, grip: 0.94, boostRegen: 1 }, build: () => buildBulletGT() },
  { key: "brawler", label: "Brawler 442", trait: "acceleration", stats: { accel: 1.16, top: 0.95, grip: 1.04, boostRegen: 0.92 }, build: () => buildBrawler() },
  { key: "zephyr", label: "Zephyr Kart", trait: "grip + boost", stats: { accel: 1.06, top: 0.9, grip: 1.18, boostRegen: 1.18 }, build: () => buildZephyr() },
];
let carModelIndex = MathUtils.clamp(Number(localStorage.getItem("steel-ribbon-carmodel") || 0), 0, 3);
function carStats() {
  return u.drivingStolen && stolenRide
    ? STOLEN_STATS[stolenRide.type] || STOLEN_STATS.compact
    : CAR_MODELS[carModelIndex].stats;
}
const RIVAL_DEFS = [
  { key: "crowther", label: "Crowther", body: 13710372, trim: 7740696, lane: 0.02, base: 97, wave: 5, waveFreq: 0.6 },
  { key: "bishop", label: "Bishop", body: 3244268, trim: 1400130, lane: -0.3, base: 92, wave: 9, waveFreq: 0.95 },
  { key: "maddock", label: "Maddock", body: 16770387, trim: 5723991, lane: 0.3, base: 91, wave: 6, waveFreq: 0.5 },
];
// race-number roundels + livery (zoom-detail item 18b): rivals are race cars
// and they sit ~10m ahead of the player for the whole race — give them door,
// roof and tail roundels, name strips and twin racing stripes. One merged
// add-on mesh per car (alphaTest cutouts), one shared atlas, player included.
const RACE_LIVERY = { crowther: { n: 2, col: 0, trim: 7740696 }, bishop: { n: 5, col: 1, trim: 1400130 }, maddock: { n: 9, col: 2, trim: 5723991 }, you: { n: 7, col: 3, trim: 13120044 } };
let liveryAtlasTex = null,
  liveryMat = null;
function buildLiveryAtlas() {
  if (liveryMat) return liveryMat;
  const cv = document.createElement("canvas");
  ((cv.width = 512), (cv.height = 512));
  const g = cv.getContext("2d"),
    ks = ["crowther", "bishop", "maddock", "you"];
  g.clearRect(0, 0, 512, 512);
  for (let c = 0; c < 4; c++) {
    const x = c * 128,
      L = RACE_LIVERY[ks[c]];
    ((g.fillStyle = "#f6f4ec"), g.beginPath(), g.arc(x + 64, 64, 56, 0, 6.29), g.fill());
    ((g.strokeStyle = "#20242c"), (g.lineWidth = 5), g.beginPath(), g.arc(x + 64, 64, 53, 0, 6.29), g.stroke());
    ((g.fillStyle = "#16181e"), (g.font = "900 78px sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(String(L.n), x + 64, 70);
    const t = "#" + L.trim.toString(16).padStart(6, "0");
    ((g.fillStyle = t), g.fillRect(x + 8, 136, 112, 48));
  }
  ((g.font = "900 44px sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
  const names = ["CROWTHER", "BISHOP", "MADDOCK"];
  for (let i = 0; i < 3; i++) {
    const y = 200 + i * 64;
    ((g.fillStyle = "rgba(246,244,236,0.92)"), g.fillRect(4, y, 248, 56), (g.fillStyle = "#16181e"));
    g.fillText(names[i], 128, y + 30, 236);
  }
  liveryAtlasTex = new CanvasTexture(cv);
  liveryAtlasTex.colorSpace = SRGBColorSpace;
  liveryMat = new MeshBasicMaterial({ map: liveryAtlasTex, transparent: !0, alphaTest: 0.3, toneMapped: !1, polygonOffset: !0, polygonOffsetFactor: -2, side: DoubleSide });
  return liveryMat;
}
const _lbb = new Box3(),
  _lsz = new Vector3(),
  _lct = new Vector3();
function _uvCell(geo, u0, v0, u1, v1) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
  return geo;
}
function addRaceLivery(mesh, key) {
  const L = RACE_LIVERY[key];
  if (!L || mesh.userData.liveryN) return;
  const mat = buildLiveryAtlas();
  (_lbb.setFromObject(mesh), _lbb.getSize(_lsz), _lbb.getCenter(_lct));
  const cy = _lct.y - mesh.position.y,
    topY = _lbb.max.y - mesh.position.y,
    halfW = _lsz.x / 2,
    rearZ = _lbb.min.z - mesh.position.z, // local +z is the NOSE on these builds
    u0 = L.col / 4,
    u1 = (L.col + 1) / 4,
    rv0 = 1 - 128 / 512,
    parts = [];
  // door roundels (both sides)
  for (const sx of [-1, 1]) {
    const q = _uvCell(new PlaneGeometry(0.62, 0.62), u0, rv0, u1, 1);
    (q.rotateY((sx * Math.PI) / 2), q.translate(sx * (halfW + 0.012), cy + 0.12, 0.1), parts.push(q));
  }
  // roof + tail roundels (the chase camera stares at these)
  const roof = _uvCell(new PlaneGeometry(0.72, 0.72), u0, rv0, u1, 1);
  (roof.rotateX(-Math.PI / 2), roof.translate(0, topY + 0.015, 0.15), parts.push(roof));
  const tail = _uvCell(new PlaneGeometry(0.5, 0.5), u0, rv0, u1, 1);
  (tail.rotateY(Math.PI), tail.translate(0, cy + 0.18, rearZ - 0.012), parts.push(tail));
  // twin racing stripes over the roofline, tinted via the solid trim cell
  const su0 = L.col / 4 + 0.02,
    su1 = (L.col + 1) / 4 - 0.02;
  for (const sx of [-0.24, 0.24]) {
    const st = _uvCell(new PlaneGeometry(0.2, _lsz.z * 0.55), su0, 1 - 184 / 512, su1, 1 - 140 / 512);
    (st.rotateX(-Math.PI / 2), st.translate(sx, topY + 0.012, 0), parts.push(st));
  }
  // rival name strip above the door roundel
  if (L.col < 3)
    for (const sx of [-1, 1]) {
      const nv0 = 1 - (256 + L.col * 64) / 512,
        ns = _uvCell(new PlaneGeometry(1.35, 0.3), 8 / 512, nv0, 252 / 512, nv0 + 56 / 512);
      (ns.rotateY((sx * Math.PI) / 2), ns.translate(sx * (halfW + 0.012), cy + 0.62, 0.1), parts.push(ns));
    }
  const add = new Mesh(mergeGeometries(parts, !1), mat);
  // raycast-invisible: the roof quad rides just above the player car and the
  // roam physics probes ground/water by raycasting down through the car —
  // a hit here reads as "ground at roof height" and ponds never drag
  ((add.raycast = () => {}), (add.castShadow = !1), (add.receiveShadow = !1), mesh.add(add), (mesh.userData.liveryN = L.n));
}
const rivals = RIVAL_DEFS.map((d, idx) => ({
  ...d,
  idx,
  mesh: Gd(d.body, d.trim),
  distance: -900,
  s: 0,
  speed: 58,
  phase: idx * 2.13,
  finished: 0,
  progEl: null,
}));
const es = rivals[0].mesh;
for (const r of rivals) addRaceLivery(r.mesh, r.key);
let cn = CAR_MODELS[carModelIndex].build();
addRaceLivery(cn, "you");
function applyCarSelection(idx) {
  ((carModelIndex = MathUtils.clamp(idx, 0, CAR_MODELS.length - 1)),
    localStorage.setItem("steel-ribbon-carmodel", String(carModelIndex)));
  const wasVisible = cn.visible;
  Po(cn);
  ((cn = CAR_MODELS[carModelIndex].build()), (cn.visible = wasVisible));
  addRaceLivery(cn, "you");
  typeof refreshCarUI == "function" && refreshCarUI();
}
for (const r of rivals) ((r.mesh.visible = !1), et.add(r.mesh));
function setRivalsVisible(v) {
  for (const r of rivals) r.mesh.visible = v;
}
const SEASON_PTS = [10, 6, 4, 2];
let season = null;
try {
  season = JSON.parse(localStorage.getItem("steel-ribbon-season") || "null");
} catch {}
function seasonDivision() {
  return season?.active ? season.division : Number(localStorage.getItem("steel-ribbon-division") || 4);
}
function saveSeason() {
  localStorage.setItem("steel-ribbon-season", JSON.stringify(season));
}
function newSeason() {
  ((season = {
    division: seasonDivision(),
    raceIndex: 0,
    points: { you: 0, crowther: 0, bishop: 0, maddock: 0 },
    active: !0,
  }),
    saveSeason());
}
function divisionName(d) {
  return ["One", "Two", "Three", "Four"][MathUtils.clamp(d, 1, 4) - 1];
}
function seasonStandings() {
  const rows = [
    { key: "you", label: "You", pts: season?.points.you ?? 0 },
    ...RIVAL_DEFS.map((r) => ({ key: r.key, label: r.label, pts: season?.points[r.key] ?? 0 })),
  ];
  // Ties put the player last — you start each season at the bottom of the division.
  return rows.sort((a, b) => b.pts - a.pts || (a.key === "you" ? 1 : b.key === "you" ? -1 : 0));
}
cn.visible = !1;
P1();
R1();
qe.signs = 0;
Pa.length = 0;
L1();
D1();
N1();
let Ph = null,
  Lh = null,
  Dh = null,
  qn = null,
  Ro = null;
const nn = [];
Y1();
// Remove a vehicle built from the shared vertex-color materials: dispose its (unique)
// geometries but never the shared materials — Po would force a recompile for every car.
function removeVehicleMesh(i) {
  i && (i.traverse((e) => e.geometry && e.geometry.dispose()), et.remove(i));
}
function Po(i) {
  i &&
    (i.traverse((e) => {
      if ((e.geometry && e.geometry.dispose(), e.material)) {
        const t = Array.isArray(e.material) ? e.material : [e.material];
        for (const n of t) (n.map && n.map.dispose(), n.dispose());
      }
    }),
    et.remove(i));
}
// --- Elevated-track gameplay gear: boost pads, kerb reflectors, gap warning beacons ---
const boostPads = [],
  gapBeaconMats = [];
let Gh = null;
function pg1() {
  const i = document.createElement("canvas");
  ((i.width = 128), (i.height = 192));
  const e = i.getContext("2d");
  e.clearRect(0, 0, 128, 192);
  ((e.strokeStyle = "#5ff5ff"), (e.lineWidth = 22), (e.lineJoin = "round"), (e.lineCap = "round"));
  for (const t of [36, 96, 156]) {
    e.beginPath();
    (e.moveTo(24, t + 22), e.lineTo(64, t - 22), e.lineTo(104, t + 22), e.stroke());
  }
  const n = new CanvasTexture(i);
  return ((n.colorSpace = SRGBColorSpace), n);
}
function railSkipZone(s, sideSign) {
  if (Li(s)) return !0;
  for (const g of ce.gaps) if (s > g.start - 8 && s < g.end + 8) return !0;
  for (const r of Dr) {
    if (r.dirSel !== sideSign) continue;
    if (r.rampType === "on" && r.mergeS != null && s > r.mergeS - 8 && s < r.mergeS + 34) return !0;
    if (r.rampType === "off" && r.exitS != null && s > r.exitS - 34 && s < r.exitS + 8) return !0;
  }
  return !1;
}
function buildGuardrails(parent) {
  const railMat = new MeshStandardMaterial({
      color: 11253456,
      roughness: 0.38,
      metalness: 0.62,
      emissive: 3821654,
      emissiveIntensity: 0.32,
      side: DoubleSide,
    }),
    postGeo = new CylinderGeometry(0.09, 0.12, 1.05, 6),
    postMat = new MeshStandardMaterial({ color: 4210757, roughness: 0.55, metalness: 0.5 }),
    step = 6;
  let railRuns = 0,
    postCount = 0;
  const postIM = new InstancedMesh(postGeo, postMat, Math.ceil((ce.length / 12) * 2) + 8),
    dummy = new Object3D();
  for (const sideSign of [-1, 1]) {
    const lat = sideSign * (ce.width * 0.5 + 0.55),
      pos = [],
      flushRun = (run) => {
        if (run.length < 2) return;
        for (let k = 0; k < run.length - 1; k++) {
          const a = run[k],
            b = run[k + 1];
          // rail band 0.55..0.95 above the deck surface — two triangles per segment
          pos.push(a.x, a.y + 1.12, a.z, b.x, b.y + 1.12, b.z, b.x, b.y + 1.5, b.z);
          pos.push(a.x, a.y + 1.12, a.z, b.x, b.y + 1.5, b.z, a.x, a.y + 1.5, a.z);
        }
        railRuns++;
      };
    let run = [];
    for (let s = 0; s <= ce.length; s += step) {
      if (railSkipZone(s % ce.length, sideSign)) {
        (flushRun(run), (run = []));
        continue;
      }
      const c = St(s % ce.length);
      run.push(c.p.clone().addScaledVector(c.side, lat).addScaledVector(on, 0.58));
      if (s % 12 === 0) {
        const pp = run[run.length - 1];
        (dummy.position.set(pp.x, pp.y + 0.95, pp.z), dummy.updateMatrix(), postIM.setMatrixAt(postCount++, dummy.matrix));
      }
    }
    flushRun(run);
    if (pos.length) {
      const g = new BufferGeometry();
      (g.setAttribute("position", new Float32BufferAttribute(pos, 3)), g.computeVertexNormals());
      parent.add(new Mesh(g, railMat));
    }
  }
  ((postIM.count = postCount), (postIM.instanceMatrix.needsUpdate = !0), parent.add(postIM));
  ((qe.railRuns = railRuns), (qe.railPosts = postCount));
  roadsideSys.buildStations();
}
function buildTrackGear() {
  ((boostPads.length = 0), (gapBeaconMats.length = 0));
  const i = new Group(),
    e = new MeshBasicMaterial({
      map: pg1(),
      transparent: !0,
      depthWrite: !1,
      side: DoubleSide,
      blending: AdditiveBlending,
      opacity: 0.9,
    }),
    t = new PlaneGeometry(3.6, 5.4);
  t.rotateX(-Math.PI / 2);
  for (let a = 170; a < ce.length - 60; a += 290) {
    if (ce.gaps.some((o) => a > o.start - 70 && o.end + 70 > a)) continue;
    const o = [-0.24, 0, 0.24][boostPads.length % 3] * ce.width,
      c = St(a),
      l = new Mesh(t, e),
      deckNormal = new Vector3().crossVectors(c.side, c.tangent).normalize();
    deckNormal.y < 0 && deckNormal.multiplyScalar(-1);
    const d = new Matrix4().makeBasis(
      c.side,
      deckNormal,
      new Vector3().crossVectors(c.side, deckNormal).normalize(),
    );
    (l.quaternion.setFromRotationMatrix(d),
      l.position.copy(c.p).addScaledVector(c.side, o).addScaledVector(deckNormal, 0.84),
      i.add(l),
      boostPads.push({ s: a, lat: o }));
  }
  const n = new SphereGeometry(0.17, 8, 6),
    s = new MeshStandardMaterial({ color: 16768392, emissive: 16757052, emissiveIntensity: 2.1, roughness: 0.4 }),
    r = Math.max(60, Math.round(ce.length / 24));
  {
    const a = new InstancedMesh(n, s, r * 2),
      o = new Object3D();
    let c = 0;
    for (let l = 0; l < r; l++) {
      const d = (l / r) * ce.length;
      if (Li(d)) continue;
      const f = St(d);
      for (const p of [-1, 1])
        (o.position
          .copy(f.p)
          .addScaledVector(f.side, p * (ce.width * 0.5 + 0.22))
          .addScaledVector(on, 0.78),
          o.updateMatrix(),
          a.setMatrixAt(c++, o.matrix));
    }
    ((a.count = c), (a.instanceMatrix.needsUpdate = !0), i.add(a));
  }
  const beaconPost = new CylinderGeometry(0.09, 0.12, 1.5, 8),
    postMat = new MeshStandardMaterial({ color: 2500134, roughness: 0.6, metalness: 0.4 });
  for (const a of ce.gaps) {
    const o = St(Math.max(6, a.start - 22));
    for (const c of [-1, 1]) {
      const l = new MeshStandardMaterial({ color: 16724787, emissive: 16719904, emissiveIntensity: 1.6, roughness: 0.35 }),
        d = new Group(),
        f = new Mesh(beaconPost, postMat),
        p = new Mesh(new SphereGeometry(0.3, 10, 8), l);
      ((f.position.y = 0.75), (p.position.y = 1.65), d.add(f), d.add(p));
      (d.position.copy(o.p).addScaledVector(o.side, c * (ce.width * 0.5 + 0.55)).addScaledVector(on, 0.55),
        i.add(d),
        gapBeaconMats.push(l));
    }
  }
  buildGuardrails(i);
  return (et.add(i), i);
}
Bn(new Object3D(), (i) => {
  if (!gapBeaconMats.length) return;
  const e = Math.sin(i * 8) > 0 ? 2.3 : 0.3;
  for (const t of gapBeaconMats) t.emissiveIntensity = e;
});
function cl(i) {
  return (
    (Ma = MathUtils.clamp(i, 0, is.length - 1)),
    (ce = is[Ma]),
    ($n.length = 0),
    (Dr.length = 0),
    Po(Ph),
    Po(Lh),
    Po(Dh),
    Po(Gh),
    (Ph = X1()),
    (Lh = q1()),
    (Dh = z1()),
    (Gh = buildTrackGear()),
    bakeMinimap(),
    (Qe.trackName.textContent = ce.name),
    Qe.courseName && (Qe.courseName.textContent = ce.name),
    Qe.courseButtons.forEach((e) => {
      e.classList.toggle("active", Number(e.dataset.course) === Ma);
    }),
    ce.name
  );
}
cl(0);
function Z1() {
  (Ro && et.remove(Ro), (nn.length = 0));
  const i = new Group(),
    e = new MeshStandardMaterial({ color: 5239807, roughness: 0.16, metalness: 0.08, emissive: 1619711, emissiveIntensity: 1.55 }),
    t = new MeshBasicMaterial({ color: 16769146, transparent: !0, opacity: 0.42, depthWrite: !1, side: DoubleSide, blending: AdditiveBlending }),
    n = [
      { x: 80, z: 245, yaw: 0, label: "CROSSWALK GATE" },
      { x: 80, z: 112, yaw: 0, label: "NEON STRAIGHT" },
      { x: 210, z: 120, yaw: Math.PI / 2, label: "MIDTOWN TURN" },
      { x: 340, z: -10, yaw: 0, label: "GARAGE ROW" },
      { x: 210, z: -270, yaw: Math.PI / 2, label: "SIGN SPRINT" },
      { x: 80, z: -400, yaw: 0, label: "RIBBON VIEW" },
      { x: -50, z: -270, yaw: Math.PI / 2, label: "BRICK BLOCK" },
      { x: -50, z: -10, yaw: 0, label: "CITY LOOP" },
    ];
  for (let s = 0; s < n.length; s++) {
    const r = n[s],
      a = He(r.x, r.z) + 4.2,
      o = new Group(),
      c = new Mesh(new TorusGeometry(5.6, 0.22, 12, 52), e.clone());
    ((c.rotation.y = r.yaw), o.add(c));
    const l = new Mesh(new CircleGeometry(4.7, 32), t.clone());
    ((l.rotation.y = r.yaw), o.add(l));
    const d = new MeshStandardMaterial({ color: 1120288, roughness: 0.42, metalness: 0.55 });
    for (const p of [-5.1, 5.1]) {
      const m = new Mesh(new CylinderGeometry(0.11, 0.16, 6.2, 8), d);
      (m.position.set(Math.cos(r.yaw) * p, -1.1, Math.sin(r.yaw) * p), o.add(m));
    }
    const f = new Mesh(new SphereGeometry(0.45, 16, 10), e.clone());
    ((f.position.y = 4.1),
      o.add(f),
      o.position.set(r.x, a, r.z),
      (o.userData.index = s),
      (o.userData.baseY = a),
      (o.userData.label = r.label),
      i.add(o),
      nn.push({ ...r, y: a, radius: 8.5, marker: o, collected: !1 }));
  }
  (Bn(i, (s) => {
    for (let r = 0; r < nn.length; r++) {
      const a = nn[r],
        o = r === u.objectiveIndex;
      ((a.marker.visible = !a.collected || o),
        (a.marker.position.y = a.y + Math.sin(s * 2.2 + r) * 0.35),
        (a.marker.rotation.z = Math.sin(s * 1.3 + r) * 0.035),
        a.marker.scale.setScalar(o ? 1.16 + Math.sin(s * 5) * 0.035 : 0.82),
        a.marker.traverse((c) => {
          c.material?.emissive && (c.material.emissiveIntensity = o ? 2.4 : 0.65);
        }));
    }
  }),
    et.add(i),
    (Ro = i));
}
Z1();
function buildPonds() {
  const i = new Group(),
    e = new MeshStandardMaterial({ color: 9075548, roughness: 0.98, metalness: 0.02 });
  let placed = 0;
  for (let t = 0; t < 900 && placed < 4; t++) {
    const n = -560 + Math.random() * 1120,
      s = -1330 + Math.random() * 1620,
      r = 15 + Math.random() * 12;
    if (Hi(n, s, r * 2 + 14, r * 2 + 14, 10)) continue;
    // A pond under an elevated deck is fine (bridge over water) — just keep off the course centerline
    // so ground-level ramp mouths never open into deep water.
    if (Pn(n, s, r).clearance < -6) continue;
    if (nn.some((c) => Math.hypot(c.x - n, c.z - s) < r + 26)) continue;
    if (ponds.some((c) => Math.hypot(c.x - n, c.z - s) < c.rx + r + 60)) continue;
    if (Mn.some((c) => Math.abs(c.x - n) < c.hw + r + 2 && Math.abs(c.z - s) < c.hd + r + 2)) continue;
    if (
      Di.some((c) => {
        const l = c.radius != null ? c.radius : Math.max(c.hw ?? 0, c.hd ?? 0);
        return Math.hypot(c.x - n, c.z - s) < l + r + 2;
      })
    )
      continue;
    // visual-only scenery (lawn trees, rocks, fields) lives in the Sa registry, not the collider arrays
    if (Sa.some((c) => Math.hypot(c.x - n, c.z - s) < (c.radius || 4) + r + 2)) continue;
    // reject sloped ground — a flat water disc must not clip a hillside
    const a = He(n, s);
    if (
      Math.max(
        Math.abs(He(n + r, s) - a),
        Math.abs(He(n - r, s) - a),
        Math.abs(He(n, s + r) - a),
        Math.abs(He(n, s - r) - a),
      ) > 1.7
    )
      continue;
    const o = new Mesh(new RingGeometry(r * 0.96, r * 1.18, 36), e);
    ((o.rotation.x = -Math.PI / 2), o.position.set(n, a + 0.09, s), (o.renderOrder = -4), i.add(o));
    const c = new Mesh(new CircleGeometry(r, 36), makeWaterMaterial(Math.max(1.2, r / 13)));
    ((c.rotation.x = -Math.PI / 2), c.position.set(n, a + 0.15, s), (c.renderOrder = -3), i.add(c));
    (registerPond(n, s, r * 0.98), placed++);
  }
  ((qe.ponds = placed), et.add(i), bakeMinimap());
}
buildPonds();
// ─── On-foot walker + helicopter and its pad ───
const walker = U1(3375807, 15905331);
((walker.visible = !1), walker.scale.setScalar(1.06), et.add(walker));
const parkedCarPos = new Vector3(0, 0, 0);
let parkedCarYaw = 0;
let heli = null;
function buildHelicopter() {
  const t = new Group(),
    body = new MeshStandardMaterial({ color: 12872961, roughness: 0.32, metalness: 0.55, envMapIntensity: 1.1 }),
    dark = new MeshStandardMaterial({ color: 1710623, roughness: 0.5, metalness: 0.3 }),
    glass = new MeshStandardMaterial({
      color: 7924479,
      roughness: 0.06,
      metalness: 0.02,
      transparent: !0,
      opacity: 0.42,
      envMapIntensity: 1.5,
    }),
    steel = new MeshStandardMaterial({ color: 5860442, roughness: 0.25, metalness: 0.8 }),
    lamp = new MeshStandardMaterial({ color: 16722713, roughness: 0.2, emissive: 16717836, emissiveIntensity: 2 }),
    part = (name, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const m = new Mesh(geo, mat);
      return ((m.name = name), m.position.set(x, y, z), m.rotation.set(rx, ry, rz), t.add(m), m);
    };
  (part("cabin hull", new BoxGeometry(2.5, 2, 4.4), body, 0, 2.1, -0.4),
    part("cabin floor pan", new BoxGeometry(2.6, 0.4, 4.8), dark, 0, 1.05, -0.3),
    part("nose glass", new BoxGeometry(2.1, 1.5, 1.1), glass, 0, 2.2, -2.6, -0.2),
    part("left door glass", new BoxGeometry(0.1, 1.1, 2), glass, -1.28, 2.3, -0.7),
    part("right door glass", new BoxGeometry(0.1, 1.1, 2), glass, 1.28, 2.3, -0.7),
    part("roof turbine housing", new BoxGeometry(1.5, 0.8, 2.4), dark, 0, 3.4, -0.2),
    part("exhaust stub", new CylinderGeometry(0.18, 0.22, 0.7, 10), steel, 0.7, 3.5, 0.9, Math.PI / 2.3),
    part("tail boom", new BoxGeometry(0.55, 0.6, 4.6), body, 0, 2.7, 3.4, 0.02),
    part("tail fin", new BoxGeometry(0.14, 1.5, 1), body, 0, 3.4, 5.5, 0, 0, 0),
    part("tail plane", new BoxGeometry(1.5, 0.12, 0.6), body, 0, 3, 4.6),
    part("nose lamp", new BoxGeometry(0.5, 0.2, 0.12), lamp, 0, 1.6, -2.95));
  for (const s of [-1, 1])
    (part("skid rail", new BoxGeometry(0.16, 0.16, 4.4), steel, s * 1.15, 0.32, -0.4),
      part("skid strut front", new BoxGeometry(0.12, 0.9, 0.12), steel, s * 1.05, 0.85, -1.5, 0, 0, s * 0.22),
      part("skid strut rear", new BoxGeometry(0.12, 0.9, 0.12), steel, s * 1.05, 0.85, 0.9, 0, 0, s * 0.22));
  const hub = part("rotor hub", new CylinderGeometry(0.22, 0.28, 0.5, 10), steel, 0, 3.95, -0.2),
    rotor = new Group();
  rotor.name = "main rotor";
  for (const a of [0, Math.PI / 2]) {
    const blade = new Mesh(new BoxGeometry(11.4, 0.07, 0.44), dark);
    ((blade.rotation.y = a), rotor.add(blade));
  }
  (rotor.position.set(0, 4.2, -0.2), t.add(rotor));
  const tailRotor = new Group();
  tailRotor.name = "tail rotor";
  for (const a of [0, Math.PI / 2]) {
    const blade = new Mesh(new BoxGeometry(0.06, 1.7, 0.24), dark);
    ((blade.rotation.x = a), tailRotor.add(blade));
  }
  (tailRotor.position.set(0.36, 3.1, 5.6), t.add(tailRotor));
  t.traverse((s) => {
    ((s.castShadow = !0), (s.receiveShadow = !0));
  });
  return { mesh: t, rotor, tailRotor };
}
function buildHelipad() {
  let spot = null;
  for (let k = 0; k < 700 && !spot; k++) {
    const x = -520 + Math.random() * 1040,
      z = -1200 + Math.random() * 1500;
    if (Math.hypot(x - 80, z - 300) > (k < 350 ? 420 : 1200)) continue;
    if (Hi(x, z, 26, 26, 6)) continue;
    const a = He(x, z);
    if (
      Math.max(
        Math.abs(He(x + 11, z) - a),
        Math.abs(He(x - 11, z) - a),
        Math.abs(He(x, z + 11) - a),
        Math.abs(He(x, z - 11) - a),
      ) > 0.8
    )
      continue;
    if (Mn.some((c) => Math.abs(c.x - x) < c.hw + 13 && Math.abs(c.z - z) < c.hd + 13)) continue;
    if (Sa.some((c) => Math.hypot(c.x - x, c.z - z) < (c.radius || 4) + 13)) continue;
    if (ponds.some((c) => Math.hypot(c.x - x, c.z - z) < c.rx + 16)) continue;
    if (nn.some((c) => Math.hypot(c.x - x, c.z - z) < 24)) continue;
    if (Pn(x, z, 12).clearance < 2) continue;
    spot = { x, z, y: a };
  }
  spot || (spot = { x: 150, z: 330, y: He(150, 330) });
  const g = new Group(),
    padMat = new MeshStandardMaterial({ color: 4671310, roughness: 0.85, metalness: 0.05 }),
    pad = new Mesh(new CylinderGeometry(10.5, 11, 0.24, 36), padMat);
  (pad.position.set(spot.x, spot.y + 0.12, spot.z), (pad.receiveShadow = !0), g.add(pad));
  const hv = document.createElement("canvas");
  ((hv.width = 256), (hv.height = 256));
  const hc = hv.getContext("2d");
  ((hc.strokeStyle = "#ffd45b"),
    (hc.lineWidth = 12),
    hc.beginPath(),
    hc.arc(128, 128, 104, 0, Math.PI * 2),
    hc.stroke(),
    (hc.fillStyle = "#ffd45b"),
    (hc.font = "900 150px Arial"),
    (hc.textAlign = "center"),
    (hc.textBaseline = "middle"),
    hc.fillText("H", 128, 136));
  const htex = new CanvasTexture(hv);
  htex.colorSpace = SRGBColorSpace;
  const hMark = new Mesh(new CircleGeometry(9.6, 36), new MeshBasicMaterial({ map: htex, transparent: !0 }));
  ((hMark.rotation.x = -Math.PI / 2), hMark.position.set(spot.x, spot.y + 0.26, spot.z), g.add(hMark));
  const lampMat = new MeshStandardMaterial({ color: 6280948, emissive: 5301992, emissiveIntensity: 2.2, roughness: 0.4 });
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2,
      lm = new Mesh(new SphereGeometry(0.22, 8, 6), lampMat);
    (lm.position.set(spot.x + Math.cos(a) * 10.2, spot.y + 0.34, spot.z + Math.sin(a) * 10.2), g.add(lm));
  }
  et.add(g);
  const built = buildHelicopter();
  built.mesh.scale.setScalar(1.42);
  built.mesh.position.set(spot.x, spot.y + 0.24, spot.z);
  et.add(built.mesh);
  heli = {
    pad: spot,
    pos: new Vector3(spot.x, spot.y + 0.24, spot.z),
    yaw: Math.random() * Math.PI * 2,
    vel: new Vector3(),
    rpm: 0,
    mesh: built.mesh,
    rotor: built.rotor,
    tailRotor: built.tailRotor,
  };
  heli.mesh.quaternion.setFromAxisAngle(on, -heli.yaw);
  qe.helipad = { x: +spot.x.toFixed(1), z: +spot.z.toFixed(1) };
}
buildHelipad();
// ─── Stunt jumps: marked wedge ramps on open ground beside roads. The surface query (Ki)
// reports their height so the existing crest-launch physics does the flying; launching off
// one arms a slow-mo beat and an airtime bonus on landing. No colliders — pure ramp. ───
var stuntRamps = [],
  lastStuntRamp = null;
function stuntRampHeightAt(x, z) {
  if (!stuntRamps) return 0;
  for (const r of stuntRamps) {
    const dx = x - r.x,
      dz = z - r.z,
      f = dx * r.fx + dz * r.fz,
      lat = -dx * r.fz + dz * r.fx;
    if (f < 0 || f > r.len || Math.abs(lat) > r.w * 0.5) continue;
    lastStuntRamp = r;
    return (f / r.len) * r.h;
  }
  return 0;
}
function buildStuntRamps() {
  // Three flavors: jump (long launch), flip (short + steep, the car backflips),
  // hoop (a floating gold ring at the flight apex — thread it for double points).
  const TYPES = [
      { type: "jump", len: 17, h: 4.4, rail: 16734750 },
      { type: "flip", len: 11, h: 6, rail: 16724787 },
      { type: "hoop", len: 17, h: 4.4, rail: 16766208 },
    ],
    w = 7.5,
    orbMat = new MeshStandardMaterial({ color: 16764268, roughness: 0.3, emissive: 16750444, emissiveIntensity: 2.4 }),
    deckMat = new MeshStandardMaterial({
      color: 3821395,
      roughness: 0.78,
      metalness: 0.08,
      emissive: 1119519,
      emissiveIntensity: 0.35,
    }),
    stripeMat = new MeshStandardMaterial({ color: 16772736, roughness: 0.4, emissive: 16766208, emissiveIntensity: 1.3 }),
    hoopMat = new MeshStandardMaterial({ color: 16770669, roughness: 0.3, emissive: 16762880, emissiveIntensity: 1.9 });
  for (let k = 0; k < 700 && stuntRamps.length < 6; k++) {
    const spec = TYPES[stuntRamps.length % TYPES.length],
      { len, h } = spec,
      ns = Math.random() < 0.5,
      roadsN = Math.round((di.x1 - di.x0) / di.pitch),
      road = (ns ? di.x0 : di.zFar) + ((Math.random() * (ns ? roadsN : Math.round((di.zNear - di.zFar) / di.pitch))) | 0) * di.pitch,
      side = (Math.random() < 0.5 ? -1 : 1) * (di.streetW * 0.5 + 10 + Math.random() * 9),
      along = ns ? di.zFar + 120 + Math.random() * (di.zNear - di.zFar - 240) : di.x0 + 120 + Math.random() * (di.x1 - di.x0 - 240),
      x = ns ? road + side : along,
      z = ns ? along : road + side,
      yaw = ns ? (Math.random() < 0.5 ? 0 : Math.PI) : Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2,
      fx = Math.sin(yaw),
      fz = -Math.cos(yaw),
      ex = x + fx * len,
      ez = z + fz * len;
    if (Hi(x, z, w + 4, w + 4, 2) || Hi(ex, ez, w + 4, w + 4, 2)) continue;
    if (Pn(x, z, 8).clearance < 11 || Pn(ex, ez, 8).clearance < 11) continue;
    if (
      pondDepthAt(x, z).depth > 0 ||
      pondDepthAt(ex, ez).depth > 0 ||
      pondDepthAt(ex + fx * 40, ez + fz * 40).depth > 0
    )
      continue;
    if (Math.abs(He(x, z) - He(ex, ez)) > 1.1) continue;
    if (stuntRamps.some((r) => Math.hypot(r.x - x, r.z - z) < 150)) continue;
    // keep the approach, footprint and flight corridor clear of buildings AND props
    // (trees, rocks) — a jump you can't reach or that fires you into a wall is a prank
    const nearBox = (arr, px, pz, rad) =>
      arr.some(
        (cb) =>
          Math.abs(px - cb.x) < (cb.hw ?? cb.radius ?? 0) + rad && Math.abs(pz - cb.z) < (cb.hd ?? cb.radius ?? 0) + rad,
      );
    let blocked = !1;
    for (const [px, pz, rad] of [
      [x - fx * 45, z - fz * 45, 6],
      [x - fx * 22, z - fz * 22, 6],
      [x, z, 7],
      [ex, ez, 7],
      [ex + fx * 45, ez + fz * 45, 9],
      [ex + fx * 95, ez + fz * 95, 9],
    ])
      if (nearBox(Mn, px, pz, rad) || nearBox(Di, px, pz, rad)) {
        blocked = !0;
        break;
      }
    if (blocked) continue;
    const rec = { x, z, yaw, fx, fz, len, w, h, type: spec.type, rail: spec.rail };
    if (spec.type === "hoop") {
      const hy = He(x, z) + h + 13;
      rec.hoop = { x: ex + fx * 28, y: hy, z: ez + fz * 28, r: 7 };
    }
    stuntRamps.push(rec);
  }
  // world-space wedge + glowing edge rails + top corner orbs per ramp
  for (const r of stuntRamps) {
    const railMat = new MeshStandardMaterial({
      color: r.rail,
      roughness: 0.4,
      emissive: r.rail,
      emissiveIntensity: 1.6,
    });
    if (r.hoop) {
      const hoop = new Mesh(new TorusGeometry(r.hoop.r, 0.5, 10, 30), hoopMat);
      (hoop.position.set(r.hoop.x, r.hoop.y, r.hoop.z),
        hoop.lookAt(r.hoop.x + r.fx, r.hoop.y, r.hoop.z + r.fz),
        et.add(hoop));
    }
    const y0 = He(r.x, r.z) + 0.05,
      lx = -r.fz,
      lz = r.fx,
      hw = r.w * 0.5,
      A = [r.x - lx * hw, y0, r.z - lz * hw],
      B = [r.x + lx * hw, y0, r.z + lz * hw],
      C = [r.x + r.fx * r.len - lx * hw, y0, r.z + r.fz * r.len - lz * hw],
      D = [r.x + r.fx * r.len + lx * hw, y0, r.z + r.fz * r.len + lz * hw],
      Ct = [C[0], y0 + r.h, C[2]],
      Dt = [D[0], y0 + r.h, D[2]],
      pos = [
        // slope quad (two tris)
        ...A, ...B, ...Dt, ...A, ...Dt, ...Ct,
        // back face
        ...C, ...D, ...Dt, ...C, ...Dt, ...Ct,
        // left side tri
        ...A, ...Ct, ...C,
        // right side tri
        ...B, ...D, ...Dt,
      ],
      geo = new BufferGeometry();
    (geo.setAttribute("position", new Float32BufferAttribute(pos, 3)), geo.computeVertexNormals());
    const wedge = new Mesh(geo, deckMat);
    ((wedge.castShadow = !1), (wedge.receiveShadow = !0), et.add(wedge));
    const slopeLen = Math.hypot(r.len, r.h),
      railGeo = new BoxGeometry(0.26, 0.24, slopeLen),
      stripe = new Mesh(new BoxGeometry(1.1, 0.1, slopeLen * 0.94), stripeMat);
    (stripe.position.set(r.x + (r.fx * r.len) / 2, y0 + r.h / 2 + 0.08, r.z + (r.fz * r.len) / 2),
      stripe.lookAt(r.x + r.fx * r.len, y0 + r.h + 0.08, r.z + r.fz * r.len),
      et.add(stripe));
    for (const s of [-1, 1]) {
      const rail = new Mesh(railGeo, railMat),
        bx = r.x + lx * hw * s,
        bz = r.z + lz * hw * s,
        tx = r.x + r.fx * r.len + lx * hw * s,
        tz = r.z + r.fz * r.len + lz * hw * s;
      (rail.position.set((bx + tx) / 2, y0 + r.h / 2 + 0.12, (bz + tz) / 2),
        rail.lookAt(tx, y0 + r.h + 0.12, tz),
        et.add(rail));
      const orb = new Mesh(new SphereGeometry(0.34, 10, 8), orbMat);
      (orb.position.set(tx, y0 + r.h + 0.55, tz), et.add(orb));
    }
  }
  qe.stuntRamps = stuntRamps.length;
}
buildStuntRamps();
// ─── Ambient propeller planes: low-poly single-props cruising over the map with a
// gentle bank and visibly spinning propellers. Pure scenery. ───
// aerial ad banners towed behind the prop planes (zoom-detail item 13):
// fictional, world-consistent copy — big unlit lettering so it reads from the
// ribbon deck ~105m below the lanes. Back face mirrors like real fabric.
const PLANE_BANNERS = ["RIBBON CUP SUNDAY", "FLY ZEPHYR AIRWAYS", "PIXEL PAWN PAYS BEST", "SKYLINE PIER IS OPEN"];
const propPlaneMeta = [];
function buildPlaneBannerAtlas() {
  const cv = document.createElement("canvas");
  ((cv.width = 1024), (cv.height = 512));
  const g = cv.getContext("2d");
  for (let r = 0; r < 4; r++) {
    const y = r * 128;
    ((g.fillStyle = "#e8b93a"), g.fillRect(0, y, 1024, 128));
    ((g.fillStyle = "#232a3d"), g.fillRect(0, y, 16, 128), g.fillRect(1008, y, 16, 128));
    ((g.fillStyle = "#16181f"), (g.font = "900 96px sans-serif"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    g.fillText(PLANE_BANNERS[r], 512, y + 66, 950);
    g.fillStyle = "#6f6a58";
    for (const gx of [38, 986]) for (const gy of [y + 18, y + 110]) (g.beginPath(), g.arc(gx, gy, 6, 0, 6.29), g.fill());
  }
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}
// zoom-detail 47 (round-five item 10): fictional registration codes, one row
// per plane, dark stencil text on transparent — decals for fuselage + wing
const PLANE_REGS = ["SR-21A", "SR-07K", "SR-93B", "SR-42E"];
function buildPlaneRegAtlas() {
  const cv = document.createElement("canvas");
  ((cv.width = 256), (cv.height = 256));
  const g = cv.getContext("2d");
  for (let r = 0; r < 4; r++) {
    ((g.font = "900 44px monospace"), (g.textAlign = "center"), (g.textBaseline = "middle"));
    ((g.fillStyle = "rgba(24, 32, 44, 0.92)"), g.fillText(PLANE_REGS[r], 128, r * 64 + 32));
  }
  const t = new CanvasTexture(cv);
  return ((t.colorSpace = SRGBColorSpace), t);
}
function buildPropPlanes() {
  const lanes = [
    { z: -220, alt: 170, dir: 1, speed: 30, color: 16733525 },
    { z: -720, alt: 215, dir: -1, speed: 26, color: 16773083 },
    { z: -1150, alt: 190, dir: 1, speed: 34, color: 9096933 },
    { z: 120, alt: 240, dir: -1, speed: 24, color: 5817343 },
  ];
  const bannerAtlas = buildPlaneBannerAtlas(),
    bannerMat = new MeshBasicMaterial({ map: bannerAtlas, side: DoubleSide, toneMapped: !1 }),
    regMat = new MeshBasicMaterial({ map: buildPlaneRegAtlas(), transparent: !0, side: DoubleSide, toneMapped: !1 }),
    navRedMat = new MeshBasicMaterial({ color: 16721448, toneMapped: !1 }),
    navGreenMat = new MeshBasicMaterial({ color: 2293538, toneMapped: !1 }),
    discMat = new MeshBasicMaterial({ color: 13421772, transparent: !0, opacity: 0.15, depthWrite: !1, side: DoubleSide }),
    laneIdxRef = { i: 0 };
  qe.propPlanes = 0;
  for (const lane of lanes) {
    const plane = new Group(),
      bodyMat = new MeshStandardMaterial({ color: lane.color, roughness: 0.45, metalness: 0.18 }),
      darkMat = new MeshStandardMaterial({ color: 2236962, roughness: 0.55 });
    const fus = new Mesh(new CylinderGeometry(0.85, 1.15, 7.2, 10), bodyMat);
    ((fus.rotation.x = Math.PI / 2), plane.add(fus));
    const nose = new Mesh(new ConeGeometry(1.16, 2.1, 10), bodyMat);
    ((nose.rotation.x = -Math.PI / 2), (nose.position.z = -4.6), plane.add(nose));
    const canopy = new Mesh(new SphereGeometry(0.85, 10, 8), darkMat);
    ((canopy.scale.set(1, 0.7, 1.5)), canopy.position.set(0, 0.75, -0.9), plane.add(canopy));
    const wing = new Mesh(new BoxGeometry(11.6, 0.2, 2.3), bodyMat);
    ((wing.position.set(0, 0.15, -0.6)), plane.add(wing));
    const tailWing = new Mesh(new BoxGeometry(4.4, 0.16, 1.35), bodyMat);
    (tailWing.position.set(0, 0.25, 3.3), plane.add(tailWing));
    const fin = new Mesh(new BoxGeometry(0.16, 2, 1.6), bodyMat);
    (fin.position.set(0, 1.15, 3.35), plane.add(fin));
    const prop = new Group(),
      bladeGeo = new BoxGeometry(0.26, 5.4, 0.12),
      b1 = new Mesh(bladeGeo, darkMat),
      b2 = new Mesh(bladeGeo, darkMat);
    ((b2.rotation.z = Math.PI / 2), prop.add(b1), prop.add(b2), (prop.position.z = -5.75), plane.add(prop));
    // towed ad banner: rope + one double-sided quad reading its atlas row
    const laneIdx = laneIdxRef.i++;
    const bGeo = new PlaneGeometry(12, 2.5),
      bUv = bGeo.attributes.uv;
    for (let vi = 0; vi < bUv.count; vi++) bUv.setXY(vi, bUv.getX(vi), 1 - (laneIdx + (1 - bUv.getY(vi))) / 4);
    const banner = new Mesh(bGeo, bannerMat);
    ((banner.rotation.y = Math.PI / 2), banner.position.set(0, -0.4, 10), plane.add(banner));
    const rope = new Mesh(new BoxGeometry(0.05, 0.05, 1.6), darkMat);
    (rope.position.set(0, -0.1, 3.9), plane.add(rope));
    // zoom-detail 47: registration decals (fuselage both sides + underwing,
    // merged to ONE mesh reading this plane's atlas row), translucent prop
    // disc behind the spinning blades, merged gear struts + wheels
    const regRow = (geo) => {
      const uv2 = geo.attributes.uv;
      for (let vi = 0; vi < uv2.count; vi++) uv2.setXY(vi, uv2.getX(vi), 1 - (laneIdx + (1 - uv2.getY(vi))) / 4);
      return geo;
    };
    const regGeo = mergeGeometries(
      [
        regRow(new PlaneGeometry(2.3, 0.6)).rotateY(Math.PI / 2).translate(0.99, 0.12, 1.3),
        regRow(new PlaneGeometry(2.3, 0.6)).rotateY(-Math.PI / 2).translate(-0.99, 0.12, 1.3),
        regRow(new PlaneGeometry(3.4, 0.85)).rotateX(Math.PI / 2).translate(2.9, 0.03, -0.6),
      ],
      !1,
    );
    const regs = new Mesh(regGeo, regMat);
    ((regs.raycast = () => {}), plane.add(regs));
    const disc = new Mesh(new CircleGeometry(2.78, 24), discMat);
    ((disc.position.z = -5.72), (disc.raycast = () => {}), plane.add(disc));
    const gearGeo = mergeGeometries(
      [
        new CylinderGeometry(0.07, 0.07, 0.85, 6).translate(1.45, -1.35, -1.2),
        new CylinderGeometry(0.07, 0.07, 0.85, 6).translate(-1.45, -1.35, -1.2),
        new CylinderGeometry(0.3, 0.3, 0.2, 10).rotateZ(Math.PI / 2).translate(1.45, -1.82, -1.2),
        new CylinderGeometry(0.3, 0.3, 0.2, 10).rotateZ(Math.PI / 2).translate(-1.45, -1.82, -1.2),
        new CylinderGeometry(0.05, 0.05, 0.5, 6).translate(0, -0.95, 3.3),
        new CylinderGeometry(0.17, 0.17, 0.14, 8).rotateZ(Math.PI / 2).translate(0, -1.22, 3.3),
      ],
      !1,
    );
    const gear = new Mesh(gearGeo, darkMat);
    ((gear.raycast = () => {}), plane.add(gear));
    const navL = new Mesh(new BoxGeometry(0.16, 0.1, 0.3), navRedMat),
      navR = new Mesh(new BoxGeometry(0.16, 0.1, 0.3), navGreenMat);
    (navL.position.set(-5.72, 0.18, -0.6), navR.position.set(5.72, 0.18, -0.6), plane.add(navL), plane.add(navR));
    plane.userData.detail = { reg: PLANE_REGS[laneIdx], gear: !0, disc: !0 };
    propPlaneMeta.push({ plane, text: PLANE_BANNERS[laneIdx], reg: PLANE_REGS[laneIdx], alt: lane.alt });
    plane.traverse((o) => ((o.castShadow = !1), (o.receiveShadow = !1)));
    plane.scale.setScalar(2.6);
    ((plane.rotation.y = lane.dir > 0 ? -Math.PI / 2 : Math.PI / 2),
      plane.position.set(-1300 + Math.random() * 2600, lane.alt, lane.z),
      et.add(plane));
    const phase = Math.random() * Math.PI * 2;
    Bn(plane, (tt, dt) => {
      ((plane.position.x += lane.dir * lane.speed * dt),
        plane.position.x > 1500 && (plane.position.x = -1500),
        plane.position.x < -1500 && (plane.position.x = 1500),
        (plane.position.y = lane.alt + Math.sin(tt * 0.35 + phase) * 5),
        (plane.rotation.z = Math.sin(tt * 0.22 + phase) * 0.14),
        (prop.rotation.z += dt * 38));
    });
    qe.propPlanes++;
  }
}
buildPropPlanes();
// ─── Police heat: 0–5 stars from theft, splats and rammings. Cruisers spawn with heat,
// home in on the player with feeler-based building avoidance, ram on contact, and give
// up one star at a time once you keep 240+ units of distance. Roam only. ───
const police = { cars: [], evadeT: 0, nearest: 1 / 0, blocks: [], blockCd: 6, bustT: 0, panicTick: 0 };
const POLICE_RED = new MeshStandardMaterial({ color: 16716851, emissive: 16711731, emissiveIntensity: 2.4 }),
  POLICE_BLUE = new MeshStandardMaterial({ color: 5559551, emissive: 2916351, emissiveIntensity: 0.4 });
function addHeat(n) {
  if (u.mode !== "roam") return;
  const prev = Math.ceil(u.heat || 0);
  ((u.heat = Math.min(5, (u.heat || 0) + n)), (police.evadeT = 0));
  Math.ceil(u.heat) > prev &&
    ((u.message = `WANTED ${"★".repeat(Math.min(5, Math.ceil(u.heat)))}`), (u.messageTimer = 1.2));
}
function buildPoliceCar() {
  const t = I1("compact", 16250871),
    stripeMat2 = new MeshStandardMaterial({ color: 1381656, roughness: 0.5, metalness: 0.15 }),
    stripe = new Mesh(new BoxGeometry(2.26, 0.34, 1.35), stripeMat2);
  (stripe.position.set(0, 1.02, 0), t.add(stripe));
  const barR = new Mesh(new BoxGeometry(0.62, 0.24, 0.46), POLICE_RED),
    barB = new Mesh(new BoxGeometry(0.62, 0.24, 0.46), POLICE_BLUE);
  (barR.position.set(-0.38, 2.12, -0.35), barB.position.set(0.38, 2.12, -0.35), t.add(barR), t.add(barB));
  t.traverse((o) => ((o.castShadow = !1), (o.receiveShadow = !0)));
  return t;
}
function policePathBlocked(px, pz) {
  return (
    Mn.some((cb) => Math.abs(px - cb.x) < (cb.hw ?? cb.radius ?? 0) + 4 && Math.abs(pz - cb.z) < (cb.hd ?? cb.radius ?? 0) + 4) ||
    pondDepthAt(px, pz).depth > 0.35
  );
}
function spawnPoliceCar() {
  const a = Math.random() * Math.PI * 2,
    sx = MathUtils.clamp(u.roamPos.x + Math.cos(a) * 320, -780, 780),
    sz = MathUtils.clamp(u.roamPos.z + Math.sin(a) * 320, -1580, 440),
    mesh = buildPoliceCar();
  et.add(mesh);
  const c = { mesh, x: sx, z: sz, yaw: Math.random() * Math.PI * 2, speed: 60, bumpT: 0 };
  (police.cars.push(c), playSfx("whoosh", 0.2, 0.8, 0.1));
  return c;
}
function removePoliceCar(c) {
  (removeVehicleMesh(c.mesh), (police.cars = police.cars.filter((x) => x !== c)));
}
function removeRoadblock(b) {
  for (const m of b.meshes) removeVehicleMesh(m);
  police.blocks = police.blocks.filter((x) => x !== b);
}
function resetPolice() {
  for (const c of [...police.cars]) removePoliceCar(c);
  for (const b of [...police.blocks]) removeRoadblock(b);
  ((police.evadeT = 0), (police.nearest = 1 / 0), (police.bustT = 0), (police.blockCd = 6), (u.heat = 0));
}
// Roadblock: two angled cruisers + a spike strip across the road the player is heading down.
function tryRoadblock() {
  const fx = Math.sin(u.roamYaw),
    fz = -Math.cos(u.roamYaw),
    ax = u.roamPos.x + fx * 215,
    az = u.roamPos.z + fz * 215,
    rx = di.x0 + Math.round((ax - di.x0) / di.pitch) * di.pitch,
    rz = di.zNear - Math.round((di.zNear - az) / di.pitch) * di.pitch,
    dxr = Math.abs(ax - rx),
    dzr = Math.abs(az - rz);
  let bx, bz, latX, latZ, fwX, fwZ;
  if (dxr <= dzr && dxr < di.streetW * 0.6) ((bx = rx), (bz = az), (latX = 1), (latZ = 0), (fwX = 0), (fwZ = 1));
  else if (dzr < di.streetW * 0.6) ((bx = ax), (bz = rz), (latX = 0), (latZ = 1), (fwX = 1), (fwZ = 0));
  else return !1;
  if (bx < di.x0 || bx > di.x1 || bz > di.zNear || bz < di.zFar) return !1;
  if (police.blocks.some((b) => Math.hypot(b.x - bx, b.z - bz) < 140)) return !1;
  const y0 = He(bx, bz),
    w = di.streetW + 3,
    stripMat = new MeshStandardMaterial({ color: 1907997, roughness: 0.6, emissive: 11674146, emissiveIntensity: 0.5 }),
    strip = new Mesh(new BoxGeometry(0.9, 0.16, w), stripMat);
  (strip.position.set(bx, y0 + 0.1, bz),
    strip.lookAt(bx + latX, y0 + 0.1, bz + latZ),
    et.add(strip));
  const meshes = [strip];
  for (const s of [-1, 1]) {
    const car = buildPoliceCar();
    (car.position.set(bx + latX * s * (w * 0.32), y0 + 0.06, bz + latZ * s * (w * 0.32)),
      (car.rotation.y = Math.atan2(latX, latZ) + s * 0.7),
      et.add(car),
      meshes.push(car));
  }
  (police.blocks.push({ x: bx, z: bz, latX, latZ, fwX, fwZ, w, meshes, age: 0, hitT: 0 }),
    (u.message = "ROADBLOCK AHEAD!"),
    (u.messageTimer = 1.3),
    chime(500, 0.2, "square", 0.1));
  return !0;
}
function bustPlayer() {
  const fine = Math.min(600, Math.round(u.score * 0.12) + 150);
  ((u.score = Math.max(0, u.score - fine)),
    (qe.busts = (qe.busts || 0) + 1),
    (u.message = `BUSTED! -${fine}`),
    (u.messageTimer = 2),
    (u.cameraShake = 0.5),
    chime(220, 0.5, "sawtooth", 0.14));
  jobSys.state === "active" && failJob("busted");
  if (u.drivingStolen && stolenRide) {
    releaseStolenRide();
    ((u.vehicle = "foot"),
      (u.speed = 0),
      (walker.visible = !0),
      (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05),
      (u.message = "BUSTED! Ride confiscated"));
  }
  resetPolice();
}
function updatePoliceCar(c, dt) {
  const dx = u.roamPos.x - c.x,
    dz = u.roamPos.z - c.z,
    dist = Math.hypot(dx, dz),
    heat = u.heat || 0;
  let wantYaw = Math.atan2(dx, -dz);
  // feeler: if the path ahead is blocked, swerve toward whichever side probe is clear
  const fx = Math.sin(c.yaw),
    fz = -Math.cos(c.yaw);
  if (policePathBlocked(c.x + fx * 17, c.z + fz * 17)) {
    const lYaw = c.yaw - 0.7,
      rYaw = c.yaw + 0.7,
      lFree = !policePathBlocked(c.x + Math.sin(lYaw) * 17, c.z - Math.cos(lYaw) * 17);
    wantYaw = lFree ? lYaw : rYaw;
  }
  const delta = Math.atan2(Math.sin(wantYaw - c.yaw), Math.cos(wantYaw - c.yaw));
  c.yaw += MathUtils.clamp(delta, -2 * dt, 2 * dt);
  const targetSpeed =
    dist > 30 ? Math.min(112 + heat * 6, Math.abs(u.speed) + 30) : Math.max(42, Math.abs(u.speed) * 0.92);
  c.speed += (targetSpeed - c.speed) * Math.min(1, dt * 0.85);
  ((c.x += Math.sin(c.yaw) * c.speed * dt), (c.z -= Math.cos(c.yaw) * c.speed * dt));
  ((c.x = MathUtils.clamp(c.x, -800, 800)), (c.z = MathUtils.clamp(c.z, -1600, 460)));
  (c.mesh.position.set(c.x, He(c.x, c.z) + 0.28, c.z), (c.mesh.rotation.y = -c.yaw));
  for (const wh of c.mesh.userData.wheels || []) wh.rotation.x -= c.speed * dt * 1.7;
  c.bumpT > 0 && (c.bumpT -= dt);
  if (dist < 6.2 && c.bumpT <= 0) {
    c.bumpT = 1.3;
    if (u.vehicle === "car") {
      (ev(new Vector3(c.x, u.roamPos.y + 0.8, c.z), Math.abs(u.speed - c.speed) + 24, "PIT MANEUVER!"),
        (u.speed *= 0.78),
        (c.speed *= 0.4),
        addHeat(0.3));
    } else ((u.cameraShake = Math.max(u.cameraShake, 0.3)), (u.message = "Get out of there!"), (u.messageTimer = 0.9));
  }
  return dist;
}
Bn(new Object3D(), (tt, dt) => {
  const flash = Math.floor(tt * 3.4) % 2;
  ((POLICE_RED.emissiveIntensity = flash ? 2.6 : 0.35), (POLICE_BLUE.emissiveIntensity = flash ? 0.35 : 2.6));
  if (u.mode !== "roam") {
    police.cars.length && resetPolice();
    return;
  }
  const heat = u.heat || 0,
    target = heat >= 1 ? Math.min(4, Math.ceil(heat)) : 0;
  for (; police.cars.length < target; ) spawnPoliceCar();
  for (; police.cars.length > target; ) removePoliceCar(police.cars[police.cars.length - 1]);
  let nearest = 1 / 0;
  for (const c of [...police.cars]) nearest = Math.min(nearest, updatePoliceCar(c, dt));
  police.nearest = nearest;
  // busted: boxed in slow next to a cruiser for a couple of seconds
  if (heat > 0 && nearest < 12 && Math.abs(u.speed) < 8) {
    police.bustT += dt;
    police.bustT > 2.2 && ((police.bustT = 0), bustPlayer());
  } else police.bustT = Math.max(0, police.bustT - dt * 1.5);
  // roadblocks at 4+ stars
  if (heat >= 4) {
    police.blockCd -= dt;
    police.blockCd <= 0 && Math.abs(u.speed) > 30 && (tryRoadblock(), (police.blockCd = 12));
  }
  for (const b of [...police.blocks]) {
    b.age += dt;
    b.hitT > 0 && (b.hitT -= dt);
    (b.age > 40 || heat < 4) && removeRoadblock(b);
    // spike strip: crossing it shreds the tires
    const dx = u.roamPos.x - b.x,
      dz = u.roamPos.z - b.z,
      lat = dx * b.latX + dz * b.latZ,
      along = dx * b.fwX + dz * b.fwZ;
    if (Math.abs(lat) < b.w * 0.5 && Math.abs(along) < 1.5 && !u.roamAir && u.vehicle === "car" && b.hitT <= 0) {
      ((b.hitT = 2.5),
        (u.spikedT = 3.5),
        (u.speed *= 0.5),
        (u.damage = MathUtils.clamp(u.damage + 6, 0, 100)),
        (u.message = "SPIKE STRIP!"),
        (u.messageTimer = 1.2),
        (u.cameraShake = Math.max(u.cameraShake, 0.4)),
        playSfx("skid", 0.55, 1.25, 0.1),
        addHeat(0.15));
    }
  }
  // traffic panic: civilians near a cruiser (or near the fugitive player) pull over
  police.panicTick -= dt;
  if (police.panicTick <= 0 && heat > 0) {
    police.panicTick = 0.4;
    for (const r of Ri) {
      const a = r.actor;
      if (!a || !a.type || a.stolen || a.panicT > 0) continue;
      let scared = Math.hypot(u.roamPos.x - r.x, u.roamPos.z - r.z) < 45;
      if (!scared)
        for (const c of police.cars)
          if (Math.hypot(c.x - r.x, c.z - r.z) < 65) {
            scared = !0;
            break;
          }
      scared && (a.panicT = 1.6);
    }
  }
  if (heat > 0) {
    if (nearest > 240) {
      police.evadeT += dt;
      if (police.evadeT > 9) {
        ((u.heat = Math.max(0, heat - 1)), (police.evadeT = u.heat > 0 ? 4 : 0));
        u.heat === 0 &&
          ((u.score += 500), showScorePop("+500 ESCAPED THE LAW"), chime(980, 0.22), (u.message = "You lost them"), (u.messageTimer = 1.4));
      }
    } else police.evadeT = Math.max(0, police.evadeT - dt * 0.6);
  }
  qe.police = police.cars.length;
});
// ─── Delivery jobs: a marked vehicle waits under a cyan beacon; hop in and race the
// clock to the gold beacon. Time bonus on the payout; timeout, busted or abandoning
// the vehicle fails the run. One job at a time, roam only. ───
const jobSys = { state: "idle", type: null, mesh: null, pickup: null, dest: null, timeLeft: 0, cooldown: 5, beacons: [] };
const JOB_TYPES = ["van", "boxTruck", "taxi", "pickup"];
function jobBeacon(colorHex) {
  const m = new Mesh(
    new CylinderGeometry(3.4, 3.4, 340, 12, 1, !0),
    new MeshBasicMaterial({
      color: colorHex,
      transparent: !0,
      opacity: 0.15,
      depthWrite: !1,
      side: DoubleSide,
      blending: AdditiveBlending,
    }),
  );
  return ((m.frustumCulled = !1), et.add(m), m);
}
function clearJobBeacons() {
  for (const b of jobSys.beacons) (b.geometry.dispose(), b.material.dispose(), et.remove(b));
  jobSys.beacons = [];
}
function findRoadsidePoint(minD, maxD) {
  for (let k = 0; k < 220; k++) {
    const ns = Math.random() < 0.5,
      road = ns
        ? di.x0 + ((Math.random() * Math.round((di.x1 - di.x0) / di.pitch)) | 0) * di.pitch
        : di.zNear - ((Math.random() * Math.round((di.zNear - di.zFar) / di.pitch)) | 0) * di.pitch,
      side = (Math.random() < 0.5 ? -1 : 1) * (di.streetW * 0.5 + 6),
      along = ns
        ? di.zFar + 100 + Math.random() * (di.zNear - di.zFar - 200)
        : di.x0 + 100 + Math.random() * (di.x1 - di.x0 - 200),
      x = ns ? road + side : along,
      z = ns ? along : road + side,
      d = Math.hypot(x - u.roamPos.x, z - u.roamPos.z);
    if (d < minD || d > maxD) continue;
    if (Hi(x, z, 8, 8, 1)) continue;
    if (pondDepthAt(x, z).depth > 0) continue;
    if (
      Mn.some(
        (c) => Math.abs(x - c.x) < (c.hw ?? c.radius ?? 0) + 5 && Math.abs(z - c.z) < (c.hd ?? c.radius ?? 0) + 5,
      )
    )
      continue;
    return { x, z, yaw: ns ? 0 : Math.PI / 2 };
  }
  return null;
}
function spawnJob() {
  const p = findRoadsidePoint(200, 700);
  if (!p) {
    jobSys.cooldown = 4;
    return;
  }
  const type = JOB_TYPES[(Math.random() * JOB_TYPES.length) | 0];
  ((jobSys.type = type),
    (jobSys.mesh = I1(type, [16770048, 5814783, 16752762, 9498256][(Math.random() * 4) | 0])),
    (jobSys.mesh.userData.stolenYOff = 0.57),
    jobSys.mesh.position.set(p.x, He(p.x, p.z) + 0.28, p.z),
    (jobSys.mesh.rotation.y = -p.yaw),
    et.add(jobSys.mesh),
    (jobSys.pickup = p));
  const b = jobBeacon(3531007);
  (b.position.set(p.x, He(p.x, p.z) + 150, p.z), jobSys.beacons.push(b));
  ((jobSys.state = "available"),
    (u.message = `Delivery job: grab the ${type.toUpperCase()} at the cyan beacon`),
    (u.messageTimer = 2));
}
function enterJobVehicle() {
  if (jobSys.state !== "available" || !jobSys.mesh || u.roamPos.distanceTo(jobSys.mesh.position) > 6) return !1;
  abandonStolenRide();
  const m = jobSys.mesh;
  stolenRide = { mesh: m, type: jobSys.type, actor: null, parked: null, parkedYaw: 0, job: !0 };
  ((u.vehicle = "car"),
    (u.drivingStolen = !0),
    u.roamPos.set(m.position.x, He(m.position.x, m.position.z) + Wn, m.position.z),
    (u.roamYaw = jobSys.pickup.yaw),
    (u.camYaw = u.roamYaw),
    (u.speed = 0),
    (walker.visible = !1),
    playSfx("jack", 0.5, 1, 0.08) || chime(340, 0.18, "square", 0.1),
    zs());
  startJob();
  return !0;
}
function startJob() {
  const d = findRoadsidePoint(420, 900) || findRoadsidePoint(250, 1100);
  if (!d) {
    failJob("no route");
    return;
  }
  jobSys.dest = d;
  jobSys.timeLeft = Math.round(14 + Math.hypot(d.x - u.roamPos.x, d.z - u.roamPos.z) * 0.062);
  clearJobBeacons();
  const b = jobBeacon(16766720);
  (b.position.set(d.x, He(d.x, d.z) + 150, d.z), jobSys.beacons.push(b));
  ((jobSys.state = "active"),
    (u.message = `Deliver the ${jobSys.type.toUpperCase()} to the gold beacon — ${jobSys.timeLeft}s`),
    (u.messageTimer = 2.2));
}
function jobIdle(cooldown) {
  (clearJobBeacons(), Object.assign(jobSys, { state: "idle", mesh: null, pickup: null, dest: null, timeLeft: 0, cooldown }));
}
function failJob(reason) {
  if (jobSys.state === "idle") return;
  if (stolenRide?.job) {
    releaseStolenRide();
    u.vehicle === "car" &&
      ((u.vehicle = "foot"),
      (walker.visible = !0),
      (u.speed = 0),
      (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05));
  } else jobSys.mesh && removeVehicleMesh(jobSys.mesh);
  jobIdle(9);
  reason !== "silent" &&
    ((u.message = `Delivery failed — ${reason}`), (u.messageTimer = 1.6), chime(240, 0.3, "sawtooth", 0.1));
  qe.deliveryFails = (qe.deliveryFails || 0) + 1;
}
function jobAbandoned(mesh) {
  (removeVehicleMesh(mesh), jobIdle(9));
  ((u.message = "Delivery failed — vehicle abandoned"), (u.messageTimer = 1.5));
  qe.deliveryFails = (qe.deliveryFails || 0) + 1;
}
function completeJob() {
  const bonus = 1200 + Math.ceil(jobSys.timeLeft) * 10;
  ((u.score += bonus), (qe.deliveries = (qe.deliveries || 0) + 1));
  (showScorePop(`+${bonus} DELIVERED`, !0), chime(980, 0.18), setTimeout(() => chime(1320, 0.22), 100));
  const m = stolenRide?.mesh;
  ((stolenRide = null), (u.drivingStolen = !1), m && removeVehicleMesh(m));
  ((u.vehicle = "foot"),
    (u.speed = 0),
    (walker.visible = !0),
    (u.roamPos.x -= Math.cos(u.roamYaw) * 3.4),
    (u.roamPos.z -= Math.sin(u.roamYaw) * 3.4),
    (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05));
  jobIdle(8);
  ((u.message = "Delivered! Another job will turn up"), (u.messageTimer = 1.8));
}
Bn(new Object3D(), (tt, dt) => {
  if (u.mode !== "roam") {
    jobSys.state !== "idle" && failJob("silent");
    return;
  }
  if (jobSys.state === "idle") {
    jobSys.cooldown -= dt;
    jobSys.cooldown <= 0 && spawnJob();
  } else if (jobSys.state === "active") {
    jobSys.timeLeft -= dt;
    if (jobSys.timeLeft <= 0) failJob("time's up");
    else if (
      u.drivingStolen &&
      stolenRide?.job &&
      Math.hypot(u.roamPos.x - jobSys.dest.x, u.roamPos.z - jobSys.dest.z) < 15 &&
      Math.abs(u.speed) < 26
    )
      completeJob();
  }
});
Bn(new Object3D(), (tt, dt) => {
  if (!heli) return;
  const target = u.mode === "roam" && u.vehicle === "heli" ? 1 : 0;
  ((heli.rpm += (target - heli.rpm) * Math.min(1, dt * (target ? 1.4 : 0.5))),
    (heli.rotor.rotation.y += heli.rpm * 26 * dt),
    (heli.tailRotor.rotation.x += heli.rpm * 42 * dt));
});
// Splash droplets + expanding wake rings for water driving.
const Uw = new MeshBasicMaterial({ color: 10470630, transparent: !0, opacity: 0.8, depthWrite: !1 }),
  splashPool = Array.from({ length: 42 }, () => {
    const i = new Mesh(new SphereGeometry(0.14, 6, 5), Uw);
    return ((i.visible = !1), et.add(i), { mesh: i, life: 0, velocity: new Vector3() });
  }),
  Vw = new MeshBasicMaterial({
    color: 12245225,
    transparent: !0,
    opacity: 0.34,
    depthWrite: !1,
    side: DoubleSide,
  }),
  ringPool = Array.from({ length: 14 }, () => {
    const i = new Mesh(new RingGeometry(0.82, 1, 28), Vw.clone());
    return ((i.rotation.x = -Math.PI / 2), (i.visible = !1), et.add(i), { mesh: i, life: 0, maxLife: 1 });
  });
function spawnWaterRing(i, e, t = 1) {
  const n = ringPool.find((s) => s.life <= 0) || ringPool[0];
  ((n.life = 1),
    (n.maxLife = 0.9 + t * 0.25),
    (n.mesh.visible = !0),
    n.mesh.position.set(i, He(i, e) + 0.22, e),
    n.mesh.scale.setScalar(1.2 * t));
}
function waterSplash(i, e = 40) {
  const t = Math.min(26, 8 + e * 0.22);
  for (let n = 0; n < t; n++) {
    const s = splashPool.find((r) => r.life <= 0) || splashPool[n % splashPool.length];
    ((s.mesh.visible = !0),
      s.mesh.position.set(i.x + (Math.random() - 0.5) * 2.4, i.y + 0.3, i.z + (Math.random() - 0.5) * 2.4),
      s.velocity.set((Math.random() - 0.5) * 8, 2.4 + Math.random() * 3.6, (Math.random() - 0.5) * 8),
      (s.life = 0.3 + Math.random() * 0.28));
  }
  spawnWaterRing(i.x, i.z, 1.6);
}
Bn(new Object3D(), (i, e) => {
  for (const t of splashPool)
    t.life > 0 &&
      ((t.life -= e),
      (t.velocity.y -= 31 * e),
      t.mesh.position.addScaledVector(t.velocity, e),
      t.life <= 0 && (t.mesh.visible = !1));
  for (const t of ringPool)
    if (t.life > 0) {
      t.life -= e / t.maxLife;
      const n = 1 - t.life;
      (t.mesh.scale.setScalar(t.mesh.scale.x + e * (5 + n * 7)),
        (t.mesh.material.opacity = 0.34 * t.life),
        t.life <= 0 && (t.mesh.visible = !1));
    }
});
const Ws = new EffectComposer(Qt);
Ws.addPass(new RenderPass(et, Xe));
const Hd = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 0.4, 0.72, 0.86);
Ws.addPass(Hd);
Ws.addPass(new OutputPass());
const $1 = {
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uSpeed: { value: 0 }, uBoost: { value: 0 } },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uBoost;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 toCenter = uv - 0.5;
      float dist = length(toCenter);

      // Chromatic aberration: split the channels outward, scaled by speed and lens distance.
      float aberration = (0.0006 + uSpeed * 0.0018 + uBoost * 0.0024) * dist;
      vec2 dir = normalize(toCenter + 1e-5);
      float r = texture2D(tDiffuse, uv - dir * aberration).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv + dir * aberration).b;
      vec3 color = vec3(r, g, b);

      // Contrast + saturation lift for a richer, punchier image.
      color = (color - 0.5) * 1.07 + 0.5;
      float luma = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luma), color, 1.1);

      // Speed-reactive vignette that closes in as you go faster, selling the rush.
      float vig = smoothstep(0.98, 0.34, dist * (1.0 + uSpeed * 0.42 + uBoost * 0.3));
      color *= mix(1.0, vig, 0.4);

      // Fine animated film grain, strongest in the shadows.
      float grain = hash(uv * vec2(1920.0, 1080.0) + uTime * 60.0) - 0.5;
      color += grain * 0.02 * (1.0 - luma * 0.7);

      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `,
  },
  lr = new ShaderPass($1);
Ws.addPass(lr);
const K1 = new MeshStandardMaterial({ color: 16757051, emissive: 16734743, emissiveIntensity: 1.9, roughness: 0.32, metalness: 0.15 }),
  mr = Array.from({ length: 72 }, () => {
    const i = new Mesh(new SphereGeometry(0.1, 8, 5), K1);
    return ((i.visible = !1), et.add(i), { mesh: i, life: 0, velocity: new Vector3() });
  }),
  J1 = new MeshBasicMaterial({ color: 14212576, transparent: !0, opacity: 0, depthWrite: !1, side: DoubleSide }),
  xr = Array.from({ length: 90 }, () => {
    const i = new Mesh(new CircleGeometry(1, 18), J1.clone());
    return ((i.visible = !1), et.add(i), { mesh: i, life: 0, maxLife: 1, velocity: new Vector3(), spin: 0 });
  }),
  j1 = new MeshStandardMaterial({ color: 2962232, roughness: 0.58, metalness: 0.34 }),
  gr = Array.from({ length: 48 }, () => {
    const i = new Mesh(new BoxGeometry(0.18, 0.08, 0.26), j1);
    return ((i.visible = !1), et.add(i), { mesh: i, life: 0, velocity: new Vector3(), spin: new Vector3() });
  });
let mi = null;
function Wd() {
  if (mi) return;
  const ctx = new AudioContext(),
    master = ctx.createGain();
  ((master.gain.value = Number(localStorage.getItem("steel-ribbon-vol") ?? 0.8)), master.connect(ctx.destination));
  // Engine bus v2: sub sine for body, twin detuned saws through a soft-clip waveshaper
  // for thick growl (the old square wave was the kazoo), a high triangle that only
  // appears near redline, and an exhaust-burble LFO that fades with load.
  const engineFilter = ctx.createBiquadFilter();
  ((engineFilter.type = "lowpass"), (engineFilter.frequency.value = 540));
  const engineGain = ctx.createGain();
  ((engineGain.gain.value = 1e-4), engineFilter.connect(engineGain), engineGain.connect(master));
  const shaper = ctx.createWaveShaper(),
    shaperCurve = new Float32Array(1024);
  for (let k = 0; k < 1024; k++) {
    const xx = (k / 511.5 - 1) * 1.6;
    shaperCurve[k] = ((1 + 3) * xx) / (1 + 3 * Math.abs(xx));
  }
  ((shaper.curve = shaperCurve), (shaper.oversample = "2x"), shaper.connect(engineFilter));
  const sawBus = ctx.createGain();
  ((sawBus.gain.value = 1), sawBus.connect(shaper));
  const mkOsc = (type, g, dest) => {
    const o = ctx.createOscillator(),
      gn = ctx.createGain();
    ((o.type = type), (gn.gain.value = g), o.connect(gn), gn.connect(dest), o.start());
    return { o, g: gn };
  };
  const rumble = mkOsc("sine", 0.5, engineFilter),
    growl = mkOsc("sawtooth", 0.3, sawBus),
    growlB = mkOsc("sawtooth", 0.3, sawBus),
    whine = mkOsc("triangle", 0.03, engineFilter);
  // exhaust burble: audio-rate wobble of the saw bus at quarter engine rate
  const burbleOsc = ctx.createOscillator(),
    burbleDepth = ctx.createGain();
  ((burbleOsc.type = "sine"),
    (burbleOsc.frequency.value = 12),
    (burbleDepth.gain.value = 0),
    burbleOsc.connect(burbleDepth),
    burbleDepth.connect(sawBus.gain),
    burbleOsc.start());
  // Shared looped noise buffer feeds wind, skid and boost layers.
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate),
    nd = noiseBuf.getChannelData(0);
  for (let k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
  const mkNoise = (type, freq, q, rate) => {
    const src = ctx.createBufferSource(),
      f = ctx.createBiquadFilter(),
      g = ctx.createGain();
    ((src.buffer = noiseBuf),
      (src.loop = !0),
      (src.playbackRate.value = rate),
      (f.type = type),
      (f.frequency.value = freq),
      (f.Q.value = q),
      (g.gain.value = 1e-4),
      src.connect(f),
      f.connect(g),
      g.connect(master),
      src.start());
    return { filter: f, gain: g };
  };
  const wind = mkNoise("bandpass", 900, 0.6, 1),
    skid = mkNoise("highpass", 1800, 0.8, 0.82),
    boost = mkNoise("bandpass", 300, 1.4, 0.5),
    rain = mkNoise("bandpass", 5200, 0.3, 1);
  const musicGain = ctx.createGain();
  ((musicGain.gain.value = 1e-4), musicGain.connect(master));
  // two-tone police siren, gain driven by the nearest cruiser's distance
  const sirenOsc = ctx.createOscillator(),
    sirenGain = ctx.createGain();
  ((sirenOsc.type = "triangle"),
    (sirenOsc.frequency.value = 660),
    (sirenGain.gain.value = 1e-4),
    sirenOsc.connect(sirenGain),
    sirenGain.connect(master),
    sirenOsc.start());
  mi = {
    ctx,
    master,
    engine: rumble.o,
    engineGain,
    filter: engineFilter,
    rumble,
    growl,
    growlB,
    whine,
    burble: { o: burbleOsc, depth: burbleDepth },
    siren: { o: sirenOsc, g: sirenGain },
    rain,
    wind,
    skid,
    boost,
    musicGain,
    nextNote: 0,
    beat: 0,
    prevBoost: !1,
  };
}
// Per-vehicle engine voices: frequency scale, layer mix, filter brightness, burble amount.
const ENGINE_PROFILES = {
  interceptor: { fMul: 1, sub: 0.55, saw: 0.4, det: 1.007, whine: 0.05, whineMul: 3.02, cutoff: 1, burble: 1 },
  bullet: { fMul: 1.18, sub: 0.42, saw: 0.38, det: 1.01, whine: 0.11, whineMul: 4.1, cutoff: 1.25, burble: 0.5 },
  brawler: { fMul: 0.82, sub: 0.68, saw: 0.44, det: 1.005, whine: 0.03, whineMul: 2.6, cutoff: 0.8, burble: 1.5 },
  zephyr: { fMul: 1.45, sub: 0.3, saw: 0.34, det: 1.014, whine: 0.14, whineMul: 5, cutoff: 1.35, burble: 0.3 },
  compact: { fMul: 1.3, sub: 0.3, saw: 0.3, det: 1.01, whine: 0.08, whineMul: 4, cutoff: 1.1, burble: 0.4 },
  taxi: { fMul: 1.15, sub: 0.36, saw: 0.32, det: 1.008, whine: 0.06, whineMul: 3.6, cutoff: 1, burble: 0.5 },
  pickup: { fMul: 0.9, sub: 0.6, saw: 0.4, det: 1.006, whine: 0.04, whineMul: 2.8, cutoff: 0.85, burble: 1.2 },
  van: { fMul: 0.95, sub: 0.55, saw: 0.36, det: 1.006, whine: 0.04, whineMul: 3, cutoff: 0.9, burble: 0.9 },
  boxTruck: { fMul: 0.6, sub: 0.75, saw: 0.42, det: 1.004, whine: 0.03, whineMul: 2.2, cutoff: 0.62, burble: 1.8 },
  bus: { fMul: 0.52, sub: 0.8, saw: 0.42, det: 1.004, whine: 0.05, whineMul: 2, cutoff: 0.55, burble: 2 },
};
const PLAYER_ENGINE_KEYS = ["interceptor", "bullet", "brawler", "zephyr"];
function engineProfileKey() {
  return u.mode === "roam" && u.drivingStolen && stolenRide
    ? ENGINE_PROFILES[stolenRide.type]
      ? stolenRide.type
      : "compact"
    : PLAYER_ENGINE_KEYS[carModelIndex] || "interceptor";
}
function La() {
  (mi || Wd(), mi?.ctx.state === "suspended" && mi.ctx.resume().catch(() => {}), loadSfx());
}
function audioOut() {
  return mi ? mi.master : null;
}
function Pc(i) {
  if (!mi) return;
  const { ctx: e } = mi,
    t = e.createOscillator(),
    n = e.createGain();
  ((t.type = "sine"),
    (t.frequency.value = 55 + i * 2.6),
    n.gain.setValueAtTime(Math.min(0.34, i / 55), e.currentTime),
    n.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 0.23),
    t.connect(n).connect(mi.master),
    t.start(),
    t.stop(e.currentTime + 0.24));
}
function boostWhoosh() {
  if (!mi) return;
  if (playSfx("whoosh", 0.4, 1, 0.1)) return;
  const { ctx: e } = mi,
    t = e.createOscillator(),
    n = e.createGain(),
    s = e.createBiquadFilter();
  ((t.type = "sawtooth"),
    t.frequency.setValueAtTime(85, e.currentTime),
    t.frequency.exponentialRampToValueAtTime(310, e.currentTime + 0.45),
    (s.type = "lowpass"),
    (s.frequency.value = 900),
    n.gain.setValueAtTime(0.14, e.currentTime),
    n.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 0.55),
    t.connect(s).connect(n).connect(mi.master),
    t.start(),
    t.stop(e.currentTime + 0.6));
}
function splatSound() {
  if (!mi) return;
  if (playSfx("splat", 0.6, 1, 0.14)) return;
  // wet burst: lowpassed noise snap + pitch-dropping blip
  const e = mi.ctx,
    n = e.createBiquadFilter(),
    s = e.createGain(),
    src = e.createBufferSource();
  ((src.buffer = miNoiseBuffer()), (src.loop = !1), (src.playbackRate.value = 0.72));
  ((n.type = "lowpass"), (n.frequency.value = 760));
  (s.gain.setValueAtTime(0.3, e.currentTime), s.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 0.2));
  (src.connect(n), n.connect(s), s.connect(mi.master), src.start(e.currentTime, Math.random() * 1.2, 0.22));
  const o = e.createOscillator(),
    g = e.createGain();
  ((o.type = "sine"),
    o.frequency.setValueAtTime(300, e.currentTime),
    o.frequency.exponentialRampToValueAtTime(64, e.currentTime + 0.2),
    g.gain.setValueAtTime(0.22, e.currentTime),
    g.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 0.24),
    o.connect(g).connect(mi.master),
    o.start(),
    o.stop(e.currentTime + 0.26));
}
let miNoiseCache = null;
function miNoiseBuffer() {
  if (miNoiseCache) return miNoiseCache;
  const e = mi.ctx,
    b = e.createBuffer(1, e.sampleRate * 2, e.sampleRate),
    d = b.getChannelData(0);
  for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
  return (miNoiseCache = b);
}
function waterSplashSound(intensity = 1) {
  if (!mi) return;
  if (playSfx("splash", Math.min(0.6, 0.28 + intensity * 0.16), 0.95, 0.1)) return;
  const { ctx: e } = mi,
    src = e.createBufferSource(),
    f = e.createBiquadFilter(),
    g = e.createGain();
  ((src.buffer = miNoiseBuffer()), (src.playbackRate.value = 0.55), (f.type = "lowpass"), (f.frequency.value = 950));
  (g.gain.setValueAtTime(Math.min(0.32, 0.14 + intensity * 0.08), e.currentTime),
    g.gain.exponentialRampToValueAtTime(1e-4, e.currentTime + 0.34));
  (src.connect(f), f.connect(g), g.connect(mi.master), src.start(e.currentTime, Math.random() * 1.2, 0.36));
}
// ─── Generated SFX + music samples (static mp3 assets in audio/), decoded after first
// gesture. Every call site keeps its synth fallback so the game sounds right even if
// the fetch fails or hasn't finished. ───
const sfx = { buffers: {}, loops: {}, loading: !1 };
const SFX_FILES = ["splat", "crash", "whoosh", "splash", "rotor", "jack", "land", "skid", "music"];
function loadSfx() {
  if (sfx.loading || !mi) return;
  sfx.loading = !0;
  for (const name of SFX_FILES)
    fetch(`audio/${name}.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then((b) => mi.ctx.decodeAudioData(b))
      .then((buf) => (sfx.buffers[name] = buf))
      .catch(() => {});
}
function playSfx(name, gain = 0.5, rate = 1, jitter = 0.06) {
  const buf = mi && sfx.buffers[name];
  if (!buf) return !1;
  const e = mi.ctx,
    src = e.createBufferSource(),
    g = e.createGain();
  ((src.buffer = buf),
    (src.playbackRate.value = rate * (1 - jitter / 2 + Math.random() * jitter)),
    (g.gain.value = gain),
    src.connect(g).connect(mi.master),
    src.start());
  return !0;
}
function ensureSampleLoop(name, dest, g0 = 1e-4) {
  if (sfx.loops[name]) return sfx.loops[name];
  if (!mi || !sfx.buffers[name]) return null;
  const e = mi.ctx,
    src = e.createBufferSource(),
    g = e.createGain();
  ((src.buffer = sfx.buffers[name]),
    (src.loop = !0),
    (g.gain.value = g0),
    src.connect(g),
    g.connect(dest || mi.master),
    src.start());
  return (sfx.loops[name] = { src, gain: g });
}
// Menu music: minor synthwave arp + bass, scheduled with a lookahead so timing survives frame hitches.
const Wm = {
  bass: [55, 55, 43.65, 49],
  arps: [
    [220, 261.63, 329.63, 440],
    [220, 261.63, 329.63, 523.25],
    [174.61, 220, 261.63, 349.23],
    [196, 246.94, 293.66, 392],
  ],
};
function playMusicTone(freq, at, dur, type, gain, cutoff) {
  const { ctx: e } = mi,
    o = e.createOscillator(),
    f = e.createBiquadFilter(),
    g = e.createGain();
  ((o.type = type), (o.frequency.value = freq), (f.type = "lowpass"), (f.frequency.value = cutoff));
  (g.gain.setValueAtTime(1e-4, at),
    g.gain.linearRampToValueAtTime(gain, at + 0.02),
    g.gain.exponentialRampToValueAtTime(1e-4, at + dur));
  (o.connect(f), f.connect(g), g.connect(mi.musicGain), o.start(at), o.stop(at + dur + 0.05));
}
function musicScheduler() {
  const { ctx: e } = mi,
    step = 60 / 92 / 2;
  mi.nextNote < e.currentTime - 1 && (mi.nextNote = e.currentTime + 0.08);
  for (; mi.nextNote < e.currentTime + 0.35; ) {
    const s = mi.beat % 32,
      bar = (s / 8) | 0;
    (s % 4 === 0 && playMusicTone(Wm.bass[bar], mi.nextNote, 0.5, "triangle", 0.5, 420),
      playMusicTone(Wm.arps[bar][s % 4], mi.nextNote, 0.19, "sawtooth", 0.16, 1300));
    ((mi.nextNote += step), mi.beat++);
  }
}
function Pr(i, e = 18) {
  const t = Math.min(e, mr.length);
  for (let n = 0; n < t; n++) {
    const s = mr.find((r) => r.life <= 0) || mr[n];
    ((s.mesh.visible = !0),
      s.mesh.position.copy(i),
      s.velocity.set((Math.random() - 0.5) * 16, Math.random() * 11 + 3, (Math.random() - 0.5) * 16),
      (s.life = 0.28 + Math.random() * 0.42));
  }
}
function Xd(i, e = 10, t = 1) {
  const n = Math.min(e, xr.length);
  for (let s = 0; s < n; s++) {
    const r = xr.find((a) => a.life <= 0) || xr[s];
    ((r.mesh.visible = !0),
      r.mesh.position.copy(i).add(new Vector3((Math.random() - 0.5) * 2.2, Math.random() * 0.7, (Math.random() - 0.5) * 2.2)),
      r.mesh.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2),
      (r.mesh.material.opacity = 0.18 + Math.random() * 0.12),
      r.mesh.scale.setScalar(0.8 + Math.random() * 1.2 * t),
      r.velocity.set((Math.random() - 0.5) * 3.2, 1.4 + Math.random() * 2.2, (Math.random() - 0.5) * 3.2),
      (r.life = r.maxLife = 0.55 + Math.random() * 0.55),
      (r.spin = (Math.random() - 0.5) * 2.2));
  }
}
function Q1(i, e = 8, t = 1) {
  const n = Math.min(e, gr.length);
  for (let s = 0; s < n; s++) {
    const r = gr.find((a) => a.life <= 0) || gr[s];
    ((r.mesh.visible = !0),
      r.mesh.position
        .copy(i)
        .add(new Vector3((Math.random() - 0.5) * 1.4, 0.6 + Math.random() * 0.9, (Math.random() - 0.5) * 1.4)),
      r.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      r.mesh.scale.setScalar(0.8 + Math.random() * 1.8 * t),
      r.velocity.set((Math.random() - 0.5) * 14 * t, 5 + Math.random() * 9 * t, (Math.random() - 0.5) * 14 * t),
      r.spin.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8),
      (r.life = 0.65 + Math.random() * 0.55));
  }
}
function ev(i, e = Math.abs(u.speed), t = "CRASH") {
  const n = MathUtils.clamp(Math.abs(e) / 70, 0.18, 1.45);
  (u.collisionHits++,
    (u.collisionDrama = Math.max(u.collisionDrama, n)),
    (u.cameraShake = Math.max(u.cameraShake, 0.25 + n * 0.45)),
    (u.damage = MathUtils.clamp(u.damage + n * 3.6, 0, 100)),
    (u.message = t),
    (u.messageTimer = Math.max(u.messageTimer, 0.7)),
    Pr(i, Math.round(10 + n * 24)),
    Xd(i, Math.round(5 + n * 12), n),
    Q1(i, Math.round(3 + n * 8), n),
    playSfx("crash", Math.min(0.75, 0.2 + n * 0.4), 0.88 + n * 0.18, 0.12) || Pc(18 + n * 34));
}
function tv(i) {
  for (const e of mr) {
    if (e.life <= 0) continue;
    ((e.life -= i), (e.velocity.y -= 26 * i), e.mesh.position.addScaledVector(e.velocity, i));
    const t = Math.max(0.01, e.life * 2.4);
    (e.mesh.scale.setScalar(t), e.life <= 0 && (e.mesh.visible = !1));
  }
  for (const e of xr) {
    if (e.life <= 0) continue;
    ((e.life -= i),
      e.mesh.position.addScaledVector(e.velocity, i),
      (e.velocity.y += 0.4 * i),
      (e.mesh.rotation.z += e.spin * i));
    const t = 1 - e.life / Math.max(0.001, e.maxLife);
    (e.mesh.scale.multiplyScalar(1 + i * 0.75),
      (e.mesh.material.opacity = Math.max(0, 0.24 * (1 - t))),
      e.mesh.lookAt(Xe.position),
      e.life <= 0 && (e.mesh.visible = !1));
  }
  for (const e of gr)
    e.life <= 0 ||
      ((e.life -= i),
      (e.velocity.y -= 24 * i),
      e.mesh.position.addScaledVector(e.velocity, i),
      (e.mesh.rotation.x += e.spin.x * i),
      (e.mesh.rotation.y += e.spin.y * i),
      (e.mesh.rotation.z += e.spin.z * i),
      e.life <= 0 && (e.mesh.visible = !1));
}
function nv() {
  if (!mi) return;
  const { ctx: e } = mi,
    t = e.currentTime,
    active = (u.mode === "race" || u.mode === "roam" || u.mode === "paused") && !(u.mode === "roam" && u.vehicle === "foot"),
    heliMode = u.mode === "roam" && u.vehicle === "heli",
    rpm = u.tachRpm || 900,
    load = MathUtils.clamp((rpm - 900) / 6600, 0, 1),
    sp = Math.abs(u.speed),
    wet = u.mode === "roam" ? u.waterDepth || 0 : 0,
    prof = ENGINE_PROFILES[engineProfileKey()],
    f = heliMode ? 26 + (heli?.rpm || 0) * 14 : (38 + load * 124) * prof.fMul;
  (mi.rumble.o.frequency.setTargetAtTime(heliMode ? f : f * 0.5, t, 0.03),
    mi.growl.o.frequency.setTargetAtTime(heliMode ? f * 2 : f, t, 0.03),
    mi.growlB.o.frequency.setTargetAtTime(heliMode ? f * 2.02 : f * prof.det, t, 0.03),
    mi.whine.o.frequency.setTargetAtTime(heliMode ? 620 + sp * 4 : f * prof.whineMul, t, 0.03),
    mi.rumble.g.gain.setTargetAtTime(heliMode ? 0.6 : prof.sub, t, 0.08),
    mi.growl.g.gain.setTargetAtTime(heliMode ? 0.24 : prof.saw, t, 0.08),
    mi.growlB.g.gain.setTargetAtTime(heliMode ? 0.2 : prof.saw * 0.9, t, 0.08),
    // whine only opens up near redline — load-cubed keeps idle clean
    mi.whine.g.gain.setTargetAtTime(heliMode ? 0.12 : prof.whine * (0.15 + load * load * load * 0.85) * 2, t, 0.08),
    mi.burble.o.frequency.setTargetAtTime(Math.max(6, f * 0.25), t, 0.05),
    mi.burble.depth.gain.setTargetAtTime(heliMode ? 0.22 : prof.burble * 0.16 * (1 - load * 0.8), t, 0.1),
    mi.filter.frequency.setTargetAtTime((380 + load * 2300 + sp * 5) * prof.cutoff * (1 - 0.6 * wet), t, 0.06),
    mi.engineGain.gain.setTargetAtTime(
      (active && u.mode !== "paused" ? 0.055 + load * 0.055 : 1e-4) * (1 - 0.42 * wet),
      t,
      0.07,
    ));
  (mi.wind.gain.gain.setTargetAtTime(active ? Math.min(0.1, Math.max(0, (sp - 55) / 850)) : 1e-4, t, 0.15),
    mi.wind.filter.frequency.setTargetAtTime(700 + sp * 8, t, 0.12));
  const slip = u.mode === "roam" ? u.roamSlip : u.grounded ? Math.min(1, Math.abs(u.lateralVel) / 15) : 0,
    skidLoop = ensureSampleLoop("skid");
  mi.skid.gain.gain.setTargetAtTime(
    active && slip > 0.32 ? (slip - 0.32) * (skidLoop ? 0.05 : 0.15) : 1e-4,
    t,
    0.09,
  );
  skidLoop &&
    skidLoop.gain.gain.setTargetAtTime(
      active && slip > 0.32 ? Math.min(0.34, (slip - 0.32) * 0.55) : 1e-4,
      t,
      0.09,
    );
  const rotorLoop = ensureSampleLoop("rotor");
  rotorLoop &&
    (rotorLoop.gain.gain.setTargetAtTime(heliMode ? 0.06 + (heli?.rpm || 0) * 0.3 : 1e-4, t, heliMode ? 0.3 : 0.15),
      rotorLoop.src.playbackRate.setTargetAtTime(0.65 + (heliMode ? heli?.rpm || 0 : 0) * 0.5, t, 0.4));
  (u.boosting && !mi.prevBoost && boostWhoosh(),
    (mi.prevBoost = !!u.boosting),
    mi.boost.gain.gain.setTargetAtTime(active && u.boosting ? 0.15 : 1e-4, t, u.boosting ? 0.05 : 0.22),
    mi.boost.filter.frequency.setTargetAtTime(u.boosting ? 420 + sp * 3 : 260, t, 0.1));
  mi.rain &&
    mi.rain.gain.gain.setTargetAtTime(weatherWet() > 0.02 && u.mode !== "menu" ? weatherWet() * 0.045 : 1e-4, t, 0.4);
  const sirenOn = u.mode === "roam" && (u.heat || 0) > 0 && police.nearest < 460,
    sirenAmt = sirenOn ? Math.min(0.06, ((460 - police.nearest) / 460) * 0.075) : 1e-4;
  (mi.siren.g.gain.setTargetAtTime(sirenAmt, t, 0.25),
    mi.siren.o.frequency.setTargetAtTime(Math.floor(t / 0.44) % 2 ? 924 : 655, t, 0.05));
  const musicOn = localStorage.getItem("steel-ribbon-music") !== "0",
    musicLoop = musicOn ? ensureSampleLoop("music", mi.musicGain, 1) : sfx.loops.music || null;
  (mi.musicGain.gain.setTargetAtTime(
    musicOn ? (u.mode === "menu" ? (musicLoop ? 0.3 : 0.16) : musicLoop ? 0.065 : 0.028) : 1e-4,
    t,
    0.5,
  ),
    musicOn && !musicLoop && musicScheduler());
}
function Va(i = !1, e = !1, seasonRace = !1) {
  (Wd(), La(), _t.clear(), Ia(), releaseStolenRide());
  const t = i || e;
  u.seasonRace = seasonRace && !t;
  for (let ri = 0; ri < rivals.length; ri++) {
    const r = rivals[ri];
    ((r.distance = t ? -900 : -26 - ri * 7), (r.finished = 0), (r.mesh.visible = !t));
  }
  Object.assign(u, {
    mode: "race",
    practice: t,
    freeRun: e,
    breakdownTimer: 0,
    s: 22,
    totalDistance: 22,
    lastSafeS: 22,
    lastSafeDistance: 22,
    lateral: 0,
    lateralVel: 0,
    speed: 12,
    grounded: !0,
    boost: 1,
    damage: 0,
    lap: 1,
    time: 0,
    score: 0,
    airtime: 0,
    rivalS: t ? -900 : -28,
    rivalDistance: t ? -900 : -28,
    rivalSpeed: 58,
    cameraShake: 0,
    lastGap: null,
    messageTimer: 2.2,
    message: e ? "Free run — course check" : i ? "Practice run" : "Division four race",
    bestLap: 1 / 0,
    lapStartTime: 0,
    splitTimes: [],
    cleanLandings: 0,
    hardLandings: 0,
    recoveries: 0,
    nearMisses: 0,
    leadState: t ? "SOLO" : "P2",
    camLookYaw: 0,
    camLookPitch: 0,
    cameraZoom: 0,
  });
  const n = St(u.s);
  ((u.y = n.p.y + 2.1),
    (u.yVel = 0),
    (u.ghostRec = []),
    loadGhost(),
    buildGhostMesh(),
    Qe.menu.classList.add("hidden"),
    Qe.result.classList.add("hidden"),
    (Qe.resultStats.innerHTML = ""),
    (Qe.position.textContent = e ? "FREE RUN" : i ? "PRACTICE" : "DIV 4"),
    (Qe.trackName.textContent = ce.name),
    (cn.visible = !1),
    qn && (qn.visible = !0),
    document.body.classList.remove("roam-mode"),
    applyTrackViewClass(),
    (window.__freeCam = !1));
}
function Yd() {
  (La(), (u.mode = "roam"), (u.practice = !0), (u.freeRun = !1), _t.clear(), Ia());
  let i = 80,
    e = 338;
  (Pn(i, e, 6).clearance < 6 && ((i = 80), (e = 320)),
    u.roamPos.set(i, He(i, e), e),
    (u.roamYaw = 0),
    (u.camYaw = u.roamYaw),
    (u.camLookYaw = 0),
    (u.camLookPitch = 0),
    (u.cameraZoom = 0),
    (Fe.zoom = 0),
    (u.wheelSteer = 0),
    (u.speed = 0),
    (u.boost = 1),
    (u.damage = 0),
    (u.cameraShake = 0),
    (u.collisionDrama = 0),
    (u.collisionHits = 0),
    (u.collisionCooldown = 0),
    (u.objectiveIndex = 0),
    (u.objectiveHits = 0),
    (u.objectiveLap = 1),
    (u.driftCombo = 0),
    (u.driftComboT = 0),
    (u.stuntActive = !1),
    (u.stuntPrime = 0),
    (u.sloMoT = 0),
    (u.flipT = 0),
    (u.airRoll = 0),
    (u.stuntBullseye = !1),
    (u.roamAir = !1),
    (u.roamVy = 0),
    (u.roamPrevY = null),
    (u.roamAirT = 0),
    (u.vehicle = "car"),
    (walker.visible = !1));
  (failJob("silent"), releaseStolenRide(), resetPolice());
  heli &&
    (heli.pos.set(heli.pad.x, heli.pad.y + 0.24, heli.pad.z),
    heli.vel.set(0, 0, 0),
    heli.mesh.position.copy(heli.pos));
  for (const s of nn) s.collected = !1;
  ((u.message = ""),
    (u.messageTimer = 0),
    (setRivalsVisible(!1)),
    (cn.visible = !0),
    qn && (qn.visible = !1),
    document.body.classList.add("roam-mode"),
    applyTrackViewClass(),
    (window.__freeCam = !1),
    Qe.menu.classList.add("hidden"),
    Qe.result.classList.add("hidden"),
    (Qe.position.textContent = "FREE ROAM"),
    (Qe.trackName.textContent = "City Streets"),
    zs());
  const t = Math.sin(u.roamYaw),
    n = -Math.cos(u.roamYaw);
  (Xe.position.set(u.roamPos.x - t * 17, u.roamPos.y + 7.2, u.roamPos.z - n * 17),
    Lc(),
    Xe.lookAt(u.roamPos.x + t * 13, u.roamPos.y + 2.45, u.roamPos.z + n * 13),
    (Xe.fov = 69),
    Xe.updateProjectionMatrix());
}
function zs() {
  const dm = driveMeshRef();
  (dm.position.set(
    u.roamPos.x,
    u.roamPos.y + 0.3 - (dm.userData.stolenYOff || 0) - u.roamSuspension * 0.45 - (u.waterDepth || 0) * 0.38,
    u.roamPos.z,
  ),
    dm.quaternion.setFromAxisAngle(on, -u.roamYaw),
    dm.rotateZ(
      -u.wheelSteer * MathUtils.clamp(Math.abs(u.speed) / 90, 0, 1) * 0.1 +
        (u.roamAir && u.stuntActive ? u.airRoll || 0 : 0),
    ),
    dm.rotateX(
      u.roamAir
        ? u.stuntActive && u.stuntRamp?.type === "flip"
          ? -(u.flipT || 0) * Math.PI * 2
          : MathUtils.clamp(-u.roamVy * 0.014, -0.3, 0.34)
        : MathUtils.clamp(u.roamSuspension, -0.16, 0.22),
    ));
}
function qd(i, e) {
  let t = null;
  for (const s of Dr)
    for (const r of s.segments) {
      const a = i - r.a.x,
        o = e - r.a.z,
        c = MathUtils.clamp((a * r.abx + o * r.abz) / r.lenSq, 0, 1),
        l = r.a.x + r.abx * c,
        d = r.a.z + r.abz * c,
        f = Math.hypot(i - l, e - d);
      if (f > s.halfW + Xn * 1.15) continue;
      const p = MathUtils.lerp(r.a.y, r.b.y, c),
        m = MathUtils.lerp(r.u0, r.u1, c),
        g = f + Math.max(0, He(i, e) - p) * 0.2;
      (!t || g < t.score) &&
        (t = {
          kind: "ramp",
          y: p,
          u: m,
          ramp: s,
          rampType: s.rampType,
          mergeS: s.mergeS,
          exitS: s.exitS,
          dirSel: s.dirSel,
          tangentX: r.abx,
          tangentZ: r.abz,
          lateral: s.dirSel * ce.width * 0.34,
          score: g,
        });
    }
  if (!t) return null;
  const n = Math.max(1e-4, Math.hypot(t.tangentX, t.tangentZ));
  return ((t.tangentX /= n), (t.tangentZ /= n), t);
}
function Zd(i, e, t = He(i, e), n = !1) {
  let s = null;
  const r = 10;
  for (let o = 0; o < ce.length; o += r) {
    if (Li(o + r * 0.5)) continue;
    const c = St(o),
      l = St(o + r),
      d = l.p.x - c.p.x,
      f = l.p.z - c.p.z,
      p = Math.max(1e-4, d * d + f * f),
      m = MathUtils.clamp(((i - c.p.x) * d + (e - c.p.z) * f) / p, 0, 1),
      g = c.p.x + d * m,
      M = c.p.z + f * m,
      x = i - g,
      h = e - M,
      _ = Math.hypot(x, h);
    if (_ > ce.width * 0.5 + Xn * 0.45) continue;
    const v = MathUtils.lerp(c.p.y, l.p.y, m) + 0.58;
    if (!n && t < v - 5) continue;
    const y = new Vector3(f, 0, -d).normalize(),
      E = MathUtils.clamp(x * y.x + h * y.z, -ce.width * 0.44, ce.width * 0.44);
    (!s || _ < s.dist) && (s = { kind: "track", y: v, s: o + r * m, lateral: E, tangentX: d, tangentZ: f, dist: _ });
  }
  if (!s) return null;
  const a = Math.max(1e-4, Math.hypot(s.tangentX, s.tangentZ));
  return ((s.tangentX /= a), (s.tangentZ /= a), s);
}
function Ki(i, e, t = u.roamPos.y) {
  const n = He(i, e),
    sr = stuntRampHeightAt(i, e);
  let s = sr > 0 ? { kind: "stunt", y: n + sr } : { kind: "ground", y: n };
  const r = qd(i, e);
  r && r.y >= n - 1.2 && (s = r);
  const a = Zd(i, e, Math.max(t, s.y));
  return (!(s.kind === "ramp" && s.rampType === "off") && a && a.y >= s.y - 0.8 && (s = a), s);
}
function Ih(i) {
  if (i.rampType === "off" || u.drivingStolen) return !1;
  const e = Math.sin(u.roamYaw) * i.tangentX + -Math.cos(u.roamYaw) * i.tangentZ;
  if (u.speed < 10 || e < 0.22) return !1;
  const t = (i.mergeS ?? i.s ?? 22) + 8,
    n = St(t);
  return (
    (u.mode = "race"),
    (u.practice = !0),
    (u.freeRun = !0),
    (u.breakdownTimer = 0),
    (u.s = n.s),
    (u.totalDistance = n.s),
    (u.lastSafeS = n.s),
    (u.lastSafeDistance = n.s),
    (u.lateral = MathUtils.clamp(i.lateral ?? 0, -ce.width * 0.32, ce.width * 0.32)),
    (u.lateralVel = -Math.sign(u.lateral) * Math.min(4, Math.abs(u.speed) * 0.04)),
    (u.speed = MathUtils.clamp(Math.max(28, u.speed), 18, 112)),
    (u.grounded = !0),
    (u.y = n.p.y + 2.1),
    (u.yVel = 0),
    (u.airtime = 0),
    (u.rivalS = -900),
    (u.rivalDistance = -900),
    (u.leadState = "SOLO"),
    (u.message = "Merged onto the ribbon"),
    (u.messageTimer = 1.6),
    (u.cameraShake = Math.max(u.cameraShake, 0.35)),
    (setRivalsVisible(!1)),
    (cn.visible = !1),
    qn && (qn.visible = !0),
    document.body.classList.remove("roam-mode"),
    applyTrackViewClass(),
    (Qe.position.textContent = "FREE RUN"),
    (Qe.trackName.textContent = ce.name),
    zs(),
    !0
  );
}
// Falling off the ribbon (practice/free-run): keep the crash energy and hand control to
// roam physics right where you land — the city catches you, GTA style.
function fallIntoCity(wx, wz, fp) {
  if (u.mode !== "race") return !1;
  const dirX = fp.tangent.x,
    dirZ = fp.tangent.z,
    n = Math.max(1e-4, Math.hypot(dirX, dirZ));
  ((u.mode = "roam"),
    (u.practice = !0),
    (u.freeRun = !1),
    u.roamPos.set(wx, He(wx, wz) + Wn, wz),
    (u.roamYaw = Math.atan2(dirX / n, -dirZ / n)),
    (u.camYaw = u.roamYaw),
    (u.camLookYaw = 0),
    (u.camLookPitch = 0),
    (u.cameraZoom = 0),
    (u.wheelSteer = 0),
    (u.speed = MathUtils.clamp(Math.abs(u.speed) * 0.6, 12, 70)),
    (u.grounded = !0),
    (u.yVel = 0),
    (u.airtime = 0),
    (u.roamAir = !1),
    (u.roamVy = 0),
    (u.roamPrevY = null),
    (u.damage = MathUtils.clamp(u.damage + 10, 0, 100)),
    (u.cameraShake = Math.max(u.cameraShake, 0.8)),
    (u.message = "Off the ribbon — welcome to the streets"),
    (u.messageTimer = 1.8),
    playSfx("land", 0.6, 0.92, 0.08) || Pc(30),
    Pr(new Vector3(wx, u.roamPos.y + 0.4, wz), 20),
    setRivalsVisible(!1),
    (cn.visible = !0),
    qn && (qn.visible = !1),
    document.body.classList.add("roam-mode"),
    applyTrackViewClass(),
    (u.vehicle = "car"),
    (walker.visible = !1),
    (Qe.position.textContent = "FREE ROAM"),
    (Qe.trackName.textContent = "City Streets"),
    zs());
  const a = Math.sin(u.roamYaw),
    o = -Math.cos(u.roamYaw);
  return (
    Xe.position.set(u.roamPos.x - a * 17, u.roamPos.y + 7.2, u.roamPos.z - o * 17),
    Xe.lookAt(u.roamPos.x + a * 13, u.roamPos.y + 2.45, u.roamPos.z + o * 13),
    (Xe.fov = 69),
    Xe.updateProjectionMatrix(),
    !0
  );
}
function iv(i) {
  if (!i || u.mode !== "race") return !1;
  const e = i.segments[0],
    t = i.points[0],
    n = Math.max(1e-4, Math.hypot(e.abx, e.abz)),
    s = e.abx / n,
    r = e.abz / n;
  ((u.mode = "roam"),
    (u.practice = !0),
    (u.freeRun = !1),
    u.roamPos.set(t.x + s * 3.5, t.y + Wn, t.z + r * 3.5),
    (u.roamYaw = Math.atan2(s, -r)),
    (u.camYaw = u.roamYaw),
    (u.camLookYaw = 0),
    (u.camLookPitch = 0),
    (u.cameraZoom = 0),
    (u.wheelSteer = 0),
    (u.speed = MathUtils.clamp(Math.max(24, Math.abs(u.speed) * 0.82), 20, 78)),
    (u.grounded = !0),
    (u.yVel = 0),
    (u.airtime = 0),
    (u.message = "Exited to city streets"),
    (u.messageTimer = 1.25),
    (u.cameraShake = Math.max(u.cameraShake, 0.22)),
    (setRivalsVisible(!1)),
    (cn.visible = !0),
    qn && (qn.visible = !1),
    document.body.classList.add("roam-mode"),
    applyTrackViewClass(),
    (u.vehicle = "car"),
    (walker.visible = !1),
    (Qe.position.textContent = "FREE ROAM"),
    (Qe.trackName.textContent = "City Streets"),
    zs());
  const a = Math.sin(u.roamYaw),
    o = -Math.cos(u.roamYaw);
  return (
    Xe.position.set(u.roamPos.x - a * 17, u.roamPos.y + 7.2, u.roamPos.z - o * 17),
    Xe.lookAt(u.roamPos.x + a * 13, u.roamPos.y + 2.45, u.roamPos.z + o * 13),
    (Xe.fov = 69),
    Xe.updateProjectionMatrix(),
    Pr(u.roamPos.clone().add(new Vector3(0, 0.6, 0)), 10),
    !0
  );
}
function publishRoamTelemetry() {
  const i = rl.set(0, 0, -1).applyQuaternion(Xe.quaternion).normalize();
  window.__steelRibbonTelemetry = {
    mode: u.mode,
    s: u.s,
    totalDistance: u.totalDistance,
    rivalDistance: u.rivalDistance,
    speed: u.speed,
    lap: u.lap,
    score: u.score,
    damage: u.damage,
    y: u.roamPos.y,
    yVel: u.yVel,
    grounded: !u.roamAir,
    objectiveHits: u.objectiveHits,
    waterDepth: +(u.waterDepth || 0).toFixed(3),
    driftAngle: +(u.driftAngle || 0).toFixed(3),
    driftCombo: u.driftCombo || 0,
    driftComboT: +(u.driftComboT || 0).toFixed(2),
    driftT: +(u.driftT || 0).toFixed(2),
    driftAcc: +(u.driftAcc || 0).toFixed(1),
    roamView,
    heat: +(u.heat || 0).toFixed(2),
    police: police.cars.length,
    policeNearest: police.nearest === 1 / 0 ? null : +police.nearest.toFixed(1),
    roadblocks: police.blocks.length,
    spikedT: +(u.spikedT || 0).toFixed(2),
    rain: +weatherWet().toFixed(2),
    job: { state: jobSys.state, type: jobSys.type, timeLeft: +jobSys.timeLeft.toFixed(1) },
    stuntActive: !!u.stuntActive,
    stuntType: (u.stuntActive && u.stuntRamp?.type) || null,
    flipT: +(u.flipT || 0).toFixed(2),
    bullseye: !!u.stuntBullseye,
    sloMoT: +(u.sloMoT || 0).toFixed(2),
    stunts: qe.stunts || 0,
    airTime: +(u.roamAirT || 0).toFixed(2),
    vehicle: u.vehicle || "car",
    drivingStolen: !!u.drivingStolen,
    stolenType: (u.drivingStolen && stolenRide?.type) || null,
    altitude: +(u.roamPos.y - He(u.roamPos.x, u.roamPos.z)).toFixed(1),
    roamPos: { x: u.roamPos.x, y: u.roamPos.y, z: u.roamPos.z },
    input: { steer: Fe.steer, throttle: Fe.throttle, brake: Fe.brake },
    forwardWorld: { x: Math.sin(u.roamYaw), y: 0, z: -Math.cos(u.roamYaw) },
    cameraWorld: { x: i.x, y: i.y, z: i.z },
  };
}
// ─── Free-roam minimap: baked road/ribbon map + live gates, traffic and player ───
// var (not const): bakeMinimap gets called from cl() during module init, before this block runs.
var minimapCv = document.createElement("canvas");
((minimapCv.id = "minimap"), (minimapCv.width = 256), (minimapCv.height = 256));
document.querySelector("#app")?.appendChild(minimapCv);
var minimapBake = null,
  mmFrame = 0,
  MM = { cx: 0, cz: -570, span: 2180 };
function mmPt(x, z, size) {
  return [((x - MM.cx) / MM.span + 0.5) * size, ((z - MM.cz) / MM.span + 0.5) * size];
}
function bakeMinimap() {
  if (!MM) return;
  const size = 512,
    b = document.createElement("canvas");
  ((b.width = size), (b.height = size));
  const c = b.getContext("2d");
  ((c.fillStyle = "rgba(9, 15, 24, 0.88)"), c.fillRect(0, 0, size, size));
  ((c.strokeStyle = "rgba(150, 185, 215, 0.5)"), (c.lineWidth = 3), (c.lineCap = "round"));
  for (let x = di.x0; x <= di.x1 + 1; x += di.pitch) {
    const [ax, az] = mmPt(x, di.zNear, size),
      [bx, bz] = mmPt(x, di.zFar, size);
    (c.beginPath(), c.moveTo(ax, az), c.lineTo(bx, bz), c.stroke());
  }
  for (let z = di.zNear; z >= di.zFar - 1; z -= di.pitch) {
    const [ax, az] = mmPt(di.x0, z, size),
      [bx, bz] = mmPt(di.x1, z, size);
    (c.beginPath(), c.moveTo(ax, az), c.lineTo(bx, bz), c.stroke());
  }
  ((c.strokeStyle = "rgba(255, 176, 90, 0.85)"), (c.lineWidth = 2.6), c.beginPath());
  let first = !0;
  for (const p of kd())
    if (p.courseIndex === Ma) {
      const [px, pz] = mmPt(p.x, p.z, size);
      (first ? c.moveTo(px, pz) : c.lineTo(px, pz), (first = !1));
    }
  (c.closePath(), c.stroke());
  c.fillStyle = "rgba(96, 168, 255, 0.75)";
  for (const p of ponds) {
    const [px, pz] = mmPt(p.x, p.z, size);
    (c.beginPath(), c.ellipse(px, pz, Math.max(3, (p.rx / MM.span) * size), Math.max(3, (p.rz / MM.span) * size), 0, 0, Math.PI * 2), c.fill());
  }
  // stunt ramps: small orange arrowheads pointing along the launch direction
  c.fillStyle = "rgba(255, 150, 60, 0.95)";
  for (const r of stuntRamps || []) {
    const [px, pz] = mmPt(r.x, r.z, size);
    (c.save(), c.translate(px, pz), c.rotate(r.yaw), c.beginPath(), c.moveTo(0, -7), c.lineTo(4.4, 4.4), c.lineTo(-4.4, 4.4), c.closePath(), c.fill(), c.restore());
  }
  minimapBake = b;
}
function updateMinimap() {
  const roam = u.mode === "roam";
  if ((minimapCv.style.display = roam ? "block" : "none") && !roam) return;
  if (!roam || !minimapBake || mmFrame++ % 2) return;
  const size = minimapCv.width,
    c = minimapCv.getContext("2d");
  (c.clearRect(0, 0, size, size), c.drawImage(minimapBake, 0, 0, size, size));
  for (const r of Dr)
    if (r.rampType === "on" && r.points?.length) {
      const p0 = r.points[0],
        [px, pz] = mmPt(p0.x, p0.z, size);
      ((c.fillStyle = "#6dff9e"), c.beginPath(), c.arc(px, pz, 4, 0, Math.PI * 2), c.fill());
    }
  for (let k = 0; k < nn.length; k++) {
    const g = nn[k],
      [px, pz] = mmPt(g.x, g.z, size),
      next = k === u.objectiveIndex % nn.length;
    ((c.fillStyle = next ? "#7df1ff" : "rgba(125, 241, 255, 0.35)"),
      c.beginPath(),
      c.arc(px, pz, next ? 5.5 + Math.sin(Ch * 5) * 1.4 : 3, 0, Math.PI * 2),
      c.fill());
  }
  c.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (const t of Ri) {
    const [px, pz] = mmPt(t.x, t.z, size);
    c.fillRect(px - 1.4, pz - 1.4, 2.8, 2.8);
  }
  if (heli) {
    const [hx, hz] = mmPt(heli.pad.x, heli.pad.z, size);
    ((c.fillStyle = "#ffd45b"), (c.font = "700 11px Arial"), (c.textAlign = "center"), c.fillText("H", hx, hz + 4));
    if (u.vehicle !== "heli") {
      const [ax, az] = mmPt(heli.pos.x, heli.pos.z, size);
      ((c.fillStyle = "#8ef0ff"), c.beginPath(), c.arc(ax, az, 3, 0, Math.PI * 2), c.fill());
    }
  }
  if (u.vehicle !== "car" || u.drivingStolen) {
    const [cx2, cz2] = mmPt(parkedCarPos.x, parkedCarPos.z, size);
    ((c.fillStyle = "#7dc4ff"), c.fillRect(cx2 - 2.4, cz2 - 2.4, 4.8, 4.8));
  }
  if (stolenRide?.parked) {
    const [sx2, sz2] = mmPt(stolenRide.parked.x, stolenRide.parked.z, size);
    ((c.fillStyle = "#ffb35c"), c.fillRect(sx2 - 2.2, sz2 - 2.2, 4.4, 4.4));
  }
  c.fillStyle = "#ff4d4d";
  for (const pc of police.cars) {
    const [qx, qz] = mmPt(pc.x, pc.z, size);
    (c.beginPath(), c.arc(qx, qz, 3.2, 0, Math.PI * 2), c.fill());
  }
  for (const b of police.blocks) {
    const [qx, qz] = mmPt(b.x, b.z, size);
    ((c.fillStyle = "#ff8080"), c.fillRect(qx - 4, qz - 1.4, 8, 2.8));
  }
  if (jobSys.state === "available" && jobSys.pickup) {
    const [qx, qz] = mmPt(jobSys.pickup.x, jobSys.pickup.z, size);
    ((c.fillStyle = "#35e0ff"), c.fillRect(qx - 2.6, qz - 2.6, 5.2, 5.2));
  }
  if (jobSys.state === "active" && jobSys.dest) {
    const [qx, qz] = mmPt(jobSys.dest.x, jobSys.dest.z, size);
    (c.save(), c.translate(qx, qz), c.rotate(Math.PI / 4), (c.fillStyle = "#ffd700"), c.fillRect(-3, -3, 6, 6), c.restore());
  }
  const [px, pz] = mmPt(u.roamPos.x, u.roamPos.z, size);
  (c.save(), c.translate(px, pz), c.rotate(u.roamYaw));
  ((c.fillStyle = "#ffd45b"),
    c.beginPath(),
    c.moveTo(0, -8),
    c.lineTo(5.2, 6),
    c.lineTo(-5.2, 6),
    c.closePath(),
    c.fill(),
    c.restore());
}
bakeMinimap();
let gateBeam = null;
function updateGateBeam() {
  if (!gateBeam) {
    ((gateBeam = new Mesh(
      new CylinderGeometry(2.4, 3.2, 620, 12, 1, !0),
      new MeshBasicMaterial({
        color: 5750015,
        transparent: !0,
        opacity: 0.13,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        fog: !1,
      }),
    )),
      (gateBeam.renderOrder = 5),
      et.add(gateBeam));
  }
  const i = u.mode === "roam" && nn.length > 0;
  gateBeam.visible = i;
  if (!i) return;
  const e = nn[u.objectiveIndex % nn.length];
  (gateBeam.position.set(e.x, e.y + 296, e.z), (gateBeam.material.opacity = 0.1 + Math.sin(Ch * 3.1) * 0.04));
}
let gatePrev = null;
function sv() {
  if (u.mode !== "roam" || nn.length === 0) {
    gatePrev = null;
    return;
  }
  const i = nn[u.objectiveIndex % nn.length];
  if (!i) return;
  // Sweep the whole frame's travel segment against the ring so a fast or clipping pass
  // can't tunnel between two position samples. A huge segment means a teleport — skip it.
  const px = gatePrev?.x ?? u.roamPos.x,
    pz = gatePrev?.z ?? u.roamPos.z,
    py = gatePrev?.y ?? u.roamPos.y,
    dx = u.roamPos.x - px,
    dz = u.roamPos.z - pz,
    L2 = dx * dx + dz * dz;
  ((gatePrev ??= { x: 0, y: 0, z: 0 }),
    (gatePrev.x = u.roamPos.x),
    (gatePrev.y = u.roamPos.y),
    (gatePrev.z = u.roamPos.z));
  if (L2 > 40000) return;
  const ct = L2 > 1e-6 ? MathUtils.clamp(((i.x - px) * dx + (i.z - pz) * dz) / L2, 0, 1) : 0,
    e = px + dx * ct - i.x,
    t = pz + dz * ct - i.z,
    n = Math.abs(py + (u.roamPos.y - py) * ct - i.y),
    rr = i.radius + 1.2;
  e * e + t * t > rr * rr ||
    n > 10 ||
    ((i.collected = !0),
    u.objectiveHits++,
    (u.objectiveIndex = (u.objectiveIndex + 1) % nn.length),
    u.objectiveIndex === 0 && u.objectiveLap++,
    (u.score += 420 + Math.round(Math.abs(u.speed) * 5)),
    (u.boost = Math.min(1, u.boost + 0.32)),
    (u.cameraShake = Math.max(u.cameraShake, 0.18)),
    (u.message = i.label),
    (u.messageTimer = 1.05),
    showScorePop(`+${420 + Math.round(Math.abs(u.speed) * 5)} GATE`, !0),
    chime(880, 0.16),
    setTimeout(() => chime(1245, 0.2), 90),
    Pr(new Vector3(i.x, i.y, i.z), 18));
}
function $d(i) {
  const e = u.speed;
  u.collisionCooldown = Math.max(0, u.collisionCooldown - i);
  const t = Math.max(_t.has("KeyW") || _t.has("ArrowUp") ? 1 : 0, Fe.throttle),
    n = Math.max(_t.has("KeyS") || _t.has("ArrowDown") ? 1 : 0, Fe.brake),
    r =
      MathUtils.clamp(
        (_t.has("KeyD") || _t.has("ArrowRight") ? 1 : 0) - (_t.has("KeyA") || _t.has("ArrowLeft") ? 1 : 0) + Fe.steer,
        -1,
        1,
      ) * Ud,
    a = (_t.has("ShiftLeft") || _t.has("ShiftRight")) && u.boost > 0.02 && t > 0.03;
  if (t > 0.03) {
    const v = u.speed < 0 ? 38 : 0;
    u.speed += ((a ? 70 : 42) * carStats().accel + v) * t * i;
  }
  (n > 0.03 && (u.speed -= (u.speed > 1.2 ? 78 : 32) * n * i),
    (u.speed -= 0.00235 * u.speed * Math.abs(u.speed) * i),
    Math.abs(u.speed) > 0.08 ? (u.speed -= Math.sign(u.speed) * 3.6 * i) : t <= 0.03 && n <= 0.03 && (u.speed = 0),
    (u.speed = MathUtils.clamp(u.speed, -24, 135 * carStats().top * (u.spikedT > 0 ? 0.62 : 1))),
    (u.boosting = a),
    a
      ? (u.boost = Math.max(0, u.boost - i * 0.22))
      : (u.boost = Math.min(1, u.boost + i * 0.05 * carStats().boostRegen)),
    (u.wheelSteer += (r - u.wheelSteer) * (1 - Math.pow(1e-5, i))));
  u.spikedT > 0 && (u.spikedT -= i);
  const o = -u.wheelSteer * 0.55,
    c = driveMeshRef().userData.frontWheels;
  c && ((c[0].rotation.y = o), (c[1].rotation.y = o));
  if (u.drivingStolen && stolenRide)
    for (const wh of stolenRide.mesh.userData.wheels || []) wh.rotation.x -= u.speed * i * 1.7;
  const l = Math.abs(u.speed);
  // Handbrake (Space): the rear steps out — extra yaw, a drift angle between facing and travel,
  // speed scrub, and drift scoring while the slide is held.
  const hb = _t.has("Space") && !u.roamAir;
  if (l > Ac) {
    const v = MathUtils.clamp((l - Ac) / 5, 0, 1),
      y = 1 - 0.36 * MathUtils.clamp((l - 34) / 85, 0, 1),
      E = m1 * 1.08 * v * y * (hb ? 1.85 : 1) * carStats().grip * (u.spikedT > 0 ? 0.55 : 1) * (1 - 0.26 * weatherWet());
    u.roamYaw += u.wheelSteer * E * i * Math.sign(u.speed);
  }
  hb && l > 8
    ? ((u.driftAngle = MathUtils.clamp(
        (u.driftAngle || 0) + u.wheelSteer * i * 2.5 * Math.sign(u.speed),
        -0.62,
        0.62,
      )),
      (u.speed -= u.speed * (0.12 + Math.abs(u.driftAngle) * 0.45) * i))
    : (u.driftAngle = (u.driftAngle || 0) * Math.pow(0.004, i));
  const motionYaw = u.roamYaw - (u.driftAngle || 0),
    d = Math.sin(motionYaw),
    f = -Math.cos(motionYaw),
    p = (u.speed - e) / Math.max(0.001, i),
    m = MathUtils.clamp(
      (Math.abs(u.wheelSteer) * Math.max(0, l - 18)) / 68 +
        Math.max(0, -p - 34) / 90 +
        Math.abs(u.driftAngle || 0) * 1.5,
      0,
      1,
    );
  if (
    ((u.roamSlip += (m - u.roamSlip) * (1 - Math.pow(0.01, i))),
    (u.roamSuspension +=
      (Math.sin(performance.now() * 0.014) * Math.min(0.18, l / 540) + Math.abs(p) * 0.0018 - u.roamSuspension) *
      (1 - Math.pow(0.018, i))),
    u.roamSlip > 0.38 && Math.random() < i * (3 + u.roamSlip * 7))
  ) {
    const v = new Vector3(u.roamPos.x - d * 3.2, u.roamPos.y + 0.2, u.roamPos.z - f * 3.2);
    Xd(v, 2, u.roamSlip);
  }
  const g = Math.abs(u.speed) * i,
    M = Math.max(1, Math.ceil(g / 1.2));
  let x = !1,
    h = !1,
    _ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y);
  for (let v = 0; v < M; v++)
    ((u.roamPos.x += (d * u.speed * i) / M),
      (u.roamPos.z += (f * u.speed * i) / M),
      (_ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y)),
      u.roamAir || (u.roamPos.y = _.y + Wn),
      cv(u.roamPos, _) && (h = !0),
      lv(u.roamPos, _) && (x = !0),
      (_ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y)),
      u.roamAir || (u.roamPos.y = _.y + Wn));
  ((u.roamPos.x = MathUtils.clamp(u.roamPos.x, -820, 820)),
    (u.roamPos.z = MathUtils.clamp(u.roamPos.z, -1620, 480)),
    x &&
      (u.collisionCooldown <= 0 &&
        (ev(new Vector3(u.roamPos.x, u.roamPos.y + 0.8, u.roamPos.z), e, "IMPACT"), (u.collisionCooldown = 0.38)),
      (u.speed *= 0.28)),
    h &&
      ((u.speed *= 0.62),
      (u.cameraShake = Math.max(u.cameraShake, 0.22)),
      (u.message = "SPLAT!"),
      (u.messageTimer = 0.9),
      addHeat(0.6)),
    waterPhysics(i, e),
    driftScoreUpdate(i, hb, x),
    updateNearMisses(i, x),
    (_ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y)),
    roamVertical(i, _),
    !(_.kind === "ramp" && _.u > 0.72 && Ih(_)) &&
      ((_.kind === "track" && Ih(_)) || (sv(), zs(), _t.has("KeyR") && (Yd(), _t.delete("KeyR")))));
}
// ─── Vehicle transitions: car ⇄ foot ⇄ helicopter ⇄ stolen rides (E key / touch action button) ───
const STOLEN_STATS = {
  compact: { accel: 0.95, top: 0.9, grip: 1, boostRegen: 0.75 },
  taxi: { accel: 0.97, top: 0.92, grip: 1, boostRegen: 0.75 },
  pickup: { accel: 0.9, top: 0.88, grip: 0.94, boostRegen: 0.7 },
  van: { accel: 0.84, top: 0.84, grip: 0.9, boostRegen: 0.7 },
  boxTruck: { accel: 0.7, top: 0.78, grip: 0.82, boostRegen: 0.6 },
  bus: { accel: 0.62, top: 0.74, grip: 0.76, boostRegen: 0.6 },
};
let stolenRide = null; // { mesh, type, actor|null, parked: Vector3|null, parkedYaw }
const abandonedRides = [];
function driveMeshRef() {
  return u.drivingStolen && stolenRide ? stolenRide.mesh : cn;
}
function abandonStolenRide() {
  if (!stolenRide) return;
  if (stolenRide.job) {
    const m = stolenRide.mesh;
    stolenRide = null;
    jobAbandoned(m);
    return;
  }
  if (stolenRide.actor) {
    // Freeze the actor where it was left and make it solid again there.
    const cl = stolenRide.actor.collider,
      m = stolenRide.mesh.position;
    ((cl.x = m.x), (cl.z = m.z));
  }
  (abandonedRides.push(stolenRide), (stolenRide = null));
}
function stealTrafficCar(actor) {
  abandonStolenRide();
  ((actor.stolen = !0), (actor.collider.x = 1e6), (actor.collider.z = 1e6));
  et.attach(actor.mesh);
  actor.mesh.userData.stolenYOff = 0.57;
  const dirX = actor.axis === "ns" ? 0 : actor.dir,
    dirZ = actor.axis === "ns" ? actor.dir : 0;
  stolenRide = { mesh: actor.mesh, type: actor.type || "compact", actor, parked: null, parkedYaw: 0 };
  ((u.vehicle = "car"),
    (u.drivingStolen = !0),
    u.roamPos.set(actor.mesh.position.x, He(actor.mesh.position.x, actor.mesh.position.z) + Wn, actor.mesh.position.z),
    (u.roamYaw = Math.atan2(dirX, -dirZ)),
    (u.camYaw = u.roamYaw),
    (u.speed = actor.speed),
    (walker.visible = !1),
    (u.message = `${(actor.type || "car").toUpperCase()} jacked!`),
    (u.messageTimer = 1.2),
    addHeat(1),
    playSfx("jack", 0.5, 1, 0.08) || chime(340, 0.18, "square", 0.1),
    zs());
  return !0;
}
function stealParkedCar(spot) {
  abandonStolenRide();
  ((spot.taken = !0), (spot.savedM = new Matrix4()));
  if (rideSys.im) {
    const hide = new Matrix4().makeScale(1e-4, 1e-4, 1e-4);
    (rideSys.im.getMatrixAt(spot.idx, spot.savedM),
      rideSys.im.setMatrixAt(spot.idx, hide),
      rideSys.imW.setMatrixAt(spot.idx, hide),
      (rideSys.im.instanceMatrix.needsUpdate = !0),
      (rideSys.imW.instanceMatrix.needsUpdate = !0));
  }
  const mesh = I1("compact", [11680564, 14205514, 15198700, 4164178][(Math.random() * 4) | 0]);
  ((mesh.userData.stolenYOff = 0.57), et.add(mesh));
  stolenRide = { mesh, type: "compact", actor: null, parked: null, parkedYaw: 0, spotRef: spot };
  ((u.vehicle = "car"),
    (u.drivingStolen = !0),
    u.roamPos.set(spot.x, He(spot.x, spot.z) + Wn, spot.z),
    (u.roamYaw = spot.yaw),
    (u.camYaw = spot.yaw),
    (u.speed = 0),
    (walker.visible = !1),
    (u.message = "Borrowed a parked car"),
    (u.messageTimer = 1.1),
    addHeat(0.7),
    playSfx("jack", 0.45, 1.05, 0.08) || chime(300, 0.16, "square", 0.09),
    zs());
  return !0;
}
function exitStolen() {
  ((stolenRide.mesh.visible = !0), (stolenRide.parked = u.roamPos.clone()), (stolenRide.parkedYaw = u.roamYaw));
  ((u.vehicle = "foot"), (u.drivingStolen = !1), (u.speed = 0), (u.driftAngle = 0));
  const rx = Math.cos(u.roamYaw),
    rz = Math.sin(u.roamYaw);
  ((u.roamPos.x -= rx * 3.4), (u.roamPos.z -= rz * 3.4), (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05));
  walker.visible = !0;
  return !0;
}
function reenterStolen() {
  if (!stolenRide?.parked || u.roamPos.distanceTo(stolenRide.parked) > 7) return !1;
  ((u.vehicle = "car"),
    (u.drivingStolen = !0),
    u.roamPos.copy(stolenRide.parked),
    (u.roamYaw = stolenRide.parkedYaw),
    (u.camYaw = u.roamYaw),
    (u.speed = 0),
    (stolenRide.parked = null),
    (walker.visible = !1),
    zs());
  return !0;
}
function tryStealNearby() {
  for (const r of Ri) {
    const a = r.actor;
    if (!a || !a.type || a.stolen || Math.hypot(u.roamPos.x - r.x, u.roamPos.z - r.z) > 6) continue;
    return stealTrafficCar(a);
  }
  for (const s of rideSys.spots)
    if (!s.taken && Math.hypot(u.roamPos.x - s.x, u.roamPos.z - s.z) < 5.5) return stealParkedCar(s);
  return !1;
}
function disposeRide(r) {
  if (r.actor) r.actor.stolen = !1;
  else {
    removeVehicleMesh(r.mesh);
    const s = r.spotRef;
    s?.savedM &&
      rideSys.im &&
      (rideSys.im.setMatrixAt(s.idx, s.savedM),
      rideSys.imW.setMatrixAt(s.idx, s.savedM),
      (rideSys.im.instanceMatrix.needsUpdate = !0),
      (rideSys.imW.instanceMatrix.needsUpdate = !0),
      (s.taken = !1));
  }
}
function releaseStolenRide() {
  (stolenRide && (disposeRide(stolenRide), (stolenRide = null)),
    abandonedRides.splice(0).forEach(disposeRide),
    (u.drivingStolen = !1));
}
function exitCar(force = !1) {
  if (u.vehicle !== "car" || (!force && Math.abs(u.speed) > 12)) return !1;
  if (u.drivingStolen && stolenRide) {
    ((u.roamAir = !1), (u.roamVy = 0));
    exitStolen();
    ((u.message = "On foot — your car is marked on the map"), (u.messageTimer = 1.6));
    return !0;
  }
  (parkedCarPos.copy(u.roamPos), (parkedCarYaw = u.roamYaw), (cn.visible = !0));
  ((u.vehicle = "foot"), (u.speed = 0), (u.driftAngle = 0), (u.roamAir = !1), (u.roamVy = 0));
  const rx = Math.cos(u.roamYaw),
    rz = Math.sin(u.roamYaw);
  ((u.roamPos.x -= rx * 3.4), (u.roamPos.z -= rz * 3.4), (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05));
  ((walker.visible = !0), (u.message = "On foot — E enters your car, the heli, or steals a ride"), (u.messageTimer = 1.6));
  return !0;
}
function enterCar() {
  if (u.vehicle !== "foot" || u.roamPos.distanceTo(parkedCarPos) > 7) return !1;
  ((u.vehicle = "car"),
    u.roamPos.copy(parkedCarPos),
    (u.roamYaw = parkedCarYaw),
    (u.camYaw = parkedCarYaw),
    (u.speed = 0),
    (walker.visible = !1),
    zs());
  return !0;
}
function enterHeli() {
  if (u.vehicle !== "foot" || !heli || u.roamPos.distanceTo(heli.pos) > 10.5) return !1;
  ((u.vehicle = "heli"),
    u.roamPos.copy(heli.pos),
    (u.roamYaw = heli.yaw),
    (u.camYaw = heli.yaw),
    (u.speed = 0),
    heli.vel.set(0, 0, 0),
    (walker.visible = !1),
    (u.message = "Arrows fly · Space up · Shift down · E lands"),
    (u.messageTimer = 2.2));
  return !0;
}
function exitHeli() {
  if (u.vehicle !== "heli" || !heli) return !1;
  const groundY = He(heli.pos.x, heli.pos.z);
  if (heli.pos.y - groundY > 5.2 || heli.vel.length() > 9) {
    ((u.message = "Land first — get low and slow"), (u.messageTimer = 1.1));
    return !1;
  }
  ((u.vehicle = "foot"),
    (heli.mesh.visible = !0),
    (u.roamPos.x = heli.pos.x + Math.cos(heli.yaw) * -5.6),
    (u.roamPos.z = heli.pos.z + Math.sin(heli.yaw) * -5.6),
    (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05),
    (u.speed = 0),
    (walker.visible = !0));
  return !0;
}
function handleVehicleAction() {
  u.mode === "roam" &&
    (u.vehicle === "car"
      ? exitCar() || ((u.message = "Slow down to step out"), (u.messageTimer = 0.9))
      : u.vehicle === "foot"
        ? (u.roamPos.distanceTo(parkedCarPos) <=
          (stolenRide?.parked ? u.roamPos.distanceTo(stolenRide.parked) : 1 / 0)
            ? enterCar() || reenterStolen()
            : reenterStolen() || enterCar()) ||
          enterHeli() ||
          enterJobVehicle() ||
          tryStealNearby()
        : exitHeli());
}
function walkerUpdate(i) {
  const t = Math.max(_t.has("KeyW") || _t.has("ArrowUp") ? 1 : 0, Fe.throttle),
    n = Math.max(_t.has("KeyS") || _t.has("ArrowDown") ? 1 : 0, Fe.brake),
    r = MathUtils.clamp(
      (_t.has("KeyD") || _t.has("ArrowRight") ? 1 : 0) - (_t.has("KeyA") || _t.has("ArrowLeft") ? 1 : 0) + Fe.steer,
      -1,
      1,
    ),
    run = _t.has("ShiftLeft") || _t.has("ShiftRight"),
    prevSpeed = u.speed,
    target = (t - n) * (run ? 14.5 : 6.4);
  ((u.speed += (target - u.speed) * Math.min(1, i * 7)), (u.roamYaw += r * 2.3 * i));
  const d = Math.sin(u.roamYaw),
    f = -Math.cos(u.roamYaw);
  ((u.roamPos.x += d * u.speed * i), (u.roamPos.z += f * u.speed * i));
  (lv(u.roamPos, { kind: "ground" }),
    (u.roamPos.x = MathUtils.clamp(u.roamPos.x, -820, 820)),
    (u.roamPos.z = MathUtils.clamp(u.roamPos.z, -1620, 480)),
    (u.roamPos.y = He(u.roamPos.x, u.roamPos.z) + 0.05));
  (waterPhysics(i, prevSpeed), sv());
  // pose + limb swing
  (walker.position.copy(u.roamPos), (walker.rotation.y = Math.atan2(-d, -f)));
  u.walkPhase = (u.walkPhase || 0) + i * (2 + Math.abs(u.speed) * 0.85);
  const sw = Math.sin(u.walkPhase) * MathUtils.clamp(Math.abs(u.speed) / 5, 0, 1);
  for (const L of walker.userData.limbs || [])
    ((L.mesh.rotation.x = sw * L.amp * L.side * 2.2), (L.mesh.position.y = L.baseY + Math.abs(sw) * 0.03));
  // proximity hints
  const nearCar = u.roamPos.distanceTo(parkedCarPos) < 7,
    nearHeli = heli && u.roamPos.distanceTo(heli.pos) < 9;
  u.messageTimer <= 0 &&
    (nearCar
      ? ((u.message = "E — enter car"), (u.messageTimer = 0.2))
      : nearHeli && ((u.message = "E — enter helicopter"), (u.messageTimer = 0.2)));
}
function heliUpdate(i) {
  if (!heli) return;
  const fwd =
      Math.max(_t.has("KeyW") || _t.has("ArrowUp") ? 1 : 0, Fe.throttle) -
      Math.max(_t.has("KeyS") || _t.has("ArrowDown") ? 1 : 0, Fe.brake),
    yawIn = MathUtils.clamp(
      (_t.has("KeyA") || _t.has("ArrowLeft") ? 1 : 0) - (_t.has("KeyD") || _t.has("ArrowRight") ? 1 : 0) - Fe.steer,
      -1,
      1,
    ),
    lift = heli.rpm > 0.55,
    boostHeld = _t.has("ShiftLeft") || _t.has("ShiftRight"),
    // touch devices: hold the boost button to climb, release to sink gently; desktop: Space up / Shift down
    upIn = mobilePerf ? (boostHeld ? 1 : heli.pos.y - He(heli.pos.x, heli.pos.z) > 6 ? -0.45 : 0) : _t.has("Space") ? 1 : boostHeld ? -1 : 0;
  heli.yaw -= yawIn * 1.5 * i * (lift ? 1 : 0.2);
  const d = Math.sin(heli.yaw),
    f = -Math.cos(heli.yaw);
  if (lift) {
    ((heli.vel.x += d * fwd * 30 * i), (heli.vel.z += f * fwd * 30 * i), (heli.vel.y += upIn * 24 * i));
    // touch flight auto-hover: gently sinks toward a cruising floor when no vertical input
    upIn === 0 && (heli.vel.y -= heli.vel.y * 1.6 * i);
  }
  (heli.vel.x -= heli.vel.x * 0.85 * i, (heli.vel.z -= heli.vel.z * 0.85 * i), (heli.vel.y -= heli.vel.y * 1.1 * i));
  heli.pos.addScaledVector(heli.vel, i);
  const groundY = He(heli.pos.x, heli.pos.z);
  ((heli.pos.x = MathUtils.clamp(heli.pos.x, -1500, 1500)),
    (heli.pos.z = MathUtils.clamp(heli.pos.z, -1900, 700)),
    (heli.pos.y = Math.min(heli.pos.y, 300)));
  heli.pos.y < groundY + 1.1 && ((heli.pos.y = groundY + 1.1), (heli.vel.y = Math.max(0, heli.vel.y)));
  // low-altitude building avoidance (colliders skip us once we're above their maxY)
  (Lo(heli.pos, Mn) || Lo(heli.pos, Di)) &&
    (heli.vel.multiplyScalar(0.25), (u.cameraShake = Math.max(u.cameraShake, 0.2)));
  ((u.roamPos.x = heli.pos.x), (u.roamPos.y = heli.pos.y), (u.roamPos.z = heli.pos.z), (u.roamYaw = heli.yaw));
  u.speed = Math.hypot(heli.vel.x, heli.vel.z);
  (heli.mesh.position.copy(heli.pos), heli.mesh.quaternion.setFromAxisAngle(on, -heli.yaw));
  (heli.mesh.rotateX(MathUtils.clamp((heli.vel.x * d + heli.vel.z * f) * 0.008, -0.24, 0.24)),
    heli.mesh.rotateZ(MathUtils.clamp(yawIn * 0.14, -0.2, 0.2)));
  sv();
}
function driftScoreUpdate(i, hb, collided) {
  const active = hb && Math.abs(u.driftAngle || 0) > 0.16 && Math.abs(u.speed) > 24;
  // Combo window: banking another drift within 4s multiplies the payout, up to x5.
  // A collision kills both the current drift and the chain.
  if (u.driftComboT > 0 && ((u.driftComboT -= i), u.driftComboT <= 0)) u.driftCombo = 0;
  if (collided && (u.driftCombo || u.driftComboT > 0)) ((u.driftCombo = 0), (u.driftComboT = 0));
  if (active && !collided) {
    ((u.driftT = (u.driftT || 0) + i),
      (u.driftAcc = (u.driftAcc || 0) + i * Math.abs(u.speed) * (0.7 + Math.abs(u.driftAngle))));
  } else if (u.driftT) {
    if (!collided && u.driftT > 0.55) {
      const mult = Math.min(5, (u.driftCombo || 0) + 1),
        pts = Math.round(u.driftAcc * mult);
      ((u.score += pts),
        showScorePop(mult > 1 ? `+${pts} DRIFT ×${mult}` : `+${pts} DRIFT`),
        chime(600 + mult * 90, 0.16, "square", 0.1),
        (u.driftCombo = mult),
        (u.driftComboT = 4));
    }
    ((u.driftT = 0), (u.driftAcc = 0));
  }
}
function roamVertical(i, surf) {
  // Crest launches: while grounded we track the vertical rate the terrain demands; when the ground
  // falls away faster than gravity could pull us down from our current climb, the car goes ballistic.
  const surfY = surf.y + Wn,
    prevY = u.roamPrevY ?? surfY;
  // Riding a stunt ramp primes the launch: leaving the ground within a beat of the ramp
  // top counts as a stunt (slow-mo + a bigger landing payout than a plain hill hop).
  (surf.kind === "stunt" &&
    Math.abs(u.speed) > 30 &&
    ((u.stuntPrime = 0.3), (u.stuntRamp = lastStuntRamp)),
    u.stuntPrime > 0 && (u.stuntPrime -= i));
  if (!u.roamAir) {
    const vyFollow = (surfY - prevY) / Math.max(1e-4, i);
    if (Math.abs(u.speed) > 26 && vyFollow < (u.roamVy || 0) - 40 * i - 3.4) {
      ((u.roamAir = !0), (u.roamAirT = 0));
      u.stuntPrime > 0 &&
        ((u.stuntActive = !0),
        (u.stuntPrime = 0),
        (u.flipT = 0),
        (u.airRoll = 0),
        (u.stuntBullseye = !1),
        (u.sloMoT = u.stuntRamp?.type === "flip" ? 1.4 : 1.15),
        (u.message = u.stuntRamp?.type === "flip" ? "BACKFLIP!" : "STUNT!"),
        (u.messageTimer = 1),
        playSfx("whoosh", 0.38, 1.2, 0.08));
    } else {
      ((u.roamVy = MathUtils.clamp(vyFollow, -70, 70)), (u.roamPos.y = surfY));
    }
  }
  if (u.roamAir) {
    ((u.roamVy -= 34 * i), (u.roamAirT += i));
    u.roamPos.y = u.roamPos.y + u.roamVy * i;
    if (u.stuntActive) {
      // flip ramps rotate the car through a full backflip over the arc
      u.stuntRamp?.type === "flip" && (u.flipT = Math.min(1, (u.flipT || 0) + i / 1.05));
      // A/D barrel-rolls for style while airborne
      const rollIn =
        (_t.has("KeyD") || _t.has("ArrowRight") ? 1 : 0) - (_t.has("KeyA") || _t.has("ArrowLeft") ? 1 : 0);
      u.airRoll = (u.airRoll || 0) + rollIn * i * 4.4;
      // threading the hoop doubles the payout
      const hp = u.stuntRamp?.hoop;
      hp &&
        !u.stuntBullseye &&
        Math.hypot(u.roamPos.x - hp.x, u.roamPos.y - hp.y, u.roamPos.z - hp.z) < hp.r - 0.4 &&
        ((u.stuntBullseye = !0),
        (u.message = "BULLSEYE!"),
        (u.messageTimer = 1),
        chime(1240, 0.2, "square", 0.14));
    }
    if (u.roamPos.y <= surfY) {
      ((u.roamPos.y = surfY), (u.roamAir = !1));
      const impact = -u.roamVy;
      u.roamVy = 0;
      if (impact > 9)
        ((u.cameraShake = Math.max(u.cameraShake, Math.min(0.5, impact / 40))),
          playSfx("land", Math.min(0.62, impact / 42), 1, 0.1) || Pc(Math.min(24, impact * 0.85)),
          (u.roamSuspension += 0.16));
      if (u.stuntActive) {
        const rolls = Math.floor(Math.abs(u.airRoll || 0) / (Math.PI * 2)),
          flipped = u.stuntRamp?.type === "flip" && (u.flipT || 0) >= 0.96;
        let pts = 160 + u.roamAirT * 240 + Math.abs(u.speed) * 1.4 + rolls * 140;
        flipped && (pts *= 1.6);
        u.stuntBullseye && (pts *= 2);
        pts = Math.round(pts);
        const tags = [flipped && "BACKFLIP", rolls > 0 && `ROLL ×${rolls}`, u.stuntBullseye && "BULLSEYE ×2"]
          .filter(Boolean)
          .join(" · ");
        ((u.score += pts),
          (qe.stunts = (qe.stunts || 0) + 1),
          showScorePop(`STUNT +${pts}`),
          tags && ((u.message = tags), (u.messageTimer = 1.4)),
          chime(880, 0.2, "square", 0.12),
          (u.stuntActive = !1),
          (u.flipT = 0),
          (u.airRoll = 0));
      } else if (u.roamAirT > 0.45) {
        const pts = Math.round(40 + u.roamAirT * 70);
        ((u.score += pts), showScorePop(`+${pts} AIR`), chime(760, 0.14));
      }
    }
  }
  u.roamPrevY = u.roamPos.y;
}
const Xn = 2.6;
function waterPhysics(dt, prevSpeed) {
  const prev = u.waterDepth || 0;
  if (u.roamPos.y > He(u.roamPos.x, u.roamPos.z) + 2.5) {
    u.waterDepth = 0;
    return;
  }
  const s = pondDepthAt(u.roamPos.x, u.roamPos.z);
  u.waterDepth = s.depth;
  if (s.depth <= 0.02) return;
  // Pure drag, never a wall: terminal speed at full depth is ~7, so the car can always crawl or reverse out.
  u.speed -= u.speed * (0.85 + 5.2 * s.depth) * s.depth * dt;
  if (prev <= 0.02 && Math.abs(prevSpeed) > 16)
    (waterSplash(u.roamPos.clone(), Math.abs(prevSpeed)),
      waterSplashSound(Math.abs(prevSpeed) / 60),
      (u.cameraShake = Math.max(u.cameraShake, 0.16)),
      (u.message = "SPLASH"),
      (u.messageTimer = 0.7));
  u.wakeT = (u.wakeT ?? 0) - dt;
  if (Math.abs(u.speed) > 5 && u.wakeT <= 0) {
    u.wakeT = 0.15;
    spawnWaterRing(
      u.roamPos.x - Math.sin(u.roamYaw) * 1.5,
      u.roamPos.z + Math.cos(u.roamYaw) * 1.5,
      0.8 + Math.abs(u.speed) * 0.012,
    );
  }
}
function updateNearMisses(i, collided) {
  for (const t of Ri) t.actor && t.actor.nearMissT > 0 && (t.actor.nearMissT -= i);
  if (collided || Math.abs(u.speed) < 32 || u.collisionCooldown > 0) return;
  for (const t of Ri) {
    const n = t.actor;
    if (!n || (n.nearMissT || 0) > 0) continue;
    const s = u.roamPos.x - t.x,
      r = u.roamPos.z - t.z,
      a = (t.hw + t.hd) * 0.5 + Xn + 2.4;
    if (s * s + r * r < a * a && Math.abs(u.roamPos.y - (t.maxY ?? u.roamPos.y)) < 7) {
      ((n.nearMissT = 1.8), (u.score += 45), (u.nearMisses += 1));
      (showScorePop("+45 NEAR MISS"), chime(520, 0.12, "square", 0.07));
      break;
    }
  }
}
function Lo(i, e) {
  let t = !1;
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    if (s.maxY != null && i.y > s.maxY + Wn + 0.45) continue;
    if (s.radius) {
      const f = s.radius + Xn,
        p = i.x - s.x,
        m = i.z - s.z,
        g = p * p + m * m;
      if (g >= f * f) continue;
      t = !0;
      const M = Math.max(1e-4, Math.sqrt(g));
      ((i.x = s.x + (p / M) * f), (i.z = s.z + (m / M) * f));
      continue;
    }
    const r = s.hw + Xn,
      a = s.hd + Xn,
      o = i.x - s.x,
      c = i.z - s.z;
    if (Math.abs(o) >= r || Math.abs(c) >= a) continue;
    t = !0;
    const l = r - Math.abs(o),
      d = a - Math.abs(c);
    l < d ? (i.x = s.x + (o < 0 ? -r : r)) : (i.z = s.z + (c < 0 ? -a : a));
  }
  return t;
}
function Kd(i, e = u.roamPos) {
  if (!i) return;
  const t = (i.crashTimer || 0) <= 0.05;
  ((i.crashTimer = Math.max(i.crashTimer || 0, 1.15 + Math.random() * 0.45)),
    (i.waitTimer = Math.max(i.waitTimer || 0, 0.55)),
    (i.brakePulse = 1));
  const n = i.maxAvoidOffset || di.streetW * 0.3,
    s = i.mesh?.position?.x ?? i.collider?.x ?? i.road,
    r = i.mesh?.position?.z ?? i.collider?.z ?? i.along,
    a = i.axis === "ns" ? (e.x - s >= 0 ? -1 : 1) : e.z - r >= 0 ? -1 : 1;
  ((i.avoidOffset = MathUtils.clamp((i.avoidOffset || 0) + a * n * 0.9, -n, n)),
    t &&
      (qe.trafficCrashes++,
      (i.along -= i.dir * 1.8),
      i.mesh && (i.mesh.rotation.y += a * 0.08),
      u.mode === "roam" &&
        ((u.cameraShake = Math.max(u.cameraShake, 0.32)), (u.message = "TRAFFIC CRASH"), (u.messageTimer = 0.85))));
}
function rv(i) {
  let e = !1;
  for (let t = 0; t < Ri.length; t++) {
    const n = Ri[t];
    if (n.maxY != null && i.y > n.maxY + Wn + 0.45) continue;
    const s = n.hw + Xn,
      r = n.hd + Xn,
      a = i.x - n.x,
      o = i.z - n.z;
    if (Math.abs(a) >= s || Math.abs(o) >= r) continue;
    ((e = !0), Kd(n.actor, i));
    const c = s - Math.abs(a),
      l = r - Math.abs(o);
    c < l ? (i.x = n.x + (a < 0 ? -s : s)) : (i.z = n.z + (o < 0 ? -r : r));
  }
  return e;
}
function av(i, e, t = 0) {
  return e.maxY != null && i.y > e.maxY + Wn + 0.45
    ? !1
    : e.radius
      ? Math.hypot(i.x - e.x, i.z - e.z) < e.radius + t
      : Math.abs(i.x - e.x) < e.hw + t && Math.abs(i.z - e.z) < e.hd + t;
}
function ov(i) {
  ((i.active = !1), (i.respawn = 4.5 + Math.random() * 1.5), (i.mesh.visible = !1), qe.splats++, splatSound());
  const e = Ps.find((t) => !t.visible) || Ps[qe.splats % Math.max(1, Ps.length)];
  e &&
    ((e.visible = !0),
    (e.userData.life = e.userData.maxLife),
    e.position.set(i.x, He(i.x, i.z) + 0.08, i.z),
    (e.rotation.y = 0),
    (e.rotation.z = Math.random() * Math.PI * 2),
    e.scale.setScalar(0.9 + Math.random() * 0.45),
    e.traverse((t) => {
      t.material && (t.material.opacity = 0.72);
    }));
}
function cv(i, e = null) {
  if (e?.kind !== "ground" || Math.abs(u.speed) < 5) return !1;
  let t = !1;
  for (const n of Rr) {
    if (!n.active) continue;
    const s = i.x - n.x,
      r = i.z - n.z,
      a = Xn + n.hitRadius;
    s * s + r * r > a * a || Math.abs(i.y - (He(n.x, n.z) + Wn)) > 3.2 || (ov(n), (t = !0));
  }
  return t;
}
function lv(i, e = null) {
  let t = !1;
  for (let n = 0; n < 2; n++) {
    const s = Lo(i, Mn),
      r = e?.kind === "ground" ? Lo(i, $n) : !1,
      a = Lo(i, Di),
      o = e?.kind === "ground" ? rv(i) : !1;
    if (!s && !r && !a && !o) break;
    t = !0;
  }
  return t;
}
function Jd(i) {
  const e = Fe.lookX * 1.18,
    t = Fe.lookY * 0.58;
  ((u.camLookYaw += (e - u.camLookYaw) * (1 - Math.pow(0.002, i))),
    (u.camLookPitch += (t - u.camLookPitch) * (1 - Math.pow(0.002, i))),
    (u.cameraZoom += (Fe.zoom - u.cameraZoom) * (1 - Math.pow(0.018, i))));
}
function ll(i, e, t = 3.2) {
  let n = 0;
  for (let s = 1; s <= 10; s++) {
    const r = s / 10,
      a = MathUtils.lerp(i.x, e.x, r),
      o = MathUtils.lerp(i.z, e.z, r),
      c = MathUtils.lerp(i.y, e.y, r),
      l = He(a, o) + t;
    l > c && (n = Math.max(n, (l - c) / Math.max(0.08, r)));
  }
  return n;
}
function hv(i, e) {
  const t = He(i, e);
  let n = null;
  const s = qd(i, e);
  s && s.y > t + 4 && (n = s);
  const r = Zd(i, e, 1e3, !0);
  return (r && r.y > t + 4 && (!n || r.y > n.y) && (n = r), n);
}
function Da(i, e, t = 4) {
  let n = 0;
  for (let s = 2; s <= 14; s++) {
    const r = s / 14,
      a = MathUtils.lerp(i.x, e.x, r),
      o = MathUtils.lerp(i.z, e.z, r),
      c = MathUtils.lerp(i.y, e.y, r),
      l = hv(a, o);
    if (!l || i.y < l.y - 10) continue;
    const d = l.y + t - c;
    d > 0 && (n = Math.max(n, d / Math.max(0.16, r)));
  }
  return Math.min(54, n);
}
function Lc() {
  const i = u.camYaw + u.camLookYaw,
    e = Math.sin(i),
    t = -Math.cos(i),
    n = MathUtils.clamp(u.cameraZoom, -0.42, 0.9),
    s = u.roamPos,
    r = {
      x: s.x + e * (12 - Math.min(n, 0) * 6),
      y: s.y + 2.6 + u.camLookPitch * 13.5,
      z: s.z + t * (12 - Math.min(n, 0) * 6),
    };
  ((Xe.position.y += ll(r, Xe.position, 3.4)), (Xe.position.y += Da(r, Xe.position, 4.2)));
}
// Roam camera view: chase (3rd person, default) or hood (1st person). C toggles.
let roamView = localStorage.getItem("steel-ribbon-roam-view") === "hood" ? "hood" : "chase";
function toggleRoamView() {
  ((roamView = roamView === "chase" ? "hood" : "chase"),
    localStorage.setItem("steel-ribbon-roam-view", roamView),
    (u.message = roamView === "hood" ? "First person" : "Third person"),
    (u.messageTimer = 0.9));
}
function roamViewMeshRef() {
  return u.vehicle === "heli" && heli ? heli.mesh : driveMeshRef();
}
function jdHood(i) {
  // rigid first-person hood cam: sits at the windshield, looks down the nose
  const dm = roamViewMeshRef(),
    yaw = u.roamYaw + u.camLookYaw * 0.8,
    t = Math.sin(yaw),
    n = -Math.cos(yaw),
    heliMode = u.vehicle === "heli",
    h = heliMode ? 2.6 : 1.42,
    fwd = heliMode ? 1.2 : 0.85;
  (dm.visible = !1);
  Xe.position.set(u.roamPos.x + t * fwd, u.roamPos.y + h - u.roamSuspension * 0.4, u.roamPos.z + n * fwd);
  if (u.cameraShake > 0.01) {
    const m = u.cameraShake * 0.5;
    ((Xe.position.x += (Math.random() - 0.5) * m), (Xe.position.y += (Math.random() - 0.5) * m * 0.6));
  }
  (Ln.position.copy(Xe.position),
    Ln.lookAt(
      u.roamPos.x + t * 30,
      u.roamPos.y + h + u.camLookPitch * 16 + (u.roamAir ? u.roamVy * 0.06 : 0),
      u.roamPos.z + n * 30,
    ),
    Ln.rotateY(Math.PI),
    Ln.rotateZ((u.roamAir && u.stuntActive ? u.airRoll || 0 : 0) - u.wheelSteer * 0.05),
    Xe.quaternion.slerp(Ln.quaternion, 1 - Math.pow(0.001, i)));
  const p = 76 + Math.min(14, Math.abs(u.speed) * 0.08);
  (Math.abs(Xe.fov - p) > 0.02 && ((Xe.fov += (p - Xe.fov) * (1 - Math.pow(0.01, i))), Xe.updateProjectionMatrix()),
    (u.cameraShake = Math.max(0, u.cameraShake - i * 2.4)),
    (u.collisionDrama = Math.max(0, u.collisionDrama - i * 1.8)));
}
function jd(i) {
  if (window.__freeCam) return;
  if ((Jd(i), Math.abs(u.speed) > Ac)) {
    let m = u.roamYaw - u.camYaw;
    ((m = Math.atan2(Math.sin(m), Math.cos(m))), (u.camYaw += m * (1 - Math.pow(0.08, i))));
  }
  if (roamView === "hood" && u.vehicle !== "foot") {
    jdHood(i);
    return;
  }
  const dmv = roamViewMeshRef();
  dmv.visible || (dmv.visible = !0);
  const e = u.camYaw + u.camLookYaw,
    t = Math.sin(e),
    n = -Math.cos(e),
    s = u.roamPos,
    r = MathUtils.clamp(u.cameraZoom, -0.42, 0.9),
    a = MathUtils.clamp(Math.abs(u.speed) / 135, 0, 1),
    vm = u.vehicle === "foot" ? { d: 0.42, h: 0.5 } : u.vehicle === "heli" ? { d: 1.55, h: 1.4 } : { d: 1, h: 1 },
    o = (17 + Math.abs(u.speed) * 0.11 + u.roamSlip * 3) * (1 + r * 0.72) * vm.d,
    c = (7.2 + a * 2.1 + Math.max(0, r) * 4.4 - Math.min(0, r) * 2 + u.camLookPitch * 5.8) * vm.h,
    l = Id.set(s.x - t * o, s.y + c, s.z - n * o);
  if (u.cameraShake > 0.01 || u.collisionDrama > 0.01) {
    const m = u.cameraShake + u.collisionDrama * 0.42;
    ((l.x += (Math.random() - 0.5) * m * 1.2),
      (l.y += (Math.random() - 0.5) * m * 0.75),
      (l.z += (Math.random() - 0.5) * m * 1.2));
  }
  const d = rl.set(
    s.x + t * (13 + a * 8 - Math.min(r, 0) * 6),
    s.y + 2.45 + u.camLookPitch * 13.5,
    s.z + n * (13 + a * 8 - Math.min(r, 0) * 6),
  );
  ((l.y = Math.max(l.y, He(l.x, l.z) + 3.5)), (l.y += ll(d, l, 3.4)), (l.y += Da(d, l, 4.2)));
  const f = u.roamSlip > 0.35 ? 0.006 : 0.0026;
  (Xe.position.lerp(l, 1 - Math.pow(f, i)),
    (Xe.position.y += Da(d, Xe.position, 3.8) * 0.72),
    Ln.position.copy(Xe.position),
    Ln.lookAt(d),
    Ln.rotateY(Math.PI),
    Ln.rotateZ(-u.wheelSteer * a * 0.18 + u.roamSlip * Math.sign(u.wheelSteer || 1) * 0.05),
    Xe.quaternion.slerp(Ln.quaternion, 1 - Math.pow(0.05, i)));
  const p = 69 + Math.min(13, Math.abs(u.speed) * 0.075) + u.roamSlip * 2.5 + r * 10;
  (Math.abs(Xe.fov - p) > 0.02 && ((Xe.fov += (p - Xe.fov) * (1 - Math.pow(0.01, i))), Xe.updateProjectionMatrix()),
    (u.cameraShake = Math.max(0, u.cameraShake - i * 2.4)),
    (u.collisionDrama = Math.max(0, u.collisionDrama - i * 1.8)));
}
function Qd(i, placement = null) {
  if (u.mode === "result") return;
  u.mode = "result";
  const e = Math.max(0, Math.round(u.score - u.damage * 9 + Math.max(0, 220 - u.time) * 45));
  (e > u.best && ((u.best = e), localStorage.setItem("steel-ribbon-best", String(e))),
    (Qe.best.textContent = `Best score ${u.best}`),
    (Qe.resultText.textContent = `${i} Score ${e}. Time ${Dc(u.time)}. Damage ${Math.round(u.damage)}%.`));
  const t = Number.isFinite(u.bestLap) ? Dc(u.bestLap) : "--:--.-";
  let seasonHtml = "";
  if (u.seasonRace && season?.active && placement) {
    // Points by finishing order: player metric is totalDistance, rivals theirs.
    const order = [
      { key: "you", metric: u.totalDistance + 0.001 },
      ...rivals.map((r) => ({ key: r.key, metric: r.distance })),
    ].sort((a, b) => b.metric - a.metric);
    order.forEach((o, k) => (season.points[o.key] += SEASON_PTS[k] ?? 0));
    season.raceIndex++;
    const done = season.raceIndex >= 4,
      rows = seasonStandings();
    if (done) {
      season.active = !1;
      const champ = rows[0].key === "you";
      if (champ && season.division > 1) {
        localStorage.setItem("steel-ribbon-division", String(season.division - 1));
        seasonHtml += `<b>🏆 CHAMPION — promoted to Division ${divisionName(season.division - 1)}!</b>`;
      } else seasonHtml += champ ? "<b>🏆 Season champion!</b>" : `<b>Season over — ${rows[0].label} takes the title.</b>`;
    }
    (saveSeason(),
      (seasonHtml =
        `<span>Season — after race ${season.raceIndex}/4</span>` +
        rows.map((r, k) => `<b>${k + 1}. ${r.label} — ${r.pts} pts</b>`).join("") +
        seasonHtml),
      (Qe.againBtn.textContent = season.active ? "Next Race" : "Back to Menu"));
  } else Qe.againBtn.textContent = "Race Again";
  ((Qe.resultStats.innerHTML = `
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${u.cleanLandings}</b>
    <b>Hard landings: ${u.hardLandings}</b>
    <b>Recoveries: ${u.recoveries}</b>
    <b>Near edges: ${Math.round(u.nearMisses)}</b>
    ${seasonHtml}
  `),
    refreshSeasonUI(),
    Number.isFinite(u.bestLap) && u.bestLap > 3 && submitScore("lap", Math.round(1e6 / u.bestLap), {
      time: +u.bestLap.toFixed(2),
      course: ce.name,
      car: CAR_MODELS[carModelIndex]?.label || "",
    }),
    Qe.result.classList.remove("hidden"));
}
function Uh(i = "Craned back to the ribbon") {
  const e = St(u.lastSafeS);
  ((u.s = u.lastSafeS),
    (u.totalDistance = u.lastSafeDistance),
    (u.lateral = 0),
    (u.lateralVel = 0),
    (u.y = e.p.y + 2.1),
    (u.yVel = 0),
    (u.speed = Math.max(16, u.speed * 0.32)),
    (u.grounded = !0),
    (u.cameraShake = 1.2),
    (u.message = i),
    (u.messageTimer = 1.4),
    (u.recoveries += 1));
}
function hl(i, e) {
  return MathUtils.clamp(e * i.tangent.y, -48, 48);
}
function dv(i = 94) {
  return ce.gaps.map((e) => {
    const t = St(e.start),
      n = St(e.end + 3),
      s = (e.end - e.start) / Math.max(1, i),
      r = hl(t, i),
      a = t.p.y + 2.1 + r * s - 0.5 * 31 * s * s,
      o = n.p.y + 2.1;
    return {
      name: e.name,
      start: e.start,
      end: e.end,
      length: e.end - e.start,
      lipGradeDeg: Math.round(MathUtils.radToDeg(t.grade) * 10) / 10,
      launchYVel: Math.round(r * 10) / 10,
      projectedClearance: Math.round((a - o) * 10) / 10,
    };
  });
}
function Fh(i, e) {
  ((u.grounded = !1), (u.yVel = hl(i, u.speed)), (u.airtime = 0), e && (u.message = e));
}
window.__steelRibbonDebug = {
  launchVelocityAt(i, e) {
    return hl(St(i), e);
  },
  gapJumpReport(i) {
    return dv(i);
  },
  sceneryClearanceReport() {
    return C1();
  },
  setSpeed(i) {
    return ((u.speed = MathUtils.clamp(i, -14, 156 - u.damage * 0.42)), vr(), u.speed);
  },
  setTrackPosition(i, e = u.speed, t = 0) {
    const n = St(i);
    return (
      (u.totalDistance = i),
      (u.s = n.s),
      (u.lastSafeS = n.s),
      (u.lastSafeDistance = i),
      (u.lateral = MathUtils.clamp(t, -ce.width * 0.48, ce.width * 0.48)),
      (u.lateralVel = 0),
      (u.y = n.p.y + 2.1),
      (u.yVel = 0),
      (u.grounded = !0),
      (u.speed = MathUtils.clamp(e, -14, 156 - u.damage * 0.42)),
      vr(),
      { s: u.s, totalDistance: u.totalDistance, speed: u.speed, lateral: u.lateral, y: u.y }
    );
  },
  setDamage(i) {
    return ((u.damage = MathUtils.clamp(i, 0, 99)), vr(), u.damage);
  },
  setCourse(i) {
    return cl(i);
  },
  flyCam(i, e, t, n, s, r) {
    return (
      (window.__freeCam = !0),
      Xe.position.set(i, e, t),
      Xe.lookAt(n, s, r),
      (Xe.fov = 62),
      Xe.updateProjectionMatrix(),
      "freecam"
    );
  },
  listBoostPads() {
    return boostPads.map((i) => ({ s: i.s, lat: +i.lat.toFixed(2) }));
  },
  listPonds() {
    return ponds.map((i) => ({
      x: +i.x.toFixed(1),
      z: +i.z.toFixed(1),
      rx: +i.rx.toFixed(1),
      rz: +i.rz.toFixed(1),
      waterY: i.waterY == null ? null : +i.waterY.toFixed(2),
    }));
  },
  waterAt(x, z) {
    return { depth: +pondDepthAt(x, z).depth.toFixed(3), ground: +He(x, z).toFixed(2) };
  },
  activeGate() {
    const g = nn[u.objectiveIndex % nn.length];
    return g ? { x: +g.x.toFixed(1), y: +g.y.toFixed(1), z: +g.z.toFixed(1), label: g.label } : null;
  },
  seasonInfo() {
    return {
      season,
      division: seasonDivision(),
      position: racePosition(),
      seasonRace: !!u.seasonRace,
      rivals: rivals.map((r) => ({ key: r.key, d: +r.distance.toFixed(1), finished: +r.finished.toFixed(1) })),
    };
  },
  resetSeason() {
    return (localStorage.removeItem("steel-ribbon-season"), localStorage.removeItem("steel-ribbon-division"), (season = null), refreshSeasonUI(), "reset");
  },
  renderInfo() {
    return {
      calls: qe.renderCalls || 0,
      triangles: qe.renderTris || 0,
      geometries: Qt.info.memory.geometries,
      textures: Qt.info.memory.textures,
      mobilePerf,
      staticMerge: qe.staticMerge || null,
    };
  },
  drawAudit(top = 20) {
    const tally = new Map();
    et.traverse((o) => {
      if (!o.visible || (!o.isMesh && !o.isSprite && !o.isLine && !o.isPoints)) return;
      const p = o.geometry?.parameters,
        sig = p
          ? Object.values(p)
              .filter((v) => typeof v === "number")
              .map((v) => +v.toFixed(2))
              .join("x")
          : `verts${o.geometry?.attributes?.position?.count ?? "?"}`,
        key = `${o.geometry?.type || o.type}(${sig})${o.isInstancedMesh ? `[inst ${o.count}]` : ""}`;
      tally.set(key, (tally.get(key) || 0) + 1);
    });
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, top);
  },
  trafficInfo() {
    const m = Ri[0]?.actor?.mesh;
    return { colliders: Ri.length, wheels: m?.userData?.wheels?.length ?? 0, pedestrians: qe.pedestrians || 0 };
  },
  nearestTrafficCar(x, z) {
    let best = null;
    for (const r of Ri) {
      const a = r.actor;
      if (!a || !a.type || a.stolen) continue;
      const d = Math.hypot(x - r.x, z - r.z);
      (!best || d < best.d) && (best = { x: +r.x.toFixed(1), z: +r.z.toFixed(1), type: a.type, d: +d.toFixed(1) });
    }
    return best;
  },
  audioInfo() {
    return mi
      ? {
          state: mi.ctx.state,
          master: +mi.master.gain.value.toFixed(2),
          engine: !!mi.rumble && !!mi.growl && !!mi.whine,
          fx: !!mi.wind && !!mi.skid && !!mi.boost,
          music: !!mi.musicGain,
          beat: mi.beat,
          samples: Object.keys(sfx.buffers).length,
          sampleLoops: Object.keys(sfx.loops),
          musicSample: !!sfx.buffers.music,
          musicOn: localStorage.getItem("steel-ribbon-music") !== "0",
          engineProfile: engineProfileKey(),
          engineV2: !!mi.growlB && !!mi.burble,
        }
      : null;
  },
  colliderAudit() {
    // Flag any static collider whose footprint pokes into a driveable road corridor at ground level.
    // A collider blocks ground driving unless its maxY says the car passes underneath it.
    const roadsX = [],
      roadsZ = [],
      halfW = di.streetW * 0.5;
    for (let x = di.x0; x <= di.x1 + 1; x += di.pitch) roadsX.push(Math.round(x));
    for (let z = di.zNear; z >= di.zFar - 1; z -= di.pitch) roadsZ.push(Math.round(z));
    const findings = [];
    const checkOne = (arrName, idx, c) => {
      const rx2 = c.radius != null ? c.radius : (c.hw ?? 0),
        rz2 = c.radius != null ? c.radius : (c.hd ?? 0),
        ground = He(c.x, c.z);
      // car clears underneath when collider bottom is elevated: Lo skips if carY > maxY + 0.55 + 0.45
      if (c.maxY != null && c.maxY < ground + 1.05) return;
      for (const rx of roadsX)
        if (Math.abs(c.x - rx) < halfW + rx2 + Xn && c.z < di.zNear + rz2 && c.z > di.zFar - rz2)
          findings.push({ arr: arrName, idx, kind: c.kind ?? "box", x: +c.x.toFixed(1), z: +c.z.toFixed(1), r: +Math.max(rx2, rz2).toFixed(1), road: `x=${rx}`, overlap: +(halfW + rx2 + Xn - Math.abs(c.x - rx)).toFixed(1) });
      for (const rz of roadsZ)
        if (Math.abs(c.z - rz) < halfW + rz2 + Xn && c.x < di.x1 + rx2 && c.x > di.x0 - rx2)
          findings.push({ arr: arrName, idx, kind: c.kind ?? "box", x: +c.x.toFixed(1), z: +c.z.toFixed(1), r: +Math.max(rx2, rz2).toFixed(1), road: `z=${rz}`, overlap: +(halfW + rz2 + Xn - Math.abs(c.z - rz)).toFixed(1) });
    };
    (Mn.forEach((c, i) => checkOne("Mn", i, c)),
      Di.forEach((c, i) => checkOne("Di", i, c)),
      $n.forEach((c, i) => checkOne("$n", i, c)));
    return { total: Mn.length + Di.length + $n.length, blockers: findings };
  },
  setVehicle(v) {
    if (u.mode !== "roam") Yd();
    if (v === "foot") u.vehicle === "car" ? exitCar(!0) : u.vehicle === "heli" && exitHeli();
    else if (v === "heli" && heli) {
      u.vehicle === "car" && exitCar(!0);
      (u.roamPos.set(heli.pos.x + 3, He(heli.pos.x + 3, heli.pos.z), heli.pos.z), enterHeli());
    } else if (v === "car") {
      u.vehicle === "heli" && ((heli.pos.y = He(heli.pos.x, heli.pos.z) + 1.1), heli.vel.set(0, 0, 0), exitHeli());
      u.vehicle === "foot" && (u.roamPos.copy(parkedCarPos), enterCar());
    }
    return u.vehicle;
  },
  vehicleInfo() {
    return {
      vehicle: u.vehicle || "car",
      walkerVisible: walker.visible,
      heli: heli
        ? {
            x: +heli.pos.x.toFixed(1),
            y: +heli.pos.y.toFixed(1),
            z: +heli.pos.z.toFixed(1),
            rpm: +heli.rpm.toFixed(2),
            scale: +heli.mesh.scale.x.toFixed(2),
            pad: heli.pad ? { x: +heli.pad.x.toFixed(1), z: +heli.pad.z.toFixed(1) } : null,
          }
        : null,
      parkedCar: { x: +parkedCarPos.x.toFixed(1), z: +parkedCarPos.z.toFixed(1) },
      drivingStolen: !!u.drivingStolen,
      stolen: stolenRide
        ? {
            type: stolenRide.type,
            fromTraffic: !!stolenRide.actor,
            pos: {
              x: +stolenRide.mesh.position.x.toFixed(1),
              y: +stolenRide.mesh.position.y.toFixed(2),
              z: +stolenRide.mesh.position.z.toFixed(1),
            },
            visible: stolenRide.mesh.visible,
            inScene: stolenRide.mesh.parent === et,
            parked: stolenRide.parked
              ? { x: +stolenRide.parked.x.toFixed(1), z: +stolenRide.parked.z.toFixed(1) }
              : null,
          }
        : null,
      parkedSpots: rideSys.spots.length,
    };
  },
  stealNearest() {
    return u.mode === "roam" && u.vehicle === "foot" ? tryStealNearby() : !1;
  },
  setHeat(n) {
    return (u.mode === "roam" && (u.heat = MathUtils.clamp(n, 0, 5)), u.heat || 0);
  },
  policeInfo() {
    return {
      heat: +(u.heat || 0).toFixed(2),
      cars: police.cars.map((c) => ({ x: +c.x.toFixed(1), z: +c.z.toFixed(1), speed: +c.speed.toFixed(1) })),
      nearest: police.nearest === 1 / 0 ? null : +police.nearest.toFixed(1),
      evadeT: +police.evadeT.toFixed(1),
      bustT: +police.bustT.toFixed(2),
      blocks: police.blocks.map((b) => ({ x: +b.x.toFixed(1), z: +b.z.toFixed(1), age: +b.age.toFixed(1) })),
      busts: qe.busts || 0,
    };
  },
  policeTeleportNearest(x, z) {
    const c = police.cars[0];
    return c ? ((c.x = x), (c.z = z), !0) : !1;
  },
  jobInfo() {
    return {
      state: jobSys.state,
      type: jobSys.type,
      timeLeft: +jobSys.timeLeft.toFixed(1),
      pickup: jobSys.pickup ? { x: +jobSys.pickup.x.toFixed(1), z: +jobSys.pickup.z.toFixed(1) } : null,
      dest: jobSys.dest ? { x: +jobSys.dest.x.toFixed(1), z: +jobSys.dest.z.toFixed(1) } : null,
      deliveries: qe.deliveries || 0,
      fails: qe.deliveryFails || 0,
    };
  },
  jobSpawnNow() {
    return (jobSys.state === "idle" && ((jobSys.cooldown = 0), spawnJob()), jobSys.state);
  },
  setWeather(mode) {
    return (
      (mode === "rain" || mode === "clear") &&
        mode !== weatherMode &&
        (cycleWeather(), localStorage.setItem("steel-ribbon-weather", weatherMode)),
      weatherMode
    );
  },
  weatherInfo() {
    return { mode: weatherMode, amt: +weatherWet().toFixed(2), roadRoughness: +(todRefs.roadMat?.roughness ?? -1).toFixed(2) };
  },
  panickedTraffic() {
    let n = 0;
    for (const r of Ri) r.actor?.panicT > 0 && n++;
    return n;
  },
  mpInfo() {
    return {
      connected: mp.connected,
      room: mp.room,
      id: mp.id,
      peers: [...mp.peers.values()].map((p) => ({ name: p.name, has: p.has, x: +(p.tx || 0).toFixed(1), z: +(p.tz || 0).toFixed(1) })),
    };
  },
  mpJoin(room, name) {
    const r = document.querySelector("#mpRoom"),
      n = document.querySelector("#mpName");
    (r && (r.value = room), n && (n.value = name), mpConnect());
    return mp.room;
  },
  mpLeave() {
    mpDisconnect(!0);
    return !mp.connected;
  },
  boardsInfo() {
    return fetchBoard(boardMode).then((rows) => ({ mode: boardMode, rows: rows ? rows.length : null, ok: rows !== null }));
  },
  gamepadInfo() {
    return { active: pad.active };
  },
  setTod(mode) {
    return (
      TOD_MODES.includes(mode) && ((todMode = mode), localStorage.setItem("steel-ribbon-tod", mode), refreshTodLabel()),
      todMode
    );
  },
  todInfo() {
    return { mode: todMode, day: +todDay.toFixed(3), night: +todNight.toFixed(3) };
  },
  listStuntRamps() {
    return (stuntRamps || []).map((r) => ({
      x: +r.x.toFixed(1),
      z: +r.z.toFixed(1),
      yaw: +r.yaw.toFixed(2),
      len: r.len,
      h: r.h,
      type: r.type,
      hoop: r.hoop ? { x: +r.hoop.x.toFixed(1), y: +r.hoop.y.toFixed(1), z: +r.hoop.z.toFixed(1), r: r.hoop.r } : null,
    }));
  },
  parkedKitEnable(on) {
    parkedKitSys.enabled = !!on;
    return parkedKitSys.enabled;
  },
  ambientEnable(on) {
    ambientSys.enabled = !!on;
    return ambientSys.enabled;
  },
  rooftopEnable(on) {
    rooftopSys.enabled = !!on;
    return rooftopSys.enabled;
  },
  roadsideEnable(on) {
    roadsideSys.enabled = !!on;
    return roadsideSys.enabled;
  },
  facadeEnable(on) {
    facadeSys.enabled = !!on;
    return facadeSys.enabled;
  },
  roadDecalEnable(on) {
    roadDecalSys.enabled = !!on;
    return roadDecalSys.enabled;
  },
  newsEnable(on) {
    newsSys.enabled = !!on;
    return newsSys.enabled;
  },
  signalLampsEnable(on) {
    signalLampSys.enabled = on !== !1;
    return signalLampSys.enabled;
  },
  parksEnable(on) {
    parkSys.enabled = !!on;
    for (const m of parkSys._vis) m.visible = parkSys.enabled;
    return parkSys.enabled;
  },
  paddockEnable(on) {
    paddockSys.enabled = !!on;
    paddockSys._mesh && (paddockSys._mesh.visible = paddockSys.enabled);
    return paddockSys.enabled;
  },
  raceWearEnable(on) {
    raceWearSys.enabled = !!on;
    raceWearSys._mesh && (raceWearSys._mesh.visible = raceWearSys.enabled);
    return raceWearSys.enabled;
  },
  lawnEnable(on) {
    lawnSys.enabled = !!on;
    if (lawnSys.mat) ((lawnSys.mat.vertexColors = lawnSys.enabled), (lawnSys.mat.needsUpdate = !0));
    return lawnSys.enabled;
  },
  windowTexHD(on) {
    if (!towerTexSys.mats) return null;
    const hd = on === !1 ? 1 : 2;
    if (hd !== towerTexSys.hd) {
      towerTexSys.hd = hd;
      towerTexSys.mats.forEach((m, k) => {
        const a = towerTexSys.args[k],
          tex = As(a[0], a[1], a[2], hd);
        (m.map && m.map.dispose(), (m.map = tex), (m.emissiveMap = tex), (m.needsUpdate = !0));
      });
    }
    return { hd: towerTexSys.hd, size: towerTexSys.mats[0].map.image.width };
  },
  signalHeadStates() {
    const heads = signalLampSys.headsRef || [];
    return {
      heads: heads.length,
      enabled: signalLampSys.enabled,
      states: { ...signalLampSys.states },
      sample: heads.slice(0, 6).map(($) => ({ axis: $.axis, st: $._st })),
    };
  },
  __nearestTraffic(skipBus) {
    let best = null;
    for (const a of Rc) {
      if (!a.mesh || !a.mesh.visible) continue;
      if (skipBus && a.mesh.userData.bus) continue;
      const d = Math.hypot(a.mesh.position.x - Xe.position.x, a.mesh.position.z - Xe.position.z);
      (!best || d < best.d) && (best = { d: +d.toFixed(1), x: +a.mesh.position.x.toFixed(1), z: +a.mesh.position.z.toFixed(1), type: a.type });
    }
    return best;
  },
  camWorld() {
    return { x: +Xe.position.x.toFixed(1), y: +Xe.position.y.toFixed(1), z: +Xe.position.z.toFixed(1) };
  },
  __BasicMat: MeshBasicMaterial,
  parkedKitDump() {
    if (!parkedKitSys.kits) return null;
    const v = new Vector3();
    return parkedKitSys.kits.map((k) => ({
      idx: k.idx,
      visible: k.g.visible,
      pos: { x: +k.g.position.x.toFixed(2), y: +k.g.position.y.toFixed(2), z: +k.g.position.z.toFixed(2) },
      kids: k.g.children.map((o, i) => {
        o.getWorldPosition(v);
        return { i, type: o.type, vis: o.visible, x: +v.x.toFixed(2), y: +v.y.toFixed(2), z: +v.z.toFixed(2) };
      }),
    }));
  },
  nearestParkedSpot(x, z) {
    let best = null;
    for (const s of rideSys.spots) {
      if (s.taken) continue;
      const d = Math.hypot(x - s.x, z - s.z);
      (!best || d < best.d) && (best = { x: s.x, z: s.z, d: +d.toFixed(1) });
    }
    return best;
  },
  setRoamPos(i, e, t = 0, n = 0) {
    return (
      u.mode !== "roam" && Yd(),
      u.roamPos.set(i, He(i, e) + Wn, e),
      (u.roamYaw = t),
      (u.camYaw = t),
      (u.speed = n),
      zs(),
      { x: u.roamPos.x, y: +u.roamPos.y.toFixed(2), z: u.roamPos.z }
    );
  },
  sceneryCounters() {
    return {
      ...Qi,
      boostPads: boostPads.length,
      gapBeacons: gapBeaconMats.length,
      railRuns: qe.railRuns || 0,
      railPosts: qe.railPosts || 0,
      ponds: ponds.length,
      cityPonds: qe.ponds || 0,
      cloudSprites: qe.cloudSprites || 0,
      helipad: qe.helipad || null,
      stuntRamps: qe.stuntRamps || 0,
      propPlanes: qe.propPlanes || 0,
    };
  },
  stats() {
    return { trafficCrashes: qe.trafficCrashes, splats: qe.splats, roamPos: { x: +u.roamPos.x.toFixed(1), y: +u.roamPos.y.toFixed(1), z: +u.roamPos.z.toFixed(1) }, speed: +u.speed.toFixed(2), cooldown: +u.collisionCooldown.toFixed(2) };
  },
  spawnBirds(x, z) {
    return (birdSys.spawn(x, z), { active: birdSys.active, count: birdSys.birds.length });
  },
  detailReport() {
    return {
      plates: plateSys.mesh
        ? {
            atlasSlots: 64,
            traffic: plateSys.dynamics.length,
            parked: plateSys.statics.length,
            uniqueTexts: new Set(plateSys.texts).size,
            sample: plateSys.texts.slice(0, 5),
          }
        : null,
      drivers: {
        cars: Rc.length,
        withDriver: Rc.reduce((n, c) => n + (c.mesh?.userData?.hasDriver ? 1 : 0), 0),
      },
      taxis: {
        count: Rc.reduce((n, c) => n + (c.type === "taxi" ? 1 : 0), 0),
        signed: taxiSignSys.count(),
      },
      storefronts: {
        spots: storefrontSys.spots.length,
        dressed: storefrontSys.dressedCount(),
        pool: storefrontSys.pool,
        sample: storefrontSys.spots.slice(0, 2).map((s) => ({ x: +s.x.toFixed(1), y: +s.y.toFixed(1), z: +s.z.toFixed(1), yaw: +s.yaw.toFixed(2), w: +s.w.toFixed(1) })),
      },
      furniture: { ...furnitureSys.counts, sample: furnitureSys.sample.slice(0, 4) },
      streetSigns: { poles: streetSignSys.poles, blades: streetSignSys.blades, sample: streetSignSys.sample.slice(0, 3) },
      pedSignals: { count: pedSignalMeta.count, walking: qe.pedWalkFaces ?? 0, sample: pedSignalMeta.sample.slice(0, 2) },
      signalHeads: { heads: signalLampSys.heads, enabled: signalLampSys.enabled, states: { ...signalLampSys.states } },
      parks: { cells: parkSys.cells, trees: parkSys.trees, benches: parkSys.benches, beds: parkSys.beds, pitches: parkSys.pitches, pathTris: parkSys.pathTris, enabled: parkSys.enabled, rej: parkSys._rej ?? null, furn: (parkSys._furnSample ?? []).slice(0, 4), sample: parkSys.sample.slice(0, 3) },
      paddock: { clusters: paddockSys.clusters, parts: paddockSys.parts, enabled: paddockSys.enabled, sample: paddockSys.sample.slice(0, 4) },
      raceWear: { segs: raceWearSys.segs, patches: raceWearSys.patches, enabled: raceWearSys.enabled },
      lawn: { striped: lawnSys.striped, enabled: lawnSys.enabled },
      birds: { active: birdSys.active, state: birdSys.state, count: birdSys.birds.length, spot: { x: +birdSys.spot.x.toFixed(1), z: +birdSys.spot.z.toFixed(1) } },
      steam: { spots: steamSys.spots.length, active: steamSys.active, sample: steamSys.spots.slice(0, 2) },
      parked: {
        spots: rideSys.spots.length,
        promoted: parkedKitSys.promoted,
        racks: parkedKitSys.racks,
        grime: parkedKitSys.grimeN,
        dents: parkedKitSys.dents,
        antennas: parkedKitSys.antennas,
        radius: parkedKitSys.RADIUS,
        glassVerts: parkedKitSys._glassGeo ? parkedKitSys._glassGeo.attributes.position.count : 0,
        lampVerts: parkedKitSys._lampGeo ? parkedKitSys._lampGeo.attributes.position.count : 0,
        sample: parkedKitSys.sample.slice(0, 3),
      },
      news: {
        spots: newsSys.spots.length,
        promoted: newsSys.promoted,
        pool: newsSys.kits ? newsSys.kits.length : 0,
        sample: newsSys.sample.slice(0, 2),
        stations: newsSys.spots.slice(0, 2).map((sp) => ({ i: sp.i, x: sp.x, z: sp.z })),
      },
      roadDecals: {
        spots: roadDecalSys.spots.length,
        placed: roadDecalSys.placed,
        visible: roadDecalSys.mesh ? roadDecalSys.mesh.visible : !1,
        sample: roadDecalSys.sample.slice(0, 3),
        stations: [0, 1, 2, 3].map((v) => roadDecalSys.spots.find((s2) => s2.v === v)).filter(Boolean).map((s2) => ({ i: s2.i, x: s2.x, z: s2.z, v: s2.v })),
      },
      facades: {
        eligible: rooftopSys.spots.reduce((n, sp) => n + (Math.min(sp.w, sp.d) >= 12 ? 1 : 0), 0),
        promoted: facadeSys.promoted,
        pool: facadeSys.kits ? facadeSys.kits.length : 0,
        radius: facadeSys.RADIUS,
        sample: facadeSys.sample.slice(0, 3),
      },
      livery: {
        rivals: rivals.map((r) => ({ key: r.key, n: r.mesh.userData.liveryN ?? 0, x: +r.mesh.position.x.toFixed(1), y: +r.mesh.position.y.toFixed(1), z: +r.mesh.position.z.toFixed(1), visible: r.mesh.visible })),
        player: cn.userData.liveryN ?? 0,
      },
      roadside: {
        spots: roadsideSys.spots.length,
        promoted: roadsideSys.promoted,
        pool: roadsideSys.kits ? roadsideSys.kits.length : 0,
        radius: roadsideSys.RADIUS,
        sample: roadsideSys.sample.slice(0, 3),
        stations: roadsideSys.spots.slice(0, 3).map((s) => ({ i: s.i, x: +s.x.toFixed(1), y: +s.y.toFixed(1), z: +s.z.toFixed(1), v: s.v })),
      },
      rooftops: {
        spots: rooftopSys.spots.length,
        promoted: rooftopSys.promoted,
        pool: rooftopSys.kits ? rooftopSys.kits.length : 0,
        radius: rooftopSys.RADIUS,
        pigeons: rooftopSys.PIGEONS,
        multi: rooftopSys.multi ?? 0,
        sample: rooftopSys.sample.slice(0, 3),
        tall: rooftopSys.spots
          .slice()
          .sort((a, b) => b.top - a.top)
          .slice(0, 5)
          .map((s) => ({ x: +s.x.toFixed(1), z: +s.z.toFixed(1), top: +s.top.toFixed(1), w: +s.w.toFixed(0) })),
      },
      planes: {
        count: propPlaneMeta.length,
        regs: propPlaneMeta.map((m) => m.reg ?? null),
        banners: propPlaneMeta.map((p) => p.text),
        sample: propPlaneMeta.slice(0, 4).map((p) => ({ x: +p.plane.position.x.toFixed(1), y: +p.plane.position.y.toFixed(1), z: +p.plane.position.z.toFixed(1), text: p.text })),
      },
      ambient: {
        ready: !!ambientSys.nodes,
        ctxState: ambientSys.nodes ? ambientSys.nodes.ctx.state : null,
        enabled: ambientSys.enabled,
        signals: ambientSys.signals ? ambientSys.signals.length : 0,
        ticksActive: ambientSys.ticksActive,
        tickCount: ambientSys.tickCount,
        chirpCount: ambientSys.chirpCount,
        levels: { ...ambientSys.levels },
      },
      crowd: {
        stands: crowdSys.stands.length,
        promoted: crowdSys.active >= 0 ? 1 : 0,
        figures: crowdSys.active >= 0 ? crowdSys.figures : 0,
        sample: crowdSys.stands.slice(0, 2).map((s) => ({ x: +s.x.toFixed(1), z: +s.z.toFixed(1), gy: +s.gy.toFixed(1), w: +s.w.toFixed(0) })),
      },
      peds: {
        pool: pedKitSys.pool,
        promoted: pedKitSys.promotedCount(),
        texting: (pedKitSys.kits || []).reduce((n, k) => n + (k.ped && k.texting ? 1 : 0), 0),
        bags: (pedKitSys.kits || []).reduce((n, k) => n + (k.ped && k.prop === "bag" ? 1 : 0), 0),
        cups: (pedKitSys.kits || []).reduce((n, k) => n + (k.ped && k.prop === "cup" ? 1 : 0), 0),
        dogs: (pedKitSys.kits || []).reduce((n, k) => n + (k.ped && k.prop === "dog" ? 1 : 0), 0),
        radius: PED_KIT_RADIUS,
        sample: (pedKitSys.kits || [])
          .filter((k) => k.ped)
          .slice(0, 3)
          .map((k) => {
            const o = { x: +k.ped.x.toFixed(1), y: +k.ped.mesh.position.y.toFixed(2), z: +k.ped.z.toFixed(1), axis: k.ped.axis, dir: k.ped.dir, t: k.texting ? 1 : 0, p: k.prop, tilt: +k.face.rotation.x.toFixed(2) };
            if (k.texting) {
              const pv = k.phone.getWorldPosition(new Vector3());
              o.phone = { x: +pv.x.toFixed(2), y: +pv.y.toFixed(2), z: +pv.z.toFixed(2) };
            }
            return o;
          }),
      },
    };
  },
  viewInfo() {
    const i = St(u.s),
      e = u.y - 2.1;
    return {
      trackView: trackViewMode,
      mode: u.mode,
      carVisible: cn.visible,
      cockpitVisible: !!(qn && qn.visible),
      camY: +Xe.position.y.toFixed(2),
      deckY: +(i.p.y + 0.58).toFixed(2),
      carY: +u.y.toFixed(2),
      ghostRecLen: u.ghostRec?.length ?? -1,
      ghostLoaded: !!ghostData,
      overheadY: +overheadDeckY(Xe.position.x, Xe.position.z, e + 5, e + 64).toFixed(2),
    };
  },
  setTrackView(i) {
    return ((trackViewMode = i === "cockpit" ? "cockpit" : "chase"), applyTrackViewClass(), trackViewMode);
  },
  listCourses() {
    return is.map((i, e) => ({
      index: e,
      name: i.name,
      length: i.length,
      width: i.width,
      laps: i.laps,
      gaps: i.gaps.length,
    }));
  },
  courseInfo() {
    return { index: Ma, name: ce.name, length: ce.length, width: ce.width, laps: ce.laps };
  },
  probeDown(i, e) {
    const t = new Raycaster(new Vector3(i, 400, e), new Vector3(0, -1, 0), 0, 1e3);
    t.camera = Xe;
    const n = t
        .intersectObjects(et.children, !0)
        .map((r) => ({
          y: +r.point.y.toFixed(2),
          name: r.object.material?.color ? "#" + r.object.material.color.getHexString() : "?",
        })),
      s = Ki(i, e, 400);
    return {
      x: i,
      z: e,
      ground: +He(i, e).toFixed(2),
      surface: s.kind,
      surfaceY: +s.y.toFixed(2),
      hits: n.slice(0, 5),
    };
  },
  rampSurfaceReport() {
    return Dr.map((i, e) => {
      const t = i.points[0],
        n = i.points[i.points.length - 1],
        s = i.points[(i.points.length / 2) | 0],
        r = i.segments[0],
        a = i.segments[i.segments.length - 1],
        o = Math.atan2(r.abx, -r.abz);
      return {
        index: e,
        rampType: i.rampType,
        mergeS: i.mergeS,
        exitS: i.exitS,
        dirSel: i.dirSel,
        halfW: i.halfW,
        start: { x: +t.x.toFixed(2), y: +t.y.toFixed(2), z: +t.z.toFixed(2) },
        mid: { x: +s.x.toFixed(2), y: +s.y.toFixed(2), z: +s.z.toFixed(2) },
        end: { x: +n.x.toFixed(2), y: +n.y.toFixed(2), z: +n.z.toFixed(2) },
        climb: +(n.y - t.y).toFixed(2),
        yaw: +o.toFixed(4),
        endYaw: +Math.atan2(a.abx, -a.abz).toFixed(4),
      };
    });
  },
  parkedSpots(i = 10) {
    return (rideSys.spots || []).slice(0, i).map((e) => ({ x: +e.x.toFixed(1), z: +e.z.toFixed(1), idx: e.idx }));
  },
  colliderSample(i = 8) {
    return Mn.slice(0, i).map((e) => ({
      x: +e.x.toFixed(1),
      z: +e.z.toFixed(1),
      hw: +e.hw.toFixed(1),
      hd: +e.hd.toFixed(1),
    }));
  },
  pylonColliderSample(i = 8) {
    return $n
      .filter((e) => e.hw)
      .slice(0, i)
      .map((e) => ({ x: +e.x.toFixed(1), z: +e.z.toFixed(1), hw: +e.hw.toFixed(1), hd: +e.hd.toFixed(1) }));
  },
  trackSupportReport() {
    const i = $n.filter((e) => e.hw);
    return {
      supports: Cc,
      pylonColliders: i.length,
      gaps: ce.gaps.length,
      sample: i
        .slice(0, 8)
        .map((e) => ({
          x: +e.x.toFixed(1),
          z: +e.z.toFixed(1),
          hw: +e.hw.toFixed(1),
          hd: +e.hd.toFixed(1),
          maxY: +e.maxY.toFixed(1),
        })),
    };
  },
  buildingTrackConflictReport(i = 12) {
    const e = [];
    for (const t of Mn) {
      const n = Wi(t.x, t.z, t.hw * 2, t.hd * 2, t.maxY);
      n &&
        e.push({
          x: +t.x.toFixed(1),
          z: +t.z.toFixed(1),
          hw: +t.hw.toFixed(1),
          hd: +t.hd.toFixed(1),
          maxY: +t.maxY.toFixed(1),
          courseIndex: n.courseIndex,
          s: +n.s.toFixed(1),
          trackY: +n.trackY.toFixed(1),
          horizontalClearance: +n.horizontalClearance.toFixed(1),
          verticalIntrusion: +n.verticalIntrusion.toFixed(1),
        });
    }
    return (
      e.sort((t, n) => n.verticalIntrusion - t.verticalIntrusion),
      { totalBuildings: Mn.length, conflicts: e.length, sample: e.slice(0, i) }
    );
  },
  buildingStreetConflictReport(i = 12) {
    const e = [];
    for (const t of Mn) {
      const n = Hi(t.x, t.z, t.hw * 2, t.hd * 2, 0);
      n &&
        e.push({
          x: +t.x.toFixed(1),
          z: +t.z.toFixed(1),
          hw: +t.hw.toFixed(1),
          hd: +t.hd.toFixed(1),
          axis: n.axis,
          road: n.road,
          overlap: +n.overlap.toFixed(1),
        });
    }
    return (
      e.sort((t, n) => n.overlap - t.overlap),
      { totalBuildings: Mn.length, conflicts: e.length, sample: e.slice(0, i) }
    );
  },
  rockColliderSample(i = 8) {
    return Di.concat($n.filter((e) => e.kind === "rock"))
      .slice(0, i)
      .map((e) => ({
        kind: e.kind || "prop",
        x: +e.x.toFixed(1),
        z: +e.z.toFixed(1),
        radius: e.radius ? +e.radius.toFixed(1) : null,
      }));
  },
  cityLifeReport(i = 8) {
    return {
      traffic: qe.traffic,
      pedestrians: qe.pedestrians,
      pedestriansActive: Rr.filter((e) => e.active).length,
      turns: qe.turns,
      splats: qe.splats,
      trafficCrashes: qe.trafficCrashes,
      streetLights: qe.streetLights,
      trafficLights: qe.trafficLights,
      stopSigns: qe.stopSigns,
      signs: qe.signs,
      roadDetails: { ...qe.roadDetails },
      buildingArchetypes: { ...qe.buildingArchetypes },
      zones: { ...qe.zones },
      openerProps: qe.openerProps,
      signSamples: Pa.slice(0, i),
      types: { ...qe.types },
      offRoadTraffic: Ri.filter((e) => !ka(e.x, e.z, 2)).length,
      trafficRoutes: Rc.slice(0, i).map((e) => ({
        axis: e.axis,
        dir: e.dir,
        road: +e.road.toFixed(1),
        along: +e.along.toFixed(1),
        next: +e.next.toFixed(1),
        avoidOffset: +(e.avoidOffset || 0).toFixed(1),
        crashTimer: +(e.crashTimer || 0).toFixed(2),
      })),
      trafficColliders: Ri.slice(0, i).map((e) => ({
        x: +e.x.toFixed(1),
        z: +e.z.toFixed(1),
        hw: +e.hw.toFixed(1),
        hd: +e.hd.toFixed(1),
        maxY: +e.maxY.toFixed(1),
      })),
      pedestrianTargets: Rr.filter((e) => e.active)
        .slice(0, i)
        .map((e) => ({ x: +e.x.toFixed(1), z: +e.z.toFixed(1), axis: e.axis, dir: e.dir })),
    };
  },
  visualQualityReport() {
    const i = { ...qe.roadDetails },
      e = { ...qe.buildingArchetypes },
      t = { ...qe.zones },
      n = Object.values(e).filter((a) => a > 0).length,
      s = Object.values(t).filter((a) => a > 0).length;
    return {
      score: +(
        Math.min(25, (i.crosswalks || 0) / 8) +
        Math.min(18, (i.laneArrows || 0) / 3) +
        Math.min(14, (i.manholes || 0) / 4) +
        Math.min(16, qe.signs / 7) +
        Math.min(14, qe.openerProps * 1.4) +
        Math.min(13, n * 2.6)
      ).toFixed(1),
      roadDetails: i,
      buildingArchetypes: e,
      zones: t,
      archetypeKinds: n,
      zoneKinds: s,
      openerProps: qe.openerProps,
      signs: qe.signs,
      streetLights: qe.streetLights,
      streetGlowSprites: Qi.streetGlowSprites,
      waterBlockers: Qi.waterBlockers,
      lowFogDisks: Qi.lowFogDisks,
    };
  },
  objectiveReport() {
    const i = nn[u.objectiveIndex % Math.max(1, nn.length)];
    return {
      total: nn.length,
      hits: u.objectiveHits,
      index: u.objectiveIndex,
      lap: u.objectiveLap,
      next: i ? { x: +i.x.toFixed(1), y: +i.y.toFixed(1), z: +i.z.toFixed(1), label: i.label } : null,
      collected: nn.filter((e) => e.collected).length,
      score: Math.round(u.score),
      boost: +u.boost.toFixed(2),
    };
  },
  drivingFeelReport() {
    return {
      speed: +u.speed.toFixed(2),
      wheelSteer: +(u.wheelSteer || 0).toFixed(3),
      slip: +(u.roamSlip || 0).toFixed(3),
      suspension: +(u.roamSuspension || 0).toFixed(3),
      cameraShake: +(u.cameraShake || 0).toFixed(3),
      collisionDrama: +(u.collisionDrama || 0).toFixed(3),
      collisionHits: u.collisionHits,
      smokeActive: xr.filter((i) => i.life > 0).length,
      debrisActive: gr.filter((i) => i.life > 0).length,
      sparksActive: mr.filter((i) => i.life > 0).length,
    };
  },
  vehicleDetailReport() {
    return {
      player: { ...cn.userData.detailReport },
      racer: { ...es.userData.detailReport },
      namedParts: cn.children
        .filter((i) => i.name)
        .map((i) => i.name)
        .slice(0, 24),
    };
  },
  advanceCityLife(i = 1) {
    const e = 0.03333333333333333;
    let t = Math.max(0, Math.min(i, 60));
    for (; t > 0;) {
      const n = Math.min(e, t);
      (zd(n), (t -= n));
    }
    return this.cityLifeReport(12);
  },
  setRoamUnderTrack(i = 260, e = 0) {
    const t = St(i),
      n = t.p.x + t.side.x * e,
      s = t.p.z + t.side.z * e,
      r = Math.atan2(t.tangent.x, -t.tangent.z),
      a = He(n, s);
    ((u.mode = "roam"),
      (u.practice = !0),
      (u.freeRun = !1),
      u.roamPos.set(n, a + Wn, s),
      (u.roamYaw = r),
      (u.camYaw = r),
      (u.camLookYaw = 0),
      (u.camLookPitch = 0),
      (u.cameraZoom = 0),
      (Fe.lookX = 0),
      (Fe.lookY = 0),
      (Fe.zoom = 0),
      (u.wheelSteer = 0),
      (u.speed = 0),
      zs());
    const o = Math.sin(u.roamYaw),
      c = -Math.cos(u.roamYaw);
    return (
      Xe.position.set(u.roamPos.x - o * 17, u.roamPos.y + 7.2, u.roamPos.z - c * 17),
      Lc(),
      Xe.lookAt(u.roamPos.x + o * 13, u.roamPos.y + 2.45, u.roamPos.z + c * 13),
      (Xe.fov = 69),
      Xe.updateProjectionMatrix(),
      { ...this.roamReport(), trackY: +t.p.y.toFixed(2), deckClearance: +(t.p.y - u.roamPos.y).toFixed(2) }
    );
  },
  setRoamPose(i, e, t) {
    const n = Ki(i, e, u.roamPos.y);
    (u.roamPos.set(i, n.y + Wn, e),
      (u.roamYaw = t),
      (u.camYaw = t),
      (u.camLookYaw = 0),
      (u.camLookPitch = 0),
      (u.wheelSteer = 0),
      (u.speed = 0),
      zs());
    const s = Math.sin(u.roamYaw),
      r = -Math.cos(u.roamYaw);
    return (
      Xe.position.set(u.roamPos.x - s * 17, u.roamPos.y + 7.2, u.roamPos.z - r * 17),
      Lc(),
      Xe.lookAt(u.roamPos.x + s * 13, u.roamPos.y + 2.45, u.roamPos.z + r * 13),
      (Xe.fov = 69),
      Xe.updateProjectionMatrix(),
      this.roamReport()
    );
  },
  setTouchCamera(i = 0, e = 0, t = Fe.zoom, n = 30) {
    ((Fe.lookX = MathUtils.clamp(i, -1, 1)), (Fe.lookY = MathUtils.clamp(e, -1, 1)), (Fe.zoom = MathUtils.clamp(t, -0.42, 0.9)));
    for (let s = 0; s < n; s++) u.mode === "roam" ? jd(1 / 60) : dl(1 / 60);
    return this.roamReport();
  },
  simulateRoamDrive(i = 1, e = 0, t = 0, n = 0) {
    if (u.mode !== "roam") return this.roamReport();
    const s = { steer: Fe.steer, throttle: Fe.throttle, brake: Fe.brake };
    ((Fe.steer = MathUtils.clamp(e, -1, 1)), (Fe.throttle = MathUtils.clamp(t, 0, 1)), (Fe.brake = MathUtils.clamp(n, 0, 1)));
    const r = 1 / 60;
    let a = Math.max(0, Math.min(i, 8));
    for (; a > 0;) {
      const o = Math.min(r, a);
      if (($d(o), u.mode !== "roam")) break;
      a -= o;
    }
    return ((Fe.steer = s.steer), (Fe.throttle = s.throttle), (Fe.brake = s.brake), this.roamReport());
  },
  simulateTrackDrive(i = 1) {
    if (u.mode !== "race") return this.roamReport();
    const e = 1 / 60;
    let t = Math.max(0, Math.min(i, 8));
    for (; t > 0;) {
      const n = Math.min(e, t);
      if ((eu(n), u.mode !== "race")) break;
      t -= n;
    }
    return this.roamReport();
  },
  roamReport() {
    const i = u.roamPos,
      e = Id.set(0, 0, -1).applyQuaternion(cn.quaternion).normalize(),
      t = rl.set(Math.sin(u.roamYaw), 0, -Math.cos(u.roamYaw)).normalize(),
      n = Ki(i.x, i.z, i.y);
    return {
      mode: u.mode,
      s: +u.s.toFixed(2),
      totalDistance: +u.totalDistance.toFixed(2),
      x: +i.x.toFixed(2),
      y: +i.y.toFixed(2),
      z: +i.z.toFixed(2),
      yaw: +u.roamYaw.toFixed(3),
      camYaw: +u.camYaw.toFixed(3),
      speed: +u.speed.toFixed(2),
      groundXZ: +He(i.x, i.z).toFixed(2),
      surface: n.kind,
      surfaceY: +n.y.toFixed(2),
      camX: +Xe.position.x.toFixed(2),
      camY: +Xe.position.y.toFixed(2),
      camZ: +Xe.position.z.toFixed(2),
      fov: +Xe.fov.toFixed(2),
      lookYaw: +u.camLookYaw.toFixed(3),
      lookPitch: +u.camLookPitch.toFixed(3),
      cameraZoom: +u.cameraZoom.toFixed(3),
      cameraSightLift: +ll(
        { x: i.x, y: i.y + 2.6, z: i.z },
        { x: Xe.position.x, y: Xe.position.y, z: Xe.position.z },
        2.4,
      ).toFixed(3),
      elevatedCameraLift: +Da(
        { x: i.x, y: i.y + 2.6, z: i.z },
        { x: Xe.position.x, y: Xe.position.y, z: Xe.position.z },
        3.8,
      ).toFixed(3),
      colliders: Mn.length + $n.length + Di.length + Ri.length,
      insideBuilding: Mn.concat($n, Di, Ri).some((s) => av(i, s)),
      objectiveHits: u.objectiveHits,
      objectiveIndex: u.objectiveIndex,
      collisionHits: u.collisionHits,
      slip: +(u.roamSlip || 0).toFixed(3),
      suspension: +(u.roamSuspension || 0).toFixed(3),
      carForward: { x: +e.x.toFixed(3), z: +e.z.toFixed(3) },
      driveForward: { x: +t.x.toFixed(3), z: +t.z.toFixed(3) },
      wheelRotY: cn.userData.frontWheels ? +cn.userData.frontWheels[0].rotation.y.toFixed(3) : null,
    };
  },
};
function eu(i) {
  if (u.mode !== "race") return;
  ((u.time += i), u.freeRun && (u.damage = 0));
  const e = u.breakdownTimer > 0;
  e &&
    ((u.breakdownTimer -= i),
    u.breakdownTimer <= 0 && ((u.damage = 55), (u.message = "Patched up — back on it"), (u.messageTimer = 1.2)));
  const t = Math.max(_t.has("KeyW") || _t.has("ArrowUp") ? 1 : 0, Fe.throttle),
    n = Math.max(_t.has("KeyS") || _t.has("ArrowDown") ? 1 : 0, Fe.brake),
    r =
      MathUtils.clamp(
        (_t.has("KeyD") || _t.has("ArrowRight") ? 1 : 0) - (_t.has("KeyA") || _t.has("ArrowLeft") ? 1 : 0) + Fe.steer,
        -1,
        1,
      ) * Ud,
    a = t > 0.03 && !e,
    o = (_t.has("ShiftLeft") || _t.has("ShiftRight")) && u.boost > 0.02 && a && u.grounded,
    c = St(u.s),
    l = c.p.y + 2.1,
    d = Math.abs(u.speed);
  if (a) {
    const v = u.speed < 0 ? 40 : 0;
    u.speed += ((o ? 68 : 40) * carStats().accel + v) * t * i;
  }
  if (n > 0.03) {
    const v = u.speed > 1.2 ? 70 : 26;
    u.speed -= v * n * i;
  }
  const f = u.grounded ? 0.0024 : 0.0011;
  ((u.speed -= f * u.speed * d * i),
    d > 0.08 ? (u.speed -= Math.sign(u.speed) * (u.grounded ? 2.2 : 0.3) * i) : t <= 0.03 && n <= 0.03 && (u.speed = 0),
    (u.speed = MathUtils.clamp(u.speed, -16, 156 * carStats().top - u.damage * 0.8)),
    e && (u.speed = Math.min(u.speed, 14)),
    (u.boosting = o),
    o
      ? ((u.boost = Math.max(0, u.boost - i * 0.21)), (u.score += 28 * i))
      : (u.boost = Math.min(1, u.boost + i * (u.grounded ? 0.045 : 0.018) * carStats().boostRegen)));
  // Space on the ribbon = looser rear: stronger lateral push, less damping, a controlled slide.
  const hbT = _t.has("Space") && u.grounded,
    p = (16 + d * 0.13) * (hbT ? 1.45 : 1) * carStats().grip;
  ((u.lateralVel -= r * p * i),
    (u.lateralVel -= u.lateralVel * (u.grounded ? (hbT ? 2.2 : 4.1) : 0.7) * i),
    (u.lateral += u.lateralVel * i));
  const m = Li(u.s),
    g = Math.abs(u.lateral) < ce.width * 0.52,
    M = !m && g;
  if ((u.grounded && (!M || Math.abs(u.lateral) > ce.width * 0.5) && Fh(c, g ? "" : "Edge slip"), u.grounded)) {
    const v = Math.sin(u.time * 18) * Math.min(0.22, Math.abs(u.speed) / 700);
    ((u.y = MathUtils.lerp(u.y, l + v, 0.5)),
      (u.yVel = 0),
      (u.lastSafeS = u.s),
      (u.lastSafeDistance = u.totalDistance),
      (u.score += Math.max(0, u.speed) * i * 0.34),
      Math.abs(u.lateral) > ce.width * 0.42 &&
        ((u.damage += i * (1.2 + Math.abs(u.speed) * 0.035)),
        (u.cameraShake = Math.max(u.cameraShake, 0.24)),
        (u.nearMisses += i * 0.8),
        Math.random() < i * 5 &&
          Pr(
            c.p
              .clone()
              .addScaledVector(c.side, Math.sign(u.lateral) * ce.width * 0.55)
              .addScaledVector(on, 1.2),
            4,
          )));
  } else {
    ((u.yVel -= 31 * i), (u.y += u.yVel * i), (u.airtime += i), (u.score += i * 11));
    const v = St(u.s),
      y = v.p.y + 2.1;
    if (!Li(u.s) && Math.abs(u.lateral) < ce.width * 0.55 && u.y <= y && u.yVel < 0) {
      const T = -u.yVel,
        R = Math.abs(u.lateral) < ce.width * 0.34 && T < 30;
      const landPts = Math.round(R ? 260 + u.airtime * 85 : Math.max(30, 120 - T));
      ((u.y = y),
        (u.grounded = !0),
        (u.yVel = 0),
        (u.lastSafeS = u.s),
        (u.lastSafeDistance = u.totalDistance),
        (u.damage += Math.max(0, T - 17) * 0.82 + Math.max(0, Math.abs(u.lateral) - ce.width * 0.36) * 1.8),
        (u.score += landPts),
        (u.cameraShake = Math.max(u.cameraShake, T / 34)),
        (u.message = R ? "Clean landing" : "Hard landing"),
        (u.messageTimer = 0.9),
        R ? (u.cleanLandings += 1) : (u.hardLandings += 1),
        showScorePop(`+${landPts} ${R ? "CLEAN AIR" : "LANDED"}`, R),
        R && chime(990, 0.14),
        Pc(T),
        Pr(v.p.clone().addScaledVector(v.side, u.lateral).addScaledVector(on, 0.7), R ? 7 : 24),
        (u.airtime = 0));
    }
    if (u.practice || u.freeRun) {
      // Falling off the ribbon in practice/free-run drops you straight into city cruising —
      // catch the car at ground level and hand over to roam physics mid-tumble.
      if (!u.grounded && u.yVel < -6) {
        const fp = St(u.s),
          wx = fp.p.x + fp.side.x * u.lateral,
          wz = fp.p.z + fp.side.z * u.lateral,
          gy = He(wx, wz);
        u.y <= gy + 1.3 && fallIntoCity(wx, wz, fp);
      }
      u.y < -55 && ((u.damage += 28), Uh("Track crew recovery"));
    } else u.y < -55 && ((u.damage += 28), Uh("Track crew recovery"));
  }
  const x = u.totalDistance;
  ((u.totalDistance += u.speed * i),
    (u.s = ((u.totalDistance % ce.length) + ce.length) % ce.length),
    recordGhostFrame());
  const h = Dr.find((v) => v.rampType === "off");
  if (u.freeRun && h && Eh(x, u.totalDistance, h.exitS) && u.lateral * h.dirSel > ce.width * 0.2 && iv(h)) return;
  const _ = Math.floor(u.totalDistance / ce.length) + 1;
  if (_ > u.lap) {
    const v = u.time - u.lapStartTime;
    (saveGhostIfBest(v),
      (u.ghostRec = []),
      u.splitTimes.push(v),
      (u.bestLap = Math.min(u.bestLap, v)),
      (u.lapStartTime = u.time),
      (u.lap = _),
      (u.score += 1200),
      showScorePop("+1200 LAP", !0),
      (u.message = u.practice ? `Lap ${u.lap}` : u.lap <= ce.laps ? `Lap ${u.lap}` : "Season race complete"),
      (u.messageTimer = 1.4),
      !u.practice &&
        u.lap > ce.laps &&
        (() => {
          const pos = racePosition();
          Qd(
            pos === 1 ? "You took the chequered gantry." : `You finished P${pos}.`,
            pos,
          );
        })());
  }
  for (const v of ce.gaps)
    Eh(x, u.totalDistance, v.start) &&
      ((u.message = v.name), (u.messageTimer = 1.1), u.grounded && Fh(St(v.start), v.name));
  if (u.grounded)
    for (const v of boostPads)
      if (Eh(x, u.totalDistance, v.s) && Math.abs(u.lateral - v.lat) < 3.4) {
        const y = St(v.s);
        ((u.boost = Math.min(1, u.boost + 0.45)),
          (u.speed = Math.min(u.speed + 9, 156 - u.damage * 0.8)),
          (u.score += 90),
          (u.cameraShake = Math.max(u.cameraShake, 0.16)),
          (u.message = "BOOST PAD"),
          (u.messageTimer = 0.8),
          showScorePop("+90 BOOST"),
          chime(640, 0.22, "sawtooth", 0.1),
          Pr(y.p.clone().addScaledVector(y.side, v.lat).addScaledVector(on, 1), 10),
          Pc(14));
        break;
      }
  ((u.damage = MathUtils.clamp(u.damage, 0, 100)),
    !u.freeRun &&
      u.damage >= 90 &&
      u.breakdownTimer <= 0 &&
      ((u.breakdownTimer = 2.6),
      (u.message = "Chassis cracked — limping to repair"),
      (u.messageTimer = 1.6),
      (u.cameraShake = Math.max(u.cameraShake, 0.8)),
      Pc(40),
      (u.damage = 90)),
    _t.has("KeyR") && ((u.damage = Math.min(99, u.damage + 8)), Uh("Manual reset"), _t.delete("KeyR")));
}
function uv(i) {
  const total = ce.length * ce.laps,
    divMult = 1 + 0.07 * (4 - seasonDivision());
  for (const r of rivals) {
    if (u.mode === "race" && !u.practice) {
      const gap = u.totalDistance - r.distance,
        rubber = MathUtils.clamp(gap * 0.055, -11, 15),
        wave = Math.sin(u.time * r.waveFreq + r.phase) * r.wave;
      let pace = r.base + wave + rubber;
      (r.key === "bishop" && (pace += 11 * Math.exp(-u.time / 22)),
        r.key === "maddock" && (pace += 10 * MathUtils.clamp(r.distance / Math.max(1, total), 0, 1)));
      ((r.speed = MathUtils.clamp(pace * divMult, 60, 134)), (r.distance += r.speed * i));
      r.distance >= total &&
        !r.finished &&
        ((r.finished = u.time), (u.message = `${r.label} takes the flag`), (u.messageTimer = 1.1));
    }
    r.s = ((r.distance % ce.length) + ce.length) % ce.length;
    const e = St(r.s),
      gapToPlayer = Math.abs(r.distance - u.totalDistance);
    let lat = r.lane * ce.width + Math.sin(r.s * 0.02 + r.phase) * 1.2;
    if (gapToPlayer < 14) {
      // Side-by-side racing: rivals take the opposite lane instead of ghosting through the player.
      const dodge = (u.lateral >= 0 ? -1 : 1) * ce.width * (0.22 + Math.abs(r.lane) * 0.4);
      lat = MathUtils.lerp(dodge, lat, gapToPlayer / 14);
    }
    (r.mesh.position.copy(e.p).addScaledVector(on, 1.4).addScaledVector(e.side, lat),
      r.mesh.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(e.side, on, e.tangent)));
    const hideClose = gapToPlayer < 26 && trackViewMode === "cockpit";
    r.mesh.visible =
      (u.mode === "race" || u.mode === "paused" || u.mode === "result") && !u.practice && !hideClose;
  }
  ((u.rivalDistance = Math.max(...rivals.map((r) => r.distance))),
    (u.rivalS = ((u.rivalDistance % ce.length) + ce.length) % ce.length));
}
function racePosition() {
  return u.practice ? 1 : 1 + rivals.filter((r) => r.distance > u.totalDistance).length;
}
function cockpitTrackCamera(i, e) {
  const t = e.side.clone().multiplyScalar(u.lateral),
    n = e.p.clone().add(t);
  n.y = u.y;
  const s = u.cameraShake;
  (s > 0.01 && ((n.x += (Math.random() - 0.5) * s * 0.8), (n.y += (Math.random() - 0.5) * s * 0.45)),
    Xe.position.copy(n));
  const r = Math.abs(u.speed),
    a = 68 + Math.min(10, r * 0.055) + (u.boosting ? 3 : 0) + u.cameraZoom * 12;
  Math.abs(Xe.fov - a) > 0.02 && ((Xe.fov += (a - Xe.fov) * (1 - Math.pow(0.004, i))), Xe.updateProjectionMatrix());
  const o = St(u.s + 34 + u.speed * 0.16),
    c = o.p.clone().addScaledVector(o.side, u.lateral * 0.45);
  ((c.y += 1.7 + u.camLookPitch * 12 + Math.sin(u.time * 8) * Math.min(0.2, r / 680)),
    Ln.position.copy(Xe.position),
    Ln.lookAt(c),
    Ln.rotateY(Math.PI),
    Ln.rotateY(-u.camLookYaw),
    Ln.rotateZ(-e.bank * 0.72 - u.lateralVel * 0.006),
    Ln.rotateX(e.grade * 0.18 + (u.grounded ? 0 : MathUtils.clamp(u.yVel, -30, 30) * -0.006)),
    Xe.quaternion.slerp(Ln.quaternion, 1 - Math.pow(8e-4, i)));
}
function overheadDeckY(i, e, t, n) {
  let s = 1 / 0;
  const r = ce.width * 0.5 + 2.2;
  for (const a of kd()) {
    if (a.courseIndex !== Ma || a.y < t || a.y > n || a.y >= s) continue;
    const o = i - a.x,
      c = e - a.z;
    o * o + c * c < r * r && (s = a.y);
  }
  return s;
}
function chaseTrackCamera(i, e) {
  const r = Math.abs(u.speed),
    carDeckY = u.y - 2.1;
  let back = 12.8 + r * 0.05 + MathUtils.clamp(u.cameraZoom, -0.42, 0.9) * 8,
    height = 4.6 + r * 0.014 + u.camLookPitch * 10,
    camS = St(u.s - back),
    overhead = overheadDeckY(camS.p.x, camS.p.z, carDeckY + 5, carDeckY + 64);
  overhead - 1.5 < camS.p.y + 2 &&
    // Squeezed between our deck and a strand crossing above it: tuck the camera in close.
    ((back = 6.4), (height = 2.7), (camS = St(u.s - back)), (overhead = overheadDeckY(camS.p.x, camS.p.z, carDeckY + 5, carDeckY + 64)));
  let camY = MathUtils.lerp(camS.p.y, carDeckY, 0.62) + height;
  const target = Dd.set(camS.p.x + camS.side.x * u.lateral * 0.72, 0, camS.p.z + camS.side.z * u.lateral * 0.72);
  ((camY = Math.max(camY, camS.p.y + 2.35, He(target.x, target.z) + 2.8)),
    overhead < 1 / 0 && (camY = Math.min(camY, overhead - 1.5)),
    (target.y = camY));
  if (u.cameraShake > 0.01) {
    const sh = u.cameraShake;
    ((target.x += (Math.random() - 0.5) * sh * 1.1),
      (target.y += (Math.random() - 0.5) * sh * 0.6),
      (target.z += (Math.random() - 0.5) * sh * 1.1));
  }
  (Xe.position.distanceTo(target) > 70 && Xe.position.copy(target),
    Xe.position.lerp(target, 1 - Math.pow(2e-4, i)),
    (Xe.position.y = Math.max(Xe.position.y, camS.p.y + 2.05)),
    overhead < 1 / 0 && (Xe.position.y = Math.min(Xe.position.y, overhead - 1.4)));
  const ahead = St(u.s + 17 + r * 0.09),
    c = ahead.p.clone().addScaledVector(ahead.side, u.lateral * 0.55);
  ((c.y += 2.1 + u.camLookPitch * 12),
    u.grounded || (c.y = MathUtils.lerp(c.y, u.y + 1.2, 0.5)),
    Ln.position.copy(Xe.position),
    Ln.lookAt(c),
    Ln.rotateY(Math.PI),
    Ln.rotateY(-u.camLookYaw),
    Ln.rotateZ(-e.bank * 0.42 - u.lateralVel * 0.0034),
    Xe.quaternion.slerp(Ln.quaternion, 1 - Math.pow(4e-4, i)));
  const a = 66 + Math.min(11, r * 0.055) + (u.boosting ? 5 : 0) + MathUtils.clamp(u.cameraZoom, -0.42, 0.9) * 10;
  Math.abs(Xe.fov - a) > 0.02 && ((Xe.fov += (a - Xe.fov) * (1 - Math.pow(0.004, i))), Xe.updateProjectionMatrix());
}
// ─── Ghost laps: your best practice/free-run lap per course replays as a translucent car ───
let ghostMesh = null,
  ghostData = null,
  ghostCursor = 0;
function loadGhost() {
  try {
    ghostData = JSON.parse(localStorage.getItem("steel-ribbon-ghost-" + Ma) || "null");
  } catch {
    ghostData = null;
  }
  ghostCursor = 0;
}
function buildGhostMesh() {
  ghostMesh && Po(ghostMesh);
  ghostMesh = CAR_MODELS[carModelIndex].build();
  (ghostMesh.traverse((o) => {
    ((o.castShadow = !1), (o.receiveShadow = !1));
    o.material &&
      ((o.material = o.material.clone()),
      (o.material.transparent = !0),
      (o.material.opacity = Math.min(o.material.opacity ?? 1, 0.28)),
      (o.material.depthWrite = !1));
  }),
    (ghostMesh.visible = !1));
}
function saveGhostIfBest(lapTime) {
  if (!(u.practice || u.freeRun) || !u.ghostRec || u.ghostRec.length < 12) return;
  if (ghostData && lapTime >= ghostData.time) return;
  const stride = Math.max(1, Math.floor(u.ghostRec.length / 700));
  const samples = u.ghostRec.filter((s, k) => k % stride === 0);
  ghostData = { time: +lapTime.toFixed(2), samples };
  try {
    localStorage.setItem("steel-ribbon-ghost-" + Ma, JSON.stringify(ghostData));
  } catch {}
  ((u.message = `Ghost saved — ${Dc(lapTime)}`), (u.messageTimer = 1.3), (ghostCursor = 0));
}
function recordGhostFrame() {
  if (u.mode !== "race") return;
  u.ghostRec || (u.ghostRec = []);
  const t = u.time - u.lapStartTime,
    last = u.ghostRec[u.ghostRec.length - 1];
  (!last || t - last[0] > 0.08) &&
    u.ghostRec.length < 4000 &&
    u.ghostRec.push([+t.toFixed(2), +u.s.toFixed(1), +u.lateral.toFixed(2), +u.y.toFixed(2)]);
}
function updateGhost() {
  if (!ghostMesh) return;
  const show =
    u.mode === "race" && (u.practice || u.freeRun) && ghostData?.samples?.length > 2 && !window.__freeCam;
  ghostMesh.visible = show;
  if (!show) return;
  const t = (u.time - u.lapStartTime) % Math.max(0.01, ghostData.time),
    S = ghostData.samples;
  (t < (S[ghostCursor]?.[0] ?? 0) && (ghostCursor = 0));
  for (; ghostCursor < S.length - 2 && S[ghostCursor + 1][0] < t; ) ghostCursor++;
  const a = S[ghostCursor],
    b = S[Math.min(ghostCursor + 1, S.length - 1)],
    f = MathUtils.clamp((t - a[0]) / Math.max(0.01, b[0] - a[0]), 0, 1),
    gs = MathUtils.lerp(a[1], b[1], Math.abs(b[1] - a[1]) > ce.length * 0.5 ? 0 : f),
    glat = MathUtils.lerp(a[2], b[2], f),
    gy = MathUtils.lerp(a[3], b[3], f),
    e = St(((gs % ce.length) + ce.length) % ce.length);
  ghostMesh.position.set(e.p.x + e.side.x * glat, gy - 0.72, e.p.z + e.side.z * glat);
  ghostMesh.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(e.side, on, e.tangent));
}
function updateTrackCarPose() {
  const onTrack = u.mode === "race" || u.mode === "paused" || u.mode === "result",
    show = onTrack && trackViewMode === "chase" && !window.__freeCam;
  (qn && (qn.visible = !show), cn.visible !== show && (cn.visible = show));
  if (!show) return;
  const e = St(u.s);
  cn.position.set(e.p.x + e.side.x * u.lateral, u.y - 0.72, e.p.z + e.side.z * u.lateral);
  const n = new Matrix4().makeBasis(e.side, on, e.tangent);
  (cn.quaternion.setFromRotationMatrix(n),
    u.grounded
      ? (cn.rotateX(-e.grade * 0.5), cn.rotateZ(e.bank * 0.6 + MathUtils.clamp(u.lateralVel * 0.012, -0.16, 0.16)))
      : cn.rotateX(MathUtils.clamp(-u.yVel * 0.011, -0.34, 0.4)));
  const w = cn.userData.frontWheels,
    steer = MathUtils.clamp(-u.lateralVel * 0.05, -0.5, 0.5);
  w && ((w[0].rotation.y = steer), (w[1].rotation.y = steer));
}
let menuOrbitT = 0.6;
function menuCinematic(i) {
  if (window.__freeCam) return;
  menuOrbitT += i * 0.13;
  const e = 80,
    t = 300,
    n = He(e, t);
  ((cn.visible = !0), qn && (qn.visible = !1));
  (cn.position.set(e, n + 0.85, t), cn.quaternion.setFromAxisAngle(on, Math.PI * 0.24));
  const s = 16.5;
  (Xe.position.set(
    e + Math.cos(menuOrbitT) * s,
    n + 5.3 + Math.sin(menuOrbitT * 0.57) * 1.1,
    t + Math.sin(menuOrbitT) * s,
  ),
    Xe.lookAt(e, n + 1.5, t),
    Xe.rotateY(0.3));
  Math.abs(Xe.fov - 58) > 0.1 && ((Xe.fov = 58), Xe.updateProjectionMatrix());
  window.__steelRibbonTelemetry && (window.__steelRibbonTelemetry.mode = u.mode);
}
function dl(i) {
  if (window.__freeCam) return;
  Jd(i);
  const e = St(u.s);
  (trackViewMode === "chase" && u.mode !== "menu" ? chaseTrackCamera(i, e) : cockpitTrackCamera(i, e),
    (u.cameraShake = Math.max(0, u.cameraShake - i * 1.9)));
  const l = rl.set(0, 0, -1).applyQuaternion(Xe.quaternion).normalize();
  window.__steelRibbonTelemetry = {
    mode: u.mode,
    s: u.s,
    totalDistance: u.totalDistance,
    rivalDistance: u.rivalDistance,
    speed: u.speed,
    lap: u.lap,
    score: u.score,
    damage: u.damage,
    y: u.y,
    yVel: u.yVel,
    grounded: u.grounded,
    input: { steer: Fe.steer, throttle: Fe.throttle, brake: Fe.brake },
    forwardWorld: { x: e.tangent.x, y: e.tangent.y, z: e.tangent.z },
    cameraWorld: { x: l.x, y: l.y, z: l.z },
  };
}
const Ji = { idle: 900, shift: 7400, redline: 7500, max: 9e3, postShift: 2900 },
  ar = [28, 54, 82, 110, 134, 156];
function fv() {
  const i = Math.abs(u.speed);
  let e = 1;
  for (let o = 0; o < ar.length; o++) i > ar[o] && (e = o + 2);
  e = Math.min(e, ar.length);
  const t = e === 1 ? 0 : ar[e - 2],
    n = ar[e - 1],
    s = n > t ? MathUtils.clamp((i - t) / (n - t), 0, 1) : 0,
    r = e === 1 ? Ji.idle : Ji.postShift;
  let a = r + s * (Ji.shift - r);
  return (i < 0.4 && (a = Ji.idle), { gear: e, rpm: a });
}
let Nh = performance.now(),
  Do = 0,
  Io = 0;
function tu(i) {
  const e = i.getContext("2d"),
    t = Math.min(2, window.devicePixelRatio || 1),
    n = i.clientWidth || 120,
    s = i.clientHeight || 70;
  ((i.width !== Math.round(n * t) || i.height !== Math.round(s * t)) &&
    ((i.width = Math.round(n * t)), (i.height = Math.round(s * t))),
    e.setTransform(t, 0, 0, t, 0, 0),
    e.clearRect(0, 0, n, s));
  const r = n / 2,
    a = s - s * 0.14,
    o = Math.min(n * 0.46, s * 0.9);
  return {
    ctx: e,
    w: n,
    h: s,
    cx: r,
    cy: a,
    R: o,
    aFor: (d) => Math.PI - d * Math.PI,
    at: (d, f) => [r + Math.cos(d) * f, a - Math.sin(d) * f],
  };
}
function pv(i, e) {
  const t = Qe.speedo;
  if (!t) return;
  const { ctx: n, cx: s, cy: r, R: a, aFor: o, at: c } = tu(t),
    l = 360;
  ((n.lineCap = "round"),
    (n.lineWidth = Math.max(2, a * 0.07)),
    (n.strokeStyle = "rgba(120, 205, 255, 0.32)"),
    n.beginPath(),
    n.arc(s, r, a, o(1), o(0)),
    n.stroke(),
    (n.font = `700 ${Math.max(6, a * 0.15)}px "Courier New", monospace`),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"));
  for (let g = 0; g <= l; g += 20) {
    const M = g / l,
      x = o(M),
      h = g % 80 === 0;
    ((n.strokeStyle = "rgba(180, 230, 255, 0.85)"),
      (n.lineWidth = h ? Math.max(1.4, a * 0.035) : Math.max(1, a * 0.02)));
    const _ = c(x, a - a * 0.02),
      v = c(x, a - a * (h ? 0.18 : 0.1));
    if ((n.beginPath(), n.moveTo(_[0], _[1]), n.lineTo(v[0], v[1]), n.stroke(), h)) {
      const y = c(x, a - a * 0.34);
      ((n.fillStyle = "#cfeeff"), n.fillText(String(g / 10), y[0], y[1]));
    }
  }
  const d = MathUtils.clamp(i / l, 0, 1),
    f = o(d),
    p = c(f, a - a * 0.06),
    m = c(f + Math.PI, a * 0.14);
  ((n.strokeStyle = "#7df1ff"),
    (n.shadowColor = "rgba(80, 220, 255, 0.9)"),
    (n.shadowBlur = a * 0.18),
    (n.lineWidth = Math.max(1.8, a * 0.05)),
    n.beginPath(),
    n.moveTo(m[0], m[1]),
    n.lineTo(p[0], p[1]),
    n.stroke(),
    (n.shadowBlur = 0),
    (n.fillStyle = "#13303d"),
    (n.strokeStyle = "#6ec7ff"),
    (n.lineWidth = Math.max(1, a * 0.03)),
    n.beginPath(),
    n.arc(s, r, a * 0.1, 0, Math.PI * 2),
    n.fill(),
    n.stroke(),
    (n.fillStyle = "rgba(135, 223, 255, 0.85)"),
    (n.font = `700 ${Math.max(6, a * 0.12)}px "Courier New", monospace`),
    (n.textBaseline = "alphabetic"),
    n.fillText("MPH", s, r - a * 0.26),
    (n.fillStyle = e ? "#ff8077" : "#f2f8ff"),
    (n.font = `800 ${Math.max(9, a * 0.2)}px "Courier New", monospace`),
    n.fillText(e ? `-${Math.round(i)}` : String(Math.round(i)), s, r + a * 0.02));
}
function mv(i, e) {
  const t = Qe.boostGauge;
  if (!t) return;
  const { ctx: n, cx: s, cy: r, R: a, aFor: o, at: c } = tu(t),
    l = 18;
  ((n.lineCap = "round"),
    (n.lineWidth = Math.max(2, a * 0.07)),
    (n.strokeStyle = "rgba(120, 205, 255, 0.3)"),
    n.beginPath(),
    n.arc(s, r, a, o(1), o(0)),
    n.stroke());
  const d = MathUtils.clamp(i, 0, 1),
    f = i < 0.25;
  ((n.strokeStyle = f ? "#ff5436" : e ? "#ffb53a" : "#46e0b0"),
    (n.shadowColor = e ? "rgba(255, 170, 50, 0.9)" : "rgba(70, 224, 176, 0.6)"),
    (n.shadowBlur = e ? a * 0.25 : a * 0.1),
    (n.lineWidth = Math.max(2, a * 0.07)),
    n.beginPath(),
    n.arc(s, r, a, o(d), o(0)),
    n.stroke(),
    (n.shadowBlur = 0),
    (n.font = `700 ${Math.max(6, a * 0.15)}px "Courier New", monospace`),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"));
  for (let M = 0; M <= l; M += 3) {
    const x = M / l,
      h = o(x),
      _ = M % 6 === 0;
    ((n.strokeStyle = M >= l * 0.85 ? "#ff6155" : "rgba(180, 230, 255, 0.8)"),
      (n.lineWidth = _ ? Math.max(1.3, a * 0.03) : Math.max(1, a * 0.018)));
    const v = c(h, a - a * 0.02),
      y = c(h, a - a * (_ ? 0.17 : 0.1));
    if ((n.beginPath(), n.moveTo(v[0], v[1]), n.lineTo(y[0], y[1]), n.stroke(), _)) {
      const E = c(h, a - a * 0.33);
      ((n.fillStyle = "#cfeeff"), n.fillText(String(M), E[0], E[1]));
    }
  }
  const p = o(d),
    m = c(p, a - a * 0.06),
    g = c(p + Math.PI, a * 0.14);
  ((n.strokeStyle = f ? "#ff5436" : "#ffd23f"),
    (n.shadowColor = "rgba(255, 200, 60, 0.8)"),
    (n.shadowBlur = a * 0.16),
    (n.lineWidth = Math.max(1.8, a * 0.05)),
    n.beginPath(),
    n.moveTo(g[0], g[1]),
    n.lineTo(m[0], m[1]),
    n.stroke(),
    (n.shadowBlur = 0),
    (n.fillStyle = "#13303d"),
    (n.strokeStyle = "#6ec7ff"),
    (n.lineWidth = Math.max(1, a * 0.03)),
    n.beginPath(),
    n.arc(s, r, a * 0.1, 0, Math.PI * 2),
    n.fill(),
    n.stroke(),
    (n.fillStyle = "rgba(135, 223, 255, 0.85)"),
    (n.font = `700 ${Math.max(6, a * 0.12)}px "Courier New", monospace`),
    (n.textBaseline = "alphabetic"),
    n.fillText("BOOST psi", s, r - a * 0.26),
    e &&
      ((n.fillStyle = "#ffce4a"),
      (n.shadowColor = "rgba(255, 190, 60, 0.95)"),
      (n.shadowBlur = a * 0.3),
      n.beginPath(),
      n.arc(s, r + a * 0.02, a * 0.07, 0, Math.PI * 2),
      n.fill(),
      (n.shadowBlur = 0)));
}
function xv(i, e) {
  const t = Qe.tach;
  if (!t) return;
  const n = t.getContext("2d"),
    s = Math.min(2, window.devicePixelRatio || 1),
    r = t.clientWidth || 160,
    a = t.clientHeight || 70;
  ((t.width !== Math.round(r * s) || t.height !== Math.round(a * s)) &&
    ((t.width = Math.round(r * s)), (t.height = Math.round(a * s))),
    n.setTransform(s, 0, 0, s, 0, 0),
    n.clearRect(0, 0, r, a));
  const o = r / 2,
    c = a - a * 0.14,
    l = Math.min(r * 0.46, a * 0.9),
    d = Ji.max,
    f = (v) => Math.PI - v * Math.PI,
    p = (v, y) => [o + Math.cos(v) * y, c - Math.sin(v) * y];
  ((n.lineCap = "round"),
    (n.lineWidth = Math.max(2, l * 0.07)),
    (n.strokeStyle = "rgba(120, 205, 255, 0.32)"),
    n.beginPath(),
    n.arc(o, c, l, f(1), f(0)),
    n.stroke());
  const m = Ji.redline / d;
  ((n.strokeStyle = "#ff3b30"),
    n.beginPath(),
    n.arc(o, c, l, f(1), f(m)),
    n.stroke(),
    (n.font = `700 ${Math.max(7, l * 0.17)}px "Courier New", monospace`),
    (n.textAlign = "center"),
    (n.textBaseline = "middle"));
  for (let v = 0; v <= 9; v++) {
    const y = v / 9,
      E = f(y),
      T = v * 1e3 >= Ji.redline;
    ((n.strokeStyle = T ? "#ff6155" : "rgba(180, 230, 255, 0.9)"), (n.lineWidth = Math.max(1.4, l * 0.035)));
    const R = p(E, l - l * 0.02),
      C = p(E, l - l * 0.18);
    (n.beginPath(), n.moveTo(R[0], R[1]), n.lineTo(C[0], C[1]), n.stroke());
    const b = p(E, l - l * 0.34);
    if (((n.fillStyle = T ? "#ff8077" : "#cfeeff"), n.fillText(String(v), b[0], b[1]), v < 9)) {
      const S = f((v + 0.5) / 9),
        L = p(S, l - l * 0.02),
        F = p(S, l - l * 0.1);
      ((n.strokeStyle = "rgba(150, 210, 255, 0.5)"),
        (n.lineWidth = Math.max(1, l * 0.02)),
        n.beginPath(),
        n.moveTo(L[0], L[1]),
        n.lineTo(F[0], F[1]),
        n.stroke());
    }
  }
  const g = MathUtils.clamp(i / d, 0, 1),
    M = f(g),
    x = p(M, l - l * 0.06),
    h = p(M + Math.PI, l * 0.14);
  ((n.strokeStyle = "#ffdd48"),
    (n.shadowColor = "rgba(255, 200, 60, 0.9)"),
    (n.shadowBlur = l * 0.18),
    (n.lineWidth = Math.max(1.8, l * 0.05)),
    n.beginPath(),
    n.moveTo(h[0], h[1]),
    n.lineTo(x[0], x[1]),
    n.stroke(),
    (n.shadowBlur = 0),
    (n.fillStyle = "#13303d"),
    (n.strokeStyle = "#6ec7ff"),
    (n.lineWidth = Math.max(1, l * 0.03)),
    n.beginPath(),
    n.arc(o, c, l * 0.1, 0, Math.PI * 2),
    n.fill(),
    n.stroke(),
    (n.fillStyle = "rgba(135, 223, 255, 0.85)"),
    (n.font = `700 ${Math.max(6, l * 0.12)}px "Courier New", monospace`),
    (n.textBaseline = "alphabetic"),
    n.fillText("x1000 r/min", o, c - l * 0.26));
  const _ = u.speed < -0.5 ? "R" : String(e);
  ((n.fillStyle = "#f2f8ff"),
    (n.font = `800 ${Math.max(9, l * 0.22)}px "Courier New", monospace`),
    n.fillText(_, o, c + l * 0.02));
}
function vr() {
  ce.length * ce.laps;
  const i = Th(u.practice ? u.totalDistance % ce.length : u.totalDistance),
    t = u.practice ? "SOLO" : `P${racePosition()}`;
  (t !== u.leadState &&
    u.mode === "race" &&
    ((u.leadState = t),
    u.practice || ((u.message = t === "P1" ? "You took the lead" : `Now ${t}`), (u.messageTimer = 0.95))),
    (Qe.damage.style.width = `${Math.round(u.damage)}%`),
    (Qe.lap.textContent = u.practice ? `LAP ${u.lap}` : `${Math.min(u.lap, ce.laps)}/${ce.laps}`),
    (Qe.timer.textContent = Dc(u.time)));
  const n = u.mode === "roam",
    comboTag = n && u.driftCombo > 0 && u.driftComboT > 0 ? `  ·  DRIFT ×${Math.min(5, u.driftCombo + 1)}` : "";
  Qe.score.textContent = n
    ? `Gates ${u.objectiveHits}/${nn.length}  Score ${Math.round(u.score)}${comboTag}`
    : `Score ${Math.round(u.score)}`;
  const s = u.mode === "race" || u.mode === "paused" || n;
  if (
    ((Qe.position.textContent = n
      ? u.vehicle === "foot"
        ? "ON FOOT"
        : u.vehicle === "heli"
          ? "HELICOPTER"
          : u.drivingStolen && stolenRide
            ? `${stolenRide.type.toUpperCase()} · STOLEN`
            : "FREE ROAM"
      : u.freeRun
        ? "FREE RUN"
        : u.practice
          ? "PRACTICE"
          : `${t} DIV ${seasonDivision()}`),
    n && nn.length)
  ) {
    const d = nn[u.objectiveIndex % nn.length];
    Qe.trackName.textContent = d ? `Next: ${d.label}` : "City Streets";
  }
  n && (u.heat || 0) >= 1 && (Qe.position.textContent += `  ${"★".repeat(Math.min(5, Math.ceil(u.heat)))}`);
  n &&
    jobSys.state === "active" &&
    (Qe.trackName.textContent = `Deliver the ${jobSys.type.toUpperCase()} · ${Math.max(0, Math.ceil(jobSys.timeLeft))}s`);
  ((Qe.hud.style.display = s ? "flex" : "none"),
    (Qe.raceStrip.style.display = u.mode === "race" || u.mode === "paused" ? "grid" : "none"),
    (Qe.touchControls.style.display = s ? "" : "none"),
    (Qe.playerProgress.style.width = `${Math.round(i * 100)}%`));
  for (const r of rivals)
    r.progEl && (r.progEl.style.width = `${Math.round((u.practice ? 0 : Th(r.distance)) * 100)}%`);
  const r = fv();
  u.gear = r.gear;
  const a = performance.now(),
    o = Math.min(0.05, (a - Nh) / 1e3);
  Nh = a;
  const c = 1 - Math.exp(-o * (r.rpm > u.tachRpm ? 10 : 6));
  ((u.tachRpm += (r.rpm - u.tachRpm) * c), xv(u.tachRpm, r.gear));
  const l = Math.abs(u.speed) * 2.25;
  ((Do += (l - Do) * (1 - Math.exp(-o * 8))),
    (Io += (u.boost - Io) * (1 - Math.exp(-o * 9))),
    pv(Do, u.speed < -0.5),
    mv(Io, u.boosting),
    (Qe.speedFx.style.opacity = Math.max(0, Math.min(0.18, (Math.abs(u.speed) - 44) / 150))),
    (Qe.damageFx.style.opacity = u.damage < 18 ? 0 : Math.min(0.72, (u.damage - 18) / 82)),
    u.mode === "paused"
      ? ((Qe.centerMessage.textContent = "Paused"), Qe.centerMessage.classList.remove("hidden"))
      : u.messageTimer > 0
        ? ((Qe.centerMessage.textContent = u.message), Qe.centerMessage.classList.remove("hidden"))
        : Qe.centerMessage.classList.add("hidden"));
}
function Dc(i) {
  const e = Math.floor(i / 60),
    t = i - e * 60;
  return `${String(e).padStart(2, "0")}:${t.toFixed(1).padStart(4, "0")}`;
}
// ─── Gamepad (standard mapping): left stick steers, RT/A throttle, LT/B brake,
// X handbrake, RB boost, Y enter/exit vehicles, Start pause/back. Feeds the same
// input paths as touch (Fe) and keyboard (_t), so every mode just works. ───
const pad = { active: !1, prev: {} };
function pollGamepad() {
  let g = null;
  if (navigator.getGamepads) for (const c of navigator.getGamepads()) if (c && c.connected) { g = c; break; }
  if (!g) {
    if (pad.active) {
      ((pad.active = !1), (Fe.steer = 0), (Fe.throttle = 0), (Fe.brake = 0));
      for (const k of ["Space", "ShiftLeft"]) pad.prev[k] && (_t.delete(k), (pad.prev[k] = !1));
    }
    return;
  }
  const dz = (v) => (Math.abs(v) < 0.14 ? 0 : v),
    steer = dz(g.axes[0] || 0),
    th = Math.max(g.buttons[7]?.value || 0, g.buttons[0]?.pressed ? 1 : 0),
    br = Math.max(g.buttons[6]?.value || 0, g.buttons[1]?.pressed ? 1 : 0),
    hb = !!g.buttons[2]?.pressed,
    act = !!g.buttons[3]?.pressed,
    boost = !!g.buttons[5]?.pressed,
    start = !!g.buttons[9]?.pressed;
  if (!pad.active && !steer && !th && !br && !hb && !act && !boost && !start) return;
  (pad.active || La(), (pad.active = !0));
  ((Fe.steer = steer), (Fe.throttle = th), (Fe.brake = br));
  const setKey = (code, on) => {
    (on && !pad.prev[code] ? _t.add(code) : !on && pad.prev[code] && _t.delete(code), (pad.prev[code] = on));
  };
  (setKey("Space", hb), setKey("ShiftLeft", boost));
  (act && !pad.prev.actB && u.mode === "roam" && handleVehicleAction(), (pad.prev.actB = act));
  (start &&
    !pad.prev.startB &&
    window.dispatchEvent(new KeyboardEvent("keydown", { code: u.mode === "race" || u.mode === "paused" ? "KeyP" : "Escape" })),
    (pad.prev.startB = start));
}
function nu() {
  Qt.info.reset();
  pollGamepad();
  const i = p1.getDelta();
  let e = Math.min(0.033, i);
  // Stunt slow-mo: ramp launches dilate time briefly; the timer burns in real time.
  u.sloMoT > 0 && ((u.sloMoT = Math.max(0, u.sloMoT - e)), (e *= 0.42));
  (u.messageTimer > 0 && (u.messageTimer -= e),
    u.mode === "roam"
      ? ((u.vehicle === "foot" ? walkerUpdate(e) : u.vehicle === "heli" ? heliUpdate(e) : $d(e)),
        jd(e),
        publishRoamTelemetry())
      : u.mode === "menu"
        ? (uv(e), menuCinematic(e))
        : (eu(e), uv(e), updateTrackCarPose(), updateGhost(), dl(e)),
    updateGateBeam(),
    updateMinimap(),
    skyDome && skyDome.position.copy(Xe.position),
    tv(e),
    zd(e),
    vr(),
    nv(),
    (lr.uniforms.uTime.value += e),
    waterMats.forEach((wm) => (wm.uniforms.uTime.value += e)),
    (lr.uniforms.uSpeed.value = Math.min(1, Math.abs(u.speed) / 150)));
  const n =
    (_t.has("ShiftLeft") || _t.has("ShiftRight")) && u.boost > 0.02 && (u.mode === "race" || u.mode === "roam")
      ? 1
      : Math.min(0.75, u.roamSlip * 0.55 + u.collisionDrama * 0.6);
  ((lr.uniforms.uBoost.value += (n - lr.uniforms.uBoost.value) * Math.min(1, e * 6)),
    Ws.render(),
    (qe.renderCalls = Qt.info.render.calls),
    (qe.renderTris = Qt.info.render.triangles),
    requestAnimationFrame(nu));
}
window.addEventListener("keydown", (i) => {
  (_t.add(i.code),
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(i.code) && i.preventDefault(),
    i.code === "KeyC" &&
      (u.mode === "race" || u.mode === "paused"
        ? toggleTrackView()
        : u.mode === "roam" && u.vehicle !== "foot" && toggleRoamView()),
    i.code === "KeyE" && handleVehicleAction(),
    i.code === "KeyN" && cycleTod(),
    i.code === "KeyV" && cycleWeather(),
    i.code === "KeyP" && u.mode === "race"
      ? ((u.mode = "paused"), _t.clear(), Ia())
      : i.code === "KeyP" && u.mode === "paused"
        ? (u.mode = "race")
        : i.code === "Escape" &&
          (u.mode === "race" || u.mode === "paused" || u.mode === "roam") &&
          ((u.mode = "menu"),
          Ia(),
          (cn.visible = !1),
          qn && (qn.visible = !0),
          document.body.classList.remove("roam-mode"),
          applyTrackViewClass(),
          Qe.menu.classList.remove("hidden")));
});
window.addEventListener("keyup", (i) => _t.delete(i.code));
window.addEventListener("resize", () => {
  ((Xe.aspect = window.innerWidth / window.innerHeight),
    Xe.updateProjectionMatrix(),
    Qt.setSize(window.innerWidth, window.innerHeight),
    Ws.setSize(window.innerWidth, window.innerHeight),
    Hd.setSize(window.innerWidth, window.innerHeight));
});
// Audio starts on the first user gesture (autoplay policy); menu music fades in right after.
const startAudioOnce = () => {
  (La(),
    window.removeEventListener("pointerdown", startAudioOnce),
    window.removeEventListener("keydown", startAudioOnce));
};
window.addEventListener("pointerdown", startAudioOnce);
window.addEventListener("keydown", startAudioOnce);
const volBtn = document.createElement("button");
((volBtn.id = "volBtn"), (volBtn.type = "button"));
function refreshVolLabel() {
  volBtn.textContent = Number(localStorage.getItem("steel-ribbon-vol") ?? 0.8) <= 0.001 ? "🔇 Sound off" : "🔊 Sound on";
}
refreshVolLabel();
volBtn.addEventListener("click", (ev) => {
  ev.stopPropagation();
  const v = Number(localStorage.getItem("steel-ribbon-vol") ?? 0.8) <= 0.001 ? 0.8 : 0;
  (localStorage.setItem("steel-ribbon-vol", String(v)),
    mi && mi.master.gain.setTargetAtTime(v, mi.ctx.currentTime, 0.05),
    refreshVolLabel());
});
const menuToggles = document.querySelector("#menuToggles") || Qe.menu;
menuToggles.appendChild(volBtn);
const musicBtn = document.createElement("button");
((musicBtn.id = "musicBtn"), (musicBtn.type = "button"));
function refreshMusicLabel() {
  musicBtn.textContent = localStorage.getItem("steel-ribbon-music") !== "0" ? "🎵 Music on" : "🎵 Music off";
}
refreshMusicLabel();
musicBtn.addEventListener("click", (ev) => {
  ev.stopPropagation();
  const on = localStorage.getItem("steel-ribbon-music") !== "0";
  (localStorage.setItem("steel-ribbon-music", on ? "0" : "1"), La(), refreshMusicLabel());
});
menuToggles.appendChild(musicBtn);
// Touch action button: enter/exit vehicles in free roam.
const actionBtn = document.createElement("button");
((actionBtn.id = "actionBtn"), (actionBtn.type = "button"), (actionBtn.textContent = "E"));
actionBtn.addEventListener("pointerdown", (ev) => {
  (ev.preventDefault(), La(), handleVehicleAction());
});
Qe.touchControls.appendChild(actionBtn);
// Car garage selector — four models, persisted choice.
const carSel = document.createElement("div");
carSel.className = "course-select";
carSel.innerHTML = `<span>Car — <b id="carName"></b></span><div class="course-buttons" id="carButtons"></div>`;
Qe.freeRunBtn.parentNode.insertBefore(carSel, Qe.freeRunBtn);
const carBtns = [];
CAR_MODELS.forEach((m, k) => {
  const b = document.createElement("button");
  ((b.className = "course-btn"), (b.type = "button"), (b.textContent = String(k + 1)), (b.title = `${m.label} — ${m.trait}`));
  b.addEventListener("click", () => applyCarSelection(k));
  (carSel.querySelector("#carButtons").appendChild(b), carBtns.push(b));
});
function refreshCarUI() {
  const m = CAR_MODELS[carModelIndex],
    el = document.querySelector("#carName");
  (el && (el.textContent = `${m.label} · ${m.trait}`),
    carBtns.forEach((b, k) => b.classList.toggle("active", k === carModelIndex)));
}
refreshCarUI();
// Season-aware race strip: one progress row per driver.
Qe.raceStrip.innerHTML =
  `<span>YOU<i id="playerProgress"></i></span>` +
  rivals.map((r) => `<span>${r.label.slice(0, 4).toUpperCase()}<i id="prog-${r.key}"></i></span>`).join("");
Qe.playerProgress = document.querySelector("#playerProgress");
rivals.forEach((r) => (r.progEl = document.querySelector(`#prog-${r.key}`)));
function refreshSeasonUI() {
  const div = seasonDivision();
  Qe.startBtn.textContent = season?.active
    ? `Continue Season — Race ${season.raceIndex + 1}/4`
    : `Start Season (Div ${div})`;
  const box = document.querySelector("#menu .league");
  if (box) {
    const rows = seasonStandings();
    box.innerHTML =
      `<span>Division ${divisionName(div)}${season?.active ? ` — after race ${season.raceIndex}/4` : ""}</span>` +
      rows.map((r, k) => `<b>${k + 1}. ${r.label}${season ? ` — ${r.pts} pts` : ""}</b>`).join("");
  }
}
function returnToMenu() {
  u.mode === "roam" &&
    u.score > 800 &&
    submitScore("roam", u.score, {
      deliveries: qe.deliveries || 0,
      stunts: qe.stunts || 0,
      busts: qe.busts || 0,
    });
  ((u.mode = "menu"),
    Ia(),
    (cn.visible = !1),
    qn && (qn.visible = !0),
    setRivalsVisible(!1),
    document.body.classList.remove("roam-mode"),
    applyTrackViewClass(),
    refreshSeasonUI(),
    Qe.result.classList.add("hidden"),
    Qe.menu.classList.remove("hidden"));
}
refreshSeasonUI();
Qe.startBtn.addEventListener("click", () => {
  ((season && season.active) || newSeason(), cl(MathUtils.clamp(season.raceIndex, 0, 3)), Va(!1, !1, !0));
});
Qe.practiceBtn.addEventListener("click", () => Va(!0));
Qe.freeRunBtn.addEventListener("click", () => Va(!0, !0));
Qe.roamBtn.addEventListener("click", () => Yd());
Qe.againBtn.addEventListener("click", () => {
  u.seasonRace && season
    ? season.active && season.raceIndex < 4
      ? (cl(season.raceIndex), Va(!1, !1, !0))
      : returnToMenu()
    : Va(!1);
});
Qe.courseButtons.forEach((i) => {
  i.addEventListener("click", () => cl(Number(i.dataset.course)));
});
function iu(i) {
  i && (i.classList.remove("active"), i.style.setProperty("--stick-x", "0px"), i.style.setProperty("--stick-y", "0px"));
}
function Ia() {
  ((Fe.steer = 0),
    (Fe.throttle = 0),
    (Fe.brake = 0),
    (Fe.lookX = 0),
    (Fe.lookY = 0),
    (Fe.zoom = 0),
    (Fe.lookPointer = null),
    (Fe.drivePointer = null),
    (Fe.pinchStartDistance = 0),
    (Fe.pinchStartZoom = 0));
  for (const i of Qe.touchControls.querySelectorAll(".touch-stick")) iu(i);
}
function fa(i, e) {
  const t = i.getBoundingClientRect(),
    n = Math.min(t.width, t.height) * 0.36;
  if (!(n > 0)) return;
  const s = MathUtils.clamp(e.clientX - (t.left + t.width / 2), -n, n),
    r = MathUtils.clamp(e.clientY - (t.top + t.height / 2), -n, n),
    a = i.dataset.stick;
  if ((i.classList.add("active"), a === "look"))
    ((Fe.lookX = MathUtils.clamp(s / n, -1, 1)),
      (Fe.lookY = MathUtils.clamp(-r / n, -1, 1)),
      i.style.setProperty("--stick-x", `${Math.round(Fe.lookX * n)}px`),
      i.style.setProperty("--stick-y", `${Math.round(-Fe.lookY * n)}px`));
  else {
    const o = MathUtils.clamp(s / n, -1, 1),
      c = MathUtils.clamp(-r / n, -1, 1);
    ((Fe.steer = o),
      (Fe.throttle = Math.max(0, c)),
      (Fe.brake = Math.max(0, -c)),
      i.style.setProperty("--stick-x", `${Math.round(o * n)}px`),
      i.style.setProperty("--stick-y", `${Math.round(-c * n)}px`));
  }
}
function Oh(i, e) {
  return Array.from(i.changedTouches).find((t) => t.identifier === e);
}
function Bh(i, e) {
  (e === "look"
    ? ((Fe.lookX = 0), (Fe.lookY = 0), (Fe.lookPointer = null))
    : ((Fe.steer = 0), (Fe.throttle = 0), (Fe.brake = 0), (Fe.drivePointer = null)),
    iu(i));
}
function gv(i, e) {
  return Math.hypot(i.clientX - e.clientX, i.clientY - e.clientY);
}
function su(i, e = !1) {
  if (i.touches.length < 2) {
    Fe.pinchStartDistance = 0;
    return;
  }
  const t = gv(i.touches[0], i.touches[1]);
  if (e || !(Fe.pinchStartDistance > 0)) {
    ((Fe.pinchStartDistance = t), (Fe.pinchStartZoom = Fe.zoom));
    return;
  }
  const n = Math.max(0.2, t / Fe.pinchStartDistance);
  Fe.zoom = MathUtils.clamp(Fe.pinchStartZoom - Math.log(n) * 1.15, -0.42, 0.9);
}
for (const i of Qe.touchControls.querySelectorAll(".touch-stick")) {
  const e = i.dataset.stick;
  (i.addEventListener(
    "pointerdown",
    (s) => {
      (s.preventDefault(),
        La(),
        u.mode === "paused" && (u.mode = "race"),
        e === "look" && (Fe.lookPointer = s.pointerId),
        e === "drive" && (Fe.drivePointer = s.pointerId),
        fa(i, s));
    },
    { passive: !1 },
  ),
    i.addEventListener(
      "pointermove",
      (s) => {
        (e === "look" ? Fe.lookPointer : Fe.drivePointer) === s.pointerId && (s.preventDefault(), fa(i, s));
      },
      { passive: !1 },
    ));
  const t = (s) => {
    (e === "look" ? Fe.lookPointer : Fe.drivePointer) === s.pointerId && Bh(i, e);
  };
  (i.addEventListener("pointerup", t),
    i.addEventListener("pointercancel", t),
    i.addEventListener(
      "touchstart",
      (s) => {
        (s.preventDefault(), La(), u.mode === "paused" && (u.mode = "race"));
        const r = s.changedTouches[0];
        r &&
          (e === "look" && (Fe.lookPointer = r.identifier),
          e === "drive" && (Fe.drivePointer = r.identifier),
          fa(i, r));
      },
      { passive: !1 },
    ),
    i.addEventListener(
      "touchmove",
      (s) => {
        const r = e === "look" ? Fe.lookPointer : Fe.drivePointer,
          a = Oh(s, r);
        a && (s.preventDefault(), fa(i, a));
      },
      { passive: !1 },
    ));
  const n = (s) => {
    const r = e === "look" ? Fe.lookPointer : Fe.drivePointer;
    Oh(s, r) && (s.preventDefault(), Bh(i, e));
  };
  (i.addEventListener("touchend", n, { passive: !1 }), i.addEventListener("touchcancel", n, { passive: !1 }));
}
for (const i of Qe.touchControls.querySelectorAll("button")) {
  const e = i.dataset.code;
  i.addEventListener("pointerdown", (n) => {
    (n.preventDefault(), La(), _t.add(e), i.setPointerCapture(n.pointerId));
  });
  const t = () => _t.delete(e);
  (i.addEventListener("pointerup", t),
    i.addEventListener("pointercancel", t),
    i.addEventListener("lostpointercapture", t));
}
Lr.addEventListener(
  "touchstart",
  (i) => {
    i.touches.length >= 2 && (i.preventDefault(), su(i, !0));
  },
  { passive: !1 },
);
Lr.addEventListener(
  "touchmove",
  (i) => {
    i.touches.length >= 2 && (i.preventDefault(), su(i));
  },
  { passive: !1 },
);
Lr.addEventListener(
  "touchend",
  (i) => {
    i.touches.length < 2 && (Fe.pinchStartDistance = 0);
  },
  { passive: !1 },
);
Lr.addEventListener(
  "touchcancel",
  () => {
    Fe.pinchStartDistance = 0;
  },
  { passive: !1 },
);
// ─── Weather: clear or rain. Rain streaks follow the camera, the sky flattens to
// overcast, lights dim, fog closes in, the asphalt turns to mirror and grip drops. ───
var weatherAmt = 0;
function weatherWet() {
  return weatherAmt;
}
let weatherMode = localStorage.getItem("steel-ribbon-weather") || "clear";
weatherMode === "rain" || (weatherMode = "clear");
const RAIN_COUNT = 420,
  rainSeed = [];
for (let k = 0; k < RAIN_COUNT; k++)
  rainSeed.push({ x: (Math.random() - 0.5) * 130, y: Math.random() * 90, z: (Math.random() - 0.5) * 130 });
const rainGeo = new BufferGeometry();
rainGeo.setAttribute("position", new Float32BufferAttribute(new Float32Array(RAIN_COUNT * 6), 3));
const rainMat = new LineBasicMaterial({ color: 10203340, transparent: !0, opacity: 0, depthWrite: !1 }),
  rainLines = new LineSegments(rainGeo, rainMat);
((rainLines.frustumCulled = !1), (rainLines.renderOrder = 40), (rainLines.visible = !1), et.add(rainLines));
Bn(new Object3D(), (tt, dt) => {
  const target = weatherMode === "rain" ? 1 : 0;
  weatherAmt += (target - weatherAmt) * Math.min(1, dt * 1.3);
  target === 0 && weatherAmt < 0.01 && (weatherAmt = 0);
  ((rainLines.visible = weatherAmt > 0.02), (rainMat.opacity = 0.34 * weatherAmt));
  if (rainLines.visible) {
    rainLines.position.copy(Xe.position);
    const arr = rainGeo.attributes.position.array;
    for (let k = 0; k < RAIN_COUNT; k++) {
      const s = rainSeed[k];
      ((s.y -= 96 * dt), s.y < -8 && (s.y += 98));
      const o = k * 6;
      ((arr[o] = s.x),
        (arr[o + 1] = s.y),
        (arr[o + 2] = s.z),
        (arr[o + 3] = s.x + 0.3),
        (arr[o + 4] = s.y - 1.7),
        (arr[o + 5] = s.z));
    }
    rainGeo.attributes.position.needsUpdate = !0;
  }
  if (todRefs.roadMat) {
    ((todRefs.roadMat.roughness = 0.62 - 0.37 * weatherAmt),
      (todRefs.roadMat.metalness = 0.1 + 0.26 * weatherAmt),
      (todRefs.roadMat.envMapIntensity = 0.8 + 0.9 * weatherAmt));
  }
});
function cycleWeather() {
  ((weatherMode = weatherMode === "rain" ? "clear" : "rain"),
    localStorage.setItem("steel-ribbon-weather", weatherMode),
    refreshWeatherLabel(),
    (u.message = weatherMode === "rain" ? "Rain rolling in" : "Skies clearing"),
    (u.messageTimer = 1.2));
}
const weatherBtn = document.createElement("button");
((weatherBtn.id = "weatherBtn"), (weatherBtn.type = "button"));
function refreshWeatherLabel() {
  weatherBtn.textContent = weatherMode === "rain" ? "🌧 Rain" : "☀ Clear";
}
refreshWeatherLabel();
weatherBtn.addEventListener("click", (ev) => {
  (ev.stopPropagation(), cycleWeather());
});
(document.querySelector("#menuToggles") || Qe.menu).appendChild(weatherBtn);

// ─── Time of day: dusk (default) / night / day / slow cycle. Blends the sky shader
// palettes, the light rig, fog, sun disc and clouds. Streetlamps and windows stay lit —
// they carry the night look and read as arcade charm in daylight. ───
const TOD_MODES = ["dusk", "night", "day", "cycle"],
  TOD_ICONS = { dusk: "🌇", night: "🌃", day: "🌞", cycle: "🔁" };
let todMode = localStorage.getItem("steel-ribbon-tod") || "dusk";
TOD_MODES.includes(todMode) || (todMode = "dusk");
let todDay = 0,
  todNight = 0,
  todCycleT = 95; // cycle starts near dusk
const todA = new Color(),
  todB = new Color(),
  todOut = new Color();
function todMixC(dusk, day, night, d, n) {
  return todOut.set(dusk).lerp(todA.set(day), d).lerp(todB.set(night), n);
}
const todMixN = (dusk, day, night, d, n) => dusk + (day - dusk) * d + (night - dusk) * n;
(() => {
  // tint cloud sprites per time of day — they're unlit, so night needs a manual dim
  et.traverse((o) => {
    o.isSprite && o.renderOrder === -50 && todRefs.cloudMats.push(o.material);
  });
})();
function todApply(d, n) {
  if (!todRefs.skyU) return;
  const w = weatherWet();
  ((todRefs.skyU.uDay.value = d), (todRefs.skyU.uNight.value = n), (todRefs.skyU.uRain.value = w));
  const R = todRefs;
  (R.hemi.color.copy(todMixC(16757626, 12573183, 2371663, d, n)),
    R.hemi.groundColor.copy(todMixC(3097190, 5925464, 789534, d, n)),
    (R.hemi.intensity = todMixN(0.66, 0.95, 0.22, d, n) * (1 - 0.38 * w)));
  (R.fill.color.copy(todMixC(7179775, 13096432, 2240591, d, n)),
    (R.fill.intensity = todMixN(0.6, 0.5, 0.16, d, n) * (1 - 0.3 * w)));
  (R.key.color.copy(todMixC(16752724, 16774880, 10336511, d, n)),
    (R.key.intensity = todMixN(2.3, 2.6, 0.45, d, n) * (1 - 0.5 * w)));
  R.rim.intensity = todMixN(0.5, 0.3, 0.1, d, n) * (1 - 0.4 * w);
  (et.fog.color.copy(todMixC(14719602, 12834794, 723741, d, n).lerp(todB.set(5923950), 0.6 * w)),
    (et.fog.near = todMixN(360, 430, 300, d, n) * (1 - 0.45 * w)),
    (et.fog.far = todMixN(2150, 2600, 1650, d, n) * (1 - 0.35 * w)));
  (R.sunMat.color.copy(todMixC(16764250, 16777198, 14542591, d, n)),
    (R.sunMat.opacity = todMixN(0.92, 0.95, 0.5, d, n) * (1 - 0.85 * w)));
  for (const g of R.glowMats) g.mat.opacity = todMixN(g.dusk, g.dusk * 0.55, g.dusk * 0.18, d, n) * (1 - 0.7 * w);
  const ct = todMixC(16777215, 16777215, 3687001, d, n).lerp(todB.set(4147533), 0.65 * w);
  for (const m of R.cloudMats) m.color.copy(ct);
}
Bn(new Object3D(), (tt, dt) => {
  let dT = 0,
    nT = 0;
  if (todMode === "day") dT = 1;
  else if (todMode === "night") nT = 1;
  else if (todMode === "cycle") {
    todCycleT = (todCycleT + dt) % 270;
    const p = todCycleT;
    p < 60
      ? (dT = 1)
      : p < 90
        ? (dT = 1 - (p - 60) / 30)
        : p < 120
          ? 0
          : p < 150
            ? (nT = (p - 120) / 30)
            : p < 210
              ? (nT = 1)
              : p < 240
                ? (nT = 1 - (p - 210) / 30)
                : (dT = (p - 240) / 30);
  }
  const k = Math.min(1, dt * 1.4);
  ((todDay += (dT - todDay) * k), (todNight += (nT - todNight) * k), todApply(todDay, todNight));
});
function cycleTod() {
  ((todMode = TOD_MODES[(TOD_MODES.indexOf(todMode) + 1) % TOD_MODES.length]),
    localStorage.setItem("steel-ribbon-tod", todMode),
    refreshTodLabel(),
    (u.message = `Time of day: ${todMode.toUpperCase()}`),
    (u.messageTimer = 1.2));
}
const todBtn = document.createElement("button");
((todBtn.id = "todBtn"), (todBtn.type = "button"));
function refreshTodLabel() {
  todBtn.textContent = `${TOD_ICONS[todMode]} ${todMode[0].toUpperCase()}${todMode.slice(1)}`;
}
refreshTodLabel();
todBtn.addEventListener("click", (ev) => {
  (ev.stopPropagation(), cycleTod());
});
(document.querySelector("#menuToggles") || Qe.menu).appendChild(todBtn);

// ─── Menu panels: online cruise + global leaderboards (shared site services) ───
const menuMainEl = document.querySelector("#menuMain"),
  onlinePanelEl = document.querySelector("#onlinePanel"),
  scoresPanelEl = document.querySelector("#scoresPanel");
function showMenuPanel(which) {
  menuMainEl &&
    (menuMainEl.classList.toggle("hidden", !!which),
    onlinePanelEl.classList.toggle("hidden", which !== "online"),
    scoresPanelEl.classList.toggle("hidden", which !== "scores"));
}
// Leaderboards on the site's game-scores worker (the same service Vector Arena uses).
const SCORE_APIS = {
  lap: "https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-laps-v1",
  roam: "https://game-scores.jez237.workers.dev/scores/steel-ribbon-racer-roam-v1",
};
const INITIALS_KEY = "steel-ribbon-initials",
  initialsInput = document.querySelector("#initials");
if (initialsInput) {
  initialsInput.value = localStorage.getItem(INITIALS_KEY) || "";
  initialsInput.addEventListener("input", () => {
    ((initialsInput.value = initialsInput.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3)),
      localStorage.setItem(INITIALS_KEY, initialsInput.value));
  });
}
function playerInitials() {
  return (localStorage.getItem(INITIALS_KEY) || "").slice(0, 3);
}
let boardMode = "lap";
async function fetchBoard(mode) {
  try {
    const ctl = new AbortController(),
      timer = setTimeout(() => ctl.abort(), 7000),
      res = await fetch(SCORE_APIS[mode], { signal: ctl.signal, cache: "no-store" });
    clearTimeout(timer);
    const data = await res.json(),
      rows = Array.isArray(data) ? data : data.scores || [];
    return rows
      .filter((r) => Number(r.score) > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  } catch {
    return null;
  }
}
async function submitScore(mode, score, extra = {}) {
  const initials = playerInitials();
  if (!initials || !(score > 0)) return !1;
  try {
    const ctl = new AbortController(),
      timer = setTimeout(() => ctl.abort(), 7000);
    await fetch(SCORE_APIS[mode], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initials, score: Math.max(0, Math.floor(score)), extra }),
      signal: ctl.signal,
    });
    (clearTimeout(timer), (qe.scoresPosted = (qe.scoresPosted || 0) + 1));
    return !0;
  } catch {
    return !1;
  }
}
async function renderBoard() {
  const el = document.querySelector("#scoreBoard");
  if (!el) return;
  el.textContent = "Loading…";
  const rows = await fetchBoard(boardMode);
  if (!rows) {
    el.textContent = "Leaderboard unreachable — try again later.";
    return;
  }
  if (!rows.length) {
    el.textContent = "No entries yet — set your initials and claim the first spot.";
    return;
  }
  el.innerHTML = rows
    .map((r, k) => {
      const nm = String(r.initials || r.name || "???").slice(0, 3),
        val =
          boardMode === "lap"
            ? r.extra?.time
              ? `${Number(r.extra.time).toFixed(2)}s — ${r.extra.course || "?"}`
              : Math.round(r.score)
            : Math.round(r.score).toLocaleString();
      return `<div class="score-row"><i>${k + 1}</i><b>${nm}</b><span>${val}</span></div>`;
    })
    .join("");
}
for (const [id, mode] of [
  ["#lapBoardBtn", "lap"],
  ["#roamBoardBtn", "roam"],
]) {
  const b = document.querySelector(id);
  b &&
    b.addEventListener("click", () => {
      ((boardMode = mode),
        document.querySelector("#lapBoardBtn")?.classList.toggle("active-board", mode === "lap"),
        document.querySelector("#roamBoardBtn")?.classList.toggle("active-board", mode === "roam"),
        renderBoard());
    });
}
document.querySelector("#scoresBtn")?.addEventListener("click", () => (showMenuPanel("scores"), renderBoard()));
document.querySelector("#scoresBackBtn")?.addEventListener("click", () => showMenuPanel(null));

// ─── Online cruise: shared-room presence over the site's relay worker. Everyone in a
// room sees each other's car (or walker) with a name tag — arcade ghosts, no collisions. ───
const MP_WS_BASE = "wss://iron-ridge-online.jez237.workers.dev/ws",
  MP_ROOM_KEY = "steel-ribbon-mp-room",
  MP_NAME_KEY = "steel-ribbon-mp-name",
  mp = { ws: null, connected: !1, id: null, room: "", name: "", peers: new Map(), lastState: 0, lastPing: 0, manual: !1 };
const mpClean = (v, fb, max) =>
  String(v || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, max) || fb;
function mpRandomRoom() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  const b = new Uint8Array(5);
  crypto.getRandomValues(b);
  for (const x of b) s += chars[x % chars.length];
  return s;
}
function mpStatus(t) {
  const el = document.querySelector("#mpStatus");
  el && (el.textContent = t);
}
function mpNameSprite(name) {
  const c = document.createElement("canvas");
  ((c.width = 256), (c.height = 64));
  const x = c.getContext("2d");
  (x.clearRect(0, 0, 256, 64),
    (x.fillStyle = "rgba(10, 16, 26, 0.78)"),
    x.fillRect(14, 10, 228, 42),
    (x.strokeStyle = "rgba(140, 200, 255, 0.9)"),
    (x.lineWidth = 3),
    x.strokeRect(14, 10, 228, 42),
    (x.fillStyle = "#d8ecff"),
    (x.font = "800 24px system-ui, sans-serif"),
    (x.textAlign = "center"),
    (x.textBaseline = "middle"),
    x.fillText(name, 128, 32, 208));
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  const sp = new Sprite(new SpriteMaterial({ map: tex, transparent: !0, depthTest: !1 }));
  return (sp.scale.set(7.4, 1.85, 1), sp);
}
function mpEnsurePeer(id, name) {
  let p = mp.peers.get(id);
  if (!p) {
    p = { id, name: name || "DRIVER", hue: [...id].reduce((a, ch) => a + ch.charCodeAt(0), 0), tx: 0, ty: 0, tz: 0, tyaw: 0, v: "car", has: !1, lastSeen: performance.now() };
    mp.peers.set(id, p);
  }
  name && (p.name = name);
  return p;
}
function mpEnsureMeshes(p) {
  if (p.car) return;
  ((p.car = I1("compact", [16739693, 5163247, 16770048, 9498256, 3531007][p.hue % 5])),
    (p.car.userData.stolenYOff = 0.57),
    et.add(p.car),
    (p.walker = U1(9464783, 4149685)),
    (p.walker.visible = !1),
    et.add(p.walker),
    (p.label = mpNameSprite(p.name)),
    et.add(p.label));
}
function mpRemovePeer(p) {
  (p.car && removeVehicleMesh(p.car),
    p.walker && removeVehicleMesh(p.walker),
    p.label && (p.label.material.map?.dispose(), p.label.material.dispose(), et.remove(p.label)),
    mp.peers.delete(p.id));
}
function mpDisconnect(manual = !0) {
  mp.manual = manual;
  if (mp.ws) {
    try {
      mp.ws.close(1000, "leave");
    } catch {}
  }
  ((mp.ws = null), (mp.connected = !1), (mp.id = null));
  for (const p of [...mp.peers.values()]) mpRemovePeer(p);
  (mpStatus("Not connected."), mpUiState());
}
function mpConnect() {
  mpDisconnect(!0);
  const name = mpClean(document.querySelector("#mpName")?.value, "DRIVER", 12),
    room = mpClean(document.querySelector("#mpRoom")?.value, "", 10) || mpRandomRoom(),
    input = document.querySelector("#mpRoom");
  input && (input.value = room);
  (localStorage.setItem(MP_ROOM_KEY, room), localStorage.setItem(MP_NAME_KEY, name));
  ((mp.room = room), (mp.name = name), (mp.manual = !1));
  mpStatus(`Connecting to ${room}…`);
  let ws;
  try {
    ws = new WebSocket(`${MP_WS_BASE}/${encodeURIComponent(`SRR-${room}`)}`);
  } catch {
    mpStatus("Connection failed.");
    return;
  }
  mp.ws = ws;
  ws.onopen = () => {
    ((mp.connected = !0), ws.send(JSON.stringify({ type: "hello", name })), mpStatus(`Room ${room} — connected`), mpUiState());
  };
  ws.onclose = () => {
    mp.ws === ws && (mpDisconnect(!0), mpStatus(mp.manual ? "Not connected." : "Connection dropped."));
  };
  ws.onerror = () => mpStatus("Connection failed — try again.");
  ws.onmessage = (ev) => {
    let d;
    try {
      d = JSON.parse(ev.data);
    } catch {
      return;
    }
    if (d.type === "welcome") {
      ((mp.id = d.id), mpStatus(`Room ${mp.room} — ${Math.max(1, Number(d.count) || 1)} cruising`));
      return;
    }
    if (d.type === "peers") {
      const live = new Set((d.peers || []).filter((p) => p.id !== mp.id).map((p) => p.id));
      for (const p of [...mp.peers.values()]) live.has(p.id) || mpRemovePeer(p);
      for (const p of d.peers || []) {
        if (!p.id || p.id === mp.id) continue;
        const known = mp.peers.has(p.id);
        mpEnsurePeer(p.id, mpClean(p.name, "DRIVER", 12));
        known ||
          (u.mode === "roam" && ((u.message = `${mpClean(p.name, "DRIVER", 12)} joined the cruise`), (u.messageTimer = 1.6)));
      }
      mpStatus(`Room ${mp.room} — ${mp.peers.size + 1} cruising`);
      return;
    }
    if (!d.from || d.from === mp.id) return;
    if (d.type === "state" && d.state) {
      const p = mpEnsurePeer(d.from, d.name && mpClean(d.name, "DRIVER", 12));
      ((p.tx = Number(d.state.x) || 0),
        (p.ty = Number(d.state.y) || 0),
        (p.tz = Number(d.state.z) || 0),
        (p.tyaw = Number(d.state.yaw) || 0),
        (p.v = d.state.v === "foot" ? "foot" : "car"),
        (p.lastSeen = performance.now()),
        p.has || (mpEnsureMeshes(p), p.car.position.set(p.tx, p.ty, p.tz), (p.has = !0)));
    }
  };
}
function mpUiState() {
  const j = document.querySelector("#mpJoinBtn"),
    l = document.querySelector("#mpLeaveBtn");
  (j && (j.textContent = mp.connected ? "Switch Room" : "Join Room"), l && l.classList.toggle("hidden", !mp.connected));
}
{
  const nameEl = document.querySelector("#mpName"),
    roomEl = document.querySelector("#mpRoom");
  (nameEl && (nameEl.value = localStorage.getItem(MP_NAME_KEY) || ""),
    roomEl && (roomEl.value = localStorage.getItem(MP_ROOM_KEY) || ""));
  (document.querySelector("#onlineBtn")?.addEventListener("click", () => showMenuPanel("online")),
    document.querySelector("#onlineBackBtn")?.addEventListener("click", () => showMenuPanel(null)),
    document.querySelector("#mpJoinBtn")?.addEventListener("click", mpConnect),
    document.querySelector("#mpLeaveBtn")?.addEventListener("click", () => mpDisconnect(!0)));
  mpUiState();
}
Bn(new Object3D(), (tt, dt) => {
  if (!mp.connected) return;
  const now = performance.now();
  // remote ghosts: lerp toward the last packet, hop between car and walker
  for (const p of [...mp.peers.values()]) {
    if (!p.has) continue;
    if (now - p.lastSeen > 12000) {
      mpRemovePeer(p);
      continue;
    }
    const k = 1 - Math.exp(-10 * dt),
      car = p.v !== "foot";
    ((p.car.visible = car), (p.walker.visible = !car));
    const m = car ? p.car : p.walker;
    (m.position.lerp(Id.set(p.tx, p.ty - (car ? 0.25 : 0.5), p.tz), k), (m.rotation.y = -p.tyaw));
    p.label.position.set(m.position.x, m.position.y + (car ? 3.4 : 3), m.position.z);
    if (car) for (const wh of p.car.userData.wheels || []) wh.rotation.x -= 20 * dt;
  }
  // heartbeat + state broadcast
  (now - mp.lastPing > 5000 && ((mp.lastPing = now), mp.ws?.readyState === 1 && mp.ws.send(JSON.stringify({ type: "ping", t: now }))),
    u.mode === "roam" &&
      now - mp.lastState > 95 &&
      mp.ws?.readyState === 1 &&
      ((mp.lastState = now),
      mp.ws.send(
        JSON.stringify({
          type: "state",
          name: mp.name,
          state: {
            x: +u.roamPos.x.toFixed(1),
            y: +u.roamPos.y.toFixed(1),
            z: +u.roamPos.z.toFixed(1),
            yaw: +u.roamYaw.toFixed(2),
            v: u.vehicle === "foot" ? "foot" : "car",
          },
        }),
      )));
  qe.mpPeers = mp.peers.size;
});

// ─── Static-scenery merge: fold thousands of small static decor meshes (road dashes,
// lamp posts, window trims, pylon parts...) into one mesh per material+shadow-class.
// Dynamic objects are excluded: animated Bn subtrees, gates, traffic/peds (userData
// wheels/limbs/frontWheels), player/walker/heli/ghost, hidden particle pools, and any
// transparent/additive/shader material (sorting would break). Material-level animations
// (signal lamps, beacons) keep working — merged meshes reuse the same material instance.
function mergeStaticScenery() {
  const excluded = new Set(),
    markSub = (o) => o && o.traverse((x) => excluded.add(x)),
    subtreeMeshCount = (o) => {
      let c = 0;
      return (o.traverse((x) => x.isMesh && c++), c);
    };
  for (const b of Bd)
    b.obj && b.obj.parent && subtreeMeshCount(b.obj) <= 300 && markSub(b.obj);
  for (const g of nn) markSub(g.marker);
  (markSub(cn),
    markSub(walker),
    typeof qn < "u" && markSub(qn),
    typeof ghostMesh < "u" && markSub(ghostMesh),
    heli && markSub(heli.mesh),
    typeof skyDome < "u" && markSub(skyDome),
    typeof gateBeam < "u" && gateBeam && markSub(gateBeam));
  for (const r of rivals) markSub(r.mesh);
  const groups = new Map();
  et.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || !o.visible || excluded.has(o)) return;
    for (let a = o; a && a !== et; a = a.parent) {
      if (excluded.has(a) || !a.visible) return;
      const ud = a.userData;
      if (ud && (ud.wheels || ud.limbs || ud.frontWheels)) return;
    }
    const m = o.material;
    if (
      !m ||
      Array.isArray(m) ||
      m.transparent ||
      m.blending !== 1 ||
      !(m.isMeshStandardMaterial || m.isMeshBasicMaterial || m.isMeshLambertMaterial)
    )
      return;
    const g = o.geometry;
    if (!g?.attributes?.position || !g.attributes.normal || !g.attributes.uv || !g.index) return;
    const key = `${m.uuid}|${o.castShadow ? 1 : 0}${o.receiveShadow ? 1 : 0}`;
    let arr = groups.get(key);
    arr || groups.set(key, (arr = []));
    arr.push(o);
  });
  let mergedGroups = 0,
    removedMeshes = 0;
  const removedGeos = new Map();
  for (const list of groups.values()) {
    if (list.length < 6) continue;
    try {
      const geoms = list.map((o) => {
        o.updateWorldMatrix(!0, !1);
        const g2 = o.geometry.clone().applyMatrix4(o.matrixWorld);
        for (const name of Object.keys(g2.attributes))
          name === "position" || name === "normal" || name === "uv" || g2.deleteAttribute(name);
        return g2;
      });
      const big = mergeGeometries(geoms, !1);
      if (!big) continue;
      const first = list[0],
        mesh = new Mesh(big, first.material);
      ((mesh.castShadow = first.castShadow),
        (mesh.receiveShadow = first.receiveShadow),
        (mesh.matrixAutoUpdate = !1),
        et.add(mesh));
      for (const o of list) (removedGeos.set(o.geometry.uuid, o.geometry), o.removeFromParent(), removedMeshes++);
      mergedGroups++;
    } catch {}
  }
  // free GPU buffers of geometries that no longer appear anywhere in the scene
  const stillUsed = new Set();
  et.traverse((o) => o.geometry && stillUsed.add(o.geometry.uuid));
  for (const [uuid, geo] of removedGeos) stillUsed.has(uuid) || geo.dispose();
  qe.staticMerge = { groups: mergedGroups, meshesRemoved: removedMeshes };
}
mergeStaticScenery();
const vv = St(u.s);
u.y = vv.p.y + 2.1;
u.lastSafeS = u.s;
u.lastSafeDistance = u.totalDistance;
dl(0.016);
vr();
nu();

// ─── Photo mode (zoom-detail item 11): orbit the camera around the car to savor
// the near-tier detail. O key or the 📷 button toggles; drag orbits, wheel/pinch
// dollies. Rides the __freeCam override — the promotion systems key on camera
// position, so plates/faces/chats/crowds resolve around wherever you point it.
const photoRig = {
  active: !1,
  yaw: 0.6,
  pitch: 0.32,
  radius: 9,
  target: new Vector3(),
  entryMode: null,
  _drag: null,
  _pinch: 0,
};
window.__photoRig = photoRig;
const photoBtn = document.createElement("button");
((photoBtn.id = "photoBtn"), (photoBtn.type = "button"), (photoBtn.textContent = "📷"));
photoBtn.style.cssText =
  "position:fixed;right:12px;bottom:96px;z-index:30;font-size:20px;padding:6px 10px;background:rgba(10,14,22,0.72);color:#cfe6ff;border:1px solid rgba(140,180,220,0.35);border-radius:10px;display:none;cursor:pointer;";
document.body.appendChild(photoBtn);
const photoHint = document.createElement("div");
photoHint.textContent = "PHOTO MODE — drag to orbit · scroll/pinch to zoom · O or 📷 to exit";
photoHint.style.cssText =
  "position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:30;font:600 12px/1.4 system-ui,sans-serif;color:#dff0ff;background:rgba(8,12,20,0.62);padding:6px 12px;border-radius:8px;display:none;pointer-events:none;letter-spacing:0.04em;";
document.body.appendChild(photoHint);
function photoModeSet(on) {
  if (on === photoRig.active) return;
  if (on) {
    if (!(u.mode === "race" || u.mode === "roam" || u.mode === "paused")) return;
    photoRig.entryMode = u.mode;
    u.mode === "roam"
      ? photoRig.target.set(u.roamPos.x, u.roamPos.y + 1.1, u.roamPos.z)
      : (cn.getWorldPosition(photoRig.target), (photoRig.target.y += 1.0));
    photoRig.minR = u.mode === "roam" && u.vehicle === "foot" ? 2.2 : 5.4;
    ((photoRig.pitch = 0.3), (photoRig.radius = 9), (photoRig.active = !0), (window.__freeCam = !0));
    ((photoHint.style.display = "block"), (photoBtn.textContent = "✕"));
  } else {
    ((photoRig.active = !1), (window.__freeCam = !1));
    ((photoHint.style.display = "none"), (photoBtn.textContent = "📷"));
  }
}
photoBtn.addEventListener("click", (ev) => {
  (ev.stopPropagation(), photoModeSet(!photoRig.active));
});
window.addEventListener("keydown", (ev) => {
  ev.code === "KeyO" && photoModeSet(!photoRig.active);
});
window.addEventListener("pointerdown", (ev) => {
  photoRig.active && ev.target === Lr && (photoRig._drag = { x: ev.clientX, y: ev.clientY });
});
window.addEventListener("pointermove", (ev) => {
  if (!photoRig.active || !photoRig._drag) return;
  const dx = ev.clientX - photoRig._drag.x,
    dy = ev.clientY - photoRig._drag.y;
  photoRig._drag = { x: ev.clientX, y: ev.clientY };
  photoRig.yaw -= dx * 0.005;
  photoRig.pitch = MathUtils.clamp(photoRig.pitch + dy * 0.004, -0.15, 1.25);
});
window.addEventListener("pointerup", () => (photoRig._drag = null));
window.addEventListener(
  "wheel",
  (ev) => {
    photoRig.active && (photoRig.radius = MathUtils.clamp(photoRig.radius * (1 + Math.sign(ev.deltaY) * 0.12), photoRig.minR ?? 2.2, 70));
  },
  { passive: !0 },
);
window.addEventListener(
  "touchmove",
  (ev) => {
    if (!photoRig.active || ev.touches.length !== 2) return;
    const d = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY);
    (photoRig._pinch > 0 && (photoRig.radius = MathUtils.clamp(photoRig.radius * (photoRig._pinch / d), photoRig.minR ?? 2.2, 70)),
      (photoRig._pinch = d));
  },
  { passive: !0 },
);
window.addEventListener("touchend", () => (photoRig._pinch = 0));
setInterval(() => {
  photoBtn.style.display = u.mode === "race" || u.mode === "roam" || u.mode === "paused" ? "block" : "none";
}, 800);
{
  const photoAnchor = new Object3D();
  et.add(photoAnchor);
  Bn(photoAnchor, () => {
    if (!photoRig.active) return;
    if (u.mode !== photoRig.entryMode) {
      photoModeSet(!1);
      return;
    }
    const r = Math.max(photoRig.minR ?? 2.2, photoRig.radius),
      cp = Math.cos(photoRig.pitch);
    Xe.position.set(
      photoRig.target.x + Math.sin(photoRig.yaw) * cp * r,
      photoRig.target.y + Math.sin(photoRig.pitch) * r,
      photoRig.target.z + Math.cos(photoRig.yaw) * cp * r,
    );
    Xe.lookAt(photoRig.target);
    window.__freeCam = !0;
  });
}
window.__steelRibbonDebug.photoMode = function (on) {
  photoModeSet(on ?? !photoRig.active);
  return {
    active: photoRig.active,
    radius: photoRig.radius,
    yaw: +photoRig.yaw.toFixed(2),
    cam: { x: +Xe.position.x.toFixed(1), y: +Xe.position.y.toFixed(1), z: +Xe.position.z.toFixed(1) },
  };
};
// ─── Ped inspect (zoom-detail round 3): click a pedestrian in roam and the
// camera glides to them while a thought bubble shows what they're doing,
// thinking or reading. Personas are seeded by the ped's Rr index, so the
// same person keeps their name, dog and chat all session. ───
const PED_NAMES = ["MARGO", "FELIX", "JUNIPER", "OTTO", "WREN", "CASSIA", "BRUNO", "POPPY", "EZRA", "LOTTIE", "GUS", "MIRA", "THEO", "SAGE", "NELL", "REMY", "IVY", "COLE", "FERN", "BASIL", "OPAL", "HUGO", "DOT", "ASH"];
const DOG_NAMES = ["BISCUIT", "PICKLE", "NOODLE", "WAFFLE", "MOCHI", "PEPPER", "BEAN", "ZIGGY"];
const INSPECT_THOUGHTS = {
  bag: ["Got the last one at Pixel Pawn.", "Should have bought two, honestly.", "This bag weighs a metric ton.", "Wait till they see this at home."],
  cup: ["Triple shot kind of day.", "Do not spill. Do not spill.", "The Neon Diner does it better, but shhh.", "Warm hands, warm heart."],
  dog: ["{DOG} found a smell. Could be a while.", "Who is a good {DOG}? You are.", "{DOG} barks at every race car. Every single one.", "One more block, then treats."],
  walk: ["Nice night for a walk.", "Was that car doing two hundred?!", "I never get tired of this skyline.", "Gate 8 looked extra glowy tonight."],
};
// zoom-detail 38: inspect extends to cars, dogs and marshals — same rig, a
// kind dimension picks persona, camera framing and alive-checks per subject.
const CAR_RADIO = [
  "Tuned to 88.7 The Ribbon. All synth, all night.",
  "Caller nine wins pit passes. I am ALWAYS caller nine.",
  "Traffic report says I am the traffic.",
  "This song again? ...turns it up anyway.",
];
const CAR_ERRANDS = [
  "Birthday cake on the back seat. No sudden brakes.",
  "Left the oven off. Pretty sure. Mostly sure.",
  "New wiper blades today. Living the dream.",
  "Shortcut? I know a guy who knows a shortcut.",
];
const TAXI_LINES = [
  "Fare to the stadium — tip is looking promising.",
  "Two hundred laps of this city and I still love the skyline.",
  "The meter is fair. The meter is always fair.",
  "Airport run at nine. Plenty of time. Probably.",
];
const BUS_LINES = [
  "Two minutes ahead of schedule. Do not tell dispatch.",
  "Crosstown 14: every stop, every time, no exceptions.",
  "Someone left an umbrella again. Third one this week.",
  "Smooth stops tonight. The passengers applaud. Inwardly.",
];
const DOG_THOUGHTS = [
  "Seven hydrants today. A personal record.",
  "The human walks slow, but I love them anyway.",
  "That pigeon knows exactly what it did.",
  "Treats are statistically imminent. I can feel it.",
];
const MARSHAL_LINES = [
  "Blue flag ready — someone is about to get lapped.",
  "Best seat on the whole ribbon, honestly.",
  "Sector clear. Beautiful racing out there tonight.",
  "Radio check every lap. The crackle means it works.",
];
const inspectRig = { active: !1, actor: null, idx: -1, kind: "ped", persona: null, entryPos: new Vector3(), _look: new Vector3() };
const inspectBubble = document.createElement("div");
inspectBubble.style.cssText =
  "position:fixed;z-index:31;display:none;max-width:270px;background:rgba(250,250,246,0.96);color:#1c2028;font:600 13px/1.45 system-ui,sans-serif;padding:9px 12px;border-radius:12px;pointer-events:none;box-shadow:0 4px 18px rgba(0,0,0,0.35);transform:translate(-50%,-112%);";
document.body.appendChild(inspectBubble);
const inspectCard = document.createElement("div");
inspectCard.style.cssText =
  "position:fixed;left:12px;bottom:96px;z-index:31;display:none;background:rgba(8,12,20,0.78);color:#dff0ff;font:600 13px/1.5 system-ui,sans-serif;padding:9px 13px;border-radius:10px;border:1px solid rgba(140,180,220,0.3);letter-spacing:0.03em;pointer-events:none;";
document.body.appendChild(inspectCard);
function pedPersona(idx) {
  const prop = ["text", "bag", "cup", "dog"][idx % 4],
    name = PED_NAMES[idx % PED_NAMES.length],
    dog = DOG_NAMES[idx % DOG_NAMES.length];
  let activity, thought;
  if (prop === "text") {
    const chat = PED_CHATS[idx % 8 % PED_CHATS.length];
    activity = "texting a friend";
    thought = chat.map(([line, who]) => (who === "me" ? "▸ " : "  ") + line).join("\n");
  } else if (prop === "dog") {
    activity = "walking " + dog.charAt(0) + dog.slice(1).toLowerCase();
    thought = INSPECT_THOUGHTS.dog[idx % 4].replaceAll("{DOG}", dog.charAt(0) + dog.slice(1).toLowerCase());
  } else if (prop === "bag") {
    ((activity = "hauling shopping"), (thought = INSPECT_THOUGHTS.bag[idx % 4]));
  } else ((activity = "on a coffee run"), (thought = INSPECT_THOUGHTS.cup[idx % 4]));
  return { name, prop, activity, thought };
}
function carPlateText(mesh) {
  const d = plateSys.dynamics.find((q) => q.carMesh === mesh);
  return d && plateSys.texts ? plateSys.texts[d.slot % plateSys.texts.length] : null;
}
function carPersona(car, i) {
  const name = PED_NAMES[(i * 7 + 3) % PED_NAMES.length],
    plate = carPlateText(car.mesh),
    bus = !!car.mesh.userData.bus,
    taxi = car.type === "taxi";
  const activity = bus ? "driving the Crosstown 14" : taxi ? "on shift" + (plate ? ", cab " + plate : "") : "out for a drive";
  const thought = bus ? BUS_LINES[i % 4] : taxi ? TAXI_LINES[i % 4] : (i % 2 ? CAR_RADIO : CAR_ERRANDS)[(i >> 1) % 4];
  return { name, prop: bus ? "bus" : taxi ? "taxi" : "car", activity, thought, plate };
}
function dogPersona(idx) {
  const dog = DOG_NAMES[idx % DOG_NAMES.length];
  return { name: dog, prop: "dog", activity: "being a very good dog", thought: DOG_THOUGHTS[idx % 4], plate: null };
}
function marshalPersona(si) {
  const name = PED_NAMES[(si * 5 + 11) % PED_NAMES.length];
  return { name, prop: "marshal", activity: "flag marshal, station " + ((si % 14) + 1), thought: MARSHAL_LINES[si % 4], plate: null };
}
const _insW = new Vector3();
// One framing table for enter-snap, the follow tick and the bubble: head
// point, forward x/z, camera standoff/side/height and bubble lift per kind.
function inspectSubject(kind, a) {
  if (kind === "car") {
    const m = a.mesh,
      bus = !!m.userData.bus;
    _insW.set(0, 0, 1).applyQuaternion(m.quaternion);
    return { hx: m.position.x, hy: m.position.y + (bus ? 1.9 : 1.0), hz: m.position.z, fx: _insW.x, fz: _insW.z, off: bus ? 7.2 : 4.6, side: 1.7, ty: 0.55, drop: 0.35, lift: bus ? 1.0 : 0.8 };
  }
  if (kind === "dog") {
    a.dog.getWorldPosition(_insW);
    const w = a.ped.mesh;
    return { hx: _insW.x, hy: _insW.y + 0.42, hz: _insW.z, fx: -Math.sin(w.rotation.y), fz: -Math.cos(w.rotation.y), off: 1.7, side: 0.6, ty: 0.12, drop: 0.05, lift: 0.35 };
  }
  if (kind === "marshal") {
    // frame from the viewer's approach side — a fixed forward vector can point
    // straight into the deck rim wall and bury the camera in the platform
    const g = a.g,
      dx = Xe.position.x - g.position.x,
      dz = Xe.position.z - g.position.z,
      L = Math.hypot(dx, dz) || 1;
    return { hx: g.position.x, hy: g.position.y + roadsideSys.LIFT + 1.45, hz: g.position.z, fx: dx / L, fz: dz / L, off: 3.1, side: 0.4, ty: 0.6, drop: 0.25, lift: 0.5 };
  }
  const m = a.mesh;
  return { hx: m.position.x, hy: m.position.y + 1.62, hz: m.position.z, fx: -Math.sin(m.rotation.y), fz: -Math.cos(m.rotation.y), off: 2.5, side: 0.95, ty: 0.25, drop: 0.15, lift: 0.42 };
}
function inspectAlive(kind, a) {
  if (kind === "car") return !!(a.mesh && a.mesh.visible);
  if (kind === "dog") return !!(a.ped && a.prop === "dog" && a.ped.active && a.ped.mesh.visible);
  if (kind === "marshal") return !!(a.g && a.g.visible && a.idx >= 0);
  return !!(a.active && a.mesh.visible);
}
function inspectExit() {
  if (!inspectRig.active) return;
  ((inspectRig.active = !1), (inspectRig.actor = null), (window.__freeCam = !1));
  ((inspectBubble.style.display = "none"), (inspectCard.style.display = "none"));
}
function inspectEnter(actor, idx, kind = "ped") {
  if (photoRig.active || u.mode !== "roam") return !1;
  const persona = kind === "car" ? carPersona(actor, idx) : kind === "dog" ? dogPersona(idx) : kind === "marshal" ? marshalPersona(idx) : pedPersona(idx);
  ((inspectRig.actor = actor), (inspectRig.idx = idx), (inspectRig.kind = kind), (inspectRig.persona = persona), (inspectRig.active = !0));
  inspectRig.entryPos.copy(u.roamPos);
  const s0 = inspectSubject(kind, actor);
  inspectRig._look.set(s0.hx, s0.hy - s0.drop, s0.hz);
  const pp = inspectRig.persona;
  inspectCard.innerHTML =
    "\uD83D\uDC41 <b>" +
    pp.name +
    "</b> \u00B7 " +
    pp.activity +
    (pp.plate && pp.prop !== "taxi" ? ' \u00B7 <span style="background:#e8e4d8;color:#222;padding:1px 6px;border-radius:3px;font-family:monospace">' + pp.plate + "</span>" : "") +
    " &nbsp;\u2014&nbsp; click away or Esc to close";
  ((inspectBubble.textContent = pp.thought), (inspectBubble.style.whiteSpace = "pre-line"));
  ((inspectBubble.style.display = "block"), (inspectCard.style.display = "block"), (window.__freeCam = !0));
  return !0;
}
function inspectNearestPed(maxDist = 60) {
  let best = null;
  for (let i = 0; i < Rr.length; i++) {
    const a = Rr[i];
    if (!a.active || !a.mesh.visible) continue;
    const d = Math.hypot(a.x - Xe.position.x, a.z - Xe.position.z);
    (!best || d < best.d) && (best = { a, i, d });
  }
  return best && best.d <= maxDist ? best : null;
}
const _insV = new Vector3();
function inspectScreenPick(px, py) {
  const rect = Lr.getBoundingClientRect(),
    cx = Xe.position.x,
    cz = Xe.position.z;
  let best = null;
  const consider = (kind, a, i, wx, wy, wz, maxD, acc) => {
    if (i < 0 || Math.hypot(wx - cx, wz - cz) > maxD) return;
    _insV.set(wx, wy, wz).project(Xe);
    if (_insV.z > 1) return;
    const sx = rect.left + ((_insV.x + 1) / 2) * rect.width,
      sy = rect.top + ((1 - _insV.y) / 2) * rect.height,
      dPx = Math.hypot(sx - px, sy - py);
    dPx <= acc && (!best || dPx < best.dPx) && (best = { kind, a, i, dPx });
  };
  for (let i = 0; i < Rr.length; i++) {
    const a = Rr[i];
    a.active && a.mesh.visible && consider("ped", a, i, a.mesh.position.x, a.mesh.position.y + 1.5, a.mesh.position.z, 55, 46);
  }
  for (const k of pedKitSys.kits || [])
    if (k.ped && k.prop === "dog" && k.ped.mesh.visible) {
      k.dog.getWorldPosition(_insW);
      consider("dog", k, Rr.indexOf(k.ped), _insW.x, _insW.y + 0.3, _insW.z, 38, 40);
    }
  for (let i = 0; i < Rc.length; i++) {
    const c = Rc[i];
    c.mesh && c.mesh.visible && consider("car", c, i, c.mesh.position.x, c.mesh.position.y + 0.9, c.mesh.position.z, 55, 62);
  }
  if (roadsideSys.kits)
    for (const k of roadsideSys.kits)
      k.variant === 0 && k.g.visible && k.idx >= 0 && consider("marshal", k, k.idx, k.g.position.x, k.g.position.y + roadsideSys.LIFT + 1.35, k.g.position.z, 60, 46);
  return best;
}
let inspectDown = null;
window.addEventListener("pointerdown", (ev) => {
  ev.target === Lr && !photoRig.active && u.mode === "roam" && (inspectDown = { x: ev.clientX, y: ev.clientY, t: performance.now() });
});
window.addEventListener("pointerup", (ev) => {
  const dn = inspectDown;
  inspectDown = null;
  if (!dn || ev.target !== Lr || photoRig.active || u.mode !== "roam") return;
  if (Math.hypot(ev.clientX - dn.x, ev.clientY - dn.y) > 7 || performance.now() - dn.t > 420) return;
  if (!inspectRig.active && !(u.vehicle === "foot" || Math.abs(u.speed) < 8)) return;
  const hit = inspectScreenPick(ev.clientX, ev.clientY);
  if (hit) inspectEnter(hit.a, hit.i, hit.kind);
  else inspectExit();
});
window.addEventListener("keydown", (ev) => {
  ev.code === "Escape" && inspectExit();
});
{
  const inspectAnchor = new Object3D();
  et.add(inspectAnchor);
  Bn(inspectAnchor, () => {
    if (!inspectRig.active) return;
    const a = inspectRig.actor,
      kind = inspectRig.kind;
    if (u.mode !== "roam" || photoRig.active || !a || !inspectAlive(kind, a) || u.roamPos.distanceTo(inspectRig.entryPos) > (kind === "car" ? 12 : 3)) {
      inspectExit();
      return;
    }
    const s = inspectSubject(kind, a);
    if (kind === "car" && Math.hypot(s.hx - inspectRig.entryPos.x, s.hz - inspectRig.entryPos.z) > 130) {
      inspectExit();
      return;
    }
    const tx = s.hx + s.fx * s.off + s.fz * s.side,
      ty = s.hy + s.ty,
      tz = s.hz + s.fz * s.off - s.fx * s.side;
    (Xe.position.lerp(_insV.set(tx, ty, tz), kind === "car" ? 0.22 : 0.14), inspectRig._look.lerp(_insV.set(s.hx, s.hy - s.drop, s.hz), kind === "car" ? 0.45 : 0.3), Xe.lookAt(inspectRig._look));
    window.__freeCam = !0;
    _insV.set(s.hx, s.hy + s.lift, s.hz).project(Xe);
    if (_insV.z <= 1) {
      const rect = Lr.getBoundingClientRect();
      ((inspectBubble.style.left = rect.left + ((_insV.x + 1) / 2) * rect.width + "px"), (inspectBubble.style.top = rect.top + ((1 - _insV.y) / 2) * rect.height + "px"), (inspectBubble.style.display = "block"));
    } else inspectBubble.style.display = "none";
  });
}
window.__steelRibbonDebug.inspectPed = function (on) {
  if (on === !1) {
    inspectExit();
    return { active: !1 };
  }
  if (on !== "info" && !inspectRig.active) {
    const n = inspectNearestPed(80);
    n && inspectEnter(n.a, n.i);
  }
  const pp = inspectRig.persona;
  let sub = null;
  if (inspectRig.actor && inspectRig.active) {
    const s = inspectSubject(inspectRig.kind, inspectRig.actor);
    sub = { x: +s.hx.toFixed(1), y: +s.hy.toFixed(2), z: +s.hz.toFixed(1) };
  }
  return {
    active: inspectRig.active,
    idx: inspectRig.idx,
    kind: inspectRig.kind,
    name: pp ? pp.name : null,
    prop: pp ? pp.prop : null,
    activity: pp ? pp.activity : null,
    thought: pp ? pp.thought : null,
    plate: pp ? (pp.plate ?? null) : null,
    ped: sub,
    cam: { x: +Xe.position.x.toFixed(1), y: +Xe.position.y.toFixed(1), z: +Xe.position.z.toFixed(1) },
  };
};
window.__steelRibbonDebug.inspectNearest = function (kind) {
  inspectRig.active && inspectExit();
  const cx = Xe.position.x,
    cz = Xe.position.z;
  let ent = null,
    b = null;
  if (kind === "car") {
    for (let i = 0; i < Rc.length; i++) {
      const c = Rc[i];
      if (!c.mesh || !c.mesh.visible) continue;
      const d = Math.hypot(c.mesh.position.x - cx, c.mesh.position.z - cz);
      (!b || d < b.d) && (b = { a: c, i, d });
    }
    b && b.d <= 140 && (ent = [b.a, b.i, "car"]);
  } else if (kind === "dog") {
    for (const k of pedKitSys.kits || []) {
      if (!k.ped || k.prop !== "dog" || !k.ped.mesh.visible) continue;
      const d = Math.hypot(k.ped.mesh.position.x - cx, k.ped.mesh.position.z - cz),
        i = Rr.indexOf(k.ped);
      i >= 0 && (!b || d < b.d) && (b = { a: k, i, d });
    }
    b && b.d <= 60 && (ent = [b.a, b.i, "dog"]);
  } else if (kind === "marshal") {
    for (const k of roadsideSys.kits || []) {
      if (k.variant !== 0 || !k.g.visible || k.idx < 0) continue;
      const d = Math.hypot(k.g.position.x - cx, k.g.position.z - cz);
      (!b || d < b.d) && (b = { a: k, i: k.idx, d });
    }
    b && b.d <= 240 && (ent = [b.a, b.i, "marshal"]);
  } else {
    const n = inspectNearestPed(80);
    n && (ent = [n.a, n.i, "ped"]);
  }
  ent && inspectEnter(ent[0], ent[1], ent[2]);
  return window.__steelRibbonDebug.inspectPed("info");
};
