// Phone controls: hold buttons for paddle and turn, tap buttons for anchor and lenses, drag the
// scene to look. Fleet guards: pointer capture on every control, held keys cleared on blur and
// hide, and a tap is ignored if the finger moved more than 10 px (scroll-release misfires).
export function mountTouchControls({onTap}){
 const held=new Map(),root=document.createElement('nav');root.id='touchControls';root.hidden=true;root.setAttribute('aria-label','Touch controls');
 root.innerHTML=`<div class="touch-left"><button data-key="KeyA" class="hold">◀</button><button data-key="KeyD" class="hold">▶</button></div>
 <div class="touch-right"><button data-key="KeyS" class="hold small">BACK</button><button data-key="KeyW" class="hold big">PADDLE</button></div>
 <div class="touch-taps"><button data-tap="anchor">⚓ Anchor</button><button data-tap="lenses">🕶 Lenses</button><button data-tap="menu">☰</button></div>`;
 document.body.append(root);
 const wanted=navigator.maxTouchPoints>0||matchMedia('(pointer: coarse)').matches;let active=false;
 const keys=()=>Object.fromEntries([...held.values()].map(k=>[k,true]));
 const reset=()=>{held.clear();root.querySelectorAll('.hold').forEach(b=>b.classList.remove('held'));};
 for(const button of root.querySelectorAll('.hold')){
  button.addEventListener('pointerdown',e=>{if(!active||e.button>0)return;e.preventDefault();button.setPointerCapture(e.pointerId);held.set(e.pointerId,button.dataset.key);button.classList.add('held');});
  const release=e=>{held.delete(e.pointerId);if(![...held.values()].includes(button.dataset.key))button.classList.remove('held');};
  for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);
  button.addEventListener('contextmenu',e=>e.preventDefault());
 }
 for(const button of root.querySelectorAll('[data-tap]')){
  let start=null;
  button.addEventListener('pointerdown',e=>{if(!active)return;e.preventDefault();button.setPointerCapture(e.pointerId);start=[e.clientX,e.clientY];});
  button.addEventListener('pointerup',e=>{if(!start)return;const moved=Math.hypot(e.clientX-start[0],e.clientY-start[1]);start=null;if(moved<=10)onTap(button.dataset.tap);});
  button.addEventListener('pointercancel',()=>{start=null;});
 }
 for(const type of ['blur','pagehide'])window.addEventListener(type,reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 return {wanted,keys,reset,setActive(v){active=v;root.hidden=!(v&&wanted);document.body.classList.toggle('touch-active',v&&wanted);if(!v)reset();},setLeftHanded(v){root.classList.toggle('left-handed',!!v);}};
}
