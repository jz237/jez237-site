import * as T from 'three';
import {hollowTube} from './HollowTube';
const V=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);

/** Hollow glass intake and flared return, tucked into the rear-right corner. */
export function buildAquariumPlumbing(scene:T.Scene){
 const glass=new T.MeshPhysicalMaterial({color:0xe5f0e9,transparent:true,opacity:1,transmission:.96,thickness:.022,ior:1.5,roughness:.025,metalness:0,depthWrite:false,envMap:scene.environment,envMapIntensity:.4});
 const add=(g:T.BufferGeometry,p=V(0,0,0))=>{const mesh=new T.Mesh(g,glass);mesh.position.copy(p);scene.add(mesh);return mesh;};
 const intake=new T.CatmullRomCurve3([V(4.77,3.5,-2.64),V(4.77,5.6,-2.64),V(4.77,5.87,-2.48),V(4.77,5.82,-2.08),V(4.77,5.3,-2.02),V(4.77,1.48,-2.02)]);
 const outlet=new T.CatmullRomCurve3([V(4.4,3.5,-2.64),V(4.4,5.6,-2.64),V(4.4,5.87,-2.48),V(4.4,5.82,-2.08),V(4.4,5.25,-1.98),V(4.23,4.97,-1.80),V(3.93,4.99,-1.57)]);
 add(hollowTube(intake,()=>.075));
 const length=outlet.getLength();
 const radius=(t:number)=>.075+.18*(1-T.MathUtils.smoothstep((1-t)*length,0,.42));
 add(hollowTube(outlet,radius,.011,128));
 // Rolled lip frames an actual open outlet, with no face closing the center.
 const lip=add(new T.TorusGeometry(radius(1)-.0055,.0055,8,48),outlet.getPointAt(1));
 lip.quaternion.setFromUnitVectors(V(0,0,1),outlet.getTangentAt(1));
 // Small suction-cup mounts tie the necks to the rear glass.
 for(const [x,y,z] of [[4.77,3.55,-2.02],[4.4,5.3,-2.0]]){
  const cup=add(new T.LatheGeometry([new T.Vector2(.015,.065),new T.Vector2(.034,.05),new T.Vector2(.072,.014),new T.Vector2(.106,0)],32),V(x,y,-2.323));
  cup.rotation.x=Math.PI/2;
  const stem=add(new T.CylinderGeometry(.012,.012,z+2.258,12),V(x,y,(-2.258+z)*.5));stem.rotation.x=Math.PI/2;
  const clip=add(new T.TorusGeometry(.077,.009,8,24),V(x,y,z));clip.rotation.x=Math.PI/2;
 }
 // Open slots around the intake admit water through a modeled glass cage.
 for(const y of [1.08,1.46]){
  const ring=add(new T.TorusGeometry(.091,.012,8,32),V(4.77,y,-2.02));ring.rotation.x=Math.PI/2;
 }
 for(let i=0;i<12;i++){
  const a=i*Math.PI/6;
  add(new T.CylinderGeometry(.008,.008,.38,6),V(4.77+Math.cos(a)*.091,1.27,-2.02+Math.sin(a)*.091));
 }
 add(new T.SphereGeometry(.10,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),V(4.77,1.08,-2.02));
}
