// Independently reconstructed Stunt-results control, ROM1C3780 -> RAM802C5800.
// Drawing stays at the high-resolution presentation boundary.
function integer(v,name,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const scene=(value,key)=>integer(value?.scene?.[key],`scene.${key}`);
function words(value){const a=value.stuntResultsMenuWords5d80;if(!Array.isArray(a)||a.length!==4)throw new RangeError('Expected stuntResultsMenuWords5d80[4]');return Array.from(a,v=>integer(v,'Stunt results word',0,0xffffffff));}
const write=(index,value)=>({kind:'stuntResultsMenuWrite',byteOffset:index*4,width:4,value:value>>>0});

export function prepareNativeStuntResultsMenuInitialization(value){
 const operations=[];
 if(scene(value,'initLatch63c')!==0){words(value);operations.push(write(1,0),write(0,2),write(2,20),write(3,20));}
 return freeze({operations,diagnostic:{consumer:'802c5800',overlay:'stunt-results'}});
}

/** Complete5BD8 control. Player one's pressed edge is distinct from combined
 * menu input. Every path updates the complementary second panel offset. */
export function prepareNativeStuntResultsMenuInput(value){
 const retained=words(value),phase=retained[0],operations=[];let sound=false;
 const put=(index,v)=>{operations.push(write(index,v));retained[index]=v>>>0;};
 const call=(consumer,args=[])=>operations.push({kind:'externalCall',consumer,arguments:args});
 if(phase===0)put(0,1);
 else if(phase===1||phase===3){
  const x=((retained[2]|0)+20)|0;put(2,x);
  if(x>(phase===1?19:319)){put(0,phase===1?2:7);put(2,phase===1?20:320);if(phase===3)put(1,0);}
 }else if(phase===2){
  const input=value.menuWordsE658;
  if(!Array.isArray(input)||input.length!==21)throw new RangeError('Expected menuWordsE658[21]');
  if(integer(input[0],'first menu word',0,0xffffffff)&0xb000){put(0,3);sound=true;}
 }else if(phase===7){
  const delay=((retained[1]|0)+1)|0;put(1,delay);
  if(delay>2){
   const race=value.raceWords1f94;
   if(!Array.isArray(race)||race.length!==1693)throw new RangeError('Expected raceWords1f94[1693]');
   call(integer(race[(0x2928-0x1f94)/4],'Stunt record rank',0,0xffffffff)===0?'801ed004':'801ec9c8');
  }
 }
 if(sound)call('800c37f4',[0x31,0]);
 put(3,(40-(retained[2]|0))|0);
 return freeze({operations,diagnostic:{consumer:'802c5bd8',overlay:'stunt-results',phase}});
}

/** Complete583C display caller. Actual incoming and returned graphics heads
 * are explicit audit inputs, never fabricated by the browser presentation. */
export function prepareNativeStuntResultsMenuDisplay(value,sourceViews={}){
 const operations=[];let head=integer(sourceViews.displayListHead,'incoming display-list head',0,0xffffffff);
 if(head%4)throw new RangeError('Display-list head must be word-aligned');
 const call=(consumer,args=[],returns=false)=>{
  const op={kind:'externalCall',consumer,arguments:args};
  if(returns){op.returnWord=integer(sourceViews.externalReturns?.[consumer],`return from ${consumer}`,0,0xffffffff);
   if(op.returnWord%4)throw new RangeError('Display-list head must be word-aligned');head=op.returnWord;}
  operations.push(op);
 };
 let first=false;
 if(scene(value,'initLatch63c')!==0){operations.push({kind:'sourceWordWrite',field:'initLatch63c',value:0});first=scene(value,'gameStateAb24')===56;}
 if(first){call('800c6ad0',[0]);call('80093c44',[head],true);}
 else{
  operations.push({kind:'sourceWordWrite',field:'fieldAb2c',value:0});
  call('8008fb74',[head],true);call('800949b8',[head,scene(value,'courseIndex')>>>0],true);call('80090f58',[head],true);call('802c58f4',[head],true);
  if(scene(value,'gameStateAb24')===56)call('802c5bd8');
 }
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'802c583c',overlay:'stunt-results',firstEntry:first,renderingPerformed:false}});
}
