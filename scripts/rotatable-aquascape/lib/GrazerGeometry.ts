import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const TAU=Math.PI*2;
function mesh(p:number[],uv:number[],indices:number[]){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;}
function grid(indices:number[],i:number,j:number,columns:number){const n=i*(columns+1)+j;indices.push(n,n+columns+1,n+1,n+1,n+columns+1,n+columns+2);}
/** Cross-sections sculpt the silhouette; UVs retain physical scale across body parts. */
function body(profile:number[][],rings=48,sides=32,foot=false){
 const p:number[]=[],uv:number[]=[],idx:number[]=[],first=profile[0][0],last=profile.at(-1)![0];
 for(let i=0;i<=rings;i++){const x=T.MathUtils.lerp(first,last,i/rings);let k=0;while(k<profile.length-2&&profile[k+1][0]<x)k++;const a=profile[k],b=profile[k+1],s=T.MathUtils.smoothstep(x,a[0],b[0]),y=T.MathUtils.lerp(a[1],b[1],s),h=T.MathUtils.lerp(a[2],b[2],s),w=T.MathUtils.lerp(a[3],b[3],s);
  for(let j=0;j<=sides;j++){const t=j/sides*TAU,sy=Math.sin(t);p.push(x,foot?.002+(sy>0?Math.pow(sy,.7)*h:sy*.002):y+sy*h,Math.cos(t)*w);uv.push((x+.32)/.6,j/sides);if(i<rings&&j<sides)grid(idx,i,j,sides);}
 }
 for(const [i,flip] of [[0,true],[rings,false]] as const){const start=i*(sides+1),center=p.length/3;let y=0;for(let j=0;j<sides;j++)y+=p[(start+j)*3+1]/sides;p.push(p[start*3],y,0);uv.push(i/rings,.5);for(let j=0;j<sides;j++)flip?idx.push(center,start+j,start+j+1):idx.push(center,start+j+1,start+j);}
 return mesh(p,uv,idx);
}
export function shrimpCarapace(){return body([[-.09,.115,.044,.037],[-.065,.116,.050,.041],[0,.118,.058,.047],[.075,.123,.048,.042],[.125,.128,.032,.030],[.17,.132,.014,.014],[.192,.131,.002,.002]]);}
export function shrimpPlate(){
 const g=body([[-.60,0,.84,.87],[-.48,0,.91,.94],[.2,0,1,1],[.56,0,.94,.96]],20,32);
 const uv=g.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setX(i,(g.getAttribute('position').getX(i)+.6)/1.16);return g;
}
export function snailBody(){return body([[-.26,0,.0002,.0002],[-.21,0,.014,.03],[-.13,0,.027,.068],[-.045,0,.11,.083],[.045,0,.125,.081],[.105,0,.075,.072],[.17,0,.058,.076],[.215,0,.032,.059],[.24,0,.008,.025],[.245,0,.0002,.0002]],64,40,true);}

/** Membranes taper into a real 3D fan, with a gently cupped surface and fine edge. */
export function shrimpFan(){
 const p:number[]=[],uv:number[]=[],idx:number[]=[];
 for(let i=0;i<=20;i++){const u=i/20,x=-.095*u,width=.006+.023*Math.sin(Math.PI*u*.88)**.7;
  for(let j=0;j<=12;j++){const v=j/12*2-1,edge=1+.018*Math.sin(j*3.1);p.push(x,.004*Math.sin(u*Math.PI)+.003*v*v*u,width*v*edge);uv.push(u,j/12);if(i<20&&j<12)grid(idx,i,j,12);}
 }return mesh(p,uv,idx);
}
function tube(points:T.Vector3[],radius:number,sides=5){return new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(2,points.length*2),radius,sides,false);}
export function fanRays(){
 const parts:T.BufferGeometry[]=[];
 for(let j=0;j<9;j++){const v=j/8*2-1,points:T.Vector3[]=[];for(let i=0;i<=6;i++){const u=i/6;points.push(new T.Vector3(-.094*u,.004*Math.sin(u*Math.PI)+.003*v*v*u+.0004,(.006+.023*Math.sin(Math.PI*u*.88)**.7)*v));}parts.push(tube(points,.00020,4));
  if(j>0&&j<8){const end=points.at(-1)!;parts.push(tube([end,end.clone().add(new T.Vector3(-.006,.0004,v*.003))],.00018,3));}
 }
 const result=mergeGeometries(parts);parts.forEach(g=>g.dispose());return result;
}
export function shrimpRostrum(){
 const p:number[]=[],uv:number[]=[],idx:number[]=[];
 // A compressed blade with a fine saw-toothed upper edge, not a thick cylinder.
 for(let i=0;i<=32;i++){const u=i/32,x=.136+u*.105,top=.153+u*.009+(i%4===1?.0035:0)*(1-u),bottom=.137+u*.024,z=.005*(1-u)+.00015;p.push(x,top,z,x,bottom,z,x,top,-z,x,bottom,-z);uv.push(u,0,u,1,u,0,u,1);
  if(i<32){const n=i*4;idx.push(n,n+4,n+1,n+1,n+4,n+5,n+2,n+3,n+6,n+3,n+7,n+6,n,n+2,n+4,n+2,n+6,n+4,n+1,n+5,n+3,n+3,n+5,n+7);}}
 return mesh(p,uv,idx);
}

/** Interpenetrating whorl envelopes close the gaps of a free spiral. The last
 * whorl has a thick lip and recessed inner aperture, with a broad mantle opening. */
export function ramshornShell(){
 const p:number[]=[],uv:number[]=[],idx:number[]=[],total=Math.PI*5.7,rings=320,sides=40;
 const emit=(t:number,v:number,inner=false)=>{const r=.127*Math.exp(.145*(t-total)),w=r*.67*(inner?.93:1),striae=1+.003*Math.sin(t*73)+.0015*Math.sin(t*151),radial=r+Math.cos(v)*w*striae;
  p.push(radial*Math.cos(t)-.045,radial*Math.sin(t)+.208,Math.sin(v)*w*.80);uv.push(t/total,v/TAU);};
 for(let i=0;i<=rings;i++)for(let j=0;j<=sides;j++){emit(i/rings*total,j/sides*TAU);if(i<rings&&j<sides)grid(idx,i,j,sides);}
 // Surface winding follows the swept whorl rather than a sphere parameterization.
 const offset=p.length/3,innerRings=12;
 for(let i=0;i<=innerRings;i++)for(let j=0;j<=sides;j++){emit(total-i/innerRings*.45,j/sides*TAU,true);if(i<innerRings&&j<sides){const n=offset+i*(sides+1)+j;idx.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2);}}
 const outer=rings*(sides+1);for(let j=0;j<sides;j++){idx.push(outer+j,outer+j+1,offset+j,offset+j,outer+j+1,offset+j+1);}
 const g=mesh(p,uv,idx);return g;
}
