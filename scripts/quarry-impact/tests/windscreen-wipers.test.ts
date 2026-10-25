import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {WIPERS,WIPE_RATE,wipeRate,WiperRig,strokeAngle,wiperArms} from '../src/windscreen-wipers';
const H=.113;
// A Linnet-like pair of bar wipers on a raked screen, a tailgate wiper, and meshes that are not arms.
const car=()=>{
  const model=new T.Group(),bar=()=>new T.CylinderGeometry(.006,.006,H*2,6),m=new T.MeshBasicMaterial();
  for(const [name,x,qz] of [['panel_TestWiper-1',-.2,-.522],['panel_TestWiper1',.2,.522]] as const){const w=new T.Mesh(bar(),m);w.name=name;w.position.set(x,.93,.285);w.quaternion.set(-.078,0,qz,.849).normalize();model.add(w);}
  const tail=new T.Mesh(bar(),m);tail.name='panel_TailgateTestWiper';tail.position.set(.147,1.131,-1.586);tail.quaternion.set(.306,0,-.514,.801).normalize();model.add(tail);
  for(const name of ['panel_Door','BodyWindshieldWipers']){const o=new T.Mesh(bar(),m);o.name=name;model.add(o);}
  return model;
};
const ends=(mesh:T.Mesh)=>{mesh.updateMatrixWorld(true);const a=mesh.localToWorld(new T.Vector3(0,-H,0)),b=mesh.localToWorld(new T.Vector3(0,H,0));return a.y<=b.y?[a,b]:[b,a];};
test('a stroke runs up from parked and back once per cycle, easing at both ends',()=>{
  assert.equal(strokeAngle(0),0);assert.ok(Math.abs(strokeAngle(.5)-WIPERS.sweep)<1e-12);assert.ok(Math.abs(strokeAngle(1))<1e-12);assert.ok(Math.abs(strokeAngle(2.25)-WIPERS.sweep/2)<1e-12);assert.equal(strokeAngle(NaN),0);
});
test('only the separate wiper meshes are arms; each pivots at its lower end and sweeps about the glass normal',()=>{
  const arms=wiperArms(car());assert.equal(arms.length,3);assert.ok(arms.map(a=>a.mesh.name).join()==='panel_TestWiper-1,panel_TestWiper1,panel_TailgateTestWiper');
  let ok=true;for(const a of arms){const [low,high]=ends(a.mesh);ok&&=low.distanceTo(a.pivot)<1e-6&&a.axis.y>0&&Math.abs(high.clone().sub(low).normalize().dot(a.axis))<1e-6;}
  assert.ok(ok,'pivot at the low end, normal up off the glass and across the arm');
  assert.deepEqual(arms.map(a=>a.rear),[false,false,true]);assert.deepEqual(arms.slice(0,2).map(a=>a.sign),[-arms[1].sign,arms[1].sign],'mirrored arms sweep mirrored');
});
test('in the rain the arms sweep up across the glass and back; dry, they finish the stroke and park; dead electrics stop them',()=>{
  const arms=wiperArms(car()),rig=new WiperRig(arms,3),rest=arms.map(a=>ends(a.mesh)[1].clone());
  for(let i=0;i<Math.round(WIPERS.period*30);i++)rig.update(1/60,true,true,0,0);
  assert.ok(Math.abs(rig.phase-.5)<1e-6&&rig.sweeping);
  let up=true;arms.forEach((a,i)=>{const [low,high]=ends(a.mesh);up&&=high.y>rest[i].y+.03&&Math.abs(high.clone().sub(low).dot(a.axis))<1e-6&&Math.abs(low.distanceTo(high)-2*H)<1e-6&&low.distanceTo(a.pivot)<1e-6;});
  assert.ok(up,'tips raised, still in the glass, arms whole and on their pivots');
  const held=rig.phase;rig.update(.5,true,false,0,0);assert.equal(rig.phase,held,'no power, no movement');
  for(let i=0;i<120;i++)rig.update(1/60,false,true,0,0);assert.equal(rig.phase,1,'parks at the end of the stroke');assert.equal(rig.sweeping,false);
  let parked=true;arms.forEach((a,i)=>{parked&&=ends(a.mesh)[1].distanceTo(rest[i])<1e-6;});assert.ok(parked,'back on the parked line');
  rig.update(1,false,true,0,0);assert.equal(rig.phase,1,'stays parked while dry');
});
test('a big front hit bends the front arms up off the glass, jammed; a tailgate wiper bends only from behind',()=>{
  const arms=wiperArms(car()),rig=new WiperRig(arms,5);
  rig.update(1/60,true,true,WIPERS.bend,0);assert.deepEqual(arms.map(a=>a.bent>0),[true,false,false],'the first arm goes first');
  rig.update(1/60,true,true,1,0);assert.deepEqual(arms.map(a=>a.bent>0),[true,true,false]);assert.equal(rig.bentArms,2);
  let lifted=true;for(const a of arms.slice(0,2)){const [low,high]=ends(a.mesh);lifted&&=a.bent>=WIPERS.lift*.55&&a.bent<=WIPERS.lift&&high.clone().sub(low).dot(a.axis)>2*H*Math.sin(a.bent)*.99;}
  assert.ok(lifted,'tips lifted off the glass by the bend');
  const jammed=arms[0].angle;for(let i=0;i<40;i++)rig.update(1/60,true,true,1,0);assert.ok(arms[0].angle===jammed&&arms[2].angle>0,'bent arms jam, the tailgate wiper keeps going');
  rig.update(1/60,true,true,1,1);assert.ok(arms[2].bent>0);
  const loose=wiperArms(car()),torn=new WiperRig(loose,1),scene=new T.Group();scene.add(loose[0].mesh);const at=loose[0].mesh.position.clone();for(let i=0;i<30;i++)torn.update(1/60,true,true,0,0);
  assert.ok(loose[0].mesh.position.equals(at)&&loose[1].angle>0,'a torn-off arm is left alone');
  const none=new WiperRig([],0);none.update(1,true,true,1,1);assert.equal(none.phase,0);
});
test('main runs the rigs in the rain from the battery and the structure, offline cars only',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("if(state==='countdown'||state==='playing'||state==='wrecked'){const wet=eventLighting==='rain';for(const c of cars){if(!c.extendedDamage)continue;let rig=wiperRigs.get(c);if(!rig){rig=new WiperRig(wiperArms(c.model),c.id);wiperRigs.set(c,rig);}"));
  assert.ok(main.includes('rig.update(dt,wet,c.health>0&&!c.electricalCut&&!c.batteryOut,c.structuralDamage?.[0]??0,c.structuralDamage?.[1]??0,shower);'));
});
test('the wipers keep time with the rain: resting between strokes in a light shower, fast in a downpour',()=>{
  assert.deepEqual(wipeRate(1),{speed:WIPE_RATE.fastSpeed,pause:0});assert.deepEqual(wipeRate(.65),{speed:1,pause:0});
  assert.ok(wipeRate(.2).pause>wipeRate(.45).pause&&wipeRate(.45).pause>0&&wipeRate(.2).speed===1,'the lighter, the longer the rest');assert.deepEqual(wipeRate(NaN),wipeRate(1));
  const sweep=(level:number,seconds:number)=>{const rig=new WiperRig([],0);let strokes=0,last=0;
    const armed=new WiperRig([{mesh:new T.Mesh(),parent:null,position:new T.Vector3(),rest:new T.Quaternion(),pivot:new T.Vector3(),axis:new T.Vector3(0,0,1),lean:new T.Vector3(),sign:1,tilt:0,rear:false,angle:0,bent:0}],0);
    for(let i=0;i<seconds*60;i++){armed.update(1/60,true,true,0,0,level);if(Math.floor(armed.phase)>last){strokes++;last=Math.floor(armed.phase);}}void rig;return {strokes,rig:armed};};
  const heavy=sweep(1,10),normal=sweep(.65,10),light=sweep(.25,10);
  assert.ok(heavy.strokes>normal.strokes&&normal.strokes>light.strokes,`${heavy.strokes} > ${normal.strokes} > ${light.strokes}`);
  assert.ok(Math.abs(normal.strokes-10/WIPERS.period)<=1,'the normal rate');
  const resting=sweep(.25,WIPERS.period+.1).rig;assert.ok(resting.rest>0&&resting.phase%1===0&&!resting.moving,'parked, resting, between strokes');
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');assert.ok(main.includes(',c.structuralDamage?.[1]??0,shower);'),'driven by the shower');
});
