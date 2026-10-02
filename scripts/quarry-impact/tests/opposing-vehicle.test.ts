import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {DEFINITIONS,type CarKind} from '../src/rules';
import {DrivingBrain} from '../src/driving-brain';
import {drivingObstacleClearance} from '../src/driving-probe';
import {CombatScoreboard,checkRoute,lapProgress} from '../src/event-rules';
import {ImpactAdjudicator} from '../src/impact-adjudication';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';

const dt=1/60;
let initialized:Promise<void>|undefined;
function init(){return initialized??=(async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;
 GLTFLoader.prototype.loadAsync=async url=>{
  const match=/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url));
  assert.ok(match,`Unexpected asset ${url}`);return loadCarWithoutImages(match[1]);
 };
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
})();}

/** Execute the current production AI and step, rather than a copied contact or
 * control loop. Only the road, rendering/audio and outer event UI are fixtures. */
function mainStep(context:Record<string,unknown>){
 const source=ts.createSourceFile('main.ts',readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),ts.ScriptTarget.ES2022,true,ts.ScriptKind.TS);
 const declarations=['ai','step'].map(name=>{
  const fn=source.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text===name);
  assert.ok(fn,`Missing production ${name}`);return fn.getText(source);
 });
 const code=ts.transpileModule(`${declarations.join('\n')}\nglobalThis.tick=step;`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 runInNewContext(code,context);return context.tick as (dt:number)=>void;
}

async function fixture(kinds:readonly [CarKind,CarKind],gap:number,speed:number){
 await init();const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true),scene=new T.Scene();world.timestep=dt;
 world.createCollider(R.ColliderDesc.cuboid(120,.5,120).setTranslation(0,-.5,0));
 const fx={emit(){},mark(){},detach(mesh:T.Mesh){mesh.visible=false;},update(){}} as any;
 const surface={height:()=>0,surface:()=> 'asphalt' as const};
 // IDs 1 and 4 have opposite parity but the same ordinary centre lane. No
 // driver memory is overwritten to manufacture a passing manoeuvre.
 const cars=kinds.map((kind,index)=>new Vehicle([1,4][index],kind,0xffffff,scene,world,fx,stockSetup(kind),surface));
 cars.forEach((car,index)=>car.place(0,(index-.5)*gap,index*Math.PI));
 for(let tick=0;tick<90;tick++){cars.forEach(c=>c.preStep(dt));world.step();cars.forEach(c=>c.postStep(dt,0));}
 assert.ok(cars.every(c=>c.groundedWheels.every(Boolean)),'Both actual suspension systems settle onto the road');
 const settled=cars.map(c=>c.current.clone()),stats={forceEvents:0,maximumForce:0,feedback:0,recoveries:0,hitEvents:0};
 for(const car of cars)car.onVisualEvent=event=>{if(event.kind==='hit')stats.hitEvents++;};
 const drain=events.drainContactForceEvents.bind(events);
 events.drainContactForceEvents=callback=>drain(event=>{
  const contact=vehicleContact(world,cars,event.collider1(),event.collider2());
  if(contact.a&&contact.b){stats.forceEvents++;stats.maximumForce=Math.max(stats.maximumForce,event.totalForceMagnitude());}
  callback(event);
 });
 cars.forEach((car,index)=>{
  const z=(index?-1:1)*speed;car.body.setLinvel({x:0,y:0,z},true);
  car.velocity.set(0,0,z);car.speed=speed;
 });
 // A deliberately straight, empty road isolates opposing steering from course
 // navigation. The production 24-checkpoint indexing remains in use.
 const routes=[1,-1].map(direction=>Array.from({length:24},(_,i)=>({x:0,z:direction*(i===0?-100:100*i)})));
 const drivers=new DrivingBrain(),venue={course:{...surface,distance:(x:number)=>Math.abs(x),outside:()=>false}};
 const context:any={T,R,activeTimeTrial:null,cars,physics:world,events,fx,drivers,drivingObstacleClearance,vehicleContact,vehicleContactManifold,checkRoute,lapProgress,
  activeVenue:venue,quarryVenue:venue,raceRoute:(id:number)=>routes[id===1?0:1],raceLaps:()=>2,scoreDerby:()=>false,
  state:'playing',elapsed:0,countdown:0,online:null,demo:true,autopilot:false,testInput:null,mode:'race',telemetry:null,waypointRace:null,
  activeClubRound:null,clubPlayerStopped:false,clubRetired:false,activeChallenge:undefined,impactAdjudicator:new ImpactAdjudicator(),combat:new CombatScoreboard(),collisions:0,
  impactAudioSeverity:()=>0,sound:{impact(){stats.feedback++;}},toast(){},recover(){stats.recoveries++;},finish(){assert.fail('A short passing fixture cannot finish an event');}};
 const tick=mainStep(context);
 return {cars,world,drivers,stats,settled,tick,dispose(){cars.forEach(c=>c.dispose());events.free();world.free();}};
}

const pairs=[['tern','marten'],['marten','buggy'],['buggy','tern']] as const;
test('actual Tern, Marten and Ravine steer into separate opposing corridors and pass without a recovery',async t=>{
 for(const pair of pairs){
  const h=await fixture(pair,32,16);
  try{
   let positiveWheelSteer=false,crossingWidth=0,passed=false;
   for(let tick=0;tick<240;tick++){
    h.tick(dt);
    if(tick<30&&h.cars.every(c=>(c.controller.wheelSteering(0)??0)>.005))positiveWheelSteer=true;
    const [a,b]=h.cars;
    if(!passed&&a.current.z>=b.current.z){passed=true;crossingWidth=Math.abs(a.current.x-b.current.x);}
   }
   const [a,b]=h.cars,label=pair.join('/');
   assert.ok(positiveWheelSteer,`${label}: real front wheel steering follows reciprocal controls`);
   assert.ok(passed&&a.current.z>b.current.z+8,`${label}: both bodies actually pass and keep moving`);
   assert.ok(crossingWidth>DEFINITIONS[a.kind].halfWidth+DEFINITIONS[b.kind].halfWidth,`${label}: authored body widths clear at the crossing (${crossingWidth})`);
   assert.ok(a.current.x>h.settled[0].x&&b.current.x<h.settled[1].x,`${label}: physical lateral motion is reciprocal`);
   assert.equal(h.stats.forceEvents,0,`${label}: no chassis contact was hidden by the control change`);
   assert.ok(h.cars.every(c=>c.health===100&&c.penalty===0&&c.rollTime===0),`${label}: no damage, reset or rollover is needed to pass`);
   assert.equal(h.stats.recoveries,0);assert.ok(h.cars.every(c=>h.drivers.memory.get(c.id)?.pass===undefined),'Passing commitments release after separation');
   t.diagnostic(`${label}: crossing centre separation ${crossingWidth.toFixed(3)} m; ${h.stats.forceEvents} body-force events; both cars intact`);
  }finally{h.dispose();}
 }
});

test('an unavoidable opposing impact still generates real contact forces, structural dents and mechanical damage',async t=>{
 for(const pair of pairs){
  const gap=DEFINITIONS[pair[0]].halfLength+DEFINITIONS[pair[1]].halfLength+.15,h=await fixture(pair,gap,24);
  try{
   const pristine=h.cars.map(car=>new Map(car.panels.map(panel=>[panel,Float32Array.from(panel.geometry.attributes.position.array)])));
   for(let tick=0;tick<60;tick++)h.tick(dt);
   const label=pair.join('/');
   assert.ok(h.stats.forceEvents>0&&h.stats.maximumForce>1500/dt,`${label}: actual Rapier body contacts carry damaging impulse`);
   assert.ok(h.stats.feedback>0&&h.stats.hitEvents>=2,`${label}: production impact adjudication reaches both real Vehicle.hit paths`);
   assert.ok(h.cars.every(c=>c.health<100&&c.impactSerial>0),`${label}: structural condition still falls on both bodies`);
   assert.ok(h.cars.every(c=>c.panels.some(p=>p.userData.damage>0)),`${label}: collision coordinates deform actual prepared bodywork`);
   assert.ok(h.cars.every((car,index)=>car.panels.some(panel=>pristine[index].get(panel)!.some((value,i)=>value!==panel.geometry.attributes.position.array[i]))),`${label}: actual bodywork position buffers change, not only damage counters`);
   assert.ok(h.cars.some(c=>(c.engineDamage??0)>0||Array.from(c.wreckParts.wheelDamage).some(d=>d>0)),`${label}: component localization still damages an engine or wheel`);
   assert.equal(h.stats.recoveries,0);assert.ok(h.cars.every(c=>c.penalty===0),'No recovery fabricates contact or damage');
   t.diagnostic(`${label}: ${h.stats.forceEvents} body-force events, peak ${(h.stats.maximumForce/1000).toFixed(1)} kN; health ${h.cars.map(c=>c.health.toFixed(2)).join('/')}; engine damage ${h.cars.map(c=>(c.engineDamage??0).toFixed(3)).join('/')}; maximum wheel damage ${h.cars.map(c=>Math.max(...c.wreckParts.wheelDamage).toFixed(3)).join('/')}`);
  }finally{h.dispose();}
 }
});
