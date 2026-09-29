import * as T from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
// Fine implicit pores can leave detached chips. Keep one connected stone per teaching section.
function connectedStone(source:T.BufferGeometry){
 const positions=source.attributes.position,index=source.index!,parent=Int32Array.from({length:positions.count},(_,i)=>i);
 const find=(i:number):number=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 for(let i=0;i<index.count;i+=3){const root=find(index.getX(i));parent[find(index.getX(i+1))]=root;parent[find(index.getX(i+2))]=root;}
 const sizes=new Map<number,number>();for(let i=0;i<index.count;i+=3){const root=find(index.getX(i));sizes.set(root,(sizes.get(root)||0)+1);}
 const largest=[...sizes].sort((a,b)=>b[1]-a[1])[0][0],remap=new Map<number,number>(),vertices:number[]=[],indices:number[]=[];
 for(let i=0;i<index.count;i+=3)if(find(index.getX(i))===largest)for(let j=0;j<3;j++){const old=index.getX(i+j);let next=remap.get(old);if(next===undefined){next=remap.size;remap.set(old,next);vertices.push(positions.getX(old),positions.getY(old),positions.getZ(old));}indices.push(next);}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);source.dispose();return geometry;
}
// An implicit solid cut into three inspectable sections: through-cavities, no bead-covered slabs.
export function rockLayer(layer:number){
 const lo=-1+layer*2/3,hi=lo+2/3,center=(layer-1)*.64;
 const noise=(x:number,y:number,z:number)=>Math.sin(x*3.7+Math.sin(z*2.3))*Math.cos(y*4.5+z*1.8)+.38*Math.sin(x*10.2+y*8.3)*Math.cos(z*11.4-x*2.3);
 function field(x:number,y:number,z:number){let f=Math.sqrt((x/1.62)**2+(y/1.21)**2+(z/.98)**2)-1+.17*noise(x,y,z)+.029*noise(x*4.2+9,y*4.2,z*4.2);for(const [cx,cy,r] of [[-.73,.29,.29],[.49,.22,.3],[-.12,-.56,.23],[.78,-.52,.18],[-.43,.85,.16]]){const dx=x-cx+.09*Math.sin(z*5+cy),dy=y-cy+.07*Math.cos(z*6+cx);f=Math.max(f,r-Math.sqrt(dx*dx+dy*dy));}const pore=Math.sin(x*17+Math.sin(z*9)+.6*Math.sin(y*11))*Math.sin(y*18+Math.cos(x*7)+.4*Math.cos(z*13))*Math.cos(z*19+y*5+.45*Math.sin(x*15));f=Math.max(f,(pore-.38)*.32);return Math.max(f,lo-z,z-hi);}
 const nx=86,ny=66,nz=24,bounds=[-1.85,1.85,-1.45,1.45,lo-.06,hi+.06],vertices:number[]=[];
 const corner=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tet=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]],points:T.Vector3[]=[],values:number[]=[];
 for(let x=0;x<=nx;x++)for(let y=0;y<=ny;y++)for(let z=0;z<=nz;z++){const p=new T.Vector3(bounds[0]+x/nx*(bounds[1]-bounds[0]),bounds[2]+y/ny*(bounds[3]-bounds[2]),bounds[4]+z/nz*(bounds[5]-bounds[4]));points.push(p);values.push(field(p.x,p.y,p.z));}
 const index=(x:number,y:number,z:number)=>(x*(ny+1)+y)*(nz+1)+z;
 function triangle(a:T.Vector3,b:T.Vector3,c:T.Vector3){const n=new T.Vector3().subVectors(b,a).cross(new T.Vector3().subVectors(c,a)),mid=a.clone().add(b).add(c).multiplyScalar(1/3),e=.008,grad=new T.Vector3(field(mid.x+e,mid.y,mid.z)-field(mid.x-e,mid.y,mid.z),field(mid.x,mid.y+e,mid.z)-field(mid.x,mid.y-e,mid.z),field(mid.x,mid.y,mid.z+e)-field(mid.x,mid.y,mid.z-e));if(n.dot(grad)<0)[b,c]=[c,b];for(const p of [a,b,c])vertices.push(p.x,p.y,p.z-center);}
 for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++){const ids=corner.map(c=>index(x+c[0],y+c[1],z+c[2]));for(const t of tet){const inside=t.filter(i=>values[ids[i]]<0),outside=t.filter(i=>values[ids[i]]>=0);if(!inside.length||!outside.length)continue;const cross=(a:number,b:number)=>points[ids[a]].clone().lerp(points[ids[b]],values[ids[a]]/(values[ids[a]]-values[ids[b]]));if(inside.length===1)triangle(...outside.map(b=>cross(inside[0],b)) as [T.Vector3,T.Vector3,T.Vector3]);else if(inside.length===3)triangle(...inside.map(a=>cross(a,outside[0])) as [T.Vector3,T.Vector3,T.Vector3]);else{const a=cross(inside[0],outside[0]),b=cross(inside[0],outside[1]),c=cross(inside[1],outside[0]),d=cross(inside[1],outside[1]);triangle(a,b,c);triangle(b,d,c);}}}
 const raw=new T.BufferGeometry();raw.setAttribute('position',new T.Float32BufferAttribute(vertices,3));const geo=connectedStone(mergeVertices(raw,.002));raw.dispose();geo.computeVertexNormals();const pos=geo.attributes.position,col=new Float32Array(pos.count*3),uv=new Float32Array(pos.count*2),base=new T.Color(0xb7a58a),purple=new T.Color(0x984d70),ochre=new T.Color(0xa17a47),green=new T.Color(0x647247),temp=new T.Color();for(let i=0;i<pos.count;i++){
 const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i)+center,n=noise(x*1.45+4,y*1.45,z*1.45)+.14*noise(x*6,y*6,z*6),fine=.85+.10*Math.sin(x*53+y*39)*Math.cos(z*61)+.045*Math.sin(x*97-z*77);
 temp.copy(base);if(n>.04)temp.lerp(purple,T.MathUtils.smoothstep(n,.04,.52)*.94);else if(n<-.57)temp.lerp(ochre,.68);else if(n<-.25)temp.lerp(green,.30);
 const e=.026,curvature=field(x+e,y,z)+field(x-e,y,z)+field(x,y+e,z)+field(x,y-e,z)+field(x,y,z+e)+field(x,y,z-e)-6*field(x,y,z);
 temp.multiplyScalar(fine*T.MathUtils.clamp(1+curvature*2.4,.56,1));col.set([temp.r,temp.g,temp.b],i*3);uv.set([(x+z*.38)*1.7,y*1.7],i*2);
 }geo.setAttribute('color',new T.BufferAttribute(col,3));geo.setAttribute('uv',new T.BufferAttribute(uv,2));return geo;
}
