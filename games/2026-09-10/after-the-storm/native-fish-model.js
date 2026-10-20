import * as T from './vendor/three.module.js';

// Bank2 swimmers draw one fish as three rigid side-view slices: head, middle
// and tail, chained head x=L -> middle x=0 and middle x=L -> tail x=0. Here a
// continuous authored 3D body lives in the middle slice's frame and is skinned
// to the head/tail transforms, so the original animation bends it without
// seams. Lengths and heights match the original slices (native part units,
// +Y up, nose toward -X); shapes and paint are authored, not cartridge data.
export const NATIVE_FISH_SPECIES=Object.freeze({
 clown:Object.freeze({parts:Object.freeze({head:12,middle:8,tail:16}),lengths:Object.freeze([70,70,60])}),
 butterfly:Object.freeze({parts:Object.freeze({head:24,middle:20,tail:28}),lengths:Object.freeze([55,55,40])}),
 tang:Object.freeze({parts:Object.freeze({head:36,middle:32,tail:40}),lengths:Object.freeze([70,70,60])}),
 // Bank4 (Drake Lake): one silvery lake fish whose slices reuse offsets12/8/16.
 trout:Object.freeze({parts:Object.freeze({head:12,middle:8,tail:16}),lengths:Object.freeze([150,150,100]),bank:4})
});
export function nativeFishSpeciesForPart(partOffset,{bank=2}={}){return bank===4?(Object.values(NATIVE_FISH_SPECIES.trout.parts).includes(partOffset)?'trout':undefined):
 Object.keys(NATIVE_FISH_SPECIES).find(k=>!NATIVE_FISH_SPECIES[k].bank&&Object.values(NATIVE_FISH_SPECIES[k].parts).includes(partOffset));}

// Sections are [x from nose, half height, half width]; fins are side outlines.
const DESIGNS={
 clown:{body:[[0,2,1.5],[7,11,6],[18,21,11],[38,30,15],[65,33,16],[95,32,15],[120,27,12],[140,17,8],[152,10,4.5],[160,8,3.5]],
  fins:[[[56,28],[66,44],[80,46],[92,40],[104,44],[118,42],[134,30],[140,17],[100,26]],[[100,-24],[112,-38],[126,-38],[138,-20],[140,-14]],
   [[52,-22],[58,-36],[68,-38],[72,-26]],[[150,0],[160,-10],[178,-30],[196,-30],[200,-14],[200,14],[196,30],[178,30],[160,10]]],
  pectoral:[42,-6,16,10],eye:[15,6,4.2]},
 butterfly:{body:[[0,3,1.5],[8,10,3.5],[22,24,6.5],[42,40,8.5],[66,46,9],[92,44,8.5],[112,34,7],[124,16,4],[130,11,3]],
  fins:[[[60,42],[78,48],[100,48],[118,43],[126,26],[124,16],[96,40]],[[64,-42],[84,-48],[106,-48],[120,-40],[126,-22],[124,-16],[96,-40]],
   [[126,0],[132,-8],[144,-23],[147,-19],[147,19],[144,23],[132,8]]],
  pectoral:[38,-8,13,8],eye:[13,4,3.6]},
 tang:{body:[[0,3,1.5],[10,15,4.5],[28,27,7.5],[52,38,9.5],[84,42,10],[116,40,9],[140,31,7],[158,14,4],[168,9,3]],
  fins:[[[40,30],[60,44],[100,48],[134,44],[156,30],[158,14],[100,40]],[[52,-34],[80,-46],[120,-48],[150,-36],[158,-14],[110,-40]],
   [[164,0],[172,-10],[198,-34],[192,-12],[200,0],[192,12],[198,34],[172,10]]],
  pectoral:[40,-4,15,9],eye:[14,5,4]},
 trout:{body:[[0,6,3],[15,22,10],[40,33,15],[90,39,17],[150,40,17],[220,36,15],[280,27,11],[320,15,6],[345,10,4],[356,8,3.5]],
  fins:[[[118,34],[132,45],[158,45],[174,33],[140,36]],[[252,24],[259,32],[270,30],[274,22]],[[248,-25],[262,-40],[280,-36],[288,-21]],
   [[352,0],[362,-11],[385,-36],[398,-38],[392,-9],[397,0],[392,9],[398,38],[385,36],[362,11]]],
  pectoral:[70,-18,26,12],eye:[24,9,5]}
};

// Authored high-resolution side paint (u=x/length, v=(y+50)/100). Colors follow
// the original species palettes: magenta clownfish with white bands, pale
// butterflyfish with warm stripes, royal blue tang with yellow tail.
function paint(species,length){
 if(typeof document==='undefined')return null;
 const W=1024,H=512,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const g=canvas.getContext('2d');
 const X=x=>x/length*W,Y=y=>(50-y)/100*H;
 const fill=(c,x0,x1)=>{g.fillStyle=c;g.fillRect(X(x0),0,X(x1)-X(x0),H);};
 const gradient=(stops)=>{const q=g.createLinearGradient(0,0,W,0);for(const [x,c]of stops)q.addColorStop(Math.min(1,Math.max(0,x/length)),c);g.fillStyle=q;g.fillRect(0,0,W,H);};
 const band=(x,w,edge,core)=>{const curve=k=>Math.sin(k*Math.PI)*w*.22;g.lineJoin='round';
  for(const [color,width]of [[edge,w+12],[core,w]]){g.strokeStyle=color;g.lineWidth=X(width);g.beginPath();for(let k=0;k<=24;k++){const t=k/24,y=50-t*100;const px=X(x+curve(t)),py=Y(y);k?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();}};
 const shade=()=>{const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'rgba(10,10,40,.32)');q.addColorStop(.45,'rgba(0,0,0,0)');q.addColorStop(.8,'rgba(255,255,255,.18)');q.addColorStop(1,'rgba(255,255,255,.25)');g.fillStyle=q;g.fillRect(0,0,W,H);};
 if(species==='clown'){
  gradient([[0,'#e85a9c'],[60,'#e0569e'],[120,'#c84a9c'],[200,'#b04698']]);shade();
  band(44,11,'#20207a','#fbf7fb');band(97,13,'#20207a','#fbf7fb');band(150,6,'#20207a','#fbf7fb');
  g.fillStyle='rgba(32,32,150,.85)';g.fillRect(X(160),0,W-X(160),H*.1);g.fillRect(X(160),H*.9,W-X(160),H*.1);
 }else if(species==='butterfly'){
  gradient([[0,'#f1c8d6'],[40,'#e6e2f2'],[100,'#d8d2ec'],[130,'#7c6ab0'],[150,'#2a2a86']]);
  for(const x of [30,52,74,96,114])band(x,5,'rgba(210,90,120,.0)','rgba(196,96,128,.75)');
  band(18,7,'rgba(0,0,0,0)','#2c2c6a');shade();
 }else if(species==='trout'){
  // Silvery lake fish: dark blue-grey back fading to a pale belly, with a
  // faint rose lateral band and scattered dark spots, after the original palette.
  const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#2e4674');q.addColorStop(.32,'#6f82b4');q.addColorStop(.55,'#c3cbe6');q.addColorStop(.62,'#d9b9cf');q.addColorStop(.7,'#dfe4f2');q.addColorStop(1,'#f4f6fb');
  g.fillStyle=q;g.fillRect(0,0,W,H);g.fillStyle='rgba(28,34,60,.55)';
  for(let i=0;i<140;i++){const x=(i*97%400)/400*W,y=(.08+((i*53)%30)/100)*H;g.beginPath();g.arc(x,y,2+(i%3),0,Math.PI*2);g.fill();}
  const tail=g.createLinearGradient(X(340),0,W,0);tail.addColorStop(0,'rgba(80,100,170,0)');tail.addColorStop(1,'rgba(70,90,170,.8)');g.fillStyle=tail;g.fillRect(X(340),0,W-X(340),H);
 }else{
  gradient([[0,'#f6d77a'],[18,'#ee9ac8'],[40,'#2a52e6'],[120,'#2448e0'],[160,'#1d3ac8'],[163,'#f8f7a2'],[200,'#f4ec80']]);shade();
  g.strokeStyle='rgba(18,22,110,.9)';g.lineWidth=H*.035;g.beginPath();g.moveTo(X(40),Y(30));g.bezierCurveTo(X(80),Y(46),X(120),Y(46),X(156),Y(22));g.stroke();
  g.beginPath();g.moveTo(X(52),Y(-30));g.bezierCurveTo(X(90),Y(-44),X(126),Y(-44),X(156),Y(-20));g.stroke();
 }
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;map.wrapS=map.wrapT=T.ClampToEdgeWrapping;return map;
}

export function makeNativeFishParts(species,{map}={}){
 const spec=NATIVE_FISH_SPECIES[species],design=DESIGNS[species];
 if(!spec)throw new RangeError('Unknown native fish species');
 const [headLength,middleLength,tailLength]=spec.lengths,length=headLength+middleLength+tailLength;
 const texture=map===undefined?paint(species,length):map;
 const head={value:new T.Matrix4()},tail={value:new T.Matrix4()},headNormal={value:new T.Matrix3()},tailNormal={value:new T.Matrix3()};
 const skin=new T.MeshPhysicalMaterial({map:texture,color:texture?0xffffff:0xd07aa8,roughness:.32,clearcoat:.7,clearcoatRoughness:.18,side:T.DoubleSide});
 const eye=new T.MeshPhysicalMaterial({color:0x05080c,roughness:.08,clearcoat:1});
 for(const material of [skin,eye]){
  material.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,{fishHeadMatrix:head,fishTailMatrix:tail,fishHeadNormalMatrix:headNormal,fishTailNormalMatrix:tailNormal});
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 fishWeights;uniform mat4 fishHeadMatrix,fishTailMatrix;uniform mat3 fishHeadNormalMatrix,fishTailNormalMatrix;')
    .replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=normalize((1.0-fishWeights.x-fishWeights.y)*objectNormal+fishWeights.x*(fishHeadNormalMatrix*objectNormal)+fishWeights.y*(fishTailNormalMatrix*objectNormal));')
    .replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed=(1.0-fishWeights.x-fishWeights.y)*transformed+fishWeights.x*(fishHeadMatrix*vec4(transformed,1.0)).xyz+fishWeights.y*(fishTailMatrix*vec4(transformed,1.0)).xyz;');
  };
  material.customProgramCacheKey=()=>'native-fish-skin-v1';
 }
 const pieces=[];
 // Lofted elliptical body; sections interpolate smoothly between authored rows.
 {
  const curve=new T.CatmullRomCurve3(design.body.map(([x,h,w])=>new T.Vector3(x,h,w)),false,'centripetal'),rows=96,sides=32,positions=[],indices=[];
  for(let i=0;i<=rows;i++){const p=curve.getPoint(i/rows);for(let k=0;k<=sides;k++){const a=k/sides*Math.PI*2;positions.push(p.x,Math.sin(a)*Math.max(.5,p.y),Math.cos(a)*Math.max(.5,p.z));
   if(i<rows&&k<sides){const q=i*(sides+1)+k;indices.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();pieces.push([g,0]);
 }
 const fin=(outline,thickness)=>{
  const points=new T.CatmullRomCurve3(outline.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getPoints(64),shape=new T.Shape();
  shape.moveTo(points[0].x,points[0].y);for(const p of points.slice(1))shape.lineTo(p.x,p.y);shape.closePath();
  const g=new T.ExtrudeGeometry(shape,{depth:thickness,steps:1,curveSegments:24,bevelEnabled:true,bevelSegments:2,bevelSize:thickness*.3,bevelThickness:thickness*.3});g.translate(0,0,-thickness/2);return g;
 };
 for(const outline of design.fins)pieces.push([fin(outline,1.6),0]);
 {
  const [x,y,w,h]=design.pectoral,width=design.body.reduce((best,[bx,,bw])=>Math.abs(bx-x)<Math.abs(best[0]-x)?[bx,bw]:best,[Infinity,0])[1];
  for(const side of [-1,1]){const g=fin([[0,0],[w*.55,h*.5],[w,h*.15],[w*.9,-h*.35],[w*.4,-h*.45]],1.2);g.rotateY(side*.55);g.translate(x,y,side*width*.92);pieces.push([g,0]);}
 }
 {
  const [x,y,r]=design.eye,width=design.body.reduce((best,[bx,,bw])=>Math.abs(bx-x)<Math.abs(best[0]-x)?[bx,bw]:best,[Infinity,0])[1];
  for(const side of [-1,1])pieces.push([new T.SphereGeometry(r,24,16).scale(1,1,.55).translate(x,y,side*width*.82),1]);
 }
 // Merge in nose-origin coordinates, then express the result in the middle
 // slice's frame. Paint is projected from the side for body and fins alike.
 const positions=[],normals=[],uvs=[],weights=[],geometry=new T.BufferGeometry(),joint=headLength*.32,tailJoint=middleLength*.28;
 let start=0;
 for(const [source,materialIndex]of pieces){
  const g=source.index?source.toNonIndexed():source,p=g.getAttribute('position'),n=g.getAttribute('normal');
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)-headLength,y=p.getY(i);positions.push(x,y,p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));
   uvs.push(T.MathUtils.clamp(p.getX(i)/length,0,1),T.MathUtils.clamp((y+50)/100,0,1));
   weights.push(1-T.MathUtils.smoothstep(x,-joint,joint),T.MathUtils.smoothstep(x,middleLength-tailJoint,middleLength+tailJoint));
  }
  geometry.addGroup(start,p.count,materialIndex);start+=p.count;if(g!==source)g.dispose();source.dispose();
 }
 for(const [name,values,size]of [['position',positions,3],['normal',normals,3],['uv',uvs,2],['fishWeights',weights,2]])geometry.setAttribute(name,new T.Float32BufferAttribute(values,size));
 geometry.computeBoundingBox();geometry.computeBoundingSphere();
 const empty=new T.BufferGeometry();empty.setAttribute('position',new T.Float32BufferAttribute([],3));empty.setDrawRange(0,0);
 const identity=Object.freeze(new T.Matrix4().toArray()),materials=[skin,eye];
 const bodyPart=Object.freeze({geometry,material:materials,localMatrix:identity}),slicePart=Object.freeze({geometry:empty,material:materials,localMatrix:identity});
 const parts=new Map([[spec.parts.middle,bodyPart],[spec.parts.head,slicePart],[spec.parts.tail,slicePart]]);let disposed=false;
 return {
  species,length,
  part(partOffset){if(disposed)throw new Error('Fish parts are disposed');const p=parts.get(partOffset);if(!p)throw new RangeError('Unknown fish part');return p;},
  preparePose(draws){
   if(disposed)throw new Error('Fish parts are disposed');
   if(!Array.isArray(draws)||draws.length!==3)throw new RangeError('Supply all three fish slice draws');
   const [h,m,t]=[spec.parts.head,spec.parts.middle,spec.parts.tail].map(offset=>draws.find(d=>d.partOffset===offset));
   if(!h||!m||!t||draws.some(d=>d.actorIndex!==m.actorIndex||d.resourceIndex!==m.resourceIndex||d.bufferIndex!==m.bufferIndex))throw new RangeError('Fish pose requires one matching actor and its complete slice set');
   for(const d of draws)if(!Array.isArray(d.matrixWorld)||d.matrixWorld.length!==16||d.matrixWorld.some(v=>!Number.isFinite(v))||d.matrixWorld[3]!==0||d.matrixWorld[7]!==0||d.matrixWorld[11]!==0||d.matrixWorld[15]!==1)throw new RangeError('Invalid fish affine pose matrix');
   const middle=new T.Matrix4().fromArray(m.matrixWorld);if(!Number.isFinite(middle.determinant())||middle.determinant()===0)throw new RangeError('Fish body transform is singular');
   const inverse=middle.clone().invert();
   // Head-local x is middle x + head length at rest; tail-local x is middle x - middle length.
   const headRelative=inverse.clone().multiply(new T.Matrix4().fromArray(h.matrixWorld)).multiply(new T.Matrix4().makeTranslation(headLength,0,0));
   const tailRelative=inverse.clone().multiply(new T.Matrix4().fromArray(t.matrixWorld)).multiply(new T.Matrix4().makeTranslation(-middleLength,0,0));
   const pose={head:headRelative.toArray(),tail:tailRelative.toArray(),headNormal:new T.Matrix3().getNormalMatrix(headRelative).toArray(),tailNormal:new T.Matrix3().getNormalMatrix(tailRelative).toArray()};
   if(Object.values(pose).flat().some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v))))throw new RangeError('Fish skin transform exceeds renderer range');
   return Object.freeze(Object.fromEntries(Object.entries(pose).map(([k,v])=>[k,Object.freeze(v)])));
  },
  commitPose(pose){
   if(disposed)throw new Error('Fish parts are disposed');
   if(!pose||[['head',16],['tail',16],['headNormal',9],['tailNormal',9]].some(([k,n])=>!Array.isArray(pose[k])||pose[k].length!==n||pose[k].some(v=>!Number.isFinite(v)||!Number.isFinite(Math.fround(v)))))throw new RangeError('Invalid prepared fish skin pose');
   head.value.fromArray(pose.head);tail.value.fromArray(pose.tail);headNormal.value.fromArray(pose.headNormal);tailNormal.value.fromArray(pose.tailNormal);
  },
  dispose(){if(disposed)return;disposed=true;geometry.dispose();empty.dispose();materials.forEach(m=>m.dispose());if(map===undefined)texture?.dispose();}
 };
}
