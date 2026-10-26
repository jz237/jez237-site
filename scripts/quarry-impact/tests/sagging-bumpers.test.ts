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
import {LOCK} from '../src/bumper-lock';
import {BUMPER_HINGE,SAG,sagDamage,sagFor} from '../src/sagging-bumpers';
await R.init();const load=GLTFLoader.prototype.loadAsync;
try{GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/([^/]+)\.glb$/.exec(String(url))![1]);await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=load;}
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),wreck=readFileSync(new URL('../src/wreck-attachments.ts',import.meta.url),'utf8');
test('a young car keeps its bumpers on their clips; on old ones one end of one bumper hangs, each car its own',()=>{
  for(let id=0;id<40;id++)assert.equal(sagFor(id,SAG.age-.01),null);
  let n=0;const ends=new Set<string>(),sides=new Set<number>();
  for(let id=0;id<400;id++){const st=sagFor(id,.9);if(!st)continue;n++;ends.add(st.end);sides.add(st.side);
    assert.ok(st.loose>=SAG.loose[0]&&st.loose<=SAG.loose[1]&&st.drop>=SAG.drop[0]&&st.drop<=SAG.drop[1]);}
  assert.ok(Math.abs(n/400-SAG.share)<.08,`${n}`);assert.deepEqual([...ends].sort(),['front','rear']);assert.deepEqual([...sides].sort(),[-1,1]);
  assert.deepEqual(sagFor(11,.8),sagFor(11,.8));assert.equal(sagFor(Number.NaN,Number.NaN),null);
});
test('loose enough to hook another car, short of the wind tearing it off or it dragging on the ground',()=>{
  assert.ok(SAG.loose[0]>=LOCK.loose,'a hanging bumper can lock with another car’s');
  assert.ok(SAG.loose[1]<WIND_RIP.loose,'not torn off as soon as the car gets going');
  assert.ok(SAG.loose[1]<.55&&vehicle.includes("if(!a.name.includes('bumper')||a.loose<.55"),'not dragging');
});
test('the damage set is the damage that leaves a bumper that loose on its own hinge',()=>{
  assert.ok(wreck.includes("threshold=mirror?MIRROR_HANG.start:a.name.startsWith('door')?18:a.name==='hood'?12:"+BUMPER_HINGE.start+';'));
  assert.ok(wreck.includes('/(mirror?MIRROR_HANG.span:'+BUMPER_HINGE.span+'),0,1);'));
  for(const loose of [.14,.18,.22])assert.ok(Math.abs((sagDamage(loose)-BUMPER_HINGE.start)/BUMPER_HINGE.span-loose)<1e-12);
  assert.equal(sagDamage(Number.NaN),BUMPER_HINGE.start);
});
test('the hinge drops the free end by the sag as well, and a repair puts it back on its clips',()=>{
  assert.ok(wreck.includes('euler.z=-a.side*(a.loose*.3+(a.sag??0))+flutter;'));
  assert.ok(wreck.includes('a.damage=a.loose=0;a.swing=a.swingRate=0;a.sag=0;'));
});
test('main wires it to offline rivals only, never the end already held up with tape',()=>{
  const at=main.indexOf('const st=sagFor(car.id,startingRust(car.id))'),block=main.slice(main.lastIndexOf('\n',at),main.indexOf('\n',main.indexOf('\n',at)+1));
  assert.ok(block.includes('if(car.extendedDamage&&i!==0){'));
  assert.ok(block.includes("taped.get(car)?.end!==(st.end==='front'?1:-1)"),'not the taped end');
  assert.ok(block.includes('bumper.damage=sagDamage(st.loose);bumper.loose=st.loose;bumper.side=st.side;bumper.sag=st.drop;'));
  assert.ok(main.indexOf('const st=sagFor(')>main.indexOf('const tape=tapeFor('),'after the tape is fitted');
});
test('on the actual Vehicle the sagging bumper’s free corner hangs lower',()=>{
  const world=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene(),setup=stockSetup('coupe'),fx={emit(){},mark(){},detach(){}}as any;
  const car=new Vehicle(0,'coupe',setup.paint,scene,world,fx,setup,{height:()=>0,surface:()=>'gravel' as const},'angular-v1');car.extendedDamage=true;car.place(0,0,0);
  try{
    const bumper=car.wreckParts.assemblies.find(a=>a.name==='front-bumper')!;assert.ok(!!bumper);
    const low=()=>{car.root.updateMatrixWorld(true);let y=Infinity;for(const m of bumper.members)y=Math.min(y,new T.Box3().setFromObject(m.mesh).min.y);return y;};
    const before=low();bumper.damage=sagDamage(.18);bumper.loose=.18;bumper.side=1;bumper.sag=.07;car.wreckParts.pose(0,0);
    const after=low();assert.ok(before-after>.05,`${before} → ${after}`);
    car.wreckParts.reset();assert.equal(bumper.sag,0);
  }finally{car.dispose();world.free();}
});
