import * as T from 'three';
/** Rain makes the venue ground read wet: road, yard and track surfaces get darker and
 * glossier while it rains and return to their original values afterwards. Materials are
 * matched by mesh name (ground / asphalt / concrete / road / dirt / track / floor / mud). */
const SURFACE=/ground|asphalt|concrete|road|dirt|track|floor|mud/i;
type Saved={roughness:number;color:T.Color};
const saved=new WeakMap<T.MeshStandardMaterial,Saved>();
export function applyWetLook(root:T.Object3D|undefined,wet:boolean){
 let touched=0;if(!root)return touched;
 root.traverse(o=>{
  if(!(o instanceof T.Mesh)||!SURFACE.test(o.name))return;
  for(const m of Array.isArray(o.material)?o.material:[o.material]){
   if(!(m instanceof T.MeshStandardMaterial))continue;
   let s=saved.get(m);if(!s){s={roughness:m.roughness,color:m.color.clone()};saved.set(m,s);}
   if(wet){m.roughness=Math.max(.18,s.roughness*.5);m.color.copy(s.color).multiplyScalar(.78);}else{m.roughness=s.roughness;m.color.copy(s.color);}
   touched++;
  }
 });
 return touched;
}
