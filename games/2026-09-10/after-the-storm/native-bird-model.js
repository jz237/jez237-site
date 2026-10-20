import * as T from './vendor/three.module.js';

// Banks3 (Sunny Beach gulls) and6 (Drake Lake mallards) draw a bird as a
// flying body (part8), two wings of three flat slices (parts12/16/20, joint
// at x=0, outward +X, leading edge +Y) and a sitting body (part24, beak +Z).
// Each slice is rigid in its own original transform, so these are authored
// rigid high-resolution parts in the original part frames, shared by every
// bird of a species. Shapes and colours are authored; no cartridge data ships.
export const NATIVE_BIRD_SPECIES=Object.freeze({
 gull:Object.freeze({bank:3,body:[-158,181],height:[-34,44],width:39,wing:Object.freeze([145,100,60]),chord:Object.freeze([-73,60]),sit:[-142,152]}),
 mallard:Object.freeze({bank:6,body:[-142,208],height:[-72,54],width:49,wing:Object.freeze([145,100,60]),chord:Object.freeze([-23,110]),sit:[-142,146]})
});
export const nativeBirdSpeciesForBank=bank=>Object.keys(NATIVE_BIRD_SPECIES).find(k=>NATIVE_BIRD_SPECIES[k].bank===bank);

const colour=(...rgb)=>new T.Color().setRGB(...rgb.map(v=>v/255),T.SRGBColorSpace);
const PAINT={
 gull:{belly:colour(246,247,248),back:colour(176,186,196),head:colour(250,250,250),bill:colour(242,196,62),eye:colour(14,14,16),tail:colour(238,240,242),
  wing:(slice,u,v)=>slice===2&&u>.35?colour(28,28,32):slice===2&&u>.2?(v<.25&&u<.32?colour(250,250,250):colour(40,40,46)):v>.62?colour(188,196,205):colour(244,246,248)},
 mallard:{belly:colour(196,196,190),back:colour(120,106,92),head:colour(28,112,64),bill:colour(222,196,58),eye:colour(14,14,16),tail:colour(40,40,44),
  collar:colour(244,244,240),breast:colour(118,62,40),
  wing:(slice,u,v)=>slice===0&&v<.32?(v<.07||v>.27?colour(246,246,246):colour(36,70,190)):slice===2?colour(96,84,70):v>.6?colour(140,116,92):colour(122,102,84)}
};

// Lofted elliptical body: rows along +X from tail to bill tip, with a head bulge.
function body(spec,paint,{along='x'}={}){
 const [tail,nose]=along==='x'?spec.body:spec.sit,length=nose-tail,[low,high]=spec.height,mid=(low+high)/2,half=(high-low)/2;
 const profile=[[0,.18,.1],[.12,.42,.5],[.3,.9,.95],[.52,1,1],[.68,.82,.78],[.76,.55,.5],[.8,.62,.48],[.87,.66,.52],[.92,.5,.38],[.96,.22,.16],[1,.04,.04]];
 const curve=new T.CatmullRomCurve3(profile.map(([t,h,w])=>new T.Vector3(tail+t*length,h,w)),false,'centripetal');
 const rows=72,sides=24,positions=[],colors=[],indices=[];
 for(let i=0;i<=rows;i++){const p=curve.getPoint(i/rows),t=(p.x-tail)/length,lift=t>.74?half*.55*Math.min(1,(t-.74)/.08):0;
  for(let k=0;k<=sides;k++){const a=k/sides*Math.PI*2,s=Math.sin(a),c=Math.cos(a);
   const y=mid+lift+s*half*Math.max(.02,p.y),z=c*spec.width*Math.max(.02,p.z);positions.push(p.x,y,z);
   const top=s>.15,c0=t>.96?paint.bill:t>.76?(paint.collar&&t<.8?paint.collar:paint.head):paint.breast&&t>.62&&!top?paint.breast:t<.14?paint.tail:top?paint.back:paint.belly;
   colors.push(c0.r,c0.g,c0.b);if(i<rows&&k<sides){const q=i*(sides+1)+k;indices.push(q,q+sides+1,q+1,q+1,q+sides+1,q+sides+2);}}}
 // Eyes either side of the head.
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
 const eyes=[-1,1].map(side=>{const e=new T.SphereGeometry(half*.11,12,8).toNonIndexed();e.translate(tail+length*.86,mid+half*.95,side*spec.width*.42);
  const n=e.getAttribute('position').count;e.setAttribute('color',new T.Float32BufferAttribute(Array.from({length:n*3},(_,i)=>[paint.eye.r,paint.eye.g,paint.eye.b][i%3]),3));return e;});
 const merged=merge([g.toNonIndexed(),...eyes]);g.dispose();
 if(along==='z')merged.rotateY(-Math.PI/2);
 return merged;
}
// Thin cambered feather panel for one wing slice in its own frame.
function wingSlice(spec,paint,slice){
 const length=spec.wing[slice],[trailing,leading]=spec.chord,chord=leading-trailing,cols=20,rows=10,positions=[],colors=[],indices=[];
 const taper=slice===2?u=>1-.55*u**1.6:u=>1-.08*u;
 for(let i=0;i<=cols;i++){const u=i/cols,x=-3+u*(length+6),scale=taper(u);
  for(let j=0;j<=rows;j++){const v=j/rows,y=leading-chord*scale*v,camber=Math.sin(Math.PI*v)*chord*.05*scale;
   positions.push(x,y,camber);const c=paint.wing(slice,u,v);colors.push(c.r,c.g,c.b);
   if(i<cols&&j<rows){const q=i*(rows+1)+j;indices.push(q,q+rows+1,q+1,q+1,q+rows+1,q+rows+2);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(indices);g.computeVertexNormals();
 const flat=g.toNonIndexed();g.dispose();flat.computeBoundingSphere();return flat;
}
function merge(parts){
 const out=new T.BufferGeometry();for(const name of ['position','normal','color']){const size=name==='color'||name==='position'||name==='normal'?3:2;
  const data=[];for(const p of parts){if(!p.getAttribute('normal'))p.computeVertexNormals();data.push(...p.getAttribute(name).array);}out.setAttribute(name,new T.Float32BufferAttribute(data,size));}
 parts.forEach(p=>p.dispose());out.computeBoundingSphere();return out;
}

/** One shared rigid part set per species; the renderer owns its lifetime. */
export function makeNativeBirdParts(species){
 const spec=NATIVE_BIRD_SPECIES[species],paint=PAINT[species];if(!spec)throw new RangeError('Unknown native bird species');
 const material=new T.MeshStandardMaterial({vertexColors:true,roughness:.62,side:T.DoubleSide});
 const identity=Object.freeze(new T.Matrix4().toArray()),geometries=[];
 const part=geometry=>{geometries.push(geometry);return Object.freeze({geometry,material,localMatrix:identity});};
 const parts=new Map([[8,part(body(spec,paint))],[12,part(wingSlice(spec,paint,0))],[16,part(wingSlice(spec,paint,1))],[20,part(wingSlice(spec,paint,2))],[24,part(body(spec,paint,{along:'z'}))]]);
 let disposed=false;
 return {species,
  part(partOffset){if(disposed)throw new Error('Bird parts are disposed');const p=parts.get(partOffset);if(!p)throw new RangeError('Unknown bird part');return p;},
  dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());material.dispose();}};
}
