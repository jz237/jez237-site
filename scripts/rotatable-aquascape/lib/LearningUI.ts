import type {Aquarium} from './Aquarium';
import {lessonNames,lessons,sources,type Lesson} from './LearningContent';
import {defaults} from '../../living-aquascape/lib/aquarium/Ecosystem.ts';
import type {Experiment} from './LearningModel';
const labels:Record<Experiment,string>={balanced:'Balanced aquarium',flow:'Restrict filter flow',carbon:'Turn off CO₂',food:'Overfeed once'};
export function installLearning(aquarium:Aquarium){
 const main=document.querySelector('main')!,open=document.querySelector<HTMLButtonElement>('#learn')!;
 const panel=document.createElement('aside');panel.id='learning';panel.hidden=true;panel.setAttribute('aria-label','Aquarium learning guide');main.append(panel);
 let readingsKey='';
 let mode:Lesson='water',step=0,tour=false,nextAt=0,chart:'oxygen'|'ammonia'='oxygen';
 const select=(m:Lesson,n=0)=>{mode=m;step=n;if(m==='layers')aquarium.teaching!.separation=1;if(m==='day')aquarium.teaching!.night=n===1;aquarium.learn(m,n);document.querySelector<HTMLButtonElement>('#light')!.disabled=m==='day'||m==='experiments';render();};
 const close=()=>{tour=false;panel.hidden=true;main.classList.remove('learning-open');open.setAttribute('aria-expanded','false');aquarium.learn(null);document.querySelector<HTMLButtonElement>('#light')!.disabled=false;open.focus();};
 const reveal=()=>{panel.hidden=false;main.classList.add('learning-open');open.setAttribute('aria-expanded','true');select(mode,step);};
 open.onclick=()=>panel.hidden?reveal():close();open.disabled=false;
 aquarium.teaching!.onSelect=i=>select(mode,i);aquarium.teaching!.onInspect=i=>select('organisms',i);
 const render=()=>{
  readingsKey='';
  const entry=lessons[mode][step],model=aquarium.learning;
  panel.innerHTML=`<div class="learning-top"><span class="eyebrow">HOW THIS WORLD WORKS</span><button id="learn-close" aria-label="Close learning mode">×</button></div>
   <nav class="lesson-tabs" aria-label="Choose a lesson">${Object.entries(lessonNames).map(([id,title])=>`<button data-lesson="${id}" aria-pressed="${id===mode}">${title}</button>`).join('')}</nav>
   <div class="learn-scene-tools"><button id="study-front">Front</button><button id="study-angle">Three-quarter</button><button id="study-pause">${aquarium.paused?'Resume motion':'Pause motion'}</button></div>
   <div class="lesson-body"><div class="lesson-position">${lessonNames[mode]} <span>${step+1} / ${lessons[mode].length}</span></div>
   <h2>${entry.title}</h2><p>${entry.text}</p>
   ${lessons[mode].length>1?`<ol class="lesson-steps" aria-label="Lesson steps">${lessons[mode].map((s,i)=>`<li><button data-step="${i}" aria-label="${i+1}. ${s.title}" ${i===step?'aria-current="step"':''}>${i+1}<span>${s.title}</span></button></li>`).join('')}</ol>`:''}
   ${mode==='water'?'<div class="teaching-key"><i></i>Blue beads · direction of water travel</div><p class="fine">Filter cutaway is enlarged for teaching. Drag the model to inspect it.</p>':''}
   ${mode==='layers'?`<label class="learn-range">Layer separation <output id="separation-value">${Math.round(aquarium.teaching!.separation*100)}%</output><input id="separation" type="range" min="0" max="100" value="${aquarium.teaching!.separation*100}"/></label><button id="assemble" class="learn-action">Reassemble tank</button><div class="learn-pair"><button id="leaf-closeup">Inspect a leaf</button><button id="root-closeup">Inspect roots</button></div><p class="fine">Expanded view shows representative roots between the lifted planting and the actual substrate.</p>`:''}
   ${mode==='nitrogen'?'<button id="trace-feed" class="learn-action">Feed fish & restart the journey</button><p class="fine">Tracer speed is illustrative. Chemical changes take hours and days; explore their timing in What happens if…</p>':''}
   ${mode==='day'?`<div class="learn-pair"><button id="learn-day" aria-pressed="${!aquarium.teaching!.night}">Daylight</button><button id="learn-night" aria-pressed="${aquarium.teaching!.night}">Night</button></div><div class="gas-key"><span>Blue · oxygen</span><span>Gold · ${aquarium.teaching!.night?'carbon dioxide':'light energy'}</span></div>`:''}
   ${mode==='experiments'?`<label class="learn-field">Experiment<select id="experiment">${Object.entries(labels).map(([id,title])=>`<option value="${id}" ${model.experiment===id?'selected':''}>${title}</option>`).join('')}</select></label>
    <label class="learn-range">Filter flow <output id="flow-value">${model.environment.flow}%</output><input id="learn-flow" type="range" min="0" max="100" value="${model.environment.flow}"></label>
    <label class="learn-range">CO₂ supply setting <output id="carbon-value">${model.environment.co2}</output><input id="learn-carbon" type="range" min="0" max="45" value="${model.environment.co2}"></label>
    <label class="learn-field">Simulated time per second<select id="lab-speed"><option value=".25">15 minutes</option><option value="1" ${model.hoursPerSecond===1?'selected':''}>1 hour</option><option value="4" ${model.hoursPerSecond===4?'selected':''}>4 hours</option></select></label>
    <div class="learn-pair"><button id="lab-play">${model.running?'Pause experiment':'Run experiment'}</button><button id="lab-step">+6 hours</button></div>
    <div id="lab-readings" role="group" aria-label="Simulated readings"></div>
    <label class="learn-field">Chart<select id="lab-chart"><option value="oxygen" ${chart==='oxygen'?'selected':''}>Dissolved oxygen · mg/L</option><option value="ammonia" ${chart==='ammonia'?'selected':''}>Ammonia pool · mg N/L</option></select></label><div id="lab-plot"></div>
    <div class="learn-pair"><button id="restore-conditions">Restore flow & CO₂</button><button id="lab-reset">Reset comparison</button></div><p class="fine">Solid green: changed tank. Dashed gray: balanced control. Both start at noon and share the same light cycle. Nitrogen values are mg N/L, not a toxicity assessment.</p>`:''}
   <details><summary>Look deeper</summary><p>${entry.detail}</p></details>
   ${lessons[mode].length>1?`<div class="lesson-navigation"><button id="learn-prev" ${step===0?'disabled':''}>← Back</button><button id="tour-play" aria-pressed="${tour}">${tour?'Pause tour':'Play tour'}</button><button id="learn-next" ${step===lessons[mode].length-1?'disabled':''}>Next →</button></div>`:''}
   <p class="learning-limit">Illustrative teaching models · not live water measurements</p><details><summary>Sources & model notes</summary><p>Animated routes, roots and anatomical highlights explain processes. The 180 L experiment model uses small integration steps and simplified rates; it is not calibrated to this aquarium.</p>${sources.map(([title,url])=>`<a href="${url}" target="_blank" rel="noopener">${title} ↗</a>`).join('')}</details></div>`;
  const bind=(id:string,fn:()=>void)=>{const e=panel.querySelector<HTMLButtonElement>('#'+id);if(e)e.onclick=fn;};
  bind('learn-close',close);bind('study-front',()=>aquarium.view('front'));bind('study-angle',()=>aquarium.view('angle'));bind('study-pause',()=>{document.querySelector<HTMLButtonElement>('#pause')!.click();render();});panel.querySelectorAll<HTMLButtonElement>('[data-lesson]').forEach(b=>b.onclick=()=>{tour=false;select(b.dataset.lesson as Lesson);});
  panel.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(b=>b.onclick=()=>select(mode,Number(b.dataset.step)));
  bind('learn-prev',()=>select(mode,step-1));bind('learn-next',()=>select(mode,step+1));
  bind('tour-play',()=>{tour=!tour;nextAt=performance.now()+9000;render();});
  bind('leaf-closeup',()=>select('organisms',1));bind('root-closeup',()=>select('organisms',2));
  bind('assemble',()=>{aquarium.teaching!.separation=0;render();});
  const slider=panel.querySelector<HTMLInputElement>('#separation');if(slider)slider.oninput=()=>{aquarium.teaching!.separation=+slider.value/100;panel.querySelector('#separation-value')!.textContent=slider.value+'%';};
  bind('trace-feed',()=>{aquarium.feed();select('nitrogen',0);});bind('learn-day',()=>select('day',0));bind('learn-night',()=>select('day',1));
  const experiment=panel.querySelector<HTMLSelectElement>('#experiment');if(experiment)experiment.onchange=()=>{model.reset(experiment.value as Experiment);if(model.experiment==='food')aquarium.feed();render();};
  const flow=panel.querySelector<HTMLInputElement>('#learn-flow');if(flow)flow.oninput=()=>{model.environment.flow=+flow.value;panel.querySelector('#flow-value')!.textContent=flow.value+'%';};
  const carbon=panel.querySelector<HTMLInputElement>('#learn-carbon');if(carbon)carbon.oninput=()=>{model.environment.co2=+carbon.value;panel.querySelector('#carbon-value')!.textContent=carbon.value;};
  const speed=panel.querySelector<HTMLSelectElement>('#lab-speed');if(speed)speed.onchange=()=>{model.hoursPerSecond=+speed.value;};
  const graph=panel.querySelector<HTMLSelectElement>('#lab-chart');if(graph)graph.onchange=()=>{chart=graph.value as typeof chart;updateReadings();};
  bind('lab-play',()=>{model.running=!model.running;render();});bind('lab-step',()=>{model.step(6);updateReadings();});
  bind('restore-conditions',()=>{model.environment.flow=defaults().flow;model.environment.co2=defaults().co2;render();});bind('lab-reset',()=>{model.reset(model.experiment);render();});
  updateReadings();
 };
 function updateReadings(){
  const readings=panel.querySelector('#lab-readings');if(!readings)return;
  const m=aquarium.learning,s=m.state,b=m.baseline;
  const key=JSON.stringify([chart,aquarium.paused,m.light,s,b,m.history.length,m.history.at(-1)]);
  if(key===readingsKey)return;readingsKey=key;
  readings.innerHTML=`<div class="lab-clock">${s.hours.toFixed(1)} simulated hours · ${m.light>.1?'Lights on':'Night'}${aquarium.paused?' · Aquarium paused':''}</div><table><thead><tr><th>Reading</th><th>Changed</th><th>Control</th></tr></thead><tbody>${[['O₂ · mg/L',s.oxygen,b.oxygen],['CO₂ · mg/L',s.co2,b.co2],['Ammonia · mg N/L',s.ammonia,b.ammonia],['Nitrite · mg N/L',s.nitrite,b.nitrite],['Nitrate · mg N/L',s.nitrate,b.nitrate]].map(([label,a,c])=>`<tr><th>${label}</th><td>${Number(a).toFixed(Number(a)<1?3:2)}</td><td>${Number(c).toFixed(Number(c)<1?3:2)}</td></tr>`).join('')}</tbody></table>`;
  const samples=m.history,values=samples.flatMap(v=>chart==='oxygen'?[v.oxygen,v.baselineOxygen]:[v.ammonia,v.baselineAmmonia]),max=Math.max(chart==='oxygen'?10:.1,...values)*1.08;
  const first=samples[0]?.hour??0,last=Math.max(first+1,samples.at(-1)?.hour??1);
  const path=(control:boolean)=>samples.map((v,i)=>{const n=chart==='oxygen'?(control?v.baselineOxygen:v.oxygen):(control?v.baselineAmmonia:v.ammonia);return `${i?'L':'M'}${(30+(v.hour-first)/(last-first)*275).toFixed(1)},${(120-n/max*100).toFixed(1)}`;}).join(' ');
  panel.querySelector('#lab-plot')!.innerHTML=`<svg viewBox="0 0 325 150" role="img" aria-label="${chart} comparison from ${first.toFixed(1)} to ${last.toFixed(1)} simulated hours"><path d="M30 15V120H310" stroke="#688079" fill="none"/><text x="1" y="20">${max.toFixed(chart==='oxygen'?0:2)}</text><text x="12" y="123">0</text><text x="30" y="142">${first.toFixed(0)} h</text><text x="275" y="142">${last.toFixed(0)} h</text><path d="${path(true)}" stroke="#a1acae" stroke-dasharray="4 4" fill="none" stroke-width="2"/><path d="${path(false)}" stroke="#bbdda3" fill="none" stroke-width="2"/></svg>`;
 }
 setInterval(()=>{if(panel.hidden)return;updateReadings();if(tour&&!aquarium.paused&&performance.now()>nextAt){if(step<lessons[mode].length-1){nextAt=performance.now()+9000;select(mode,step+1);}else{tour=false;render();}}},500);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close();});
}
