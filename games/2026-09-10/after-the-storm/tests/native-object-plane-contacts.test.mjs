import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createNativeRaceState,prepareNativeRaceObjectPlaneContacts,prepareNativeRaceObjectLoading,prepareNativeRaceObjectInitialization,prepareNativeRaceObjectUpdate} from '../native-race-state.js';
import {createNativeGenericObjectWorld} from '../native-generic-object-world.js';
import {createNativeImpactState,recordNativeImpact} from '../native-impact-state.js';
import {createRaceWater} from '../race-water.js';
import {nativeSineTableWords} from '../native-math-tables.js';
import {createNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from '../native-race-world.js';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/native-static-contacts.json',import.meta.url))),view=new DataView(new ArrayBuffer(4));
const bits=v=>{view.setFloat32(0,v);return view.getUint32(0);},axes=['x','y','z'];
const pack=body=>({pointWords:body.pointsNative.map(p=>['position','velocity'].flatMap(k=>axes.map(a=>bits(p[k][a])))),
 impactWords:[bits(body.boxImpactNative),bits(body.floorImpactNative)],normalWords:axes.map(k=>bits(body.normalNative[k])),markedBox:Number(body.markedBox)});

test('canonical moving-plane contacts match every existing original7F700 fixture without changing geometry',()=>{
 const cases=fixture.cases.filter(q=>q.phase==='boxes');assert.ok(cases.length>100);
 for(const q of cases){
  const geometry=fixture.geometries[q.geometry],raw=Array.from({length:512},(_,i)=>0x34560000+i);
  geometry.rows.forEach((row,i)=>raw.splice(i*16,16,...row.map(bits)));
  const before=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),collisionPlaneWordsFd78:raw,
   scene:{collisionPlaneCount0578:geometry.count0578,activity624:0}});
  const result=prepareNativeRaceObjectPlaneContacts(before,q.input);
  assert.deepEqual(pack(result.body),q.expected);assert.deepEqual(result.state,before);assert.deepEqual(before.collisionPlaneWordsFd78,raw);
 }
});

test('an initialized gate rises through6E0F4 and the physical box bridge immediately uses its new collision origin',()=>{
 const raceWords1f94=Array(1693).fill(0);raceWords1f94[(0x1fc8-0x1f94)/4]=1;
 let current=createNativeRaceState({raceWords1f94,hudWords7788:Array(1442).fill(0),objectWordsC940:Array(3136).fill(0),collisionPlaneWordsFd78:Array(512).fill(0),packedObjectMatrixWords0cd0:Array(1024).fill(0),
  scene:{courseIndex:3,players:1,mode620:0,difficulty:2,objectCountFa40:0,ringCountB134:0,rampFilterOverride8254:0,forceStunt824c:0,reverseDab68:0,alternate8250:0,activity624:-1}});
 const resources={sineTableWords4350:nativeSineTableWords(),planeTemplatesByAddress:{[0x800d7630]:[0,0,0,1,0,0,0,1,0,0,0,1,40,4,40,1].map(bits)}};
 current=prepareNativeRaceObjectLoading(current,{rampRows:[],ringRows:[],genericRows:[[0,0,0,1,-180]]}).state;
 current=prepareNativeRaceObjectInitialization(current,resources).state;
 const water=createRaceWater({crafts:[{x:0,z:0,sourceForwardXZ:[0,1]}],baseAmplitudeNative:20}),scale=water.scale;
 const world=createNativeGenericObjectWorld({water,readRaceState:()=>current,commitRaceState:s=>current=s}),impacts=createNativeImpactState();
 const makeHull=()=>({scale,points:Array.from({length:12},(_,i)=>({position:{x:(i===0?-10:20000)*scale,y:(i===0?-2:20000)*scale,z:(i===0?-10:20000)*scale},velocity:{x:0,y:-3*scale/.01,z:0}}))});
 const context={logicalFrame:0,readBoxContactState:()=>({...impacts,normalNative:impacts.normal}),recordImpact:hit=>recordNativeImpact(impacts,hit)};
 const initial=current,closed=makeHull(),report=world.boxContact(closed,context);
 assert.equal(world.diagnostics(closed).hull.boxContacts,1);assert.equal(report.markedBox,true);assert.equal(report.boxImpactNative,Math.fround(Math.fround(.4)*3));
 assert.deepEqual(current,initial,'contacts do not change gate/plane owners');
 current=prepareNativeRaceObjectUpdate(current,resources).state;
 assert.equal(current.collisionPlaneWordsFd78[1],bits(6));assert.deepEqual(current.collisionPlaneWordsFd78.slice(3),initial.collisionPlaneWordsFd78.slice(3));
 const raised=makeHull(),before=structuredClone(raised);world.boxContact(raised,context);
 assert.equal(world.diagnostics(raised).hull.boxContacts,0);assert.deepEqual(raised,before);
 assert.deepEqual(current.packedObjectMatrixWords0cd0,initial.packedObjectMatrixWords0cd0);
 // A fresh initialized gate with a larger prepared template exercises the
 // real adapter's box-impact callback and source frame order for two riders.
 const wide={...resources,planeTemplatesByAddress:{[0x800d7630]:[0,0,0,1,0,0,0,1,0,0,0,1,200,32,200,1].map(bits)}};
 current=prepareNativeRaceObjectInitialization(initial,wide).state;
 const adapters=Array.from({length:2},()=>createNativeRaceAdapter({position:{x:-2.5,y:-.15,z:-2.5},contacts:{boxes:world.boxContact}}));
 const physical=createNativeRaceWorld({adapters,water,humanIndices:[0],craftContacts:false,afterFrame:(w,c)=>{world.afterFrame(w,c);world.updateTransforms(w,c,wide);}});
 stepNativeRaceWorld(physical,.1,[{},{}]);
 assert.ok(adapters.every(a=>world.diagnostics(a.hull).hull.boxContacts>0));
 assert.ok(adapters.every(a=>a.lastFrame.contacts.boxImpactNative===a.impacts.boxImpactNative));
 assert.equal(current.collisionPlaneWordsFd78[1],bits(12));assert.equal(world.diagnostics().transformUpdates,2);
});

test('plane contacts reject duplicate owners and invalid later rows without changing body or canonical state',()=>{
 const q=fixture.cases.find(q=>q.phase==='boxes'),input=structuredClone(q.input),raw=Array(512).fill(0);
 raw[16]=0x7fc00000;
 const state=createNativeRaceState({raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),collisionPlaneWordsFd78:raw,scene:{collisionPlaneCount0578:2}});
 assert.throws(()=>prepareNativeRaceObjectPlaneContacts(state,input),/Invalid/);
 assert.deepEqual(input,q.input);assert.deepEqual(state.collisionPlaneWordsFd78,raw);
 assert.throws(()=>prepareNativeRaceObjectPlaneContacts(state,{...input,boxes:{count0578:0}}),/overlaps/);
});
