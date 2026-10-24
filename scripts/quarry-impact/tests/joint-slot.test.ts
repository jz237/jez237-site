import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {jointLive} from '../src/bumper-lock';
test("a removed joint's slot is reused: its old handle resolves to the next joint, so a joint is live only by identity",async()=>{
 await R.init();const w=new R.World({x:0,y:-9.81,z:0}),zero={x:0,y:0,z:0};
 const body=(x:number)=>{const b=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(x,0,0));w.createCollider(R.ColliderDesc.cuboid(.2,.2,.2),b);return b;};
 const car=body(0),debris=body(1),other=body(3);
 const old=w.createImpulseJoint(R.JointData.rope(1.2,zero,zero),car,debris,true);assert.ok(jointLive(w,old));
 w.removeRigidBody(debris);assert.ok(!jointLive(w,old),'culled debris takes its joint with it');
 const fresh=w.createImpulseJoint(R.JointData.rope(1.2,zero,zero),car,other,true);
 assert.ok(w.getImpulseJoint(old.handle)===fresh,'the trap: the stale handle now resolves to the new joint');
 assert.ok(!jointLive(w,old)&&jointLive(w,fresh),'identity tells them apart');
 w.step();assert.ok(Number.isFinite(car.translation().x));w.free();
});
test('main never trusts a joint handle resolving: every liveness check and release goes through jointLive',async()=>{
 const src=(await import('node:fs')).readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(!src.includes('getImpulseJoint('),'no handle lookups left in main');
 assert.ok((src.match(/jointLive\(physics,/g)??[]).length>=6);
});
