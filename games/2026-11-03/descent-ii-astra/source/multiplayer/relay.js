import { DurableObject } from 'cloudflare:workers';

const DEFAULT={mode:'coop',campaign:'d2',level:1,bots:[2,2,2]};
const json=(ws,value)=>{try{ws.send(JSON.stringify(value));}catch{}};
const error=(ws,message)=>json(ws,{type:'error',message});
export class SquadronRoom extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);this.room=null;this.rates=new Map();
    ctx.blockConcurrencyWhile(async()=>{this.room=await ctx.storage.get('room')||null;});
  }
  peers(){return this.ctx.getWebSockets().filter(s=>s.readyState===1);}
  broadcast(value){for(const s of this.peers())json(s,value);}
  async save(){await this.ctx.storage.put('room',this.room);}
  async fetch(request){
    const url=new URL(request.url),create=url.searchParams.get('create')==='1';
    if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return new Response('WebSocket required',{status:426});
    if(!this.room){
      if(!create)return new Response('Room not found',{status:404});
      this.room={config:{...DEFAULT},players:[],started:false,created:Date.now(),closed:false};
      await this.save();await this.ctx.storage.setAlarm(Date.now()+2*60*60*1000);
    }else if(create)return new Response('Room already exists',{status:409});
    if(this.room.closed||this.room.started)return new Response('Room is already in flight',{status:409});
    if(this.peers().length>=4)return new Response('Four-pilot room is full',{status:409});
    const pair=new WebSocketPair(),[client,server]=Object.values(pair);
    const id=crypto.randomUUID(),name=(url.searchParams.get('name')||'Pilot').replace(/[^a-z0-9_-]/gi,'').slice(0,8)||'Pilot';
    this.ctx.acceptWebSocket(server);server.serializeAttachment({id,slot:-1,ready:null});
    this.room.players.push({id,name});this.room.config.bots=this.room.config.bots.slice(0,4-this.room.players.length);
    await this.save();json(server,{type:'welcome',id,code:url.pathname.split('/').pop()});this.lobby();
    return new Response(null,{status:101,webSocket:client});
  }
  lobby(){this.broadcast({type:'lobby',players:this.room.players,config:this.room.config});}
  async synchronize(){
    const ready=this.peers().map(s=>s.deserializeAttachment()?.ready);
    if(!ready.length||!ready[0]||!ready.every(r=>r&&r.level===ready[0].level))return;
    if(ready.some(r=>r.checksum!==ready[0].checksum)){await this.closeRoom('Pilots have different mine data. Reload Astra and create a new room.');return;}
    const key=ready[0].level+':'+ready[0].checksum;if(this.room.synchronized===key)return;
    this.room.synchronized=key;await this.save();
    this.broadcast({type:'sync',level:ready[0].level,checksum:ready[0].checksum});
  }
  rate(ws,size){
    const now=Date.now();let r=this.rates.get(ws);
    if(!r||now-r.at>1000){r={at:now,count:0,bytes:0};this.rates.set(ws,r);}
    r.count++;r.bytes+=size;
    return r.count<=80&&r.bytes<=160000;
  }
  async webSocketMessage(ws,data){
    if(!this.room||this.room.closed)return;
    const a=ws.deserializeAttachment();if(!a)return;
    const size=typeof data==='string'?data.length:data.byteLength;
    if(size>16384||!this.rate(ws,size)){ws.close(1008,'Message limit exceeded');return;}
    if(typeof data!=='string'){
      if(!this.room.started||a.slot<0)return;
      const bytes=new Uint8Array(data),peers=this.peers();let p=0;
      const routes=new Map();
      while(p+3<=bytes.length){
        const dest=bytes[p++],n=bytes[p++]|(bytes[p++]<<8);
        if(dest>=this.room.players.length||dest===a.slot||n<1||n>1500||p+n>bytes.length){ws.close(1008,'Invalid packet');return;}
        // Native ping/ack packets can be direct between peers. The sender
        // identity always comes from this socket, never from the payload.
        let target=routes.get(dest);if(!target)routes.set(dest,target=[]);
        target.push(a.slot,n&255,n>>8,...bytes.subarray(p,p+n));p+=n;
      }
      if(p!==bytes.length){ws.close(1008,'Truncated packet');return;}
      for(const [slot,packet] of routes){const dest=peers.find(s=>s.deserializeAttachment()?.slot===slot);if(dest)try{dest.send(new Uint8Array(packet));}catch{}}
      return;
    }
    if(size>2048){ws.close(1008,'Control message too large');return;}
    let m;try{m=JSON.parse(data);}catch{return error(ws,'Invalid room message');}
    if(!m||typeof m!=='object')return;
    const host=a.id===this.room.players[0]?.id;
    if(m.type==='configure'){
      if(!host||this.room.started)return error(ws,'Only the host can configure a waiting room.');
      if(!['coop','deathmatch'].includes(m.mode)||!['d2','d2x'].includes(m.campaign)||!Number.isInteger(m.level)||m.level<1||m.level>(m.campaign==='d2'?24:20)||!Array.isArray(m.bots)||m.bots.some(s=>!Number.isInteger(s)||s<0||s>4))return error(ws,'Invalid match configuration.');
      this.room.config={mode:m.mode,campaign:m.campaign,level:m.level,bots:m.bots.slice(0,4-this.room.players.length)};
      await this.save();this.lobby();return;
    }
    if(m.type==='start'){
      if(!host||this.room.started)return error(ws,'Only the host can launch the room.');
      const c=this.room.config,players=this.room.players;
      if(players.length+c.bots.length<2)return error(ws,'Add an AI pilot or invite a friend.');
      this.room.started=true;
      this.room.launch={...c,humans:players.length,seed:crypto.getRandomValues(new Uint32Array(1))[0]&0x7fffffff,
        roster:[...players.map(p=>({name:p.name,skill:-1})),...c.bots.map((s,i)=>({name:['Viper','Orbit','Nova'][i],skill:s}))]};
      await this.save();
      for(const s of this.peers()){
        const b=s.deserializeAttachment(),self=players.findIndex(p=>p.id===b.id);s.serializeAttachment({...b,slot:self,ready:null});
        json(s,{type:'start',self,config:this.room.launch});
      }
      return;
    }
    if(m.type==='ready'&&this.room.started){
      if(!Number.isInteger(m.level)||m.level===0||m.level< -6||m.level>24||!Number.isInteger(m.checksum)||m.checksum<0||m.checksum>65535)return error(ws,'Invalid mine checksum.');
      ws.serializeAttachment({...a,ready:{level:m.level,checksum:m.checksum}});
      await this.synchronize();
    }
  }
  async webSocketClose(ws){
    this.rates.delete(ws);const a=ws.deserializeAttachment();if(!this.room||!a||this.room.closed)return;
    if(a.id===this.room.players[0]?.id){await this.closeRoom('The host left the room.');return;}
    if(this.room.started){this.broadcast({type:'left',slot:a.slot});await this.synchronize();}
    else{this.room.players=this.room.players.filter(p=>p.id!==a.id);await this.save();this.lobby();}
  }
  async webSocketError(ws){try{ws.close(1011,'Connection failed');}catch{}await this.webSocketClose(ws);}
  async closeRoom(message){
    if(!this.room)return;this.room.closed=true;await this.save();
    this.broadcast({type:'closed',message});for(const s of this.peers())try{s.close(1000,'Room ended');}catch{}
    await this.ctx.storage.setAlarm(Date.now()+60000);
  }
  async alarm(){
    if(this.room&&!this.room.closed){await this.closeRoom('This room reached its two-hour limit. Create a new room to continue.');return;}
    await this.ctx.storage.deleteAll();this.room=null;
  }
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/health')return Response.json({service:'astra-squadron',version:51,maxPilots:4});
    if(!/^\/room\/[0-9A-V]{9}$/.test(url.pathname))return new Response('Not found',{status:404});
    const origin=request.headers.get('Origin')||'';
    // The standalone Astra installation also runs from a loopback web server.
    const localInstall=/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin);
    if(!/^https:\/\/(www\.)?jez237\.com$/.test(origin)&&!/^https:\/\/[a-z0-9-]+\.jez237-site\.pages\.dev$/.test(origin)&&!localInstall)return new Response('Origin not allowed',{status:403});
    if(request.method!=='GET')return new Response('Method not allowed',{status:405});
    return env.ROOMS.getByName(url.pathname.split('/').pop()).fetch(request);
  }
};
