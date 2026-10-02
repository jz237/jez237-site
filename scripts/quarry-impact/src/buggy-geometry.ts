import * as T from 'three';
import {toCreasedNormals} from 'three/addons/utils/BufferGeometryUtils.js';
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

/** Capped tubular fabrication, with smooth bends and independent flat ends. */
export function buggyTube(points:T.Vector3[],radius:number,segments=16,sides=8,loop=false){
 const curve=new T.CatmullRomCurve3(loop&&points[0].distanceToSquared(points.at(-1)!)<1e-12?points.slice(0,-1):points,loop,'centripetal'),frames=curve.computeFrenetFrames(segments,loop),positions:number[]=[],normals:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let i=0;i<=segments;i++){const p=curve.getPointAt(i/segments);for(let j=0;j<sides;j++){const a=j*Math.PI*2/sides,n=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a));positions.push(...p.clone().addScaledVector(n,radius).toArray());normals.push(...n.toArray());uv.push(j/sides,i/segments);}}
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides;indices.push(a,b,b+sides,a,b+sides,a+sides);}
 for(const end of loop?[]:[0,segments]){const centre=positions.length/3,p=curve.getPointAt(end/segments),n=frames.tangents[end].clone().multiplyScalar(end===0?-1:1);positions.push(...p.toArray());normals.push(...n.toArray());uv.push(.5,.5);for(let j=0;j<sides;j++){positions.push(...positions.slice((end*sides+j)*3,(end*sides+j+1)*3));normals.push(...n.toArray());uv.push(.5+Math.cos(j*Math.PI*2/sides)*.5,.5+Math.sin(j*Math.PI*2/sides)*.5);}for(let j=0;j<sides;j++){const a=centre+1+j,b=centre+1+(j+1)%sides;indices.push(...(end===0?[centre,b,a]:[centre,a,b]));}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);
 // A cross-section advances around normal/binormal; its handedness follows
 // the curve's tangent. Keep faces aligned with the explicit radial normals.
 const a=v(...positions.slice(indices[0]*3,indices[0]*3+3) as [number,number,number]),b=v(...positions.slice(indices[1]*3,indices[1]*3+3) as [number,number,number]),c=v(...positions.slice(indices[2]*3,indices[2]*3+3) as [number,number,number]);if(b.sub(a).cross(c.sub(a)).dot(v(...normals.slice(indices[0]*3,indices[0]*3+3) as [number,number,number]))<0){for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];g.setIndex(indices);}
 const flat=g.toNonIndexed();g.dispose();return flat;
}

/** Rounded rectangular shells keep cushions, covers and running gear from
 * looking like naked boxes. The two cap loops are deliberately separate. */
export function buggyLoft(profiles:{w:number;h:number;r:number;z:number}[],cornerSteps=2){
 const p:number[]=[],uv:number[]=[],ix:number[]=[],count=4*(cornerSteps+1);
 for(const profile of profiles)for(let c=0;c<4;c++)for(let i=0;i<=cornerSteps;i++){const a=(c*90+i*90/cornerSteps)*Math.PI/180,sx=c===0||c===3?1:-1,sy=c<2?1:-1,r=Math.min(profile.r,profile.w*.45,profile.h*.45),x=sx*(profile.w/2-r)+r*Math.cos(a),y=sy*(profile.h/2-r)+r*Math.sin(a);p.push(x,y,profile.z);uv.push(x/profile.w+.5,y/profile.h+.5);}
 for(let row=0;row<profiles.length-1;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count;ix.push(a,b,b+count,a,b+count,a+count);}
 for(const row of [0,profiles.length-1]){const centre=p.length/3;p.push(0,0,profiles[row].z);uv.push(.5,.5);for(let i=0;i<count;i++)ix.push(...(row===0?[centre,row*count+(i+1)%count,row*count+i]:[centre,row*count+i,row*count+(i+1)%count]));}
 if(profiles[0].z>profiles.at(-1)!.z)for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();const flat=toCreasedNormals(g,Math.PI/3);g.dispose();return flat;
}

/** A tread lug follows the tyre's cylindrical crown. Its outer corners are
 * exactly at the physical tyre radius, including the staggered shoulder rows. */
export function buggyTread(x:number,width:number,angle:number,halfAngle:number,radius=.38){
 const p:number[]=[],ix=[0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3];
 for(const a of [angle-halfAngle,angle+halfAngle])for(const r of [radius-.027,radius])for(const X of [x-width/2,x+width/2])p.push(X,Math.cos(a)*r,Math.sin(a)*r);
 for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(Array.from({length:16},(_,i)=>i%2),2));g.setIndex(ix);g.computeVertexNormals();const flat=toCreasedNormals(g,.6);g.dispose();return flat;
}
