import * as T from 'three';

// Smooth, position-based pigment fields baked once into the existing vertices.
// Their own hash leaves colony placement and animal random streams untouched.
function filmNoise(x:number,y:number,seed:number){
 const ix=Math.floor(x),iy=Math.floor(y),smooth=(v:number)=>v*v*(3-2*v),a=smooth(x-ix),b=smooth(y-iy);
 const hash=(x:number,y:number)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(seed|0,1442695041);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
 return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix,iy),hash(ix+1,iy),a),T.MathUtils.lerp(hash(ix,iy+1),hash(ix+1,iy+1),a),b);
}

/** A thin living layer on the actual indexed rock surface. The irregular boundary
 * clips triangles instead of leaving a stair-stepped grid or bridging cavities. */
export function coralCrust(rock:T.BufferGeometry,center:T.Vector3,normal:T.Vector3,radius:number,hue:number,seed:number,profile?:{color:T.Color;thickness:number;lobed?:boolean;film?:boolean;grounded?:boolean}){
 const p=rock.getAttribute('position'),n=rock.getAttribute('normal'),source=rock.index!;
 const grounded=profile?.film&&profile.grounded,groundColors=grounded?rock.getAttribute('color'):undefined;
 const up=Math.abs(normal.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0),u=new T.Vector3().crossVectors(up,normal).normalize(),v=new T.Vector3().crossVectors(normal,u).normalize();
 const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[],normals:number[]=[],cache=new Map<string,number>();
 const base=profile?profile.color.clone().multiplyScalar(.72):new T.Color().setHSL(hue,.43,.37).convertSRGBToLinear(),edge=profile?base.clone().multiplyScalar(1.12):new T.Color().setHSL(hue,.36,.52).convertSRGBToLinear();
 type Point={p:T.Vector3;n:T.Vector3;d:number;key:string;ground?:T.Color};
 const points:Array<Point|undefined>=new Array(p.count);
 // Broad colonies advance along several connected growth fronts instead of
 // painting a nearly circular disc on the rock. Every lobe overlaps the core;
 // the field is clipped against the real stone, so it cannot bridge a cave.
 const lobed=!profile||profile.lobed;
 const growth=Array.from({length:lobed?6:0},(_,i)=>{
  const angle=i*Math.PI/3+seed*.43+.24*Math.sin(i*2.7+seed),reach=radius*(.37+.14*(.5+.5*Math.sin(seed+i*4.1)));
  return {x:Math.cos(angle)*reach,y:Math.sin(angle)*reach,angle:angle+.55*Math.sin(seed+i),a:radius*(.30+.085*(.5+.5*Math.cos(seed*2+i*1.9))),b:radius*(.20+.10*(.5+.5*Math.sin(seed*1.3+i*2.3)))};
 });
 function growthDistance(x:number,y:number){
  let distance=(1-Math.hypot(x/(radius*.57),y/(radius*.48)))*radius*.48;
  for(const lobe of growth){const dx=x-lobe.x,dy=y-lobe.y,c=Math.cos(lobe.angle),s=Math.sin(lobe.angle),d=(1-Math.hypot((dx*c+dy*s)/lobe.a,(-dx*s+dy*c)/lobe.b))*lobe.b;
   // Smooth the joins without erasing the bays between neighboring lobes.
   const h=Math.max(.045*radius-Math.abs(distance-d),0)/(.045*radius);distance=Math.max(distance,d)+h*h*.01125*radius;
  }
  return distance;
 }
 function point(i:number):Point{
  if(points[i])return points[i]!;
  const point=new T.Vector3().fromBufferAttribute(p,i),delta=point.clone().sub(center),x=delta.dot(u),y=delta.dot(v),a=Math.atan2(y,x);
  const margin=radius*(.86+.095*Math.sin(a*3+seed)+.055*Math.sin(a*7-seed)+.03*Math.cos(a*13));
  return points[i]={p:point,n:new T.Vector3().fromBufferAttribute(n,i),d:Math.min(lobed?Math.min(growthDistance(x,y),radius*1.04-delta.length()):margin-delta.length(),delta.dot(normal)+radius*.48),key:String(i),ground:groundColors?new T.Color().fromBufferAttribute(groundColors,i):undefined};
 }
 function vertex(point:Point){
  const existing=cache.get(point.key);if(existing!==undefined)return existing;
  const d=point.p.clone().sub(center),x=d.dot(u),y=d.dot(v),fade=T.MathUtils.smoothstep(point.d,0,radius*.14);
  // Low winding skeletal ridges: stationary hard coral, never soft-body waving.
  const wave=.5+.5*Math.sin(profile?x*57+Math.sin(y*21+seed)*1.7+seed:x*39+Math.sin(y*15+seed)*2.2+seed),height=profile?.film?.0014:.003+fade*(profile?profile.lobed?.002+profile.thickness*wave**4:profile.thickness*(.42+.58*wave*wave):.013+.012*wave*wave);
  const out=point.p.clone().addScaledVector(point.n,height),c=base.clone().lerp(edge,(1-fade)*.65).multiplyScalar(.79+.14*wave+.07*Math.sin(x*17+Math.sin(y*23)));
  if(profile?.lobed)c.multiplyScalar(.65+.22*wave+.10*Math.sin(x*31+Math.sin(y*29+seed)));
  if(point.ground){
   // Thin growth grades into the local coralline color beneath it. Nested
   // pigment fields create connected dense tissue and paler, younger bays;
   // this is opaque attached tissue, not transparent overlapping scenery.
   const broad=filmNoise(x*17,y*17,seed*131),fine=filmNoise(x*43,y*43,seed*157+31),fleck=filmNoise(x*107,y*107,seed*193+71);
   const pigment=.55*broad+.30*fine+.15*fleck;
   const margin=T.MathUtils.smoothstep(point.d,0,radius*(.10+.18*fine));
   const cover=margin*(.18+.82*T.MathUtils.smoothstep(pigment,.31,.63));
   c.multiplyScalar(.85+.27*fine).lerp(point.ground,1-cover);
  }
  const index=positions.length/3;positions.push(out.x,out.y,out.z);if(grounded)normals.push(point.n.x,point.n.y,point.n.z);colors.push(c.r,c.g,c.b);const repeat=profile?profile.lobed?.28:.16:.42;uv.push(x/repeat,y/repeat);cache.set(point.key,index);return index;
 }
 // Resolve skeletal folds on broad colonies independently of the coarser rock.
 // Shared midpoint keys keep adjacent displaced triangles joined. Thin basal
 // films retain their original mesh and sampling cost.
 function midpoint(a:Point,b:Point):Point{return {p:a.p.clone().lerp(b.p,.5),n:a.n.clone().lerp(b.n,.5).normalize(),d:(a.d+b.d)*.5,key:'m('+[a.key,b.key].sort().join('|')+')',ground:a.ground?.clone().lerp(b.ground!,.5)};}
 function triangle(a:Point,b:Point,c:Point){
  if(profile&&(!profile.lobed||profile.film)){indices.push(vertex(a),vertex(b),vertex(c));return;}
  const ab=midpoint(a,b),bc=midpoint(b,c),ca=midpoint(c,a);
  for(const t of [[a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]])indices.push(...t.map(vertex));
 }
 for(let i=0;i<source.count;i+=3){
  const ia=source.getX(i),ib=source.getX(i+1),ic=source.getX(i+2);
  // The maximum radial margin is 1.04r. Reject only triangles whose complete
  // bounds lie outside that sphere, before allocating clipped vertex records.
  const dx=Math.max(Math.min(p.getX(ia),p.getX(ib),p.getX(ic))-center.x,0,center.x-Math.max(p.getX(ia),p.getX(ib),p.getX(ic)));
  const dy=Math.max(Math.min(p.getY(ia),p.getY(ib),p.getY(ic))-center.y,0,center.y-Math.max(p.getY(ia),p.getY(ib),p.getY(ic)));
  const dz=Math.max(Math.min(p.getZ(ia),p.getZ(ib),p.getZ(ic))-center.z,0,center.z-Math.max(p.getZ(ia),p.getZ(ib),p.getZ(ic)));
  if(dx*dx+dy*dy+dz*dz>(radius*1.041)**2)continue;
  const sourceTriangle=[point(ia),point(ib),point(ic)],polygon:Point[]=[];
  for(let j=0;j<3;j++){
   const a=sourceTriangle[j],b=sourceTriangle[(j+1)%3];if(a.d>=0)polygon.push(a);
   if((a.d>=0)!==(b.d>=0)){const t=a.d/(a.d-b.d);polygon.push({p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize(),d:0,key:[a.key,b.key].sort().join(':'),ground:a.ground?.clone().lerp(b.ground!,t)});}
  }
  for(let j=1;j+1<polygon.length;j++)triangle(polygon[0],polygon[j],polygon[j+1]);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);
 // A microscopic film keeps the rock's interpolated normals. Recomputing them
 // on a clipped boundary would create a hard shading seam around each patch.
 if(grounded)geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));else geometry.computeVertexNormals();return geometry;
}
