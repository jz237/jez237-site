import {installFilterExperience} from './lib/FilterExperience';
import './style.css';
import {installFullscreen} from './lib/Fullscreen';
import {installExploration} from './lib/ExplorationUI';
import {installLearning} from './lib/LearningUI';
import {installShowroom} from './lib/Showroom';
import {Aquarium} from './lib/Aquarium';
import {installObservation} from './lib/ObservationUI';

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<main>
 <div id="scene" aria-label="Interactive three-dimensional planted aquarium"></div>
 <header class="aquarium-header"><div class="identity"><span class="eyebrow">THE LIVING AQUASCAPE</span><h1>In three dimensions</h1></div>
 <div class="primary-tools" role="group" aria-label="Explore and learn about the aquarium"></div>
 <nav aria-label="Compare aquariums"><a href="../living-aquascape/?v=trace-f06dc4f">Photographic</a><a href="./" aria-current="page">Rotatable 3D <span class="dot"></span></a></nav></header>
 <div class="scene-note"><span class="live-dot"></span><span>Cardinal tetra school</span><span class="note-divider">/</span><span id="status">Preparing the aquarium</span><label class="effects-control">Effects <select id="effects" aria-label="Visual effects" disabled><option value="auto">Auto · full</option><option value="full">Always full</option></select></label></div>
 <div id="loading" role="status">Growing a small world<span></span></div>
 <button id="learn" class="learn-toggle" aria-expanded="false" aria-controls="learning" disabled>How the aquarium works ↗</button>
 <aside class="help"><span>EXPLORE THE TANK</span><p>Drag to rotate<br>Scroll or pinch to zoom</p></aside>
 <footer><div class="views" role="group" aria-label="Camera view"><button id="observe" aria-pressed="false">Watch the aquarium</button><button data-view="front" class="active">Front</button><button data-view="angle">Three-quarter</button><button data-view="side">Side</button></div>
 <div class="actions"><button id="zoomIn" aria-label="Zoom in">＋</button><button id="zoomOut" aria-label="Zoom out">−</button><span class="divider"></span><button id="feed">Feed fish</button><button id="pause" aria-pressed="false">Pause</button><button id="light" aria-pressed="false">Evening</button><button id="reset" aria-label="Reset camera">Reset view</button></div></footer>
 <button id="fullscreen" aria-pressed="false">Full screen</button>
 <div class="bottom-note">A separate 3D study <span>·</span> All scenery has volume</div>
</main>`;
const storeShowroom=new URLSearchParams(location.search).get('showroom')==='hidden-reef';
if(storeShowroom){document.body.classList.add('store-showroom');document.querySelector('.identity .eyebrow')!.textContent='THE HIDDEN REEF';document.querySelector('h1')!.textContent='Living Showroom';document.querySelector('header nav')!.innerHTML='';}
const aquariumHeader=document.querySelector<HTMLElement>('.aquarium-header')!;
const primaryTools=document.querySelector<HTMLElement>('.primary-tools')!;
primaryTools.append(document.querySelector('#learn')!);
aquariumHeader.append(document.querySelector('.scene-note')!);
// Reserve real layout space, including wrapped phone controls and fullscreen.
// The canvas ResizeObserver will reframe the tank for the remaining space.
let toolbarResizeFrame=0;
new ResizeObserver(()=>{
 cancelAnimationFrame(toolbarResizeFrame);
 toolbarResizeFrame=requestAnimationFrame(()=>{
 const main=document.querySelector<HTMLElement>('main')!;
 const space=aquariumHeader.getBoundingClientRect().height?Math.ceil(aquariumHeader.getBoundingClientRect().bottom-main.getBoundingClientRect().top+12):0;
 if(main.style.getPropertyValue('--toolbar-space')!==space+'px')main.style.setProperty('--toolbar-space',space+'px');
 });
}).observe(aquariumHeader);
installFullscreen(document.querySelector('main')!,document.querySelector<HTMLButtonElement>('#fullscreen')!);
const host=document.querySelector<HTMLDivElement>('#scene')!;
async function start(){
 try{
 const aquarium=new Aquarium(host);
 await aquarium.ready;
 const effects=document.querySelector<HTMLSelectElement>('#effects')!;effects.disabled=false;effects.onchange=()=>aquarium.setEffectsMode(effects.value);
 document.querySelector('#loading')!.remove();
 installFilterExperience(aquarium);installLearning(aquarium);installExploration(aquarium);
 primaryTools.append(document.querySelector('#explore')!,document.querySelector('.chemistry-summary')!);
 installShowroom(aquarium);
 installObservation(aquarium);
 // Local regression runner only; eliminated from production builds.
 if(import.meta.env.DEV&&new URLSearchParams(location.search).has('qa'))Object.assign(window,{aquariumQA:aquarium});
 document.querySelector('#status')!.textContent='Exploring';
 document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>{aquarium.view(b.dataset.view!);document.querySelectorAll('[data-view]').forEach(v=>v.classList.toggle('active',v===b));});
 const pause=document.querySelector<HTMLButtonElement>('#pause')!;
 pause.onclick=()=>{aquarium.paused=!aquarium.paused;pause.textContent=aquarium.paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(aquarium.paused));};
 const light=document.querySelector<HTMLButtonElement>('#light')!;
 light.onclick=()=>{aquarium.evening=!aquarium.evening;light.textContent=aquarium.evening?'Daylight':'Evening';light.setAttribute('aria-pressed',String(aquarium.evening));};
 const feed=document.querySelector<HTMLButtonElement>('#feed')!;
 feed.onclick=()=>{
 // A cutaway hides the real animals and their sinking food. Return to the
 // living tank before feeding; chemistry and whole-tank lessons stay open.
 if(aquarium.studyView)document.querySelector<HTMLButtonElement>('#learn-close')!.click();
 const portion=aquarium.feed();
 feed.disabled=true;
 feed.textContent=portion.pellets?(portion.flakes?'Flakes + pellets':'Pellets released'):portion.flakes?'Flakes · pellets remain':'Food still in tank';
 feed.title=`${portion.flakes} flakes and ${portion.pellets} sinking pellets released. Existing food stays in the tank until eaten or broken down.`;
 setTimeout(()=>{feed.disabled=false;feed.textContent='Feed fish';},6000);
 };
 document.querySelector<HTMLButtonElement>('#zoomIn')!.onclick=()=>aquarium.zoom(.85);
 document.querySelector<HTMLButtonElement>('#zoomOut')!.onclick=()=>aquarium.zoom(1.18);
 document.querySelector<HTMLButtonElement>('#reset')!.onclick=()=>{aquarium.view('angle');document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(v=>v.classList.toggle('active',v.dataset.view==='angle'));};
 host.addEventListener('pointerdown',()=>document.querySelectorAll('[data-view]').forEach(v=>v.classList.remove('active')));
 setInterval(()=>{document.querySelector('#status')!.textContent=aquarium.paused?'Paused':aquarium.status;light.textContent=aquarium.evening?'Daylight':'Evening';light.setAttribute('aria-pressed',String(aquarium.evening));},1200);
 }catch(error){console.error(error);document.querySelector('#loading')!.innerHTML=storeShowroom?'The 3D aquarium could not start.<br><small>Try a browser with WebGL enabled, or <a href="../" target="_top">return to the showroom guides and planner</a>.</small>':'The 3D aquarium could not start.<br><small>Try a browser with WebGL enabled, or visit the photographic version above.</small>';}
}
start();
