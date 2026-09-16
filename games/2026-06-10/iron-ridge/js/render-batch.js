// Merge only rigid, opaque parts within one animation pivot. Moving wheels,
// suspension, turret, recoil, muzzle markers and track instances keep their nodes.
import * as THREE from 'three';
export function batchRigidParts(root, pivots, protectedNodes) {
  root.updateMatrixWorld(true);
  const retired=new Set();
  for(const pivot of pivots) {
    const byMaterial=new Map(), inverse=pivot.matrixWorld.clone().invert();
    function visit(node) {
      if(protectedNodes.has(node))return;
      if(node.isMesh && !node.isInstancedMesh && !Array.isArray(node.material) && !node.material.transparent) {
        const list=byMaterial.get(node.material)||[];list.push(node);byMaterial.set(node.material,list);
      }
      for(const child of node.children)visit(child);
    }
    for(const child of pivot.children)visit(child);
    for(const [material,nodes] of byMaterial) {
      if(nodes.length<2)continue;
      const parts=nodes.map(node=>{
        const geo=node.geometry.index?node.geometry.toNonIndexed():node.geometry.clone();
        geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,node.matrixWorld));
        return geo;
      });
      const count=parts.reduce((n,g)=>n+g.attributes.position.count,0),merged=new THREE.BufferGeometry();
      for(const [name,size] of [['position',3],['normal',3],['uv',2]]) {
        const data=new Float32Array(count*size);let offset=0;
        for(const g of parts) {if(g.attributes[name])data.set(g.attributes[name].array,offset*size);offset+=g.attributes.position.count;}
        merged.setAttribute(name,new THREE.BufferAttribute(data,size));
      }
      for(const node of nodes) {retired.add(node.geometry);node.removeFromParent();}
      for(const g of parts)g.dispose();
      const mesh=new THREE.Mesh(merged,material);mesh.name='batched-armor';mesh.castShadow=true;pivot.add(mesh);
    }
  }
  const retained=new Set();root.traverse(o=>{if(o.geometry)retained.add(o.geometry);});
  for(const g of retired)if(!retained.has(g))g.dispose();
}
