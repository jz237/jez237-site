import {stepNativeAIRandom} from './native-ai-initialization.js';
import {prepareNativePresentationActorReset,prepareNativePresentationActorSubmission} from './native-presentation-actor-pool.js';
import {prepareNativeIntroductionFlock} from './native-introduction-flock.js';
import {nativePhaseSine} from './native-math-tables.js';
// DD6B4's main21 branch: the championship ending's timed presentation actors.
// Numeric windows (start frame, end frame, from xyz, to xyz, speed, life) from
// 80225D94/80225E0C (Normal and Hard top three) and 80225CF4 (Expert 2nd/3rd).
// The Expert champion's flock (801DB8F0) adds four steered leaders around a base
// point (80225CB4) and a seven-bird DB284/DB430 flock (template 80225CC0).
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
 rowConstant80225f10:0x3dcccccd,
 championBase80225cb4:[0x44af0000,0x44110000,0x44638000],
 championFlockTemplate80225cc0:[0x4531d000,0x44668000,0x444e8000,0x44480000,0xc2480000,0,0x43960000,0x41f00000,0x43960000,0x41100000,0x40200000,0x4189999a,0x3f000000],
 championConstants80225f20:[0x3dcccccd,0x404ccccd,0x3dcccccd]
});

/** One DD6B4 main21 call for camera0 (camera type 8), then AC098. Supplies the
 * scene's retained difficulty B338 and rank 2C70. The caller increments the
 * camera block's frame counter afterwards (DE32C). */
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
 else if(script==='expertChampion'){
  if(counter===0)reset();
  put(0x87a8,11);
  const base=data.championBase80225cb4.map(float),[c20,c24,c28]=data.championConstants80225f20.map(float),sqrt=v=>F(Math.sqrt(v));
  if(counter>=860&&counter<1501){
   if(counter===860){
    for(let k=0;k<4;k++){
     const row=0x8190+k*0x34,timer=0x8110+k*4,pair=0x8120+k*8,fk=F(k);
     put(row,3);put(row+4,0);put(row+8,rand()%15);
     putF(row+0xc,F(F(rand()&7)+F(base[0]+F(fk*35))));
     putF(row+0x10,F(F(sqrt(F(Math.imul(rand()&0x7ff,k)>>>0))*c24)+base[1]));
     const side=(k&4)!==0?1:-1,z=F(F(side*sqrt(F(Math.imul(rand()&0x1ff,k)>>>0)))+base[2]);
     putF(row+0x24,0);putF(row+0x28,1);putF(row+0x2c,0);putF(row+0x30,c20);putF(row+0x14,z);
     put(timer,(rand()&15)+3);
     putF(pair,0);
     const r=rand(),t=F((r&3)+1);putF(pair+4,F(F(sqrt(F(fk/4))*F(t+t))+11));
    }
    // A random few leaders cruise faster with an endless wing-beat timer.
    let n=(rand()&3)+2,k=0;
    do{
     const index=Math.trunc(F(sqrt(sqrt(F(F(rand()&3)/4)))*4));
     put(0x8110+index*4,0xffff);putF(0x8120+index*8+4,F(F(rand()&3)+12.5));
     k++;n=(rand()&3)+2;
    }while(k<n);
   }
   const lift=F(c28*c28);
   for(let k=0;k<4;k++){
    const row=0x8190+k*0x34,timer=0x8110+k*4,pair=0x8120+k*8;
    const f=word(row+8),next=f+(f<16?2:1);put(row+8,next);
    const remaining=word(timer);
    if(remaining<=0){if(!(next<45))put(row+8,25);}
    else if(!(next<16)){put(row+8,0);put(timer,remaining-1);}
    const angle=getF(pair),phase=Math.trunc(F(F(angle*4096)/360)),cos=nativePhaseSine((phase+0x400)&0xfff),sin=nativePhaseSine(phase&0xfff);
    const length=sqrt(F(F(sin*sin)+F(F(cos*cos)+lift)));
    [cos,c28,sin].forEach((v,j)=>putF(row+0x18+j*4,F(v/length)));
    const speed=getF(pair+4);
    for(let j=0;j<3;j++)putF(row+0xc+j*4,F(getF(row+0xc+j*4)+F(getF(row+0x18+j*4)*speed)));
    const dz=F(getF(row+0x14)-base[2]),turn=dz>=0?sqrt(dz):-sqrt(-dz);
    putF(pair,F(getF(pair)+F(turn/180)));
   }
  }else for(const row of [0x8190,0x822c,0x81f8,0x81c4])put(row,0);
  if(counter<800)for(const row of [0x8260,0x8398,0x8364,0x8330,0x82c8,0x8294,0x82fc])put(row,0);
  else{
   const flock=phase=>{const q=prepareNativeIntroductionFlock({phase,hudWords7788:hud,rngState4640:rng,templateWords:[...data.championFlockTemplate80225cc0],actorStartIndex:4,count:7,angleAddress:0x8140});
    q.hudWords7788.forEach((v,j)=>{hud[j]=v;});rng=q.rngState4640;operations.push(...q.operations);};
   if(counter===800)flock('initialize');
   flock('update');
  }
 }
 if(script){
  const q=prepareNativePresentationActorSubmission({...pool,count:word(0x87a8),sourceWords:hud.slice(i(0x8190),i(0x87a8))});
  pool={actorWordsF060:q.actorWordsF060,actorControlWords62c4:q.actorControlWords62c4};operations.push(...q.operations);
 }
 return freeze({hudWords7788:hud,rngState4640:rng,...pool,operations,diagnostic:{script,counter,submitted:script?word(0x87a8):0}});
}
