import * as T from 'three';

export type MarineShape={h:number;w:number};
// Height and thickness stay full through the cheek, then meet a short snout.
const sections=[[0,.09],[.075,.22],[.24,.70],[.49,1],[.67,.94],[.80,.73],[.9,.49],[.97,.21],[1,.09]];
export function bodyRadius(t:number){
 for(let i=1;i<sections.length;i++)if(t<=sections[i][0]){const [a,ra]=sections[i-1],[b,rb]=sections[i],left=sections[Math.max(0,i-2)],right=sections[Math.min(sections.length-1,i+1)],u=(t-a)/(b-a),m0=(rb-left[1])/(b-left[0]),m1=(right[1]-ra)/(right[0]-a);return (2*u**3-3*u*u+1)*ra+(u**3-2*u*u+u)*m0*(b-a)+(-2*u**3+3*u*u)*rb+(u**3-u*u)*m1*(b-a);}return .075;
}
export function bodySurface(shape:MarineShape,x:number,y:number){const r=bodyRadius(x+.5);return shape.w*r*Math.sqrt(Math.max(0,1-(y/(shape.h*r))**2));}
export function marineBody(shape:MarineShape){
 const p:number[]=[],uv:number[]=[],indices:number[]=[],rings=64,sides=40;
 for(let i=0;i<=rings;i++){const t=i/rings,r=bodyRadius(t);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2;p.push(t-.5,Math.sin(a)*shape.h*r,Math.cos(a)*shape.w*r);uv.push(t,.5+Math.sin(a)*.48);if(i<rings&&j<sides){const k=i*(sides+1)+j;indices.push(k,k+sides+1,k+1,k+1,k+sides+1,k+sides+2);}}}
 for(const end of [0,1]){const center=p.length/3;p.push(end-.5,0,0);uv.push(end,.5);for(let j=0;j<sides;j++){const a=end*rings*(sides+1)+j;indices.push(center,...(end?[a+1,a]:[a,a+1]));}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
 // UV seam vertices coincide but have separate indices; average their normals
 // so the side of the cheek has no hard longitudinal lighting seam.
 const normals=g.getAttribute('normal'),average=new T.Vector3();
 for(let i=0;i<=rings;i++){const a=i*(sides+1),b=a+sides;average.set(normals.getX(a)+normals.getX(b),normals.getY(a)+normals.getY(b),normals.getZ(a)+normals.getZ(b)).normalize();normals.setXYZ(a,average.x,average.y,average.z);normals.setXYZ(b,average.x,average.y,average.z);}
 return g;
}
export function gillCover(shape:MarineShape,side:number){
 const p:number[]=[],uv:number[]=[],ids:number[]=[],rows=18,cols=6;
 for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){
  const t=i/rows,y=(t-.5)*shape.h*1.16-.008,x=.15+.10*j/cols+.025*Math.sin(t*Math.PI),r=bodyRadius(x+.5);
  p.push(x,y,side*(bodySurface(shape,x,y)+.0008));uv.push(x+.5,.5+y/(shape.h*r)*.48);
  if(i<rows&&j<cols){const a=i*(cols+1)+j,tri=[a,a+1,a+cols+1,a+1,a+cols+2,a+cols+1];ids.push(...(side>0?tri:tri.map((v,k)=>k%3===1?tri[k+1]:k%3===2?tri[k-1]:v)));}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ids);g.computeVertexNormals();return g;
}
const membraneTextures=new Map<string,T.CanvasTexture>();
function membraneMap(color:string,edge:string){
 const key=color+edge;if(membraneTextures.has(key))return membraneTextures.get(key)!;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d')!;
 ctx.fillStyle=color;ctx.fillRect(0,0,512,256);
 // UV x follows the outer contour, y runs from the root toward the fringe.
 for(let ray=0;ray<28;ray++){
  const x=ray/27*512;ctx.strokeStyle='rgba(29,34,32,.35)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x,256);ctx.bezierCurveTo(x-2,175,x+2,70,x,0);ctx.stroke();
  ctx.strokeStyle='rgba(247,239,211,.42)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x+1,249);ctx.lineTo(x+1,0);ctx.stroke();
  ctx.strokeStyle='rgba(242,235,212,.21)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x,115);ctx.lineTo(x+4,0);ctx.stroke();
 }
 const fringe=ctx.createLinearGradient(0,0,0,22);fringe.addColorStop(0,edge);fringe.addColorStop(.44,edge);fringe.addColorStop(1,'transparent');ctx.fillStyle=fringe;ctx.fillRect(0,0,512,22);
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;membraneTextures.set(key,tex);return tex;
}
export function marineFin(outline:T.Vector3[],color:string,edge='#847f62'){
 const root=outline[0],contour=new T.CatmullRomCurve3(outline.slice(1),false,'centripetal'),edges=64,rings=10,p:number[]=[],uv:number[]=[],ids:number[]=[];
 for(let j=0;j<=rings;j++)for(let i=0;i<=edges;i++){
  const t=j/rings,u=i/edges,point=root.clone().lerp(contour.getPoint(u),t);
  point.z+=Math.sin(u*6.28)*Math.sin(t*Math.PI)*.008;
  p.push(point.x,point.y,point.z);uv.push(u,t);
  if(j<rings&&i<edges){const a=j*(edges+1)+i;ids.push(a,a+1,a+edges+1,a+1,a+edges+2,a+edges+1);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ids);g.computeVertexNormals();
 const mat=new T.MeshStandardMaterial({map:membraneMap(color,edge),roughness:.47,metalness:.04,side:T.DoubleSide,transparent:true,opacity:.83,depthWrite:false});return new T.Mesh(g,mat);
}
