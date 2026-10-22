import {materialImpactProfile,type ImpactMaterial} from './impact-material';
import {readAudioOutput,type AudioOutput} from './audio-output';
import {TrackAcousticProbe,TrackReflections} from './track-acoustics';
import type {CameraObstruction} from './demo-camera-visibility';
import {ContactScraping} from './contact-scraping';
import {scrapeSurfaceMix} from './scrape-surface-audio';
import {gearboxGrindSamples} from './transmission';
import {audioListenerPosition,AudioListenerMotion,type AudioPerspective} from './audio-perspective';
import {starterSamples} from './engine-stall';
import {engineDamageLevel} from './engine-condition';
import {classicEngineVoice,vehicleWheelRadius} from './classic-vehicle-specs';
import {RATTLE,rattleRate,thumpRate,EventClock,synthClank,synthThump} from './damage-rattle';
import {knockRate} from './oil-starvation';
/** Front compression past which the fan hits its shroud, and its clatter rate cap. */
const FAN_CLATTER={onset:.35,max:12} as const;
import {impactSoundLayers} from './impact-response';
import { url } from './assets';
import type { Vehicle } from './vehicle';
import * as T from 'three';
import type { ThermalAudio } from './vehicle-fire';
type Loop = { source: AudioBufferSourceNode; gain: GainNode; pan: PannerNode };
import {CrowdRoar} from './crowd-roar';
/** Engine-layer level during a misfire cut. */
export const MISFIRE_AUDIO=.3;
export class Sound {
  private acousticProbe=new TrackAcousticProbe();
  private reflections?:TrackReflections;
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
  private shotPanners=new Map<AudioBufferSourceNode,PannerNode>();
  private crowdRoar?:CrowdRoar;
  private rattleClock=new EventClock();
  /** Damage sounds played so far (QA). */
  readonly damageSounds={rattle:0,thump:0,knock:0,fan:0};
  private rainHiss?:{source:AudioBufferSourceNode;gain:GainNode};
  output:AudioOutput='speakers';
  setOutput(value:unknown){
    this.output=readAudioOutput(value);
    if(this.master){this.master.channelCount=this.output==='mono'?1:2;this.master.channelCountMode='explicit';this.master.channelInterpretation='speakers';}
    const model=this.output==='headphones'?'HRTF':'equalpower';
    for(const loops of this.loops.values())for(const loop of loops.values())loop.pan.panningModel=model;
    if(this.ambient)this.ambient.pan.panningModel=model;
    for(const pan of this.shotPanners.values())pan.panningModel=model;
  }
  lastShot = new Map<string, number>();
  levels = { engine: 0.72, effects: 0.8, ambience: 0.45 };
  history = new Map<
    number,
    { throttle: number; slip: number; grounded: boolean; gear: number }
  >();
  listenerPrevious = new T.Vector3();
  private listenerMotion=new AudioListenerMotion();
  private files?: Promise<{id:string; data:ArrayBuffer}[]>;
  private initializing?: Promise<void>;
  private paused = false;
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
    this.setOutput(this.output);
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
    // Browser activation may leave resume pending indefinitely. Asset readiness
    // must not wait for permission to play when Start came from a polled pad.
    this.unlock();
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
  /** Call synchronously from a real pointer/key gesture to retry audio activation. */
  unlock() {
    const ctx=this.ctx;
    if(!ctx||this.paused||ctx.state==='running'||ctx.state==='closed')return;
    void ctx.resume().then(()=>{
      // A request made before Pause may only resolve on a later user gesture.
      if(this.paused&&this.ctx===ctx)return this.pause(true);
    }).catch(()=>{});
  }
  /** Crowd reaction to a big moment (0..1); silent until audio is unlocked, and when muted or paused. */
  crowd(intensity:number){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running')return false;
    this.crowdRoar??=new CrowdRoar(this.ctx,this.ambientBus);
    return this.crowdRoar.roar(intensity);
  }
  /** A soft looping rain hiss on the ambience bus while it rains. */
  rain(on:boolean){
    const c=this.ctx;if(!c||!this.ambientBus||!this.ready)return;
    if(on&&!this.rainHiss){
      const length=c.sampleRate*3,buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);let b=0;for(let i=0;i<length;i++){b=.6*b+(Math.random()*2-1)*.4;data[i]=b*.5;}
      const source=c.createBufferSource();source.buffer=buffer;source.loop=true;const high=c.createBiquadFilter();high.type='highpass';high.frequency.value=900;const gain=c.createGain();gain.gain.value=0;gain.gain.setTargetAtTime(.16,c.currentTime,.8);
      source.connect(high);high.connect(gain);gain.connect(this.ambientBus);source.start();this.rainHiss={source,gain};
    }else if(!on&&this.rainHiss){const {source,gain}=this.rainHiss;gain.gain.setTargetAtTime(0,c.currentTime,.4);source.stop(c.currentTime+2);this.rainHiss=undefined;}
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
    pan.panningModel = this.output==='headphones'?'HRTF':'equalpower';
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
    if(!this.buffers.has('starter')){const c=this.ctx!,samples=starterSamples(c.sampleRate),buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);this.buffers.set('starter',buffer);}
    if(!this.buffers.has('gear-grind')){const c=this.ctx!,samples=gearboxGrindSamples(c.sampleRate),buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);this.buffers.set('gear-grind',buffer);}
    for (const car of cars) {
      const loops = new Map<string, Loop>();
      for (const name of ['idle', 'low', 'mid', 'high', 'load', 'damaged']) {
        const loop = this.loop(classicEngineVoice(car.kind).bank + '-' + name, this.engineBus!);
        if (loop) {loop.source.playbackRate.value=classicEngineVoice(car.kind).pitch;loops.set(name, loop);}
      }
      const grind=this.loop('gear-grind',this.engineBus!);if(grind)loops.set('gear-grind',grind);
      const starter=this.loop('starter',this.engineBus!);if(starter)loops.set('starter',starter);
      for (const name of ['tires', 'gravel', 'scrape', 'scrape-loose', 'fire-roar', 'fire-crackle']) {
        const loop = this.loop(name==='scrape-loose'?'gravel':name, this.fxBus!);
        if (loop) loops.set(name, loop);
      }
      this.loops.set(car.id, loops);
    }
  }
  readonly contactScraping=new ContactScraping();
  clearCars() {
    this.contactScraping.clear();
    this.reflections?.dispose();this.reflections=undefined;this.acousticProbe.reset();
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
    this.listenerMotion.reset();
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
  impact(damage:number,p:T.Vector3,glass=false,debris=false,material:ImpactMaterial='metal') {
    const profile=materialImpactProfile(material);
    for(const layer of impactSoundLayers(damage,glass,debris)){
      const body=layer.id.startsWith('impact-');
      this.shot(layer.id,p,layer.volume*(body?profile.gain:1),body?{...layer,rate:layer.rate*profile.rate,duration:layer.duration*profile.duration,lowpass:profile.lowpass}:layer);
    }
  }
  /** A misfire's exhaust pop: the burst sample, pitched up, cut short and muffled. */
  backfire(p:T.Vector3){this.shot('vehicle-burst',p,.5,{rate:2.1,delay:0,duration:.17,lowpass:2400});}
  private groundFireLoop?:Loop;
  /** Burning oil or fuel on the ground: one crackling loop at the nearest fire (null = none). */
  groundFire(nearest:{p:T.Vector3;level:number}|null){
    if(!this.ready||!this.fxBus)return;
    this.groundFireLoop??=this.loop('fire-crackle',this.fxBus);const l=this.groundFireLoop;if(!l)return;
    const now=this.ctx!.currentTime;
    if(nearest){l.pan.positionX.value=nearest.p.x;l.pan.positionY.value=nearest.p.y+.4;l.pan.positionZ.value=nearest.p.z;}
    l.gain.gain.setTargetAtTime(nearest?Math.min(.34,nearest.level*.24):0,now,.15);
  }
  /** An oil drum blowing up: the burst sample, full and low. */
  drumBlast(p:T.Vector3){this.shot('vehicle-burst',p,1,{rate:.8,delay:0,duration:1.4});}
  /** A puddle catching: a soft whoomph, bigger for fuel. */
  groundIgnite(p:T.Vector3,kind:number){this.shot('fire-roar',p,kind===2?.55:.35,{rate:kind===2?1.25:.95,delay:0,duration:.9,lowpass:1800});}
  /** A tyre bursting at speed: a sharp, full bang (the burst sample, less pitched up than a backfire). */
  blowout(p:T.Vector3){this.shot('vehicle-burst',p,.85,{rate:1.45,delay:0,duration:.32});}
  shot(id: string, p: T.Vector3, volume = 1, options?:{rate:number;delay:number;duration:number;lowpass?:number}) {
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
    pan.panningModel = this.output==='headphones'?'HRTF':'equalpower';
    pan.refDistance = 8;
    pan.rolloffFactor = 1;
    pan.positionX.value = p.x;
    pan.positionY.value = p.y;
    pan.positionZ.value = p.z;
    const filter=options?.lowpass?c.createBiquadFilter():undefined;
    if(filter){filter.type='lowpass';filter.frequency.value=options!.lowpass!;filter.Q.value=.7;source.connect(filter).connect(gain);}else source.connect(gain);
    gain.connect(pan).connect(this.fxBus!);
    this.activeVoices++;
    this.activeShots.add(source);
    this.shotPanners.set(source,pan);
    source.onended = () => {
      this.activeVoices--;
      this.activeShots.delete(source);
      this.shotPanners.delete(source);
      source.disconnect();
      filter?.disconnect();
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
  update(cars: Vehicle[], camera: T.Camera, dt: number, wreckInspection=false,perspective?:AudioPerspective,sceneryProbe?:CameraObstruction) {
    if (!this.ready) return;
    const c = this.ctx!,
      listener = c.listener;
    const focused=cars.find(car=>car.id===perspective?.id)??cars[0];
    const p=audioListenerPosition(camera.position,focused?.current,perspective?.view);
    const listenerVelocity=this.listenerMotion.velocity(p,dt,`${focused?.id??-1}:${perspective?.view??'world'}`);
    this.listenerPrevious.copy(p);
    if(sceneryProbe&&this.engineBus&&this.fxBus&&this.master){
      this.reflections??=new TrackReflections(c,[this.engineBus,this.fxBus],this.master);
      this.reflections.update(wreckInspection?{taps:[0,0,0,0],cutoff:4200}:this.acousticProbe.update(p,dt,sceneryProbe));
    }
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
        if (!(car.engineStall!>0)&&car.health>0&&car.gear !== prior.gear && Math.abs(car.speed) > 3) {
          this.shot(classicEngineVoice(car.kind).bank + '-shift', car.current, 0.18);
          this.shot(classicEngineVoice(car.kind).bank + '-exhaust', car.current, 0.12);
        }
        if (!(car.engineStall!>0)&&car.health>0&&prior.throttle > 0.7 && car.input.throttle < 0.2 && car.speed > 8)
          this.shot(classicEngineVoice(car.kind).bank + '-exhaust', car.current, 0.14);
        if (grounded && car.slip > 3 && prior.slip <= 3)
          this.shot('skid', car.current, 0.16);
        if (grounded && !prior.grounded)
          this.shot('suspension', car.current, 0.22);
      }
      if(!wreckInspection)this.damageRattle(car,p,dt,car===focused);
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
        level = car === focused ? 0.38 : 0.22;
      const scrapeMix=scrapeSurfaceMix(car.scraping??0,this.contactScraping.level(car.id),car.surface,car.speed);
      // A misfire cut drops the combustion layers and lets the damaged rattle through: an audible stutter.
      const cut=(car.misfireFactor??1)<1?MISFIRE_AUDIO:1;
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
          v = Math.max(0, 1 - Math.abs(Math.min(rpm,6500) - centers[name]) / 2100) * level * cut;
          if (car.health === 0) v = 0;
          l.source.playbackRate.setTargetAtTime(
            Math.max(0.72, Math.min(1.4, (rpm / centers[name]) * doppler))*classicEngineVoice(car.kind).pitch,
            c.currentTime,
            0.13,
          );
        } else if (name === 'gear-grind') v=car.health>0?.16*Math.min(1,(car.transmission?.grind??0)/.3):0;
        else if (name === 'starter') v=car.health>0&&car.engineStall!>0&&car.rpm>0?.13:0;
        else if (name === 'load') v = Math.abs(car.input.throttle) * 0.07 * cut;
        else if (name === 'damaged')
          v = engineDamageLevel(car.health,car.engineDamage) * 0.18 * (cut<1?1.6:1);
        else if (name === 'tires')
          v =
            Math.min(0.35, car.slip * 0.06) *
            (car.surface === 'asphalt' ? 1 : 0.3);
        else if (name === 'gravel')
          v =
            car.surface !== 'asphalt'
              ? Math.min(0.22, Math.abs(car.speed) * 0.008)
              : 0;
        else if (name === 'scrape'||name==='scrape-loose'){
          const loose=name==='scrape-loose';v=loose?scrapeMix.looseGain:scrapeMix.metalGain;
          l.source.playbackRate.setTargetAtTime((loose?scrapeMix.looseRate:scrapeMix.metalRate)*doppler,c.currentTime,.13);
        }
        if (!grounded && ['tires','gravel'].includes(name)) v=0;
        if (car.health <= 0 && !['tires', 'gravel', 'scrape', 'scrape-loose'].includes(name))
          v = 0;
        if(car.engineStall!>0&&['idle','low','mid','high','load','damaged'].includes(name))v=0;
        if(wreckInspection)v=0;
        l.gain.gain.setTargetAtTime(v, c.currentTime, 0.08);
      }
    }
  }
  async pause(value: boolean) {
    this.paused=value;
    this.listenerMotion.reset();
    if (!this.ctx) return;
    if (value) {
      await this.ctx.suspend().catch(()=>{});
      // Resume may have been requested while this suspension was in flight.
      if(!this.paused)this.unlock();
    }
    else this.unlock();
  }
  /** Synthesized on first use, so they never count among (or delay) the decoded clips. */
  private damageBuffers(){
    if(this.buffers.has('thump'))return true;
    const c=this.ctx;if(!c||typeof c.createBuffer!=='function')return false;
    const synth=(id:string,data:Float32Array<ArrayBuffer>)=>{const b=c.createBuffer(1,data.length,c.sampleRate);b.copyToChannel(data,0);this.buffers.set(id,b);};
    for(let k=0;k<RATTLE.variants;k++)synth('rattle-'+k,synthClank(c.sampleRate,k));
    synth('thump',synthThump(c.sampleRate));
    return true;
  }
  /** Loose panels clank and bent wheels thump, for cars within earshot. */
  private damageRattle(car:Vehicle,listener:T.Vector3,dt:number,focused:boolean){
    if(!car.wreckParts||!car.current||car.current.distanceTo(listener)>RATTLE.hearing)return;
    const clock=this.rattleClock,volume=focused?.42:.26,radius=vehicleWheelRadius(car.kind);
    let loose=0;for(const a of car.wreckParts.assemblies)if(a.loose>loose&&a.members.some(m=>m.mesh.visible))loose=a.loose;
    const rough=car.surface==='asphalt'?0:car.surface==='gravel'?1:.6,rattle=rattleRate(loose,car.speed,rough);
    const thumps=[0,1,2,3].map(i=>car.wreckParts.wheelLost[i]?0:car.wreckParts.wheelDamage[i]);
    // A front crushed back into the cooling fan: its blades clatter on the shroud with the revs.
    const fan=car.extendedDamage&&car.health>0&&!(car.engineStall!>0)&&(car.structuralDamage?.[0]??0)>FAN_CLATTER.onset?Math.min(FAN_CLATTER.max,car.rpm/60*.4):0;
    if(fan>0&&this.damageBuffers())for(let n=clock.step(car.id+':fan',fan,dt,.2);n>0;n--){this.damageSounds.fan++;this.shot('rattle-1',car.current,volume*.32,{rate:2.3+clock.random()*.2,delay:0,duration:.06});}
    // A dry engine knocks with the revs: big-end bearings on their way out.
    const knock=car.extendedDamage&&!car.seized&&car.health>0&&!(car.engineStall!>0)?knockRate(car.oilLevel,car.rpm):0;
    if(knock>0&&this.damageBuffers())for(let n=clock.step(car.id+':knock',knock,dt,.05);n>0;n--){this.damageSounds.knock++;this.shot('rattle-3',car.current,volume*.45,{rate:1.9+clock.random()*.1,delay:0,duration:.08});}
    if(rattle<=0&&thumps.every(d=>thumpRate(d,car.speed,radius)<=0)){clock.step(car.id+':rattle',0,dt);for(let i=0;i<4;i++)clock.step(car.id+':thump'+i,0,dt);return;}
    if(!this.damageBuffers())return;
    for(let n=clock.step(car.id+':rattle',rattle,dt);n>0;n--){
      this.damageSounds.rattle++;
      this.shot('rattle-'+Math.floor(clock.random()*RATTLE.variants),car.current,volume*(.55+.45*clock.random()),{rate:.85+clock.random()*.35,delay:clock.random()*.03,duration:.26});
    }
    thumps.forEach((damage,i)=>{
      for(let n=clock.step(car.id+':thump'+i,thumpRate(damage,car.speed,radius),dt,.08);n>0;n--){
        this.damageSounds.thump++;this.shot('thump',car.current,volume*Math.min(1,.4+damage),{rate:.9+clock.random()*.2,delay:0,duration:.18});
      }
    });
  }
  mute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.75;
  }
}
