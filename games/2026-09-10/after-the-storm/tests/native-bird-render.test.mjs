import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../vendor/three.module.js';
import {makeNativeBirdParts,nativeBirdSpeciesForBank,NATIVE_BIRD_SPECIES} from '../native-bird-model.js';
import {makeNativeBirdRenderer} from '../native-bird-render.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const bank=i=>new Uint8Array(readFileSync(new URL('../assets/actor-animations/bank-'+i+'.bin',import.meta.url)));

test('gull and mallard parts follow the original part frames and slice lengths',()=>{
 assert.equal(nativeBirdSpeciesForBank(3),'gull');assert.equal(nativeBirdSpeciesForBank(6),'mallard');assert.equal(nativeBirdSpeciesForBank(2),undefined);
 for(const species of ['gull','mallard']){
  const spec=NATIVE_BIRD_SPECIES[species],p=makeNativeBirdParts(species),box=o=>{const g=p.part(o).geometry;g.computeBoundingBox();return g.boundingBox;};
  assert.ok(Math.abs(box(8).min.x-spec.body[0])<1&&Math.abs(box(8).max.x-spec.body[1])<1,species+' body runs tail to bill along +X');
  spec.wing.forEach((length,i)=>{const b=box(12+i*4);assert.ok(b.min.x<0&&Math.abs(b.max.x-length)<=3,species+' slice '+i);assert.ok(Math.abs(b.max.y-spec.chord[1])<1,species+' leading edge');});
  assert.ok(Math.abs(box(24).max.z-spec.sit[1])<1,species+' sitting body faces +Z');
  assert.throws(()=>p.part(28),/Unknown bird part/);p.dispose();assert.throws(()=>p.part(8),/disposed/);
 }
});

test('the bird renderer draws live Sunny Beach gulls and validates their bank before changing draws',()=>{
 let last=null;const s=createRace({mode:'time',physics:'native',course:getCourse('greyhaven',0),difficulty:0,
  nativeCourseActors:{assets:{3:bank(3),2:bank(2)},onDisplay:(p,r)=>{if(p.draws.some(d=>d.resourceIndex===0))last={p,r};}}});
 for(let i=0;i<300&&!last;i++)stepRace(s,{throttle:1,steer:.25},1/30);
 assert.ok(last,'a gull reached the display');
 const root=new T.Group(),view=makeNativeBirdRenderer(root),gullDraws=last.p.draws.filter(d=>d.resourceIndex===0);
 assert.equal(view.update(last.p,last.r).parts,gullDraws.length);assert.deepEqual(view.snapshot().species,['gull']);
 assert.throws(()=>view.update(last.p,last.r.map((w,i)=>i===0x44/4?4:w)),/five loaded geometry/);
 view.dispose();assert.throws(()=>view.update(last.p,last.r),/disposed/);assert.equal(root.children.length,0);
});

test('Glacier Coast king penguins draw in their original part frames through the rigid renderer',async()=>{
 const {makeNativePenguinParts}=await import('../native-penguin-model.js'),{createNativeRacePilot}=await import('../native-race-pilot.js');
 const p=makeNativePenguinParts(),bounds={8:[[-19,132],[-59,26]],12:[[-120,181],[-71,54]],20:[[10,20],[-45,15]]};
 for(const [o,[[x0,x1],[y0,y1]]]of Object.entries(bounds)){const g=p.part(Number(o)).geometry;g.computeBoundingBox();const b=g.boundingBox;
  assert.ok(b.min.x>=x0-4&&b.max.x<=x1+4&&b.min.y>=y0-4&&b.max.y<=y1+4,'penguin part '+o);}
 p.dispose();
 let live=null;const s=createRace({mode:'time',physics:'native',course:getCourse('glacier',0),difficulty:0,nativeCourseActors:{assets:{8:bank(8)},onDisplay:(q,r)=>{if(!live&&q.draws.length)live={q,r};}}});
 const r=s.racers[0],pilot=createNativeRacePilot({course:s.course});for(let i=0;i<120*30&&!live;i++)stepRace(s,()=>pilot.input(s,r),1/30);
 assert.ok(live,'a penguin reached the display');const root=new T.Group(),view=makeNativeBirdRenderer(root);
 assert.equal(view.update(live.q,live.r).parts,live.q.draws.length);assert.deepEqual(view.snapshot().species,['penguin']);
 assert.throws(()=>view.update(live.q,live.r.map((w,i)=>i===0x44/4?5:w)),/four loaded geometry/);view.dispose();
});
