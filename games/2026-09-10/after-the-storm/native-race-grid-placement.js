// Independent numeric reconstruction of source grid-transform arguments.
// Geometry, source order and selected slots are explicit read views; no rider,
// animation, physical-point, matrix-buffer or camera state is initialized here.
const F=Math.fround;
function integer(v,n,min=-2147483648,max=2147483647){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;
}
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} must fit finite float32`);return F(v);}
function point(v,n){record(v,n);return {x:scalar(v.x,n+'.x'),z:scalar(v.z,n+'.z')};}
function frozen(v){if(v&&typeof v==='object'){Object.values(v).forEach(frozen);Object.freeze(v);}return v;}
const add=(a,b)=>F(F(a)+F(b)),sub=(a,b)=>F(F(a)-F(b)),mul=(a,b)=>F(F(a)*F(b));
function nodeAt(nodes,index,name){
 if(!Array.isArray(nodes)||nodes.length<1||nodes.length>64)throw new RangeError(`Expected1..64 ${name} stored nodes`);
 integer(index,'source row',0,nodes.length-1);const n=record(nodes[index],`${name}[${index}]`);
 if(integer(n.sourceRow,'sourceRow',0,63)!==index)throw new RangeError('Use actual source array order');return n;
}
function recipe(positionNative,forwardNative,diagnostic){
 const upNative={x:0,y:1,z:0};
 return frozen({positionNative,forwardNative,upNative,matrixRecipe:{consumer:'80048854',positionNative,forwardNative,upNative},
  diagnostic:{...diagnostic,scope:'bounded6ac84-arguments',matrixEvaluated:false,physicalInitialization:false}});
}
function fromRow(nodes,index,family,lateral,fore,branch,offsets=true){
 const row=nodeAt(nodes,index,family),c=point(row.centerNativeXZ,'centerNativeXZ'),f=point(row.forwardXZ,'forwardXZ');
 let x=c.x,z=c.z;
 if(offsets){
  const r=point(row.rightXZ,'rightXZ');
  // Preserve the source's single-precision grouping, including signed zero.
  x=add(mul(f.x,fore),add(c.x,mul(lateral,r.x)));
  z=add(mul(f.z,fore),add(c.z,mul(lateral,r.z)));
 }
 return recipe({x,y:0,z},{x:f.x,y:0,z:f.z},{branch,family,sourceRow:index,
  ...(offsets?{lateralNative:lateral,foreNative:fore}:{})});
}

/** Complete bounded6AC84 argument selection, including demo main8 and training
 * main21. Other branches use actual finish row/basis, not heading inferred from
 * browser start poses. primaryNodes/secondaryNodes are stored source-order rows
 * with sourceRow,centerNativeXZ,forwardXZ,rightXZ; only demo scan reads their
 * classification98. The primaryCount active prefix may be shorter than stored
 * rows: a failed demo scan falls back to its actual masked row0..3.
 *
 * trainingAnchorsNative are explicit caller-supplied source XYZ rows; main21
 * selects row0 or3 from the actual record2c70 threshold. Forward(1,0,-1) is
 * deliberately not normalized. The return is the numeric48854 call recipe,
 * not a claim to reproduce that matrix helper or initialize actor15/physics.
 */
export function prepareNativeRaceGridPlacement(input){
 record(input,'grid placement input');
 const main=integer(input.main638,'main638'),slot=integer(input.racerIndex,'racerIndex',0,3);
 if(main===21){
  const index=integer(input.training2c70,'training2c70')<3?0:3,anchors=input.trainingAnchorsNative;
  if(!Array.isArray(anchors)||anchors.length<index+1||anchors.length>4)throw new RangeError('Supply actual training anchor row');
  const a=record(anchors[index],'training anchor');
  return recipe({x:sub(scalar(a.x,'anchor.x'),8),y:scalar(a.y,'anchor.y'),z:scalar(a.z,'anchor.z')},
   {x:1,y:0,z:index===0?0:-1},{branch:'main21',trainingAnchorRow:index});
 }
 const course=integer(input.courseIndex,'courseIndex',0,11);
 if(main===8&&course!==1){
  const offset=integer(input.demoOffset5438,'demoOffset5438'),fallback=(slot+offset)&3,wanted=11+fallback;
  const count=integer(input.primaryCount,'primaryCount',-2147483648,64);let index=-1;
  for(let i=0;i<count;i++){
   const row=nodeAt(input.primaryNodes,i,'primary');
   if(integer(row.classification98,'classification98')===wanted){index=i;break;}
  }
  return fromRow(input.primaryNodes,index<0?fallback:index,'primary',0,0,index<0?'main8-fallback':'main8-classification',false);
 }
 const count=integer(input.racerCount,'racerCount',1,4);integer(slot,'active racerIndex',0,count-1);
 let lateral,fore;
 if(main===8){
  const order=((count-slot)-1)|0;
  lateral=add(sub(64,mul(order&1,128)),52);if(order>1)lateral=sub(lateral,32);
  fore=add(mul(((count-order)-1)|0,80),-512);
  return fromRow(input.primaryNodes,integer(input.finishSourceRow,'finishSourceRow',0,63),'primary',lateral,fore,'main8-course1');
 }
 if(count===1){
  lateral=0;fore=integer(input.mode620,'mode620')!==11&&course===0?-1024:-512;
 }else if(count===2){
  lateral=add(slot===integer(input.primaryHumanIndex,'primaryHumanIndex',0,3)?48:-48,52);
  fore=course===0?sub(-512,add(512,mul(slot,96))):-512;
 }else if(main===0){
  lateral=add(sub(64,mul(slot&1,128)),52);fore=add(mul((count-slot)|0,80),-512);
 }else if(integer(input.mode620,'mode620')===4){
  const orders=input.order26c0;
  if(!Array.isArray(orders)||orders.length<count||orders.length>4)throw new RangeError('Supply retained order26c0 words');
  const order=Array.from(orders,(v,i)=>integer(v,`order26c0[${i}]`))[slot];
  if(integer(input.directionFlag1f90,'directionFlag1f90')===0){
   lateral=add(sub(64,mul(order&1,128)),52);if(order>1)lateral=sub(lateral,32);
  }else{
   lateral=sub(add(mul(order&1,128),-64),52);if(order>1)lateral=add(lateral,32);
  }
  fore=add(mul(((count-order)-1)|0,80),-512);
 }else{
  lateral=add(sub(64,mul(slot&1,128)),52);fore=add(mul(slot,80),-512);
 }
 const secondary=course===9&&slot===integer(input.secondaryHumanIndex,'secondaryHumanIndex',0,3),family=secondary?'secondary':'primary';
 return fromRow(secondary?input.secondaryNodes:input.primaryNodes,integer(input.finishSourceRow,'finishSourceRow',0,63),family,
  lateral,fore,'ordinary');
}

/** Only67E40's independent body16ce profile selector. This is not current input
 * origin or a human/AI identity assertion. field4964 is an explicit unsigned
 * halfword; primary selection has priority if the two selected slots alias.
 * No other67E40 numeric stores, camera copy or physical initialization is done.
 */
export function selectNativeRaceComputerProfile(input){
 record(input,'computer profile selection');
 const main=integer(input.main638,'main638'),slot=integer(input.racerIndex,'racerIndex',0,3);
 if(main===0||main===8)return true;
 if(slot===integer(input.primaryHumanIndex,'primaryHumanIndex',0,3)){
  if(integer(input.field4964,'field4964',0,65535)===0&&integer(input.simulation648,'simulation648')!==2)return false;
  return main!==4;
 }
 if(slot!==integer(input.secondaryHumanIndex,'secondaryHumanIndex',0,3))return true;
 return integer(input.simulation648,'simulation648')===2||integer(input.players,'players')===1;
}
