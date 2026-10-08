import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import * as G from '../src/trial-ghost';
import {TrialGhostView} from '../src/trial-ghost-view';
import {CAR_KINDS} from '../src/rules';
import {COURSE_NAMES} from '../src/course-id';
import type {TimeTrialConfig,TimeTrialResult} from '../src/time-trial';
const config:TimeTrialConfig={kind:'tern',course:'redbank-jump-v1',direction:'forward'};
const result:TimeTrialResult={status:'finished',eligible:true,reason:'',time:24,previousBest:null,best:24,delta:null,newBest:true};
function lap(selected=config){
 const r=new G.TrialGhostRecorder(selected),p=new T.Vector3(),q=new T.Quaternion();
 for(let i=0;i<=1440;i++){const t=i/60;p.set(t,1,t*2);r.sample(t,p,q);if(i&&i%60===0)r.gate(i/60,t);}
 const ghost=r.finish(24,p,q);assert.ok(ghost);return ghost;
}
test('complete fixed-step laps retain all gate times and bounded 10 Hz poses for all 110 categories',()=>{
 let count=0;
 for(const kind of CAR_KINDS)for(const course of Object.keys(COURSE_NAMES))for(const direction of ['forward','reverse'] as const){
  const g=lap({kind,course:course as TimeTrialConfig['course'],direction});assert.equal(g.frames.length,241);assert.equal(g.gates.length,24);assert.equal(g.time,24);count++;
 }
 assert.equal(count,110);
});
test('only eligible new PBs replace matching ghosts; bad or overlong recordings remove stale ghosts without touching other categories',()=>{
 const a=lap(),b=lap({...config,direction:'reverse'}),library:G.GhostLibrary={version:1,enabled:true,ghosts:[a,b]};
 for(const r of [{...result,newBest:false},{...result,eligible:false}])assert.equal(G.settleTrialGhost(library,config,r,a),library);
 const next=G.settleTrialGhost(library,config,{...result,time:23,best:23},a);assert.deepEqual(next.ghosts,[b]);
 assert.equal(G.findTrialGhost(library,config,24),a);assert.equal(G.findTrialGhost(library,config,23),null);
 assert.equal(G.findTrialGhost(library,{...config,kind:'coupe'},24),null);
 const r=new G.TrialGhostRecorder(config);r.sample(601,new T.Vector3(),new T.Quaternion());assert.equal(r.finish(601,new T.Vector3(),new T.Quaternion()),null);
});
test('load rejects malformed and sparse timelines, missing gates, invalid poses and duplicate categories while recovering good entries',()=>{
 const g=lap();
 for(const mutate of [(v:any)=>v.frames[1][0]=0,(v:any)=>v.frames[1][0]=4,(v:any)=>v.frames[1][4]=NaN,(v:any)=>v.frames[1][7]=0,(v:any)=>v.gates.pop(),(v:any)=>v.gates[3]=v.gates[2],(v:any)=>v.config.course='unknown',(v:any)=>v.time=25]){
  const bad=structuredClone(g);mutate(bad);assert.equal(G.validTrialGhost(bad),false);assert.deepEqual(G.readGhostLibrary(JSON.stringify({version:1,enabled:false,ghosts:[bad,g,g]})),{version:1,enabled:false,ghosts:[g]});
 }
 assert.equal(G.readGhostLibrary('{').ghosts.length,0);assert.equal(G.loadGhostLibrary({getItem(){throw Error();}}).enabled,true);
});
test('bounded ghost library evicts oldest entries independently of numeric PBs, persists toggles and handles quota failure',()=>{
 let library:G.GhostLibrary={version:1,enabled:false,ghosts:[]};
 for(const kind of CAR_KINDS)for(const direction of ['forward','reverse'] as const){const c={...config,kind,direction};library=G.settleTrialGhost(library,c,result,lap(c));}
 assert.equal(library.ghosts.length,16);assert.equal(library.enabled,false);
 let text='';assert.equal(G.saveGhostLibrary(library,{setItem(_key,value){text=value;}}),true);assert.deepEqual(G.readGhostLibrary(text),library);
 assert.equal(G.saveGhostLibrary(library,{setItem(){throw Error('quota');}}),false);
 assert.equal(G.readGhostLibrary(' '.repeat(G.MAX_GHOST_BYTES+1)).ghosts.length,0);
 // Long recordings exercise the total storage budget, not only the 16-item cap.
 const long=lap();long.time=600;long.frames=[];for(let i=0;i<=6000;i++)long.frames.push([i/10,123.1234,4.5678,987.6543,0,0,0,1]);long.gates=Array.from({length:24},(_,i)=>(i+1)*25);
 assert.ok(G.validTrialGhost(long));library={version:1,enabled:true,ghosts:[]};
 for(const kind of CAR_KINDS){const c={...config,kind};library=G.settleTrialGhost(library,c,{...result,time:600,best:600},{...long,config:c});}
 assert.ok(library.ghosts.length<11);assert.ok(JSON.stringify(library).length<=G.MAX_GHOST_BYTES);assert.equal(library.ghosts.at(-1)?.config.kind,CAR_KINDS.at(-1));
});
test('interpolation follows position and shortest quaternion arc with repeatable backward seeks and endpoint visibility',()=>{
 const ghost=lap();ghost.frames[1]=[.1,.1,1,.2,0,0,0,-1];
 const pose=G.sampleTrialGhost(ghost,.05)!;assert.deepEqual(pose.position,[.05,1,.1]);assert.deepEqual(pose.quaternion,[0,0,0,1]);
 assert.deepEqual(G.sampleTrialGhost(ghost,18.45)!.position,[18.45,1,36.9]);assert.deepEqual(G.sampleTrialGhost(ghost,.05),pose);
 assert.equal(G.sampleTrialGhost(ghost,-1),null);assert.equal(G.sampleTrialGhost(ghost,24.001),null);assert.equal(G.sampleTrialGhost(ghost,NaN),null);assert.ok(G.sampleTrialGhost(ghost,24));
});
test('ghost silhouette owns one mesh, cannot receive rays, preserves source geometry and disposes only its own resources',()=>{
 const scene=new T.Scene(),car=new T.Group(),model=new T.Group(),geometry=new T.BoxGeometry(2,1,4),material=new T.MeshStandardMaterial();
 car.position.set(5,2,3);model.position.y=-.5;model.add(new T.Mesh(geometry,material));car.add(model);scene.add(car);
 const before=Array.from(geometry.attributes.position.array),view=new TrialGhostView(scene,car,lap());
 assert.equal(view.mesh.geometry.getAttribute('position').count,geometry.attributes.position.count);assert.equal(view.mesh.parent,scene);assert.equal(view.mesh.castShadow,false);assert.equal(view.mesh.receiveShadow,false);
 view.update(2,true,new T.Vector3(2,1,4));assert.equal(view.mesh.visible,true);assert.deepEqual(view.mesh.position.toArray(),[2,1,4]);assert.equal(view.mesh.material.opacity,.04);
 const ray=new T.Raycaster(new T.Vector3(2,1,-10),new T.Vector3(0,0,1));assert.equal(ray.intersectObject(view.mesh).length,0);
 view.update(2,false,new T.Vector3());assert.equal(view.mesh.visible,false);view.update(25,true,new T.Vector3());assert.equal(view.mesh.visible,false);
 let own=0,shared=0;view.mesh.geometry.addEventListener('dispose',()=>own++);view.mesh.material.addEventListener('dispose',()=>own++);geometry.addEventListener('dispose',()=>shared++);material.addEventListener('dispose',()=>shared++);
 view.dispose();assert.equal(own,2);assert.equal(shared,0);assert.deepEqual(Array.from(geometry.attributes.position.array),before);assert.deepEqual(scene.children,[car]);
});
