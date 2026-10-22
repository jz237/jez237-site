import test from 'node:test';
import assert from 'node:assert/strict';
import {SHED,assemblyMass,glassMass,shedMassProperties} from '../src/shed-weight';
import {wreckReport} from '../src/wreck-report';
const base={mass:1200,com:{x:0,y:-.06,z:0},inertia:{x:1800,y:2000,z:600}};
test('every wreck assembly has a sensible weight; unknown names weigh nothing',()=>{
 for(const n of ['door-left','door-rear-right','hood','engine-lid','tailgate','drop-tailgate','hatch','cargo-left','front-bumper','rear-bumper','mirror-right'])assert.ok(assemblyMass(n)>0&&assemblyMass(n)<=30,n);
 assert.ok(assemblyMass('door-left')>assemblyMass('front-bumper')&&assemblyMass('front-bumper')>assemblyMass('mirror-left'));
 assert.equal(assemblyMass('spoiler'),0);
});
test('a windscreen weighs about a dozen kilos per square metre whichever way the pane faces',()=>{
 assert.ok(Math.abs(glassMass({x:1.4,y:.8,z:.3})-1.4*.8*SHED.glassPerM2)<1e-9);
 assert.equal(glassMass({x:.3,y:1.4,z:.8}),glassMass({x:1.4,y:.8,z:.3}));
 assert.equal(glassMass({x:NaN,y:1,z:1}),0);
});
test('nothing shed leaves the body exactly as built',()=>{
 const m=shedMassProperties(base,[]);assert.equal(m.kg,0);assert.equal(m.mass,1200);assert.deepEqual(m.com,{x:0,y:-.06,z:0});assert.deepEqual(m.inertia,base.inertia);
});
test('losing the bonnet and front bumper lightens the car and moves its weight rearward; a left door moves it right',()=>{
 const front=shedMassProperties(base,[{kg:assemblyMass('hood'),x:0,y:.4,z:1.6},{kg:assemblyMass('front-bumper'),x:0,y:-.1,z:2.1}]);
 assert.equal(front.kg,25);assert.equal(front.mass,1175);assert.ok(front.com.z<-.03,`rearward (${front.com.z})`);assert.ok(front.inertia.y<base.inertia.y);
 const door=shedMassProperties(base,[{kg:assemblyMass('door-left'),x:-.85,y:.2,z:.3}]);
 assert.ok(door.com.x>0,'balance moves toward the side that kept its door');
});
test('a stripped wreck is capped: the shell, engine and axles never go',()=>{
 const parts=Array.from({length:40},(_,i)=>({kg:24,x:i%2?.8:-.8,y:0,z:0}));
 const m=shedMassProperties(base,parts);assert.ok(Math.abs(m.kg-base.mass*SHED.cap)<1e-9);assert.ok(Math.abs(m.mass-base.mass*(1-SHED.cap))<1e-9);
 assert.ok([m.com.x,m.com.y,m.com.z,m.inertia.x].every(Number.isFinite));
 const bad=shedMassProperties(base,[{kg:NaN,x:0,y:0,z:0},{kg:10,x:NaN,y:0,z:0}]);assert.equal(bad.kg,0);
});
test('the wreck report names how much weight the car shed, only once it is worth mentioning',()=>{
 assert.match(wreckReport({wheelsLost:1,partsGone:4,shedKg:96.4,health:40}),/shed 96 kg/);
 assert.doesNotMatch(wreckReport({wheelsLost:0,partsGone:1,shedKg:1.5,health:80}),/shed/);
 assert.doesNotMatch(wreckReport({wheelsLost:0,partsGone:0,health:80}),/shed/);
});
