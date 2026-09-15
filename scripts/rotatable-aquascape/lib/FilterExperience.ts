import type {Aquarium} from './Aquarium';
type Exhibit={mountFilter:(host:HTMLElement,part:number,onClose:()=>void)=>()=>void};
/** The photographic and rotatable aquariums share this exact filter exhibit. */
export function installFilterExperience(aquarium:Aquarium,load:()=>Promise<Exhibit>=()=>import('./FilterExhibit')){
 let mounted=false;
 aquarium.onFilterRequest=(part=3)=>{
  if(mounted)return;mounted=true;
  const previousPause=aquarium.paused,focus=document.activeElement as HTMLElement|null;
  aquarium.paused=true;aquarium.filterOpen=true;
  const host=document.createElement('div'),message=document.createElement('p'),cancel=document.createElement('button');
  host.className='filter-loading';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label','Loading filter exhibit');
  message.textContent='Loading the filter exhibit…';message.setAttribute('role','status');cancel.textContent='Close';host.append(message,cancel);document.querySelector('main')!.append(host);
  let closed=false,dispose:(()=>void)|undefined;
  const close=()=>{if(closed)return;closed=true;dispose?.();host.remove();mounted=false;aquarium.filterOpen=false;aquarium.paused=previousPause;document.removeEventListener('keydown',key);document.dispatchEvent(new Event('aquascape-filter-closed'));focus?.focus();};
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close();}else if(event.key==='Tab'){event.preventDefault();cancel.focus();}};
  cancel.onclick=close;cancel.focus();document.addEventListener('keydown',key);
  load().then(exhibit=>{
   if(closed)return;
   document.removeEventListener('keydown',key);host.replaceChildren();host.className='';host.removeAttribute('role');host.removeAttribute('aria-modal');host.removeAttribute('aria-label');
   dispose=exhibit.mountFilter(host,part,close);
  }).catch(()=>{
   if(closed)return;host.className='filter-loading';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label','Filter unavailable');host.replaceChildren(message,cancel);document.addEventListener('keydown',key);message.textContent='The filter could not load. Close this panel and try again.';cancel.focus();
  });
 };
}
