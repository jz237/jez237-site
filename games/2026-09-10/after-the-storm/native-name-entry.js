// Independently reconstructed name initialization, input and animation phases.
// The shared scratch is separate from HUD storage and the loaded race overlay.
const U32=0xffffffff,MIN=-2147483648,MAX=2147483647;
const spans={nameEntryWords61c4:[0x61c4,14,'nameEntryWrite'],hudWords7788:[0x7788,1442,'hudWrite'],
 raceWords1f94:[0x1f94,1693,null],profileWordsB330:[0xb330,50,null]};
const bits=new DataView(new ArrayBuffer(4));
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function float(v){bits.setUint32(0,v);const f=bits.getFloat32(0);if(!Number.isFinite(f))throw new RangeError('Expected finite wheel angle constant');return f;}
function floatWord(v){if(!Number.isFinite(v))throw new RangeError('Wheel angle overflow');bits.setFloat32(0,v);return bits.getUint32(0);}

/** Complete numeric801E1BA8 initializer. value has scene.mode608,
 * scene.freshNameAb6c (signed16), and, on restore only, scene.field700
 * (signed32 transport of four name bytes). Retained nameEntryWords61c4[14]
 * and HUD words own every written byte; race/profile spans supply record flags.
 * Readonly sourceViews supplies wheelAngleWord62f4 (finite float32 bits) only
 * on restore, and championshipCourseRowsAc14[3][8] signed16 course indices
 * only for reached championship rounds. Supported profile class0..2/round0..7
 * matches the existing canonical championship contract. Tables are not embedded.
 * No input, animation, matrix, rendering, audio or persistence is executed.
 */
export function prepareNativeNameEntryInitialization(value,sourceViews={}){
 if(!value?.scene||typeof sourceViews!=='object'||!sourceViews)throw new TypeError('Expected name-entry state and source views');
 const retained={},operations=[];
 function span(key){
  if(!retained[key]){
   const v=value[key],count=spans[key][1];
   if(!Array.isArray(v)||(key==='profileWordsB330'?![50,52].includes(v.length):v.length!==count))throw new RangeError(`Invalid ${key} length`);
   retained[key]=Array.from(v,x=>integer(x,key,0,U32));
  }return retained[key];
 }
 const read=(key,address)=>span(key)[(address-spans[key][0])/4]|0;
 function write(key,address,width,v){
  const a=address-spans[key][0],words=span(key),i=a>>>2,value=width===4?v>>>0:v&((1<<(width*8))-1);
  operations.push({kind:spans[key][2],byteOffset:a,width,value});
  if(width===4)words[i]=value;
  else{const shift=(4-width-(a&3))*8,mask=width===1?255:65535;words[i]=((words[i]&~(mask<<shift))|(value<<shift))>>>0;}
 }
 const scratch=(a,v)=>write('nameEntryWords61c4',a,4,v),hud=(a,w,v)=>write('hudWords7788',a,w,v);
 for(const a of [0x61c4,0x61c8,0x61cc,0x61d0,0x61d4,0x61e0,0x61e4,0x61e8])scratch(a,0);
 hud(0x88ec,2,0);
 for(let i=0;i<16;i++)hud(0x87e8+i*4,4,i<8?i:i+15);
 const fresh=integer(value.scene.freshNameAb6c,'scene.freshNameAb6c',-32768,32767)!==0;
 if(fresh){
  operations.push({kind:'sourceHalfwordWrite',field:'freshNameAb6c',value:0});
  for(let i=0;i<4;i++)hud(0x88e8+i,1,0);
 }else{
  const name=integer(value.scene.field700,'scene.field700')>>>0,bytes=Array.from({length:4},(_,i)=>(name>>>(24-i*8))&255);
  for(let i=0;i<4;i++)hud(0x88e8+i,1,bytes[i]);
  let length=0;while(length<3&&bytes[length]!==0)length++;
  scratch(0x61e4,length);
  // Selection was explicitly zeroed above. Retain both source stores -1,15.
  hud(0x8808,4,read('hudWords7788',0x880c)-1);scratch(0x61c4,-1);scratch(0x61c4,15);
  const constant=float(integer(sourceViews.wheelAngleWord62f4,'wheelAngleWord62f4',0,U32));
  const angle=floatWord(Math.fround(Math.fround(15*constant)/16));
  scratch(0x61d4,angle);scratch(0x61d0,angle);
 }
 scratch(0x61f8,0);
 const mode=integer(value.scene.mode608,'scene.mode608');
 if(mode===0){if(read('raceWords1f94',0x2650)===1||read('raceWords1f94',0x2654)!==0)scratch(0x61f8,1);}
 else if(mode===11){if(read('raceWords1f94',0x2928)===1)scratch(0x61f8,1);}
 else if(mode===4){
  const difficulty=integer(read('profileWordsB330',0xb338),'profile difficulty',0,2),round=integer(read('profileWordsB330',0xb334),'profile round',0,7);
  for(let i=difficulty===0?1:0;i<round+1;i++){
   const rows=sourceViews.championshipCourseRowsAc14;
   if(!Array.isArray(rows)||rows.length!==3||!Array.isArray(rows[difficulty])||rows[difficulty].length!==8)throw new RangeError('Invalid championshipCourseRowsAc14');
   const course=integer(rows[difficulty][i],'championship course',0,11);
   if(read('raceWords1f94',0x2660+course*4)===1||read('raceWords1f94',0x2690+course*4)!==0)scratch(0x61f8,1);
  }
 }
 return freeze({operations,diagnostic:{consumer:'801e1ba8',freshName:fresh,inputProcessed:false,animationAdvanced:false,recordsPersisted:false}});
}

/** Numeric801E31A0 stick-speed helper, with the loaded minimum kept explicit.
 * The source caps the measured speed before applying the minimum. */
export function prepareNativeNameEntryStickSpeed(rawX,minimumSpeedWord6334){
 const magnitude=Math.min(70,Math.max(12,Math.abs(integer(rawX,'raw X',-128,127))))-12;
 let speed=Math.fround(Math.fround(magnitude+magnitude)/58);
 if(speed>2)speed=2;
 const minimum=float(integer(minimumSpeedWord6334,'minimumSpeedWord6334',0,U32));
 if(speed<minimum)speed=minimum;
 return floatWord(speed);
}

/** Complete801E2530 control dispatch with numeric31A0 expanded. Retained
 * menu/device owners are already sampled by the host. controllerPort4330 is
 * the selected physical port, not a rider index. Only reached constants and
 * input owners are read. Wheel symbols0..30, selection0..15 and name length
 * 0..3 are the supported initialized-state contract. Confirm starts phase4;
 * its later animation performs insertion. Phase5 retains ordered pending
 * save/format/menu calls; this preparation does not execute persistence. */
export function prepareNativeNameEntryInput(value,sourceViews={}){
 if(!value||!sourceViews||typeof sourceViews!=='object')throw new TypeError('Expected name-entry state and source views');
 const owners={nameEntryWords61c4:[0x61c4,14,'nameEntryWrite'],hudWords7788:[0x7788,1442,'hudWrite'],
  menuWordsE658:[0,21,null],deviceWords4308:[0,10,null]},retained={},operations=[];
 function memory(key){
  if(!retained[key]){
   const data=value[key],count=owners[key][1];
   if(!Array.isArray(data)||data.length!==count)throw new RangeError(`Invalid ${key} length`);
   const view=new DataView(new ArrayBuffer(count*4));
   Array.from(data,(v,i)=>view.setUint32(i*4,integer(v,key,0,U32)));retained[key]=view;
  }return retained[key];
 }
 function read(key,a,width=4){const m=memory(key),o=a-owners[key][0];return width===4?m.getInt32(o):width===2?m.getUint16(o):m.getInt8(o);}
 function write(key,a,width,v){
  const m=memory(key),byteOffset=a-owners[key][0],value=width===4?v>>>0:v&(width===2?65535:255);
  operations.push({kind:owners[key][2],byteOffset,width,value});
  if(width===4)m.setUint32(byteOffset,value);else if(width===2)m.setUint16(byteOffset,value);else m.setUint8(byteOffset,value);
 }
 const scratch=(a,v,w=4)=>write('nameEntryWords61c4',a,w,v),hud=(a,v,w=4)=>write('hudWords7788',a,w,v);
 const sr=a=>read('nameEntryWords61c4',a),symbol=i=>integer(read('hudWords7788',0x87e8+i*4),'wheel symbol',0,30);
 const call=(consumer,args=[])=>operations.push({kind:'externalCall',consumer,arguments:args});
 const sound=id=>call('800c37f4',[id,0]);
 const phase=sr(0x61c8);
 function rotate(left,queued){
  let selected=integer(sr(0x61c4),'wheel selection',0,15);
  const opposite=(selected+8)%16,neighbor=(opposite+(left?1:15))%16;
  scratch(0x61c8,queued?(left?8:9):(left?2:3));
  const next=symbol(neighbor)+(left?-1:1);hud(0x87e8+opposite*4,next);
  if(next<0||next>=31)hud(0x87e8+opposite*4,next+(left?31:-31));
  selected+=left?-1:1;scratch(0x61c4,selected);
  if(left&&selected<0){selected=15;scratch(0x61c4,selected);}
  if(left&&queued&&symbol(selected)===30)hud(0x88ec,0,2);
  const key=queued?(left?'wheelAngleWord6324':'wheelAngleWord6328'):(left?'wheelAngleWord632c':'wheelAngleWord6330');
  const constant=float(integer(sourceViews[key],key,0,U32));
  scratch(0x61d4,floatWord(Math.fround(Math.fround(selected*constant)/16)));
  if(!left&&selected>=16){selected=0;scratch(0x61c4,selected);}
  if(!left&&queued&&symbol(selected)===30)hud(0x88ec,0,2);
  sound(left?0x2e:0x2f);
 }
 function dispatch(){
  if(phase===0||(phase>=6&&phase<=9))return;
  if(phase===5){
   call('801e2c14');call('800ca210',[0x801ce700,0x80226284,0x802288e8]);
   const mode=integer(value.scene?.mode608,'scene.mode608');
   if(mode===4)call('801e2b8c',[0x42]);else if(mode===0)call('801ec20c');else if(mode===11)call('801ed004');
   return;
  }
  if(phase===10){const queued=read('hudWords7788',0x88ec,2);if(queued&3)rotate(Boolean(queued&1),true);return;}
  if(value.menuWordsE658!==undefined&&Object.hasOwn(value.scene??{},'pressed65a'))throw new RangeError('pressed65a overlaps menuWordsE658');
  const pressed=value.menuWordsE658===undefined?integer(value.scene?.pressed65a,'scene.pressed65a',0,65535):read('menuWordsE658',2,2);
  if(pressed&0xb000){
   if(phase!==1)return;
   const selected=integer(sr(0x61c4),'wheel selection',0,15),length=integer(sr(0x61e4),'name length',0,3),id=symbol(selected);
   const action=id===30?2:length<3||id===29?1:0;
   if(action){scratch(0x61c8,4);scratch(0x61e0,0);sound(action===1?0x1a:0x30);}return;
  }
  if(pressed&0x4000){
   if(phase!==1)return;
   let length=integer(sr(0x61e4),'name length',0,3);
   if(length>0){length--;scratch(0x61e4,length);}
   hud(0x88e8+length,0,1);sound(0x12);return;
  }
  const port=integer(sourceViews.controllerPort4330,'controllerPort4330',0,3),held=read('deviceWords4308',port*10,2);
  const x=held&0x200?null:read('deviceWords4308',port*10+8,1),left=Boolean(held&0x200)||x< -12;
  if(!left&&!(held&0x100)&&x<13)return;
  if(phase!==1)return;
  const digital=Boolean(held&(left?0x200:0x100));
  scratch(0x61d8,digital?0x3f800000:prepareNativeNameEntryStickSpeed(x,sourceViews.minimumSpeedWord6334));
  scratch(0x61dc,digital?0:1,2);rotate(left,false);
 }
 dispatch();
 return freeze({operations,diagnostic:{consumer:'801e2530',phase,inputProcessed:true,animationAdvanced:false,recordsPersisted:false,
  pendingConsumers:operations.filter(o=>o.kind==='externalCall').map(o=>o.consumer)}});
}

/**801E12E0..183C numeric phase and visible-window prefix. Call initialization
 * first when the outer1290 latch requires it. This stops before the16 matrix
 * projections and crossing effects; it is not the complete1290 renderer.
 * Constants are finite loaded float32 words, except confirmAngleWords62d0,
 * two big-endian words of the loaded float64. characterBytes60bc supplies the
 * first byte of each reached character string; no original strings embedded.
 */
export function prepareNativeNameEntryAnimationPhase(value,sourceViews={}){
 const n=value?.nameEntryWords61c4,h=value?.hudWords7788;
 if(!Array.isArray(n)||n.length!==14||!Array.isArray(h)||h.length!==1442)throw new RangeError('Expected retained name and HUD owners');
 const scratch=Array.from(n,v=>integer(v,'name word',0,U32)),hud=Array.from(h,v=>integer(v,'HUD word',0,U32)),operations=[];
 const sr=a=>scratch[(a-0x61c4)/4]|0,hr=a=>hud[(a-0x7788)/4]|0;
 function put(name,a,w,v){
  const words=name==='nameEntryWrite'?scratch:hud,offset=a-(name==='nameEntryWrite'?0x61c4:0x7788),i=offset>>>2,value=w===4?v>>>0:v&(w===2?65535:255);
  operations.push({kind:name,byteOffset:offset,width:w,value});
  if(w===4)words[i]=value;else{const shift=(4-w-(offset&3))*8,mask=w===2?65535:255;words[i]=((words[i]&~(mask<<shift))|(value<<shift))>>>0;}
 }
 const sw=(a,v)=>put('nameEntryWrite',a,4,v),hw=(a,v,w=4)=>put('hudWrite',a,w,v),sf=(a,v)=>sw(a,floatWord(Math.fround(v)));
 const constant=key=>float(integer(sourceViews[key],key,0,U32)),f=Math.fround;
 let motionActive=false,confirmationPose=null;
 const phase=sr(0x61c8);
 function step(){
  if(phase===0||phase===7){
   const counter=sr(0x61e0),next=(counter+1)|0,c=constant(phase===0?'introRadiusWord62b0':'outroRadiusWord62e0');
   sf(0x61cc,f(f(f(phase===0?counter:(30-counter)|0)*c)/30));sw(0x61e0,next);
   if(next>=31){sw(0x61e0,0);sw(0x61c8,phase===0?1:5);sf(0x61cc,phase===0?c:0);if(phase===0)sw(0x61e8,1);}return;
  }
  if(phase===1){motionActive=true;return;}
  if([2,3,8,9].includes(phase)){
   motionActive=true;const left=phase===2||phase===8,queued=phase>=8;let speed;
   if(queued)speed=constant(left?'queuedLeftSpeedWord62b4':'queuedRightSpeedWord62c0');
   else{
    if((sr(0x61dc)>>16)!==0){
     const port=integer(sourceViews.controllerPort4330,'controllerPort4330',0,3),words=value.deviceWords4308;
     if(!Array.isArray(words)||words.length!==10)throw new RangeError('Expected retained device words');
     const offset=port*10+8,word=integer(words[offset>>>2],'device word',0,U32),byte=word>>>(24-(offset&3)*8)&255;
     sw(0x61d8,prepareNativeNameEntryStickSpeed(byte>127?byte-256:byte,sourceViews.minimumSpeedWord6334));
    }
    speed=f(constant(left?'leftSpeedWord62b8':'rightSpeedWord62c4')*float(sr(0x61d8)>>>0));
   }
   let angle=f(float(sr(0x61d0)>>>0)+(left?-speed:speed));sf(0x61d0,angle);
   const target=float(sr(0x61d4)>>>0);
   if(left&&angle<0&&target!==0){angle=f(angle+constant('leftWrapWord62bc'));sf(0x61d0,angle);}
   if(left?angle<=target:target<=angle){
    angle=target;sf(0x61d0,angle);
    sw(0x61c8,queued&&((hr(0x88ec)>>>16)&(left?1:2))?10:1);
   }
   if(!left&&constant('rightWrapThresholdWord62c8')<=angle)sf(0x61d0,f(angle-constant('rightWrapWord62cc')));
   return;
  }
  if(phase===4){
   const next=(sr(0x61e0)+1)|0;sw(0x61e0,next);motionActive=true;
   const pair=sourceViews.confirmAngleWords62d0;
   if(!Array.isArray(pair)||pair.length!==2)throw new RangeError('Expected confirmAngleWords62d0');
   const buffer=new DataView(new ArrayBuffer(8));pair.forEach((v,i)=>buffer.setUint32(i*4,integer(v,'confirm angle word',0,U32)));
   const c=buffer.getFloat64(0);if(!Number.isFinite(c))throw new RangeError('Expected finite confirm angle');
   const angleWord=floatWord(f(f(next)*c/16));
   if(next>=16){
    // The selected pose radius is loaded even when the phase changes here.
    constant('confirmEndRadiusWord62d8');
    const selected=integer(sr(0x61c4),'wheel selection',0,15),symbol=integer(hr(0x87e8+selected*4),'wheel symbol',0,30);
    if(symbol===30){
     if(integer(value.scene?.mode608,'scene.mode608')===4)sw(0x61c8,5);
     else{sw(0x61c8,7);sw(0x61e8,0);sw(0x61e0,0);}return;
    }
    let length=integer(sr(0x61e4),'name length',0,symbol===29?3:2);
    if(symbol===29){sw(0x61c8,1);if(length>0){length--;sw(0x61e4,length);}hw(0x88e8+length,0,1);return;}
    const chars=sourceViews.characterBytes60bc;
    if(!Array.isArray(chars)||chars.length!==29)throw new RangeError('Expected characterBytes60bc');
    hw(0x88e8+length,integer(chars[symbol],'character byte',0,255),1);length++;sw(0x61e4,length);
    if(length===3){sw(0x61c8,10);hw(0x88ec,symbol<16?1:2,2);}else sw(0x61c8,1);
   }else{
    const radius=next>=8?f(f(f(f((next-8)|0)*400)/8)+350):f(constant('confirmStartRadiusWord62dc')-f(f(f(next)*400)/8));
    confirmationPose={angleWord,radiusWord:floatWord(radius)};
   }return;
  }
  if(phase===6){const next=(sr(0x61e0)+1)|0;sw(0x61e0,next);if(next>=11){sw(0x61c8,7);sw(0x61e8,0);sw(0x61e0,0);}}
 }
 step();
 const selected=integer(sr(0x61c4),'wheel selection',0,15),first=selected-3,last=selected+3;
 hw(0x87e0,first);if(first<0)hw(0x87e0,first+16);hw(0x87e4,last);if(last>=16)hw(0x87e4,last-16);
 return freeze({operations,motionActive,confirmationPose,diagnostic:{consumer:'801e12e0..801e183c',phase,
  matrixProjectionPending:true,crossingEffectsPending:true,recordsPersisted:false}});
}

/** Complete numeric801E2C14. Applies initials to the already-ranked records
 * in RAM, including the source's fifth terminating-byte stores. It neither
 * ranks a new result nor writes cartridge/browser storage. Empty input uses
 * three bytes from the selected14-byte profile entry and sets freshNameAb6c.
 * Championship covers round0 through the current round (unlike qualification
 * in1BA8). Reached normal/stunt rank flags must be0..3; reverse flags only
 * select a single row. All writable bytes retain their existing owners. */
export function prepareNativeNameEntryRecordUpdate(value,sourceViews={}){
 const owners={hudWords7788:[0x7788,1442,'hudWrite'],raceWords1f94:[0x1f94,1693,'raceByteWrite'],
  saveWordsB280:[0xb280,34,null],profileWordsB330:[0xb330,50,null]},retained={},operations=[];
 function memory(key){
  if(!retained[key]){
   const words=value?.[key],count=owners[key][1];
   if(!Array.isArray(words)||(key==='profileWordsB330'?![50,52].includes(words.length):words.length!==count))throw new RangeError(`Invalid ${key} length`);
   const m=new DataView(new ArrayBuffer(words.length*4));Array.from(words,(v,i)=>m.setUint32(i*4,integer(v,key,0,U32)));retained[key]=m;
  }return retained[key];
 }
 const read=(key,a,w=4)=>w===1?memory(key).getUint8(a-owners[key][0]):memory(key).getInt32(a-owners[key][0]);
 function byte(key,a,value){const byteOffset=a-owners[key][0];operations.push({kind:owners[key][2],byteOffset,width:1,value});memory(key).setUint8(byteOffset,value);}
 const scene=key=>integer(value?.scene?.[key],`scene.${key}`);
 const reverse=()=>integer(value?.scene?.reverseDab68,'scene.reverseDab68',0,65535)!==0;
 let restored=false;
 if(read('hudWords7788',0x88e8,1)===0){
  const index=integer(scene('metadataD9b0'),'name index',0,7);
  for(let i=0;i<3;i++)byte('hudWords7788',0x88e8+i,read('saveWordsB280',0xb298+index*14+i,1));
  byte('hudWords7788',0x88eb,0);operations.push({kind:'sourceHalfwordWrite',field:'freshNameAb6c',value:1});restored=true;
 }
 const name=Array.from({length:4},(_,i)=>read('hudWords7788',0x88e8+i,1));
 function writeName(address,order){for(const i of order)byte('raceWords1f94',address+i,i===4?0:name[i]);}
 function courseRecords(course){
  const place=read('raceWords1f94',0x2660+course*4);
  if(place!==0){
   const rev=reverse(),rank=rev?place:integer(place,'record rank',1,3);
   writeName(rev?0x23b0+course*20+16:0x1ff0+course*60+rank*20-4,[0,1,2,3,4]);
  }
  if(read('raceWords1f94',0x2690+course*4)!==0)writeName(0x22c0+course*20+16,[1,2,3,0,4]);
 }
 const mode=scene('mode608');
 if(mode===4){
  const round=integer(read('profileWordsB330',0xb334),'profile round',0,7),difficulty=integer(read('profileWordsB330',0xb338),'profile difficulty',0,2);
  const rows=sourceViews.championshipCourseRowsAc14;
  if(!Array.isArray(rows)||rows.length!==3||!Array.isArray(rows[difficulty])||rows[difficulty].length!==8)throw new RangeError('Invalid championshipCourseRowsAc14');
  for(let i=0;i<=round;i++)courseRecords(integer(rows[difficulty][i],'championship course',0,11));
 }else if(mode===11){
  const rank=integer(read('raceWords1f94',0x2928),'stunt rank',0,3);
  if(rank!==0){const course=integer(scene('courseIndex'),'courseIndex',0,11);writeName(0x26e8+course*48+rank*16-4,[1,3,2,0,4]);}
 }else courseRecords(integer(scene('courseIndex'),'courseIndex',0,11));
 return freeze({operations,diagnostic:{consumer:'801e2c14',restoredProfileName:restored,recordBytesUpdated:true,recordsPersisted:false}});
}

/** Complete801E1E8C display caller with explicitly prepared graphics returns.
 * Rendering/input/storage callees remain ordered recipes. The saved return
 * head precedes input or fade-exit calls, which must not replace that head.
 * The championship save loop includes warm-up and any nonzero record flag.
 * Those storage callees do not write the profile/flags controlling this loop. */
export function prepareNativeNameEntryDisplay(value,sourceViews={}){
 const operations=[];
 const scene=key=>integer(value?.scene?.[key],`scene.${key}`);
 const write=(field,v)=>operations.push({kind:'sourceWordWrite',field,value:v>>>0});
 function call(consumer,args=[],returns=false){
  const op={kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)};
  if(returns){op.returnWord=integer(sourceViews.externalReturns?.[consumer],`actual return from${consumer}`,0,U32);
   if(op.returnWord%4)throw new RangeError('Source display-list head must be word-aligned');}
  operations.push(op);return op.returnWord;
 }
 if(scene('initLatch63c')!==0)write('initLatch63c',0);
 write('fieldAb2c',0);
 let head=call('80093f78',[],true);head=call('8008fb74',[head],true);head=call('801e2058',[head],true);
 operations.push({kind:'presentationWordWrite',address:head,width:4,value:0x01020040},
  {kind:'presentationWordWrite',address:(head+4)>>>0,width:4,value:0x8011f820});
 head=call('80094a44',[(head+8)>>>0,scene('courseIndex')],true);head=call('80090f58',[head],true);head=call('801e229c',[head],true);
 operations.push(...prepareNativeNameEntryPostDisplay(value,sourceViews).operations);
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'801e1e8c',renderingPerformed:false,inputExpanded:false,recordsPersisted:false}});
}

/** Numeric1E8C suffix for high-resolution drawing, without guest GPU returns.
 * Saves include warm-up and repeated course indices in source order. Callers
 * must consume the storage effects; preparing them is not durable persistence.
 */
export function prepareNativeNameEntryPostDisplay(value,sourceViews={}){
 const operations=[],owners={};
 const scene=key=>integer(value?.scene?.[key],`scene.${key}`);
 const call=(consumer,args=[])=>operations.push({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
 function word(key,count,index){
  if(!owners[key]){
   const a=value?.[key];if(!Array.isArray(a)||(key==='profileWordsB330'?![50,52].includes(a.length):a.length!==count))throw new RangeError(`Invalid ${key} length`);
   owners[key]=Array.from(a,v=>integer(v,key,0,U32));
  }return owners[key][index]|0;
 }
 if(scene('gameStateAb24')===100)call('801e2530');
 else if((word('hudWords7788',1442,(0x8a14-0x7788)/4)<<16>>16)===1){
  if(scene('mode608')===4){
   const round=integer(word('profileWordsB330',50,1),'profile round',0,7),difficulty=integer(word('profileWordsB330',50,2),'profile difficulty',0,2),rows=sourceViews.championshipCourseRowsAc14;
   if(!Array.isArray(rows)||rows.length!==3||!Array.isArray(rows[difficulty])||rows[difficulty].length!==8)throw new RangeError('Invalid championshipCourseRowsAc14');
   for(let i=0;i<=round;i++){
    const course=integer(rows[difficulty][i],'championship course',0,11);
    if(word('raceWords1f94',1693,(0x2660-0x1f94)/4+course)!==0||word('raceWords1f94',1693,(0x2690-0x1f94)/4+course)!==0)
     call(integer(value.scene.reverseDab68,'scene.reverseDab68',0,65535)!==0?'8007c204':'8007bea4',[course]);
   }
  }
  call('801ec500');
 }
 return freeze({operations,diagnostic:{consumer:'801e1e8c post-display',inputExpanded:false,recordsPersisted:false}});
}
