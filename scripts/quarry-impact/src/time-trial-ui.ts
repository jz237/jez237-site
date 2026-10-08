import {CAR_KINDS,DEFINITIONS} from './rules';
import {COURSE_NAMES} from './course-id';
import {formatTrialDelta,formatTrialTime,isTimeTrialConfig,timeTrialBest,type TimeTrialConfig,type TimeTrialRecords,type TimeTrialResult} from './time-trial';

const escape=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const description=(config:TimeTrialConfig)=>`${DEFINITIONS[config.kind].name} · ${COURSE_NAMES[config.course]} · ${config.direction==='reverse'?'Reverse':'Forward'}`;

/** Native controls share the existing event panel and controller navigation. */
export function showTimeTrialSetup(ui:HTMLElement,config:TimeTrialConfig,records:TimeTrialRecords,callbacks:{start:(config:TimeTrialConfig)=>void;close:()=>void},warning='',ghost?:{enabled:boolean;change:(enabled:boolean)=>void;status:(config:TimeTrialConfig)=>string}){
  if(!isTimeTrialConfig(config))throw new Error('Invalid Time Trial selection.');
  ui.innerHTML=`<section id="time-trial-setup" class="event-setup" aria-label="Time Trial setup"><div class="event-panel">
    <div class="eyebrow">BLACKRIDGE MOTOR CLUB / SOLO PRACTICE</div><h1>TIME TRIAL.</h1>
    <p>One lap. Factory stock. Just you and the clock. Your saved garage build and custom event rules stay unchanged.</p>
    <label>Car<select id="time-trial-kind">${CAR_KINDS.map(kind=>`<option value="${kind}">${escape(DEFINITIONS[kind].name)}</option>`).join('')}</select></label>
    <label>Course<select id="time-trial-course">${Object.entries(COURSE_NAMES).map(([id,name])=>`<option value="${id}">${escape(name)}</option>`).join('')}</select></label>
    <label>Direction<select id="time-trial-direction"><option value="forward">Forward</option><option value="reverse">Reverse</option></select></label>
    ${ghost?'<label>Personal-best ghost<select id="time-trial-ghost-enabled"><option value="on">Show ghost</option><option value="off">Ghost off</option></select></label><p id="time-trial-ghost-status" role="status"></p>':''}
    <p>PERSONAL BEST <output id="time-trial-best" aria-live="polite"></output></p>
    <p>Pass every checkpoint in order and finish with your car running. Recovery makes the run practice only. Records are separate for each car, course and direction, and are stored in this browser. Up to 16 recent personal-best ghosts are kept within a bounded local storage allowance. Ghosts never collide.</p>
    <p id="time-trial-notice" role="status">${escape(warning)}</p>
    <div class="event-actions"><button id="time-trial-close">BACK TO QUARRY</button><button id="time-trial-start" class="primary">START TIME TRIAL ↗</button></div>
  </div></section>`;
  const kind=ui.querySelector<HTMLSelectElement>('#time-trial-kind')!,course=ui.querySelector<HTMLSelectElement>('#time-trial-course')!,direction=ui.querySelector<HTMLSelectElement>('#time-trial-direction')!;
  kind.value=config.kind;course.value=config.course;direction.value=config.direction;
  const selection=():TimeTrialConfig|null=>{const value={kind:kind.value,course:course.value,direction:direction.value};return isTimeTrialConfig(value)?value:null;};
  const refresh=()=>{
    const selected=selection();
    if(ghost){ui.querySelector('#time-trial-ghost-status')!.textContent=selected?ghost.status(selected):'';}
    ui.querySelector('#time-trial-best')!.textContent=selected?formatTrialTime(timeTrialBest(records,selected)):'—';
    ui.querySelector<HTMLButtonElement>('#time-trial-start')!.disabled=!selected;
  };
  if(ghost){
    const toggle=ui.querySelector<HTMLSelectElement>('#time-trial-ghost-enabled')!;
    toggle.value=ghost.enabled?'on':'off';toggle.onchange=()=>{ghost.change(toggle.value==='on');refresh();};
  }
  kind.onchange=course.onchange=direction.onchange=refresh;
  ui.querySelector<HTMLButtonElement>('#time-trial-start')!.onclick=()=>{const selected=selection();if(selected)callbacks.start({...selected});};
  ui.querySelector<HTMLButtonElement>('#time-trial-close')!.onclick=callbacks.close;
  refresh();
}

export function showTimeTrialResult(ui:HTMLElement,config:TimeTrialConfig,result:TimeTrialResult,callbacks:{retry:()=>void;setup:()=>void;close:()=>void},notice=''){
  const heading=result.status==='dnf'?'LAP UNFINISHED.':result.newBest?'NEW PERSONAL BEST.':result.eligible?'LAP COMPLETE.':'PRACTICE FINISH.';
  const comparison=result.previousBest!==null&&result.time!==null?`Previous best ${formatTrialTime(result.previousBest)} · ${formatTrialDelta(result.delta)}`:result.newBest?'Your first qualifying lap for this car, course and direction.':result.best!==null?'Existing personal best retained.':'No personal best recorded for this selection.';
  ui.innerHTML=`<section id="time-trial-result" class="event-setup" aria-label="Time Trial result"><div class="event-panel">
    <div class="eyebrow">TIME TRIAL / ONE LAP / FACTORY STOCK</div><h1 id="time-trial-status">${heading}</h1><p>${escape(description(config))}</p>
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
