import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AQUA,AQUA_LIFT,aquaGrip,waterDrag,waterAt,aquaplaningNow,aquaplaneLift} from '../src/aquaplaning';
import type {Puddle} from '../src/puddle-splashes';
test('a tyre rides up on standing water as it goes faster, the deeper in the puddle the more',()=>{
  assert.equal(aquaGrip(1,AQUA.speed),1,'slow enough to cut through');assert.equal(aquaGrip(0,40),1,'no water, no planing');
  assert.ok(Math.abs(aquaGrip(1,AQUA.full)-(1-AQUA.loss))<1e-9,'deep and fast: little grip left');
  assert.ok(Math.abs(aquaGrip(.5,AQUA.full)-(1-AQUA.loss/2))<1e-9,'half way into the puddle');
  assert.ok(aquaGrip(1,(AQUA.speed+AQUA.full)/2)<1&&aquaGrip(1,(AQUA.speed+AQUA.full)/2)>1-AQUA.loss,'on its way');
  assert.equal(aquaGrip(1,-AQUA.full),aquaGrip(1,AQUA.full),'reversing too');assert.equal(aquaGrip(1,NaN),1);assert.equal(aquaGrip(NaN,30),1);
});
test('the water pushes back on the tyre with the square of speed, up to a limit',()=>{
  assert.equal(waterDrag(0,30),0);assert.ok(Math.abs(waterDrag(1,AQUA.dragSpeed)-AQUA.drag)<1e-9);
  assert.ok(Math.abs(waterDrag(1,AQUA.dragSpeed/2)-AQUA.drag/4)<1e-9,'quarter at half the speed');
  assert.ok(Math.abs(waterDrag(1,100)-AQUA.drag*AQUA.maxDrag)<1e-9,'capped');assert.equal(waterDrag(1,NaN),0);
});
test('a tyre finds the deepest puddle under it; nothing outside them',()=>{
  const puddle=(id:number,x:number,radius:number):Puddle=>({id,x,z:0,level:0,radius,aspect:1,phases:[0,0,0,0]});
  const puddles=[puddle(1,0,2),puddle(2,3.5,2)];
  assert.equal(waterAt(puddles,0,0,0),1,'in the middle');assert.equal(waterAt(puddles,10,0,0),0,'nowhere near');
  assert.ok(waterAt(puddles,1.9,0,0)>0,'where the two meet, the deeper one');assert.equal(waterAt(puddles,0,1,0),0,'too high above the water');
  assert.equal(waterAt([],0,0,0),0);
  assert.ok(aquaplaningNow([AQUA.warn-.01,1,1,1])&&!aquaplaningNow([1,1,AQUA.warn-.2,AQUA.warn-.2]),'the driver is told when a front tyre goes');
});
test('an AI driver aquaplaning lifts off and keeps off the brakes until the front tyres bite again',()=>{
  const flat={throttle:1,steer:.3,brake:.8,handbrake:false},planing=[AQUA.warn-.1,1,1,1],gripping=[1,1,AQUA.warn-.3,AQUA.warn-.3];
  const lifted=aquaplaneLift(flat,planing);assert.ok(lifted.throttle===AQUA_LIFT.throttle&&lifted.brake===AQUA_LIFT.brake&&lifted.steer===.3&&lifted!==flat,'lifts, steering held');
  assert.equal(aquaplaneLift(flat,gripping),flat,'rear tyres alone: carries on');assert.equal(aquaplaneLift({...flat,throttle:.05,brake:0},planing).throttle,.05,'never more than it was');
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('  const steady=car.extendedDamage&&!online?.active?aquaplaneLift(input,car.waterGrip):input;')&&main.includes('return fires.length?avoidFires(car,steady,fires,fx.slicks.clock,car.flameHeat):steady;'),'before steering round fires, offline');
});
test('the car loses grip and feels the water on the tyres in the water, offline, and is told it is aquaplaning',()=>{
  const physics=readFileSync(new URL('../src/vehicle-physics.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(physics.includes('corner.sideGrip*(state.slickGrip?.[i]??1)*(state.waterGrip?.[i]??1)')&&physics.includes('*(state.slickGrip?.[i]??1)*(state.waterGrip?.[i]??1)*(state.tractionScale??1)'),'sideways and along');
  assert.ok(physics.includes('body.applyImpulseAtPoint({x:-v.x/moving*water*dt,y:0,z:-v.z/moving*water*dt},p,true)'),'pushed back at the tyre');
  assert.ok(vehicle.includes('const water=this.extendedDamage&&this.waterAt?this.waterAt(point.x,point.y,point.z):0;this.waterGrip[i]=aquaGrip(water,this.speed);this.waterDrag[i]=waterDrag(water,this.speed);'));
  assert.ok(vehicle.includes('{this.slickGrip[i]=1;this.waterGrip[i]=1;this.waterDrag[i]=0;continue;}'),'off the ground, none');
  assert.ok(main.includes('    if(car.extendedDamage)car.waterAt=(x,y,z)=>aquaplaning?waterAt(activeVenue.puddles,x,y,z):0;'));
  assert.ok(main.includes("aquaplaningNow(cars[0].waterGrip)&&clock-aquaToastAt>AQUA.warnGap){aquaToastAt=clock;toast('AQUAPLANING',1.2);}"));
});
