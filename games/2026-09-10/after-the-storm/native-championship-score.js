// Original94ACC round awards and both in-place order passes. Four source slot
// identities stay independent of avatar IDs. Only participants60E receive new
// awards; both order passes and final rank writes always visit all four slots.
const points=[7,4,2,1],base=(0x2938-0x1f94)/4,stride=222;
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function int(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid championship score ${n}`);return v;}
function words(v,n,count){if(!Array.isArray(v)||!count.includes(v.length))throw new RangeError(`Expected ${n} words`);return v.map(x=>int(x,n,0,0xffffffff));}

/** One score invocation, before standings5A98 initialization. Its caller owns
 * the one-shot entry latch. Replaying this function adds awards again, exactly
 * as the source would; it is not a read-only standings display or round advance.
 * Ordered writes retain signed overflow, duplicate places, skipped places,
 * disqualification and the original pairwise swap order on tied scores.
 */
export function prepareNativeChampionshipScore(value){
 const p=words(value?.profileWordsB330,'profileWordsB330',[50,52]),r=words(value?.raceWords1f94,'raceWords1f94',[1693]);
 const count=int(value?.scene?.participantCount60e,'participants',-32768,4),round=int(p[1]|0,'round',0,7),operations=[];
 const profile=(i,value)=>{p[i]=value>>>0;operations.push({kind:'profileWrite',byteOffset:i*4,width:4,value:p[i]});};
 const race=(slot,i)=>r[base+slot*stride+i]|0;
 for(let place=0;place<4;place++)for(let slot=0;slot<count;slot++)if(race(slot,1)===place){
  const index=8+round*4+slot;profile(index,race(slot,187)!==0?0:points[place]);
  profile(4+slot,((p[4+slot]|0)+(p[index]|0))|0);
 }
 function order(owner,better){
  const slots=[0,1,2,3],write=(index,value)=>{slots[index]=value;operations.push({kind:'championshipOrderWrite',owner,wordIndex:index,value});};
  slots.forEach((slot,i)=>write(i,slot));
  // The compiled source unrolls two comparisons at a time. Preserve its
  // six ordered pairs; Array.sort can reorder ties after an earlier swap.
  for(let i=0;i<3;i++)for(let j=i+1;j<4;j++)if(better(slots[i],slots[j])){
   const a=slots[i],b=slots[j];write(i,b);write(j,a);
  }
  return slots;
 }
 const roundOrder=order('roundOrderE718',(a,b)=>(p[8+round*4+a]|0)<(p[8+round*4+b]|0));
 const totalOrder=order('racerOrderA9dc',(a,b)=>p[4+a]===p[4+b]?race(b,1)<race(a,1):(p[4+a]|0)<(p[4+b]|0));
 for(let slot=0;slot<4;slot++)operations.push({kind:'recordWordWrite',racerIndex:slot,wordIndex:206,value:totalOrder.indexOf(slot)});
 return freeze({operations,diagnostic:{round,participants:count,roundOrder,totalOrder,roundAdvanced:false}});
}
