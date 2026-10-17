import {ONLINE_OPPONENT_SETS,type OnlineOpponentSet} from './online-opponents';
import {classEngineLabel} from './class-engine';
import {rememberedOnlineEndpoint} from './online-session';
import {onlineCarChoices} from './online-roster';
import {DEFAULT_ONLINE_EVENT,copyOnlineEventRules,onlineEventLabel} from './online-events';
import {onlineEventControls,readOnlineEventControls,bindOnlineEventControls} from './online-event-ui';
import type {OnlineSelection} from './online-livery';
import {copyOnlineSetup,stockOnlineSetup,type SetupRule} from './online-setup';
import {DEFINITIONS,type CarKind} from './rules';
import {cupResultsMarkup} from './cup-ui';
import { QuarryNetwork, type Snapshot } from './network';
import type { Mode } from './rules';

const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export class OnlineUI {
  endpoint='';
  private roster='';
  private loadoutDraft?:{kind:CarKind;setup:'garage'|'stock'};
  private eventDraft=copyOnlineEventRules(DEFAULT_ONLINE_EVENT);
  private modeDraft:Mode='derby';
  private roundsDraft=1;
  private bindEvents(){bindOnlineEventControls(this.ui,r=>{this.eventDraft=r;const mode=this.ui.querySelector<HTMLSelectElement>('#online-mode');if(mode)this.modeDraft=mode.value as Mode;if(r.chase)this.roundsDraft=1;});}
  private eventPanel(s:Snapshot){return s.eventSupport?(this.net.isHost?onlineEventControls(this.eventDraft,s.noRespawnDerbySupport===true,s.timedRaceSupport===true,s.courseSupport===true,s.arenaSupport===true,s.chaseSupport===true,s.cars.length,s.members,s.classEngineSupport===true):'<p>The host chooses the event rules.</p>'):'<p>This server uses standard event rules.</p>';}
  private startEvent(mode:Mode,rounds:number,s:Snapshot){let rules=this.net.isHost&&s.eventSupport?readOnlineEventControls(this.ui):undefined;if(rules===null){this.message('Choose 1–20 laps, a 60–1200 second limit, and at least one runner and one pursuer for Chase.');return;}if(rules?.chase&&mode!=='race'){const {chase,...ordinary}=rules;rules=ordinary;}if(rules?.chase)rounds=1;this.net.start(mode,rounds,rules);}
  constructor(private ui:HTMLElement,private net:QuarryNetwork,private callbacks:{
    connect:(endpoint:string,room:string,name:string,loadout?:OnlineSelection)=>Promise<void>; leave:()=>void; loadout?:(kind?:CarKind)=>OnlineSelection;
  }) {}
  private chosenLoadout():OnlineSelection{
    const kind=(document.getElementById('online-car') as HTMLSelectElement).value as CarKind;
    const saved=(document.getElementById('online-setup') as HTMLSelectElement).value==='garage';
    return {kind,livery:saved?this.callbacks.loadout?.(kind).livery??[]:[],setup:copyOnlineSetup(saved?(this.callbacks.loadout?.(kind).setup??stockOnlineSetup(kind)):stockOnlineSetup(kind))};
  }
  private setupChooser(kind:CarKind,full=false,kite=false,morrow=false,alder=false,setup:'garage'|'stock'='garage'){return `<label for="online-car">Car for next event</label><select id="online-car">${onlineCarChoices({rosterSupport:full?true:undefined,kiteSupport:kite?true:undefined,morrowSupport:morrow?true:undefined,alderSupport:alder?true:undefined}).map(k=>`<option value="${k}" ${k===kind?'selected':''}>${DEFINITIONS[k].name}</option>`).join('')}</select><label for="online-setup">Setup</label><select id="online-setup"><option value="garage" ${setup==='garage'?'selected':''}>Saved tuning, paint & decals</option><option value="stock" ${setup==='stock'?'selected':''}>Factory setup</option></select>`;}
  private setupPanel(s:Snapshot){
    if(!s.setupSupport)return '<p>This server uses factory setups.</p>';
    if(this.loadoutDraft&&!onlineCarChoices(s).includes(this.loadoutDraft.kind))this.loadoutDraft=undefined;
    const selected=s.members.find(m=>m.id===this.net.id)?.loadout,kind=selected?.kind??this.callbacks.loadout?.().kind??'coupe';
    return `<section id="online-loadout"><h3>YOUR NEXT EVENT</h3><label for="online-opponents">AI opponent field</label><select id="online-opponents" ${this.net.isHost&&s.opponentSetSupport?'':'disabled'}><option value="auto" ${s.opponentSet?'':'selected'}>Automatic field</option>${Object.entries(ONLINE_OPPONENT_SETS).map(([v,label])=>`<option value="${v}" ${s.opponentSet===v?'selected':''}>${label}</option>`).join('')}</select><p>${s.opponentSetSupport?'Vacant AI places change immediately in the lobby. Player and reserved cars stay selected; results keep their damage until the next event.':'All drivers and the server need an update to choose AI opponents.'}</p>${this.setupChooser(this.loadoutDraft?.kind??kind,s.rosterSupport===true,s.kiteSupport===true,s.morrowSupport===true,s.alderSupport===true,this.loadoutDraft?.setup??'garage')}<button class="small-button" id="apply-online-setup">APPLY CAR & SETUP</button>${selected?`<p>Selected build: ${DEFINITIONS[kind].name} · Engine ${classEngineLabel(selected.setup)} · Tires ${selected.setup.tires} · Armor ${selected.setup.armor} · ${s.members.find(m=>m.id===this.net.id)?.liveryLayers??0} decal layers</p>`:''}<label for="online-performance">Performance rules</label><select id="online-performance" ${this.net.isHost?'':'disabled'}><option value="open" ${s.setupRule!=='stock'?'selected':''}>Garage upgrades & tuning</option><option value="stock" ${s.setupRule==='stock'?'selected':''}>Stock performance for everyone</option></select><p>${s.setupRule==='stock'?'Factory chassis settings are enforced. A class limit can replace the engine. Your paint stays applied.':'Saved upgrades and tuning apply when the next event starts. A class limit can replace the engine.'}</p></section>`;
  }
  private bindSetup(){
    const car=this.ui.querySelector<HTMLSelectElement>('#online-car'),setup=this.ui.querySelector<HTMLSelectElement>('#online-setup');
    if(car&&setup){const remember=()=>{this.loadoutDraft={kind:car.value as CarKind,setup:setup.value==='stock'?'stock':'garage'};};car.onchange=remember;setup.onchange=remember;}
    const opponents=document.getElementById('online-opponents') as HTMLSelectElement|null;if(opponents)opponents.onchange=()=>this.net.setOpponentSet(opponents.value as OnlineOpponentSet|'auto');
    const apply=document.getElementById('apply-online-setup');if(apply)apply.onclick=()=>this.net.setLoadout(this.chosenLoadout());
    const rule=document.getElementById('online-performance') as HTMLSelectElement|null;if(rule)rule.onchange=()=>this.net.setSetupRule(rule.value as SetupRule);
  }
  async configure() { try{const r=await fetch('./multiplayer.json');if(r.ok)this.endpoint=(await r.json()).endpoint??'';}catch{}try{this.endpoint=rememberedOnlineEndpoint(sessionStorage,this.endpoint);}catch{} }
  show(room=QuarryNetwork.roomFromURL()) {
    this.loadoutDraft=undefined;this.roster='';
    document.getElementById('online-dialog')?.remove();
    this.ui.insertAdjacentHTML('beforeend',`<div class="overlay" id="online-dialog"><form class="dialog online-dialog" id="online-form"><div class="eyebrow">PLAY TOGETHER / UP TO 24 DRIVERS</div><h2>QUARRY ONLINE</h2><p>Create a private room and send its link to your friends. AI drivers fill the empty places.</p><label for="driver-name">Driver name</label><input id="driver-name" maxlength="18" value="DRIVER" autocomplete="nickname" required>${this.setupChooser(this.callbacks.loadout?.().kind??'coupe')}<label for="room-code">Room code · leave empty to create</label><input id="room-code" maxlength="6" value="${escape(room)}" autocapitalize="characters" autocomplete="off" placeholder="NEW ROOM"><details ${this.endpoint?'':'open'}><summary>Server connection</summary><label for="server-url">Multiplayer server</label><input id="server-url" type="url" value="${escape(this.endpoint)}" placeholder="wss://…" required>${this.endpoint?'':'<p>This build needs a multiplayer server before friends can connect over the internet.</p>'}</details><p class="online-message" id="online-message" aria-live="polite"></p><button type="submit" class="primary" id="join-online">${room?'JOIN ROOM':'CONNECT ↗'}</button><button type="button" class="small-button" id="cancel-online">BACK</button></form></div>`);
    const name=document.getElementById('driver-name') as HTMLInputElement;
    try{name.value=localStorage.getItem('quarry-driver')||'DRIVER';}catch{}
    document.getElementById('cancel-online')!.onclick=()=>this.callbacks.leave();
    (document.getElementById('online-form') as HTMLFormElement).onsubmit=async e=>{
      e.preventDefault(); const button=document.getElementById('join-online') as HTMLButtonElement;
      button.disabled=true;this.message('CONNECTING…');
      this.endpoint=(document.getElementById('server-url') as HTMLInputElement).value.trim();
      try{localStorage.setItem('quarry-driver',name.value);}catch{}
      try{await this.callbacks.connect(this.endpoint,(document.getElementById('room-code') as HTMLInputElement).value.trim().toUpperCase(),name.value,this.chosenLoadout());}
      catch(error){this.message(error instanceof Error?error.message:String(error));button.disabled=false;}
    };
  }
  message(value:string) {const e=document.getElementById('online-message');if(e)e.textContent=value;const b=document.getElementById('join-online') as HTMLButtonElement|null;if(b)b.disabled=false;}
  lobby(s:Snapshot,force=false) {
    const key=JSON.stringify(s.members)+this.net.id+!!s.arenaSupport+!!s.courseSupport+!!s.rosterSupport+!!s.kiteSupport+!!s.morrowSupport+!!s.alderSupport+!!s.transmissionSupport+!!s.eventSupport+!!s.chaseSupport+!!s.timedRaceSupport+!!s.noRespawnDerbySupport+!!s.classEngineSupport+!!s.cupSupport+s.cars.length+s.setupRule+s.opponentSet+!!s.opponentSetSupport;if(key===this.roster&&!force)return;this.roster=key;
    this.ui.innerHTML=`<div class="overlay"><div class="dialog online-dialog"><div class="eyebrow">PRIVATE ROOM / ${escape(this.net.room)}</div><h2>GATHER YOUR DRIVERS</h2><p>${s.members.filter(m=>m.connected).length} / ${s.cars.length} drivers connected</p><p>Share the invitation link. Empty places are filled by AI.</p><input id="invite-url" readonly aria-label="Invitation link" value="${escape(this.net.shareURL)}"><button class="small-button" id="copy-invite">COPY INVITATION LINK</button><div class="online-roster">${Array.from({length:s.cars.length},(_,i)=>{const m=s.members.find(m=>m.id===i&&m.connected);return `<div class="results-row ${i===this.net.id?'player':''}"><span>${i+1} &nbsp; ${m?escape(m.name):'AI DRIVER'}</span><span>${m?(m.host?'HOST':'READY'):'AI · '+DEFINITIONS[s.cars[i].kind].name}</span></div>`;}).join('')}</div><p>${s.transmissionSupport?'Automatic and manual transmissions supported.':'This server uses automatic transmission.'}</p>${this.setupPanel(s)}<label for="online-mode">Event</label><select id="online-mode" ${this.net.isHost?'':'disabled'}><option value="derby">Demolition derby</option><option value="playground">Destruction playground</option><option value="race">${s.courseSupport?'Circuit race':'Quarry circuit'}</option></select>${s.cupSupport?'<label for="online-rounds">Event series</label><select id="online-rounds"><option value="1">Single event</option><option value="3">3-round cup</option><option value="5">5-round cup</option><option value="9">9-round cup</option></select>':''}${this.eventPanel(s)}<p id="online-message" class="online-message" aria-live="polite">${this.net.isHost?'Start when your friends are ready.':'Waiting for the host to start.'}</p>${this.net.isHost?'<button class="primary" id="start-online">START EVENT ↗</button>':''}<button class="small-button" id="leave-online">LEAVE ROOM</button></div></div>`;
    document.getElementById('copy-invite')!.onclick=async()=>{
      try{await navigator.clipboard.writeText(this.net.shareURL);this.message('Invitation link copied.');}
      catch{(document.getElementById('invite-url') as HTMLInputElement).select();this.message('Select and copy the invitation link.');}
    };
    this.bindSetup();this.bindEvents();
    const mode=document.getElementById('online-mode') as HTMLSelectElement,rounds=document.getElementById('online-rounds') as HTMLSelectElement|null;
    mode.value=this.modeDraft;if(rounds){rounds.value=String(this.roundsDraft);rounds.disabled=!this.net.isHost||mode.value==='playground'||!!this.eventDraft.chase;rounds.onchange=()=>this.roundsDraft=+rounds.value;}mode.onchange=()=>{this.modeDraft=mode.value as Mode;if(mode.value!=='race'){const chase=this.ui.querySelector<HTMLSelectElement>('#online-chase');if(chase){chase.value='race';chase.dispatchEvent(new Event('change'));}}if(rounds){if(mode.value==='playground')rounds.value='1';this.roundsDraft=+rounds.value;rounds.disabled=!this.net.isHost||mode.value==='playground'||!!this.eventDraft.chase;}};
    const start=document.getElementById('start-online');if(start)start.onclick=()=>this.startEvent(mode.value as Mode,+(rounds?.value??1),s);
    document.getElementById('leave-online')!.onclick=()=>this.callbacks.leave();
  }
  results(s:Snapshot){
    const button=this.ui.querySelector<HTMLButtonElement>('#again');if(!button)return;
    button.closest('.dialog')?.classList.add('online-dialog');
    button.disabled=!this.net.isHost;
    let loadout=this.ui.querySelector<HTMLElement>('#result-loadout');if(!loadout){loadout=document.createElement('section');loadout.id='result-loadout';button.before(loadout);}
    const setupKey=JSON.stringify(s.members)+s.setupRule+!!s.arenaSupport+!!s.courseSupport+!!s.rosterSupport+!!s.kiteSupport+!!s.morrowSupport+!!s.alderSupport+!!s.classEngineSupport+s.opponentSet+!!s.opponentSetSupport;if(loadout.dataset.state!==setupKey){loadout.dataset.state=setupKey;loadout.innerHTML=this.setupPanel(s);this.bindSetup();}

    if(!s.cup||s.cup.completed===s.cup.rounds){let rules=this.ui.querySelector<HTMLElement>('#result-event-rules');if(!rules){rules=document.createElement('section');rules.id='result-event-rules';button.before(rules);this.eventDraft=copyOnlineEventRules(s.event?.rules??DEFAULT_ONLINE_EVENT);}const key=String(this.net.isHost)+s.eventSupport+!!s.arenaSupport+!!s.courseSupport+!!s.chaseSupport+!!s.timedRaceSupport+!!s.noRespawnDerbySupport;if(rules.dataset.state!==key){rules.dataset.state=key;rules.innerHTML=this.eventPanel(s)+'<p id="online-message" class="online-message" aria-live="polite"></p>';this.bindEvents();}}
    if(s.event){let label=this.ui.querySelector<HTMLElement>('#result-event-label');if(!label){label=document.createElement('p');label.id='result-event-label';button.before(label);}label.textContent=onlineEventLabel(s.mode,s.event.rules);}
    if(!s.cup){button.onclick=()=>this.startEvent(s.mode,1,s);button.textContent=this.net.isHost?'RUN IT BACK ↗':'WAITING FOR HOST REMATCH';return;}
    const complete=s.cup.completed===s.cup.rounds;
    button.textContent=this.net.isHost?(complete?`NEW ${s.cup.rounds}-ROUND CUP ↗`:`START ROUND ${s.cup.round+1} ↗`):'WAITING FOR HOST';
    button.onclick=()=>complete?this.startEvent(s.mode,s.cup!.rounds,s):this.net.nextRound();
    let panel=this.ui.querySelector<HTMLElement>('#cup-results');if(!panel){panel=document.createElement('section');panel.id='cup-results';panel.className='cup-results';button.before(panel);}
    const key=JSON.stringify(s.cup)+JSON.stringify(s.members)+JSON.stringify(s.event?.rules)+this.net.id;if(panel.dataset.state===key)return;panel.dataset.state=key;
    panel.innerHTML=cupResultsMarkup(s.cup,s.members,this.net.id,s.event?.rules);
    for(const vote of Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-cup-vote]')))vote.onclick=()=>this.net.vote(vote.dataset.cupVote as 'race'|'derby');
  }

}
