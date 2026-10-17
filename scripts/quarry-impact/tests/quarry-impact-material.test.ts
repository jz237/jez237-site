import test from 'node:test';import assert from 'node:assert/strict';
import {QUARRY_TYRES} from '../src/quarry-tyres';
import R from '@dimforge/rapier3d-compat';
import {tagImpactMaterial,colliderImpactMaterial} from '../src/impact-material';
import {createQuarryPhysics,BARRELS} from '../src/quarry-layout';import {DerbyArenaPhysics,DERBY_ARENA} from '../src/derby-arena';
test('actual quarry trees, stone, ramps, original/expanded barriers and barrels retain their materials',async()=>{
 await R.init();const world=new R.World({x:0,y:-9.81,z:0});
 try{
  const quarry=createQuarryPhysics(R,world,false),arena=new DerbyArenaPhysics(world,quarry.walls,quarry.statics);let trees=0,rocks=0;
  for(const [id,c]of quarry.statics){
   if(id.startsWith('tree-')){assert.equal(colliderImpactMaterial(world,c.handle,undefined),'wood',id);trees++;}
   if(id==='quarry-cliffs'||id.startsWith('scanned-rock-')||id.startsWith('scree-')||id.startsWith('ramp-')||id.startsWith('arena-')){assert.equal(colliderImpactMaterial(world,c.handle,undefined),'concrete',id);rocks++;}
   if(id.startsWith('fence-')||id.startsWith('container-')||id.startsWith('silo-'))assert.equal(colliderImpactMaterial(world,c.handle,undefined),'metal',id);
  }
  assert.ok(trees>100&&rocks>70);assert.equal(quarry.props.length,BARRELS.length+QUARRY_TYRES.length);
  for(const prop of quarry.props.slice(0,BARRELS.length)){const c=prop.body.collider(0);prop.body.setTranslation({x:100,y:10,z:50},true);assert.equal(colliderImpactMaterial(world,c.handle,undefined),'metal');}
  for(const online of [false,true,false]){arena.setMode(true,online);assert.equal(arena.walls.length,DERBY_ARENA.segments);for(const c of arena.walls)assert.equal(colliderImpactMaterial(world,c.handle,undefined),'concrete');}
 }finally{world.free();}
});
test('explicit tags follow dynamic bodies and do not leak across removal or another world',async()=>{
 await R.init();const world=new R.World({x:0,y:0,z:0}),other=new R.World({x:0,y:0,z:0});
 try{
  const body=world.createRigidBody(R.RigidBodyDesc.dynamic()),c=world.createCollider(R.ColliderDesc.cuboid(1,1,1),body);tagImpactMaterial(c,'rubber');body.setTranslation({x:8,y:2,z:3},true);assert.equal(colliderImpactMaterial(world,c.handle,[]),'rubber');
  const foreign=other.createCollider(R.ColliderDesc.cuboid(1,1,1));assert.equal(colliderImpactMaterial(other,foreign.handle,[]),'metal');
  world.removeCollider(c,true);const replacement=world.createCollider(R.ColliderDesc.cuboid(1,1,1),body);assert.equal(colliderImpactMaterial(world,replacement.handle,[]),'metal');
 }finally{world.free();other.free();}
});
