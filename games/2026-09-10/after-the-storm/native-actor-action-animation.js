import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {queryNativeWaterField} from './native-water-field.js';
import {prepareNativeActorSplashAudio} from './native-actor-distance-audio.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid actor animation ${name}`);return v;}
function number(w){bits.setUint32(0,w);const v=bits.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite actor animation input');return v;}
function wrap(v,lo,hi,inclusive){
 while(inclusive?v>=hi:v>hi){const n=F(v-360);if(n===v)throw new RangeError('Actor animation angle cannot advance');v=n;}
 while(v<lo){const n=F(v+360);if(n===v)throw new RangeError('Actor animation angle cannot advance');v=n;}return v;
}
const difference=v=>wrap(v,-180,180,false),circular=v=>wrap(v,0,360,true);
/** Complete A2B24 action dispatcher. The source caller owns activity gating.
 * Water and camera inputs are read only on the branches that consume them;
 * shared action scratch and ordered animation writes remain in the actor pool. */
export function prepareNativeActorActionAnimation(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))throw new RangeError('Supply complete actor animation pool');
 const actorWordsF060=[...source],operations=[],base=integer(input.actorIndex,0,29,'actor index')*0xbc;
 const camera=integer(input.cameraIndex,0,1,'camera selector');
 const get=o=>number(actorWordsF060[(base+o)/4]),ri=o=>actorWordsF060[(base+o)/4]|0;
 function put(o,v){actorWordsF060[o/4]=v>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0}));}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite actor animation result');bits.setFloat32(0,v);put(o,bits.getUint32(0));}
 const rf=(o,v)=>sf(base+o,v),rw=(o,v)=>put(base+o,v),ss=(a,v)=>sf(scratch(a),v);
 const action=ri(0x50),tick=()=>ri(0x54),velocity=()=>get(0x5c);
 const increment=(modulus=65535)=>{const next=((tick()+1)|0)%modulus;rw(0x54,next);return next;};
 const height=()=>rf(0x10,F(get(0x10)+velocity()));
 const damp=factor=>rf(0x5c,velocity()*factor);
 const clampPitch=()=>{if(get(0x20)>90)rf(0x20,90);if(get(0x20)< -90)rf(0x20,-90);};
 const pitchFromVelocity=(factor=-1)=>{rf(0x20,difference(F(velocity()*factor)));};
 const water=()=>queryNativeWaterField(input.waterField,get(0xc),get(0x14)).sourcePlaneQueryNative;
 function sine(index){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[index&4095]))throw new RangeError('Supply original actor animation sine table');return number(a[index&4095]);}
 function spring({fixed,offset=20,farDown=7,farUp=3,nearDown=1,nearUp=1,threshold=40}={}){
  // The source measures distance to the water before applying its target depth.
  const reference=fixed===undefined?water():fixed,y=get(0x10),distance=F(y-(fixed===undefined?water():fixed));
  ss(0x758,reference<=y?distance:F(-distance));
  const far=number(actorWordsF060[scratch(0x758)/4])>threshold;
  const target=fixed===undefined?F(water()-(typeof offset==='function'?offset():offset)):fixed;
  rf(0x5c,F(velocity()+(target<y?-(far?farDown:nearDown):(far?farUp:nearUp))));
 }
 function splash(){
  const hud=input.hudWords7788;if(!Array.isArray(hud)||hud.length!==1442)throw new RangeError('Supply actual actor animation camera words');
  const at=(0x7c80+camera*0x10c-0x7788)/4;
  for(const i of [at+0x4c/4,at+0x54/4])if(!word(hud[i]))throw new RangeError('Invalid actor animation camera word');
  const dx=F(number(hud[at+0x4c/4])-get(0xc)),dz=F(number(hud[at+0x54/4])-get(0x14));
  const distance=F(F(Math.sqrt(F(F(dx*dx)+F(dz*dz))))/100);
  operations.push(...prepareNativeActorSplashAudio({audioMode:input.audioMode,distanceNative:distance,panWord:64}).operations);
 }
 if(action===0){
  spring();rf(0x1c,F(difference(get(0x1c))*.6));damp(.8);
  rf(0x20,F(difference(get(0x20))*.9));if(difference(get(0x20))>90)rf(0x20,90);if(difference(get(0x20))< -90)rf(0x20,-90);
  rf(0x20,circular(get(0x20)));height();
 }else if([1,2,3,4,5,6,8,14,15,16,17].includes(action)){
  if(action===3)spring({farDown:3,farUp:1,nearDown:3});
  else if(action===4)spring({farDown:3,farUp:1});
  else if(action===6)spring({farDown:7.5,farUp:1,nearDown:7.5});
  else if(action===8)spring({farDown:3.5,farUp:1.5,nearDown:.5,nearUp:.5});
  else if(action===15||action===16)spring({farDown:8,nearDown:F(.3),nearUp:F(.1)});
  else if(action===17)spring({offset:40,farDown:3,farUp:1,nearDown:3});
  else spring();
  const t=tick();
  if(action===1||action===8){if(t===1)rf(0x5c,F(velocity()+(action===1?-10:-5)));if(t===7)rf(0x5c,F(velocity()+(action===1?120:50)));}
  else if(action===2){if(t===1)rf(0x5c,F(velocity()+120));}
  else if(action===15||action===16){
   if(t<7)rf(0x5c,F(velocity()-5.5));if(t>=20&&t<24)rf(0x5c,F(velocity()+14));if(t===32)splash();
  }else{
   const kick=action===3||action===6?8:action===17?5:10;
   if(t<3)rf(0x5c,F(velocity()-kick));
   const end=action===3?15:action===5||action===17?16:14;
   const impulse=action===3||action===4?25:action===6?27:action===17?15:30;
   if(t>=10&&t<end){if(action===6){rw(0x74,3);rw(0x78,0);}rf(0x5c,F(velocity()+impulse));}
  }
  damp((action===15||action===16)? .9 : .8);pitchFromVelocity([14,15,16].includes(action)?-1.5:-1);
  if([4,15,16].includes(action))rf(0x1c,0);clampPitch();
  if(action===3&&t>=11&&t<40)rf(0x20,difference(F(F(t-10)*-12)));
  if(action===4&&t>=16&&t<45){const a=F(F(t-15)*-12);rf(0x1c,difference(F(a+a)));}
  if((action===15||action===16)&&t>=21&&t<80){
   if(action===15){rf(0x1c,difference(F(F(t-20)*-6)));rf(0x20,difference(F(Math.abs(velocity())*-1.2)));}
   else rf(0x20,difference(F(velocity()*-1.2)));
  }
  const next=increment(action===8?30:65535);height();
  if((action===2&&next===1)||(action===4&&next===15)){rw(0x74,3);rw(0x78,0);}
  if(action===16&&next===20){rw(0x74,1);rw(0x78,0);}
 }else if(action===7){
  spring();damp(.8);height();const bank=circular(F(difference(get(0x1c))*.9)),old=tick();
  rf(0x1c,bank);rw(0x74,5);increment(80);rw(0x78,old);
 }else if(action===9||action===10){
  spring({fixed:action===9?1000:600,farDown:5,farUp:5,threshold:30});damp(.8);height();
 }else if(action===12){
  rw(0x74,0);rf(0x20,0);rf(0x1c,0);rf(0x5c,0);rf(0x10,75);
 }else if(action===13){
  spring({fixed:-200,farDown:3,farUp:1.5,nearDown:.5,nearUp:.5});
  if(tick()===1){rw(0x74,1);rw(0x78,0);rf(0x5c,5);}
  if(get(0x20)<90)rf(0x20,F(90-get(0x20))*.1+get(0x20));
  increment();damp(.8);height();
 }else if(action===18||action===19){
  const offset=()=>{const control=input.actorControlWords62c4;if(!Array.isArray(control)||control.length!==3||!word(control[0]))throw new RangeError('Supply actual actor control words');return F(F(sine(Math.imul(control[0],200))*20)+(action===18?70:200));};
  spring({offset,farDown:3,farUp:1.5,nearDown:.5,nearUp:.5});
  pitchFromVelocity(-1.2);rf(0x1c,F(difference(get(0x1c))*.6));damp(.8);height();
 }
 return Object.freeze({actorWordsF060:Object.freeze(actorWordsF060),operations:Object.freeze(operations)});
}
