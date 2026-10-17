import {addReservoirShoreDetail} from './reservoir-shore-material';
import * as T from 'three';
export function reservoirShoreHeight(x:number,z:number){
 const r=Math.hypot(x/650,(z-630)/200);if(r>=1)return -6;
 return -6+Math.pow(Math.sin((1-r)*Math.PI/2),.8)*(37+10*Math.sin(x*.012)+6*Math.sin(z*.032+x*.008));
}
export function createReservoirShore(){
 const root=new T.Group();root.name='bramblebrook-wooded-shore';const pos:number[]=[],color:number[]=[],indices:number[]=[],columns=101,rows=33;
 for(let iz=0;iz<rows;iz++)for(let ix=0;ix<columns;ix++){
  const x=-650+ix*13,z=430+iz*12.5,y=reservoirShoreHeight(x,z);pos.push(x,y,z);
  const c=new T.Color(y<1?0x929584:0x60734e);c.multiplyScalar(.9+.1*Math.sin(x*.11+z*.07));color.push(c.r,c.g,c.b);
  if(ix<columns-1&&iz<rows-1){const i=iz*columns+ix;indices.push(i,i+columns,i+1,i+1,i+columns,i+columns+1);}
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(color,3));geo.setIndex(indices);geo.computeVertexNormals();
 const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:1});const detail=addReservoirShoreDetail(mat);const hill=new T.Mesh(geo,mat);hill.receiveShadow=true;root.add(hill);
 const trees:{x:number,y:number,z:number,size:number}[]=[];let seed=62317;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 hill.updateMatrixWorld(true);const ray=new T.Raycaster();
 // Nine irregular stands leave open meadow between broad woodland silhouettes.
 for(let i=0;i<1000;i++){const stand=i%9,angle=random()*Math.PI*2,radius=Math.sqrt(random()),cx=-500+stand*125,cz=565+Math.sin(stand*2.3)*65,x=cx+Math.cos(angle)*radius*92,z=cz+Math.sin(angle)*radius*72,y=reservoirShoreHeight(x,z);if(y<3)continue;ray.set(new T.Vector3(x,100,z),new T.Vector3(0,-1,0));const hit=ray.intersectObject(hill)[0];if(!hit)continue;trees.push({x,y:hit.point.y,z,size:12+random()*16});}
 const ownedGeo:T.BufferGeometry[]=[],ownedMat:T.Material[]=[],textures:T.Texture[]=[];
 if(typeof document!=='undefined'){
  const texture=new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'models/pine.webp');texture.colorSpace=T.SRGBColorSpace;textures.push(texture);
  const material=new T.MeshStandardMaterial({map:texture,alphaTest:.45,roughness:1,color:0xbac4b0,side:T.DoubleSide});
  material.onBeforeCompile=shader=>{
   shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`vec3 center=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;vec3 right=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));vec3 billboard=center+right*position.x*length(instanceMatrix[0].xyz)+vec3(0.0,position.y*length(instanceMatrix[1].xyz),0.0);vec4 mvPosition=viewMatrix*vec4(billboard,1.0);gl_Position=projectionMatrix*mvPosition;`);
   shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>\nnormal=transformDirection(vec3(0.0,1.0,0.0),viewMatrix);nonPerturbedNormal=normal;`).replace('#include <lights_fragment_end>',`#include <lights_fragment_end>\nreflectedLight.directDiffuse*=.5;reflectedLight.directSpecular*=.5;`);
  };material.customProgramCacheKey=()=> 'reservoir-shore-trees-v1';
  const geometry=new T.PlaneGeometry(461/1024,1);geometry.translate(0,.5,0);ownedGeo.push(geometry);ownedMat.push(material);
  const mesh=new T.InstancedMesh(geometry,material,trees.length),m=new T.Matrix4();
  trees.forEach((t,i)=>{m.makeScale(t.size,t.size,t.size);m.setPosition(t.x,t.y,t.z);mesh.setMatrixAt(i,m);mesh.setColorAt(i,new T.Color().setScalar(.87+(i%7)*.025));});mesh.computeBoundingSphere();root.add(mesh);
 }
 root.userData.trees=trees;let disposed=false;return{root,dispose(){if(disposed)return;disposed=true;detail.dispose();root.removeFromParent();root.traverse(o=>{if(o instanceof T.InstancedMesh)o.dispose();});geo.dispose();mat.dispose();ownedGeo.forEach(g=>g.dispose());ownedMat.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());root.clear();}};
}
