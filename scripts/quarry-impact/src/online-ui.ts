import { QuarryNetwork, type Snapshot } from './network';
import type { Mode } from './rules';

const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export class OnlineUI {
  endpoint='';
  private roster='';
  constructor(private ui:HTMLElement,private net:QuarryNetwork,private callbacks:{
    connect:(endpoint:string,room:string,name:string)=>Promise<void>; leave:()=>void;
  }) {}
  async configure() { try{const r=await fetch('./multiplayer.json');if(r.ok)this.endpoint=(await r.json()).endpoint??'';}catch{} }
  show(room=QuarryNetwork.roomFromURL()) {
    document.getElementById('online-dialog')?.remove();
    this.ui.insertAdjacentHTML('beforeend',`<div class="overlay" id="online-dialog"><form class="dialog online-dialog" id="online-form"><div class="eyebrow">PLAY TOGETHER / UP TO EIGHT DRIVERS</div><h2>QUARRY ONLINE</h2><p>Create a private room and send its link to your friends. AI drivers fill the empty places.</p><label for="driver-name">Driver name</label><input id="driver-name" maxlength="18" value="DRIVER" autocomplete="nickname" required><label for="room-code">Room code · leave empty to create</label><input id="room-code" maxlength="6" value="${escape(room)}" autocapitalize="characters" autocomplete="off" placeholder="NEW ROOM"><details ${this.endpoint?'':'open'}><summary>Server connection</summary><label for="server-url">Multiplayer server</label><input id="server-url" type="url" value="${escape(this.endpoint)}" placeholder="wss://…" required>${this.endpoint?'':'<p>This build needs a multiplayer server before friends can connect over the internet.</p>'}</details><p class="online-message" id="online-message" aria-live="polite"></p><button type="submit" class="primary" id="join-online">${room?'JOIN ROOM':'CONNECT ↗'}</button><button type="button" class="small-button" id="cancel-online">BACK</button></form></div>`);
    const name=document.getElementById('driver-name') as HTMLInputElement;
    try{name.value=localStorage.getItem('quarry-driver')||'DRIVER';}catch{}
    document.getElementById('cancel-online')!.onclick=()=>this.callbacks.leave();
    (document.getElementById('online-form') as HTMLFormElement).onsubmit=async e=>{
      e.preventDefault(); const button=document.getElementById('join-online') as HTMLButtonElement;
      button.disabled=true;this.message('CONNECTING…');
      this.endpoint=(document.getElementById('server-url') as HTMLInputElement).value.trim();
      try{localStorage.setItem('quarry-driver',name.value);}catch{}
      try{await this.callbacks.connect(this.endpoint,(document.getElementById('room-code') as HTMLInputElement).value.trim().toUpperCase(),name.value);}
      catch(error){this.message(error instanceof Error?error.message:String(error));button.disabled=false;}
    };
  }
  message(value:string) {const e=document.getElementById('online-message');if(e)e.textContent=value;const b=document.getElementById('join-online') as HTMLButtonElement|null;if(b)b.disabled=false;}
  lobby(s:Snapshot,force=false) {
    const key=JSON.stringify(s.members)+this.net.id;if(key===this.roster&&!force)return;this.roster=key;
    this.ui.innerHTML=`<div class="overlay"><div class="dialog online-dialog"><div class="eyebrow">PRIVATE ROOM / ${escape(this.net.room)}</div><h2>GATHER YOUR DRIVERS</h2><p>Share the invitation link. Empty places are filled by AI.</p><input id="invite-url" readonly aria-label="Invitation link" value="${escape(this.net.shareURL)}"><button class="small-button" id="copy-invite">COPY INVITATION LINK</button><div class="online-roster">${Array.from({length:8},(_,i)=>{const m=s.members.find(m=>m.id===i&&m.connected);return `<div class="results-row ${i===this.net.id?'player':''}"><span>${i+1} &nbsp; ${m?escape(m.name):'AI DRIVER'}</span><span>${m?(m.host?'HOST':'READY'):'OPEN PLACE'}</span></div>`;}).join('')}</div><label for="online-mode">Event</label><select id="online-mode" ${this.net.isHost?'':'disabled'}><option value="derby">Demolition derby</option><option value="playground">Destruction playground</option><option value="race">Quarry circuit</option></select><p id="online-message" class="online-message" aria-live="polite">${this.net.isHost?'Start when your friends are ready.':'Waiting for the host to start.'}</p>${this.net.isHost?'<button class="primary" id="start-online">START EVENT ↗</button>':''}<button class="small-button" id="leave-online">LEAVE ROOM</button></div></div>`;
    document.getElementById('copy-invite')!.onclick=async()=>{
      try{await navigator.clipboard.writeText(this.net.shareURL);this.message('Invitation link copied.');}
      catch{(document.getElementById('invite-url') as HTMLInputElement).select();this.message('Select and copy the invitation link.');}
    };
    const start=document.getElementById('start-online');if(start)start.onclick=()=>this.net.start((document.getElementById('online-mode') as HTMLSelectElement).value as Mode);
    document.getElementById('leave-online')!.onclick=()=>this.callbacks.leave();
  }
}
