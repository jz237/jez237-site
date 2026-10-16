import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {ONLINE_CARS} from '../src/online-roster';import {DEFINITIONS} from '../src/rules';import {circuitRoute} from '../src/event-rules';import {DEFAULT_ONLINE_EVENT} from '../src/online-events';import {landscapeHeight} from '../src/quarry-layout';
await R.init();
function place(s:Simulation,id:number,x:number,z:number){const c=s.cars[id];c.body.setTranslation({x,y:landscapeHeight(x,z)+.89,z},true);c.state.p={...c.body.translation()};}
function setup(kind:typeof ONLINE_CARS[number],direction:'forward'|'reverse'='forward'){
 const s=new Simulation(R,'race',[kind,'shuttle'],8,[],{...DEFAULT_ONLINE_EVENT,direction});s.phase='playing';s.elapsed=10;for(let id=0;id<8;id++)place(s,id,-30+id*8,0);s.world.step();s.cars[0].state.nextCheckpoint=1;s.cars[0].state.passed=12;return s;
}
test('all fourteen cars avoid occupied gates and recover when clearance is available in both directions',()=>{
 for(const kind of ONLINE_CARS)for(const direction of ['forward','reverse']as const){const s=setup(kind,direction);try{
 const p=circuitRoute(direction)[0];place(s,1,p.x,p.z);s.cars[1].state.health=0;s.world.step();const original=s.cars[0].state.passed;
 const accepted=s.recover(0),c=s.cars[0],other=s.cars[1],def=DEFINITIONS[kind],block=DEFINITIONS.shuttle;
 assert.ok(Math.hypot(c.state.p.x-other.body.translation().x,c.state.p.z-other.body.translation().z)>=Math.hypot(def.halfWidth,def.halfLength)+Math.hypot(block.halfWidth,block.halfLength)+.75);
 assert.equal(c.state.passed,original);assert.equal(c.state.nextCheckpoint,1);assert.equal(c.state.penalty,accepted?5:0);if(accepted)assert.equal(s.recover(0),false);else{place(s,1,30,0);s.world.step();assert.equal(s.recover(0),true,kind+' '+direction+' after blocker clears');assert.equal(c.state.penalty,5);}
 }finally{s.dispose();}}
});
test('blocked recovery leaves transform, score, progress and cooldown unchanged and can retry',()=>{
 const s=setup('shuttle');try{const p=circuitRoute('forward')[0],next=circuitRoute('forward')[1],yaw=Math.atan2(next.x-p.x,next.z-p.z);const barrier=s.world.createCollider(R.ColliderDesc.cuboid(30,4,30).setTranslation(p.x,landscapeHeight(p.x,p.z)+2,p.z));s.world.step();
 const c=s.cars[0],position={...c.body.translation()},before={penalty:c.state.penalty,passed:c.state.passed,next:c.state.nextCheckpoint,last:c.lastRecovery};
 assert.equal(s.recover(0),false);assert.deepEqual({...c.body.translation()},position);assert.deepEqual({penalty:c.state.penalty,passed:c.state.passed,next:c.state.nextCheckpoint,last:c.lastRecovery},before);
 s.world.removeCollider(barrier,true);s.world.step();assert.equal(s.recover(0),true);assert.equal(c.state.penalty,5);assert.ok(Number.isFinite(yaw));
 }finally{s.dispose();}
});
