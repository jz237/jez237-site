import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalContactSound,originalContactSelection} from '../original-contact-sound.js';
import {Soundscape} from '../audio.js';
import {assetVersions} from '../asset-versions.js';
const base=new URL('../assets/audio/waverace64/contacts/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const command=(key=11,velocity=127,lane=2)=>({consumer:'bffec',arguments:[lane,key,velocity]});
const ice=()=>({consumer:'c53d4',arguments:[0x06000700,19]});
const spray=(key=1,velocity=80,lane=2)=>({consumer:'c0044',arguments:[lane,key,velocity]});
const rider=(note=0,port=0)=>({consumer:'c53d4',arguments:[0x06000a00|port,note]});
const pitch=(rate,lane=2)=>{const view=new DataView(new ArrayBuffer(4));view.setFloat32(0,rate);return {consumer:'c538c',arguments:[0x04000000|(lane<<8),view.getUint32(0)]};};
class Param{constructor(){this.value=0;}setTargetAtTime(v){this.value=v;}}
class Node{constructor(){for(const key of ['gain','pan','playbackRate'])this[key]=new Param();this.stopped=0;this.disconnected=0;}connect(n){return n;}disconnect(){this.disconnected++;}start(t){this.started=t;}stop(){this.stopped++;this.onended?.();}}
function setup(options={}){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),createStereoPanner:()=>new Node(),
  decodeAudioData:async bytes=>{const view=new DataView(bytes);return {duration:view.getUint32(40,true)/view.getUint32(28,true)};}};
 const requested=[],loader=async url=>{requested.push(url.href);const data=readFileSync(url);return data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength);};
 return {ctx,requested,loader,bank:new OriginalContactSound(ctx,new Node(),{loader:options.loader??loader})};
}

test('original dolphin notes keep channel distance gain and pan through playback, mute and mode changes',async()=>{
 const {bank}=setup();await bank.load();
 const gain={consumer:'c538c',arguments:[0x01000500,0x3f000000]},pan={consumer:'c53d4',arguments:[0x03000500,96]};
 bank.play(gain);bank.play(pan);bank.play(command(8,127,5));bank.play(command(11,127,2));
 const dolphin=bank.voices.get(5),rider=bank.voices.get(2);
 assert.equal(dolphin.source.buffer,bank.buffers.get('contact-08.wav'));
 assert.equal(dolphin.gain.gain.value,.275);assert.equal(dolphin.position,.5);assert.equal(rider.gain.gain.value,.55);
 bank.play({consumer:'c538c',arguments:[0x01000500,0x3e800000]});
 bank.play({consumer:'c53d4',arguments:[0x03000500,32]});
 assert.equal(dolphin.gain.gain.value,.1375);assert.equal(dolphin.position,-.5);assert.equal(rider.position,0);
 bank.setMode('mono');assert.equal(Math.abs(dolphin.pan.pan.value),0);
 bank.setMode('headphones');assert.equal(dolphin.pan.pan.value,-.225);
 bank.stop();bank.play(command(9,127,5));assert.equal(bank.voices.get(5).gain.gain.value,.1375);
 assert.equal(bank.voices.get(5).source.buffer,bank.buffers.get('contact-09.wav'));
 bank.resetChannels();bank.play(command(10,127,5));assert.equal(bank.voices.get(5).gain.gain.value,.55);
 assert.equal(bank.voices.get(5).position,0);assert.equal(bank.voices.get(5).source.buffer,bank.buffers.get('contact-0a.wav'));
 const s=manifest.dolphinSequence;assert.deepEqual([s.channel,s.notePort,s.velocityPort,s.pollTicks,s.noteTicks],[5,0,5,8,320]);
 assert.deepEqual(s.notes,[8,9,10]);for(const n of s.notes)assert.equal(manifest.sounds[n].sourceTuning,.75);
});

test('43 standalone PCM files cover57 contact/dolphin notes, five spray drums,16 rider reactions and ice',()=>{
 assert.equal(Object.keys(manifest.files).length,43);assert.equal(Object.keys(manifest.sounds).length,79);
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
 for(const lane of [2,5])for(const key of Object.keys(manifest.sounds).filter(k=>/^\d+$/.test(k)))assert.deepEqual(originalContactSelection(command(+key,63,lane)),{lane,key,velocity:63});
 for(const lane of [2,5])for(let key=0;key<20;key++)assert.deepEqual(originalContactSelection(spray(key,63,lane)),{lane,key:'spray-'+Math.floor(key/4),velocity:63,layer:1,pan:[0,64,127,0][key&3]});
 for(const c of [spray(-1),spray(20),spray(1,128),spray(1,-1),spray(1,80,7)])assert.equal(originalContactSelection(c),null);
 assert.deepEqual(originalContactSelection(ice()),{lane:7,key:'ice-break',velocity:127});
 for(const c of [command(7),command(64),command(11,128),command(11,-1),command(11,2.5),command(11,127,8),{consumer:'c53d4',arguments:[0x06000700,18]},{consumer:'c53d4',arguments:[0x06000701,19]},null])assert.equal(originalContactSelection(c),null);
});

test('lazy bank loads once; note restart replaces only that player, retaining source velocity and pan variants',async()=>{
 const {bank,ctx,requested}=setup();assert.equal(bank.play(command()),false);assert.equal(requested.length,0);
 const first=bank.load();assert.equal(bank.load(),first);assert.equal(await first,true);assert.equal(requested.length,44);
 assert.equal(new URL(requested[0]).searchParams.get('v'),assetVersions['assets/audio/waverace64/contacts/manifest.json']);
 for(const href of requested.slice(1)){const url=new URL(href);assert.equal(url.searchParams.get('v'),manifest.files[url.pathname.split('/').at(-1)].sha256);}
 assert.equal(bank.play(command(17,127),-.4),true);const left=bank.voices.get(2);
 assert.equal(left.gain.gain.value,.55);assert.equal(left.pan.pan.value,-.4);
 bank.play(command(53,63,5),.4);const right=bank.voices.get(5);assert.equal(right.gain.gain.value,(63/127)**2*.55);
 const lateEnd=left.source.onended;ctx.currentTime=.1;bank.play(command(19,100),-.4);const replacement=bank.voices.get(2);
 assert.equal(left.source.stopped,1);assert.equal(right.source.stopped,0);assert.equal(bank.voices.size,2);
 assert.equal(replacement.source.playbackRate.value,manifest.sounds[19].rate);lateEnd();assert.equal(bank.voices.get(2),replacement);
 bank.setMode('mono');assert.ok([...bank.voices.values()].every(v=>v.pan.pan.value===0));bank.setMode('headphones');assert.equal(right.pan.pan.value,.4*.45);
 bank.play(command(19,0));assert.equal(bank.voices.has(2),false);assert.equal(bank.voices.has(5),true);
 right.source.onended();assert.equal(bank.voices.size,0);await bank.load();assert.equal(requested.length,44);
});

test('a missing effect falls back without blocking the rest and retries only that file after30 seconds',async()=>{
 const fixture=setup();let fail=true;const bank=new OriginalContactSound(fixture.ctx,new Node(),{loader:async url=>{
  if(fail&&url.pathname.endsWith('contact-0b.wav'))throw Error('offline');return fixture.loader(url);
 }});
 assert.equal(await bank.load(),false);assert.equal(bank.buffers.size,42);assert.deepEqual(bank.failures,['contact-0b.wav']);
 assert.equal(bank.play(command(11)),false);assert.equal(bank.play(command(12)),true);
 const count=fixture.requested.length;fail=false;await bank.load();assert.equal(fixture.requested.length,count);
 fixture.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(fixture.requested.length,count+1);assert.equal(bank.play(command(11)),true);
 bank.dispose();assert.equal(bank.voices.size,0);assert.equal(bank.buffers.size,0);assert.equal(bank.play(command()),false);
});

test('spray layer1 and contact layer0 coexist; channel pitch updates both and survives restarts',async()=>{
 const {bank}=setup();await bank.load();
 assert.equal(bank.play(pitch(1.5)),true);bank.play(spray(1,100),-.4);bank.play(command(17,127),-.4);
 const left=bank.voices.get(2),water=bank.voices.get('2:spray');
 assert.equal(water.source.buffer,bank.buffers.get('spray-0.wav'));assert.equal(water.position,-.4);
 assert.equal(water.source.playbackRate.value,1.5);assert.equal(left.source.playbackRate.value,1.5);
 bank.play(spray(18,60,5),.4);const right=bank.voices.get('5:spray');assert.equal(right.source.playbackRate.value,1);
 bank.play(pitch(.75));assert.equal(left.source.playbackRate.value,.75);assert.equal(water.source.playbackRate.value,.75);assert.equal(right.source.playbackRate.value,1);
 bank.play(spray(9,70),-.4);assert.equal(water.source.stopped,1);assert.equal(left.source.stopped,0);
 bank.play(command(19,50),-.4);assert.equal(bank.voices.get(2).source.playbackRate.value,manifest.sounds[19].rate*.75);
 assert.equal(bank.voices.get('2:spray').source.playbackRate.value,.75);
 bank.setMode('mono');assert.ok([...bank.voices.values()].every(v=>v.pan.pan.value===0));
 bank.play(spray(1,0));assert.equal(bank.voices.has('2:spray'),false);assert.equal(bank.voices.has(2),true);
 bank.play(spray());bank.stop(2);assert.equal(bank.voices.size,1);assert.equal(bank.voices.get('5:spray'),right);
 bank.stop();bank.play(spray());assert.equal(bank.voices.get('2:spray').source.playbackRate.value,.75,'mute does not reset source channel pitch');
 assert.equal(bank.play(pitch(NaN)),false);assert.equal(bank.play(pitch(-1)),false);
 const s=manifest.spraySequence;assert.deepEqual([s.bank,s.layer,s.pollTicks,s.noteTicks],[4,1,8,320]);
 assert.deepEqual(s.selectorNotes,Array.from({length:20},(_,i)=>Math.floor(i/4)));assert.deepEqual(s.selectorPans,[0,64,127,0]);
 for(let i=0;i<5;i++){const drum=manifest.sounds['spray-'+i];assert.equal(drum.sourceTuning,.5);assert.ok(drum.sourceLoop[1]>drum.sourceLoop[0]);assert.deepEqual(drum.envelope,[2,32000,200,24000,400,0,0,0]);}
});

test('missing spray uses the fallback, and an inactive frame clears deferred source commands',async()=>{
 const {bank,ctx}=setup();await bank.load();bank.buffers.delete('spray-2.wav');
 const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalContacts=bank;
 const fallback=[];audio.samples={play:(...args)=>{fallback.push(args);return true;}};
 audio.nativeContact(pitch(1.25));audio.nativeContact(spray(9));assert.equal(fallback.length,1);assert.equal(fallback[0][0],'splash');assert.equal(fallback[0][1].rate,1.25);
 audio.nativeContact(spray(1));assert.equal(bank.voices.size,1);let cleared=0;
 audio.nativeContacts({drain:()=>[spray()],clearPendingSounds:()=>cleared++},false);
 assert.equal(cleared,1);assert.equal(bank.voices.size,0);assert.equal(fallback.length,1);
});

test('replay cannot retain live effects, pause keeps pitch, and a new race resets its channels',async()=>{
 const {bank,ctx}=setup();await bank.load();const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalContacts=bank;
 const queue=[pitch(1.5),spray()],owner={drain:()=>queue.splice(0)};
 audio.nativeContacts(owner,true);audio.finishNativeContactFrame(true);assert.equal(bank.voices.size,1);
 audio.finishNativeContactFrame(true);assert.equal(bank.voices.size,0,'a replay visual frame has no nativeContacts call');
 queue.push(spray());audio.nativeContacts(owner,true);assert.equal(bank.voices.get('2:spray').source.playbackRate.value,1.5);
 audio.finishNativeContactFrame(false);assert.equal(bank.voices.size,0);
 audio.nativeContacts({drain:()=>[spray()]},true);assert.equal(bank.voices.get('2:spray').source.playbackRate.value,1);
});

test('source rider ports select independent layers and fixed solo/split pans without changing spray or impact voices',async()=>{
 const {bank}=setup();await bank.load();bank.play(command());bank.play(spray());
 const contact=bank.voices.get(2),water=bank.voices.get('2:spray');
 for(let note=0;note<16;note++)for(let port=0;port<3;port++){
  const key='rider-'+note.toString(16).padStart(2,'0');
  assert.deepEqual(originalContactSelection(rider(note,port)),{lane:10,key,velocity:127,layer:port===2?1:0,pan:[64,32,96][port],fixedPan:true});
  assert.equal(manifest.sounds[key].sourceBank,7);
 }
 bank.play(rider(0),.4);assert.equal(bank.voices.get('10:0').position,0);
 bank.play(rider(4,1),-.4);bank.play(rider(13,2),.4);
 const left=bank.voices.get('10:0'),right=bank.voices.get('10:1');
 assert.equal(left.source.buffer,bank.buffers.get('rider-04.wav'));assert.equal(left.position,-.5);assert.equal(right.position,.5);
 assert.equal(left.source.playbackRate.value,1);bank.play(pitch(1.8));assert.equal(left.source.playbackRate.value,1);
 bank.play(rider(7,1));assert.equal(left.source.stopped,1);assert.equal(right.source.stopped,0);
 assert.equal(bank.voices.get(2),contact);assert.equal(bank.voices.get('2:spray'),water);
 bank.setMode('mono');assert.ok([...bank.voices.values()].every(v=>v.pan.pan.value===0));
 bank.setMode('headphones');assert.equal(right.pan.pan.value,.225);bank.stop(10);
 assert.equal(bank.voices.size,2);assert.equal(bank.voices.get(2),contact);
 const meta=manifest.riderSequence;assert.deepEqual([meta.logicalBank,meta.bank,meta.channel,meta.noteTicks],[8,7,10,240]);
 assert.deepEqual(meta.portLayers,[0,0,1]);assert.deepEqual(meta.portPans,[64,32,96]);
 for(const c of [rider(-1),rider(16),rider(0,3)])assert.equal(originalContactSelection(c),null);
 bank.buffers.delete('rider-00.wav');assert.equal(bank.play(rider()),false);
});

test('water entry has its own original sample and retains splash fallback when missing',async()=>{
 const {bank,ctx}=setup();await bank.load();const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalContacts=bank;
 const fallback=[];audio.samples={play:(...a)=>{fallback.push(a);return true;}};
 audio.nativeContact(command(1));assert.equal(bank.voices.get(2).source.buffer,bank.buffers.get('contact-01.wav'));
 assert.equal(fallback.length,0);bank.buffers.delete('contact-01.wav');audio.nativeContact(command(1));
 assert.equal(fallback.length,1);assert.equal(fallback[0][0],'splash');assert.equal(fallback[0][1].rate,1);
 bank.buffers.delete('rider-00.wav');audio.nativeContact(rider());assert.equal(fallback.length,1,'missing voice does not invent spoken output or another impact');
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
 audio.nativeContact(ice());assert.equal(fallback.length,0);assert.equal(bank.voices.size,3);
 bank.stop(7);bank.buffers.delete('ice-break.wav');audio.nativeContact(ice());assert.equal(fallback.length,1,'missing ice assets retain their existing fallback');
 const voices=[...bank.voices.values()];queue.push(command());audio.nativeContacts(owner,false,2);
 assert.equal(queue.length,0);assert.equal(bank.voices.size,0);assert.ok(voices.every(v=>v.source.stopped===1));
 audio.nativeContacts(owner,true,2);assert.equal(bank.voices.size,0);
 audio.enabled=false;queue.push(command());audio.nativeContacts(owner,true);assert.equal(queue.length,0);assert.equal(bank.voices.size,0);
});

test('ice uses the verified five-note sequence and coalesces repeated hits during the shared channel wait',async()=>{
 const s=manifest.iceSequence;
 assert.deepEqual([s.command,s.value,s.bank,s.program,s.tempo,s.ticksPerQuarter],[0x06000700,19,5,7,200,48]);
 assert.deepEqual(s.notes.map(n=>[n.layer,n.tick,n.note,n.duration,n.velocity]),[[0,0,36,10,127],[0,10,39,120,127],[1,14,39,120,127],[2,34,43,10,127],[2,44,46,120,127]]);
 assert.equal(manifest.files['ice-break.wav'].duration,(s.channelBusyTicks+s.pollTicks)*60/s.tempo/s.ticksPerQuarter);
 const {bank}=setup();await bank.load();bank.play(command());const contact=bank.voices.get(2);
 bank.play(ice(),-.4);const first=bank.voices.get(7);const ended=first.source.onended;
 for(let i=0;i<20;i++)bank.play(ice(),i===19?.4:-.4);
 assert.equal(bank.voices.get(7),first);assert.equal(first.source.stopped,0);assert.equal(bank.voices.size,2);
 ended();const next=bank.voices.get(7);assert.notEqual(next,first);assert.equal(next.position,.4);assert.equal(bank.pendingIce,null);
 assert.equal(bank.voices.get(2),contact);ended();assert.equal(bank.voices.get(7),next,'late callbacks cannot restart or delete the new cue');
 bank.play(ice());bank.stop();assert.equal(bank.pendingIce,null);assert.equal(bank.voices.size,0);
 assert.equal(first.source.onended,ended);assert.equal(next.source.onended,null);assert.equal(contact.source.stopped,1);
});
