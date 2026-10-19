const F=Math.fround,b=new DataView(new ArrayBuffer(4));
function finite(v,name){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Invalid '+name);return F(v);}
function word(v){if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid boundary word');return v;}
function decode(w){b.setUint32(0,word(w));return finite(b.getFloat32(0),'boundary float');}
function bits(v){b.setFloat32(0,v);return b.getUint32(0);}

/** Original65C18..65D14 prefix, before the remaining actor/contact work.
 * The source's six world-wrap fields are supplied explicitly, including both
 * signed displacement periods. Equality stays inside. Lower bounds have
 * priority even for inverted bounds; do not replace this with clamp/modulo.
 * These are bodyBF0/BF4 writes, not forces or rendered shoreline bounds.
 */
export function prepareNativeBodyBoundaryDrift(input){
 const a=input?.boundsWords24ac;
 if(!Array.isArray(a)||a.length!==6)throw new RangeError('Supply six retained boundsWords24ac');
 const [maxX,minX,periodX,maxZ,minZ,periodZ]=a.map(decode),x=finite(input.positionNativeXZ?.x,'body44'),z=finite(input.positionNativeXZ?.z,'body4c');
 const dx=x<minX?periodX:maxX<x?-periodX:0,dz=z<minZ?periodZ:maxZ<z?-periodZ:0;
 return Object.freeze({driftNative:Object.freeze({x:dx,z:dz}),bodyWordWrites:Object.freeze([
  Object.freeze({byteOffset:0xbf0,width:4,value:bits(dx)}),Object.freeze({byteOffset:0xbf4,width:4,value:bits(dz)})
 ])});
}

/** Read the actual water setup owner80192420, not race records801C1F94.
 * Identical low address digits do not make these the same memory region.
 * This does not initialize either owner or commit the physical phase.
 */
export function nativeBodyBoundaryDriftView(waterScene,positionNativeXZ){
 if(!waterScene?.setupWords)throw new RangeError('Supply retained water setupWords');
 return prepareNativeBodyBoundaryDrift({boundsWords24ac:Array.from({length:6},(_,i)=>waterScene.setupWords[0x8c+i*4]),positionNativeXZ});
}
