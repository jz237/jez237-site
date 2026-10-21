import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeEndingCeremonyActors,NATIVE_ENDING_CEREMONY_DATA} from '../native-ending-ceremony-actors.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';

const base=createRace({mode:'championship',physics:'native',course:getCourse('greyhaven',0),difficulty:0,rider:0}).nativeLaunch.snapshot();
const i=a=>(a-0x7788)/4,b=new DataView(new ArrayBuffer(4)),float=w=>{b.setUint32(0,w>>>0);return b.getFloat32(0);};
function frames(difficulty,rank,last){
 let hud=[...base.hudWords7788],rng=base.scene.rngState4640,pool={actorWordsF060:base.actorWordsF060,actorControlWords62c4:base.actorControlWords62c4},q;const out=[];
 hud[i(0x8060)]=0;
 for(let f=0;f<=last;f++){
  q=prepareNativeEndingCeremonyActors({hudWords7788:hud,rngState4640:rng,...pool,difficulty,rank});
  hud=[...q.hudWords7788];hud[i(0x8060)]=f+1;rng=q.rngState4640;
  // Display retires the submitted rows each frame; this test reads submissions only.
  pool={actorWordsF060:q.actorWordsF060,actorControlWords62c4:[...q.actorControlWords62c4]};pool.actorControlWords62c4[2]=0;
  out.push({submitted:q.diagnostic.submitted,script:q.diagnostic.script,row:[0xc,0x10,0x14].map(o=>float(hud[i(0x8190+o)])),type:hud[i(0x8190)],frame:hud[i(0x8198)]});
 }
 return out;
}

test('Normal and Hard top three fly gulls through the original windows from frame 600',()=>{
 const f=frames(0,1,1000),w=NATIVE_ENDING_CEREMONY_DATA.podiumWindows80225d94;
 assert.ok(f.slice(0,600).every(q=>q.submitted===0&&q.script==='podium'));
 assert.equal(f[600].submitted,1);assert.equal(f[600].type,3);
 // Spawned at the window's start point, then one speed step toward its end point.
 const from=w[0].words.slice(0,3).map(float),to=w[0].words.slice(3,6).map(float),d=to.map((v,k)=>v-from[k]),len=Math.hypot(...d),speed=float(w[0].words[6]);
 f[600].row.forEach((v,k)=>assert.ok(Math.abs(v-(from[k]+d[k]/len*speed))<1e-3,String(v)));
 assert.ok(Math.abs(Math.hypot(...f[799].row.map((v,k)=>v-from[k]))-200*speed)<.5,'200 steps of 11 units');
 assert.equal(f[949].submitted,1);assert.equal(f[950].submitted,2,'two gulls overlap from frame 950');
 assert.ok(f.every(q=>q.frame>=0&&q.frame<55),'wing-beat frames stay in the bird cycle');
});

test('Expert second and third use the expert windows; other places and Reverse submit none',()=>{
 const second=frames(2,1,1500),third=frames(2,2,1500);
 assert.equal(second[799].submitted,0);assert.equal(second[800].submitted,1);assert.equal(second[1420].submitted,1);
 assert.equal(third[1420].submitted,0,'third place stops after three windows');
 for(const [difficulty,rank]of [[0,3],[3,0]]){const f=frames(difficulty,rank,700);assert.ok(f.every(q=>q.submitted===0));}
 // The Expert champion's script always submits its eleven rows (unspawned ones are type 0).
 assert.ok(frames(2,0,700).every(q=>q.submitted===11&&q.script==='expertChampion'&&q.type===0));
});

import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const fixture=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-ending-ceremony.json.gz',import.meta.url))));
test('every main21 ceremony script matches original DD6B4 execution frame by frame',()=>{
 assert.equal(fixture.cases.length,7);
 for(const c of fixture.cases){
  let hud=[...fixture.baseHud],rng=c.input.rngState4640;
  for(const [counter,hash,seed,external]of c.frames){
   hud[i(0x8060)]=counter;
   const pool={actorWordsF060:base.actorWordsF060,actorControlWords62c4:[...base.actorControlWords62c4]};pool.actorControlWords62c4[2]=0;
   const q=prepareNativeEndingCeremonyActors({hudWords7788:hud,rngState4640:rng,...pool,difficulty:c.input.difficulty,rank:c.input.rank});
   hud=[...q.hudWords7788];rng=q.rngState4640;
   const bytes=Buffer.alloc(1442*4);hud.forEach((w,k)=>bytes.writeUInt32BE(w>>>0,k*4));
   const where=`difficulty${c.input.difficulty} rank${c.input.rank} frame${counter}`;
   assert.equal(createHash('sha256').update(bytes).digest('hex').slice(0,16),hash,where);assert.equal(rng,seed,where);
   assert.deepEqual(external.map(e=>e[0]),[...(counter===0&&q.diagnostic.script?['800ab92c']:[]),...(q.diagnostic.script?['800ac098']:[])],where);
   const submit=external.find(e=>e[0]==='800ac098');if(submit)assert.deepEqual(submit[1],[0x80228190,q.diagnostic.submitted],where);
  }
 }
});
