// Independently reconstructed result-menu entry callers. Resources, fades and
// audio are ordered call recipes here; no original assets or tables are embedded.
const entries={
 '801ec20c':{game:50,main:3},'801ec830':{game:80,main:13},
 '801ec9c8':{game:100,main:6},'801ece50':{game:54,main:18}
};
function word(value,name){if(!Number.isInteger(value)||value<-2147483648||value>2147483647)throw new RangeError(`Invalid ${name}`);return value;}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Direct C20C/C830/C9C8/CE50 numeric initialization in source order.
 * input.consumer selects the original entry; value.scene supplies gameStateAb24
 * and, only for C830/C9C8, mode608. Effects are recipes, not executed callbacks.
 * These callers initialize menus; their subsequent loops, resource transfers,
 * rendering and record persistence are separate responsibilities.
 */
export function prepareNativeRaceMenuInitialization(value,input){
 const consumer=input?.consumer;
 if(!Object.hasOwn(entries,consumer))throw new RangeError('Unsupported result-menu consumer');
 const scene=value?.scene,previous=word(scene?.gameStateAb24,'scene.gameStateAb24'),entry=entries[consumer],operations=[];
 const write=(field,value)=>operations.push({kind:'sourceWordWrite',field,value:value>>>0});
 const call=(consumer,args)=>operations.push({kind:'externalCall',consumer,arguments:args});
 const phases=()=>{write('simulation648',1);write('field64c',1);write('phase650',0);};
 const fade=(type=4,rate=1)=>call('801e6fb0',[type,rate,0]);
 const slots=()=>call('801e6a4c',[0,0]);
 const resources=()=>call('80096960',[2,0,1,2,3]);
 write('previousGameState634',previous);write('returnState630',0);write('gameStateAb24',entry.game);
 for(const [field,v]of [['main638',entry.main],['initLatch63c',1],['field640',0],['field644',0],['fieldAb1c',0],['field461c',2],['players',1]])write(field,v);
 if(consumer!=='801ece50')phases();
 if(consumer==='801ec20c'){
  if(previous!==100){resources();fade();slots();}
 }else if(consumer==='801ec830'){
  const mode=word(scene.mode608,'scene.mode608'),curtain=mode===4?previous===67:previous!==50&&previous!==57;
  if(curtain){fade();call('800c6ad0',[1]);}slots();
 }else if(consumer==='801ec9c8'){
  const mode=word(scene.mode608,'scene.mode608');if(mode===0||mode===11)resources();
  if(previous===103)fade(7,20);else if(previous===42)fade();slots();
 }else{fade();slots();phases();}
 operations.push({kind:'hudWrite',byteOffset:0x7c80-0x7788,width:4,value:1});
 if(consumer==='801ec20c')call('800c21f4',[3,0]);
 else if(consumer==='801ec9c8')call('800c21f4',[12,0]);
 else if(consumer==='801ece50')call('800c6ad0',[1]);
 return freeze({operations,diagnostic:{consumer,targetGameState:entry.game,targetMain:entry.main,
  requiredExternalConsumers:operations.filter(o=>o.kind==='externalCall').map(o=>o.consumer),
  externalHelpersExecuted:false,menuLoopExecuted:false,resourceLoadingPerformed:false,recordsPersisted:false}});
}
