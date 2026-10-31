import * as T from '../aquaclear-studio/vendor/three.module.js';
const V=(...p)=>new T.Vector3(...p);
export function perforatedDistributor(){
 const shape=new T.Shape();shape.absarc(0,0,.94,0,Math.PI*2,false);
 for(let a=0;a<10;a++)for(let j=1;j<6;j++){const phi=a/10*Math.PI*2,r=j*.15,hole=new T.Path();hole.absarc(Math.cos(phi)*r,Math.sin(phi)*r,.024,0,Math.PI*2,true);shape.holes.push(hole);}
 const g=new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:false,curveSegments:8});g.rotateX(-Math.PI/2);return g;
}
export function annulus(outer,inner,height){const s=new T.Shape();s.absarc(0,0,outer,0,Math.PI*2,false);const h=new T.Path();h.absarc(0,0,inner,0,Math.PI*2,true);s.holes.push(h);const g=new T.ExtrudeGeometry(s,{depth:height,bevelEnabled:false,curveSegments:48});g.rotateX(-Math.PI/2);g.translate(0,-height/2,0);return g;}
export function addMechanics(groups,plastic,metal){
 const rotor=new T.Group();rotor.position.set(-1.66,.62,0);groups.pump.add(rotor);const ceramic=new T.MeshStandardMaterial({color:'#bfba96',roughness:.42,metalness:.16});
 const disc=new T.Mesh(new T.CylinderGeometry(.235,.235,.025,48),ceramic);disc.rotation.z=Math.PI/2;rotor.add(disc);
 const hub=new T.Mesh(new T.CylinderGeometry(.067,.067,.09,32),metal);hub.rotation.z=Math.PI/2;hub.position.x=.025;rotor.add(hub);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2,pts=[];for(let j=0;j<7;j++){const r=.075+j*.025,phi=a+j*.065;pts.push(V(.035,Math.cos(phi)*r,Math.sin(phi)*r));}const blade=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),14,.017,5,false),ceramic);rotor.add(blade);}
 const cable=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([V(-2.4,.78,-.12),V(-2.68,.93,-.3),V(-2.7,.48,-.7),V(-2.44,.24,-.94),V(-1.82,.24,-1.13)]),48,.025,8,false),new T.MeshStandardMaterial({color:'#101a1d',roughness:.8}));groups.pump.add(cable);
 // A removable transparent section exposes the rotor without moving the pipework.
 const guard=new T.Mesh(new T.CylinderGeometry(.28,.28,.018,48),new T.MeshPhysicalMaterial({color:'#9ed1da',transparent:true,opacity:.15,roughness:.1,depthWrite:false}));guard.rotation.z=Math.PI/2;guard.position.set(-1.6,.62,0);groups.pump.add(guard);
 const jets=new T.Group();groups.distributor.add(jets);const jetMat=new T.MeshBasicMaterial({color:'#83cbd4',transparent:true,opacity:.2,depthWrite:false});for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const jet=new T.Mesh(new T.CylinderGeometry(.012,.025,.2,6),jetMat);jet.position.set(Math.cos(a)*.45,1.22,Math.sin(a)*.45);jets.add(jet);}
 return {render(state,s){rotor.rotation.x=-s.flowPhase*10;rotor.visible=state.mode==='cutaway'&&state.mechanics;guard.visible=rotor.visible;jets.visible=rotor.visible&&s.velocity>1;jetMat.opacity=.1+s.velocity*.0016;return {rotorAngle:rotor.rotation.x,section:rotor.visible};}};
}
