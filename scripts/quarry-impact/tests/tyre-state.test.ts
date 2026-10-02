import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {Group} from 'three';
import {TireContact} from '../src/wheel-mechanics';
import {freshComponents,applyComponentImpact,validComponents} from '../src/component-damage';
import {classicWheelAnchors} from '../src/classic-vehicle-specs';
import modernAnchors from '../src/vehicle-damage-anchors.json';
import {Simulation} from '../multiplayer/simulation';
import type {Snapshot} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {REPLAY_STRIDE,replayCarStride,encodeReplay,decodeReplay,type ReplayDocument} from '../src/replay-data';
import {stockSetup} from '../src/garage';
import {tyreWarning} from '../src/tyre-feedback';

await R.init();
const snapshot=(s:Simulation):Snapshot=>({...s.snapshot(true),members:[],ack:{}});
const normalized=(v:unknown)=>JSON.parse(JSON.stringify(v));
const model=classicWheelAnchors('tern'),anchor=model.wheels[0];
const point={x:anchor.x,y:anchor.y-model.modelOffset,z:anchor.z};
const direction={x:1,y:0,z:0};

test('tyre condition accepts bounded four-corner data and preserves absent legacy state',()=>{
  const a=freshComponents(),b=freshComponents();
  assert.ok(validComponents(a));assert.deepEqual(a.tyreDamage,[0,0,0,0]);
  a.tyreDamage![0]=1;assert.equal(b.tyreDamage![0],0,'new cars cannot share a condition array');
  for(const tyreDamage of [null,0,'0',{},[],[0,0,0],[0,0,0,0,0],[0,0,0,-.01],[0,0,0,1.01],[0,0,0,NaN],[0,0,0,Infinity],['0',0,0,0]])
    assert.equal(validComponents({...b,tyreDamage}),false,String(tyreDamage));
  delete a.tyreDamage;assert.ok(validComponents(a));
  applyComponentImpact(a,'tern',point,direction,60);
  assert.equal(a.tyreDamage,undefined,'a later hit cannot upgrade an older simulation');
  assert.ok(a.wheelDamage[0]>0,'legacy corner damage still works');
});

test('tyre-specific impacts survive JSON, frozen qiw1 transport and an authoritative cold restore',()=>{
  // The deployed online roster still negotiates the three modern vehicles.
  const source=new Simulation(R,'playground',Array(8).fill('coupe')),cold=new Simulation(R,'playground');
  try{
    source.phase='playing';const car=source.cars[0];
    const wheel=modernAnchors.coupe.wheels[0],contact={...wheel,y:wheel.y-modernAnchors.coupe.modelOffset};
    applyComponentImpact(car.state.components!,'coupe',contact,direction,23);
    applyComponentImpact(car.state.components!,'coupe',contact,direction,23);
    car.state.health=54;
    assert.ok(car.state.components!.tyreDamage![0]>0);
    assert.deepEqual(car.state.components!.tyreDamage!.slice(1),[0,0,0]);
    const saved=snapshot(source),json=normalized(saved),wire=decodeSnapshotWire(encodeSnapshotWire(saved)) as Snapshot;
    assert.deepEqual(wire,json);assert.ok(validOnlineSnapshot(json));assert.ok(validOnlineSnapshot(wire));
    cold.restore(wire);assert.deepEqual(cold.cars[0].state.components,car.state.components);
    cold.cars[0].state.components!.tyreDamage![0]=0;
    assert.ok(wire.cars[0].components!.tyreDamage![0]>0,'restored state cannot mutate its input snapshot');
    for(const value of [null,[1],[0,0,0,2]]){
      const invalid=structuredClone(json);invalid.cars[0].components.tyreDamage=value;
      assert.equal(validOnlineSnapshot(invalid),false);
    }
    const patched=structuredClone(json);
    patched.cars[0].wheels[0].contact=true;patched.cars[0].wheels[0].patch={plane:[0,1,0,-.001],load:1.25};
    assert.ok(validOnlineSnapshot(patched));assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(patched)),patched);
    for(const patch of [null,{}, {plane:[0,0,0,0],load:1}, {plane:[0,1,0,0],load:3}, {plane:[0,1,NaN,0],load:1}]){
      const invalid=structuredClone(patched);invalid.cars[0].wheels[0].patch=patch;assert.equal(validOnlineSnapshot(invalid),false);
    }
  }finally{source.dispose();cold.dispose();}
});

test('old complete hit histories retain legacy tyres until playground repair, while race recovery preserves flats',()=>{
  const source=new Simulation(R,'playground',Array(8).fill('tern')),cold=new Simulation(R,'playground'),race=new Simulation(R,'race',Array(8).fill('tern'));
  try{
    source.phase='playing';source.cars[0].state.health=40;
    source.cars[0].state.dents=[{id:1,localPoint:point,localDirection:direction,damage:60,repair:0}];
    const old=snapshot(source);
    for(const missingComponents of [false,true]){
      const saved=structuredClone(old);saved.elapsed=missingComponents?20:10;
      if(missingComponents)delete saved.cars[0].components;
      else{delete saved.cars[0].components!.tyreDamage;saved.cars[0].components!.wheelDamage=[.2,.4,.6,.8];}
      const before=structuredClone(saved);cold.restore(saved);
      const condition=cold.cars[0].state.components!;
      assert.equal(condition.tyreDamage,undefined,'full old body-hit history still lacks the tyre model');
      if(!missingComponents)assert.deepEqual(condition.wheelDamage,[.2,.4,.6,.8]);
      applyComponentImpact(condition,'tern',point,direction,23);assert.equal(condition.tyreDamage,undefined);
      assert.deepEqual(saved,before,'restore leaves saved input unchanged');
      assert.equal(cold.recover(0),true);assert.deepEqual(cold.cars[0].state.components!.tyreDamage,[0,0,0,0]);
    }
    race.phase='playing';race.cars[0].state.components!.tyreDamage=[1,0,.8,0];
    const damage=structuredClone(race.cars[0].state.components);
    assert.equal(race.recover(0),true);assert.deepEqual(race.cars[0].state.components,damage);
  }finally{source.dispose();cold.dispose();race.dispose();}
});

test('same-impact authority patches match live tyre loads through recovery and repair',()=>{
  for(const armor of [0,3]){
    const setup=stockSetup('coupe');setup.armor=armor;
    const simulation=new Simulation(R,'playground',Array(8).fill('coupe'),8,[setup]);
    const live=new TireContact(new Group()),humans=new Set([0,1,2,3,4,5,6,7]),car=simulation.cars[0];
    const check=()=>{
      const saved=simulation.snapshot().cars[0];let patches=0;
      saved.wheels.forEach((wheel,i)=>{
        if(!wheel.patch)return;
        patches++;live.update(car.controller,i,car.specification.mass,saved.components!.wheelDamage[i],0);
        assert.equal(wheel.patch.load,live.load.value,'snapshot load must include the same frame\'s component damage');
        assert.deepEqual(wheel.patch.plane,live.plane.value.toArray());
        assert.equal(live.active.value,1);
      });
      assert.ok(patches>0,'the comparison must exercise grounded contact patches');
    };
    try{
      simulation.phase='playing';simulation.cars.slice(1).forEach(c=>c.body.setEnabled(false));
      simulation.world.createCollider(R.ColliderDesc.cuboid(100,.5,100).setTranslation(0,8.5,0));
      car.body.setTranslation({x:0,y:9.89,z:0},true);car.body.setLinvel({x:0,y:0,z:0},true);car.body.setAngvel({x:0,y:0,z:0},true);
      car.body.setRotation({x:0,y:0,z:0,w:1},true);
      for(let i=0;i<180;i++)simulation.step(humans);
      assert.equal(car.state.health,100,'settling the fixture cannot pre-damage its wheels');check();
      const before=car.state.components!.wheelDamage.slice(),position=car.body.translation();
      simulation.world.createCollider(R.ColliderDesc.cuboid(.12,.10,.12).setTranslation(position.x-2,position.y-.18,position.z+modernAnchors.coupe.wheels[0].z).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000));
      car.body.setLinvel({x:-40,y:0,z:0},true);car.state.v={x:-40,y:0,z:0};
      for(let i=0;i<15&&car.state.health===100;i++)simulation.step(humans);
      assert.ok(car.state.health<100&&car.state.health>0,'an actual force event must damage the car');
      assert.ok(car.state.components!.wheelDamage.some((damage,i)=>damage>before[i]),'the contact must change a wheel load term');
      check();
      const damaged=structuredClone(car.state.components);
      simulation.mode='race';assert.equal(simulation.recover(0),true);assert.deepEqual(car.state.components,damaged);check();
      simulation.mode='playground';simulation.elapsed+=6;assert.equal(simulation.recover(0),true);
      assert.deepEqual(car.state.components!.wheelDamage,[0,0,0,0]);assert.deepEqual(car.state.components!.tyreDamage,[0,0,0,0]);check();
    }finally{live.dispose();simulation.dispose();}
  }
});

function replay(tyreModel?:1):ReplayDocument{
  const values=new Float32Array(replayCarStride({tyreModel}));values[6]=1;values[14]=100;
  for(let i=0;i<4;i++)values[21+i*8]=1;
  return{meta:{version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'tern',setup:stockSetup('tern')}],props:0,created:'2026-10-02',...(tyreModel?{tyreModel}:{})},frames:[{time:0,values}],events:[],limited:false};
}
test('replay files preserve legacy poses and validate explicitly versioned tyre contact channels',()=>{
  const old=replay();assert.deepEqual(decodeReplay(encodeReplay(old)),old);
  const current=replay(1);current.frames[0].values.set([0,1,0,-.001,1.25,1],REPLAY_STRIDE);
  const loaded=decodeReplay(encodeReplay(current));assert.deepEqual(loaded,current);assert.equal(loaded.frames[0].values.length,80);assert.equal(old.frames[0].values.length,56);
  for(const patch of [[0,0,0,0,1,1],[0,1,0,0,3,1],[0,1,0,0,1,.5],[0,1,0,0,-1,0]]){
    const invalid=replay(1);invalid.frames[0].values.set(patch,REPLAY_STRIDE);assert.throws(()=>decodeReplay(encodeReplay(invalid)));
  }
  const missing=replay();missing.meta.tyreModel=1;assert.throws(()=>decodeReplay(encodeReplay(missing)));
  for(const value of [0,2,-1,'1',null,true,{},[]]){
    const invalid=replay();(invalid.meta as any).tyreModel=value;
    assert.throws(()=>decodeReplay(encodeReplay(invalid)),/supported Quarry Impact replay/);
  }
});

test('the driving warning names only affected tyre corners and stays silent for legacy or intact cars',()=>{
  assert.equal(tyreWarning(), '');assert.equal(tyreWarning([0,0,0,0]),'');
  assert.equal(tyreWarning([1,0,0,0]),'FLAT TYRE · FL');
  assert.equal(tyreWarning([0,1,1,0]),'FLAT TYRES · FR / RL');
  assert.equal(tyreWarning([1,1,1,1]),'FLAT TYRES · FL / FR / RL / RR');
});
