// Numeric controls embedded in original i3 display routines. Drawing remains
// separate, but its state writes must run before the caller reads skip input.
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid championship introduction ${n}`);return v;}
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const menuWrite=(address,value)=>({kind:'championshipSelectionWrite',byteOffset:address-0x6f84,width:4,value:value>>>0});
const call=(consumer,args=[])=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});
const scene=(s,key)=>int(s?.scene?.[key],key);
function at(s,key,count,index){const a=s?.[key];if(!Array.isArray(a)||a.length!==count)throw new RangeError(`Supply ${key}[${count}]`);return int(a[index],key,0,0xffffffff);}
const menu=(s,address)=>at(s,'championshipSelectionWords6f84',43,(address-0x6f84)/4)|0;

/** All numeric writes in 5D54/6344; palette/layout/diagram commands remain
 * read-only presentation consumers after these controls. Low-word products
 * and signed division intentionally retain overflow behavior. */
export function prepareNativeChampionshipIntroductionPanel(value){
 const stage=menu(value,0x7028),operations=[];
 if(stage!==0&&stage!==1)return freeze({operations,diagnostic:{stage,graphicsExecuted:false}});
 const source=value.championshipIntroPanelWords6f64;
 if(!Array.isArray(source)||source.length!==8)throw new RangeError('Supply championshipIntroPanelWords6f64[8]');
 const p=[...source],read=a=>int(p[(a-0x6f64)/4],'panel word',0,0xffffffff)|0;
 const set=(a,v)=>{p[(a-0x6f64)/4]=v>>>0;operations.push({kind:'championshipIntroPanelWrite',byteOffset:a-0x6f64,width:4,value:v>>>0});};
 const increment=a=>{const v=(read(a)+1)|0;set(a,v);return v;};
 const ramp=(ticks,peak,duration)=>Math.trunc(Math.imul(ticks,peak)/duration)|0;
 const phase=read(0x6f64);
 if(stage===0){
  if(phase===0){
   if(increment(0x6f68)>=5){set(0x6f64,1);set(0x6f74,0);set(0x6f68,0);}
   set(0x6f78,0);set(0x6f6c,0);set(0x6f70,0);set(0x6f7c,0);
  }else if(phase===1){
   const first=increment(0x6f68);if(first>=20)increment(0x6f74);
   set(0x6f6c,first>=10?255:ramp(first,255,10));set(0x6f70,first>=10?170:ramp(first,170,10));
   const second=read(0x6f74);set(0x6f78,second>=10?255:ramp(second,255,10));set(0x6f7c,second>=10?170:ramp(second,170,10));
   if(first>=10&&second>=10){
    set(0x6f64,2);set(0x6f78,255);set(0x6f6c,255);set(0x6f70,170);set(0x6f7c,170);set(0x6f68,0);set(0x6f74,0);
   }
  }else if(phase===2){
   if(increment(0x6f68)>=25){set(0x6f64,3);set(0x6f74,0);set(0x6f68,0);}
   set(0x6f78,255);set(0x6f6c,255);set(0x6f70,170);set(0x6f7c,170);
  }else if(phase===3){
   const ticks=increment(0x6f68);
   if(ticks>=10){set(0x6f64,0);set(0x6f68,0);set(0x6f6c,0);set(0x6f70,0);operations.push(menuWrite(0x7028,1));}
   else{const remaining=(10-ticks)|0;set(0x6f6c,ramp(remaining,255,10));set(0x6f70,ramp(remaining,170,10));}
   set(0x6f78,read(0x6f6c));set(0x6f7c,read(0x6f70));
  }
 }else if(phase===0){
  if(increment(0x6f68)>=20){set(0x6f64,1);set(0x6f68,0);}
  set(0x6f6c,0);set(0x6f70,0);
 }else if(phase===1){
  const ticks=increment(0x6f68);
  if(ticks>=20){set(0x6f64,2);set(0x6f68,0);set(0x6f6c,255);set(0x6f70,170);set(0x6f80,1);operations.push(menuWrite(0x6f84,1));}
  else{set(0x6f6c,ramp(ticks,255,20));set(0x6f70,ramp(ticks,170,20));}
 }
 return freeze({operations,diagnostic:{stage,phase,graphicsExecuted:false}});
}

/** 5B40 through its drawing prefix. Release the latch before deciding black;
 * callers must not advance panels, input or RNG on that first black frame. */
export function prepareNativeChampionshipIntroductionDisplayEntry(value){
 const operations=[],latch=scene(value,'initLatch63c');
 if(latch!==0){operations.push(word('initLatch63c',0));if(scene(value,'gameStateAb24')===30){
  operations.push(call('80093c44'));return freeze({operations,drawKind:'black',panelStage:null});}}
 operations.push(word('fieldAb2c',0),call('8009328c'));
 const stage=scene(value,'field3938')!==0?menu(value,0x7028):null;
 return freeze({operations,drawKind:'scene',panelStage:stage===0||stage===1?stage:null});
}

/** 5BF8..5D00, after the selected panel has changed its canonical owners.
 * Target/RNG calls must execute in order before preparing the tail below. */
export function prepareNativeChampionshipIntroductionPostDisplay(value){
 const operations=[];
 if(scene(value,'gameStateAb24')===30){
  if(menu(value,0x6f88)!==0)operations.push(menuWrite(0x6f88,0),call('801eb91c'));
  else{
   const pressed=at(value,'menuWordsE658',21,14)&0xb000;
   if(pressed){if(menu(value,0x6f84)!==0)operations.push(call('802c6e9c'));}
   else if(scene(value,'field3938')!==0&&scene(value,'field644')>=menu(value,0x702c))operations.push(call('802c6e9c'));
   operations.push(call('80047e50'));
  }
 }else{
  let ticks=scene(value,'field644');if(ticks>=0){ticks=(ticks-1)|0;operations.push(word('field644',ticks));}
  if(ticks===0)operations.push(call('800c1f60',[7]));
  const fade=at(value,'hudWords7788',1442,(0x8a14-0x7788)/4)<<16>>16;
  if(fade===1){
   const p=value.profileWordsB330;if(!Array.isArray(p)||![50,52].includes(p.length))throw new RangeError('Supply retained championship profile');
   operations.push(word('courseIndex',int(p[0],'profile course',0,0xffffffff)),call('8009345c'));
  }
 }
 return freeze({operations});
}
/** 5D00 tail reads current state AFTER entry/exit/configuration callbacks. */
export function prepareNativeChampionshipIntroductionDisplayTail(value){
 const operations=[];
 if(scene(value,'main638')!==8)operations.push(call('800ad3c4'));
 if(scene(value,'gameStateAb24')===30)operations.push(word('field644',(scene(value,'field644')+1)|0));
 return freeze({operations});
}
/** Whole6E9C: start the original 20-frame exit/fade without resetting scores. */
export function prepareNativeChampionshipIntroductionExit(value){
 return freeze({operations:[word('previousGameState634',scene(value,'gameStateAb24')),word('returnState630',0),
  word('gameStateAb24',31),word('main638',8),word('initLatch63c',1),word('field640',0),word('field644',20),
  word('fieldAb1c',0),word('field461c',3),menuWrite(0x6fe0,1),call('801e6fb0',[5,0,20]),
  call('801e6a4c',[0,0]),call('800c37f4',[58,0])]});
}
