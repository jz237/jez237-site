/* Optional comfort controls and a measured, non-adaptive performance check. */
(()=>{
  'use strict';const q=id=>document.getElementById(id),key='astra.comfort.v1',resultKey='astra.performance.v1';
  const clamp=(n,d)=>Number.isFinite(+n)?Math.max(0,Math.min(1,+n)):d;
  let stored={};try{stored=JSON.parse(localStorage.getItem(key))||{};}catch{}
  const comfort={glare:clamp(stored.glare,1),shake:clamp(stored.shake,1),smooth:clamp(stored.smooth,0)};
  const dialog=document.createElement('dialog');dialog.id='comfortDialog';dialog.className='astra-tool-dialog';
  dialog.innerHTML='<header><h2>Flight comfort</h2><button id="comfortClose">Close</button></header><p>Applies immediately. Textures and distant explosion detail stay at your selected quality.</p>'+[
    ['glare','Nearby explosion glare','Lower this to see through blasts close to your cockpit.'],['shake','Screen shake','Adjust Earthshaker and reactor tremors affecting your ship. Mine sounds and lighting remain.'],['smooth','Demo camera smoothing','Higher values soften demo turns. Your manual controls stay the same.']
  ].map(([id,title,description])=>`<label><span>${title}<output id="comfort-${id}-value"></output></span><input id="comfort-${id}" type="range" min="0" max="100" step="5"><small>${description}</small></label>`).join('')+'<button id="comfortReset">Restore original intensity</button>';
  document.body.append(dialog);
  function update(){for(const id of ['glare','shake','smooth']){q('comfort-'+id).value=Math.round(comfort[id]*100);q('comfort-'+id+'-value').textContent=Math.round(comfort[id]*100)+'%';}if(window.Module)Module.comfort={...comfort};try{localStorage.setItem(key,JSON.stringify(comfort));}catch{}}
  for(const id of ['glare','shake','smooth'])q('comfort-'+id).oninput=e=>{comfort[id]=Number(e.target.value)/100;update();};
  q('comfortClose').onclick=()=>dialog.close();q('comfortReset').onclick=()=>{Object.assign(comfort,{glare:1,shake:1,smooth:0});update();};
  window.astraTools={get comfort(){return {...comfort};},open(){releaseFlightMouse();window.Module?._astra_reset_flight_input?.();dialog.showModal();}};
  function addButton(id,title,parent){const b=document.createElement('button');b.id=id;b.textContent=title;b.className='secondary-action';parent.append(b);return b;}
  addButton('comfortSetup','Flight comfort',q('panel-settings')).onclick=()=>astraTools.open();
  addButton('nativeComfort','Comfort',q('nativeBack').parentElement).onclick=()=>astraTools.open();update();
  const start=addButton('performanceStart','Run 45-second performance check',q('panel-settings'));start.classList.add('launch');
  const hint=document.createElement('p');hint.className='interaction-note';hint.textContent='Measures loading, frame rate and stutters using a live demo at your current quality. No automatic graphics changes.';start.after(hint);
  const report=document.createElement('dialog');report.id='performanceReport';report.className='astra-tool-dialog';report.innerHTML='<h2>Performance check</h2><div id="performanceResults"></div><p id="performanceAdvice"></p><button id="performanceClose">Close</button><button id="performanceHome">Main menu</button>';document.body.append(report);
  const previous=addButton('performancePrevious','View last performance check',q('panel-settings'));
  const progress=document.createElement('div');progress.id='performanceProgress';progress.hidden=true;progress.setAttribute('role','status');q('stage').append(progress);
  let running=false,requested=false,started=0,first=0,last=0,lastFrame=-1,frames=[],measured=0,warmup=0,hidden=false,lastResult=null;
  try{lastResult=JSON.parse(localStorage.getItem(resultKey));if(!lastResult||!['load','fps','low','p95','seconds','frames','stutters'].every(k=>Number.isFinite(lastResult[k])))lastResult=null;}catch{}previous.disabled=!lastResult;
  const percentile=(a,p)=>a[Math.min(a.length-1,Math.floor((a.length-1)*p))]||0;
  function show(value){
    if(!value)return;lastResult=value;
    const fields=[['Loading',value.load.toFixed(1)+' s'],['Average frame rate',value.fps.toFixed(1)+' FPS'],['Slowest 1% average',value.low.toFixed(1)+' FPS'],['95th-percentile frame',value.p95.toFixed(1)+' ms'],['Frames above 50 ms',value.stutters+' / '+value.frames],['Measured flight',value.seconds.toFixed(1)+' s'],['Resolution',value.resolution],['Moving shadows',value.shadows]];
    q('performanceResults').replaceChildren(...fields.map(([name,data])=>{const row=document.createElement('p');const label=document.createElement('span');label.textContent=name;const output=document.createElement('b');output.textContent=data;row.append(label,output);return row;}));
    q('performanceAdvice').textContent=value.fps>=55&&value.p95<30?'This run was smooth. No graphics change is suggested.':value.fps>=35?'Try Basic moving shadows first, then repeat the check. Your textures can stay at their current quality.':'Try Basic moving shadows, then a lower rendering resolution if needed. Texture detail can stay enabled. This check has not changed any settings.';
    q('performanceHome').hidden=!window.Module?.calledRun;if(!report.open)report.showModal();
  }
  function finish(){
    running=false;progress.hidden=true;if(!frames.length)return;
    const sorted=[...frames].sort((a,b)=>a-b),slow=sorted.slice(-Math.max(1,Math.ceil(sorted.length*.01)));
    const result={time:Date.now(),load:(first-started)/1000,fps:1000*frames.length/measured,low:1000/(slow.reduce((a,b)=>a+b,0)/slow.length),p95:percentile(sorted,.95),stutters:frames.filter(n=>n>50).length,frames:frames.length,seconds:measured/1000,resolution:q('res').selectedOptions[0].textContent,shadows:q('shadowQuality').selectedOptions[0].textContent};
    if(window.Module?.autopilot)pauseDemo(true);try{localStorage.setItem(resultKey,JSON.stringify(result));}catch{}previous.disabled=false;window.astraBench.result=result;show(result);
  }
  function sample(now){
    if(!running)return;
    requestAnimationFrame(sample);
    const m=window.Module,frame=m?.flightState?.frame;
    if(document.hidden||window.astraMenus?.active||document.querySelector('dialog[open]')||m?.autoPaused){last=0;hidden=true;return;}
    if(!frame||frame===lastFrame)return;lastFrame=frame;
    if(!first){first=now;warmup=now;}
    if(hidden){hidden=false;last=0;}
    if(now-warmup<5000){progress.textContent='Performance check · Warming up';last=now;return;}
    if(last){const dt=now-last;if(dt>0){frames.push(dt);measured+=dt;}}
    last=now;progress.textContent=`Performance check · ${Math.min(45,Math.floor(measured/1000))} / 45 s`;
    if(measured>=45000)finish();
  }
  window.astraBench={result:null,get requested(){return requested;},begin(){if(!requested)return;running=true;started=performance.now();first=last=0;lastFrame=-1;frames=[];measured=0;progress.hidden=false;requestAnimationFrame(sample);},finish};
  start.onclick=()=>{if(launchPending)return;requested=true;launch(true,false,false,false,true);};
  previous.onclick=()=>show(lastResult);q('performanceClose').onclick=()=>{report.close();if(window.Module?.autopilot)pauseDemo(false);};q('performanceHome').onclick=()=>astraNavigation.home(false);
  for(const modal of [dialog,report])for(const type of ['keydown','keyup'])modal.addEventListener(type,e=>e.stopPropagation());
})();
