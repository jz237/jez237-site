import * as T from 'three';
export type Identification={kind:'fish'|'plant'|'invertebrate';name:string;subtitle:string;needs:string;role:string;behavior:string;point:T.Vector3;fishId?:number;coryId?:number;animalId?:number;species?:string};
export const plantFacts:Record<string,[string,string,string,string]>={
 fern:['Fern-like epiphyte','Fern-frond model · representative form','Attachment space, light and dissolved nutrients.','Fronds provide cover and surfaces for biofilms.'],
 moss:['Moss planting','Fine moss shoots · representative form','Light and dissolved nutrients reaching the shoots.','Fine branching traps small particles and provides habitat for tiny animals.'],
 sword:['Amazon sword type','Echinodorus-like rosette · representative model','Root space, mineral nutrients and adequate light.','Broad leaves intercept light; roots anchor the plant and take up nutrients.'],
 anubias:['Anubias type','Thick-leaved rhizome plant · representative model','Gentle current and light; an exposed rhizome rather than a buried growing stem.','Slow-growing leaves and roots provide surfaces for biofilms.'],
 bacopa:['Bacopa type','Rounded-leaf stem plant · representative model','Light reaches the lower shoots; carbon and mineral nutrients support growth.','Upright stems take up nutrients and give small fish cover.'],
 ludwigia:['Ludwigia type','Broad red stem plant · representative model','Adequate light and balanced carbon and nutrients.','Leaf pigments influence color; photosynthesis contributes oxygen in light.'],
 rotala:['Rotala type','Fine red stem plant · representative model','Light, space for new shoots, carbon and mineral nutrients.','Dense branching provides shelter and a large leaf surface.'],
 stem:['Green stem planting','Fine-leaved stem forms · illustrative planting','Light, dissolved carbon, nutrients and circulation.','Leaves exchange substances with the water and shelter small animals.'],
 grass:['Grass-like planting','Narrow-leaf rosette · illustrative planting','Root space, light and nutrients.','Fine leaves shelter small animals and bend with the current.'],
 carpet:['Carpet planting','Low-growing leaf forms · illustrative planting','Light reaching the substrate, nutrients and space to spread.','Low growth covers soil and adds habitat near the bottom.']
};
export function identifyPlant(species:string,point:T.Vector3):Identification{
 const [name,subtitle,needs,role]=plantFacts[species]??plantFacts.stem;
 return {kind:'plant',name,subtitle,needs,role,behavior:'Watch the leaf tips yield to the current while their bases stay anchored.',point:point.clone(),species};
}
type Leaf={mesh:T.Mesh;matrix:T.Matrix4;sphere:T.Sphere;species:string};
/** Broad-phase spheres avoid asking Three.js to raycast every triangle of every leaf. Built once; used only on a deliberate tap. */
export class PlantPicker{
 private leaves:Leaf[]=[];private proxy=new T.Mesh();private point=new T.Vector3();
 constructor(scene:T.Scene){
  scene.traverse(o=>{if(!(o instanceof T.Mesh))return;
   const mats=Array.isArray(o.material)?o.material:[o.material];
   const species=o.userData.plantSpecies||(o.geometry.getAttribute('mossPhase')?'moss':mats.some(m=>m.customProgramCacheKey().includes('scanned-fern-current'))?'fern':null);if(!species)return;
   o.geometry.computeBoundingSphere();const count=o instanceof T.InstancedMesh?o.count:1;
   for(let i=0;i<count;i++){const matrix=new T.Matrix4();if(o instanceof T.InstancedMesh)o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld);this.leaves.push({mesh:o,matrix,sphere:o.geometry.boundingSphere!.clone().applyMatrix4(matrix),species});}
  });this.proxy.matrixAutoUpdate=false;
 }
 pick(ray:T.Raycaster){
  const candidates:{leaf:Leaf;distance:number}[]=[];
  for(const leaf of this.leaves){if(leaf.mesh.visible&&ray.ray.intersectSphere(leaf.sphere,this.point))candidates.push({leaf,distance:ray.ray.origin.distanceTo(this.point)});}
  candidates.sort((a,b)=>a.distance-b.distance);let nearest:T.Intersection|undefined,species='';
  for(const {leaf,distance} of candidates){if(nearest&&distance>nearest.distance)break;
   this.proxy.geometry=leaf.mesh.geometry;this.proxy.material=leaf.mesh.material;this.proxy.matrixWorld.copy(leaf.matrix);
   const hits:T.Intersection[]=[];this.proxy.raycast(ray,hits);for(const hit of hits)if(!nearest||hit.distance<nearest.distance){nearest=hit;species=leaf.species;}
  }
  return nearest?{distance:nearest.distance,info:identifyPlant(species,nearest.point)}:null;
 }
 example(species:string){const leaf=this.leaves.find(l=>l.species===species);return leaf?identifyPlant(species,leaf.sphere.center):null;}
}
/** Move the camera and its orbit center together; fish turns never rotate the viewer. */
export function trackFish(camera:T.PerspectiveCamera,target:T.Vector3,fish:T.Vector3,dt:number){
 const next=target.clone().lerp(fish,1-Math.exp(-Math.max(0,dt)*2.2));camera.position.add(next.clone().sub(target));target.copy(next);
}
