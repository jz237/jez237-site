import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {MessageChannel} from 'node:worker_threads';
import {packOnlineValue,unpackOnlineValue,encodeOnlinePacket,decodeOnlinePacket,onlinePacketChunks,createOnlineReassembler,ONLINE_PACKET_LIMIT} from '../online-race-codec.js';
import {ONLINE_VERSION,ONLINE_BUILD,encodeOnlineSignal,decodeOnlineSignal,onlineToken,onlineGuestSetup,onlinePlayerInput,validateOnlineDescriptor} from '../online-race-protocol.js';
import {createOnlineHostBridge,embeddedOnlineCapability} from '../online-host-bridge.js';
import {createOnlinePeer} from '../online-peer.js';
import {onlineEnvelope} from '../online-race-protocol.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {captureWindowFrame,readWindowFrame} from '../player-window-presentation.js';

function fixture(physics='modern'){
 const state=createRace({mode:'versus',physics,seaState:'course',course:getCourse('greyhaven'),secondRider:2});
 const water={wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(state.raceWater)};
 const initialFrame=captureWindowFrame(state,water);
 return {state,initialFrame,descriptor:{course:'greyhaven',difficulty:0,laps:3,seaState:'course',freeRide:false,swapColours:false,waveSeed:state.waveSeed,roster:[0,2],names:['A','B','C','D'],initialFrame}};
}
test('binary wire retains exact source water, local surface and rider values without JSON array expansion',async()=>{
 for(const physics of ['modern','native']){
  const {state,initialFrame}=fixture(physics);state.phase='running';for(let i=0;i<9;i++)stepRace(state,[{throttle:1,steer:.2},{throttle:.5,steer:-.4}],1/60);
  const frame=captureWindowFrame(state,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(state.raceWater)});
  const before=structuredClone(frame),raw=packOnlineValue(frame),wire=await encodeOnlinePacket(frame),copy=await decodeOnlinePacket(wire);
  assert.ok(raw.length<220000);assert.ok(wire.length<raw.length);assert.deepEqual(copy,frame);assert.ok(readWindowFrame(copy));
  assert.deepEqual(frame,before);assert.notEqual(copy.water.native.heightQ.buffer,frame.water.native.heightQ.buffer);
  copy.water.native.heightQ[0]++;assert.deepEqual(frame,before);assert.ok(initialFrame.water.native.heightQ instanceof Int16Array);
 }
});
test('all permitted typed array kinds preserve signed zeros and exact binary words',()=>{
 const data={a:new Float32Array([0,-0,1/3,123.25]),b:new Int16Array([-32768,0,32767]),c:new Uint8Array([0,255]),d:new Uint16Array([65535,12])};
 const copy=unpackOnlineValue(packOnlineValue(data));assert.deepEqual(copy,data);assert.equal(Object.is(copy.a[1],-0),true);
});
test('fragment reassembly handles duplicates/reordering and drops superseded completed snapshots',async()=>{
 let seed=1234567;const data=Uint8Array.from({length:90000},()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed&255;});
 const raw=await encodeOnlinePacket({data}),chunks=onlinePacketChunks(raw,1),a=createOnlineReassembler();assert.ok(chunks.length>3);
 let complete=null;for(const c of [...chunks].reverse()){const r=a.push(c);if(r)complete=r;else a.push(c);}
 assert.ok(complete);assert.deepEqual(complete.packet,raw);assert.equal(a.pending,0);assert.equal(a.push(chunks[0]),null);
 const b=createOnlineReassembler(),second=onlinePacketChunks(raw,2);let newest;for(const c of second)newest=b.push(c);assert.ok(newest);assert.equal(b.push(chunks[0]),null);
});
test('incomplete/untrusted snapshots have bounded memory, expiry, lengths and inflation',async()=>{
 let now=0;const assembler=createOnlineReassembler({now:()=>now}),raw=new Uint8Array(50000);
 for(let n=1;n<=5;n++)assembler.push(onlinePacketChunks(raw,n)[0]);assert.equal(assembler.pending,2);
 now=2000;assembler.push(onlinePacketChunks(raw,6)[0]);assert.equal(assembler.pending,1);
 assert.throws(()=>assembler.push(new Uint8Array(500000)),/length/);
 const bad=onlinePacketChunks(raw,7)[0];new DataView(bad.buffer).setUint32(12,ONLINE_PACKET_LIMIT+1);assert.throws(()=>assembler.push(bad));
 assert.throws(()=>packOnlineValue(new Uint8Array(ONLINE_PACKET_LIMIT+1)));assert.throws(()=>unpackOnlineValue(new Uint8Array(4)));
 assert.throws(()=>unpackOnlineValue(packOnlineValue({x:{$atsBuffer:9}})),/reference/);
 const bomb=new Uint8Array(ONLINE_PACKET_LIMIT+10),reader=new Blob([bomb]).stream().pipeThrough(new CompressionStream('gzip')).getReader(),parts=[];let size=0;
 while(true){const q=await reader.read();if(q.done)break;parts.push(q.value);size+=q.value.length;}const packet=new Uint8Array(size+1);packet[0]=1;let at=1;for(const p of parts){packet.set(p,at);at+=p.length;}
 await assert.rejects(decodeOnlinePacket(packet),/limit/);
});
test('private invite/return codes validate game version, role, session, expiry and bounded SDP',async()=>{
 const signal={v:ONLINE_VERSION,build:ONLINE_BUILD,session:onlineToken(webcrypto),created:Date.now(),type:'offer',sdp:'v=0\r\na=application:authored-test-only\r\n'};
 const code=await encodeOnlineSignal(signal);assert.deepEqual(await decodeOnlineSignal(code),signal);assert.deepEqual(await decodeOnlineSignal('https://race.example/online.html#invite='+encodeURIComponent(code)),signal);
 await assert.rejects(decodeOnlineSignal(code,{now:signal.created+7200001}),/expired/);await assert.rejects(decodeOnlineSignal('ATS1.'+'a'.repeat(70000)));
 for(const patch of [{build:'old'},{type:'frame'},{session:'bad'},{sdp:'no'},{created:Date.now()+600000}])await assert.rejects(encodeOnlineSignal({...signal,...patch}));
});
test('guest input is normalized to control fields and cannot overwrite positions or progress',()=>{
 const input=onlinePlayerInput({throttle:1,steer:-.3,lean:.2,x:999,passed:99,lap:99});assert.ok(input);assert.equal(input.x,undefined);assert.equal(input.passed,undefined);assert.equal(input.lap,undefined);
 for(const patch of [{throttle:2},{steer:NaN},{lean:Infinity},{trick:'givePoints'},{brake:1}])assert.equal(onlinePlayerInput({...input,...patch}),null);
 assert.ok(onlineGuestSetup({rider:2,name:'Nia',tune:{engine:0,grip:.25,handling:-1}}));assert.equal(onlineGuestSetup({rider:2,name:'Nia',tune:{engine:5,grip:0,handling:0}}),null);
});
test('online setup requires a real bounded two-rider presentation and ignores remote graphics/control preferences',()=>{
 const {descriptor}=fixture(),copy=validateOnlineDescriptor({...descriptor,controls:{injected:true},graphics:{width:1e9}});assert.ok(copy);assert.equal(copy.controls,undefined);assert.equal(copy.graphics,undefined);
 for(const patch of [{course:'unknown'},{roster:[0,9]},{laps:100},{waveSeed:Infinity},{initialFrame:{}}])assert.equal(validateOnlineDescriptor({...descriptor,...patch}),null);
});
const settle=async()=>{for(let i=0;i<4;i++)await new Promise(r=>setImmediate(r));};
function bridgeFixture(){
 const listeners=new Map(),parent={document:{visibilityState:'visible'},postMessage(){}},win={parent,location:{href:'https://race.example/race.html?onlineHost=1#onlineBridge='+('a'.repeat(32)),origin:'https://race.example'},addEventListener(t,f){listeners.set(t,f);},removeEventListener(t){listeners.delete(t);}};
 return {win,parent,bind(bridge){const channel=new MessageChannel();listeners.get('message')({origin:win.location.origin,source:parent,data:{type:'ats-online-host-bind',capability:'a'.repeat(32)},ports:[channel.port1]});channel.port2.start();return channel;}};
}
test('embedded online admission needs a parent and exact private capability',()=>{
 const {win}=bridgeFixture();assert.equal(embeddedOnlineCapability(win),'a'.repeat(32));const standalone={...win};standalone.parent=standalone;assert.equal(embeddedOnlineCapability(standalone),null);
 assert.equal(embeddedOnlineCapability({...win,location:{href:'https://race.example/race.html?onlineHost#onlineBridge=bad'}}),null);
});
test('online bridge preserves host controls, neutralizes stale P2 input, pauses on lost heartbeat and rejects old generations',async()=>{
 let now=0,fallbacks=0,reconnects=0,commands=[];const f=bridgeFixture(),bridge=createOnlineHostBridge({capability:'a'.repeat(32),window:f.win,now:()=>now,onFallback:()=>fallbacks++,onReconnect:()=>reconnects++,onCommand:c=>commands.push(c)}),channel=f.bind(bridge),send=m=>channel.port2.postMessage(m);
 try{
  send({type:'link',connection:'b'.repeat(32),connected:true});await settle();bridge.begin(fixture().descriptor);send({type:'ready',generation:1});send({type:'input',generation:1,sequence:1,control:{throttle:1,steer:.5}});await settle();
  assert.equal(bridge.ready,true);assert.equal(bridge.remoteFocused,false);assert.equal(bridge.remoteControls()[0].throttle,0);assert.equal(bridge.remoteControls()[1].throttle,1);
  now=251;assert.equal(bridge.remoteControls()[1].throttle,0);now=4000;bridge.poll();assert.equal(fallbacks,1);assert.equal(bridge.holding,true);
  send({type:'heartbeat'});await settle();assert.equal(bridge.ready,true);send({type:'pause',generation:1,sequence:1,paused:true});send({type:'pause',generation:1,sequence:1,paused:false});await settle();assert.deepEqual(commands,[{kind:'pause',paused:true}]);
  bridge.begin(fixture().descriptor);send({type:'ready',generation:1});await settle();assert.equal(bridge.ready,false);send({type:'ready',generation:2});await settle();assert.equal(bridge.ready,true);
  send({type:'link',connection:'c'.repeat(32),connected:true});await settle();assert.equal(reconnects,1);assert.equal(bridge.ready,false);assert.ok(bridge.remoteControls().every(q=>q.throttle===0));
 }finally{bridge.dispose();channel.port1.close();channel.port2.close();}
});

test('snapshot pacing bounds active/paused traffic and a resume immediately releases its latest frame',async()=>{
 let now=0;const f=bridgeFixture(),bridge=createOnlineHostBridge({capability:'a'.repeat(32),window:f.win,now:()=>now}),channel=f.bind(bridge),messages=[];channel.port2.onmessage=e=>messages.push(e.data);
 try{
  channel.port2.postMessage({type:'link',connection:'b'.repeat(32),connected:true});await settle();bridge.begin(fixture().descriptor);channel.port2.postMessage({type:'ready',generation:1});await settle();
  assert.equal(bridge.wantsFrame,true);bridge.publish({phase:'running',time:1});bridge.publish({phase:'running',time:2});await settle();assert.equal(messages.filter(m=>m.type==='frame').length,1);
  channel.port2.postMessage({type:'frame-ack',generation:1});await settle();now=25;assert.equal(bridge.wantsFrame,false);now=50;assert.equal(bridge.wantsFrame,true);
  bridge.publish({phase:'paused',time:1});channel.port2.postMessage({type:'frame-ack',generation:1});await settle();now=100;assert.equal(bridge.wantsFrame,false);now=1050;assert.equal(bridge.wantsFrame,true);
  now=101;bridge.clearInput();assert.equal(bridge.wantsFrame,true,'resume does not wait for the paused keepalive interval');
 }finally{bridge.dispose();channel.port1.close();channel.port2.close();}
});
test('an interrupted connection keeps the actual host race and source water frozen until explicit resume',async()=>{
 const {state}=fixture('native');state.phase='running';for(let i=0;i<12;i++)stepRace(state,[{throttle:1},{throttle:1}],1/60);
 const f=bridgeFixture(),bridge=createOnlineHostBridge({capability:'a'.repeat(32),window:f.win,onFallback:()=>state.phase='paused'}),channel=f.bind(bridge),send=m=>channel.port2.postMessage(m);
 try{
  send({type:'link',connection:'b'.repeat(32),connected:true});await settle();bridge.begin(fixture().descriptor);send({type:'ready',generation:1});await settle();
  const before={time:state.time,water:captureRaceWater(state.raceWater),racers:state.racers.map(r=>[r.x,r.z,r.lap,r.passed,r.misses]),ticks:state.nativeHost.world.ticks};
  send({type:'link',connection:'b'.repeat(32),connected:false});await settle();for(let i=0;i<90;i++)stepRace(state,[{throttle:1},{throttle:1}],1/60);
  assert.equal(state.phase,'paused');assert.equal(bridge.ready,false);assert.deepEqual({time:state.time,water:captureRaceWater(state.raceWater),racers:state.racers.map(r=>[r.x,r.z,r.lap,r.passed,r.misses]),ticks:state.nativeHost.world.ticks},before);
  send({type:'link',connection:'b'.repeat(32),connected:true});await settle();assert.equal(bridge.ready,true);assert.equal(state.phase,'paused');assert.equal(bridge.generation,1);
 }finally{bridge.dispose();channel.port1.close();channel.port2.close();}
});
test('peer channel roles reject guest snapshots while accepting only the dedicated P2 input channel',async()=>{
 class Channel{constructor(label,options){this.label=label;this.options=options;this.readyState='connecting';this.bufferedAmount=0;this.sent=[];}send(v){this.sent.push(v);}close(){this.readyState='closed';}}
 class Peer{constructor(){Peer.last=this;this.connectionState='new';this.signalingState='stable';this.channels=[];}createDataChannel(label,options){const c=new Channel(label,options);this.channels.push(c);return c;}close(){this.connectionState='closed';}}
 const inputs=[],errors=[],frames=[],host=createOnlinePeer({role:'host',PeerConnection:Peer,onInput:m=>inputs.push(m),onFrame:m=>frames.push(m),onError:e=>errors.push(e)}),pc=Peer.last;
 try{
  pc.connectionState='connected';for(const c of pc.channels)c.readyState='open';pc.onconnectionstatechange();assert.equal(host.connected,true);
  const input=pc.channels.find(c=>c.label==='ats-input-v1'),snapshot=pc.channels.find(c=>c.label==='ats-frames-v1'),control=pc.channels.find(c=>c.label==='ats-control-v1');
  assert.deepEqual(control.options,{ordered:true});assert.deepEqual(snapshot.options,{ordered:false,maxRetransmits:0});
  input.onmessage({data:JSON.stringify(onlineEnvelope(host.session,'input',{generation:1,sequence:1,control:{throttle:1,steer:0}}))});assert.equal(inputs.length,1);
  const packet=await encodeOnlinePacket(onlineEnvelope(host.session,'frame',{generation:1,frame:fixture().initialFrame}));for(const c of onlinePacketChunks(packet,1))snapshot.onmessage({data:c.buffer});await settle();
  assert.equal(frames.length,0);assert.equal(errors.length,1);assert.equal(host.sendInput({control:{throttle:1,steer:0}}),false);
 }finally{host.close();}
});
