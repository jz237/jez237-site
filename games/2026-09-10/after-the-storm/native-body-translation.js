const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function word(v){if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid retained body word');return v;}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite body translation');return F(v);}
const decode=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};

/** Complete618F4: translate the retained point positions and histories together.
 * Velocity, orientation and per-point coefficients retain their storage.
 * Source body28 is the last hull-point index, so zero still translates point0.
 * This bounded physical-body view supports the twelve actual hull points.
 */
export function prepareNativeBodyTranslation({bodyWords,deltaNative}={}){
 if(!Array.isArray(bodyWords)||bodyWords.length!==1478)throw new RangeError('Supply retained physical bodyWords[1478]');
 const body=bodyWords.map(word),delta=['x','y','z'].map(k=>finite(deltaNative?.[k])),last=body[0x28/4]|0,bodyWordWrites=[];
 if(last< -1||last>11)throw new RangeError('Invalid physical hull last-point index');
 function add(offset,axis){const value=bits(F(decode(body[offset/4])+delta[axis]));body[offset/4]=value;bodyWordWrites.push({byteOffset:offset,width:4,value});}
 function point(offset){for(let axis=0;axis<3;axis++)add(offset+axis*4,axis);}
 for(let at=0xa20;at>=0x660;at-=0x28)for(let axis=0;axis<3;axis++){add(at+4+axis*4,axis);add(at+16+axis*4,axis);}
 for(let index=last;index>=0;index--)point(0x90+index*0x20);
 for(const at of [0xc14,0x44,0xbe4])point(at);
 const jointOrder=[17,16,15,7,14,6,10,13,9,12,8,11,2,5,1,4,0,3];
 for(let block=0xc88;block<=0x1198;block+=0x288)for(const joint of jointOrder)point(block+joint*0x24);
 return freeze({bodyWords:body,bodyWordWrites});
}
