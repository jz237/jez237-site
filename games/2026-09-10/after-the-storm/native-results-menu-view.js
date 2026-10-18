import {createNativeNameMenuClock} from './native-name-menu-runtime.js';
const confirmCodes=new Set(['Enter','Space']);
const format=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`;

/** Responsive HTML record table with source phase/offset timing. It is a
 * high-resolution presentation, not an emulation of original GPU geometry. */
export function createNativeResultsMenuView({before,riderName,stunt=false,isActive=()=>true,onSelect=()=>{},onComplete=()=>{}}){
 const root=document.createElement('section');root.id=stunt?'nativeStuntRecordMenu':'nativeResultsMenu';root.hidden=true;root.setAttribute('aria-label',stunt?'Stunt records':'Race records');
 const style=document.createElement('style');style.textContent=`
 #nativeResultsMenu{margin:18px 0;overflow:hidden;color:#eaf8fb}
 #nativeResultsMenu .result-table{display:grid;gap:7px}
 #nativeResultsMenu .result-row{display:grid;grid-template-columns:60px minmax(0,1fr) 42px 100px;align-items:center;gap:8px;padding:10px;border-radius:9px;background:#ffffff09}
 #nativeResultsMenu .result-row[data-highlight=record]{background:#f5d38b1c;color:#f5d38b}
 #nativeResultsMenu .result-row[data-highlight=current]{background:#79d6eb20}
 #nativeResultsMenu .result-rider{overflow:hidden;text-overflow:ellipsis}
 #nativeResultsMenu .result-detail{display:block;font-size:10px;opacity:.7;margin-top:3px}
 #nativeResultsMenu .result-time{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
 #nativeResultsMenu .result-initials{font-weight:700;letter-spacing:.08em}
 #nativeResultsMenu .result-status{font-size:12px;color:#a9c8cf;min-height:18px;margin:12px 0}
 #nativeResultsMenu .result-continue{width:100%}
 @media(max-width:440px){#nativeResultsMenu .result-row{grid-template-columns:45px minmax(0,1fr) 32px 86px;gap:5px;padding:9px 6px;font-size:12px}}
 `.replaceAll('#nativeResultsMenu','#'+root.id);
 const table=document.createElement('div');table.className='result-table';table.setAttribute('role','table');table.setAttribute('aria-label','Course records');
 const status=document.createElement('p');status.className='result-status';status.setAttribute('role','status');
 const button=document.createElement('button');button.type='button';button.className='result-continue primary';button.textContent='Continue';
 root.append(style,table,status,button);before.before(root);
 const clock=createNativeNameMenuClock();let runtime=null,enabled=false,completed=false,pulses=[],held=new Set(),rows=[];
 function release(){held.clear();pulses=[];clock.reset();}
 const acceptsInput=()=>Boolean(runtime&&!completed&&!root.hidden&&!document.hidden&&isActive());
 button.onclick=()=>{if(acceptsInput()&&!button.disabled)pulses.push(0x8000,0);};
 window.addEventListener('keydown',event=>{
  if(!acceptsInput()||event.altKey||event.metaKey||event.ctrlKey||!confirmCodes.has(event.code))return;
  if(event.target.closest?.('button,input,select,textarea,[contenteditable="true"]'))return;
  event.preventDefault();event.stopImmediatePropagation();if(!event.repeat&&!held.has(event.code))pulses.push(0x8000,0);held.add(event.code);
 },true);
 window.addEventListener('keyup',event=>{if(held.delete(event.code)){event.preventDefault();event.stopImmediatePropagation();}},true);
 window.addEventListener('blur',release);document.addEventListener('visibilitychange',release);
 function draw(view){
  root.dataset.phase=String(view.phase);
  for(const {element,offset}of rows)element.style.transform=`translateX(${(view[offset]-20)/280*100}%)`;
  button.disabled=view.phase!==2;
  status.textContent=view.phase===2?'Enter or A / Start to continue.':view.phase<2?'Course records':'Continuing…';
 }
 return {root,start(nextRuntime){
   release();runtime=nextRuntime;completed=false;enabled=true;root.hidden=false;button.hidden=false;table.replaceChildren();rows=[];
   const book=stunt?runtime.stuntRecordView():runtime.resultsRecordView();
   for(const record of book.rows){
    const row=document.createElement('div');row.className='result-row';row.dataset.highlight=record.highlight;row.setAttribute('role','row');
    const empty=record.placeholder||!record.initials&&(stunt?record.score===0&&record.kind!=='current':record.timeMs===599999);
    const label=document.createElement('span');label.textContent=record.kind==='lap'?'Best lap':record.kind==='current'?'Your run':String(record.rank).padStart(2,'0');
    const rider=document.createElement('span');rider.className='result-rider';rider.textContent=empty?'—':riderName(record.rider);
    const detail=document.createElement('small');detail.className='result-detail';detail.textContent=empty?'':`${stunt?'Stunt':book.reverse?'Reverse':['Normal','Hard','Expert'][record.difficulty]??'Race'} · ${record.tuned?'Custom tune':'Standard'}`;rider.append(detail);
    const initials=document.createElement('span');initials.className='result-initials';initials.textContent=empty?'—':record.initials||'YOU';
    const time=document.createElement('span');time.className='result-time';time.textContent=empty?'—':stunt?record.score.toLocaleString():format(record.timeMs);
    for(const cell of [label,rider,initials,time])cell.setAttribute('role','cell');row.append(label,rider,initials,time);table.append(row);rows.push({element:row,offset:record.offset});
   }
   // Wait for the first source initialization before revealing its offsets.
   table.style.visibility='hidden';button.disabled=true;status.textContent='Course records';
  },reset(){release();runtime=null;enabled=false;root.hidden=true;},advance(seconds,active,pads=[]){
   enabled=Boolean(runtime&&!completed&&active&&!root.hidden);if(!enabled){release();return;}
   clock.advance(seconds,true,()=>{
    let keyboard=pulses.length?pulses.shift():0;if(held.size)keyboard|=0x8000;
    const controllers=[0,1].map(i=>{const pad=pads[i];let mask=i===0?keyboard:0;
     if(pad?.buttons?.[0]?.pressed)mask|=0x8000;if(pad?.buttons?.[9]?.pressed)mask|=0x1000;
     return {heldButtons:mask,rawXNative:0,rawYNative:0};});
    const frame=stunt?runtime.advanceStuntRecordMenu(controllers):runtime.advanceResultsMenu(controllers);table.style.visibility='';draw(frame.draw);root.dataset.phase=String(frame.view.phase);
    if(frame.effects.some(e=>e.consumer==='800c37f4'))onSelect();
    if(!frame.view.active){completed=true;enabled=false;release();button.hidden=true;status.textContent='Choose Restart race or Rider & mode select below.';onComplete();return false;}
   });
  }};
}
