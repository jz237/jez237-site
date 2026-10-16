import {createNativeNameMenuClock} from './native-name-menu-runtime.js';
import {decodeNativeRaceStartTransform} from './native-race-start-transform.js';
const codes={ArrowLeft:0x200,ArrowRight:0x100,Enter:0x8000,Space:0x8000,Backspace:0x4000,Delete:0x4000};
const buffer=new DataView(new ArrayBuffer(4));
function float(word){buffer.setUint32(0,word);return buffer.getFloat32(0);}

/** High-resolution SVG presentation of the source wheel positions. The
 * original numeric matrices/selection drive drawing; SVG glyphs and a small
 * decorative water surface replace cartridge art and graphics microcode. */
export function createNativeNameMenuView({before,onComplete=()=>{},onSelect=()=>{}}){
 const root=document.createElement('section');root.id='nativeNameMenu';root.hidden=true;root.setAttribute('aria-label','Enter record initials');
 const style=document.createElement('style');style.textContent=`
 #nativeNameMenu{margin:18px 0;color:#eaf8fb;text-align:center}
 #nativeNameMenu .name-initials{font-size:38px;letter-spacing:.35em;font-weight:700;min-height:48px;color:#f5d38b}
 #nativeNameMenu svg{display:block;width:100%;max-height:235px;overflow:hidden;border-radius:14px;background:linear-gradient(#173b49,#0a2532)}
 #nativeNameMenu .name-controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:12px 0}
 #nativeNameMenu .name-controls button{margin:0;min-width:64px;touch-action:manipulation}
 #nativeNameMenu .name-help{font-size:12px;line-height:1.6;color:#a9c8cf;margin:8px 0}
 #nativeNameMenu [hidden]{display:none!important}`;
 const initials=document.createElement('div');initials.className='name-initials';initials.setAttribute('aria-label','Initials');
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 260');svg.setAttribute('aria-hidden','true');
 const water=document.createElementNS(ns,'path');water.setAttribute('d','M0 143 Q75 132 150 143 T300 143 T450 143 T600 143 V260 H0Z');water.setAttribute('fill','#3d92a1');water.setAttribute('opacity','.18');svg.append(water);
 const glyphs=Array.from({length:16},()=>{const text=document.createElementNS(ns,'text');text.setAttribute('text-anchor','middle');text.setAttribute('dominant-baseline','central');text.setAttribute('font-family','inherit');text.setAttribute('font-weight','700');svg.append(text);return text;});
 const status=document.createElement('p');status.className='name-help';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const controls=document.createElement('div');controls.className='name-controls';
 const help=document.createElement('p');help.className='name-help';help.textContent='← / → choose · Enter select · Backspace delete · choose END to finish';
 let runtime=null,enabled=false,held=new Set(),pulses=[],completed=false;
 const clock=createNativeNameMenuClock();
 for(const [label,mask]of [['←',0x200],['Select',0x8000],['Delete',0x4000],['→',0x100]]){
  const button=document.createElement('button');button.type='button';button.textContent=label;
  button.setAttribute('aria-label',label==='←'?'Previous letter':label==='→'?'Next letter':label);
  button.onclick=()=>{if(enabled)pulses.push(mask,0);};controls.append(button);
 }
 root.append(style,initials,svg,status,controls,help);before.before(root);
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
 function draw(frame){
  const view=frame.draw;root.dataset.phase=String(frame.view.phase);root.dataset.initials=frame.view.initials;
  initials.textContent=(view.initials||'').padEnd(3,'_');
  const message=view.phase===0?'Choose up to three initials.':view.phase===7?'Finishing…':`Selected: ${view.labels[view.selected]===' '?'SPACE':view.labels[view.selected]}. Initials: ${view.initials||'empty'}.`;
  if(status.textContent!==message)status.textContent=message;
  for(const {slot,matrixWords}of frame.matrices){
   const glyph=glyphs[slot],values=decodeNativeRaceStartTransform({matrixWords}).floatWords.map(float),[x,y]=values.slice(12,14);
   const visible=(slot-view.first+16)%16<=6;glyph.style.display=visible?'':'none';glyph.textContent=view.labels[slot]===' '?'␣':view.labels[slot];
   glyph.setAttribute('x',String(300+x*.37));glyph.setAttribute('y',String(143-y*.38));
   glyph.setAttribute('fill',slot===view.selected?'#f5d38b':'#e5f4f7');glyph.setAttribute('font-size',slot===view.selected?'38':'27');
   glyph.setAttribute('opacity',String(y<0?Math.max(.15,1+y/440):1));
  }
 }
 return {root,start(nextRuntime){release();runtime=nextRuntime;completed=false;enabled=true;root.hidden=false;svg.style.display="";controls.hidden=false;help.hidden=false;
   root.dataset.phase='0';root.dataset.initials='';initials.textContent='___';status.textContent='Choose up to three initials.';glyphs.forEach(g=>g.style.display='none');},
  reset(){release();enabled=false;runtime=null;root.hidden=true;},
  advance(seconds,active,pad){
   enabled=Boolean(runtime&&!completed&&active&&!root.hidden);
   if(!enabled){release();return;}
   clock.advance(seconds,true,()=>{
    let mask=pulses.length?pulses.shift():0;for(const code of held)mask|=codes[code];
    if(pad?.buttons?.[0]?.pressed||pad?.buttons?.[9]?.pressed)mask|=0x8000;
    if(pad?.buttons?.[1]?.pressed)mask|=0x4000;
    if(pad?.buttons?.[14]?.pressed)mask|=0x200;if(pad?.buttons?.[15]?.pressed)mask|=0x100;
    const axis=Number.isFinite(pad?.axes?.[0])?Math.max(-1,Math.min(1,pad.axes[0])):0;
    const frame=runtime.advanceNameEntry({heldButtons:mask,rawXNative:Math.round(axis*80),rawYNative:0});draw(frame);
    if(frame.effects.some(e=>e.consumer==='800c37f4'))onSelect();
    if(!frame.view.active){completed=true;enabled=false;release();initials.textContent=frame.view.initials;status.textContent='Initials entered for this preview run.';
     svg.style.display='none';controls.hidden=true;help.hidden=true;onComplete(frame.view.initials);return false;}
   });
  }};
}
