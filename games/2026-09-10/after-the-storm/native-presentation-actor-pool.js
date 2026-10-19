// Retained presentation actors801CF060..801D0790, including the adjacent
// body-motion/record scratch. Independent of physical course collision objects.
import {prepareNativeIntroductionCourseEffects} from './native-introduction-course-effects.js';
import {prepareNativePackedMatrix} from './native-widget-transform.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
export const NATIVE_PRESENTATION_ACTOR_WORDS=1484;
function words(v,n,name){if(!Array.isArray(v)||v.length!==n||v.some(w=>!word(w)))throw new RangeError(`Supply ${name}[${n}]`);return [...v];}
function context(input){
 const actorWordsF060=words(input?.actorWordsF060,NATIVE_PRESENTATION_ACTOR_WORDS,'actorWordsF060'),actorControlWords62c4=words(input?.actorControlWords62c4,3,'actorControlWords62c4'),operations=[];
 function put(offset,value){if(!Number.isInteger(offset)||offset%4||offset<0||offset>=NATIVE_PRESENTATION_ACTOR_WORDS*4)throw new RangeError('Actor write outside retained owner');actorWordsF060[offset/4]=value>>>0;operations.push({kind:'presentationActorWrite',byteOffset:offset,width:4,value:value>>>0});}
 function control(offset,value){actorControlWords62c4[offset/4]=value>>>0;operations.push({kind:'presentationActorControlWrite',byteOffset:offset,width:4,value:value>>>0});}
 function half(offset,value){
  if(!Number.isInteger(offset)||offset%2||offset<0||offset>=NATIVE_PRESENTATION_ACTOR_WORDS*4)throw new RangeError('Actor halfword outside retained owner');
  const i=offset>>>2,shift=offset&2?0:16;actorWordsF060[i]=((actorWordsF060[i]&~(65535<<shift))|((value&65535)<<shift))>>>0;
  operations.push({kind:'presentationActorWrite',byteOffset:offset,width:2,value:value&65535});
 }
 const get=offset=>number(actorWordsF060[offset/4]);
 function sf(offset,value){value=F(value);if(!Number.isFinite(value))throw new RangeError('Nonfinite presentation actor result');put(offset,bits(value));}
 return {actorWordsF060,actorControlWords62c4,operations,put,half,control,get,sf,result:()=>freeze({actorWordsF060,actorControlWords62c4,operations,diagnostic:{graphicsExecuted:false}})};
}

function resetRows(q){
 const offsets=[4,0,0xac,0xa8,0xa4,0x70,0xa0,0x9c,0x98,0x94,0x90,0x8c,0x20,0x1c,0x18,0x54,0x50,0x78,0x74,0x60,0x5c,0x58,0x44,0x40,0x3c,0x38,0x34,0x30,0x2c,0x28,0x24,0x88,0x84,0x80,0x14,0x10,0xc,0xb8];
 for(let i=0;i<30;i++)for(const offset of offsets)q.put(i*0xbc+offset,0);
}

/** AB92C ->9D5C0: resets both allocation counters, then only source-selected
 * fields in all30 rows. Retains frame counter, row padding and motion scratch.
 */
export function prepareNativePresentationActorReset(input){
 const q=context(input);q.control(8,0);q.control(4,0);
 resetRows(q);
 return q.result();
}

/** Complete AC184 introduction (main8) startup, including9D5C0 and47EE0.
 * The host provides actual physical poses and selected active-water vertices.
 * Unlike AB92C, this path retains both allocation counters and speed maxima.
 * Ordinary racing's subsequent course-specific actor creation is a different
 * branch; rejecting it here prevents an incomplete initializer being admitted.
 */
export function prepareNativeIntroductionActorInitialization(input){
 if(input?.main638!==8)throw new RangeError('Actor introduction initialization requires main8');
 return initializeActorScratch(input).result();
}
function initializeActorScratch(input){
 const q=context(input),{players,primaryHumanIndex,secondaryHumanIndex,bodyPoseWordsBySlot,racerRecordWordsBySlot,selectedWaterVertexXZ}=input;
 if(![1,2].includes(players)||![0,1,2,3].includes(primaryHumanIndex)||![0,1,2,3].includes(secondaryHumanIndex))throw new RangeError('Invalid introduction body selection');
 const secondary=players===2?secondaryHumanIndex:primaryHumanIndex;
 const body=slot=>{const v=words(bodyPoseWordsBySlot?.[slot],6,'body pose');if(v.some(w=>!Number.isFinite(number(w))))throw new RangeError('Nonfinite introduction body pose');return v;};
 const p=body(primaryHumanIndex),s=body(secondary),pr=words(racerRecordWordsBySlot?.[primaryHumanIndex],4,'racer record'),sr=words(racerRecordWordsBySlot?.[secondary],4,'racer record'),off=a=>a+0x10000-0xf060;
 function vertex(index){const v=selectedWaterVertexXZ?.[index];if(!Array.isArray(v)||v.length!==2||v.some(n=>!Number.isInteger(n)||n< -32768||n>32767))throw new RangeError('Supply actual selected water vertex XZ');return v;}
 const first=vertex(0),second=vertex(players===2?1:0);
 q.control(0,(q.actorControlWords62c4[0]+1)>>>0);
 q.sf(off(0x778),first[0]);q.sf(off(0x780),first[1]);
 p.forEach((w,i)=>q.put(off(0x6bc+i*4),w));
 for(const a of [0x6d8,0x6dc,0x6e0])q.sf(off(a),0);
 p.slice(0,3).forEach((w,i)=>q.put(off(0x6e4+i*4),w));
 q.sf(off(0x6d4),0);if(q.get(off(0x724))<0)q.sf(off(0x724),0);
 for(const [a,i]of [[0x730,2],[0x738,0],[0x734,1],[0x73c,3]])q.put(off(a),pr[i]);
 q.sf(off(0x784),second[0]);q.sf(off(0x78c),second[1]);
 s.forEach((w,i)=>q.put(off(0x6f0+i*4),w));
 for(const a of [0x70c,0x710,0x714])q.sf(off(a),0);
 s.slice(0,3).forEach((w,i)=>q.put(off(0x718+i*4),w));
 q.sf(off(0x708),0);if(q.get(off(0x728))<0)q.sf(off(0x728),0);
 for(const [a,i]of [[0x744,2],[0x74c,0],[0x748,1],[0x750,3]])q.put(off(a),sr[i]);
 resetRows(q);
 // Actual readonly800E6280 matrix: reverse Z, retain X/Y/homogeneous axes.
 const matrix=prepareNativePackedMatrix({floatWords:[1065353216,0,0,0,0,1065353216,0,0,0,0,3212836864,0,0,0,0,1065353216]});
 for(const op of matrix.operations)q.half(off(0x678)+op.byteOffset,op.value);
 return q;
}

/** Complete AC184 numeric startup for all nine courses. Audio C53D4 is an
 * explicit ordered command; the original audio queue is owned by its consumer.
 * Controls62d0 are separate from the three allocation/frame words at62c4.
 * No course geometry or sine values are inferred from the modern scene.
 */
export function prepareNativeCourseActorInitialization(input){
 const signed=v=>Number.isInteger(v)&&v>=-2147483648&&v<=2147483647;
 if(!signed(input?.main638)||!signed(input.courseIndex)||!signed(input.mode620)||!signed(input.profileB340)||
    !Number.isInteger(input.reverseAB68)||input.reverseAB68< -32768||input.reverseAB68>32767||!word(input.rngState4640)||!word(input.audioScene7c9c))throw new RangeError('Supply course actor scene state');
 const actorControlWords62d0=words(input.actorControlWords62d0,2,'actorControlWords62d0');
 const q=initializeActorScratch(input),off=a=>a+0x10000-0xf060;
 let rngState4640=input.rngState4640,audioScene7c9c=input.audioScene7c9c;
 const finish=()=>freeze({...q.result(),actorControlWords62d0,rngState4640,audioScene7c9c});
 const counts=n=>{q.control(8,n);q.control(4,n);};
 if(input.main638===8||input.main638===21)return finish();
 if(input.players===2){counts(0);return finish();}
 q.sf(off(0x728),30);q.sf(off(0x724),30);
 if((input.courseIndex>>>0)>=9)return finish();
 const random=()=>{rngState4640=(Math.imul(rngState4640,0x41c64e6d)+12345)>>>0;q.operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;};
 const sine=index=>{const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[index&4095])||!Number.isFinite(number(a[index&4095])))throw new RangeError('Supply original sine table');return number(a[index&4095]);};
 const put=(row,o,v)=>q.put(row*0xbc+o,v),sf=(row,o,v)=>q.sf(row*0xbc+o,v);
 function swimmers(start,end){
  for(let r=start;r<end;r++){
   put(r,0x7c,255);sf(r,0xc,F((random()&1023)-512)+q.get(off(0x6bc)));sf(r,0x14,F((random()&1023)-512)+q.get(off(0x6c4)));
   const depth=random()&63;put(r,8,5);for(const o of [0x80,0x84,0x88])sf(r,o,100000);
   sf(r,0x10,-80-depth);put(r,0,7+r%3);put(r,0x74,0);put(r,0x78,0);
  }
 }
 function birds(start,x,z,y,dy,ix,iz){
  for(let r=start;r<start+5;r++,y+=dy,ix+=200,iz+=300){
   const px=F(F(sine(ix)*200)+x),pz=F(F(sine(iz)*300)+z);
   put(r,0,3);put(r,0x7c,255);put(r,8,1);sf(r,0xc,px);sf(r,0x10,y);sf(r,0x18,90);put(r,0x74,0);sf(r,0x14,pz);
   put(r,0x78,random()&63);sf(r,0x70,(random()&15)*10+200);
  }
 }
 switch(input.courseIndex){
 case 0:{
  const node=words(input.firstCourseNodeWords,3,'first course node');if(node.some(w=>!Number.isFinite(number(w))))throw new RangeError('Nonfinite course node');
  // C123C has five byte stores followed by one float store.
  for(const [o,v]of [[4,1],[5,1],[6,0],[7,63],[8,0]]){
   const at=off(0x668)+o,i=at>>>2,shift=(3-(at&3))*8;
   q.actorWordsF060[i]=((q.actorWordsF060[i]&~(255<<shift))|(v<<shift))>>>0;
   q.operations.push({kind:'presentationActorWrite',byteOffset:at,width:1,value:v});
  }
  q.sf(off(0x668),1);actorControlWords62d0[0]=0;q.operations.push({kind:'presentationActorAuxControlWrite',byteOffset:0,width:4,value:0});
  const z=F(number(node[2])+100),x=F(number(node[0])-200);
  sf(0,0x2c,0);sf(0,0x10,-20);sf(0,0x14,z);sf(0,0x6c,z);
  for(const [o,v]of [[0,6],[0x7c,255],[8,5],[0x9c,1]])put(0,o,v);
  sf(0,0xc,x);sf(0,0x64,x);put(0,0x50,0);put(0,0x54,0);put(0,0x74,5);put(0,0x78,10);
  for(const o of [0x18,0x28,0x24,0x1c])sf(0,o,0);sf(0,0x68,-20);
  for(let r=1;r<=3;r++)if((actorControlWords62d0[1]|0)>=r)put(r,0,6);
  for(let r=1;r<=3;r++){
   put(r,0x7c,0);put(r,8,5);for(const o of [0x2c,0x28,0x24,0x1c])sf(r,o,0);put(r,0x9c,1);
   for(const [o,v]of [[0x10,-20],[0x68,-20],[0x14,5000],[0x6c,5000],[0xc,47],[0x64,47]])sf(r,o,v);
   put(r,0x50,5);put(r,0x54,20);sf(r,0x18,180);
  }
  if(input.main638!==0)swimmers(4,12);counts(12);break;
 }
 case 1:swimmers(0,6);birds(6,3000,1100,100,50,2224,1800);counts(12);break;
 case 2:
  if(input.reverseAB68===0){
   // The integer division is performed before the shift: all three angles
   // are zero here. Preserve that source behavior, including retained flags.
   for(let r=0;r<3;r++){
    sf(r,0xc,-4300);sf(r,0x14,-800);put(r,8,1);put(r,0,6);sf(r,0x4c,40);
    sf(r,0x80,F(sine(1024)*200));sf(r,0x84,100000);sf(r,0x88,F(sine(0)*200));
   }
   for(let r=0;r<3;r++)put(r,0x9c,10+r);
  }else{
   for(const [o,v]of [[0x9c,0],[8,11],[0,6],[0xc4,12],[0xbc,6],[0x138,0],[0x1f4,0],[0x180,2],[0x178,6]])q.put(o,v);
   for(const [o,v]of [[0x14,4000],[0x18c,4000],[0x190,180],[0xc,6000],[0x18,90],[0x4c,25],[0x184,4800]])q.sf(o,v);
  }
  counts(3);break;
 case 3:
  for(let r=0;r<5;r++){
   put(r,0,4);put(r,0x7c,255);put(r,8,2);
   for(const [o,v]of [[0x84,80],[0x10,80],[0x80,-4000+r*100],[0xc,-4000+r*100],[0x18,270]])sf(r,o,v);
   put(r,0x74,0);put(r,0x78,0);sf(r,0x88,-2400);sf(r,0x14,-2400);sf(r,0x70,2000-(random()&1023));
  }
  counts(6);break;
 case 4:
  for(let r=0;r<6;r++){
   put(r,0,2);put(r,0x7c,255);put(r,8,2);sf(r,0x80,(random()&511)-256);
   const dz=(random()&255)-128;sf(r,0x18,0);put(r,0x74,0);put(r,0x78,0);sf(r,0x88,dz);
   const duration=(random()&1023)+1000;put(r,0x9c,0);sf(r,0x70,duration);
  }
  for(let r=6;r<10;r++){
   put(r,0x7c,255);sf(r,0xc,(random()&1023)-512+q.get(off(0x6bc)));sf(r,0x14,(random()&1023)-512+q.get(off(0x6c4)));
   const depth=random()&63;put(r,8,5);for(const o of [0x80,0x84,0x88])sf(r,o,100000);
   put(r,0,10);put(r,0x74,0);put(r,0x78,0);sf(r,0x8c,540+(r-6)*90);sf(r,0x10,-50-depth);
  }
  counts(11);break;
 case 5:
  audioScene7c9c=5;q.operations.push({kind:'sourceWordWrite',field:'audioScene7c9c',value:5},{kind:'externalCall',consumer:'800c53d4',arguments:[0x06000700,17]});
  put(0,0,12);put(0,0x7c,255);put(0,8,1);sf(0,0x10,50);sf(0,0xc,-2000);sf(0,0x2c,0);
  for(const [o,v]of [[0x9c,0],[0x74,0],[0x78,0],[0x50,10],[0x54,0]])put(0,o,v);
  for(const [o,v]of [[0x14,-5000],[0x18,135],[0x28,0],[0x24,0],[0x4c,10]])sf(0,o,v);
  counts(2);break;
 case 6:counts(0);break;
 case 7:
  if(input.mode620===4)for(let r=0;r<3;r++){
   if(r&&input.profileB340<(r===1?35:45))continue;
   put(r,0,5);put(r,0x7c,r?0:255);put(r,8,1);if(r===0)put(r,0x9c,6);
   for(const [o,v]of [[0xc,-3200],[0x10,-500],[0x14,4600],[0x18,180],[0x4c,50]])sf(r,o,v);
  }
  birds(3,5000,-2600,270,10,1624,900);counts(9);break;
 case 8:{
  sf(4,0x18,45);for(let r=4;r>=0;r--)put(r,0,13);for(let r=4;r>=0;r--)put(r,0x7c,255);for(let r=4;r>=0;r--)put(r,8,2);for(let r=3;r>=0;r--)sf(r,0x18,45);
  const points=[[2260,94,-2630],[2140,94,-2500],[1900,100,-2330],[1670,80,-2100],[1550,70,-1900]];
  for(let r=0;r<5;r++){
   const [x,y,z]=points[r];if(r<2||r===3){sf(r,0x84,y);sf(r,0xc,x);}else{sf(r,0xc,x);sf(r,0x84,y);}
   sf(r,0x10,y);sf(r,0x14,z);
  }
  if(input.mode620===4&&input.reverseAB68===0&&input.profileB340>=40){
   put(5,0,13);put(5,0x7c,255);put(5,8,1);put(5,0x74,1);sf(5,0x18,180);sf(5,0xc,-2571);
   const y=F(q.get(off(0x6c0))-500);sf(5,0x4c,30);sf(5,0x84,y);sf(5,0x10,y);put(5,0x50,18);sf(5,0x14,5120);sf(5,0x20,90);
  }
  counts(6);break;
 }
 }
 return finish();
}

/** ADD14 before actor display. Submitted rows bypass the position bounds.
 * Preserve the original Y-limit stores to Z; they do not alter Y itself.
 */
export function prepareNativePresentationActorBounds(input){
 const q=context(input);
 for(let row=0;row<30;row++){
  const base=row*0xbc;if(q.actorWordsF060[(base+0xb8)/4]!==0||q.actorWordsF060[base/4]===0)continue;
  for(const offset of [0xc,0x14]){const value=q.get(base+offset);if(value>8000)q.sf(base+offset,8000);if(value< -8000)q.sf(base+offset,-8000);}
  const y=q.get(base+0x10);if(y>4000)q.sf(base+0x14,4000);if(y< -4000)q.sf(base+0x14,-4000);
 }
 return q.result();
}

/** AE148..AE1EC, only AFTER the actor display stage. Permanent rows and all
 * non-type words survive. This must not run before cameras submit this frame.
 * This tail alone does not execute the enclosing ADF90 draw/culling functions.
 */
export function prepareNativePresentationActorRetirement(input){
 const q=context(input),permanent=q.actorControlWords62c4[1]|0;
 if(permanent<0)throw new RangeError('Actor retirement starts outside pool');
 q.control(8,permanent);let row=permanent;
 if(row<30){const end=row+((30-row)&3);while(row<end)q.put(row++*0xbc,0);
  for(;row<30;row+=4)for(const i of [1,2,3,0])q.put((row+i)*0xbc,0);
 }
 return q.result();
}

/** Whole AC098 append. Reaching slot30 exits before its final count store.
 * Preserve that retained-count behavior rather than replacing it with a clamp.
 */
export function prepareNativePresentationActorSubmission(input){
 const q=context(input),count=input?.count;
 if(!Number.isInteger(count)||count< -2147483648||count>2147483647)throw new RangeError('Supply signed actor submission count');
 const current=q.actorControlWords62c4[2]|0,target=(current+count)|0;
 if(current>=30)return q.result();
 const source=input.sourceWords;
 for(let slot=current,row=0;slot<target;slot++,row++){
  if(slot<0)throw new RangeError('Actor submission starts outside pool');
  if(!Array.isArray(source)||source.length<(row+1)*13)throw new RangeError('Missing actor submission source row');
  const values=source.slice(row*13,row*13+13);if(values.some(w=>!word(w)))throw new RangeError('Invalid actor submission source word');
  q.put(slot*0xbc+0xb8,1);
  const offsets=[0,0x74,0x78,0xc,0x10,0x14,0x30,0x34,0x38,0x3c,0x40,0x44,0x48];
  offsets.forEach((offset,j)=>q.put(slot*0xbc+offset,values[j]));
  if(slot+1>=30)return q.result();
 }
 q.control(8,target);return q.result();
}

/** Complete AB95C(1,0), including common body/record/water-vertex scratch.
 * The caller supplies the actual selected physical bodies and retained source
 * vertex coordinates; this does not synthesize them from the modern camera.
 * Generic request-list production is a different branch and is not exposed.
 */
export function prepareNativeSunsetIntroductionActors(input){
 const q=context(input),{players,primaryHumanIndex,secondaryHumanIndex,bodyPoseWordsBySlot,racerRecordWordsBySlot,selectedWaterVertexXZ}=input;
 if(![1,2].includes(players)||![0,1,2,3].includes(primaryHumanIndex)||![0,1,2,3].includes(secondaryHumanIndex))throw new RangeError('Invalid actor body selection');
 const secondary=players===2?secondaryHumanIndex:primaryHumanIndex;
 const body=slot=>{const v=words(bodyPoseWordsBySlot?.[slot],6,'body pose');if(v.some(w=>!Number.isFinite(number(w))))throw new RangeError('Nonfinite actor body pose');return v;};
 const primaryBody=body(primaryHumanIndex),secondaryBody=body(secondary),primaryRecord=words(racerRecordWordsBySlot?.[primaryHumanIndex],4,'racer record'),secondaryRecord=words(racerRecordWordsBySlot?.[secondary],4,'racer record');
 function vertex(i){const v=selectedWaterVertexXZ?.[i];if(!Array.isArray(v)||v.length!==2||v.some(n=>!Number.isInteger(n)||n< -32768||n>32767))throw new RangeError('Supply actual selected water vertex XZ');return v;}
 const first=vertex(0),second=vertex(players===2?1:0),off=a=>a+0x10000-0xf060;
 q.control(0,(q.actorControlWords62c4[0]+1)>>>0);q.sf(off(0x778),first[0]);q.sf(off(0x780),first[1]);
 primaryBody.forEach((w,i)=>q.put(off(0x6bc+i*4),w));
 const p=primaryBody.slice(0,3).map(number),delta=p.map((v,i)=>F(v-q.get(off(0x6e4+i*4))));
 q.sf(off(0x6d8),delta[0]);q.sf(off(0x6dc),delta[1]);
 for(let i=0;i<3;i++)q.sf(off(0x6e4+i*4),p[i]);q.sf(off(0x6e0),delta[2]);
 const speed=F(Math.sqrt(F(F(delta[0]*delta[0])+F(delta[2]*delta[2]))));
 q.sf(off(0x6d4),speed);if(q.get(off(0x724))<speed)q.sf(off(0x724),speed);
 for(const [offset,index]of [[0x730,2],[0x738,0],[0x734,1],[0x73c,3]])q.put(off(offset),primaryRecord[index]);
 q.sf(off(0x784),second[0]);q.sf(off(0x78c),second[1]);
 secondaryBody.forEach((w,i)=>q.put(off(0x6f0+i*4),w));
 const p2=secondaryBody.slice(0,3).map(number),delta2=p2.map((v,i)=>F(v-q.get(off(0x718+i*4))));
 for(let i=0;i<3;i++)q.sf(off(0x70c+i*4),delta2[i]);
 for(let i=0;i<3;i++)q.sf(off(0x718+i*4),p2[i]);
 // The original second speed calculation deliberately rereads PRIMARY dx/dz.
 q.sf(off(0x708),speed);if(q.get(off(0x728))<speed)q.sf(off(0x728),speed);
 for(const [offset,index]of [[0x744,2],[0x74c,0],[0x748,1],[0x750,3]])q.put(off(offset),secondaryRecord[index]);
 if((q.actorControlWords62c4[2]|0)>=30)return q.result();
 q.put(0xc,1169915904);
 for(const [offset,v]of [[0x9c,2],[8,11],[0,6],[0xc4,12],[0xbc,6],[0x138,0],[0x1f4,0],[0x180,2],[0x178,6]])q.put(offset,v);
 q.control(8,3);q.control(4,3);
 for(const [offset,v]of [[0x14,4000],[0x18c,4000],[0x18,90],[0x4c,25],[0x184,4800],[0x190,180]])q.sf(offset,v);
 return q.result();
}

/** Expand all three introduction actor boundaries against one detached pool,
 * in source order. The result owns submitted numeric actors, not GPU drawing.
 */
export function prepareNativeIntroductionActors(input){
 const valid=context(input),prepared=prepareNativeIntroductionCourseEffects(input),operations=[];
 let actorWordsF060=valid.actorWordsF060,actorControlWords62c4=valid.actorControlWords62c4,rngState4640=input.rngState4640;
 const hudWords7788=[...input.hudWords7788];
 for(const op of prepared.operations){
  if(op.kind==='externalCall'){
   const pool={actorWordsF060,actorControlWords62c4};let expanded;
   if(op.consumer==='800ab92c')expanded=prepareNativePresentationActorReset(pool);
   else if(op.consumer==='800ab95c'){
    if(op.arguments[0]!==1||op.arguments[1]!==0)throw new RangeError('Unsupported introduction actor producer');
    expanded=prepareNativeSunsetIntroductionActors({...input,...pool});
   }else if(op.consumer==='800ac098'){
    if(op.arguments[0]!==0x80228190)throw new RangeError('Unsupported introduction actor source');
    expanded=prepareNativePresentationActorSubmission({...pool,count:op.arguments[1]|0,sourceWords:hudWords7788.slice((0x8190-0x7788)/4,(0x87a8-0x7788)/4)});
   }else throw new RangeError('Unconsumed introduction actor effect');
   actorWordsF060=expanded.actorWordsF060;actorControlWords62c4=expanded.actorControlWords62c4;operations.push(...expanded.operations);
  }else{
   if(op.kind==='hudWrite')hudWords7788[op.byteOffset/4]=op.value;
   else if(op.kind==='sourceWordWrite'&&op.field==='rngState4640')rngState4640=op.value;
   else throw new RangeError('Unsupported introduction numeric effect');
   operations.push(op);
  }
 }
 return freeze({operations,hudWords7788,rngState4640,actorWordsF060,actorControlWords62c4,
  diagnostic:{...prepared.diagnostic,actorsSubmitted:true,graphicsExecuted:false}});
}
