import {nativePhaseSine} from './native-math-tables.js';
import {stepNativeAIRandom} from './native-ai-initialization.js';
const F=Math.fround,view=new DataView(new ArrayBuffer(4));
const number=w=>{view.setUint32(0,w);return view.getFloat32(0);};
const bits=v=>{view.setFloat32(0,v);return view.getUint32(0);};
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
const phase=v=>{const p=F(F(v*4096)/360);if(!Number.isFinite(p)||p< -2147483648||p>=2147483648)throw new RangeError('Flock angle outside original conversion range');return Math.trunc(p);};
const sin=v=>nativePhaseSine(phase(v)&4095),cos=v=>nativePhaseSine((phase(v)+1024)&4095);
const length=v=>F(Math.sqrt(F(F(v[2]*v[2])+F(F(v[0]*v[0])+F(v[1]*v[1])))));

/** Whole DB284/DB430 numeric flock initialization/update, including AFB8/B024
 * animation and shared47E50 RNG. Original Sunny Expert and Southern introduction
 * callbacks supply their13-word templates, actor slices and retained angles.
 * Does not submit actors, reset the presentation pool or execute graphics.
 */
export function prepareNativeIntroductionFlock({phase:stage,hudWords7788,rngState4640,
 templateWords,actorStartIndex=0,count,angleAddress=0x8120}={}){
 if(!['initialize','update'].includes(stage))throw new RangeError('Invalid flock phase');
 if(!Array.isArray(hudWords7788)||hudWords7788.length!==1442||hudWords7788.some(v=>!word(v)))throw new RangeError('Supply canonical hudWords7788[1442]');
 if(!word(rngState4640))throw new RangeError('Supply shared rngState4640');
 if(!Array.isArray(templateWords)||templateWords.length!==13||templateWords.some(v=>!word(v)||!Number.isFinite(number(v))))throw new RangeError('Supply finite flock templateWords[13]');
 if(!Number.isInteger(actorStartIndex)||actorStartIndex<0||!Number.isInteger(count)||count<0||count>14||actorStartIndex+count>30)throw new RangeError('Invalid flock actor slice');
 if(!Number.isInteger(angleAddress)||angleAddress%4||angleAddress<0x8110||angleAddress+count*8>0x8190)throw new RangeError('Invalid retained flock angle slice');
 const hud=[...hudWords7788],t=templateWords.map(number),operations=[];let rngCalls=0;
 const index=a=>(a-0x7788)/4,get=a=>number(hud[index(a)]),signed=a=>hud[index(a)]|0;
 function put(a,v){hud[index(a)]=v>>>0;operations.push({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});}
 function sf(a,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite flock result');put(a,bits(v));}
 function next(){rngState4640=stepNativeAIRandom(rngState4640).value;rngCalls++;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;}
 function animation(a){
  const value=signed(a+8);
  if(value>=0&&value<16){const n=(value+2)|0;put(a+8,n);if(n>=16)put(a+8,(next()&7)?0:16);}
  else if(value>=25&&value<45){const n=(value+1)|0;put(a+8,n);if(n>=45)put(a+8,(next()&15)?45:25);}
  else{const n=(value+1)|0;put(a+8,n);if(n>=55)put(a+8,0);}
 }
 for(let row=0;row<count;row++){
  const a=0x8190+(actorStartIndex+row)*0x34,p=angleAddress+row*8;
  if(stage==='initialize'){
   put(a,3);put(a+4,0);const ordinary=(next()&7)!==0;put(a+8,ordinary?next()%15:next()%19+25);
   for(let j=0;j<3;j++){
    const random=next()&255,lower=F(F(t[j]+t[3+j])-F(t[6+j]*.5));
    sf(a+12+j*4,F(F(t[6+j]*F(random/256))+lower));
   }
   sf(a+0x30,number(1036831949));sf(p,F(next()%360));sf(p+4,F(next()%360));
   continue;
  }
  animation(a);
  const direction=[cos(get(p)),0,sin(get(p))],random=next()&3;
  direction[1]=F(F(1-F(random/20))*F(sin(get(p+4))*t[12]));
  if(F(F(t[1]-get(a+0x10))*direction[1])>0)direction[1]=F(direction[1]*number(1067030938));
  let magnitude=length(direction);
  for(let j=0;j<3;j++){
   sf(a+0x18+j*4,F(direction[j]/magnitude));
   const speed=F(t[9]+F(next()&1));sf(a+12+j*4,F(get(a+12+j*4)+F(get(a+0x18+j*4)*speed)));
  }
  const dx=F(t[0]-get(a+12)),dz=F(t[2]-get(a+20));
  magnitude=F(Math.sqrt(F(F(dz*dz)+F(dx*dx))));
  const inverse=magnitude>0?F(1/magnitude):magnitude,scale=F(inverse*3);
  const toward=[F(dx*scale),F(t[9]/t[10]),F(dz*scale)];magnitude=length(toward);
  for(let j=0;j<3;j++)sf(a+0x24+j*4,F(toward[j]/magnitude));
  const cross=F(F(get(a+0x18)*toward[2])-F(toward[0]*get(a+0x20)));
  const turn=F((cross>=0?1:-1)*F(t[10]+F(F(next()%31)*.125)));
  sf(p,F(get(p)+turn));const angle=get(p);
  sf(p,F(angle+F((angle>360?-360:0)+(angle<0?360:0))));
  const rate=F(number(1063675494)+F((next()&3)/20));
  sf(p+4,F(get(p+4)+F(t[11]*rate)));const angle2=get(p+4);
  sf(p+4,F(angle2+(angle2>360?-360:0)));
 }
 return freeze({operations,hudWords7788:hud,rngState4640,diagnostic:{phase:stage,actorStartIndex,count,rngCalls,actorsSubmitted:false,graphicsExecuted:false}});
}
