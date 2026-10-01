import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {deflateSync} from 'fflate/browser';
import {encodeSnapshotWire,decodeSnapshotWire} from '../src/snapshot-wire';
import {Room,type Peer} from '../multiplayer/room';
import {parseClientMessage,type ServerMessage} from '../multiplayer/protocol';
import {validOnlineSnapshot} from '../src/network-validation';
import {verifyOnlineWireRevision} from './online-wire-invariants';
await R.init();
const normalized=(s:unknown)=>JSON.parse(JSON.stringify(s));
const hello=(wire?:string,token?:string)=>JSON.stringify({type:'hello',protocol:1,name:'TEST 雪',kind:'coupe',maxPlayers:24,wire,token});
const peer=()=>{const messages:ServerMessage[]=[],buffers:ArrayBuffer[]=[];return{messages,buffers,send:(m:ServerMessage)=>messages.push(m),sendEncoded:(m:string)=>messages.push(JSON.parse(m)),sendBinary:(m:ArrayBuffer)=>{buffers.push(m);messages.push(decodeSnapshotWire(m)as ServerMessage);},close:()=>{}} satisfies Peer;};

test('wire preserves numeric precision, negative zero, Unicode and prototype-named own keys',()=>{
 const value=JSON.parse('{"__proto__":{"safe":true},"constructor":"constructor","prototype":"prototype"}');
 value.values=[null,true,false,-2147483648,2147483647,2147483648,Number.MAX_SAFE_INTEGER,Number.MIN_VALUE,Number.MAX_VALUE,-0,.1,Math.fround(.2),'雪🚗\ud800',[],{}];
 assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(value)),value);assert.equal(({}as any).safe,undefined);
 assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire({omitted:undefined,items:[undefined]})),{items:[null]});
 for(const n of [Infinity,-Infinity,NaN])assert.throws(()=>encodeSnapshotWire(n));
});

test('real 24-car snapshots and full repair histories round-trip exactly with significant bandwidth reduction',()=>{
 const room=new Room('ABCDEF',R),p=peer();try{
 room.connect(p,hello('qiw1'));room.receive(0,p,JSON.stringify({type:'start',mode:'derby',rounds:3}));for(let i=0;i<400;i++)room.step();
 const snap=room.snapshot();const bytes=encodeSnapshotWire(snap);assert.deepEqual(decodeSnapshotWire(bytes),normalized(snap));assert.ok(validOnlineSnapshot(decodeSnapshotWire(bytes)));assert.ok(bytes.byteLength<Buffer.byteLength(JSON.stringify(snap))*.5);
 for(const c of room.sim.cars)c.state.dents=Array.from({length:334},(_,i)=>({id:c.state.id*334+i+1,localPoint:{x:-1.1234567890123457,y:-.12345678901234567,z:2.1234567890123457},localDirection:{x:-.12345678901234567,y:-.12345678901234567,z:-.9123456789012346},damage:.10000000000000002,repair:0}));
 const welcome={type:'welcome',protocol:1,room:room.code,id:0,token:'private',snapshot:room.snapshot(true)};
 assert.deepEqual(decodeSnapshotWire(encodeSnapshotWire(welcome)),normalized(welcome));
 }finally{room.dispose();}
});

test('mixed peers negotiate per connection, share binary broadcast bytes, keep tokens private, and restore preferences',()=>{
 const room=new Room('ABCDEF',R);try{
 const a=peer(),b=peer(),legacy=peer(),adapter=peer();room.connect(a,hello('qiw1'));room.connect(b,hello('qiw1'));room.connect(legacy,hello());room.connect({...adapter,sendBinary:undefined},hello('qiw1'));
 assert.equal(a.messages[0].type,'welcome');assert.equal(legacy.buffers.length,0);assert.equal(adapter.buffers.length,0);
 room.broadcast();assert.equal(a.buffers.at(-1),b.buffers.at(-1),'one shared encoding per broadcast');assert.deepEqual(a.messages.at(-1),normalized(room.snapshot()));
 const payload=JSON.stringify(a.messages.at(-1));for(const s of room.sessions.values())assert.ok(!payload.includes(s.token));
 const saved=room.save(),restored=new Room('ABCDEF',R);try{restored.restore(saved);assert.equal(restored.sessions.get(0)!.wire,'qiw1');assert.equal(restored.sessions.get(2)!.wire,undefined);}finally{restored.dispose();}
 const token=(a.messages[0] as Extract<ServerMessage,{type:'welcome'}>).token,reconnected=peer();room.connect(reconnected,hello(undefined,token));assert.equal(reconnected.buffers.length,0);assert.equal(room.sessions.get(0)!.wire,undefined);
 assert.equal(parseClientMessage(hello('unknown')),null);
 }finally{room.dispose();}
});

test('corruption, truncation, oversized expansion and nesting fail within bounded decoder work',()=>{
 const good=encodeSnapshotWire({message:'A'.repeat(10000)});
 for(const end of [0,5,13,good.byteLength-1])assert.throws(()=>decodeSnapshotWire(good.slice(0,end)));
 for(const offset of [0,4,5,6,10,good.byteLength-1]){const copy=good.slice(0);new Uint8Array(copy)[offset]^=255;assert.throws(()=>decodeSnapshotWire(copy));}
 const oversized=good.slice(0);new DataView(oversized).setUint32(6,0xffffffff,true);assert.throws(()=>decodeSnapshotWire(oversized));
 const bomb=deflateSync(new Uint8Array(8*1024*1024)),packet=new Uint8Array(14+bomb.length);packet.set(new Uint8Array(good).subarray(0,14));new DataView(packet.buffer).setUint32(6,1,true);packet.set(bomb,14);assert.throws(()=>decodeSnapshotWire(packet.buffer));
 let nested:unknown=null;for(let i=0;i<35;i++)nested=[nested];assert.throws(()=>encodeSnapshotWire(nested));
});
test('wire changes retain exact preceding source bytes',verifyOnlineWireRevision);
