import {copyOnlineEventRules,type OnlineEventRules} from './online-events';
import {validLiveryFrame,validSelectedLivery,copyOnlineLivery,type LiveryFrame,type OnlineSelection} from './online-livery';
import type {LiveryLayer} from './livery-data';
import {copyOnlineSetup,type OnlineSetup,type SetupRule} from './online-setup';
import {decodeSnapshotWire,SNAPSHOT_WIRE} from './snapshot-wire';
import { PROTOCOL, createRoomCode, validRoom, type Controls, type ServerMessage, type Snapshot, type DamageEvent } from '../multiplayer/protocol';
import type { CarKind, Mode } from './rules';
import { validOnlineSnapshot } from './network-validation';
export type { Snapshot, CarState, DamageEvent, Member } from '../multiplayer/protocol';

/** Rendering adapter. It never submits transforms, damage, checkpoints or scores. */
export class QuarryNetwork extends EventTarget {
  socket?: WebSocket;
  id=-1;
  room='';
  snapshot?: Snapshot;
  liveries?:LiveryFrame;
  connected=false;
  latency=0;
  disconnectReason='Disconnected';
  private seq=0;
  private receivedAt=0;
  private previous?:Snapshot;
  private eventId=0;
  private retry=0;
  private timer=0;
  private retryTimer=0;
  private closed=true;
  private options?:{endpoint:string;room:string;name:string;kind:CarKind;setup?:OnlineSetup;livery?:LiveryLayer[]};
  private controls:Controls={throttle:0,steer:0,brake:1,handbrake:false};
  private pendingDamage:DamageEvent[]=[];
  static createCode=createRoomCode;
  static roomFromURL(){const r=new URL(location.href).searchParams.get('room')?.toUpperCase()??'';return validRoom(r)?r:'';}
  get isHost(){return this.snapshot?.members.find(m=>m.id===this.id)?.host??false;}
  get reconnecting(){return !this.closed&&!this.connected;}
  get shareURL(){const u=new URL(location.href);u.searchParams.set('room',this.room);return u.href;}
  connect(options:{endpoint:string;room?:string;name:string;kind:CarKind;setup?:OnlineSetup;livery?:LiveryLayer[]}){
    this.disconnect();const room=(options.room||createRoomCode()).toUpperCase();if(!validRoom(room))throw new Error('Room codes contain six letters or numbers.');
    const url=new URL(options.endpoint);if(url.protocol!=='wss:'&&!(url.protocol==='ws:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw new Error('Online rooms require a secure WebSocket endpoint.');
    this.closed=false;this.room=room;this.options={...options,room};this.retry=0;this.open();
    // Quiet lobbies/results let the server's WebSocket hibernation take effect.
    this.timer=window.setInterval(()=>{if(this.connected&&this.snapshot?.phase==='playing'){this.send({type:'input',seq:this.seq++,controls:this.controls});if(this.seq%40===0)this.send({type:'ping',sent:performance.now()});}},50);
  }
  private open(){
    if(this.closed||!this.options)return;const opt=this.options,u=new URL(opt.endpoint);u.pathname=u.pathname.replace(/\/$/,'')+'/rooms/'+this.room;
    const ws=this.socket=new WebSocket(u);ws.binaryType='arraybuffer';
    ws.onopen=()=>{if(ws!==this.socket)return;let token:string|undefined;try{token=sessionStorage.getItem('quarry-room-'+this.room)??undefined;}catch{}this.send({type:'hello',protocol:PROTOCOL,name:opt.name,kind:opt.kind,token,maxPlayers:24,eventRules:1,wire:SNAPSHOT_WIRE,...(opt.setup?{setup:copyOnlineSetup(opt.setup)}:{})});};
    ws.onmessage=e=>{if(ws!==this.socket)return;let m:ServerMessage;try{m=(typeof e.data==='string'?JSON.parse(e.data):decodeSnapshotWire(e.data)) as ServerMessage;if(!m||typeof m!=='object')throw new Error('Invalid message');}catch{this.rejectSnapshot();return;}
      if(m.type==='welcome'){if(m.protocol!==PROTOCOL||!validOnlineSnapshot(m.snapshot)||(m.liveries!==undefined&&(!validLiveryFrame(m.liveries,m.snapshot.cars.length)||m.liveries.revision!==m.snapshot.liveryRevision))||(m.pendingLivery!==undefined&&!validSelectedLivery(m.pendingLivery))){this.rejectSnapshot();return;}this.liveries=m.liveries;this.id=m.id;this.seq=(m.snapshot.ack[m.id]??-1)+1;try{sessionStorage.setItem('quarry-room-'+this.room,m.token);}catch{}this.eventId=0;this.pendingDamage=[];this.previous=undefined;this.snapshot=undefined;this.connected=true;this.retry=0;this.accept(m.snapshot);this.dispatchEvent(new Event('connected'));if(m.snapshot.liverySupport&&!m.pendingLivery&&opt.kind===m.snapshot.members.find(v=>v.id===m.id)?.loadout?.kind&&opt.livery)this.sendLivery(opt.kind,opt.livery);}
      else if(m.type==='liveries'){if(!this.snapshot||!validLiveryFrame(m.frame,this.snapshot.cars.length)){this.rejectSnapshot();return;}if(m.frame.revision>=(this.liveries?.revision??-1)){this.liveries=m.frame;this.dispatchEvent(new Event('liveries'));}}
      else if(m.type==='snapshot')this.accept(m);else if(m.type==='pong')this.latency=Math.round(performance.now()-m.sent);
      else if(m.type==='error')this.dispatchEvent(new CustomEvent('error',{detail:m.message}));};
    ws.onclose=e=>{if(ws!==this.socket)return;this.connected=false;this.disconnectReason=e.reason||'Connection interrupted';
      if([1008,4000,4001,4004].includes(e.code)){this.closed=true;window.clearInterval(this.timer);}
      this.dispatchEvent(new CustomEvent('disconnected',{detail:this.disconnectReason}));
      if(!this.closed)this.retryTimer=window.setTimeout(()=>this.open(),Math.min(10_000,500*2**this.retry++));};
    ws.onerror=()=>this.dispatchEvent(new CustomEvent('error',{detail:'Could not reach the multiplayer server.'}));
  }
  private accept(s:Snapshot){
    if(!validOnlineSnapshot(s)){this.rejectSnapshot();return;}
    if(this.snapshot&&s.tick<this.snapshot.tick){this.eventId=0;this.previous=undefined;this.pendingDamage=[];}
    this.previous=this.snapshot;this.snapshot=s;this.receivedAt=performance.now();
    for(const event of s.damage)if(event.id>this.eventId){this.pendingDamage.push(event);this.eventId=event.id;}
    this.dispatchEvent(new CustomEvent('snapshot',{detail:s}));
  }
  private rejectSnapshot(){this.connected=false;this.dispatchEvent(new CustomEvent('error',{detail:'The multiplayer server is using an incompatible game version. Update the server and reload this page.'}));this.socket?.close(1008,'Incompatible game version');}
  /** One snapshot of interpolation delay. Caller may predict its own car, but must reconcile to snapshot. */
  sample(now=performance.now()):Snapshot|undefined{
    const cur=this.snapshot,prev=this.previous;if(!cur)return; if(!prev||prev.phase!==cur.phase||cur.tick<=prev.tick)return cur;
    const alpha=Math.min(1,(now-this.receivedAt)/(1000/20));
    return {...cur,props:cur.props.map((p,i)=>{const before=prev.props?.[i];if(!before)return p;return {...p,p:{x:before.p.x+(p.p.x-before.p.x)*alpha,y:before.p.y+(p.p.y-before.p.y)*alpha,z:before.p.z+(p.p.z-before.p.z)*alpha}};}),cars:cur.cars.map((c,i)=>{const p=prev.cars[i];if(!p||p.repair!==c.repair||Math.hypot(c.p.x-p.p.x,c.p.z-p.p.z)>12)return c;
      const sign=p.q.x*c.q.x+p.q.y*c.q.y+p.q.z*c.q.z+p.q.w*c.q.w<0?-1:1;
      const q={x:p.q.x*(1-alpha)+c.q.x*sign*alpha,y:p.q.y*(1-alpha)+c.q.y*sign*alpha,z:p.q.z*(1-alpha)+c.q.z*sign*alpha,w:p.q.w*(1-alpha)+c.q.w*sign*alpha};
      const len=Math.hypot(q.x,q.y,q.z,q.w)||1;for(const k of ['x','y','z','w']as const)q[k]/=len;
      return {...c,p:{x:p.p.x+(c.p.x-p.p.x)*alpha,y:p.p.y+(c.p.y-p.p.y)*alpha,z:p.p.z+(c.p.z-p.p.z)*alpha},q};})};
  }
  drainDamage(){return this.pendingDamage.splice(0);}
  setInput(c:Controls){this.controls={...c};}
  clearInput(){this.controls={throttle:0,steer:0,brake:1,handbrake:false};if(this.connected)this.send({type:'input',seq:this.seq++,controls:this.controls});}
  setLoadout(loadout:OnlineSelection){if(this.snapshot?.setupSupport){this.send({type:'setup',kind:loadout.kind,setup:copyOnlineSetup(loadout.setup)});if(this.snapshot.liverySupport)this.sendLivery(loadout.kind,loadout.livery??[]);}}
  private sendLivery(kind:CarKind,layers:readonly LiveryLayer[]){this.send({type:'livery',kind,layers:copyOnlineLivery(layers)});}
  setSetupRule(rule:SetupRule){if(this.snapshot?.setupSupport)this.send({type:'setup-rule',rule});}
  start(mode:Mode,rounds=1,rules?:OnlineEventRules){rules??=this.snapshot?.event?.rules;this.send({type:'start',mode,...(this.snapshot?.eventSupport&&rules?{rules:copyOnlineEventRules(rules)}:{}),...(this.snapshot?.cupSupport?{rounds}:{})});}
  vote(mode:'race'|'derby'){if(this.snapshot?.cupSupport)this.send({type:'vote',mode});}
  nextRound(){if(this.snapshot?.cupSupport)this.send({type:'next'});}
  recover(){this.send({type:'recover'});}
  private send(m:unknown){if(this.socket?.readyState===WebSocket.OPEN)this.socket.send(JSON.stringify(m));}
  disconnect(){this.closed=true;this.connected=false;window.clearInterval(this.timer);window.clearTimeout(this.retryTimer);this.socket?.close(1000,'Left room');this.socket=undefined;this.snapshot=this.previous=undefined;this.liveries=undefined;this.pendingDamage=[];this.eventId=0;this.id=-1;}
}
