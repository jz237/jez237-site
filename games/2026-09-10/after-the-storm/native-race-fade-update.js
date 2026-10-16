// Source 1E71A8 and its four numeric fade branches. One call per original
// update, after world/overlay updates; never once per interpolated draw.
const HUD=0x7788,BASE=0x8a10,F=Math.fround;
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires ${count} words`);return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const bitsView=new DataView(new ArrayBuffer(4));
function bits(v){bitsView.setFloat32(0,v);return bitsView.getUint32(0);}
export function prepareNativeRaceFadeUpdate(input){
 if(!input||typeof input!=='object')throw new TypeError('Expected retained fade input');
 const hud=words(input.hudWords7788,'hudWords7788',1442),operations=[];
 const half=o=>{const a=BASE+o-HUD;return (hud[a>>>2]>>>(a&2?0:16))<<16>>16;};
 const write=(o,value)=>{const a=BASE+o-HUD,shift=a&2?0:16,v=value&65535;hud[a>>>2]=((hud[a>>>2]&~(65535<<shift))|(v<<shift))>>>0;operations.push({kind:'hudWrite',byteOffset:a,width:2,value:v});};
 const call=(consumer,args)=>operations.push({kind:'externalCall',consumer,arguments:args.map(x=>x>>>0)});
 const reset=()=>{const template=words(input.fadeTemplateWords6cc0,'fadeTemplateWords6cc0',9);for(let i=0;i<9;i++){hud[(BASE-HUD)/4+i]=template[i];operations.push({kind:'hudWrite',byteOffset:BASE-HUD+i*4,width:4,value:template[i]});}write(6,1);};
 if(half(6)===1)write(6,0);
 const kind=half(0);
 if(kind<1||kind>7)return freeze({operations,diagnostic:{kind,active:false}});
 write(4,1);write(6,2);
 const stage=half(2),counter=half(8),curtain=kind>=4&&kind<=6,reverse=kind===2||kind===7;
 if(stage===0){
  if(counter>=half(10)){
   write(2,1);write(8,0);
   if(kind===5&&integer(input.main638,'main638')!==8)call('800c37f4',[half(12)===2?56:42,0]);
  }else{if(!curtain)write(22,0);write(8,counter+1);}
 }else if(stage===1){
  if(curtain){
   write(8,counter+1);write(24,half(24)+20);
   const limit=kind===5?-85:250;
   if(half(24)>=limit){write(2,2);write(24,limit);write(8,0);}
  }else{
   const rate=half(12);
   if(counter>rate){write(2,2);write(8,0);write(22,reverse?0:255);}
   else{
    const alpha=reverse?F(F(F(rate-counter)/F(rate))*F(255)):F(F(F(counter)*F(255))/F(rate));
    if(!Number.isFinite(alpha))throw new RangeError('Nonfinite original fade division');
    write(8,counter+1);write(22,Math.trunc(alpha));
   }
  }
 }else if(stage===2){if(counter>=half(14))reset();else write(8,counter+1);}
 if(curtain){
  // Required original matrix consumers, including their perspective-normal
  // store at HUD8A34, remain ordered effects in their own presentation owner.
  // These calls do not alter the fade's 36-byte property record read below.
  const frame=integer(input.frameBufferBase,'frameBufferBase',0,0xffffffff);
  if(frame%4||frame>0xffffffff-0x1340)throw new RangeError('Invalid frameBufferBase range/alignment');
  call('800481e0',[frame+0x1300,0x80228a34,bits(33),bits(1),bits(16),bits(4096),0,0]);
  call('80048a88',[frame+0x1340,0,0,bits(kind===5?1:-1),0,bits(1),0,bits(half(24)),bits(half(26)),bits(-250),bits(.05)]);
  write(30,half(30)+1);
  if(half(30)>=2){const toggle=half(28);write(30,0);write(28,toggle^1);}
 }
 return freeze({operations,diagnostic:{kind,active:true}});
}
