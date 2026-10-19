// Original ovl_i3 course-introduction update, 5800 plus 5AE8/5AF0.
// Resource transforms and GPU assembly are ordered effects, not executed here.
const required=[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]];
const points=[4,2,1,0];
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid championship introduction ${n}`);return v;}
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const word=(field,value)=>({kind:'sourceWordWrite',field,value:value>>>0});
const write=(address,value)=>({kind:'championshipSelectionWrite',byteOffset:address-0x6f84,width:4,value:value>>>0});
const profile=(byteOffset,value)=>({kind:'profileWrite',byteOffset,width:4,value:value>>>0});
const call=(consumer,args)=>({kind:'externalCall',consumer,arguments:args.map(v=>v>>>0)});

/** Reads the retained i3 data owner, including its loaded first-round table.
 * Only latched state30 performs reset/qualification/setup. Display owns the
 * latch release. Later rounds preserve accumulated points and per-round rows.
 * The generated operation list is detached; malformed late reads never commit.
 */
export function prepareNativeChampionshipSelectionUpdate(value,sourceViews={}){
 const menu=value?.championshipSelectionWords6f84;
 if(!Array.isArray(menu)||menu.length!==43)throw new RangeError('Supply retained championshipSelectionWords6f84[43]');
 const read=a=>int(menu[(a-0x6f84)/4],'i3 word',0,0xffffffff)|0;
 const scene=k=>int(value?.scene?.[k],k);
 const operations=[],initialize=scene('initLatch63c')!==0&&scene('gameStateAb24')===30;
 let stage=initialize?null:read(0x7028),resetScores=false;
 if(initialize){
  const p=value.profileWordsB330;
  if(!Array.isArray(p)||p.length!==52)throw new RangeError('Supply retained championship profile[52]');
  const at=i=>int(p[i],'profile word',0,0xffffffff)|0;
  const difficulty=int(at(2),'class',0,2),round=at(1);
  resetScores=round===read(0x6fe4+difficulty*4);
  if(resetScores){
   for(let row=0;row<8;row++){
    for(let slot=0;slot<4;slot++)operations.push(profile(0x20+row*16+slot*4,0));
    operations.push(profile(0xa0+row*4,0));
   }
   for(let slot=0;slot<4;slot++)operations.push(profile(0x10+slot*4,0));
   for(let slot=0;slot<4;slot++)operations.push({kind:'recordWordWrite',racerIndex:slot,wordIndex:206,value:0});
  }
  operations.push(write(0x7028,1),write(0x6f84,0));stage=1;
  if(difficulty===0?round===1:round===0){stage=0;operations.push(write(0x7028,0),write(0x702c,240));}
  else operations.push(write(0x702c,180));
  const primary=int(scene('primaryHumanIndex'),'primary slot',0,3),places=[];
  if(at(0)===0){
   operations.push(write(0x7020,0));
   for(let slot=0;slot<4;slot++){places.push(4);operations.push(word(['field708','field70c','field710','field714'][slot],4));}
  }else{
   const threshold=required[difficulty][int(round,'round',0,7)];
   for(let slot=0;slot<4;slot++){
    const deficit=(threshold-(resetScores?0:at(4+slot)))|0;
    operations.push(write(0x7020,deficit));let place=0;
    while(place<4&&points[place]>=deficit)place++;
    places.push(place);operations.push(word(['field708','field70c','field710','field714'][slot],place));
   }
  }
  operations.push(word('field704',places[primary]));
  const course=int(scene('courseIndex'),'course',0,8),addresses=sourceViews.courseTransformAddresses;
  if(!Array.isArray(addresses)||addresses.length!==9)throw new RangeError('Supply the nine loaded course transform addresses');
  operations.push(call('80069740',[0x80198310,int(addresses[course],'course transform address',0,0xffffffff)]),
   call('8006977c',[0x80198350,0x800e9ab0]),write(0x6f8c,scene('reverseDab68')!==0?2:0));
 }
 // 5AE8 is the actual empty stage0 function. Stage1 prepares 69798; any
 // other signed stage leaves it alone. Buffer addresses stay explicit inputs.
 if(stage===1){
  const base=int(sourceViews.graphicsBufferAddress,'graphics buffer address',0,0xffffffff);
  operations.push(call('80069798',[(base+0xa80)>>>0,(base+0x1780)>>>0,(base+0xa40)>>>0,0x802c7024,0x80198310,0x80198350]));
 }
 return freeze({operations,diagnostic:{consumer:'i3:802c5800',initialize,resetScores,stage,graphicsExecuted:false,physicalWorldUpdated:false}});
}
