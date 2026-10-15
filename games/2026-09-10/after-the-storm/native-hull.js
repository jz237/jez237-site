// Independent point-hull reconstruction from observed numeric mechanics.
// This is a kernel for later force/contact integration, not the complete native
// engine: water pressure, control forces, contact discovery and rider states are
// supplied by the caller. No original executable, mesh or ROM data is included.
//
// Positions are world units (metres with default scale .025), velocities are
// units/second, acceleration is units/second², and dt is seconds. The observed
// five substeps/50ms are represented by fixed 10ms ticks. Arbitrary render dt is
// accumulated, not used to repeat the original per-tick gains at a different
// frequency. Fractional time remains pending, so the fitted pose can trail the
// caller's clock by <10ms. Forces are sampled when a full tick is integrated.
// At each tick, native displacement-style velocities are represented by v*.01;
// reconstruction divides the final displacement by .01. This unit conversion
// uses the recovered source game clock: timer+50 per outer update and five
// hull passes, hence10ms of GAME time per pass. Original dispatch requests
// three VI events and drops excess pending updates under load. Browser render
// accumulation/long-gap handling and the .025 world scale are host choices;
// this does not claim exactly100 hull passes per physical wall second.

export const NATIVE_HULL_STEP = .01;
const INTEGRATION_GAIN = .992;
const CONSTRAINT_GAIN = .1;
const ZERO = Object.freeze({x:0,y:0,z:0});
const LOCAL_POINTS = Object.freeze([
  [-12,-7,-36],[0,14,-36],[12,-7,-36],
  [-12,-7,36],[0,14,36],[12,-7,36],
  [-12,-7,12],[12,-7,12],[0,14,12],
  [-12,-7,-12],[12,-7,-12],[0,14,-12]
].map(p=>Object.freeze(p)));
const PAIRS = Object.freeze(LOCAL_POINTS.flatMap((_,a)=>
  LOCAL_POINTS.slice(a+1).map((__,offset)=>Object.freeze([a,a+1+offset]))));
// Radius-interpolated point displacement damping, in native rider-index order.
// These coefficients are not point masses or inverse constraint weights.
const DAMPING_INNER = [.67,.59,.70,.63];
const DAMPING_OUTER = [.57,.49,.60,.71];
const COMPUTER_DAMPING_INNER = [.67,.59,.70,.58];
const COMPUTER_DAMPING_OUTER = [.57,.49,.60,.61];

const vec = (x=0,y=0,z=0)=>({x,y,z});
const copy = p=>vec(p.x,p.y,p.z);
const dot = (a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const length = p=>Math.hypot(p.x,p.y,p.z);
const difference = (a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const cross = (a,b)=>vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const normalized = p=>{const d=length(p);return d>1e-12?vec(p.x/d,p.y/d,p.z/d):null;};

function finiteVector(p,name){
  if(!p||![p.x,p.y,p.z].every(Number.isFinite))throw new TypeError(`${name} must have finite x, y and z`);
  return p;
}

function mean(points,field){
  const result=vec();
  for(const point of points){const v=point[field];result.x+=v.x;result.y+=v.y;result.z+=v.z;}
  result.x/=points.length;result.y/=points.length;result.z/=points.length;
  return result;
}

function rotatedLocal([x,y,z],heading,pitch,roll){
  // Matches the browser's positive-pitch/roll convention and +Z-forward hull.
  const sr=Math.sin(roll),cr=Math.cos(roll),sp=Math.sin(pitch),cp=Math.cos(pitch);
  const lateral=cr*x-sr*y,up=sr*x+cr*y;
  const vertical=cp*up-sp*z,forward=sp*up+cp*z;
  const sh=Math.sin(heading),ch=Math.cos(heading);
  return vec(ch*lateral+sh*forward,vertical,ch*forward-sh*lateral);
}

function fitFrame(points,previous){
  const p=points.map(point=>point.position);
  const forward=normalized(difference(p[8],p[11]))||copy(previous.forward);
  const upTemporary=vec(p[11].x-(p[9].x+p[10].x)/2,
    p[11].y-(p[9].y+p[10].y)/2,p[11].z-(p[9].z+p[10].z)/2);
  let right=normalized(cross(upTemporary,forward));
  if(!right){
    // A collapsed/deeply deformed cross-section has no unique native frame.
    // Keep a finite perpendicular basis rather than propagating NaN.
    right=normalized(cross(previous.up,forward))||normalized(cross(
      Math.abs(forward.y)<.9?vec(0,1,0):vec(1,0,0),forward));
  }
  return {forward,right,up:cross(forward,right)};
}

/** Create independent mutable points; rider is a numeric index from 0 to 3.
 * computerProfile selects the recovered16ce coefficient branch. It is separate
 * from the input caller: a human-profile craft may later receive AI controls.
 */
export function createNativeHull({position=ZERO,velocity=ZERO,heading=0,pitch=0,roll=0,rider=0,scale=.025,computerProfile=false}={}){
  finiteVector(position,'position');finiteVector(velocity,'velocity');
  if(![heading,pitch,roll,scale].every(Number.isFinite)||scale<=0)throw new RangeError('Pose must be finite and scale positive');
  if(!Number.isInteger(rider)||rider<0||rider>3)throw new RangeError('rider must be an index from 0 to 3');
  if(typeof computerProfile!=='boolean')throw new TypeError('computerProfile must be boolean');
  const inner=(computerProfile?COMPUTER_DAMPING_INNER:DAMPING_INNER)[rider],outer=(computerProfile?COMPUTER_DAMPING_OUTER:DAMPING_OUTER)[rider];
  const maxRadius=Math.max(...LOCAL_POINTS.map(p=>Math.hypot(...p)));
  const points=LOCAL_POINTS.map(local=>{
    const offset=rotatedLocal(local.map(v=>v*scale),heading,pitch,roll);
    const ratio=Math.hypot(...local)/maxRadius;
    return {
      position:vec(position.x+offset.x,position.y+offset.y,position.z+offset.z),
      velocity:copy(velocity),
      damping:inner+(outer-inner)*ratio
    };
  });
  const restLengths=PAIRS.map(([a,b])=>length(difference(points[b].position,points[a].position)));
  const frame={forward:rotatedLocal([0,0,1],heading,pitch,roll),
    up:rotatedLocal([0,1,0],heading,pitch,roll),right:rotatedLocal([1,0,0],heading,pitch,roll)};
  return {
    points,restLengths,frame,scale,rider,computerProfile,
    center:mean(points,'position'),velocity:copy(velocity),
    motionVelocity:copy(velocity),motionDirection:normalized(velocity)||vec(),
    remainder:0,ticks:0,simulationTime:0,stepsLast:0
  };
}

/**
 * Apply an already discovered point/plane contact; return removed normal speed.
 * Caller owns triangle clipping and the bounded penetration/candidate query.
 * Only the contacting point loses inward normal velocity. All point positions
 * receive the common depenetration push, as in the observed response branch.
 * The last fitted center stays latched until the next tick. Its movement field
 * can include this correction, while persistent point velocities exclude it.
 * Separating/zero-speed contacts receive no response in this native-style path.
 */
export function applyNativeHullContact(hull,index,normal,penetration=0){
  if(!Number.isInteger(index)||index<0||index>=hull.points.length)throw new RangeError('Invalid hull point index');
  finiteVector(normal,'normal');
  const n=normalized(normal);
  if(!n)throw new RangeError('Contact normal must be nonzero');
  if(!Number.isFinite(penetration)||penetration<0)throw new RangeError('penetration must be finite and nonnegative');
  const velocity=hull.points[index].velocity;
  const inward=-dot(velocity,n);
  if(inward<=0)return 0;
  velocity.x+=inward*n.x;velocity.y+=inward*n.y;velocity.z+=inward*n.z;
  if(penetration>0){
    for(const point of hull.points){
      point.position.x+=penetration*n.x;
      point.position.y+=penetration*n.y;
      point.position.z+=penetration*n.z;
    }
  }
  hull.velocity=mean(hull.points,'velocity');
  return inward;
}

function integrateTick(hull,acceleration,beforeIntegrate){
  const h=NATIVE_HULL_STEP,points=hull.points;
  for(const point of points){
    point.velocity.x+=acceleration.x*h;
    point.velocity.y+=acceleration.y*h;
    point.velocity.z+=acceleration.z*h;
  }
  hull.velocity=mean(points,'velocity');
  // Future water/control forces and contact discovery run here. Per-point forces
  // can add acceleration*h to point.velocity, before this tick's snapshot.
  if(beforeIntegrate)beforeIntegrate(hull,h);
  const snapshots=points.map(point=>copy(point.position));
  for(const point of points){
    point.position.x+=INTEGRATION_GAIN*point.velocity.x*h;
    point.position.y+=INTEGRATION_GAIN*point.velocity.y*h;
    point.position.z+=INTEGRATION_GAIN*point.velocity.z*h;
  }
  const corrections=points.map(()=>vec());
  // One Jacobi pass: accumulate all 66 pairs before changing any positions.
  for(let pair=PAIRS.length-1;pair>=0;pair--){
    const [a,b]=PAIRS[pair],d=difference(points[b].position,points[a].position),distance=length(d);
    if(distance<1e-12)continue;
    const gain=CONSTRAINT_GAIN*(hull.restLengths[pair]/distance-1);
    const x=d.x*gain,y=d.y*gain,z=d.z*gain;
    corrections[b].x+=x;corrections[b].y+=y;corrections[b].z+=z;
    corrections[a].x-=x;corrections[a].y-=y;corrections[a].z-=z;
  }
  for(let i=0;i<points.length;i++){
    const point=points[i],p=point.position,c=corrections[i];
    p.x+=c.x;p.y+=c.y;p.z+=c.z;
    const displacement=difference(p,snapshots[i]),q=point.damping,axis=hull.motionDirection;
    const along=(1-q)*dot(displacement,axis);
    point.velocity.x=(q*displacement.x+axis.x*along)/h;
    point.velocity.y=(q*displacement.y+axis.y*along)/h;
    point.velocity.z=(q*displacement.z+axis.z*along)/h;
  }
  const center=mean(points,'position'),movement=difference(center,hull.center);
  hull.motionVelocity=vec(movement.x/h,movement.y/h,movement.z/h);
  hull.motionDirection=normalized(movement)||vec();
  hull.center=center;
  hull.velocity=mean(points,'velocity');
  hull.frame=fitFrame(points,hull.frame);
  hull.ticks++;
  hull.simulationTime=hull.ticks*h;
}

/**
 * Advance through fixed 100Hz ticks. Returns hull; stepsLast reports ticks run.
 * beforeIntegrate(hull,.01) may add per-point forces and call contact(). Inputs
 * apply to each full tick executed by this call, including retained fractions.
 * Calls accept 0..1 seconds; larger gaps must be scheduled by the caller. Time
 * is never silently capped/dropped, and dt=0 does not consume pending fractions.
 */
export function stepNativeHull(hull,dt,{acceleration=ZERO,beforeIntegrate}={}){
  if(!Number.isFinite(dt)||dt<0||dt>1)throw new RangeError('dt must be from 0 to 1 seconds');
  finiteVector(acceleration,'acceleration');
  if(beforeIntegrate!==undefined&&typeof beforeIntegrate!=='function')throw new TypeError('beforeIntegrate must be a function');
  hull.stepsLast=0;
  if(dt===0)return hull;
  hull.remainder+=dt;
  const steps=Math.floor((hull.remainder+1e-12)/NATIVE_HULL_STEP);
  for(let i=0;i<steps;i++){
    integrateTick(hull,acceleration,beforeIntegrate);
    hull.remainder=Math.max(0,hull.remainder-NATIVE_HULL_STEP);
    hull.stepsLast++;
  }
  return hull;
}
