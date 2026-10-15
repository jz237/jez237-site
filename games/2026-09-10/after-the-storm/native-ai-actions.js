// Independently reconstructed, prepared-state AI action leaves. Coordinates,
// heights and frame displacement are native units; no browser/world conversion
// occurs here. These functions do not produce navigation, camera geometry,
// water scheduling, actor state, difficulty, ranking, random values or timers.
const F=Math.fround;

function record(value,name){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError(`${name} must be an explicit record`);
 return value;
}
function integer(value,name,min=-0x80000000,max=0x7fffffff){
 if(!Number.isInteger(value)||value<min||value>max)throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
 return value||0;
}
function binary32(value,name){
 if(typeof value!=='number'||!Number.isFinite(value)||!Number.isFinite(F(value)))throw new TypeError(`${name} must fit finite binary32`);
 return F(value);
}
function vector(value,name,axes='xyz'){
 record(value,name);
 return Object.fromEntries([...axes].map(axis=>[axis,binary32(value[axis],`${name}.${axis}`)]));
}
function signedByte(value,name){return integer(value,name,-128,127);}
function unsignedShort(value,name){return integer(value,name,0,65535);}
function signedShort(value,name){return integer(value,name,-32768,32767);}
function boolean(value,name){if(typeof value!=='boolean')throw new TypeError(`${name} must be boolean`);return value;}
function freeze(value){return Object.freeze(value);}

/** Exact two XZ sample positions consumed by the water-trim leaf. The source
 * forward vector is used as supplied, without horizontal normalization.
 * Query both with queryNativeWaterField(...).sourcePlaneQueryNative, including
 * the supplied datum. Rendered water height is a different source expression.
 */
export function nativeAIWaterSamplePoints(input){
 record(input,'water sample input');
 const p=vector(input.positionNative,'positionNative','xz'),f=vector(input.forwardNative,'forwardNative','xz');
 const ahead={x:F(p.x+F(f.x*512)),z:F(p.z+F(f.z*512))};
 for(const axis of ['x','z'])binary32(ahead[axis],`ahead.${axis}`);
 return freeze([freeze(p),freeze(ahead)]);
}

/** Prepared80864: two already-queried native water heights are required in
 * center/ahead order. Datum is the source signed32 integer, converted to F32
 * before subtraction. field48/field4c are the resulting relative AI fields.
 * rawYNative is preserved on every branch that does not explicitly assign it.
 * Numeric mode620/state638/flag94/C7c names leave their producers explicit.
 */
export function prepareNativeAIWaterTrim(input){
 record(input,'water trim input');
 const p=vector(input.positionNative,'positionNative'),f=vector(input.forwardNative,'forwardNative');
 const datum=F(integer(input.datumNative,'datumNative'));
 if(!Array.isArray(input.waterHeightsNative)||input.waterHeightsNative.length!==2)throw new TypeError('waterHeightsNative must contain center and ahead heights');
 const [field48,field4c]=[0,1].map(i=>F(binary32(input.waterHeightsNative[i],`waterHeightsNative[${i}]`)-datum));
 const {state638,mode620,difficulty,courseIndex,fieldC7c,flag94,markedBox15de}=input;
 for(const key of ['state638','mode620','difficulty','flag94'])integer(input[key],key);
 integer(courseIndex,'courseIndex',0,9);unsignedShort(fieldC7c,'fieldC7c');signedShort(markedBox15de,'markedBox15de');
 let rawYNative=signedByte(input.rawYNative,'rawYNative');
 if(state638===0||state638===8){
  if(f.y>F(.2)&&fieldC7c===0&&p.y>datum)rawYNative=35;
 }else if(mode620===4||mode620===0){
  if(difficulty===1||difficulty===2){
   if(field48<=20&&field4c<=20||fieldC7c!==1){
    if(f.y>0&&fieldC7c===0&&p.y>datum&&flag94===0)rawYNative=52;
   }else rawYNative=70;
   if(difficulty===2&&courseIndex===6){
    if(markedBox15de!==0&&p.z> -2570&&p.z< -2300)rawYNative=-70;
    if(p.z> -2300&&p.z< -900&&p.x> -350&&p.x<400)rawYNative=70;
   }
  }
 }else if(field48<=20&&field4c<=20||fieldC7c!==1){
  if(f.y>0&&fieldC7c===0&&p.y>datum)rawYNative=52;
 }else rawYNative=70;
 return freeze({rawYNative,field48,field4c});
}

function corners(value){
 if(!Array.isArray(value)||value.length!==4)throw new TypeError('cameraCornersNative must contain four source corners in source order');
 return value.map((p,i)=>{
  record(p,`cameraCornersNative[${i}]`);
  return {x:signedShort(p.x,`cameraCornersNative[${i}].x`),z:signedShort(p.z,`cameraCornersNative[${i}].z`)};
 });
}
function sourceSide(a,b,p){
 const dx=F(b.x-a.x),dz=F(b.z-a.z),px=F(p.x-a.x),pz=F(p.z-a.z);
 // This asymmetric degeneracy test is intentional: the source adds pz twice;
 // it does not square pz. Degenerate and collinear cases return -1.
 if(F(F(dx*dx)+F(dz*dz))===0||F(F(F(px*px)+pz)+pz)===0)return -1;
 return F(dx*pz)<F(px*dz)?1:-1;
}
function contains(c,p){
 return sourceSide(c[1],c[0],p)===-1&&sourceSide(c[3],c[2],p)===1&&
  sourceSide(c[1],c[3],p)===1&&sourceSide(c[0],c[2],p)===-1;
}

/** Prepared87134 camera predicate. Corners are the selected camera's actual
 * signed16 XZ values in source order0..3, not a generic ordered polygon. Two
 * edges admit collinear points and two reject them; the source degeneracy
 * check is retained. The camera-corner producer itself is not implemented.
 */
export function nativeAICameraContains(input){
 record(input,'camera predicate input');
 return contains(corners(input.cameraCornersNative),vector(input.positionNative,'positionNative','xz'));
}

/** Prepared80d20: racer array order IS source slot order. frameSpeedNative is
 * B90, the outer50ms displacement magnitude, before any HUD conversion. The
 * predicate uses the selected camera, not the own racer's guessed frustum.
 * It scans ascending slots, skips itself, and tests strict F32(diff*1.8)>15.
 */
export function nativeAITrafficBlocked(input){
 record(input,'traffic input');
 const racerIndex=integer(input.racerIndex,'racerIndex',0,3),c=corners(input.cameraCornersNative);
 if(!Array.isArray(input.racers)||input.racers.length>4)throw new TypeError('racers must contain at most four source slots');
 const racers=input.racers.map((r,i)=>{
  record(r,`racers[${i}]`);
  return {position:vector(r.positionNative,`racers[${i}].positionNative`,'xz'),speed:binary32(r.frameSpeedNative,`racers[${i}].frameSpeedNative`)};
 });
 if(racers.length===0)return false;
 integer(racerIndex,'racerIndex',0,racers.length-1);
 const own=racers[racerIndex].speed;
 for(let i=0;i<racers.length;i++){
  if(i!==racerIndex&&contains(c,racers[i].position)&&F(F(own-racers[i].speed)*F(1.8))>15)return true;
 }
 return false;
}

/** Prepared80e34, after water trim and before power selection. trafficBlocked
 * is the exact reducer above; trafficTested reports whether this branch calls
 * it in the source. No actor is replaced with an invented ordinary fallback:
 * all supplied actors pass through the source's explicit conditional chain.
 * Button bits are source held bits: R0x10, B0x4000, A|Z0xa000.
 */
export function prepareNativeAIButtons(input){
 record(input,'button input');
 for(const key of ['state638','flag98','actorC54','pendingActorC5c','record2c24','difficulty','toggleD9914','phase8c'])integer(input[key],key);
 const normal=vector(input.impactNormalNative,'impactNormalNative');
 const wet=unsignedShort(input.fieldC7c,'fieldC7c'),trafficBlocked=boolean(input.trafficBlocked,'trafficBlocked');
 let heldButtons=unsignedShort(input.heldButtons,'heldButtons')&0xffef,trafficTested=false;
 if(input.state638!==0&&input.state638!==8&&wet===0&&input.flag98===0)heldButtons^=0x4000;
 if(input.actorC54===23||input.actorC54===7){
  if(input.record2c24===0&&input.difficulty!==0)heldButtons=input.toggleD9914===0?heldButtons|0xa000:heldButtons&0x5fff;
 }else if(input.actorC54===24&&normal.x===0&&normal.y===0&&normal.z===0){
  heldButtons=input.pendingActorC5c!==7&&wet===1?heldButtons&0x5fff:heldButtons|0xa000;
 }else if(input.phase8c===3)heldButtons^=0xa000;
 else{
  trafficTested=true;heldButtons|=0xa000;
  if(trafficBlocked)heldButtons&=0x5fff;
  if(input.flag98!==0)heldButtons|=0xa000;
 }
 return freeze({heldButtons,trafficTested});
}

function actionInput(input){
 record(input,'action input');
 const p=vector(input.positionNative,'positionNative');
 return {positionNative:p,bodyUpY:binary32(input.bodyUpY,'bodyUpY'),
  rawXNative:signedByte(input.rawXNative,'rawXNative'),rawYNative:signedByte(input.rawYNative,'rawYNative'),
  action16f4:unsignedShort(input.action16f4,'action16f4'),actionState16d4:integer(input.actionState16d4,'actionState16d4'),
  fieldE0:integer(input.fieldE0,'fieldE0'),flag9c:integer(input.flag9c,'flag9c'),
  markedBox15de:signedShort(input.markedBox15de,'markedBox15de'),fieldC7c:unsignedShort(input.fieldC7c,'fieldC7c')};
}
function initialAction(q){return {rawXNative:q.rawXNative,rawYNative:q.rawYNative,action16f4:q.action16f4};}
function turnAction(q,out,action){
 const box=q.markedBox15de!==0;
 if(box&&q.positionNative.y<60)out.rawXNative=action===2?70:-70;
 if(box&&q.positionNative.y>60||q.flag9c!==0&&!box&&q.fieldC7c===0)out.rawXNative=action===2?-70:70;
 if(q.actionState16d4===2&&q.bodyUpY>.5)out.rawXNative=0;
}
function inCircle(p,x,z){
 const dx=F(p.x-x),dz=F(p.z-z);
 return F(F(dx*dx)+F(dz*dz))<4000000;
}
function trainingAction(q,firstCircleAction,secondCircleAction){
 const out=initialAction(q);
 if(q.flag9c===0)return out;
 let action;
 if(inCircle(q.positionNative,-1142,4199))action=firstCircleAction;
 else if(inCircle(q.positionNative,1441,3619))action=secondCircleAction;
 else return out;
 if(action===1){
  if(q.fieldE0===1){out.action16f4=5;out.rawXNative=0;out.rawYNative=-70;}
  else if(q.fieldE0===2){
   out.rawXNative=0;out.rawYNative=-70;
   if(q.actionState16d4===2&&q.bodyUpY>.5)out.rawYNative=0;
  }
 }else if(action===2||action===3)turnAction(q,out,action);
 return out;
}

/** Prepared875b8 training helper. Two strict2000-native-unit circles use
 * first-circle priority in their overlap. Actions0..3 are supplied source
 * request selectors, not inferred player gestures. The up-Y test is strict.5;
 * initial E0==1 request5 returns before the later upright neutralization.
 */
export function prepareNativeAITrainingAction(input){
 const q=actionInput(input);
 return freeze(trainingAction(q,integer(input.firstCircleAction,'firstCircleAction',0,3),integer(input.secondCircleAction,'secondCircleAction',0,3)));
}

/** Prepared87ae8, AFTER power selection. E0 updates before training actions.
 * previousNavigationGlobal is the one shared source word: its output must be
 * carried through selected-racer calls in actual order, not kept per racer.
 * navigation2948 is the supplied navigation index, separate from primary
 * adjudication. action16f4 is only a request; actor/stunt execution is outside
 * this leaf. Unknown trainingSelection values skip the training helper.
 */
export function prepareNativeAITail(input){
 const q=actionInput(input);
 for(const key of ['mode620','trainingSelection','navigation2948','previousNavigationGlobal'])integer(input[key],key);
 const navigation=integer(input.navigation2948,'navigation2948');
 integer(input.courseIndex,'courseIndex',0,9);integer(input.racerIndex,'racerIndex',0,3);
 if(q.fieldC7c!==0)q.fieldE0=0;
 if(q.fieldE0===1)q.fieldE0=2;
 if(q.markedBox15de!==0&&q.fieldC7c===0)q.fieldE0=1;
 let out=initialAction(q);
 if(input.courseIndex===0&&input.trainingSelection>=0&&input.trainingSelection<=2){
  const [first,second]=[[3,2],[1,3],[2,1]][input.trainingSelection];
  out=trainingAction(q,input.racerIndex===0?first:0,input.racerIndex===0?0:second);
 }else if(input.courseIndex===1&&input.mode620===11){
  if(input.navigation2948===7&&input.previousNavigationGlobal!==7){out.action16f4=2;out.rawYNative=-70;}
  if(input.navigation2948===13&&input.previousNavigationGlobal!==13){out.action16f4=1;out.rawYNative=70;}
  turnAction(q,out,3);
 }
 return freeze({...out,fieldE0:q.fieldE0,previousNavigationGlobal:navigation});
}
