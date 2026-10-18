// Independent numeric layout of ovl_i15 602C. Rendering commands use logical
// source coordinates, never N64 display-list pointers or copied image assets.
const MIN=-2147483648,MAX=2147483647;
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function at(a,n,i,label){if(!Array.isArray(a)||a.length!==n)throw new RangeError(`Expected ${label}[${n}]`);return integer(a[i],`${label}[${i}]`,0,0xffffffff);}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Reached data only: retained ending/profile/race owners, original course
 * order and label tokens, final slot order, selected avatars and rider names.
 * Text and matrix/rider drawing remain high-resolution consumer responsibilities.
 * No scene, timing, input or player resolution is changed by this preparation.
 */
export function prepareNativeEndingPresentation(value,sourceViews={}){
 const commands=[],panelSlots=[],data=a=>at(value.endingMenuWords6d50,126,(a-0x6d50)/4,'endingMenuWords6d50');
 const scene=k=>integer(value.scene?.[k],`scene.${k}`);
 const profile=i=>{const a=value.profileWordsB330;if(!Array.isArray(a)||![50,52].includes(a.length))throw new RangeError('Expected retained profile');return integer(a[i],'profile word',0,0xffffffff);};
 const race=a=>at(value.raceWords1f94,1693,(a-0x1f94)/4,'raceWords1f94');
 const add=(...v)=>v.reduce((a,b)=>(a+b)|0,0);
 const style=(mode,intensity=255)=>commands.push({kind:'style',mode,intensity});
 const label=(font,token,x,y,variant=0)=>commands.push({kind:'label',font,token,x,y,variant});
 const panel=(x,y,width,height,alpha=255)=>commands.push({kind:'panel',x,y,width,height,alpha});
 const text=(font,content,x,y,mode=0)=>commands.push({kind:'text',font,text:content,x,y,mode});
 const vector=(key,n,i)=>at(sourceViews[key],n,i,key);
 let slot=0,counter=0;
 while(counter<10){
  if(slot>=10)throw new RangeError('Ending draw traversed beyond its ten-panel owner');
  const base=0x6e80+slot*16,active=data(base);counter++;slot++;
  if(active===0)continue;
  const type=data(base+4);if(type>10||type===9)continue;
  const x=data(base+8)|0,y=data(base+12)|0;panelSlots.push(slot-1);
  if(type!==10){
   panel(x,y,256,32);style(0);
   const difficulty=profile(2)|0;
   let round=type-(difficulty===0?1:0);if((data(0x6e7c)|0)===(type|0))round=8;
   label(1,data(0x6d9c+round*4),add(x,24),add(y,4),1);
   const rider=data(0x6f20+type*4);
   label(1,data(0x6dc0+rider*4),add(x,39),add(y,16));
   if(rider===4)commands.push({kind:'missingTime',font:2,x:add(x,147),y:add(y,16)});
   else commands.push({kind:'time',font:2,value:profile(40+type),x:add(x,147),y:add(y,16)});
   const order=sourceViews.courseOrderEac14,index=difficulty*8+type,row=Math.floor(index/8),column=index%8;
   if(!Array.isArray(order)||order.length!==3||!Array.isArray(order[row])||order[row].length!==8)throw new RangeError('Expected reached courseOrderEac14[3][8]');
   const course=integer(order[row][column],'ending course',0,8);
   label(1,vector('courseNameTokensAa10',9,course),add(x,data(0x6dfc+course*4)|0,137),add(y,4));
   if(race(0x2660+course*4)===1){style(4);label(1,98,add(x,109),add(y,16),2);}
   continue;
  }
  panel(x,y,265,23);panel(x,add(y,27),265,16);
  for(let row=0;row<4;row++)panel(x,add(y,46,row*32),265,28);
  let offer=false;
  if(scene('reverseDab68')===0){
   offer=(profile(2)|0)!==2;
   if(!offer){const primary=integer(scene('primaryHumanIndex'),'primary index',0,3);offer=race(0x2c70+primary*888)===0;}
  }
  if(offer)panel(add(x,30),add(y,174),204,16,data(0x6dd8)&255);
  style(0);label(2,38,add(x,12),add(y,3));
  label(1,31,add(x,5),add(y,30));label(1,32,add(x,101),add(y,30));label(1,58,add(x,207),add(y,30));
  if(offer){style(10,data(0x6dd4)&255);label(1,99,add(x,36),add(y,177));}
  commands.push({kind:'fillColor',rgba:[0,0,0,255]});
  for(let row=0;row<4;row++)commands.push({kind:'fill',x1:add(x,34),y1:add(y,row*32,49),x2:add(x,78),y2:add(y,row*32,70)});
  commands.push({kind:'clip',x1:8,y1:20,x2:311,y2:219});
  let rank=1,previousPoints;
  for(let row=0;row<4;row++){
   const racer=integer(vector('racerOrderA9dc',4,row),'ranked racer',0,3),points=profile(4+racer)|0;
   if(row!==0&&points!==previousPoints)rank=row+1;previousPoints=points;
   const avatar=integer(vector('avatarsA9b0',4,racer),'ranked avatar',0,3),names=sourceViews.riderNamesB298;
   if(!Array.isArray(names)||names.length!==4||typeof names[avatar]!=='string')throw new RangeError('Expected reached riderNamesB298[4]');
   const mode=racer===integer(scene('primaryHumanIndex'),'primary index',0,3)?6:0;
   const tens=Math.trunc(points/10)%10;
   const width=tens===0?0:integer(sourceViews.digitWidths6d70?.[tens],'points tens glyph width',0,255);
   text(0,String(rank),add(x,5),add(y,row*32,50),mode);
   text(2,names[avatar],add(x,84),add(y,row*32,54));
   text(0,String(points),add(x,228,-width),add(y,row*32,50),mode);
  }
  commands.push({kind:'depthClear'},{kind:'restoreColorTarget'},{kind:'clip',x1:8,y1:20,x2:311,y2:219});
  for(let row=0;row<4;row++)commands.push({kind:'riderPreview',riderIndex:vector('racerOrderA9dc',4,row),viewportIndex:row});
  // The original uses s5 for both the outer counter and four preview draws.
  // Preserve the resulting counter5 after a summary, rather than assuming ten
  // logical rows are always consumed. A malformed overrun rejects explicitly.
  counter=5;
 }
 return freeze({commands,panelSlots,diagnostic:{consumer:'802c602c',graphicsExecuted:false,sourceLogicalSize:[320,240]}});
}
