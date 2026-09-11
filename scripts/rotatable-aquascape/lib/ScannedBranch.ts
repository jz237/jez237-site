import * as T from 'three';

export const aquascapeBranches=[
 {points:[[-3.1,.72,.45],[-2.6,1.3,.04],[-2.65,2.1,-.2],[-3.05,2.85,-.32],[-3.15,3.45,-.46]],thickness:1.65,roll:.3},
 {points:[[-2.72,1.35,.15],[-1.95,1.17,.38],[-1.1,1.05,.72],[-.1,.65,1.14],[.63,.49,1.4]],thickness:1.0,roll:1.4,reverse:true},
 {points:[[-2.68,1.8,-.22],[-1.86,2.15,-.31],[-1.02,2.72,-.52],[.2,3.3,-.8],[1.4,3.55,-.99]],thickness:.94,roll:.7,reverse:true},
 {points:[[-2.68,1.55,-.12],[-2.28,2.55,-.48],[-1.6,3.65,-.68],[-.8,4.54,-.87]],thickness:.78,roll:.8},
 {points:[[-1.02,2.7,-.51],[-.64,3.19,-.6],[-.12,3.52,-.69]],thickness:.28,roll:.4,reverse:true},
 {points:[[-3.04,.72,.47],[-3.64,.56,.92],[-4.3,.4,1.52]],thickness:.40,roll:1.9},
 // Smaller forks emerge within the main limbs, and buttress roots wrap the
 // shared base into the substrate instead of leaving separate intersecting logs.
 {points:[[-2.74,2.31,-.26],[-3.12,2.66,-.18],[-3.54,3.10,-.07],[-3.66,3.56,-.03]],thickness:.33,roll:2.3,reverse:true},
 {points:[[-2.63,1.52,.17],[-2.63,.99,.55],[-2.29,.76,.84],[-1.75,.43,1.09]],thickness:.44,roll:2.7},
 {points:[[-2.62,1.45,-.05],[-2.39,1.41,-.65],[-2.35,.90,-1.14],[-2.05,.47,-1.5]],thickness:.35,roll:.15,reverse:true},
 {points:[[-1.66,2.33,-.43],[-.75,2.30,-.10],[.25,2.51,-.11],[.79,2.88,-.21]],thickness:.24,roll:2.1},
 {points:[[-1.22,1.09,.69],[-.88,.77,1.05],[-.45,.47,1.64],[-.22,.42,1.94]],thickness:.23,roll:1.1,reverse:true},
 {points:[[-2.65,1.10,.4],[-2.40,1.61,.36],[-2.05,1.90,.25],[-1.44,2.31,-.16]],thickness:.26,roll:2.85}
];

/** Preserve scanned detail while shaping a branch, and derive collision envelopes from it. */
export function bendScannedBranch(sourceGeometry:T.BufferGeometry,branch:typeof aquascapeBranches[number]){
 const source=sourceGeometry.getAttribute('position');sourceGeometry.computeBoundingBox();const bounds=sourceGeometry.boundingBox!;
 const length=bounds.max.x-bounds.min.x,centerY=(bounds.max.y+bounds.min.y)/2,centerZ=(bounds.max.z+bounds.min.z)/2;
 const curve=new T.CatmullRomCurve3(branch.points.map(p=>new T.Vector3(p[0],p[1],p[2]))),frames=curve.computeFrenetFrames(160,false);
 const contactRadii=new Array<number>(25).fill(0),geometry=sourceGeometry.clone(),positions=geometry.getAttribute('position') as T.BufferAttribute,colors:number[]=[];
 for(let i=0;i<source.count;i++){
  const fraction=(source.getX(i)-bounds.min.x)/length,along=branch.reverse?1-fraction:fraction;
  const azimuth=Math.atan2(source.getZ(i)-centerZ,source.getY(i)-centerY);
  // Unequal exposed fibers give a broken end rather than a symmetrical needle.
  const terminal=T.MathUtils.smoothstep(along,.82,1);
  const rake=(.5+.3*Math.sin(azimuth*3+branch.roll)+.2*Math.sin(azimuth*7-branch.roll))*.025;
  const t=along-terminal*rake,step=Math.min(159,Math.floor(t*160)),f=t*160-step;
  const normal=frames.normals[step].clone().lerp(frames.normals[step+1],f).normalize(),binormal=frames.binormals[step].clone().lerp(frames.binormals[step+1],f).normalize();
  // Older limbs retain a blunt remnant; thin twigs still taper more strongly.
  const tipRatio=branch.thickness>.6?.24:.13;
  const taper=(1-(1-tipRatio)*Math.pow(along,3.6))*(1+.18*Math.exp(-along*12)),y=(source.getY(i)-centerY)*branch.thickness*taper,z=(source.getZ(i)-centerZ)*branch.thickness*taper;
  // A swelling collar and restrained crevice darkening connect each limb to its parent.
  const shade=.66+.34*T.MathUtils.smoothstep(t,0,.19);colors.push(shade,shade,shade);
  const radius=Math.hypot(y,z),lower=Math.floor(t*24),upper=Math.min(24,lower+1);
  contactRadii[lower]=Math.max(contactRadii[lower],radius);contactRadii[upper]=Math.max(contactRadii[upper],radius);
  const c=Math.cos(branch.roll+t*.35),s=Math.sin(branch.roll+t*.35),point=curve.getPointAt(t).addScaledVector(normal,y*c-z*s).addScaledVector(binormal,y*s+z*c);
  positions.setXYZ(i,point.x,point.y,point.z);
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
 const overlap=curve.getLength()/48+.025;
 const obstacles=contactRadii.map((radius,i)=>({center:curve.getPointAt(i/24),radius:radius+overlap}));
 return {geometry,obstacles};
}
