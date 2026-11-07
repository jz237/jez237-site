/* A separate rotating suspend save; manual saves and checkpoints stay intact. */
(()=>{
  'use strict';const root='/home/web_user/.d2-astra/',key='astra.lastFlight.v1',campaigns=['d2','d2x','overload'],q=id=>document.getElementById(id);
  let latest=null,pending=false;try{latest=JSON.parse(localStorage.getItem(key));}catch{}
  const button=document.createElement('button');button.id='resumeLastFlight';button.className='launch secondary-action';q('start').before(button);
  function refresh(){button.disabled=!latest;button.textContent=latest?`Continue last flight · ${latest.name} · Mine ${latest.level}`:'Continue last flight · No saved flight yet';}
  function pendingButtons(){saveButton.disabled=pending;q('returnCancel').disabled=pending;q('returnConfirm').disabled=pending;}
  const file=slot=>`last-flight-${slot}.sav`;
  function valid(meta){
    if(!meta||![0,1].includes(meta.slot)||!Number.isInteger(meta.campaign)||!campaigns[meta.campaign])return false;
    try{const bytes=Module.FS.readFile(root+file(meta.slot));if(bytes.length<1000||String.fromCharCode(...bytes.slice(0,4))!=='DGSS')return false;
      if(meta.campaign===2){const ov=Module.FS.readFile(root+file(meta.slot)+'.ov');if(ov.length<32060||String.fromCharCode(...ov.slice(0,4))!=='OVS2')return false;const size=new DataView(ov.buffer,ov.byteOffset).getUint32(4,true);if(size>8*1024*1024||size+32060>ov.length)return false;JSON.parse(new TextDecoder().decode(ov.subarray(8,8+size)));}return true;
    }catch{return false;}
  }
  function remember(){try{if(latest)localStorage.setItem(key,JSON.stringify(latest));else localStorage.removeItem(key);}catch{}refresh();}
  const saveButton=document.createElement('button');saveButton.id='returnSave';saveButton.textContent='Save & return';q('returnConfirm').before(saveButton);
  const message=document.createElement('dialog');message.id='saveFlightMessage';message.className='astra-tool-dialog';message.innerHTML='<h2>Save flight</h2><p role="status"></p><button>Back to flight menu</button>';document.body.append(message);message.querySelector('button').onclick=()=>message.close();
  const api=window.astraResume={
    get pending(){return pending;},
    canSave(){const m=window.Module;return !!m?.flightState&&!m.netSession&&!m.autopilot&&!m.demo&&!m.encounter&&!window.astraPreview?.active;},
    nextSlot(){return latest?.slot===0?1:0;},
    mounted(){const found=[];for(const slot of [0,1])try{const meta=JSON.parse(Module.FS.readFile(root+file(slot)+'.json',{encoding:'utf8'}));if(valid(meta))found.push(meta);}catch{}found.sort((a,b)=>b.time-a.time);latest=found[0]||null;remember();return !Module.resumeFlight||!!latest;},
    async save(){
      if(pending||!this.canSave())return;pending=true;pendingButtons();
      q('returnStatus').textContent='Saving your flight…';
      try{
        const deadline=performance.now()+15000;
        while(saving||Module.checkpointBusy){if(performance.now()>deadline)throw Error('Another save is still in progress. Please try again shortly.');await new Promise(r=>setTimeout(r,50));}
        Module.saveReturnCommand=1;
      }catch(e){this.failed(e.message);}
    },
    async saved(slot,campaign,level,name){
      const F=Module.FS,base=file(slot),meta={slot,campaign,level,name,time:Date.now(),version:1};
      try{
        if(!valid(meta))throw Error('The saved flight did not validate. Your previous saved flight is intact.');
        for(const suffix of ['', '.ov']){const dest=root+base+'.secret'+suffix;try{F.writeFile(dest,F.readFile(root+'secret.sgc'+suffix));}catch{try{F.unlink(dest);}catch{}}}
        F.writeFile(root+base+'.json',JSON.stringify(meta));
        while(saving)await new Promise(r=>setTimeout(r,50));
        await new Promise((resolve,reject)=>F.syncfs(false,e=>e?reject(Error('Browser storage could not save your flight. Keep playing or try a manual save.')):resolve()));
        latest=meta;remember();pending=false;Module.checkpointBusy=false;saveButton.disabled=false;window.astraNavigation.home(false);
      }catch(e){Module.checkpointBusy=false;this.failed(e.message);}
    },
    failed(text){pending=false;pendingButtons();if(window.Module)Module.checkpointBusy=false;q('returnStatus').textContent=text;message.querySelector('p').textContent=text;if(!message.open)message.showModal();},
    restoreSlot(){if(!valid(latest))return -1;const F=Module.FS;for(const suffix of ['', '.ov']){const dest=root+'secret.sgc'+suffix;try{F.writeFile(dest,F.readFile(root+file(latest.slot)+'.secret'+suffix));}catch{try{F.unlink(dest);}catch{}}}return latest.slot;},
    restored(ok){if(!ok)this.failed('This saved flight could not be restored. Your manual saves are still available.');}
  };
  saveButton.onclick=()=>api.save();
  button.onclick=()=>{if(!latest||launchPending)return;q('campaign').value=campaigns[latest.campaign];q('campaign').dispatchEvent(new Event('change'));window.astraResumeLast=true;q('start').click();};
  new MutationObserver(()=>{saveButton.hidden=!api.canSave();pendingButtons();}).observe(q('returnDialog'),{attributes:true,attributeFilter:['open']});
  refresh();
})();
