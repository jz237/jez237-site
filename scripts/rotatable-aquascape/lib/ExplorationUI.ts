import type {Aquarium} from './Aquarium';
import {plantFacts,type Identification} from './Exploration';
export function installExploration(aquarium:Aquarium){
 const main=document.querySelector('main')!,button=document.createElement('button');button.id='explore';button.className='explore-toggle';button.textContent='Explore & identify';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','exploration');main.append(button);
 const panel=document.createElement('aside');panel.id='exploration';panel.hidden=true;panel.setAttribute('aria-label','Explore aquarium life');main.append(panel);
 let selected:Identification|null=null,lens=false;
 const close=()=>{selected=null;panel.hidden=true;main.classList.remove('exploration-open');button.setAttribute('aria-expanded','false');aquarium.identifyMode=false;aquarium.follow(null);aquarium.clearSelection();aquarium.setMagnifier(false);aquarium.view('front');lens=false;};
 aquarium.onExploreClose=close;
 const open=()=>{const learn=document.querySelector<HTMLButtonElement>('#learn')!;if(learn.getAttribute('aria-expanded')==='true')learn.click();panel.hidden=false;main.classList.add('exploration-open');button.setAttribute('aria-expanded','true');aquarium.identifyMode=true;render();};
 button.onclick=()=>panel.hidden?open():close();
 aquarium.onIdentify=info=>{if(aquarium.following!==null&&info?.fishId!==aquarium.following)aquarium.follow(null);selected=info;render();};
 function render(){
  panel.innerHTML=`<div class="explore-heading"><span class="eyebrow">A CLOSER LOOK</span><button id="explore-close" aria-label="Close exploration">×</button></div>
   <div class="explore-scene-tools"><button id="explore-front">Front</button><button id="explore-angle">Three-quarter</button><button id="explore-feed">Feed fish</button><button id="explore-pause">${aquarium.paused?'Resume':'Pause'}</button></div>
   <p class="explore-hint">${lens?'Move over the tank, or drag on your phone, to move the 2.4× lens.':'Tap a fish, shrimp, snail or leaf to identify it. Drag to rotate. Identification taps do not startle fish.'}</p>
   <label class="learn-field">Choose an organism<select id="choose-organism"><option value="">Tap the tank or choose here</option><optgroup label="Cardinal tetras">${Array.from({length:16},(_,i)=>`<option value="fish:${i}" ${selected?.fishId===i?'selected':''}>Cardinal tetra ${i+1}</option>`).join('')}</optgroup><optgroup label="Dwarf Corydoras">${Array.from({length:6},(_,i)=>`<option value="cory:${i}" ${selected?.coryId===i?'selected':''}>Dwarf Corydoras ${i+1}</option>`).join('')}</optgroup><optgroup label="Shrimp & snails">${Array.from({length:9},(_,i)=>`<option value="animal:${i}" ${selected?.animalId===i?'selected':''}>${i<6?`Cherry shrimp ${i+1}`:`Ramshorn snail ${i-5}`}</option>`).join('')}</optgroup><optgroup label="Plant forms">${Object.entries(plantFacts).map(([id,[name]])=>`<option value="plant:${id}" ${selected?.species===id?'selected':''}>${name}</option>`).join('')}</optgroup></select></label>
   ${selected?`<div class="organism-card"><h2>${selected.name}</h2><p class="organism-name">${selected.subtitle}</p><p>${selected.role}</p><p><strong>Needs</strong> · ${selected.needs}</p><p id="observed-behavior">${selected.behavior}</p>${selected.kind==='invertebrate'?'<button id="inspect-animal" class="learn-action">Close-up · watch its appendages</button>':''}${selected.coryId!==undefined?'<button id="inspect-cory" class="learn-action">Close-up · watch this cory</button>':selected.kind==='fish'?`<button id="follow-fish" class="learn-action">${aquarium.following===selected.fishId?'Stop following':'Follow this tetra'}</button>`:''}</div>`:'<p class="fine">The ring marks your selection. Plant names describe the representative forms used in this aquascape.</p>'}
   <div class="learn-pair"><button id="magnifier" aria-pressed="${lens}">${lens?'Close magnifier':'Magnifier · 2.4×'}</button><button id="underground">Below the gravel</button></div>
   <button id="try-challenge" class="learn-action">Predict & test a change</button>
   <p class="fine"><a href="./animal-reference.png" target="_blank" rel="noopener">GPT Image visual reference ↗</a> · The sculpted models remain fully rotatable.</p>
   <details><summary>Bottom-foraging Corydoras</summary><p>Six salt-and-pepper dwarf cories browse separately and near companions, pause to inspect sand, and follow sinking food. Their movements are an illustrative simulation, not measured species kinematics.</p><a href="./cory-reference.png" target="_blank" rel="noopener">GPT Image modeling reference ↗</a> · <a href="./cory-study.md" target="_blank" rel="noopener">Behavior & modeling study ↗</a></details><details><summary>How the cardinals behave</summary><p>Watch short browsing stops near planting, individual propulsion and coasting, and returns to companions. Feed fish to see pursuit of sinking flakes.</p><p>Cardinal field studies and a qualitative check of identified wild footage inform the foraging and use of depth. Timing, fin frequency and steering remain illustrative choices.</p><a href="./cardinal-behavior-study.md" target="_blank" rel="noopener">Read the study & sources ↗</a></details>`;
  panel.querySelector<HTMLButtonElement>('#explore-front')!.onclick=()=>{aquarium.view('front');render();};
  panel.querySelector<HTMLButtonElement>('#explore-angle')!.onclick=()=>{aquarium.view('angle');render();};
  panel.querySelector<HTMLButtonElement>('#explore-feed')!.onclick=()=>document.querySelector<HTMLButtonElement>('#feed')!.click();
  panel.querySelector<HTMLButtonElement>('#explore-pause')!.onclick=()=>{document.querySelector<HTMLButtonElement>('#pause')!.click();render();};
  panel.querySelector<HTMLButtonElement>('#explore-close')!.onclick=()=>{close();button.focus();};
  panel.querySelector<HTMLSelectElement>('#choose-organism')!.onchange=e=>{const [kind,id]=(e.target as HTMLSelectElement).value.split(':');if(kind==='cory')aquarium.identifyCory(+id);if(kind==='fish')aquarium.identifyFish(+id);if(kind==='plant')aquarium.identifyPlant(id);if(kind==='animal')aquarium.identifyAnimal(+id);};
  const inspectCory=panel.querySelector<HTMLButtonElement>('#inspect-cory');if(inspectCory)inspectCory.onclick=()=>aquarium.inspectCory();
  const inspect=panel.querySelector<HTMLButtonElement>('#inspect-animal');if(inspect)inspect.onclick=()=>aquarium.inspectAnimal();
  const follow=panel.querySelector<HTMLButtonElement>('#follow-fish');if(follow)follow.onclick=()=>{aquarium.follow(aquarium.following===selected!.fishId?null:selected!.fishId!);render();};
  panel.querySelector<HTMLButtonElement>('#magnifier')!.onclick=()=>{lens=!lens;aquarium.setMagnifier(lens);render();};
  panel.querySelector<HTMLButtonElement>('#underground')!.onclick=()=>aquarium.onLessonRequest('underground');
  panel.querySelector<HTMLButtonElement>('#try-challenge')!.onclick=()=>aquarium.onLessonRequest('challenges');
 }
 setInterval(()=>{if(panel.hidden||(!selected||selected.kind==='plant'))return;const text=aquarium.selectedFishStatus,el=panel.querySelector('#observed-behavior');if(el&&el.textContent!==text)el.textContent=text;},400);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){close();button.focus();}});
}
