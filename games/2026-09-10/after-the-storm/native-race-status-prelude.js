// Numeric FC39C status/timer prelude. Retained HUD words are caller-owned;
// these partial writes run once per ordinary source update, before EF504.
const BASE=0x7788,COUNT=1442,MAX=2147483647;
function integer(v,n,min=-2147483648,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** Complete FC39C body; no original art or external helper is used. Input is
 * {hudWords7788,scene:{mode620,players?}}. players is read only for mode1 and
 * is bounded above by the actual two-entry HUD storage. Nonpositive source
 * values skip that loop. Signed32 arithmetic, source store order and retained
 * counter saturation are literal. Preparation executes no rendering callback.
 */
export function prepareNativeRaceStatusPrelude(value){
 if(!value||typeof value!=='object'||!value.scene||typeof value.scene!=='object')throw new TypeError('Expected source status prelude state');
 if(!Array.isArray(value.hudWords7788)||value.hudWords7788.length!==COUNT)throw new RangeError('hudWords7788 requires1442 unsigned words');
 const hud=Array.from(value.hudWords7788,v=>integer(v,'HUD word',0,0xffffffff)),operations=[];
 const read=a=>hud[(a-BASE)/4]|0,write=(a,v)=>{hud[(a-BASE)/4]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-BASE,width:4,value:v>>>0});};
 if(read(0x8aa4)===1){
  const x=(read(0x8b50)+30)|0,y=(read(0x8b54)-30)|0;
  write(0x8b50,x);write(0x8b54,y);if(x>=320)write(0x8aa4,2);
 }
 if(integer(value.scene.mode620,'mode620')===1){
  const event=read(0x8aa8);
  if(event!==0){
   if(event===1){write(0x8e00,1);write(0x8e04,2);}
   else if(event===2){write(0x8e00,2);write(0x8e04,1);}
   else{write(0x8e04,3);write(0x8e00,3);}
   write(0x8aa8,0);write(0x8e0c,0);write(0x8e08,0);
  }
  const count=integer(value.scene.players,'players',-2147483648,2);
  for(let i=0;i<count;i++)if(read(0x8e00+i*4)!==0&&read(0x8e08+i*4)<MAX)write(0x8e08+i*4,(read(0x8e08+i*4)+1)|0);
 }
 return freeze({operations});
}
