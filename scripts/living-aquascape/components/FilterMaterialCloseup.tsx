import {useEffect,useRef} from 'react';
import * as T from 'three';
import {ceramicSurface} from '../lib/aquarium/CanisterStudio';
import {porousCeramic} from '../lib/aquarium/FilterMaterials';
/** A real geometry close-up, rendered once rather than another animation loop. */
export function FilterMaterialCloseup(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setSize(480,480);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  host.current!.append(renderer.domElement);renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Magnified three-dimensional porous ceramic rings');
  const scene=new T.Scene();scene.background=new T.Color(0x18251e);
  const camera=new T.PerspectiveCamera(34,1,.001,10);camera.position.set(.25,.22,.39);camera.lookAt(0,0,0);
  const textures=ceramicSurface(),material=new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.83,...textures,bumpScale:.0012});const geometries:T.BufferGeometry[]=[];
  for(let i=0;i<4;i++){const g=porousCeramic(17+i),mesh=new T.Mesh(g,material);geometries.push(g);mesh.castShadow=true;mesh.receiveShadow=true;mesh.position.set(i===0?0:i===1?-.17:.15,i===0?.005:-.075,i===0?.025:i===1?-.05:-.10);mesh.rotation.set(.65+i*.5,.4,i*.8);scene.add(mesh);}
  scene.add(new T.HemisphereLight(0xfff8e7,0x393829,.8));const key=new T.DirectionalLight(0xfff5df,2);key.position.set(-.3,.6,.5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-.45;key.shadow.camera.right=.45;key.shadow.camera.top=.45;key.shadow.camera.bottom=-.45;key.shadow.camera.near=.05;key.shadow.camera.far=2;key.shadow.normalBias=.00008;scene.add(key);const rim=new T.DirectionalLight(0xd7e8f6,1);rim.position.set(2,0,-2);scene.add(rim);
  renderer.render(scene,camera);
  return()=>{geometries.forEach(g=>g.dispose());material.dispose();textures.map.dispose();textures.bumpMap.dispose();key.shadow.map?.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <figure className="filter-material-closeup"><div ref={host}/><figcaption>POROUS CERAMIC SURFACE<small>Magnified geometry · surface available to biofilm</small></figcaption></figure>;
}
