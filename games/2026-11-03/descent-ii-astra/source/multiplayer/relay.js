import { DurableObject } from 'cloudflare:workers';

const DEFAULT={mode:'coop',campaign:'d2',level:1,bots:[2,2,2]};
const json=(ws,value)=>{try{ws.send(JSON.stringify(value));}catch{}};
const error=(ws,message)=>json(ws,{type:'error',message});
const validConfig=c=>c&&['coop','deathmatch'].includes(c.mode)&&['d2','d2x'].includes(c.campaign)&&Number.isInteger(c.level)&&c.level>=1&&c.level<=(c.campaign==='d2'?24:20)&&Array.isArray(c.bots)&&c.bots.length<=3&&c.bots.every(s=>Number.isInteger(s)&&s>=0&&s<=4);
const code=()=>Array.from(crypto.getRandomValues(new Uint8Array(9)),n=>(n%32).toString(32)).join('').toUpperCase();
export class SquadronRoom extends DurableObject {
  constructor(ctx,env){
    super(ctx,env);this.room=null;this.rates=new Map();
    ctx.blockConcurrencyWhile(async()=>{this.room=await ctx.storage.get('room')||null;});
  }
  peers(){return this.ctx.getWebSockets().filter(s=>s.readyState===1);}
  broadcast(value){for(const s of this.peers())json(s,value);}
  async save(){await this.ctx.storage.put('room',this.room);}
  publicInfo(){
    if(!this.room?.public||this.room.closed||!this.peers().some(s=>s.deserializeAttachment()?.slot===0))return null;
    return {code:this.room.code,players:this.peers().length,mode:this.room.config.mode,campaign:this.room.config.campaign,level:this.room.level||this.room.config.level,host:this.room.players[0]?.name,started:this.room.started};
  }
  roster(){
    const roster=this.room.launch.roster,humans=this.room.players.filter(Boolean).length;
    this.room.launch.humans=humans;
    const pending=this.peers().reduce((bits,s)=>{const a=s.deserializeAttachment();return bits|((a.pending||a.late)?1<<a.slot:0);},0);
    this.broadcast({type:'roster',roster,humans,pending});
  }
  startPilot(ws,late){
    const a=ws.deserializeAttachment();ws.serializeAttachment({...a,pending:false,late,ready:null});
    json(ws,{type:'start',self:a.slot,config:{...this.room.launch,humans:this.room.players.filter(Boolean).length,level:this.room.level||this.room.config.level,public:true,late}});this.roster();
  }
  async publicJoin(request){
    const url=new URL(request.url);
    if(this.peers().length>=4)return new Response('Four-pilot room is full',{status:409});
    const slot=this.room.players.findIndex((p,i)=>i>0&&!p);if(slot<0)return new Response('Four-pilot room is full',{status:409});
    const [client,ws]=Object.values(new WebSocketPair()),id=crypto.randomUUID(),name=(url.searchParams.get('name')||'Pilot').replace(/[^a-z0-9_-]/gi,'').slice(0,8)||'Pilot';
    this.ctx.acceptWebSocket(ws);ws.serializeAttachment({id,slot,ready:null,pending:false,late:false});
    this.room.players[slot]={id,name};this.room.launch.roster[slot]={name,skill:-1};
    await this.save();json(ws,{type:'welcome',id,code:this.room.code,public:true});this.roster();
    const late=!!this.room.synchronized;
    if(late&&!this.room.accepting){ws.serializeAttachment({id,slot,ready:null,pending:true,late:false});this.roster();json(ws,{type:'waiting',message:'Joined the room. Waiting for the next mine…'});}
    else this.startPilot(ws,late);
    return new Response(null,{status:101,webSocket:client});
  }
  async fetch(request){
    const url=new URL(request.url),create=url.searchParams.get('create')==='1';
    if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return new Response('WebSocket required',{status:426});
    if(!this.room){
      if(!create)return new Response('Room not found',{status:404});
      const publicRoom=request.headers.get('X-Astra-Public')==='1';
      let config={...DEFAULT};if(publicRoom){try{config=JSON.parse(request.headers.get('X-Astra-Config'));}catch{}if(!validConfig(config))config={...DEFAULT};}
      this.room={config,players:[],started:false,created:Date.now(),closed:false,public:publicRoom,code:url.pathname.split('/').pop(),accepting:false};
      await this.save();await this.ctx.storage.setAlarm(Date.now()+2*60*60*1000);
    }else if(create)return new Response('Room already exists',{status:409});
    if(this.room.closed)return new Response('Room ended',{status:409});
    if(this.room.started)return this.room.public?this.publicJoin(request):new Response('Room is already in flight',{status:409});
    if(this.peers().length>=4)return new Response('Four-pilot room is full',{status:409});
    const pair=new WebSocketPair(),[client,server]=Object.values(pair);
    const id=crypto.randomUUID(),name=(url.searchParams.get('name')||'Pilot').replace(/[^a-z0-9_-]/gi,'').slice(0,8)||'Pilot';
    this.ctx.acceptWebSocket(server);server.serializeAttachment({id,slot:-1,ready:null});
    this.room.players.push({id,name});this.room.config.bots=this.room.config.bots.slice(0,4-this.room.players.length);
    await this.save();json(server,{type:'welcome',id,code:url.pathname.split('/').pop(),public:!!this.room.public});
    if(this.room.public){
      const c=this.room.config;this.room.started=true;this.room.players=[{id,name},null,null,null];
      this.room.launch={...c,public:true,humans:1,seed:crypto.getRandomValues(new Uint32Array(1))[0]&0x7fffffff,roster:[{name,skill:-1},...[0,1,2].map(i=>({name:c.bots[i]===undefined?'Empty':['Viper','Orbit','Nova'][i],skill:c.bots[i]??-2}))]};
      server.serializeAttachment({id,slot:0,ready:null});await this.save();this.startPilot(server,false);
    }else this.lobby();
    return new Response(null,{status:101,webSocket:client});
  }
  lobby(){this.broadcast({type:'lobby',players:this.room.players,config:this.room.config});}
  async synchronize(){
    const ready=this.peers().filter(s=>!s.deserializeAttachment()?.late&&!s.deserializeAttachment()?.pending).map(s=>s.deserializeAttachment()?.ready);
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
    if(m.type==='state'&&host&&this.room.public&&this.room.started){
      if(!Number.isInteger(m.level)||m.level===0||m.level< -6||m.level>24)return;
      if(this.room.level!==m.level||this.room.accepting!==!!m.accepting){this.room.level=m.level;this.room.accepting=!!m.accepting;await this.save();}
      if(this.room.accepting)for(const s of this.peers())if(s.deserializeAttachment()?.pending)this.startPilot(s,true);
      return;
    }
    if(m.type==='joined'&&this.room.public&&this.room.started){ws.serializeAttachment({...a,late:false,pending:false});this.roster();return;}
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
      if(this.room.public&&host){
        this.room.level=m.level;this.room.accepting=false;
        for(const s of this.peers()){
          const b=s.deserializeAttachment();if(s===ws)continue;
          if(b.pending)this.startPilot(s,false);
          else if(b.late&&b.ready?.level!==m.level){s.serializeAttachment({...b,late:false,ready:null});json(s,{type:'retarget',level:m.level,late:false});}
        }
        this.roster();
        await this.save();
      }
      if(this.room.public&&a.late){
        const hostReady=this.peers().find(s=>s.deserializeAttachment()?.slot===0)?.deserializeAttachment()?.ready;
        if(hostReady&&hostReady.level!==m.level){json(ws,{type:'retarget',level:hostReady.level,late:false});ws.serializeAttachment({...a,late:false,ready:null});return;}
        if(hostReady&&hostReady.checksum!==m.checksum){error(ws,'Mine data differs from the host. Reload Astra.');ws.close(1008,'Mine mismatch');return;}
      }
      ws.serializeAttachment({...ws.deserializeAttachment(),ready:{level:m.level,checksum:m.checksum}});
      await this.synchronize();
    }
  }
  async webSocketClose(ws){
    this.rates.delete(ws);const a=ws.deserializeAttachment();if(!this.room||!a||this.room.closed)return;
    if(a.id===this.room.players[0]?.id){await this.closeRoom('The host left the room.');return;}
    if(this.room.started){
      this.broadcast({type:'left',slot:a.slot});
      if(this.room.public){this.room.players[a.slot]=null;this.room.launch.roster[a.slot]={name:'Empty',skill:-2};await this.save();this.roster();}
      await this.synchronize();
    }
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
// One directory coordinates room selection, while each match owns its sockets.
// Requests are serialized so simultaneous first arrivals share a single room.
export class SquadronLobby extends DurableObject {
  constructor(ctx,env){super(ctx,env);this.rooms=[];this.serial=Promise.resolve();ctx.blockConcurrencyWhile(async()=>{this.rooms=await ctx.storage.get('rooms')||[];});}
  fetch(request){const job=this.serial.then(()=>this.match(request));this.serial=job.catch(()=>{});return job;}
  async match(request){
    const url=new URL(request.url),rooms=[];
    for(const entry of this.rooms){if(Date.now()-entry.created>2*60*60*1000)continue;const info=await this.env.ROOMS.getByName(entry.code).publicInfo();if(info)rooms.push({entry,info});}
    const retained=rooms.map(r=>r.entry);await this.ctx.storage.put('rooms',retained);this.rooms=retained;
    for(const {entry,info} of rooms){
      if(info.players>=4)continue;
      const target=new URL(request.url);target.pathname='/room/'+entry.code;target.searchParams.delete('create');
      const response=await this.env.ROOMS.getByName(entry.code).fetch(new Request(target,request));if(response.status===101)return response;
    }
    if(rooms.length&&url.searchParams.get('new')!=='1'){
      const [client,ws]=Object.values(new WebSocketPair());ws.accept();json(ws,{type:'rooms',rooms:rooms.map(r=>r.info)});ws.close(1000,'All rooms full');
      return new Response(null,{status:101,webSocket:client});
    }
    if(rooms.length>=16)return new Response('Public rooms are full. Try again shortly.',{status:503});
    const entry={code:code(),created:Date.now()},next=[...this.rooms,entry];await this.ctx.storage.put('rooms',next);this.rooms=next;
    const target=new URL(request.url);target.pathname='/room/'+entry.code;target.searchParams.set('create','1');
    const headers=new Headers(request.headers);headers.set('X-Astra-Public','1');headers.set('X-Astra-Config',url.searchParams.get('config')||JSON.stringify(DEFAULT));
    return this.env.ROOMS.getByName(entry.code).fetch(new Request(target,{method:'GET',headers}));
  }
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/health')return Response.json({service:'astra-squadron',version:52,maxPilots:4});
    if(url.pathname!=='/online'&&!/^\/room\/[0-9A-V]{9}$/.test(url.pathname))return new Response('Not found',{status:404});
    const origin=request.headers.get('Origin')||'';
    // The standalone Astra installation also runs from a loopback web server.
    const localInstall=/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin);
    if(!/^https:\/\/(www\.)?jez237\.com$/.test(origin)&&!/^https:\/\/[a-z0-9-]+\.jez237-site\.pages\.dev$/.test(origin)&&!localInstall)return new Response('Origin not allowed',{status:403});
    if(request.method!=='GET')return new Response('Method not allowed',{status:405});
    if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return new Response('WebSocket required',{status:426});
    const headers=new Headers(request.headers);headers.delete('X-Astra-Public');headers.delete('X-Astra-Config');request=new Request(request,{headers});
    if(url.pathname==='/online')return env.LOBBY.getByName('public-v52').fetch(request);
    return env.ROOMS.getByName(url.pathname.split('/').pop()).fetch(request);
  }
};
