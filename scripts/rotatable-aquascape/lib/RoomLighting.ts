import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

/** GPU-generated radiance has no image to re-upload after WebGL restoration. */
export function installRoomLighting(renderer:T.WebGLRenderer,scene:T.Scene,blur:number){
 let target:T.WebGLRenderTarget|undefined;
 const rebuild=()=>{
  const previous=target?.texture,room=new RoomEnvironment(),generator=new T.PMREMGenerator(renderer);
  target?.dispose();
  try{target=generator.fromScene(room,blur);scene.environment=target.texture;}
  finally{room.dispose();generator.dispose();}
  // Glass/plumbing can explicitly use this map rather than scene.environment.
  if(previous)scene.traverse(object=>{
   if(!(object instanceof T.Mesh))return;
   for(const material of Array.isArray(object.material)?object.material:[object.material]){
    if(material instanceof T.MeshStandardMaterial&&material.envMap===previous){material.envMap=target!.texture;material.needsUpdate=true;}
   }
  });
 };
 rebuild();
 renderer.domElement.addEventListener('webglcontextrestored',rebuild);
}
