import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalAnnouncerSound,originalAnnouncerSelection} from '../original-announcer-sound.js';
import {Soundscape} from '../audio.js';
const base=new URL('../assets/audio/waverace64/announcer/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const command=(note=10)=>({consumer:'c53d4',arguments:[0x06000c00,note]});
class Node{constructor(){this.gain={value:0};this.stopped=0;this.events=[];this.pan={setValueAtTime:(v,t)=>this.events.push([t,v]),cancelScheduledValues:t=>{this.events=this.events.filter(e=>e[0]<t);}};}connect(n){return n;}disconnect(){}start(t){this.started=t;}stop(t){this.stopped++;this.stopTime=t;}}
function setup(){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),createStereoPanner:()=>new Node(),
  decodeAudioData:async bytes=>{const v=new DataView(bytes);return {duration:v.getUint32(40,true)/v.getUint32(28,true)};}};
 const requested=[],loader=async url=>{requested.push(url.pathname);const bytes=readFileSync(url);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);};
 return {ctx,requested,loader,bank:new OriginalAnnouncerSound(ctx,new Node(),{loader})};
}
test('121 standalone clips preserve regular and menu selectors, including original silent drum slots',()=>{
 assert.equal(Object.keys(manifest.sounds).length,112);assert.equal(Object.keys(manifest.files).length,121);
 assert.equal(Object.keys(manifest.menuSounds).length,30);assert.equal(Object.values(manifest.menuSounds).filter(s=>s===null).length,3);
 assert.equal(Object.values(manifest.sounds).filter(s=>s===null).length,17);
 for(const [file,info]of Object.entries(manifest.files)){
  const b=readFileSync(new URL(file,base));assert.equal(createHash('sha256').update(b).digest('hex'),info.sha256);
  assert.equal(b.length,info.bytes);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WAVE');
  assert.equal(b.readUInt32LE(4)+8,b.length);assert.equal(b.readUInt16LE(20),1);assert.equal(b.readUInt16LE(22),1);
  assert.equal(b.readUInt32LE(24),32000);assert.equal(b.readUInt16LE(34),16);assert.equal(b.readUInt32LE(40)+44,b.length);
  assert.equal((b.length-44)/64000,info.duration);assert.ok(info.peak>100&&info.peak<32768);assert.ok(info.rms>10);assert.equal(b.readInt16LE(b.length-2),0);
 }
 for(let note=0;note<112;note++)assert.equal(originalAnnouncerSelection(command(note)),note);
 for(const c of [command(-1),command(112),command(126),command(127),command(2.5),{consumer:'c53d4',arguments:[0x06000a00,10]},null])assert.equal(originalAnnouncerSelection(c),null);
});
test('one centered voice replaces its predecessor and silent source slots stop speech',async()=>{
 const {bank,ctx,requested}=setup();assert.equal(bank.play(command()),false);assert.equal(requested.length,0);
 const loading=bank.load();assert.equal(bank.load(),loading);assert.equal(await loading,true);assert.equal(requested.length,122);
 bank.play(command());const first=bank.voice,late=first.source.onended;ctx.currentTime=.5;bank.play(command(11));const second=bank.voice;
 assert.equal(first.source.stopped,1);assert.equal(second.note,11);assert.equal(second.source.started,.5);late();assert.equal(bank.voice,second);
 assert.equal(bank.play(command(33)),true);assert.equal(second.source.stopped,1);assert.equal(bank.voice,null);
 bank.play(command());bank.voice.source.onended();assert.equal(bank.voice,null);await bank.load();assert.equal(requested.length,122);
 bank.play(command());const transition=bank.voice;
 assert.equal(bank.play({consumer:'c538c',arguments:[0x01000c00,0]}),true);assert.equal(transition.source.stopped,1);assert.equal(bank.voice,null);
});
test('missing clips retry without replaying stale requests or manufacturing substitute speech',async()=>{
 const f=setup();let fail=true;
 const bank=new OriginalAnnouncerSound(f.ctx,new Node(),{loader:async url=>{if(fail&&url.pathname.endsWith('announcer-0a.wav'))throw Error('offline');return f.loader(url);}});
 assert.equal(await bank.load(),false);assert.equal(bank.buffers.size,120);assert.equal(bank.play(command()),false);assert.equal(bank.voice,null);
 bank.play(command(11));assert.equal(bank.voice.note,11);bank.play(command());assert.equal(bank.voice,null);
 const count=f.requested.length;fail=false;await bank.load();assert.equal(f.requested.length,count);
 f.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(f.requested.length,count+1);assert.equal(bank.voice,null);
 bank.play(command());const v=bank.voice;bank.dispose();assert.equal(v.source.stopped,1);assert.equal(bank.buffers.size,0);assert.equal(bank.play(command()),false);
});

const menu=(bank,selector)=>{bank.play({consumer:'c53d4',arguments:[0x06000c01,selector]});return bank.play(command(127));};
test('two-part announcements preserve the opening wait, cut the preface and coalesce pending IO0 writes',async()=>{
 const {bank,ctx}=setup();await bank.load();bank.play(command(1));const old=bank.voice;
 assert.equal(menu(bank,17),true);assert.equal(bank.voice,old);assert.equal(old.source.stopTime,.875);
 const scheduled=[...bank.voices].filter(v=>v.menu);assert.deepEqual(scheduled.map(v=>[v.note,v.start]),[[16,.875],[18,1.71875]]);
 assert.equal(scheduled[0].source.stopTime,1.71875);assert.equal(bank.busyUntil,1.75625);
 ctx.currentTime=.9;assert.equal(bank.voice.note,16);bank.play(command(10));bank.play(command(12));assert.equal(bank.pending,12);
 ctx.currentTime=1.73;bank.update();assert.equal(bank.voice.note,18);assert.equal(bank.pending,12);
 ctx.currentTime=1.75625;bank.update();assert.equal(bank.voice.note,12);assert.equal(bank.pending,null);assert.equal(scheduled[1].source.stopped,1);
});
test('a queued127 reads the latest IO1 only when the busy channel can consume it',async()=>{
 const {bank,ctx}=setup();await bank.load();menu(bank,26);const first=bank.voice;
 assert.deepEqual(first.pan.events,[[0,-.5],[.375,.5]]);assert.equal(bank.voices.size,1,'legato does not allocate another sample');
 ctx.currentTime=.1;menu(bank,0);bank.play({consumer:'c53d4',arguments:[0x06000c01,11]});assert.equal(bank.pending,127);
 ctx.currentTime=.6624;bank.update();assert.equal(bank.voice,first);
 ctx.currentTime=bank.busyUntil;bank.update();assert.equal(bank.voice.note,11);assert.equal(bank.voice.menu,true);assert.equal(bank.io1,-1);
 assert.equal(bank.play(command(127)),false,'IO1 was consumed, so there is no invented repeat');
});
test('stereo menu motion respects mono/headphones and silent selectors replace their layer',async()=>{
 const {bank,ctx}=setup();await bank.load();menu(bank,27);const v=bank.voice;
 assert.deepEqual(v.pan.events,[[0,-.5],[.375,0],[.5625,.5]]);
 ctx.currentTime=.4;bank.update('mono');assert.deepEqual(v.pan.events.slice(-2),[[.4,0],[.5625,0]]);
 ctx.currentTime=.5;bank.update('headphones');assert.deepEqual(v.pan.events.slice(-2),[[.5,0],[.5625,.225]]);
 ctx.currentTime=.7;menu(bank,28);assert.equal(bank.voice,null);assert.equal(bank.busyUntil,1.3625);
 ctx.currentTime=1.4;menu(bank,29);assert.equal(bank.voice.note,28);
 ctx.currentTime=2.1;menu(bank,14);assert.equal(bank.voice,null,'bank6 has a real null drum14');
});
test('stop cancels future words and pending commands, and missing menu files never replay after loading',async()=>{
 const f=setup();let fail=true;
 const bank=new OriginalAnnouncerSound(f.ctx,new Node(),{loader:async url=>{if(fail&&url.pathname.endsWith('menu-12.wav'))throw Error('offline');return f.loader(url);}});
 await bank.load();assert.equal(menu(bank,17),false);assert.equal(bank.voices.size,1,'available preface still plays');
 const scheduled=[...bank.voices];bank.play(command(10));bank.stop();assert.equal(bank.pending,null);assert.equal(bank.voices.size,0);
 assert.ok(scheduled.every(v=>v.source.stopped>0));f.ctx.currentTime=30;fail=false;await bank.load();bank.update();assert.equal(bank.voice,null);
 menu(bank,17);const future=[...bank.voices];bank.dispose();assert.equal(bank.voices.size,0);assert.ok(future.every(v=>v.source.stopped>0));
});
test('pause, mute, replay and a changed race owner stop the announcer without retaining delayed playback',async()=>{
 const {bank,ctx}=setup();await bank.load();const audio=new Soundscape();audio.ctx=ctx;audio.effects=new Node();audio.originalAnnouncer=bank;
 audio.originalContacts={resetChannels(){},stop(){},setMode(){},play:()=>false};
 const queue=[command()],owner={drain:()=>queue.splice(0),clearPendingSounds:()=>{owner.cleared=(owner.cleared??0)+1;}};
 audio.nativeContacts(owner,true);audio.finishNativeContactFrame(true);assert.equal(bank.voice.note,10);
 audio.finishNativeContactFrame(true);assert.equal(bank.voice,null,'replay does not supply a native physical frame');
 queue.push(command(11));audio.nativeContacts(owner,true);assert.equal(bank.voice.note,11);
 audio.nativeContacts(owner,false);assert.equal(owner.cleared,1);assert.equal(bank.voice,null);
 queue.push(command());audio.nativeContacts(owner,true);audio.enabled=false;audio.nativeContacts(owner,true);assert.equal(bank.voice,null);
 audio.enabled=true;queue.push(command());audio.nativeContacts(owner,true);audio.nativeContacts({drain:()=>[]},true);assert.equal(bank.voice,null);
});
