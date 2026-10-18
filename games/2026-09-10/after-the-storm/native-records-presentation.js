// Independent layout of the original records browser (ovl_i9 6750/6CC8/71AC).
// Logical source coordinates describe placement; they never set render resolution.
const U32=0xffffffff;
function integer(v,n,min=0,max=U32){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function at(a,n,i,label){if(!Array.isArray(a)||a.length!==n||!Number.isInteger(i)||i<0||i>=n)throw new RangeError(`Expected reached ${label}[${n}]`);return integer(a[i],`${label}[${i}]`);}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const add=(...values)=>values.reduce((a,b)=>(a+b)|0,0);

/** Reached records, labels and retained overlay words are supplied by the host.
 * Rider previews remain explicit consumers of the selected record's avatar.
 * No record migration, controller sampling, persistence or GPU calls occur here.
 */
export function prepareNativeRecordsPresentation(value,sourceViews={}){
 const commands=[],panelSlots=[];
 const data=a=>at(value.recordsBrowserWords80c0,62,(a-0x80c0)/4,'recordsBrowserWords80c0');
 const race=a=>at(value.raceWords1f94,1693,(a-0x1f94)/4,'raceWords1f94');
 const vector=(key,i)=>at(sourceViews[key],9,i,key);
 const style=(mode,intensity=255)=>commands.push({kind:'style',mode,colors:[intensity,intensity,intensity,...Array(9).fill(255)]});
 const panel=(x,y,width,height)=>commands.push({kind:'panel',x,y,width,height});
 const label=(font,token,x,y,variant=0)=>commands.push({kind:'label',font,token,x,y,variant});
 const text=(font,text,x,y)=>commands.push({kind:'text',font,text,x,y});
 const time=(value,x,y)=>commands.push({kind:'time',font:2,value,x,y});
 const name=a=>{
  const v=race(a);let name='';
  for(let shift=24;shift>=0;shift-=8){const byte=(v>>>shift)&255;if(byte===0)return name;name+=String.fromCharCode(byte);}
  throw new RangeError('Record initials must terminate within their retained four-byte field');
 };
 const variant=a=>data(0x8198+integer(race(a),'record variant',0,2)*4);
 const arrow=(x,y,direction)=>{
  const coord=v=>(Math.max(0,v<<2)&4095)/4;
  commands.push({kind:'arrow',direction,x1:coord(add(x,152)),y1:coord(add(y,direction==='up'?21:211)),x2:coord(add(x,160)),y2:coord(add(y,direction==='up'?29:219))});
 };
 function overview(x){
  for(let i=0;i<9;i++)panel(add(x,28,Math.floor(i/5)*133),95+(i%5)*18,131,16);
  for(let i=0;i<3;i++)panel(add(x,28,i*89),68,87,16);
  style(0);label(2,7,add(x,72),29);
  for(let i=0;i<3;i++){
   style(i===data(0x80c4)?6:0);
   label(1,data(0x8138+i*4),add(x,data(0x8144+i*4)|0,i*89,52),71);
  }
  for(let i=0;i<9;i++){
   const disabled=data(0x80c4)===0&&i===0;
   style(disabled?7:data(0x80c0)!==0&&i===data(0x80c8)?6:0,128);
   const course=integer(vector('courseOrderAad8',i),'overview course',0,8);
   label(1,vector('courseNameTokensAa10',course),add(x,data(0x8150+course*4)|0,Math.floor(i/5)*133,55),98+(i%5)*18);
  }
 }
 function detail(index,course,kind,x,y){
  const timed=kind===1||kind===3;
  panel(add(x,38),add(y,70),244,24);panel(add(x,28),add(y,104),264,16);
  for(let r=0;r<3;r++)panel(add(x,28),add(y,126,r*18),264,16);
  if(timed){panel(add(x,28),add(y,183),264,10);panel(add(x,28),add(y,194),264,16);}
  commands.push({kind:'fillColor',rgba:[0,0,0,255]});
  const box=r=>commands.push({kind:'fill',x1:add(x,60),y1:add(y,r===3?196:128+r*18),x2:add(x,86),y2:add(y,r===3?208:140+r*18)});
  for(let r=0;r<3;r++)box(r);if(timed)box(3);
  commands.push({kind:'clip',x1:8,y1:20,x2:311,y2:219});
  const record=r=>kind===1?0x1ff0+course*60+r*20:kind===3?0x23b0+course*20:0x26e8+course*48+r*16;
  const preview=(a,r)=>commands.push({kind:'riderPreview',avatarIndex:race(a+4),viewportIndex:index*4+r});
  for(let r=0;r<(kind===3?1:3);r++)preview(record(r),r);
  if(kind===1)preview(0x22c0+course*20,3);
  style(0);label(3,kind===1?5:kind===3?32:4,add(x,kind===1?61:51),add(y,74),2);
  label(1,31,add(x,43),add(y,107));
  if(timed){label(1,17,add(x,95),add(y,107));label(1,32,add(x,160),add(y,107));label(0,13,add(x,38),add(y,184));}
  else label(1,32,add(x,139),add(y,107));
  label(1,timed?3:62,add(x,238),add(y,107));
  for(let r=0;r<3;r++){
   const a=record(r),rowY=add(y,128,r*18);
   style(data(0x81a4)!==0&&race(0x2660+course*4)===r+1?6:kind===3&&r!==0?7:0,128);
   if(kind===1){time(race(a),add(x,215),rowY);text(2,name(a+16),add(x,160),rowY);label(0,variant(a+12),add(x,95),add(rowY,1));}
   else if(kind===3){
    if(r===0){time(race(a),add(x,215),rowY);text(2,name(a+16),add(x,160),rowY);}
    else{text(2,"-'--@---",add(x,215),rowY);text(2,'---',add(x,160),rowY);}
    label(0,36,add(x,95),add(rowY,1));
   }else{commands.push({kind:'score',font:2,value:race(a),x:add(x,228),y:rowY});text(2,name(a+12),add(x,139),rowY);}
   text(2,kind===3&&r!==0?'-':String(r+1),add(x,37,kind===3?2:r===2?-1:0),rowY);
   if(kind!==3||r===0)text(1,race(a+8)===0?'N':'C',add(x,79),rowY);
  }
  if(kind===1){
   const a=0x22c0+course*20;
   // With no post-race context, the lap inherits the last row's style.
   if(data(0x81a4)!==0)style(race(0x2690+course*4)!==0?6:0);
   text(1,race(a+8)===0?'N':'C',add(x,79),add(y,196));text(2,name(a+16),add(x,160),add(y,196));
   time(race(a),add(x,215),add(y,196));label(0,variant(a+12),add(x,95),add(y,197));
  }else if(kind===3){
   style(7,128);text(2,'---',add(x,155),add(y,302));text(2,"-'--@---",add(x,215),add(y,196));label(0,36,add(x,95),add(y,197));
  }
  style(6);
  if(course!==0&&data(0x81a4)===0){
   if(kind===1){text(2,'>',add(x,290),add(y,78));if(data(0x81b4)!==0)text(2,'<',add(x,22),add(y,78));}
   else text(2,kind===3?'>':'<',add(x,kind===3?290:22),add(y,78));
  }
 }
 const count=data(0x80dc)===0?1:2;
 for(let index=0;index<count;index++){
  const secondary=0x8104+index*16,type=data(secondary+8);
  if(type<9){
   const x=add(data(secondary),data(0x80d4)),y=add(data(secondary+4),data(0x80d8));
   panel(add(x,28),add(y,30),264,24);style(0);
   label(2,vector('courseHeaderTokensAa34',type),add(data(0x8174+type*4)|0,x,76),add(y,33));
   style(6);arrow(x,y,'up');arrow(x,y,'down');
  }
  const primary=0x80e4+index*16,course=data(primary+8);
  if(course>10||course===9)continue;
  panelSlots.push(index);
  const x=add(data(primary),data(0x80cc)),y=add(data(primary+4),data(0x80d0));
  if(course===10)overview(x);else detail(index,course,data(primary+12),x,y);
 }
 return freeze({commands,panelSlots,diagnostic:{consumer:'802c6750',graphicsExecuted:false,sourceLogicalSize:[320,240]}});
}
