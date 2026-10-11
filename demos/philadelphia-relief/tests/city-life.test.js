import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createStreetGraph,createTraffic,trafficPose } from '../src/city-traffic.js';
import { roofDetails,insideRoof } from '../src/roof-details.js';
import { buildLandmarkModels } from '../src/landmark-models.js';
import * as THREE from '../vendor/three.module.min.js';
import { createCityStreets } from '../src/city-streets.js';
import { createCityUniforms } from '../src/city-lighting.js';

const projection={lonToX:x=>x,latToZ:z=>z};
test('landmark façades retain a local anchor far from the scene origin',()=>{
  const packed=buildLandmarkModels({models:[{id:'test',landmark:'test',
    parts:[{type:'box',w:30,d:30,h:100}]}]},
  {anchors:new Map([['test',{lon:1,lat:2}]]),toWorld:()=>[12000,54000],groundAt:()=>5});
  for(let i=0;i<packed.vertexCount;i++){
    assert.equal(packed.facadeOrigin[i*2],12000);assert.equal(packed.facadeOrigin[i*2+1],54000);
    assert.ok(Math.abs(packed.position[i*3]-packed.facadeOrigin[i*2])<=15);
  }
});
test('street graph honors both one-way directions and retains shared intersections',()=>{
  const graph=createStreetGraph({roads:[
    {id:1,oneway:1,width:9,points:[[1,0,0],[2,100,0]]},
    {id:2,oneway:-1,width:9,points:[[2,100,0],[3,100,100]]},
    {id:3,oneway:0,width:12,points:[[2,100,0],[4,200,0]]},
  ]},projection,()=>4);
  assert.deepEqual(graph.edges.map(e=>[e.from.id,e.to.id]),[[1,2],[3,2],[2,4],[4,2]]);
  assert.equal(graph.nodes.get(2).neighbors.size,3);
  const pose=trafficPose({edge:graph.edges[2],distance:50});
  assert.equal(pose.x,150);assert.equal(pose.z,2);assert.equal(pose.ground,4);
});
test('real Philadelphia simulation remains finite and stays on directed streets over ten minutes',async()=>{
  const doc=JSON.parse(await readFile(new URL('../data/city-streets.json',import.meta.url)));
  const p={lonToX:x=>(x+75.17)*85000,latToZ:z=>(39.95-z)*111000};
  const graph=createStreetGraph(doc,p,()=>10),sim=createTraffic(graph,620);
  const initial=sim.cars.map(c=>trafficPose(c));
  let lastMinute;
  for(let i=0;i<12000;i++){
    sim.update(.05,{x:382,z:-56,radius:2070});
    if(i===10799)lastMinute=sim.cars.map(trafficPose);
  }
  let moved=0,recentlyMoved=0;
  for(const [i,car] of sim.cars.entries()){
    assert.ok(car.distance>=0&&car.distance<=car.edge.length);
    assert.ok(car.edge.from.out.includes(car.edge));
    const pos=trafficPose(car);assert.ok(Number.isFinite(pos.x+pos.z+pos.angle));
    if(Math.hypot(pos.x-initial[i].x,pos.z-initial[i].z)>20)moved++;
    if(Math.hypot(pos.x-lastMinute[i].x,pos.z-lastMinute[i].z)>20)recentlyMoved++;
  }
  assert.ok(moved>sim.cars.length*.8,`${moved} moving vehicles`);
  assert.ok(recentlyMoved>sim.cars.length*.6,`${recentlyMoved} vehicles moving in the final minute`);
});
test('turns retain position and heading through the street boundary, including U-turns',()=>{
  for(const end of [[100,100],[100,-100],[200,0],[0,0]]){
    const graph=createStreetGraph({roads:[{id:1,oneway:1,width:10,
      points:[[1,0,0],[2,100,0],[3,...end]]}]},projection,()=>4);
    const [incoming,outgoing]=graph.edges;
    const pose=distance=>trafficPose(distance<0
      ?{edge:incoming,distance:incoming.length+distance,nextEdge:outgoing}
      :{edge:outgoing,distance,previousEdge:incoming});
    let previous=pose(-15);
    for(let d=-14.9;d<=15;d+=.1){
      const current=pose(d),angle=Math.atan2(Math.sin(current.angle-previous.angle),
        Math.cos(current.angle-previous.angle));
      assert.ok(Math.hypot(current.x-previous.x,current.z-previous.z)<.2,'no position jump');
      assert.ok(Math.abs(angle)<.2,'no heading snap');
      assert.equal(current.ground,4);
      previous=current;
    }
    const before=pose(-.00001),after=pose(.00001);
    assert.ok(Math.hypot(after.x-before.x,after.z-before.z)<.0001);
    assert.ok(Math.abs(Math.atan2(Math.sin(after.angle-before.angle),Math.cos(after.angle-before.angle)))<.0001);
  }
});
test('traffic advances the same elapsed time at 10 fps and 20 fps, and ignores invalid deltas',()=>{
  const graph=createStreetGraph({roads:[{id:1,oneway:1,width:10,
    points:[[1,0,0],[2,100,0],[3,100,100],[4,0,100],[1,0,0]]}]},projection,()=>4);
  const fast=createTraffic(graph,12,239),slow=createTraffic(graph,12,239);
  for(let i=0;i<600;i++)fast.update(.05);
  for(let i=0;i<300;i++)slow.update(.1);
  const snapshot=sim=>sim.cars.map(car=>[car.edge.id,car.distance,car.speed,trafficPose(car)]);
  assert.deepEqual(snapshot(slow),snapshot(fast));
  const prior=snapshot(slow);
  for(const dt of [NaN,Infinity,-1,0])slow.update(dt);
  assert.deepEqual(snapshot(slow),prior);
});
test('cars yield before a multi-node junction until the crossing vehicle clears',()=>{
  const graph=createStreetGraph({roads:[
    {id:1,oneway:1,width:10,points:[[1,-100,0],[2,0,0],[3,4,0],[4,104,0]]},
    {id:2,oneway:1,width:10,points:[[5,4,-100],[3,4,0],[6,4,100]]},
  ]},projection,()=>4);
  assert.equal(graph.nodes.get(2).junction,graph.nodes.get(3).junction);
  const sim=createTraffic(graph,2);
  for(const [i,car] of sim.cars.entries())Object.assign(car,{edge:graph.edges[i?3:0],
    distance:80,speed:6,cruise:8,previousEdge:null,nextEdge:graph.edges[i?4:1]});
  let closest=Infinity;
  for(let i=0;i<1200;i++){
    sim.update(.05,{x:0,z:0,radius:1000});
    const [a,b]=sim.cars.map(trafficPose);
    closest=Math.min(closest,Math.hypot(a.x-b.x,a.z-b.z));
  }
  assert.ok(closest>4,`vehicles kept only ${closest.toFixed(2)} metres apart`);
  assert.ok(sim.cars.every(car=>car.edge.from.id===3),'both vehicles eventually pass the junction');
});
test('traffic leaving the cropped network replenishes only outside the visible neighborhood',()=>{
  const graph=createStreetGraph({roads:[{id:1,oneway:1,width:10,
    points:[[1,0,0],[2,100,0],[3,200,0]]}]},projection,()=>0);
  const sim=createTraffic(graph,1),car=sim.cars[0],seed=car.seed;
  Object.assign(car,{edge:graph.edges[1],distance:100,speed:0,previousEdge:graph.edges[0],nextEdge:null});
  for(let i=0;i<200;i++)sim.update(.05,{x:200,z:0,radius:30});
  assert.equal(car.edge,graph.edges[1],'a visible car must never teleport');
  for(let i=0;i<40;i++)sim.update(.05,{x:50,z:0,radius:60});
  assert.equal(car.edge,graph.edges[1],'no replacement may appear inside the displayed neighborhood');
  for(let i=0;i<40;i++)sim.update(.05,{x:1000,z:0,radius:30});
  assert.equal(car.edge,graph.edges[0],'offscreen exits are replenished on an open street');
  assert.equal(car.seed,seed,'the replacement keeps the vehicle appearance');
  assert.ok(car.distance>0&&car.distance<100);
});
test('closely sampled street nodes form bounded junctions rather than one region-wide lock',()=>{
  const points=Array.from({length:30},(_,i)=>[i,i*3,0]);
  const graph=createStreetGraph({roads:[{id:1,oneway:1,width:8,points}]},projection,()=>0);
  const groups=new Map();
  for(const node of graph.nodes.values()){
    const xs=groups.get(node.junction)||[];xs.push(node.x);groups.set(node.junction,xs);
  }
  assert.ok(groups.size>1);
  for(const xs of groups.values())assert.ok(Math.max(...xs)-Math.min(...xs)<=18);
});
test('unchanged street furniture is retained, while a new view radius rebuilds it',async()=>{
  const previousFetch=globalThis.fetch;
  globalThis.fetch=async()=>({ok:true,json:async()=>({roads:[{id:1,oneway:0,width:10,
    points:[[1,0,0],[2,100,0],[3,200,0]]}]})});
  const scene=new THREE.Scene();
  const streets=createCityStreets(THREE,{scene,
    projection:{...projection,xToLon:x=>x,zToLat:z=>z},sampleElevation:()=>4,
    lighting:{uniforms:createCityUniforms(THREE)}});
  try{
    const params={camera:{position:new THREE.Vector3(50,500,500)},
      pose:{lon:50,lat:0,dist:900},state:{era:'present',compareMode:'off',lightweight:false,
        layers:{structures:true},streetLife:true,animationSpeed:1},
      exaggeration:1,sunDir:new THREE.Vector3(.3,1,0),dt:1.01,reducedMotion:true,archive:false,quality:'balanced'};
    streets.update(params);await new Promise(resolve=>setImmediate(resolve));streets.update(params);
    const furniture=streets.group.children[0],vehicles=streets.group.children[2];
    assert.ok(furniture.count>0);
    assert.ok(vehicles.instanceMatrix.count>=620*10,'complete vehicles fit the simulation budget');
    assert.equal(vehicles.count%10,0,'cars include wheels, headlamps and tail lamps');
    const matrix=new THREE.Matrix4(),position=new THREE.Vector3(),scale=new THREE.Vector3();
    const rotation=new THREE.Quaternion();
    for(let car=0;car<vehicles.count;car+=10)for(let wheel=2;wheel<6;wheel++){
      vehicles.getMatrixAt(car+wheel,matrix);matrix.decompose(position,rotation,scale);
      const bottom=position.y-scale.y/2;
      assert.ok(bottom>=4&&bottom<4.05,'tires contact the sampled road surface');
    }
    assert.equal(vehicles.instanceMatrix.updateRanges[0].count,vehicles.count*16);
    assert.equal(vehicles.instanceColor.updateRanges[0].count,vehicles.count*3);
    const version=furniture.instanceMatrix.version;
    const vehicleVersion=vehicles.instanceMatrix.version;
    for(let i=0;i<20;i++)streets.update(params);
    assert.equal(furniture.instanceMatrix.version,version,'idle view does not re-upload unchanged streets');
    assert.equal(vehicles.instanceMatrix.version,vehicleVersion,'reduced-motion cars retain their GPU buffers');
    streets.update({...params,reducedMotion:false,state:{...params.state,animationSpeed:0}});
    assert.equal(vehicles.instanceMatrix.version,vehicleVersion,'paused traffic retains its GPU buffers');
    streets.update({...params,reducedMotion:false,dt:.1});
    assert.ok(vehicles.instanceMatrix.version>vehicleVersion,'moving cars still upload their new poses');
    streets.update({...params,pose:{...params.pose,dist:2400}});
    assert.ok(furniture.instanceMatrix.version>version,'zooming out refreshes the wider neighborhood');
  }finally{streets.dispose();globalThis.fetch=previousFetch;}
});
test('roof equipment stays inside concave footprints and keeps the original roof elevation',()=>{
  const poly=[0,0,30,0,30,10,10,10,10,30,0,30];
  assert.equal(insideRoof(20,20,poly),false);
  const {parts,ends}=roofDetails([{poly,height:20,minHeight:5,year:1900}]);
  assert.equal(ends[0],6); // centroid is outside the L-shaped roof, so no invented floating equipment.
  assert.ok(parts.every(p=>p.minHeight===25&&p.year===1900));
  const rect=roofDetails([{poly:[0,0,30,0,30,20,0,20],height:20,minHeight:0}]);
  assert.equal(rect.parts.length,6);
  assert.equal(rect.parts.at(-1).minHeight,21.35);
});

test('street curbs follow sloping and curved terrain instead of hovering at the average height',async()=>{
  const previousFetch=globalThis.fetch;
  globalThis.fetch=async()=>({ok:true,json:async()=>({roads:[{id:1,oneway:0,width:10,
    points:[[1,0,0],[2,160,0]]}]})});
  const sample=(x,z)=>4+.06*x+.02*z+1.2*Math.sin(x/40);
  const streets=createCityStreets(THREE,{scene:new THREE.Scene(),
    projection:{...projection,xToLon:x=>x,zToLat:z=>z},sampleElevation:sample,
    lighting:{uniforms:createCityUniforms(THREE)}});
  try{
    const params={camera:{position:new THREE.Vector3(50,500,500)},pose:{lon:50,lat:0,dist:900},
      state:{era:'present',compareMode:'off',lightweight:false,layers:{structures:true},streetLife:true,
        animationSpeed:1},exaggeration:2,sunDir:new THREE.Vector3(.3,1,0),dt:1.01,
      reducedMotion:true,archive:false,quality:'balanced'};
    streets.update(params);await new Promise(resolve=>setImmediate(resolve));streets.update(params);
    const furniture=streets.group.children[0],matrix=new THREE.Matrix4();
    const position=new THREE.Vector3(),scale=new THREE.Vector3(),rotation=new THREE.Quaternion();
    let curbs=0;
    for(let i=0;i<furniture.count;i++){
      furniture.getMatrixAt(i,matrix);matrix.decompose(position,rotation,scale);
      if(Math.abs(scale.x-.35)>.001||Math.abs(scale.y-.24)>.001)continue;
      curbs++;
      for(const along of [-.5,0,.5]){
        const top=new THREE.Vector3(0,0,along).applyMatrix4(matrix);
        assert.ok(Math.abs(top.y-sample(top.x,top.z)*2-.48)<.13,
          'each curb joint and midpoint stays on the sampled surface');
      }
    }
    assert.ok(curbs>4,'long, curved streets receive enough joints to follow the terrain');
    assert.ok(furniture.count<furniture.instanceMatrix.count);
    const vehicles=streets.group.children[2];
    assert.ok(vehicles.count>0);
    for(let car=0;car<vehicles.count;car+=10)for(let wheel=2;wheel<6;wheel++){
      vehicles.getMatrixAt(car+wheel,matrix);
      const bottom=new THREE.Vector3(0,-.5,0).applyMatrix4(matrix);
      assert.ok(Math.abs(bottom.y-sample(bottom.x,bottom.z)*2)<.09,
        'front and rear tyres follow the grade in either driving direction');
    }
  }finally{streets.dispose();globalThis.fetch=previousFetch;}
});
