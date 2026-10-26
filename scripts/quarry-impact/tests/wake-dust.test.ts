import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {WAKE,startingWake,wakeDustStep,rearOf} from '../src/wake-dust';
import {VehicleSurface} from '../src/vehicle-surface';
const run=(level:number,seconds:number,plume:number,rain:number)=>{for(let i=0;i<seconds*60;i++)level=wakeDustStep(level,1/60,plume,rain);return level;};
test('every car starts a little dusty, each its own amount',()=>{
  const levels=Array.from({length:10},(_,id)=>startingWake(id));
  assert.ok(levels.every(l=>l>=WAKE.start[0]&&l<=WAKE.start[1]),'in range');assert.ok(new Set(levels.map(l=>l.toFixed(4))).size===10,'all different');
  assert.equal(startingWake(NaN),startingWake(0));
});
test('a dust plume behind the car coats its tail toward the most it holds; without one it stays as it is',()=>{
  assert.equal(run(.2,30,0,0),.2,'no plume, no change');
  const ten=run(0,10,1,0),minute=run(0,60,1,0);
  assert.ok(ten>.3&&ten<minute&&minute<=WAKE.max&&minute>WAKE.max*.95,'builds over seconds, toward the most');
  assert.ok(run(0,10,.4,0)<ten,'a thinner plume, less dust');assert.ok(run(1,1,1,0)<=WAKE.max,'never past the most');
});
test('the rain rinses it off, harder in a downpour',()=>{
  const light=run(.6,20,0,.3),heavy=run(.6,20,0,1);
  assert.ok(heavy<light&&light<.6,'rinsed');assert.ok(Math.abs(heavy-.6*Math.exp(-20*WAKE.rinse))<1e-6,'at the rinse rate');
  assert.equal(wakeDustStep(.4,NaN,1,1),.4,'no time, no change');assert.equal(wakeDustStep(NaN,1/60,NaN,NaN),0);
  assert.ok(Math.abs(wakeDustStep(0,100,1,0)-wakeDustStep(0,1,1,0))<1e-12,'a long frame counts as a second at most');
});
test('the back of the bodywork is found in the model frame, under the draw batches too',()=>{
  const model=new T.Group(),body=new T.Mesh(new T.BoxGeometry(1.8,1,4),new T.MeshBasicMaterial());body.position.set(0,.6,.3);body.layers.mask=0;model.add(body);
  const car=new T.Group();car.add(model);car.position.set(4,0,9);car.rotation.y=1.2;model.scale.setScalar(1.2);
  assert.ok(Math.abs(rearOf(model,[body])!-(-1.7))<1e-6,'its least z in its own frame');assert.equal(rearOf(model,[]),null,'no bodywork, nothing');
});
test('a car\'s surface carries the dust only once it is placed, and draws it on paint and glass',()=>{
  const surface=new VehicleSurface(new T.Group(),3);
  surface.wakeLevel=.5;assert.equal(surface.wakeLevel,0,'not placed: none');assert.equal(surface.wakePlaced,false);
  surface.placeWake(-2.1,.12);assert.ok(surface.wakePlaced&&surface.wakeLevel===.12&&surface.wake.value.x===-2.1&&surface.wake.value.y===WAKE.reach,'placed at the back');
  surface.wakeLevel=.6;assert.equal(surface.wakeLevel,.6);surface.wakeLevel=NaN;assert.equal(surface.wakeLevel,0);
  surface.reset();assert.equal(surface.wakePlaced,true,'a mended car keeps its place');
  const source=readFileSync(new URL('../src/vehicle-surface.ts',import.meta.url),'utf8');
  assert.ok(source.includes('s.uniforms.carWake=this.wake;')&&source.includes("diffuseColor.a=clamp(diffuseColor.a+wakeDust*.6,0.,.97);")&&source.includes("'-persistent-wet-silt-wake-v3-'"),'glass hazes over, programs rebuilt');
});
test('main dusts offline cars in play from their own dust plume and rinses them in the rain',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage){const rear=rearOf(car.model,car.panels);if(rear!==null)car.surfaceFinish.placeWake(rear,startingWake(car.id));}'),'offline cars');
  assert.ok(main.includes("c.surfaceFinish.wakeLevel=wakeDustStep(c.surfaceFinish.wakeLevel,dt,dustRate(c.speed,c.surface,eventLighting==='rain')/DUST.rate,eventLighting==='rain'?shower:0);"),'the dust trail drives it, the showers rinse it');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||!c.surfaceFinish.wakePlaced)continue;"),'in play only');
});
