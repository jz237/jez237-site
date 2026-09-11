import * as T from './vendor/three.module.js';
// Original mesh with an animated vertical travelling wave and independent flukes.
export function makeDolphin(parent){const root=new T.Group();parent.add(root);const materials=[],geometries=[];
 const skin=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.28,clearcoat:.8,clearcoatRoughness:.15});materials.push(skin);
 const rows=40,sides=24,positions=[],colors=[],indices=[],sections=[[-2.1,.08,.07],[-1.65,.13,.14],[-1.1,.27,.26],[-.45,.43,.44],[.2,.47,.44],[.8,.39,.36],[1.17,.24,.25],[1.35,.15,.12],[1.92,.065,.065],[1.97,0,0]];
 for(let i=0;i<=rows;i++){const z=-2.1+i/rows*4.07;let j=0;while(j<sections.length-2&&z>sections[j+1][0])j++;const a=sections[j],b=sections[j+1],f=(z-a[0])/(b[0]-a[0]),w=T.MathUtils.lerp(a[1],b[1],f),h=T.MathUtils.lerp(a[2],b[2],f);
  for(let k=0;k<=sides;k++){const angle=k/sides*Math.PI*2,y=Math.sin(angle)*h;positions.push(Math.cos(angle)*w,y,z);const c=new T.Color().lerpColors(new T.Color(0x596e7a),new T.Color(0xd5dede),T.MathUtils.smoothstep(-Math.sin(angle),-.2,.85));colors.push(c.r,c.g,c.b);if(i<rows&&k<sides){const p=i*(sides+1)+k;indices.push(p,p+1,p+sides+1,p+1,p+sides+2,p+sides+1);}}
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();geometries.push(geo);const body=new T.Mesh(geo,skin);root.add(body);
 const finMat=new T.MeshPhysicalMaterial({color:0x647d89,roughness:.32,clearcoat:.6,side:T.DoubleSide});materials.push(finMat);
 function fin(points){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();geometries.push(g);const m=new T.Mesh(g,finMat);root.add(m);return m;}
 const dorsal=fin([[0,.32,.04],[0,1.02,-.44],[0,.46,-.64],[0,.25,-.7]]);
 const flukes=fin([[-.02,0,0],[-.92,.03,-.31],[0,.02,.12],[.92,.03,-.31]]);flukes.position.z=-2.03;
 const fins=[-1,1].map(side=>{const f=fin([[0,0,.2],[side*.63,-.25,-.48],[side*.36,-.08,-.55],[0,0,-.15]]);f.position.set(side*.32,-.2,.45);return f;});
 const eyeMat=new T.MeshPhysicalMaterial({color:0x07161d,roughness:.1,clearcoat:1});materials.push(eyeMat);const eyeGeo=new T.SphereGeometry(.032,12,8);geometries.push(eyeGeo);for(const side of [-1,1]){const eye=new T.Mesh(eyeGeo,eyeMat);eye.position.set(side*.246,.08,1.1);root.add(eye);}
 const base=new Float32Array(positions);function update(time,speed=7){const p=geo.attributes.position,frequency=1.8+Math.min(20,speed)*.1;for(let i=0;i<p.count;i++){const z=base[i*3+2],tail=Math.max(0,(.55-z)/2.65),bend=Math.sin(time*frequency*2-z*2.2)*tail*tail*(.08+Math.min(18,speed)*.006);p.setY(i,base[i*3+1]+bend);}p.needsUpdate=true;geo.computeVertexNormals();flukes.position.y=Math.sin(time*frequency*2+4.47)*(.08+Math.min(18,speed)*.006);flukes.rotation.x=Math.cos(time*frequency*2+4.47)*.25;fins.forEach((f,i)=>f.rotation.z=(i?1:-1)*(.08+Math.sin(time*2.2+i*.5)*.07));dorsal.rotation.x=Math.sin(time*2.1)*.01;}
 return {root,update,dispose(){root.removeFromParent();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
