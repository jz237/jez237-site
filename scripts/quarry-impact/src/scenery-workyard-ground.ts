import * as T from 'three';
import { pbr } from './assets';
import { landscapeHeight, seededRandom, SCREE_POSITIONS, SCREE_UVS } from './quarry-layout';

export const WORKYARD_GROUND = [
  {id:'stores',x:-49,z:59,rx:20,rz:6.2},
  {id:'workshop',x:-54,z:-39,rx:15,rz:11},
  {id:'loading',x:-66,z:-53,rx:16,rz:9},
  {id:'machine',x:60,z:-40,rx:8.6,rz:7.3},
] as const;
function noise(x:number,z:number){return .5+.23*Math.sin(x*1.47+z*.93)+.17*Math.sin(x*3.17-z*2.61);}

export function dressWorkyardGround(parent:T.Group) {
  const soil=pbr('gravel',1,{name:'Workyard deposited fines',color:0x82745c,roughness:.96,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  soil.onBeforeCompile=s=>{
    s.vertexShader='attribute float yardAlpha; varying float vYardAlpha;\n'+s.vertexShader;
    s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvYardAlpha=yardAlpha;');
    s.fragmentShader='varying float vYardAlpha;\n'+s.fragmentShader;
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a*=vYardAlpha;');
  };soil.customProgramCacheKey=()=> 'workyard-fines-1';
  for(const patch of WORKYARD_GROUND){
    const p:number[]=[],uv:number[]=[],alpha:number[]=[],idx:number[]=[];const nx=Math.ceil(patch.rx*2),nz=Math.ceil(patch.rz*2);
    for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){
      const u=i/nx*2-1,v=j/nz*2-1,x=patch.x+u*patch.rx,z=patch.z+v*patch.rz;
      const shape=Math.hypot(u,v)+(noise(x*.5,z*.5)-.5)*.13;
      const fade=(1-T.MathUtils.smoothstep(shape,.57,1))*T.MathUtils.smoothstep(Math.hypot(x,z),46.5,49);
      p.push(x,landscapeHeight(x,z)+.025,z);uv.push(x/2,z/2);alpha.push(fade*(.21+noise(x,z)*.25));
      if(i<nx&&j<nz){const a=j*(nx+1)+i;idx.push(a,a+nx+1,a+1,a+1,a+nx+1,a+nx+2);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('yardAlpha',new T.Float32BufferAttribute(alpha,1));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.Mesh(g,soil);m.name='yard-ground-'+patch.id;m.receiveShadow=true;parent.add(m);
  }
  const chip=new T.BufferGeometry();chip.setAttribute('position',new T.BufferAttribute(SCREE_POSITIONS.slice(),3));chip.setAttribute('uv',new T.BufferAttribute(SCREE_UVS.slice(),2));chip.computeVertexNormals();chip.computeBoundingBox();
  const b=chip.boundingBox!,h=b.max.y-b.min.y;chip.translate(-b.getCenter(new T.Vector3()).x,-b.min.y,-b.getCenter(new T.Vector3()).z);chip.scale(1/h,1/h,1/h);
  const random=seededRandom(491227),d=new T.Object3D(),positions:{x:number;z:number;height:number}[]=[];
  // Small surface fragments sit at foundations and outer machine tracks.
  for(const patch of WORKYARD_GROUND)for(let i=0;i<70;i++){
    let x:number,z:number;
    if(patch.id==='machine'){
      const side=i%2?1:-1,lx=side*(2.08+random()*.65),lz=(random()-.5)*5.2;
      x=62+Math.cos(-.8)*lx+Math.sin(-.8)*lz;z=-42-Math.sin(-.8)*lx+Math.cos(-.8)*lz;
    }else if(patch.id==='stores'){
      x=-65.7+random()*33.4;z=59+(i%2?1:-1)*(1.38+random()*.9);
    }else if(patch.id==='workshop'){
      x=-54+(i%2?1:-1)*(10.7+random()*.65);z=-44.8+random()*12;
    }else{
      const a=random()*Math.PI*2,cx=-74+(i%3)*8;
      x=cx+Math.sin(a)*(1.8+random());z=-50+Math.cos(a)*(1.8+random());
    }
    if(Math.hypot(x,z)<49)continue;
    positions.push({x,z,height:.035+random()*.11});
  }
  const stones=new T.InstancedMesh(chip,pbr('scree',1,{name:'Workyard small photographic rubble',roughness:1}),positions.length);
  positions.forEach((p,i)=>{d.position.set(p.x,landscapeHeight(p.x,p.z)-.012,p.z);d.rotation.set(0,random()*Math.PI*2,0);d.scale.set(p.height*(.8+random()*.6),p.height,p.height);d.updateMatrix();stones.setMatrixAt(i,d.matrix);});
  stones.name='yard-foundation-chips';stones.receiveShadow=true;stones.computeBoundingSphere();parent.add(stones);
  // Wheel impressions are surface marks, not physical ruts. Geometry follows
  // the same height function; the staggered bars keep repetitions interrupted.
  const treadMaterial=new T.MeshStandardMaterial({color:0x514735,roughness:.95,transparent:true,opacity:.24,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const tread=new T.InstancedMesh(new T.PlaneGeometry(.26,.055),treadMaterial,240);
  for(let i=0;i<240;i++){
    const lane=i<120?0:1,step=Math.floor((i%120)/2),side=i%2?1:-1;
    const yaw=lane?0:-.8,t=-16.5+step*.28,lx=side*(lane?1.18:1.52),x=(lane?-54:62)+Math.cos(yaw)*lx+Math.sin(yaw)*t,z=(lane?-28:-42)-Math.sin(yaw)*lx+Math.cos(yaw)*t;
    d.position.set(x,landscapeHeight(x,z)+.031,z);d.rotation.set(-Math.PI/2,0,-yaw+side*.24);d.scale.setScalar(i%17===0?0:1);d.updateMatrix();tread.setMatrixAt(i,d.matrix);
  }tread.name='yard-old-wheel-tracks';tread.receiveShadow=true;tread.computeBoundingSphere();parent.add(tread);
  // Small tufts rooted in sheltered foundations; no extra solid obstacles.
  const gp:number[]=[],gi:number[]=[];
  for(let i=0;i<95;i++){
    const patch=WORKYARD_GROUND[i%3],a=random()*Math.PI*2,x=patch.x+Math.sin(a)*patch.rx*.87,z=patch.z+Math.cos(a)*patch.rz*.87;
    if(Math.hypot(x,z)<49)continue;const y=landscapeHeight(x,z)-.01;
    for(let j=0;j<5;j++){const angle=random()*Math.PI*2,height=.14+random()*.25,w=.019,start=gp.length/3,dx=Math.cos(angle)*w,dz=Math.sin(angle)*w;
      gp.push(x-dx,y,z-dz,x+dx,y,z+dz,x+Math.cos(angle)*.11,y+height,z+Math.sin(angle)*.11);gi.push(start,start+1,start+2);}
  }
  const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(gp,3));gg.setIndex(gi);gg.computeVertexNormals();
  const grass=new T.Mesh(gg,new T.MeshStandardMaterial({name:'Workyard sheltered weeds',color:0x464f24,roughness:1,side:T.DoubleSide}));grass.receiveShadow=true;parent.add(grass);
  return {patches:WORKYARD_GROUND.length,chips:positions.length};
}
