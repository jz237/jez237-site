import type {DemoOptions} from './demo-session';
import {COURSE_NAMES,isCourseId,type CourseId} from './course-id';
import {ARENA_NAMES,isArenaId,type ArenaId} from './arena-id';
import {getRaceCourse} from './race-course';
import {DERBY_ARENA,type ArenaLayout} from './derby-arena';
import {HARROW_ARENA} from './harrow-arena';
import {BRIARHILL_ARENA} from './briarhill-arena';
import {FOUNDRY_ARENA} from './foundry-arena';
import {WRENFORD_PIT_ARENA} from './wrenford-pit-arena';
import {KESTREL_RING_ARENA} from './kestrel-ring-arena';
import type {EventOptions} from './event-rules';
import type {Mode} from './rules';
export type VenueCard={id:string;name:string;kind:'course'|'arena';detail:string;path:string;start:[number,number]};
const arenas:Record<ArenaId,ArenaLayout>={'quarry-arena-v1':DERBY_ARENA,'harrow-bowl-v1':HARROW_ARENA,'briarhill-bowl-v1':BRIARHILL_ARENA,'foundry-yard-v1':FOUNDRY_ARENA,'wrenford-pit-v1':WRENFORD_PIT_ARENA,'kestrel-ring-v1':KESTREL_RING_ARENA};
/** Fit the real route/arena outline to a shared card without distorting its shape. */
export function venueOutline(points:readonly {x:number;z:number}[]){
 const xs=points.map(p=>p.x),zs=points.map(p=>p.z),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min(220/Math.max(1,maxX-minX),104/Math.max(1,maxZ-minZ));
 const coords=points.map(p=>[128+(p.x-(minX+maxX)/2)*scale,64+(p.z-(minZ+maxZ)/2)*scale]as[number,number]);
 return{path:coords.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(',')).join(' ')+' Z',start:coords[0]};
}
let cached:VenueCard[]|undefined;
export function venueCatalog():readonly VenueCard[]{
 if(cached)return cached;
 cached=[...Object.entries(COURSE_NAMES).map(([id,name])=>{const c=getRaceCourse(id as CourseId),points=Array.from({length:128},(_,i)=>c.point(i/128)),surfaces=[...new Set(points.map(p=>c.surface(p.x,p.z)))];return{id,name,kind:'course' as const,detail:`${(c.length/1000).toFixed(2)} km circuit · ${surfaces.join(' / ')}`,...venueOutline(points)};}),...Object.entries(ARENA_NAMES).map(([id,name])=>{const a=arenas[id as ArenaId],points=a.outline??Array.from({length:64},(_,i)=>({x:a.x+Math.cos(i/64*Math.PI*2)*a.radius,z:a.z+Math.sin(i/64*Math.PI*2)*a.radius}));const width=Math.round(Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x))),depth=Math.round(Math.max(...points.map(p=>p.z))-Math.min(...points.map(p=>p.z)));return{id,name,kind:'arena' as const,detail:`${width} × ${depth} m arena · survival / score`,...venueOutline(points)};})];
 return cached;
}
export function filterVenues(mode:Mode,query:string){const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);return venueCatalog().filter(v=>v.kind===(mode==='derby'?'arena':'course')&&terms.every(term=>(v.name+' '+v.detail).toLocaleLowerCase().includes(term)));}
export function selectVenue(options:EventOptions,mode:Mode,id:string){
 if(mode==='derby'){if(!isArenaId(id))return false;options.arena=id;}
 else{if(!isCourseId(id))return false;if(mode==='playground')options.playgroundCourse=id;else options.course=id;}
 return true;
}
export function selectDemoVenue(options:Pick<DemoOptions,'course'|'arena'>,mode:Mode,id:string){
 if(mode==='race'&&isCourseId(id)){options.course=id;return true;}
 if(mode==='derby'&&isArenaId(id)){options.arena=id;return true;}
 return false;
}
export function showVenueBrowser(ui:HTMLElement,initial:Mode,options:EventOptions,choose:(mode:Mode,id:string,demo:boolean)=>void,close:()=>void,demoChoices:Pick<DemoOptions,'course'|'arena'>={}){
 let mode=initial,watch=false;
 ui.innerHTML=`<section id="venue-browser" aria-label="Choose a course"><div class="venue-panel"><header><div><div class="eyebrow">BLACKRIDGE MOTOR CLUB / VENUES</div><h1>CHOOSE YOUR GROUND.</h1><p id="venue-help"></p></div><button id="venue-close" class="small-button">BACK</button></header><div class="venue-tools"><label>Drive mode<select id="venue-mode"><option value="race">Race · ${Object.keys(COURSE_NAMES).length} circuits</option><option value="playground">Free drive · ${Object.keys(COURSE_NAMES).length} venues</option><option value="derby">Derby · ${Object.keys(ARENA_NAMES).length} arenas</option></select></label><label>Find a venue<input id="venue-search" type="search" placeholder="Search name or surface" autocomplete="off"></label></div><label class="venue-watch"><input id="venue-watch" type="checkbox"> Watch demo on selection</label><p id="venue-count" role="status" aria-live="polite"></p><div id="venue-grid"></div><p class="venue-footnote">Circuit previews show the racing route. Arena previews show the boundary. Race, free-drive and demo choices are saved separately.</p></div></section>`;
 const search=ui.querySelector<HTMLInputElement>('#venue-search')!,modeSelect=ui.querySelector<HTMLSelectElement>('#venue-mode')!,grid=ui.querySelector<HTMLElement>('#venue-grid')!,watchBox=ui.querySelector<HTMLInputElement>('#venue-watch')!;modeSelect.value=mode;
 const render=()=>{if(mode==='playground')watch=false;watchBox.checked=watch;watchBox.disabled=mode==='playground';const choices=watch?demoChoices:options,cards=filterVenues(mode,search.value),selected=mode==='derby'?choices.arena??'quarry-arena-v1':mode==='playground'?options.playgroundCourse??'quarry-v1':choices.course??'quarry-v1';
  ui.querySelector('#venue-help')!.textContent=watch?'Pick a venue to start its demo now. Uses your saved Demo Options, including camera, opponents and event loop.':'Pick a venue, then start from the title screen. Event Rules controls laps, opponents and damage.';
  ui.querySelector('#venue-count')!.textContent=`${cards.length} ${mode==='derby'?'arenas':'circuits'} found`;
  grid.replaceChildren();for(const card of cards){const b=document.createElement('button');b.className='venue-card'+(card.id===selected?' selected':'');b.dataset.venue=card.id;b.setAttribute('aria-label',`${watch?'Watch':'Select'} ${card.name} ${watch?'demo':'for '+(mode==='playground'?'free drive':mode)}`);b.setAttribute('aria-pressed',String(card.id===selected));
   // Catalog text and path coordinates are authored data, never search input.
   b.innerHTML=`<svg viewBox="0 0 256 128" aria-hidden="true"><path class="venue-road-shadow" d="${card.path}"/><path class="venue-road" d="${card.path}"/>${card.kind==='course'?`<circle cx="${card.start[0]}" cy="${card.start[1]}" r="4"/>`:''}</svg><span class="venue-name">${card.name}</span><span class="venue-detail">${card.detail}</span><span class="venue-select">${watch?'WATCH DEMO ▷':card.id===selected?'SELECTED':'SELECT VENUE ↗'}</span>`;b.onclick=()=>choose(mode,card.id,watch);grid.append(b);}
  if(!cards.length){const empty=document.createElement('p');empty.className='venue-empty';empty.textContent='No matching venues. Try another name or clear the search.';grid.append(empty);}
 };
 watchBox.onchange=()=>{watch=watchBox.checked;render();};modeSelect.onchange=()=>{mode=modeSelect.value as Mode;render();};search.oninput=render;ui.querySelector<HTMLButtonElement>('#venue-close')!.onclick=close;render();
}
