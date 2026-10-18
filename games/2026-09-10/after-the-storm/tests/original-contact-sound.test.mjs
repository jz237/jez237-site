import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalContactSound,originalContactSelection} from '../original-contact-sound.js';
import {Soundscape} from '../audio.js';
const base=new URL('../assets/audio/waverace64/contacts/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const command=(key=11,velocity=127,lane=2)=>({consumer:'bffec',arguments:[lane,key,velocity]});
class Param{constructor(){this.value=0;}setTargetAtTime(v){this.value=v;}}
class Node{constructor(){for(const key of ['gain','pan','playbackRate'])this[key]=new Param();this.stopped=0;this.disconnected=0;}connect(n){return n;}disconnect(){this.disconnected++;}start(t){this.started=t;}stop(){this.stopped++;this.onended?.();}}
function setup(options={}){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),createStereoPanner:()=>new Node(),
  decodeAudioData:async bytes=>{const view=new DataView(bytes);return {duration:view.getUint32(40,true)/view.getUint32(28,true)};}};
 const requested=[],loader=async url=>{requested.push(url.pathname);const data=readFileSync(url);return data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength);};
 return {ctx,requested,loader,bank:new OriginalContactSound(ctx,new Node(),{loader:options.loader??loader})};
}

test('16 complete standalone PCM files cover52 verified source drum selectors',()=>{
 assert.equal(Object.keys(manifest.files).length,16);assert.equal(Object.keys(manifest.sounds).length,52);
 for(const [file,record]of Object.entries(manifest.files)){
  const bytes=readFileSync(new URL(file,base));assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
  assert.equal(bytes.length,record.bytes);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WAVE');
  assert.equal(bytes.readUInt32LE(4)+8,bytes.length);assert.equal(bytes.readUInt16LE(20),1);assert.equal(bytes.readUInt16LE(22),1);
  assert.equal(bytes.readUInt32LE(24),32000);assert.equal(bytes.readUInt16LE(34),16);assert.equal(bytes.readUInt32LE(40)+44,bytes.length);
  assert.equal((bytes.length-44)/64000,record.duration);assert.ok(record.peak>100&&record.peak<32768);assert.ok(record.rms>10);
  assert.equal(bytes.readInt16LE(bytes.length-2),0,'rendered effect ends without a discontinuity');
 }
 for(let group=16;group<64;group+=4){
  const sounds=Array.from({length:4},(_,i)=>manifest.sounds[group+i]);
  assert.equal(new Set(sounds.map(s=>s.file)).size,1);assert.deepEqual(sounds.map(s=>s.pan),[0,64,127,64]);
  assert.deepEqual(sounds.slice(0,3).map(s=>s.rate),[1,1,1]);assert.ok(sounds[3].rate>.94&&sounds[3].rate<.95);
 }
});

test('only original human contact commands select this bank',()=>{
 for(const lane of [2,5])for(const key of Object.keys(manifest.sounds))assert.deepEqual(originalContactSelection(command(+key,63,lane)),{lane,key,velocity:63});
 for(const c of [command(15),command(64),command(11,128),command(11,-1),command(11,2.5),command(11,127,8),{consumer:'c53d4',arguments:[0x06000700,19]},null])assert.equal(originalContactSelection(c),null);
});

test('lazy bank loads once; note restart replaces only that player, retaining source velocity and pan variants',async()=>{
 const {bank,ctx,requested}=setup();assert.equal(bank.play(command()),false);assert.equal(requested.length,0);
 const first=bank.load();assert.equal(bank.load(),first);assert.equal(await first,true);assert.equal(requested.length,17);
 assert.equal(bank.play(command(17,127),-.4),true);const left=bank.voices.get(2);
 assert.equal(left.gain.gain.value,.55);assert.equal(left.pan.pan.value,-.4);
 bank.play(command(53,63,5),.4);const right=bank.voices.get(5);assert.equal(right.gain.gain.value,(63/127)**2*.55);
 const lateEnd=left.source.onended;ctx.currentTime=.1;bank.play(command(19,100),-.4);const replacement=bank.voices.get(2);
 assert.equal(left.source.stopped,1);assert.equal(right.source.stopped,0);assert.equal(bank.voices.size,2);
 assert.equal(replacement.source.playbackRate.value,manifest.sounds[19].rate);lateEnd();assert.equal(bank.voices.get(2),replacement);
 bank.setMode('mono');assert.ok([...bank.voices.values()].every(v=>v.pan.pan.value===0));bank.setMode('headphones');assert.equal(right.pan.pan.value,.4*.45);
 bank.play(command(19,0));assert.equal(bank.voices.has(2),false);assert.equal(bank.voices.has(5),true);
 right.source.onended();assert.equal(bank.voices.size,0);await bank.load();assert.equal(requested.length,17);
});

test('a missing effect falls back without blocking the rest and retries only that file after30 seconds',async()=>{
 const fixture=setup();let fail=true;const bank=new OriginalContactSound(fixture.ctx,new Node(),{loader:async url=>{
  if(fail&&url.pathname.endsWith('contact-0b.wav'))throw Error('offline');return fixture.loader(url);
 }});
 assert.equal(await bank.load(),false);assert.equal(bank.buffers.size,15);assert.deepEqual(bank.failures,['contact-0b.wav']);
 assert.equal(bank.play(command(11)),false);assert.equal(bank.play(command(12)),true);
 const count=fixture.requested.length;fail=false;await bank.load();assert.equal(fixture.requested.length,count);
 fixture.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(fixture.requested.length,count+1);assert.equal(bank.play(command(11)),true);
 bank.dispose();assert.equal(bank.voices.size,0);assert.equal(bank.buffers.size,0);assert.equal(bank.play(command()),false);
});

test('invalid paths, truncated audio and disposal during a load never become playable',async()=>{
 const fixture=setup(),bad=structuredClone(manifest);bad.sounds[11].file='../track-03.mp3';
 const invalid=new OriginalContactSound(fixture.ctx,new Node(),{loader:async()=>new TextEncoder().encode(JSON.stringify(bad)).buffer});
 assert.equal(await invalid.load(),false);assert.equal(invalid.buffers.size,0);
 const truncated=setup();truncated.ctx.decodeAudioData=async()=>({duration:0});assert.equal(await truncated.bank.load(),false);assert.equal(truncated.bank.buffers.size,0);
 let resolve,requests=0;const held=new OriginalContactSound(fixture.ctx,new Node(),{loader:()=>{requests++;return new Promise(r=>{resolve=r;});}});
 const loading=held.load();held.dispose();resolve(new TextEncoder().encode(JSON.stringify(manifest)).buffer);assert.equal(await loading,false);assert.equal(held.buffers.size,0);assert.equal(requests,1);
});

test('Soundscape prefers original effects; inactive frames drain and stop them without replay on resume',async()=>{
 const {bank,ctx}=setup();await bank.load();const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalContacts=bank;
 const fallback=[];audio.samples={play:(...args)=>{fallback.push(args);return true;}};
 const queue=[{...command(11),player:0},{...command(53,80,5),player:1}],owner={drain:()=>queue.splice(0)};
 audio.nativeContacts(owner,true,2);assert.equal(bank.voices.size,2);assert.equal(fallback.length,0);assert.equal(queue.length,0);
 audio.nativeContact({consumer:'c53d4',arguments:[0x06000700,19]});assert.equal(fallback.length,1,'ice retains its existing fallback');
 const voices=[...bank.voices.values()];queue.push(command());audio.nativeContacts(owner,false,2);
 assert.equal(queue.length,0);assert.equal(bank.voices.size,0);assert.ok(voices.every(v=>v.source.stopped===1));
 audio.nativeContacts(owner,true,2);assert.equal(bank.voices.size,0);
 audio.enabled=false;queue.push(command());audio.nativeContacts(owner,true);assert.equal(queue.length,0);assert.equal(bank.voices.size,0);
});
