import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {DEFINITIONS,type CarKind} from '../src/rules';
import {ReplayRecorder,replayFile,readReplayFile} from '../src/replay-data';
import {ReplayScene,captureReplayFrame} from '../src/replay-scene';
import {OnlineView} from '../src/online-view';
import {freshComponents} from '../src/component-damage';
import type {Snapshot} from '../multiplayer/protocol';

await R.init();
const load=GLTFLoader.prototype.loadAsync;
try{
  GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
  await loadCars(()=>{});
}finally{GLTFLoader.prototype.loadAsync=load;}
const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){}} as any;
const dt=1/60,near=(a:number,b:number,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const throttle={throttle:1,steer:0,brake:0,handbrake:false};
const zero={x:0,y:0,z:0};
function pose(car:Vehicle,x=0,y=.85,z=0,yaw=0){
  const q=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),yaw),p=new T.Vector3(x,y,z);
  car.body.setTranslation(p,true);car.body.setRotation(q,true);car.body.setLinvel(zero,true);car.body.setAngvel(zero,true);
  car.current.copy(p);car.previous.copy(p);car.currentQ.copy(q);car.previousQ.copy(q);car.root.position.copy(p);car.root.quaternion.copy(q);car.root.updateMatrixWorld(true);
}
function hit(car:Vehicle,point:T.Vector3,damage:number,time=.5){
  car.root.updateMatrixWorld(true);
  car.hit(point.clone().applyMatrix4(car.root.matrixWorld),new T.Vector3(0,0,point.z<0?1:-1).applyQuaternion(car.root.quaternion),damage,time,true);
}
const wheelForce=(car:Vehicle)=>[0,1,2,3].reduce((sum,i)=>sum+Math.abs(car.controller.wheelEngineForce(i)??0),0);
function stationaryForce(car:Vehicle){
  car.body.setLinvel(zero,true);car.body.setAngvel(zero,true);car.input={...throttle};car.preStep(dt);return wheelForce(car);
}

test('rendered Marten and Tern impacts damage their actual engine bay independently of equal body health',()=>{
  for(const kind of ['marten','tern'] as const){
    const world=new R.World(zero),scene=new T.Scene(),cars=[0,1,2].map(id=>new Vehicle(id,kind,DEFINITIONS[kind].color,scene,world,fx));
    try{
      const engineEnd=kind==='marten'?-1:1,points=[new T.Vector3(0,0,engineEnd*1.7),new T.Vector3(0,0,-engineEnd*1.7),new T.Vector3(0,.8,0)];
      cars.forEach((car,i)=>{pose(car,12+i*10,3,-7,.73);hit(car,points[i],36);});
      assert.deepEqual(cars.map(c=>c.health),[64,64,64]);
      assert.ok(cars[0].engineDamage!>.25,kind+' engine-bay impact damages the engine');
      assert.equal(cars[1].engineDamage,0,kind+' opposite end is not the engine bay');
      assert.equal(cars[2].engineDamage,0,kind+' roof impact does not invent engine damage');
      for(const [i,car] of cars.entries()){
        // Isolate persistent component power loss after completing the separate restart.
        car.engineStall=0;const condition=car.engineDamage,wheels=Array.from(car.wreckParts.wheelDamage),damaged=stationaryForce(car);
        // Keep health, crushed wheels and geometry identical while isolating the
        // engine contribution to torque at the actual Rapier controller.
        car.engineDamage=0;const withIntactEngine=stationaryForce(car);car.engineDamage=condition;
        assert.ok(withIntactEngine>0);assert.deepEqual(Array.from(car.wreckParts.wheelDamage),wheels);
        if(i===0)assert.ok(damaged<withIntactEngine*.9,`${kind} engine torque ${damaged}/${withIntactEngine}`);
        else near(damaged,withIntactEngine);
      }
      cars[0].repair();assert.equal(cars[0].engineDamage,0);assert.equal(cars[0].health,100);
      near(stationaryForce(cars[0]),cars[0].specification.force);
    }finally{cars.forEach(car=>car.dispose());world.free();}
  }
});

test('engine damage reduces actual straight-line acceleration and armor protects it before accumulation',t=>{
  for(const kind of ['marten','tern'] as const){
    const results:number[]=[],conditions:number[]=[];
    for(const mode of ['damaged','same-wheels-intact-engine','armored'] as const){
      const world=new R.World({x:0,y:-9.81,z:0});world.timestep=dt;
      world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));
      const setup=stockSetup(kind);if(mode==='armored')setup.armor=3;
      const car=new Vehicle(0,kind,setup.paint,new T.Scene(),world,fx,setup);
      try{
        pose(car);hit(car,new T.Vector3(0,0,kind==='marten'?-1.7:1.7),36);
        // This fixture compares persistent torque loss, not transient restart delay.
        car.engineStall=0;conditions.push(car.engineDamage!);const expectedHealth=100-36*car.specification.damageScale;near(car.health,expectedHealth);
        if(mode==='same-wheels-intact-engine')car.engineDamage=0;
        car.input={...throttle};
        for(let i=0;i<120;i++){car.preStep(dt);world.step();car.postStep(dt,(i+1)*dt);}
        results.push(car.velocity.length());assert.ok(Number.isFinite(results.at(-1)));
      }finally{car.dispose();world.free();}
    }
    assert.equal(conditions[0],conditions[1]);assert.ok(conditions[2]<conditions[0],kind+' armor absorbs engine-bay damage');
    assert.ok(results[1]>2,kind+' acceleration fixture must actually drive');
    assert.ok(results[0]<results[1]*.93,`${kind} two-second speeds ${results[0]} vs ${results[1]}`);
    t.diagnostic(`${kind}: two-second speed ${results[0].toFixed(3)} m/s with engine damage vs ${results[1].toFixed(3)} m/s with identical wheel damage and intact engine; armor changes engine damage ${conditions[0].toFixed(3)} to ${conditions[2].toFixed(3)}`);
  }
});

test('compressed replay restores engine condition exactly across repeated backwards seeks and repairs',async()=>{
  const world=new R.World(zero),scene=new T.Scene(),setup=stockSetup('marten');setup.armor=2;
  const car=new Vehicle(0,'marten',setup.paint,scene,world,fx,setup);pose(car,2,3,4,.61);car.render(1);
  const recorder=new ReplayRecorder({version:1,mode:'derby',reverse:false,cars:[{id:0,kind:'marten',setup}],props:0,created:'2026-10-02T12:00:00Z'});
  let time=0;car.onVisualEvent=event=>recorder.event(0,time,event);
  const captures:number[]=[];
  const capture=(at:number)=>{recorder.capture(at,()=>captureReplayFrame([car],[],[0]),true);captures.push(car.engineDamage!);};
  try{
    capture(0);time=.5;hit(car,new T.Vector3(0,0,-1.7),36,time);capture(1);
    time=1.5;hit(car,new T.Vector3(0,.8,0),12,time);capture(2);
    time=2.5;car.repair();capture(3);
    time=3.5;hit(car,new T.Vector3(.1,0,-1.65),22,time);capture(4);
    assert.ok(captures[1]>0);assert.equal(captures[2],captures[1]);assert.equal(captures[3],0);assert.ok(captures[4]>0&&captures[4]<captures[1]);
    const document=await readReplayFile(new File([await replayFile(recorder.document())],'engine-condition.qir'));
    const replay=new ReplayScene(document,scene,world,[]);
    try{
      for(const at of [0,1,2,3,4,0,4,2,1,3,4,0]){
        replay.seek(at);assert.equal(replay.cars[0].engineDamage,captures[at],`exact engine condition at ${at}s`);
      }
      assert.equal(car.engineDamage,captures[4],'seeking a replay leaves the live vehicle condition untouched');
    }finally{replay.dispose();}
  }finally{car.dispose();world.free();}
});

function snapshot():Snapshot{
  return {type:'snapshot',tick:1,elapsed:1,countdown:0,mode:'derby',phase:'playing',members:[],ack:{},props:[],ranking:[0],damage:[],cars:[{
    id:0,kind:'coupe',p:{x:0,y:.85,z:0},q:{x:0,y:0,z:0,w:1},v:{...zero},av:{...zero},health:40,inflicted:0,damageLeft:0,damageRight:0,
    steering:0,speed:0,rpm:850,gear:1,wheels:Array.from({length:4},()=>({suspension:.36,rotation:0,contact:true})),input:{...throttle},
    passed:0,nextCheckpoint:0,lap:0,finished:false,finishTime:0,penalty:0,repair:0,surface:'asphalt',slip:0,
  }]};
}
test('online rendering accepts authoritative engine condition without hit packets and keeps legacy health-based drive',()=>{
  const world=new R.World(zero),scene=new T.Scene();let cars:Vehicle[]=[];
  const view=new OnlineView(scene,world,fx,{clearCars(){},attach(){},shot(){}} as any,()=>cars,next=>cars=next);
  try{
    const s=snapshot();s.cars[0].components={...freshComponents(),engineDamage:.8};view.receive(s);
    const car=cars[0];assert.equal(car.engineDamage,.8);const damagedForce=stationaryForce(car);
    const repairedEngine=structuredClone(s);repairedEngine.tick++;repairedEngine.cars[0].components!.engineDamage=0;view.receive(repairedEngine);
    assert.equal(cars[0],car);assert.equal(car.engineDamage,0);near(stationaryForce(car),car.specification.force);assert.ok(damagedForce<car.specification.force*.8);
    const stalled=structuredClone(repairedEngine);stalled.tick++;stalled.cars[0].engineStall=1.5;stalled.cars[0].rpm=0;view.receive(stalled);
    assert.equal(car.engineStall,1.5);assert.equal(stationaryForce(car),0);assert.ok(car.engineStall!<1.5,'shared client kernel cranks');
    const legacy=structuredClone(repairedEngine);legacy.tick+=2;delete legacy.cars[0].components!.engineDamage;view.receive(legacy);
    assert.equal(car.engineDamage,undefined);assert.equal(car.engineStall,undefined);near(stationaryForce(car),car.specification.force*(.45+.55*.4));
    const oldest=structuredClone(legacy);oldest.tick++;delete oldest.cars[0].components;view.receive(oldest);
    assert.equal(car.engineDamage,undefined);assert.equal(car.engineStall,undefined);near(stationaryForce(car),car.specification.force*(.45+.55*.4));
    // Legacy visual history may hit the engine; missing authority must still
    // retain the old server's drive rule rather than guessing new components.
    const legacyHistory=structuredClone(legacy);legacyHistory.tick+=2;
    legacyHistory.cars[0].dents=[{id:99,repair:0,localPoint:{x:0,y:0,z:1.7},localDirection:{x:0,y:0,z:-1},damage:36}];view.receive(legacyHistory);
    assert.equal(cars[0].engineDamage,undefined);near(stationaryForce(cars[0]),cars[0].specification.force*(.45+.55*.4));
  }finally{cars.forEach(car=>car.dispose());world.free();}
});

test('weathering preserves the three enamel fleet finishes while retaining the existing coupe material',()=>{
  const world=new R.World(zero),scene=new T.Scene(),cars=(['marten','tern','van','coupe'] as CarKind[]).map((kind,i)=>new Vehicle(i,kind,DEFINITIONS[kind].color,scene,world,fx));
  try{
    for(const car of cars){
      const paints=new Set<T.MeshPhysicalMaterial>();car.model.traverse(o=>{if(o instanceof T.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.name.startsWith('paint'))paints.add(m as T.MeshPhysicalMaterial);});
      assert.ok(paints.size>0,car.kind+' paint exists');
      for(const material of paints){
        const enamel=car.kind!=='coupe';
        if(car.kind==='coupe'&&material.name.includes('Paint 2')){
          assert.equal(material.metalness,.06);assert.equal(material.roughness,.4);assert.equal(material.clearcoat,.3);assert.equal(material.clearcoatRoughness,.13);continue;
        }
        assert.equal(material.metalness,enamel?.12:.23,car.kind+' metalness');assert.equal(material.roughness,enamel?.36:.26,car.kind+' roughness');
        assert.equal(material.clearcoat,enamel?.85:.96,car.kind+' clearcoat');assert.equal(material.clearcoatRoughness,enamel?.18:.13,car.kind+' coat roughness');
      }
    }
  }finally{cars.forEach(car=>car.dispose());world.free();}
});
