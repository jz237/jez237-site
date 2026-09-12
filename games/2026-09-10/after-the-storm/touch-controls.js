import {steeringAxis,touchHelm} from './riding-controls.js';
// Separate pointer ownership prevents one thumb release from cancelling another.
export function touchState(){
 const pointers=new Map();
 return {
  press(id,key){pointers.set(id,key);},
  release(id){pointers.delete(id);},
  clear(){pointers.clear();},
  keys(){return Object.fromEntries([...pointers.values()].map(key=>[key,true]));}
 };
}

export function mountTouchControls({onCamera}){
 const held=touchState(),root=document.createElement('nav');
 let steer=0,steerPointer=null,autoThrottle=false;try{autoThrottle=localStorage.getItem('after-the-storm-auto-throttle')==='true';}catch{}
 const saveAuto=()=>{try{localStorage.setItem('after-the-storm-auto-throttle',String(autoThrottle));}catch{}};
 root.id='touchControls';root.hidden=true;root.setAttribute('aria-label','Touch driving controls');
 root.innerHTML=`<div class="touch-tools"><button type="button" data-key="KeyR">Rescue</button><button type="button" id="touchCamera">Camera</button><button type="button" id="touchAuto" aria-pressed="false">Auto: OFF</button><button type="button" id="touchTricks" aria-expanded="false">Stunts</button></div>
 <div class="touch-tricks" hidden><button data-key="Digit1">Flip</button><button data-key="Digit2">Roll L</button><button data-key="Digit3">Roll R</button><button data-key="KeyF">Dive</button><button data-key="ShiftLeft">Slide</button><button data-key="KeyQ">Bow up</button><button data-key="KeyE">Bow down</button></div>
 <div class="touch-driving"><div class="touch-steering"><div id="touchStick" role="slider" aria-label="Proportional steering" aria-valuemin="-100" aria-valuemax="100" aria-valuenow="0" tabindex="0"><span class="stick-track" aria-hidden="true"><span>◀</span><span>▶</span></span><span id="touchKnob"></span></div><small>DRAG TO CARVE</small></div><div class="touch-pedals"><button data-key="KeyB">Absorb</button><button data-key="Space">Brake</button><button class="touch-gas" data-key="KeyW">GO</button></div></div>`;
 document.body.append(root);
 const choice=document.createElement('label');choice.className='touch-choice';
 choice.innerHTML='<input type="checkbox" id="touchEnabled"> Phone controls <small>Drag the steering pad gently for wide turns, farther for a tight carve. Hold GO, or switch Auto on. Brake always cuts throttle. Landscape recommended.</small>';
 document.querySelector('.modebuttons').before(choice);
 const toggle=choice.querySelector('input');toggle.checked=navigator.maxTouchPoints>0||matchMedia('(pointer: coarse)').matches;
 let active=false;
 const stick=root.querySelector('#touchStick'),knob=root.querySelector('#touchKnob'),autoButton=root.querySelector('#touchAuto');
 function centre(){steer=0;steerPointer=null;knob.style.transform='translate(-50%,-50%)';stick.setAttribute('aria-valuenow','0');}
 function reset(){centre();held.clear();root.querySelectorAll('[data-key]').forEach(b=>{b.classList.remove('held');b.setAttribute('aria-pressed','false');});}
 function update(){const show=toggle.checked&&active;root.hidden=!show;document.body.classList.toggle('touch-driving-active',show);document.body.classList.toggle('touch-stunts-open',show&&!root.querySelector('.touch-tricks').hidden);if(!show)reset();}
 toggle.addEventListener('change',update);
 for(const button of root.querySelectorAll('[data-key]')){
  button.type='button';button.setAttribute('aria-pressed','false');
  button.addEventListener('pointerdown',e=>{
   if(!active||root.hidden||e.button>0)return;
   e.preventDefault();button.setPointerCapture(e.pointerId);held.press(e.pointerId,button.dataset.key);button.classList.add('held');button.setAttribute('aria-pressed','true');
  });
  const release=e=>{held.release(e.pointerId);const down=!!held.keys()[button.dataset.key];button.classList.toggle('held',down);button.setAttribute('aria-pressed',String(down));};
  for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);
  button.addEventListener('contextmenu',e=>e.preventDefault());
 }
 function moveStick(e){if(e.pointerId!==steerPointer)return;const bounds=stick.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-bounds.left-bounds.width/2)/(bounds.width*.36)));steer=-steeringAxis(x);knob.style.transform=`translate(calc(-50% + ${x*38}px),-50%)`;stick.setAttribute('aria-valuenow',String(Math.round(x*100)));}
 stick.addEventListener('pointerdown',e=>{if(!active||root.hidden||steerPointer!==null||e.button>0)return;e.preventDefault();steerPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);});
 stick.addEventListener('pointermove',moveStick);
 for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,e=>{if(e.pointerId===steerPointer)centre();});
 stick.addEventListener('contextmenu',e=>e.preventDefault());
 const paintAuto=()=>{autoButton.textContent=autoThrottle?'Auto: ON':'Auto: OFF';autoButton.setAttribute('aria-pressed',String(autoThrottle));};
 autoButton.onclick=()=>{autoThrottle=!autoThrottle;saveAuto();paintAuto();};paintAuto();
 root.querySelector('#touchCamera').onclick=onCamera;
 root.querySelector('#touchTricks').onclick=e=>{const tray=root.querySelector('.touch-tricks');tray.hidden=!tray.hidden;e.currentTarget.setAttribute('aria-expanded',String(!tray.hidden));update();if(tray.hidden)reset();};
 window.addEventListener('blur',reset);window.addEventListener('pagehide',reset);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
 window.addEventListener('resize',reset);
 return {keys:()=>held.keys(),apply:input=>touchHelm(input,{enabled:toggle.checked,active,steer,steering:steerPointer!==null,autoThrottle}),reset,setActive(value){if(active!==value){active=value;update();}}};
}
