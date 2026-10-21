import {stepNativeAIRandom} from './native-ai-initialization.js';
import {prepareNativePresentationActorReset,prepareNativePresentationActorSubmission} from './native-presentation-actor-pool.js';
// DD6B4's main21 branch: the championship ending's timed presentation actors.
// Numeric windows (start frame, end frame, from xyz, to xyz, speed, life) from
// 80225D94/80225E0C (Normal and Hard top three) and 80225CF4 (Expert 2nd/3rd).
// Rows are type 3, which Southern Island's loaded banks draw as gulls.
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const float=w=>{b.setUint32(0,w>>>0);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const windows=rows=>freeze(rows.map(([start,end,...rest])=>({start,end,words:rest})));
export const NATIVE_ENDING_CEREMONY_DATA=freeze({
 podiumWindows80225d94:windows([
  [600,800,0x451c4000,0x43d70000,0x447a0000,0x453c6000,0x43c90000,0x4496c000,0x41300000,200],
  [800,950,0x451c4000,0x43f00000,0x44960000,0x452d9000,0x44030000,0x446f4000,0x41300000,200],
  [950,1400,0x45642000,0x43b90000,0x447a0000,0x453b1000,0x43df0000,0x445e4000,0x41200000,450]]),
 podiumSecondWindow80225e0c:windows([[950,1300,0x4512e000,0x43b40000,0x44a28000,0x453b2000,0x43c90000,0x4496c000,0x41400000,400]])[0],
 expertWindows80225cf4:windows([
  [800,1000,0x45802000,0x439b0000,0x44960000,0x45522000,0x43878000,0x446f4000,0x41300000,200],
  [1000,1200,0x451c4000,0x43a50000,0x447a0000,0x45536000,0x43828000,0x4476c000,0x41300000,200],
  [1200,1300,0x457a0000,0x43eb0000,0x44548000,0x45536000,0x43800000,0x4476c000,0x41400000,200],
  [1420,1800,0x455de000,0x432a0000,0x449c4000,0x45536000,0x43af8000,0x4476c000,0x41200000,450]]),
 rowConstant80225f10:0x3dcccccd
});

/** One DD6B4 main21 call for camera0 (camera type 8), then AC098. Supplies the
 * scene's retained difficulty B338 and rank 2C70. The Expert champion's flock
 * script (801DB8F0) is not reconstructed: that case submits no rows. The
 * caller increments the camera block's frame counter afterwards (DE32C). */
export function prepareNativeEndingCeremonyActors({hudWords7788,rngState4640,actorWordsF060,actorControlWords62c4,difficulty,rank,data=NATIVE_ENDING_CEREMONY_DATA}={}){
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442)throw new RangeError('Supply canonical hudWords7788[1442]');
 if(!Number.isInteger(rngState4640)||rngState4640<0||rngState4640>0xffffffff||!Number.isInteger(difficulty)||!Number.isInteger(rank))throw new RangeError('Supply the ending difficulty, rank and random state');
 const hud=[...hudWords7788],operations=[],i=a=>(a-0x7788)/4;
 const put=(a,v)=>{hud[i(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});};
 const putF=(a,v)=>put(a,bits(F(v))),getF=a=>float(hud[i(a)]),word=a=>hud[i(a)]|0;
 let rng=rngState4640;const rand=()=>{rng=stepNativeAIRandom(rng).value;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rng});return rng;};
 let pool={actorWordsF060,actorControlWords62c4};
 const reset=()=>{const q=prepareNativePresentationActorReset(pool);pool={actorWordsF060:q.actorWordsF060,actorControlWords62c4:q.actorControlWords62c4};operations.push(...q.operations);};
 // DB0E4: spawn a type-3 row at the window's start point heading for its end point.
 function spawn(row,w,aux){
  put(row,3);put(row+4,0);
  // DAFB8: a random wing-beat phase, usually flapping, sometimes gliding.
  put(row+8,(rand()&7)!==0?rand()%15:rand()%19+25);
  const from=w.words.slice(0,3).map(float),to=w.words.slice(3,6).map(float),d=[0,1,2].map(k=>F(to[k]-from[k]));
  from.forEach((v,k)=>putF(row+0xc+k*4,v));
  const length=F(Math.sqrt(F(F(d[2]*d[2])+F(F(d[0]*d[0])+F(d[1]*d[1])))));
  d.forEach((v,k)=>putF(row+0x18+k*4,F(v/length)));
  putF(row+0x24,0);putF(row+0x28,1);putF(row+0x2c,0);put(row+0x30,data.rowConstant80225f10);
  put(aux,w.words[7]);
 }
 // DB1DC: DB024's wing-beat step, then one speed step along the heading.
 function move(row,w,aux){
  let f=word(row+8);
  if(f>=0&&f<16){f+=2;if(f>=16)f=(rand()&7)!==0?0:16;}
  else if(f<25)f+=1;
  else if(f<45){f+=1;if(f>=45)f=(rand()&15)!==0?45:25;}
  else{f+=1;if(f>=55)f=0;}
  put(row+8,f);
  if(word(aux)<=0){put(row,0);return;}
  const speed=float(w.words[6]);
  for(let k=0;k<3;k++)putF(row+0xc+k*4,F(getF(row+0xc+k*4)+F(getF(row+0x18+k*4)*speed)));
 }
 const counter=word(0x8058+8);
 put(0x87a8,0);
 let script=null;
 if(difficulty===0||difficulty===1){put(0x87ac,rank);if(rank<3)script='podium';}
 else if(difficulty===2){if(rank===0)script='expertChampion';else if(rank===1){put(0x87ac,4);script='expert';}else if(rank===2){put(0x87ac,3);script='expert';}}
 if(script==='podium'){
  if(counter===0)reset();
  for(const w of data.podiumWindows80225d94)if(counter>=w.start&&counter<w.end){
   put(0x87a8,word(0x87a8)+1);if(counter===w.start)spawn(0x8190,w,0x8110);move(0x8190,w,0x8110);
  }
  const w=data.podiumSecondWindow80225e0c;
  if(counter>=w.start&&counter<w.end){put(0x87a8,word(0x87a8)+1);if(counter===w.start)spawn(0x81c4,w,0x8114);move(0x81c4,w,0x8114);}
 }else if(script==='expert'){
  if(counter===0)reset();
  const n=word(0x87ac);
  for(let k=0;k<n;k++){const w=data.expertWindows80225cf4[k];
   if(counter>=w.start&&counter<w.end){put(0x87a8,1);if(counter===w.start)spawn(0x8190,w,0x8110);move(0x8190,w,0x8110);}}
 }
 if(script){
  const q=prepareNativePresentationActorSubmission({...pool,count:word(0x87a8),sourceWords:hud.slice(i(0x8190),i(0x87a8))});
  pool={actorWordsF060:q.actorWordsF060,actorControlWords62c4:q.actorControlWords62c4};operations.push(...q.operations);
 }
 return freeze({hudWords7788:hud,rngState4640:rng,...pool,operations,diagnostic:{script,counter,submitted:script?word(0x87a8):0,expertChampionFlockReconstructed:false}});
}
