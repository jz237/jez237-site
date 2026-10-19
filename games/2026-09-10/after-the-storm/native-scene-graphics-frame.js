const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}

/**801AE948 is a B2F0-buffer pointer installed by6A264, independently of the
 * 8011F8E0 selector for the AI/actor graphics buffers. Never alias the two. */
export function nativeSceneGraphicsBufferIndex(pointer){
 const address=integer(pointer,'scene graphics pointer',-2147483648,0xffffffff)>>>0;
 return integer((address-0x80198368)/0xb2f0,'scene graphics buffer pointer',0,1);
}

/** Complete6A264. Selects the buffer using the incoming4B0C value, then
 * toggles that selector for its NEXT call. Held gameplay still advances the
 * outer counter, selects buffers and resets the shared matrix allocator.
 * Existing buffer contents and the independent AI/actor selector survive. */
export function prepareNativeSceneGraphicsFrame(input){
 const latch=integer(input?.graphicsLatch4b08,'graphicsLatch4b08'),activity=integer(input.activity624,'activity624',-32768,32767),
  frame=integer(input.graphicsFrame4b04,'graphicsFrame4b04'),selector=integer(input.graphicsSelector4b0c,'graphicsSelector4b0c',0,1),operations=[];
 const write=(field,value)=>operations.push({kind:'sourceWordWrite',field,value:value>>>0});
 if(latch!==0)write('graphicsLatch4b08',0);
 if(activity===-1)write('ambientD4b00',integer(input.ambientD4b00,'ambientD4b00')+1);
 write('graphicsFrame4b04',frame+1);write('graphicsSelector4b0c',selector^1);
 const pointer=0x80198368+selector*0xb2f0;write('graphicsPointerE948',pointer);write('graphicsPointerE94c',pointer);write('matrixCountE950',0);
 return freeze({operations,diagnostic:{bufferIndex:selector,graphicsExecuted:false}});
}
