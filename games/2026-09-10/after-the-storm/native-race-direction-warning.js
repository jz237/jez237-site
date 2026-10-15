// Reconstructed selected-human direction/wrong-way producer. The actual
// source camera, craft, route and readonly angle-table views are explicit;
// no presentation camera, authored aiming rule or angle approximation is used.
const F=Math.fround,MIN=-2147483648,MAX=2147483647,RACE_WORDS=1693,BASE=(0x2938-0x1f94)/4;
const data=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} must fit finite float32`);return F(v);}
function point(v,n){record(v,n);return {x:scalar(v.x,`${n}.x`),z:scalar(v.z,`${n}.z`)};}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,x=>integer(x,`${n} word`,0,0xffffffff));}
function float(bits){data.setUint32(0,bits,false);return data.getFloat32(0,false);}
const add=(a,b)=>F(a+b),sub=(a,b)=>F(a-b),mul=(a,b)=>F(a*b);
const dot=(a,b)=>add(mul(a.x,b.x),mul(a.z,b.z));
const cross=(a,b)=>sub(mul(a.x,b.z),mul(a.z,b.x));
const relative=(a,b)=>({x:sub(a.x,b.x),z:sub(a.z,b.z)});
function normalized(v){const distance=F(Math.sqrt(dot(v,v)));return {direction:distance>0?{x:F(v.x/distance),z:F(v.z/distance)}:v,distance};}
const normalizedAngle=a=>{const r=a%360;return r<0?r+360:r;};

/** Complete readonlyED388 integer circular-distance helper. Signed32 input
 * angles are reduced with signed remainder before the0..180 distance choice.
 * No conversion of the retained raw angle word to a new persistent owner.
 */
export function nativeRaceCircularDistance(target,current){
 const a=normalizedAngle(integer(target,'target angle')),b=normalizedAngle(integer(current,'current angle')),d=Math.abs(a-b);
 return d<181?d:360-d;
}
/** Complete readonlyED4E0 sign helper; exact180-degree ties choose-1. */
export function nativeRaceCircularSign(target,current){
 const a=normalizedAngle(integer(target,'target angle')),b=normalizedAngle(integer(current,'current angle'));
 if(a===b)return 0;const d=a-b;return (d<0?d+360:d)<180?1:-1;
}
function lookup(cosine,table){
 const value=scalar(cosine,'source angle cosine');
 if(value<-1||value>1)return 0;
 const index=Math.trunc(mul(value>=0?value:F(-value),511));
 const angle=scalar(float(table()[index]),'selected source angle table value');
 return value>=0?angle:sub(180,angle);
}
/** Complete readonlyED090 F32 lookup policy. Supply the actual512-word
 *80226F08..80227708 numeric table. Only a genuine in-domain cosine reads it;
 * out-of-range finite cosines return0, without clamping. The table is external
 * readonly source data. Math.acos/atan2 does not reproduce its stored values.
 */
export function nativeRaceLookupAngle(cosine,angleTableWords6f08){
 let table;return lookup(cosine,()=>table??=words(angleTableWords6f08,'angleTableWords6f08',512));
}

function context(value){record(value,'direction-warning sample');record(value.scene,'source warning scene');
 return {value,scene:{...value.scene},race:null,angleTable:null,operations:[],racers:[]};}
function race(c){return c.race??=words(c.value.raceWords1f94,'raceWords1f94',RACE_WORDS);}
const read=(c,slot,offset)=>race(c)[BASE+slot*222+offset/4]|0;
function write(c,slot,offset,value){const bits=value>>>0;race(c)[BASE+slot*222+offset/4]=bits;
 c.operations.push({kind:'recordWordWrite',racerIndex:slot,wordIndex:offset/4,value:bits});}
const s=(c,key,min=MIN,max=MAX)=>integer(c.scene[key],`scene.${key}`,min,max);
function angle(c,value){return lookup(value,()=>c.angleTable??=words(c.value.angleTableWords6f08,'angleTableWords6f08',512));}
function node(c,index){
 const rows=c.value.primaryNodesBySourceRow;
 if(!Array.isArray(rows)||rows.length>64)throw new RangeError('Supply actual primaryNodesBySourceRow within64 source slots');
 return record(rows[integer(index,'source primary row',0,rows.length-1)],'selected source primary node');
}
const nodePoint=(n,key)=>point(n[key],`node.${key}`);
function inside(c,p){
 const rows=c.value.warningSuppressionRegionsNative;
 if(!Array.isArray(rows))throw new TypeError('Supply actual1f88 warningSuppressionRegionsNative without sentinel');
 // The finite provided rows bound this query; no substitute course bounds.
 for(const row of rows){
  if(!Array.isArray(row)||row.length!==4)throw new RangeError('Expected four actual suppression-region bounds');
  const r=Array.from(row,x=>scalar(x,'suppression-region bound'));
  if(r[0]===r[1])throw new RangeError('Remove source1f88 sentinel');
  if(r[0]<=p.x&&p.x<=r[1]&&r[2]<=p.z&&p.z<=r[3])return true;
 }
 return false;
}
function stuntObjectAhead(c,position,direction){
 const count=integer(c.value.genericObjectCountFa40,'genericObjectCountFa40');if(count<=0)return false;
 const rows=c.value.genericObjects;
 if(!Array.isArray(rows)||count>rows.length)throw new RangeError('Provide the actual consumed generic prefix');
 for(let i=0;i<count;i++){
  const row=record(rows[i],'source generic object');if(integer(row.runtimeType4c,'generic.runtimeType4c')!==8)continue;
  const q=normalized(relative(point(row.centerNativeXZ,'generic.centerNativeXZ'),position));
  if(F(.7)<=dot(direction,q.direction)&&q.distance<4096)return true;
 }
 return false;
}
function selectNode(c,slot,bodyPosition){
 const current=read(c,slot,0xc);
 if(read(c,slot,0x2f0)!==0)return {sourceRow:current,node:node(c,current)};
 const nearest=read(c,slot,0x310),same=current===nearest&&read(c,slot,0)===read(c,slot,0x320);
 let row=same?current:nearest,n=node(c,row);
 const plane=dot(relative(bodyPosition,nodePoint(n,'centerNativeXZ')),nodePoint(n,'forwardXZ'));
 if((same?0:-256)<plane){row=integer(n.nextSourceRowA0,'node.nextSourceRowA0');n=node(c,row);}
 return {sourceRow:row,node:n};
}
function updateWarning(c,slot,condition){
 let count=read(c,slot,0x2d8);
 if(condition){if(count<MAX){count=(count+1)|0;write(c,slot,0x2d8,count);}}
 else{count=0;write(c,slot,0x2d8,0);}
 let hold=read(c,slot,0x2e0);
 if(count>=8||hold>=2){
  if(hold===0){write(c,slot,0x2e0,8);hold=8;}
  const blend=read(c,slot,0x2dc);if(blend<4)write(c,slot,0x2dc,(blend+1)|0);
  if(hold>=2)write(c,slot,0x2e0,(hold-1)|0);
 }else if(hold===0){const blend=read(c,slot,0x2dc);if(blend>0)write(c,slot,0x2dc,(blend-1)|0);}
 else write(c,slot,0x2e0,(hold-1)|0);
}
function one(c,view){
 const slot=s(c,view===0?'primaryHumanIndex':'secondaryHumanIndex',0,3),bodies=c.value.bodiesBySlot;
 if(!Array.isArray(bodies)||bodies.length>4)throw new RangeError('Supply actual bodiesBySlot');
 const body=record(bodies[slot],'selected source body'),bodyPosition=point(body.positionNativeXZ,'body.positionNativeXZ');
 const indices=c.value.cameraIndicesByView,cameras=c.value.camerasByIndex;
 if(!Array.isArray(indices)||indices.length>2||!Array.isArray(cameras)||cameras.length>2)throw new RangeError('Supply actual source camera views');
 const cameraIndex=integer(indices[view],'camera view index',0,1),camera=record(cameras[cameraIndex],'selected source camera');
 const cameraPosition=point(camera.positionNativeXZ,'camera.positionNativeXZ'),cameraDirection=normalized(point(camera.directionXZ,'camera.directionXZ')).direction;
 const selected=selectNode(c,slot,bodyPosition),n=selected.node,center=nodePoint(n,'centerNativeXZ');
 let q=normalized(relative(center,cameraPosition)),distance=q.distance,target=q.direction;
 const checkpoint=integer(n.checkpointFlag9c,'node.checkpointFlag9c');let geometryAllowed=false;
 if(checkpoint===0&&read(c,slot,0x2dc)===0){
  const forward=nodePoint(n,'forwardXZ'),kind=integer(n.classification98,'node.classification98'),side=cross(forward,target);
  geometryAllowed=!(kind===0&&side>0)&&!(kind===1&&side<0)&&dot(forward,cameraDirection)>=0;
 }
 const cosine=dot(cameraDirection,target),lookedUp=angle(c,cosine);
 if(lookedUp<MIN||lookedUp>=2147483648)throw new RangeError('Source angle conversion is outside finite signed32');
 const desired=Math.trunc(lookedUp);write(c,slot,0x2d4,desired);
 if(cross(cameraDirection,target)>0)write(c,slot,0x2d4,(360-desired)|0);
 const desiredWord=read(c,slot,0x2d4),current=read(c,slot,0x2d0),delta=nativeRaceCircularDistance(desiredWord,current),step=Math.max(2,Math.trunc(delta/8));
 if(step>=delta)write(c,slot,0x2d0,desiredWord);
 else write(c,slot,0x2d0,(current+Math.imul(nativeRaceCircularSign(desiredWord,current),step))|0);
 let warningCosine=cosine;
 if(cosine<F(.7)&&checkpoint===1){
  q=normalized(relative(nodePoint(n,'endpointANativeXZ'),cameraPosition));target=q.direction;distance=q.distance;
  const firstSide=cross(cameraDirection,target);warningCosine=dot(cameraDirection,target);
  if(warningCosine<F(.7)){
   q=normalized(relative(nodePoint(n,'endpointBNativeXZ'),cameraPosition));target=q.direction;distance=q.distance;
   warningCosine=firstSide<0&&cross(cameraDirection,target)>0?1:dot(cameraDirection,target);
  }
 }
 let warning=warningCosine<F(.7)&&(distance>2048||!geometryAllowed);
 if(read(c,slot,0x31c)!==0)warning=false;
 if(inside(c,cameraPosition))warning=false;
 const mode=s(c,'mode620');if(mode===11&&stuntObjectAhead(c,cameraPosition,cameraDirection))warning=false;
 const priorWrong=read(c,slot,0x328);
 if(read(c,slot,0x2f0)!==0||read(c,slot,0x2e4)!==0||priorWrong>=40)warning=true;
 let course;const sourceCourse=()=>course??=s(c,'courseIndex');
 if(mode!==11&&sourceCourse()===0)warning=false;
 if(warning&&s(c,'reverseDab68',0,65535)!==0&&sourceCourse()===3&&read(c,slot,0)>=2){
  const p=relative(bodyPosition,{x:-2500,z:2800});if(dot(p,p)<490000)warning=false;
 }
 updateWarning(c,slot,warning);
 const bodyDirection=normalized(point(body.forwardXZ,'body.forwardXZ')).direction,toNode=normalized(relative(center,bodyPosition)).direction;
 const wrongAngle=angle(c,dot(bodyDirection,toNode));let wrong=0,wrongEligible=false;
 if(wrongAngle>=100&&mul(scalar(body.speedB90Native,'body.speedB90Native'),F(1.8))>=10&&!inside(c,bodyPosition)&&sourceCourse()!==0){
  wrongEligible=true;wrong=read(c,slot,0x328);if(wrong<MAX){wrong=(wrong+1)|0;write(c,slot,0x328,wrong);}
 }else write(c,slot,0x328,0);
 if(wrong>=40&&wrong%20===0&&s(c,'phase650')===3)c.operations.push({kind:'audioEntry',consumer:'800c37f4',arguments:[0x35,view]});
 c.racers.push({viewIndex:view,racerIndex:slot,cameraIndex,selectedSourceRow:selected.sourceRow,
  priorWrongDirection2c60:priorWrong,warningApplied:warning,wrongDirectionEligible:wrongEligible});
}

/** Complete originalEF504 direction/warning numeric body. Configured players
 *1/2 select actual human slots and camera indices independently. Nonpositive
 * source player counts take the original early return. Camera views are native
 *+4c/+54 positions and+64/+6c directions, distinct from modern render cameras;
 * craft views use+44/+4c,+6c/+74 and native scalarB90. Nodes use actual moving
 * centers/forward/class98/checkpoint9c/nextA0, with finite endpoints read only
 * by the original branch. Regions are actual1f88 suppression rectangles.
 * Stunt scans only the supplied generic prefix, runtime type8, in source order.
 *
 * All persistent outputs are canonical recordWordWrite operations (relative
 *2938/stride378) for2c08/0c/10/14/18/60, plus ordered800c37f4 audio entries.
 * No body, camera, HUD, RNG or source clock is written. Inputs are copied on
 * first read; aliases of selected human slots observe earlier same-call writes.
 * The finiteF32 API rejects unsupported nonfinite/FCSR conversion cases. It
 * reconstructs only this body and readonly helpers, not the79528 caller gates.
 */
export function prepareNativeRaceDirectionWarning(value){
 const c=context(value),players=s(c,'players');if(players>2)throw new RangeError('Configured source players must be at most2');
 for(let view=0;view<players;view++)one(c,view);
 return freeze({operations:c.operations,diagnostic:{racers:c.racers}});
}
