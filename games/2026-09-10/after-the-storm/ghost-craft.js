// Display-only copy of the existing detailed craft. No physics, collision,
// spray, wake, progress or shadow is added by a time-trial ghost.
import * as T from './vendor/three.module.js';
function displayCopy(source,recursive=false){
 // Three's clone JSON-copies userData. The live craft's LOD cache contains
 // large geometry graphs; a visual ghost must share GPU geometry, not serialize
 // that runtime cache. Restore the source synchronously even if cloning fails.
 const metadata=source.userData;let copy;
 try{source.userData={};copy=source.clone(false);}finally{source.userData=metadata;}
 if(recursive)for(const child of source.children)copy.add(displayCopy(child,true));
 return copy;
}
export function makeGhostCraft(scene,source){
 const root=displayCopy(source.boat,true),materials=new Map();
 const body=root.children[source.boat.children.indexOf(source.body)];
 if(body)body.rotation.set(0,0,0);
 root.name='Time trial ghost';root.visible=false;root.userData.skipRefraction=true;
 root.traverse(o=>{
  o.castShadow=false;o.receiveShadow=false;o.userData.skipRefraction=true;
  if(!o.isMesh)return;
  const tint=material=>{
   if(!materials.has(material)){
    const m=displayCopy(material);if(m.color)m.color.setHex(0x76e8ee);
    if(m.emissive){m.emissive.setHex(0x164c54);m.emissiveIntensity=.45;}
    m.transparent=true;m.opacity=.25;m.depthWrite=false;
    materials.set(material,m);
   }
   return materials.get(material);
  };
  o.material=Array.isArray(o.material)?o.material.map(tint):tint(o.material);
  o.renderOrder=5;
 });
 scene.add(root);
 return {root,show(pose){
  root.visible=!!pose;if(!pose)return;
  root.position.set(pose.x,pose.hydro.y,pose.z);
  root.rotation.set(pose.hydro.pitch,pose.heading,pose.hydro.roll,'YXZ');
 },dispose(){root.removeFromParent();for(const m of materials.values())m.dispose();}};
}
