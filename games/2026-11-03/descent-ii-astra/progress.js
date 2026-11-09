/* Checkpoints use native save data; the small local index is only a launcher hint. */
(()=>{
  const root='/home/web_user/.d2-astra/',key='astra.checkpoints.v1',names=Object.keys(window.astraCampaigns);
  const q=id=>document.getElementById(id);let index={},status=null;
  try{index=JSON.parse(localStorage.getItem(key)||'{}');}catch{}
  const enabled=q('checkpoints');try{enabled.checked=localStorage.getItem('astra.checkpoints.enabled')!=='0';}catch{}
  enabled.onchange=()=>{try{localStorage.setItem('astra.checkpoints.enabled',enabled.checked?'1':'0');}catch{}if(window.Module)Module.checkpoints=enabled.checked;};
  const panel=document.createElement('details');panel.id='objectiveTracker';panel.hidden=true;
  panel.innerHTML='<summary aria-label="Show mission objective"><span id="objectiveBrief">Mission</span><span aria-hidden="true">⌄</span></summary><div id="objectiveDetails"><p id="objectiveText"></p><div id="objectiveSecurity"></div><div id="objectiveReactor"></div><small id="checkpointStatus"></small><button id="restoreCheckpoint" type="button" hidden>Restore checkpoint</button></div>';
  q('stage').append(panel);
  const file=(c,s)=>`checkpoint-${c}-${s}.sav`;
  const selected=()=>names.indexOf(q('campaign').value);
  function refresh(){const cp=index[selected()];q('continueFlight').disabled=!cp;q('checkpointInfo').textContent=cp?`${cp.name} · Level ${cp.level}`:'No checkpoint yet';}
  function remember(){try{localStorage.setItem(key,JSON.stringify(index));}catch{}refresh();}
  function valid(c,cp){
    if(!cp||![0,1].includes(cp.slot))return false;
    try{const F=Module.FS,b=F.readFile(root+file(c,cp.slot));if(b.length<1000||String.fromCharCode(...b.slice(0,4))!=='DGSS')return false;
      if(c===2){const ov=F.readFile(root+file(c,cp.slot)+'.ov');if(ov.length<32060||String.fromCharCode(...ov.slice(0,4))!=='OVS2')return false;const size=new DataView(ov.buffer,ov.byteOffset).getUint32(4,true);if(size>8*1024*1024||size+32060>ov.length)return false;JSON.parse(new TextDecoder().decode(ov.subarray(8,8+size)));}return true;
    }catch{return false;}
  }
  const api=window.astraProgress={
    mounted(){
      const F=Module.FS;
      for(let c=0;c<names.length;c++){
        const options=[];for(let s=0;s<2;s++)try{const cp=JSON.parse(F.readFile(root+file(c,s)+'.json',{encoding:'utf8'}));if(cp.campaign===c&&valid(c,cp))options.push(cp);}catch{}
        options.sort((a,b)=>b.time-a.time);if(options.length)index[c]=options[0];else delete index[c];
      }remember();
    },
    available(c){return valid(c,index[c]);},
    nextSlot(c){return index[c]?.slot===0?1:0;},
    async saved(c,slot,level,name){
      const F=Module.FS,base=file(c,slot),cp={campaign:c,slot,level,name,time:Date.now(),version:1};
      try{
        if(!valid(c,cp))throw Error('Incomplete native checkpoint');
        // Copy the visited-secret state into this same checkpoint generation.
        for(const suffix of ['', '.ov']){const target=root+base+'.secret'+suffix;try{F.writeFile(target,F.readFile(root+'secret.sgc'+suffix));}catch{try{F.unlink(target);}catch{}}}
        F.writeFile(root+base+'.json',JSON.stringify(cp));
        while(typeof saving!=='undefined'&&saving)await new Promise(r=>setTimeout(r,50));
        await new Promise((resolve,reject)=>F.syncfs(false,e=>e?reject(e):resolve()));
        index[c]=cp;remember();api.message('Checkpoint saved');
      }catch(e){console.warn('Checkpoint persistence',e);api.message('Checkpoint storage unavailable · Use manual Save');}
      finally{Module.checkpointBusy=false;}
    },
    restoreSlot(c){
      const cp=index[c];if(Module.checkpointBusy||!valid(c,cp)){api.message('No valid checkpoint for this campaign');return -1;}
      const F=Module.FS;
      for(const suffix of ['', '.ov']){const target=root+'secret.sgc'+suffix;try{F.writeFile(target,F.readFile(root+file(c,cp.slot)+'.secret'+suffix));}catch{try{F.unlink(target);}catch{}}}
      return cp.slot;
    },
    restored(ok){api.message(ok?'Checkpoint restored':'Checkpoint could not be restored');},
    message(text){q('checkpointStatus').textContent=text;},
    update(s){
      status=s;api.state=s;const controller=window.astraOverload?.controller;
      const objective=s.dead?'Ship lost · Restore a checkpoint from here or the flight menu':s.reactor?'Escape the mine before the reactor detonates':s.campaign>=3?'Explore the classic arena · Deathmatch is available from Missions':s.campaign===2?window.astraOverload?.objective||'Explore the facility':'Find the reactor, destroy it and reach the exit';
      const brief=s.dead?'Ship lost':s.reactor?`Escape · ${Math.max(0,s.countdown)}s`:`L${s.level} · Objective`;
      for(const [id,text] of Object.entries({objectiveBrief:brief,objectiveText:objective,objectiveSecurity:s.campaign>=3?'Classic anarchy arena':s.campaign===2?`Security clearance: ${controller?.clearance||0}`:`Keys: ${[[2,'Blue'],[4,'Red'],[8,'Gold']].filter(([f])=>s.keys&f).map(([,n])=>n).join(' · ')||'None'}`,objectiveReactor:s.reactor?`Reactor destroyed · ${Math.max(0,s.countdown)}s remaining`:s.campaign>=3?'Original pickups and spawn points':'Reactor: secure'}))if(q(id).textContent!==text)q(id).textContent=text;
      q('restoreCheckpoint').hidden=!index[s.campaign];
    }
  };
  q('campaign').addEventListener('change',refresh);refresh();
  q('continueFlight').onclick=()=>{if(!index[selected()]||launchPending)return;window.astraResumeCheckpoint=true;q('start').click();};
  q('restoreCheckpoint').onclick=()=>{releaseFlightMouse();if(confirm('Restore the last checkpoint and replace the current flight?'))Module.checkpointCommand=1;};
  // Low-frequency DOM updates; no giant overlay or per-frame layout work.
  setInterval(()=>{const m=window.Module;panel.hidden=!status||!document.body.classList.contains('flying')||!!m?.autopilot||!!window.astraPreview?.active||m?.mineInspect>=0||document.body.classList.contains('native-open');},300);
})();
