import * as T from 'three';

/** A thin living layer on the actual indexed rock surface. The irregular boundary
 * clips triangles instead of leaving a stair-stepped grid or bridging cavities. */
export function coralCrust(rock:T.BufferGeometry,center:T.Vector3,normal:T.Vector3,radius:number,hue:number,seed:number,profile?:{color:T.Color;thickness:number}){
 const p=rock.getAttribute('position'),n=rock.getAttribute('normal'),source=rock.index!;
 const up=Math.abs(normal.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0),u=new T.Vector3().crossVectors(up,normal).normalize(),v=new T.Vector3().crossVectors(normal,u).normalize();
 const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[],cache=new Map<string,number>();
 const base=profile?profile.color.clone().multiplyScalar(.72):new T.Color().setHSL(hue,.43,.37).convertSRGBToLinear(),edge=profile?base.clone().multiplyScalar(1.12):new T.Color().setHSL(hue,.36,.52).convertSRGBToLinear();
 type Point={p:T.Vector3;n:T.Vector3;d:number;key:string};
 const points:Array<Point|undefined>=new Array(p.count);
 function point(i:number):Point{
  if(points[i])return points[i]!;
  const point=new T.Vector3().fromBufferAttribute(p,i),delta=point.clone().sub(center),x=delta.dot(u),y=delta.dot(v),a=Math.atan2(y,x);
  const margin=radius*(.86+.095*Math.sin(a*3+seed)+.055*Math.sin(a*7-seed)+.03*Math.cos(a*13));
  return points[i]={p:point,n:new T.Vector3().fromBufferAttribute(n,i),d:Math.min(margin-delta.length(),delta.dot(normal)+radius*.48),key:String(i)};
 }
 function vertex(point:Point){
  const existing=cache.get(point.key);if(existing!==undefined)return existing;
  const d=point.p.clone().sub(center),x=d.dot(u),y=d.dot(v),fade=T.MathUtils.smoothstep(point.d,0,radius*.14);
  // Low winding skeletal ridges: stationary hard coral, never soft-body waving.
  const wave=.5+.5*Math.sin(x*57+Math.sin(y*21+seed)*1.7+seed),height=.003+fade*(profile?profile.thickness*(.42+.58*wave*wave):.013+.018*wave*wave);
  const out=point.p.clone().addScaledVector(point.n,height),c=base.clone().lerp(edge,(1-fade)*.65).multiplyScalar(.79+.14*wave+.07*Math.sin(x*17+Math.sin(y*23)));
  const index=positions.length/3;positions.push(out.x,out.y,out.z);colors.push(c.r,c.g,c.b);uv.push(x/.16,y/.16);cache.set(point.key,index);return index;
 }
 for(let i=0;i<source.count;i+=3){
  const ia=source.getX(i),ib=source.getX(i+1),ic=source.getX(i+2);
  // The maximum radial margin is 1.04r. Reject only triangles whose complete
  // bounds lie outside that sphere, before allocating clipped vertex records.
  const dx=Math.max(Math.min(p.getX(ia),p.getX(ib),p.getX(ic))-center.x,0,center.x-Math.max(p.getX(ia),p.getX(ib),p.getX(ic)));
  const dy=Math.max(Math.min(p.getY(ia),p.getY(ib),p.getY(ic))-center.y,0,center.y-Math.max(p.getY(ia),p.getY(ib),p.getY(ic)));
  const dz=Math.max(Math.min(p.getZ(ia),p.getZ(ib),p.getZ(ic))-center.z,0,center.z-Math.max(p.getZ(ia),p.getZ(ib),p.getZ(ic)));
  if(dx*dx+dy*dy+dz*dz>(radius*1.041)**2)continue;
  const triangle=[point(ia),point(ib),point(ic)],polygon:Point[]=[];
  for(let j=0;j<3;j++){
   const a=triangle[j],b=triangle[(j+1)%3];if(a.d>=0)polygon.push(a);
   if((a.d>=0)!==(b.d>=0)){const t=a.d/(a.d-b.d);polygon.push({p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize(),d:0,key:[a.key,b.key].sort().join(':')});}
  }
  for(let j=1;j+1<polygon.length;j++)indices.push(vertex(polygon[0]),vertex(polygon[j]),vertex(polygon[j+1]));
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
