import {processScenes,processDefs,type ProcessSystem} from './ProcessScenes.ts';
import type {System} from './content.ts';
/** Finite, user-requested process stories. No additional renderer or continuous background loop. */
export function processDiagram(host:HTMLElement,onPlay:()=>void,onInspect:(id:string)=>void){
 let system:ProcessSystem='system',elapsed=0,active=-1,running=false,paused=true,visible=false,enabled=true,frame=0,last=0;
 const query=<E extends Element=HTMLElement>(s:string)=>host.querySelector<E>(s)!;
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});
 function paint(){
  const d=processScenes[system],phase=elapsed/4,step=Math.min(3,Math.floor(phase)),u=elapsed===16?1:phase-step;
  if(active!==step){active=step;query('#process-title').textContent=d.steps[step].title;query('#process-text').textContent=d.steps[step].text;host.dataset.step=String(step);host.querySelectorAll('[data-process-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===step)));host.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('active',Number((b as SVGElement).dataset.zone)===step));host.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',Number((b as SVGElement).dataset.route)===step));}
  d.paint(host,step,u);
  const play=query<HTMLButtonElement>('#process-play');play.textContent=running&&!paused?'Pause explanation Ⅱ':running?'Resume explanation ▶':elapsed>=16?'Replay explanation ↻':'Play explanation ▶';play.setAttribute('aria-pressed',String(running&&!paused));
 }
 function cancel(){cancelAnimationFrame(frame);frame=0;last=0;}
 function tick(now:number){frame=0;if(!running||paused||!visible||!enabled||document.hidden){last=0;return;}elapsed=Math.min(16,elapsed+(last?Math.min(.05,(now-last)/1000):0));last=now;if(elapsed>=16)running=false;paint();if(running)frame=requestAnimationFrame(tick);}
 function schedule(){cancel();if(running&&!paused&&visible&&enabled&&!document.hidden)frame=requestAnimationFrame(tick);}
 function start(){elapsed=0;running=true;paused=false;onPlay();paint();schedule();}
 function select(i:number){running=false;elapsed=i*4+3.999;paint();schedule();}
 function reset(){elapsed=0;running=false;active=-1;paint();schedule();}
 function setSystem(next:System){cancel();running=false;enabled=next!=='biology';host.hidden=!enabled;if(!enabled){observer.disconnect();return;}system=next as ProcessSystem;const d=processScenes[system];host.dataset.process=system;
  host.innerHTML=`<div class="bio-heading"><div><span class="eyebrow">${d.kicker}</span><h3>${d.heading}</h3></div><span class="bio-scale">Animated cutaway</span></div>
  <div class="process-window"><svg viewBox="0 0 480 340" role="img" aria-label="${d.alt}">${processDefs}${d.art}<g id="p-tracer"><circle r="7"/><circle r="2" fill="#efffff" stroke="none"/></g></svg></div>
  <ul class="process-key">${d.key.map((s,i)=>`<li><i class="process-symbol process-symbol-${i}"></i>${s}</li>`).join('')}</ul>
  <div class="bio-step-buttons process-steps" role="group" aria-label="Steps of ${system==='system'?'the filtration circuit':system+' operation'}">${d.steps.map((s,i)=>`<button data-process-step="${i}" aria-pressed="false"><b>${i+1}</b><span>${s.label}</span></button>`).join('')}</div>
  <div class="bio-explanation process-explanation"><div><h4 id="process-title"></h4><p id="process-text"></p></div><div class="process-actions"><button id="process-play" class="primary">Play explanation ▶</button><button id="process-part">Find this part in 3D ↑</button></div></div>
  <p class="bio-note">${d.note}</p>`;
  query<HTMLButtonElement>('#process-play').onclick=()=>{if(running&&!paused)paused=true;else if(running){paused=false;onPlay();}else{start();return;}paint();schedule();};
  host.querySelectorAll<HTMLButtonElement>('[data-process-step]').forEach((b,i)=>b.onclick=()=>select(i));
  query<HTMLButtonElement>('#process-part').onclick=()=>{running=false;paint();schedule();onInspect(d.steps[active].part);};
  observer.disconnect();observer.observe(query('.process-window'));reset();
 }
 document.addEventListener('visibilitychange',schedule);
 setSystem('system');
 return {setSystem,start,select,reset,setPaused(v:boolean){paused=v;if(enabled)paint();schedule();},snapshot:()=>({system,elapsed,active,running,paused,visible,enabled})};
}
