import * as THREE from 'three';
import type {Terrarium} from './Terrarium';
import type {Cloud} from './Clouds';

export type Tool = 'hand' | 'rain' | 'mist' | 'wind' | 'wipe' | 'feed';

const ICON: Record<string, string> = {
  hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1-5.5-3.2L3.3 13a1.4 1.4 0 0 1 2.3-1.6L8 14"/>',
  rain: '<path d="M7 16a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 7.5a3.6 3.6 0 0 1 .5 7.2"/><path d="M9 18.5l-1 2.5M13 17.5l-1 2.5M17 17l-1 2.5"/>',
  mist: '<path d="M4 9h11a3 3 0 1 0-3-3M3 13h16M5 17h10a3 3 0 1 1-3 3"/>',
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
  {id: 'hand', label: 'Hand', hint: 'Drag to look around · grab a cloud to move it · touch the lizard'},
  {id: 'rain', label: 'Rain', hint: 'Press and hold a cloud to wring out rain'},
  {id: 'mist', label: 'Mist', hint: 'Hold anywhere to fill the case with mist'},
  {id: 'wind', label: 'Wind', hint: 'Drag across the scene to blow a gust'},
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
  private drag: {kind: 'cloud' | 'tool'; cloud?: Cloud; plane?: THREE.Plane; offset?: THREE.Vector3; last: THREE.Vector2; moved: number} | null = null;
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

  private bindPointer(host: HTMLElement) {
    const t = this.t;
    const canvas = t.renderer.domElement;
    // Capture-phase on the host so tools can pre-empt the orbit controls.
    host.addEventListener('pointerdown', (e) => {
      if (e.target !== canvas) return;
      if (!t.audio.running) {t.audio.start(); this.setSoundState(!t.audio.muted);}
      this.setRay(e, host);
      const last = new THREE.Vector2(e.clientX, e.clientY);
      if (this.tool === 'hand') {
        const c = t.weather.clouds.pick(this.ray.ray);
        if (c) {
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -c.centre.y);
          const hit = this.ray.ray.intersectPlane(plane, new THREE.Vector3());
          this.drag = {kind: 'cloud', cloud: c, plane, offset: hit ? c.centre.clone().sub(hit) : new THREE.Vector3(), last, moved: 0};
          e.stopPropagation();
          canvas.setPointerCapture(e.pointerId);
          document.body.classList.add('grabbing');
          return;
        }
        this.drag = null;
        // a tap on the lizard is a gentle touch
        this.pendingPet = t.hitLizard(this.ray.ray);
        return;
      }
      e.stopPropagation();
      canvas.setPointerCapture(e.pointerId);
      this.drag = {kind: 'tool', last, moved: 0};
      if (this.tool === 'rain') {
        const c = t.weather.clouds.pick(this.ray.ray);
        if (c) {this.drag.cloud = c; t.weather.squeeze(c, 1); this.say('Rain!', 2);}
        else this.say('Press and hold on a cloud to wring out its rain', 3);
      } else if (this.tool === 'feed') {
        const p = t.pickInside(this.ray.ray);
        t.feed(p);
        this.say('A cricket drops in…', 3);
      } else if (this.tool === 'wipe') {
        t.wipeGlass(this.ray.ray);
      } else if (this.tool === 'mist') {
        t.weather.mistTarget = Math.min(1, t.weather.mistTarget + 0.15);
      }
    }, true);
    host.addEventListener('pointermove', (e) => {
      if (e.target !== canvas) return;
      this.setRay(e, host);
      t.brain.pointer = this.tool === 'hand' || this.tool === 'feed' ? t.pickInside(this.ray.ray) : null;
      const d = this.drag;
      if (!d) return;
      const dx = e.clientX - d.last.x, dy = e.clientY - d.last.y;
      d.moved += Math.hypot(dx, dy);
      d.last.set(e.clientX, e.clientY);
      if (d.kind === 'cloud' && d.cloud && d.plane) {
        const hit = this.ray.ray.intersectPlane(d.plane, new THREE.Vector3());
        if (hit) {
          const target = hit.add(d.offset!);
          d.cloud.velocity.copy(target).sub(d.cloud.centre).multiplyScalar(8);
          d.cloud.centre.lerp(target, 0.6);
        }
      } else if (this.tool === 'wind') {
        const right = new THREE.Vector3().setFromMatrixColumn(t.camera.matrixWorld, 0).setY(0).normalize();
        const fwd = new THREE.Vector3().setFromMatrixColumn(t.camera.matrixWorld, 2).setY(0).normalize().negate();
        const gust = right.multiplyScalar(dx).addScaledVector(fwd, -dy).multiplyScalar(0.004);
        t.weather.wind.add(gust).clampLength(0, 1.6);
      } else if (this.tool === 'wipe') {
        t.wipeGlass(this.ray.ray);
      } else if (this.tool === 'mist') {
        t.weather.mistTarget = Math.min(1, t.weather.mistTarget + 0.01);
      }
    }, true);
    const end = (e: PointerEvent) => {
      if (this.drag?.kind === 'tool' && this.tool === 'rain') t.weather.squeeze(null, 0);
      if (this.drag?.kind === 'cloud') document.body.classList.remove('grabbing');
      this.drag = null;
      if (this.pendingPet && this.tool === 'hand') {
        this.setRay(e, host);
        if (t.hitLizard(this.ray.ray)) {t.brain.pet(); this.say('The dragon closes its eyes', 3);}
      }
      this.pendingPet = false;
    };
    host.addEventListener('pointerup', end, true);
    host.addEventListener('pointercancel', end, true);
    host.addEventListener('pointerleave', () => {t.brain.pointer = null;});
  }
  private pendingPet = false;

  update(dt: number) {
    const t = this.t;
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
