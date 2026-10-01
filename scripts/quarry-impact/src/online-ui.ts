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
  constructor(private ui:HTMLElement,private net:QuarryNetwork,private callbacks:{
    connect:(endpoint:string,room:string,name:string,loadout?:OnlineSelection)=>Promise<void>; leave:()=>void; loadout?:(kind?:CarKind)=>OnlineSelection;
  }) {}
  private chosenLoadout():OnlineSelection{
    const kind=(document.getElementById('online-car') as HTMLSelectElement).value as CarKind;
    const saved=(document.getElementById('online-setup') as HTMLSelectElement).value==='garage';
    return {kind,livery:saved?this.callbacks.loadout?.(kind).livery??[]:[],setup:copyOnlineSetup(saved?(this.callbacks.loadout?.(kind).setup??stockOnlineSetup(kind)):stockOnlineSetup(kind))};
  }
  private setupChooser(kind:CarKind){return `<label for="online-car">Car for next event</label><select id="online-car">${(['coupe','sedan','hatch']as const).map(k=>`<option value="${k}" ${k===kind?'selected':''}>${DEFINITIONS[k].name}</option>`).join('')}</select><label for="online-setup">Setup</label><select id="online-setup"><option value="garage">Saved tuning, paint & decals</option><option value="stock">Factory setup</option></select>`;}
  private setupPanel(s:Snapshot){
    if(!s.setupSupport)return '<p>This server uses factory setups.</p>';
    const selected=s.members.find(m=>m.id===this.net.id)?.loadout,kind=selected?.kind??this.callbacks.loadout?.().kind??'coupe';
    return `<section id="online-loadout"><h3>YOUR NEXT EVENT</h3>${this.setupChooser(kind)}<button class="small-button" id="apply-online-setup">APPLY CAR & SETUP</button>${selected?`<p>Confirmed: ${DEFINITIONS[kind].name} · Engine ${selected.setup.engine} · Tires ${selected.setup.tires} · Armor ${selected.setup.armor} · ${s.members.find(m=>m.id===this.net.id)?.liveryLayers??0} decal layers</p>`:''}<label for="online-performance">Performance rules</label><select id="online-performance" ${this.net.isHost?'':'disabled'}><option value="open" ${s.setupRule!=='stock'?'selected':''}>Garage upgrades & tuning</option><option value="stock" ${s.setupRule==='stock'?'selected':''}>Stock performance for everyone</option></select><p>${s.setupRule==='stock'?'Factory performance is enforced. Your paint stays applied.':'Saved upgrades and tuning apply when the next event starts.'}</p></section>`;
  }
  private bindSetup(){
    const apply=document.getElementById('apply-online-setup');if(apply)apply.onclick=()=>this.net.setLoadout(this.chosenLoadout());
    const rule=document.getElementById('online-performance') as HTMLSelectElement|null;if(rule)rule.onchange=()=>this.net.setSetupRule(rule.value as SetupRule);
  }
  async configure() { try{const r=await fetch('./multiplayer.json');if(r.ok)this.endpoint=(await r.json()).endpoint??'';}catch{} }
  show(room=QuarryNetwork.roomFromURL()) {
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
    const key=JSON.stringify(s.members)+this.net.id+!!s.cupSupport+s.cars.length+s.setupRule;if(key===this.roster&&!force)return;this.roster=key;
    this.ui.innerHTML=`<div class="overlay"><div class="dialog online-dialog"><div class="eyebrow">PRIVATE ROOM / ${escape(this.net.room)}</div><h2>GATHER YOUR DRIVERS</h2><p>${s.members.filter(m=>m.connected).length} / ${s.cars.length} drivers connected</p><p>Share the invitation link. Empty places are filled by AI.</p><input id="invite-url" readonly aria-label="Invitation link" value="${escape(this.net.shareURL)}"><button class="small-button" id="copy-invite">COPY INVITATION LINK</button><div class="online-roster">${Array.from({length:s.cars.length},(_,i)=>{const m=s.members.find(m=>m.id===i&&m.connected);return `<div class="results-row ${i===this.net.id?'player':''}"><span>${i+1} &nbsp; ${m?escape(m.name):'AI DRIVER'}</span><span>${m?(m.host?'HOST':'READY'):'OPEN PLACE'}</span></div>`;}).join('')}</div>${this.setupPanel(s)}<label for="online-mode">Event</label><select id="online-mode" ${this.net.isHost?'':'disabled'}><option value="derby">Demolition derby</option><option value="playground">Destruction playground</option><option value="race">Quarry circuit</option></select>${s.cupSupport?'<label for="online-rounds">Event series</label><select id="online-rounds"><option value="1">Single event</option><option value="3">3-round cup</option><option value="5">5-round cup</option><option value="9">9-round cup</option></select>':''}<p id="online-message" class="online-message" aria-live="polite">${this.net.isHost?'Start when your friends are ready.':'Waiting for the host to start.'}</p>${this.net.isHost?'<button class="primary" id="start-online">START EVENT ↗</button>':''}<button class="small-button" id="leave-online">LEAVE ROOM</button></div></div>`;
    document.getElementById('copy-invite')!.onclick=async()=>{
      try{await navigator.clipboard.writeText(this.net.shareURL);this.message('Invitation link copied.');}
      catch{(document.getElementById('invite-url') as HTMLInputElement).select();this.message('Select and copy the invitation link.');}
    };
    this.bindSetup();
    const mode=document.getElementById('online-mode') as HTMLSelectElement,rounds=document.getElementById('online-rounds') as HTMLSelectElement|null;
    if(rounds){rounds.disabled=!this.net.isHost;mode.onchange=()=>{if(mode.value==='playground')rounds.value='1';rounds.disabled=!this.net.isHost||mode.value==='playground';};}
    const start=document.getElementById('start-online');if(start)start.onclick=()=>this.net.start(mode.value as Mode,+(rounds?.value??1));
    document.getElementById('leave-online')!.onclick=()=>this.callbacks.leave();
  }
  results(s:Snapshot){
    const button=this.ui.querySelector<HTMLButtonElement>('#again');if(!button)return;
    button.disabled=!this.net.isHost;
    let loadout=this.ui.querySelector<HTMLElement>('#result-loadout');if(!loadout){loadout=document.createElement('section');loadout.id='result-loadout';button.before(loadout);}
    const setupKey=JSON.stringify(s.members)+s.setupRule;if(loadout.dataset.state!==setupKey){loadout.dataset.state=setupKey;loadout.innerHTML=this.setupPanel(s);this.bindSetup();}

    if(!s.cup){button.textContent=this.net.isHost?'RUN IT BACK ↗':'WAITING FOR HOST REMATCH';return;}
    const complete=s.cup.completed===s.cup.rounds;
    button.textContent=this.net.isHost?(complete?`NEW ${s.cup.rounds}-ROUND CUP ↗`:`START ROUND ${s.cup.round+1} ↗`):'WAITING FOR HOST';
    button.onclick=()=>complete?this.net.start(s.mode,s.cup!.rounds):this.net.nextRound();
    let panel=this.ui.querySelector<HTMLElement>('#cup-results');if(!panel){panel=document.createElement('section');panel.id='cup-results';panel.className='cup-results';button.before(panel);}
    const key=JSON.stringify(s.cup)+JSON.stringify(s.members)+this.net.id;if(panel.dataset.state===key)return;panel.dataset.state=key;
    panel.innerHTML=cupResultsMarkup(s.cup,s.members,this.net.id);
    for(const vote of Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-cup-vote]')))vote.onclick=()=>this.net.vote(vote.dataset.cupVote as 'race'|'derby');
  }

}
