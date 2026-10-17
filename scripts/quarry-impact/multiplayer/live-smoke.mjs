import WebSocket from 'ws';
import {decodeSnapshotWire} from '../src/snapshot-wire.ts';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
const endpoint=process.env.QUARRY_TEST_ENDPOINT??'ws://127.0.0.1:8789';
const origin=process.env.QUARRY_TEST_ORIGIN??'http://127.0.0.1:8795';
const code=Array.from(randomBytes(6),n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%32]).join('');
const sockets=[];
function connect(token,wire){return new Promise((resolve,reject)=>{
  const ws=new WebSocket(`${endpoint}/rooms/${code}`,{origin});sockets.push(ws);
  const snapshots=[];const timer=setTimeout(()=>reject(new Error('Welcome timeout')),10000);
  ws.on('open',()=>ws.send(JSON.stringify({type:'hello',protocol:1,name:'SMOKE TEST',kind:'coupe',token,...(wire?{wire}: {})})));
  ws.on('error',reject);ws.on('message',(raw,binary)=>{const m=binary?decodeSnapshotWire(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength)):JSON.parse(String(raw));if(m.type==='snapshot')snapshots.push(m);if(m.type==='welcome'){clearTimeout(timer);resolve({ws,snapshots,welcome:m});}});
});}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
try{
  const a=await connect(),b=await connect(undefined,'qiw1');assert.equal(a.welcome.id,0);assert.equal(b.welcome.id,1);
  a.ws.send(JSON.stringify({type:'start',mode:'derby'}));
  let seq=0;const input=setInterval(()=>{for(const c of [a,b])if(c.ws.readyState===1)c.ws.send(JSON.stringify({type:'input',seq:seq++,controls:{throttle:1,steer:0,brake:0,handbrake:false}}));},50);
  await delay(6500);clearInterval(input);
  const last=a.snapshots.at(-1);for(let i=0;i<20&&!b.snapshots.some(s=>s.tick===last.tick);i++)await delay(25);const matching=b.snapshots.find(s=>s.tick===last.tick);assert.ok(matching,'Both wire formats receive the same tick');
  assert.ok(last.tick>300&&last.phase==='playing');assert.deepEqual(last.cars,matching.cars);assert.ok(a.snapshots.some(s=>s.cars[0].speed>5));
  assert.equal(last.props.length,34);assert.deepEqual(last.props.map(p=>p.id),Array.from({length:34},(_,id)=>id));assert.deepEqual(last.props,matching.props);assert.ok(last.cars.every(c=>Number.isFinite(c.slip)&&['asphalt','gravel'].includes(c.surface)));
  assert.ok(last.cars.every(c=>c.wheels.length===4&&c.wheels.every(w=>typeof w.contact==='boolean')));
  const token=b.welcome.token;const acknowledged=new Promise(resolve=>b.ws.once('close',()=>resolve(true)));b.ws.close();assert.equal(await Promise.race([acknowledged,delay(1500).then(()=>false)]),true);const rejoined=await connect(token,'qiw1');assert.equal(rejoined.welcome.id,1);assert.ok(rejoined.welcome.snapshot.tick>=last.tick);assert.equal(rejoined.welcome.snapshot.props.length,34);for(let i=0;i<20&&!a.snapshots.some(s=>s.tick===rejoined.welcome.snapshot.tick);i++)await delay(25);const rejoinMatch=a.snapshots.find(s=>s.tick===rejoined.welcome.snapshot.tick);assert.ok(rejoinMatch,'Host receives rejoin broadcast');assert.deepEqual(rejoined.welcome.snapshot.props,rejoinMatch.props);
  const closed=new Promise(resolve=>rejoined.ws.once('close',code=>resolve(code)));rejoined.ws.send(JSON.stringify({type:'position',health:100,p:{x:0,y:0,z:0}}));assert.equal(await closed,1008);
  const denied=await new Promise((resolve,reject)=>{const ws=new WebSocket(`${endpoint}/rooms/${code}`,{origin:'https://untrusted.example'});ws.on('unexpected-response',(_req,res)=>{resolve(res.statusCode);ws.terminate();});ws.on('error',()=>{});setTimeout(()=>reject(new Error('Origin test timeout')),3000).unref();});assert.equal(denied,403);
  console.log(JSON.stringify({ok:true,room:code,ticks:last.tick,clients:2,props:34,mixedJsonBinary:true,identicalSnapshots:true,rejoin:true,spoofRejected:true,foreignOriginRejected:true}));
}finally{for(const ws of sockets)ws.close();}
