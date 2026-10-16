// Independently reconstructed numeric normal-results control. The selected
// ovl_i6 mapping is ROM1C2250 -> RAM802C5800, not the race overlay at that RAM.
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const scene=(value,key)=>integer(value?.scene?.[key],`scene.${key}`);
function words(value){const a=value.resultsMenuWords6d30;if(!Array.isArray(a)||a.length!==4)throw new RangeError('Expected resultsMenuWords6d30[4]');return Array.from(a,v=>integer(v,'results menu word',0,0xffffffff));}
const write=(index,value)=>({kind:'resultsMenuWrite',byteOffset:index*4,width:4,value:value>>>0});

/** Exact numeric5800..58A8 initialization prefix. The remaining5800 matrix
 * and viewport work is presentation, deliberately outside this entry point.
 * Init latch is retained until5B74. Delay word6D3C is not reset here. */
export function prepareNativeResultsMenuInitialization(value){
 const operations=[];
 if(scene(value,'initLatch63c')!==0&&scene(value,'gameStateAb24')===50){
  words(value);const fromName=scene(value,'previousGameState634')===100;
  operations.push(write(0,fromName?0:2),write(1,fromName?320:20),write(2,fromName?-264:20));
 }
 return freeze({operations,diagnostic:{consumer:'802c5800..802c58a8',matrixPresentationPending:true}});
}

/** Complete6B34 dispatcher. Its pressed halfword isE692, the combined third
 * menu input record, not player one'sE65A. Signed32 offset/counter wrapping
 * precedes signed threshold comparisons; out-of-range phases do nothing. */
export function prepareNativeResultsMenuInput(value){
 const retained=words(value),phase=retained[0],operations=[];let sound=false;
 const put=(index,v)=>{operations.push(write(index,v));retained[index]=v>>>0;};
 const call=(consumer,args=[])=>operations.push({kind:'externalCall',consumer,arguments:args});
 if(phase===0)put(0,1);
 else if(phase===1||phase===3){
  let x=((retained[1]|0)-20)|0;put(1,x);
  const limit=phase===1?20:-264;
  if(x<limit){put(0,phase===1?2:4);x=limit;put(1,x);if(phase===3)put(3,0);}
  put(2,(40-x)|0);
 }else if(phase===2){
  const input=value.menuWordsE658;
  if(!Array.isArray(input)||input.length!==21)throw new RangeError('Expected menuWordsE658[21]');
  const pressed=integer(input[14],'combined menu word',0,0xffffffff)&65535;
  if(pressed&0xb000){put(0,3);sound=true;}
 }else if(phase===4){const next=((retained[3]|0)+1)|0;put(3,next);if(next>=3)call('801ec830');}
 if(sound)call('800c37f4',[0x31,0]);
 return freeze({operations,diagnostic:{consumer:'802c6b34',phase,pendingConsumers:operations.filter(o=>o.kind==='externalCall').map(o=>o.consumer)}});
}

/** Complete5B74 display caller. Its first ordinary entry uses93C44 and skips
 * controls, but an entry from names draws immediately. Actual GPU return heads
 * are explicit views; drawing and the nested6B34 remain ordered call recipes. */
export function prepareNativeResultsMenuDisplay(value,sourceViews={}){
 const operations=[];let head;
 const call=(consumer,args=[],returns=false)=>{
  const op={kind:'externalCall',consumer,arguments:args};
  if(returns){op.returnWord=integer(sourceViews.externalReturns?.[consumer],`return from ${consumer}`,0,0xffffffff);
   if(op.returnWord%4)throw new RangeError('Display-list head must be word-aligned');head=op.returnWord;}
  operations.push(op);
 };
 let first=false;
 if(scene(value,'initLatch63c')!==0){operations.push({kind:'sourceWordWrite',field:'initLatch63c',value:0});
  first=scene(value,'gameStateAb24')===50&&scene(value,'previousGameState634')!==100;}
 if(first)call('80093c44',[],true);
 else{
  operations.push({kind:'sourceWordWrite',field:'fieldAb2c',value:0});
  call('8008fb74',[],true);call('800949b8',[head,scene(value,'courseIndex')>>>0],true);call('80090f58',[head],true);call('802c5c2c',[head],true);
  if(scene(value,'gameStateAb24')===50)call('802c6b34');
 }
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'802c5b74',firstEntry:first,renderingPerformed:false}});
}
