import {riderPose} from './rider-pose.js';

// Display-only inverse of the authored anatomy bridge. These are ACTUAL solved
// nineteen-point world positions, not animation goals, synthetic endpoint
// extensions, a visual-bone read, or a neutral pose inferred from the craft.
// World units remain world units: hull.scale is never applied to the points.
// No physical point, constraint history, joint2, anchor, force or clock changes.

const axes=['x','y','z'];
const subtract=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const midpoint=(a,b)=>({x:(a.x+b.x)*.5,y:(a.y+b.y)*.5,z:(a.z+b.z)*.5});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const length=p=>Math.hypot(p.x,p.y,p.z);
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
function finiteVector(p,name){if(!p||!axes.every(k=>Number.isFinite(p[k])))throw new TypeError(name+' requires finite world XYZ');return p;}
function positive(n,name){if(!Number.isFinite(n)||n<=0)throw new RangeError(name+' must be positive and finite');return n;}
function unit(p,name){finiteVector(p,name);if(Math.abs(length(p)-1)>1e-6)throw new RangeError(name+' must be unit length');return p;}
function basis(hull){
 const center=finiteVector(hull?.center,'hull center');positive(hull?.scale,'hull scale');
 const right=unit(hull.frame?.right,'hull right'),up=unit(hull.frame?.up,'hull up'),forward=unit(hull.frame?.forward,'hull forward');
 if(Math.abs(dot(right,up))+Math.abs(dot(up,forward))+Math.abs(dot(forward,right))>1e-6||dot(cross(forward,right),up)<.999999)
  throw new RangeError('Hull frame must be orthonormal and right handed');
 return {center,right,up,forward};
}

// Only the pelvis needs a mesh endpoint absent from the physical role list.
// Preserve the independently authored high-resolution rig's length; its axis
// below comes from solved rider geometry. This is an explicit display policy,
// not an assertion about original mesh dimensions or skeletal orientation.
const modernPelvis=riderPose().targets.pelvis;
export const NATIVE_RIDER_PRESENTATION_PELVIS_LENGTH=Math.hypot(...modernPelvis[1].map((n,i)=>n-modernPelvis[0][i]));

/**
 * Convert articulatedRider.points[i].position and the matching hull into a
 * detached rider-pose-compatible DTO: {targets,yaw:0,headYaw:0,diagnostics}.
 * Target endpoints are [x,y,z] in CRAFT-LOCAL WORLD units. The inverse uses the
 * complete actual right/up/forward basis, including pitch and roll.
 *
 * Head1->0, shoulders3/11, elbows4/12, wrists5/13, grips6/14, hips7/15,
 * knees8/16, ankles9/17 and toes10/18 retain their solved endpoints. Torso ends
 * at the solved shoulder midpoint. Pelvis starts at torsoRoot2, with its axis
 * from the hip midpoint toward that root. A collapsed pelvis axis falls back
 * to the root-to-shoulder direction, explicitly reported. No hull-up or neutral
 * body fallback is invented. Independent axial bone twist is not observable
 * from these segment endpoints; the existing mesh roll convention is retained.
 *
 * The detailed and built-in renderers apply these targets directly,
 * bypassing riderPose/riderMotion geometry. Parent boat/body must apply exactly
 * the ACTUAL hull transform once; omit modern extra bank, stunt rotations and
 * wipeout root offsets for this path. Rider root is at local0 with yaw0 and no
 * additional head yaw. The DTO itself never updates renderer or simulation.
 */
export function nativeRiderPresentation(articulatedRider,hull,{pelvisLengthWorld=NATIVE_RIDER_PRESENTATION_PELVIS_LENGTH}={}){
 const frame=basis(hull);positive(pelvisLengthWorld,'pelvisLengthWorld');
 if(!articulatedRider||!Array.isArray(articulatedRider.points)||articulatedRider.points.length!==19)
  throw new TypeError('Expected nineteen solved rider world points');
 if(positive(articulatedRider.scale,'rider scale')!==hull.scale)throw new RangeError('Rider and hull scales must match');
 const logicalFrame=articulatedRider.logicalFrames??null;
 if(logicalFrame!==null&&(!Number.isSafeInteger(logicalFrame)||logicalFrame<0))throw new RangeError('Invalid rider logical frame');
 const points=articulatedRider.points.map((q,i)=>{
  const p=finiteVector(q?.position,'rider point '+i),d=subtract(p,frame.center);
  return finiteVector({x:dot(d,frame.right),y:dot(d,frame.up),z:dot(d,frame.forward)},'local rider point '+i);
 });
 const root=points[2],shoulder=midpoint(points[3],points[11]),hips=midpoint(points[7],points[15]);
 let pelvisDirection=subtract(root,hips),pelvisAxis='hip-midpoint-to-root';
 if(length(pelvisDirection)<1e-9){pelvisDirection=subtract(shoulder,root);pelvisAxis='root-to-shoulder-fallback';}
 const pelvisDistance=length(pelvisDirection);
 if(pelvisDistance<1e-9)throw new RangeError('Solved rider has no usable pelvis or torso axis');
 const pelvisEnd=finiteVector(Object.fromEntries(axes.map(k=>[k,root[k]+pelvisDirection[k]*pelvisLengthWorld/pelvisDistance])),'pelvis display endpoint');
 const array=p=>[p.x,p.y,p.z],segment=(a,b)=>[array(a),array(b)];
 const targets={torso:segment(root,shoulder),head:segment(points[1],points[0]),pelvis:segment(root,pelvisEnd)};
 for(const [side,shoulderIndex,elbow,wrist,grip,hip,knee,ankle,toe]of [
  ['L',3,4,5,6,7,8,9,10],['R',11,12,13,14,15,16,17,18]
 ]){
  targets['upperArm'+side]=segment(points[shoulderIndex],points[elbow]);
  targets['forearm'+side]=segment(points[elbow],points[wrist]);
  targets['hand'+side]=segment(points[wrist],points[grip]);
  targets['thigh'+side]=segment(points[hip],points[knee]);
  targets['shin'+side]=segment(points[knee],points[ankle]);
  targets['foot'+side]=segment(points[ankle],points[toe]);
 }
 const collapsedSegments=Object.entries(targets).filter(([,pair])=>Math.hypot(...pair[1].map((n,i)=>n-pair[0][i]))<1e-12).map(([name])=>name);
 return {targets,yaw:0,headYaw:0,diagnostics:{presentationOnly:true,source:'solved-19-world-points',sourceLogicalFrame:logicalFrame,
  coordinateSpace:'craft-local-world-units',pelvisLengthWorld,pelvisAxis,collapsedSegments,
  torsoEndpoint:'solved-shoulder-midpoint',axialTwist:'existing-mesh-convention; no extra root/head rotation'}};
}
