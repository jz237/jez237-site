import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {ROOST,roostRate,roostSpeed,GravelRoost} from '../src/gravel-roost';
const steps=(roost:GravelRoost,seconds:number)=>{for(let i=0;i<Math.round(seconds*60);i++)roost.step(1/60);};
test('only real wheelspin on loose ground throws stones, more the harder it spins, none on asphalt',()=>{
  assert.equal(roostRate(ROOST.spin,'gravel'),0,'at the threshold');assert.equal(roostRate(-8,'gravel'),0,'a locked wheel throws none');
  assert.equal(roostRate(20,'asphalt'),0,'none on asphalt');assert.equal(roostRate(NaN,'gravel'),0);
  assert.ok(roostRate(4,'gravel')>0&&roostRate(4,'gravel')<roostRate(8,'gravel'),'more with more spin');
  assert.equal(roostRate(ROOST.full,'mud'),ROOST.rate);assert.equal(roostRate(40,'gravel'),ROOST.rate,'capped');
  assert.ok(roostSpeed(10)>roostSpeed(4)&&roostSpeed(-3)===0&&roostSpeed(1e9)===roostSpeed(ROOST.full*2),'flung faster with more spin, within reason');
});
test('a stone flies back behind the tyre, falls, skips along the ground and lies there, then sinks away',()=>{
  const scene=new T.Scene(),roost=new GravelRoost(scene,()=>0),back=new T.Vector3(0,0,-1);let r=0;const random=()=>(r=(r*9301+49297)%233280)/233280;
  assert.ok(scene.children.includes(roost.mesh),'in the scene');
  roost.throw(new T.Vector3(0,0,0),back,10,'gravel',random);assert.equal(roost.thrown,1);assert.equal(roost.flying,1);
  let peak=0;for(let i=0;i<30;i++){roost.step(1/60);peak=Math.max(peak,roost.stones[0].p.y);}
  assert.ok(peak>.3,'it rises off the tread');
  const s=roost.stones[0];for(let i=0;i<Math.round((ROOST.life-ROOST.sink)*60)-30&&!s.stuck;i++)roost.step(1/60);
  assert.ok(s.p.z<-1&&Math.abs(s.p.x)<Math.abs(s.p.z),'it went back behind the car');
  assert.ok(s.stuck&&Math.abs(s.p.y-s.size*.5)<1e-6,'it lies on the ground');assert.equal(roost.flying,0);
  steps(roost,ROOST.life);assert.ok(roost.mesh.count===0||roost.stones.every(x=>x.age>=ROOST.life),'spent');
});
test('mud clods stick where they land; gravel skips on; the ground under an arena floor is followed',()=>{
  const roost=new GravelRoost(new T.Scene(),(x)=>x*.1),back=new T.Vector3(1,0,0),half=()=>.5;
  roost.throw(new T.Vector3(0,2,0),back,10,'mud',half);roost.throw(new T.Vector3(0,2,0),back,10,'gravel',half);
  const [mud,stone]=roost.stones;assert.ok(mud.size>stone.size,'clods are bigger');
  let mudLanded=-1,skipped=false;for(let i=0;i<90;i++){roost.step(1/60);if(mudLanded<0&&mud.stuck)mudLanded=mud.p.x;if(!stone.stuck&&stone.v.y>0&&i>5)skipped=true;}
  assert.ok(mudLanded>0&&mud.p.x===mudLanded,'the clod stuck where it landed');assert.ok(skipped&&stone.p.x>mud.p.x,'the stone skipped on past it');
  assert.ok(Math.abs(stone.p.y-(stone.p.x*.1+2+stone.size*.5))<1e-6,'it lies on the raised floor, following the slope');
});
test('the oldest stones give way to new ones, and an event reset clears them',()=>{
  const roost=new GravelRoost(new T.Scene(),()=>0),back=new T.Vector3(0,0,-1);
  for(let i=0;i<ROOST.max+20;i++)roost.throw(new T.Vector3(0,0,0),back,8,'gravel');
  assert.equal(roost.stones.length,ROOST.max);roost.step(1/60);assert.ok(roost.mesh.count<=ROOST.max);
  roost.reset();assert.equal(roost.stones.length,0);assert.equal(roost.mesh.count,0);roost.step(1/60);assert.equal(roost.flying,0);
});
test('the vehicle keeps each grounded tyre\'s signed wheelspin, and main throws stones from offline cars in play only',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('for(let i=0;i<4;i++)this.wheelSpins[i]=result.contactSlips[i]>0?result.slips[i]:0;'),'grounded spin only');
  assert.equal(vehicle.split('this.wheelSpins.fill(0)').length-1,2,'cleared on both resets');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.surface==='asphalt')continue;const clocks=roostClocks.get(c)"),'offline, in play, off asphalt');
  assert.ok(main.includes("const kind=c.surface==='mud'?'mud':'gravel',stone=gravelRoost.throw(steamAt,roostBack,c.wheelSpins[i],kind);")&&main.includes('if(stone&&Math.random()<ROOST.grit.share){')&&main.includes('if(rate<=0||c.wreckParts.wheelLost[i]||c.wetWheels[i])continue;'),'from each tyre still on and out of the water');
  assert.ok(main.includes('puddleSplashes?.reset();gravelRoost.reset();'),'cleared between events');
});
