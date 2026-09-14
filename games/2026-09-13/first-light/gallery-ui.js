// Species Gallery panel: the species list, the size-class slider, field marks and the two buttons.
// The 3D turntable itself is the studio fish in main.js; this only drives the DOM.
const $=id=>document.getElementById(id);
export function mountGallery(h){
 const root=$('gallery'),list=$('gList'),slider=$('gSlider');
 $('gBack').onclick=()=>h.onBack();$('gLake').onclick=()=>h.onLake();
 slider.oninput=e=>h.onSlider(Number(e.target.value));
 let built=false;
 function buildList(items,activeId){list.innerHTML='';for(const it of items){const b=document.createElement('button');b.textContent=it.name;b.dataset.id=it.id;b.className=it.id===activeId?'on':'';b.onclick=()=>h.onSelect(it.id);list.appendChild(b);}built=true;}
 return {
  show(items,activeId,t){if(!built)buildList(items,activeId);root.classList.remove('hidden');this.setActive(activeId);slider.value=String(t);},
  hide(){root.classList.add('hidden');},
  setActive(id){for(const b of list.children)b.classList.toggle('on',b.dataset.id===id);},
  setSlider(t){if(document.activeElement!==slider)slider.value=String(t);},
  setCard(c){$('gName').textContent=c.name;$('gLatin').textContent=c.latin;$('gSize').textContent=c.sizeText;
   $('gMarks').innerHTML=c.marks.map(m=>`<li>${m}</li>`).join('');
   $('gHabits').innerHTML=`<b>Holds on</b> ${c.holds}<br><b>Takes</b> ${c.takes}<br><b>Feeds</b> ${c.hours} · ${c.temp}${c.notes.length?'<br><b>Note</b> '+c.notes.join(' · '):''}`;
   $('gJournal').textContent=c.caught?`Journal: ${c.caught} caught · best ${c.best}`:`Journal: none caught yet · ${c.count} in the cove`;},
  visible(){return !root.classList.contains('hidden');}
 };
}
