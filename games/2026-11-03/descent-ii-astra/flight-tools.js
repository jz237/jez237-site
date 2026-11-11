/* Optional comfort controls and a measured, non-adaptive performance check. */
(()=>{
  'use strict';const q=id=>document.getElementById(id),key='astra.comfort.v1',resultKey='astra.performance.v1';
  const clamp=(n,d)=>Number.isFinite(+n)?Math.max(0,Math.min(1,+n)):d;
  let stored={};try{stored=JSON.parse(localStorage.getItem(key))||{};}catch{}
  const comfort={glare:clamp(stored.glare,1),shake:clamp(stored.shake,1),smooth:clamp(stored.smooth,0),brightness:clamp(stored.brightness,.4)};
  const dialog=document.createElement('dialog');dialog.id='comfortDialog';dialog.className='astra-tool-dialog';
  dialog.innerHTML='<header><h2>Flight comfort</h2><button id="comfortClose">Close</button></header><p>Applies immediately. Textures and distant explosion detail stay at your selected quality.</p>'+[
    ['brightness','Mine brightness','Raises dark rooms and leaves lamps and blasts as they are. Astra enhanced materials only.'],['glare','Nearby explosion glare','Lower this to see through blasts close to your cockpit.'],['shake','Screen shake','Adjust Earthshaker and reactor tremors affecting your ship. Mine sounds and lighting remain.'],['smooth','Demo camera smoothing','Higher values soften demo turns. Your manual controls stay the same.']
  ].map(([id,title,description])=>`<label><span>${title}<output id="comfort-${id}-value"></output></span><input id="comfort-${id}" type="range" min="0" max="100" step="5"><small>${description}</small></label>`).join('')+'<button id="comfortReset">Restore original intensity</button>';
  document.body.append(dialog);
  function update(){for(const id of ['brightness','glare','shake','smooth']){q('comfort-'+id).value=Math.round(comfort[id]*100);q('comfort-'+id+'-value').textContent=Math.round(comfort[id]*100)+'%';}if(window.Module)Module.comfort={...comfort};try{localStorage.setItem(key,JSON.stringify(comfort));}catch{}}
  for(const id of ['brightness','glare','shake','smooth'])q('comfort-'+id).oninput=e=>{comfort[id]=Number(e.target.value)/100;update();};
  q('comfortClose').onclick=()=>dialog.close();q('comfortReset').onclick=()=>{Object.assign(comfort,{glare:1,shake:1,smooth:0,brightness:.4});update();};
  window.astraTools={get comfort(){return {...comfort};},open(){releaseFlightMouse();window.Module?._astra_reset_flight_input?.();dialog.showModal();}};
  function addButton(id,title,parent){const b=document.createElement('button');b.id=id;b.textContent=title;b.className='secondary-action';parent.append(b);return b;}
  addButton('comfortSetup','Flight comfort',q('panel-settings')).onclick=()=>astraTools.open();
  addButton('nativeComfort','Comfort',q('nativeBack').parentElement).onclick=()=>astraTools.open();update();
  const start=addButton('performanceStart','Run 45-second performance check',q('panel-settings'));start.classList.add('launch');
  const hint=document.createElement('p');hint.className='interaction-note';hint.textContent='Measures loading, the first five seconds and the following forty seconds separately, at your current quality. Pauses and menus are excluded. No automatic graphics changes.';start.after(hint);
  const report=document.createElement('dialog');report.id='performanceReport';report.className='astra-tool-dialog';report.innerHTML='<h2>Performance check</h2><div id="performanceResults"></div><p id="performanceAdvice"></p><button id="performanceClose">Close</button><button id="performanceHome">Main menu</button>';document.body.append(report);
  const previous=addButton('performancePrevious','View last performance check',q('panel-settings'));
  const progress=document.createElement('div');progress.id='performanceProgress';progress.hidden=true;progress.setAttribute('role','status');q('stage').append(progress);
  let running=false,requested=false,measurement=null,lastResult=null;
  try{lastResult=JSON.parse(localStorage.getItem(resultKey));if(!lastResult||!['load','fps','low','p95','seconds','frames','stutters'].every(k=>Number.isFinite(lastResult[k])))lastResult=null;}catch{}previous.disabled=!lastResult;
  function show(value){
    if(!value)return;lastResult=value;
    const results=q('performanceResults');results.replaceChildren();
    function row(name,data){const r=document.createElement('p'),label=document.createElement('span'),output=document.createElement('b');label.textContent=name;output.textContent=data;r.append(label,output);results.append(r);}
    function section(title,data){const heading=document.createElement('h3');heading.textContent=title;results.append(heading);row('Average / slowest 1%',`${data.fps.toFixed(1)} / ${data.low.toFixed(1)} FPS`);row('Longest pause',data.worst.toFixed(1)+' ms');row('Frames above 50 ms',`${data.stutters} / ${data.frames}`);row('Measured flight',data.seconds.toFixed(1)+' s');}
    row('Loading before first frame',value.load.toFixed(1)+' s');
    if(value.version>=2&&value.opening&&value.sustained){section('Opening flight · first 5 seconds',value.opening);section('Sustained flight · remaining 40 seconds',value.sustained);}
    else {row('Average frame rate',value.fps.toFixed(1)+' FPS');row('Slowest 1% average',value.low.toFixed(1)+' FPS');row('Frames above 50 ms',`${value.stutters} / ${value.frames}`);row('Older test', 'Opening five seconds were excluded');}
    row('Resolution',value.resolution);row('Moving shadows',value.shadows);
    const opening=value.opening?.worst>100,steady=value.sustained||value;
    q('performanceAdvice').textContent=opening&&steady.fps>=55?'The opening still has a noticeable pause. Later flight is faster; these results keep the two separate. No graphics settings were changed.':steady.fps>=55&&steady.p95<30&&!(steady.worst>100)?'This run was smooth. No graphics change is suggested.':'This run still has slow frames. Compare the opening and sustained results on this computer. No graphics settings were changed.';
    q('performanceHome').hidden=!window.Module?.calledRun;if(!report.open)report.showModal();
  }
  function finish(){
    running=false;progress.hidden=true;if(!measurement)return;
    const result={time:Date.now(),...measurement.result(),resolution:q('res').selectedOptions[0].textContent,shadows:q('shadowQuality').selectedOptions[0].textContent};if(!result.frames)return;
    if(window.Module?.autopilot)pauseDemo(true);try{localStorage.setItem(resultKey,JSON.stringify(result));}catch{}previous.disabled=false;window.astraBench.result=result;show(result);
  }
  function sample(now){
    if(!running)return;
    const m=window.Module,paused=document.hidden||window.astraMenus?.active||document.querySelector('dialog[open]')||m?.autoPaused||m?.graphicsLoading;
    if(measurement.sample(now,m?.renderFrames,paused)){finish();return;}
    progress.textContent=measurement.first===null?'Performance check · Measuring loading':`Performance check · ${measurement.elapsed<5000?'Opening':'Sustained'} flight · ${Math.min(45,Math.floor(measurement.elapsed/1000))} / 45 s`;
    requestAnimationFrame(sample);
  }
  window.astraBench={result:null,get requested(){return requested;},begin(){if(!requested)return;running=true;measurement=new astraPerformance.FlightMeasurement(performance.now());progress.hidden=false;requestAnimationFrame(sample);},firstFrame(now){if(running)measurement.firstFrame(now);},finish};
  start.onclick=()=>{if(launchPending)return;requested=true;launch(true,false,false,false,true);};
  previous.onclick=()=>show(lastResult);q('performanceClose').onclick=()=>{report.close();if(window.Module?.autopilot)pauseDemo(false);};q('performanceHome').onclick=()=>astraNavigation.home(false);
  for(const modal of [dialog,report])for(const type of ['keydown','keyup'])modal.addEventListener(type,e=>e.stopPropagation());
})();
