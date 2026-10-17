import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';import {Simulation} from '../multiplayer/simulation';
test('restoring a barrel-only room resets newly added tyres without disturbing saved barrels',async()=>{
 await R.init();const sim=new Simulation(R);try{
 const saved={...sim.snapshot(),members:[],ack:{}};saved.props=saved.props.slice(0,22);saved.props[0].p.x+=3;
 for(const prop of sim.props){prop.body.setTranslation({x:90,y:8,z:80},true);prop.body.setLinvel({x:3,y:4,z:5},true);prop.body.setAngvel({x:1,y:2,z:3},true);prop.body.setRotation({x:0,y:1,z:0,w:0},true);}
 sim.restore(saved);assert.deepEqual({...sim.props[0].body.translation()},saved.props[0].p);
 for(const prop of sim.props.slice(22)){for(const key of ['x','y','z']as const)assert.ok(Math.abs(prop.body.translation()[key]-prop.start[key])<.00001);assert.deepEqual({...prop.body.linvel()},{x:0,y:0,z:0});assert.deepEqual({...prop.body.angvel()},{x:0,y:0,z:0});assert.equal(prop.body.rotation().w,1);}
 const current={...sim.snapshot(),members:[],ack:{}};current.props[22].p.x+=2;sim.restore(current);assert.deepEqual({...sim.props[22].body.translation()},current.props[22].p);
 }finally{sim.dispose();}
});
