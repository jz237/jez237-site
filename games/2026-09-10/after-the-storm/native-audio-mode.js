import {resetNativeRaceAudioTimers} from './native-audio-transition.js';
import {nativeContactAudioMaterials} from './native-contact-audio.js';
const words=['raceMode','courseIndex','primaryMuted','secondaryMuted','field7c98','stage7dc8','musicSelection',
 'tempoDelay7ce0','delay7cdc','resultFlag7dd0','alternateCue7cb0','creditsTrack7dd4',
 'creditsCounter7e18','creditsField7e14','difficultyWord','surfaceCode','markedBoxCode','floorCode'];
const bytes=['splitFlag7c90','cueBase7e05','primaryCompanionFlag','secondaryCompanionFlag','primaryPlaceByte','secondaryPlaceByte'];
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid native audio mode field');return v;}

// Complete C21F4 direct body, with ordered leaf calls. A callee retains its own
// state/voice/mixer ownership; source music commands are not browser track IDs.
// Racing material tables admit the nine recovered course rows0..8 only.
export function prepareNativeAudioMode(mode,parameter,voice,context){
 integer(mode,-2147483648,2147483647);integer(parameter,0,0xffffffff);
 const reset=resetNativeRaceAudioTimers('800c21f4',mode,voice,context),g=reset.context,commands=[];
 for(const k of words)integer(g[k],-2147483648,2147483647);
 for(const k of bytes)integer(g[k],0,255);
 integer(g.random4562c,0,0xffffffff);
 const emit=(consumer,...args)=>commands.push({consumer,arguments:args.map(v=>v>>>0)});
 const pan=(split=false)=>{for(let lane=0;lane<6;lane++)emit('c53d4',0x03000000|(lane<<8),split?(lane<3?0:127):64);};
 const quiet=(...lanes)=>{for(const lane of lanes)emit('c538c',0x01000000|(lane<<8),0);};
 const setup=mode=>{emit('c1488');emit('c13ac',mode);};
 const preload=()=>{if(g.field7c98!==0){g.musicSelection=(parameter+6)|0;emit('c14d0',g.musicSelection);}};
 const result=()=>({state:reset.state,context:g,commands});
 g.tempoDelay7ce0=g.delay7cdc=g.resultFlag7dd0=g.alternateCue7cb0=0;
 emit('c16f0');
 const previous=(g.audioMode<<24)>>24;
 if(mode===previous&&(mode===1||mode===10))return result();
 g.audioMode=mode&255;g.primaryMuted=g.secondaryMuted=1;
 switch(mode){
 case 0:
  emit('c1698');if(previous!==0)emit('c1714',0);
  emit('c53d4',0x46010000,18);emit('c13ac',0);pan();emit('c1500',3,0);quiet(2,5);
  g.splitFlag7c90=0;g.cueBase7e05=255;g.raceMode=g.courseIndex=0;g.musicSelection=3;emit('bfb50');break;
 case 1:
  if(previous!==10){setup(1);emit('c1608',160);emit('c1588',4,80);quiet(2,5,7);g.cueBase7e05=255;g.raceMode=parameter|0;}
  emit('c37c0',13,10);break;
 case 2:
  setup(0);emit('c1674',0);emit('c1608',0);pan();emit('c538c',0x02000000,0);emit('c538c',0x02000300,0);quiet(2,5,7);
  g.splitFlag7c90=0;g.cueBase7e05=255;emit('bfb50');
  if(parameter===1){emit('c37f4',0x34,0);emit('c37c0',17,80);emit('c1500',25,10);}
  else{emit('c37c0',(parameter+16)>>>0,20);emit('c1500',5,10);}break;
 case 3:
  emit('c1488');if(g.stage7dc8===4)emit('c1500',22,40);emit('c13ac',1);
  if(g.raceMode===0)emit('c3524',parameter===0&&g.stage7dc8!==5?(g.stage7dc8+86)|0:91,40);break;
 case 4:
  emit('c5244',2,240);g.tempoDelay7ce0=80;
  if(g.courseIndex===0&&g.raceMode===0)quiet(12);g.stage7dc8=4;break;
 case 5:emit('c1500',23,10);emit('c3524',31,70);break;
 case 6:{
  g.cueBase7e05=255;g.resultFlag7dd0=1;emit('c538c',0x02000000,0);emit('c538c',0x02000300,0);quiet(2,5,7);emit('c5244',2,60);
  let stage=(parameter-1)|0;
  if(g.raceMode===0){
   g.musicSelection=(parameter+14)|0;emit('c32a0',14,126,20);emit('c32a0',14,126,20);
   if(stage===0){if(g.primaryCompanionFlag===0)emit('c32a0',16,127,20);else emit('c3524',15,40);g.delay7cdc=30;}
   else if(stage===4){emit('c32a0',(g.random4562c&1)+20,127,20);g.musicSelection=27;g.delay7cdc=30;stage=5;}
   else{emit('c3524',(parameter+15)>>>0,40);g.delay7cdc=20;}
   g.cueBase7e05=8;emit('c1eb8',15);
  }else{
   stage=parameter|0;
   if(g.raceMode===1){
    g.musicSelection=21;emit('c3500',g.primaryPlaceByte===0&&g.primaryCompanionFlag===0||g.secondaryPlaceByte===0&&g.secondaryCompanionFlag===0?16:14);g.delay7cdc=10;
   }else if(g.raceMode===2||g.raceMode===3){
    if((parameter&1)===0){g.musicSelection=20;emit('c3500',22);g.delay7cdc=g.raceMode===3?15:2;}
    else{g.musicSelection=17;emit('c3500',20);g.delay7cdc=30;}
    if(parameter&128)g.alternateCue7cb0=160;
   }
  }
  g.stage7dc8=stage;emit('c14d0',g.musicSelection);break;
 }
 case 7:
  Object.assign(g,nativeContactAudioMaterials(parameter));emit('c1714',parameter+1);g.courseIndex=parameter;
  if(g.raceMode===0){
   setup(0);g.splitFlag7c90=0;g.cueBase7e05=8;pan();preload();
   if(parameter===0){emit('c538c',0x02000300,0);emit('c538c',0x02000500,0x3f499326);g.delay7cd8=8;g.cueBase7e05=0;}
   else{emit('c1eb8',16);emit('bfb50');emit('c3524',parameter===7?9:parameter,15);}
  }else if(g.raceMode>=1&&g.raceMode<=3){
   setup(1);g.splitFlag7c90=Number(g.raceMode===1);g.cueBase7e05=g.raceMode===2?0:4;
   if(g.raceMode===1){pan(true);emit('c538c',0x02000300,0x3ef1e3c8);}
   else{emit('c538c',0x02000300,0);emit('c538c',0x02000500,parameter===0?0x3f499326:0);if(g.raceMode===2&&parameter===0)g.delay7cd8=8;}
   emit('c1eb8',2);preload();
  }
  emit('c14d0',26);break;
 case 8:emit('c53d4',0x46010000,18);emit('c13ac',0);break;
 case 9:if(g.musicSelection!==24){emit('c1588',24,40);g.musicSelection=24;}break;
 case 10:if(previous!==1){setup(1);emit('c1588',4,80);g.cueBase7e05=255;}emit('c37c0',12,15);break;
 case 11:
  emit('c1698');emit('c1714',10);
  if(g.difficultyWord===0||g.difficultyWord===1)g.creditsTrack7dd4=parameter===4?2:1;
  else if(g.difficultyWord===2)g.creditsTrack7dd4=0;
  emit('c141c');g.creditsCounter7e18=g.creditsField7e14=0;g.stage7dc8=(parameter-1)|0;emit('c14d0',28);break;
 case 12:if(previous===5){emit('c1698');emit('c13ac',0);emit('c1500',22,40);}break;
 case 255:emit('c1698');break;
 }
 emit('c53d4',0x06000c05,[0,6,7,11].includes(g.audioMode)?0:1);
 return result();
}
