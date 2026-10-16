import {DesignClient} from './design-client';
import {applyGarageDesign} from './design-adapter';
import type {Setup} from './garage';
import type {CarKind} from './rules';
/** No endpoint is configured in production. Local activation is explicit. */
export function designEndpoint():string|null{
 const value=import.meta.env.VITE_QUARRY_DESIGN_ENDPOINT;if(!value)return null;
 try{const url=new URL(value);if(url.protocol==='https:'||import.meta.env.DEV&&url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))return url.href.replace(/\/$/,'')}catch{}
 return null;
}
function storage():Storage{try{return localStorage}catch{return {length:0,key:()=>null,clear:()=>{},removeItem:()=>{},getItem:()=>null,setItem:()=>{throw Error('Storage unavailable')}}}}
export function designGarageCallbacks(ui:HTMLElement,kind:CarKind){
 const endpoint=designEndpoint();if(!endpoint)return {};
 const store=storage(),ownsDesign=(id:string)=>new DesignClient(endpoint,store).owned.has(id);
 return {ownsDesign,browseDesigns:(setup:Setup,apply:(setup:Setup)=>void)=>{
  if(ui.querySelector('.design-dialog'))return;
  const garage=ui.querySelector<HTMLElement>('.garage-screen'),dialog=document.createElement('dialog'),root=document.createElement('div');dialog.className='design-dialog';dialog.setAttribute('aria-label','Community design browser');root.textContent='Loading design browser…';dialog.append(root);ui.append(dialog);if(garage)garage.inert=true;
  let closed=false,browser:{dispose():void}|undefined;
  const close=()=>{if(closed)return;closed=true;browser?.dispose();if(dialog.open)dialog.close();dialog.remove();if(garage)garage.inert=false;ui.querySelector<HTMLButtonElement>('#garage-browse')?.focus()};
  dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
  dialog.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();close()}});
  dialog.showModal();dialog.focus();
  void import('./design-browser').then(({mountDesignBrowser})=>{
   if(closed)return;
   browser=mountDesignBrowser(root,{endpoint,storage:store,close,draft:()=>{
    if(setup.designSource&&!setup.designSource.allowRemix&&!ownsDesign(setup.designSource.id))throw Error('Remove the downloaded design before publishing your own paintwork.');
    return {kind,paint:setup.paint,trim:setup.trim,layers:setup.livery};
   },apply:design=>{const next=applyGarageDesign(setup,kind,design);close();apply(next);ui.querySelector<HTMLButtonElement>('#garage-browse')?.focus()}});
   root.querySelector<HTMLButtonElement>('button')?.focus();
  }).catch(()=>{if(closed)return;root.textContent='Design browser unavailable. Your garage setup has not changed.';const back=document.createElement('button');back.textContent='BACK TO GARAGE';back.onclick=close;root.append(back);back.focus()});
 }};
}
