import * as T from './vendor/three.module.js';
const TAU=Math.PI*2;
// World units are illustrative. The water-level control maps the manual's 0–38 mm
// range onto this approximate reconstruction; it is not a calibrated CAD scale.
export const waterY=mm=>3.02-Math.max(0,Math.min(38,mm))*.021;
export function buildWater(){
  const group=new T.Group(), dummy=new T.Object3D();
  const material=new T.MeshPhysicalMaterial({color:'#70a3aa',roughness:.065,metalness:0,ior:1.333,transmission:0,thickness:.14,transparent:true,opacity:.24,side:T.DoubleSide,depthWrite:false,clearcoat:1,clearcoatRoughness:.055});
  const surface=new T.Mesh(new T.PlaneGeometry(7,4.5,88,62),material);
  surface.rotation.x=-Math.PI/2;surface.position.set(0,waterY(26),4.25);surface.receiveShadow=true;group.add(surface);
  surface.material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>', 'diffuseColor.a *= 0.25 + 0.75 * pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);\n#include <opaque_fragment>');};
  const sheet=new T.Mesh(new T.PlaneGeometry(2.65,1,64,40),material.clone());group.add(sheet);
  const bubbles=new T.InstancedMesh(new T.SphereGeometry(.018,8,6),new T.MeshPhysicalMaterial({color:'#d6ece7',roughness:.15,metalness:0,transparent:true,opacity:.38,depthWrite:false}),70);group.add(bubbles);
  const splash=new T.InstancedMesh(new T.SphereGeometry(.014,6,4),material.clone(),44);group.add(splash);
  const baseline=surface.geometry.attributes.position.array.slice();
  const mark=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(2.17,waterY(38),2.01),new T.Vector3(3.3,waterY(38),2.01)]),new T.LineDashedMaterial({color:'#d8b388',dashSize:.075,gapSize:.045,transparent:true,opacity:.8}));mark.computeLineDistances();group.add(mark);
  let last={};
  function update(time,delivery,mm,running){
    group.visible=running;if(!running)return;
    const level=waterY(mm),drop=3.10-level,reach=.13+Math.sqrt(drop)*.34,impactZ=2.29+reach;
    surface.position.y=level;
    const p=sheet.geometry.attributes.position;
    for(let i=0;i<p.count;i++){
      const u=sheet.geometry.attributes.uv.getX(i),t=1-sheet.geometry.attributes.uv.getY(i),free=Math.max(0,(t-.38)/.62);
      const width=2.65*(1-free*.025)*(1-(1-delivery)*.12);
      const x=.55+(u-.5)*width;
      const flutter=(Math.sin(u*71-time*9+free*19)*.006+Math.sin(u*119+time*7)*.003)*free;
      const y=t<.38?3.23-(t/.38)*.13:3.10-drop*free*free;
      const z=t<.38?1.30+t/.38*.99:2.29+reach*free;
      p.setXYZ(i,x,y+flutter,z+flutter*.45);
    }
    p.needsUpdate=true;sheet.geometry.computeVertexNormals();sheet.geometry.computeBoundingSphere();
    const a=surface.geometry.attributes.position;
    for(let i=0;i<a.count;i++){
      const x=baseline[i*3],y=baseline[i*3+1],z=4.25-y;
      // Several overlapping wave fronts from a broad impact zone, not flat ring sprites.
      let waves=0;
      for(let k=0;k<3;k++){const dx=x-(.55+(k-1)*.73),dz=z-impactZ,r=Math.hypot(dx,dz*1.12);waves+=Math.sin(r*18-time*5.2+k)*Math.exp(-r*1.65)*.012*delivery;}
      const ambient=Math.sin(x*3+z*2.4-time*.8)*.0035+Math.sin(x*8.6-z*3.7+time*1.4)*.002;
      a.setZ(i,ambient+waves);
    }
    a.needsUpdate=true;surface.geometry.computeVertexNormals();
    for(let i=0;i<70;i++){
      const age=(time*(.26+((i*13)%11)*.015)+i*.618)%1;
      dummy.position.set(.55+Math.sin(i*19.7)*1.19+Math.sin(age*3+i)*.055,level-.012-Math.sin(age*Math.PI)*.055,impactZ+.03+age*.7);
      const r=(.45+((i*7)%9)/9)*Math.sin(age*Math.PI)*delivery;dummy.scale.setScalar(Math.max(.001,r));dummy.updateMatrix();bubbles.setMatrixAt(i,dummy.matrix);
    }bubbles.instanceMatrix.needsUpdate=true;
    for(let i=0;i<44;i++){
      const age=(time*.65+i*.618)%1,arc=Math.sin(age*Math.PI)*Math.min(.12,drop*.18)*delivery;
      dummy.position.set(.55+Math.sin(i*13.9)*1.2+Math.cos(i)*age*.1,level+arc,impactZ+age*.17);
      dummy.scale.set(.45,.7,.45);dummy.updateMatrix();splash.setMatrixAt(i,dummy.matrix);
    }splash.instanceMatrix.needsUpdate=true;splash.visible=drop>.25;
    last={level,drop,impactZ,sheetEndY:p.getY(p.count-1),delivery};
  }
  return {group,surface,sheet,update,snapshot:()=>last};
}

export function buildDebris(foam){
  const group=new T.Group(),dummy=new T.Object3D();
  const material=new T.MeshStandardMaterial({color:'#907653',roughness:.96});
  const dirt=new T.InstancedMesh(new T.IcosahedronGeometry(.026,0),material,320);foam.add(dirt);dirt.receiveShadow=true;
  const moving=new T.InstancedMesh(new T.IcosahedronGeometry(.022,0),material.clone(),52);group.add(moving);
  let last={};
  function update(time,loaded,visible,delivery,showDeposits=true){
    group.visible=visible;dirt.visible=showDeposits;const depositCount=loaded?300:24;dirt.count=depositCount;
    for(let i=0;i<depositCount;i++){
      const x=-.72+((i*.61803398875)%1)*2.56,z=-.98+((i*.41421356)%1)*1.91;
      dummy.position.set(x,.594+((i*7)%9)*.001,z);dummy.rotation.set(i*1.2,i*.7,i*.3);dummy.scale.set(1+(i%4)*.15,.34,.7);dummy.updateMatrix();dirt.setMatrixAt(i,dummy.matrix);
    }dirt.instanceMatrix.needsUpdate=true;dirt.computeBoundingBox();dirt.computeBoundingSphere();
    for(let i=0;i<52;i++){
      const age=(time*.13*delivery+i/52)%1,x=-.72+((i*.618)%1)*2.52,z=-.95+((i*.414)%1)*1.85;
      // Particles approach the upstream underside, stop there, then reset outside
      // the view. They never pass through the foam or masquerade as dissolved waste.
      const travel=Math.min(age/.72,1);
      dummy.position.set(x,.31+travel*.279,z);dummy.rotation.set(time*.1+i,i,0);dummy.scale.setScalar(age>.94?.001:1);dummy.updateMatrix();moving.setMatrixAt(i,dummy.matrix);
    }moving.instanceMatrix.needsUpdate=true;moving.computeBoundingSphere();last={depositCount,loaded,visible};
  }
  update(0,false,false,1);
  return {group,update,snapshot:()=>last};
}

export function buildPumpStudy(){
  const group=new T.Group(),dummy=new T.Object3D();group.position.set(-1.5,.48,-.32);
  // Open quadrant is a teaching section, not an opening on the actual pump.
  const shell=new T.Mesh(new T.CylinderGeometry(.50,.50,.25,64,1,true,Math.PI*.5,Math.PI*1.5),new T.MeshStandardMaterial({color:'#536165',roughness:.32,side:T.DoubleSide}));shell.position.y=.05;group.add(shell);
  const base=new T.Mesh(new T.RingGeometry(.30,.50,64,1,Math.PI*.5,Math.PI*1.5),new T.MeshStandardMaterial({color:'#303f43',roughness:.45,side:T.DoubleSide}));base.rotation.x=-Math.PI/2;base.position.y=-.08;group.add(base);
  const path=new T.CatmullRomCurve3([new T.Vector3(0,.85,0),new T.Vector3(0,.3,0),new T.Vector3(.07,.13,.07),new T.Vector3(.34,.1,.23),new T.Vector3(.66,.08,.16),new T.Vector3(1.03,.08,.12)]);
  const arrow=new T.LatheGeometry([[0,-.06],[.009,-.06],[.009,.004],[.033,.004],[0,.07]].map(p=>new T.Vector2(...p)),10);
  const arrows=new T.InstancedMesh(arrow,new T.MeshBasicMaterial({color:'#9debdc',depthTest:false}),12);arrows.renderOrder=12;group.add(arrows);
  function update(time,visible){group.visible=visible;if(!visible)return;for(let i=0;i<12;i++){const t=(i/12+time*.06)%1;dummy.position.copy(path.getPointAt(t));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),path.getTangentAt(t).normalize());dummy.updateMatrix();arrows.setMatrixAt(i,dummy.matrix);}arrows.instanceMatrix.needsUpdate=true;}
  return {group,update};
}
