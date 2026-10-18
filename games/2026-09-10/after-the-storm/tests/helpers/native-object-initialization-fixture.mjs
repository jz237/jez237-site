// Synthetic retained buffers and source-shaped templates. No original course
// geometry is implied by these deterministic numeric fixtures.
const view=new DataView(new ArrayBuffer(4));
const bits=v=>{view.setFloat32(0,v);return view.getUint32(0);};
export function objectInitializationFixture(kinds,{course=1,players=1,difficulty=1,mode=11,reverse=0,alternate=0,param=0}={}){
 const objectWordsC940=Array.from({length:3136},(_,i)=>0x12340000+i);
 for(const [i,kind]of kinds.entries())for(const [a,v]of [[0x24,bits(i*71-300)],[0x28,bits(64+i)],[0x2c,bits(137-i*99)],
  [0x48,bits(i*37.25-90)],[0x4c,kind],[0x50,param],[0x58,17+i],[0xc0,i]])objectWordsC940[i*49+a/4]=v>>>0;
 const planeTemplatesByAddress={};
 for(let a=0x800d6cf0;a<0x800d7db0;a+=64){const j=(a-0x800d6cf0)/64;
  planeTemplatesByAddress[a]=[j+.25,-7.5,2.75,1,.25,-.5,.1,1,.2,-.25,.5,1].map(bits).concat([100+j,200+j,300+j,400+j]);}
 return {objectWordsC940,collisionPlaneWordsFd78:Array.from({length:512},(_,i)=>0x34560000+i),
  packedObjectMatrixWords0cd0:Array.from({length:1024},(_,i)=>0x45670000+i),objectCountFa40:kinds.length,
  courseIndex:course,players,difficulty,mode620:mode,reverseDab68:reverse,alternate8250:alternate,planeTemplatesByAddress,
  kind11DisplayListWords:Array.from({length:8},(_,i)=>0x12345678+course*16+i)};
}
