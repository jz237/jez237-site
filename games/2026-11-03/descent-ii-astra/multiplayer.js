/* Four-pilot rooms: native Descent packets over a bounded, reliable relay. */
(() => {
  'use strict';
  const ENDPOINT='wss://astra-squadron.jez237.workers.dev';
  const campaigns=window.astraCampaigns;
  const skills=['Novice','Rookie','Hotshot','Ace','Expert'];
  const $=id=>document.getElementById(id);
  let socket=null,lobby=null,identity=null,timer=null,queue=[],out=[],bytes=0,barrier=null,roomChoices=false,lastHostState='',ignoreStart=false;
  let ui,notice,roomField,roster,connectButtons,start,setup,playBar;
  let sentTimes=[];
  let credential=null,roomCode='',intentional=false,retryTimer=null,retryUntil=0,heartbeat=null,lastPong=0,lastInventory=0;
  const session={session:null,failed:false,departed:0,stats:{sent:0,received:0},
    abort:message=>fail(message),
    quickCoop(){if(this.session||socket)return;$('squadMode').value='coop';$('squadCampaign').value=$('campaign').value;$('squadLevel').value='1';setup.onchange();ui.showModal();connect(false,true);},
    quickArena(online){if(this.session||socket)return;$('squadCampaign').value=$('campaign').value;$('squadLevel').value=$('classicLevel').value||'1';$('squadMode').value='deathmatch';setup.onchange();ui.showModal();if(online)connect(false,true);else practice();},
    watchArena(){
      if(this.session||socket)return;
      const campaign=$('campaign').value,c=campaigns[campaign];if(!c?.arena)return;
      const skill=Math.max(0,Math.min(4,Number($('arenaSkill').value)||0)),level=Math.max(1,Math.min(c.levels,Number($('demoLevel').value)||1));
      this.launch({mode:'deathmatch',campaign,level,spectator:true,seed:crypto.getRandomValues(new Uint32Array(1))[0]&0x7fffffff,humans:1,bots:[skill,skill,skill],roster:[{name:'Astra',skill:-1},...['Viper','Orbit','Nova'].map(name=>({name,skill}))]},0);
    },
    campaignState(payload){if(socket&&this.session?.campaign==='overload'&&this.session.self===this.session.host)send({type:'campaign-state',level:this.targetLevel,payload});},
    campaignHit(go,damage){if(socket&&this.session?.campaign==='overload')send({type:'campaign-hit',level:this.targetLevel,go,damage});},
    campaignRequest(){send({type:'campaign-request',level:this.targetLevel});},
    shutdown(){intentional=true;ignoreStart=true;this.failed=true;send({type:'leave'});clearInterval(heartbeat);clearTimeout(retryTimer);clearInterval(timer);timer=null;if(socket){socket.onclose=null;socket.onmessage=null;socket.close(1000,'Leaving');socket=null;}queue=[];out=[];bytes=0;},
    reconnect(){if(socket)socket.close(4001,'Reconnecting');else reconnect();},
    rejoined(){retryUntil=0;this.reconnecting=false;this.failed=false;window.astraOverload?.resyncNetwork?.();if(ui.open)ui.close();window.Module?._astra_reset_flight_input?.();status('Connection restored · Same ship');},
    order(order,direction){const data={type:'order',order,direction};if(socket)send(data);else if(this.session?.mode==='coop'){data.from=this.session.self;window.astraSquadUI?.command(data);}},
    orderResult(from,order,ok){const m={type:'order-result',from,order,ok};if(socket)send(m);else window.astraSquadUI?.result(m);},
    help(){if(socket)send({type:'help'});else window.astraSquadUI?.help(this.session.self);},
    waitForMine:()=>status('Joined the room. Waiting for the next mine…'),
    get menuOpen(){return !!ui?.open&&!!this.session;},
    menu(){if(!this.session)return;document.exitPointerLock?.();window.astraFlightFocus?.(false);ui.classList.add('squad-in-flight');ui.showModal();status('The match continues while this menu is open.');},
    peek:()=>queue[0],take:()=>queue.shift(),
    send(dest,data){
      if(!socket||socket.readyState!==1||this.failed)return;
      if(data.length>1500||out.length>=256||bytes+data.length>48000){fail('Connection is too slow. Please rejoin the room.');return;}
      out.push({dest,data:data.slice()});bytes+=data.length+3;
    },
    ready(level,checksum){
      queue=[];out=[];bytes=0;barrier=null;this.targetLevel=level;if(this.campaignSnapshot?.level!==level)this.campaignSnapshot=null;
      if(!socket){barrier={level,checksum};return;}
      send({type:'ready',level,checksum});status('Waiting for the other pilots to load…');
    },
    synchronized:level=>barrier?.level===level,
    playing(self,level){this.session.late=false;send({type:'joined'});status(`${this.session.public?'Public room · ':''}${this.session.mode==='coop'?'Co-op':'Deathmatch'} · Mine ${level}`);},
    hostState(level,checksum,accepting){if(!this.session||this.session.self!==(this.session.host??0))return;const value=JSON.stringify({type:'state',level,checksum,accepting:!!accepting});if(value!==lastHostState){lastHostState=value;if(socket?.readyState===1)socket.send(value);}},
    launch(config,self){
      this.session={...config,host:config.host??0,self};this.targetLevel=config.level;this.failed=false;queue=[];out=[];bytes=0;
      $('campaign').value=config.campaign;$('look').value='astra';$('intro').checked=false;
      ui.close();ui.classList.add('squad-in-flight');document.body.classList.add('squadron');playBar.hidden=!!config.spectator;
      window.astraLaunchSquadron();
    }
  };
  window.astraNet=session;
  function status(text){notice.textContent=text;if(playBar)playBar.querySelector('span').textContent=text;}
  function fail(message){
    if(session.failed)return;session.failed=true;status(message);clearInterval(timer);timer=null;clearInterval(heartbeat);clearTimeout(retryTimer);
    socket?.close(1000,'Leaving');socket=null;
    if(session.session){
      document.exitPointerLock?.();window.astraFlightFocus?.(false);
      if(window.Module){Module.netDisconnected=true;Module.autoPaused=true;}
      ui.showModal();start.hidden=true;connectButtons.hidden=true;
      const back=document.createElement('button');back.textContent='Return to title';back.onclick=()=>window.astraNavigation.home(false);notice.after(back);
    }
  }
  function send(data){if(socket?.readyState===1)socket.send(JSON.stringify(data));}
  function flush(){
    if(!out.length||socket?.readyState!==1)return;
    if(socket.bufferedAmount>128*1024){fail('Network connection cannot keep up. Please rejoin.');return;}
    // Keep 30 of the relay's 80 messages/second available for control traffic.
    // A busy object transfer stays ordered and bounded instead of flooding it.
    const now=performance.now();while(sentTimes.length&&now-sentTimes[0]>=1000)sentTimes.shift();
    while(out.length&&sentTimes.length<50){
      const parts=[];let n=0;
      while(out.length&&n+out[0].data.length+3<=16384){const p=out.shift();parts.push(p);n+=p.data.length+3;}
      const data=new Uint8Array(n);let k=0;
      for(const p of parts){data[k++]=p.dest;data[k++]=p.data.length&255;data[k++]=p.data.length>>8;data.set(p.data,k);k+=p.data.length;}
      socket.send(data);sentTimes.push(now);session.stats.sent+=parts.length;bytes-=n;
    }
  }
  function receive(raw){
    if(typeof raw==='string'){
      let m;try{m=JSON.parse(raw);}catch{return;}
      if(m.type==='error'){status(m.message);return;}
      if(m.type==='closed'){fail(m.message||'The host ended the room.');return;}
      if(m.type==='welcome'){identity=m.id;roomCode=m.code;credential=m.token||null;roomField.value=m.code;status(m.public?'Joining the public room…':'Room ready. Share the invite link with your friends.');return;}
      if(m.type==='waiting'){status(m.message);return;}
      if(m.type==='pong'){lastPong=performance.now();session.latency=Math.round(lastPong-m.at);return;}
      if(m.type==='host'){
        if(session.session&&m.host>=0){session.session.host=m.host;session.epoch=m.epoch;lastHostState='';status(m.host===session.session.self?'You are now hosting · Flight continues':`${session.session.roster[m.host]?.name||'Another pilot'} is now hosting`);}return;
      }
      if(m.type==='resumed'){
        session.session.host=m.host;session.session.level=m.level;session.session.late=m.late;session.session.roster=m.roster;session.targetLevel=m.level;session.departed&=~(1<<m.self);queue=[];out=[];bytes=0;lastHostState='';
        if(window.Module?.netState){if(m.late){Module.netRejoinCommand=1;}else{Module.netReconnecting=false;Module.netDisconnected=false;session.rejoined();}}
        else if(!m.late)session.reconnecting=false;
        status(m.late?'Restoring your ship and the current mine…':'Connection restored');return;
      }
      if(m.type==='inventory'){if(window.Module&&m.level===(Module.netState?.level||session.targetLevel))Module.netBotInventory=m.bots;return;}
      if(m.type==='order'){window.astraSquadUI?.command(m);return;}
      if(m.type==='order-result'){window.astraSquadUI?.result(m);return;}
      if(m.type==='help'){window.astraSquadUI?.help(m.from);return;}
      if(m.type==='campaign-state'){const n=session.session;if(n?.campaign==='overload'&&m.level===session.targetLevel){session.campaignSnapshot=m;window.astraOverload?.receiveNetwork?.(m);}return;}
      if(m.type==='campaign-request'){window.astraOverload?.publishNetwork?.(true);return;}
      if(m.type==='campaign-hit'){if(session.session?.self===session.session?.host)window.astraOverload?.networkHit?.(m);return;}
      if(m.type==='rooms'){showRooms(m.rooms);return;}
      if(m.type==='retarget'){session.targetLevel=m.level;session.session.level=m.level;session.session.late=!!m.late;barrier=null;status('The host is moving to the next mine…');return;}
      if(m.type==='roster'){
        if(!session.session)return;let changed=0;
        m.roster.forEach((p,i)=>{const old=session.session.roster[i];if(!old||old.name!==p.name||old.skill!==p.skill)changed|=1<<i;if(p.skill===-1)session.departed&=~(1<<i);});
        session.session.roster=m.roster;session.session.humans=m.humans;session.pendingSlots=m.pending||0;if(Number.isInteger(m.disconnected))session.departed=m.disconnected;
        if(window.Module)Module.netRosterDirty=(Module.netRosterDirty||0)|changed;return;
      }
      if(m.type==='lobby'){lobby=m;render();return;}
      if(m.type==='start'){if(!ignoreStart)session.launch(m.config,m.self);return;}
      if(m.type==='sync'){
        if(m.level!==session.targetLevel)return;
        // The relay sends this after every pilot's ready message. Its ordered
        // WebSocket stream puts all old-mine packets before this barrier.
        // Keep old end-level status from marking next-mine pilots as waiting.
        queue=[];barrier={level:m.level,checksum:m.checksum};status('All pilots ready');return;
      }
      if(m.type==='left'){session.departed|=1<<m.slot;if(window.Module)Module.netLeft=(Module.netLeft||0)|(1<<m.slot);return;}
      return;
    }
    const data=new Uint8Array(raw);let p=0;
    while(p+3<=data.length){
      const source=data[p++],n=data[p++]|(data[p++]<<8);
      if(source>3||!n||n>1500||p+n>data.length){fail('Invalid multiplayer packet.');return;}
      if(queue.length>=2048){fail('The game fell too far behind the room. Please rejoin.');return;}
      queue.push({source,bytes:data.slice(p,p+n)});p+=n;session.stats.received++;
    }
    if(p!==data.length)fail('Incomplete multiplayer packet.');
  }
  function configuration(){
    const campaign=$('squadCampaign').value,level=Math.max(1,Math.min(campaigns[campaign]?.levels||24,Math.trunc(Number($('squadLevel').value)||1)));
    return {mode:$('squadMode').value,campaign,level,bots:[0,1,2].map(i=>Number($('squadAI'+i).value)).filter(v=>v>=0)};
  }
  function randomCode(){return Array.from(crypto.getRandomValues(new Uint8Array(9)),v=>(v%32).toString(32)).join('').toUpperCase();}
  function pilotName(){return ($('squadName').value.replace(/[^a-z0-9_-]/gi,'').slice(0,8)||'Pilot');}
  function connect(create,online=false,force=false){
    if(socket||session.session)return;intentional=false;
    let code=create?randomCode():roomField.value.trim().toUpperCase();
    if(!online&&!/^[0-9A-V]{9}$/.test(code)){status('Enter the nine-character invite code.');return;}
    ignoreStart=false;roomChoices=false;$('squadRooms').hidden=true;
    status('Connecting…');connectButtons.querySelectorAll('button').forEach(b=>b.disabled=true);
    const base=window.astraRelayOverride&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?window.astraRelayOverride:ENDPOINT;
    const route=online?`/online?v=54&build=86&new=${force?1:0}&name=${encodeURIComponent(pilotName())}&config=${encodeURIComponent(JSON.stringify(configuration()))}`:`/room/${code}?v=54&build=86&create=${create?1:0}&name=${encodeURIComponent(pilotName())}`;
    socket=new WebSocket(base+route);
    socket.binaryType='arraybuffer';socket.onmessage=e=>receive(e.data);
    socket.onopen=()=>{startHeartbeat();sentTimes=[];timer=setInterval(flush,20);if(create&&!online)send({type:'configure',...configuration()});};
    socket.onerror=()=>status('Could not reach the room service. You can still play with AI pilots.');
    socket.onclose=()=>{
      clearInterval(timer);timer=null;socket=null;
      if(session.session&&!session.failed&&!intentional){if(credential)reconnect();else fail('Disconnected from the room. Return to the title to reconnect.');}
      else if(!session.session){lobby=null;identity=null;render();if(!roomChoices)status('Room connection closed.');}
    };
  }
  function startHeartbeat(){
    clearInterval(heartbeat);lastPong=performance.now();
    heartbeat=setInterval(()=>{
      if(!socket||socket.readyState!==1)return;
      if(!document.hidden&&performance.now()-lastPong>15000){socket.close(4001,'Connection timeout');return;}
      send({type:'ping',at:performance.now()});
      const m=window.Module;if(m?.netBotExport&&session.session?.self===session.session?.host&&performance.now()-lastInventory>1000){lastInventory=performance.now();send({type:'inventory',level:m.netState.level,bots:m.netBotExport});}
    },2500);
  }
  function reconnect(){
    if(intentional||session.failed||!credential||!session.session)return;
    clearInterval(timer);clearInterval(heartbeat);clearTimeout(retryTimer);queue=[];out=[];bytes=0;
    session.reconnecting=true;if(window.Module)Module.netReconnecting=true;document.exitPointerLock?.();
    if(!retryUntil)retryUntil=Date.now()+85000;
    if(Date.now()>=retryUntil){fail('Reconnect time expired. Your room may still be available from Go online.');return;}
    status('Connection interrupted · Reconnecting to your ship…');
    retryTimer=setTimeout(()=>{
      const base=window.astraRelayOverride&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?window.astraRelayOverride:ENDPOINT;
      const ws=socket=new WebSocket(base+'/room/'+roomCode+'?v=54&build=86&resume=1');ws.binaryType='arraybuffer';
      ws.onopen=()=>{startHeartbeat();sentTimes=[];timer=setInterval(flush,20);send({type:'resume',token:credential});};
      ws.onmessage=e=>receive(e.data);ws.onerror=()=>{};
      ws.onclose=()=>{if(socket===ws)socket=null;if(!intentional&&!session.failed)reconnect();};
    },1500);
  }
  function showRooms(rooms){
    roomChoices=true;const box=$('squadRooms');box.hidden=false;box.replaceChildren();
    const heading=document.createElement('h3');heading.textContent='The public room is full';box.append(heading);
    for(const r of rooms){const row=document.createElement('p');row.textContent=`${r.host} · ${r.mode==='coop'?'Co-op':'Deathmatch'} · ${campaigns[r.campaign]?.name||r.campaign} ${r.level} · ${r.players}/4 players`;box.append(row);}
    for(const [label,fresh] of [['Try joining again',false],['Start another public room',true]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>connect(false,true,fresh);box.append(b);}
    status('All matching public rooms have four human pilots. Try again or start another room.');
    heading.tabIndex=-1;heading.focus();box.scrollIntoView({block:'nearest'});
  }
  function render(){
    connectButtons.querySelectorAll('button').forEach(b=>b.disabled=!!socket);
    const host=lobby?.players[0]?.id===identity;start.hidden=!host;
    setup.querySelectorAll('select,input').forEach(e=>e.disabled=!!lobby&&!host);
    roster.replaceChildren();
    if(!lobby)return;
    const c=lobby.config;$('squadMode').value=c.mode;$('squadCampaign').value=c.campaign;$('squadLevel').value=c.level;
    for(let i=0;i<3;i++)$('squadAI'+i).value=String(c.bots[i]??-1);
    const pilots=[...lobby.players.map((p,i)=>`${p.name}${i===0?' · Host':''}${p.id===identity?' · You':''}`),...c.bots.map((s,i)=>`AI ${i+1} · ${skills[s]}`)];
    for(const text of pilots){const row=document.createElement('li');row.textContent=text;roster.append(row);}
    start.textContent=`Launch ${pilots.length} pilots`;
    status(`${lobby.players.length} human${lobby.players.length===1?'':'s'} + ${c.bots.length} AI · Maximum four pilots`);
  }
  function practice(){
    const c=configuration(),name=pilotName();
    if(!c.bots.length){status('Choose at least one AI pilot for a solo match.');return;}
    const names=['Viper','Orbit','Nova'];
    session.launch({...c,seed:crypto.getRandomValues(new Uint32Array(1))[0]&0x7fffffff,humans:1,roster:[{name,skill:-1},...c.bots.map((s,i)=>({name:names[i],skill:s}))]},0);
  }
  function mount(){
    const button=document.createElement('button');button.className='launch secondary-action';button.id='squadronStart';button.textContent='Multiplayer & AI squadron  →';$('start').after(button);
    ui=document.createElement('dialog');ui.id='squadronDialog';
    ui.innerHTML=`<header><div><small>ASTRA / SQUADRON</small><h2>Fly together. Fight together.</h2></div><button id="squadClose" aria-label="Close squadron">✕</button></header>
      <p>Go online to join an available game with the same campaign and mode automatically. If there isn’t one, you’ll start it. New players can replace AI pilots while the match continues.</p><p class="squad-hint">Four human pilots fill a room. Hosting transfers if a pilot leaves. A lost connection reserves your ship for 90 seconds. Each online room lasts up to two hours. Private invite rooms still launch together.</p>
      <label>Your callsign<input id="squadName" maxlength="8" value="Pilot" autocomplete="off"></label>
      <div id="squadSetup"><div class="squad-grid"><label>Match<select id="squadMode"><option value="coop">Co-op campaign</option><option value="deathmatch">Deathmatch</option></select></label><label>Campaign<select id="squadCampaign"><option value="d2">Descent II · Original</option><option value="d2x">Vertigo</option><option value="overload">Overload</option><option value="minerva">Minerva · Classic arena</option><option value="elegies">The Elegies · 6 arenas</option></select></label><label>Starting mine<input id="squadLevel" type="number" min="1" max="24" value="1"></label></div>
      <div class="squad-grid">${[0,1,2].map(i=>`<label>AI pilot ${i+1}<select id="squadAI${i}"><option value="-1">Empty slot</option>${skills.map((s,n)=>`<option value="${n}" ${n===2?'selected':''}>${s}</option>`).join('')}</select></label>`).join('')}</div></div>
      <p class="squad-hint">AI skill changes reaction time, aim, speed and tactics. All pilots use Descent II flight and weapons.</p>
      <div id="squadConnect"><button id="squadOnline">Go online</button><button id="squadPractice">Play with AI</button><details id="squadPrivate"><summary>Private room / invite code</summary><button id="squadCreate">Create private room</button><label>Invite code<input id="squadCode" maxlength="9" autocomplete="off" spellcheck="false"></label><button id="squadJoin">Join by code</button></details><details id="squadFind"><summary>Find more pilots</summary><p>Online rooms fill fastest when you bring people. Create a room, copy its invite link and share it where Descent pilots arrange games. These are community-run and not part of Astra.</p><a href="https://discord.gg/Wx3jpRH" target="_blank" rel="noopener noreferrer">r/Descent on Discord<small>The largest Descent chat. Ask who is up for a browser match.</small></a><a href="https://discord.gg/UPbJaagDpU" target="_blank" rel="noopener noreferrer">Redux Descent League on Discord<small>Organised matches and events on the DXX-Redux desktop port.</small></a><a href="https://retro-tracker.game-server.cc/" target="_blank" rel="noopener noreferrer">Live desktop games<small>The tracker desktop players use. Those games need the DXX-Redux desktop port and cannot be joined from Astra.</small></a></details></div><section id="squadRooms" hidden></section>
      <div class="squad-invite"><button id="squadCopy">Copy invite link</button><button id="squadLeave">Leave room</button></div>
      <ol id="squadRoster"></ol><p id="squadStatus" role="status" aria-live="polite">Choose a match and your pilots.</p><button id="squadLaunch" hidden>Launch squadron</button>`;
    document.body.append(ui);notice=$('squadStatus');roomField=$('squadCode');roster=$('squadRoster');setup=$('squadSetup');connectButtons=$('squadConnect');start=$('squadLaunch');
    playBar=document.createElement('div');playBar.id='squadBar';playBar.hidden=true;playBar.innerHTML='<span>Connecting squadron…</span><button>Leave match</button>';document.body.append(playBar);
    playBar.querySelector('button').textContent='Flight menu';
    playBar.querySelector('button').onclick=()=>{document.exitPointerLock?.();window.Module?._astra_reset_flight_input?.();if(window.Module)Module.menuCommand=1;};
    const leaveWaitingRoom=()=>{if(socket&&!session.session){ignoreStart=true;socket.close(1000,'Leaving waiting room');}};
    button.onclick=()=>{if(!session.session&&!socket){$('squadCampaign').value=$('campaign').value;setup.onchange();}ui.showModal();};$('squadClose').onclick=()=>{if(!session.failed){leaveWaitingRoom();ui.close();}};
    $('squadCreate').onclick=()=>connect(true);$('squadJoin').onclick=()=>connect(false);$('squadPractice').onclick=practice;
    $('squadOnline').onclick=()=>connect(false,true);
    $('squadLeave').onclick=()=>{if(session.session)window.astraNavigation.home();else socket?.close(1000,'Leaving');};
    $('squadCopy').onclick=async()=>{if(!socket||!roomField.value)return;const u=new URL('./',location.href);u.hash='room='+roomField.value;try{await navigator.clipboard.writeText(u.href);status('Invite link copied.');}catch{status(u.href);}};
    start.onclick=()=>send({type:'start'});
    setup.onchange=()=>{const arena=!!campaigns[$('squadCampaign').value]?.arena;$('squadMode').options[0].disabled=arena;if(arena)$('squadMode').value='deathmatch';$('squadLevel').max=String(campaigns[$('squadCampaign').value]?.levels||24);$('squadLevel').value=Math.max(1,Math.min(Number($('squadLevel').max),Number($('squadLevel').value)||1));if(lobby)send({type:'configure',...configuration()});};
    ui.addEventListener('cancel',e=>{if(session.failed)e.preventDefault();else leaveWaitingRoom();});
    ui.addEventListener('close',()=>{window.Module?._astra_reset_flight_input?.();});
    setInterval(()=>{
      if(!session.session||!ui.open||session.failed||!window.Module?.netPilots)return;
      roster.replaceChildren();for(const p of Module.netPilots){const info=session.session.roster[p.id];if(!info||info.skill===-2)continue;const row=document.createElement('li');row.textContent=info.name+' · '+(info.skill>=0?skills[info.skill]+' AI':p.id===session.session.self?'You':'Human')+(p.connected===0?' · Connecting':session.session.mode==='deathmatch'?` · ${p.kills} kills / ${p.deaths} deaths`:'');roster.append(row);}
    },1000);
    for(const type of ['keydown','keyup'])ui.addEventListener(type,e=>e.stopPropagation());
    const invite=/^#room=([0-9A-V]{9})$/.exec(location.hash);if(invite){roomField.value=invite[1];ui.showModal();}
    window.addEventListener('pagehide',()=>{clearInterval(timer);clearInterval(heartbeat);clearTimeout(retryTimer);socket?.close(1000,'Page closed');});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)lastPong=performance.now();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
