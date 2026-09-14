// Species Gallery panel: the species list, the size-class slider, field marks and the two buttons.
// The 3D turntable itself is the studio fish in main.js; this only drives the DOM.
import {lureName,hourLabel,CLASS_LABEL,weightText} from './journal.js';
const $=id=>document.getElementById(id);
// the bite clock: the guide's hearsay as faint bars, your own catches as solid ones on top
function clockSvg(hearsay,hours){const W=240,H=40,bw=W/24;const maxH=Math.max(1,...hours);let s=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Bite clock">`;
 for(let h=0;h<24;h++){const hh=Math.max(1,hearsay[h]*(H-4));s+=`<rect x="${(h*bw+.6).toFixed(1)}" y="${(H-hh).toFixed(1)}" width="${(bw-1.2).toFixed(1)}" height="${hh.toFixed(1)}" fill="#e2c38e" opacity=".22"/>`;
  if(hours[h]>0){const ch=Math.max(4,hours[h]/maxH*(H-4));s+=`<rect x="${(h*bw+.6).toFixed(1)}" y="${(H-ch).toFixed(1)}" width="${(bw-1.2).toFixed(1)}" height="${ch.toFixed(1)}" fill="#e3c18e"/>`;}}
 return s+'</svg>';}
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
   const b=c.book;$('gJournal').textContent=c.caught?`Journal: ${c.caught} caught · best ${c.best}${b.peakHour!==null?' · most at '+hourLabel(b.peakHour):''}${b.firm?'':' · the clock is still mostly hearsay'}`:`Journal: none caught yet · ${c.count} in the cove · the bite clock is Ray's hearsay until you catch a few`;
   $('gClock').innerHTML=clockSvg(c.hearsay,b.hours)+'<div class="clockLabels"><span>MIDNIGHT</span><span>6 AM</span><span>NOON</span><span>6 PM</span><span>MIDNIGHT</span></div>';
   $('gTook').innerHTML=b.count?`<b>It took</b> ${b.lures.map(l=>lureName(l.key)+(l.n>1?' ×'+l.n:'')).join(', ')}${b.techniques.length?' · '+b.techniques.map(t=>t.key).join(', '):''}`:'';
   const bests=['young','common','trophy','legend'].filter(k=>b.bestByClass[k]).map(k=>`${CLASS_LABEL[k]} ${b.bestByClass[k].lengthIn} in${b.bestByClass[k].weightLb?' · '+weightText(b.bestByClass[k].weightLb):''}`);
   $('gBests').innerHTML=bests.length?`<b>Bests</b> ${bests.join(' · ')}`:'';},
  visible(){return !root.classList.contains('hidden');}
 };
}
