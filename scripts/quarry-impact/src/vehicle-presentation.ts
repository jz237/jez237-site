import * as T from 'three';

/** Calibrated dielectric paint/glazing and brushed wheel hardware. Original
 * geometry and the wear, dirt, transfer-paint and fracture shaders stay intact. */
export function finishVehiclePresentation(root:T.Object3D){
 const tuned=new Set<T.Material>();
 root.traverse(o=>{
  if(!(o instanceof T.Mesh))return;
  const m=o.material as T.MeshPhysicalMaterial;if(tuned.has(m))return;tuned.add(m);
  const name=m.name;
  if(/Rim|Wheel|Chrome|Exhaust|Hub|metal|alloy/i.test(name)&&!/Tire|paint|Interior|galvanized|cast alloy/i.test(name)){
   m.metalness=.88;m.roughness=.30;m.color.lerp(new T.Color(0x9da4a6),.40);m.envMapIntensity=1.0;
  }
  if(name.startsWith('Interior')){m.color.multiplyScalar(1.14);m.metalness=0;m.roughness=Math.max(.76,m.roughness);}
  if(name.includes('Tire')){m.color.setHex(0x363834);m.roughness=.86;m.metalness=0;}
  if(name.includes('Brakelight'))m.roughness=.19;
  if(name.includes('Headlight'))m.roughness=.17;
 });
}
