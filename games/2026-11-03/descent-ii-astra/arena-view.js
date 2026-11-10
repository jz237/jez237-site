/* The selection changes only the spectator camera, never AI ownership. */
(() => {
  const bar=document.getElementById('arenaViewBar'),select=document.getElementById('arenaViewPilot'),status=document.getElementById('arenaViewStatus');
  const names=['Astra','Viper','Orbit','Nova'];
  let shown=-1,lastStatus='';
  function choose(id){
    if(!window.Module?.arenaDemo)return;
    Module.arenaView=(id+4)%4;select.value=String(Module.arenaView);
  }
  select.addEventListener('change',()=>choose(Number(select.value)));
  document.getElementById('arenaViewPrev').onclick=()=>choose((Module.arenaView||0)-1);
  document.getElementById('arenaViewNext').onclick=()=>choose((Module.arenaView||0)+1);
  window.addEventListener('keydown',event=>{
    const field=event.target.closest('input,select,textarea,dialog');
    if(!window.Module?.arenaDemo||bar.hidden||document.body.classList.contains('native-open')||event.repeat||event.altKey||event.ctrlKey||event.metaKey||(field&&field!==select))return;
    let id=/^[1-4]$/.test(event.key)?Number(event.key)-1:event.code==='BracketLeft'?(Module.arenaView||0)-1:event.code==='BracketRight'?(Module.arenaView||0)+1:null;
    if(id===null)return;event.preventDefault();event.stopImmediatePropagation();choose(id);
  },true);
  window.astraArenaView={choose,update(id,alive,shields,kills,deaths,respawn){
    bar.hidden=!document.body.classList.contains('flying')||document.body.classList.contains('native-open');
    if(id!==shown){shown=id;select.value=String(id);bar.dataset.pilot=String(id);}
    const text=alive?`${Math.max(0,Math.round(shields))} shields · ${kills} kills · ${deaths} deaths`:`${names[id]} respawning${respawn>0?' · '+Math.ceil(respawn)+'s':''}`;
    if(text!==lastStatus){status.textContent=text;lastStatus=text;}
    if(id>0){
      const task=document.getElementById('autoTask'),stats=document.getElementById('autoStats');
      const title=Module.autoPaused?'Paused':!alive?'Respawning':Module.netBots?.[id]?.target>=0?'Engaging opponent':'Patrolling arena';
      const c=window.astraCampaigns[Module.campaign],caption=`${c.name} · ${c.maps[(Module.flightState?.level||Module.startLevel)-1]} · Watching ${names[id]} · ${kills} kills · ${deaths} deaths`;
      if(task.textContent!==title)task.textContent=title;if(stats.textContent!==caption)stats.textContent=caption;
    }
  }};
})();
