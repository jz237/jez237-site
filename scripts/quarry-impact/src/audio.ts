import {impactSoundLayers} from './impact-response';
import { url } from './assets';
import type { Vehicle } from './vehicle';
import * as T from 'three';
import type { ThermalAudio } from './vehicle-fire';
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
  private activeShots = new Set<AudioBufferSourceNode>();
  lastShot = new Map<string, number>();
  levels = { engine: 0.72, effects: 0.8, ambience: 0.45 };
  history = new Map<
    number,
    { throttle: number; slip: number; grounded: boolean; gear: number }
  >();
  listenerPrevious = new T.Vector3();
  private files?: Promise<{id:string; data:ArrayBuffer}[]>;
  private initializing?: Promise<void>;
  /** Fetch bundled clips while lighting warms up. Audio playback still starts
   * only after the user's gesture, using the real output context's sample rate. */
  preload() {
    if (this.ready) return Promise.resolve([] as {id:string;data:ArrayBuffer}[]);
    return this.files ??= (async()=>{
      const response=await fetch(url('audio/manifest.json'));
      if(!response.ok)throw new Error('Audio manifest unavailable');
      const list:{id:string;file:string}[]=await response.json();
      const files:{id:string;data:ArrayBuffer}[]=new Array(list.length);let next=0;
      await Promise.all(Array.from({length:4},async()=>{
        while(next<list.length){const index=next++,entry=list[index];
          const clip=await fetch(url('audio/'+entry.file));
          if(!clip.ok)throw new Error('Audio clip unavailable: '+entry.id);
          files[index]={id:entry.id,data:await clip.arrayBuffer()};
        }
      }));
      return files;
    })().catch(error=>{this.files=undefined;throw error;});
  }
  async init() {
    if (!this.ctx) {
    this.ctx = new AudioContext({latencyHint:'interactive'});
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
    }
    await this.ctx.resume();
    if(this.ready)return;
    await (this.initializing ??= (async()=>{
      const files=await this.preload();
      await Promise.all(files.map(async file=>this.buffers.set(file.id,await this.ctx!.decodeAudioData(file.data))));
      files.length=0;this.files=undefined;
      this.ready=true;
      this.ambient=this.loop('ambience',this.ambientBus!);
      if(this.ambient)this.ambient.gain.gain.value=.45;
    })().catch(error=>{this.initializing=undefined;this.files=undefined;throw error;}));
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
      for (const name of ['tires', 'gravel', 'scrape', 'fire-roar', 'fire-crackle']) {
        const loop = this.loop(name, this.fxBus!);
        if (loop) loops.set(name, loop);
      }
      this.loops.set(car.id, loops);
    }
  }
  clearCars() {
    for (const source of this.activeShots) { try { source.stop(); } catch {} }
    for (const loops of this.loops.values())
      for (const l of loops.values()) {
        l.source.stop();
        l.source.disconnect();
        l.gain.disconnect();
        l.pan.disconnect();
      }
    this.loops.clear();
    this.history.clear();
    this.lastShot.clear();
  }
  thermal(sources:ThermalAudio[],bursts:ThermalAudio[]) {
    if(!this.ready)return;
    const now=this.ctx!.currentTime;
    for(const e of sources)for(const name of ['fire-roar','fire-crackle']){
      const loop=this.loops.get(e.id)?.get(name);if(!loop)continue;
      loop.pan.positionX.value=e.position.x;loop.pan.positionY.value=e.position.y;loop.pan.positionZ.value=e.position.z;
      loop.gain.gain.setTargetAtTime(e.heat*(name==='fire-roar'?.21:.16),now,.1);
      loop.source.playbackRate.setTargetAtTime(.91+(e.id%4)*.037+e.heat*.08,now,.2);
    }
    for(const e of bursts){
      this.shot('vehicle-burst',e.position,.86,{rate:.96,delay:0,duration:3.2});
      this.shot('debris',e.position,.2,{rate:.84,delay:.17,duration:1.7});
    }
  }
  impact(damage:number,p:T.Vector3,glass=false,debris=false) {
    for(const layer of impactSoundLayers(damage,glass,debris))this.shot(layer.id,p,layer.volume,layer);
  }
  shot(id: string, p: T.Vector3, volume = 1, options?:{rate:number;delay:number;duration:number}) {
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
    source.playbackRate.value = (options?.rate ?? 1) * (0.96 + Math.random() * 0.08);
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
    this.activeShots.add(source);
    source.onended = () => {
      this.activeVoices--;
      this.activeShots.delete(source);
      source.disconnect();
      gain.disconnect();
      pan.disconnect();
    };
    if(options) {
      const at=c.currentTime+options.delay,duration=Math.min(options.duration,buf.duration/source.playbackRate.value);
      gain.gain.setValueAtTime(Math.min(1,volume),at);
      gain.gain.setValueAtTime(Math.min(1,volume),at+Math.max(.02,duration-.12));
      gain.gain.exponentialRampToValueAtTime(.001,at+duration);
      source.start(at);source.stop(at+duration);
    }else source.start();
  }
  update(cars: Vehicle[], camera: T.Camera, dt: number, wreckInspection=false) {
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
      const grounded = car.remoteGrounded ?? [0, 1, 2, 3].some((i) =>
        car.controller.wheelIsInContact(i),
      );
      if (prior && !wreckInspection) {
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
        level = car === cars[0] ? 0.38 : 0.22;
      for (const [name, l] of loops) {
        if(name.startsWith('fire-'))continue;
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
          v=Math.max(car.slip>4&&car.health<80?.035:0,Math.min(.13,(car.scraping??0)*.12));
        if (car.health <= 0 && !['tires', 'gravel', 'scrape'].includes(name))
          v = 0;
        if(wreckInspection)v=0;
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
