import * as T from '../aquaclear-studio/vendor/three.module.js';
// Illustrative free jet after the real modeled pipe mouth. It is not a flow estimate.
export function discharge(effects){
 const points=[];for(let i=0;i<=28;i++){const t=i/28;points.push(new T.Vector3(-4.5-.58*t,2.05-.66*t-.95*t*t,0));}
 const curve=new T.CatmullRomCurve3(points),geometry=new T.TubeGeometry(curve,40,.085,12,false);
 const position=geometry.attributes.position;for(let i=0;i<position.count;i++){const t=geometry.attributes.uv.getX(i),center=curve.getPointAt(t),v=new T.Vector3().fromBufferAttribute(position,i);v.lerp(center,t*.38);position.setXYZ(i,v.x,v.y,v.z);}geometry.computeVertexNormals();
 const material=new T.MeshPhysicalMaterial({color:'#748b7c',metalness:.03,roughness:.13,clearcoat:1,transparent:true,opacity:.39,depthWrite:false,side:T.DoubleSide});
 const time={value:0},strength={value:0};material.onBeforeCompile=s=>{s.uniforms.jetTime=time;s.uniforms.jetStrength=strength;s.vertexShader='varying vec2 jetUV;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\njetUV=uv;');s.fragmentShader='varying vec2 jetUV;uniform float jetTime,jetStrength;\n'+s.fragmentShader;s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat ribbon=.5+.5*sin(jetUV.y*44.+sin(jetUV.x*38.-jetTime*13.));diffuseColor.rgb*=.82+.18*ribbon;diffuseColor.a*=jetStrength*(.55+.45*ribbon)*(1.-smoothstep(.65,1.,jetUV.x));');};
 const stream=new T.Mesh(geometry,material);effects.add(stream);
 const drops=new T.InstancedMesh(new T.SphereGeometry(.014,8,6),new T.MeshPhysicalMaterial({color:'#a4b0a1',roughness:.12,clearcoat:1,transparent:true,opacity:.44,depthWrite:false}),32);effects.add(drops);drops.frustumCulled=false;
 const pose=new T.Object3D();let tail=0,lastTime=0,last={};
 return {update(s,h,operating){const dt=Math.max(0,Math.min(.1,h.time-lastTime));if(h.time<lastTime)tail=0;lastTime=h.time;tail=h.rinse?1:Math.max(0,tail-dt*.9);time.value=h.time;strength.value=tail;stream.visible=drops.visible=operating&&tail>0&&!s.wasteBlocked;
  for(let i=0;i<32;i++){const t=(h.time*.95+i*.618)%1,p=curve.getPoint(t);pose.position.copy(p);pose.position.z+=Math.sin(i*2.4)*.095*t;pose.position.x+=Math.cos(i*1.7)*.045*t;pose.rotation.z=-.4;const scale=(.38+(i%5)*.12)*tail;pose.scale.set(scale,scale*(1+t*2.2),scale);pose.updateMatrix();drops.setMatrixAt(i,pose.matrix);}drops.instanceMatrix.needsUpdate=true;
  last={visible:stream.visible,tail,clock:h.time,drops:drops.visible?32:0};},snapshot:()=>last};
}
