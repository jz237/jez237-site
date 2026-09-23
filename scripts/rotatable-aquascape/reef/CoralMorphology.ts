import * as T from 'three';

type Random=()=>number;
/** Rounded, irregular fork growth. Polyps are fine normal/color detail; a coral
 * skeleton stays rigid, unlike the soft anemone tissue elsewhere in the scene. */
export function branchingColony(base:T.Vector3,size:number,hue:number,random:Random){
 const geometries:T.BufferGeometry[]=[],baseColor=new T.Color().setHSL(hue,.64,.37),tipColor=baseColor.clone().lerp(new T.Color('#e5e3cc'),.28);
 const choice=(a:number,b:number)=>a+(b-a)*random();
 function branch(start:T.Vector3,end:T.Vector3,radius:number,level:number,seed:number){
  const delta=end.clone().sub(start),middle=start.clone().lerp(end,.5);middle.x+=Math.sin(seed)*delta.length()*.12;middle.z+=Math.cos(seed*1.7)*delta.length()*.12;
  const curve=new T.CatmullRomCurve3([start,middle,end]),steps=level===0?8:level===1?6:4,sides=level===0?12:10;
  const g=new T.TubeGeometry(curve,steps,radius,sides,false),p=g.getAttribute('position'),colors=new Float32Array(p.count*3);
  const terminal=level>=2,endScale=terminal?.57:.71;
  for(let j=0;j<=steps;j++){
   const t=j/steps,center=curve.getPointAt(t),taper=1-(1-endScale)*t;
   for(let k=0;k<=sides;k++){
    const i=j*(sides+1)+k,angle=k/sides*Math.PI*2;
    const polypRidges=1+.045*Math.sin(angle*3+t*19+seed)+.027*Math.sin(angle*5-t*27);
    p.setXYZ(i,center.x+(p.getX(i)-center.x)*taper*polypRidges,center.y+(p.getY(i)-center.y)*taper*polypRidges,center.z+(p.getZ(i)-center.z)*taper*polypRidges);
    const c=baseColor.clone().lerp(tipColor,terminal?T.MathUtils.smoothstep(t,.83,1)*.85:t*.08).multiplyScalar(.96+.03*Math.sin(seed+t*5+angle*2));colors.set([c.r,c.g,c.b],i*3);
   }
  }
  g.setAttribute('color',new T.BufferAttribute(colors,3));const uv=g.getAttribute('uv');for(let j=0;j<=steps;j++)for(let k=0;k<=sides;k++)uv.setXY(j*(sides+1)+k,k/sides*2*Math.PI*radius/.21,j/steps*delta.length()/.21);g.computeVertexNormals();const normals=g.getAttribute('normal');for(let j=0;j<=steps;j++){const a=j*(sides+1),b=a+sides,n=new T.Vector3().fromBufferAttribute(normals,a).add(new T.Vector3().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}geometries.push(g);
  const cap=new T.SphereGeometry(radius*endScale,10,3,0,Math.PI*2,0,Math.PI/2);cap.scale(1,1.05,1);cap.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),curve.getTangentAt(1)));cap.translate(end.x,end.y,end.z);const ca=new Float32Array(cap.getAttribute('position').count*3);for(let i=0;i<ca.length;i+=3)ca.set(terminal?[tipColor.r,tipColor.g,tipColor.b]:[baseColor.r,baseColor.g,baseColor.b],i);cap.setAttribute('color',new T.BufferAttribute(ca,3));geometries.push(cap);
  // Sparse raised radial cups break the branch silhouette; shared maps carry
  // the much finer tissue between them without a mesh for every small polyp.
  if(level<2)for(let q=0;q<(level===0?5:2);q++){
   const t=.16+q/(level===0?5:2)*.65,c=curve.getPointAt(t),tangent=curve.getTangentAt(t),axis=new T.Vector3(0,1,0);if(Math.abs(tangent.y)>.93)axis.set(1,0,0);
   const u=new T.Vector3().crossVectors(tangent,axis).normalize(),v=new T.Vector3().crossVectors(tangent,u).normalize(),angle=seed+q*2.399;
   const radial=u.clone().multiplyScalar(Math.cos(angle)).addScaledVector(v,Math.sin(angle)),out=radial.clone().addScaledVector(tangent,.35).normalize(),across=new T.Vector3().crossVectors(out,tangent).normalize(),along=new T.Vector3().crossVectors(across,out).normalize();
   c.addScaledVector(radial,radius*(1-(1-endScale)*t)*.97);const r=radius*.26,h=r*.75,positions:number[]=[],colors:number[]=[],uv:number[]=[],index:number[]=[];
   for(let row=0;row<4;row++)for(let j=0;j<=8;j++){
    const a=j/8*Math.PI*2,rr=r*[1,.94,.52,0][row],p=c.clone().addScaledVector(across,Math.cos(a)*rr).addScaledVector(along,Math.sin(a)*rr).addScaledVector(out,h*[0,1,.78,.52][row]);positions.push(p.x,p.y,p.z);const color=baseColor.clone().lerp(tipColor,row===1?.25:0).multiplyScalar(row===3?.62:1);colors.push(color.r,color.g,color.b);uv.push(p.x/.21,p.y/.21);
    if(row<3&&j<8){const n=row*9+j;index.push(n,n+9,n+1,n+1,n+9,n+10);}
   }
   const cup=new T.BufferGeometry();cup.setAttribute('position',new T.Float32BufferAttribute(positions,3));cup.setAttribute('color',new T.Float32BufferAttribute(colors,3));cup.setAttribute('uv',new T.Float32BufferAttribute(uv,2));cup.setIndex(index);cup.computeVertexNormals();geometries.push(cup);
  }
  if(level>=2)return;
  const count=level===0?choice(3,4):choice(2,3);
  for(let j=0;j<count;j++){
   const t=.34+(j/count)*.55,root=curve.getPointAt(t),angle=seed+j*2.4+choice(-.4,.4),out=choice(.12,.25)*size*(level===0?1:.65);
   const direction=delta.clone().normalize(),tip=root.clone().add(new T.Vector3(Math.cos(angle)*out,choice(.14,.28)*size*(level===0?1:.7),Math.sin(angle)*out));
   tip.addScaledVector(direction,choice(.04,.12)*size);
   branch(root,tip,radius*(level===0?.65:.60),level+1,seed+j*1.73);
  }
 }
 const count=7+Math.floor(random()*3);
 for(let i=0;i<count;i++){
  const angle=i*2.399+choice(-.32,.32),rad=choice(.26,.6)*size,height=choice(.45,.92)*size;
  const root=base.clone().add(new T.Vector3(Math.cos(angle)*.10*size,choice(-.025,.025)*size,Math.sin(angle)*.10*size));
  const end=base.clone().add(new T.Vector3(Math.cos(angle)*rad,height,Math.sin(angle)*rad));branch(root,end,choice(.037,.057)*size,0,angle+random()*2);
 }
 const crust=new T.SphereGeometry(.16*size,16,8);crust.scale(1,.14,.88);crust.translate(base.x,base.y-.015*size,base.z);const colors=new Float32Array(crust.getAttribute('position').count*3);for(let i=0;i<colors.length;i+=3)colors.set([baseColor.r,baseColor.g,baseColor.b],i);crust.setAttribute('color',new T.BufferAttribute(colors,3));geometries.push(crust);
 return geometries;
}

/** A closed, thin skeleton with independent upper tissue and lower ridges. */
export function platingColony(x:number,y:number,z:number,r:number,seed:number){
 const sides=192,rings=36,positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[];
 const top=new T.Color('#b74423'),rim=new T.Color('#e6aa75'),bottom=new T.Color('#ba9478');
 for(let layer=0;layer<2;layer++)for(let j=0;j<=rings;j++)for(let i=0;i<=sides;i++){
  const a=i/sides*Math.PI*2,t=j/rings,rr=r*t*(1+.12*Math.sin(a*3+seed)+.075*Math.cos(a*7-seed*.3)+.026*Math.sin(a*17));
  const scallop=Math.sin(a*11+t*5+seed)*.046*t*t+Math.sin(a*23-seed)*.017*t**5;
  const raised=.10*t*t+.045*Math.sin(a*4+seed)*t**2+.024*Math.sin(t*11+a*2+seed)*t,groove=Math.sin(a*67+Math.sin(t*18)*.35)*.004*t;
  const thickness=.018+.035*(1-t),py=y+raised+scallop+groove-(layer?thickness:0);
  positions.push(x+Math.cos(a)*rr,py,z+Math.sin(a)*rr*.76);
  const c=layer?bottom.clone().multiplyScalar(.82+.08*Math.cos(a*67)):top.clone().lerp(rim,T.MathUtils.smoothstep(t,.977,1));c.multiplyScalar(.94+.025*Math.sin(a*37+t*61)+.015*Math.sin(a*91-t*19));colors.push(c.r,c.g,c.b);uv.push(Math.cos(a)*rr/.21,Math.sin(a)*rr*.76/.21);
  if(j<rings&&i<sides){const n=layer*(rings+1)*(sides+1)+j*(sides+1)+i;const ids=[n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1];indices.push(...(layer?ids.map((v,k)=>k%3===1?ids[k+1]:k%3===2?ids[k-1]:v):ids));}
 }
 const offset=(rings+1)*(sides+1);for(let i=0;i<sides;i++){const n=rings*(sides+1)+i;indices.push(n,n+offset,n+1,n+1,n+offset,n+offset+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
}
