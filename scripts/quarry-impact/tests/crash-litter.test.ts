import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {LITTER,CrashLitter} from '../src/crash-litter';
import {Effects} from '../src/effects';
import {attachCarLights,LAMP_BREAK} from '../src/car-lights';
await R.init();
const chips=(l:CrashLitter)=>Array.from({length:l.mesh.count},(_,i)=>{const m=new T.Matrix4();l.mesh.getMatrixAt(i,m);return new T.Vector3().setFromMatrixPosition(m);});
test('broken glass and lamp lenses lie on the floor around the break, thrown out from the car, and stay for the event',()=>{
 const litter=new CrashLitter(new T.Scene()),flat=()=>.2;
 assert.equal(litter.scatter(new T.Vector3(3,1,4),'glass',7,flat),LITTER.glass.count);assert.equal(litter.mesh.count,LITTER.glass.count);
 assert.ok(chips(litter).every(p=>Math.abs(p.y-.2-LITTER.lift)<1e-6&&Math.hypot(p.x-3,p.z-4)<=LITTER.glass.spread+1e-6),'on the floor, within the spread (float32 matrices)');
 litter.reset();litter.scatter(new T.Vector3(3,1,4),'tail',7,flat,new T.Vector3(3,1,2));
 const c=chips(litter).reduce((a,p)=>a.add(p),new T.Vector3()).divideScalar(litter.mesh.count);assert.ok(c.z>4+LITTER.throw*.6,'thrown out away from the car');
 assert.deepEqual(litter.last.toArray().map(v=>+v.toFixed(5)),[3,.2,+(4+LITTER.throw).toFixed(5)],'the last scatter is where it landed');
 const colour=new T.Color();litter.mesh.getColorAt(0,colour);assert.ok(colour.r>colour.g*2,'tail lamp chips are red');
 const again=new CrashLitter(new T.Scene());again.scatter(new T.Vector3(3,1,4),'tail',7,flat,new T.Vector3(3,1,2));assert.deepEqual(chips(again),chips(litter),'seeded: the same break scatters the same way');
 assert.equal(litter.scatter(new T.Vector3(NaN,0,0),'glass',1,flat),0);assert.deepEqual(litter.breaks,{glass:0,head:0,tail:1});
 for(let i=0;i<LITTER.capacity/LITTER.head.count+5;i++)litter.scatter(new T.Vector3(i,0,0),'head',i,flat);assert.equal(litter.mesh.count,LITTER.capacity,'the oldest are recycled');
 litter.reset();assert.ok(litter.mesh.count===0&&litter.breaks.head===0);
 const g=litter.mesh.geometry.getAttribute('position'),a=new T.Vector3().fromBufferAttribute(g,0),b=new T.Vector3().fromBufferAttribute(g,1),d=new T.Vector3().fromBufferAttribute(g,2);
 assert.ok(b.sub(a).cross(d.sub(a)).y>0,'the chip\'s front face looks up (a face wound downwards renders black from above)');
});
test('litter lands on the physics floor, which can stand above the course height function',()=>{
 const previous=globalThis.window;(globalThis as any).window={innerHeight:1440,performance:globalThis.performance};
 try{const world=new R.World({x:0,y:-9.81,z:0}),fx=new Effects(new T.Scene(),world,()=>0);world.createCollider(R.ColliderDesc.cuboid(20,.15,20).setTranslation(0,.15,0));world.step();
  fx.scatterLitter(new T.Vector3(1,1.2,1),'glass',2);assert.ok(chips(fx.litter).every(p=>Math.abs(p.y-.3-LITTER.lift)<1e-4),'on the arena slab, not buried under it');
  fx.reset();assert.equal(fx.litter.mesh.count,0,'a new event starts clean');world.free();
 }finally{(globalThis as any).window=previous;}
});
test('a lamp that breaks reports where it was, once, and offline cars scatter glass and lamp litter',()=>{
 const root=new T.Group(),lamp=new T.Mesh(new T.BoxGeometry(.3,.1,.05),new T.MeshStandardMaterial({name:'Brakelight'}));lamp.position.set(.6,.8,-2);root.add(lamp);
 const lights=attachCarLights(root,2.2),seen:string[]=[];lights.onSmash=(p,kind)=>seen.push(`${kind}@${p.z.toFixed(2)}`);
 lights.set(false,false);lamp.userData.damage=LAMP_BREAK+1;lights.set(false,false);lights.set(false,true);assert.deepEqual(seen,['tail@-2.00']);
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes("if(car.extendedDamage){const glassSound=car.onGlassBreak,lights=carLights.get(car);let n=0;car.onGlassBreak=p=>{glassSound?.(p);fx.scatterLitter(p,'glass',car.id*131+(++n),car.current);};if(lights)lights.onSmash=(p,kind)=>fx.scatterLitter(p,kind,car.id*137+(++n),car.current);}"));
});
