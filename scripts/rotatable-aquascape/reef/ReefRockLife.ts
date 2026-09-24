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
 const palette=['#c26428','#ad4937','#917347','#9c526d','#596f72','#728556','#bc8352'];
 const signature=rockLifeSignature(supports);if(baked&&(baked.version!==1||baked.signature!==signature))throw Error('Rock-life attachment bake is stale; rebuild it against the current rock geometry.');
 const samples:(number[]|null)[]=[];let cursor=0;
 const indices=new Map(baked?[]:supports.map(s=>[s,rockRayIndex(s)] as const));
 const normal=new T.Vector3(),point=new T.Vector3(),u=new T.Vector3(),v=new T.Vector3();
 const usedColors=new Set<number>(),anchors:{center:T.Vector3;radius:number}[]=[];
 const sample=(mesh:T.Mesh,origin:T.Vector3,direction:T.Vector3,far:number)=>{
  if(baked){if(cursor>=baked.samples.length)throw Error('Incomplete rock-life attachment bake');const s=baked.samples[cursor++];return s?{point:new T.Vector3(...s.slice(0,3) as [number,number,number]),face:{normal:new T.Vector3(...(baked.normals?baked.normals[s[3]]:s.slice(3,6)) as [number,number,number])},object:mesh}:undefined;}
  const hit=indices.get(mesh)!(origin,direction,far);samples.push(hit?[...hit.point.toArray(),...hit.face.normal.toArray()]:null);return hit;
 };
 for(let rock=0;rock<supports.length;rock++){
  const support=supports[rock];support.geometry.computeBoundingBox();const box=support.geometry.boundingBox!,center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  // Front, top, both flanks and rear all carry life when the tank is rotated.
  const directions=[new T.Vector3(0,.10,1),new T.Vector3(-.82,.22,.57),new T.Vector3(.82,.22,.57),new T.Vector3(0,1,.05),new T.Vector3(.2,.2,-1)];
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
   if(radius<.065||anchors.some(a=>a.center.distanceTo(point)<Math.min(a.radius,radius)*.85))continue;
   const pigment=(rock*3+patch*2)%palette.length,color=new T.Color(palette[pigment]),seed=rock*3.713+patch*8.123;
   const crust=coralCrust(support.geometry,point,normal,radius,.1,seed,{color,thickness:0,lobed:true,film:true});
   if(!crust.index!.count){crust.dispose();continue;}
   const crustUv=crust.getAttribute('uv');for(let j=0;j<crustUv.count;j++)crustUv.setXY(j,crustUv.getX(j)*2.3,crustUv.getY(j)*2.3);
   crusts.push(crust);anchors.push({center:point.clone(),radius});stats.patches++;usedColors.add(pigment);
   stats.triangles+=crust.index!.count/3;
   u.crossVectors(Math.abs(normal.y)>.9?new T.Vector3(1,0,0):new T.Vector3(0,1,0),normal).normalize();v.crossVectors(normal,u).normalize();
   const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[];
   const count=Math.round(18+radius*85),footprint=.010+radius*.025,accepted:T.Vector3[]=[];
   for(let i=0;i<count;i++){
    const angle=i*2.399963+seed,reach=radius*Math.sqrt((i+.5)/count)*(.43+.22*random());
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
    // Uneven fleshy lobes with a small recessed osculum, not spherical beads.
    // The foot lies just above the existing crust and follows actual triangles.
    for(let row=0;row<4;row++)for(let k=0;k<=sides;k++){
     const a=k/sides*Math.PI*2,radial=[1,.88,.41,.24][row],rise=[.006,height*.62,height,height*.70][row];
     const p=row===0?feet[k].clone().addScaledVector(axis,.005):h.point.clone().addScaledVector(side,Math.cos(a)*r*radial).addScaledVector(across,Math.sin(a)*r*radial*.86).addScaledVector(axis,rise*(1+.08*Math.sin(a*3+i))+.006);
     positions.push(p.x,p.y,p.z);const c=color.clone().multiplyScalar((row===3?.34:row===2?1.12:row===1?.9:.65)*(.86+.12*Math.sin(i*1.7+seed)));
     colors.push(c.r,c.g,c.b);uv.push(p.x/.12,p.z/.12+p.y/.12);
     if(row<3&&k<sides){const n=start+row*(sides+1)+k,b=n+sides+1;indices.push(n,n+1,b,n+1,b+1,b);}
    }
    const floor=positions.length/3,p=h.point.clone().addScaledVector(axis,height*.66+.006);positions.push(p.x,p.y,p.z);const dark=color.clone().multiplyScalar(.18);colors.push(dark.r,dark.g,dark.b);uv.push(p.x/.12,p.z/.12+p.y/.12);
    for(let k=0;k<sides;k++)indices.push(start+3*(sides+1)+k,start+3*(sides+1)+k+1,floor);
    stats.pores++;stats.maxAttachmentError=Math.max(stats.maxAttachmentError,.005);
   }
   if(indices.length){
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
    // Continuous normal at each duplicated ring seam.
    const n=g.getAttribute('normal'),smooth=new T.Vector3();for(let first=0;first<positions.length/3;first+=37)for(let row=0;row<4;row++){const a=first+row*9,b=a+8;smooth.fromBufferAttribute(n,a).add(new T.Vector3().fromBufferAttribute(n,b)).normalize();n.setXYZ(a,smooth.x,smooth.y,smooth.z);n.setXYZ(b,smooth.x,smooth.y,smooth.z);}
    pores.push(g);stats.triangles+=indices.length/3;
    g.computeBoundingSphere();obstacles.push({center:g.boundingSphere!.center.clone(),radius:g.boundingSphere!.radius+.006});
   }
  }
 }
 if(baked&&cursor!==baked.samples.length)throw Error('Unused rock-life samples; bake needs refreshing');
 stats.colors=usedColors.size;return {crusts,pores,obstacles,stats,attachments:{version:1,signature,samples}};
}
