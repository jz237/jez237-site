import * as T from './vendor/three.module.js';

// Authored smooth geometry in the original dolphin part coordinate system.
// These are model dimensions/rest pivots, not copied cartridge vertices. The
// animation owns motion; no second procedural animation clock is introduced.
export function makeNativeDolphinParts(){
 const skin=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.28,clearcoat:.8,clearcoatRoughness:.15});
 const fin=new T.MeshPhysicalMaterial({color:0x647d89,roughness:.32,clearcoat:.6});
 const dorsalMaterial=fin.clone(),tailMatrix={value:new T.Matrix4()},tailNormalMatrix={value:new T.Matrix3()};
 // The original front/rear are rigid overlapping pieces. Retarget their two
 // transforms onto a continuous dense skin to remove the visible body seam.
 // The original tail flukes and pectoral fins keep their independent tracks.
 for(const material of [skin,dorsalMaterial]){
  material.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,{dolphinTailMatrix:tailMatrix,dolphinTailNormalMatrix:tailNormalMatrix});
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float sourceTailWeight;uniform mat4 dolphinTailMatrix;uniform mat3 dolphinTailNormalMatrix;')
    .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=mix(objectNormal,dolphinTailNormalMatrix*objectNormal,sourceTailWeight);')
    .replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=mix(transformed,(dolphinTailMatrix*vec4(transformed,1.0)).xyz,sourceTailWeight);');
  };
  material.customProgramCacheKey=()=> 'native-dolphin-continuous-skin-v1';
 }
 const eye=new T.MeshPhysicalMaterial({color:0x07161d,roughness:.1,clearcoat:1});
 const back=new T.Color(0x596e7a),belly=new T.Color(0xd5dede),color=new T.Color();
 function body(sections,rows){
  const positions=[],colors=[],uvs=[],indices=[],sides=40;
  // Cubic interpolation keeps the body smooth without changing the authored
  // silhouette at its sections. End tangents taper the nose/peduncle.
  const curve=new T.CatmullRomCurve3(sections.map(([x,h,w])=>new T.Vector3(x,h,w)),false,'centripetal');
  for(let i=0;i<=rows;i++){
   const p=curve.getPoint(i/rows);
   for(let k=0;k<=sides;k++){
    const angle=k/sides*Math.PI*2,s=Math.sin(angle),c=Math.cos(angle);
    positions.push(p.x,s*Math.max(0,p.y),c*Math.max(0,p.z));uvs.push(k/sides,i/rows);
    color.lerpColors(back,belly,T.MathUtils.smoothstep(s,-.2,.85));colors.push(color.r,color.g,color.b);
    if(i<rows&&k<sides){const a=i*(sides+1)+k;indices.push(a,a+sides+1,a+1,a+1,a+sides+1,a+sides+2);}
   }
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
 }
 function foil(outline,thickness){
  const curve=new T.CatmullRomCurve3(outline.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal'),points=curve.getPoints(80),shape=new T.Shape();
  shape.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))shape.lineTo(p.x,p.y);shape.closePath();
  const geometry=new T.ExtrudeGeometry(shape,{depth:thickness,steps:1,bevelEnabled:true,bevelSegments:3,bevelSize:thickness*.35,bevelThickness:thickness*.35});geometry.translate(0,0,-thickness/2);return geometry;
 }
 function merge(pieces){
  const positions=[],normals=[],colors=[],uvs=[],geometry=new T.BufferGeometry();let start=0;
  for(const [source,materialIndex]of pieces){
   const g=source.index?source.toNonIndexed():source,p=g.getAttribute('position'),n=g.getAttribute('normal'),c=g.getAttribute('color'),uv=g.getAttribute('uv');
   positions.push(...p.array);normals.push(...n.array);
   for(let i=0;i<p.count;i++){colors.push(c?c.getX(i):1,c?c.getY(i):1,c?c.getZ(i):1);uvs.push(uv?uv.getX(i):0,uv?uv.getY(i):0);}
   geometry.addGroup(start,p.count,materialIndex);start+=p.count;if(g!==source)g.dispose();source.dispose();
  }
  for(const [name,values,size]of [['position',positions,3],['normal',normals,3],['color',colors,3],['uv',uvs,2]])geometry.setAttribute(name,new T.Float32BufferAttribute(values,size));
  geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
 }
 const front=body([[-595,8,12],[-525,22,19],[-395,41,34],[-235,76,62],[-90,110,96],[0,133,120],[140,115,104],[290,92,81],[400,63,55],[475,34,30],[535,22,20],[640,14,12],[655,0,0]],112);
 const dorsal=foil([[-115,-88],[-58,-150],[-20,-252],[24,-208],[125,-115],[45,-102]],8);
 const eyes=[-1,1].map(side=>new T.SphereGeometry(9,20,12).scale(.75,1,.6).translate(416,-34,side*41));
 const frontGeometry=merge([[front,0],[dorsal,1],...eyes.map(g=>[g,2])]);
 const weights=Array.from({length:frontGeometry.attributes.position.count},(_,i)=>1-T.MathUtils.smoothstep(frontGeometry.attributes.position.getX(i),-450,20));
 frontGeometry.setAttribute('sourceTailWeight',new T.Float32BufferAttribute(weights,1));
 // This source part supplies a skin transform now. It has no separate surface
 // because all posterior vertices are included in the continuous body above.
 const rearGeometry=new T.BufferGeometry();rearGeometry.setAttribute('position',new T.Float32BufferAttribute([],3));rearGeometry.setDrawRange(0,0);
 const tailGeometry=foil([[-5,0],[21,-70],[89,-144],[119,-127],[82,-65],[58,0],[82,65],[119,127],[89,144],[21,70]],5);tailGeometry.rotateX(Math.PI/2);tailGeometry.translate(0,2,0);
 const pectoralGeometry=foil([[0,-10],[61,-18],[198,37],[177,62],[76,108],[7,126],[20,45]],5);
 const materials=[skin,dorsalMaterial,eye],geometries=[frontGeometry,rearGeometry,tailGeometry,pectoralGeometry],identity=Object.freeze(new T.Matrix4().toArray());
 const bodyPart=geometry=>Object.freeze({geometry,material:materials,localMatrix:identity});
 const plainPart=geometry=>Object.freeze({geometry,material:fin,localMatrix:identity});
 const frontPart=bodyPart(frontGeometry),rearPart=bodyPart(rearGeometry),parts=new Map([[8,frontPart],[12,rearPart],[16,plainPart(tailGeometry)],[20,plainPart(pectoralGeometry)],[24,frontPart],[28,rearPart]]);let disposed=false;
 return {
  part(partOffset){if(disposed)throw new Error('Dolphin parts are disposed');const p=parts.get(partOffset);if(!p)throw new RangeError('Unknown dolphin part');return p;},
  preparePose(draws){
   if(disposed)throw new Error('Dolphin parts are disposed');
   if(!Array.isArray(draws)||draws.length!==5)throw new RangeError('Supply all five dolphin part draws');
   const [front,back]=[24,28].map(offset=>draws.find(d=>d.partOffset===offset));
   if(!front||!back||new Set(draws.map(d=>d.partOffset)).size!==4||draws.filter(d=>d.partOffset===16).length!==1||draws.filter(d=>d.partOffset===20).length!==2||draws.some(d=>d.actorIndex!==front.actorIndex||d.resourceIndex!==front.resourceIndex||d.bufferIndex!==front.bufferIndex))throw new RangeError('Dolphin pose requires one matching actor and its complete part set');
   for(const d of draws)if(!Array.isArray(d.matrixWorld)||d.matrixWorld.length!==16||d.matrixWorld.some(v=>!Number.isFinite(v))||d.matrixWorld[3]!==0||d.matrixWorld[7]!==0||d.matrixWorld[11]!==0||d.matrixWorld[15]!==1)throw new RangeError('Invalid dolphin affine pose matrix');
   const first=new T.Matrix4().fromArray(front.matrixWorld);
   const second=new T.Matrix4().fromArray(back.matrixWorld);
   if([first.determinant(),second.determinant()].some(v=>!Number.isFinite(v)||v===0))throw new RangeError('Dolphin body transform is singular');
   const relative=first.invert().multiply(second).multiply(new T.Matrix4().makeScale(-1,-1,1)),normal=new T.Matrix3().getNormalMatrix(relative);
   if([...relative.elements,...normal.elements].some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v))))throw new RangeError('Dolphin skin transform exceeds renderer range');
   return Object.freeze({matrix:Object.freeze(relative.toArray()),normalMatrix:Object.freeze(normal.toArray())});
  },
  commitPose(pose){
   if(disposed)throw new Error('Dolphin parts are disposed');
   if(!Array.isArray(pose?.matrix)||pose.matrix.length!==16||!Array.isArray(pose.normalMatrix)||pose.normalMatrix.length!==9||[...pose.matrix,...pose.normalMatrix].some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v))))throw new RangeError('Invalid prepared dolphin skin pose');
   tailMatrix.value.fromArray(pose.matrix);tailNormalMatrix.value.fromArray(pose.normalMatrix);
  },
  dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());[...materials,fin].forEach(m=>m.dispose());}
 };
}
