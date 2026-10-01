import test from 'node:test';import assert from 'node:assert/strict';import R from '@dimforge/rapier3d-compat';
import {Room,type Peer} from '../multiplayer/room';import{parseClientMessage,type ServerMessage}from'../multiplayer/protocol';
import{newLayer}from'../src/livery-data';import{stockOnlineSetup}from'../src/online-setup';import{validOnlineLivery,validLiveryFrame,LIVERY_MESSAGE_LIMIT}from'../src/online-livery';
import{encodeSnapshotWire,decodeSnapshotWire}from'../src/snapshot-wire';import{verifyOnlineLiveryRevision}from'./online-livery-invariants';
await R.init();
const layers=()=>Array.from({length:32},(_,i)=>({...newLayer(i%2?'number':'stripe',(['left','right','top','front','rear']as const)[i%5]),name:'DESIGN '+i,text:String(i),x:.3+i/64,seed:i}));
const peer=()=>{const messages:ServerMessage[]=[],closed:number[]=[];return{messages,closed,send:(m:ServerMessage)=>messages.push(m),close:(c:number)=>closed.push(c)}satisfies Peer;};
const hello=(token?:string)=>JSON.stringify({type:'hello',protocol:1,kind:'coupe',name:'PAINTER',maxPlayers:24,token});
const send=(room:Room,p:ReturnType<typeof peer>,m:unknown,id=0)=>room.receive(id,p,JSON.stringify(m));
const welcome=(p:ReturnType<typeof peer>)=>p.messages.find(m=>m.type==='welcome')! as Extract<ServerMessage,{type:'welcome'}>;

test('all32 bounded layers fit the artwork message while invalid designs and large ordinary messages are rejected',()=>{
 const design=layers(),raw=JSON.stringify({type:'livery',kind:'coupe',layers:design});assert.ok(Buffer.byteLength(raw)>1024);assert.ok(Buffer.byteLength(raw)<LIVERY_MESSAGE_LIMIT);assert.deepEqual(parseClientMessage(raw),{type:'livery',kind:'coupe',layers:design});
 for(const bad of [[...design,design[0]],design.map((l,i)=>i?l:{...l,width:100}),[{...design[0],face:'windshield'}],[{...design[0],seed:-1}],[{...design[0],text:'x'.repeat(17)}],[{...design[0],opacity:NaN}]])assert.equal(validOnlineLivery(bad),false);
 assert.equal(parseClientMessage(JSON.stringify({type:'hello',protocol:1,name:'x'.repeat(1100),kind:'coupe'})),null);assert.equal(parseClientMessage(JSON.stringify({type:'input',seq:1,controls:{throttle:0,steer:0,brake:0,handbrake:false},extra:'x'.repeat(1100)})),null);
 assert.equal(parseClientMessage(JSON.stringify({type:'livery',kind:'coupe',layers:[],extra:'x'.repeat(LIVERY_MESSAGE_LIMIT)})),null);
});

test('pending design applies only at next event; snapshots omit artwork; legacy and binary peers receive the same frame',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),a=peer(),b=peer();try{
 room.connect(a,hello());room.connect(b,hello());assert.equal(send(room,a,{type:'livery',kind:'coupe',layers:layers()}),true);assert.equal(room.snapshot().members[0].liveryLayers,32);assert.ok(!JSON.stringify(room.snapshot()).includes('DESIGN'));
 send(room,a,{type:'start',mode:'derby',rounds:3});const frame=a.messages.filter(m=>m.type==='liveries').at(-1)! as Extract<ServerMessage,{type:'liveries'}>;assert.equal(frame.frame.revision,1);assert.equal(frame.frame.cars[0].layers.length,32);assert.equal(frame.frame.cars[1].layers.length,0);assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(frame)),frame);assert.ok(validLiveryFrame(frame.frame,24));
 const count=a.messages.filter(m=>m.type==='liveries').length;for(let i=0;i<20;i++)room.broadcast();assert.equal(a.messages.filter(m=>m.type==='liveries').length,count,'20Hz snapshots must not resend artwork');
 now+=1500;send(room,a,{type:'livery',kind:'coupe',layers:[]});assert.equal(room.save().liveries!.cars[0].layers.length,32,'live design does not change mid-event');room.sim.phase='result';room.snapshot();send(room,a,{type:'next'});assert.equal(room.save().liveries!.cars[0].layers.length,0);
 }finally{room.dispose();}
});

test('active and pending designs survive reconnect and persistence independently; wrong-kind and rapid changes cannot replace them',()=>{
 let now=1000;const room=new Room('ABCDEF',R,()=>now),p=peer();try{
 room.connect(p,hello());const token=welcome(p).token;send(room,p,{type:'livery',kind:'coupe',layers:layers()});send(room,p,{type:'livery',kind:'coupe',layers:[]});assert.equal(room.save().sessions[0].livery!.layers.length,32);
 send(room,p,{type:'start',mode:'playground'});now+=1500;send(room,p,{type:'livery',kind:'hatch',layers:[]});assert.equal(room.save().sessions[0].livery!.kind,'coupe');
 send(room,p,{type:'livery',kind:'coupe',layers:[newLayer('star')]});const saved=room.save(),restored=new Room('ABCDEF',R,()=>now);try{
 restored.restore(saved);const rejoin=peer();restored.connect(rejoin,hello(token));const m=welcome(rejoin);assert.equal(m.liveries!.cars[0].layers.length,32);assert.equal(m.pendingLivery!.layers.length,1);assert.equal(m.pendingLivery!.layers[0].shape,'star');assert.deepEqual(restored.save().liveries,saved.liveries);
 restored.sim.phase='result';send(restored,rejoin,{type:'setup',kind:'hatch',setup:stockOnlineSetup('hatch')});assert.equal(restored.save().sessions[0].livery,undefined,'car changes clear incompatible pending art');send(restored,rejoin,{type:'start',mode:'playground'});assert.equal(restored.save().liveries!.cars[0].layers.length,0);
 }finally{restored.dispose();}
 }finally{room.dispose();}
});
test('24 complete designs stay out of steady snapshots and persist through the bounded storage format',async()=>{
 const room=new Room('ABCDEF',R),peers=Array.from({length:24},peer);try{for(let i=0;i<24;i++){room.connect(peers[i],hello());send(room,peers[i],{type:'livery',kind:'coupe',layers:layers()},i);}send(room,peers[0],{type:'start',mode:'race'});const saved=room.save();assert.equal(saved.liveries!.cars.reduce((n,c)=>n+c.layers.length,0),768);assert.ok(!JSON.stringify(room.snapshot()).includes('DESIGN'));
 const frame=encodeSnapshotWire({type:'liveries',frame:saved.liveries});assert.ok(frame.byteLength<32768);assert.deepEqual(decodeSnapshotWire(frame),{type:'liveries',frame:saved.liveries});
 const {roomStorageEntries,readSavedRoom}=await import('../multiplayer/room-storage');const data=new Map(Object.entries(roomStorageEntries(saved)));assert.deepEqual(await readSavedRoom({get:async<T>(key:string)=>data.get(key)as T}),saved);
 }finally{room.dispose();}
});
test('online livery changes preserve exact preceding source bytes',verifyOnlineLiveryRevision);
