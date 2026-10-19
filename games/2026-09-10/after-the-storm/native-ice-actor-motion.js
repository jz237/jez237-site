import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
import {queryNativeWaterField} from './native-water-field.js';
import {prepareNativeIceActorAudio} from './native-ice-actor-audio.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid ${name}`);return v;}
function wrap(v,lo,hi,inclusive){
 while(inclusive?v>=hi:v>hi){const next=F(v-360);if(next===v)throw new RangeError('Ice actor angle cannot advance');v=next;}
 while(v<lo){const next=F(v+360);if(next===v)throw new RangeError('Ice actor angle cannot advance');v=next;}return v;
}
const circular=v=>wrap(v,0,360,true),difference=v=>wrap(v,-180,180,false);

/** Complete AAAC8. routeWords is the actual selected E6C78 course route, seven
 * words per row. Water is read without advancing it. Caller-local stores in
 * the group takeoff loop intentionally differ from stores on each member. */
export function prepareNativeIceActorMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))
  throw new RangeError(`Supply actorWordsF060[${NATIVE_PRESENTATION_ACTOR_WORDS}]`);
 const actorWordsF060=[...source],operations=[],slot=integer(input.actorIndex,0,29,'ice actor index'),base=slot*0xbc;
 const activity=integer(input.activity624,-32768,32767,'actor activity');
 let rngState4640=integer(input.rngState4640,0,0xffffffff,'shared actor RNG');
 let audioScene7c9c=integer(input.audioScene7c9c,-2147483648,2147483647,'ice audio scene');
 const result=()=>freeze({actorWordsF060,rngState4640,audioScene7c9c,operations});
 const get=o=>{const v=number(actorWordsF060[o/4]);if(!Number.isFinite(v))throw new RangeError('Nonfinite ice actor input');return v;};
 const rg=o=>get(base+o),sg=a=>get(scratch(a)),ri=o=>actorWordsF060[(base+o)/4]|0;
 function put(o,v){actorWordsF060[o/4]=v>>>0;operations.push({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0});}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite ice actor result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rf=(o,v)=>sf(base+o,v),ss=(a,v)=>sf(scratch(a),v),rw=(o,v)=>put(base+o,v);
 const square=(x,z)=>F(F(x*x)+F(z*z)),length=(x,z)=>F(Math.sqrt(square(x,z)));
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original ice actor sine table');const v=number(a[i&4095]);if(!Number.isFinite(v))throw new RangeError('Nonfinite ice actor sine');return v;}
 const phase=v=>Math.trunc(F(F(v*4096)/360));
 function random(){rngState4640=(Math.imul(rngState4640,0x41c64e6d)+12345)>>>0;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;}
 function route(index){
  const a=input.routeWords;if(!Array.isArray(a)||!a.length||a.length%7)throw new RangeError('Supply selected ice actor routeWords');
  integer(index,0,a.length/7-1,'ice actor route index');const row=a.slice(index*7,index*7+7);
  if(row.some(w=>!word(w)))throw new RangeError('Invalid ice actor route word');return row;
 }
 function coordinate(row,i){const v=number(row[i]);if(!Number.isFinite(v))throw new RangeError('Nonfinite ice actor route coordinate');return v;}
 const heading=(x,z)=>nativePresentationVectorHeading(x,z,input.angleTableWords6f08);
 const clearTimers=()=>{rw(0xac,0);rw(0xa8,0);rw(0xa4,0);};
 function audio(entry){const q=prepareNativeIceActorAudio({entry,audioScene7c9c,audioMode:input.audioMode});audioScene7c9c=q.audioScene7c9c;operations.push(...q.operations);}
 if(activity!==-1)return result();
 const mode=ri(8);
 if(mode===2){
  const row=route(ri(0x9c));rf(0xc,F(rg(0x80)+coordinate(row,2)));rf(0x14,F(rg(0x88)+coordinate(row,3)));
  const y=F(queryNativeWaterField(input.waterField,rg(0xc),rg(0x14)).sourcePlaneQueryNative+20);
  rf(0x1c,0);rf(0x10,y);ss(0x754,square(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4))));
  if(sg(0x754)<F(rg(0x70)*rg(0x70))){
   for(let j=0;j<30;j++){
    const p=j*0xbc;if(actorWordsF060[p/4]!==2)continue;
    const next=route(route(actorWordsF060[(p+0x9c)/4]|0)[0]|0);
    sf(p+0x18,difference(heading(F(coordinate(next,2)-get(p+0xc)),F(-F(coordinate(next,3)-get(p+0x14))))));
    rf(0x2c,0);sf(p+0x24,0);const vy=(random()&3)+1;put(p+8,9);sf(p+0x28,vy);
    rw(0x74,0);put(p+0x78,0);put(p,1);rw(0xa8,0);put(p+0xa4,0);put(p+0xac,(random()&15)+3);
   }
   audio('800c1da8');
  }
 }else if(mode===9){
  if(ri(0xac)!==0)rw(0xac,(ri(0xac)-1)|0);
  else{
   const animation=(ri(0x78)+3)|0,tick=(ri(0xa4)+1)|0;
   rw(0x74,1);rw(0xa4,tick);rw(0x78,animation);if(animation>=21)rw(0x78,1);
   if(tick>=3){rw(8,7);clearTimers();}
  }
 }else if(mode===7){
  if(square(rg(0x2c),rg(0x2c))<4900){const a=phase(rg(0x18));rf(0x24,F(sin(a+1024)*4));rf(0x2c,F(sin(a)*4));}
  const x=F(rg(0xc)+F(rg(0x24)+sg(0x6d8))),z=F(rg(0x14)+F(rg(0x2c)+sg(0x6e0))),tick=(ri(0xa4)+1)|0;
  rf(0x20,F(rg(0x20)-1));rf(0xc,x);rw(0xa4,tick);rf(0x14,z);
  if(tick>=10){clearTimers();rw(8,8);rw(0x9c,route(ri(0x9c))[0]);}
 }else if(mode===8){
  rw(0x74,0);const row=route(ri(0x9c));
  ss(0x754,F(rg(0x80)+coordinate(row,2)));ss(0x75c,F(rg(0x88)+coordinate(row,3)));ss(0x758,F(rg(0x28)+rg(0x10)));
  rf(0x20,rg(0x20)*.8);ss(0x760,difference(F(heading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))))-rg(0x18))));
  const error=sg(0x760);
  if(error>0){rf(0x18,F(rg(0x18)+2));if(error>45)rf(0x18,F(rg(0x18)+3));}
  if(error<0){rf(0x18,F(rg(0x18)-2));if(error< -45)rf(0x18,F(rg(0x18)-3));}
  rf(0x18,circular(rg(0x18)));rf(0x10,F(rg(0x10)+rg(0x28)));
  ss(0x764,F(F(F(180-Math.abs(error))/180)*50));
  rf(0x1c,difference(F(difference(F(error-rg(0x1c)))*.2+rg(0x1c))));
  if(rg(0x1c)>60)rf(0x1c,60);if(rg(0x1c)< -60)rf(0x1c,-60);rf(0x1c,circular(rg(0x1c)));
  ss(0x760,length(rg(0x24),rg(0x2c)));ss(0x764,sg(0x760)+F(sg(0x764)-sg(0x760))*.15);
  const a=phase(rg(0x18)),speed=sg(0x764),dx=F(sin(a+1024)*speed),dz=F(sin(a)*speed);
  rf(0x24,dx);rf(0xc,F(rg(0xc)+dx));rf(0x2c,dz);rf(0x14,F(rg(0x14)+dz));
  if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<360000){
   if((ri(0x9c)&3)===0){clearTimers();rw(8,2);audio('800c1dec');rw(0,2);}
   else rw(0x9c,route(ri(0x9c))[0]);
  }
 }
 return result();
}
