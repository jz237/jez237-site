import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {classicWheelAnchors,isClassicKind} from '../src/classic-vehicle-specs';
import anchors from '../src/vehicle-damage-anchors.json';
import {createVehiclePhysics,vehicleSpecification,vehicleChassisHalfExtents,rotateVehicleVector} from '../src/vehicle-physics';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import {freshComponents,applyComponentImpact} from '../src/component-damage';
import {accumulateTyreDamage,tyreFailure} from '../src/tyre-condition';
await R.init();
const dt=1/60;
type Vec={x:number;y:number;z:number};
type Quat=Vec&{w:number};
const identity={x:0,y:0,z:0,w:1};
const distance=(a:Vec,b:Vec)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const add=(a:Vec,b:Vec)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
function strike(kind:CarKind,armor:number,health:number,location:'sill'|'upper'|'centre',corner=0,rotation:Quat=identity){
 const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true),judge=new ImpactAdjudicator();world.timestep=dt;
 const spec=vehicleSpecification(kind,{engine:0,tires:0,armor,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}}),car={...createVehiclePhysics(R,world,kind,spec.mass,armor),kind};
 car.collider.setHalfExtents(vehicleChassisHalfExtents(kind,health));car.body.setTranslation({x:8,y:6,z:-4},true);car.body.setRotation(rotation,true);
 const model=isClassicKind(kind)?classicWheelAnchors(kind):anchors[kind],wheel=model.wheels[corner],side=corner%2?1:-1;
 const y=location==='sill'||location==='centre'?(kind==='buggy'?-.55:-.33):kind==='van'?.75:.42,z=location==='sill'?wheel.z:location==='centre'?0:kind==='buggy'?-.65:-.3;
 const start=add({x:8,y:6,z:-4},rotateVehicleVector({x:side*3,y,z},rotation)),velocity=rotateVehicleVector({x:-side*40,y:0,z:0},rotation);
 const striker=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(start.x,start.y,start.z).setRotation(rotation).setCcdEnabled(true));
 world.createCollider(R.ColliderDesc.cuboid(.12,.10,.12).setMass(2000).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(15000),striker);striker.setLinvel(velocity,true);
 type Contact=ImpactContact&{point:Vec;direction:Vec;staleGap:number};
 const hits:(Contact&{received:number})[]=[],witnessErrors:string[]=[];let witnessChecks=0;
 try{
  for(let tick=0;tick<40;tick++){
   const before=car.body.linvel(),other=striker.linvel();world.step(queue);const contacts:Contact[]=[];
   queue.drainContactForceEvents(e=>{
    const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(world,[car],h1,h2);if((!a&&!b)||!judge.needsContact(key,tick*dt))return;
    const manifold=vehicleContactManifold(world,h1,h2);if(!manifold)return;
    const reversed=vehicleContactManifold(world,h2,h1)!;
    if(distance(manifold.point1,reversed.point2)>=1e-6)witnessErrors.push('flipped participant1');if(distance(manifold.point2,reversed.point1)>=1e-6)witnessErrors.push('flipped participant2');
    for(const [handle,point]of [[h1,manifold.point1],[h2,manifold.point2]]as const){const surface=world.getCollider(handle).projectPoint(point,false);if(distance(surface.point,point)>=2e-5)witnessErrors.push('witness off current surface');witnessChecks++;}
    const relative={x:other.x-before.x,y:other.y-before.y,z:other.z-before.z},closing=Math.abs(relative.x*manifold.normal.x+relative.y*manifold.normal.y+relative.z*manifold.normal.z),p=car.body.translation(),q=car.body.rotation(),inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w},worldPoint=a?manifold.point1:manifold.point2;
    contacts.push({key,impulse:e.totalForceMagnitude()*dt,closing,damageScale:spec.damageScale,point:rotateVehicleVector({x:worldPoint.x-p.x,y:worldPoint.y-p.y,z:worldPoint.z-p.z},inverse),direction:rotateVehicleVector(relative,inverse),staleGap:distance(worldPoint,manifold.point)});
   });
   for(const {contact,damage}of judge.adjudicate(contacts,tick*dt))if(damage*spec.damageScale>=.1)hits.push({...contact,received:damage*spec.damageScale});
  }
  assert.deepEqual(witnessErrors,[],'flipped witnesses remain on both current collider surfaces');return{hits,witnessChecks};
 }finally{world.removeVehicleController(car.controller);queue.free();world.free();}
}
function repeated(kind:CarKind,armor:number,location:'sill'|'upper'|'centre'){
 const components=freshComponents();let health=100,strikes=0;const history:{point:Vec;health:number;tyres:number[]}[]=[];
 for(let episode=0;episode<24;episode++){
  const result=strike(kind,armor,health,location);if(!result.hits.length)break;strikes++;
  let dying=false;for(const hit of result.hits){if(health-hit.received<=0){dying=true;break;}health-=hit.received;applyComponentImpact(components,kind,hit.point,hit.direction,hit.received);history.push({point:hit.point,health,tyres:[...components.tyreDamage!]});}
  if(dying||components.tyreDamage!.some(d=>tyreFailure(d)===1))break;
 }
 return{health,components,strikes,history};
}

test('real lower-sill impacts reach one tyre before body death across all11 cars and armor3',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){
  const result=repeated(kind,armor,'sill');assert.ok(result.health>0,`${kind}/${armor} must remain driveable`);assert.ok(result.strikes>1,`${kind}/${armor} a modest single contact must not flatten a tyre`);
  assert.equal(tyreFailure(result.components.tyreDamage![0]),1,`${kind}/${armor} actual lower-wheel manifold must reach severe failure while alive`);assert.deepEqual(result.components.tyreDamage!.slice(1),[0,0,0],`${kind}/${armor} other corners remain intact`);
 }
});

test('actual upper-shell impacts and Ravine centre rail do not puncture remote tyres',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3]){const result=repeated(kind,armor,'upper');assert.ok(result.health<95,kind+' fixture really contacts and damages the upper shell');assert.deepEqual(result.components.tyreDamage,[0,0,0,0],kind+' remote upper impact cannot enter a wheel footprint');}
 const centre=repeated('buggy',0,'centre');assert.ok(centre.health<95);assert.deepEqual(centre.components.tyreDamage,[0,0,0,0],'connected lower-wishbone transfer does not cover the central rail');
});

test('physical witnesses preserve flipped participant order and local tyre corner under yaw and roll',()=>{
 const yaw=.73,roll=.42,rotation={x:Math.sin(roll/2)*Math.cos(yaw/2),y:Math.sin(yaw/2)*Math.cos(roll/2),z:-Math.sin(yaw/2)*Math.sin(roll/2),w:Math.cos(roll/2)*Math.cos(yaw/2)};
 for(const kind of ['tern','marten','buggy','hatch']as const)for(const corner of [0,1,2,3]){
  const {hits,witnessChecks}=strike(kind,0,100,'sill',corner,rotation);assert.ok(hits.length&&witnessChecks>0,`${kind}/${corner} physical strike must occur`);assert.ok(hits.some(h=>h.staleGap>.1),'pre-integration solver point is measurably different from the current physical surface');
  const components=freshComponents();for(const hit of hits)applyComponentImpact(components,kind,hit.point,hit.direction,hit.received);
  assert.ok(components.tyreDamage![corner]>0,`${kind}/${corner} correct local corner receives trauma`);for(let i=0;i<4;i++)if(i!==corner)assert.equal(components.tyreDamage![i],0,`${kind}/${corner} no opposite-corner damage`);
 }
});

test('Ravine transfer follows only the authored connected lower wishbones without changing severity',()=>{
 // Lower links: mount(+/-.30,.345,z+/-.21) to hub(+/-.79,.375,z).
 // At lower rail x=.59, link y=.3628 lies .0372m below rail y=.40;
 // their radii .022+.026 overlap. These are actual authored tube coordinates.
 const t=(.59-.30)/(.79-.30),linkY=.345+(.375-.345)*t;assert.ok(.40-linkY<.022+.026);
 for(let corner=0;corner<4;corner++){
  const side=corner%2?1:-1,z=corner<2?1.2:-1.2,point={x:side*.616,y:.40-.96,z:z+.12},direct=[0,0,0,0],transferred=[0,0,0,0];
  accumulateTyreDamage(direct,'buggy',{x:side*.85,y:.40-.96,z},23);accumulateTyreDamage(transferred,'buggy',point,23);assert.equal(transferred[corner],direct[corner],'connected lower-assembly crush uses same structural severity');assert.equal(tyreFailure(transferred[corner]),0,'a single normal capped crash remains below failure');
  for(const remote of [{x:side*.616,y:.40-.96,z:0},{x:side*.616,y:1.10-.96,z:z+.12},{x:0,y:.40-.96,z}]){const damage=[0,0,0,0];accumulateTyreDamage(damage,'buggy',remote,100);assert.deepEqual(damage,[0,0,0,0],'centre/upper/inboard points do not use the lower-arm path');}
 }
});
