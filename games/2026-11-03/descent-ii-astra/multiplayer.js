/* Four-pilot rooms: native Descent packets over a bounded, reliable relay. */
(() => {
  'use strict';
  const ENDPOINT='wss://astra-squadron.jez237.workers.dev';
  const campaigns=window.astraCampaigns;
  const skills=['Novice','Rookie','Hotshot','Ace','Expert'];
  const $=id=>document.getElementById(id);
  let socket=null,lobby=null,identity=null,timer=null,queue=[],out=[],bytes=0,barrier=null,roomChoices=false,lastHostState='',ignoreStart=false;
  let ui,notice,roomField,roster,connectButtons,start,setup,playBar;
  let sentTimes=[],congestedAt=null;
  let finding=false,searchTimer=null,listingSocket=null,listedAt=0,foundNoRooms=false;
  const relayBase=()=>window.astraRelayOverride&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?window.astraRelayOverride:ENDPOINT;
  let credential=null,roomCode='',intentional=false,retryTimer=null,retryUntil=0,heartbeat=null,lastPong=0,lastInventory=0;
  const session={session:null,failed:false,departed:0,stats:{sent:0,received:0,superseded:0},
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
    shutdown(){stopSearch();intentional=true;ignoreStart=true;this.failed=true;send({type:'leave'});clearInterval(heartbeat);clearTimeout(retryTimer);clearInterval(timer);timer=null;if(socket){socket.onclose=null;socket.onmessage=null;socket.close(1000,'Leaving');socket=null;}queue=[];out=[];bytes=0;},
    reconnect(){if(socket)socket.close(4001,'Reconnecting');else reconnect();},
    rejoined(){retryUntil=0;this.reconnecting=false;this.failed=false;window.astraOverload?.resyncNetwork?.();if(ui.open)ui.close();window.Module?._astra_reset_flight_input?.();status('Connection restored · Same ship');},
    order(order,direction){const data={type:'order',order,direction};if(socket)send(data);else if(this.session?.mode==='coop'){data.from=this.session.self;window.astraSquadUI?.command(data);}},
    orderResult(from,order,ok){const m={type:'order-result',from,order,ok};if(socket)send(m);else window.astraSquadUI?.result(m);},
    help(){if(socket)send({type:'help'});else window.astraSquadUI?.help(this.session.self);},
    waitForMine:()=>status('Joined the room. Waiting for the next mine…'),
    get menuOpen(){return !!ui?.open&&!!this.session;},
    get online(){return !!socket||!!this.reconnecting;},
    menu(){if(!this.session)return;document.exitPointerLock?.();window.astraFlightFocus?.(false);ui.classList.add('squad-in-flight');ui.showModal();status('The match continues while this menu is open.');},
    peek:()=>queue[0],take:()=>queue.shift(),
    send(dest,data,pilot=-1){
      if(!socket||socket.readyState!==1||this.failed)return;
      if(data.length>1500){fail('Invalid outgoing multiplayer packet.');return;}
      if(pilot>=0&&(out.length>=24||socket.bufferedAmount>65536||congestedAt!==null)){
        // Positions can supersede each other only between reliable game events.
        for(let i=out.length-1;i>=0&&out[i].pilot>=0;i--){
          const old=out[i];if(old.dest!==dest||old.pilot!==pilot)continue;
          bytes-=old.data.length+3;out.splice(i,1);this.stats.superseded++;break;
        }
      }
      if(out.length>=256||bytes+data.length+3>48000){recoverCongestion();return;}
      out.push({dest,data:data.slice(),pilot});bytes+=data.length+3;
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
      stopSearch();
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
  function recoverCongestion(){
    if(credential&&session.session&&socket?.readyState===1)socket.close(4001,'Resynchronize flight');
    else fail('Connection is too slow. Please rejoin the room.');
  }
  function flush(){
    if(!out.length||socket?.readyState!==1)return;
    const now=performance.now();
    if(socket.bufferedAmount>131072||(congestedAt!==null&&socket.bufferedAmount>65536)){
      if(congestedAt===null)congestedAt=now;
      if(now-congestedAt>=3000)recoverCongestion();
      return;
    }
    congestedAt=null;
    // Keep 30 of the relay's 80 messages/second available for control traffic.
    // A busy object transfer stays ordered and bounded instead of flooding it.
    while(sentTimes.length&&now-sentTimes[0]>=1000)sentTimes.shift();
    while(out.length&&sentTimes.length<50&&socket.bufferedAmount<=131072){
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
      if(m.type==='finder-idle'&&finding){
        foundNoRooms=m.publicRooms===0;
        status(m.publicRooms?'Public rooms are full or changing levels. Searching again shortly…':$('squadHostEmpty').checked?'No open match. Searching again in 12 seconds, then hosting if still empty.':'Waiting for a public Astra match across all campaigns and modes…');
        loadTrackers();return;
      }
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
  function stopSearch(){
    finding=foundNoRooms=false;clearTimeout(searchTimer);searchTimer=null;
    if($('squadStopSearch'))$('squadStopSearch').hidden=true;
  }
  function cancelSearch(){
    stopSearch();ignoreStart=true;
    if(socket&&!session.session){send({type:'leave'});socket.close(1000,'Search canceled');}
    status('Search stopped.');render();
  }
  const directoryNames={astra:'Astra',retro:'DXX Retro / Redux',rebirth:'DXX-Rebirth',xl:'D2X-XL',d3:'Descent 3',tsetse:'Tsetsefly'};
  const directoryUrls={retro:'https://retro-tracker.game-server.cc/',rebirth:'https://dxxtracker.reenigne.net/',xl:'https://descent2.de/active-servers',d3:'https://tracker.h0m3.net/index.html',tsetse:'https://tsetsefly.de/'};
  const sources=new Map();
  let directoryTimeout,refreshTimer;
  function publicAddress(value){
    if(typeof value!=='string'||!/^\d{1,3}(\.\d{1,3}){3}:[1-9]\d{0,4}$/.test(value))return '';
    const [ip,port]=value.split(':'),octets=ip.split('.').map(Number),[a,b]=octets;
    if(+port>65535||octets.some(n=>n>255)||a===0||a===10||a===127||a>=224||
      a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a===100&&b>=64&&b<=127)return '';
    return octets.join('.')+':'+Number(port);
  }
  function joinDetails(g){
    const panel=$('squadJoinDetails');panel.replaceChildren();panel.hidden=false;
    const heading=document.createElement('strong');heading.textContent=g.name;panel.append(heading);
    const note=document.createElement('p');
    note.textContent=g.pxo?'Open Descent 3’s PXO multiplayer lobby and select “'+g.name+'”.':g.address?'Open '+g.client+' and join by address using '+g.address+'.':'Open '+g.client+' and choose “'+g.name+'” in its multiplayer tracker.';
    panel.append(note);
    const copy=document.createElement('button');copy.type='button';copy.textContent=g.address?'Copy server address':'Copy match name';
    copy.onclick=async()=>{try{await navigator.clipboard.writeText(g.address||g.name);copy.textContent='Copied';}catch{note.textContent='Select and copy '+(g.address||g.name);}};panel.append(copy);
    const link=document.createElement('a');link.href=directoryUrls[g.source];link.target='_blank';link.rel='noopener noreferrer';link.textContent='View tracker';panel.append(link);
    const close=document.createElement('button');close.type='button';close.textContent='Close details';close.onclick=()=>{panel.hidden=true;const row=[...$('squadListings').children].find(r=>r.dataset.key===g.key);(row?.querySelector('button,a')||$('squadRefresh')).focus();};panel.append(close);
    panel.tabIndex=-1;panel.focus();
  }
  function directoryGames(){
    const unique=new Map();
    // Prefer the monitor's separate human and bot counts for overlapping D3 listings.
    for(const source of ['astra','retro','rebirth','xl','tsetse','d3']){
      for(const item of sources.get(source)?.games||[]){
        const g={...item,source};
        if(source==='astra'){
          if(!/^[0-9A-V]{9}$/.test(g.code)||!campaigns[g.campaign])continue;
          g.name=(campaigns[g.campaign].name||g.campaign)+' · Mine '+g.level;
          g.info=[g.mode==='coop'?'Co-op':'Deathmatch',g.host&&'Host '+g.host,g.players+'/4 pilots'];
          g.action=g.players>=4?'Full':!g.accepting?'Changing mines':'Join in Astra';
          g.disabled=g.players>=4||!g.accepting;g.key='astra/'+g.code;g.people=g.active;
        }else{
          const isD3=source==='d3'||source==='tsetse'&&g.family==='d3';
          g.client=isD3?'Descent 3':source==='tsetse'?[g.family?.toUpperCase(),g.kind].filter(Boolean).join(' '):directoryNames[source];
          const address=publicAddress(g.address);
          const nativeAddress=typeof g.address==='string'&&/^(?:[a-z\d-]+(?:\.[a-z\d-]+)*\.[a-z]{2,}|\[[a-f\d:]+\]):[1-9]\d{0,4}$/i.test(g.address)&&Number(g.address.split(':').pop())<=65535;
          g.address=address||(nativeAddress?g.address:'');
          g.key=g.address?(isD3?'d3':source)+'/'+g.address:JSON.stringify([source,g.name,g.kind,g.map]);
          const counts=/^\s*(\d+)\s*\/\s*(\d+)/.exec(g.players||'');
          g.people=Number.parseInt(g.players,10)||0;
          g.disabled=(counts&&+counts[1]>=+counts[2]&&+counts[2]>0)||/^(?:closed|no|full|end level)$/i.test(g.status||'');
          g.pxo=isD3&&/^PXO$/i.test(g.status||'');
          g.steam=isD3&&/^Retail\b/i.test(g.kind||'')&&!!address&&(source!=='tsetse'||g.pxo||/^DirectIP$/i.test(g.status||''));
          g.info=[g.client,g.kind,g.map,g.mode,g.status,g.players&&g.players+(source==='tsetse'?' pilots':' players'),g.bots>0&&g.bots+' AI'];
          g.action=g.disabled?(counts&&+counts[1]>=+counts[2]?'Full':'Closed'):g.steam?'Join in Steam':'Join details';
        }
        if(!unique.has(g.key))unique.set(g.key,g);
      }
    }
    return [...unique.values()].sort((a,b)=>Number(!!a.disabled)-Number(!!b.disabled)||Number(b.source==='astra')-Number(a.source==='astra')||b.people-a.people||a.name.localeCompare(b.name));
  }
  function matchRow(g){
    const row=document.createElement('div');row.className='squad-match';row.dataset.key=g.key;
    const steam=g.steam&&!g.disabled,action=document.createElement(steam?'a':'button');
    if(steam){action.href='steam://run/273590//'+(g.pxo?'-pxo':'-directip')+'%20'+g.address+'/';}
    else{
      action.type='button';action.disabled=!!g.disabled;
      if(g.source==='astra'){
        action.className='squad-room-join';action.dataset.unavailable=g.disabled?'1':'0';action.disabled=!!g.disabled||!!socket||finding;
        action.onclick=()=>connect(false,false,false,false,g.code);
      }else action.onclick=()=>joinDetails(g);
    }
    const name=document.createElement('strong'),info=document.createElement('span'),verb=document.createElement('b');
    name.textContent=g.name;info.textContent=g.info.filter(Boolean).join(' · ');verb.textContent=g.action;
    action.append(name,info,verb);row.append(action);
    if(steam){const other=document.createElement('button');other.className='squad-other-client';other.type='button';other.textContent='Other client';other.setAttribute('aria-label','Other client for '+g.name);other.onclick=()=>joinDetails(g);row.append(other);}
    return row;
  }
  function renderDirectory(loading){
    const list=$('squadListings'),games=directoryGames(),old=new Map([...list.children].map(row=>[row.dataset.key,row]));
    games.forEach((g,i)=>{
      let row=old.get(g.key);old.delete(g.key);
      const signature=JSON.stringify(g);
      if(!row||row.dataset.signature!==signature){const next=matchRow(g);next.dataset.signature=signature;if(row)row.replaceWith(next);row=next;}
      if(list.children[i]!==row)list.insertBefore(row,list.children[i]||null);
    });
    for(const row of old.values())row.remove();
    const missing=Object.keys(directoryNames).filter(k=>!sources.get(k)?.available||sources.get(k)?.partial);
    $('squadDirectoryStatus').textContent=(games.length?games.length+' public '+(games.length===1?'match':'matches'):loading?'Searching for public matches…':missing.length===6?'Could not reach the game directories.':'No public matches found.')+
      (games.length&&loading?' · Checking trackers…':'')+(!loading&&missing.length&&missing.length<6?' · Unavailable or incomplete: '+missing.map(k=>directoryNames[k]).join(', '):'');
  }
  function stopDirectory(){
    clearTimeout(directoryTimeout);clearTimeout(refreshTimer);
    if(listingSocket){listingSocket.onmessage=listingSocket.onclose=null;listingSocket.close();listingSocket=null;}
  }
  function loadTrackers(force=false){
    if(listingSocket||!ui.open||session.session||document.hidden)return;
    if(!force&&listedAt&&Date.now()-listedAt<45000){scheduleRefresh();return;}
    clearTimeout(refreshTimer);const seen=new Set();
    const ws=listingSocket=new WebSocket(relayBase()+'/games');$('squadRefresh').disabled=true;renderDirectory(true);
    ws.onmessage=e=>{
      let r;try{r=JSON.parse(e.data);}catch{return;}
      if(r.type!=='directory-source'||!Object.hasOwn(directoryNames,r.source)||!Array.isArray(r.games))return;
      sources.set(r.source,r);seen.add(r.source);renderDirectory(true);
    };
    ws.onclose=()=>{
      clearTimeout(directoryTimeout);listingSocket=null;listedAt=Date.now();
      for(const k of Object.keys(directoryNames))if(!seen.has(k))sources.delete(k);
      renderDirectory(false);$('squadRefresh').disabled=false;scheduleRefresh();
    };
    directoryTimeout=setTimeout(()=>ws.close(),10000);
  }
  function scheduleRefresh(){
    clearTimeout(refreshTimer);
    if(ui.open&&!session.session&&!document.hidden)refreshTimer=setTimeout(()=>loadTrackers(true),Math.max(1000,45000-(Date.now()-listedAt)));
  }
  function connect(create,online=false,force=false,anywhere=false,selectedCode=''){
    if(socket||session.session)return;intentional=false;
    let code=create?randomCode():selectedCode||roomField.value.trim().toUpperCase();
    if(!online&&!/^[0-9A-V]{9}$/.test(code)){status('Enter the nine-character invite code.');return;}
    ignoreStart=false;roomChoices=false;$('squadRooms').hidden=true;
    if(anywhere){finding=true;$('squadStopSearch').hidden=false;}
    status(anywhere?'Finding an open Astra match worldwide…':'Connecting…');connectButtons.querySelectorAll('button').forEach(b=>b.disabled=true);
    $('squadListings').querySelectorAll('.squad-room-join').forEach(b=>b.disabled=true);
    const base=relayBase();
    const route=online?`/online?v=54&build=109&new=${force?1:0}${anywhere?'&scope=all':''}&name=${encodeURIComponent(pilotName())}&config=${encodeURIComponent(JSON.stringify(configuration()))}`:`/room/${code}?v=54&build=86&create=${create?1:0}&name=${encodeURIComponent(pilotName())}`;
    socket=new WebSocket(base+route);
    socket.binaryType='arraybuffer';socket.onmessage=e=>receive(e.data);
    socket.onopen=()=>{startHeartbeat();sentTimes=[];timer=setInterval(flush,20);if(create&&!online)send({type:'configure',...configuration()});};
    socket.onerror=()=>status('Could not reach the room service. You can still play with AI pilots.');
    socket.onclose=()=>{
      clearInterval(timer);clearInterval(heartbeat);timer=null;socket=null;
      if(anywhere&&finding&&!session.session){
        clearTimeout(searchTimer);searchTimer=setTimeout(()=>{if(finding&&ui.open)connect(false,true,foundNoRooms&&$('squadHostEmpty').checked,true);},12000);
        return;
      }
      if(anywhere&&!session.session&&!finding){render();return;}
      if(session.session&&!session.failed&&!intentional){if(credential)reconnect();else fail('Disconnected from the room. Return to the title to reconnect.');}
      else if(!session.session){lobby=null;identity=null;render();if(!roomChoices)status(selectedCode?'Could not join that room. Checking availability again…':'Room connection closed.');if(selectedCode)loadTrackers(true);}
    };
  }
  function startHeartbeat(){
    congestedAt=null;
    clearInterval(heartbeat);lastPong=performance.now();
    heartbeat=setInterval(()=>{
      if(!socket||socket.readyState!==1)return;
      if(!document.hidden&&performance.now()-lastPong>15000){socket.close(4001,'Connection timeout');return;}
      send({type:'ping',at:performance.now()});
      const m=window.Module;if(m?.netBotExport&&session.session?.self===session.session?.host&&performance.now()-lastInventory>1000){
        lastInventory=performance.now();
        const bots=m.netBotExport.map((p,i)=>p&&({...p,assisting:m.netBots?.[i]?.assisting??-1}));
        send({type:'inventory',level:m.netState.level,bots});
      }
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
    connectButtons.querySelectorAll('button').forEach(b=>b.disabled=!!socket||finding);
    $('squadListings').querySelectorAll('.squad-room-join').forEach(b=>b.disabled=b.dataset.unavailable==='1'||!!socket||finding);
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
      <div id="squadSetup"><div class="squad-grid"><label>Match<select id="squadMode"><option value="coop">Co-op campaign</option><option value="deathmatch">Deathmatch</option></select></label><label>Campaign<select id="squadCampaign"><option value="d2">Descent II · Original</option><option value="d2x">Vertigo</option><option value="overload">Overload</option><option value="minerva">Minerva · Classic arena</option><option value="elegies">The Elegies · 6 arenas</option><option value="kegparty">Keg Party · Classic arena</option></select></label><label>Starting mine<input id="squadLevel" type="number" min="1" max="24" value="1"></label></div>
      <div class="squad-grid">${[0,1,2].map(i=>`<label>AI pilot ${i+1}<select id="squadAI${i}"><option value="-1">Empty slot</option>${skills.map((s,n)=>`<option value="${n}" ${n===2?'selected':''}>${s}</option>`).join('')}</select></label>`).join('')}</div></div>
      <p class="squad-hint">AI skill changes reaction time, aim, speed and tactics. All pilots use Descent II flight and weapons.</p>
      <div id="squadConnect"><button id="squadOnline">Go online</button><button id="squadPractice">Play with AI</button><details id="squadPrivate"><summary>Private room / invite code</summary><button id="squadCreate">Create private room</button><label>Invite code<input id="squadCode" maxlength="9" autocomplete="off" spellcheck="false"></label><button id="squadJoin">Join by code</button></details><details id="squadFind"><summary>Find more pilots</summary><p>Online rooms fill fastest when you bring people. Create a room, copy its invite link and share it where Descent pilots arrange games. These are community-run and not part of Astra.</p><a href="https://discord.gg/Wx3jpRH" target="_blank" rel="noopener noreferrer">r/Descent on Discord<small>The largest Descent chat. Ask who is up for a browser match.</small></a><a href="https://discord.gg/UPbJaagDpU" target="_blank" rel="noopener noreferrer">Redux Descent League on Discord<small>Organised matches and events on the DXX-Redux desktop port.</small></a><a href="https://discord.gg/ERR8Zh4NdT" target="_blank" rel="noopener noreferrer">Descent Rangers on Discord<small>Casual Descent 1 and 2 games on the desktop ports. Ask who is up for a browser match.</small></a><a href="https://retro-tracker.game-server.cc/" target="_blank" rel="noopener noreferrer">Live desktop games<small>The tracker desktop players use. Those games need the DXX-Redux desktop port and cannot be joined from Astra.</small></a><a href="https://www.descent2.de/active-servers" target="_blank" rel="noopener noreferrer">D2X-XL desktop games<small>Games registered with the D2X-XL desktop port. They need D2X-XL and cannot be joined from Astra.</small></a></details></div><section id="squadRooms" hidden></section>
      <div class="squad-invite"><button id="squadCopy">Copy invite link</button><button id="squadLeave">Leave room</button></div>
      <ol id="squadRoster"></ol><p id="squadStatus" role="status" aria-live="polite">Choose a match and your pilots.</p><button id="squadLaunch" hidden>Launch squadron</button>`;
    document.body.append(ui);notice=$('squadStatus');roomField=$('squadCode');roster=$('squadRoster');setup=$('squadSetup');connectButtons=$('squadConnect');start=$('squadLaunch');
    playBar=document.createElement('div');playBar.id='squadBar';playBar.hidden=true;playBar.innerHTML='<span>Connecting squadron…</span><button>Leave match</button>';document.body.append(playBar);
    playBar.querySelector('button').textContent='Flight menu';
    playBar.querySelector('button').onclick=()=>{document.exitPointerLock?.();window.Module?._astra_reset_flight_input?.();if(window.Module)Module.menuCommand=1;};
    const leaveWaitingRoom=()=>{if(finding)cancelSearch();else if(socket&&!session.session){ignoreStart=true;socket.close(1000,'Leaving waiting room');}};
    button.onclick=()=>{if(!session.session&&!socket){$('squadCampaign').value=$('campaign').value;setup.onchange();}ui.showModal();loadTrackers(true);};$('squadClose').onclick=()=>{if(!session.failed){leaveWaitingRoom();ui.close();}};
    $('squadCreate').onclick=()=>connect(true);$('squadJoin').onclick=()=>connect(false);$('squadPractice').onclick=practice;
    $('squadOnline').onclick=()=>connect(false,true);
    const anywhere=document.createElement('button');anywhere.id='squadAnywhere';anywhere.textContent='Auto-join any Astra match';$('squadPractice').after(anywhere);
    anywhere.onclick=()=>connect(false,true,false,true);
    const stop=document.createElement('button');stop.id='squadStopSearch';stop.hidden=true;stop.textContent='Stop searching';stop.onclick=cancelSearch;connectButtons.after(stop);
    const fallback=document.createElement('label');fallback.className='squad-finder-host';fallback.innerHTML='<input id="squadHostEmpty" type="checkbox" checked> Host a public room if the search stays empty';anywhere.after(fallback);
    const trackers=document.createElement('section');trackers.id='squadTrackers';trackers.setAttribute('aria-labelledby','squadDirectoryTitle');
    trackers.innerHTML='<div class="squad-directory-head"><h3 id="squadDirectoryTitle">Online games</h3><button type="button" id="squadRefresh">Refresh</button></div><p id="squadDirectoryStatus" role="status"></p><div id="squadListings"></div><div id="squadJoinDetails" hidden></div>';
    ui.querySelector('header').after(trackers);$('squadRefresh').onclick=()=>loadTrackers(true);
    $('squadLeave').onclick=()=>{if(session.session)window.astraNavigation.home();else socket?.close(1000,'Leaving');};
    $('squadCopy').onclick=async()=>{if(!socket||!roomField.value)return;const u=new URL('./',location.href);u.hash='room='+roomField.value;try{await navigator.clipboard.writeText(u.href);status('Invite link copied.');}catch{status(u.href);}};
    start.onclick=()=>send({type:'start'});
    setup.onchange=()=>{const arena=!!campaigns[$('squadCampaign').value]?.arena;$('squadMode').options[0].disabled=arena;if(arena)$('squadMode').value='deathmatch';$('squadLevel').max=String(campaigns[$('squadCampaign').value]?.levels||24);$('squadLevel').value=Math.max(1,Math.min(Number($('squadLevel').max),Number($('squadLevel').value)||1));if(lobby)send({type:'configure',...configuration()});};
    ui.addEventListener('cancel',e=>{if(session.failed)e.preventDefault();else leaveWaitingRoom();});
    ui.addEventListener('close',()=>{stopDirectory();$('squadJoinDetails').hidden=true;if(finding)cancelSearch();else stopSearch();window.Module?._astra_reset_flight_input?.();});
    setInterval(()=>{
      if(!session.session||!ui.open||session.failed||!window.Module?.netPilots)return;
      roster.replaceChildren();for(const p of Module.netPilots){const info=session.session.roster[p.id];if(!info||info.skill===-2)continue;const row=document.createElement('li');row.textContent=info.name+' · '+(info.skill>=0?skills[info.skill]+' AI':p.id===session.session.self?'You':'Human')+(p.connected===0?' · Connecting':session.session.mode==='deathmatch'?` · ${p.kills} kills / ${p.deaths} deaths`:'');roster.append(row);}
    },1000);
    for(const type of ['keydown','keyup'])ui.addEventListener(type,e=>e.stopPropagation());
    const invite=/^#room=([0-9A-V]{9})$/.exec(location.hash);if(invite){roomField.value=invite[1];ui.showModal();loadTrackers();}else if(location.hash==='#online-games')button.click();
    window.addEventListener('pagehide',()=>{stopDirectory();clearInterval(timer);clearInterval(heartbeat);clearTimeout(retryTimer);socket?.close(1000,'Page closed');});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastPong=performance.now();loadTrackers();}else clearTimeout(refreshTimer);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
