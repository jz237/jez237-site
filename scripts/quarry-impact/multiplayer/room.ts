import {releaseControls} from './protocol';
import {defaultOnlineEvent,type OnlineEventRules} from '../src/online-events';
import {copyOnlineLivery,validOnlineLivery,validSelectedLivery,type SelectedLivery,type LiveryFrame} from '../src/online-livery';
import type {LiveryLayer} from '../src/livery-data';
import {validOnlineLoadout,copyOnlineSetup,stockOnlineSetup,effectiveOnlineSetup,type SetupRule} from '../src/online-setup';
import {encodeSnapshotWire} from '../src/snapshot-wire';
import {validCapacity} from '../src/online-capacity';
import {newCup,beginCupRound,finishCupRound,nextCupMode,validCup,type CupState,type CupMode} from './cup';
import type Rapier from '@dimforge/rapier3d-compat';
import { Simulation } from './simulation';
import { NEUTRAL, PROTOCOL, parseClientMessage, type Member, type ServerMessage, type Snapshot } from './protocol';
export type Peer = { send(message: ServerMessage): void; close(code: number, reason: string): void; sendEncoded?:(message:string)=>void; sendBinary?:(message:ArrayBuffer)=>void };
type Session = { eventRules?:1; livery?:SelectedLivery; liveryAt?:number; setupAt?:number; wire?:'qiw1'; cupId:string; voteAt:number; peer: Peer; member: Member; token: string; lastInput: number; seq: number; disconnected: number; rateStart: number; count: number };
export type SavedRoom = { liveries?:LiveryFrame; setupRule?:SetupRule; snapshot: Snapshot; sessions: { eventRules?:1; livery?:SelectedLivery; wire?:'qiw1'; cupId?:string; member: Member; token: string; disconnected: number; seq: number }[]; updated: number };

export class Room {
  sim: Simulation;
  cup?:CupState;
  setupRule:SetupRule='open';
  private activeLiveries:LiveryLayer[][]=[];
  private liveryRevision=0;
  sessions = new Map<number, Session>();
  constructor(public code: string, private R: typeof Rapier, public now = () => Date.now()) { this.sim = new Simulation(R); }
  get activeCount() { return [...this.sessions.values()].filter(s=>s.member.connected).length; }
  connect(peer: Peer, raw: string): number | null {
    const hello=parseClientMessage(raw);
    if(!hello||hello.type!=='hello'){peer.close(1008,'Expected valid hello');return null;}
    if(!this.sessions.size&&this.sim.phase==='lobby'&&hello.maxPlayers===24&&this.sim.capacity!==24){this.sim.dispose();this.sim=new Simulation(this.R,'derby',[],24);}
    if(this.sim.capacity===24&&hello.maxPlayers!==24){peer.close(1008,'Update the game to join a 24-driver room.');return null;}
    if(this.sim.event&&!defaultOnlineEvent(this.sim.event.rules)&&hello.eventRules!==1){peer.close(1008,'Update the game to join an event with custom rules.');return null;}
    let session=hello.token?[...this.sessions.values()].find(s=>s.token===hello.token):undefined;
    if(session){
      if(session.member.connected)session.peer.close(4001,'Reconnected elsewhere');
      session.peer=peer;session.member.connected=true;session.disconnected=0;session.lastInput=this.now();session.rateStart=this.now();session.count=0;
    }else{
      const id=Array.from({length:this.sim.capacity},(_,i)=>i).find(i=>!this.sessions.has(i)||(!this.sessions.get(i)!.member.connected&&this.now()-this.sessions.get(i)!.disconnected>60_000));
      if(id===undefined){peer.close(4004,'Room is full');return null;}
      // Mid-event entrants take over the existing AI car, preserving its condition and location.
      session={cupId:crypto.randomUUID(),voteAt:-Infinity,peer,member:{id,loadout:{kind:hello.kind,setup:hello.setup??stockOnlineSetup(hello.kind)},name:hello.name,kind:this.sim.phase==='lobby'||this.sim.phase==='result'?hello.kind:this.sim.cars[id].state.kind,connected:true,host:this.sessions.size===0},token:crypto.randomUUID(),lastInput:this.now(),seq:-1,disconnected:0,rateStart:this.now(),count:0};
      this.sessions.set(id,session);
    }
    session.wire=hello.wire;session.eventRules=hello.eventRules;
    this.electHost();
    const welcome:ServerMessage={type:'welcome',protocol:PROTOCOL,room:this.code,id:session.member.id,token:session.token,snapshot:this.snapshot(true),liveries:this.liveryFrame(),...(session.livery?{pendingLivery:structuredClone(session.livery)}:{})};
    if(session.wire&&peer.sendBinary)peer.sendBinary(encodeSnapshotWire(welcome));else peer.send(welcome);
    this.broadcast();return session.member.id;
  }
  receive(id:number,peer:Peer,raw:string){
    const s=this.sessions.get(id);if(!s||s.peer!==peer||!s.member.connected)return;
    if(this.now()-s.rateStart>=1000){s.rateStart=this.now();s.count=0;}
    if(++s.count>90){peer.close(1008,'Input rate exceeded');this.disconnect(id,peer);return;}
    const m=parseClientMessage(raw);if(!m){peer.close(1008,'Invalid message');this.disconnect(id,peer);return;}
    if(m.type==='livery'){
      if(m.kind!==s.member.loadout?.kind){peer.send({type:'error',message:'Choose the matching car before applying its design.'});return;}
      if(this.now()-(s.liveryAt??-Infinity)<1000){peer.send({type:'error',message:'Wait a moment before applying another design.'});return;}
      s.liveryAt=this.now();s.livery={kind:m.kind,layers:copyOnlineLivery(m.layers)};s.member.liveryLayers=m.layers.length;this.broadcast();return true;
    }
    if(m.type==='setup'||m.type==='setup-rule'){
      if(this.sim.phase!=='lobby'&&this.sim.phase!=='result'){peer.send({type:'error',message:'Change your setup between events.'});return;}
      if(m.type==='setup-rule'&&!s.member.host){peer.send({type:'error',message:'Only the host can set performance rules.'});return;}
      if(this.now()-(s.setupAt??-Infinity)<250){peer.send({type:'error',message:'Wait a moment before changing your setup again.'});return;}s.setupAt=this.now();
      if(m.type==='setup-rule')this.setupRule=m.rule;else{if(s.member.loadout?.kind!==m.kind){s.livery=undefined;s.member.liveryLayers=0;}s.member.loadout={kind:m.kind,setup:copyOnlineSetup(m.setup)};s.member.kind=m.kind;}
      this.broadcast();return true;
    }
    if(m.type==='input'){
      if(m.seq<=s.seq)return;s.seq=m.seq;s.lastInput=this.now();this.sim.setInput(id,m.controls);
    }else if(m.type==='start'){
      if(!s.member.host){peer.send({type:'error',message:'Only the room host can start an event.'});return;}
      if(this.sim.phase!=='lobby'&&this.sim.phase!=='result'){peer.send({type:'error',message:'The event is already running.'});return;}
      if(this.cup&&this.cup.completed<this.cup.rounds){peer.send({type:'error',message:'Continue the current cup using Next round.'});return;}
      if(m.rules&&!defaultOnlineEvent(m.rules)&&[...this.sessions.values()].some(s=>s.member.connected&&s.eventRules!==1)){peer.send({type:'error',message:'All drivers must update the game before using custom event rules.'});return;}
      this.cup=(m.rounds??1)>1?newCup(m.rounds!,m.mode as CupMode):undefined;
      this.startRound(m.mode,m.rules);this.broadcast();return true;
    }else if(m.type==='vote'){
      if(!this.cup||this.sim.phase!=='result'||this.cup.completed>=this.cup.rounds){peer.send({type:'error',message:'Voting opens between cup rounds.'});return;}
      if(this.cup.votes[id]===m.mode||this.now()-s.voteAt<250)return;
      s.voteAt=this.now();this.cup.votes[id]=m.mode;this.broadcast();return true;
    }else if(m.type==='next'){
      if(!s.member.host){peer.send({type:'error',message:'Only the room host can advance the cup.'});return;}
      if(!this.cup||this.sim.phase!=='result'||this.cup.completed>=this.cup.rounds){peer.send({type:'error',message:'There is no next cup round.'});return;}
      this.startRound(nextCupMode(this.cup,new Set([...this.sessions].filter(([,s])=>s.member.connected).map(([id])=>id))));this.broadcast();return true;
    }else if(m.type==='recover'){if(this.sim.recover(id))this.broadcast();}
    else if(m.type==='ping')peer.send({type:'pong',sent:m.sent});
  }
  disconnect(id:number,peer:Peer){const s=this.sessions.get(id);if(!s||s.peer!==peer)return;s.member.connected=false;s.disconnected=this.now();if(this.cup)delete this.cup.votes[id];this.sim.setInput(id,{...NEUTRAL});this.electHost();this.broadcast();}
  private electHost(){let host=[...this.sessions.values()].find(s=>s.member.connected&&s.member.host);host??=[...this.sessions.values()].find(s=>s.member.connected);for(const s of this.sessions.values())s.member.host=s===host;}
  step(){const human=new Set<number>();for(const [id,s]of this.sessions){if(s.member.connected){human.add(id);if(this.now()-s.lastInput>350)this.sim.setInput(id,releaseControls(this.sim.cars[id].state.input));}}this.sim.step(human);this.settleCup();}
  snapshot(includeDamage=false):Snapshot{this.settleCup();return {...this.sim.snapshot(includeDamage),transmissionSupport:true,assistsSupport:true,eventSupport:true,liverySupport:true,liveryRevision:this.liveryRevision,setupSupport:true,setupRule:this.setupRule,cupSupport:true,...(this.cup?{cup:structuredClone(this.cup)}:{}),members:[...this.sessions.values()].map(s=>({...structuredClone(s.member),cupId:s.cupId})),ack:Object.fromEntries([...this.sessions].map(([id,s])=>[id,s.seq]))};}
  broadcast(){const snap=this.snapshot();let encoded:string|undefined,binary:ArrayBuffer|undefined;for(const s of this.sessions.values())if(s.member.connected)try{if(s.wire&&s.peer.sendBinary)s.peer.sendBinary(binary??=encodeSnapshotWire(snap));else if(s.peer.sendEncoded)s.peer.sendEncoded(encoded??=JSON.stringify(snap));else s.peer.send(snap);}catch{s.member.connected=false;s.disconnected=this.now();}this.electHost();}
  save():SavedRoom{return{liveries:this.liveryFrame(),setupRule:this.setupRule,snapshot:this.snapshot(true),sessions:[...this.sessions.values()].map(s=>({...s.eventRules?{eventRules:s.eventRules}:{},...s.livery?{livery:structuredClone(s.livery)}:{},...s.wire?{wire:s.wire}:{},cupId:s.cupId,member:structuredClone(s.member),token:s.token,disconnected:s.disconnected,seq:s.seq})),updated:this.now()};}
  restore(saved:SavedRoom){this.liveryRevision=Number.isSafeInteger(saved.liveries?.revision)&&saved.liveries!.revision>=0?saved.liveries!.revision:0;this.activeLiveries=saved.snapshot.cars.map(c=>{const row=saved.liveries?.cars.find(v=>v.id===c.id&&v.kind===c.kind);return row&&validOnlineLivery(row.layers)?copyOnlineLivery(row.layers):[];});this.setupRule=saved.setupRule==='stock'?'stock':'open';this.sim.dispose();const capacity=saved.snapshot.capacity??saved.snapshot.cars.length;if(!validCapacity(capacity)||capacity!==saved.snapshot.cars.length)throw new Error('Invalid saved room capacity');this.sim=new Simulation(this.R,saved.snapshot.mode,saved.snapshot.cars.map(c=>c.kind),capacity,saved.snapshot.cars.map(c=>c.setup));this.sim.restore(saved.snapshot);this.cup=validCup(saved.snapshot.cup)?structuredClone(saved.snapshot.cup):undefined;this.sessions.clear();for(const s of saved.sessions)this.sessions.set(s.member.id,{...s,livery:validSelectedLivery(s.livery)?structuredClone(s.livery):undefined,cupId:s.cupId??crypto.randomUUID(),voteAt:-Infinity,member:{...structuredClone(s.member),...(validOnlineLoadout(s.member.loadout)?{}:{loadout:{kind:s.member.kind,setup:stockOnlineSetup(s.member.kind)}}),connected:false},peer:{send(){},close(){}},lastInput:0,rateStart:0,count:0,disconnected:s.disconnected||this.now()});}
  private startRound(mode:'race'|'derby'|'playground',rules:OnlineEventRules|undefined=this.sim.event?.rules){
    if(this.cup)beginCupRound(this.cup,mode as CupMode,Array.from({length:this.sim.capacity},(_,id)=>{const session=this.sessions.get(id);return session?.member.connected?{id:session.cupId,name:session.member.name,bot:false}:{id:'bot-'+id,name:'AI DRIVER '+(id+1),bot:true};}));
    const loadouts=Array.from({length:this.sim.capacity},(_,i)=>this.sessions.get(i)?.member.loadout);
    const kinds=loadouts.map((loadout,i)=>loadout?.kind??this.sessions.get(i)?.member.kind??this.sim.cars[i].state.kind);
    const setups=loadouts.map((loadout,i)=>effectiveOnlineSetup(kinds[i],loadout?.setup??stockOnlineSetup(kinds[i]),this.setupRule));
    this.activeLiveries=kinds.map((kind,i)=>{const selection=this.sessions.get(i)?.livery;return selection?.kind===kind?copyOnlineLivery(selection.layers):[];});this.liveryRevision++;
    for(const [i,session]of this.sessions)session.member.kind=kinds[i];
    const capacity=this.sim.capacity;this.sim.dispose();this.sim=new Simulation(this.R,mode,kinds,capacity,setups,rules,rules?crypto.getRandomValues(new Uint32Array(1))[0]:0);this.sim.start();
    const message:ServerMessage={type:'liveries',frame:this.liveryFrame()};let binary:ArrayBuffer|undefined,encoded:string|undefined;for(const session of this.sessions.values())if(session.member.connected){try{if(session.wire&&session.peer.sendBinary)session.peer.sendBinary(binary??=encodeSnapshotWire(message));else if(session.peer.sendEncoded)session.peer.sendEncoded(encoded??=JSON.stringify(message));else session.peer.send(message);}catch{session.member.connected=false;session.disconnected=this.now();}}
    for(const session of this.sessions.values()){session.lastInput=0;session.voteAt=-Infinity;}
  }
  private liveryFrame():LiveryFrame{return{revision:this.liveryRevision,cars:this.sim.cars.map(c=>({id:c.state.id,kind:c.state.kind,layers:copyOnlineLivery(this.activeLiveries[c.state.id]??[])}))};}
  private settleCup(){
    if(!this.cup||this.sim.phase!=='result'||this.cup.completed===this.cup.round)return;
    const eligible=new Set(this.cup.entries.filter(e=>e.bot).map(e=>e.id));
    for(const [slot,session]of this.sessions)if(session.member.connected&&this.cup.participants[slot]===session.cupId)eligible.add(session.cupId);
    finishCupRound(this.cup,this.sim.ranking(),eligible);
  }
  dispose(){this.sim.dispose();}
}
