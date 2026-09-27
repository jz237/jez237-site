import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import { Simulation } from '../multiplayer/simulation';
import { QuarryNetwork } from '../src/network';
import type { DamageEvent, Snapshot } from '../multiplayer/protocol';

await R.init();
const simulation=new Simulation(R);
const baseline:Snapshot={...simulation.snapshot(true),members:[{id:1,name:'GUEST',kind:'coupe',connected:true,host:true}],ack:{1:40}};
simulation.dispose();

class FakeTimers {
  now=0;
  private nextId=0;
  tasks=new Map<number,{at:number;callback:()=>void;period:number}>();
  setTimeout=(callback:()=>void,ms:number)=>{const id=++this.nextId;this.tasks.set(id,{at:this.now+ms,callback,period:0});return id;};
  setInterval=(callback:()=>void,ms:number)=>{const id=++this.nextId;this.tasks.set(id,{at:this.now+ms,callback,period:ms});return id;};
  clearTimeout=(id:number)=>{this.tasks.delete(id);};
  clearInterval=this.clearTimeout;
  advance(ms:number){
    const until=this.now+ms;
    while(true){
      const next=[...this.tasks].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];
      if(!next)break;
      const [id,task]=next;this.now=task.at;
      if(task.period)task.at+=task.period;else this.tasks.delete(id);
      task.callback();
    }
    this.now=until;
  }
  get timeouts(){return [...this.tasks.values()].filter(t=>t.period===0).length;}
}

function harness(t:TestContext){
  const timers=new FakeTimers(),sockets:FakeSocket[]=[];
  class FakeSocket {
    static OPEN=1;
    readyState=0;
    onopen?:()=>void;
    onmessage?:(event:{data:string})=>void;
    onclose?:(event:{code:number;reason:string})=>void;
    onerror?:()=>void;
    sent:any[]=[];
    clientClose?:{code:number;reason:string};
    url:string;
    constructor(url:string|URL){this.url=String(url);sockets.push(this);}
    send(message:string){assert.equal(this.readyState,1,'No messages may be sent on closed sockets');this.sent.push(JSON.parse(message));}
    close(code:number,reason:string){this.clientClose={code,reason};this.readyState=2;}
    open(){this.readyState=1;this.onopen?.();}
    message(message:unknown){this.onmessage?.({data:JSON.stringify(message)});}
    serverClose(code:number,reason:string){this.readyState=3;this.onclose?.({code,reason});}
  }
  const values=new Map<string,string>();
  const replacements={
    window:timers,
    WebSocket:FakeSocket,
    sessionStorage:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)},
    location:{href:'http://127.0.0.1:8795/games/quarry-impact/'},
  };
  const previous=new Map<string,PropertyDescriptor|undefined>();
  for(const [key,value]of Object.entries(replacements)){
    previous.set(key,Object.getOwnPropertyDescriptor(globalThis,key));
    Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
  }
  const network=new QuarryNetwork();
  t.after(()=>{
    network.disconnect();
    for(const [key,descriptor]of previous)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete (globalThis as any)[key];
  });
  const connect=(room='ABCDEF')=>{
    network.connect({endpoint:'ws://127.0.0.1:8789',room,name:'GUEST',kind:'coupe'});
    const socket=sockets.at(-1)!;socket.open();return socket;
  };
  const welcome=(socket:FakeSocket,snapshot:Snapshot=state(),id=1)=>socket.message({type:'welcome',protocol:1,room:network.room,id,token:'stable-seat-token',snapshot});
  return {network,timers,sockets,connect,welcome};
}

function state(tick=600,damage:DamageEvent[]=[]):Snapshot{
  return {...structuredClone(baseline),phase:'playing',tick,elapsed:tick/60,damage};
}
const hit=(id:number,tick:number):DamageEvent=>({id,tick,car:1,point:{x:0,y:.8,z:2},direction:{x:0,y:0,z:-1},localPoint:{x:0,y:0,z:2},localDirection:{x:0,y:0,z:-1},repair:0,damage:8});

test('welcome after a missed rematch accepts restarted damage IDs even when the new event tick is higher',t=>{
  const h=harness(t),old=h.connect();h.welcome(old,state(600,[hit(87,590)]));
  assert.deepEqual(h.network.drainDamage().map(d=>d.id),[87]);
  old.serverClose(1006,'Connection interrupted');h.timers.advance(500);
  const rejoined=h.sockets.at(-1)!;assert.notEqual(rejoined,old);rejoined.open();
  assert.equal(rejoined.sent[0].token,'stable-seat-token','Reconnect should reuse its seat token');
  const newer=state(1200,[hit(2,1190)]);newer.cars[1].p.x+=2;
  h.welcome(rejoined,newer);
  assert.equal(h.network.id,1);
  assert.deepEqual(h.network.drainDamage().map(d=>d.id),[2],'Damage from the new event must not be filtered by the previous event maximum');
  assert.equal(h.network.sample()!.cars[1].p.x,newer.cars[1].p.x,'A welcome must not interpolate from the previous event position');
  rejoined.message(state(1203,[hit(2,1190),hit(3,1202)]));
  assert.deepEqual(h.network.drainDamage().map(d=>d.id),[3]);
  rejoined.message(state(1206,[hit(2,1190),hit(3,1202)]));
  assert.deepEqual(h.network.drainDamage(),[],'Repeated snapshot history must still be deduplicated');
});

test('leaving a disconnected room cancels its pending retry and input timer',t=>{
  const h=harness(t),socket=h.connect();h.welcome(socket);
  socket.serverClose(1006,'Network dropped');assert.equal(h.timers.timeouts,1);
  h.network.disconnect();assert.equal(h.network.reconnecting,false);assert.equal(h.network.id,-1);
  assert.equal(h.timers.tasks.size,0);
  h.timers.advance(20_000);
  assert.equal(h.sockets.length,1,'Leaving must never reopen the previous room');
});

test('changing rooms cancels the old retry and ignores late close events from its socket',t=>{
  const h=harness(t),old=h.connect('ABCDEF');h.welcome(old);
  old.serverClose(1006,'Network dropped');
  const current=h.connect('GHJKLM');h.welcome(current);
  old.serverClose(4001,'Old socket finally closed');
  h.timers.advance(10_000);
  assert.equal(h.sockets.length,2,'An old room retry must not create a second connection to the new room');
  assert.equal(h.network.room,'GHJKLM');assert.equal(h.network.connected,true);
  assert.equal(h.network.reconnecting,false);assert.equal(h.timers.timeouts,0);
  assert.match(current.url,/\/rooms\/GHJKLM$/);
  assert.equal(current.sent[0].token,undefined,'Seat tokens must not leak between rooms');
});

test('transient server interruption exposes retrying status and reconnects after its delay',t=>{
  const h=harness(t),socket=h.connect();h.welcome(socket);
  const observed:{reason:string;retrying:boolean}[]=[];
  h.network.addEventListener('disconnected',event=>observed.push({reason:(event as CustomEvent<string>).detail,retrying:h.network.reconnecting}));
  socket.serverClose(1012,'Server restarting');
  assert.equal(h.network.connected,false);assert.equal(h.network.reconnecting,true);
  assert.deepEqual(observed,[{reason:'Server restarting',retrying:true}]);
  h.timers.advance(499);assert.equal(h.sockets.length,1);
  h.timers.advance(1);assert.equal(h.sockets.length,2);
  const retry=h.sockets[1];retry.open();h.welcome(retry);
  assert.equal(h.network.connected,true);assert.equal(h.network.reconnecting,false);
});

for(const [code,reason]of [[1008,'Invalid message'],[4000,'Room expired'],[4001,'Reconnected elsewhere'],[4004,'Room is full']] as const)
  test(`terminal close ${code} reports its reason without promising or scheduling a reconnect`,t=>{
    const h=harness(t),socket=h.connect();h.welcome(socket);
    let duringEvent:boolean|undefined;
    h.network.addEventListener('disconnected',()=>{duringEvent=h.network.reconnecting;});
    socket.serverClose(code,reason);
    assert.equal(h.network.connected,false);assert.equal(h.network.reconnecting,false);assert.equal(duringEvent,false);
    assert.equal(h.network.disconnectReason,reason);assert.equal(h.timers.tasks.size,0);
    h.timers.advance(20_000);assert.equal(h.sockets.length,1);
  });
