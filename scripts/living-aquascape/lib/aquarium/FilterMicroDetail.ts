import * as T from 'three';
/** Close-range geometry uses instancing so repeated pores, fibers and machining marks stay inexpensive. */
export function addFilterMicroDetail(groups:T.Group[],rotor:T.Group,metal:T.MeshStandardMaterial,rubber:T.MeshStandardMaterial){
 let seed=7249;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const dummy=new T.Object3D(),axis=new T.Vector3(0,1,0);
 const batch=(geo:T.BufferGeometry,mat:T.Material,count:number,g:T.Group,place:(i:number,o:T.Object3D)=>void)=>{const mesh=new T.InstancedMesh(geo,mat,count);for(let i=0;i<count;i++){dummy.position.set(0,0,0);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);place(i,dummy);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);}mesh.instanceMatrix.needsUpdate=true;g.add(mesh);return mesh;};
 const pore=new T.MeshStandardMaterial({color:0x030706,roughness:1,side:T.DoubleSide});
 for(const [id,y,count] of [[1,.78,1800],[2,1.45,2400]]){
  // Uneven open cells on the sidewall and top face, not a flat speckle color map.
  batch(new T.CircleGeometry(1,7),pore,count,groups[id],(i,o)=>{const r=id===1?.013+rnd()*.018:.007+rnd()*.012;
   if(i<count*.75){const a=rnd()*Math.PI*2;o.position.set(Math.sin(a)*1.063,y+(rnd()-.5)*.425,Math.cos(a)*1.063);o.rotation.y=a;}
   else{const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*1.045;o.position.set(Math.cos(a)*d,y+.222,Math.sin(a)*d);o.rotation.x=-Math.PI/2;}
   o.scale.set(r,r*(.6+rnd()*.7),1);});
  const struts=new T.MeshStandardMaterial({color:id===1?0x38413c:0x4c6460,roughness:.95});
  batch(new T.CylinderGeometry(.0035,.004,1,5),struts,600,groups[id],(_,o)=>{const a=rnd()*Math.PI*2;o.position.set(Math.sin(a)*1.065,y+(rnd()-.5)*.42,Math.cos(a)*1.065);o.rotation.set(rnd()*.8,0,rnd()*Math.PI);o.scale.y=.012+rnd()*.023;});
 }
 const fiber=new T.MeshStandardMaterial({color:0xbcb9a8,roughness:1});
 batch(new T.CylinderGeometry(.0018,.0025,1,4),fiber,2200,groups[4],(_,o)=>{const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*1.06;o.position.set(Math.cos(a)*d,3.274+rnd()*.012,Math.sin(a)*d);o.rotation.set(Math.PI/2+(rnd()-.5)*.4,rnd()*Math.PI,0);o.scale.y=.018+rnd()*.065;});
 // Layers of laminated steel around the stator, ceramic shaft bushings and retaining washers.
 for(let j=0;j<19;j++){const m=new T.Mesh(new T.TorusGeometry(.94,.014,6,64),j%3?metal:rubber);m.rotation.x=Math.PI/2;m.position.y=4.02+j*.020;groups[7].add(m);}
 for(const y of [3.73,4.58]){const b=new T.Mesh(new T.CylinderGeometry(.13,.13,.095,24),rubber);b.position.y=y;groups[6].add(b);const washer=new T.Mesh(new T.TorusGeometry(.085,.02,8,32),metal);washer.rotation.x=Math.PI/2;washer.position.y=y+.06;groups[6].add(washer);}
 // Swept impeller vanes replace the seven rectangular paddle blocks.
 for(const child of [...rotor.children])if(child instanceof T.Mesh&&child.geometry instanceof T.BoxGeometry){rotor.remove(child);child.geometry.dispose();}
 const vane=new T.Shape();vane.moveTo(.14,0);vane.quadraticCurveTo(.33,-.04,.47,.16);vane.lineTo(.44,.18);vane.quadraticCurveTo(.30,0,.14,.035);vane.closePath();
 const vaneGeo=new T.ExtrudeGeometry(vane,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.008,bevelThickness:.008,curveSegments:16});
 const polymer=new T.MeshStandardMaterial({color:0x293334,roughness:.44,metalness:.15});
 for(let j=0;j<7;j++){const g=new T.Group(),blade=new T.Mesh(vaneGeo,polymer);blade.rotation.x=-Math.PI/2;g.rotation.y=j/7*Math.PI*2;g.position.y=-.21;g.add(blade);rotor.add(g);}
 // Helical threads and knurled collars at both valve couplings.
 for(const x of [-.55,.55]){const points=[];for(let j=0;j<=360;j++){const a=j/360*Math.PI*2*9;points.push(new T.Vector3(x+Math.cos(a)*.205,4.82+j/360*.36,Math.sin(a)*.205));}const helix=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),360,.006,5,false),metal);groups[8].add(helix);
  batch(new T.BoxGeometry(.008,.085,.008),metal,64,groups[8],(j,o)=>{const a=j/64*Math.PI*2;o.position.set(x+Math.cos(a)*.255,4.8,Math.sin(a)*.255);o.rotation.y=-a;});
  const washer=new T.Mesh(new T.TorusGeometry(.23,.025,10,48),rubber);washer.rotation.x=Math.PI/2;washer.position.set(x,4.67,0);groups[8].add(washer);
 }
 // Stitch-like weld texture on the rolled rims, and fastener seats at the base.
 batch(new T.SphereGeometry(.013,6,4),metal,280,groups[0],(j,o)=>{const a=.65+j/279*Math.PI*1.35;o.position.set(Math.sin(a)*1.396,3.45,Math.cos(a)*1.396);o.scale.set(1,.4,1);});
 // Strainer cage ribs, with open slots and reinforced rims.
 batch(new T.BoxGeometry(.015,.62,.013),rubber,22,groups[9],(j,o)=>{const a=j/22*Math.PI*2;o.position.set(-2.8+Math.cos(a)*.213,3.66,Math.sin(a)*.213);o.rotation.y=-a;});
 for(const [id,y] of [[1,.78],[2,1.45],[3,2.19],[4,3.05]]){for(const x of [-.8,.8]){const handle=new T.Mesh(new T.TorusGeometry(.12,.016,8,28,Math.PI),rubber);handle.position.set(x,y+.30,0);groups[id].add(handle);}}
}
