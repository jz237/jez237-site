import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import R from '@dimforge/rapier3d-compat';
import {Simulation} from '../multiplayer/simulation';import {Room} from '../multiplayer/room';import {tagImpactMaterial} from '../src/impact-material';import {validOnlineSnapshot} from '../src/network-validation';import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';import {OnlineView} from '../src/online-view';
await R.init();
const impact=(material?:string)=>({id:1,tick:10,car:0,point:{x:0,y:0,z:0},direction:{x:1,y:0,z:0},localPoint:{x:0,y:0,z:0},localDirection:{x:1,y:0,z:0},repair:0,damage:12,...material?{material}: {}});
test('material passes JSON/binary snapshots and restoration; invalid material is rejected and legacy omission works',()=>{
 const room=new Room('ABCDEF',R),restored=new Room('ABCDEF',R);try{
  for(const material of [undefined,'metal','wood','concrete','rubber']){room.sim.damage=[impact(material) as any];const snapshot=room.snapshot();assert.ok(validOnlineSnapshot(snapshot));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(snapshot)),JSON.parse(JSON.stringify(snapshot)));restored.restore(room.save());assert.equal(restored.snapshot().damage[0].material,material);}
  for(const material of ['constructor','stone',4,null,{},[]]){const snapshot=room.snapshot();(snapshot.damage[0]as any).material=material;assert.equal(validOnlineSnapshot(snapshot),false);}
 }finally{room.dispose();restored.dispose();}
});
test('server derives material from real physical impacts rather than client input',()=>{
 const sim=new Simulation(R,'playground');try{
  sim.course={...sim.course,height:()=>0,outside:()=>false,surface:()=>'asphalt'};
  sim.world.createCollider(R.ColliderDesc.cuboid(80,.5,150).setTranslation(1000,-.5,1000));
  const wall=sim.world.createCollider(R.ColliderDesc.cuboid(.5,10,150).setTranslation(1002,1,1000));tagImpactMaterial(wall,'wood');
  for(const other of sim.cars.slice(1)){other.state.health=0;other.body.setTranslation({x:1100+other.state.id*10,y:2,z:1000},true);}
  const car=sim.cars[0];car.body.setTranslation({x:998,y:1,z:1000},true);car.body.setRotation({x:0,y:0,z:0,w:1},true);car.body.setLinvel({x:15,y:0,z:0},true);sim.phase='playing';
  for(let i=0;i<30;i++){sim.setInput(0,{throttle:0,brake:0,steer:0,handbrake:false});sim.step(new Set([0]));}
  assert.ok(sim.damage.some(d=>!d.scar&&d.car===0&&d.material==='wood'),'physical wood barrier contact produces material-tagged damage');
 }finally{sim.dispose();}
});
test('online rendering forwards material and actual breakage flags once, with stale/history events silent',()=>{
 const heard:any[]=[],car:any={id:0,kind:'coupe',setup:undefined,specification:{damageScale:1},current:new T.Vector3(),currentQ:new T.Quaternion(),root:new T.Object3D(),velocity:new T.Vector3(),impactEffects:{glass:false,debris:false},repair(){},hit(){this.impactEffects={glass:false,debris:true};},scar(){}};
 const view=new OnlineView(new T.Scene(),null as any,{}as any,{impact:(...args:any[])=>heard.push(args)}as any,()=>[car],()=>{});
 Object.assign(view,{initialized:true,lastTick:9});(view as any).repairs.set(0,0);view.network.connected=true;view.apply=()=>{};
 let pending:any[]=[impact('wood')];view.network.drainDamage=()=>pending.splice(0);
 const snap:any={tick:10,elapsed:1,cars:[{id:0,kind:'coupe',repair:0,p:{x:1,y:2,z:3},q:{x:0,y:0,z:0,w:1},v:{x:0,y:0,z:0}}],damage:[impact('wood')]};
 view.receive(snap);assert.equal(heard.length,1);assert.equal(heard[0][4],'wood');assert.equal(heard[0][2],false);assert.equal(heard[0][3],true);assert.deepEqual(heard[0][1].toArray(),[1,2,3]);
 pending=[impact('wood')];view.receive(snap);assert.equal(heard.length,1,'duplicate packet is silent');
 pending=[{...impact('concrete'),id:2,tick:1}];view.receive(snap);assert.equal(heard.length,1,'stale impact is silent');
 pending=[{...impact(),id:3}];view.receive(snap);assert.equal(heard.length,2);assert.equal(heard[1][4],undefined,'legacy server uses default metal');
});
