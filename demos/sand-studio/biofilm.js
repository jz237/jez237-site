import * as T from '../aquaclear-studio/vendor/three.module.js';
const V=(...p)=>new T.Vector3(...p);
function surface(n,offset=0){const v=n.clone().multiplyScalar(1.18),f=1+Math.sin(v.x*8+v.y*4)*Math.cos(v.z*7)*.047;return V(v.x*f*1.25,2.7+v.y*f*.88,v.z*f).addScaledVector(n,offset);}
export function createBiofilm(parent){
 let seed=19;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const group=new T.Group();parent.add(group);
 const cellmat=new T.MeshStandardMaterial({color:'#c5cfad',roughness:.47,metalness:.02});const cells=new T.InstancedMesh(new T.CapsuleGeometry(.018,.055,3,6),cellmat,420);cells.frustumCulled=false;group.add(cells);const dummy=new T.Object3D(),normals=[];
 const clusters=Array.from({length:18},()=>V(rnd()*2-1,rnd()*2-1,rnd()*2-1).normalize());
 for(let i=0;i<420;i++){const center=clusters[i%18],n=center.clone().add(V(rnd()-.5,rnd()-.5,rnd()-.5).multiplyScalar(.34)).normalize();normals.push(n);dummy.position.copy(surface(n,.03));dummy.quaternion.setFromUnitVectors(V(0,0,1),n);dummy.rotateZ(rnd()*Math.PI*2);dummy.scale.setScalar(.75+rnd()*.5);dummy.updateMatrix();cells.setMatrixAt(i,dummy.matrix);cells.setColorAt(i,new T.Color(i%2?'#b5c8a4':'#d0b6a1'));}
 const strands=new T.Group();group.add(strands);const gel=new T.MeshPhysicalMaterial({color:'#b4c4a1',transparent:true,opacity:.3,roughness:.5,depthWrite:false});
 for(let i=0;i<36;i++){const n=normals[i],m=normals[i+18],points=[];for(let j=0;j<7;j++){const t=j/6,dir=n.clone().lerp(m,t).normalize();points.push(surface(dir,.036+Math.sin(t*Math.PI)*.02));}strands.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),14,.006,4,false),gel));}
 const pulse=new T.Mesh(new T.SphereGeometry(.065,16,12),new T.MeshBasicMaterial({color:'#d0ead0',transparent:true,opacity:.5,depthWrite:false}));group.add(pulse);
 return {render(state,s){group.visible=state.biofilm!==false;cells.count=Math.round(state.maturity*4.2);strands.visible=state.maturity>30;pulse.visible=state.maturity>20&&s.activity>10;pulse.position.copy(surface(V(.2,-.22,.96).normalize(),.06));pulse.scale.setScalar(.8+Math.sin(s.time*2)*.17);pulse.material.opacity=.15+s.activity*.002;return {cells:cells.count,visible:group.visible};}};
}
