function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native audio event field');return v;}
const signed=v=>(v<<24)>>24;
const gated=new Set([10,0x21,0x26,0x27,0x28,0x29,0x35]);
const words=['raceMode','courseIndex','eventGate7cb8','field7c98','engineGate7ca0','eventLatch7ca8',
 'rankDelay','delay7cd8','delay7cd4','delay7cec','delay7cf0','counter7cf4'];
const bytes=['audioMode','primaryPowerByte','secondaryPowerByte','primaryFlag','primaryCompanionFlag',
 'secondaryFlag','secondaryCompanionFlag','primaryPlaceByte','primaryLastPlace'];

// Complete C37F4 event handler. This owns its actual global writes and returns
// ordered raw leaf-call arguments. Audio-thread timers, voice scheduling and
// mixer callees remain separate; a frame of physics is not an audio tick.
export function prepareNativeAudioEvent(event,parameter,context){
 integer(event,-2147483648,2147483647);integer(parameter,0,0xffffffff);
 const g={...context},commands=[];
 for(const key of words)integer(g[key],-2147483648,2147483647);
 for(const key of bytes)integer(g[key],0,255);
 integer(g.random4562c,0,0xffffffff);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 const result=()=>({context:g,commands}),secondary=(parameter&0x80)!==0,low=parameter&15;
 if(signed(g.audioMode)!==7&&gated.has(event))return result();
 if(g.raceMode!==3&&(event===0x28||event===0x29)&&low!==0&&
  signed(g[secondary?'secondaryPowerByte':'primaryPowerByte'])!==0)event=1;
 emit('c53d4',0x06000f00,signed(event));
 if(signed(g.audioMode)===7&&g.eventGate7cb8===0){
  if(event===0x23){g.delay7cd8=10;g.delay7cd4=180;g.engineGate7ca0=1;g.rankDelay=320;}
  if(event===0x21)g.rankDelay=160;
 }
 if(event===1||event===0x28||event===0x29){
  g[secondary?'secondaryFlag':'primaryFlag']=1;
  g[secondary?'secondaryCompanionFlag':'primaryCompanionFlag']=1;
  emit('c33c8',low===0?0x22:low===1?0x19:low===2?0x1a:(g.random4562c&1)+0x1b,25,40,40);
 }else if(event===10){
  if(low===(g.courseIndex===0?8:4))emit('c3320',secondary?0x20:(g.random4562c&1)+0x1d,20,40);
 }else if(event===0x21){
  emit('c1eb8',0x12);
  if(g.raceMode===2){
   let voice;
   if(parameter&1){emit('c53d4',0x06000f00,0x39);voice=0x3d;}
   else voice=parameter&2?0x2e:(g.random4562c&1)+0x3e;
   emit('c33c8',voice,30,100,40);return result();
  }
  const finishMusic=()=>{
   if(g.field7c98!==0){emit('c15c8',0x1a,0);emit('c1674',10);g.delay7cec=18;}
  };
  if(g.raceMode===1){
   if(secondary&&g.eventLatch7ca8===0){
    finishMusic();g.eventLatch7ca8=1;emit('c33c8',0x3b,16,100,40);
   }
  }else{
   let voice,variant=0,priority;
   const place=signed(g.primaryPlaceByte);
   if(!secondary){
    priority=30;
    if(parameter===1){voice=0x3d;emit('c53d4',0x06000f00,0x39);}
    else{variant=g.random4562c&1;voice=place===0?0x2d:place===3?0x30:signed(g.primaryFlag)!==0?0x33:0x36;}
   }else{
    finishMusic();priority=16;voice=place===0?0x39:place===4?0x3a:0x3b;
    if(parameter&1)emit('c53d4',0x06000f00,0x39);
   }
   emit('c33c8',voice+variant,priority,100,50);g.primaryFlag=0;g.primaryLastPlace=g.primaryPlaceByte;
  }
 }else if(event===0x22)emit('c3320',(parameter+10)>>>0,90,1);
 else if(event===0x23)emit('c3320',10,100,60);
 else if(event===0x26||event===0x27){
  if(signed(g[secondary?'secondaryPowerByte':'primaryPowerByte'])!==5)emit('c3320',(g.random4562c&3)+0x61,10,20);
 }else if(event===0x2d)emit('c32a0',0,127,20);
 else if(event===0x33)emit('c3408',(g.random4562c&1)+0x40,24,20);
 else if(event===0x35){
  g.counter7cf4=(g.counter7cf4+1)|0;g.delay7cf0=100;
  if(g.counter7cf4===4||g.counter7cf4===12)emit('c32a0',(g.random4562c&1)+0x17,127,60);
 }
 return result();
}
