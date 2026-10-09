import {exportSetup,stockSetup,type Setup} from './garage';
import type {CarKind} from './rules';
import {importTrialGhost,MAX_SHARED_GHOST_BYTES,type SharedGhost} from './trial-ghost';
import {CAR_KINDS,DEFINITIONS} from './rules';
import {COURSE_NAMES} from './course-id';
import {classTimeTrial,timeTrialLeaderboard,timeTrialBuildLabel,formatTrialDelta,formatTrialTime,isTimeTrialConfig,timeTrialBest,type TimeTrialConfig,type TimeTrialRecords,type TimeTrialResult} from './time-trial';

const escape=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const description=(config:TimeTrialConfig)=>`${DEFINITIONS[config.kind].name} · ${COURSE_NAMES[config.course]} · ${config.direction==='reverse'?'Reverse':'Forward'} · ${timeTrialBuildLabel(config)}`;

/** Native controls share the existing event panel and controller navigation. */
export function showTimeTrialSetup(ui:HTMLElement,config:TimeTrialConfig,records:TimeTrialRecords,callbacks:{start:(config:TimeTrialConfig)=>void;close:()=>void;setup?:(kind:CarKind)=>Setup},warning='',ghost?:{enabled:boolean;change:(enabled:boolean)=>void;status:(config:TimeTrialConfig)=>string;exchange?:{source:()=>string;choose:(source:string)=>void;rival:(config:TimeTrialConfig)=>SharedGhost|null;available:(config:TimeTrialConfig)=>boolean;export:(config:TimeTrialConfig,name:string)=>Promise<string>;use:(rival:SharedGhost)=>string;remove:(config:TimeTrialConfig)=>string}}){
  if(!isTimeTrialConfig(config))throw new Error('Invalid Time Trial selection.');
  ui.innerHTML=`<section id="time-trial-setup" class="event-setup" aria-label="Time Trial setup"><div class="event-panel">
    <div class="eyebrow">BLACKRIDGE MOTOR CLUB / SOLO PRACTICE</div><h1>TIME TRIAL.</h1>
    <p>One lap. Choose a factory-stock comparison or race your saved garage build in its performance class. Class attempts lock your build until you change trials.</p>
    <label>Build category<select id="time-trial-build"><option value="stock">Factory stock · per-car records</option><option value="class">My garage build · class records</option></select></label><p id="time-trial-build-status" role="status"></p>
    <label>Car<select id="time-trial-kind">${CAR_KINDS.map(kind=>`<option value="${kind}">${escape(DEFINITIONS[kind].name)}</option>`).join('')}</select></label>
    <label>Course<select id="time-trial-course">${Object.entries(COURSE_NAMES).map(([id,name])=>`<option value="${id}">${escape(name)}</option>`).join('')}</select></label>
    <label>Direction<select id="time-trial-direction"><option value="forward">Forward</option><option value="reverse">Reverse</option></select></label>
    ${ghost?'<label>Ghost visibility<select id="time-trial-ghost-enabled"><option value="on">Show ghost</option><option value="off">Ghost off</option></select></label><p id="time-trial-ghost-status" role="status"></p>':''}
    ${ghost?.exchange?`<section aria-label="Share a ghost"><h2>RACE A SHARED LAP</h2>
      <label>Ghost opponent<select id="trial-ghost-source"><option value="personal">My personal best</option><option value="shared">Shared rival</option></select></label>
      <p id="trial-shared-status"></p><button id="trial-shared-remove">REMOVE SHARED RIVAL</button>
      <label>Your name on exported laps<input id="trial-ghost-name" maxlength="32" value="Guest driver"></label>
      <button id="trial-ghost-export">EXPORT MY PERSONAL-BEST GHOST</button>
      <label>Import a shared lap (.qig)<input id="trial-ghost-file" type="file" accept=".qig,application/json"></label>
      <p id="trial-ghost-preview" role="status"></p><button id="trial-ghost-use" disabled>USE GHOST & SELECT EVENT</button>
      <p>Shared laps are unverified practice opponents. They never replace personal bests or award progress. Up to eight recent shared rivals are saved, one per car/course/direction/build category, within the ghost storage limit. Importing the same category replaces its shared rival.</p>
      <p id="trial-ghost-exchange-notice" role="status"></p></section>`:''}
    <p>PERSONAL BEST <output id="time-trial-best" aria-live="polite"></output></p>
    <p>Pass every checkpoint in order and finish with your car running. Recovery makes the run practice only. Records are separate for each car, course, direction and build category, and are stored in this browser. Up to 16 recent personal-best ghosts are kept within a bounded local storage allowance. Ghosts never collide.</p>
    <section id="time-trial-class-board" aria-label="Local class records"></section>
    <p id="time-trial-notice" role="status">${escape(warning)}</p>
    <div class="event-actions"><button id="time-trial-close">BACK TO QUARRY</button><button id="time-trial-start" class="primary">START TIME TRIAL ↗</button></div>
  </div></section>`;
  const build=ui.querySelector<HTMLSelectElement>('#time-trial-build')!,kind=ui.querySelector<HTMLSelectElement>('#time-trial-kind')!,course=ui.querySelector<HTMLSelectElement>('#time-trial-course')!,direction=ui.querySelector<HTMLSelectElement>('#time-trial-direction')!;
  build.value=config.performanceClass?'class':'stock';kind.value=config.kind;course.value=config.course;direction.value=config.direction;
  const selection=():TimeTrialConfig|null=>{const value={kind:kind.value,course:course.value,direction:direction.value};return isTimeTrialConfig(value)?build.value==='class'?classTimeTrial(value,callbacks.setup?.(value.kind)??(config.kind===value.kind?config.setup:undefined)??stockSetup(value.kind)):value:null;};
  const refresh=()=>{
    const selected=selection();
    ui.querySelector('#time-trial-build-status')!.textContent=selected?timeTrialBuildLabel(selected)+(selected.performanceClass?' · Change upgrades and tuning in Garage before entering.':' · Garage upgrades do not apply.'):'';
    const board=ui.querySelector('#time-trial-class-board')!;
    const rows=selected?timeTrialLeaderboard(records,selected):[];
    board.innerHTML=selected?.performanceClass?`<h2>YOUR LOCAL CLASS ${selected.performanceClass} BOARD</h2><p>Best qualifying lap per car for this course and direction. These are your browser-local results; shared ghosts cannot add scores.</p>${rows.length?rows.map((r,i)=>`<p>${i+1}. ${escape(DEFINITIONS[r.kind].name)} · ${r.points} PP · ${formatTrialTime(r.time)} <button data-trial-tune="${i}">EXPORT RECORDED SETUP</button></p>`).join(''):'<p>No class laps recorded yet.</p>'}`:'';
    board.querySelectorAll<HTMLButtonElement>('[data-trial-tune]').forEach(button=>{button.onclick=()=>{const row=rows[Number(button.dataset.trialTune)];if(!row)return;const url=URL.createObjectURL(new Blob([exportSetup(row.kind,row.setup)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`quarry-${row.kind}-class-${selected!.performanceClass}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};});
    if(ghost){ui.querySelector('#time-trial-ghost-status')!.textContent=selected?ghost.status(selected):'';}
    ui.querySelector('#time-trial-best')!.textContent=selected?formatTrialTime(timeTrialBest(records,selected)):'—';
    ui.querySelector<HTMLButtonElement>('#time-trial-start')!.disabled=!selected;
    const exchange=ghost?.exchange;
    if(exchange){
      const rival=selected?exchange.rival(selected):null;
      ui.querySelector('#trial-shared-status')!.textContent=rival?`${rival.name} · ${formatTrialTime(rival.ghost.time)}`:'No shared rival for this selection.';
      ui.querySelector<HTMLButtonElement>('#trial-shared-remove')!.disabled=!rival;
      ui.querySelector<HTMLButtonElement>('#trial-ghost-export')!.disabled=!selected||!exchange.available(selected);
      ui.querySelector<HTMLSelectElement>('#trial-ghost-source')!.value=exchange.source();
    }
  };
  if(ghost){
    const toggle=ui.querySelector<HTMLSelectElement>('#time-trial-ghost-enabled')!;
    toggle.value=ghost.enabled?'on':'off';toggle.onchange=()=>{ghost.change(toggle.value==='on');refresh();};
  }
  const exchange=ghost?.exchange;
  if(exchange){
    const panel=ui.querySelector('#time-trial-setup')!,notice=ui.querySelector('#trial-ghost-exchange-notice')!;
    const picker=ui.querySelector<HTMLInputElement>('#trial-ghost-file')!,preview=ui.querySelector('#trial-ghost-preview')!,use=ui.querySelector<HTMLButtonElement>('#trial-ghost-use')!;
    let pending:SharedGhost|null=null,request=0;
    const current=()=>ui.querySelector('#time-trial-setup')===panel;
    const error=(e:unknown)=>e instanceof Error?e.message:'The ghost could not be loaded.';
    picker.onchange=async()=>{
      const id=++request,file=picker.files?.[0];pending=null;use.disabled=true;preview.textContent='';notice.textContent='';
      if(!file)return;
      try{
        if(file.size>MAX_SHARED_GHOST_BYTES)throw Error('Choose a ghost file smaller than 650 KB.');
        const rival=await importTrialGhost(await file.text());if(!current()||id!==request)return;
        pending=rival;preview.textContent=`${rival.name} · ${description(rival.ghost.config)} · ${formatTrialTime(rival.ghost.time)}. Ready to use as your shared rival.`;use.disabled=false;
      }catch(e){if(current()&&id===request)notice.textContent=error(e);}
    };
    use.onclick=()=>{
      if(!pending)return;
      try{
        notice.textContent=exchange.use(pending);const c=pending.ghost.config;
        build.value=c.performanceClass?'class':'stock';kind.value=c.kind;course.value=c.course;direction.value=c.direction;
        ui.querySelector<HTMLSelectElement>('#time-trial-ghost-enabled')!.value='on';
        pending=null;use.disabled=true;picker.value='';preview.textContent='';refresh();
        const selected=selection();if(c.performanceClass&&selected?.performanceClass!==c.performanceClass)notice.textContent+=` The rival is Class ${c.performanceClass}; your garage build is Class ${selected?.performanceClass??'unknown'}. Match that class in Garage to race this ghost.`;
      }catch(e){notice.textContent=error(e);}
    };
    ui.querySelector<HTMLSelectElement>('#trial-ghost-source')!.onchange=()=>{exchange.choose(ui.querySelector<HTMLSelectElement>('#trial-ghost-source')!.value);refresh();};
    ui.querySelector<HTMLButtonElement>('#trial-shared-remove')!.onclick=()=>{const c=selection();if(c){notice.textContent=exchange.remove(c);refresh();}};
    const exportButton=ui.querySelector<HTMLButtonElement>('#trial-ghost-export')!;
    exportButton.onclick=async()=>{
      const c=selection();if(!c)return;exportButton.disabled=true;
      try{
        const text=await exchange.export(c,ui.querySelector<HTMLInputElement>('#trial-ghost-name')!.value);if(!current())return;
        const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');
        a.href=url;a.download=`quarry-${c.course}-${c.kind}-${c.direction}${c.performanceClass?'-class-'+c.performanceClass:''}.qig`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        notice.textContent='Ghost export prepared. Share the .qig file with another driver.';
      }catch(e){if(current())notice.textContent=error(e);}finally{if(current())refresh();}
    };
  }
  build.onchange=kind.onchange=course.onchange=direction.onchange=refresh;
  ui.querySelector<HTMLButtonElement>('#time-trial-start')!.onclick=()=>{const selected=selection();if(selected)callbacks.start({...selected});};
  ui.querySelector<HTMLButtonElement>('#time-trial-close')!.onclick=callbacks.close;
  refresh();
}

export function showTimeTrialResult(ui:HTMLElement,config:TimeTrialConfig,result:TimeTrialResult,callbacks:{retry:()=>void;setup:()=>void;close:()=>void},notice=''){
  const heading=result.status==='dnf'?'LAP UNFINISHED.':result.newBest?'NEW PERSONAL BEST.':result.eligible?'LAP COMPLETE.':'PRACTICE FINISH.';
  const comparison=result.previousBest!==null&&result.time!==null?`Previous best ${formatTrialTime(result.previousBest)} · ${formatTrialDelta(result.delta)}`:result.newBest?'Your first qualifying lap for this car, course, direction and build category.':result.best!==null?'Existing personal best retained.':'No personal best recorded for this selection.';
  ui.innerHTML=`<section id="time-trial-result" class="event-setup" aria-label="Time Trial result"><div class="event-panel">
    <div class="eyebrow">TIME TRIAL / ONE LAP / ${escape(timeTrialBuildLabel(config).toUpperCase())}</div><h1 id="time-trial-status">${heading}</h1><p>${escape(description(config))}</p>
    <p>YOUR TIME <output id="time-trial-time">${formatTrialTime(result.time)}</output></p>
    <p>PERSONAL BEST <output id="time-trial-best">${formatTrialTime(result.best)}</output></p>
    <p id="time-trial-comparison">${escape(comparison)}</p>
    <p id="time-trial-reason">${escape(result.reason||'Ordered lap completed without recovery.')}</p>
    <p id="time-trial-notice" role="status">${escape(notice)}</p>
    <div class="event-actions"><button id="back">BACK TO QUARRY</button><button id="time-trial-setup-back">CHANGE TRIAL</button><button id="again" class="primary">RETRY ↗</button></div>
  </div></section>`;
  ui.querySelector<HTMLButtonElement>('#again')!.onclick=callbacks.retry;
  ui.querySelector<HTMLButtonElement>('#time-trial-setup-back')!.onclick=callbacks.setup;
  ui.querySelector<HTMLButtonElement>('#back')!.onclick=callbacks.close;
}
