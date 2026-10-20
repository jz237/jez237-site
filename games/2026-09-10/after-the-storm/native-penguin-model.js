import * as T from './vendor/three.module.js';

// Bank8 (Glacier Coast) draws a swimming king penguin from rigid parts in
// their original frames: body12 (tail -X to neck +X, back +Y), head8 (bill
// tip +X, chin -Y), flippers16 (flat, outward +X) and feet20 (small, -Y).
// Authored high-resolution parts with the original palette: black back,
// white belly, yellow-orange chest and ear patches, long dark bill.
const colour=(...rgb)=>new T.Color().setRGB(...rgb.map(v=>v/255),T.SRGBColorSpace);
const BLACK=colour(26,28,34),SLATE=colour(70,78,92),WHITE=colour(242,244,246),YELLOW=colour(250,206,96),ORANGE=colour(244,126,38),BILL=colour(30,30,32);

function loft({from,to,profile,top,bottom,width,paint,rows=60,sides=24}){
 const length=to-from,curve=new T.CatmullRomCurve3(profile.map(([t,h,w])=>new T.Vector3(from+t*length,h,w)),false,'centripetal');
 const positions=[],colors=[],indices=[],mid=(top+bottom)/2,half=(top-bottom)/2;
 for(let i=0;i<=rows;i++){const p=curve.getPoint(i/rows),t=(p.x-from)/length;
  for(let k=0;k<=sides;k++){const a=k/sides*Math.PI*2,s=Math.sin(a),c=Math.cos(a);
   positions.push(p.x,mid+s*half*Math.max(.03,p.y),c*width*Math.max(.03,p.z));const col=paint(t,s,c);colors.push(col.r,col.g,col.b);
   if(i<rows&&k<sides){const q=i*(sides+1)+k;indices.push(q,q+sides+1,q+1,q+1,q+sides+1,q+sides+2);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
 const flat=g.toNonIndexed();g.dispose();return flat;
}
function paddle({length,root,tip,paintTop,paintBottom}){
 // Flat flipper in the part's XZ plane, slightly thick so both faces shade.
 const shape=new T.Shape();shape.moveTo(0,-root*.5);shape.quadraticCurveTo(length*.55,-root*.62,length,-tip*.5);shape.quadraticCurveTo(length*1.02,0,length,tip*.5);
 shape.quadraticCurveTo(length*.5,root*.55,0,root*.5);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:2,bevelEnabled:true,bevelSize:1.2,bevelThickness:1.2,bevelSegments:2,curveSegments:16});g.rotateX(Math.PI/2);g.translate(0,1,0);
 const flat=g.index?g.toNonIndexed():g;if(flat!==g)g.dispose();flat.computeVertexNormals();
 const n=flat.getAttribute('normal'),cols=[];for(let i=0;i<n.count;i++){const c=n.getY(i)>=0?paintTop:paintBottom;cols.push(c.r,c.g,c.b);}
 flat.setAttribute('color',new T.Float32BufferAttribute(cols,3));return flat;
}

export function makeNativePenguinParts(){
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.42,side:T.DoubleSide});
 const body=loft({from:-120,to:181,top:54,bottom:-71,width:60,
  profile:[[0,.12,.12],[.1,.5,.5],[.3,.92,.92],[.55,1,1],[.78,.9,.88],[.92,.62,.6],[1,.42,.4]],
  paint:(t,s,c)=>s>.25-.2*Math.abs(c)?BLACK:t>.66&&s<-.2?(t>.82?ORANGE:YELLOW):s>.05?SLATE:WHITE});
 const head=loft({from:-19,to:132,top:26,bottom:-59,width:31,
  profile:[[0,.55,.6],[.18,.9,.95],[.32,1,1],[.45,.7,.62],[.6,.3,.22],[.8,.16,.12],[1,.03,.03]],
  // Black crown and bill, orange ear patch low on the sides behind the bill.
  paint:(t,s,c)=>t>.42?(t<.6&&s<-.3?ORANGE:BILL):Math.abs(c)>.55&&s<.1&&s>-.75&&t>.08?ORANGE:t<.3&&s<-.55?YELLOW:BLACK});
 const flipper=paddle({length:194,root:50,tip:12,paintTop:BLACK,paintBottom:WHITE});
 // Webbed foot fanning out along -Y in the part's YZ plane.
 const footFlat=paddle({length:58,root:12,tip:30,paintTop:SLATE,paintBottom:SLATE});footFlat.rotateZ(-Math.PI/2);footFlat.translate(15,13,0);
 const identity=Object.freeze(new T.Matrix4().toArray()),geometries=[body,head,flipper,footFlat];
 const parts=new Map([[12,body],[8,head],[16,flipper],[20,footFlat]].map(([o,geometry])=>[o,Object.freeze({geometry,material,localMatrix:identity})]));
 let disposed=false;
 return {species:'penguin',
  part(partOffset){if(disposed)throw new Error('Penguin parts are disposed');const p=parts.get(partOffset);if(!p)throw new RangeError('Unknown penguin part');return p;},
  dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());material.dispose();}};
}
