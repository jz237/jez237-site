import * as T from 'three';
import {GLTFLoader} from './model-loader';
import {url} from './assets';
let hardware:T.Mesh|undefined;
export async function prepareWheelPresentation(){
 hardware=undefined;
 const gltf=await new GLTFLoader().loadAsync(url('models/wheel-machining.glb'));gltf.scene.updateMatrixWorld(true);
 gltf.scene.traverse(o=>{if(o instanceof T.Mesh&&o.name==='WheelMachining'){hardware=new T.Mesh(o.geometry.clone().applyMatrix4(o.matrixWorld),o.material);hardware.name='detail_wheel_machining';}});
 if(!hardware)throw new Error('Wheel machining asset is missing its authored mesh');
}
export function attachWheelPresentation(root:T.Object3D){
 if(!hardware)return;
 for(const name of ['FL','FR','RL','RR']){
  const wheel=root.getObjectByName('wheel_'+name);if(!wheel)continue;
  const detail=hardware.clone();detail.scale.x=name.endsWith('L')?-1:1;detail.receiveShadow=true;detail.castShadow=false;wheel.add(detail);
 }
}
