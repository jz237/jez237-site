import {WAYPOINTS} from '../src/waypoint-race';
import {stockOnlineSetup} from '../src/online-setup';
import {decodeSnapshotWire} from '../src/snapshot-wire';
const parse=(m:string|ArrayBuffer):any=>typeof m==='string'?JSON.parse(m):decodeSnapshotWire(m);
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import R from '@dimforge/rapier3d-compat';
import {Room} from './room';
await R.init();
const result=await build({entryPoints:[fileURLToPath(new URL('./worker.ts',import.meta.url))],bundle:true,write:false,format:'esm',platform:'neutral',plugins:[{name:'runtime-fixture',setup(b){
 b.onResolve({filter:/^cloudflare:workers$/},a=>({path:a.path,namespace:'fixture'}));
 b.onResolve({filter:/^\.\/\.generated\/rapier-worker\.mjs$/},a=>({path:a.path,namespace:'fixture'}));
 b.onResolve({filter:/^file:/},a=>({path:a.path,external:true}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path==='cloudflare:workers'?'export class DurableObject {constructor(ctx,env){this.ctx=ctx;this.env=env}}':`import R from '${import.meta.resolve('@dimforge/rapier3d-compat')}';export default {...R,init(){}};`,loader:'js'}));
}}]});
const {QuarryRoom}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
test('actual Worker restores event capability, random route and partial progress after eviction',async()=>{
 const OriginalResponse=globalThis.Response,OriginalPair=(globalThis as any).WebSocketPair;
 class Socket{readyState=1;attachment:any;messages:(string|ArrayBuffer)[]=[];closed?:number;serializeAttachment(a:unknown){this.attachment=structuredClone(a);}deserializeAttachment(){return this.attachment;}send(m:string|ArrayBuffer){this.messages.push(m);}close(code:number){this.closed=code;this.readyState=3;}}
 (globalThis as any).Response=class{constructor(_body:unknown,public init:any){} get status(){return this.init.status;}};
 (globalThis as any).WebSocketPair=class{0=new Socket();1=new Socket();};
 const code='ABCDEF',now=Date.now(),lease={id:'test-capacity',created:now,expiresAt:now+7200000,deadline:now+7200000,activityVersion:0};
 const data=new Map<string,unknown>(),sockets:Socket[]=[];let alarm:number|null=null;
 const storage={get:async(key:string)=>structuredClone(data.get(key)),put:async(key:string|Record<string,unknown>,value?:unknown)=>{if(typeof key==='string')data.set(key,structuredClone(value));else for(const[k,v]of Object.entries(key))data.set(k,structuredClone(v));},getAlarm:async()=>alarm,setAlarm:async(n:number)=>{alarm=n;},deleteAll:async()=>data.clear()};
 const ctx={storage,blockConcurrencyWhile:(f:()=>unknown)=>f(),getWebSockets:()=>sockets.filter(s=>s.readyState===1),acceptWebSocket:(s:Socket)=>sockets.push(s),waitUntil:(_p:Promise<unknown>)=>{}};
 const env={ADMISSION:{getByName:()=>({activate:async()=>true,idle:async()=>{},release:async()=>{}})}};
 let worker:any,restored:any;
 try{
  worker=new QuarryRoom(ctx,env);
  for(let i=0;i<2;i++){await worker.fetch(new Request('https://worker/rooms/'+code,{headers:{'X-Quarry-Lease':JSON.stringify(lease)}}));await worker.webSocketMessage(sockets.at(-1),JSON.stringify({type:'hello',protocol:1,name:'DRIVER '+i,kind:'coupe',maxPlayers:24,eventRules:1,wire:'qiw1'}));}
  await worker.webSocketMessage(sockets[0],JSON.stringify({type:'start',mode:'race',rules:{version:1,laps:2,direction:'reverse',race:'random',derby:'score',duration:120}}));
  clearInterval(worker.timer);worker.timer=undefined;worker.room.sim.phase='playing';
  const event=worker.room.sim.event;assert.ok(event);const first=event.waypoints.available(1)[0];event.waypoints.sample(1,WAYPOINTS[first]);worker.room.sim.cars[1].state.passed=1;
  await worker.persist();const expected=event.snapshot(24),previous=worker.room as Room;worker.room=undefined;previous.dispose();
  restored=new QuarryRoom(ctx,env);await restored.prepared;clearInterval(restored.timer);restored.timer=undefined;
  assert.equal(restored.room.activeCount,2);assert.equal(restored.peers.size,2);assert.deepEqual(restored.room.sim.event.snapshot(24),expected);
  for(const session of restored.room.sessions.values())assert.equal(session.eventRules,1);
  const latest=parse(sockets[1].messages.at(-1)!);const snap=latest.type==='welcome'?latest.snapshot:latest;assert.deepEqual(snap.event,expected);assert.equal(sockets[1].closed,undefined);
  restored.room.sim.phase='result';await restored.webSocketMessage(sockets[0],JSON.stringify({type:'start',mode:'derby',rules:expected.rules}));clearInterval(restored.timer);restored.timer=undefined;assert.equal(restored.room.sim.event.score,true);assert.deepEqual(restored.room.sim.event.rules,expected.rules);
 }finally{clearInterval(worker?.timer);clearInterval(restored?.timer);worker?.room?.dispose();restored?.room?.dispose();globalThis.Response=OriginalResponse;(globalThis as any).WebSocketPair=OriginalPair;}
});
