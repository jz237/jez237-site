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
    onmessage?:(event:{data:string|ArrayBuffer})=>void;
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
    binary(message:ArrayBuffer){this.onmessage?.({data:message});}
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

test('client advertises opponent control support and refuses old-server changes',t=>{const h=harness(t),socket=h.connect();assert.equal(socket.sent[0].opponentSets,1);h.welcome(socket);const count=socket.sent.length;h.network.setOpponentSet('fwd');assert.equal(socket.sent.length,count);socket.message({...state(603),rosterSupport:true,kiteSupport:true,morrowSupport:true,opponentSetSupport:true});h.network.setOpponentSet('fwd');assert.deepEqual(socket.sent.at(-1),{type:'opponent-set',set:'fwd'});socket.message({...state(606),opponentSet:'fwd'});assert.equal(h.network.connected,false);assert.equal(socket.clientClose?.code,1008);});
