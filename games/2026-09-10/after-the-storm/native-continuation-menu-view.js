import {createNativeNameMenuClock} from './native-name-menu-runtime.js';
const masks={ArrowUp:0x800,KeyW:0x800,ArrowDown:0x400,KeyS:0x400,Enter:0x8000,Space:0x8000};
const choices=[['Restart race','Take another run at this course.'],['Choose rider','Change your rider or tune.'],
 ['Choose course','Find your next stretch of water.'],['Main menu','Return to race setup.']];

/** High-resolution HTML presentation of the original four-choice controller.
 * Clicking a choice queues real navigation/confirmation edges. The curtain
 * uses source timing and movement, with modern CSS artwork. */
export function createNativeContinuationMenuView({before,isActive=()=>true,onSelect=()=>{},onComplete=()=>{}}){
 const root=document.createElement('section');root.id='nativeContinuationMenu';root.hidden=true;root.setAttribute('aria-label','Next race');
 const style=document.createElement('style');style.textContent=`
 #nativeContinuationMenu{margin:18px 0;overflow:hidden;color:#eaf8fb}
 #nativeContinuationMenu .continuation-choices{display:grid;gap:8px}
 #nativeContinuationMenu .continuation-choice{width:100%;text-align:left;border:1px solid #ffffff25;padding:13px 15px;border-radius:10px;background:#ffffff08;color:inherit}
 #nativeContinuationMenu .continuation-choice[aria-current=true]{border-color:#79d6eb;background:#79d6eb22;box-shadow:inset 3px 0 #79d6eb}
 #nativeContinuationMenu .continuation-choice strong{display:block;font-size:15px}
 #nativeContinuationMenu .continuation-choice small{display:block;margin-top:4px;color:#a9c8cf}
 #nativeContinuationMenu .continuation-status{font-size:12px;color:#a9c8cf;min-height:18px;margin:12px 0}
 .native-continuation-curtain{position:fixed;inset:0;z-index:10000;pointer-events:none;background:linear-gradient(150deg,#061c28,#103e4c 65%,#1b6170);transform:translateY(-100%)}
 .native-continuation-curtain[hidden]{display:none}
 `;
 const list=document.createElement('div');list.className='continuation-choices';
 const status=document.createElement('p');status.className='continuation-status';status.setAttribute('role','status');
 const curtain=document.createElement('div');curtain.className='native-continuation-curtain';curtain.hidden=true;curtain.setAttribute('aria-hidden','true');
 root.append(style,list,status);before.before(root);document.body.append(curtain);
 const clock=createNativeNameMenuClock();let runtime=null,completed=false,pulses=[],held=new Set(),requested=null,releaseClick=false;
 const acceptsInput=()=>Boolean(runtime&&!completed&&!root.hidden&&!document.hidden&&isActive());
 const buttons=choices.map(([title,detail],index)=>{
  const button=document.createElement('button');button.type='button';button.className='continuation-choice';
  const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('small');small.textContent=detail;button.append(strong,small);
  button.onclick=()=>{if(acceptsInput()&&!button.disabled){requested=index;releaseClick=true;pulses=[];held.clear();}};
  list.append(button);return button;
 });
 function release(){held.clear();pulses=[];requested=null;releaseClick=false;clock.reset();}
 window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
 window.addEventListener('keydown',event=>{
  if(!acceptsInput()||event.altKey||event.metaKey||event.ctrlKey||!masks[event.code])return;
  if(event.target.closest?.('input,select,textarea,[contenteditable="true"]'))return;
  // Native button activation retains keyboard access to Options and choices.
  if(event.target.closest?.('button')&&(!root.contains(event.target)||['Enter','Space'].includes(event.code)))return;
  event.preventDefault();event.stopImmediatePropagation();requested=null;
  if(!event.repeat&&!held.has(event.code))pulses.push(masks[event.code],0);held.add(event.code);
 },true);
 window.addEventListener('keyup',event=>{if(held.delete(event.code)){event.preventDefault();event.stopImmediatePropagation();}},true);
 function draw(view){
  const moved=Number(root.dataset.selection)!==view.selection,focusWithin=root.contains(document.activeElement);
  root.dataset.phase=view.exiting?'exiting':String(view.phase);root.dataset.selection=String(view.selection);
  buttons.forEach((button,i)=>{
   button.disabled=view.phase!==1||view.exiting;button.setAttribute('aria-current',String(i===view.selection));
   button.style.transform=`translateX(${(view[i%2?'xB':'xA']-76)/244*100}%)`;
  });
  if(moved&&focusWithin&&view.phase===1&&!view.exiting)buttons[view.selection]?.focus({preventScroll:true});
  status.textContent=view.exiting?'Setting up your next race…':view.phase===1?'↑ / ↓ to choose · Enter or A / Start to continue.':'Choose what comes next.';
  curtain.hidden=!view.exiting;
  // The original curtain travels from-265 to-85. Completion resets that
  // record, so explicitly keep the modern curtain closed for its handoff.
  const progress=view.fade.completion===1?1:Math.max(0,Math.min(1,(view.fade.y+265)/180));
  curtain.style.transform=`translateY(${(progress-1)*100}%)`;
 }
 return {root,start(nextRuntime){release();runtime=nextRuntime;completed=false;root.hidden=false;curtain.hidden=true;list.style.visibility='hidden';status.textContent='Choose what comes next.';buttons.forEach(b=>b.disabled=true);},
  reset(){release();runtime=null;completed=false;root.hidden=true;curtain.hidden=true;},
  advance(seconds,active,pads=[]){
   if(!runtime||completed||!active||root.hidden){release();return;}
   clock.advance(seconds,true,()=>{
    const before=runtime.continuationMenuView();let mask=pulses.length?pulses.shift():0;
    for(const code of held)mask|=masks[code];
    if(requested!==null&&before.phase===1&&!before.exiting){
     if(releaseClick){mask=0;releaseClick=false;}
     else if(before.selection===requested){mask=0x8000;requested=null;}
     else{mask=0x400;releaseClick=true;}
    }
    const pad=pads[0];if(pad?.buttons?.[0]?.pressed)mask|=0x8000;if(pad?.buttons?.[9]?.pressed)mask|=0x1000;
    if(pad?.buttons?.[12]?.pressed)mask|=0x800;if(pad?.buttons?.[13]?.pressed)mask|=0x400;
    const axis=pad?.axes?.[1]??0;
    const frame=runtime.advanceContinuationMenu([{heldButtons:mask,rawXNative:0,rawYNative:Number.isFinite(axis)?Math.round(-Math.max(-1,Math.min(1,axis))*80):0}]);
    list.style.visibility='';draw({...frame.draw,exiting:frame.view.exiting,selection:frame.view.selection,fade:frame.view.fade});
    if(frame.effects.some(e=>e.consumer==='800c37f4'))onSelect();
    if(frame.handoff){completed=true;release();onComplete(frame.handoff);return false;}
   });
  }};
}
