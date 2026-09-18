import type {Aquarium} from './Aquarium';
export function installObservation(aquarium:Aquarium){
 const main=document.querySelector('main')!,button=document.querySelector<HTMLButtonElement>('#observe')!;
 const caption=document.createElement('div');caption.className='observation-caption';caption.hidden=true;main.append(caption);
 let idle:ReturnType<typeof setTimeout>|undefined;
 const wake=()=>{main.classList.remove('observation-idle');clearTimeout(idle);if(aquarium.observing)idle=setTimeout(()=>{if(!main.querySelector(':focus-visible'))main.classList.add('observation-idle');},3500);};
 const sync=()=>{const on=aquarium.observing;main.classList.toggle('observing',on);if(!on)main.classList.remove('observation-idle');button.textContent=on?'Stop watching':'Watch the aquarium';button.setAttribute('aria-pressed',String(on));caption.hidden=!on;wake();};
 aquarium.onObservationChange=sync;
 button.onclick=()=>{
  if(aquarium.observing)aquarium.stopObservation();
  else{
   for(const id of ['learn-close','explore-close']){const close=document.querySelector<HTMLButtonElement>('#'+id);if(close&&close.getClientRects().length)close.click();}
   aquarium.startObservation();
  }
 };
 main.addEventListener('pointermove',wake,{passive:true});main.addEventListener('pointerdown',wake,{passive:true});main.addEventListener('focusin',wake);
 main.addEventListener('click',e=>{const target=e.target as Element;if(target.closest('button,select')&&!target.closest('#observe,#pause,#light,#fullscreen'))aquarium.stopObservation();},true);
 document.addEventListener('keydown',e=>{wake();if(e.key==='Escape')aquarium.stopObservation();});
 setInterval(()=>{if(aquarium.observing)caption.textContent=aquarium.observationLabel+' · Drag to take control';},500);
 sync();
}
