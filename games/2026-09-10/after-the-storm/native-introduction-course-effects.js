import {nativePhaseSine} from './native-math-tables.js';
import {stepNativeAIRandom} from './native-ai-initialization.js';
import {prepareNativeIntroductionFlock} from './native-introduction-flock.js';
import {NATIVE_INTRODUCTION_COURSE_EFFECTS as DATA} from './native-introduction-course-effects-data.js';
import {NATIVE_INTRODUCTION_CAMERA_SCRIPTS as SCRIPTS} from './native-introduction-camera-data.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
const length=v=>F(Math.sqrt(F(F(v[2]*v[2])+F(F(v[0]*v[0])+F(v[1]*v[1])))));
const phase=v=>{const p=F(F(v*4096)/360);if(!Number.isFinite(p)||p< -2147483648||p>=2147483648)throw new RangeError('Introduction actor angle outside source range');return Math.trunc(p);};
const sin=v=>nativePhaseSine(phase(v)&4095),cos=v=>nativePhaseSine((phase(v)+1024)&4095);

/** DD6B4's main8 branch and all six original introduction actor callbacks.
 * Runs after the camera script and before auxiliary motion. Pool reset,
 * scene-actor production and submission remain ordered externalCall requests;
 * the host must consume these, not treat this as a fully rendered frame.
 */
export function prepareNativeIntroductionCourseEffects({hudWords7788,rngState4640,
 courseIndex,difficulty,cameraIndex=0,resources=DATA,scripts=SCRIPTS}={}){
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!word(v)))throw new RangeError('Supply canonical hudWords7788[1442]');
 if(!word(rngState4640)||![0,1].includes(cameraIndex)||!Number.isInteger(courseIndex)||courseIndex<0||courseIndex>8||![0,1,2].includes(difficulty))throw new RangeError('Invalid introduction actor selection');
 let hud=[...hudWords7788];const operations=[],index=a=>(a-0x7788)/4,get=a=>number(hud[index(a)]),signed=a=>hud[index(a)]|0;
 function put(a,v){if(!Number.isInteger(a)||a%4||a<0x7788||a>=0x8e10)throw new RangeError('Invalid actor HUD address');hud[index(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});}
 function sf(a,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite introduction actor result');put(a,bits(v));}
 function c(a){const w=resources.constants?.[0x80220000+a];if(!word(w)||!Number.isFinite(number(w)))throw new RangeError('Missing numeric actor constant');return number(w);}
 function rows(name,n){const v=resources[name];if(!Array.isArray(v)||v.length!==n||v.some(w=>!word(w)))throw new RangeError('Missing actor template '+name);return [...v];}
 function next(){rngState4640=stepNativeAIRandom(rngState4640).value;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;}
 const call=(consumer,args=[])=>operations.push({kind:'externalCall',consumer,arguments:args});
 const reset=()=>call('800ab92c');
 const s=0x8058+cameraIndex*0x38,cursor=hud[index(s+4)],counter=signed(s+8);
 const starts=[0x80223a30,0x80224b14,0x80223f7c,0,0x802241e0,0x802242c0,0,0x802245b4,0];
 const active=starts[courseIndex]!==0&&(courseIndex!==1||difficulty===2);
 const matched=active&&Math.trunc(((cursor-starts[courseIndex])|0)/12)===2;
 const duration=()=>{const d=scripts.commands?.[cursor]?.duration;if(!Number.isInteger(d)||!d)throw new RangeError('Missing active introduction duration');return d;};
 const quotient=()=>{const d=duration();if(counter===-2147483648&&d===-1)throw new RangeError('Original signed division overflow');return F(Math.trunc(counter/d));};
 function flock(stage,start,count,template){
  const q=prepareNativeIntroductionFlock({phase:stage,hudWords7788:hud,rngState4640,actorStartIndex:start,count,templateWords:template});
  hud=[...q.hudWords7788];rngState4640=q.rngState4640;operations.push(...q.operations);
 }
 function normWrite(a,v){const size=length(v);for(let j=0;j<3;j++)sf(a+j*4,F(v[j]/size));}
 put(0x87a8,0);
 if(matched&&courseIndex===0){
  put(0x87a8,1);
  if(counter===1){reset();put(0x8190,6);put(0x8194,2);put(0x8198,0);sf(0x81c0,c(0x5f2c));sf(0x819c,-300);sf(0x81a0,0);sf(0x81a4,-540);sf(0x81b4,0);sf(0x81bc,0);sf(0x81b8,1);}
  put(0x8198,(signed(0x8198)+1)|0);const v=[-3,0,-5],size=length(v);
  for(let j=0;j<3;j++){sf(0x81a8+j*4,F(v[j]/size));sf(0x819c+j*4,F(get(0x819c+j*4)+F(get(0x81a8+j*4)*8)));}
 }
 if(matched&&courseIndex===1){
  const template=rows('sunnyTemplate',13);put(0x87a8,8);
  if(counter===1){reset();flock('initialize',0,8,template);}
  const q=quotient();for(let j=0;j<3;j++)template[j]=bits(F(number(template[j])+F([300,-200,-200][j]*q)));
  flock('update',0,8,template);
 }
 if(matched&&courseIndex===2&&counter===1){reset();call('800ab95c',[1,0]);}
 if(matched&&courseIndex===4){
  put(0x87a8,24);const aux=hud[index(s)]-0x80220000;
  if(!Number.isInteger(aux)||aux%4||aux<0x7e98||aux+0x64>=0x8058)throw new RangeError('Invalid introduction auxiliary owner');
  const target=[get(aux+0x5c),get(aux+0x60),get(aux+0x64)];
  if(counter===1){
   reset();
   for(let row=0;row<24;row++){
    const a=0x8190+row*0x34;put(a,1);put(a+4,0);put(a+8,next()%10);
    sf(a+12,F(F(F(target[0]-F(F(row)*30))-F(next()%7))-300));
    const r1=next(),r2=next(),ratio=F(F(row)/24),sine=sin(F(ratio*180));
    sf(a+16,F(F(sine*F(F(r2&63)*c(0x5f34)))+F(target[1]-F(row*(r1&31)))));
    const z=F(target[2]-F(sine*F(next()&127)));
    sf(a+0x18,0);sf(a+0x1c,0);sf(a+0x20,1);sf(a+0x24,0);sf(a+0x28,1);sf(a+0x2c,0);sf(a+0x30,c(0x5f30));sf(a+20,z);
    if(row===0)sf(0x8120,17);
    else{const first=next(),second=next();sf(0x8120+row*4,F(F(F(Math.sqrt(ratio))*F((second&3)+1))+F(15+F(first&3))));}
   }
  }else if(((counter-30)|0)>=0){
   const elapsed=F((counter-30)|0),heading=[F(4-F(elapsed*c(0x5f38))),sin(F(F(elapsed/F((duration()-30)|0))*180)),1];normWrite(0x81a8,heading);
   for(let row=0;row<24;row++){
    const a=0x8190+row*0x34,p=0x8120+row*4,speed=get(p);
    put(a+8,((signed(a+8)+(speed>18?1:0)+(speed>16?1:0)+(speed>17?1:0)+1)|0)%10);
    if(row>0){
     let v=[0,1,2].map(j=>F(get(0x819c+j*4)-get(a+12+j*4))),size=length(v);
     if(size<c(0x5f3c)){v=[get(0x81a8),get(0x81ac),get(0x81b0)];size=1;}
     const blend=[F(F(F(v[0]/size)+F(get(0x81a8)*7))*.125),F(F(F(v[1]/size)+F(get(0x81ac)*5))/6),F(F(F(v[2]/size)+F(get(0x81b0)*7))*.125)];normWrite(a+0x18,blend);
    }
    for(let j=0;j<3;j++)sf(a+12+j*4,F(get(a+12+j*4)+F(get(a+0x18+j*4)*speed)));
    normWrite(a+0x24,[F(target[0]-get(a+12)),1200,0]);sf(p,F(speed-c(0x5f40)));
   }
  }
 }
 if(matched&&courseIndex===5){
  put(0x87a8,1);sf(0x87c0,c(0x5f44));
  const lift=counter<150?F(F(Math.sqrt(F((150-counter)|0)))*12):0;
  sf(0x87c4,F(lift+c(0x5f48)));sf(0x87c8,c(0x5f4c));
  if(counter===1){reset();put(0x8190,12);put(0x8194,0);put(0x8198,0);sf(0x87b0,F(get(0x87c0)-c(0x5f50)));sf(0x87b4,F(get(0x87c4)+450));sf(0x87b8,F(get(0x87c8)-c(0x5f54)));sf(0x8120,70);sf(0x81c0,.25);}
  for(let j=0;j<3;j++){
   const delta=F(get(0x87c0+j*4)-get(0x87b0+j*4));sf(0x87dc,delta);
   const root=delta>=0?F(Math.sqrt(delta)):F(-F(Math.sqrt(F(-delta))));sf(0x87b0+j*4,F(get(0x87b0+j*4)+F(root*c(0x5f58))));
  }
  const elapsed=F((counter-150)|0);
  for(let j=0;j<3;j++)sf(0x819c+j*4,F(get(0x87b0+j*4)-F(sin(F(elapsed*[8,4.5,7.5][j]))*[20,12,25][j])));
  sf(0x87d0,cos(get(0x8120)));const q=quotient();sf(0x87d8,sin(get(0x8120)));sf(0x87d4,F(F(q*c(0x5f5c))+c(0x5f60)));
  let v=[get(0x87d0),get(0x87d4),get(0x87d8)],size=length(v);sf(0x87dc,size);
  for(let j=0;j<3;j++)sf(0x81a8+j*4,F(v[j]/size));
  sf(0x8120,F(get(0x8120)+F(160/F(duration()))));sf(0x87d0,F(get(0x87b0)-get(0x819c)));sf(0x87d4,F(F(next()&31)+600));sf(0x87d8,F(get(0x87b8)-get(0x81a4)));
  v=[get(0x87d0),get(0x87d4),get(0x87d8)];size=length(v);sf(0x87dc,size);
  for(let j=0;j<3;j++)sf(0x81b4+j*4,F(v[j]/size));put(0x8198,((signed(0x8198)+1)|0)%2);
 }
 if(matched&&courseIndex===7){
  const leaders=rows('southernLeaders',12).map(number),groups=rows('southernFlocks',30);put(0x87a8,16);
  if(counter===1){
   reset();
   for(let row=0;row<2;row++){
    const a=0x8190+row*0x34;put(a,3);put(a+4,0);put(a+8,0);for(let j=0;j<3;j++)sf(a+12+j*4,leaders[row*6+j]);
    sf(a+0x24,0);sf(a+0x28,1);sf(a+0x2c,0);sf(a+0x30,c(0x5f64));put(0x8110+row*4,row===0?6:65535);
   }
   for(let row=0;row<2;row++)flock('initialize',groups[row*15],(groups[row*15+1]-groups[row*15])|0,groups.slice(row*15+2,row*15+15));
  }
  for(let row=0;row<2;row++){
   const a=0x8190+row*0x34,p=0x8110+row*4,value=signed(a+8),n=(value+(value<16?2:1))|0;put(a+8,n);
   if(signed(p)>0){if(n>=16){put(a+8,0);put(p,(signed(p)-1)|0);}}else if(signed(a+8)>=45)put(a+8,25);
   const v=[0,1,2].map(j=>F(F(next()&3)+leaders[row*6+3+j])),size=length(v);
   for(let j=0;j<3;j++){sf(a+0x18+j*4,F(v[j]/size));sf(a+12+j*4,F(get(a+12+j*4)+F(get(a+0x18+j*4)*12)));}
  }
  for(let row=0;row<2;row++)flock('update',groups[row*15],(groups[row*15+1]-groups[row*15])|0,groups.slice(row*15+2,row*15+15));
 }
 if(active)call('800ac098',[0x80228190,hud[index(0x87a8)]]);
 return freeze({operations,hudWords7788:hud,rngState4640,diagnostic:{courseIndex,difficulty,cameraIndex,callbackSelected:active,activeShot:matched,actorsSubmitted:false,graphicsExecuted:false}});
}
