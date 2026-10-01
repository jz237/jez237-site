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
test('actual Worker admits 24 seats, bounds pending sockets and reattaches all saved peers after hibernation',async()=>{
 const OriginalResponse=globalThis.Response,OriginalPair=(globalThis as any).WebSocketPair;
 class Socket{readyState=1;attachment:any;messages:string[]=[];closed?:number;serializeAttachment(a:unknown){this.attachment=structuredClone(a);}deserializeAttachment(){return this.attachment;}send(m:string){this.messages.push(m);}close(code:number){this.closed=code;this.readyState=3;}}
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
  for(let i=0;i<24;i++){const response=await worker.fetch(new Request('https://worker/rooms/'+code,{headers:{'X-Quarry-Lease':JSON.stringify(lease)}}));assert.equal(response.status,101);await worker.webSocketMessage(sockets.at(-1),JSON.stringify({type:'hello',protocol:1,name:'DRIVER '+i,kind:'coupe',maxPlayers:24}));}
  assert.equal(worker.room.activeCount,24);assert.equal(worker.room.sim.capacity,24);assert.equal((data.get('room')as any).snapshot.capacity,24);
  const token=JSON.parse(sockets[23].messages.find(s=>JSON.parse(s).type==='welcome')!).token;
  await worker.fetch(new Request('https://worker/rooms/'+code,{headers:{'X-Quarry-Lease':JSON.stringify(lease)}}));const reconnect=sockets.at(-1)!;await worker.webSocketMessage(reconnect,JSON.stringify({type:'hello',protocol:1,name:'DRIVER 23',kind:'coupe',maxPlayers:24,token}));assert.equal(sockets[23].closed,4001);assert.equal(reconnect.attachment.id,23);
  for(let i=0;i<8;i++)assert.equal((await worker.fetch(new Request('https://worker/rooms/'+code,{headers:{'X-Quarry-Lease':JSON.stringify(lease)}}))).status,101);
  assert.equal((await worker.fetch(new Request('https://worker/rooms/'+code,{headers:{'X-Quarry-Lease':JSON.stringify(lease)}}))).status,429);
  const previous=worker.room as Room;worker.room=undefined;previous.dispose();
  restored=new QuarryRoom(ctx,env);await restored.prepared;
  assert.equal(restored.room.activeCount,24);assert.equal(restored.room.sim.capacity,24);assert.equal(restored.peers.size,24);assert.ok(sockets.filter(s=>s.attachment.id!==undefined&&s.readyState===1).every(s=>JSON.parse(s.messages.at(-1)!).cars.length===24||JSON.parse(s.messages.at(-1)!).snapshot?.cars.length===24));
 }finally{worker?.room?.dispose();restored?.room?.dispose();globalThis.Response=OriginalResponse;(globalThis as any).WebSocketPair=OriginalPair;}
});
