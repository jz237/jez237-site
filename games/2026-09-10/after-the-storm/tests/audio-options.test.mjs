import test from 'node:test';import assert from 'node:assert/strict';
import {Soundscape} from '../audio.js';import {musicNotes,midiFrequency,stereoWidth} from '../coastal-music.js';
class Param{constructor(){this.value=0;}setTargetAtTime(v){this.value=v;}setValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}}
class Node{constructor(){for(const k of ['gain','frequency','pan','Q','threshold','knee','ratio'])this[k]=new Param();}connect(n){return n;}disconnect(){}start(){}stop(){}}
class Context{constructor(){this.currentTime=0;this.sampleRate=8000;this.destination=new Node();}resume(){}createGain(){return new Node();}createDynamicsCompressor(){return new Node();}createStereoPanner(){return new Node();}createOscillator(){return new Node();}createBiquadFilter(){return new Node();}createBufferSource(){return new Node();}createBuffer(ch,n){return {getChannelData:()=>new Float32Array(n)};}}
function withAudio(fn){const previous=globalThis.AudioContext;globalThis.AudioContext=Context;try{fn(new Soundscape());}finally{globalThis.AudioContext=previous;}}
test('audio stays uninitialized until start; mono centres active sources and headphones narrow them',()=>withAudio(a=>{a.update(10,.3,false,false,0);assert.equal(a.ctx,null);a.start();a.setOptions({music:true});a.update(10,.3,false,false,0,1,{speed:6,wet:.5});assert.notEqual(a.voices[0].pan.pan.value,a.voices[1].pan.pan.value);a.setOptions({mode:'mono'});a.update(10,.3,false,false,0,1,{speed:6,wet:.5});assert.ok([...a.pans,...a.musicPans].every(p=>p.node.pan.value===0));assert.equal(stereoWidth('headphones'),.45);assert.equal(stereoWidth('mono'),0);}));
test('both engines respond independently, and pause or mute suppresses playback',()=>withAudio(a=>{a.start();a.update(4,.2,false,false,0,1,{speed:10,wet:.2});const first=a.voices[0].engine.frequency.value,second=a.voices[1].engine.frequency.value;assert.ok(second>first);a.update(4,.2,false,false,0,1,{speed:2,wet:1});assert.equal(a.voices[0].engine.frequency.value,first);assert.ok(a.voices[1].engine.frequency.value<second);a.update(4,.2,false,true,0);assert.equal(a.master.gain.value,0);assert.equal(a.effects.gain.value,0);a.enabled=false;a.update(4,.2,false,false,0);assert.equal(a.master.gain.value,0);}));
test('music preview works during pause without engine noise and expires after ten seconds',()=>withAudio(a=>{a.preview();a.update(0,0,false,true,0);assert.ok(a.musicGain.gain.value>0);assert.equal(a.effects.gain.value,0);a.ctx.currentTime=11;a.update(0,0,false,true,0);assert.equal(a.musicGain.gain.value,0);assert.equal(a.master.gain.value,0);}));
test('original music phrases have bounded notes, gains and duration',()=>{for(let i=0;i<256;i++)for(const n of musicNotes(i)){assert.ok(midiFrequency(n.midi)>50&&midiFrequency(n.midi)<1500);assert.ok(n.gain>0&&n.gain<=.1);assert.ok(n.duration>0&&n.duration<3);assert.ok(Math.abs(n.pan)<=1);}});

test('native contacts preserve source volume, simultaneous player sounds and once-only draining',()=>withAudio(a=>{
 a.start();const played=[];a.samples.play=(id,options)=>{played.push({id,...options});return true;};
 const queue=[{player:0,consumer:'bffec',arguments:[2,11,127]},{player:1,consumer:'bffec',arguments:[5,53,63]}],owner={drain:()=>queue.splice(0)};
 a.nativeContacts(owner,true,2);a.nativeContacts(owner,true,2);
 assert.deepEqual(played,[{id:'splash',gain:.65,rate:.8,pan:-.4},{id:'hit',gain:63/127*.48,rate:.85,pan:.4}]);
 assert.equal(a.lastLanding,undefined);
 for(const active of [false,true]){queue.push({player:0,consumer:'bffec',arguments:[2,11,127]});a.enabled=!active;a.nativeContacts(owner,active,2);assert.equal(queue.length,0);}
 assert.equal(played.length,2);
}));

test('native contact fallback works without downloaded samples and ignores unrelated mixer commands',()=>withAudio(a=>{
 a.start();const before=a.pans.length;a.nativeContact({consumer:'bffec',arguments:[2,12,100]});a.nativeContact({consumer:'bffec',arguments:[5,21,80]},.4);
 a.nativeContact({consumer:'c53d4',arguments:[0x06000700,0x13]});a.nativeContact({consumer:'c53d4',arguments:[0x06000006,127]});
 assert.equal(a.pans.length,before);assert.equal(a.lastLanding,undefined);
}));

test('race music configured before audio activation supports menu preview and results while holding silences it',()=>withAudio(a=>{a.setRaceMusic({phase:'menu'});assert.equal(a.ctx,null);a.start();assert.ok(a.originalMusic);const calls=[];a.originalMusic.update=(...args)=>calls.push(args);a.preview();a.update(0,0,false,true,0);assert.equal(calls.at(-1)[1],true);assert.equal(calls.at(-1)[0].phase,'menu');a.stopPreview();a.setOptions({music:true});a.setRaceMusic({phase:'results'});a.update(0,0,false,true,0);assert.equal(calls.at(-1)[1],true);assert.ok(a.master.gain.value>0);assert.equal(a.effects.gain.value,0);a.setRaceMusic({phase:'results',held:true});a.update(0,0,false,true,0);assert.equal(calls.at(-1)[1],false);assert.equal(a.master.gain.value,0);}));
