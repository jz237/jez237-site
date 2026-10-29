import * as T from '../aquaclear-studio/vendor/three.module.js';

// Original molded/sealed construction detail, not measured product CAD.
export function roundedBox(w,h,d,r=Math.min(w,h,d)*.15){
 const x=w/2-r,y=h/2-r,s=new T.Shape();
 s.moveTo(-x,-h/2);s.lineTo(x,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-y);s.lineTo(w/2,y);s.quadraticCurveTo(w/2,h/2,x,h/2);s.lineTo(-x,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,y);s.lineTo(-w/2,-y);s.quadraticCurveTo(-w/2,-h/2,-x,-h/2);
 const g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSize:r*.45,bevelThickness:r,bevelSegments:3,curveSegments:6});g.translate(0,0,-d/2+r);return g;
}
export function refineConstruction({parts,rotorSpin,pumpSection,black,rim,rubber,steel,padBody}){
 const group=id=>parts.get(id).object;
 const soft=new T.MeshPhysicalMaterial({color:'#aabbb5',roughness:.43,clearcoat:.23});
 function add(parent,g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function seal(parent,points,r=.018){return add(parent,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,6,false),rubber,0,0,0);}
 // Narrow silicone fillets follow the acrylic seams, rather than dark broad bars.
 for(const x of [-4.16,4.16])seal(group('sump'),[[x,.13,-1.55],[x,.13,0],[x,.13,1.55]]);
 seal(group('sump'),[[-4.12,.13,-1.55],[0,.13,-1.55],[4.12,.13,-1.55]]);
 for(const x of [-4.16,4.16])seal(group('sump'),[[x,.15,-1.55],[x,1.5,-1.55],[x,3.02,-1.55]],.012);
 for(const x of [-.25,.24,.74])for(const z of [-1.51,1.51])seal(group('baffles'),[[x,.45,z],[x,.8,z],[x,1.16,z]],.012);
 for(const p of [group('sump'),group('pump')])for(const o of p.children){const q=o.geometry?.parameters;if(o.isMesh&&o.geometry.type==='BoxGeometry'&&((q.width===8.65)||(q.width===.85))){o.geometry.dispose();o.geometry=roundedBox(q.width,q.height,q.depth,Math.min(.06,q.height*.25));}}
 function screw(parent,x,y,z){const a=add(parent,new T.CylinderGeometry(.035,.035,.018,16),steel,x,y,z);a.rotation.x=Math.PI/2;add(parent,new T.BoxGeometry(.044,.006,.004),rubber,x,y,z+.011);}
 for(const x of [-3.91,-.79])for(const y of [1.52,4.5])screw(group('tower'),x,y,1.42);
 for(const x of [-3.84,-.86]){add(group('tray'),roundedBox(.14,.19,.12,.025),rim,x,4.33,1.42);screw(group('tray'),x,4.34,1.49);}
 // Pump section: curved vanes, rotor magnet, shaft, seals and open outlet bore.
 for(const g of rotorSpin.children.filter(o=>o.isGroup)){const old=g.children[0];old.geometry.dispose();const s=new T.Shape();s.moveTo(.055,-.018);s.quadraticCurveTo(.16,-.055,.272,.032);s.lineTo(.260,.070);s.quadraticCurveTo(.15,-.010,.055,.018);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:.09,bevelEnabled:true,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:12});old.geometry=geo;old.position.set(0,0,.025);old.material=soft;}
 const magnet=add(rotorSpin,new T.CylinderGeometry(.13,.13,.31,32),black,0,0,-.17);magnet.rotation.x=Math.PI/2;
 const shaft=add(rotorSpin,new T.CylinderGeometry(.027,.027,.68,20),new T.MeshStandardMaterial({color:'#d8d9c4',roughness:.6}),0,0,-.02);shaft.rotation.x=Math.PI/2;
 add(pumpSection,new T.TorusGeometry(.34,.014,8,48),rubber,2.65,.50,.025);
 for(const [id,pos,tangent,r] of [['nozzle',[2.78,6.25,.3],[-.17,-.28,0],.108],['drain',[-2.57,4.55,-.1],[0,-1,0],.123]]){const n=new T.Vector3(...tangent).normalize(),ring=add(group(id),new T.TorusGeometry(r,.022,10,40),rim,...pos);ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),n);const bore=add(group(id),new T.CylinderGeometry(r-.013,r-.013,.13,32,1,true),new T.MeshStandardMaterial({color:'#354c50',roughness:.4,side:T.DoubleSide}),...pos);bore.position.addScaledVector(n,-.065);bore.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);}
 // Actual deposits remain on the upstream pad face; clean vs loaded is visible.
 const deposits=new T.InstancedMesh(new T.IcosahedronGeometry(.015,0),new T.MeshStandardMaterial({color:'#604a2b',roughness:1}),520),o=new T.Object3D();deposits.name='pad-deposits';group('pad').add(deposits);let seed=417;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<520;i++){o.position.set(-3.82+rnd()*2.94,4.524+rnd()*.012,-1.21+rnd()*2.42);o.rotation.set(rnd()*6,rnd()*6,rnd()*6);o.scale.set(.4+rnd()*1.2,.2+rnd()*.5,.4+rnd()*1.3);o.updateMatrix();deposits.setMatrixAt(i,o.matrix);}deposits.castShadow=true;
 return {update(state){deposits.count=state.blocked?520:28;},snapshot:()=>({deposits:deposits.count,curvedVanes:6,openTowerBase:true})};
}
