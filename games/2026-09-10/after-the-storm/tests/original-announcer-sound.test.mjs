import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalAnnouncerSound,originalAnnouncerSelection} from '../original-announcer-sound.js';
import {Soundscape} from '../audio.js';
const base=new URL('../assets/audio/waverace64/announcer/',import.meta.url);
const manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
const command=(note=10)=>({consumer:'c53d4',arguments:[0x06000c00,note]});
class Node{constructor(){this.gain={value:0};this.stopped=0;}connect(n){return n;}disconnect(){}start(t){this.started=t;}stop(){this.stopped++;this.onended?.();}}
function setup(){
 const ctx={currentTime:0,createBufferSource:()=>new Node(),createGain:()=>new Node(),
  decodeAudioData:async bytes=>{const v=new DataView(bytes);return {duration:v.getUint32(40,true)/v.getUint32(28,true)};}};
 const requested=[],loader=async url=>{requested.push(url.pathname);const bytes=readFileSync(url);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);};
 return {ctx,requested,loader,bank:new OriginalAnnouncerSound(ctx,new Node(),{loader})};
}
test('94 standalone clips preserve all112 selectors, including17 silent original drum slots',()=>{
 assert.equal(Object.keys(manifest.sounds).length,112);assert.equal(Object.keys(manifest.files).length,94);
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
 const loading=bank.load();assert.equal(bank.load(),loading);assert.equal(await loading,true);assert.equal(requested.length,95);
 bank.play(command());const first=bank.voice,late=first.source.onended;ctx.currentTime=.5;bank.play(command(11));const second=bank.voice;
 assert.equal(first.source.stopped,1);assert.equal(second.note,11);assert.equal(second.source.started,.5);late();assert.equal(bank.voice,second);
 assert.equal(bank.play(command(33)),true);assert.equal(second.source.stopped,1);assert.equal(bank.voice,null);
 bank.play(command());bank.voice.source.onended();assert.equal(bank.voice,null);await bank.load();assert.equal(requested.length,95);
});
test('missing clips retry without replaying stale requests or manufacturing substitute speech',async()=>{
 const f=setup();let fail=true;
 const bank=new OriginalAnnouncerSound(f.ctx,new Node(),{loader:async url=>{if(fail&&url.pathname.endsWith('announcer-0a.wav'))throw Error('offline');return f.loader(url);}});
 assert.equal(await bank.load(),false);assert.equal(bank.buffers.size,93);assert.equal(bank.play(command()),false);assert.equal(bank.voice,null);
 bank.play(command(11));assert.equal(bank.voice.note,11);bank.play(command());assert.equal(bank.voice,null);
 const count=f.requested.length;fail=false;await bank.load();assert.equal(f.requested.length,count);
 f.ctx.currentTime=30;assert.equal(await bank.load(),true);assert.equal(f.requested.length,count+1);assert.equal(bank.voice,null);
 bank.play(command());const v=bank.voice;bank.dispose();assert.equal(v.source.stopped,1);assert.equal(bank.buffers.size,0);assert.equal(bank.play(command()),false);
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
