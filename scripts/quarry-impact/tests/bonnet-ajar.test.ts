import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle,WIND_RIP} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {hoodWindLift} from '../src/wreck-attachments';
import {AJAR,BONNET_HINGE,ajarDamage,ajarFor} from '../src/bonnet-ajar';
await R.init();const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),wreck=readFileSync(new URL('../src/wreck-attachments.ts',import.meta.url),'utf8');
test('a young car’s bonnet shuts on its catch; on some old ones it sits up, each car its own',()=>{
  for(let id=0;id<40;id++)assert.equal(ajarFor(id,AJAR.age-.01),null);
  let n=0;for(let id=0;id<400;id++){const a=ajarFor(id,.9);if(!a)continue;n++;
    assert.ok(a.loose>=AJAR.loose[0]&&a.loose<=AJAR.loose[1]&&a.lift>=AJAR.lift[0]&&a.lift<=AJAR.lift[1]);}
  assert.ok(Math.abs(n/400-AJAR.share)<.08,`${n}`);assert.deepEqual(ajarFor(9,.8),ajarFor(9,.8));assert.equal(ajarFor(Number.NaN,Number.NaN),null);
});
test('up a hand’s width, short of the wind lifting it or tearing it off at speed',()=>{
  const most=AJAR.loose[1]*.42+AJAR.lift[1],least=AJAR.loose[0]*.42+AJAR.lift[0];
  assert.ok(least*1.1>.08&&most*1.3<.2,'a 1.1–1.3 m bonnet’s front edge 8–20 cm proud');
  assert.ok(AJAR.loose[1]<WIND_RIP.loose,'not torn off as soon as the car gets going');
  for(const speed of [10,20,30])assert.equal(hoodWindLift(speed,AJAR.loose[1]),0,'the airflow does not lift it yet');
});
test('the damage set is the damage that leaves a bonnet that loose on its own hinge, and the hinge lifts it by the rest',()=>{
  assert.ok(wreck.includes("a.name==='hood'?"+BONNET_HINGE.start+':10;')&&wreck.includes('/(mirror?MIRROR_HANG.span:'+BONNET_HINGE.span+'),0,1);'));
  for(const loose of [.12,.16,.2])assert.ok(Math.abs((ajarDamage(loose)-BONNET_HINGE.start)/BONNET_HINGE.span-loose)<1e-12);
  assert.equal(ajarDamage(Number.NaN),BONNET_HINGE.start);
  assert.ok(wreck.includes('euler.x=-a.loose*.42-(a.sag??0)-lift+flutter*(1+lift*4);'));
});
test('main wires it to offline rivals only, on their own bonnet',()=>{
  const at=main.indexOf('const ajar=ajarFor(car.id,startingRust(car.id))'),block=main.slice(main.lastIndexOf('\n',at),main.indexOf('\n',main.indexOf('\n',at)+1));
  assert.ok(block.includes('if(car.extendedDamage&&i!==0){'));
  assert.ok(block.includes('hood.damage=ajarDamage(ajar.loose);hood.loose=ajar.loose;hood.sag=ajar.lift;'));
});
test('on the actual Vehicle the bonnet’s front edge stands up off the grille',()=>{
  const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),setup=stockSetup('coupe'),fx={emit(){},mark(){},detach(){}}as any;
  const car=new Vehicle(0,'coupe',setup.paint,scene,world,fx,setup,{height:()=>0,surface:()=>'gravel' as const},'angular-v1');car.extendedDamage=true;car.place(0,0,0);
  try{
    const hood=car.wreckParts.assemblies.find(a=>a.name==='hood')!;assert.ok(!!hood);
    const top=()=>{car.root.updateMatrixWorld(true);let y=-Infinity;for(const m of hood.members)y=Math.max(y,new T.Box3().setFromObject(m.mesh).max.y);return y;};
    const before=top();hood.damage=ajarDamage(.16);hood.loose=.16;hood.sag=.045;car.wreckParts.pose(0,0);
    const after=top();assert.ok(after-before>.04,`${before} → ${after}`);
    car.wreckParts.reset();assert.equal(hood.sag,0);
  }finally{car.dispose();world.free();}
});
