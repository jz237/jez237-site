import './style.css';
import {Aquarium} from './lib/Aquarium';

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<main>
 <div id="scene" aria-label="Interactive three-dimensional planted aquarium"></div>
 <header><div class="identity"><span class="eyebrow">THE LIVING AQUASCAPE</span><h1>In three dimensions</h1></div>
 <nav aria-label="Compare aquariums"><a href="../living-aquascape/?v=trace-f06dc4f">Photographic</a><a href="./" aria-current="page">Rotatable 3D <span class="dot"></span></a></nav></header>
 <div class="scene-note"><span class="live-dot"></span><span>Cardinal tetra school</span><span class="note-divider">/</span><span id="status">Preparing the aquarium</span></div>
 <div id="loading" role="status">Growing a small world<span></span></div>
 <aside class="help"><span>EXPLORE THE TANK</span><p>Drag to rotate<br>Scroll or pinch to zoom</p></aside>
 <footer><div class="views" role="group" aria-label="Camera view"><button data-view="front">Front</button><button data-view="angle" class="active">Three-quarter</button><button data-view="side">Side</button></div>
 <div class="actions"><button id="zoomIn" aria-label="Zoom in">＋</button><button id="zoomOut" aria-label="Zoom out">−</button><span class="divider"></span><button id="feed">Feed fish</button><button id="pause" aria-pressed="false">Pause</button><button id="light" aria-pressed="false">Evening</button><button id="reset" aria-label="Reset camera">Reset view</button></div></footer>
 <div class="bottom-note">A separate 3D study <span>·</span> All scenery has volume</div>
</main>`;
const host=document.querySelector<HTMLDivElement>('#scene')!;
async function start(){
 try{
 const aquarium=new Aquarium(host);
 await aquarium.ready;
 document.querySelector('#loading')!.remove();
 document.querySelector('#status')!.textContent='Exploring';
 document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b=>b.onclick=()=>{aquarium.view(b.dataset.view!);document.querySelectorAll('[data-view]').forEach(v=>v.classList.toggle('active',v===b));});
 const pause=document.querySelector<HTMLButtonElement>('#pause')!;
 pause.onclick=()=>{aquarium.paused=!aquarium.paused;pause.textContent=aquarium.paused?'Resume':'Pause';pause.setAttribute('aria-pressed',String(aquarium.paused));};
 const light=document.querySelector<HTMLButtonElement>('#light')!;
 light.onclick=()=>{aquarium.evening=!aquarium.evening;light.textContent=aquarium.evening?'Daylight':'Evening';light.setAttribute('aria-pressed',String(aquarium.evening));};
 const feed=document.querySelector<HTMLButtonElement>('#feed')!;
 feed.onclick=()=>{aquarium.feed();feed.disabled=true;feed.textContent='Food released';setTimeout(()=>{feed.disabled=false;feed.textContent='Feed fish';},6000);};
 document.querySelector<HTMLButtonElement>('#zoomIn')!.onclick=()=>aquarium.zoom(.85);
 document.querySelector<HTMLButtonElement>('#zoomOut')!.onclick=()=>aquarium.zoom(1.18);
 document.querySelector<HTMLButtonElement>('#reset')!.onclick=()=>{aquarium.view('angle');document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(v=>v.classList.toggle('active',v.dataset.view==='angle'));};
 host.addEventListener('pointerdown',()=>document.querySelectorAll('[data-view]').forEach(v=>v.classList.remove('active')));
 setInterval(()=>document.querySelector('#status')!.textContent=aquarium.paused?'Paused':aquarium.status,1200);
 }catch(error){console.error(error);document.querySelector('#loading')!.innerHTML='The 3D aquarium could not start.<br><small>Try a browser with WebGL enabled, or visit the photographic version above.</small>';}
}
start();
