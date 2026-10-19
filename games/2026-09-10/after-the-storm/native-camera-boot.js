// Original DD85C camera bootstrap and DFD8C/DFDA0/DFDA8 pointer setters.
// Addresses are retained numeric owner links, never executable browser pointers.
export function prepareNativeCameraBoot({hudWords7788}={}){
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!Number.isInteger(v)||v<0||v>0xffffffff))
  throw new RangeError('Supply canonical hudWords7788[1442]');
 const hud=[...hudWords7788],operations=[];
 const write=(a,value)=>{const byteOffset=a-0x7788;hud[byteOffset/4]=value>>>0;operations.push(Object.freeze({kind:'hudWrite',byteOffset,width:4,value:value>>>0}));};
 // Bootstrap initializes both retained camera slots even in a solo scene.
 // Cursor/timer, path counters, camera type and auxiliary values are untouched.
 for(let index=0;index<2;index++){
  const c=0x7c80+index*0x10c,s=0x8058+index*0x38;
  write(c+0xe8,index);write(c+0xec,1);write(c+0xf8,0);write(c+0xfc,0);
  write(s,0x80227e98+index*0xe0);write(s+12,0x802280c8+index*0x20);
  [4,8,12,0x1c,0x20,0x24,0x10,0x14,0x18].forEach((offset,i)=>write(s+0x10+i*4,0x80220000+c+offset));
  write(s+0x34,0x80228108);
 }
 return Object.freeze({operations:Object.freeze(operations),hudWords7788:Object.freeze(hud),
  diagnostic:Object.freeze({cameraCount:2,scriptExecuted:false,sceneInitialized:false})});
}
