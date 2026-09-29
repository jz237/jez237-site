/** A conceptual magnified biofilm: attached cells, dissolved nitrogen, two conversions.
 * One finite explanation runs only on request; it sleeps offscreen and honors scene pause.
 */
export function biologyDiagram(host:HTMLElement,onPlay:()=>void){
 const stages=[
  {title:'Waste reaches the living surface.',text:'Fish waste and decaying food release dissolved ammonia into the water. It reaches the microscopic film on the rock.'},
  {title:'Microbes convert ammonia to nitrite.',text:'Ammonia-oxidizing microbes use oxygen to carry out the first change. The microbes stay attached; the dissolved nitrogen compound changes.'},
  {title:'Other microbes produce nitrate.',text:'Nitrite-oxidizing microbes carry out the second change. Nitrate stays in the water and still needs management through uptake and export.'}
 ];
 const surface=(x:number)=>163+8*Math.sin(x*.02)+4*Math.sin(x*.046);
 const edge=Array.from({length:79},(_,i)=>[i*10,surface(i*10)]);
 const rockPath='M'+edge.map(([x,y])=>`${x} ${y}`).join('L')+'V242H0Z';
 const filmPath='M'+edge.map(([x,y])=>`${x} ${y-22}`).join('L')+'L'+[...edge].reverse().map(([x,y])=>`${x} ${y+2}`).join('L')+'Z';
 const cells=Array.from({length:48},(_,i)=>{const x=24+(i*83%734),y=surface(x)-5-(i%2)*7,angle=(i*31%90)-45;return `<g transform="translate(${x} ${y}) rotate(${angle})"><rect x="-7" y="-3.5" width="14" height="7" rx="3.5" fill="url(#bio-cell)" stroke="#c3e1bb" stroke-width=".6"/><path d="M-3 0L3 0" stroke="#1a706d" stroke-width="1.2"/></g>`;}).join('');
 const pores=Array.from({length:26},(_,i)=>{const x=15+(i*131%750),y=surface(x)+14+(i%4)*14,r=3+i%5;return `<ellipse cx="${x}" cy="${y}" rx="${r*1.6}" ry="${r}" fill="#343731" stroke="#927d69" stroke-width="2"/>`;}).join('');
 host.innerHTML=`
 <div class="bio-heading"><div><span class="eyebrow">ON THIS ROCK · UNDER THE MICROSCOPE</span><h3>A living film does the work.</h3></div><span class="bio-scale">Illustrated magnification</span></div>
 <div class="bio-window" aria-label="Magnified microbes attached to a porous rock surface, beneath dissolved ammonia, nitrite and nitrate">
  <div class="bio-compounds" aria-hidden="true">
   <div data-compound="0"><span class="bio-formula">NH₃ / NH₄⁺</span><strong>Ammonia</strong><small>from waste</small></div><span class="bio-arrow">→</span>
   <div data-compound="1"><span class="bio-formula">NO₂⁻</span><strong>Nitrite</strong><small>first change</small></div><span class="bio-arrow">→</span>
   <div data-compound="2"><span class="bio-formula">NO₃⁻</span><strong>Nitrate</strong><small>still in the water</small></div>
  </div>
  <svg class="bio-surface" viewBox="0 0 780 242" role="img" aria-label="An enlarged microbial film attached to rough rock; oxygen supports the two transformations">
   <defs>
    <linearGradient id="bio-rock" x2=".2" y2="1"><stop stop-color="#a9957e"/><stop offset="1" stop-color="#4c4d43"/></linearGradient>
    <linearGradient id="bio-cell" x2="0" y2="1"><stop stop-color="#d6eab3"/><stop offset=".55" stop-color="#79b79c"/><stop offset="1" stop-color="#438d84"/></linearGradient>
    <linearGradient id="bio-film" x2="0" y2="1"><stop stop-color="#b6dbc1" stop-opacity=".02"/><stop offset="1" stop-color="#79bba5" stop-opacity=".35"/></linearGradient>
   </defs>
   <path d="${rockPath}" fill="url(#bio-rock)"/>
   <path d="${filmPath}" fill="url(#bio-film)" stroke="#a1d8bb" stroke-opacity=".3"/>
   ${pores}${cells}
   <g class="bio-zone bio-zone-one"><ellipse cx="262" cy="145" rx="66" ry="31"/></g>
   <g class="bio-zone bio-zone-two"><ellipse cx="517" cy="145" rx="66" ry="31"/></g>
   <g class="bio-oxygen" fill="none" stroke="#8cb3c3" stroke-width="1.4"><path d="M263 69V111m-6-7 6 7 6-7M517 69V111m-6-7 6 7 6-7"/></g>
   <g fill="#c5dce4" font-family="Segoe UI, sans-serif" font-size="17" text-anchor="middle"><text x="262" y="61">O₂</text><text x="517" y="61">O₂</text></g>
   <g id="bio-tracer" transform="translate(115 29)"><circle r="18" fill="#e8c789" stroke="#fff0cf" stroke-width="2"/><text text-anchor="middle" y="6" font-family="Segoe UI,sans-serif" font-weight="700" font-size="17" fill="#26383a">N</text></g>
  </svg>
  <div class="bio-layer-labels"><span><i></i>Attached microbial film</span><span>Porous rock below</span></div>
 </div>
 <div class="bio-step-buttons" role="group" aria-label="Steps of biological filtration">
  <button data-bio-step="0" aria-pressed="true"><b>1</b><span>Waste arrives</span></button>
  <button data-bio-step="1" aria-pressed="false"><b>2</b><span>Ammonia → nitrite</span></button>
  <button data-bio-step="2" aria-pressed="false"><b>3</b><span>Nitrite → nitrate</span></button>
 </div>
 <div class="bio-explanation"><div><h4 id="bio-title"></h4><p id="bio-text"></p></div><button id="bio-play" class="primary">Play explanation ▶</button></div>
 <p class="bio-note"><strong>Same nitrogen, a different compound.</strong> The moving N follows nitrogen through the changes. Cells, colors and timing are illustrative; this is not an atom-by-atom reaction. Both steps need oxygen.</p>`;
 const query=<E extends Element=HTMLElement>(s:string)=>host.querySelector<E>(s)!;
 const tracer=query<SVGGElement>('#bio-tracer'),play=query<HTMLButtonElement>('#bio-play');
 let active=0,elapsed=0,running=false,paused=true,visible=false,enabled=false,shown=true,frame=0,last=0;
 const compounds=Array.from(host.querySelectorAll<HTMLElement>('[data-compound]'));
 function paint(){
  const phase=elapsed/4,stage=Math.min(2,Math.floor(phase));
  if(active!==stage||!query('#bio-title').textContent){active=stage;query('#bio-title').textContent=stages[stage].title;query('#bio-text').textContent=stages[stage].text;host.dataset.step=String(stage);host.querySelectorAll<HTMLButtonElement>('[data-bio-step]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===stage)));}
  const u=phase<1?0:phase<2?Math.min(1,phase-1):Math.min(1,phase-2),ease=u*u*(3-2*u);
  const eased=(t:number)=>t*t*(3-2*t);
  const first=eased(Math.min(1,phase)),x=phase<1?115+147*first:phase<2?262+255*ease:517+148*ease,y=phase<1?29+84*first:phase<2?113:113-84*ease;
  tracer.setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  tracer.setAttribute('opacity',shown?'1':'0');
  compounds.forEach((c,i)=>c.classList.toggle('active',i===stage));
  play.textContent=running&&!paused?'Pause explanation Ⅱ':running?'Resume explanation ▶':elapsed>=12?'Replay explanation ↻':'Play explanation ▶';
  play.setAttribute('aria-pressed',String(running&&!paused));
 }
 function cancel(){cancelAnimationFrame(frame);frame=0;last=0;}
 function tick(now:number){frame=0;if(!running||paused||!visible||!enabled||!shown||document.hidden){last=0;return;}elapsed=Math.min(12,elapsed+(last?Math.min(.05,(now-last)/1000):0));last=now;if(elapsed>=12)running=false;paint();if(running)frame=requestAnimationFrame(tick);}
 function schedule(){cancel();if(running&&!paused&&visible&&enabled&&shown&&!document.hidden)frame=requestAnimationFrame(tick);}
 function select(step:number){running=false;elapsed=step*4+(step?3.999:0);paint();schedule();}
 function start(){elapsed=0;running=true;paused=false;shown=true;onPlay();paint();schedule();}
 play.onclick=()=>{if(running&&!paused){paused=true;}else if(running){paused=false;onPlay();}else{start();return;}paint();schedule();};
 host.querySelectorAll<HTMLButtonElement>('[data-bio-step]').forEach((b,i)=>b.onclick=()=>select(i));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(query('.bio-window'));
 document.addEventListener('visibilitychange',schedule);
 paint();
 return {start,select,reset(){elapsed=0;running=false;paint();schedule();},setEnabled(v:boolean){enabled=v;host.hidden=!v;schedule();},setPaused(v:boolean){paused=v;paint();schedule();},setFlow(v:boolean){shown=v;paint();schedule();},snapshot:()=>({active,elapsed,running,paused,visible,enabled,shown})};
}
