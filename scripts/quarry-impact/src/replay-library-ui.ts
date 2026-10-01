import {replayLibrary,LIBRARY_LIMIT,LIBRARY_BYTES,type ReplayEntry,type ReplayLibrary} from './replay-library';
import type {ReplayDocument} from './replay-data';
import {downloadBlob} from './replay-studio';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const clock=(n:number)=>`${Math.floor(n/60)}:${Math.floor(n%60).toString().padStart(2,'0')}`;
export function showReplayLibrary(ui:HTMLElement,watch:(doc:ReplayDocument,name:string)=>void,close:()=>void,library:ReplayLibrary=replayLibrary){
 const overlay=document.createElement('div');overlay.className='overlay';overlay.id='replay-library';
 overlay.innerHTML=`<section class="dialog replay-library" role="dialog" aria-modal="true" aria-labelledby="library-title"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2 id="library-title">REPLAY LIBRARY</h2><p>Saved in this browser. Export recordings you want to keep if browser data is cleared.</p><div class="library-toolbar"><label>Find a replay<input id="library-search" type="search" placeholder="Name or event"></label><button id="library-import">IMPORT .qir</button><button id="library-close">BACK</button></div><p id="library-usage"></p><p id="library-status" role="status">Loading recordings…</p><div id="library-list"></div></section>`;ui.append(overlay);
 let entries:ReplayEntry[]=[],busy=false;const status=overlay.querySelector<HTMLElement>('#library-status')!,list=overlay.querySelector<HTMLElement>('#library-list')!,search=overlay.querySelector<HTMLInputElement>('#library-search')!;
 const message=(s:string)=>status.textContent=s;
 const action=async(fn:()=>Promise<void>)=>{if(busy)return;busy=true;overlay.setAttribute('aria-busy','true');overlay.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=true);try{await fn();}catch(error){message(error instanceof Error?error.message:'The replay could not be opened.');}finally{busy=false;overlay.removeAttribute('aria-busy');overlay.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.disabled=false);if(overlay.isConnected&&!overlay.contains(document.activeElement))search.focus();}};
 const refresh=async()=>{entries=await library.list();if(!overlay.isConnected)return;overlay.querySelector('#library-usage')!.textContent=`${entries.length} / ${LIBRARY_LIMIT} recordings · ${(entries.reduce((n,e)=>n+e.bytes,0)/1024/1024).toFixed(1)} / ${LIBRARY_BYTES/1024/1024} MB`;render();};
 function render(){
  const term=search.value.trim().toLowerCase(),found=entries.filter(e=>(e.name+' '+e.mode).toLowerCase().includes(term));
  list.innerHTML=found.length?found.map(e=>`<article class="library-entry" data-id="${escape(e.id)}"><label>Recording name<input class="library-name" maxlength="80" value="${escape(e.name)}"></label><p>${escape(e.mode)} · ${e.cars} cars · ${clock(e.duration)} · ${(e.bytes/1024/1024).toFixed(2)} MB${e.limited?' · recording limit reached':''}<br>${escape(e.created.slice(0,19).replace('T',' '))}</p><div class="library-actions"><button data-action="watch">WATCH</button><button data-action="rename">RENAME</button><button data-action="export">EXPORT .qir</button><button data-action="delete">DELETE</button></div><div class="library-confirm" hidden><p>Delete this saved replay from this browser? Export a copy first if you want to keep it.</p><button data-action="confirm">DELETE RECORDING</button><button data-action="cancel">KEEP RECORDING</button></div></article>`).join(''):`<p>${entries.length?'No recordings match your search.':'No saved recordings yet. Save a solo recording from the replay studio or import a .qir file.'}</p>`;
  list.querySelectorAll<HTMLButtonElement>('button').forEach(button=>button.onclick=()=>{
   const row=button.closest<HTMLElement>('[data-id]')!,id=row.dataset.id!,entry=entries.find(e=>e.id===id)!,kind=button.dataset.action;
   if(kind==='delete'||kind==='cancel'){row.querySelector<HTMLElement>('.library-confirm')!.hidden=kind==='cancel';return;}
   void action(async()=>{
    if(kind==='watch'){const doc=await library.load(id);watch(doc,entry.name);message('Replay opened.');}
    else if(kind==='rename'){await library.rename(id,row.querySelector<HTMLInputElement>('input')!.value);await refresh();message('Recording renamed.');}
    else if(kind==='export'){downloadBlob(await library.file(id),entry.name.replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,60)+'.qir');message('Replay exported.');}
    else if(kind==='confirm'){await library.remove(id);await refresh();message('Recording deleted.');}
   });
  });
 }
 overlay.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const controls=Array.from(overlay.querySelectorAll<HTMLElement>('button,input')).filter(e=>!e.closest('[hidden]')&&!(e as HTMLButtonElement).disabled);const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}});
 search.oninput=()=>{if(!busy)render();};
 overlay.querySelector<HTMLButtonElement>('#library-close')!.onclick=()=>{if(!busy){overlay.remove();close();}};
 overlay.querySelector<HTMLButtonElement>('#library-import')!.onclick=()=>{const input=document.createElement('input');input.type='file';input.accept='.qir';input.hidden=true;overlay.append(input);input.oncancel=()=>input.remove();input.onchange=()=>{const file=input.files?.[0];input.remove();if(file)void action(async()=>{message('Importing recording…');const saved=await library.import(file);await refresh();message(`Saved “${saved.name}”.`);});};input.click();};
 void action(async()=>{await refresh();message('Choose a recording to watch or export.');});search.focus();
 return ()=>{if(!busy){overlay.remove();close();}};
}
