import { url } from './assets';
import type { Vehicle } from './vehicle';
import * as T from 'three';
type Loop = { source: AudioBufferSourceNode; gain: GainNode; pan: PannerNode };
export class Sound {
  ctx?: AudioContext;
  master?: GainNode;
  engineBus?: GainNode;
  fxBus?: GainNode;
  ambientBus?: GainNode;
  buffers = new Map<string, AudioBuffer>();
  loops = new Map<number, Map<string, Loop>>();
  ambient?: Loop;
  muted = false;
  ready = false;
  activeVoices = 0;
  lastShot = new Map<string, number>();
  levels = { engine: 0.72, effects: 0.8, ambience: 0.45 };
  history = new Map<
    number,
    { throttle: number; slip: number; grounded: boolean; gear: number }
  >();
  listenerPrevious = new T.Vector3();
  async init() {
    if (this.ctx) {
      await this.ctx.resume();
      return;
    }
    this.ctx = new AudioContext();
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.75;
    const compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 12;
    compressor.ratio.value = 8;
    this.master.connect(compressor).connect(c.destination);
    this.engineBus = c.createGain();
    this.fxBus = c.createGain();
    this.ambientBus = c.createGain();
    for (const b of [this.engineBus, this.fxBus, this.ambientBus])
      b.connect(this.master);
    this.setLevels();
    const list = await fetch(url('audio/manifest.json')).then((r) => r.json());
    await Promise.all(
      list.map(async (a: { id: string; file: string }) => {
        const data = await fetch(url('audio/' + a.file)).then((r) =>
          r.arrayBuffer(),
        );
        this.buffers.set(a.id, await c.decodeAudioData(data));
      }),
    );
    this.ready = true;
    this.ambient = this.loop('ambience', this.ambientBus);
    if (this.ambient) this.ambient.gain.gain.value = 0.45;
  }
  setLevels() {
    if (this.engineBus) this.engineBus.gain.value = this.levels.engine;
    if (this.fxBus) this.fxBus.gain.value = this.levels.effects;
    if (this.ambientBus) this.ambientBus.gain.value = this.levels.ambience;
  }
  loop(id: string, bus: AudioNode) {
    const c = this.ctx!,
      buffer = this.buffers.get(id);
    if (!buffer) return undefined;
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = c.createGain();
    gain.gain.value = 0;
    const pan = c.createPanner();
    pan.panningModel = 'equalpower';
    pan.distanceModel = 'inverse';
    pan.refDistance = 7;
    pan.maxDistance = 200;
    pan.rolloffFactor = 1.2;
    source.connect(gain).connect(pan).connect(bus);
    source.start(0, Math.random() * buffer.duration);
    return { source, gain, pan };
  }
  attach(cars: Vehicle[]) {
    this.clearCars();
    if (!this.ready) return;
    for (const car of cars) {
      const loops = new Map<string, Loop>();
      for (const name of ['idle', 'low', 'mid', 'high', 'load', 'damaged']) {
        const loop = this.loop(car.kind + '-' + name, this.engineBus!);
        if (loop) loops.set(name, loop);
      }
      for (const name of ['tires', 'gravel', 'scrape']) {
        const loop = this.loop(name, this.fxBus!);
        if (loop) loops.set(name, loop);
      }
      this.loops.set(car.id, loops);
    }
  }
  clearCars() {
    for (const loops of this.loops.values())
      for (const l of loops.values()) {
        l.source.stop();
        l.source.disconnect();
        l.gain.disconnect();
        l.pan.disconnect();
      }
    this.loops.clear();
    this.history.clear();
  }
  shot(id: string, p: T.Vector3, volume = 1) {
    if (!this.ready || this.activeVoices >= 18) return;
    const c = this.ctx!,
      buf = this.buffers.get(id);
    if (!buf) return;
    const key = id + Math.round(p.x / 5) + Math.round(p.z / 5);
    if (c.currentTime - (this.lastShot.get(key) ?? -10) < 0.15) return;
    this.lastShot.set(key, c.currentTime);
    if (this.lastShot.size > 200) this.lastShot.clear();
    const source = c.createBufferSource();
    source.buffer = buf;
    source.playbackRate.value = 0.93 + Math.random() * 0.14;
    const gain = c.createGain();
    gain.gain.value = Math.min(1, volume);
    const pan = c.createPanner();
    pan.panningModel = 'equalpower';
    pan.refDistance = 8;
    pan.rolloffFactor = 1;
    pan.positionX.value = p.x;
    pan.positionY.value = p.y;
    pan.positionZ.value = p.z;
    source.connect(gain).connect(pan).connect(this.fxBus!);
    this.activeVoices++;
    source.onended = () => {
      this.activeVoices--;
      source.disconnect();
      gain.disconnect();
      pan.disconnect();
    };
    source.start();
  }
  update(cars: Vehicle[], camera: T.Camera, dt: number) {
    if (!this.ready) return;
    const c = this.ctx!,
      listener = c.listener;
    const p = camera.position;
    const listenerVelocity = p
      .clone()
      .sub(this.listenerPrevious)
      .divideScalar(Math.max(0.001, dt));
    this.listenerPrevious.copy(p);
    listener.positionX.value = p.x;
    listener.positionY.value = p.y;
    listener.positionZ.value = p.z;
    const f = new T.Vector3(0, 0, -1).applyQuaternion(camera.quaternion),
      up = new T.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    listener.forwardX.value = f.x;
    listener.forwardY.value = f.y;
    listener.forwardZ.value = f.z;
    listener.upX.value = up.x;
    listener.upY.value = up.y;
    listener.upZ.value = up.z;
    if (this.ambient) {
      this.ambient.pan.positionX.value = p.x;
      this.ambient.pan.positionY.value = p.y;
      this.ambient.pan.positionZ.value = p.z;
    }
    for (const car of cars) {
      const loops = this.loops.get(car.id);
      if (!loops) continue;
      const prior = this.history.get(car.id);
      const grounded = [0, 1, 2, 3].some((i) =>
        car.controller.wheelIsInContact(i),
      );
      if (prior) {
        if (car.gear !== prior.gear && Math.abs(car.speed) > 3) {
          this.shot(car.kind + '-shift', car.current, 0.18);
          this.shot(car.kind + '-exhaust', car.current, 0.12);
        }
        if (prior.throttle > 0.7 && car.input.throttle < 0.2 && car.speed > 8)
          this.shot(car.kind + '-exhaust', car.current, 0.14);
        if (car.slip > 3 && prior.slip <= 3)
          this.shot('skid', car.current, 0.16);
        if (grounded && !prior.grounded)
          this.shot('suspension', car.current, 0.22);
      }
      this.history.set(car.id, {
        throttle: car.input.throttle,
        slip: car.slip,
        grounded,
        gear: car.gear,
      });
      const radial = p.clone().sub(car.current).normalize();
      const doppler = Math.max(
        0.93,
        Math.min(
          1.07,
          343 / (343 - car.velocity.clone().sub(listenerVelocity).dot(radial)),
        ),
      );
      const rpm = car.rpm,
        level = car.id === 0 ? 0.38 : 0.22;
      for (const [name, l] of loops) {
        l.pan.positionX.value = car.current.x;
        l.pan.positionY.value = car.current.y;
        l.pan.positionZ.value = car.current.z;
        let v = 0;
        const centers: { [k: string]: number } = {
          idle: 850,
          low: 2200,
          mid: 4100,
          high: 6500,
        };
        if (name in centers) {
          v = Math.max(0, 1 - Math.abs(rpm - centers[name]) / 2100) * level;
          if (car.health === 0) v = 0;
          l.source.playbackRate.setTargetAtTime(
            Math.max(0.72, Math.min(1.4, (rpm / centers[name]) * doppler)),
            c.currentTime,
            0.13,
          );
        } else if (name === 'load') v = Math.abs(car.input.throttle) * 0.07;
        else if (name === 'damaged')
          v = Math.max(0, (40 - car.health) / 40) * 0.18;
        else if (name === 'tires')
          v =
            Math.min(0.35, car.slip * 0.06) *
            (car.surface === 'asphalt' ? 1 : 0.3);
        else if (name === 'gravel')
          v =
            car.surface === 'gravel'
              ? Math.min(0.22, Math.abs(car.speed) * 0.008)
              : 0;
        else if (name === 'scrape')
          v = car.slip > 4 && car.health < 80 ? 0.035 : 0;
        if (car.health <= 0 && !['tires', 'gravel', 'scrape'].includes(name))
          v = 0;
        l.gain.gain.setTargetAtTime(v, c.currentTime, 0.08);
      }
    }
  }
  async pause(value: boolean) {
    if (!this.ctx) return;
    if (value) await this.ctx.suspend();
    else await this.ctx.resume();
  }
  mute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.75;
  }
}
