/** Deterministic normal-chase inspection poses, followed by real16-second
 * Vehicle settling. No browser, accelerated clock, camera override or runtime edit.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {quarryColliderLayout,quarryRim,createQuarryPhysics,scenerySurfaceHeight,quarryExtensionHeight} from '../src/quarry-layout';
import {backdropGroundHeight} from '../src/scenery-backdrop';
import {readForestFile,forestHash} from './north-forest-edge-audit';

export function chaseView(x:number,y:number,z:number,yaw:number,trees:any[]){
  const forward=new T.Vector3(Math.sin(yaw),0,Math.cos(yaw)),target=new T.Vector3(x,y,z),camera=new T.PerspectiveCamera(52,2560/1440,.1,850);
  camera.position.copy(target).addScaledVector(forward,-7.4).add(new T.Vector3(0,2.65,0));
  const floor=Math.max(scenerySurfaceHeight(camera.position.x,camera.position.z),quarryExtensionHeight(camera.position.x,camera.position.z)??-Infinity);
  camera.position.y=Math.max(camera.position.y,floor+.65);camera.lookAt(target.clone().addScaledVector(forward,4).add(new T.Vector3(0,.5,0)));camera.updateMatrixWorld();
  const seen=trees.flatMap(tree=>{
    const center=new T.Vector3(tree.x,tree.y+tree.height*.5,tree.z),distance=center.distanceTo(camera.position);
    for(const fraction of [.5,.25,.75]){
      const sample=new T.Vector3(tree.x,tree.y+tree.height*fraction,tree.z),projected=sample.clone().project(camera);
      if(projected.z<0||projected.z>1||Math.abs(projected.x)>.8||Math.abs(projected.y)>.85)continue;
      const rayClear=Array.from({length:23},(_,i)=>(i+1)/24).every(t=>{const p=camera.position.clone().lerp(sample,t);return p.y>backdropGroundHeight(p.x,p.z)+.1;});
      if(rayClear)return [{id:tree.id,stand:tree.stand,distance,ndc:projected.toArray(),visibleHeightFraction:fraction,mode:distance<65?'geometry':distance<=90?'transition':'atlas'}];
    }
    return [];
  });
  return {position:camera.position.toArray(),lookAt:target.clone().addScaledVector(forward,4).add(new T.Vector3(0,.5,0)).toArray(),fov:52,visibleTrees:seen};
}

export function prepareNorthRidgeStops(){
  const data=JSON.parse(readForestFile('src/quarry-north-backdrop.json').toString()),layout=quarryColliderLayout();
  const trunks=layout.filter(c=>c.id.startsWith('tree-')&&c.shape==='cylinder');
  const stops=[{id:'ridge-close',stand:'stand-1',distance:52,mode:'geometry'},
    {id:'ridge-transition',stand:'stand-5',distance:77,mode:'transition'}].map(spec=>{
    const candidates:any[]=[];
    for(const tree of data.trees.filter((t:any)=>t.stand===spec.stand)){
      const r=Math.hypot(tree.x,tree.z),nx=tree.x/r,nz=tree.z/r;
      for(const adjust of [0,-4,4,-8,8])for(const side of [0,-4,4,-8,8,-12,12]){
        const front=spec.distance-7.4+adjust,x=tree.x-nx*front+nz*side,z=tree.z-nz*front-nx*side,radius=Math.hypot(x,z);
        if(radius>247.5)continue;
        const ground=backdropGroundHeight(x,z),yaw=Math.atan2(tree.x-x,tree.z-z),rimMargin=Math.hypot(x/1.08,z)-quarryRim(Math.atan2(x/1.08,z)).r;
        const clearance=Math.min(...trunks.map(t=>Math.hypot(x-t.p.x,z-t.p.z)-(t.shape==='cylinder'?t.radius:0)));
        const slope=Math.hypot((backdropGroundHeight(x+2,z)-backdropGroundHeight(x-2,z))/4,(backdropGroundHeight(x,z+2)-backdropGroundHeight(x,z-2))/4);
        if(rimMargin<8||clearance<4.3||slope>.28)continue;
        const camera=chaseView(x,ground+.6,z,yaw,data.trees),seen=camera.visibleTrees.filter((p:any)=>p.stand===spec.stand&&p.mode===spec.mode);
        if(seen.length<1||!seen.some((p:any)=>p.id===tree.id))continue;
        const desired=seen.find((p:any)=>p.id===tree.id).distance;
        const score=seen.length*5+Math.min(clearance,8)-Math.abs(desired-spec.distance)-slope*8;
        candidates.push({id:spec.id,kind:'ridge',targetCenter:[tree.x,tree.y+tree.height*.5,tree.z],expectedDistanceBand:spec.mode==='geometry'?[0,65]:[65,90],standId:spec.stand,requiredMode:spec.mode,targetTree:tree.id,x,z,ground,yaw,radius,recoveryMargin:255-radius,rimMargin,trunkClearance:clearance,slope,camera,score});
      }
    }
    candidates.sort((a,b)=>b.score-a.score);assert.ok(candidates.length,'No safe normal-chase pose for '+spec.id);
    return candidates[0];
  });
  return {kind:'north-ridge-normal-chase-placement-preflight',placementsSHA256:forestHash(readForestFile('src/quarry-north-backdrop.json')),
    foregroundSHA256:forestHash(readForestFile('src/quarry-north-forest.json')),layoutSHA256:forestHash(readForestFile('src/quarry-layout.ts')),stops,
    proposedSchedule:{block:2,startFraction:.41,durationSeconds:80,stopSeconds:16,description:'Append these two normal-chase ridge stops to the three unchanged existing forest stops in the middle derby block; preserve both race blocks, eight live cars and every prior coverage assertion.'},
    browserLaunched:false,measuredFrames:0};
}

export async function auditNorthRidgeStops(plan=prepareNorthRidgeStops()){
  await R.init();const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}templates.set('coupe',model);
  const data=JSON.parse(readForestFile('src/quarry-north-backdrop.json').toString()),results:any[]=[];
  for(const stop of plan.stops){
    const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
    const physics=createQuarryPhysics(R,world,true),ids=new Map([...physics.statics].map(([id,c])=>[c.handle,id])),trees=[...physics.statics].filter(([id])=>id.startsWith('tree-'));
    const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);
    const contacts=new Set<string>(),sampledViews:any[]=[];let maxRadius=0,maxDrift=0,maxSettledSpeed=0,minGroundContacts=4,nearest={distance:Infinity,id:'',seconds:0};
    try{
      car.place(stop.x,stop.z,stop.yaw);const initial={...car.body.translation()};
      for(let step=0;step<960;step++){
        car.input={throttle:0,brake:1,steer:0,handbrake:false};car.preStep(1/60);world.step();car.postStep(1/60,step/60);
        const p=car.body.translation(),velocity=car.body.linvel();maxRadius=Math.max(maxRadius,Math.hypot(p.x,p.z));maxDrift=Math.max(maxDrift,Math.hypot(p.x-stop.x,p.z-stop.z));
        if(step>=300){maxSettledSpeed=Math.max(maxSettledSpeed,Math.hypot(velocity.x,velocity.y,velocity.z));minGroundContacts=Math.min(minGroundContacts,Array.from({length:4},(_,i)=>Number(car.controller.wheelIsInContact(i))).reduce((a,b)=>a+b));}
        for(const body of [car.collider,car.roof]){
          world.contactPairsWith(body,other=>{const id=ids.get(other.handle);if(id?.startsWith('tree-'))world.contactPair(body,other,m=>{if(m.numSolverContacts())contacts.add(id);});});
          if(step%60===0||step===959)for(const [id,tree]of trees){const contact=body.contactCollider(tree,12);if(contact&&contact.distance<nearest.distance)nearest={distance:contact.distance,id,seconds:(step+1)/60};}
        }
        if([359,599,959].includes(step)){
          const forward=new T.Vector3(0,0,1).applyQuaternion(new T.Quaternion().copy(car.body.rotation()));
          sampledViews.push({seconds:(step+1)/60,...chaseView(p.x,p.y,p.z,Math.atan2(forward.x,forward.z),data.trees)});
        }
      }
      const result={id:stop.id,initial,final:{...car.body.translation()},maximumRadius:maxRadius,minimumRecoveryMargin:255-maxRadius,maximumPlanarDrift:maxDrift,maximumSettledSpeed:maxSettledSpeed,minimumSettledWheelContacts:minGroundContacts,nearestTreeProxy:nearest,treeContactIds:[...contacts],sampledViews,seconds:16,simulationSteps:960};results.push(result);
      assert.ok(maxRadius<250,'settled car remains safely inside255m recovery boundary');assert.ok(maxDrift<1);assert.ok(maxSettledSpeed<.3);assert.ok(minGroundContacts>=3);
      assert.equal(contacts.size,0);assert.ok(nearest.distance>.5);
      for(const view of sampledViews)assert.ok(view.visibleTrees.filter((p:any)=>p.id===stop.targetTree&&p.mode===stop.requiredMode).length===1,'normal chase retains the specified target crown sample and LOD distance after settling');
    }finally{car.dispose();world.free();}
  }
  return {checkedAt:new Date().toISOString(),kind:'actual-vehicle-ridge-stop-contact-audit',vehicleSHA256:forestHash(readForestFile('src/vehicle.ts')),plan,results,browserLaunched:false,measuredPerformanceFrames:0};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const output=process.argv[2];assert.ok(output,'Pass a unique output report path');assert.equal(fs.existsSync(output),false);
  const report=await auditNorthRidgeStops();fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,stops:report.results.map(r=>({id:r.id,maximumRadius:r.maximumRadius,maximumPlanarDrift:r.maximumPlanarDrift,nearestTreeProxy:r.nearestTreeProxy,settledWheelContacts:r.minimumSettledWheelContacts,views:r.sampledViews.map((v:any)=>({seconds:v.seconds,geometry:v.visibleTrees.filter((t:any)=>t.mode==='geometry').length,transition:v.visibleTrees.filter((t:any)=>t.mode==='transition').length}))}))},null,2));
}
