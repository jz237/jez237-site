import * as THREE from 'three';
import type {Terrarium} from './Terrarium';
import {WATER_LEVEL, poolDistance} from './Ground';

export type Tool = 'hand' | 'cloud' | 'wind' | 'fog' | 'wipe' | 'feed';

const ICON: Record<string, string> = {
  hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1-5.5-3.2L3.3 13a1.4 1.4 0 0 1 2.3-1.6L8 14"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.6 8.6 4.2 4.2 0 0 1 17.5 18z"/><path d="M12 11v4M10 13h4"/>',
  fog: '<path d="M4 9h11a3 3 0 1 0-3-3M3 13h16M5 17h10a3 3 0 1 1-3 3"/>',
  wind: '<path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
  wipe: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 15c2-4 6-7 8-8M7 11c1.5-2.5 3.5-4 5.5-5"/>',
  feed: '<path d="M6 14c3-1 6-1 9 0M5 14c0-3 3-6 7-6s7 3 7 6M12 8V5M9.5 5.5 12 3l2.5 2.5"/><circle cx="16.5" cy="17" r="1.5"/><circle cx="9" cy="18" r="1.2"/>',
  follow: '<circle cx="12" cy="12" r="3"/><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/>',
  sound: '<path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3l4.5-4v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  hide: '<path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.4 7.4C3.9 9.1 2.5 12 2.5 12S6 18 12 18a9 9 0 0 0 4-.9"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/>',
};
const svg = (k: string) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`;

const TOOLS: {id: Tool; label: string; hint: string}[] = [
  {id: 'hand', label: 'Hand', hint: 'Grab a cloud and hold still to wring out rain · shake it hard for lightning · touch the water or the lizard'},
  {id: 'cloud', label: 'Cloud', hint: 'Hold to condense a new cloud · drag to stretch it · push clouds together to build a storm'},
  {id: 'wind', label: 'Wind', hint: 'Drag across the case to blow a gust'},
  {id: 'fog', label: 'Fog', hint: 'Hold or drag to pour fog — it runs downhill and pools on the water'},
  {id: 'wipe', label: 'Wipe', hint: 'Drag across the glass to wipe away condensation'},
  {id: 'feed', label: 'Feed', hint: 'Tap to drop a cricket in for the lizard'},
];

export class UI {
  tool: Tool = 'hand';
  follow = false;
  private root: HTMLElement;
  private toast: HTMLElement;
  private toastTimer = 0;
  private status: HTMLElement;
  private readout: {temp: HTMLElement; hum: HTMLElement; time: HTMLElement};
  private slider: HTMLInputElement;
  private play: HTMLButtonElement;
  private drag: {kind: 'cloud' | 'water' | 'tool' | 'condense'; last: THREE.Vector2; lastWorld?: THREE.Vector3; lastT: number; moved: number; downT: number} | null = null;
  private coached = false;
  private ray = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  onSound?: () => void;

  constructor(readonly t: Terrarium, host: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
<div class="brand">
  <div class="title">Weatherglass</div>
  <div class="subtitle">Terrarium · a bearded dragon in a glass-cased world</div>
  <div class="readout"><span><b data-r="temp">--°</b></span><span><b data-r="hum">--%</b> humidity</span><span><b data-r="time">--:--</b></span></div>
  <div class="status"><i class="dot"></i><span data-r="status">Waking the terrarium…</span></div>
</div>
<div class="actions panel">
  <button data-a="follow" title="Follow the lizard" aria-pressed="false">${svg('follow')}</button>
  <button data-a="reset" title="Reset view">${svg('reset')}</button>
  <button data-a="sound" title="Sound" aria-pressed="false">${svg('mute')}</button>
  <button data-a="full" title="Full screen">${svg('full')}</button>
  <button data-a="hide" title="Hide controls (H)">${svg('hide')}</button>
</div>
<div class="toast panel" role="status"></div>
<div class="tools panel" role="toolbar" aria-label="Weather tools">
  ${TOOLS.map((x) => `<button data-tool="${x.id}" aria-pressed="${x.id === 'hand'}" title="${x.label}">${svg(x.id)}<span>${x.label}</span></button>`).join('')}
</div>
<div class="clock panel">
  <button data-a="play" title="Let the day run">${svg('play')}</button>
  <div class="clock-body">
    <div class="clock-label"><span>Lamp schedule</span><b data-r="clock">11:30</b></div>
    <input type="range" min="0" max="24" step="0.05" value="11.5" aria-label="Time of day">
  </div>
</div>
<button class="show-ui" title="Show controls">Show controls</button>`;
    host.append(this.root);
    const q = (s: string) => this.root.querySelector(s) as HTMLElement;
    this.toast = q('.toast');
    this.status = q('[data-r="status"]');
    this.readout = {temp: q('[data-r="temp"]'), hum: q('[data-r="hum"]'), time: q('[data-r="time"]')};
    this.slider = this.root.querySelector('input[type=range]')!;
    this.play = q('[data-a="play"]') as HTMLButtonElement;
    this.root.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) => (b.onclick = () => this.setTool(b.dataset.tool as Tool)));
    q('[data-a="follow"]').onclick = () => this.setFollow(!this.follow);
    q('[data-a="reset"]').onclick = () => {this.setFollow(false); t.resetView();};
    q('[data-a="sound"]').onclick = () => this.onSound?.();
    q('[data-a="full"]').onclick = () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen?.();
    };
    q('[data-a="hide"]').onclick = () => document.body.classList.add('no-ui');
    q('.show-ui').onclick = () => document.body.classList.remove('no-ui');
    addEventListener('keydown', (e) => {
      if (e.key === 'h' || e.key === 'H') document.body.classList.toggle('no-ui');
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < TOOLS.length) this.setTool(TOOLS[idx].id);
    });
    this.slider.oninput = () => {t.weather.hours = Number(this.slider.value);};
    this.play.onclick = () => {
      t.weather.timeFlow = t.weather.timeFlow ? 0 : 0.25;
      this.play.innerHTML = svg(t.weather.timeFlow ? 'pause' : 'play');
    };
    this.bindPointer(host);
    this.say(TOOLS[0].hint, 6);
    // A second tip once the first has been read.
    setTimeout(() => {if (!this.follow && this.tool === 'hand') this.say('Tip: the eye button follows the lizard up close', 6);}, 9000);
  }

  setSoundState(on: boolean) {
    const b = this.root.querySelector('[data-a="sound"]') as HTMLButtonElement;
    b.innerHTML = svg(on ? 'sound' : 'mute');
    b.setAttribute('aria-pressed', String(on));
  }

  setTool(id: Tool) {
    this.tool = id;
    this.root.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tool === id)));
    this.say(TOOLS.find((x) => x.id === id)!.hint, 5);
    document.body.dataset.tool = id;
  }

  setFollow(on: boolean) {
    this.follow = on;
    this.t.follow = on;
    (this.root.querySelector('[data-a="follow"]') as HTMLElement).setAttribute('aria-pressed', String(on));
    if (on) this.say('Following the lizard — drag to circle it, scroll to come closer', 5);
  }

  say(text: string, seconds = 4) {
    this.toast.textContent = text;
    this.toast.classList.add('show');
    this.toastTimer = seconds;
  }

  private setRay(e: PointerEvent, host: HTMLElement) {
    const r = host.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.t.camera);
  }

  /** Where a ray meets the pool surface, if the water is the first thing it hits. */
  private pickWater(ray: THREE.Ray): THREE.Vector3 | null {
    const t = this.t;
    const hit = ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -WATER_LEVEL), new THREE.Vector3());
    if (!hit || poolDistance(hit.x, hit.z) > -0.01) return null;
    const solid = t.pickInside(ray);
    if (solid && solid.distanceTo(ray.origin) < hit.distanceTo(ray.origin) - 0.002) return null;
    return hit;
  }

  /** A point for the wind and fog tools: on the ground or water, else a mid-air plane. */
  private pickFloor(ray: THREE.Ray, lift: number): THREE.Vector3 {
    const water = this.pickWater(ray);
    const p = water ?? this.t.pickInside(ray) ?? ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2), new THREE.Vector3()) ?? new THREE.Vector3(0, 0.2, 0);
    p.x = THREE.MathUtils.clamp(p.x, -0.58, 0.58);
    p.z = THREE.MathUtils.clamp(p.z, -0.23, 0.23);
    p.y += lift;
    return p;
  }

  private bindPointer(host: HTMLElement) {
    const t = this.t;
    const canvas = t.renderer.domElement;
    const w = () => t.weather;
    // Capture-phase on the host so tools can pre-empt the orbit controls.
    host.addEventListener('pointerdown', (e) => {
      if (e.target !== canvas) return;
      if (!t.audio.running) {t.audio.start(); this.setSoundState(!t.audio.muted);}
      this.setRay(e, host);
      const last = new THREE.Vector2(e.clientX, e.clientY);
      const now = performance.now() / 1000;
      const capture = () => {e.stopPropagation(); canvas.setPointerCapture(e.pointerId);};
      if (this.tool === 'hand') {
        const c = w().clouds.pick(this.ray.ray);
        if (c) {
          w().clouds.grab(c.cloud, c.point, this.ray.ray);
          this.drag = {kind: 'cloud', last, lastT: now, moved: 0, downT: now};
          capture();
          document.body.classList.add('grabbing');
          if (!this.coached) {this.coached = true; this.say('Hold still to squeeze out rain · shake it hard to build a storm', 5);}
          return;
        }
        // a tap on the lizard is a gentle touch
        this.pendingPet = t.hitLizard(this.ray.ray);
        if (this.pendingPet) return;
        const water = this.pickWater(this.ray.ray);
        if (water) {
          t.water.poke(water.x, water.z, 1);
          t.audio.splash(0.8, THREE.MathUtils.clamp(water.x / 0.6, -1, 1) * 0.6);
          t.insects.scatter(water, 0.12);
          this.drag = {kind: 'water', last, lastWorld: water, lastT: now, moved: 0, downT: now};
          capture();
          return;
        }
        this.drag = null;
        return;
      }
      capture();
      this.drag = {kind: 'tool', last, lastT: now, moved: 0, downT: now};
      if (this.tool === 'cloud') {
        const c = w().clouds.pick(this.ray.ray);
        const p = this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.555), new THREE.Vector3()) ?? new THREE.Vector3(0, 0.555, 0);
        w().clouds.condense(c ? c.point : p, c?.cloud ?? null);
        this.drag.kind = 'condense';
      } else if (this.tool === 'feed') {
        const p = t.pickInside(this.ray.ray);
        t.feed(p);
        this.say('A cricket drops in…', 3);
      } else if (this.tool === 'wipe') {
        t.wipeGlass(this.ray.ray);
      } else if (this.tool === 'fog') {
        const p = this.pickFloor(this.ray.ray, 0);
        w().pourFog(p.x, p.z, 'down');
        t.audio.fogWhoosh();
        this.drag.lastWorld = p;
      } else if (this.tool === 'wind') {
        this.drag.lastWorld = this.pickFloor(this.ray.ray, 0.024);
      }
    }, true);
    host.addEventListener('pointermove', (e) => {
      if (e.target !== canvas) return;
      this.setRay(e, host);
      const inside = this.tool === 'hand' || this.tool === 'feed' ? t.pickInside(this.ray.ray) : null;
      t.brain.pointer = inside;
      // the hand brushes through the plants it passes over
      if (this.tool === 'hand' && inside) t.handPush.set(inside.x, inside.y, inside.z, 0.028);
      else t.handPush.w = 0;
      if (this.tool === 'hand' && !this.drag) w().clouds.setHover(w().clouds.pick(this.ray.ray)?.cloud ?? null);
      const d = this.drag;
      if (!d) return;
      const now = performance.now() / 1000;
      const dt = Math.max(1 / 240, now - d.lastT);
      const dx = e.clientX - d.last.x, dy = e.clientY - d.last.y;
      const px = Math.hypot(dx, dy);
      d.moved += px;
      d.last.set(e.clientX, e.clientY);
      d.lastT = now;
      if (d.kind === 'cloud') {
        w().clouds.drag(this.ray.ray, px);
      } else if (d.kind === 'water') {
        const p = this.pickWater(this.ray.ray);
        if (p && d.lastWorld) {
          const dist = p.distanceTo(d.lastWorld);
          const n = Math.min(12, Math.floor(dist / 0.006));
          for (let i = 1; i <= n; i++) {
            const q = d.lastWorld.clone().lerp(p, i / n);
            t.water.stir(q.x, q.z, dist / dt);
          }
          if (n > 0) d.lastWorld = p;
        }
      } else if (d.kind === 'condense') {
        const p = this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.555), new THREE.Vector3());
        if (p) w().clouds.condenseMove(p);
      } else if (this.tool === 'wind' && d.lastWorld) {
        const p = this.pickFloor(this.ray.ray, 0.024);
        const seg = p.clone().sub(d.lastWorld);
        seg.y = 0;
        const dist = seg.length();
        if (dist > 0.002) {
          const speed = Math.min(1.5, (dist / dt) * 0.9);
          const dir = seg.normalize();
          const n = Math.max(1, Math.min(12, Math.ceil(dist / 0.02)));
          for (let i = 1; i <= n; i++) {
            const q = d.lastWorld.clone().lerp(p, i / n);
            w().stroke(q.x, q.z, dir.x * speed, dir.z * speed);
          }
          t.audio.windStroke(speed / 1.5, THREE.MathUtils.clamp(p.x / 0.6, -1, 1) * 0.7);
          d.lastWorld = p;
        }
      } else if (this.tool === 'wipe') {
        t.wipeGlass(this.ray.ray);
      } else if (this.tool === 'fog' && d.lastWorld) {
        const p = this.pickFloor(this.ray.ray, 0);
        const dist = Math.hypot(p.x - d.lastWorld.x, p.z - d.lastWorld.z);
        const n = Math.min(24, Math.floor(dist / 0.012));
        const dir = new THREE.Vector2(p.x - d.lastWorld.x, p.z - d.lastWorld.z).normalize();
        for (let i = 1; i <= n; i++) {
          const q = d.lastWorld.clone().lerp(p, i / n);
          w().pourFog(q.x, q.z, 'move', 0, 0, dir);
        }
        if (n > 0) d.lastWorld = p;
      }
    }, true);
    host.addEventListener('wheel', (e) => {
      if (this.tool !== 'hand') return;
      const r = host.getBoundingClientRect();
      this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.ray.setFromCamera(this.ndc, t.camera);
      const c = w().clouds.pick(this.ray.ray);
      if (c && e.deltaY > 0) {
        // scrolling down over a cloud wrings it out instead of zooming
        w().clouds.wheel(c.cloud, e.deltaY);
        e.stopPropagation();
        e.preventDefault();
      }
    }, {capture: true, passive: false});
    const end = (e: PointerEvent) => {
      const d = this.drag;
      if (d?.kind === 'cloud') {w().clouds.release(); document.body.classList.remove('grabbing');}
      if (d?.kind === 'condense') w().clouds.condenseEnd();
      if (d?.kind === 'water' && d.lastWorld) t.water.flick(d.lastWorld.x, d.lastWorld.z, 2 + Math.floor(Math.random() * 3), 0.15);
      this.drag = null;
      if (this.pendingPet && this.tool === 'hand') {
        this.setRay(e, host);
        if (t.hitLizard(this.ray.ray)) {t.brain.pet(); this.say('The dragon closes its eyes', 3);}
      }
      this.pendingPet = false;
    };
    host.addEventListener('pointerup', end, true);
    host.addEventListener('pointercancel', end, true);
    host.addEventListener('pointerleave', () => {t.brain.pointer = null; t.handPush.w = 0; w().clouds.setHover(null);});
  }
  private pendingPet = false;

  update(dt: number) {
    const t = this.t;
    // holding still with the fog or cloud tool keeps pouring / condensing
    const d = this.drag;
    if (d && this.tool === 'fog' && d.lastWorld) t.weather.pourFog(d.lastWorld.x, d.lastWorld.z, 'hold', dt, performance.now() / 1000 - d.downT);
    if (this.toastTimer > 0) {
      this.toastTimer -= dt;
      if (this.toastTimer <= 0) this.toast.classList.remove('show');
    }
    const w = t.weather;
    const hh = Math.floor(w.hours), mm = Math.floor((w.hours - hh) * 60);
    const time = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    this.readout.time.textContent = time;
    (this.root.querySelector('[data-r="clock"]') as HTMLElement).textContent = time;
    if (document.activeElement !== this.slider) this.slider.value = String(w.hours);
    this.readout.temp.textContent = `${t.temperature.toFixed(0)}°C`;
    this.readout.hum.textContent = `${Math.round(w.humidity * 100)}%`;
    this.status.textContent = t.brain.status;
  }
}
