import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as THREE from '../vendor/three.module.min.js';
import { createStreetGraph } from '../src/city-traffic.js';
import { createSidewalkRoutes, sidewalkPose, walkerTravel, walkersForRoutes } from '../src/city-walkers.js';
import { createCityStreets } from '../src/city-streets.js';
import { createCityUniforms } from '../src/city-lighting.js';

const projection={lonToX:x=>x,latToZ:z=>z,xToLon:x=>x,zToLat:z=>z};
const square={roads:[{id:1,oneway:1,width:10,points:[[1,0,0],[2,100,0],[3,100,100],[4,0,100],[1,0,0]]}]};

test('walkers use the inside sidewalks of a closed block, independent of vehicle one-way rules',()=>{
  const routes=createSidewalkRoutes(createStreetGraph(square,projection,()=>0));
  assert.equal(routes.length,1,'the unbounded outside face is excluded');
  const route=routes[0];
  for(let d=0;d<route.length;d+=.2){
    const p=sidewalkPose(route,d);
    assert.ok(p.x>=5.79&&p.x<=94.21&&p.z>=5.79&&p.z<=94.21);
    assert.ok(Math.min(p.x,100-p.x,p.z,100-p.z)<6.1,'the route stays on the pavement');
    const next=sidewalkPose(route,d+.01);
    assert.ok(Math.hypot(next.x-p.x,next.z-p.z)<.012,'motion remains continuous at corners and the loop seam');
    const turn=Math.atan2(Math.sin(next.angle-p.angle),Math.cos(next.angle-p.angle));
    assert.ok(Math.abs(turn)<.06,'headings follow rounded corners');
  }
  const reversed={roads:[{...square.roads[0],points:[...square.roads[0].points].reverse()}]};
  assert.ok(Math.abs(createSidewalkRoutes(createStreetGraph(reversed,projection,()=>0))[0].length-route.length)<1e-8);
});

test('open roads, tiny traffic islands, dead ends and acute offset folds do not become walking circuits',()=>{
  for(const points of [square.roads[0].points.slice(0,-1),
    [[1,0,0],[2,10,0],[3,10,10],[4,0,10],[1,0,0]],
    [[1,0,0],[2,200,0],[3,1,20],[1,0,0]],
    [[1,0,0],[2,100,0],[3,100,100],[4,50,100],[5,50,80],[4,50,100],[6,0,100],[1,0,0]]]){
    const graph=createStreetGraph({roads:[{id:1,oneway:0,width:10,points}]},projection,()=>0);
    assert.equal(createSidewalkRoutes(graph).length,0);
  }
});

test('walkers ease into independent inspection pauses without losing traveled distance',()=>{
  for(const seed of [.03,.37,.89]){
    let pauses=0,steps=0;
    for(let t=0;t<180;t+=.025){
      const a=walkerTravel(t,seed),b=walkerTravel(t+.025,seed);
      assert.ok(b.distance>=a.distance&&b.distance-a.distance<.041);
      assert.ok(Math.abs(b.pace-a.pace)<.033);
      if(a.pace===0)pauses++;else steps++;
    }
    assert.ok(pauses>100&&steps>1000);
  }
  assert.ok(Array.from({length:120},(_,time)=>time).some(time=>
    walkerTravel(time,.03).pace!==walkerTravel(time,.89).pace),'pauses are not synchronized');
});

test('a road cutting through a mapped block cannot leave a walking path across its carriageway',()=>{
  const graph=createStreetGraph({roads:[...square.roads,
    {id:2,oneway:0,width:10,points:[[5,-20,50],[6,120,50]]}]},projection,()=>0);
  assert.equal(createSidewalkRoutes(graph).length,0);
});

test('real Philadelphia walking circuits remain finite through ten simulated minutes and bound the visible population',async()=>{
  const doc=JSON.parse(await readFile(new URL('../data/city-streets.json',import.meta.url)));
  const projection={lonToX:x=>(x+75.17)*85000,latToZ:z=>(39.95-z)*111000};
  const graph=createStreetGraph(doc,projection,()=>10),routes=createSidewalkRoutes(graph);
  assert.ok(routes.length>500&&routes.length<2000);
  const cells=new Map();
  for(const edge of graph.segments){
    for(let x=Math.floor((Math.min(edge.a.x,edge.b.x)-20)/50);x<=Math.floor((Math.max(edge.a.x,edge.b.x)+20)/50);x++){
      for(let z=Math.floor((Math.min(edge.a.z,edge.b.z)-20)/50);z<=Math.floor((Math.max(edge.a.z,edge.b.z)+20)/50);z++){
        const key=`${x}:${z}`,bucket=cells.get(key)||[];bucket.push(edge);cells.set(key,bucket);
      }
    }
  }
  for(const route of routes)for(let d=.37;d<route.length;d+=3.1){
    const p=sidewalkPose(route,d);
    for(const edge of cells.get(`${Math.floor(p.x/50)}:${Math.floor(p.z/50)}`)||[]){
      const dx=edge.b.x-edge.a.x,dz=edge.b.z-edge.a.z;
      const t=Math.max(0,Math.min(1,((p.x-edge.a.x)*dx+(p.z-edge.a.z)*dz)/(dx*dx+dz*dz)));
      assert.ok(Math.hypot(p.x-edge.a.x-dx*t,p.z-edge.a.z-dz*t)>edge.width/2+.5,
        'walking circuits leave room outside every mapped carriageway');
    }
  }
  const walkers=walkersForRoutes(routes,0,0,600);
  assert.ok(walkers.length>40&&walkers.length<=240);
  assert.deepEqual(walkersForRoutes(routes,0,0,600),walkers,'revisiting a view keeps the same residents');
  for(let t=0;t<=600;t+=.5)for(const walker of walkers){
    const travel=walkerTravel(t,walker.seed);
    const p=sidewalkPose(walker.route,walker.offset+walker.direction*travel.distance,walker.direction);
    assert.ok(Number.isFinite(p.x+p.z+p.angle));
    const b=walker.route.bounds;
    assert.ok(p.x>=b[0]-1e-6&&p.x<=b[2]+1e-6&&p.z>=b[1]-1e-6&&p.z<=b[3]+1e-6);
  }
});

test('rendered pedestrians stand on local pavement and retain GPU buffers when motion is paused',async()=>{
  const previousFetch=globalThis.fetch;
  globalThis.fetch=async()=>({ok:true,json:async()=>square});
  const sample=(x,z)=>4+.02*x+.015*z;
  const streets=createCityStreets(THREE,{scene:new THREE.Scene(),projection,sampleElevation:sample,
    lighting:{uniforms:createCityUniforms(THREE)}});
  const params={camera:{position:new THREE.Vector3(50,100,150)},pose:{lon:50,lat:50,dist:220},
    state:{era:'present',compareMode:'off',lightweight:false,layers:{structures:true},streetLife:true,animationSpeed:1},
    exaggeration:2,sunDir:new THREE.Vector3(.3,1,0),dt:.1,reducedMotion:true,archive:false,quality:'balanced'};
  try{
    streets.update(params);await new Promise(resolve=>setImmediate(resolve));streets.update(params);
    const people=streets.group.getObjectByName('sidewalk-walkers'),heads=streets.group.getObjectByName('sidewalk-walker-heads');
    assert.ok(heads.count>0);assert.equal(people.count,heads.count*5);
    const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),rotation=new THREE.Quaternion(),scale=new THREE.Vector3();
    for(let i=0;i<heads.count;i++){
      people.getMatrixAt(i*5,matrix);matrix.decompose(position,rotation,scale);
      const size=scale.y/.62;
      assert.ok(Math.abs(position.y-(sample(position.x,position.z)*2+.47+1.08*size))<.001);
    }
    const version=people.instanceMatrix.version;streets.update(params);
    assert.equal(people.instanceMatrix.version,version);
    streets.update({...params,reducedMotion:false,state:{...params.state,animationSpeed:0}});
    assert.equal(people.instanceMatrix.version,version);
    streets.update({...params,reducedMotion:false});
    assert.ok(people.instanceMatrix.version>version);
    streets.update({...params,pose:{...params.pose,dist:2200}});
    assert.equal(people.visible,false);assert.equal(heads.visible,false);
  }finally{streets.dispose();globalThis.fetch=previousFetch;}
});
