import * as T from 'three';

const mix=T.MathUtils.lerp;

/** Shared seams for the Carrier's pressed roof and fixed rear portal. The
 * cargo aperture stays rectangular below the existing barn-door header. */
export const VAN_BODYWORK={
  rearSideZ:-2.12,
  rearDoorEdge:.786,
  rearHeaderY:1.807,
  eaveY:1.875,
  halfRoofWidth:.795,
  roofCrownY:1.933,
  roofFrontZ:.665,
  roofRearShoulderX:.70,
} as const;

export function vanBodySideX(y:number){
  const lower=.933-.062*((y-.85)/.58)**2+.050*Math.exp(-(((y-.85)/.13)**2));
  const upperT=T.MathUtils.clamp((y-1.10)/.775,0,1);
  const upper=mix(.886,.795,upperT)+.008*Math.sin(upperT*Math.PI);
  return (y>1.10?upper:mix(Math.min(.939,lower),.886,T.MathUtils.smoothstep(y,1.03,1.10)))
    +.004*Math.exp(-(((y-1.055)/.025)**2));
}

export const vanRearFaceZ=(x:number)=>-2.20-.022*(1-(x/.891)**2);

/** Above the unchanged door opening the portal shoulders turn inward, so the
 * roof has a rounded plan outline as well as a rolled vertical section. */
export function vanRearPortalHalfWidth(y:number){
  const t=T.MathUtils.smoothstep(y,VAN_BODYWORK.rearHeaderY,VAN_BODYWORK.eaveY);
  return mix(VAN_BODYWORK.rearDoorEdge,VAN_BODYWORK.roofRearShoulderX,t);
}

// The upper cargo stamping has square outer-contour samples near its corners.
// Match those actual straight mesh edges, rather than leaving hairline slots
// where an analytically curved quarter meets the coarser pressed side panel.
const stampCornerStep=.065*(1-Math.tan(Math.PI/8));
const cargoRearSeamHeights=[.43,.81,.94,1.04,1.10,1.10+stampCornerStep,1.165,1.81,1.875-stampCornerStep,1.875];
function rearSideX(y:number){
  let i=0;while(i<cargoRearSeamHeights.length-2&&y>cargoRearSeamHeights[i+1])i++;
  const a=cargoRearSeamHeights[i],b=cargoRearSeamHeights[i+1];
  return mix(vanBodySideX(a),vanBodySideX(b),(y-a)/(b-a));
}

export function vanRearCornerPoint(side:number,u:number,y:number){
  const inner=vanRearPortalHalfWidth(y),outer=rearSideX(y),angle=u*Math.PI/2;
  const x=mix(inner,outer,Math.sin(angle));
  const z=mix(vanRearFaceZ(inner),VAN_BODYWORK.rearSideZ,1-Math.cos(angle));
  return new T.Vector3(side*x,y,z);
}

export function vanRoofRearZ(x:number){
  const {roofRearShoulderX:inner,halfRoofWidth:outer,rearSideZ}=VAN_BODYWORK;
  if(Math.abs(x)<=inner)return vanRearFaceZ(x);
  const t=T.MathUtils.clamp((Math.abs(x)-inner)/(outer-inner),0,1);
  return mix(vanRearFaceZ(inner),rearSideZ,1-Math.sqrt(Math.max(0,1-t*t)));
}

/** A broad pressed crown with elliptical rolls over the last 165 mm of each
 * side and 130 mm of each end. All four perimeter seams stay at eave height;
 * the roof keeps the original maximum height instead of gaining a tall cap. */
export function vanRoofPoint(u:number,t:number){
  const {halfRoofWidth,roofFrontZ,eaveY,roofCrownY}=VAN_BODYWORK;
  const x=(u*2-1)*halfRoofWidth,rear=vanRoofRearZ(x),z=mix(rear,roofFrontZ,t);
  const edgeRoll=(distance:number,radius:number)=>{
    const q=T.MathUtils.clamp(1-distance/radius,0,1);
    return Math.sqrt(Math.max(0,1-q*q));
  };
  const across=edgeRoll(halfRoofWidth-Math.abs(x),.165);
  const along=edgeRoll(Math.min(z-rear,roofFrontZ-z),.13);
  // The small longitudinal crown keeps the large centre pressing visibly
  // convex without reintroducing a ridge along the roof perimeter.
  const rise=roofCrownY-eaveY-.009*(1-Math.sin(t*Math.PI));
  return new T.Vector3(x,eaveY+rise*across*along,z);
}

/** Extra samples follow the roll, rather than spending polygons on the flat
 * centre. Symmetry also gives both cargo sides exactly the same seam. */
const roofShoulderSamples=Array.from({length:7},(_,i)=>.70+.095*Math.sin(i*Math.PI/12));
export const vanRoofColumns=[...roofShoulderSamples.map(x=>-x).reverse(),-.63,0,.63,...roofShoulderSamples].map(x=>(x/.795+1)/2);
export const vanRoofRows=[0,.004,.014,.032,.06,.25,.5,.75,.94,.968,.986,.996,1];
export const vanRearCornerRows=[...cargoRearSeamHeights,1.807,1.83,1.854].sort((a,b)=>a-b);
export const vanRearHeaderColumns=[0,.05,.5,.95,1];
export const vanRearHeaderRows=[1.807,1.83,1.854,1.875].map(y=>(y-1.807)/.068);
