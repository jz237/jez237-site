// Source783AC tail7903C..7951C: terminal scoring, lap/visited flags and mastery.
// Provisional place is distinct from the later queue-drained record insertion.
const BASE=0x1f94,complete=[0x39e8,0x39ec,0x39f0,0x39f4,0x39f8,0x39fc,0x3a00,0x3a04];
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** continueFinish/sourceRow come from the actual preceding checkpoint branch.
 * Even without a qualified crossing, the final mastery check runs. A prelude
 * early return skips this entire tail. move1604 is the earlier scoring result;
 * crossingOffsetNative is the preceding source interpolation, not lap time.
 * Original record/save/menu persistence remains outside this numeric tail. */
export function prepareNativeStuntFinish({raceWords1f94,globals},input={}){
 if(!Array.isArray(raceWords1f94)||raceWords1f94.length!==1693)throw new RangeError('Supply canonical raceWords1f94');
 const race=raceWords1f94.map(v=>integer(v,'race word',0,0xffffffff)),operations=[];
 const g=Object.fromEntries(['courseIndex','finishSourceRow','configuredLaps728','noFinish8178','primaryCount','state600','unlockAb60','ringCountB134']
  .map(k=>[k,integer(globals?.[k],k)]));
 integer(g.courseIndex,'courseIndex',0,11);integer(g.primaryCount,'primaryCount',0,64);integer(g.unlockAb60,'unlockAb60',-32768,32767);
 const slot=integer(input.racerIndex,'racerIndex',0,3),base=0x2938+slot*0x378;
 if(typeof input.continueFinish!=='boolean')throw new TypeError('Supply the preceding crossing eligibility');
 const read=a=>race[(a-BASE)/4]|0;
 function write(a,value){const wordIndex=(a-BASE)/4;race[wordIndex]=value>>>0;operations.push({kind:'raceWordWrite',wordIndex,value:value>>>0});}
 const diagnostic={finished:false,masteryGranted:false,provisionalPlace:null};
 function mastery(){
  if(read(0x2930)===0&&g.courseIndex===0&&read(0x292c)>=g.ringCountB134&&complete.every(a=>read(a)!==0)){
   write(0x2930,1);diagnostic.masteryGranted=true;
  }
 }
 if(input.continueFinish){
  const row=integer(input.sourceRow,'crossed sourceRow',0,63);
  if(row===g.finishSourceRow){
   let lap=read(base);
   if(lap>0){
    write(base+0x168,integer(input.crossingOffsetNative,'crossing offset',0,50));
    if(lap>=g.configuredLaps728&&g.noFinish8178===0){
     write(base+0x2f4,1);diagnostic.finished=true;
     const pending=read(0x26e4);
     if(pending>0){
      const move=integer(input.move1604,'move1604',0,11),marks={1:[0x39e8],2:[0x39ec],9:[0x39f0],10:[0x39f0,0x39f4],11:[0x39f8]};
      for(const a of marks[move]??[])write(a,1);
      const repeat={1:0x39d8,2:0x39dc,9:0x39e0,10:0x39e0,11:0x39e4}[move];
      write(0x39cc,repeat!==undefined&&read(repeat)!==0?10:pending);write(0x39d0,20);write(0x26e4,0);
     }else write(0x39cc,0);
     mastery();
     write(base+0x19c,0);
     for(let i=0;i<Math.min(g.configuredLaps728,9);i++)write(base+0x19c,(read(base+0x19c)+read(base+0x178+i*4))|0);
     write(0x2928,0);
     const estimate=((read(0x26d0)+read(0x39cc)|0)+read(0x39d4))|0;
     if(g.state600===0)for(let i=0;i<3;i++)if(read(0x26e8+g.courseIndex*48+i*16)<estimate){write(0x2928,i+1);break;}
     diagnostic.provisionalPlace=read(0x2928);
     let cue=read(0x2928)===1?0:1;
     if(g.unlockAb60===0&&read(0x2930)!==0)cue+=128;
     operations.push({kind:'externalCall',consumer:'800c1f60',arguments:[6]},
      {kind:'externalCall',consumer:'800c21f4',arguments:[6,cue]});
     lap=read(base);
    }
   }
   if((g.noFinish8178===0||lap===0)&&lap<g.configuredLaps728){lap=(lap+1)|0;write(base,lap);}
   write(base+0x320,lap);
   for(let i=1;i<g.primaryCount;i++)write(base+0x2c+i*4,0);
  }
  write(base+0x2c+row*4,1);
 }
 mastery();
 return freeze({operations,diagnostic});
}
