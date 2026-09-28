import * as T from 'three';
import { landscapeHeight, seededRandom, SCREE_POSITIONS, SCREE_UVS } from './quarry-layout';
import { trackPoint } from './rules';
import { pbr } from './assets';
import type { NorthSaplingPart } from './scenery-north-forest';

export type VergePlant = { x: number; z: number; y: number; height: number; yaw: number; width: number; variant: number };
// A single western bend, with clear driving margins and interrupted patches.
// These are flexible ground cover and small surface chips, not solid obstacles.
export function westVergePlacements() {
  const random = seededRandom(738157), grass: VergePlant[] = [], shrubs: VergePlant[] = [], chips: VergePlant[] = [];
  const path = Array.from({ length: 721 }, (_, i) => trackPoint(i / 720));
  for (let pocket = 0; pocket < 14; pocket++) {
    const t = .823 + pocket * .0062, p = trackPoint(t), q = trackPoint(t + .0001);
    const tangent = new T.Vector2(q.x-p.x,q.z-p.z).normalize();
    const side = pocket % 3 === 0 ? -1 : 1;
    const offset = side * (8.2 + random()*2.1);
    const cx=p.x+tangent.y*offset, cz=p.z-tangent.x*offset;
    for (let i=0;i<68;i++) {
      const a=random()*Math.PI*2, r=Math.sqrt(random()), across=Math.cos(a)*r*(1.1+random()), along=Math.sin(a)*r*2.8;
      const x=cx+tangent.y*across+tangent.x*along, z=cz-tangent.x*across+tangent.y*along;
      if (path.some(p=>Math.hypot(p.x-x,p.z-z)<6.9)) continue;
      const y=landscapeHeight(x,z);
      const plant={x,z,y,height:.15+random()*.38,yaw:random()*Math.PI*2,width:.7+random()*.7,variant:pocket%3};
      if(i<2 && pocket%2===0) shrubs.push({...plant,height:.65+random()*.85});
      else if(i%5===0) chips.push({...plant,height:.04+random()*.12});
      else grass.push(plant);
    }
  }
  return {grass,shrubs,chips};
}

function tussock() {
  const p:number[]=[],c:number[]=[],idx:number[]=[],r=seededRandom(5341);
  for(let blade=0;blade<9;blade++) {
    const a=r()*Math.PI*2, length=.45+r()*.55, bend=.1+r()*.4, radius=r()*.15;
    const ox=Math.sin(a)*radius,oz=Math.cos(a)*radius,start=p.length/3;
    for(let k=0;k<4;k++) {
      const t=k/3,w=(1-t)*(.018+r()*.012), sway=bend*t*t;
      const shade=.35+.65*Math.sqrt(t), tip=t>.66 ? .76:1;
      for(const side of [-1,1]) {
        p.push(ox+Math.sin(a)*sway+Math.cos(a)*w*side,t*length,oz+Math.cos(a)*sway-Math.sin(a)*w*side);
        c.push(.18*shade*tip,.23*shade*tip,.08*shade);
      }
      if(k<3){const n=start+k*2;idx.push(n,n+1,n+2,n+1,n+3,n+2);}
    }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.setIndex(idx);g.computeVertexNormals();return g;
}

export function dressWestVerge(parent:T.Group,saplings:readonly NorthSaplingPart[]) {
  const plants=westVergePlacements(),lods:T.LOD[]=[],dummy=new T.Object3D();
  const grassGeometry=tussock(),grassMaterial=new T.MeshStandardMaterial({name:'Western verge bent grass',vertexColors:true,roughness:1,side:T.DoubleSide,envMapIntensity:.25});
  const chipGeometry=new T.BufferGeometry();chipGeometry.setAttribute('position',new T.BufferAttribute(SCREE_POSITIONS.slice(),3));chipGeometry.setAttribute('uv',new T.BufferAttribute(SCREE_UVS.slice(),2));chipGeometry.computeVertexNormals();chipGeometry.computeBoundingBox();
  const bounds=chipGeometry.boundingBox!,size=bounds.getSize(new T.Vector3());chipGeometry.translate(-bounds.getCenter(new T.Vector3()).x,-bounds.min.y,-bounds.getCenter(new T.Vector3()).z);chipGeometry.scale(1/size.y,1/size.y,1/size.y);
  const chipMaterial=pbr('scree',1,{name:'Western verge photographed chips',roughness:1});
  function instances(geometry:T.BufferGeometry,material:T.Material,items:VergePlant[],root:T.Object3D,sourceHeight=1,sourceBottom=0) {
    if(!items.length)return;
    const mesh=new T.InstancedMesh(geometry,material,items.length);
    for(const [i,p]of items.entries()) {
      const scale=p.height/sourceHeight;
      dummy.position.set(p.x-root.position.x,p.y-root.position.y-sourceBottom*scale-.018,p.z-root.position.z);
      dummy.rotation.set(0,p.yaw,0);dummy.scale.set(scale*p.width,scale,scale*p.width);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);
    }
    mesh.receiveShadow=true;mesh.castShadow=sourceHeight!==1;mesh.computeBoundingSphere();return mesh;
  }
  for(let cell=0;cell<3;cell++) {
    const center=trackPoint(.837+cell*.028),lod=new T.LOD();lod.name='west-verge-'+cell;lod.position.set(center.x,landscapeHeight(center.x,center.z),center.z);lod.autoUpdate=false;
    const subset=(all:VergePlant[])=>all.filter(p=>{
      const nearest=[0,1,2].map(i=>{const c=trackPoint(.837+i*.028);return Math.hypot(c.x-p.x,c.z-p.z);});
      return nearest.indexOf(Math.min(...nearest))===cell;
    });
    for(let level=0;level<2;level++) {
      const group=new T.Group();
      const grass=instances(grassGeometry,grassMaterial,subset(plants.grass).filter((_,i)=>!level||i%3===0),lod);if(grass)group.add(grass);
      if(!level){const chips=instances(chipGeometry,chipMaterial,subset(plants.chips),lod);if(chips)group.add(chips);}
      for(const part of saplings.filter(p=>p.level===level)) {
        const trees=instances(part.geometry,part.material,subset(plants.shrubs).filter(p=>p.variant===part.variant),lod,part.sourceHeight,part.sourceBottom);
        if(trees)group.add(trees);
      }
      lod.addLevel(group,level?75:0,.15);
    }
    lod.addLevel(new T.Group(),160,.15);parent.add(lod);lods.push(lod);
  }
  return lods;
}
