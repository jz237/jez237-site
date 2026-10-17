import test from 'node:test';
import assert from 'node:assert/strict';
import {OffroadMarker} from '../src/offroad-marker';
const course={halfWidth:7,distance:(_x:number,z:number)=>Math.abs(z)};
test('stores departure, tolerates shoulder jitter, and clears on rejoining',()=>{
 const marker=new OffroadMarker();
 assert.equal(marker.update(course,0,{x:10,z:6}),undefined);
 assert.equal(marker.update(course,0,{x:11,z:8}),undefined);
 assert.deepEqual(marker.update(course,0,{x:12,z:10}),{x:10,z:6});
 assert.deepEqual(marker.update(course,0,{x:20,z:15}),{x:10,z:6});
 assert.deepEqual(marker.update(course,0,{x:21,z:8}),{x:10,z:6});
 assert.equal(marker.update(course,0,{x:22,z:7}),undefined);
 assert.deepEqual(marker.update(course,0,{x:23,z:12}),{x:22,z:7});
});
test('does not invent an exit for offroad spawn or transfer old car/course/event state',()=>{
 for(const change of ['car','course','disabled','reset','teleport','invalid']){
  const marker=new OffroadMarker();marker.update(course,0,{x:10,z:6});
  assert.ok(marker.update(course,0,{x:12,z:10}));
  if(change==='reset')marker.reset();
  const result=marker.update(change==='course'?{...course}:course,change==='car'?1:0,{x:change==='teleport'?100:change==='invalid'?NaN:13,z:12},change!=='disabled');
  assert.equal(result,undefined,change);
 }
 const marker=new OffroadMarker();assert.equal(marker.update(course,0,{x:10,z:20}),undefined);
});
test('caller cannot alter the remembered position',()=>{
 const marker=new OffroadMarker(),position={x:10,z:6};marker.update(course,0,position);position.x=300;
 const result=marker.update(course,0,{x:12,z:10})!;result.x=999;
 assert.deepEqual(marker.update(course,0,{x:13,z:11}),{x:10,z:6});
});

import {drawQuarryMap} from '../src/quarry-minimap';
test('return marker uses course map scale and is absent in open driving modes',()=>{
 for(const mode of ['race','derby','playground'])for(const waypoint of [false,true]){
  const calls:unknown[][]=[];
  const context=new Proxy({}, {get:(_t,key)=>key==='createRadialGradient'?()=>({addColorStop(){}}):(...args:unknown[])=>calls.push([key,...args]),set:()=>true});
  const canvas={width:400,getContext:()=>context} as unknown as HTMLCanvasElement;
  drawQuarryMap(canvas,[],{x:0,z:0,radius:50},mode,0,waypoint?[{x:0,z:0,label:'1'}]:[],{point:t=>({x:t,z:t}),extent:180,halfWidth:7},{x:20,z:30});
  const label=calls.find(c=>c[0]==='fillText'&&c[1]==='RETURN');
  if(mode==='race'&&!waypoint)assert.deepEqual(label,['fillText','RETURN',220,157]);else assert.equal(label,undefined);
 }
});

import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
test('real HUD uses player, online or followed demo car and suppresses non-circuit events',()=>{
 const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),start=source.indexOf('function drawMap()'),end=source.indexOf('\nfunction ',start+1);
 const code=ts.transpile(source.slice(start,end),{target:ts.ScriptTarget.ES2022});
 for(const kind of ['player','demo','online'])for(const excluded of ['none','derby','playground','waypoint','chase','finished','wrecked']){
  const id=kind==='demo'?2:kind==='online'?3:0;
  const car={id,current:{x:10,z:6},health:excluded==='wrecked'?0:100,finished:excluded==='finished'};
  let marker:unknown;
  const context:any={document:{querySelector:()=>({})},cars:[car],mode:['derby','playground'].includes(excluded)?excluded:'race',demo:kind==='demo',online:kind==='online'?{active:true,network:{id:3}}:null,director:{followed:2},activeVenue:{course:{...course,id:'quarry-v1'}},quarry:{arenaLayout:{}},pursuit:excluded==='chase'?{}:null,waypointRace:excluded==='waypoint'?{available:()=>[],stations:[]}:null,offroadMarker:new OffroadMarker(),drawQuarryMap:(...args:unknown[])=>{marker=args[7];}};
  vm.createContext(context);vm.runInContext(code+'\ndrawMap();',context);
  car.current={x:12,z:10};vm.runInContext('drawMap();',context);
  assert.deepEqual(marker,excluded==='none'?{x:10,z:6}:undefined,kind+' '+excluded);
 }
});
