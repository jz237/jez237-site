import * as T from 'three';
import {axialCorallite,finishBranch,radialCorallites} from './BranchAnatomy.ts';

type Random=()=>number;
export type CoralGrowth='canopy'|'bushy'|'antler';
/** Rounded, irregular fork growth. Polyps are fine normal/color detail; a coral
 * skeleton stays rigid, unlike the soft anemone tissue elsewhere in the scene. */
export function branchingColony(base:T.Vector3,size:number,hue:number,random:Random,surface?:(x:number,z:number)=>number|null,growth:CoralGrowth='canopy',basalGeometry?:T.BufferGeometry){
 const geometries:T.BufferGeometry[]=[],baseColor=new T.Color().setHSL(hue,.52,.29),tipColor=baseColor.clone().lerp(new T.Color('#e5e3cc'),.31);
 let growthRandom=random;
 const choice=(a:number,b:number)=>a+(b-a)*growthRandom();
 function branch(start:T.Vector3,end:T.Vector3,radius:number,level:number,seed:number){
  const delta=end.clone().sub(start),middle=start.clone().lerp(end,.5);middle.x+=Math.sin(seed)*delta.length()*.12;middle.z+=Math.cos(seed*1.7)*delta.length()*.12;
  const shoulder=start.clone().lerp(end,.27);if(level===0){const bend=.5+.5*Math.sin(seed*1.83);shoulder.y=start.y+delta.y*(.27-.17*bend);middle.y=start.y+delta.y*(.5-.11*bend);if(size>=.6){const drift=.075*size*Math.sin(seed*2.31);shoulder.x+=Math.cos(seed+1.2)*drift;shoulder.z+=Math.sin(seed+1.2)*drift;middle.x-=Math.cos(seed+1.2)*drift*.45;middle.z-=Math.sin(seed+1.2)*drift*.45;}}else{shoulder.addScaledVector(delta.clone().normalize(),-.025*size);}
  const curve=new T.CatmullRomCurve3([start,shoulder,middle,end]),steps=level===0?8:level===1?6:4,sides=level===0?12:10;
  const g=new T.TubeGeometry(curve,steps,radius,sides,false),p=g.getAttribute('position'),colors=new Float32Array(p.count*3);
  const terminal=level>=2,endScale=terminal?(growth==='antler'?.66:.70):.62;
  for(let j=0;j<=steps;j++){
   const t=j/steps,center=curve.getPointAt(t),taper=(1-(1-endScale)*t)*(1+(level===0?.26:.36)*Math.exp(-t*15));
   for(let k=0;k<=sides;k++){
    const i=j*(sides+1)+k,angle=k/sides*Math.PI*2;
    const polypRidges=1+.075*Math.sin(angle*3+t*13+seed)+.04*Math.sin(angle*5-t*19)+.075*Math.sin(t*12+seed)*Math.sin(Math.PI*t);
    p.setXYZ(i,center.x+(p.getX(i)-center.x)*taper*polypRidges,center.y+(p.getY(i)-center.y)*taper*polypRidges,center.z+(p.getZ(i)-center.z)*taper*polypRidges);
    const c=baseColor.clone().lerp(tipColor,T.MathUtils.smoothstep(t,.87,1)*.85).multiplyScalar(.76+.18*t+.055*Math.sin(seed+t*5+angle*2));colors.set([c.r,c.g,c.b],i*3);
   }
  }
  g.setAttribute('color',new T.BufferAttribute(colors,3));const uv=g.getAttribute('uv');for(let j=0;j<=steps;j++)for(let k=0;k<=sides;k++)uv.setXY(j*(sides+1)+k,k/sides*2*Math.PI*radius/.135,j/steps*delta.length()/.135);geometries.push(g);
  const cap=axialCorallite(g,tipColor,terminal);geometries.push(cap);const junctions:number[]=[];
  if(level>=2){
   // Short offset shoots interrupt identical two-fork terminals. Their direction
   // and occurrence are deterministic, without consuming the scene RNG stream.
   if(Math.sin(seed*13.71)>(size<.6?.65:-.15))for(let spur=0;spur<(size>=.6&&Math.sin(seed*5.7)>.2?2:1);spur++){
    const phase=seed+spur*2.4,t=size<.6?.55+.08*Math.sin(seed*4.1):.38+spur*.34+.06*Math.sin(phase*4.1),root=curve.getPointAt(t),axis=curve.getTangentAt(t);
    const lateral=new T.Vector3(Math.cos(phase*2.1),size>=.6?.8:.3,Math.sin(phase*2.1)).addScaledVector(axis,.6).normalize();
    const len=size*(.066+.034*(.5+.5*Math.sin(phase*7.3))),end=root.clone().addScaledVector(lateral,len);
    const path=new T.QuadraticBezierCurve3(root,root.clone().addScaledVector(lateral,len*.45).addScaledVector(axis,len*.16),end);
    const shoot=new T.TubeGeometry(path,3,radius*.49,6,false),sp=shoot.getAttribute('position'),sc=new Float32Array(sp.count*3);
    for(let row=0;row<=3;row++){const u=row/3,center=path.getPointAt(u),color=baseColor.clone().lerp(tipColor,u*.72);
     for(let k=0;k<=6;k++){const i=row*7+k,v=new T.Vector3().fromBufferAttribute(sp,i).sub(center).multiplyScalar(1-.27*u).add(center);sp.setXYZ(i,v.x,v.y,v.z);sc.set([color.r,color.g,color.b],i*3);}}
    shoot.setAttribute('color',new T.BufferAttribute(sc,3));const uv=shoot.getAttribute('uv');for(let row=0;row<=3;row++)for(let k=0;k<=6;k++)uv.setXY(row*7+k,k/6*2*Math.PI*radius*.49/.135,row/3*len/.135);
    const shootCap=axialCorallite(shoot,tipColor,true);finishBranch(shoot,shootCap,[]);shoot.name='Offset terminal growth';geometries.push(shoot,shootCap);junctions.push(t);
   }
   finishBranch(g,cap,junctions);geometries.push(...radialCorallites(g,level,seed,baseColor,tipColor));return;
  }
  const count=level===0?choice(3,4):choice(2,3);
  for(let j=0;j<count;j++){
   const t=.32+(j/count)*.57+.085*Math.sin(seed*2.7+j*4.1),root=curve.getPointAt(t),angle=seed+j*2.4+.33*Math.sin(seed*1.7+j*3.8)+choice(-.4,.4),out=choice(.12,.25)*size*(level===0?1:.58);
   junctions.push(t);
   const direction=curve.getTangentAt(t),rise=choice(.15,.34)*size*(level===0?1:.47),tip=root.clone().add(new T.Vector3(Math.cos(angle)*out,rise,Math.sin(angle)*out));
   // Branches inherit a local exposure direction. Neighboring forks form
   // unequal terraces instead of every child reaching one circular rim.
   const exposure=.5+.5*Math.cos(seed*.83-hue*19),curl=Math.sin(seed*2.13+j*1.9);
   if(growth==='canopy'&&level===0){
    tip.y=Math.max(root.y+.08*size,base.y+size*(.34+.28*exposure+.10*curl));
    tip.x+=Math.cos(seed)*out*.24;tip.z+=Math.sin(seed)*out*.24;
   }
   if(level===1){tip.x+=Math.cos(seed+.6)*out*.20;tip.z+=Math.sin(seed+.6)*out*.20;tip.y+=size*.035*curl;}
   if(growth==='bushy')tip.addScaledVector(direction,.025*size);
   tip.addScaledVector(direction,choice(.04,.12)*size);
   if(size>=.6){
    // Mature crowns carry outward-growing shoulder fans, then turn their finer
    // tips upward. Inheriting the parent bearing avoids unrelated upright
    // bouquets at every fork. All existing branches/cups and RNG draws remain.
    const bearing=Math.atan2(delta.z,delta.x),fan=(j/(Math.ceil(count)-1)-.5);
    const heading=bearing+fan*(level===0?1.85:1.55)+.24*Math.sin(seed*2.3+j*1.7);
    const reach=out*(level===0?1.7:1.45)*(1+.16*Math.sin(seed+j*3.7));
    const lift=rise*(level===0?(growth==='antler'?1.05:.72):1.3);
    tip.set(root.x+Math.cos(heading)*reach,root.y+lift+size*.018*(1+curl),root.z+Math.sin(heading)*reach);
    tip.addScaledVector(direction,size*(level===0?.075:.035));
   }
   branch(root,tip,Math.max(radius*(1-(1-endScale)*t)*.72,(level===0?.018:growth==='antler'?.013:.014)*size),level+1,seed+j*1.73);
  }
  if(level===0&&size>=.6){
   // Interleaved lower scaffolds fill the bare trunk intervals. A local stream
   // leaves every established colony, garden and small infill placement intact.
   const sceneRandom=growthRandom;let state=(Math.floor((seed+31.7)*104729)>>>0)||1;
   growthRandom=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return (state>>>0)/4294967296;};
   for(let j=0;j<2;j++){
    const t=.20+j*.27+.045*Math.sin(seed*3.7+j*2.1),root=curve.getPointAt(t);
    const angle=seed+(j?1.35:-1.1)+.45*Math.sin(seed*2.3);
    const length=size*(.19+.09*growthRandom()),tip=root.clone().add(new T.Vector3(Math.cos(angle)*length,.13*size+length*.45,Math.sin(angle)*length));
    junctions.push(t);
    const first=geometries.length;
    branch(root,tip,radius*(1-(1-endScale)*t)*.48,1,seed+11.31+j*3.17);
    geometries[first].name='Interleaved scaffold';
   }
   growthRandom=sceneRandom;
  }
  finishBranch(g,cap,junctions);geometries.push(...radialCorallites(g,level,seed,baseColor,tipColor));
 }
 const count=7+Math.floor(random()*3);
 for(let i=0;i<count;i++){
  const angle=i*2.399+choice(-.32,.32),exposure=.5+.5*Math.cos(angle-hue*19),rad=choice(.35,.67)*size*(growth==='bushy'?.78:growth==='antler'?.65:1)*(.82+.40*exposure),height=choice(.38,.9)*size*(growth==='canopy'?.55:growth==='bushy'?.72:1)*(.74+.42*exposure);
  // Separate attachment points across the living crust; keep each stem sunk
  // into the actual support rather than suspending a radial bouquet above it.
  const broad=size>=.6;
  const spread=(broad?.13+.15*(.5+.5*Math.sin(i*4.13+hue*11)):.09+.085*(.5+.5*Math.sin(i*4.13+hue*11)))*size;
  const rootAngle=angle+(broad?.45*Math.sin(i*3.7+hue*13):0);
  const root=base.clone().add(new T.Vector3(Math.cos(rootAngle)*spread,choice(-.012,.009)*size,Math.sin(rootAngle)*spread));
  if(surface){
   // Retreat across the same local support when the wider foot reaches an edge.
   // Never leave roots hanging above a ledge or drop onto a disconnected shelf.
   const dx=root.x-base.x,dz=root.z-base.z;let anchored=false;
   for(const fraction of broad?[1,.82,.64,.46]:[1]){
    const x=base.x+dx*fraction,z=base.z+dz*fraction,y=surface(x,z);
    if(y!==null&&Math.abs(y-base.y)<.15*size){root.set(x,y-.014*size,z);anchored=true;break;}
   }
   if(!anchored)root.copy(base);
  }
  const end=base.clone().add(new T.Vector3(Math.cos(angle)*rad,height,Math.sin(angle)*rad));branch(root,end,choice(.037,.057)*size,0,angle+random()*2);
 }
 // Prefer clipped triangles from the actual support, including its curved relief.
 if(basalGeometry){basalGeometry.name='Rock-conforming colony base';geometries.push(basalGeometry);return geometries;}
 // A thin irregular living crust conforms to the actual rock, not a flowerpot disc.
 const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[],valid:boolean[]=[],rings=8,sides=48;
 for(let j=0;j<=rings;j++)for(let k=0;k<=sides;k++){
  const a=k/sides*Math.PI*2,t=j/rings,r=(size>=.6?.34:.19)*size*t*(1+.17*Math.sin(a*3+hue*17)+.08*Math.sin(a*7)),x=base.x+Math.cos(a)*r,z=base.z+Math.sin(a)*r;
  const y=surface?surface(x,z):base.y,ok=y!==null&&Math.abs(y-base.y)<.29*size;valid.push(ok);
  positions.push(x,(ok?y!:base.y)+.003*size,z);const c=baseColor.clone().multiplyScalar(.67+.13*(1-t));colors.push(c.r,c.g,c.b);uv.push(x/.135,z/.135);
  if(j&&k){const n=j*(sides+1)+k,a=n-sides-2,b=n-sides-1,c=n-1;const connected=(a:number,b:number,c:number)=>{if(!valid[a]||!valid[b]||!valid[c])return false;for(const [u,v] of [[a,b],[b,c],[c,a]]){const dx=positions[u*3]-positions[v*3],dz=positions[u*3+2]-positions[v*3+2],dy=Math.abs(positions[u*3+1]-positions[v*3+1]);if(dy>Math.hypot(dx,dz)*1.45+.002*size)return false;}return true;};if(j>1&&connected(a,b,c))indices.push(a,b,c);if(connected(b,c,n))indices.push(b,n,c);}
 }
 // Discard isolated pieces below ledges: living basal tissue stays connected.
 const neighbors=Array.from({length:valid.length},()=>new Set<number>());
 for(let i=0;i<indices.length;i+=3)for(let j=0;j<3;j++){const a=indices[i+j],b=indices[i+(j+1)%3];neighbors[a].add(b);neighbors[b].add(a);}
 const attached=new Set<number>(),queue:number[]=[];for(let k=0;k<=sides;k++){attached.add(k);queue.push(k);}
 for(let i=0;i<queue.length;i++)for(const n of neighbors[queue[i]])if(!attached.has(n)){attached.add(n);queue.push(n);}
 const connectedIndices=indices.filter(n=>attached.has(n));
 const crust=new T.BufferGeometry();crust.name='Rock-conforming colony base';crust.setAttribute('position',new T.Float32BufferAttribute(positions,3));crust.setAttribute('color',new T.Float32BufferAttribute(colors,3));crust.setAttribute('uv',new T.Float32BufferAttribute(uv,2));crust.setIndex(connectedIndices);crust.computeVertexNormals();geometries.push(crust);
 return geometries;
}

/** A closed, thin skeleton with independent upper tissue and lower ridges. */
export function platingColony(x:number,y:number,z:number,r:number,seed:number){
 const sides=192,rings=36,positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[],tissue:number[]=[];
 const top=new T.Color('#b74423'),rim=new T.Color('#e6aa75'),bottom=new T.Color('#ba9478');
 // Unequal growth fans and narrow retreating bays replace a circular bowl.
 // Each fan raises a different fold; its valley continues into the older
 // tissue, so the edge reads as a grown shelf rather than a corrugated disc.
 const fans=Array.from({length:13},(_,k)=>({angle:k*Math.PI*2/13+.085*Math.sin(seed*2+k*4.1),width:.14+.07*(.5+.5*Math.sin(k*2.8+seed)),reach:.04+.085*(.5+.5*Math.sin(k*4.7-seed)),rise:.025+.08*(.5+.5*Math.cos(k*2.3+seed*1.7))}));
 const delta=(a:number,b:number)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
 const margins=Array.from({length:sides+1},(_,i)=>{
  const a=i/sides*Math.PI*2;
  let growth=0,fold=0,bay=0;
  for(const fan of fans){const d=delta(a,fan.angle),lobe=Math.exp(-((d/fan.width)**2));growth+=fan.reach*lobe;fold+=fan.rise*lobe;bay+=.065*Math.exp(-((delta(a,fan.angle+fan.width*1.2)/.075)**2));}
  return {outline:.95+.075*Math.sin(a*3+seed)+.045*Math.cos(a*5-seed*.3)+growth-bay,fold};
 });
 for(let layer=0;layer<2;layer++)for(let j=0;j<=rings;j++)for(let i=0;i<=sides;i++){
  const a=i/sides*Math.PI*2,t=j/rings,{outline,fold}=margins[i];
  const rr=r*t*outline,scallop=r*(Math.sin(a*19+Math.sin(a*5)*.8+seed)*.012*t**5+Math.sin(a*37-seed)*.005*t**8);
  // A low spreading fan with local upturned lobes, not one continuous cup.
  const raised=r*(.035*t*t+fold*T.MathUtils.smoothstep(t,.25,1)+.045*Math.sin(a+seed)*t+.025*Math.sin(t*11+a*3+seed)*t*t),groove=Math.sin(a*67+Math.sin(t*18)*.7)*r*(layer?.006:.003)*t;
  const tissueRelief=r*.016*(.6*Math.sin(a*37+Math.sin(t*17+seed))+.4*Math.sin(a*61-t*13+seed))*Math.sin(t*43+a*5)*t*(1-T.MathUtils.smoothstep(t,.92,1));
  const thickness=r*(.010+.035*(1-t)**2),py=y+raised+scallop+groove+tissueRelief-(layer?thickness:0);
  positions.push(x+Math.cos(a)*rr,py,z+Math.sin(a)*rr*.76);tissue.push(Math.round(255*(layer?.12:1-T.MathUtils.smoothstep(t,.955,1))));
  const c=layer?bottom.clone().multiplyScalar(.82+.08*Math.cos(a*67)):top.clone().lerp(rim,T.MathUtils.smoothstep(t,.969+.009*Math.sin(a*7+seed),1));c.multiplyScalar(.94+.025*Math.sin(a*37+t*61)+.015*Math.sin(a*91-t*19));colors.push(c.r,c.g,c.b);uv.push(Math.cos(a)*rr/.32,Math.sin(a)*rr*.76/.32);
  if(j<rings&&i<sides){const n=layer*(rings+1)*(sides+1)+j*(sides+1)+i;const ids=j?[n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1]:[n+1,n+sides+2,n+sides+1];indices.push(...(layer?ids.map((v,k)=>k%3===1?ids[k+1]:k%3===2?ids[k-1]:v):ids));}
 }
 const offset=(rings+1)*(sides+1);for(let i=0;i<sides;i++){const n=rings*(sides+1)+i;indices.push(n,n+offset,n+1,n+1,n+offset,n+offset+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setAttribute('plateTissue',new T.Uint8BufferAttribute(tissue,1,true));geo.setIndex(indices);geo.computeVertexNormals();
 // Smooth the coincident angular seam and pole without welding upper/lower
 // tissue together. No extra geometry or per-frame work is needed.
 const normals=geo.getAttribute('normal'),normal=new T.Vector3();
 for(let layer=0;layer<2;layer++){
  const start=layer*offset;normal.set(0,0,0);for(let i=0;i<=sides;i++)normal.add(new T.Vector3().fromBufferAttribute(normals,start+i));normal.normalize();for(let i=0;i<=sides;i++)normals.setXYZ(start+i,normal.x,normal.y,normal.z);
  for(let j=1;j<=rings;j++){const a=start+j*(sides+1),b=a+sides;normal.fromBufferAttribute(normals,a).add(new T.Vector3().fromBufferAttribute(normals,b)).normalize();normals.setXYZ(a,normal.x,normal.y,normal.z);normals.setXYZ(b,normal.x,normal.y,normal.z);}
 }
 return geo;
}

/** Conservative volumes derived from the actual closed shelf, including folds.
 * A cell encloses its vertices; one maximum edge of padding also encloses every
 * triangle incident to those vertices. No separately guessed height formula. */
export function plateCollisionVolumes(geometry:T.BufferGeometry,cellSize=.18){
 const p=geometry.getAttribute('position'),index=geometry.index!,cells=new Map<string,T.Box3>();
 let edgeSquared=0;
 for(let i=0;i<index.count;i+=3)for(let j=0;j<3;j++){const a=index.getX(i+j),b=index.getX(i+(j+1)%3);edgeSquared=Math.max(edgeSquared,(p.getX(a)-p.getX(b))**2+(p.getY(a)-p.getY(b))**2+(p.getZ(a)-p.getZ(b))**2);}
 const point=new T.Vector3();
 for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i);const key=Math.floor(point.x/cellSize)+':'+Math.floor(point.z/cellSize);let box=cells.get(key);if(!box){box=new T.Box3();cells.set(key,box);}box.expandByPoint(point);}
 const padding=Math.sqrt(edgeSquared)+.006;
 return [...cells.values()].map(box=>({center:box.getCenter(new T.Vector3()),radius:box.getSize(new T.Vector3()).length()*.5+padding}));
}
