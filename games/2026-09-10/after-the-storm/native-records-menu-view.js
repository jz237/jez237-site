import {createNativeNameMenuClock} from './native-name-menu-runtime.js';
import {createNativeRecordsView} from './native-records-view.js';
// D-pad and A/B masks of the original controller word.
const codes={ArrowUp:0x800,ArrowDown:0x400,ArrowLeft:0x200,ArrowRight:0x100,Enter:0x8000,Space:0x8000,Backspace:0x4000,Escape:0x4000};
// The original's words, read from its pre-rendered label images: the shared
// segment-1 bank (fonts 0 and 1) and the records screen's own bank (fonts 2
// and 3). Course names come from the game's course list, which matches.
const labels=[
 {3:'NORMAL',17:'HARD',18:'EXPERT',36:'REVERSE',13:'BEST LAP'},
 {3:'TIME',17:'LEVEL',31:'RANK',32:'RIDER',62:'SCORE',63:'END'},
 {7:'VIEW RECORDS'},
 {5:'TIME RANKS - TOP 3',4:'SCORE RANKS - TOP 3',32:'REVERSE - TOP TIMES'}];

/** In-dialog presentation of the original records browser (state66/67). The
 * runtime frame owns input, slides, record tables and the exit destination;
 * the host supplies course names and rider portraits at display resolution. */
export function createNativeRecordsMenuView({before,courseName,portrait,onComplete=()=>{},onSelect=()=>{}}){
 const root=document.createElement('section');root.id='nativeRecordsMenu';root.hidden=true;root.setAttribute('aria-label','Course records');
 const style=document.createElement('style');style.textContent=`
 #nativeRecordsMenu{margin:14px 0;color:#eaf8fb;text-align:center}
 #nativeRecordsMenu .records-frame{position:relative;width:100%;aspect-ratio:4/3;max-height:min(62vh,520px);margin:0 auto;border-radius:12px;overflow:hidden;background:#000}
 #nativeRecordsMenu .records-shade{position:absolute;inset:0;pointer-events:none;background:#000;opacity:0}
 #nativeRecordsMenu .records-controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:12px 0}
 #nativeRecordsMenu .records-controls button{margin:0;min-width:56px;touch-action:manipulation}
 #nativeRecordsMenu .records-help{font-size:12px;line-height:1.6;color:#a9c8cf;margin:8px 0}
 #nativeRecordsMenu [hidden]{display:none!important}`;
 const frame=document.createElement('div');frame.className='records-frame';
 const shade=document.createElement('div');shade.className='records-shade';
 const controls=document.createElement('div');controls.className='records-controls';
 const help=document.createElement('p');help.className='records-help';help.textContent='Arrows browse · Enter select · Backspace back';
 let runtime=null,enabled=false,held=new Set(),pulses=[],completed=false,previous=null,size='';
 const view=createNativeRecordsView({parent:frame,labelForToken:(token,{font})=>{
  if(font===1&&token>=8&&token<=16)return courseName(token-8).toUpperCase();
  if(font===2&&(token>=8&&token<=15||token===22))return courseName(token===22?8:token-8).toUpperCase();
  if(!Object.hasOwn(labels[font]??{},token))throw new RangeError(`Unknown records label ${font}:${token}`);return labels[font][token];
 },renderRider:({avatarIndex,bounds,document:doc})=>{
  const rect=frame.getBoundingClientRect(),scale=Math.min(rect.width/320,rect.height/240)*(doc.defaultView.devicePixelRatio||1);
  const image=doc.createElementNS('http://www.w3.org/2000/svg','image');
  for(const [key,value]of Object.entries({...bounds,preserveAspectRatio:'xMidYMid meet',href:portrait(avatarIndex,bounds.width*scale,bounds.height*scale)}))image.setAttribute(key,String(value));
  return image;
 }});
 frame.append(shade);
 const clock=createNativeNameMenuClock();
 for(const [label,mask,name]of [['↑',0x800,'Up'],['↓',0x400,'Down'],['←',0x200,'Left'],['→',0x100,'Right'],['Select',0x8000,'Select'],['Back',0x4000,'Back']]){
  const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label',name);
  button.onclick=()=>{if(enabled)pulses.push(mask,0);};controls.append(button);
 }
 root.append(style,frame,controls,help);before.before(root);
 function release(){held.clear();pulses=[];clock.reset();}
 window.addEventListener('keydown',event=>{
  if(!enabled||root.hidden||document.hidden||event.altKey||event.metaKey||event.ctrlKey||!(event.code in codes))return;
  const control=event.target.closest?.('button,input,select,textarea,[contenteditable="true"]');
  if(control&&(!root.contains(control)||event.code==='Enter'||event.code==='Space'))return;
  event.preventDefault();event.stopImmediatePropagation();
  if(!event.repeat&&!held.has(event.code))pulses.push(codes[event.code],0);
  held.add(event.code);
 },true);
 window.addEventListener('keyup',event=>{if(held.delete(event.code)){event.preventDefault();event.stopImmediatePropagation();}},true);
 window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
 function draw(q){
  const rect=frame.getBoundingClientRect(),dimensions=`${rect.width}:${rect.height}:${devicePixelRatio}`;
  if(q.draw.kind==='black'){view.clear();previous=null;}
  else if(q.draw.records&&(q.draw.records!==previous||dimensions!==size)){view.render(q.draw.records);previous=q.draw.records;size=dimensions;}
  const fade=q.view.fade;shade.style.opacity=String(q.draw.kind==='black'?1:fade.kind?Math.max(0,Math.min(1,fade.rgba[3]/255)):0);
  root.dataset.stage=String(q.view.stage);root.dataset.category=String(q.view.category);root.dataset.course=String(q.view.course);root.dataset.recordType=String(q.view.recordType);
 }
 return {root,start(nextRuntime){release();runtime=nextRuntime;completed=false;enabled=true;previous=null;root.hidden=false;controls.hidden=false;help.hidden=false;view.clear();shade.style.opacity='1';},
  reset(){release();enabled=false;runtime=null;previous=null;root.hidden=true;view.clear();},
  advance(seconds,active,pad){
   enabled=Boolean(runtime&&!completed&&active&&!root.hidden);
   if(!enabled){release();return;}
   clock.advance(seconds,true,()=>{
    let mask=pulses.length?pulses.shift():0;for(const code of held)mask|=codes[code];
    if(pad?.buttons?.[0]?.pressed||pad?.buttons?.[9]?.pressed)mask|=0x8000;
    if(pad?.buttons?.[1]?.pressed)mask|=0x4000;
    for(const [i,m]of [[12,0x800],[13,0x400],[14,0x200],[15,0x100]])if(pad?.buttons?.[i]?.pressed)mask|=m;
    const axis=i=>Number.isFinite(pad?.axes?.[i])?Math.max(-1,Math.min(1,pad.axes[i])):0;
    const q=runtime.advanceRecordsBrowser({heldButtons:mask,rawXNative:Math.round(axis(0)*80),rawYNative:Math.round(-axis(1)*80)});draw(q);
    if(q.effects.some(e=>e.consumer==='800c37f4'))onSelect();
    if(q.handoff){completed=true;enabled=false;release();controls.hidden=true;help.hidden=true;onComplete(q.handoff);return false;}
   });
  }};
}
