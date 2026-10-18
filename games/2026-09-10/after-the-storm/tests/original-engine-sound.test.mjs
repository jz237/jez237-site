import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalEngineSound,createOriginalEngineChannels,applyOriginalEngineCommands,originalEngineLayers} from '../original-engine-sound.js';
const base=new URL('../assets/audio/waverace64/engine/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const bits=n=>{const v=new DataView(new ArrayBuffer(4));v.setFloat32(0,n);return v.getUint32(0);};
const byte=(op,arg)=>({consumer:'c53d4',arguments:[op,arg>>>0]});
const number=(op,arg)=>({consumer:'800c538c',arguments:[op,bits(arg)]});
class Param{constructor(){this.value=0;}setTargetAtTime(v){this.value=v;}}
class Node{constructor(){for(const key of ['gain','pan','playbackRate'])this[key]=new Param();this.stops=[];this.disconnected=0;}connect(n){return n;}disconnect(){this.disconnected++;}start(t){this.started=t;}stop(t){this.stops.push(t);}}
function setup(){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),createStereoPanner:()=>new Node(),
  decodeAudioData:async bytes=>{const v=new DataView(bytes);return {duration:v.getUint32(40,true)/v.getUint32(28,true)};}};
 const requests=[],loader=async url=>{requests.push(url.pathname);const b=readFileSync(url);return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);};
 return {ctx,loader,requests,bank:new OriginalEngineSound(ctx,new Node(),{loader})};
}
const start=players=>applyOriginalEngineCommands(createOriginalEngineChannels(players),[byte(0x06000000,1),byte(0x06000300,1)]);

test('four original engine waveforms retain verified PCM hashes and exact source loop boundaries',()=>{
 assert.equal(Object.keys(manifest.files).length,4);
 for(const [name,f]of Object.entries(manifest.files)){
  const b=readFileSync(new URL(name,base));assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);
  assert.equal(b.readUInt16LE(20),1);assert.equal(b.readUInt16LE(22),1);assert.equal(b.readUInt32LE(24),32000);
  assert.equal(b.length,44+f.frames*2);assert.equal(f.loopEndFrame,f.frames);assert.ok(f.rms>100);
 }
 assert.deepEqual(Object.values(manifest.files).map(f=>[f.loopStartFrame,f.loopEndFrame]),[[10,5208],[8,3906],[5,2604],[135,3985]]);
 assert.deepEqual(manifest.zones.map(z=>[z.low,z.high,z.baseTuning]),[[0,37,1],[38,41,.75],[42,127,.5]]);
 assert.equal(manifest.water.tuning,.75);
});

test('source mixer commands target channels0/3 and preserve the primary-only transpose quirk',()=>{
 const initial=createOriginalEngineChannels(2),started=applyOriginalEngineCommands(initial,[
  byte(0x06000000,1),byte(0x06000300,1),number(0x04000000,1.5),number(0x04000300,.8),
  number(0x01000000,.9),number(0x02000300,60/127),byte(0x03000000,0),byte(0x03000300,127),
  byte(0x06000005,-3),byte(0x06000006,0),byte(0x06000306,-1)]);
 assert.ok(initial.every(c=>!c.enabled));assert.ok(started.every(c=>c.enabled));
 assert.deepEqual(started.map(c=>c.transpose),[-3,0]);assert.deepEqual(started.map(c=>c.program),[2,1]);
 assert.deepEqual(started.map(c=>c.velocity),[127,127]);assert.deepEqual(started.map(c=>c.pan),[0,127]);
 assert.equal(started[0].frequency,1.5);assert.equal(started[1].frequency,Math.fround(.8));assert.equal(started[0].expression,Math.fround(.9));
 const reduced=applyOriginalEngineCommands(started,[byte(0x06000006,96)]);assert.equal(reduced[0].program,2);assert.equal(reduced[0].velocity,96);
 const stopped=applyOriginalEngineCommands(reduced,[byte(0x06000304,-1)]);assert.equal(stopped[1].enabled,false);assert.equal(stopped[0].enabled,true);
 assert.deepEqual(applyOriginalEngineCommands(stopped,[number(0x04000200,4),number(0x04010000,4)]),stopped,'other channels/sequences remain outside this owner');
 assert.throws(()=>applyOriginalEngineCommands(initial,[number(0x04000000,NaN)]),/mixer/);
 assert.throws(()=>applyOriginalEngineCommands(initial,[{consumer:'c53d4',arguments:[0x06000000,undefined]}]),/command/);
});

test('the base layer uses all three instrument zones; dry layer has original detuning and independent velocity',()=>{
 for(const [transpose,file,tuning]of [[-3,'base-low.wav',1],[0,'base-middle.wav',.75],[3,'base-high.wav',.5]]){
  const c={...start(1)[0],transpose,frequency:2},wet=originalEngineLayers(c,manifest),dry=originalEngineLayers({...c,program:2,velocity:127},manifest);
  assert.equal(wet[0].file,file);assert.equal(wet[0].rate,2*2**(transpose/12)*tuning);assert.equal(wet[1].file,'water.wav');
  assert.equal(dry[1].file,file);assert.ok(dry[1].rate/wet[0].rate>.9899&&dry[1].rate/wet[0].rate<.9901);
  assert.equal(wet[0].gain,dry[0].gain);assert.ok(dry[1].gain>wet[1].gain);
 }
 for(const change of [{transpose:90},{program:3},{frequency:-1},{velocity:128},{expression:2}])assert.throws(()=>originalEngineLayers({...start(1)[0],...change},manifest));
});

test('recovered human engine traces produce playback plans; negative-frequency stress cases are rejected',()=>{
 const reference=JSON.parse(readFileSync(new URL('./fixtures/native-engine-audio-reference.json',import.meta.url)));let checked=0,rejected=0;
 for(const c of [...reference.engineCases,...reference.historyCases,...reference.combinedCases]){
  if(c.context.channel===2)continue;
  // The original-instruction fixture intentionally includes signed packet
  // power bytes outside gameplay's0..5 range. Those can emit negative pitch;
  // Web Audio's forward loop backend must reject, not silently reinterpret it.
  const negative=c.expected.commands.some(command=>{
   if(command.consumer!=='c538c')return false;
   const [op,arg]=command.arguments;if(op>>>24!==4||![0,3].includes((op>>>8)&255))return false;
   const v=new DataView(new ArrayBuffer(4));v.setUint32(0,arg);return v.getFloat32(0)<0;
  });
  if(negative){assert.throws(()=>applyOriginalEngineCommands(start(2),c.expected.commands),/mixer/);rejected++;continue;}
  const channels=applyOriginalEngineCommands(start(2),c.expected.commands);
  for(const channel of channels){const layers=originalEngineLayers(channel,manifest);assert.equal(layers.length,2);assert.ok(layers.every(l=>Number.isFinite(l.rate)&&l.rate>=0&&l.gain>=0));}
  checked++;
 }
 assert.ok(checked>=300&&rejected>0&&checked+rejected>=400);
});

test('browser loops keep original boundaries, update pitch without restarting and crossfade sample changes',async()=>{
 const {bank,requests,ctx}=setup();const channels=start(2);assert.equal(bank.update(channels),false);assert.equal(requests.length,0);
 const loading=bank.load();assert.equal(bank.load(),loading);assert.equal(await loading,true);assert.equal(requests.length,5);
 bank.update(channels);assert.equal(bank.voices.size,4);
 const original=bank.voices.get('0:0');assert.equal(original.source.loop,true);assert.equal(original.source.loopStart,8/32000);assert.equal(original.source.loopEnd,3906/32000);
 channels[0].frequency=2;ctx.currentTime=.05;bank.update(channels);assert.equal(bank.voices.get('0:0'),original);assert.equal(original.source.playbackRate.value,1.5);
 channels[0].transpose=3;bank.update(channels);assert.notEqual(bank.voices.get('0:0'),original);assert.equal(bank.voices.get('0:0').file,'base-high.wav');assert.equal(bank.tails.size,1);assert.deepEqual(original.source.stops,[.09]);
 channels[0].program=2;bank.update(channels);assert.equal(bank.voices.get('0:1').file,'base-high.wav');assert.equal(bank.tails.size,2);
 for(const voice of [...bank.tails])voice.source.onended();assert.equal(bank.tails.size,0);
 channels[0].pan=0;channels[1].pan=127;bank.update(channels);assert.equal(bank.voices.get('0:0').pan.pan.value,-1);
 bank.update(channels,{mode:'mono'});assert.ok([...bank.voices.values()].every(v=>v.pan.pan.value===0));
 bank.update(channels,{mode:'headphones'});assert.equal(bank.voices.get('0:0').pan.pan.value,-.45);
 bank.update(channels,{active:false});assert.equal(bank.voices.size,0);assert.equal(bank.tails.size,0);
 bank.dispose();assert.equal(bank.update(channels),false);
});

test('rapid sample switches stay bounded and a stopped channel never silences the other player',async()=>{
 const {bank}=setup();await bank.load();const channels=start(2);bank.update(channels);const second=bank.voices.get('3:0');
 for(let i=0;i<30;i++){channels[0].transpose=i%2?3:-3;channels[0].program=2;bank.update(channels);assert.ok(bank.tails.size<=8);assert.equal(bank.voices.size,4);}
 channels[0].enabled=false;bank.update(channels);assert.equal(bank.voices.size,2);assert.equal(bank.voices.get('3:0'),second);assert.equal(second.source.stops.length,0);
 bank.stop();assert.equal(bank.tails.size,0);assert.equal(bank.voices.size,0);assert.equal(second.source.stops.length,1);
});

test('partial failures retain fallback and only missing files retry; invalid loops and disposed loads never start',async()=>{
 const f=setup();let fail=true;const bank=new OriginalEngineSound(f.ctx,new Node(),{loader:async url=>{if(fail&&url.pathname.endsWith('water.wav'))throw Error('offline');return f.loader(url);}});
 assert.equal(await bank.load(),false);assert.equal(bank.buffers.size,3);assert.equal(bank.update(start(1)),false);
 const count=f.requests.length;fail=false;await bank.load();assert.equal(f.requests.length,count);f.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(f.requests.length,count+1);
 const bad=structuredClone(manifest);bad.files['water.wav'].loopStartFrame=99999;
 const invalid=new OriginalEngineSound(f.ctx,new Node(),{loader:async()=>new TextEncoder().encode(JSON.stringify(bad)).buffer});assert.equal(await invalid.load(),false);
 let resolve,requests=0;const held=new OriginalEngineSound(f.ctx,new Node(),{loader:()=>{requests++;return new Promise(r=>{resolve=r;});}});
 const pending=held.load();held.dispose();resolve(new TextEncoder().encode(JSON.stringify(manifest)).buffer);assert.equal(await pending,false);assert.equal(requests,1);assert.equal(held.buffers.size,0);
});
