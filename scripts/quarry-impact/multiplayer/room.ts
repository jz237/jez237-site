import type Rapier from '@dimforge/rapier3d-compat';
import { Simulation } from './simulation';
import { MAX_PLAYERS, NEUTRAL, PROTOCOL, parseClientMessage, type Member, type ServerMessage, type Snapshot } from './protocol';
export type Peer = { send(message: ServerMessage): void; close(code: number, reason: string): void };
type Session = { peer: Peer; member: Member; token: string; lastInput: number; seq: number; disconnected: number; rateStart: number; count: number };
export type SavedRoom = { snapshot: Snapshot; sessions: { member: Member; token: string; disconnected: number; seq: number }[]; updated: number };

export class Room {
  sim: Simulation;
  sessions = new Map<number, Session>();
  constructor(public code: string, private R: typeof Rapier, public now = () => Date.now()) { this.sim = new Simulation(R); }
  get activeCount() { return [...this.sessions.values()].filter(s=>s.member.connected).length; }
  connect(peer: Peer, raw: string): number | null {
    const hello=parseClientMessage(raw);
    if(!hello||hello.type!=='hello'){peer.close(1008,'Expected valid hello');return null;}
    let session=hello.token?[...this.sessions.values()].find(s=>s.token===hello.token):undefined;
    if(session){
      if(session.member.connected)session.peer.close(4001,'Reconnected elsewhere');
      session.peer=peer;session.member.connected=true;session.disconnected=0;session.lastInput=this.now();session.rateStart=this.now();session.count=0;
    }else{
      const id=Array.from({length:MAX_PLAYERS},(_,i)=>i).find(i=>!this.sessions.has(i)||(!this.sessions.get(i)!.member.connected&&this.now()-this.sessions.get(i)!.disconnected>60_000));
      if(id===undefined){peer.close(4004,'Room is full');return null;}
      // Mid-event entrants take over the existing AI car, preserving its condition and location.
      session={peer,member:{id,name:hello.name,kind:this.sim.phase==='lobby'||this.sim.phase==='result'?hello.kind:this.sim.cars[id].state.kind,connected:true,host:this.sessions.size===0},token:crypto.randomUUID(),lastInput:this.now(),seq:-1,disconnected:0,rateStart:this.now(),count:0};
      this.sessions.set(id,session);
    }
    this.electHost();
    peer.send({type:'welcome',protocol:PROTOCOL,room:this.code,id:session.member.id,token:session.token,snapshot:this.snapshot(true)});
    this.broadcast();return session.member.id;
  }
  receive(id:number,peer:Peer,raw:string){
    const s=this.sessions.get(id);if(!s||s.peer!==peer||!s.member.connected)return;
    if(this.now()-s.rateStart>=1000){s.rateStart=this.now();s.count=0;}
    if(++s.count>90){peer.close(1008,'Input rate exceeded');this.disconnect(id,peer);return;}
    const m=parseClientMessage(raw);if(!m){peer.close(1008,'Invalid message');this.disconnect(id,peer);return;}
    if(m.type==='input'){
      if(m.seq<=s.seq)return;s.seq=m.seq;s.lastInput=this.now();this.sim.setInput(id,m.controls);
    }else if(m.type==='start'){
      if(!s.member.host){peer.send({type:'error',message:'Only the room host can start an event.'});return;}
      if(this.sim.phase!=='lobby'&&this.sim.phase!=='result'){peer.send({type:'error',message:'The event is already running.'});return;}
      const kinds=Array.from({length:MAX_PLAYERS},(_,i)=>this.sessions.get(i)?.member.kind??this.sim.cars[i].state.kind);
      this.sim.dispose();this.sim=new Simulation(this.R,m.mode,kinds);this.sim.start();this.broadcast();
    }else if(m.type==='recover'){if(this.sim.recover(id))this.broadcast();}
    else if(m.type==='ping')peer.send({type:'pong',sent:m.sent});
  }
  disconnect(id:number,peer:Peer){const s=this.sessions.get(id);if(!s||s.peer!==peer)return;s.member.connected=false;s.disconnected=this.now();this.sim.setInput(id,{...NEUTRAL});this.electHost();this.broadcast();}
  private electHost(){let host=[...this.sessions.values()].find(s=>s.member.connected&&s.member.host);host??=[...this.sessions.values()].find(s=>s.member.connected);for(const s of this.sessions.values())s.member.host=s===host;}
  step(){const human=new Set<number>();for(const [id,s]of this.sessions){if(s.member.connected){human.add(id);if(this.now()-s.lastInput>350)this.sim.setInput(id,{...NEUTRAL});}}this.sim.step(human);}
  snapshot(includeDamage=false):Snapshot{return {...this.sim.snapshot(includeDamage),members:[...this.sessions.values()].map(s=>({...s.member})),ack:Object.fromEntries([...this.sessions].map(([id,s])=>[id,s.seq]))};}
  broadcast(){const snap=this.snapshot();for(const s of this.sessions.values())if(s.member.connected)try{s.peer.send(snap);}catch{s.member.connected=false;s.disconnected=this.now();}this.electHost();}
  save():SavedRoom{return{snapshot:this.snapshot(true),sessions:[...this.sessions.values()].map(s=>({member:{...s.member},token:s.token,disconnected:s.disconnected,seq:s.seq})),updated:this.now()};}
  restore(saved:SavedRoom){this.sim.dispose();this.sim=new Simulation(this.R,saved.snapshot.mode,saved.snapshot.cars.map(c=>c.kind));this.sim.restore(saved.snapshot);for(const s of saved.sessions)this.sessions.set(s.member.id,{...s,member:{...s.member,connected:false},peer:{send(){},close(){}},lastInput:0,rateStart:0,count:0,disconnected:s.disconnected||this.now()});}
  dispose(){this.sim.dispose();}
}
