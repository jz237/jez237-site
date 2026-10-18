// Original ovl_i9 records browser (state66/67), distinct from championship
// standings and from other overlays sharing802C5800. Original art is separate.
const BASE=0x80c0,COUNT=62,U32=0xffffffff;
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
function owner(value){
 const a=value.recordsBrowserWords80c0;
 if(!Array.isArray(a)||a.length!==COUNT)throw new RangeError('Expected recordsBrowserWords80c0[62]');
 return a.slice();
}

export function prepareNativeRecordsBrowserExit(value,destination){
 int(destination,'records destination');
 return freeze({operations:[word('previousGameState634',int(value.scene?.gameStateAb24,'gameStateAb24')),word('returnState630',destination),
  word('gameStateAb24',67),word('main638',12),word('initLatch63c',1),word('field640',0),word('field644',0),word('fieldAb1c',0),word('field461c',2),
  call('801e6fb0',[1,4,0])],diagnostic:{consumer:'802c802c',fadeExpanded:false}});
}

/** Exact5800 numeric entry/slide update. Matrix construction is an explicit
 * boundary; viewport recipes preserve the original source's use of each
 * descriptor's first word for BOTH translated axes, including vertical slides.
 * Logical320x240 distances do not set the host renderer's resolution.
 */
export function prepareNativeRecordsBrowserUpdate(value,sourceViews={}){
 const data=owner(value),operations=[];
 const read=a=>int(data[(a-BASE)/4],`records word${a.toString(16)}`,0,U32)|0;
 const put=(a,v)=>{const value=v>>>0;operations.push({kind:'recordsBrowserWrite',byteOffset:a-BASE,width:4,value});data[(a-BASE)/4]=value;};
 let initialized=false;
 if(int(value.scene?.initLatch63c,'initLatch63c')!==0&&int(value.scene?.gameStateAb24,'gameStateAb24')===66){
  initialized=true;const save=value.saveWordsB280;
  if(!Array.isArray(save)||save.length!==34)throw new RangeError('Expected saveWordsB280[34]');
  if((int(save[0],'profile flags',0,U32)>>>24)&8)put(0x81b4,1);
  if(int(value.scene?.previousGameState634,'previousGameState634')===101){
   put(0x81a4,1);put(0x80c0,1);put(0x80c4,0);put(0x80c8,1);
   for(const [i,v]of [0,0,1,1,320,0,1,1].entries())put(0x80e4+i*4,v);
   if(int(value.scene?.reverseDab68,'reverseDab68',0,65535)!==0){put(0x80f0,3);put(0x8100,3);}
   for(const [i,v]of [0,0,1,1,320,0,1,0].entries())put(0x8104+i*4,v);
  }
 }
 const direction=read(0x80dc),panels=direction===0?1:2;
 if(direction!==0){
  if(direction===1)put(0x80cc,(read(0x80cc)+30)|0);
  else if(direction===2)put(0x80cc,(read(0x80cc)-30)|0);
  else put(0x80d0,(read(0x80d0)+(direction===3?-30:30))|0);
  const horizontal=direction===1||direction===2,position=read(horizontal?0x80cc:0x80d0),limit=horizontal?320:240;
  if(position<=-limit||position>=limit){
   put(0x80d0,0);const type=read(0x80fc),style=read(0x8100);put(0x80cc,0);put(0x80dc,0);put(0x80ec,type);put(0x80f0,style);
  }
  if(read(0x80e0)!==0){
   put(0x80d4,read(0x80cc));put(0x80d8,read(0x80d0));put(0x80e0,read(0x80dc));put(0x810c,read(0x80ec));put(0x811c,read(0x80fc));
  }
 }
 const presentation=[{kind:'matrixSetup',afterOperation:operations.length,transformWord821c:int(sourceViews.transformWord821c,'transformWord821c',0,U32)}];
 for(let panel=0;panel<panels;panel++){
  const offset=read(0x80e4+panel*16),x=(offset+read(0x80cc))|0,y=(offset+read(0x80d0))|0;
  for(let rider=0;rider<4;rider++){
   const viewportWords=Array.from({length:4},(_,i)=>read(0x8128+i*4)>>>0);
   viewportWords[2]=(((((x+76)<<2)&65535)*65536)+(((y+(rider===3?206:138+rider*18))<<2)&65535))>>>0;
   presentation.push({kind:'riderViewport',afterOperation:operations.length,panelIndex:panel,riderIndex:rider,viewportWords});
  }
 }
 return freeze({operations,presentation,diagnostic:{consumer:'802c5800',initialized,matrixHelpersExecuted:false,graphicsExecuted:false}});
}

/** Exact5E5C controls, including7194 panel descriptors and802C exit. Source
 * display5D24 suppresses this consumer during a slide; direct calls retain
 * the original unguarded behavior. AA D8 course order is a supplied view.
 * This does not sample controllers, move panels, draw or persist records.
 */
export function prepareNativeRecordsBrowserInput(value,sourceViews={}){
 const data=owner(value),operations=[];
 const read=a=>int(data[(a-BASE)/4],`records word${a.toString(16)}`,0,U32)|0;
 const put=(a,v)=>{const value=v>>>0;operations.push({kind:'recordsBrowserWrite',byteOffset:a-BASE,width:4,value});data[(a-BASE)/4]=value;};
 const sound=id=>operations.push(call('800c37f4',[id,0]));
 const panel=(a,x,y,type,style)=>{put(a,x);put(a+4,y);put(a+8,type);put(a+12,style);};
 const course=()=>{
  const order=sourceViews.courseOrderAad8,i=int(read(0x80c8),'records course cursor',0,8);
  if(!Array.isArray(order)||order.length!==9)throw new RangeError('Expected courseOrderAad8[9]');
  return int(order[i],'records course type');
 };
 const exit=d=>operations.push(...prepareNativeRecordsBrowserExit(value,d).operations);
 const menu=value.menuWordsE658;
 if(!Array.isArray(menu)||menu.length!==21)throw new RangeError('Expected menuWordsE658[21]');
 const pressed=int(menu[0],'first controller menu word',0,U32)&65535;
 if(pressed&0xb000){
  let changed=false;
  if(read(0x80ec)===10){
   const stage=read(0x80c0);
   if(stage===0){
    changed=true;const category=read(0x80c4);
    if(category===0||category===1){put(0x80c8,category===0?1:0);put(0x80c0,1);}else exit(60);
   }else if(stage===1){
    put(0x80dc,2);const type=course(),style=read(0x80c4)===0?1:2;
    changed=true;panel(0x80f4,320,0,type,style);put(0x80e0,2);panel(0x8114,320,0,type,0);sound(42);
   }
  }else if(read(0x81a4)!==0){changed=true;exit(int(value.scene?.fieldAa08,'fieldAa08')!==0?2:80);}
  if(changed)sound(17);
 }else if((pressed&0x4000)&&read(0x81a4)===0){
  if(read(0x80ec)===10){const stage=read(0x80c0);if(stage===0)exit(60);else if(stage===1)put(0x80c0,0);}
  else{
   const style=read(0x80f0);put(0x80c4,style===1||style===3?0:1);put(0x80dc,1);
   panel(0x80f4,-320,0,10,0);put(0x80e0,1);panel(0x8114,-320,0,10,0);sound(42);
  }
  sound(22);
 }else if(pressed&0x800){
  if(read(0x80ec)===10){
   if(read(0x80c0)===1){const min=read(0x80c4)===0?1:0;put(0x80c8,(read(0x80c8)-1)|0);if(read(0x80c8)<min)put(0x80c8,8);sound(16);}
  }else{
   const style=read(0x80f0);put(0x80c8,(read(0x80c8)-1)|0);
   if(read(0x80c8)<(style===2?0:1))put(0x80c8,8);
   const type=course();put(0x80dc,4);panel(0x80f4,0,-240,type,style);put(0x80e0,4);panel(0x8114,0,-240,type,0);sound(42);
  }
 }else if(pressed&0x400){
  if(read(0x80ec)===10){
   if(read(0x80c0)===1){const min=read(0x80c4)===0?1:0;put(0x80c8,(read(0x80c8)+1)|0);if(read(0x80c8)>=9)put(0x80c8,min);sound(16);}
  }else{
   put(0x80c8,(read(0x80c8)+1)|0);if(read(0x80c8)>=9)put(0x80c8,read(0x80f0)===2?0:1);
   const type=course();put(0x80dc,3);panel(0x80f4,0,240,type,read(0x80f0));put(0x80e0,3);panel(0x8114,0,240,type,0);sound(42);
  }
 }else if((pressed&0x200)&&read(0x81a4)===0){
  const type=read(0x80ec);
  if(type===10){
   const stage=read(0x80c0);
   if(stage===0){put(0x80c4,(read(0x80c4)-1)|0);if(read(0x80c4)<0)put(0x80c4,2);}
   else if(stage===1&&!(read(0x80c4)===0&&read(0x80c8)===5)&&read(0x80c8)!==4){
    put(0x80c8,(read(0x80c8)-5)|0);if(read(0x80c8)<0)put(0x80c8,(read(0x80c8)+10)|0);
   }
   sound(16);
  }else if(type!==0){
   const style=read(0x80f0);
   if(style===2||(style===1&&read(0x81b4)!==0)){
    put(0x80dc,1);panel(0x80f4,-320,0,course(),style===2?1:3);sound(42);
   }
  }
 }else if((pressed&0x100)&&read(0x81a4)===0){
  const type=read(0x80ec);
  if(type===10){
   const stage=read(0x80c0);
   if(stage===0){put(0x80c4,(read(0x80c4)+1)|0);if(read(0x80c4)===3)put(0x80c4,0);}
   else if(stage===1&&!(read(0x80c4)===0&&read(0x80c8)===5)&&read(0x80c8)!==4){
    put(0x80c8,(read(0x80c8)+5)|0);if(read(0x80c8)>=9)put(0x80c8,(read(0x80c8)-10)|0);
   }
   sound(16);
  }else if(type!==0){
   const style=read(0x80f0);
   if(style===1||style===3){put(0x80dc,2);panel(0x80f4,320,0,course(),style===1?2:1);sound(42);}
  }
 }
 return freeze({operations,diagnostic:{consumer:'802c5e5c',panelSlidesAdvanced:false}});
}

/** Numeric suffix of5D24: never accepts input during a slide and dispatches
 * only the three explicit return destinations after exact fade completion1. */
export function prepareNativeRecordsBrowserPostDisplay(value){
 const operations=[],state=int(value.scene?.gameStateAb24,'gameStateAb24');
 if(state===66){const a=owner(value);if(int(a[(0x80dc-BASE)/4],'slide direction',0,U32)===0)operations.push(call('802c5e5c'));}
 else{
  const h=value.hudWords7788;if(!Array.isArray(h)||h.length!==1442)throw new RangeError('Expected hudWords7788[1442]');
  if((int(h[(0x8a14-0x7788)/4],'fade status',0,U32)<<16>>16)===1){
   const dest=int(value.scene?.returnState630,'returnState630'),consumer={2:'801eb180',60:'801ec304',80:'801ec830'}[dest];
   if(consumer)operations.push(call(consumer));
  }
 }
 return freeze({operations,diagnostic:{consumer:'802c5d24 post-display',targetEntered:false}});
}
