import * as T from '../aquaclear-studio/vendor/three.module.js';
import {outletActive,padLoading,transport} from './dynamics.js?v=3';
const V=(...a)=>new T.Vector3(...a),clamp=T.MathUtils.clamp,TAU=Math.PI*2;
export function createSurfaceWater({group,parts}){
 const mat=new T.MeshPhysicalMaterial({color:'#a8e1df',roughness:.055,metalness:.08,transparent:true,opacity:.62,depthWrite:false,clearcoat:1,side:T.DoubleSide});
 const o=new T.Object3D(),up=V(0,1,0);
 const pendants=new T.InstancedMesh(new T.SphereGeometry(1,12,8),mat,63);pendants.name='tray-pendant-drops';group.add(pendants);
 const lips=new T.InstancedMesh(new T.TorusGeometry(.043,.006,6,20),mat,63);lips.name='wet-outlet-rims';group.add(lips);
 const necks=new T.InstancedMesh(new T.CylinderGeometry(.010,.017,1,8),mat,63);group.add(necks);
 const threads=new T.InstancedMesh(new T.CylinderGeometry(.008,.012,1,8),mat,63);threads.name='breaking-water-threads';group.add(threads);
 const pooling=new T.Mesh(new T.PlaneGeometry(2.96,2.48,32,24),mat.clone());pooling.rotation.x=-Math.PI/2;pooling.position.set(-2.35,4.54,0);pooling.material.opacity=.32;group.add(pooling);
 const bypassLip=new T.Mesh(new T.PlaneGeometry(.47,.42,14,20),mat.clone());bypassLip.material.opacity=.48;group.add(bypassLip);
 // Eight independent tongues pass through gaps between the nine actual teeth.
 const tongues=[];for(let i=0;i<8;i++){const m=new T.Mesh(new T.PlaneGeometry(.038,.18,4,16),mat);group.add(m);tongues.push(m);}
 const points=[[-.83,5.9,-.1],[-.83,5.3,-.1],[-1.05,5.08,-.1],[-2.35,5.08,-.1],[-2.57,4.92,-.1],[-2.57,4.55,-.1]];
 const curve=new T.CatmullRomCurve3(points.map(p=>V(...p)),false,'centripetal');
 const core=new T.Mesh(new T.TubeGeometry(curve,80,.09,12,false),mat.clone());core.material.opacity=.32;group.add(core);
 const air=new T.InstancedMesh(new T.SphereGeometry(.024,10,6),mat.clone(),36);air.material.opacity=.72;air.name='drain-entrained-air';group.add(air);
 const overflowPool=new T.Mesh(new T.PlaneGeometry(.73,.65,24,20),mat.clone());overflowPool.rotation.x=-Math.PI/2;overflowPool.position.set(-.83,5.945,-.10);overflowPool.material.opacity=.30;group.add(overflowPool);
 const mouth=new T.Mesh(new T.TorusGeometry(.125,.012,8,48),mat);mouth.rotation.x=Math.PI/2;mouth.position.set(-.83,5.93,-.1);group.add(mouth);
 const drainTube=parts.get('drain').object.children.find(o=>o.geometry?.type==='TubeGeometry');const opaque=drainTube.material,section=opaque.clone();section.transparent=true;section.opacity=.16;section.depthWrite=false;
 const overflowFront=parts.get('overflow').object.children.find(o=>o.position.z===.31&&o.geometry?.type==='BoxGeometry');
 const returnCurve=new T.CatmullRomCurve3([[2.65,.78,.3],[2.65,1.03,.3],[3.50,1.13,.3],[3.64,1.35,.3],[3.64,6.66,.3],[3.37,6.82,.3],[3.12,6.80,.3],[2.78,6.25,.3]].map(p=>V(...p)),false,'centripetal');
 const charge=new T.Mesh(new T.TubeGeometry(returnCurve,96,.085,10,false),mat);charge.name='return-line-charge';group.add(charge);
 const returnTube=parts.get('return').object.children.find(o=>o.geometry?.type==='TubeGeometry'),returnOpaque=returnTube.material,returnGhost=returnOpaque.clone();returnGhost.transparent=true;returnGhost.opacity=.12;returnGhost.depthWrite=false;
 const plume=new T.Mesh(new T.ConeGeometry(.14,.68,20,1,true),mat.clone());plume.material.opacity=.22;plume.position.set(2.61,6,.3);plume.quaternion.setFromUnitVectors(up,V(.5,.86,0).normalize());group.add(plume);
 let last={};
 function update(s,h){
  const t=transport(s,h),load=padLoading(s),clock=s.flowTime??s.time,active=group.visible,wet=t.tray>.002;
  const close=(s.mode==='overflow'||s.tour===1)&&active;
  drainTube.material=close?section:opaque;if(overflowFront)overflowFront.visible=!close;
  const filling=active&&s.mode==='flow'&&s.power&&h.running&&(s.runAge??20)<1.4;
  returnTube.material=filling?returnGhost:returnOpaque;charge.visible=filling;charge.geometry.setDrawRange(0,Math.floor(clamp((s.runAge??20)/1.4,0,1)*96)*60);
  let hanging=0;
  for(let i=0;i<63;i++){
   const x=-3.705+i%9*.338,z=-1.1+Math.floor(i/9)*.366,phase=(clock*(.75+(i%7)*.055)+i*.618)%1;
   const enabled=wet&&outletActive(i,load)&&phase<clamp(t.tray*2.7,0,1),growth=clamp(phase/.78,0,1),r=.009+growth*.028,detach=phase>.78;
   o.position.set(x,4.122-r*(detach?1.8:1),z);o.rotation.set(0,0,0);o.scale.set(r,r*(1+growth*.6),r);if(!enabled||detach)o.scale.setScalar(.00001);else hanging++;o.updateMatrix();pendants.setMatrixAt(i,o.matrix);
   o.position.set(x,4.126,z);o.rotation.set(Math.PI/2,0,0);o.scale.setScalar(enabled?1:.00001);o.updateMatrix();lips.setMatrixAt(i,o.matrix);
   const len=.012+growth*.045;o.position.set(x,4.13-len/2,z);o.rotation.set(0,0,0);o.scale.set(1-growth*.58,len,1-growth*.58);if(!enabled||detach)o.scale.setScalar(.00001);o.updateMatrix();necks.setMatrixAt(i,o.matrix);
   const falling=(phase-.78)/.22,distance=.03+Math.max(0,falling)**2*.22;o.position.set(x,4.10-distance,z);o.scale.set(.65,.035+Math.max(0,falling)*.045,.65);if(!enabled||!detach)o.scale.setScalar(.00001);o.updateMatrix();threads.setMatrixAt(i,o.matrix);
  }
  for(const m of [pendants,lips,necks,threads]){m.visible=wet;m.instanceMatrix.needsUpdate=true;}
  pooling.visible=wet&&load>.04&&parts.get('pad').object.visible;pooling.position.y=4.54+load*.095;
  const pa=pooling.geometry.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),z=pa.getY(i),r=Math.hypot(x+.22,z-.1);pa.setZ(i,Math.sin(r*22-clock*8)*Math.exp(-r*1.6)*.004);}pa.needsUpdate=true;pooling.geometry.computeVertexNormals();
  const ba=bypassLip.geometry.attributes.position,bu=bypassLip.geometry.attributes.uv;for(let i=0;i<ba.count;i++){const u=bu.getX(i),v=1-bu.getY(i);ba.setXYZ(i,-.94+v*.34,4.54+load*.095-v*v*.32,-1.15+(u-.5)*.32);}ba.needsUpdate=true;bypassLip.geometry.computeVertexNormals();bypassLip.visible=wet&&load>.35;
  for(let k=0;k<tongues.length;k++){const m=tongues[k],a=m.geometry.attributes.position,uv=m.geometry.attributes.uv;for(let i=0;i<a.count;i++){const u=uv.getX(i),v=1-uv.getY(i);a.setXYZ(i,-1.1375+k*.085+(u-.5)*(.038+v*.008),h.displayLevel-v*.16,.35-v*.09+Math.sin(clock*7+k+v*8)*.003);}a.needsUpdate=true;m.geometry.computeVertexNormals();m.visible=t.drain>.003&&h.displayLevel>6.40;}
  core.visible=air.visible=mouth.visible=overflowPool.visible=close&&t.drain>.003;const poolPositions=overflowPool.geometry.attributes.position;for(let i=0;i<poolPositions.count;i++){const x=poolPositions.getX(i),y=poolPositions.getY(i),r=Math.hypot(x,y);poolPositions.setZ(i,Math.sin(r*35-clock*7)*.004-.018*Math.exp(-r*18));}poolPositions.needsUpdate=true;overflowPool.geometry.computeVertexNormals();core.geometry.setDrawRange(0,Math.floor(clamp(((s.runAge??20)-3.35)/.9,0,1)*80)*72);
  if(!s.power)core.geometry.setDrawRange(0,Infinity);
  for(let i=0;i<36;i++){const age=(clock*.40+i*.618)%1,p=curve.getPointAt(age);o.position.copy(p).add(V(Math.sin(i*4+clock)*.035,0,Math.cos(i*3)*.035));o.quaternion.setFromUnitVectors(up,curve.getTangentAt(age));o.scale.set(.45+(i%4)*.14,1.2,.6);o.updateMatrix();air.setMatrixAt(i,o.matrix);}air.instanceMatrix.needsUpdate=true;mouth.scale.setScalar(.95+Math.sin(clock*9)*.04);
  plume.visible=active&&t.returning>.02&&(s.runAge??20)>1.4;plume.scale.setScalar(.7+t.returning*.3);plume.material.opacity=.16+Math.sin(clock*7)*.035;
  last={...t,loading:load,hangingDrops:active?hanging:0,poolAbovePad:active&&pooling.visible,overflowSection:close,airBubbles:air.visible?36:0,lineFilling:filling};
 }
 return {update,snapshot:()=>last};
}
