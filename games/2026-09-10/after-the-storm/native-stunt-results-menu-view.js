import {createNativeNameMenuClock} from './native-name-menu-runtime.js';

/** High-resolution score breakdown driven by the verified Stunt panel offsets.
 * Scores are read from canonical memory; presentation never recalculates them. */
export function createNativeStuntResultsMenuView({before,isActive=()=>true,onSelect=()=>{},onComplete=()=>{}}){
 const root=document.createElement('section');root.id='nativeStuntResultsMenu';root.hidden=true;root.setAttribute('aria-label','Stunt score breakdown');
 const style=document.createElement('style');style.textContent=`
 #nativeStuntResultsMenu{margin:20px 0;overflow:hidden;color:#eaf8fb}
 #nativeStuntResultsMenu .stunt-score-parts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
 #nativeStuntResultsMenu .stunt-score-part{padding:16px 8px;background:#ffffff09;border:1px solid #ffffff14;border-radius:12px;text-align:center}
 #nativeStuntResultsMenu .stunt-score-label{display:block;font-size:11px;color:#a9c8cf;letter-spacing:.12em;text-transform:uppercase}
 #nativeStuntResultsMenu .stunt-score-value{display:block;margin-top:8px;font-size:clamp(18px,5vw,28px);font-weight:700;font-variant-numeric:tabular-nums}
 #nativeStuntResultsMenu .stunt-score-total{padding:22px 12px;margin:12px 0;text-align:center;background:linear-gradient(120deg,#194c59,#102d40);border:1px solid #79d6eb40;border-radius:14px}
 #nativeStuntResultsMenu .stunt-score-total .stunt-score-value{font-size:40px;color:#f5d38b}
 #nativeStuntResultsMenu .stunt-score-status{font-size:12px;color:#a9c8cf;min-height:18px}
 #nativeStuntResultsMenu button{width:100%}
 `;
 const parts=document.createElement('div');parts.className='stunt-score-parts';const values={};
 function score(label,key,parent,className){
  const item=document.createElement('div');item.className=className;
  const name=document.createElement('span');name.className='stunt-score-label';name.textContent=label;
  const value=document.createElement('span');value.className='stunt-score-value';value.textContent='0';values[key]=value;
  item.append(name,value);parent.append(item);return item;
 }
 for(const [label,key]of [['Time','time'],['Tricks','trick'],['Rings','ring']])score(label,key,parts,'stunt-score-part');
 const total=score('Total score','total',root,'stunt-score-total');
 const status=document.createElement('p');status.className='stunt-score-status';status.setAttribute('role','status');
 const button=document.createElement('button');button.type='button';button.className='primary';button.textContent='Continue';
 root.replaceChildren(style,parts,total,status,button);before.before(root);
 const clock=createNativeNameMenuClock();let runtime=null,completed=false,pulses=[],held=new Set();
 function release(){held.clear();pulses=[];clock.reset();}
 const accepts=()=>Boolean(runtime&&!completed&&!root.hidden&&!document.hidden&&isActive());
 button.onclick=()=>{if(accepts()&&!button.disabled)pulses.push(0x8000,0);};
 window.addEventListener('keydown',event=>{
  if(!accepts()||event.altKey||event.metaKey||event.ctrlKey||!['Enter','Space'].includes(event.code))return;
  if(event.target.closest?.('button,input,select,textarea,[contenteditable="true"]'))return;
  event.preventDefault();event.stopImmediatePropagation();if(!event.repeat&&!held.has(event.code))pulses.push(0x8000,0);held.add(event.code);
 },true);
 window.addEventListener('keyup',event=>{if(held.delete(event.code)){event.preventDefault();event.stopImmediatePropagation();}},true);
 window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
 function draw(view){
  root.dataset.phase=String(view.phase);
  for(const [key,value]of Object.entries(view.totals))values[key].textContent=value.toLocaleString();
  parts.style.transform=`translateX(${(view.xB-20)/280*100}%)`;total.style.transform=`translateX(${(view.xA-20)/280*100}%)`;
  button.disabled=view.phase!==2;status.textContent=view.phase===2?'Enter or A / Start to continue.':'Continuing…';
 }
 return {root,start(nextRuntime){release();runtime=nextRuntime;completed=false;root.hidden=false;button.disabled=true;parts.style.visibility=total.style.visibility='hidden';status.textContent='Stunt results';},
  reset(){release();runtime=null;root.hidden=true;},advance(seconds,active,pads=[]){
   if(!runtime||completed||!active||root.hidden){release();return;}
   clock.advance(seconds,true,()=>{
    let mask=pulses.length?pulses.shift():0;if(held.size)mask|=0x8000;
    if(pads[0]?.buttons?.[0]?.pressed)mask|=0x8000;if(pads[0]?.buttons?.[9]?.pressed)mask|=0x1000;
    const frame=runtime.advanceStuntResultsMenu([{heldButtons:mask,rawXNative:0,rawYNative:0}]);
    draw(frame.draw);parts.style.visibility=total.style.visibility='';root.dataset.phase=String(frame.view.phase);
    if(frame.effects.some(e=>e.consumer==='800c37f4'))onSelect();
    if(!frame.view.active){completed=true;release();onComplete();return false;}
   });
  }};
}
