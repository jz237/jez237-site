// Physical move effects, separate from the existing reviewed character voices.
export const FOLEY_FIGHTERS = Object.freeze(['deathblow','jez','alan','post','benny','donald','cyraxx','ali','devil','commissioner']);
export const FOLEY_SHARED = Object.freeze(['jab-a','jab-b','heavy-a','heavy-b','kick-a','kick-b','block-a','block-b','whoosh-light','whoosh-heavy','throw','fall','metal','wire']);
export const FOLEY_ROOT = 'assets/audio/moves-v1/';
const groups = {
  light:['whoosh-light'], heavy:['whoosh-heavy'],
  'light-kick-swing':['whoosh-heavy'], 'roundhouse-swing':['whoosh-heavy'],
  'hit-light':['jab-a','jab-b'], 'hit-heavy':['heavy-a','heavy-b'],
  'light-kick-impact':['kick-a','kick-b'], 'roundhouse-impact':['kick-b','kick-a'],
  block:['block-a','block-b'], throw:['throw'], ko:['fall'],
};
const objects = {pizza:'kick-a',mouse:'wire',loogie:'alan',wires:'wire',xacto:'metal',golfball:'donald',bedbugs:'cyraxx',vinyl:'ali',charm:'devil',cane:'commissioner',needle:'metal',bottle:'metal',pigeon:'whoosh-heavy',tongs:'metal',cup:'post',brick:'fall',paint:'post'};

export function moveFoleyLayers(kind, fighterId, move = null, serial = 0) {
  const signature = FOLEY_FIGHTERS.includes(fighterId) ? fighterId : null;
  const variants = groups[kind];
  const weight = kind === 'hit-heavy' || kind === 'roundhouse-impact' ? .8 : kind.includes('swing') || kind === 'light' || kind === 'heavy' ? .38 : .64;
  const layers = variants ? [{ id: variants[serial % variants.length], gain: weight, rate: 1 }] : [];
  if (kind === 'special' || kind === 'super' || kind === 'fatal') {
    if (signature) layers.push({ id: signature, gain: kind === 'special' ? .65 : .85, rate: kind === 'special' ? 1 : .88 });
    if (kind !== 'special') layers.push({ id:'heavy-b', gain:.4, rate:.85 });
  }
  if (kind.startsWith('object-') && objects[kind.slice(7)]) layers.push({ id:objects[kind.slice(7)], gain:.45, rate:1.08 });
  if (layers.length && (kind === 'hit-heavy' || kind.includes('impact'))
    && (move?.superMove || move?.kind === 'special') && signature) layers.push({id:signature,gain:.18,rate:1.2});
  if (layers.length && kind.startsWith('hit-') && move?.kind === 'throw') layers[0] = {id:'fall',gain:.8,rate:1};
  // Each authored move has a consistent size; successive takes vary gently.
  let hash = 0;
  for (const char of String(move?.profileId || move?.id || fighterId || '')) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const rate = 1 + ((hash % 11) - 5) * .008 + ((serial % 3) - 1) * .012;
  return layers.map(layer => ({...layer, rate:layer.rate * rate}));
}

export class MoveFoleyPlayer {
  constructor() { this.bytes=new Map(); this.buffers=new Map(); this.pending=new Map(); this.voices=[]; this.serials=new Map(); this.plays=0; this.last=null; this.context=null; }
  warm(context, fighters=[]) {
    if (context && this.context!==context) { this.context=context; this.buffers.clear(); this.pending.clear(); }
    const ids=[...FOLEY_SHARED,...FOLEY_FIGHTERS];
    if(context && this.buffers.size===ids.length)return Promise.resolve();
    return Promise.all(ids.map(id=>{
      if(!this.bytes.has(id)) this.bytes.set(id,fetch(`${FOLEY_ROOT}${id}.mp3`).then(r=>{if(!r.ok)throw Error(`Foley ${id}: ${r.status}`);return r.arrayBuffer();}).catch(()=>null));
      if(!context || this.buffers.has(id))return this.bytes.get(id);
      if(!this.pending.has(id)) this.pending.set(id,this.bytes.get(id).then(bytes=>bytes?context.decodeAudioData(bytes.slice(0)):null).then(buffer=>{if(buffer)this.buffers.set(id,buffer);}).catch(()=>{}));
      return this.pending.get(id);
    }));
  }
  play(context, destination, kind, fighterId, { move=null, x=640, level=1 }={}) {
    if (!context || context.state!=='running' || !destination || level<=0) return false;
    const key=`${fighterId}:${kind}`, serial=this.serials.get(key)||0;
    const layers=moveFoleyLayers(kind,fighterId,move,serial);
    // No late playback: a cold/missing bank uses the existing immediate fallback.
    if(!layers.length || layers.some(layer=>!this.buffers.has(layer.id)))return false;
    this.serials.set(key,serial+1);
    for(const layer of layers){
      while(this.voices.length>=8) this.release(this.voices[0]);
      const source=context.createBufferSource(),gain=context.createGain(),pan=context.createStereoPanner();
      source.buffer=this.buffers.get(layer.id);source.playbackRate.value=layer.rate;
      gain.gain.value=layer.gain * level;pan.pan.value=Math.max(-.55,Math.min(.55,(x/1280-.5)*1.1));
      source.connect(gain).connect(pan).connect(destination);
      const voice={source,gain,pan,context};this.voices.push(voice);
      source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();this.voices=this.voices.filter(v=>v!==voice);};source.start();
      this.plays++;this.last={kind,fighterId,id:layer.id,rate:layer.rate,pan:pan.pan.value};
    }
    return true;
  }
  release(voice) {
    const now=voice.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(0,now,.003);
    try { voice.source.stop(now+.012); } catch {}
    this.voices=this.voices.filter(v=>v!==voice);
  }
  stop() { for(const voice of [...this.voices])this.release(voice); }
  snapshot() { return {ready:[...this.buffers.keys()],active:this.voices.length,plays:this.plays,last:this.last}; }
}
