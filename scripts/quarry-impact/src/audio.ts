import {LIMITER,limiterCut,onLimiter} from './rev-limiter';
import {exhaustLoudness,bearingGrowl,RUB,RUB_FIRE,EXHAUST_CRUSH,LEAK as TYRE_LEAK} from './damage-handling';
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
import {RATTLE,rattleRate,thumpRate,EventClock,synthClank,synthThump,hornStuck,synthHorn,synthGrowl,synthWind,synthSqueal} from './damage-rattle';
import {knockRate} from './oil-starvation';
import {ShotBudget,beltSurge,isPaved,skidChirp,squealLevel,squealState,squealVoices,type SquealState} from './tyre-squeal';
/** Front compression past which the fan hits its shroud, and its clatter rate cap. */
const FAN_CLATTER={onset:.35,max:12} as const;
import {impactSoundLayers} from './impact-response';
import { url } from './assets';
import type { Vehicle } from './vehicle';
import * as T from 'three';
import type { ThermalAudio } from './vehicle-fire';
type Loop = { source: AudioBufferSourceNode; gain: GainNode; pan: PannerNode };
const ENGINE_CENTERS:{readonly [k:string]:number}={idle:850,low:2200,mid:4100,high:6500};
/** The last gain/rate each engine-layer loop was sent: an unchanged (to within an inaudible step) value is not rescheduled
 * every frame for every car. */
const loopTargets=new WeakMap<Loop,{gain:number;rate:number}>();
function setGain(l:Loop,v:number,time:number,tau:number){const t=loopTargets.get(l)??{gain:NaN,rate:NaN};if(!(Math.abs(t.gain-v)<=.002&&(v!==0||t.gain===0))){l.gain.gain.setTargetAtTime(v,time,tau);t.gain=v;loopTargets.set(l,t);}}
function setRate(l:Loop,v:number,time:number,tau:number){const t=loopTargets.get(l)??{gain:NaN,rate:NaN};if(!(Math.abs(t.rate-v)<=.003)){l.source.playbackRate.setTargetAtTime(v,time,tau);t.rate=v;loopTargets.set(l,t);}}
/** Seconds a damage loop (squeal, growl) is kept, silent, after it falls quiet, before its nodes are released. */
const LOOP_HOLD=2;
import {CrowdRoar} from './crowd-roar';
/** Engine-layer level during a misfire cut. */
export const MISFIRE_AUDIO=.3;
/** Dazed hearing: the low-pass cutoff (Hz) slides from wide open down to a dull thud as the daze deepens. */
export const DAZE_HEARING={open:22000,dull:550} as const;
export const dazeHearing=(level:number)=>{const l=Math.max(0,Math.min(1,Number.isFinite(level)?level:0));return DAZE_HEARING.open*Math.pow(DAZE_HEARING.dull/DAZE_HEARING.open,l);};
/** Recorded clips for parts letting go (ElevenLabs, tools/destruction-audio.py): clip id, volume, rate and length to play. */
const BREAK_CLIPS:Record<string,{id:string;volume:number;rate:number;duration:number}>={
  spring:{id:'spring-snap',volume:.8,rate:1,duration:.8},shaft:{id:'shaft-snap',volume:.8,rate:1,duration:1},propshaft:{id:'shaft-snap',volume:.85,rate:.9,duration:1.1},
  diff:{id:'shaft-snap',volume:.9,rate:.8,duration:1.2},tierod:{id:'spring-snap',volume:.6,rate:1.25,duration:.65},cable:{id:'spring-snap',volume:.5,rate:1.5,duration:.55},
  handbrake:{id:'spring-snap',volume:.5,rate:1.4,duration:.6},rod:{id:'rod-bang',volume:1,rate:1,duration:1.8},battery:{id:'battery-rip',volume:.8,rate:1,duration:1},
  bearing:{id:'engine-seize',volume:.5,rate:1.3,duration:1.2},tyrefire:{id:'vehicle-burst',volume:.45,rate:.8,duration:.9},exhaustcrush:{id:'impact-medium',volume:.6,rate:1.25,duration:.6},
  gasket:{id:'steam-hiss',volume:.7,rate:.85,duration:1.4}};
/** Clips with extra recorded takes (id-2, id-3) that shot() rotates between: the impacts and the glass and debris layers. */
const TAKES=/^(impact-(light|medium|heavy)|glass|debris)$/;
/** The arena air horn over the PA as a derby heat starts (the recorded takes in turn, one per heat, at gain level, not placed in the
 * world) and, the long take, as it ends. */
export const ARENA_HORN={level:.45,ids:['air-horn','air-horn-end'],end:'air-horn-end'} as const;
/** A straight-cut reverse gear whines as a car backs up under power (offline): from m/s backwards, full at full m/s, at gain level,
 * pitched up with speed. Recorded only (no synthesized stand-in). */
export const REVERSE_WHINE={from:2,full:9,level:.22,throttle:.2} as const;
/** A commercial vehicle backing up (offline: the van, the utility truck and the shuttle) sounds its reversing alarm —
 * the recorded tone keyed on and off REVERSE_BEEPER.hz times a second (REVERSE_BEEPER.duty of each beat on) while it rolls
 * back faster than REVERSE_BEEPER.speed m/s with its electrics working, at REVERSE_BEEPER.level; each its own beat. */
export const REVERSE_BEEPER={kinds:['van','utility','shuttle'],speed:.6,hz:1,duty:.5,level:.3} as const;
/** Is the alarm sounding at this moment (s), offset for this car? */
export const beeperOn=(time:number,id:number)=>((((Number.isFinite(time)?time:0)+(Number.isFinite(id)?id:0)*.37)*REVERSE_BEEPER.hz)%1)<REVERSE_BEEPER.duty;
/** Does this car carry a reversing alarm that should be sounding (backing up, electrics working)? */
export const beeperWanted=(kind:string,speed:number,electrics:boolean)=>(REVERSE_BEEPER.kinds as readonly string[]).includes(kind)&&electrics&&Number.isFinite(speed)&&speed< -REVERSE_BEEPER.speed;
/** A blown or shredding tyre flaps against its arch as the car goes (offline): from m/s, full at full m/s, at gain level, its beat
 * quickening with the wheel. Recorded only. */
export const TYRE_FLAP={from:2,full:12,level:.3} as const;
/** Steam hisses out of a burst radiator while the car is steaming (a steam puff within hold seconds), at gain level. Recorded only. */
export const STEAM_HISS={hold:1.2,level:.18} as const;
/** Air hissing out of a punctured tyre while it goes down (damage between LEAK.onset and LEAK.flat, still on the car): the steam
 * hiss pitched up by rate, quiet, at gain level. */
export const TYRE_HISS={rate:1.7,level:.08} as const;
/** Old brakes squeal as a car slows (offline): braking at brake or harder between from and to m/s, louder the slower it goes, at gain
 * level, each car's squeal at its own pitch. Recorded only. */
export const BRAKE_SQUEAL={from:1.2,to:9,brake:.5,level:.12} as const;
/** Wet tyres (offline rain): tyres swish over the wet road from WET_TYRES.from m/s, full by WET_TYRES.full, brighter
 * with speed (playback rate between the two rates), at gain level; and they barely squeal (the squeal loop at
 * WET_TYRES.squeal, no skid shot) — water lets them slide quietly. Recorded only. */
export const WET_TYRES={from:2,full:22,level:.22,squeal:.25,rate:[.8,1.25]} as const;
/** Rain drumming on the roof and glass, heard from an in-car camera in the rain (offline), at gain level; an open cabin
 * (roof torn away) loses up to ROOF_RAIN.open of it. Recorded only. */
export const ROOF_RAIN={level:.35,open:.75} as const;
/** Cabin acoustics: heard from an in-car camera (offline), the world outside — the ambience: crowd, rain, horns, thunder —
 * comes through the body muffled to CABIN.closed Hz, opening back up toward CABIN.open as the cabin is torn open. */
export const CABIN={closed:1800,open:20000} as const;
/** The ambience low-pass for a camera inside (or not) a cabin this open (0–1). */
export const cabinCutoff=(inside:boolean,openness:number)=>{const o=Math.max(0,Math.min(1,Number.isFinite(openness)?openness:0));return inside?CABIN.closed*Math.pow(CABIN.open/CABIN.closed,o):CABIN.open;};
/** A badly bent body creaks as it is loaded through a turn (offline): structure damaged past bent on its worst face, cornering past
 * pull m/s² (yaw rate × speed), full at full m/s², the recorded metal groan pitched up by rate, at gain level. */
export const BODY_CREAK={bent:.4,pull:3,full:9,rate:1.35,level:.13} as const;
/** A tyre rubbing a crushed arch (0–1): the hardest rub on the car, with road speed (full from 10 m/s), louder still once
 * the tyre is smoking; silent below RUB.warn or at a crawl. */
export const rubLoopLevel=(rubs:ArrayLike<number>,speed:number,heat:number)=>{const r=Math.max(0,...Array.from(rubs)),v=Math.abs(Number.isFinite(speed)?speed:0);
  return r<RUB.warn||v<1.5?0:Math.min(1,r*Math.min(1,v/10)*(heat>=RUB_FIRE.warn?1.4:1));};
/** Steel groaning on a pinned car (0–1): from the moment it is pinned, building over two seconds. */
export const groanLevel=(pinTime:number)=>Number.isFinite(pinTime)&&pinTime>0?.55+.45*Math.min(1,pinTime/2):0;
/** The recorded grandstand roar answers moments of CROWD_CHEER.min intensity or more, at most once every CROWD_CHEER.gap seconds,
 * at CROWD_CHEER.level × intensity (full level puts it level with the synthesized roar it stands in for). */
export const CROWD_CHEER={min:.5,gap:3.5,level:1} as const;
/** The crowd gasps as a car rolls over or blows up: the recorded takes in turn, no more often than every gap seconds, at gain level. */
export const CROWD_GASP={ids:['crowd-gasp','crowd-gasp-2'],gap:4,level:.85} as const;
/** The crowd boos a real hit (closing at closing m/s or more) on a car that is already out (bad form at a derby), no more often than
 * every gap seconds, at gain level. */
export const CROWD_BOO={id:'crowd-boo',gap:8,level:.8,closing:4} as const;
export class Sound {
  private acousticProbe=new TrackAcousticProbe();
  private reflections?:TrackReflections;
  ctx?: AudioContext;
  master?: GainNode;
  private dazeFilter?: BiquadFilterNode;
  /** The cabin's muffling of the ambience (cabin()). */
  private cabinFilter?: BiquadFilterNode;
  private cabinCut:number=CABIN.open;
  private dazeLevel = 0;
  engineBus?: GainNode;
  fxBus?: GainNode;
  ambientBus?: GainNode;
  buffers = new Map<string, AudioBuffer>();
  loops = new Map<number, Map<string, Loop>>();
  /** One-shots played so far, by sound (QA). */
  readonly shotCounts=new Map<string,number>();
  /** Every loop sounding now (gain over 0.004): per kind, [car id, gain] (QA). */
  mix(){const out:Record<string,number[][]>={};const add=(k:string,id:number,l:Loop)=>{const g=l.gain.gain.value;if(g>.004)(out[k]??=[]).push([id,+g.toFixed(3)]);};
    for(const [id,m] of this.loops)for(const [n,l] of m)add(n,id,l);
    for(const [k,m] of Object.entries({horns:this.horns,rubs:this.rubs,groans:this.groans,belt:this.squeals,whines:this.whines,beepers:this.beepers,flaps:this.flaps,hisses:this.hisses,leaks:this.leaks,brake:this.brakeSqueals,creaks:this.creaks,swishes:this.swishes,growls:this.growls}))for(const [id,l] of m as Map<number,Loop>)add(k,id,l);
    return {loops:out,shots:Object.fromEntries(this.shotCounts)};}
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
    // A dazed driver hears the world muffled: a low-pass between the mix and the output (wide open otherwise).
    this.dazeFilter=c.createBiquadFilter();this.dazeFilter.type='lowpass';this.dazeFilter.frequency.value=DAZE_HEARING.open;this.dazeFilter.Q.value=.5;
    this.master.connect(this.dazeFilter).connect(compressor).connect(c.destination);
    this.engineBus = c.createGain();
    this.fxBus = c.createGain();
    this.ambientBus = c.createGain();
    for (const b of [this.engineBus, this.fxBus])
      b.connect(this.master);
    // The ambience reaches the mix through the cabin's low-pass (wide open unless the camera is inside a car).
    this.cabinFilter=c.createBiquadFilter();this.cabinFilter.type='lowpass';this.cabinFilter.frequency.value=CABIN.open;this.cabinFilter.Q.value=.4;
    this.ambientBus.connect(this.cabinFilter).connect(this.master);
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
  private cheerAt=-10;
  private gaspAt=-10;private gaspTake=0;
  private booAt=-10;
  crowd(intensity:number){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running')return false;
    const cheer=this.buffers.get('crowd-cheer'),now=this.ctx.currentTime;
    if(cheer&&intensity>=CROWD_CHEER.min&&now-this.cheerAt>=CROWD_CHEER.gap){this.cheerAt=now;
      const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=cheer;source.playbackRate.value=.95+Math.random()*.1;
      gain.gain.value=Math.min(1,CROWD_CHEER.level*intensity);source.connect(gain).connect(this.ambientBus);source.start();return true;}
    this.crowdRoar??=new CrowdRoar(this.ctx,this.ambientBus);
    return this.crowdRoar.roar(intensity);
  }
  /** The arena horn ending a derby heat: finish() pauses the audio graph at once, so this plays through a plain audio element (at the
   * horn's level on the ambience setting), and stays silent when muted or before the sound is up. */
  endHorn(){
    if(!this.ready||this.muted||typeof Audio==='undefined'||!this.buffers.has(ARENA_HORN.end))return false;
    const horn=new Audio(`audio/${ARENA_HORN.end}.ogg`);horn.volume=Math.max(0,Math.min(1,ARENA_HORN.level*this.levels.ambience/.45));horn.play().catch(()=>{});return true;
  }
  arenaHorn(heat:number){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running')return false;
    const ids=ARENA_HORN.ids.filter(id=>this.buffers.has(id));if(!ids.length)return false;
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers.get(ids[Math.abs(Math.floor(Number.isFinite(heat)?heat:0))%ids.length])!;
    gain.gain.value=ARENA_HORN.level;source.connect(gain).connect(this.ambientBus);source.start();return true;
  }
  /** A thunderclap over the arena (ambience): the close crack or the distant rumble, at its volume. */
  thunder(near:boolean,volume:number){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running')return false;
    const id=near?'thunder-near':'thunder-far';if(!this.buffers.has(id))return false;
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers.get(id)!;
    gain.gain.value=Math.max(0,Math.min(1,Number.isFinite(volume)?volume:0));source.connect(gain).connect(this.ambientBus);source.start();this.thunders++;return true;
  }
  /** Thunderclaps played (QA). */
  thunders=0;
  crowdGasp(){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running')return false;
    const ids=CROWD_GASP.ids.filter(id=>this.buffers.has(id)),now=this.ctx.currentTime;if(!ids.length||now-this.gaspAt<CROWD_GASP.gap)return false;this.gaspAt=now;
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers.get(ids[this.gaspTake++%ids.length])!;source.playbackRate.value=.96+Math.random()*.08;
    gain.gain.value=CROWD_GASP.level;source.connect(gain).connect(this.ambientBus);source.start();return true;
  }
  crowdBoo(){
    if(!this.ready||this.muted||this.paused||!this.ctx||!this.ambientBus||this.ctx.state!=='running'||!this.buffers.has(CROWD_BOO.id))return false;
    const now=this.ctx.currentTime;if(now-this.booAt<CROWD_BOO.gap)return false;this.booAt=now;
    const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.buffers.get(CROWD_BOO.id)!;source.playbackRate.value=.96+Math.random()*.08;
    gain.gain.value=CROWD_BOO.level;source.connect(gain).connect(this.ambientBus);source.start();return true;
  }
  /** A soft looping rain hiss on the ambience bus while it rains. */
  /** The rain's hiss follows the shower: a light one (level 0) at 0.45 of a downpour's (1). */
  rainLevel(level:number){const c=this.ctx,h=this.rainHiss;if(!c||!h)return;const l=Number.isFinite(level)?Math.max(0,Math.min(1,level)):1;h.gain.gain.setTargetAtTime(.16*(.45+.55*l),c.currentTime,1.2);}
  rain(on:boolean){
    this.raining=on;
    const c=this.ctx;if(!c||!this.ambientBus||!this.ready)return;
    if(on&&!this.rainHiss){
      // The recorded rain when it loaded (level-matched to this hiss after its high-pass); the synthesized hiss otherwise.
      const recorded=this.buffers.get('rain');
      if(recorded){const source=c.createBufferSource();source.buffer=recorded;source.loop=true;const gain=c.createGain();gain.gain.value=0;gain.gain.setTargetAtTime(.16,c.currentTime,.8);source.connect(gain);gain.connect(this.ambientBus);source.start(0,Math.random()*recorded.duration);this.rainHiss={source,gain};return;}
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
  private readonly lastTake=new Map<string,number>();
  /** One of the recorded takes of a clip (id, id-2, id-3), never the same take twice running. */
  private impactTake(id:string){
    const takes=[id,id+'-2',id+'-3'].filter(t=>this.buffers.has(t));if(takes.length<2)return id;
    const last=this.lastTake.get(id)??-1;let i=Math.floor(Math.random()*(last<0?takes.length:takes.length-1));if(last>=0&&i>=last)i++;
    this.lastTake.set(id,i);return takes[i];
  }
  /** Muffle everything while the player is dazed (0 clear .. 1 fully dazed); eases in and out. */
  daze(level:number){
    const l=Math.max(0,Math.min(1,Number.isFinite(level)?level:0));if(!this.ctx||!this.dazeFilter||Math.abs(l-this.dazeLevel)<.01)return;
    this.dazeLevel=l;this.dazeFilter.frequency.setTargetAtTime(dazeHearing(l),this.ctx.currentTime,.08);
  }
  /** A misfire's exhaust pop: the burst sample, pitched up, cut short and muffled. */
  backfire(p:T.Vector3){if(this.buffers.has('backfire'))this.shot('backfire',p,.6,{rate:1,delay:0,duration:.7});else this.shot('vehicle-burst',p,.5,{rate:2.1,delay:0,duration:.17,lowpass:2400});}
  /** A part letting go (offline events): its own recorded clip where there is one, the pitched impact clip otherwise. */
  breakage(what:string,p:T.Vector3){
    const clip=BREAK_CLIPS[what];
    if(clip&&this.buffers.has(clip.id)){this.shot(clip.id,p,clip.volume,{rate:clip.rate,delay:0,duration:clip.duration});return;}
    this.shot(what==='spring'?'suspension':what==='diff'||what==='rod'?'impact-heavy':'impact-light',p,.7,{rate:what==='spring'?.7:what==='diff'?.9:what==='rod'?.55:1.7,delay:0,duration:.5});
  }
  /** A recorded one-shot by id when it loaded (extinguisher, bump start, mirror snap, engine seize); false if it is missing. */
  clip(id:string,p:T.Vector3,volume:number,duration:number){if(!this.buffers.has(id))return false;this.shot(id,p,volume,{rate:1,delay:0,duration});return true;}
  private groundFireLoop?:Loop;
  /** Stuck horns blaring, by car id (offline, within earshot). */
  private horns=new Map<number,Loop>();
  /** Keep a horn loop going for each car with a shorted horn in earshot; silence the rest. */
  stuckHorns(cars:readonly Vehicle[],listener:T.Vector3){
    if(!this.ready||!this.fxBus)return;
    const hornId=this.buffers.has('horn-stuck')?'horn-stuck':'horn';
    if(hornId==='horn'&&!this.buffers.has('horn')){const c=this.ctx;if(!c||typeof c.createBuffer!=='function')return;const d=synthHorn(c.sampleRate),b=c.createBuffer(1,d.length,c.sampleRate);b.copyToChannel(d,0);this.buffers.set('horn',b);}
    const now=this.ctx!.currentTime,live=new Set<number>();
    for(const car of cars){
      if(!car.extendedDamage||car.health<=0||!hornStuck(car.structuralDamage?.[0]??0,car.id)||car.current.distanceTo(listener)>RATTLE.hearing)continue;
      live.add(car.id);let l=this.horns.get(car.id);if(!l){l=this.loop(hornId,this.fxBus);if(!l)continue;this.horns.set(car.id,l);}
      l.pan.positionX.value=car.current.x;l.pan.positionY.value=car.current.y+.5;l.pan.positionZ.value=car.current.z;l.gain.gain.setTargetAtTime(.16,now,.05);
    }
    for(const [id,l] of this.horns)if(!live.has(id)){l.gain.gain.setTargetAtTime(0,now,.05);l.source.stop(now+.3);this.horns.delete(id);}
  }
  /** Damage loops by car id (offline, within earshot): tyres rubbing crushed arches, and steel groaning on cars pinned or sat on. */
  private rubs=new Map<number,Loop>();
  private groans=new Map<number,Loop>();
  damageLoops(cars:readonly Vehicle[],listener:T.Vector3){
    if(!this.ready||!this.fxBus)return;const now=this.ctx!.currentTime;
    this.driveLoops(this.rubs,'tyre-rub',cars,listener,now,car=>rubLoopLevel(car.rubDrag,car.speed,Math.max(...car.rubHeat)),car=>.85+.4*Math.min(1,Math.abs(car.speed)/25),.22);
    this.driveLoops(this.groans,'metal-groan',cars,listener,now,car=>Math.max(groanLevel(car.pinTime),groanLevel(car.underWeight)),()=>1,.3);
  }
  /** Keep one loop per car at its level; a loop that falls quiet fades and is held LOOP_HOLD seconds before it is stopped. */
  private driveLoops(map:Map<number,Loop>,id:string,cars:readonly Vehicle[],listener:T.Vector3,now:number,level:(car:Vehicle)=>number,rate:(car:Vehicle)=>number,gain:number){
    if(!this.buffers.has(id))return;const live=new Set<number>();
    for(const car of cars){
      if(!car.extendedDamage||car.health<=0||car.current.distanceTo(listener)>RATTLE.hearing)continue;const v=level(car);if(!(v>0))continue;
      live.add(car.id);let l=map.get(car.id);if(!l){l=this.loop(id,this.fxBus!);if(!l)continue;map.set(car.id,l);}
      l.pan.positionX.value=car.current.x;l.pan.positionY.value=car.current.y+.4;l.pan.positionZ.value=car.current.z;
      l.source.playbackRate.setTargetAtTime(rate(car),now,.08);l.gain.gain.setTargetAtTime(gain*v,now,.08);
    }
    for(const [cid,l] of map)if(!live.has(cid)){const q=this.quietSince.get(l)??now;this.quietSince.set(l,q);l.gain.gain.setTargetAtTime(0,now,.08);
      if(now-q>LOOP_HOLD||!cars.some(c=>c.id===cid)){l.source.stop(now+.3);map.delete(cid);this.quietSince.delete(l);}}
    for(const cid of live){const l=map.get(cid);if(l)this.quietSince.delete(l);}
  }
  /** Slipping fan belts squealing under load, by car id (offline, within earshot), pitched with the revs. */
  private squeals=new Map<number,Loop>();
  /** Each car's tyre squeal and belt surge state, who was heard squealing last frame, and the field's rattle allowance. */
  private readonly squealStates=new Map<number,SquealState>();private squealHeard=new Map<number,number>();private squealAllowed=new Set<number>();
  private readonly beltRpm=new Map<number,{rpm:number}>();private beltAt:number|undefined;private readonly rattleBudget=new ShotBudget();
  private squealOf(id:number){let s=this.squealStates.get(id);if(!s){s=squealState();this.squealStates.set(id,s);}return s;}
  private readonly quietSince=new WeakMap<Loop,number>();
  beltSqueals(cars:readonly Vehicle[],listener:T.Vector3){
    if(!this.ready||!this.fxBus)return;
    if(!this.buffers.has('squeal')){const c=this.ctx;if(!c||typeof c.createBuffer!=='function')return;const d=synthSqueal(c.sampleRate),b=c.createBuffer(1,d.length,c.sampleRate);b.copyToChannel(d,0);this.buffers.set('squeal',b);}
    const now=this.ctx!.currentTime,live=new Set<number>(),dt=this.beltAt===undefined?0:now-this.beltAt;this.beltAt=now;
    for(const car of cars){
      if(!car.extendedDamage||car.health<=0||car.squeal<.02||car.current.distanceTo(listener)>RATTLE.hearing)continue;
      live.add(car.id);let l=this.squeals.get(car.id);if(!l){l=this.loop('squeal',this.fxBus);if(!l)continue;this.squeals.set(car.id,l);}
      l.pan.positionX.value=car.current.x;l.pan.positionY.value=car.current.y+.6;l.pan.positionZ.value=car.current.z;
      l.source.playbackRate.setTargetAtTime(.8+Math.min(.6,(car.rpm??0)/9000),now,.06);let b=this.beltRpm.get(car.id);if(!b){b={rpm:car.rpm??0};this.beltRpm.set(car.id,b);}l.gain.gain.setTargetAtTime(.2*car.squeal*beltSurge(b,car.rpm??0,dt),now,.06);
    }
    // AI throttle flickers on and off many times a second: a loop that falls quiet is faded and kept for LOOP_HOLD seconds
    // rather than torn down and rebuilt each time (that node churn cost frames).
    for(const [id,l] of this.squeals)if(!live.has(id)){const q=this.quietSince.get(l)??now;this.quietSince.set(l,q);l.gain.gain.setTargetAtTime(0,now,.05);
      if(now-q>LOOP_HOLD||!cars.some(c=>c.id===id)){l.source.stop(now+.3);this.squeals.delete(id);this.quietSince.delete(l);}}
    for(const id of live){const l=this.squeals.get(id);if(l)this.quietSince.delete(l);}
  }
  /** Running-gear loops by car id (offline, within earshot): reverse gears whining, blown tyres flapping, burst radiators hissing. */
  private readonly whines=new Map<number,Loop>();
  private readonly beepers=new Map<number,Loop>();
  private readonly flaps=new Map<number,Loop>();
  private readonly hisses=new Map<number,Loop>();
  private readonly leaks=new Map<number,Loop>();
  private readonly brakeSqueals=new Map<number,Loop>();
  private readonly creaks=new Map<number,Loop>();
  private readonly swishes=new Map<number,Loop>();
  /** It is raining on the event (rain()). */
  private raining=false;
  private readonly steamSeen=new Map<number,{puffs:number;at:number}>();
  /** Cars whining in reverse right now (QA). */
  get whining(){return [...this.whines].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  /** Cars whose reversing alarm loop is running (QA). */
  get beeping(){return [...this.beepers.keys()];}
  /** Cars with a flapping tyre or a hissing radiator right now (QA). */
  get flapping(){return [...this.flaps].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  get hissing(){return [...this.hisses].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  get leaking(){return [...this.leaks].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  get squealing(){return [...this.brakeSqueals].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  get creaking(){return [...this.creaks].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  /** Cars swishing over the wet road right now (QA). */
  /** The rain ambience is playing (QA). */
  get rainOn(){return !!this.rainHiss;}
  get swishing(){return [...this.swishes].filter(([,l])=>!this.quietSince.has(l)).map(([id])=>id);}
  runningLoops(cars:readonly Vehicle[],listener:T.Vector3){
    if(!this.ready||!this.fxBus)return;const now=this.ctx!.currentTime;
    this.driveLoops(this.whines,'reverse-whine',cars,listener,now,car=>{const back=-car.speed;return back>=REVERSE_WHINE.from&&Math.abs(car.input?.throttle??0)>=REVERSE_WHINE.throttle?Math.min(1,(back-REVERSE_WHINE.from+1)/(REVERSE_WHINE.full-REVERSE_WHINE.from+1)):0;},car=>.8+Math.min(.7,-car.speed/12),REVERSE_WHINE.level);
    this.driveLoops(this.beepers,'reverse-beeper',cars,listener,now,car=>beeperWanted(car.kind,car.speed,!car.electricalCut&&!car.batteryOut)&&beeperOn(now,car.id)?1:0,()=>1,REVERSE_BEEPER.level);
    this.driveLoops(this.flaps,'tyre-flap',cars,listener,now,car=>{const v=Math.abs(car.speed);return v>=TYRE_FLAP.from&&car.blownOut.some((b,i)=>(b||car.tyreShred[i]>0)&&!car.wreckParts.wheelLost[i])?Math.min(1,v/TYRE_FLAP.full):0;},car=>.5+Math.min(1.1,Math.abs(car.speed)/14),TYRE_FLAP.level);
    for(const car of cars){const seen=this.steamSeen.get(car.id);if(!seen||car.steamPuffs<seen.puffs)this.steamSeen.set(car.id,{puffs:car.steamPuffs,at:-99});else if(car.steamPuffs>seen.puffs){seen.puffs=car.steamPuffs;seen.at=now;}}
    this.driveLoops(this.hisses,'steam-hiss',cars,listener,now,car=>now-(this.steamSeen.get(car.id)?.at??-99)<STEAM_HISS.hold?1:0,()=>1,STEAM_HISS.level);
    this.driveLoops(this.brakeSqueals,'brake-squeal',cars,listener,now,car=>{const v=Math.abs(car.speed);return (car.input?.brake??0)>=BRAKE_SQUEAL.brake&&v>=BRAKE_SQUEAL.from&&v<=BRAKE_SQUEAL.to?Math.min(1,(BRAKE_SQUEAL.to-v)/(BRAKE_SQUEAL.to-BRAKE_SQUEAL.from)*1.4):0;},car=>.92+(car.id%5)*.04,BRAKE_SQUEAL.level);
    this.driveLoops(this.creaks,'metal-groan',cars,listener,now,car=>{const bent=Math.max(0,...(car.structuralDamage??[0])),pull=Math.abs(car.body.angvel().y*car.speed);return bent>=BODY_CREAK.bent&&pull>=BODY_CREAK.pull?Math.min(1,(pull-BODY_CREAK.pull)/(BODY_CREAK.full-BODY_CREAK.pull)+.2)*Math.min(1,(bent-BODY_CREAK.bent)/.3+.3):0;},()=>BODY_CREAK.rate,BODY_CREAK.level);
    this.driveLoops(this.swishes,'wet-tyres',cars,listener,now,car=>{const v=Math.abs(car.speed);return this.raining&&v>=WET_TYRES.from&&[0,1,2,3].some(i=>car.controller.wheelIsInContact(i))?Math.min(1,(v-WET_TYRES.from+1)/(WET_TYRES.full-WET_TYRES.from+1)):0;},car=>WET_TYRES.rate[0]+(WET_TYRES.rate[1]-WET_TYRES.rate[0])*Math.min(1,Math.abs(car.speed)/WET_TYRES.full),WET_TYRES.level);
    this.driveLoops(this.leaks,'steam-hiss',cars,listener,now,car=>car.tyreDamage?.some((d,i)=>d>=TYRE_LEAK.onset&&d<TYRE_LEAK.flat&&!car.blownOut[i]&&!car.wreckParts.wheelLost[i])?1:0,()=>TYRE_HISS.rate,TYRE_HISS.level);
  }
  /** The wind roaring through the player's open wreck (level 0 = silent), pitched up with speed. */
  private windLoop?:Loop;
  cabinWind(level:number,p:T.Vector3,speed:number){
    if(!this.ready||!this.fxBus)return;
    if(!this.buffers.has('wind')){const c=this.ctx;if(!c||typeof c.createBuffer!=='function')return;const d=synthWind(c.sampleRate),b=c.createBuffer(1,d.length,c.sampleRate);b.copyToChannel(d,0);this.buffers.set('wind',b);}
    const now=this.ctx!.currentTime;
    if(!(level>.01)){if(this.windLoop){this.windLoop.gain.gain.setTargetAtTime(0,now,.15);this.windLoop.source.stop(now+.8);this.windLoop=undefined;}return;}
    this.windLoop??=this.loop('wind',this.fxBus);const l=this.windLoop;if(!l)return;
    l.pan.positionX.value=p.x;l.pan.positionY.value=p.y+1;l.pan.positionZ.value=p.z;
    l.source.playbackRate.setTargetAtTime(.7+Math.min(.8,Math.abs(speed)/40),now,.2);l.gain.gain.setTargetAtTime(.45*level,now,.2);
  }
  /** Muffle the ambience for a camera inside a car (cabinCutoff). */
  cabin(inside:boolean,openness:number){
    const f=cabinCutoff(inside,openness);if(!this.ctx||!this.cabinFilter||Math.abs(f-this.cabinCut)<1)return;
    this.cabinCut=f;this.cabinFilter.frequency.setTargetAtTime(f,this.ctx.currentTime,.12);
  }
  /** The cabin low-pass now (QA). */
  get cabinHz(){return this.cabinCut;}
  /** Rain drumming on the roof of the car the camera is in (level 0 = silent). */
  private roofRain?:Loop;
  /** The roof rain is playing (QA). */
  get drumming(){return !!this.roofRain;}
  cabinRain(level:number,p:T.Vector3){
    if(!this.ready||!this.ambientBus||!this.buffers.has('roof-rain'))return;const now=this.ctx!.currentTime;
    if(!(level>.01)){if(this.roofRain){this.roofRain.gain.gain.setTargetAtTime(0,now,.3);this.roofRain.source.stop(now+1.2);this.roofRain=undefined;}return;}
    this.roofRain??=this.loop('roof-rain',this.fxBus!);const l=this.roofRain;if(!l)return;
    l.pan.positionX.value=p.x;l.pan.positionY.value=p.y+1;l.pan.positionZ.value=p.z;l.gain.gain.setTargetAtTime(ROOF_RAIN.level*Math.min(1,level),now,.25);
  }
  /** Growling wheel bearings, by car id (offline, within earshot): the worst bearing on each car, pitched up with speed. */
  private growls=new Map<number,Loop>();
  bearingGrowls(cars:readonly Vehicle[],listener:T.Vector3){
    if(!this.ready||!this.fxBus)return;
    if(!this.buffers.has('growl')){const c=this.ctx;if(!c||typeof c.createBuffer!=='function')return;const d=synthGrowl(c.sampleRate),b=c.createBuffer(1,d.length,c.sampleRate);b.copyToChannel(d,0);this.buffers.set('growl',b);}
    const now=this.ctx!.currentTime,live=new Set<number>();
    for(const car of cars){
      const g=car.extendedDamage&&car.health>0?bearingGrowl(Math.max(...car.bearingWear),car.speed):0;
      if(g<.02||car.current.distanceTo(listener)>RATTLE.hearing)continue;
      live.add(car.id);let l=this.growls.get(car.id);if(!l){l=this.loop('growl',this.fxBus);if(!l)continue;this.growls.set(car.id,l);}
      l.pan.positionX.value=car.current.x;l.pan.positionY.value=car.current.y+.3;l.pan.positionZ.value=car.current.z;
      l.source.playbackRate.setTargetAtTime(.6+Math.min(1.2,Math.abs(car.speed)/25),now,.08);l.gain.gain.setTargetAtTime(.28*g,now,.08);
    }
    for(const [id,l] of this.growls)if(!live.has(id)){const q=this.quietSince.get(l)??now;this.quietSince.set(l,q);l.gain.gain.setTargetAtTime(0,now,.05);
      if(now-q>LOOP_HOLD||!cars.some(c=>c.id===id)){l.source.stop(now+.3);this.growls.delete(id);this.quietSince.delete(l);}}
    for(const id of live){const l=this.growls.get(id);if(l)this.quietSince.delete(l);}
  }
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
  blowout(p:T.Vector3){if(this.buffers.has('tyre-blowout'))this.shot('tyre-blowout',p,.9,{rate:1,delay:0,duration:1});else this.shot('vehicle-burst',p,.85,{rate:1.45,delay:0,duration:.32});}
  shot(id: string, p: T.Vector3, volume = 1, options?:{rate:number;delay:number;duration:number;lowpass?:number;group?:string}) {
    // Rattles, knocks and clatter share one allowance across the field.
    if((id.startsWith('rattle-')||id==='thump')&&!this.rattleBudget.take(this.ctx?.currentTime??0))return;
    this.shotCounts.set(id,(this.shotCounts.get(id)??0)+1);
    if (!this.ready || this.activeVoices >= 18) return;
    // Every use of an impact, glass or debris clip picks one of its recorded takes; they share a key, so two cannot both play one hit.
    const group = options?.group ?? id;
    if (TAKES.test(id)) id = this.impactTake(id);
    const c = this.ctx!,
      buf = this.buffers.get(id);
    if (!buf) return;
    const key = group + Math.round(p.x / 5) + Math.round(p.z / 5);
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
    // Only the loudest few cars squeal their tyres at once (as heard last frame).
    this.squealAllowed=squealVoices(this.squealHeard);this.squealHeard=new Map();
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
        if (grounded && car.slip > 3 && prior.slip <= 3 && !(this.raining && car.extendedDamage) && isPaved(car.surface) && skidChirp(this.squealOf(car.id),c.currentTime))
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
      // Floored against the limiter, it bounces off the ignition cut (offline): the combustion layers stutter, quick.
      const limiting=!!car.extendedDamage&&car.health>0&&onLimiter(rpm,car.input.throttle,!(car.engineStall!>0)),bounce=limiting&&limiterCut(c.currentTime,car.id),beat=bounce?LIMITER.cut:1,heard=rpm-(bounce?LIMITER.drop:0);
      for (const [name, l] of loops) {
        if(name.startsWith('fire-'))continue;
        l.pan.positionX.value = car.current.x;
        l.pan.positionY.value = car.current.y;
        l.pan.positionZ.value = car.current.z;
        let v = 0;
        const centers=ENGINE_CENTERS;
        if (name in centers) {
          v = Math.max(0, 1 - Math.abs(Math.min(rpm,6500) - centers[name]) / 2100) * level * cut * beat * (car.extendedDamage ? exhaustLoudness(car.exhaustBlow)*(car.exhaustCrushed&&!car.exhaustGone?EXHAUST_CRUSH.sound:1) : 1);
          if (car.health === 0) v = 0;
          setRate(l,Math.max(0.72, Math.min(1.4, (heard / centers[name]) * doppler))*classicEngineVoice(car.kind).pitch,c.currentTime,limiting?LIMITER.response:0.13);
        } else if (name === 'gear-grind') v=car.health>0?.16*Math.min(1,(car.transmission?.grind??0)/.3):0;
        else if (name === 'starter') v=car.health>0&&car.engineStall!>0&&car.rpm>0&&!car.batteryOut?.13:0;
        else if (name === 'load') v = Math.abs(car.input.throttle) * 0.07 * cut * beat;
        else if (name === 'damaged')
          v = engineDamageLevel(car.health,car.engineDamage) * 0.18 * (cut<1?1.6:1);
        else if (name === 'tires'){
          // Squeal on paved ground as a slide begins, settling to a scrub if it holds; the loudest few cars only.
          const level=squealLevel(this.squealOf(car.id),car.slip,isPaved(car.surface),dt) * (this.raining && car.extendedDamage ? WET_TYRES.squeal : 1);
          this.squealHeard.set(car.id,level/Math.max(1,car.current.distanceTo(p)));v=this.squealAllowed.has(car.id)?level:0;
        }
        else if (name === 'gravel')
          v =
            car.surface !== 'asphalt'
              ? Math.min(0.22, Math.abs(car.speed) * 0.008)
              : 0;
        else if (name === 'scrape'||name==='scrape-loose'){
          const loose=name==='scrape-loose';v=loose?scrapeMix.looseGain:scrapeMix.metalGain;
          setRate(l,(loose?scrapeMix.looseRate:scrapeMix.metalRate)*doppler,c.currentTime,.13);
        }
        if (!grounded && ['tires','gravel'].includes(name)) v=0;
        if (car.health <= 0 && !['tires', 'gravel', 'scrape', 'scrape-loose'].includes(name))
          v = 0;
        if(car.engineStall!>0&&['idle','low','mid','high','load','damaged'].includes(name))v=0;
        if(wreckInspection)v=0;
        setGain(l,v,c.currentTime,limiting&&(name in ENGINE_CENTERS||name==='load')?LIMITER.response:0.08);
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
