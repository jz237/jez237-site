import * as T from 'three';
/** A hollow sintered ring: rounded rims, irregular skin and recessed pores. */
export function porousCeramic(seed=17){
 let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const profile:T.Vector2[]=[],corners=[[.061,-.087],[.063,-.093],[.067,-.095],[.097,-.095],[.103,-.091],[.105,-.087],[.105,.087],[.103,.091],[.097,.095],[.067,.095],[.063,.093],[.061,.087],[.061,-.087]];
 for(let k=0;k<corners.length-1;k++){const a=new T.Vector2(...corners[k] as [number,number]),b=new T.Vector2(...corners[k+1] as [number,number]),steps=Math.ceil(a.distanceTo(b)/.002);for(let j=0;j<steps;j++)profile.push(a.clone().lerp(b,j/steps));}profile.push(profile[0].clone());
 const geometry=new T.LatheGeometry(profile,160),position=geometry.getAttribute('position'),colors:number[]=[],cavities:number[]=[];
 const pores=Array.from({length:260},()=>({a:random()*Math.PI*2,y:(random()-.5)*.20,r:.002+random()*.006}));
 const rimPores=Array.from({length:180},()=>{const a=random()*Math.PI*2,r=.064+random()*.040;return {x:Math.sin(a)*r,z:Math.cos(a)*r,side:random()<.5?-1:1,r:.0025+random()*.006};});
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i),r=Math.hypot(x,z),angle=(Math.atan2(x,z)+Math.PI*2)%(Math.PI*2);let depression=0;
  for(const p of pores){const dy=y-p.y;if(Math.abs(dy)>=p.r)continue;const delta=Math.abs(angle-p.a),da=Math.min(delta,Math.PI*2-delta)*.105;if(da>=p.r)continue;const d=Math.hypot(da,dy)/p.r;if(d<1)depression=Math.max(depression,(1-d*d)**2*p.r*.8);}
  const outer=r>.083,grain=0,radius=r+(outer?-1:1)*depression+grain;
  let rimDepth=0;
  if(Math.abs(y)>.082)for(const p of rimPores){if(Math.sign(y)!==p.side)continue;const d=Math.hypot(x-p.x,z-p.z)/p.r;if(d<1)rimDepth=Math.max(rimDepth,(1-d*d)**2*p.r*.70);}
  const rimBlend=T.MathUtils.smoothstep(Math.abs(y),.082,.094);
  position.setXYZ(i,x/r*radius,y-Math.sign(y)*rimDepth*rimBlend,z/r*radius);
  const depth=Math.max(depression,rimDepth*.65),shade=1-depth*40;
  const bore=1-T.MathUtils.smoothstep(r,.074,.087),opening=T.MathUtils.smoothstep(Math.abs(y),.01,.092);cavities.push((1-bore*.72*(1-opening))*(1-Math.min(.45,depth*65)));colors.push(.91*shade,.85*shade,.72*shade);
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('ceramicCavity',new T.Float32BufferAttribute(cavities,1));geometry.computeVertexNormals();return geometry;
}
/** Connected irregular struts reveal real voids at the exposed sponge surface. */
export function foamCells(radius:number,height:number,spacing:number,material:T.Material){
 let seed=591;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const nodes=new Map<string,T.Vector3>(),edges:[T.Vector3,T.Vector3][]=[];
 const n=Math.ceil(radius/spacing),ny=Math.ceil(height/spacing);
 for(let x=-n;x<=n;x++)for(let y=0;y<=ny;y++)for(let z=-n;z<=n;z++){
  const p=new T.Vector3((x+(random()-.5)*.6)*spacing,(y/ny-.5)*height,(z+(random()-.5)*.6)*spacing);
  if(Math.hypot(p.x,p.z)<radius)nodes.set(`${x},${y},${z}`,p);
 }
 for(const [key,p] of nodes){const [x,y,z]=key.split(',').map(Number);for(const [dx,dy,dz] of [[1,0,0],[0,1,0],[0,0,1],[1,1,0]]){const q=nodes.get(`${x+dx},${y+dy},${z+dz}`);if(q)edges.push([p,q]);}}
 const mesh=new T.InstancedMesh(new T.CylinderGeometry(spacing*.047,spacing*.064,1,5),material,edges.length),dummy=new T.Object3D(),axis=new T.Vector3(0,1,0);
 for(let i=0;i<edges.length;i++){const [p,q]=edges[i],d=q.clone().sub(p);dummy.position.copy(p).lerp(q,.5);dummy.quaternion.setFromUnitVectors(axis,d.clone().normalize());dummy.scale.set(1,d.length(),1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}
 return mesh;
}
