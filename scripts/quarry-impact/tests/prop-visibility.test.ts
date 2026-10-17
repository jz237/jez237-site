import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';import * as T from 'three';import {Quarry} from '../src/world';
test('server prop membership controls rendering and collision, and local reset restores every prop',async()=>{
 await R.init();const world=new R.World({x:0,y:0,z:0}),geometry=new T.BoxGeometry(),material=new T.MeshStandardMaterial();
 const props=Array.from({length:34},(_,id)=>{const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(id*2,1,0));world.createCollider(R.ColliderDesc.cuboid(.5,.5,.5),body);return{body,mesh:new T.Mesh(geometry,material),start:new T.Vector3(id*2,1,0)};});
 const quarry={props} as Quarry;const states=props.map((p,id)=>({id,p:{x:id*2,y:2,z:4},q:{x:0,y:0,z:0,w:1},v:{x:0,y:0,z:0},av:{x:0,y:0,z:0}}));
 try{
 Quarry.prototype.applyProps.call(quarry,states.slice(0,22));world.step();
 props.forEach((p,id)=>{assert.equal(p.mesh.visible,id<22);assert.equal(p.body.isEnabled(),id<22);});
 const ray=new R.Ray({x:44,y:5,z:0},{x:0,y:-1,z:0});assert.equal(world.castRay(ray,10,true),null,'missing tyre cannot collide locally');
 Quarry.prototype.applyProps.call(quarry,[states[24],states[0]]);assert.equal(props[24].body.isKinematic(),true);assert.deepEqual(props[24].mesh.position.toArray(),[48,2,4]);assert.equal(props[22].mesh.visible,false);
 Quarry.prototype.applyProps.call(quarry,states);props.forEach(p=>assert.ok(p.mesh.visible&&p.body.isEnabled()&&p.body.isKinematic()));
 Quarry.prototype.applyProps.call(quarry,states.slice(0,22));Quarry.prototype.resetProps.call(quarry);world.step();
 for(const p of props){assert.ok(p.mesh.visible&&p.body.isEnabled()&&p.body.isDynamic());assert.deepEqual({...p.body.translation()},{x:p.start.x,y:p.start.y,z:p.start.z});assert.deepEqual({...p.body.linvel()},{x:0,y:0,z:0});}
 assert.ok(world.castRay(ray,10,true),'local tyre collision restored');
 }finally{world.free();geometry.dispose();material.dispose();}
});
