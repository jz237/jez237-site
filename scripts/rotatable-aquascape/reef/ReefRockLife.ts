import * as T from 'three';
import {coralCrust} from './CoralCrust.ts';
import {rockRayIndex} from './RockRayIndex.ts';

export type RockLifeAttachments={version:number;signature:string;samples:(number[]|null)[];normals?:number[][]};
export function rockLifeSignature(supports:T.Mesh[]){let hash=2166136261;for(const s of supports){const p=s.geometry.getAttribute('position').array;const words=new Uint32Array(p.buffer,p.byteOffset,p.byteLength/4);for(const word of words)hash=Math.imul(hash^word,16777619);const index=s.geometry.index!;for(const word of index.array)hash=Math.imul(hash^word,16777619);}return (hash>>>0).toString(16);}
/** Small, mixed encrusting communities. Real rock intersections anchor every
 * raised lobe and pore; no floating discs or scenery cards. Independent seeds
 * keep established corals and animals in their accepted locations. */
export function reefRockLife(supports:T.Mesh[],random:()=>number,baked?:RockLifeAttachments){
 const crusts:T.BufferGeometry[]=[],pores:T.BufferGeometry[]=[],obstacles:{center:T.Vector3;radius:number}[]=[];
 const stats={patches:0,pores:0,triangles:0,maxAttachmentError:0,colors:0};
 const palette=['#ce6425','#b63e42','#ad833c','#af528c','#387e80','#789645','#d1914e'];
 const signature=rockLifeSignature(supports);if(baked&&(baked.version!==1||baked.signature!==signature))throw Error('Rock-life attachment bake is stale; rebuild it against the current rock geometry.');
 const samples:(number[]|null)[]=[];let cursor=0;
 const indices=new Map(baked?[]:supports.map(s=>[s,rockRayIndex(s)] as const));
 const normal=new T.Vector3(),point=new T.Vector3(),u=new T.Vector3(),v=new T.Vector3();
 const usedColors=new Set<number>(),anchors:{center:T.Vector3;radius:number;rock:number}[]=[];
 const sample=(mesh:T.Mesh,origin:T.Vector3,direction:T.Vector3,far:number)=>{
  if(baked){if(cursor>=baked.samples.length)throw Error('Incomplete rock-life attachment bake');const s=baked.samples[cursor++];return s?{point:new T.Vector3(...s.slice(0,3) as [number,number,number]),face:{normal:new T.Vector3(...(baked.normals?baked.normals[s[3]]:s.slice(3,6)) as [number,number,number])},object:mesh}:undefined;}
  const hit=indices.get(mesh)!(origin,direction,far);samples.push(hit?[...hit.point.toArray(),...hit.face.normal.toArray()]:null);return hit;
 };
 for(let rock=0;rock<supports.length;rock++){
  const support=supports[rock];support.geometry.computeBoundingBox();const box=support.geometry.boundingBox!,center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  // Front, top, both flanks and rear all carry life when the tank is rotated.
  const directions=[new T.Vector3(0,.10,1),new T.Vector3(-.82,.22,.57),new T.Vector3(.82,.22,.57),new T.Vector3(0,1,.05),new T.Vector3(.2,.2,-1),new T.Vector3(-.45,.68,1),new T.Vector3(.45,-.05,1),new T.Vector3(-1,.1,-.25),new T.Vector3(1,.38,-.25),new T.Vector3(-.35,.6,-1)];
  for(let patch=0;patch<directions.length;patch++){
   const outward=directions[patch].normalize(),extent=Math.max(size.x,size.y,size.z);
   const offset=new T.Vector3((random()-.5)*size.x*.46,(random()-.5)*size.y*.48,(random()-.5)*size.z*.46);
   const origin=center.clone().add(offset).addScaledVector(outward,extent+1),hit=sample(support,origin,outward.clone().negate(),extent*2+2);
   if(!hit?.face||hit.point.y<.26)continue;
   point.copy(hit.point);normal.copy(hit.face.normal).normalize();
   // Reject buried interfaces against neighboring stones. Only exposed rock
   // is colonized; roots never bridge a cavity or grow through another rock.
   const checkOrigin=point.clone().addScaledVector(normal,.17),checkDirection=normal.clone().negate();
   let exposed:ReturnType<ReturnType<typeof rockRayIndex>>;let nearest=.20;
   for(const neighbor of supports){const h=sample(neighbor,checkOrigin,checkDirection,nearest);if(h){nearest=h.point.distanceTo(checkOrigin);exposed=h;}}
   if(!exposed||exposed.object!==support||exposed.point.distanceTo(point)>.018)continue;
   const radius=Math.min(.35,Math.min(size.x,size.y,size.z)*(.28+random()*.14));
   if(radius<.065||anchors.some(a=>a.rock===rock&&a.center.distanceTo(point)<(a.radius+radius)*.84))continue;
   const pigment=(rock*3+patch*2)%palette.length,color=new T.Color(palette[pigment]),seed=rock*3.713+patch*8.123;
   const crust=coralCrust(support.geometry,point,normal,radius,.1,seed,{color,thickness:0,lobed:true,film:true});
   if(!crust.index!.count){crust.dispose();continue;}
   const crustUv=crust.getAttribute('uv');for(let j=0;j<crustUv.count;j++)crustUv.setXY(j,crustUv.getX(j)*2.3,crustUv.getY(j)*2.3);
   crusts.push(crust);anchors.push({center:point.clone(),radius,rock});stats.patches++;usedColors.add(pigment);
   stats.triangles+=crust.index!.count/3;
   u.crossVectors(Math.abs(normal.y)>.9?new T.Vector3(1,0,0):new T.Vector3(0,1,0),normal).normalize();v.crossVectors(normal,u).normalize();
   const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[];
   const count=Math.round(24+radius*110),footprint=.010+radius*.025,accepted:T.Vector3[]=[];
   for(let i=0;i<count;i++){
    const angle=i*2.399963+seed,reach=radius*Math.sqrt((i+.5)/count)*(.52+.25*random());
    const target=point.clone().addScaledVector(u,Math.cos(angle)*reach).addScaledVector(v,Math.sin(angle)*reach);
    const h=sample(support,target.clone().addScaledVector(normal,.18),normal.clone().negate(),.34);
    if(!h?.face||h.face.normal.dot(normal)<.36||h.point.distanceTo(target)>.13)continue;
    if(accepted.some(p=>p.distanceTo(h.point)<footprint*1.9))continue;
    const axis=h.face.normal.clone().normalize(),side=new T.Vector3().crossVectors(Math.abs(axis.y)>.9?new T.Vector3(1,0,0):new T.Vector3(0,1,0),axis).normalize(),across=new T.Vector3().crossVectors(axis,side).normalize();
    const r=footprint*(.75+random()*.55),height=r*(pigment%3===0?1.8:1.05)*( .8+random()*.5),sides=8,start=positions.length/3;
    const feet:T.Vector3[]=[];
    for(let k=0;k<=sides;k++){
     const a=k/sides*Math.PI*2,rr=r*(1+.12*Math.sin(a*3+seed+i));
     const target=h.point.clone().addScaledVector(side,Math.cos(a)*rr).addScaledVector(across,Math.sin(a)*rr);
     const foot=sample(support,target.clone().addScaledVector(axis,.09),axis.clone().negate(),.18);
     if(!foot||foot.point.distanceTo(target)>.035||foot.face!.normal.dot(axis)<.40)break;
     feet.push(foot.point.clone());
    }
    if(feet.length!==sides+1)continue;
    accepted.push(h.point.clone());
    // Keep the eight real rock contacts and their sampling stream unchanged.
    // Above them, rounded shoulders narrow into an off-center fleshy opening.
    // The 8-to-12 transition adds curvature where it changes the silhouette,
    // without increasing root ray casts or turning the whole reef into beads.
    const phase=seed+i*2.173,aspect=.66+.24*(.5+.5*Math.sin(phase*1.7));
    const dome=height*(.48+.48*(.5+.5*Math.sin(phase*.73)));
    const lean=r*.24*Math.sin(phase*1.13),leanAcross=r*.18*Math.cos(phase*.83);
    const append=(p:T.Vector3,shade:number)=>{positions.push(p.x,p.y,p.z);const c=color.clone().multiplyScalar(shade*(.83+.14*Math.sin(i*1.7+seed)));colors.push(c.r,c.g,c.b);uv.push(p.x/.045,p.z/.045+p.y/.045);};
    for(const foot of feet)append(foot.clone().addScaledVector(axis,.005),.67);
    for(let row=0;row<4;row++)for(let k=0;k<=12;k++){
     const a=k/12*Math.PI*2,radial=[.94,.73,.37,.23][row],rise=[.28,.80,1,.66][row];
     const lobe=1+.13*Math.sin(a*2+phase)+.07*Math.sin(a*3-phase*.6);
     const p=h.point.clone().addScaledVector(side,Math.cos(a)*r*radial*lobe+lean*rise).addScaledVector(across,Math.sin(a)*r*radial*aspect*lobe+leanAcross*rise).addScaledVector(axis,dome*rise*(1+.10*Math.sin(a+phase))+.006);
     append(p,[.82,1,1.08,.30][row]*(1+.045*Math.sin(a*3+phase)));
     if(row<3&&k<12){const n=start+9+row*13+k,b=n+13;indices.push(n,n+1,b,n+1,b+1,b);}
    }
    for(let quarter=0;quarter<4;quarter++){
     const b=start+quarter*2,t=start+9+quarter*3;
     indices.push(b,b+1,t+1,b+1,t+2,t+1,b+1,b+2,t+2,b+2,t+3,t+2,b,t+1,t);
    }
    const floor=positions.length/3,p=h.point.clone().addScaledVector(axis,dome*.57+.006).addScaledVector(side,lean*.66).addScaledVector(across,leanAcross*.66);append(p,.15);
    for(let k=0;k<12;k++)indices.push(start+48+k,start+48+k+1,floor);
    stats.pores++;stats.maxAttachmentError=Math.max(stats.maxAttachmentError,.005);
   }
   if(indices.length){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    // Continuous normal at each duplicated ring seam.
    const n=g.getAttribute('normal'),smooth=new T.Vector3();for(let first=0;first<positions.length/3;first+=62)for(const [offset,width] of [[0,8],[9,12],[22,12],[35,12],[48,12]]){const a=first+offset,b=a+width;smooth.fromBufferAttribute(n,a).add(new T.Vector3().fromBufferAttribute(n,b)).normalize();n.setXYZ(a,smooth.x,smooth.y,smooth.z);n.setXYZ(b,smooth.x,smooth.y,smooth.z);}
    pores.push(g);stats.triangles+=indices.length/3;
    g.computeBoundingSphere();obstacles.push({center:g.boundingSphere!.center.clone(),radius:g.boundingSphere!.radius+.006});
   }
  }
 }
 if(baked&&cursor!==baked.samples.length)throw Error('Unused rock-life samples; bake needs refreshing');
 stats.colors=usedColors.size;return {crusts,pores,obstacles,stats,attachments:{version:1,signature,samples}};
}
