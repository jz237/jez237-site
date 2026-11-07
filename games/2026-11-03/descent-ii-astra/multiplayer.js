/* Four-pilot rooms: native Descent packets over a bounded, reliable relay. */
(() => {
  'use strict';
  const ENDPOINT='wss://astra-squadron.jez237.workers.dev';
  const skills=['Novice','Rookie','Hotshot','Ace','Expert'];
  const $=id=>document.getElementById(id);
  let socket=null,lobby=null,identity=null,timer=null,queue=[],out=[],bytes=0,barrier=null;
  let ui,notice,roomField,roster,connectButtons,start,setup,playBar;
  const session={session:null,failed:false,departed:0,stats:{sent:0,received:0},
    get menuOpen(){return !!ui?.open&&!!this.session;},
    menu(){if(!this.session)return;document.exitPointerLock?.();window.astraFlightFocus?.(false);ui.classList.add('squad-in-flight');ui.showModal();status('The match continues while this menu is open.');},
    peek:()=>queue[0],take:()=>queue.shift(),
    send(dest,data){
      if(!socket||socket.readyState!==1||this.failed)return;
      if(data.length>1500||out.length>=256||bytes+data.length>48000){fail('Connection is too slow. Please rejoin the room.');return;}
      out.push({dest,data:data.slice()});bytes+=data.length+3;
    },
    ready(level,checksum){
      queue=[];barrier=null;
      if(!socket){barrier={level,checksum};return;}
      send({type:'ready',level,checksum});status('Waiting for the other pilots to load…');
    },
    synchronized:level=>barrier?.level===level,
    playing(self,level){status(`${this.session.mode==='coop'?'Co-op':'Deathmatch'} · Mine ${level} · ${this.session.roster.length} pilots`);},
    launch(config,self){
      this.session={...config,self};this.failed=false;queue=[];out=[];bytes=0;
      $('campaign').value=config.campaign;$('look').value='astra';$('intro').checked=false;
      ui.close();ui.classList.add('squad-in-flight');document.body.classList.add('squadron');playBar.hidden=false;
      window.astraLaunchSquadron();
    }
  };
  window.astraNet=session;
  function status(text){notice.textContent=text;if(playBar)playBar.querySelector('span').textContent=text;}
  function fail(message){
    if(session.failed)return;session.failed=true;status(message);clearInterval(timer);timer=null;
    socket?.close(1000,'Leaving');socket=null;
    if(session.session){
      document.exitPointerLock?.();window.astraFlightFocus?.(false);
      if(window.Module){Module.netDisconnected=true;Module.autoPaused=true;}
      ui.showModal();start.hidden=true;connectButtons.hidden=true;
      const back=document.createElement('button');back.textContent='Return to title';back.onclick=()=>location.reload();notice.after(back);
    }
  }
  function send(data){if(socket?.readyState===1)socket.send(JSON.stringify(data));}
  function flush(){
    if(!out.length||socket?.readyState!==1)return;
    if(socket.bufferedAmount>128*1024){fail('Network connection cannot keep up. Please rejoin.');return;}
    while(out.length){
      const parts=[];let n=0;
      while(out.length&&n+out[0].data.length+3<=16384){const p=out.shift();parts.push(p);n+=p.data.length+3;}
      const data=new Uint8Array(n);let k=0;
      for(const p of parts){data[k++]=p.dest;data[k++]=p.data.length&255;data[k++]=p.data.length>>8;data.set(p.data,k);k+=p.data.length;}
      socket.send(data);session.stats.sent+=parts.length;bytes-=n;
    }
  }
  function receive(raw){
    if(typeof raw==='string'){
      let m;try{m=JSON.parse(raw);}catch{return;}
      if(m.type==='error'){status(m.message);return;}
      if(m.type==='closed'){fail(m.message||'The host ended the room.');return;}
      if(m.type==='welcome'){identity=m.id;roomField.value=m.code;status('Room ready. Share the invite link with your friends.');return;}
      if(m.type==='lobby'){lobby=m;render();return;}
      if(m.type==='start'){session.launch(m.config,m.self);return;}
      if(m.type==='sync'){barrier={level:m.level,checksum:m.checksum};status('All pilots ready');return;}
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
    return {mode:$('squadMode').value,campaign:$('squadCampaign').value,level:Number($('squadLevel').value),bots:[0,1,2].map(i=>Number($('squadAI'+i).value)).filter(v=>v>=0)};
  }
  function randomCode(){return Array.from(crypto.getRandomValues(new Uint8Array(9)),v=>(v%32).toString(32)).join('').toUpperCase();}
  function pilotName(){return ($('squadName').value.replace(/[^a-z0-9_-]/gi,'').slice(0,8)||'Pilot');}
  function connect(create){
    if(socket||session.session)return;
    let code=create?randomCode():roomField.value.trim().toUpperCase();
    if(!/^[0-9A-V]{9}$/.test(code)){status('Enter the nine-character invite code.');return;}
    status('Connecting…');connectButtons.querySelectorAll('button').forEach(b=>b.disabled=true);
    const base=window.astraRelayOverride&&/^(localhost|127\.0\.0\.1)$/.test(location.hostname)?window.astraRelayOverride:ENDPOINT;
    socket=new WebSocket(`${base}/room/${code}?create=${create?1:0}&name=${encodeURIComponent(pilotName())}`);
    socket.binaryType='arraybuffer';socket.onmessage=e=>receive(e.data);
    socket.onopen=()=>{timer=setInterval(flush,40);if(create)send({type:'configure',...configuration()});};
    socket.onerror=()=>status('Could not reach the room service. You can still play with AI pilots.');
    socket.onclose=()=>{
      clearInterval(timer);timer=null;socket=null;
      if(session.session&&!session.failed)fail('Disconnected from the room. Return to the title to reconnect.');
      else if(!session.session){lobby=null;identity=null;render();status('Room connection closed.');}
    };
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
      <p>Up to four pilots. Invite friends, add AI wingmen for co-op, or fight AI opponents in deathmatch.</p><p class="squad-hint">Friends join before launch. The host must stay connected. Each online room lasts up to two hours.</p>
      <label>Your callsign<input id="squadName" maxlength="8" value="Pilot" autocomplete="off"></label>
      <div id="squadSetup"><div class="squad-grid"><label>Match<select id="squadMode"><option value="coop">Co-op campaign</option><option value="deathmatch">Deathmatch</option></select></label><label>Campaign<select id="squadCampaign"><option value="d2">Descent II · Original</option><option value="d2x">Vertigo</option></select></label><label>Starting mine<input id="squadLevel" type="number" min="1" max="24" value="1"></label></div>
      <div class="squad-grid">${[0,1,2].map(i=>`<label>AI pilot ${i+1}<select id="squadAI${i}"><option value="-1">Empty slot</option>${skills.map((s,n)=>`<option value="${n}" ${n===2?'selected':''}>${s}</option>`).join('')}</select></label>`).join('')}</div></div>
      <p class="squad-hint">AI skill changes reaction time, aim, speed and tactics. All pilots use Descent II flight and weapons.</p>
      <div id="squadConnect"><button id="squadPractice">Play with AI</button><button id="squadCreate">Create online room</button><label>Invite code<input id="squadCode" maxlength="9" autocomplete="off" spellcheck="false"></label><button id="squadJoin">Join room</button></div>
      <div class="squad-invite"><button id="squadCopy">Copy invite link</button><button id="squadLeave">Leave room</button></div>
      <ol id="squadRoster"></ol><p id="squadStatus" role="status" aria-live="polite">Choose a match and your pilots.</p><button id="squadLaunch" hidden>Launch squadron</button>`;
    document.body.append(ui);notice=$('squadStatus');roomField=$('squadCode');roster=$('squadRoster');setup=$('squadSetup');connectButtons=$('squadConnect');start=$('squadLaunch');
    playBar=document.createElement('div');playBar.id='squadBar';playBar.hidden=true;playBar.innerHTML='<span>Connecting squadron…</span><button>Leave match</button>';document.body.append(playBar);
    playBar.querySelector('button').onclick=()=>{document.exitPointerLock?.();if(confirm('Leave this match? The host leaving ends the room.')){socket?.close(1000,'Leaving');location.href=location.pathname;}};
    button.onclick=()=>ui.showModal();$('squadClose').onclick=()=>{if(!session.failed)ui.close();};
    $('squadCreate').onclick=()=>connect(true);$('squadJoin').onclick=()=>connect(false);$('squadPractice').onclick=practice;
    $('squadLeave').onclick=()=>{socket?.close(1000,'Leaving');if(session.session)location.href=location.pathname;};
    $('squadCopy').onclick=async()=>{if(!lobby)return;const u=new URL(location.href);u.hash='room='+roomField.value;try{await navigator.clipboard.writeText(u.href);status('Invite link copied.');}catch{status(u.href);}};
    start.onclick=()=>send({type:'start'});
    setup.onchange=()=>{if($('squadCampaign').value==='d2x')$('squadLevel').max='20';else $('squadLevel').max='24';$('squadLevel').value=Math.max(1,Math.min(Number($('squadLevel').max),Number($('squadLevel').value)||1));if(lobby)send({type:'configure',...configuration()});};
    ui.addEventListener('cancel',e=>{if(session.failed)e.preventDefault();});
    ui.addEventListener('close',()=>{window.Module?._astra_reset_flight_input?.();});
    setInterval(()=>{
      if(!session.session||!ui.open||session.failed||!window.Module?.netPilots)return;
      roster.replaceChildren();for(const p of Module.netPilots){const info=session.session.roster[p.id];if(!info)continue;const row=document.createElement('li');row.textContent=info.name+' · '+(info.skill>=0?skills[info.skill]+' AI':p.id===session.session.self?'You':'Human')+(p.connected===0?' · Disconnected':session.session.mode==='deathmatch'?` · ${p.kills} kills / ${p.deaths} deaths`:'');roster.append(row);}
    },1000);
    for(const type of ['keydown','keyup'])ui.addEventListener(type,e=>e.stopPropagation());
    const invite=/^#room=([0-9A-V]{9})$/.exec(location.hash);if(invite){roomField.value=invite[1];ui.showModal();}
    window.addEventListener('pagehide',()=>{clearInterval(timer);socket?.close(1000,'Leaving');});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
