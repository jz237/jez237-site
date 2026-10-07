import {terrainCollisionTiles,registerTerrainContacts} from './terrain-collision';
import { terrainHeight, trackPoint, clamp } from './rules';
import rockHulls from './quarry-rock-hulls.json';
import screePositions from './quarry-scree.json';
import authoredCut from './quarry-cut-collision.json';
import roadsideData from './quarry-roadside-data.json';
import backdropTrees from './quarry-backdrop-trees.json';
import northForest from './quarry-north-forest.json';
import northBackdrop from './quarry-north-backdrop.json';
import { sector as extensionSector, positions as extensionPositions, indices as extensionIndices, solids as extensionSolids } from './quarry-extension-collision.json';
import { sector as headwallSector, positions as headwallPositions, indices as headwallIndices, solids as headwallSolids } from './quarry-headwall-collision.json';
import { sector as eastBaySector, positions as eastBayPositions, indices as eastBayIndices, solids as eastBaySolids } from './quarry-east-bay-collision.json';
import { sector as westWallSector, positions as westWallPositions, indices as westWallIndices, solids as westWallSolids } from './quarry-west-wall-collision.json';
import { createSurfaceSampler } from './quarry-surface-sampler';
import type Rapier from '@dimforge/rapier3d-compat';
export type Point = {x:number;y:number;z:number};
export type Rotation = Point & {w:number};
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
export const yawRotation=(yaw:number):Rotation=>({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)});
export function seededRandom(seed:number){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
export type MeshData={positions:Float32Array;indices:Uint32Array};
export const QUARRY_CUT_SECTOR=authoredCut.sector;
export const QUARRY_EXTENSION_SECTOR=extensionSector;
export const QUARRY_HEADWALL_SECTOR=headwallSector;
export const QUARRY_EAST_BAY_SECTOR=eastBaySector;
export const QUARRY_WEST_WALL_SECTOR=westWallSector;
export function quarryCutGeometry():MeshData { return {positions:new Float32Array(authoredCut.positions),indices:new Uint32Array(authoredCut.indices)}; }
export function quarryExtensionGeometry():MeshData {return {positions:new Float32Array(extensionPositions),indices:new Uint32Array(extensionIndices)};}
let extensionSampler:ReturnType<typeof createSurfaceSampler>|undefined;
const sampleExtension=()=>extensionSampler??=createSurfaceSampler(quarryExtensionGeometry());
export const quarryExtensionHeight=(x:number,z:number)=>sampleExtension().height(x,z);
export const overlapsQuarryExtension=(x:number,z:number,padding=0)=>sampleExtension().overlaps(x,z,padding);
export function quarryHeadwallGeometry():MeshData {return {positions:new Float32Array(headwallPositions),indices:new Uint32Array(headwallIndices)};}
let headwallSampler:ReturnType<typeof createSurfaceSampler>|undefined;
const sampleHeadwall=()=>headwallSampler??=createSurfaceSampler(quarryHeadwallGeometry());
/** Highest exact wall hit, including authored overhangs; undefined outside it. */
export const quarryHeadwallHeight=(x:number,z:number)=>sampleHeadwall().height(x,z);
export const overlapsQuarryHeadwall=(x:number,z:number,padding=0)=>sampleHeadwall().overlaps(x,z,padding);
export function quarryEastBayGeometry():MeshData {return {positions:new Float32Array(eastBayPositions),indices:new Uint32Array(eastBayIndices)};}
let eastBaySampler:ReturnType<typeof createSurfaceSampler>|undefined;
const sampleEastBay=()=>eastBaySampler??=createSurfaceSampler(quarryEastBayGeometry());
export const quarryEastBayHeight=(x:number,z:number)=>sampleEastBay().height(x,z);
export const overlapsQuarryEastBay=(x:number,z:number,padding=0)=>sampleEastBay().overlaps(x,z,padding);
export function quarryWestWallGeometry():MeshData {return {positions:new Float32Array(westWallPositions),indices:new Uint32Array(westWallIndices)};}
let westWallSampler:ReturnType<typeof createSurfaceSampler>|undefined;
const sampleWestWall=()=>westWallSampler??=createSurfaceSampler(quarryWestWallGeometry());
export const quarryWestWallHeight=(x:number,z:number)=>sampleWestWall().height(x,z);
// Major rubble can extend beyond the wall toe. Conservative bounded footprints
// remove only old overlapping scatter, leaving the road and terrain unchanged.
const westWallFootprints=westWallSolids.map(s=>{
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
  for(let i=0;i<s.points.length;i+=3){minX=Math.min(minX,s.points[i]);maxX=Math.max(maxX,s.points[i]);minZ=Math.min(minZ,s.points[i+2]);maxZ=Math.max(maxZ,s.points[i+2]);}
  return {minX,maxX,minZ,maxZ};
});
export const overlapsQuarryWestWall=(x:number,z:number,padding=0)=>sampleWestWall().overlaps(x,z,padding)||westWallFootprints.some(b=>x+padding>=b.minX&&x-padding<=b.maxX&&z+padding>=b.minZ&&z-padding<=b.maxZ);
export function quarryRoadsideGeometry():MeshData {return {positions:new Float32Array(roadsideData.surface.positions),indices:new Uint32Array(roadsideData.surface.indices)};}
let roadsideSampler:ReturnType<typeof createSurfaceSampler>|undefined;
const sampleRoadside=()=>roadsideSampler??=createSurfaceSampler(quarryRoadsideGeometry());
/** Exact authored surface, or undefined outside its footprint. Base terrain is unchanged. */
export const quarryRoadsideHeight=(x:number,z:number)=>sampleRoadside().height(x,z);
export const scenerySurfaceHeight=(x:number,z:number)=>quarryRoadsideHeight(x,z)??landscapeHeight(x,z);
export const overlapsQuarryRoadside=(x:number,z:number,padding=0)=>sampleRoadside().overlaps(x,z,padding);
const reseatedRoadsideTrees=new Set(['fir-0-10','fir-1-5']);
function overlapsAuthoredCut(x:number,z:number,padding=0) {
  const a=(Math.atan2(x/1.08,z)*180/Math.PI+360)%360,r=Math.hypot(x/1.08,z),margin=Math.asin(Math.min(.99,padding/Math.max(1,r)))*180/Math.PI;
  if(a+margin<QUARRY_CUT_SECTOR.startCell||a-margin>QUARRY_CUT_SECTOR.endCellExclusive)return false;
  const profile=quarryProfile(a*Math.PI/180);
  return r+padding>=profile[0].r&&r-padding<=profile.at(-1)!.r;
}
export type ColliderSpec={id:string;p:Point;q?:Rotation;derby?:boolean;friction?:number}&(
  {shape:'box';half:Point}|{shape:'cylinder';halfHeight:number;radius:number}|{shape:'mesh';data:MeshData}|{shape:'hull';points:Float32Array});
export const RAMP_POINTS=new Float32Array([-4,0,-8,4,0,-8,-4,2,8,4,2,8,-4,0,8,4,0,8]);
export const RAMP_INDICES=new Uint32Array([0,2,1,1,2,3,2,4,3,3,4,5,0,4,2,1,3,5]);
export const RAMPS=[[65,20],[-65,12],[30,-70]].map(([x,z])=>({x,y:terrainHeight(x,z),z}));
export const BARRELS=(()=>{const r=seededRandom(508192);return Array.from({length:22},(_,id)=>{const x=55+r()*12,z=-12+r()*20;return {id,x,y:terrainHeight(x,z)+.6,z};});})();
// Keep the works on the quarry interior side of the western racing corridor.
// Both visible structures and every collider in this cluster use this offset.
export const WORKS_OFFSET={x:18,y:0,z:0};
export function terrainGeometry():MeshData {
  const positions=new Float32Array(193*193*3),indices=new Uint32Array(192*192*6);let at=0,ii=0;
  for(let iz=0;iz<=192;iz++)for(let ix=0;ix<=192;ix++){const x=Math.fround(ix*640/192-320),z=Math.fround(iz*640/192-320);positions[at++]=x;positions[at++]=landscapeHeight(x,z);positions[at++]=z;}
  for(let iz=0;iz<192;iz++)for(let ix=0;ix<192;ix++){const a=iz*193+ix,b=a+193;for(const n of [a,b,a+1,a+1,b,b+1])indices[ii++]=n;}
  return {positions,indices};
}
export function rockPlacements(variant:number){const r=seededRandom(419831+variant*193);return Array.from({length:36},(_,i)=>{
  const fan=(i%9)/9*Math.PI*2,a=fan+(r()-.5)*.3+variant*.023,radius=129+r()*30,x=Math.sin(a)*radius*1.08,z=Math.cos(a)*radius,scale=3+r()*10;
  const sx=scale*(.7+r()*.5),sy=scale*(.6+r()*.7),sz=scale,footprint=scale*.32;
  const y=Math.min(landscapeHeight(x,z),landscapeHeight(x-footprint,z),landscapeHeight(x+footprint,z),landscapeHeight(x,z-footprint),landscapeHeight(x,z+footprint))-scale*.12;
  return {x,y,z,sx,sy,sz,yaw:r()*6.28,roll:r()*.3};
}).filter(p=>!overlapsAuthoredCut(p.x,p.z,Math.max(p.sx,p.sz)*.65)).map((p,colliderIndex)=>({...p,colliderIndex})).filter(p=>!overlapsQuarryRoadside(p.x,p.z,Math.max(p.sx,p.sz)*.65)&&!overlapsQuarryExtension(p.x,p.z,Math.max(p.sx,p.sz)*.65)&&!overlapsQuarryHeadwall(p.x,p.z,Math.max(p.sx,p.sz)*.65)&&!overlapsQuarryEastBay(p.x,p.z,Math.max(p.sx,p.sz)*.65)&&!overlapsQuarryWestWall(p.x,p.z,Math.max(p.sx,p.sz)*.65));}
export const SCREE_POSITIONS=new Float32Array(screePositions.positions);
export const SCREE_UVS=new Float32Array(screePositions.uv);
export function screePlacements(){const r=seededRandom(310198);return Array.from({length:360},()=>{const a=r()*Math.PI*2,radius=128+r()*16,x=Math.sin(a)*radius*1.06,z=Math.cos(a)*radius;return {x,y:landscapeHeight(x,z)-.12,z,sx:.15+r()*1.2,sy:.12+r()*.8,sz:.15+r()*1.2,rx:r(),ry:r()*6,rz:r()};}).filter(p=>!overlapsAuthoredCut(p.x,p.z,Math.max(p.sx,p.sz))).map((p,colliderIndex)=>({...p,colliderIndex})).filter(p=>!overlapsQuarryRoadside(p.x,p.z,Math.max(p.sx,p.sz))&&!overlapsQuarryExtension(p.x,p.z,Math.max(p.sx,p.sz))&&!overlapsQuarryHeadwall(p.x,p.z,Math.max(p.sx,p.sz))&&!overlapsQuarryEastBay(p.x,p.z,Math.max(p.sx,p.sz))&&!overlapsQuarryWestWall(p.x,p.z,Math.max(p.sx,p.sz)));}
export function nearTrees(kind:string){const r=seededRandom(749211+(Number(kind.split('-')[1])||0)*284171),track=Array.from({length:120},(_,i)=>trackPoint(i/120));const items=[];
  for(let i=0;i<512&&items.length<16;i++){const a=r()*Math.PI*2,radius=116+r()*25,x=Math.sin(a)*radius,z=Math.cos(a)*radius;if(!track.every(p=>Math.hypot(x-p.x,z-p.z)>10))continue;items.push({x,z,height:4+r()*6,yaw:r()*6.28});}return items.map((p,colliderIndex)=>({...p,colliderIndex})).filter(p=>reseatedRoadsideTrees.has(kind+'-'+p.colliderIndex)||!overlapsQuarryRoadside(p.x,p.z,p.height*.014));
}
export function saplingPlacements(variant:number){const r=seededRandom(863041+variant*31);return Array.from({length:20},(_,i)=>{const t=(i+r())/20,p=trackPoint(t),q=trackPoint(t+.001),a=Math.atan2(q.x-p.x,q.z-p.z),side=r()<.4?-1:1,offset=9+r()*7;return {x:p.x+Math.cos(a)*side*offset,z:p.z-Math.sin(a)*side*offset,height:.85+r()*2.2,yaw:r()*6.28};});}
export function quarryColliderLayout():ColliderSpec[]{
  const items:ColliderSpec[]=[];const origin={x:0,y:0,z:0};
  const box=(id:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,q?:Rotation,derby=false)=>items.push({id,shape:'box',p:{x,y,z},half:{x:sx/2,y:sy/2,z:sz/2},q,derby});
  const cylinder=(id:string,x:number,y:number,z:number,h:number,r:number)=>items.push({id,shape:'cylinder',p:{x,y,z},halfHeight:h/2,radius:r});
  items.push({id:'terrain',shape:'mesh',p:origin,data:terrainGeometry(),friction:.85},{id:'quarry-cliffs',shape:'mesh',p:origin,data:cliffGeometry(),friction:.85});
  items.push({id:'quarry-cut',shape:'mesh',p:origin,data:quarryCutGeometry(),friction:.85});
  items.push({id:'quarry-extension',shape:'mesh',p:origin,data:quarryExtensionGeometry(),friction:.85});
  for(const solid of extensionSolids)items.push({id:'quarry-extension-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});
  items.push({id:'quarry-headwall',shape:'mesh',p:origin,data:quarryHeadwallGeometry(),friction:.85});
  for(const solid of headwallSolids)items.push({id:'quarry-headwall-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});
  items.push({id:'quarry-east-bay',shape:'mesh',p:origin,data:quarryEastBayGeometry(),friction:.85});
  for(const solid of eastBaySolids)items.push({id:'quarry-east-bay-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});
  items.push({id:'quarry-west-wall',shape:'mesh',p:origin,data:quarryWestWallGeometry(),friction:.85});
  for(const solid of westWallSolids)items.push({id:'quarry-west-wall-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});
  items.push({id:'quarry-roadside',shape:'mesh',p:origin,data:quarryRoadsideGeometry(),friction:.85});
  for(const solid of roadsideData.solids)items.push({id:'quarry-roadside-solid-'+solid.id,shape:'hull',p:origin,points:new Float32Array(solid.points),friction:.85});
  for(let i=0;i<66;i++){const a=i/66*Math.PI*2;box('arena-'+i,Math.sin(a)*46,.58,Math.cos(a)*46,4.22,1.16,.75,yawRotation(a),true);}
  RAMPS.forEach((p,i)=>items.push({id:'ramp-'+i,shape:'mesh',p,data:{positions:RAMP_POINTS,indices:RAMP_INDICES}}));
  box('works-building',-72,4,-39,21,8,13);box('works-roof',-72,8.2,-39,22,.4,14);
  for(let i=0;i<5;i++)box('container-'+i,-63+i*7,1.3,59,5.8,2.6,2.5);
  for(let i=0;i<3;i++){const x=-92+i*8;cylinder('silo-'+i,x,9,-50,13,2.7);for(const dx of [-2,2])box('silo-leg-'+i+'-'+dx,x+dx,2,-50,.25,4,.25);}
  const angle=-.18,rotZ={x:0,y:0,z:Math.sin(angle/2),w:Math.cos(angle/2)};
  box('conveyor',-80,5.5,-56,24,.3,1.7,rotZ);
  for(const x of [-89,-72])for(const z of [-57.3,-54.7])box('conveyor-leg-'+x+'-'+z,x,2.2,z,.15,4.4,.15);
  const yaw=-.8,exY=terrainHeight(62,-42),ex=(id:string,x:number,y:number,z:number,sx:number,sy:number,sz:number,q?:Rotation)=>{
    const ry=yawRotation(yaw),local=q??yawRotation(0);const rotation={x:ry.w*local.x+ry.y*local.z,y:ry.w*local.y+ry.y*local.w,z:ry.w*local.z-ry.y*local.x,w:ry.w*local.w-ry.y*local.y};
    box('excavator-'+id,62+Math.cos(yaw)*x+Math.sin(yaw)*z,exY+y,-42-Math.sin(yaw)*x+Math.cos(yaw)*z,sx,sy,sz,rotation);
  };
  for(const x of [-1.6,1.6])ex('track-'+x,x,.6,0,1,1,5.2);
  ex('body',0,1.6,0,3.3,1.2,3.8);ex('cab',-.8,3,-.3,1.6,1.8,2);ex('bucket',.5,2.5,8,1.7,1.3,1.5);
  for(const [id,ay,az,by,bz,width]of [[0,2,1,7,4,.65],[1,7,4,3,8,.5]]){const dy=by-ay,dz=bz-az,len=Math.hypot(dy,dz),xAngle=Math.atan2(dz,dy);ex('boom-'+id,.5,(ay+by)/2,(az+bz)/2,width,len,width,{x:Math.sin(xAngle/2),y:0,z:0,w:Math.cos(xAngle/2)});}
  // Slim posts and wires match their rendered positions; foliage and tiny gravel remain non-solid.
  for(let i=0;i<100;i++){if(i>22&&i<30)continue;const a=i/100*Math.PI*2,b=(i+1)/100*Math.PI*2,x=Math.sin(a)*50,z=Math.cos(a)*50,bx=Math.sin(b)*50,bz=Math.cos(b)*50;box('fence-post-'+i,x,2,z,.07,4,.07);
    for(let j=0;j<4;j++)box('fence-wire-'+i+'-'+j,(x+bx)/2,1.5+j*.6,(z+bz)/2,.02,.02,Math.hypot(bx-x,bz-z),yawRotation(Math.atan2(bx-x,bz-z)));}
  const sign=(id:string,x:number,z:number,yaw:number,scale:number)=>{const y=terrainHeight(x,z);box('sign-board-'+id,x,y+4*scale,z,9*scale,2.25*scale,.12*scale,yawRotation(yaw));for(const side of [-3.6,3.6])box('sign-post-'+id+'-'+side,x+Math.cos(yaw)*side*scale,y+1.7*scale,z-Math.sin(yaw)*side*scale,.12*scale,3.8*scale,.12*scale,yawRotation(yaw));};
  sign('works',-72,-31,0,.85);
  for(let i=0;i<12;i++){const p=trackPoint(i/12),q=trackPoint(i/12+.002),a=Math.atan2(q.x-p.x,q.z-p.z);sign('track-'+i,p.x+Math.cos(a)*9,p.z-Math.sin(a)*9,a+Math.PI,.55);}
  rockHulls.forEach((rock,variant)=>rockPlacements(variant).forEach(p=>{const points=new Float32Array(rock.points.length);for(let j=0;j<points.length;j+=3){points[j]=rock.points[j]*p.sx;points[j+1]=rock.points[j+1]*p.sy;points[j+2]=rock.points[j+2]*p.sz;}const sy=Math.sin(p.yaw/2),cy=Math.cos(p.yaw/2),sz=Math.sin(p.roll/2),cz=Math.cos(p.roll/2);items.push({id:'scanned-rock-'+variant+'-'+p.colliderIndex,shape:'hull',points,p:{x:p.x,y:p.y,z:p.z},q:{x:sy*sz,y:sy*cz,z:cy*sz,w:cy*cz}});}));
  screePlacements().forEach(p=>{const points=new Float32Array(SCREE_POSITIONS.length);for(let j=0;j<points.length;j+=3){points[j]=SCREE_POSITIONS[j]*p.sx;points[j+1]=SCREE_POSITIONS[j+1]*p.sy;points[j+2]=SCREE_POSITIONS[j+2]*p.sz;}
    const c1=Math.cos(p.rx/2),c2=Math.cos(p.ry/2),c3=Math.cos(p.rz/2),s1=Math.sin(p.rx/2),s2=Math.sin(p.ry/2),s3=Math.sin(p.rz/2);
    items.push({id:'scree-'+p.colliderIndex,shape:'hull',points,p:{x:p.x,y:p.y,z:p.z},q:{x:s1*c2*c3+c1*s2*s3,y:c1*s2*c3-s1*c2*s3,z:c1*c2*s3+s1*s2*c3,w:c1*c2*c3-s1*s2*s3}});
  });
  for(const kind of ['fir-0','fir-1','fir-2'])nearTrees(kind).forEach(p=>cylinder('tree-'+kind+'-'+p.colliderIndex,p.x,scenerySurfaceHeight(p.x,p.z)+p.height/2,p.z,p.height,p.height*.014));
  for(const p of backdropTrees)cylinder('tree-backdrop-'+p.id,p.x,p.y+p.height/2,p.z,p.height,p.height*.014);
  for(const p of northForest.trees){
    cylinder('tree-north-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);
    const base=northForest.rootHulls.find(h=>h.variant===p.variant)!;
    base.parts.forEach((part,index)=>{
      const points=new Float32Array(part.map((n,i)=>n*p.height*(i%3===1?1:p.width)));
      items.push({id:'tree-north-root-'+p.id+'-'+index,shape:'hull',p:{x:p.x,y:p.y,z:p.z},q:yawRotation(p.yaw),points});
    });
  }
  for(const p of northForest.mediumTrees)cylinder('tree-north-medium-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);
  for(const p of northBackdrop.trees){
    cylinder('tree-'+p.id,p.x,p.y+p.trunkHeight/2,p.z,p.trunkHeight,p.trunkRadius);
    const base=northForest.rootHulls.find(h=>h.variant===p.variant)!;
    base.parts.forEach((part,index)=>{
      const points=new Float32Array(part.map((n,i)=>n*p.height*(i%3===1?1:p.width)));
      items.push({id:'tree-'+p.id+'-root-'+index,shape:'hull',p:{x:p.x,y:p.y,z:p.z},q:yawRotation(p.yaw),points});
    });
  }
  for(const item of items)if(item.id.startsWith('works-')||item.id.startsWith('silo-')||item.id.startsWith('conveyor')||item.id.startsWith('sign-board-works')||item.id.startsWith('sign-post-works')){
    item.p={x:item.p.x+WORKS_OFFSET.x,y:item.p.y+WORKS_OFFSET.y,z:item.p.z+WORKS_OFFSET.z};
  }
  return items;
}
/** This is the sole collider factory for browser and authoritative server. */
export function createQuarryPhysics(R:typeof Rapier,world:Rapier.World,derby:boolean){
  const layout=quarryColliderLayout(),statics=new Map<string,Rapier.Collider>(),walls:Rapier.Collider[]=[];
  for(const s of layout){let desc:Rapier.ColliderDesc|null;
    if(s.shape==='box')desc=R.ColliderDesc.cuboid(s.half.x,s.half.y,s.half.z);
    else if(s.shape==='cylinder')desc=R.ColliderDesc.cylinder(s.halfHeight,s.radius);
    else if(s.shape==='mesh'){
      if(s.id==='terrain'){
        const colliders=terrainCollisionTiles(s.data).map((tile,index)=>{
          const tileDesc=R.ColliderDesc.trimesh(tile.positions,tile.indices).setTranslation(s.p.x,s.p.y,s.p.z).setFriction(s.friction??.6);
          if(s.q)tileDesc.setRotation(s.q);
          const collider=world.createCollider(tileDesc);statics.set(index===0?s.id:s.id+':'+tile.key,collider);return collider;
        });
        registerTerrainContacts(world,colliders);continue;
      }
      desc=R.ColliderDesc.trimesh(s.data.positions,s.data.indices);
    }
    else desc=R.ColliderDesc.convexHull(s.points);
    if(!desc)throw new Error('Invalid quarry collider '+s.id);desc.setTranslation(s.p.x,s.p.y,s.p.z).setFriction(s.friction??.6);if(s.q)desc.setRotation(s.q);
    const collider=world.createCollider(desc);statics.set(s.id,collider);if(s.derby){walls.push(collider);collider.setEnabled(derby);}
  }
  const props=BARRELS.map(p=>{const body=world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(p.x,p.y,p.z));world.createCollider(R.ColliderDesc.cylinder(.55,.34).setMass(28).setFriction(.7),body);return {id:p.id,body,start:{x:p.x,y:p.y,z:p.z}};});
  return {statics,walls,props};
}
const quarryLevels = [0, 1.2, 9, 10.4, 12.1, 21, 22.2, 25, 35, 38, 43];
const quarryRadii = [136, 139, 143, 150, 155, 161, 167, 175, 180, 190, 205];
function originalCliffPoint(a: number, j: number) {
    const broad = Math.sin(a * 3 + .4) * 11 + Math.sin(a * 7) * 5 + Math.cos(a * 13 + .3) * 2.8;
    const fractures = Math.sin(a * 37 + j * .3) * 1.8 + Math.sin(a * 91 + j * 1.7) * .56;
    const r = quarryRadii[j] + broad + fractures + Math.sin(a * 5 + j * .8) * j * .55;
    const brokenRim = .66 + .22 * Math.sin(a * 2 - .4) + .12 * Math.cos(a * 5);
    const y = j === 0 ? terrainHeight(Math.sin(a) * r * 1.08, Math.cos(a) * r) - .7 : quarryLevels[j] * brokenRim + Math.sin(a * 11 + j * .45) * Math.min(j, 2.5);
    return { r, y };
}
const smooth = (a: number, b: number, n: number) => { const f = clamp((n - a) / (b - a), 0, 1); return f * f * (3 - 2 * f); };
const collapseSectors = [[.42,.24],[1.35,.19],[2.24,.32],[3.88,.35],[5.19,.23]];
function sectorWeight(a:number, center:number, width:number) {
    const d=Math.abs(Math.atan2(Math.sin(a-center),Math.cos(a-center)));
    return 1-smooth(width*.32,width,d);
}
function quarryProfile(a:number) {
    const original=quarryLevels.map((_,j)=>originalCliffPoint(a,j));
    const toe=original[0],crest=original[original.length-1],span=crest.r-toe.r,rise=crest.y-toe.y;
    const collapse=Math.max(...collapseSectors.map(([center,width])=>sectorWeight(a,center,width)));
    // Tall extraction faces alternate with slumped talus. The grid and its toe
    // remain unchanged; only its interior profile changes, so ledges terminate
    // instead of continuing as eleven concentric bands around the whole quarry.
    const cutRadius=[0,.065,.09,.12,.15,.185,.225,.30,.51,.75,1];
    const cutHeight=[0,.04,.20,.37,.54,.71,.87,.905,.94,.975,1];
    const talusRadius=[0,.05,.12,.22,.34,.46,.59,.71,.82,.92,1];
    const recess=sectorWeight(a,.96,.27)*5.5+sectorWeight(a,3.25,.3)*4.2+sectorWeight(a,5.81,.2)*3.8;
    const result=[toe];
    for(let j=1;j<original.length;j++) {
        const fraction=lerp(cutRadius[j],talusRadius[j],collapse);
        const height=lerp(cutHeight[j],talusRadius[j],collapse);
        const recessed=recess*Math.sin(j/(original.length-1)*Math.PI)*(1-collapse);
        const desiredR=lerp(original[j].r,toe.r+span*fraction+recessed,.4);
        const desiredY=lerp(original[j].y,toe.y+rise*height,.42);
        const left=original.length-1-j,previous=result[j-1];
        result.push({r:clamp(desiredR,previous.r+.9,crest.r-left*.9),y:clamp(desiredY,previous.y+.04,crest.y-left*.04)});
    }
    return result;
}
/** Actual crest used to keep distant forest stands behind exposed quarry faces. */
export function quarryRim(a:number) { return quarryProfile(a).at(-1)!; }
// The old radial terrain slope used to poke through the rock wall as a large,
// smooth pale curtain. Terrain behind each bench now follows its actual section.
// All driveable roads, ramps and the entire arena remain on the original surface.
export function landscapeHeight(x: number, z: number) {
    const r = Math.hypot(x / 1.08, z), a = Math.atan2(x / 1.08, z), original = terrainHeight(x, z);
    const profile=quarryProfile(a);
    let previous = profile[0];
    if (r < previous.r)
        return original;
    for (let j = 1; j < quarryLevels.length; j++) {
        const next = profile[j];
        if (r <= next.r)
            return lerp(previous.y, next.y, clamp((r - previous.r) / (next.r - previous.r), 0, 1)) - 2;
        previous = next;
    }
    return lerp(previous.y - 2, original, smooth(previous.r, previous.r + 65, r));
}
export function cliffGeometry() {
    const positions: number[] = [], uv: number[] = [], colors: number[] = [], indices: number[] = [];
    const segments = 360, subdivisions = 3;
    const profiles=Array.from({length:segments+1},(_,i)=>quarryProfile(i/segments*Math.PI*2));
    // Sharp bench breaks remain, but fractured intermediate faces cast real relief
    // and disrupt the smooth stretched-quadrilateral appearance of a terrain ring.
    for (let j = 0; j < quarryLevels.length - 1; j++)
        for (let band = 0; band < subdivisions; band++) {
            const start = positions.length / 3;
            for (let i = 0; i <= segments; i++)
                for (const end of [0, 1]) {
                    const a = i / segments * Math.PI * 2, t = (band + end) / subdivisions;
                    const low = profiles[i][j], high = profiles[i][j + 1];
                    const rawBreakage = Math.sin(t * Math.PI) * (Math.sin(a * 63 + j * 1.8) * .9 + Math.sin(a * 117 + j * .7) * .35);
                    // Narrow headwall rows need bounded relief to keep every
                    // radial strip ordered and its collider faces non-inverting.
                    const breakage=clamp(rawBreakage,-(high.r-low.r)*.22,(high.r-low.r)*.22);
                    const r = lerp(low.r, high.r, t) + breakage;
                    const y = lerp(low.y, high.y, t) + breakage * .45;
                    positions.push(Math.sin(a) * r * 1.08, y, Math.cos(a) * r);
                    const shade = .66 + .16 * Math.sin(a * 11 + j * .79) + .07 * Math.sin(a * 43 + j * 1.6);
                    colors.push(shade, shade * .988, shade * .965);
                }
            for (let i = 0; i < segments; i++) {
                if(i>=QUARRY_CUT_SECTOR.startCell&&i<QUARRY_CUT_SECTOR.endCellExclusive)continue;
                if(i>=QUARRY_EXTENSION_SECTOR.startCell&&i<QUARRY_EXTENSION_SECTOR.endCellExclusive)continue;
                if(QUARRY_HEADWALL_SECTOR.cellRanges.some(([start,end])=>i>=start&&i<end))continue;
                if(i>=QUARRY_EAST_BAY_SECTOR.startCell&&i<QUARRY_EAST_BAY_SECTOR.endCellExclusive)continue;
                if(i>=QUARRY_WEST_WALL_SECTOR.startCell&&i<QUARRY_WEST_WALL_SECTOR.endCellExclusive)continue;
                const b = start + i * 2;
                indices.push(b, b + 1, b + 2, b + 2, b + 1, b + 3);
            }
        }
    // Unwrap by distance along the existing surface, including flat benches.
    // Height alone compressed their texture to narrow strips. A shared arc-length
    // U keeps all bands joined; its whole-number wrap also closes the quarry seam.
    const bands = (quarryLevels.length - 1) * subdivisions, stride = (segments + 1) * 2;
    const pointIndex = (row: number, column: number) => (row === 0 ? column * 2 : (row - 1) * stride + column * 2 + 1) * 3;
    const distance = (a: number, b: number) => Math.hypot(positions[a] - positions[b], positions[a + 1] - positions[b + 1], positions[a + 2] - positions[b + 2]);
    const arc = new Float64Array(segments + 1), surface = new Float64Array((bands + 1) * (segments + 1));
    const referenceRow = Math.floor(bands / 2), metresPerTile = 3.6;
    for (let i = 1; i <= segments; i++)
        arc[i] = arc[i - 1] + distance(pointIndex(referenceRow, i - 1), pointIndex(referenceRow, i));
    const uScale = Math.round(arc[segments] / metresPerTile) / arc[segments];
    for (let i = 0; i < segments; i++)
        for (let row = 1; row <= bands; row++)
            surface[row * (segments + 1) + i] = surface[(row - 1) * (segments + 1) + i] + distance(pointIndex(row - 1, i), pointIndex(row, i));
    for (let band = 0; band < bands; band++)
        for (let i = 0; i <= segments; i++)
            for (const end of [0, 1])
                uv.push(arc[i] * uScale, surface[(band + end) * (segments + 1) + (i === segments ? 0 : i)] / metresPerTile);
    return { positions: new Float32Array(positions), indices: new Uint32Array(indices), uv: new Float32Array(uv), colors: new Float32Array(colors) };
}
