import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import { Room, type Peer } from './room';
import { Simulation } from './simulation';
import { parseClientMessage, type ServerMessage } from './protocol';
import { templates } from '../src/assets';
import { Vehicle } from '../src/vehicle';
import { Quarry } from '../src/world';
import { quarryColliderLayout, createQuarryPhysics, terrainGeometry, cliffGeometry, quarryRoadsideGeometry, quarryRoadsideHeight, BARRELS, nearTrees } from '../src/quarry-layout';
import roadsideData from '../src/quarry-roadside-data.json';
import headwallData from '../src/quarry-headwall-collision.json';
import { createSurfaceSampler } from '../src/quarry-surface-sampler';
import {corridorObstructions} from './corridor-check';
await R.init();
const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const w=new T.Group();w.name='wheel_'+name;model.add(w);}templates.set('coupe',model);
const makePeer=()=>{const messages:ServerMessage[]=[];const closed:number[]=[];const peer:Peer={send:m=>messages.push(structuredClone(m)),close:c=>closed.push(c)};return {peer,messages,closed};};
const hello=(name='DRIVER',token?:string)=>JSON.stringify({type:'hello',protocol:1,name,kind:'coupe',token});

test('protocol rejects transforms, malformed input and NaN, clamps control authority',()=>{
  assert.equal(parseClientMessage(JSON.stringify({type:'position',p:{x:999,y:0,z:0},health:100})),null);
  assert.equal(parseClientMessage('{"type":"input","seq":1,"controls":{"throttle":null}}'),null);
  assert.deepEqual(parseClientMessage(JSON.stringify({type:'input',seq:1,controls:{throttle:99,steer:-99,brake:-1,handbrake:true}})),{type:'input',seq:1,controls:{throttle:1,steer:-1,brake:0,handbrake:true}});
});
test('eight clients share one authority, host-only start, sequence defense, fail-safe input, reconnect and AI fill',()=>{
  let now=0;const room=new Room('ABCDEF',R,()=>now),peers=Array.from({length:8},makePeer);
  peers.forEach((p,i)=>assert.equal(room.connect(p.peer,hello('DRIVER '+i)),i));
  const ninth=makePeer();assert.equal(room.connect(ninth.peer,hello()),null);assert.ok(ninth.closed.includes(4004));
  room.receive(1,peers[1].peer,JSON.stringify({type:'start',mode:'derby'}));assert.equal(room.sim.phase,'lobby');
  room.receive(0,peers[0].peer,JSON.stringify({type:'start',mode:'derby'}));assert.equal(room.sim.phase,'countdown');
  for(let i=0;i<190;i++){now+=1000/60;room.step();}
  const message=(seq:number,throttle:number)=>JSON.stringify({type:'input',seq,controls:{throttle,steer:0,brake:0,handbrake:false}});
  room.receive(1,peers[1].peer,message(2,1));room.receive(1,peers[1].peer,message(1,-1));assert.equal(room.sim.cars[1].state.input.throttle,1);
  now+=400;room.step();assert.equal(room.sim.cars[1].state.input.throttle,0);assert.equal(room.sim.cars[1].state.input.brake,1);
  const welcome=peers[1].messages.find(m=>m.type==='welcome');assert.ok(welcome?.type==='welcome');
  room.disconnect(1,peers[1].peer);room.step();assert.ok(room.sim.cars[1].state.input.throttle>0);
  const reconnect=makePeer();assert.equal(room.connect(reconnect.peer,hello('AGAIN',welcome.token)),1);
  room.broadcast();const a=peers[0].messages.at(-1),b=reconnect.messages.at(-1);assert.deepEqual(a,b);
  room.disconnect(0,peers[0].peer);assert.equal(room.snapshot().members.find(m=>m.id===1)?.host,true);
  room.dispose();
});
test('actual Rapier head-on collision damages both cars; no client damage messages exist',()=>{
  const sim=new Simulation(R);sim.phase='playing';
  for(const c of sim.cars.slice(2))c.body.setEnabled(false);
  const a=sim.cars[0],b=sim.cars[1];
  a.body.setTranslation({x:0,y:.75,z:-4},true);b.body.setTranslation({x:0,y:.75,z:4},true);
  b.body.setRotation({x:0,y:1,z:0,w:0},true);
  a.body.setLinvel({x:0,y:0,z:24},true);b.body.setLinvel({x:0,y:0,z:-24},true);
  for(let i=0;i<60;i++)sim.step(new Set([0,1,2,3,4,5,6,7]));
  assert.ok(a.state.health<95);assert.ok(b.state.health<95);assert.ok(sim.damage.length>=2);
  assert.ok(a.state.inflicted>0&&b.state.inflicted>0);assert.equal(sim.snapshot().cars[0].health,a.state.health);sim.dispose();
});
test('late joins receive local damage history without sending the whole history at 20 Hz, and repair clears it',()=>{
  const sim=new Simulation(R,'playground');sim.phase='playing';
  const c=sim.cars[0];c.state.health=60;c.state.dents=[{id:1,localPoint:{x:0,y:.2,z:2},localDirection:{x:0,y:0,z:-1},damage:20,repair:0}];
  assert.equal(sim.snapshot().cars[0].dents,undefined);assert.equal(sim.snapshot(true).cars[0].dents?.length,1);
  assert.equal(sim.recover(0),true);assert.equal(c.state.repair,1);assert.equal(c.state.health,100);assert.deepEqual(sim.snapshot(true).cars[0].dents,[]);sim.dispose();
});
test('headless authoritative handling replays the original Vehicle suspension, throttle, braking and steering',()=>{
  const sim=new Simulation(R),reference=new Simulation(R);
  for(const c of sim.cars.slice(1))c.body.setEnabled(false);
  for(const c of reference.cars)c.body.setEnabled(false);
  const original=new Vehicle(0,'coupe',0xffffff,new T.Scene(),reference.world,{emit(){},mark(){},detach(){}} as never);
  original.place(0,0,0);const c=sim.cars[0];c.body.setTranslation({x:0,y:.89,z:0},true);c.body.setRotation({x:0,y:0,z:0,w:1},true);
  Object.assign(c.state,{p:{x:0,y:.89,z:0},q:{x:0,y:0,z:0,w:1}});sim.phase='playing';
  for(let i=0;i<240;i++){
    const controls={throttle:i<60?0:i<150?1:0,steer:i>90&&i<140?.25:0,brake:i>=150?1:0,handbrake:false};
    original.input=controls;original.preStep(1/60);reference.world.step();original.postStep(1/60,i/60);
    sim.setInput(0,controls);sim.step(new Set([0,1,2,3,4,5,6,7]));
    const actual=c.body.translation(),expected=original.body.translation();
    assert.ok(Math.hypot(actual.x-expected.x,actual.y-expected.y,actual.z-expected.z)<.0001,`Replay drift at tick ${i}: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`);
  }
  original.dispose();sim.dispose();reference.dispose();
});
test('room snapshots restore car condition, transforms, event state and private reconnection tokens',()=>{
  const room=new Room('ABCDEF',R),p=makePeer();room.connect(p.peer,hello());room.receive(0,p.peer,JSON.stringify({type:'start',mode:'race'}));for(let i=0;i<200;i++)room.step();
  room.sim.cars[0].state.health=47;const saved=room.save();const restored=new Room('ABCDEF',R);restored.restore(saved);
  assert.equal(restored.sim.cars[0].state.health,47);assert.equal(restored.sim.mode,'race');assert.deepEqual(restored.sim.cars[0].body.translation(),room.sim.cars[0].body.translation());
  const next=makePeer();assert.equal(restored.connect(next.peer,hello('RECONNECTED',saved.sessions[0].token)),0);room.dispose();restored.dispose();
});
test('actual rendered Quarry and authoritative server use identical static geometry, transforms and loose props',()=>{
  const originalDocument=globalThis.document;
  const context=new Proxy({}, {get:()=>()=>{}});
  (globalThis as any).document={createElement:()=>({width:1,height:1,getContext:()=>context}),createElementNS:()=>({addEventListener(){},removeEventListener(){},src:''})};
  const browserWorld=new R.World({x:0,y:-9.81,z:0}),scene=new T.Scene();
  let quarry:Quarry;
  try{quarry=new Quarry(scene,browserWorld);}finally{(globalThis as any).document=originalDocument;}
  quarry.setMode('derby');
  const server=new Simulation(R),layout=quarryColliderLayout();
  // The server instantiates this same ordered factory; car colliders are appended.
  const serverStatics:R.Collider[]=[];server.world.forEachCollider(c=>{if(!c.parent())serverStatics.push(c);});
  assert.equal(serverStatics.length,layout.length);assert.equal(quarry.collisionPhysics.statics.size,layout.length);
  browserWorld.step();server.world.step();assert.deepEqual(corridorObstructions(browserWorld,quarry.collisionPhysics.statics),[],'The full road center ±6m corridor must remain clear of unintended solid scenery');
  layout.forEach((spec,i)=>{const a=quarry.collisionPhysics.statics.get(spec.id)!,b=serverStatics[i];assert.equal(a.shapeType(),b.shapeType(),spec.id);assert.deepEqual(a.translation(),b.translation(),spec.id);assert.deepEqual(a.rotation(),b.rotation(),spec.id);
    if(spec.shape==='mesh'){assert.deepEqual(a.vertices(),b.vertices(),spec.id);assert.deepEqual(a.indices(),b.indices(),spec.id);}
  });
  const terrain=terrainGeometry();assert.ok(scene.children.some(o=>o instanceof T.Mesh && o.geometry.attributes.position.count===terrain.positions.length/3 && (o.geometry.attributes.position.array as Float32Array).every((n,i)=>n===terrain.positions[i])));
  const cliff=cliffGeometry();assert.ok(cliff.positions.length>50_000);
  let renderedCliff:T.Mesh|undefined;
  scene.traverse(o=>{if(o instanceof T.Mesh && !(o instanceof T.InstancedMesh) && o.geometry.attributes.position.count===cliff.positions.length/3 && (o.geometry.attributes.position.array as Float32Array).every((n,i)=>n===cliff.positions[i]))renderedCliff=o;});
  assert.ok(renderedCliff,'Visible cliff must retain the exact shared collision vertices');
  assert.deepEqual(renderedCliff.geometry.index!.array,cliff.indices,'Visible cliff triangles must match the shared collider');
  assert.deepEqual(quarry.collisionPhysics.statics.get('quarry-cliffs')!.vertices(),cliff.positions);
  for(const kind of ['fir-0','fir-1','fir-2']){
    const placements=nearTrees(kind);
    assert.equal(layout.filter(s=>s.id.startsWith('tree-'+kind+'-')).length,placements.length);
    for(const p of placements)assert.ok(quarry.collisionPhysics.statics.has('tree-'+kind+'-'+p.colliderIndex));
  }
  assert.equal(server.props.length,22);quarry.props.forEach((p,i)=>assert.deepEqual(p.body.translation(),server.props[i].body.translation()));
  const impulse={x:80,y:20,z:12};quarry.props[0].body.applyImpulse(impulse,true);server.props[0].body.applyImpulse(impulse,true);
  for(let i=0;i<60;i++){browserWorld.step();server.world.step();}
  assert.deepEqual(quarry.props[0].body.translation(),server.props[0].body.translation());
  quarry.applyProps(server.snapshot().props);assert.deepEqual(quarry.props[0].mesh.position.toArray(),Object.values(server.props[0].body.translation()));
  quarry.resetProps();assert.deepEqual(quarry.props[0].body.translation(),new R.Vector3(Math.fround(BARRELS[0].x),Math.fround(BARRELS[0].y),Math.fround(BARRELS[0].z)));
  browserWorld.free();server.dispose();
});
test('authority completes derby, preserves disabled obstacles, rematches fresh, and charges race recovery',()=>{
  const room=new Room('ABCDEF',R),peer=makePeer();room.connect(peer.peer,hello());room.receive(0,peer.peer,JSON.stringify({type:'start',mode:'derby'}));room.sim.phase='playing';
  room.sim.cars.forEach((c,i)=>c.state.health=i===0?30:0);const wreck=room.sim.cars[1].body.handle;room.step();
  assert.equal(room.sim.phase,'result');assert.equal(room.sim.ranking()[0],0);assert.ok(room.sim.world.getRigidBody(wreck));assert.ok(room.sim.cars[1].collider.isEnabled());
  room.receive(0,peer.peer,JSON.stringify({type:'start',mode:'race'}));assert.equal(room.sim.phase,'countdown');assert.ok(room.sim.cars.every(c=>c.state.health===100&&c.state.passed===0));assert.equal(room.sim.tick,0);
  room.sim.phase='playing';room.sim.elapsed=10;const ai=room.sim.cars[1];ai.offTrack=6.99;ai.state.p={x:0,y:.89,z:0};room.sim.ai(ai);
  assert.equal(ai.state.penalty,5);assert.ok(Math.hypot(ai.state.p.x,ai.state.p.z)>70);assert.equal(ai.offTrack,0);
  assert.equal(room.sim.recover(1),false,'Recovery spam is rate limited');room.sim.elapsed+=6;assert.equal(room.sim.recover(1),true);assert.equal(ai.state.penalty,10);
  room.sim.elapsed=899.995;room.step();assert.equal(room.sim.phase,'result');room.dispose();
});

test('actual Rapier contacts stop moving bodies at all three authored quarry sections',()=>{
  const world=new R.World({x:0,y:0,z:0}),quarry=createQuarryPhysics(R,world,false);
  try {
    const cut=quarry.statics.get('quarry-cut');assert.ok(cut,'authored cut must be a real fixed collider');
    const positions=cut.vertices(),indices=cut.indices();
    const candidates:{center:T.Vector3;normal:T.Vector3;area:number;angle:number}[]=[];
    for(let i=0;i<indices.length;i+=3){
      const a=new T.Vector3().fromArray(positions,indices[i]*3),b=new T.Vector3().fromArray(positions,indices[i+1]*3),c=new T.Vector3().fromArray(positions,indices[i+2]*3);
      const center=a.clone().add(b).add(c).multiplyScalar(1/3),normal=b.sub(a).cross(c.sub(a)),area=normal.length();normal.normalize();
      const inward=new T.Vector3(-center.x,0,-center.z).normalize(),angle=Math.atan2(center.x/1.08,center.z)*180/Math.PI;
      if(center.y>2&&center.y<35&&normal.y>=0&&normal.y<.85&&normal.dot(inward)>.25)candidates.push({center,normal,area,angle});
    }
    candidates.sort((a,b)=>b.area-a.area);
    for(const [lo,hi] of [[118,125],[125,132],[132,139]]){
      const probe=candidates.find(p=>{
        if(p.angle<=lo+.5||p.angle>=hi-.5)return false;
        const start=p.center.clone().addScaledVector(p.normal,1.5),direction=p.normal.clone().negate();
        const hit=cut.castRayAndGetNormal(new R.Ray(start,direction),3,false);
        return hit!==null&&Math.abs(hit.timeOfImpact-1.5)<.03&&new T.Vector3().copy(hit.normal).dot(p.normal)>.8;
      });
      assert.ok(probe,`section ${lo}–${hi} must expose an inward-facing collision surface`);
      const start=probe.center.clone().addScaledVector(probe.normal,1.5),velocity=probe.normal.clone().multiplyScalar(-12);
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.y,start.z).setLinvel(velocity.x,velocity.y,velocity.z).setCcdEnabled(true).setCanSleep(false));
      const ball=world.createCollider(R.ColliderDesc.ball(.25).setMass(100).setRestitution(0),body);let contacts=0;
      for(let step=0;step<45;step++){world.step();world.contactPair(ball,cut,manifold=>{contacts+=manifold.numContacts();});}
      assert.ok(contacts>0,`section ${lo}–${hi} must produce solver contact, not only a ray hit`);
      assert.ok(new T.Vector3().copy(body.translation()).sub(probe.center).dot(probe.normal)>.15,'body must remain on the exposed side of the face');
      assert.ok(new T.Vector3().copy(body.linvel()).dot(probe.normal)>-.2,'collision must stop incoming velocity');
      world.removeRigidBody(body);
    }
  } finally {world.free();}
});

test('actual roadside collider supports a falling body on the raised surface in every spatial section',()=>{
  const world=new R.World({x:0,y:-9.81,z:0}),quarry=createQuarryPhysics(R,world,false),data=quarryRoadsideGeometry(),base=createSurfaceSampler(terrainGeometry());
  try {
    const ground=quarry.statics.get('quarry-roadside');assert.ok(ground);world.step();
    for(const section of roadsideData.surface.sections){
      let center:T.Vector3|undefined;
      for(let i=section.firstTriangle*3;i<(section.firstTriangle+section.triangleCount)*3;i+=27){
        const a=new T.Vector3().fromArray(data.positions,data.indices[i]*3),b=new T.Vector3().fromArray(data.positions,data.indices[i+1]*3),c=new T.Vector3().fromArray(data.positions,data.indices[i+2]*3);
        const p=a.clone().add(b).add(c).multiplyScalar(1/3),normal=b.sub(a).cross(c.sub(a)).normalize();
        if(normal.y<.98||p.y-(base.height(p.x,p.z)??p.y)<.2)continue;
        const hit=world.castRay(new R.Ray({x:p.x,y:p.y+3,z:p.z},{x:0,y:-1,z:0}),5,true);
        if(hit?.collider.handle===ground.handle&&Math.abs(hit.timeOfImpact-3)<.002){center=p;break;}
      }
      assert.ok(center,`section ${section.id} needs an exposed raised contact probe`);
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(center.x,center.y+2,center.z).setCcdEnabled(true));
      const ball=world.createCollider(R.ColliderDesc.ball(.25).setMass(100).setFriction(.9).setRestitution(0),body);let contacts=0;
      for(let i=0;i<120;i++){world.step();world.contactPair(ball,ground,m=>contacts+=m.numContacts());}
      assert.ok(contacts>0,'authored roadside must produce solver contact');
      const end=body.translation(),height=quarryRoadsideHeight(end.x,end.z);assert.notEqual(height,undefined);
      assert.ok(end.y-height!>.22&&end.y-height!<.29,'body must settle on the exact raised mesh, not the old ground below');
      world.removeRigidBody(body);
    }
  } finally {world.free();}
});

test('extension faces and collapsed gully produce real Rapier contacts in every spatial section',()=>{
  const world=new R.World({x:0,y:0,z:0}),quarry=createQuarryPhysics(R,world,false);
  try {
    const wall=quarry.statics.get('quarry-extension');assert.ok(wall);world.step();
    const positions=wall.vertices(),indices=wall.indices();
    const candidates:{center:T.Vector3;normal:T.Vector3;area:number;angle:number}[]=[];
    for(let i=0;i<indices.length;i+=3){
      const a=new T.Vector3().fromArray(positions,indices[i]*3),b=new T.Vector3().fromArray(positions,indices[i+1]*3),c=new T.Vector3().fromArray(positions,indices[i+2]*3);
      const center=a.clone().add(b).add(c).multiplyScalar(1/3),normal=b.sub(a).cross(c.sub(a)),area=normal.length();normal.normalize();
      if(center.y>6&&area>.1&&normal.dot(new T.Vector3(-center.x,0,-center.z).normalize())>.1)
        candidates.push({center,normal,area,angle:Math.atan2(center.x/1.08,center.z)*180/Math.PI});
    }
    candidates.sort((a,b)=>b.area-a.area);
    const regions=[{name:'first extraction face',lo:139.5,hi:149.5,minY:0,maxY:.6},{name:'central extraction face',lo:150.5,hi:155,minY:0,maxY:.6},{name:'last extraction face',lo:162,hi:171.5,minY:0,maxY:.6},{name:'collapsed gully',lo:155.3,hi:161.1,minY:.5,maxY:1}];
    if(candidates.some(p=>p.normal.y<-.1))regions.push({name:'overhanging fracture',lo:139,hi:172,minY:-1,maxY:-.1});
    for(const region of regions){
      const probe=candidates.find(p=>{
        if(p.angle<region.lo||p.angle>region.hi||p.normal.y<region.minY||p.normal.y>region.maxY)return false;
        const start=p.center.clone().addScaledVector(p.normal,1.5),direction=p.normal.clone().negate();
        const hit=world.castRay(new R.Ray(start,direction),3,false);
        return hit?.collider.handle===wall.handle&&Math.abs(hit.timeOfImpact-1.5)<.002;
      });
      assert.ok(probe,`${region.name} must expose a collision surface`);
      const start=probe.center.clone().addScaledVector(probe.normal,1.5),velocity=probe.normal.clone().multiplyScalar(-12);
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.y,start.z).setLinvel(velocity.x,velocity.y,velocity.z).setCcdEnabled(true).setCanSleep(false));
      const ball=world.createCollider(R.ColliderDesc.ball(.2).setMass(100).setRestitution(0),body);let contacts=0;
      for(let i=0;i<45;i++){world.step();world.contactPair(ball,wall,m=>contacts+=m.numContacts());}
      assert.ok(contacts>0,`${region.name} must produce solver contacts`);
      assert.ok(new T.Vector3().copy(body.translation()).sub(probe.center).dot(probe.normal)>.1,`${region.name} must stop penetration`);
      assert.ok(new T.Vector3().copy(body.linvel()).dot(probe.normal)>-.2,`${region.name} must stop incoming velocity`);
      world.removeRigidBody(body);
    }
  } finally {world.free();}
});

test('wrapped northern headwall faces and gully stop real Rapier bodies on both sides of zero',()=>{
  const world=new R.World({x:0,y:0,z:0}),quarry=createQuarryPhysics(R,world,false);
  try {
    const wall=quarry.statics.get('quarry-headwall');assert.ok(wall);world.step();
    const positions=wall.vertices(),indices=wall.indices();
    const candidates:{center:T.Vector3;normal:T.Vector3;area:number;angle:number;closure:boolean}[]=[];
    for(let i=0;i<indices.length;i+=3){
      const a=new T.Vector3().fromArray(positions,indices[i]*3),b=new T.Vector3().fromArray(positions,indices[i+1]*3),c=new T.Vector3().fromArray(positions,indices[i+2]*3);
      const center=a.clone().add(b).add(c).multiplyScalar(1/3),normal=b.sub(a).cross(c.sub(a)),area=normal.length();normal.normalize();
      if((center.y>6||i/3>=headwallData.toeClosure.firstTriangle)&&area>.1&&normal.dot(new T.Vector3(-center.x,0,-center.z).normalize())>.1)
        candidates.push({center,normal,area,angle:(Math.atan2(center.x/1.08,center.z)*180/Math.PI+370)%360+350,closure:i/3>=headwallData.toeClosure.firstTriangle});
    }
    candidates.sort((a,b)=>b.area-a.area);
    const regions:{name:string;lo:number;hi:number;minY:number;maxY:number;closure?:boolean}[]=[{name:'west of zero',lo:350.5,hi:359.5,minY:-.1,maxY:.6},{name:'east of zero',lo:360.5,hi:369,minY:-.1,maxY:.6},{name:'last extraction face',lo:374.5,hi:384.5,minY:-.1,maxY:.6},{name:'collapsed gully',lo:369.5,hi:373.5,minY:.5,maxY:1},{name:'closed inherited toe gap',lo:350,hi:385,minY:-.01,maxY:.01,closure:true}];
    if(candidates.some(p=>p.normal.y<-.1))regions.push({name:'overhanging fracture',lo:350,hi:385,minY:-1,maxY:-.1});
    for(const region of regions){
      const probe=candidates.find(p=>{
        if(p.closure!==!!region.closure)return false;
        if(p.angle<region.lo||p.angle>region.hi||p.normal.y<region.minY||p.normal.y>region.maxY)return false;
        const start=p.center.clone().addScaledVector(p.normal,1.5),direction=p.normal.clone().negate();
        const hit=world.castRay(new R.Ray(start,direction),3,false);
        return hit?.collider.handle===wall.handle&&Math.abs(hit.timeOfImpact-1.5)<.002;
      });
      assert.ok(probe,`${region.name} must expose a collision surface`);
      const start=probe.center.clone().addScaledVector(probe.normal,1.5),velocity=probe.normal.clone().multiplyScalar(-12);
      const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.y,start.z).setLinvel(velocity.x,velocity.y,velocity.z).setCcdEnabled(true).setCanSleep(false));
      const ball=world.createCollider(R.ColliderDesc.ball(.2).setMass(100).setRestitution(0),body);let contacts=0;
      for(let i=0;i<45;i++){world.step();world.contactPair(ball,wall,m=>contacts+=m.numContacts());}
      assert.ok(contacts>0,`${region.name} must produce solver contacts`);
      assert.ok(new T.Vector3().copy(body.translation()).sub(probe.center).dot(probe.normal)>.1,`${region.name} must stop penetration`);
      assert.ok(new T.Vector3().copy(body.linvel()).dot(probe.normal)>-.2,`${region.name} must stop incoming velocity`);
      world.removeRigidBody(body);
    }
  } finally {world.free();}
});
