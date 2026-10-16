// Numeric64100..642D8 stage, after the source checkpoint/power gate and
// before the all-submerged multiplier. Position is the actual body center in
// native units; place293c is the canonical zero-based source placement.
const F=Math.fround;
function integer(v,name,min,max){
 if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;
}
function scalar(v,name){
 if(typeof v!=='number'||!Number.isFinite(v)||!Number.isFinite(F(v)))throw new TypeError(`${name} must fit finite binary32`);return F(v);
}
/** Prepared original assistance, not the modern browser handicap policy.
 * The caller must retain the preceding record2C4 !=0 gate. This function
 * does not award progress, change a rank, or advance any physical point.
 */
export function prepareNativeTwoPlayerCatchup(q){
 if(!q||typeof q!=='object')throw new TypeError('Expected source catch-up fields');
 const players=integer(q.players,'players',1,2),enabled=integer(q.enabled4970,'enabled4970',0,65535);
 const power=scalar(q.powerFactor1578,'powerFactor1578'),steering=scalar(q.steeringDegrees1588,'steeringDegrees1588');
 if(players!==2||enabled===0)return {applied:false,multiplier:1,powerFactor:power,steeringDegrees:steering};
 const place=integer(q.place293c,'place293c',-2147483648,2147483647),rider=integer(q.riderIndex,'riderIndex',0,3);
 let multiplier=F(.9);
 if(place!==0){
  const a=q.primaryPositionNative,b=q.secondaryPositionNative;
  const dx=F(scalar(a?.x,'primary.x')-scalar(b?.x,'secondary.x'));
  const dz=F(scalar(a?.z,'primary.z')-scalar(b?.z,'secondary.z'));
  const square=F(F(dx*dx)+F(dz*dz));
  if(!Number.isFinite(square))throw new RangeError('Catch-up distance must fit binary32');
  const distance=F(Math.sqrt(square)),limit=F(rider===1?1.05:rider===2?1.15:1.1);
  multiplier=Math.min(limit,F(F(F(distance*F(limit-F(.9)))/200)+F(.9)));
 }
 const divisor=rider===0?multiplier:rider===1?F(Math.sqrt(multiplier)):
  rider===2?F(multiplier*multiplier):F(multiplier*F(Math.sqrt(multiplier)));
 const result={applied:true,multiplier,powerFactor:F(power*multiplier),steeringDegrees:F(steering/divisor)};
 if(!Number.isFinite(result.powerFactor)||!Number.isFinite(result.steeringDegrees))throw new RangeError('Catch-up outputs must fit binary32');
 return result;
}
