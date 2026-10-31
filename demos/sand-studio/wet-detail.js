import * as T from '../aquaclear-studio/vendor/three.module.js';
export function createWetDetails(parent){
 const group=new T.Group();parent.add(group);const rings=[];
 for(let i=0;i<5;i++){const m=new T.Mesh(new T.TorusGeometry(1,.012,5,72),new T.MeshBasicMaterial({color:'#b5e2dc',transparent:true,opacity:.15,depthWrite:false}));m.rotation.x=Math.PI/2;m.position.set(2.05,.817,0);group.add(m);rings.push(m);}
 const drops=new T.InstancedMesh(new T.SphereGeometry(.012,6,5),new T.MeshPhysicalMaterial({color:'#abdadd',roughness:.05,metalness:.15,transparent:true,opacity:.5}),24);drops.frustumCulled=false;group.add(drops);const o=new T.Object3D();
 return {render(state,s){group.visible=state.mode!=='macro'&&state.explode<.05&&s.velocity>1;for(let i=0;i<rings.length;i++){const t=(s.time*.7+i/5)%1,r=.035+t*.43;rings[i].scale.setScalar(r);rings[i].material.opacity=(1-t)*.2*Math.min(1,s.velocity/50);}for(let i=0;i<24;i++){const t=(s.time*(.8+i*.015)+i/24)%1,a=i*2.4;o.position.set(2.05+Math.cos(a)*t*.2,.815+Math.sin(t*Math.PI)*.075,Math.sin(a)*t*.2);o.scale.set(1,.7,1);o.updateMatrix();drops.setMatrixAt(i,o.matrix);}drops.instanceMatrix.needsUpdate=true;return {visible:group.visible,time:s.time};}};
}
