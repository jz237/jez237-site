import {
  Fog,
  CanvasTexture,
  InstancedMesh,
  Group,
  Shape,
  HemisphereLight,
  CircleGeometry,
  Mesh,
  SpriteMaterial,
  Line,
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
  Raycaster,
  PMREMGenerator,
  Clock,
  MathUtils,
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
Qt.setPixelRatio(Math.min(window.devicePixelRatio, 2));
Qt.setSize(window.innerWidth, window.innerHeight);
Qt.shadowMap.enabled = !0;
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
  document.body.classList.toggle("chase-mode", onTrack && trackViewMode === "chase");
}
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
    o.connect(g).connect(ctx.destination),
    o.start(),
    o.stop(ctx.currentTime + dur + 0.06));
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
  for (let r = 0; r < 3600; r++) {
    const a = 0.035 + Math.random() * 0.08,
      o = 72 + Math.floor(Math.random() * 70);
    ((t.fillStyle = `rgba(${38 + Math.random() * 30}, ${o}, ${38 + Math.random() * 26}, ${a})`),
      t.fillRect(Math.random() * i, Math.random() * i, 1 + Math.random() * 4, 1 + Math.random() * 4));
  }
  ((t.strokeStyle = "rgba(210, 220, 150, 0.08)"), (t.lineWidth = 2));
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
  (n.addColorStop(0, "#263139"),
    n.addColorStop(0.45, "#3a444a"),
    n.addColorStop(1, "#1b242c"),
    (t.fillStyle = n),
    t.fillRect(0, 0, i, i),
    (t.strokeStyle = "rgba(180, 225, 255, 0.08)"),
    (t.lineWidth = 1));
  for (let r = -i; r < i * 2; r += 78) (t.beginPath(), t.moveTo(r, 0), t.lineTo(r + i * 0.32, i), t.stroke());
  for (let r = 0; r < 360; r++) {
    const a = Math.random() * i,
      o = Math.random() * i,
      c = 10 + Math.random() * 56,
      l = t.createRadialGradient(a, o, 0, a, o, c);
    (l.addColorStop(0, `rgba(145, 205, 255, ${0.12 + Math.random() * 0.15})`),
      l.addColorStop(0.45, "rgba(80, 140, 180, 0.07)"),
      l.addColorStop(1, "rgba(10, 18, 24, 0)"),
      (t.fillStyle = l),
      t.beginPath(),
      t.ellipse(a, o, c, c * (0.16 + Math.random() * 0.18), Math.random() * Math.PI, 0, Math.PI * 2),
      t.fill());
  }
  t.fillStyle = "rgba(255, 214, 122, 0.12)";
  for (let r = 0; r < 48; r++) {
    const a = Math.random() * i,
      o = Math.random() * i;
    (t.beginPath(),
      t.ellipse(a, o, 8 + Math.random() * 36, 1.5 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2),
      t.fill());
  }
  for (let r = 0; r < 9200; r++) {
    const a = 36 + Math.floor(Math.random() * 110),
      o = 0.035 + Math.random() * 0.075,
      c = Math.random() < 0.18 ? 2 : 1;
    ((t.fillStyle = `rgba(${a}, ${a + 3}, ${a + 7}, ${o})`), t.fillRect(Math.random() * i, Math.random() * i, c, c));
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
function As(i = 128, e = 256, t = 0.42) {
  const n = document.createElement("canvas");
  ((n.width = i), (n.height = e));
  const s = n.getContext("2d");
  ((s.fillStyle = "#081722"), s.fillRect(0, 0, i, e));
  for (let a = 10; a < e - 8; a += 18)
    for (let o = 9; o < i - 9; o += 15)
      (Math.random() < t
        ? ((s.shadowColor = "rgba(255, 197, 104, 0.75)"),
          (s.shadowBlur = 5),
          (s.fillStyle = `rgba(255, ${205 + Math.random() * 38}, ${118 + Math.random() * 72}, ${0.82 + Math.random() * 0.18})`))
        : ((s.shadowBlur = 0), (s.fillStyle = "rgba(42, 92, 125, 0.28)")),
        s.fillRect(o, a, 7, 8));
  ((s.shadowBlur = 0), (s.strokeStyle = "rgba(140, 220, 255, 0.12)"), (s.lineWidth = 1));
  for (let a = 0; a < i; a += 15) (s.beginPath(), s.moveTo(a + 3, 0), s.lineTo(a + 3, e), s.stroke());
  const r = new CanvasTexture(n);
  return ((r.colorSpace = SRGBColorSpace), r);
}
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
  const s = t * 0.5,
    r = n * 0.5;
  let a = He(i, e);
  for (const o of [-s, 0, s]) for (const c of [-r, 0, r]) a = Math.min(a, He(i + o, e + c));
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
    if (Pn(r.x, r.z, e).clearance >= t) return r;
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
}
let skyDome = null;
function P1() {
  // Golden-hour sky: a camera-following dome (so the horizon can never clip against the far plane),
  // with the sun disc and halo parented to it so they sit at optical infinity.
  const i = document.createElement("canvas");
  ((i.width = 32), (i.height = 512));
  const e = i.getContext("2d"),
    t = e.createLinearGradient(0, 0, 0, i.height);
  (t.addColorStop(0, "#141c3f"),
    t.addColorStop(0.3, "#31437c"),
    t.addColorStop(0.52, "#75689a"),
    t.addColorStop(0.72, "#d1755a"),
    t.addColorStop(0.86, "#f7ac68"),
    t.addColorStop(1, "#ffd9a4"),
    (e.fillStyle = t),
    e.fillRect(0, 0, i.width, i.height));
  const n = new CanvasTexture(i);
  n.colorSpace = SRGBColorSpace;
  ((skyDome = new Mesh(
    new SphereGeometry(1200, 40, 24),
    new MeshBasicMaterial({ map: n, side: BackSide, depthWrite: !1, fog: !1 }),
  )),
    (skyDome.renderOrder = -100),
    (skyDome.frustumCulled = !1),
    et.add(skyDome));
  const sunDir = new Vector3(-310, 150, 230).normalize(),
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
  }
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
      v.position.set(M, $i(M, x, h, _) - 0.55, x),
      (v.renderOrder = -4),
      et.add(v));
  }
  const s = [
    new MeshStandardMaterial({ color: 4352578, roughness: 1 }),
    new MeshStandardMaterial({ color: 6910014, roughness: 1 }),
    new MeshStandardMaterial({ color: 3562320, roughness: 1 }),
  ];
  for (let g = 0; g < 46; g++) {
    const M = new Mesh(new CircleGeometry(28 + Math.random() * 90, 9), s[g % s.length]);
    ((M.rotation.x = -Math.PI / 2),
      (M.rotation.z = Math.random() * Math.PI),
      M.position.set(-900 + Math.random() * 1800, -5.6 + Math.random() * 0.8, -260 - Math.random() * 1780),
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
  for (let g = 0; g < 185; g++) {
    const M = 0.58 + Math.random() * 1.05,
      x = 8 * M,
      h = zn(() => ({ x: -1120 + Math.random() * 2240, z: -450 - Math.random() * 1740 }), x, 145, 40);
    if (!h) continue;
    const { x: _, z: v } = h;
    if (ka(_, v, 18)) continue;
    const y = He(_, v) + 0.8,
      E = new Group(),
      T = 2.2 + Math.random() * 3.8,
      R = new Mesh(new CylinderGeometry(0.28, 0.42, T, 6), c);
    ((R.position.y = T / 2), E.add(R));
    const C = 2 + Math.floor(Math.random() * 3);
    for (let b = 0; b < C; b++) {
      const S = new Mesh(
        new ConeGeometry(2.2 + Math.random() * 1.7 - b * 0.22, 4.8 + Math.random() * 2.6, 7),
        l[(g + b) % l.length],
      );
      ((S.position.y = T + b * 1.45 + 1.6), (S.rotation.y = Math.random() * Math.PI), E.add(S));
    }
    (E.position.set(_, y, v), E.scale.setScalar(M), et.add(E), kn("tree", _, v, x, 145));
  }
  const d = new MeshStandardMaterial({
    color: 16767433,
    roughness: 0.75,
    transparent: !0,
    opacity: 0.88,
    emissive: 16747088,
    emissiveIntensity: 0.16,
  });
  for (let g = 0; g < 38; g++) {
    const M = new Group(),
      x = 4 + Math.floor(Math.random() * 5);
    for (let h = 0; h < x; h++) {
      const _ = new Mesh(new SphereGeometry(12 + Math.random() * 18, 14, 8), d);
      (_.position.set(h * 18 - x * 9, Math.random() * 8, Math.random() * 12),
        _.scale.set(1.2 + Math.random() * 0.9, 0.36 + Math.random() * 0.2, 0.8 + Math.random() * 0.5),
        M.add(_));
    }
    (M.position.set(-760 + Math.random() * 1520, 185 + Math.random() * 135, -130 - Math.random() * 1720), et.add(M));
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
      (M.position.set(C.x, $i(C.x, C.z, h, _) - 0.7, C.z),
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
      y = zn(() => ({ x: -1500 + Math.random() * 3e3, z: -700 - Math.random() * 1700 }), Math.max(_, v) * 0.5, 40, 24);
    if (!y) continue;
    const { x: E, z: T } = y,
      R = new Group(),
      C = 5 + Math.floor(Math.random() * 4),
      b = n[Math.floor(Math.random() * n.length)];
    for (let S = 0; S < C; S++) {
      const L = new MeshStandardMaterial({ color: S % 2 ? b : n[Math.floor(Math.random() * n.length)], roughness: 1 }),
        F = new Mesh(new PlaneGeometry(_, v / C), L);
      ((F.rotation.x = -Math.PI / 2), F.position.set(0, 0.05, -v / 2 + (S + 0.5) * (v / C)), R.add(F));
    }
    (R.position.set(E, He(E, T) + 0.05, T),
      (R.rotation.y = Math.random() * Math.PI),
      et.add(R),
      kn("field", E, T, Math.max(_, v) * 0.5, 40));
  }
  {
    const h = zn(() => ({ x: -650 + Math.random() * 1300, z: -1200 - Math.random() * 700 }), 170, 60, 50);
    if (h) {
      const _ = new MeshStandardMaterial({
          color: 4165552,
          roughness: 0.12,
          metalness: 0.35,
          transparent: !0,
          opacity: 0.58,
          depthWrite: !1,
          side: DoubleSide,
        }),
        v = new Mesh(new CircleGeometry(150, 40), _);
      ((v.rotation.x = -Math.PI / 2),
        v.position.set(h.x, $i(h.x, h.z, 450, 300) + 0.08, h.z),
        v.scale.set(1.5, 1, 1),
        (v.renderOrder = -4),
        et.add(v),
        Di.push({ kind: "water", x: h.x, z: h.z, radius: 176, maxY: 90 }),
        Qi.waterBlockers++,
        kn("lake", h.x, h.z, 170, 60),
        Bn(v, (y) => {
          ((_.opacity = 0.52 + Math.sin(y * 0.8) * 0.035), (v.rotation.z = Math.sin(y * 0.2) * 0.02));
        }));
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
      et.add(E),
      kn("grandstand", v, y, 40, 30));
  }
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
    r = new MeshStandardMaterial({ color: e, roughness: 0.34, metalness: 0.28 }),
    a = new MeshStandardMaterial({ color: new Color(e).multiplyScalar(0.52), roughness: 0.42, metalness: 0.24 }),
    o = new MeshStandardMaterial({
      color: 10217727,
      roughness: 0.08,
      metalness: 0.08,
      transparent: !0,
      opacity: 0.62,
      emissive: 1192778,
      emissiveIntensity: 0.2,
    }),
    c = new MeshStandardMaterial({ color: 395016, roughness: 0.72, metalness: 0.02 }),
    l = new MeshStandardMaterial({ color: 14147041, roughness: 0.2, metalness: 0.68 }),
    d = new MeshStandardMaterial({ color: 16774064, roughness: 0.2, emissive: 16765788, emissiveIntensity: 0.82 }),
    f = new MeshStandardMaterial({ color: 16725033, roughness: 0.22, emissive: 16717325, emissiveIntensity: 0.7 }),
    p = new Mesh(new BoxGeometry(s.w, s.h, s.l), i === "taxi" ? new MeshStandardMaterial({ color: 16767293, roughness: 0.36, metalness: 0.24 }) : r);
  ((p.position.y = 0.95), t.add(p));
  const m = new Mesh(new BoxGeometry(s.cabin[0], s.cabin[1], s.cabin[2]), s.bus ? o : r);
  if ((m.position.set(0, 1.65, s.cabinZ), t.add(m), !s.bus)) {
    const x = new Mesh(new BoxGeometry(s.cabin[0] * 0.78, s.cabin[1] * 0.55, 0.08), o);
    (x.position.set(0, 1.68, s.cabinZ - s.cabin[2] * 0.5 - 0.05), t.add(x));
    for (const h of [-1, 1]) {
      const _ = new Mesh(new BoxGeometry(0.08, s.cabin[1] * 0.5, s.cabin[2] * 0.48), o);
      (_.position.set(h * (s.cabin[0] * 0.5 + 0.04), 1.68, s.cabinZ), t.add(_));
    }
  }
  if (s.bed) {
    const x = new Mesh(new BoxGeometry(s.w * 0.94, 0.58, s.l * 0.38), a);
    (x.position.set(0, 1.2, 1.35), t.add(x));
  }
  if (s.box) {
    const x = new Mesh(new BoxGeometry(s.box[0], s.box[1], s.box[2]), new MeshStandardMaterial({ color: 15130833, roughness: 0.62, metalness: 0.05 }));
    (x.position.set(0, 1.55, 1.25), t.add(x));
  }
  if (s.bus) {
    const x = new Mesh(new BoxGeometry(s.w + 0.06, 0.28, s.l * 0.86), a);
    (x.position.set(0, 1.38, 0), t.add(x));
    for (let h = -2.8; h <= 3.1; h += 1.2)
      for (const _ of [-1, 1]) {
        const v = new Mesh(new BoxGeometry(0.08, 0.64, 0.72), o);
        (v.position.set(_ * (s.w * 0.5 + 0.05), 2.08, h), t.add(v));
      }
  }
  if (s.sign) {
    const x = new Mesh(
      new BoxGeometry(1, 0.24, 0.46),
      new MeshStandardMaterial({ color: 16774310, roughness: 0.2, emissive: 16765773, emissiveIntensity: 0.9 }),
    );
    (x.position.set(0, 2.2, -0.35), t.add(x));
  }
  const g = s.l > 6 ? [-s.l * 0.34, 0, s.l * 0.34] : [-s.l * 0.34, s.l * 0.34],
    M = [];
  for (const x of g)
    for (const h of [-s.w * 0.54, s.w * 0.54]) {
      const _ = new Mesh(new CylinderGeometry(0.42, 0.42, 0.36, 14), c);
      ((_.rotation.z = Math.PI / 2), _.position.set(h, 0.45, x), t.add(_), M.push(_));
      const v = new Mesh(new CylinderGeometry(0.18, 0.18, 0.38, 10), l);
      ((v.rotation.z = Math.PI / 2), v.position.set(h, 0.45, x), t.add(v));
    }
  for (const x of [-s.w * 0.28, s.w * 0.28]) {
    const h = new Mesh(new BoxGeometry(0.42, 0.2, 0.08), d);
    (h.position.set(x, 0.95, -s.l * 0.52), t.add(h));
    const _ = new Mesh(new BoxGeometry(0.36, 0.22, 0.08), f);
    (_.position.set(x, 0.98, s.l * 0.52), t.add(_));
  }
  return (
    (t.userData = { wheels: M, colliderHalfW: s.w * 0.58, colliderHalfD: s.l * 0.55 }),
    t.traverse((x) => {
      ((x.castShadow = !0), (x.receiveShadow = !0));
    }),
    t
  );
}
function U1(i, e) {
  const t = new Group(),
    n = new MeshStandardMaterial({ color: 12947299, roughness: 0.72 }),
    s = new MeshStandardMaterial({ color: i, roughness: 0.68 }),
    r = new MeshStandardMaterial({ color: e, roughness: 0.76 }),
    a = new MeshStandardMaterial({ color: 1119001, roughness: 0.82 }),
    o = new Mesh(new CylinderGeometry(0.28, 0.34, 0.95, 8), s);
  ((o.position.y = 1.35), t.add(o));
  const c = new Mesh(new SphereGeometry(0.24, 10, 8), n);
  ((c.position.y = 2.02), t.add(c));
  const l = new Mesh(new SphereGeometry(0.25, 8, 5), a);
  ((l.scale.y = 0.5), (l.position.y = 2.17), t.add(l));
  const d = [];
  for (const f of [-0.16, 0.16]) {
    const p = new Mesh(new CylinderGeometry(0.075, 0.09, 0.78, 6), r);
    (p.position.set(f, 0.58, 0), t.add(p), d.push({ mesh: p, side: Math.sign(f), baseY: 0.58, amp: 0.28 }));
  }
  for (const f of [-0.38, 0.38]) {
    const p = new Mesh(new CylinderGeometry(0.055, 0.065, 0.72, 6), n);
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
    (qe.stopSigns = 0));
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
      (qe.types[Me] = (qe.types[Me] || 0) + 1));
  }
  function te(I, ye = 0, Me = 0) {
    let Se = Math.max(0, I.speed * Me);
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
        mesh: U1(ne[I % ne.length], X[(I * 2) % X.length]),
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
  const g = new MeshStandardMaterial({ map: S1(), color: 13097186, roughness: 0.34, metalness: 0.24, envMapIntensity: 1.25, side: DoubleSide }),
    M = new MeshStandardMaterial({ color: 11054244, roughness: 0.62, metalness: 0.04 }),
    x = new MeshStandardMaterial({ color: 13944196, roughness: 0.44, metalness: 0.05, emissive: 3942912, emissiveIntensity: 0.12 }),
    h = new MeshStandardMaterial({ color: 15855586, roughness: 0.48, metalness: 0.02, emissive: 3158064, emissiveIntensity: 0.1 }),
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
  const Q = [As(160, 320, 0.5), As(160, 320, 0.62), As(160, 320, 0.42)],
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
    de = new BoxGeometry(1, 1, 1),
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
    const re = $i(N, O, Y, j) - 1.1;
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
    const re = $i(N, O, Y, j) - 0.55,
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
      Mn.push({ x: N, z: O, hw: Y * 0.5, hd: j * 0.5, maxY: re + ee + 2 }),
      Dt(oe, "brickStorefront"),
      !0
    );
  }
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
    fe = new BoxGeometry(2.2, 1.4, 4.6),
    ae = 130,
    Ve = new InstancedMesh(fe, new MeshStandardMaterial({ roughness: 0.42, metalness: 0.36 }), ae);
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
    const j = He(O, Y) + 0.7;
    (e.position.set(O, j, Y),
      e.quaternion.setFromAxisAngle(on, N ? 0 : Math.PI / 2),
      e.scale.set(1, 1, 1),
      e.updateMatrix(),
      Ve.setMatrixAt(Re, e.matrix),
      Ve.setColorAt(Re, new Color(le[(Math.random() * le.length) | 0])),
      Re++);
  }
  ((Ve.count = Re),
    (Ve.instanceMatrix.needsUpdate = !0),
    Ve.instanceColor && (Ve.instanceColor.needsUpdate = !0),
    i.add(Ve));
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
    const N = [],
      O = new MeshStandardMaterial({ color: 1120028, roughness: 0.38, metalness: 0.62 }),
      Y = new MeshStandardMaterial({ color: 1382685, roughness: 0.34, metalness: 0.38 }),
      j = A1(),
      ee = new MeshBasicMaterial({ map: j, transparent: !0, side: DoubleSide }),
      oe = new MeshStandardMaterial({ color: 5050642, roughness: 0.48, metalness: 0.12 }),
      re = (se, $) => new MeshStandardMaterial({ color: se, roughness: 0.16, metalness: 0.02, emissive: $, emissiveIntensity: 0.2 }),
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
        }
        (xe.position.set(me, ue, Ce),
          (xe.rotation.y = Pe),
          se.add(xe),
          N.push({ axis: $, red: rt, yellow: vt, green: Mt, control: se.userData.control }));
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
        for (const $ of N) {
          const me = we($.control, se);
          (($.red.emissiveIntensity = me.green === $.axis || me.yellow === $.axis ? 0.12 : 2.3),
            ($.yellow.emissiveIntensity = me.yellow === $.axis ? 2.6 : 0.12),
            ($.green.emissiveIntensity = me.green === $.axis ? 2.6 : 0.1));
        }
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
        map: As(192, 512, re),
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
        map: As(220, 620, Math.min(0.86, re + 0.18)),
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
    En(112, 238, 1.35),
    En(104, 231, 1.05),
    En(121, 247, 1.15),
    Ur(112, 227, 0),
    En(50, 292, 1.2),
    En(111, 316, 0.95),
    En(48, 132, 0.9),
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
      if (ka(y, E, 18)) continue;
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
    c = new MeshStandardMaterial({ color: 2435884, roughness: 0.48, metalness: 0.62 }),
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
    if (((K.y -= 1), gn(i, Me, K, T ? 0.16 : 0.1, c), gn(i, Se, Z, T ? 0.16 : 0.1, c), T)) {
      const _e = I[0].clone();
      _e.y += (X - Q) * 0.58;
      const be = I[1].clone();
      ((be.y += (X - Q) * 0.58),
        gn(i, I[0].clone().setY(Q + 1.2), be, 0.13, c),
        gn(i, I[1].clone().setY(Q + 1.2), _e, 0.13, c),
        gn(i, _e, K, 0.13, c),
        gn(i, be, Z, 0.13, c));
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
const es = Gd(),
  cn = Gd(3108784, 1916782);
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
  const i = new AudioContext(),
    e = i.createOscillator(),
    t = i.createGain(),
    n = i.createBiquadFilter();
  ((e.type = "sawtooth"),
    (n.type = "lowpass"),
    (n.frequency.value = 540),
    (e.frequency.value = 70),
    (t.gain.value = 1e-4),
    e.connect(n).connect(t).connect(i.destination),
    e.start(),
    (mi = { ctx: i, engine: e, engineGain: t, filter: n, nextNote: 0, beat: 0 }));
}
function La() {
  (mi || Wd(), mi?.ctx.state === "suspended" && mi.ctx.resume().catch(() => {}));
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
    t.connect(n).connect(e.destination),
    t.start(),
    t.stop(e.currentTime + 0.24));
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
    Pc(18 + n * 34));
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
function nv(i) {
  if (!mi) return;
  const { ctx: e, engine: t, engineGain: n, filter: s } = mi;
  (t.frequency.setTargetAtTime(
    62 + u.speed * 2.9 + (_t.has("ShiftLeft") || _t.has("ShiftRight") ? 60 : 0),
    e.currentTime,
    0.04,
  ),
    s.frequency.setTargetAtTime(480 + u.speed * 9, e.currentTime, 0.08));
  const r = u.mode === "race" || u.mode === "roam";
  n.gain.setTargetAtTime(r ? 0.036 + Math.abs(u.speed) / 4200 : 1e-4, e.currentTime, 0.08);
}
function Va(i = !1, e = !1) {
  (Wd(), _t.clear(), Ia());
  const t = i || e;
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
    (u.objectiveLap = 1));
  for (const s of nn) s.collected = !1;
  ((u.message = ""),
    (u.messageTimer = 0),
    (es.visible = !1),
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
  (cn.position.set(u.roamPos.x, u.roamPos.y + 0.3 - u.roamSuspension * 0.45, u.roamPos.z),
    cn.quaternion.setFromAxisAngle(on, -u.roamYaw),
    cn.rotateZ(-u.wheelSteer * MathUtils.clamp(Math.abs(u.speed) / 90, 0, 1) * 0.1),
    cn.rotateX(MathUtils.clamp(u.roamSuspension, -0.16, 0.22)));
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
  const n = He(i, e);
  let s = { kind: "ground", y: n };
  const r = qd(i, e);
  r && r.y >= n - 1.2 && (s = r);
  const a = Zd(i, e, Math.max(t, s.y));
  return (!(s.kind === "ramp" && s.rampType === "off") && a && a.y >= s.y - 0.8 && (s = a), s);
}
function Ih(i) {
  if (i.rampType === "off") return !1;
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
    (es.visible = !1),
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
    (es.visible = !1),
    (cn.visible = !0),
    qn && (qn.visible = !1),
    document.body.classList.add("roam-mode"),
    applyTrackViewClass(),
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
    grounded: !0,
    objectiveHits: u.objectiveHits,
    roamPos: { x: u.roamPos.x, y: u.roamPos.y, z: u.roamPos.z },
    input: { steer: Fe.steer, throttle: Fe.throttle, brake: Fe.brake },
    forwardWorld: { x: Math.sin(u.roamYaw), y: 0, z: -Math.cos(u.roamYaw) },
    cameraWorld: { x: i.x, y: i.y, z: i.z },
  };
}
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
function sv() {
  if (u.mode !== "roam" || nn.length === 0) return;
  const i = nn[u.objectiveIndex % nn.length];
  if (!i) return;
  const e = u.roamPos.x - i.x,
    t = u.roamPos.z - i.z,
    n = Math.abs(u.roamPos.y - i.y);
  e * e + t * t > i.radius * i.radius ||
    n > 8.5 ||
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
    u.speed += ((a ? 70 : 42) + v) * t * i;
  }
  (n > 0.03 && (u.speed -= (u.speed > 1.2 ? 78 : 32) * n * i),
    (u.speed -= 0.00235 * u.speed * Math.abs(u.speed) * i),
    Math.abs(u.speed) > 0.08 ? (u.speed -= Math.sign(u.speed) * 3.6 * i) : t <= 0.03 && n <= 0.03 && (u.speed = 0),
    (u.speed = MathUtils.clamp(u.speed, -24, 135)),
    (u.boosting = a),
    a ? (u.boost = Math.max(0, u.boost - i * 0.22)) : (u.boost = Math.min(1, u.boost + i * 0.05)),
    (u.wheelSteer += (r - u.wheelSteer) * (1 - Math.pow(1e-5, i))));
  const o = -u.wheelSteer * 0.55,
    c = cn.userData.frontWheels;
  c && ((c[0].rotation.y = o), (c[1].rotation.y = o));
  const l = Math.abs(u.speed);
  if (l > Ac) {
    const v = MathUtils.clamp((l - Ac) / 5, 0, 1),
      y = 1 - 0.36 * MathUtils.clamp((l - 34) / 85, 0, 1),
      E = m1 * 1.08 * v * y;
    u.roamYaw += u.wheelSteer * E * i * Math.sign(u.speed);
  }
  const d = Math.sin(u.roamYaw),
    f = -Math.cos(u.roamYaw),
    p = (u.speed - e) / Math.max(0.001, i),
    m = MathUtils.clamp((Math.abs(u.wheelSteer) * Math.max(0, l - 18)) / 68 + Math.max(0, -p - 34) / 90, 0, 1);
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
      (u.roamPos.y = _.y + Wn),
      cv(u.roamPos, _) && (h = !0),
      lv(u.roamPos, _) && (x = !0),
      (_ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y)),
      (u.roamPos.y = _.y + Wn));
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
      (u.messageTimer = 0.9)),
    updateNearMisses(i, x),
    (_ = Ki(u.roamPos.x, u.roamPos.z, u.roamPos.y)),
    (u.roamPos.y = _.y + Wn),
    !(_.kind === "ramp" && _.u > 0.72 && Ih(_)) &&
      ((_.kind === "track" && Ih(_)) || (sv(), zs(), _t.has("KeyR") && (Yd(), _t.delete("KeyR")))));
}
const Xn = 2.6;
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
  ((i.active = !1), (i.respawn = 4.5 + Math.random() * 1.5), (i.mesh.visible = !1), qe.splats++);
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
function jd(i) {
  if (window.__freeCam) return;
  if ((Jd(i), Math.abs(u.speed) > Ac)) {
    let m = u.roamYaw - u.camYaw;
    ((m = Math.atan2(Math.sin(m), Math.cos(m))), (u.camYaw += m * (1 - Math.pow(0.08, i))));
  }
  const e = u.camYaw + u.camLookYaw,
    t = Math.sin(e),
    n = -Math.cos(e),
    s = u.roamPos,
    r = MathUtils.clamp(u.cameraZoom, -0.42, 0.9),
    a = MathUtils.clamp(Math.abs(u.speed) / 135, 0, 1),
    o = (17 + Math.abs(u.speed) * 0.11 + u.roamSlip * 3) * (1 + r * 0.72),
    c = 7.2 + a * 2.1 + Math.max(0, r) * 4.4 - Math.min(0, r) * 2 + u.camLookPitch * 5.8,
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
function Qd(i) {
  if (u.mode === "result") return;
  u.mode = "result";
  const e = Math.max(0, Math.round(u.score - u.damage * 9 + Math.max(0, 220 - u.time) * 45));
  (e > u.best && ((u.best = e), localStorage.setItem("steel-ribbon-best", String(e))),
    (Qe.best.textContent = `Best score ${u.best}`),
    (Qe.resultText.textContent = `${i} Score ${e}. Time ${Dc(u.time)}. Damage ${Math.round(u.damage)}%.`));
  const t = Number.isFinite(u.bestLap) ? Dc(u.bestLap) : "--:--.-";
  ((Qe.resultStats.innerHTML = `
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${u.cleanLandings}</b>
    <b>Hard landings: ${u.hardLandings}</b>
    <b>Recoveries: ${u.recoveries}</b>
    <b>Near edges: ${Math.round(u.nearMisses)}</b>
  `),
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
    return { ...Qi, boostPads: boostPads.length, gapBeacons: gapBeaconMats.length };
  },
  stats() {
    return { trafficCrashes: qe.trafficCrashes, splats: qe.splats, roamPos: { x: +u.roamPos.x.toFixed(1), y: +u.roamPos.y.toFixed(1), z: +u.roamPos.z.toFixed(1) }, speed: +u.speed.toFixed(2), cooldown: +u.collisionCooldown.toFixed(2) };
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
    u.speed += ((o ? 68 : 40) + v) * t * i;
  }
  if (n > 0.03) {
    const v = u.speed > 1.2 ? 70 : 26;
    u.speed -= v * n * i;
  }
  const f = u.grounded ? 0.0024 : 0.0011;
  ((u.speed -= f * u.speed * d * i),
    d > 0.08 ? (u.speed -= Math.sign(u.speed) * (u.grounded ? 2.2 : 0.3) * i) : t <= 0.03 && n <= 0.03 && (u.speed = 0),
    (u.speed = MathUtils.clamp(u.speed, -16, 156 - u.damage * 0.8)),
    e && (u.speed = Math.min(u.speed, 14)),
    (u.boosting = o),
    o
      ? ((u.boost = Math.max(0, u.boost - i * 0.21)), (u.score += 28 * i))
      : (u.boost = Math.min(1, u.boost + i * (u.grounded ? 0.045 : 0.018))));
  const p = 16 + d * 0.13;
  ((u.lateralVel -= r * p * i),
    (u.lateralVel -= u.lateralVel * (u.grounded ? 4.1 : 0.7) * i),
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
    u.y < -55 && ((u.damage += 28), Uh("Track crew recovery"));
  }
  const x = u.totalDistance;
  ((u.totalDistance += u.speed * i), (u.s = ((u.totalDistance % ce.length) + ce.length) % ce.length));
  const h = Dr.find((v) => v.rampType === "off");
  if (u.freeRun && h && Eh(x, u.totalDistance, h.exitS) && u.lateral * h.dirSel > ce.width * 0.2 && iv(h)) return;
  const _ = Math.floor(u.totalDistance / ce.length) + 1;
  if (_ > u.lap) {
    const v = u.time - u.lapStartTime;
    (u.splitTimes.push(v),
      (u.bestLap = Math.min(u.bestLap, v)),
      (u.lapStartTime = u.time),
      (u.lap = _),
      (u.score += 1200),
      showScorePop("+1200 LAP", !0),
      (u.message = u.practice ? `Lap ${u.lap}` : u.lap <= ce.laps ? `Lap ${u.lap}` : "Season race complete"),
      (u.messageTimer = 1.4),
      !u.practice &&
        u.lap > ce.laps &&
        Qd(u.totalDistance >= u.rivalDistance ? "You took the chequered gantry." : "You finished behind Crowther."));
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
  if (u.mode === "race" && !u.practice) {
    const r = u.totalDistance - u.rivalDistance,
      a = MathUtils.clamp(r * 0.06, -12, 16),
      o = Math.sin(u.time * 0.6) * 5;
    ((u.rivalSpeed = MathUtils.clamp(92 + a + o, 70, 120)),
      (u.rivalDistance += u.rivalSpeed * i),
      u.rivalDistance >= ce.length * ce.laps && u.lap <= ce.laps && Qd("Crowther reached the gantry first."));
  }
  u.rivalS = ((u.rivalDistance % ce.length) + ce.length) % ce.length;
  const e = St(u.rivalS),
    gapToPlayer = Math.abs(u.rivalDistance - u.totalDistance);
  let rivalLat = Math.sin(u.rivalS * 0.02) * 1.4;
  if (gapToPlayer < 14) {
    // Side-by-side racing: the rival takes the opposite lane instead of ghosting through the player.
    const dodge = (u.lateral >= 0 ? -1 : 1) * ce.width * 0.26;
    rivalLat = MathUtils.lerp(dodge, rivalLat, gapToPlayer / 14);
  }
  const t = e.p.clone().addScaledVector(on, 1.4).addScaledVector(e.side, rivalLat);
  es.position.copy(t);
  const n = new Matrix4().makeBasis(e.side, on, e.tangent);
  es.quaternion.setFromRotationMatrix(n);
  const s = Math.abs(u.rivalDistance - u.totalDistance) < 26 && trackViewMode === "cockpit";
  es.visible = (u.mode === "race" || u.mode === "paused") && !u.practice && !s;
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
    e = u.practice ? 0 : Th(u.rivalDistance),
    t = u.practice ? "SOLO" : u.totalDistance >= u.rivalDistance ? "P1" : "P2";
  (t !== u.leadState &&
    u.mode === "race" &&
    ((u.leadState = t),
    u.practice || ((u.message = t === "P1" ? "You took the lead" : "Crowther ahead"), (u.messageTimer = 0.95))),
    (Qe.damage.style.width = `${Math.round(u.damage)}%`),
    (Qe.lap.textContent = u.practice ? `LAP ${u.lap}` : `${Math.min(u.lap, ce.laps)}/${ce.laps}`),
    (Qe.timer.textContent = Dc(u.time)));
  const n = u.mode === "roam";
  Qe.score.textContent = n
    ? `Gates ${u.objectiveHits}/${nn.length}  Score ${Math.round(u.score)}`
    : `Score ${Math.round(u.score)}`;
  const s = u.mode === "race" || u.mode === "paused" || n;
  if (
    ((Qe.position.textContent = n ? "FREE ROAM" : u.freeRun ? "FREE RUN" : u.practice ? "PRACTICE" : `${t} DIV 4`),
    n && nn.length)
  ) {
    const d = nn[u.objectiveIndex % nn.length];
    Qe.trackName.textContent = d ? `Next: ${d.label}` : "City Streets";
  }
  ((Qe.hud.style.display = s ? "flex" : "none"),
    (Qe.raceStrip.style.display = u.mode === "race" || u.mode === "paused" ? "grid" : "none"),
    (Qe.touchControls.style.display = s ? "" : "none"),
    (Qe.playerProgress.style.width = `${Math.round(i * 100)}%`),
    (Qe.rivalProgress.style.width = `${Math.round(e * 100)}%`));
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
function nu() {
  const i = p1.getDelta(),
    e = Math.min(0.033, i);
  (u.messageTimer > 0 && (u.messageTimer -= e),
    u.mode === "roam" ? ($d(e), jd(e), publishRoamTelemetry()) : (eu(e), uv(e), updateTrackCarPose(), dl(e)),
    updateGateBeam(),
    skyDome && skyDome.position.copy(Xe.position),
    tv(e),
    zd(e),
    vr(),
    nv(),
    (lr.uniforms.uTime.value += e),
    (lr.uniforms.uSpeed.value = Math.min(1, Math.abs(u.speed) / 150)));
  const n =
    (_t.has("ShiftLeft") || _t.has("ShiftRight")) && u.boost > 0.02 && (u.mode === "race" || u.mode === "roam")
      ? 1
      : Math.min(0.75, u.roamSlip * 0.55 + u.collisionDrama * 0.6);
  ((lr.uniforms.uBoost.value += (n - lr.uniforms.uBoost.value) * Math.min(1, e * 6)),
    Ws.render(),
    requestAnimationFrame(nu));
}
window.addEventListener("keydown", (i) => {
  (_t.add(i.code),
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(i.code) && i.preventDefault(),
    i.code === "KeyC" && (u.mode === "race" || u.mode === "paused") && toggleTrackView(),
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
Qe.startBtn.addEventListener("click", () => Va(!1));
Qe.practiceBtn.addEventListener("click", () => Va(!0));
Qe.freeRunBtn.addEventListener("click", () => Va(!0, !0));
Qe.roamBtn.addEventListener("click", () => Yd());
Qe.againBtn.addEventListener("click", () => Va(!1));
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
const vv = St(u.s);
u.y = vv.p.y + 2.1;
u.lastSafeS = u.s;
u.lastSafeDistance = u.totalDistance;
dl(0.016);
vr();
nu();
