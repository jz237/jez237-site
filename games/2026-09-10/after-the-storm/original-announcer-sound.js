const base=new URL('./assets/audio/waverace64/announcer/',import.meta.url);
const filePattern=/^announcer-[0-9a-f]{2}\.wav$/;
export function originalAnnouncerSelection(command){
 const args=command?.arguments;
 if(command?.consumer!=='c53d4'||!Array.isArray(args)||args.length!==2||args[0]!==0x06000c00||
  !Number.isInteger(args[1])||args[1]<0||args[1]>=112)return null;
 return args[1];
}

// Sequence0/channel12 regular percussion voices. One centered layer replaces
// its current note when IO0 selects another. Bank2's null drum slots stay silent.
// The source polls every6 sequence ticks (37.5ms); browser delivery uses the
// render's command drain, not an emulation of the RSP sequencer phase/reverb.
export class OriginalAnnouncerSound{
 constructor(ctx,destination,{loader=(url,signal)=>fetch(url,{signal}).then(r=>{if(!r.ok)throw Error('Announcer asset '+r.status);return r.arrayBuffer();})}={}){
  this.ctx=ctx;this.destination=destination;this.loader=loader;this.buffers=new Map();
  this.ready=false;this.disposed=false;this.retryAt=0;this.failures=[];this.voice=null;
 }
 load(){
  if(this.disposed||this.ready||this.ctx.currentTime<this.retryAt)return Promise.resolve(this.ready);
  if(this.loading)return this.loading;
  this.loading=this.loadAssets().finally(()=>{this.loading=null;});return this.loading;
 }
 async loadAssets(){
  const controller=this.controller=new AbortController();this.failures=[];
  try{
   if(!this.manifest){
    const m=JSON.parse(new TextDecoder().decode(await this.loader(new URL('manifest.json',base),controller.signal)));
    if(this.disposed||controller.signal.aborted)return false;
    if(m.version!==1||!m.sounds||!m.files||Object.keys(m.sounds).length!==112||Array.from({length:112},(_,i)=>i).some(i=>{
     const s=m.sounds[i];if(s===null)return false;const f=m.files[s?.file];
     return !s||!filePattern.test(s.file)||!f;
    })||Object.entries(m.files).some(([file,f])=>!filePattern.test(file)||!Number.isFinite(f.duration)||f.duration<=0||f.duration>7.65))throw Error('Invalid announcer manifest');
    this.manifest=m;
   }
   const pending=Object.keys(this.manifest.files).filter(file=>!this.buffers.has(file));
   await Promise.all(Array.from({length:6},async()=>{
    while(pending.length&&!controller.signal.aborted){
     const file=pending.shift();
     try{
      const buffer=await this.ctx.decodeAudioData(await this.loader(new URL(file,base),controller.signal));
      if(!Number.isFinite(buffer.duration)||Math.abs(buffer.duration-this.manifest.files[file].duration)>.025)throw Error('Truncated announcer asset');
      if(!this.disposed&&!controller.signal.aborted)this.buffers.set(file,buffer);
     }catch{if(!controller.signal.aborted)this.failures.push(file);}
    }
   }));
   this.ready=!this.disposed&&this.buffers.size===Object.keys(this.manifest.files).length;
  }catch(error){if(!controller.signal.aborted)this.failures.push(String(error.message||error));}
  finally{if(this.controller===controller)this.controller=null;}
  if(!this.ready)this.retryAt=this.ctx.currentTime+30;
  return this.ready;
 }
 play(command){
  const note=originalAnnouncerSelection(command);if(this.disposed||note===null)return false;
  this.stop();
  const sound=this.manifest?.sounds[note];if(sound===null)return true;
  const buffer=this.buffers.get(sound?.file);if(!buffer)return false;
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=buffer;
  // Centered source pan64 works for stereo, mono and headphones. Source tuning
  // and envelopes are baked into the clip; bus gain is a web mix adaptation.
  gain.gain.value=.7;source.connect(gain).connect(this.destination);
  const voice=this.voice={source,gain,note};
  source.onended=()=>{source.disconnect();gain.disconnect();if(this.voice===voice)this.voice=null;};
  source.start(this.ctx.currentTime);return true;
 }
 stop(){
  const voice=this.voice;if(!voice)return;this.voice=null;voice.source.onended=null;
  voice.source.stop();voice.source.disconnect();voice.gain.disconnect();
 }
 dispose(){this.disposed=true;this.controller?.abort();this.stop();this.buffers.clear();this.ready=false;}
}
