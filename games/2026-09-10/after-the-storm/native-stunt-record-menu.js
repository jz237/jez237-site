// Independent Stunt record-screen control. Its four words live in canonical
// HUD storage88F0..8900, not in either of the results overlay owners.
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const hi=a=>(a-0x7788)/4,scene=(v,k)=>integer(v?.scene?.[k],`scene.${k}`);
function word(v,address){const a=v.hudWords7788;if(!Array.isArray(a)||a.length!==1442)throw new RangeError('Expected hudWords7788[1442]');return integer(a[hi(address)],'Stunt record HUD word',0,0xffffffff);}
const write=(address,value)=>({kind:'hudWrite',byteOffset:address-0x7788,width:4,value:value>>>0});

/** Numeric3250..32B0 prefix. Matrix and viewport setup remains presentation. */
export function prepareNativeStuntRecordMenuInitialization(value){
 const operations=[];
 if(scene(value,'initLatch63c')!==0)operations.push(write(0x88f4,0),write(0x88f0,0),write(0x88f8,320),write(0x88fc,-264));
 return freeze({operations,diagnostic:{consumer:'801e3250..801e32b0',matrixPresentationPending:true}});
}

/** Complete355C switch, including its loaded jump-table cases. Player1 owns
 * confirmation. Complementary offsets update on every path after effects. */
export function prepareNativeStuntRecordMenuInput(value){
 const phase=word(value,0x88f0),operations=[];let x=word(value,0x88f8)|0,sound=false;
 const put=(a,v)=>operations.push(write(a,v));
 if(phase===0){put(0x88f0,1);sound=true;}
 else if(phase===1||phase===3){
  x=(x-20)|0;put(0x88f8,x);
  if(phase===1&&x<20){put(0x88f0,2);x=20;put(0x88f8,x);}
  else if(phase===3&&x< -264){x=-264;put(0x88f8,x);put(0x88f0,4);put(0x88f4,0);}
 }else if(phase===2){
  const a=value.menuWordsE658;if(!Array.isArray(a)||a.length!==21)throw new RangeError('Expected menuWordsE658[21]');
  if(integer(a[0],'first menu word',0,0xffffffff)&0xb000){put(0x88f0,3);sound=true;}
 }else if(phase===4){const delay=((word(value,0x88f4)|0)+1)|0;put(0x88f4,delay);
  if(delay>=3)operations.push({kind:'externalCall',consumer:'801ec830',arguments:[]});}
 if(sound)operations.push({kind:'externalCall',consumer:'800c37f4',arguments:[0x31,0]});
 put(0x88fc,(40-x)|0);
 return freeze({operations,diagnostic:{consumer:'801e355c',phase}});
}

/** Complete34F8 display caller; drawing returns are explicit audit inputs. */
export function prepareNativeStuntRecordMenuDisplay(value,sourceViews={}){
 const operations=[];let head;
 const draw=(consumer,args)=>{head=integer(sourceViews.externalReturns?.[consumer],`return from ${consumer}`,0,0xffffffff);
  if(head%4)throw new RangeError('Display-list head must be word-aligned');operations.push({kind:'externalCall',consumer,arguments:args,returnWord:head});};
 if(scene(value,'initLatch63c')!==0)operations.push({kind:'sourceWordWrite',field:'initLatch63c',value:0});
 operations.push({kind:'sourceWordWrite',field:'fieldAb2c',value:0});
 draw('8008fb74',[]);draw('800949b8',[head,scene(value,'courseIndex')>>>0]);draw('80090f58',[head]);draw('801e3698',[head]);
 operations.push({kind:'externalCall',consumer:'801e355c',arguments:[]});
 return freeze({operations,displayListHead:head,diagnostic:{consumer:'801e34f8',renderingPerformed:false}});
}
