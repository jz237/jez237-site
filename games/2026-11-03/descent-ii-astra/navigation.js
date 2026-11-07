/* Resume through the native pause menu. End a flight only after confirmation
 * and after its pilot settings/saves have reached IndexedDB. */
(()=>{
  'use strict';
  const q=id=>document.getElementById(id);
  let busy=false;
  const dialog=document.createElement('dialog');dialog.id='returnDialog';
  dialog.innerHTML='<h2>Return to the main menu?</h2><p id="returnDescription"></p><p id="returnStatus" role="status" aria-live="polite"></p><div><button id="returnCancel" autofocus>Keep playing</button><button id="returnConfirm">Main menu</button></div>';
  document.body.append(dialog);
  async function leave(){
    if(busy)return;busy=true;
    q('returnConfirm').disabled=true;q('returnCancel').disabled=true;
    q('returnStatus').textContent='Saving your settings…';
    try{
      const m=window.Module;
      // Never race the regular sync timer or a checkpoint transaction.
      const deadline=performance.now()+15000;
      while(saving||m?.checkpointBusy){
        if(performance.now()>deadline)throw Error('A save is still in progress. Wait a moment and try again.');
        await new Promise(r=>setTimeout(r,50));
      }
      if(m?.saveReady){
        saving=true;
        try{
          if(m.calledRun&&!m.aborted&&!m.astraExited)m._astra_store_preferences?.();
          await new Promise((resolve,reject)=>m.FS.syncfs(false,e=>e?reject(Error('Could not save your settings. Please try again.')):resolve()));
        }finally{saving=false;}
      }
      window.astraNet?.shutdown();
      window.releaseFlightMouse?.();window.astraControllers?.reset();
      if(m?.calledRun&&!m.aborted&&!m.astraExited)m._astra_silence_flight?.();
      window.astraDisc?.stop();
      if(typeof wakeLock!=='undefined')await wakeLock?.release();
      if(window.parent!==window){
        window.parent.postMessage({type:'astra:return-to-title'},location.origin==='null'?'*':location.origin);
      }else location.replace(new URL('./',location.href).href);
    }catch(error){
      busy=false;q('returnConfirm').disabled=false;q('returnCancel').disabled=false;
      q('returnStatus').textContent=error.message;
      if(!dialog.open)dialog.showModal();
    }
  }
  function home(ask=true){
    if(busy)return;
    window.releaseFlightMouse?.();window.Module?._astra_reset_flight_input?.();
    const net=window.Module?.netSession;
    q('returnDescription').textContent=net
      ?'You will leave this match. Hosting transfers to another connected pilot. You can start another campaign or match from the main menu.'
      :'Choose Save & return to continue this flight later, or Main menu to leave without saving this flight. Your settings and existing saves are kept.';
    q('returnStatus').textContent='';
    if(ask){if(!dialog.open)dialog.showModal();}else void leave();
  }
  window.astraNavigation={home,get busy(){return busy;}};
  q('returnCancel').onclick=()=>dialog.close();q('returnConfirm').onclick=()=>void leave();
  dialog.addEventListener('cancel',e=>{if(busy||window.astraResume?.pending)e.preventDefault();});
  for(const type of ['keydown','keyup'])dialog.addEventListener(type,e=>e.stopPropagation());
  const main=document.createElement('button');main.id='nativeHome';main.textContent='Main menu';
  main.onclick=()=>home();q('nativeBack').after(main);
  document.querySelector('.native-brand').onclick=e=>{e.preventDefault();home();};
  document.querySelector('#terminal .brand').onclick=e=>{e.preventDefault();window.astraTerminal.tab('missions');};
  document.querySelectorAll('.terminal-footer a').forEach(a=>a.target='_top');
  // Demos and showrooms also return through the same lifecycle.
  const previewHome=document.createElement('button');previewHome.id='previewHome';previewHome.textContent='Main menu';
  previewHome.onclick=()=>home(false);q('stage').append(previewHome);
})();
