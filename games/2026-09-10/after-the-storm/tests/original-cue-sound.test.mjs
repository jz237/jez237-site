import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalCueSound} from '../original-cue-sound.js';
import {prepareNativeCueAudio,originalCuePlan} from '../native-cue-audio.js';
import {createNativeRaceContactAudio} from '../native-race-contact-audio.js';
import {Soundscape} from '../audio.js';
const base=new URL('../assets/audio/waverace64/cues/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-cue-audio-reference.json',import.meta.url)));
const command=n=>({consumer:'c53d4',arguments:[0x06000b00,n]});
class Node{constructor(){this.gain={value:0};this.stopped=0;}connect(n){return n;}disconnect(){}start(t){this.started=t;}stop(){this.stopped++;}}
function setup(){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),decodeAudioData:async bytes=>{const v=new DataView(bytes);return {duration:v.getUint32(40,true)/64000};}};
 const requested=[],loader=async url=>{requested.push(url.pathname);const b=readFileSync(url);return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);};
 return {ctx,loader,requested,bank:new OriginalCueSound(ctx,new Node(),{loader})};
}
test('846 original cue calls and128 actual short layers preserve selectors, fallback programs and empty drums',()=>{
 for(const c of reference.calls)assert.deepEqual(prepareNativeCueAudio(c.selector,c.base),c.expected);
 for(const c of reference.layers){assert.deepEqual(originalCuePlan(c.selector),c.expected);assert.equal(c.noteTicks,1200);assert.equal(c.gateTicks,0);if(c.expected.program!==null)assert.equal(manifest.programs[c.expected.program].sourceTuning,c.pitch);}
 for(const n of [-1,128,1.5,NaN])assert.equal(originalCuePlan(n),null);
 assert.throws(()=>prepareNativeCueAudio(0,256),RangeError);
});
test('16 original looping-instrument renders preserve PCM hashes and bounded source envelopes',()=>{
 assert.equal(Object.keys(manifest.programs).length,20);assert.equal(Object.keys(manifest.files).length,16);
 for(const [file,f]of Object.entries(manifest.files)){
  const b=readFileSync(new URL(file,base));assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);
  assert.equal(b.length,f.bytes);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.readUInt32LE(4)+8,b.length);
  assert.equal(b.readUInt16LE(20),1);assert.equal(b.readUInt16LE(22),1);assert.equal(b.readUInt32LE(24),32000);assert.equal(b.readUInt16LE(34),16);
  assert.equal(b.readUInt32LE(40)+44,b.length);assert.equal((b.length-44)/64000,f.duration);assert.ok(f.duration>3&&f.duration<13);
  assert.ok(f.peak>100&&f.peak<32768);assert.ok(f.rms>10);assert.equal(b.readInt16LE(b.length-2),0);
 }
 assert.deepEqual(manifest.programs[15].envelope.slice(-2),[-2,3],'looping ADSR branch is retained, not truncated to the first four pairs');
});
test('two-layer cue discards early writes then accepts the latest write in its next poll window',async()=>{
 const {ctx,bank,requested}=setup();const load=bank.load();assert.equal(bank.load(),load);assert.equal(await load,true);assert.equal(requested.length,17);
 assert.equal(bank.play(command(16)),true);assert.equal(bank.voices.size,2);const layer1=bank.voices.get(1);
 ctx.currentTime=7.49;bank.play(command(18));assert.equal(bank.pending,null);
 ctx.currentTime=7.51;bank.play(command(8));bank.play(command(9));assert.equal(bank.pending,9);
 ctx.currentTime=7.55;bank.update();assert.equal(bank.voices.get(0).program,9);assert.equal(bank.voices.get(1),layer1,'other layer retains its source release tail');
 assert.equal(bank.play(command(127)),true);assert.equal(bank.voices.has(0),false);assert.equal(bank.voices.get(1),layer1);
 bank.stop();assert.equal(layer1.source.stopped,1);assert.equal(bank.voices.size,0);assert.equal(bank.pending,null);
});
test('ordinary replacement, invalid-byte polls, and missing clips do not manufacture late playback',async()=>{
 const f=setup();let fail=true;const bank=new OriginalCueSound(f.ctx,new Node(),{loader:async url=>{if(fail&&url.pathname.endsWith('cue-12.wav'))throw Error('offline');return f.loader(url);}});
 assert.equal(await bank.load(),false);bank.play(command(3));assert.equal(bank.voices.get(0).program,0);
 const old=bank.voices.get(0),late=old.source.onended;bank.play(command(4));late();assert.equal(bank.voices.get(0).program,4);
 bank.play(command(0xffffffff));assert.equal(bank.voices.get(0).program,4);assert.equal(bank.play(command(18)),false);assert.equal(bank.voices.size,0);
 fail=false;const requests=f.requested.length;await bank.load();assert.equal(f.requested.length,requests);
 f.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(f.requested.length,requests+1);assert.equal(bank.voices.size,0);
 bank.play(command(16));bank.dispose();assert.equal(bank.voices.size,0);assert.equal(bank.buffers.size,0);assert.equal(bank.play(command(18)),false);
});
test('native solo/versus entry and finish events emit their actual retained-base cues',()=>{
 for(const [players,expected]of [[1,16],[2,6]]){
  const owner=createNativeRaceContactAudio({players,courseIndex:1});owner.applyEffects([{kind:'externalCall',consumer:'800c21f4',arguments:[7,1]}]);
  assert.deepEqual(owner.drain().filter(c=>c.arguments[0]===0x06000b00).map(c=>c.arguments[1]),[expected]);
  owner.applyEffects([{kind:'audioEntry',consumer:'800c37f4',arguments:[0x21,0]}]);
  assert.deepEqual(owner.drain().filter(c=>c.arguments[0]===0x06000b00).map(c=>c.arguments[1]),[18]);
 }
});
test('cue channel coexists with speech and is stopped by pause, mute, replay and owner replacement',async()=>{
 const {bank,ctx}=setup();await bank.load();const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalCues=bank;
 audio.originalContacts={resetChannels(){},stop(){},setMode(){},play:()=>false};
 const speech=[];audio.originalAnnouncer={stop(){},update(){},play:c=>speech.push(c)};
 const queue=[command(16),{consumer:'c53d4',arguments:[0x06000c00,10]}],owner={drain:()=>queue.splice(0),clearPendingSounds(){}};
 audio.nativeContacts(owner,true);assert.equal(bank.voices.size,2);assert.equal(speech.length,1);audio.finishNativeContactFrame(true);
 audio.finishNativeContactFrame(true);assert.equal(bank.voices.size,0);
 for(const action of ['pause','mute','replace']){
  queue.push(command(4));audio.enabled=true;audio.nativeContacts(owner,true);assert.equal(bank.voices.size,1);
  if(action==='mute')audio.enabled=false;
  audio.nativeContacts(action==='replace'?{drain:()=>[]}:owner,action!=='pause');assert.equal(bank.voices.size,0);
 }
});

test('native startup waits for all audio banks without draining source commands, with failure/mute/timeout exits',async()=>{
 const audio=new Soundscape();audio.ctx={};const owner={drain(){throw Error('Preparation must not drain the source queue');}};
 let finish;const delayed=new Promise(resolve=>{finish=resolve;});
 for(const key of ['originalContacts','originalAnnouncer','originalCues','originalEngines'])audio[key]={ready:false,load:()=>delayed};
 audio.beginNativeAudio(owner,100);assert.equal(audio.nativeAudioPending(owner,101),true);
 assert.equal(audio.nativeAudioPending({},101),false);finish(true);await audio.nativeAudioPreparation.loading;assert.equal(audio.nativeAudioPending(owner,102),false);
 audio.originalCues.load=async()=>false;audio.beginNativeAudio(owner,200);await audio.nativeAudioPreparation.loading;
 assert.deepEqual(audio.nativeAudioPreparation.failed,[2]);assert.equal(audio.nativeAudioPending(owner,201),false);
 audio.originalCues.load=()=>new Promise(()=>{});audio.beginNativeAudio(owner,300);
 assert.equal(audio.nativeAudioPending(owner,8299),true);assert.equal(audio.nativeAudioPending(owner,8300),false);assert.equal(audio.nativeAudioPreparation.timedOut,true);
 audio.beginNativeAudio(owner,9000);audio.enabled=false;assert.equal(audio.nativeAudioPending(owner,9001),false);
 audio.enabled=true;assert.equal(audio.nativeAudioPending(owner,9002),false,'unmuting cannot re-freeze a race that started muted');
 audio.beginNativeAudio(null,9010);assert.equal(audio.nativeAudioPreparation,null);
});
