type Load='open'|'height'|'restriction';
const loads:Record<Load,{label:string;static:number;loss:number;title:string;text:string}>={
 open:{label:'Short, open return',static:.12,loss:.35,title:'A short, open route delivers more flow.',text:'The rising curve is what the plumbing asks of the pump. With little vertical lift and a relatively open path, it meets the same pump curve farther to the right: more delivered water.'},
 height:{label:'Taller return',static:.45,loss:.35,title:'Vertical lift moves the operating point.',text:'Raising the display above the sump adds static head. The plumbing curve starts higher, so its intersection with the unchanged pump curve moves left. Delivered flow falls even though the pump setting stays the same.'},
 restriction:{label:'Taller + restrictive pipework',static:.45,loss:.95,title:'Friction adds to the lift.',text:'Narrow passages, fittings, valves and pipe friction add losses that grow with flow. The steeper plumbing curve moves the operating point farther left. Read an actual pump curve at the installation’s total head, rather than using its zero-head flow label.'}
};

/** Qualitative teaching curves. Values are unitless, illustrative and never offered as a sizing calculation. */
export function pumpLearning(host:HTMLElement){
 host.innerHTML=`<div class="bio-heading"><div><p class="eyebrow">RETURN PUMP / BEYOND THE HOUSING</p><h3>Why the rating is not your return flow.</h3></div></div>
 <p class="pump-intro">The pump adds energy. The height and plumbing decide how much water it can deliver. Compare three routes at the same pump setting.</p>
 <div class="pump-loads" role="group" aria-label="Compare return plumbing"><button data-pump-load="open" aria-pressed="true">Short, open return</button><button data-pump-load="height" aria-pressed="false">Taller return</button><button data-pump-load="restriction" aria-pressed="false">Taller + restrictive pipework</button></div>
 <svg class="pump-curve" viewBox="0 0 520 295" role="img" aria-labelledby="pump-chart-title pump-chart-desc"><title id="pump-chart-title">Pump and plumbing curves</title><desc id="pump-chart-desc"></desc>
 <defs><marker id="pump-axis-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#89a8b3"/></marker></defs>
 <path d="M66 242V31M66 242H489" class="pump-axis"/>
 <path d="M66 94H474M66 168H474M168 40V242M270 40V242M372 40V242" class="pump-chart-grid"/>
 <text x="26" y="25" class="pump-chart-label">Head / pressure</text><text x="300" y="283" class="pump-chart-label">Delivered flow →</text>
 <path id="pump-available" class="pump-available"/><path id="pump-required" class="pump-required"/>
 <path id="pump-op-guide" class="pump-op-guide"/><circle id="pump-operating-point" r="7"/>
 <text x="314" y="36" class="pump-curve-name">Pump at fixed setting</text><text id="pump-system-label" x="78" y="225" class="pump-system-name">Plumbing demand</text>
 <text x="78" y="264" class="pump-chart-small">Less flow</text><text x="419" y="264" class="pump-chart-small">More flow</text>
 </svg>
 <ul class="pump-chart-key"><li><i class="pump-key-pump"></i>Pump curve</li><li><i class="pump-key-plumbing"></i>Plumbing curve</li><li><i class="pump-key-point"></i>Operating point: where they meet</li></ul>
 <div class="pump-load-explanation" aria-live="polite"><h4 id="pump-load-title"></h4><p id="pump-load-text"></p></div>
 <p class="bio-note">Conceptual curves with no units or product ratings. They explain the trend and do not calculate a flow rate. The inspection-speed control above changes the animation only.</p>
 <div class="pump-notes">
 <details open><summary>What the pump does—and where the water goes</summary><p>The return connects sump filtration to the display. It does not capture debris or replace circulation pumps around the corals. Water enters the impeller eye, moves outward into the volute, and leaves through the discharge. Electrical windings stay encapsulated around the water-filled rotor well.</p></details>
 <details><summary>Weak flow, bubbles or rattling?</summary><p>Look for an obstructed intake, low chamber level, air entering the inlet, mineral deposits, debris in the rotor cavity, and contact that transmits vibration to glass or pipework. Similar symptoms can have different causes. For real maintenance, disconnect power and follow that pump’s manual; the electrical housing is not a wet-side service part.</p></details>
 <details><summary>Evaporation, power stops and restarting</summary><p>Evaporation can lower the return-chamber level while upstream baffles maintain their level. A suitable top-off system replaces evaporated water with fresh water. When the pump stops, water can drain back from the display and return line, so the sump needs spare capacity. Before restarting, the wet side needs water. Restore stable levels before equipment that depends on them.</p></details>
 </div>
 <p class="pump-reading">Read the sources: <a href="https://www.sicce.com/media/wysiwyg/ISTRUZIONI/SICCE_Syncra_SDC_Small_Controller_Instruction.pdf" target="_blank" rel="noopener">Sicce · wet-rotor components and care ↗</a> <a href="https://www.ksb.com/en-global/centrifugal-pump-lexicon/article/system-characteristic-curve-1116274" target="_blank" rel="noopener">KSB · operating point ↗</a> <a href="https://redseafish.com/smart-hardware/reefrun-family/" target="_blank" rel="noopener">Red Sea · restart sequencing ↗</a></p>`;
 const query=<E extends Element=HTMLElement>(s:string)=>host.querySelector<E>(s)!;
 const x=(q:number)=>66+q*408,y=(h:number)=>242-h*203;
 function curve(f:(q:number)=>number){let d='';for(let i=0;i<=80;i++){const q=i/80,h=f(q);if(h>1.02)break;d+=(i?'L':'M')+x(q).toFixed(2)+' '+y(h).toFixed(2);}return d;}
 function select(load:Load){const s=loads[load],q=Math.sqrt((.96-s.static)/(.75+s.loss)),h=.96-.75*q*q;
  query('#pump-available').setAttribute('d',curve(q=>.96-.75*q*q));query('#pump-required').setAttribute('d',curve(q=>s.static+s.loss*q*q));
  query('#pump-operating-point').setAttribute('cx',String(x(q)));query('#pump-operating-point').setAttribute('cy',String(y(h)));query('#pump-op-guide').setAttribute('d',`M66 ${y(h)}H${x(q)}V242`);
  query('#pump-system-label').setAttribute('y',String(y(s.static)-10));query('#pump-load-title').textContent=s.title;query('#pump-load-text').textContent=s.text;query('#pump-chart-desc').textContent=s.text+' The white dot marks where the falling pump curve and rising plumbing curve meet.';
  host.querySelectorAll<HTMLButtonElement>('[data-pump-load]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pumpLoad===load)));host.dataset.load=load;
 }
 host.querySelectorAll<HTMLButtonElement>('[data-pump-load]').forEach(b=>b.onclick=()=>select(b.dataset.pumpLoad as Load));select('open');
 return {reset:()=>select('open')};
}
