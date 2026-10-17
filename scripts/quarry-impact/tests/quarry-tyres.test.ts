import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {createQuarryTyres,QUARRY_TYRES,quarryReplayProps} from '../src/quarry-tyres';import {colliderImpactMaterial} from '../src/impact-material';
test('rubber tyre compounds tumble, retain a hole and settle under gravity',async()=>{
 await R.init();const world=new R.World({x:0,y:-9.81,z:0});try{
 world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,-.5,0));const props=createQuarryTyres(R,world);
 assert.deepEqual(props.map(p=>p.id),QUARRY_TYRES.map(p=>p.id));
 for(const [i,p]of props.entries()){p.body.setTranslation({x:i*2,y:1,z:0},true);assert.ok(Math.abs(p.body.mass()-12)<.001);assert.equal(p.body.numColliders(),12);for(let j=0;j<12;j++){const c=p.body.collider(j);assert.equal(colliderImpactMaterial(world,c.handle,undefined),'rubber');}}
 world.step();const ray=new R.Ray({x:0,y:3,z:0},{x:0,y:-1,z:0});const hit=world.castRay(ray,5,true);assert.ok(hit&&hit.timeOfImpact>2.9,'ray passes through tyre centre to floor');
 props[0].body.applyImpulse({x:0,y:12,z:60},true);props[0].body.applyTorqueImpulse({x:1,y:0,z:2},true);
 for(let i=0;i<600;i++)world.step();assert.ok(props[0].body.translation().z>1,'impulse moves tyre');
 for(const p of props){assert.ok(p.body.translation().y>.05&&p.body.translation().y<.8);assert.ok(Number.isFinite(p.body.rotation().w));}
 }finally{world.free();}
});
test('legacy replay prefix and new full prop layout remain unambiguous',()=>{
 const props=Array.from({length:34},(_,id)=>({id}));assert.equal(quarryReplayProps(props,34),props);assert.deepEqual(quarryReplayProps(props,22),props.slice(0,22));assert.deepEqual(quarryReplayProps([],0),[]);for(const count of [0,21,23,33,35])assert.throws(()=>quarryReplayProps(props,count));
});

test('actual quarry tyres settle and authoritative snapshots retain their IDs',async()=>{
 await R.init();const {Simulation}=await import('../multiplayer/simulation');const sim=new Simulation(R,'playground');try{
 assert.equal(sim.props.length,34);for(const c of sim.cars)c.body.setEnabled(false);
 for(let i=0;i<360;i++)sim.world.step();
 for(const p of sim.props.slice(22)){const v=p.body.translation();assert.ok(Math.abs(v.y-p.start.y)<1,JSON.stringify({id:p.id,v,start:p.start}));assert.ok(Math.hypot(v.x-p.start.x,v.z-p.start.z)<2);}
 const snapshot=sim.snapshot();sim.props[22].body.setTranslation({x:90,y:3,z:90},true);sim.restore(snapshot);assert.deepEqual({...sim.props[22].body.translation()},snapshot.props[22].p);assert.deepEqual(snapshot.props.slice(22).map(p=>p.id),QUARRY_TYRES.map(p=>p.id));
 }finally{sim.dispose();}
});
