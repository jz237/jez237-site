import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {MessageChannel} from 'node:worker_threads';
import {PLAYER_WINDOW_VERSION,envelope,normalizeWindowControls,createWindowInputMailbox,createWindowPumpClock,fullPlayerViewport} from '../player-window-protocol.js';
import {createPlayerWindowHost} from '../player-window-host.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame,captureWindowWater,validateWindowWater} from '../player-window-presentation.js';
import {createRace,stepRace} from '../race-core.js';
import {initialSave,exportSave,importSave} from '../race-records.js';
import {createBreakableState,hitBreakable,hazardBroken,exportBreakablePresentation,importBreakablePresentation,breakableEvents,fragmentPose} from '../breakable-hazards.js';

test('remote controls are independent, bounded, copied and neutral after stale or reset input',()=>{
 const box=createWindowInputMailbox(),raw=[{throttle:1,steer:.2,lean:-.4,trick:'flip'},{throttle:.4,steer:-.7,brake:true}];
 assert.ok(box.accept({sequence:1,controls:raw},100));raw[0].throttle=0;
 assert.equal(box.sample(101)[0].throttle,1);assert.equal(box.sample(101)[1].throttle,.4);assert.equal(box.sample(101)[1].brake,true);
 assert.equal(box.accept({sequence:1,controls:raw},102),false);assert.equal(box.accept({sequence:0,controls:raw},103),false);
 for(const bad of [NaN,Infinity,-1,2])assert.equal(normalizeWindowControls([{throttle:bad,steer:0},{throttle:0,steer:0}]),null);
 assert.equal(normalizeWindowControls([{throttle:1,steer:0,trick:'givePoints'},{throttle:0,steer:0}]),null);
 assert.ok(box.sample(351).every(c=>c.throttle===0&&!c.brake&&!c.trick));box.clear();assert.ok(box.sample(103).every(c=>!c.throttle));
});
test('host and viewer wake requests consume one shared elapsed interval and inactive clocks do not catch up',()=>{
 const clock=createWindowPumpClock(0);let sum=0;
 for(let i=1;i<=144;i++){sum+=clock.elapsed(i*1000/144);sum+=clock.elapsed(i*1000/144);}
 assert.ok(Math.abs(sum-1)<1e-9);assert.equal(clock.elapsed(2000,false),0);assert.ok(clock.elapsed(2010)<.011);clock.reset(10000);assert.equal(clock.elapsed(10000),0);
});
test('each separate view receives a full16:9 viewport rather than a split half',()=>{
 for(const [w,h] of [[1920,1080],[2560,1440],[1201,801]]){const v=fullPlayerViewport(w,h);assert.ok(v.x>=0&&v.y>=0&&v.x+v.width<=w&&v.y+v.height<=h);assert.ok(Math.abs(v.width/v.height-16/9)<.004);}
 assert.deepEqual(fullPlayerViewport(1920,1080),{x:0,y:0,width:1920,height:1080});
});
test('separate display preference survives portable saves with legacy layouts intact',()=>{
 for(const layout of ['horizontal','vertical','separate']){const save=initialSave();save.versus={rider:1,tune:{},handicap:false,layout};assert.equal(importSave(exportSave(save)).versus.layout,layout);}
});
const hazard={id:'ice',x:1,y:0,z:2,r:1.25,breakable:{threshold:2}};
test('portable broken ice preserves debris but imports are bounded and permanently read-only',()=>{
 const live=createBreakableState();hitBreakable(live,hazard,{normalSpeed:5,time:1,riderIndex:0});
 const wire=structuredClone(exportBreakablePresentation(live,1.1)),view=importBreakablePresentation(wire);
 assert.ok(view);assert.ok(hazardBroken(view,hazard));assert.equal(hitBreakable(view,{...hazard,id:'other'},{normalSpeed:8,time:2}),null);
 const event=breakableEvents(view,1.1)[0];assert.ok(fragmentPose(event,event.fragments[0],1.1));
 wire.brokenKeys.length=0;wire.events[0].center.x=999;assert.ok(hazardBroken(view,hazard));assert.equal(event.center.x,1);
 for(const alter of [v=>v.brokenKeys=Array(257).fill('s:x'),v=>v.events[0].fragments.length=9,v=>v.events[0].center.x=Infinity,v=>v.events[0].fragments[0].velocity.x=NaN,v=>v.events[0].lifetime=40]){const bad=structuredClone(exportBreakablePresentation(live,1.1));alter(bad);assert.equal(importBreakablePresentation(bad),null);}
});
function water(){return {wake:Array.from({length:96},()=>({x:0,z:0,time:-100,heading:0,power:0,owner:{privateRace:true}})),impacts:Array.from({length:12},()=>({x:0,z:0,time:-100,amplitude:0})),craft:Array.from({length:4},()=>({x:0,z:0,heading:0,power:0})),level:-2.5};}
test('presentation captures numeric water copies without solver buffers or wake owners',()=>{
 const s=createRace({mode:'versus'}),local={size:2,cell:.75,x:0,z:0,version:1,h:new Float32Array([0,.1,.2,0]),mask:new Uint8Array(4),v:new Float32Array(4),solid:()=>true};
 const w=captureWindowWater(water(),local),read=validateWindowWater(structuredClone(w));assert.ok(read);assert.equal(read.level,-2.5);assert.equal(read.wake[0].owner,undefined);assert.equal(read.local.v,undefined);assert.equal(read.local.solid,undefined);
 assert.notEqual(w.local.h.buffer,local.h.buffer);assert.equal(local.h.byteLength,16);local.h[1]=.9;assert.notEqual(read.local.h[1],local.h[1]);
 const frame=captureWindowFrame(s,water());assert.ok(readWindowFrame(structuredClone(frame)));assert.equal(frame.course,undefined);assert.equal(frame.records,undefined);
 const bad=structuredClone(w);bad.local.h=new Float32Array(40000);assert.equal(validateWindowWater(bad),null);
});
test('view interpolation takes the short heading arc and never mutates live physics',()=>{
 const state=createRace({mode:'versus'});const wire=captureWindowFrame(state,water());const a=readWindowFrame(structuredClone(wire)),b=readWindowFrame(structuredClone(wire));a.time=1;b.time=2;a.racers[0].heading=Math.PI-.1;b.racers[0].heading=-Math.PI+.1;b.racers[0].x+=10;
 const before=JSON.stringify(state.racers),mid=interpolateWindowFrame(a,b,1.5);assert.ok(Math.abs(mid.racers[0].heading-Math.PI)<1e-6);assert.equal(mid.racers[0].x,a.racers[0].x+5);assert.equal(JSON.stringify(state.racers),before);
 state.phase='paused';stepRace(state,[{throttle:1},{throttle:1}],1/60);assert.equal(JSON.stringify(state.racers),before);
});
const turn=()=>new Promise(resolve=>setImmediate(resolve));
async function settle(){for(let i=0;i<4;i++)await turn();}
function fakeWindow(){
 const listeners=new Map(),child={closed:false,messages:[],focus(){},close(){this.closed=true;},postMessage(message,origin,ports){this.messages.push(message);if(ports?.[0]){this.port=ports[0];this.port.onmessage=e=>this.messages.push(e.data);this.port.start();}}};
 return {crypto:webcrypto,MessageChannel,location:{origin:'https://race.example',href:'https://race.example/race.html'},child,addEventListener(type,f){listeners.set(type,f);},removeEventListener(type){listeners.delete(type);},open(url){this.openedURL=url;return child;},fire(e){listeners.get('message')?.(e);}};
}
test('a verified private port isolates generations, commands, input and close fallback',async()=>{
 let now=0,fallbacks=0,commands=0;const win=fakeWindow(),host=createPlayerWindowHost({window:win,now:()=>now,onFallback:()=>fallbacks++,onCommand:()=>commands++});
 try{
  assert.equal(host.open(),true);host.begin({course:'greyhaven'});const params=new URLSearchParams(new URL(win.openedURL).hash.slice(1)),hello={type:'player-window-hello',version:PLAYER_WINDOW_VERSION,session:params.get('session'),capability:params.get('capability')};
  win.fire({source:win.child,origin:'https://attacker.example',data:hello});assert.equal(win.child.port,undefined);
  win.fire({source:win.child,origin:win.location.origin,data:hello});await settle();assert.ok(win.child.port);
  const send=(type,data={},generation=host.generation)=>win.child.port.postMessage(envelope(host.session,generation,type,data));
  send('ready');send('heartbeat',{focused:true,visible:true});send('input',{sequence:1,controls:[{throttle:1,steer:.2},{throttle:.5,steer:-.4}]});await settle();assert.ok(host.ready);assert.equal(host.remoteControls()[1].throttle,.5);
  send('command',{sequence:1,command:{kind:'pause',paused:true}});send('command',{sequence:1,command:{kind:'pause',paused:true}});send('command',{sequence:2,command:{kind:'set-score',score:999}});await settle();assert.equal(commands,1);
  host.publish({time:1});host.publish({time:2});host.publish({time:3});await settle();assert.equal(win.child.messages.filter(m=>m.type==='frame').length,1);
  send('ack',{sequence:1});await settle();assert.equal(win.child.messages.filter(m=>m.type==='frame').length,2);assert.equal(win.child.messages.at(-1).frame.time,3);
  const old=host.generation;host.begin({course:'glacier'});send('ready',{},old);send('input',{sequence:200,controls:[{throttle:1,steer:0},{throttle:1,steer:0}]},old);await settle();assert.equal(host.ready,false);assert.ok(host.remoteControls().every(c=>!c.throttle));
  host.standby();now=50000;send('heartbeat',{focused:true,visible:true});await settle();host.poll();assert.ok(host.attached,'a black between-course viewer remains reusable');assert.equal(host.remoteFocused,false,'standby cannot suppress primary controls');assert.equal(host.holding,false);
  win.child.closed=true;host.poll();assert.equal(host.attached,false);assert.equal(fallbacks,1);
 }finally{host.dispose();win.child.port?.close();}
});
test('blocked popups keep a race usable in the existing split view without a loading hold',()=>{
 const win=fakeWindow();win.open=()=>null;const host=createPlayerWindowHost({window:win});
 try{assert.equal(host.open(),false);host.begin({course:'greyhaven'});assert.equal(host.attached,false);assert.equal(host.holding,false);assert.match(host.status,/blocked/);}finally{host.dispose();}
});

test('healthy long menu and replay standbys keep their port, then start and reconnect while stale standby falls back',async()=>{
 let now=0,fallbacks=0;const win=fakeWindow(),host=createPlayerWindowHost({window:win,now:()=>now,onFallback:()=>fallbacks++});
 const bind=async()=>{const params=new URLSearchParams(new URL(win.openedURL).hash.slice(1));win.fire({source:win.child,origin:win.location.origin,data:{type:'player-window-hello',version:PLAYER_WINDOW_VERSION,session:params.get('session'),capability:params.get('capability')}});await settle();};
 const send=(type,data={})=>win.child.port.postMessage(envelope(host.session,host.generation,type,data));
 const heartbeat=async()=>{send('heartbeat',{focused:true,visible:true});await settle();host.poll();};
 try{
  assert.ok(host.open());await bind();const initialPort=win.child.port;
  // Opening from the menu binds a black view without any race descriptor.
  for(let second=1;second<=30;second++){now=second*1000;await heartbeat();assert.ok(host.attached);assert.equal(host.holding,false);}
  host.begin({course:'greyhaven'});assert.equal(host.holding,true);send('ready');await heartbeat();assert.ok(host.ready);assert.equal(win.child.port,initialPort);
  const firstGeneration=host.generation;host.standby('Replay is on Player 1.');
  for(let second=1;second<=30;second++){now=30000+second*1000;await heartbeat();assert.ok(host.attached);assert.equal(host.ready,false);assert.equal(host.remoteFocused,false);}
  host.begin({course:'glacier'});send('ready');await heartbeat();assert.ok(host.ready);assert.equal(host.generation,firstGeneration+1);assert.equal(win.child.port,initialPort,'next course reuses the healthy port');assert.equal(fallbacks,0);
  host.standby();now+=2000;host.poll();assert.equal(host.attached,false);assert.match(host.status,/connection lost/);assert.equal(fallbacks,1);
  // The normal explicit Open Player 2 action can recover a stale standby.
  initialPort.close();assert.ok(host.open());host.begin({course:'greyhaven'});await bind();send('ready');await heartbeat();assert.ok(host.ready);assert.notEqual(win.child.port,initialPort);assert.equal(fallbacks,1);
 }finally{host.dispose();win.child.port?.close();}
});

test('an unbound window and a preparing course retain the finite loader timeout',async()=>{
 for(const preparing of [false,true]){
  let now=0,fallbacks=0;const win=fakeWindow(),host=createPlayerWindowHost({window:win,now:()=>now,onFallback:()=>fallbacks++});
  try{
   host.open();if(preparing){host.begin({course:'greyhaven'});const params=new URLSearchParams(new URL(win.openedURL).hash.slice(1));win.fire({source:win.child,origin:win.location.origin,data:{type:'player-window-hello',version:PLAYER_WINDOW_VERSION,session:params.get('session'),capability:params.get('capability')}});await settle();}
   now=20001;host.poll();assert.equal(host.attached,false);assert.equal(fallbacks,1);assert.match(host.status,/did not finish loading/);
  }finally{host.dispose();win.child.port?.close();}
 }
});

test('explicit reopen reconnects the same surviving named document without a reload or stale input',async()=>{
 let now=0,fallbacks=0,requests=0;const win=fakeWindow(),child=win.child,ports=[];
 const originalPost=child.postMessage.bind(child);
 child.postMessage=(message,origin,transfers)=>{
  originalPost(message,origin,transfers);
  if(transfers?.[0])ports.push(transfers[0]);
  if(message.type==='player-window-reconnect'){
   requests++;assert.equal(origin,win.location.origin);
   // The surviving view answers the explicit request, just as its message
   // listener does. There is no simulated navigation or manual second hello.
   queueMicrotask(()=>win.fire({source:child,origin,data:{...message,type:'player-window-hello'}}));
  }
 };
 const host=createPlayerWindowHost({window:win,now:()=>now,onFallback:()=>fallbacks++});
 try{
  assert.ok(host.open());host.begin({course:'greyhaven'});await settle();
  const firstPort=child.port,firstGeneration=host.generation;
  firstPort.postMessage(envelope(host.session,firstGeneration,'ready'));
  firstPort.postMessage(envelope(host.session,firstGeneration,'heartbeat',{focused:true,visible:true}));
  firstPort.postMessage(envelope(host.session,firstGeneration,'input',{sequence:50,controls:[{throttle:1,steer:0},{throttle:1,steer:0}]}));
  await settle();assert.equal(host.ready,true);assert.equal(host.remoteControls()[1].throttle,1);
  const healthyRequests=requests;assert.ok(host.open());assert.equal(requests,healthyRequests,'focusing a healthy view keeps its port');
  now=2000;host.poll();assert.equal(fallbacks,1);assert.equal(host.attached,false);assert.equal(child.closed,false);
  assert.ok(host.open());host.begin({course:'greyhaven',time:11.05});await settle();
  assert.equal(win.child,child);assert.notEqual(child.port,firstPort);assert.equal(host.generation,firstGeneration+1);
  assert.equal(requests,healthyRequests+1);assert.ok(host.remoteControls().every(c=>!c.throttle));
  child.port.postMessage(envelope(host.session,firstGeneration,'ready'));await settle();assert.equal(host.ready,false);
  child.port.postMessage(envelope(host.session,host.generation,'ready'));await settle();assert.equal(host.ready,true);
  host.publish({time:11.05,phase:'paused'});await settle();
  assert.deepEqual(child.messages.at(-1).frame,{time:11.05,phase:'paused'});assert.equal(fallbacks,1);
 }finally{host.dispose();for(const port of ports)port.close();}
});
