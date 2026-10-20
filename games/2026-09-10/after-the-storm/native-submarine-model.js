import * as T from './vendor/three.module.js';

// Bank7 (Port Blue): a red submarine cruising 3-10 m below the surface. In
// its original frame the hull runs along +Z (stern -3080, bow +1457) centred
// near y=-620, with a sail amidships and stern fins rising to y=+140. Part12
// is the propeller wash behind the stern plus a 35 m bubble disc at the
// surface (y=0); part16 is the alternate bubble disc. Authored parts after
// the original palette (red hull, yellow stripe, dark viewports); no cartridge
// data ships.
const colour=(...rgb)=>new T.Color().setRGB(...rgb.map(v=>v/255),T.SRGBColorSpace);
const RED=colour(214,36,40),DARK_RED=colour(150,22,28),YELLOW=colour(246,200,52),GLASS=colour(30,44,62),STEEL=colour(70,72,80);

function paint(geometry,pick){
 const p=geometry.getAttribute('position'),cols=[];for(let i=0;i<p.count;i++){const c=pick(p.getX(i),p.getY(i),p.getZ(i));cols.push(c.r,c.g,c.b);}
 geometry.setAttribute('color',new T.Float32BufferAttribute(cols,3));return geometry;
}
function merge(parts){
 const out=new T.BufferGeometry();
 for(const name of ['position','normal','color']){const data=[];for(const g of parts)data.push(...g.getAttribute(name).array);out.setAttribute(name,new T.Float32BufferAttribute(data,3));}
 parts.forEach(g=>g.dispose());out.computeBoundingSphere();return out;
}
const flat=g=>{const f=g.index?g.toNonIndexed():g;if(f!==g)g.dispose();f.computeVertexNormals();return f;};

function hull(){
 const stern=-3080,bow=1457,length=bow-stern,cy=-620,profile=[[0,.18],[.06,.55],[.16,.9],[.3,1],[.72,1],[.86,.92],[.95,.62],[1,.05]];
 const curve=new T.CatmullRomCurve3(profile.map(([t,r])=>new T.Vector3(stern+t*length,r,0)),false,'centripetal'),rows=90,sides=40,pos=[],idx=[];
 for(let i=0;i<=rows;i++){const p=curve.getPoint(i/rows);for(let k=0;k<=sides;k++){const a=k/sides*Math.PI*2;pos.push(Math.cos(a)*350*p.y,cy+Math.sin(a)*340*p.y,p.x);
  if(i<rows&&k<sides){const q=i*(sides+1)+k;idx.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
 const body=paint(flat(g),(x,y,z)=>Math.abs(y-cy+40)<26?YELLOW:z>1380?DARK_RED:RED);
 // Viewports: a row of dark round windows along each side.
 const windows=[];for(const side of [-1,1])for(let z=-1800;z<=900;z+=300){const w=new T.CylinderGeometry(62,62,24,20);w.rotateZ(Math.PI/2);w.translate(side*338,cy+90,z);windows.push(paint(flat(w),()=>GLASS));}
 const sail=new T.CapsuleGeometry(150,520,8,20);sail.rotateX(Math.PI/2);sail.scale(1.25,1,1);sail.translate(0,-170,-150);
 const fin=(w,h,d,x,y,z)=>{const b=new T.BoxGeometry(w,h,d,1,1,1);b.translate(x,y,z);return paint(flat(b),()=>DARK_RED);};
 const prop=new T.CylinderGeometry(120,40,140,16);prop.rotateX(Math.PI/2);prop.translate(0,cy,-3100);
 return merge([body,...windows,paint(flat(sail),(x,y)=>y>-140?DARK_RED:RED),fin(40,560,520,0,-200,-2780),fin(980,40,460,0,cy+130,-2800),paint(flat(prop),()=>STEEL)]);
}

// Soft translucent bubbles: authored high-resolution foam, not original texels.
function bubbleTexture(){
 if(typeof document==='undefined')return null;
 const size=512,canvas=document.createElement('canvas');canvas.width=canvas.height=size;const g=canvas.getContext('2d');
 for(let i=0;i<900;i++){const a=i*2.399963,r=Math.sqrt((i+.5)/900)*size*.46,x=size/2+Math.cos(a)*r,y=size/2+Math.sin(a)*r,b=2+(i*37%9),alpha=.18+.5*(1-r/(size*.46));
  const q=g.createRadialGradient(x,y,0,x,y,b);q.addColorStop(0,`rgba(255,255,255,${alpha})`);q.addColorStop(.7,`rgba(220,240,255,${alpha*.6})`);q.addColorStop(1,'rgba(220,240,255,0)');g.fillStyle=q;g.fillRect(x-b,y-b,2*b,2*b);}
 const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;return map;
}
function quad(width,height,transform){const g=new T.PlaneGeometry(width,height,1,1);transform(g);return g;}

export function makeNativeSubmarineParts({map}={}){
 const texture=map===undefined?bubbleTexture():map;
 const solid=new T.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.15});
 const bubbles=new T.MeshBasicMaterial({map:texture,color:texture?0xffffff:0xdff0ff,transparent:true,opacity:texture?1:.35,depthWrite:false,side:T.DoubleSide,toneMapped:false});
 const identity=Object.freeze(new T.Matrix4().toArray());
 const disc=()=>quad(3500,3500,g=>g.rotateX(-Math.PI/2));
 const wash=quad(700,700,g=>{g.rotateY(Math.PI/2);g.translate(70,0,-2870);});
 const wake=new T.BufferGeometry();{const a=disc(),b=wash;for(const name of ['position','normal','uv']){const size=name==='uv'?2:3;wake.setAttribute(name,new T.Float32BufferAttribute([...a.toNonIndexed().getAttribute(name).array,...b.toNonIndexed().getAttribute(name).array],size));}a.dispose();b.dispose();}
 const geometries=[hull(),wake,disc().toNonIndexed()];
 const parts=new Map([[8,{geometry:geometries[0],material:solid}],[12,{geometry:geometries[1],material:bubbles}],[16,{geometry:geometries[2],material:bubbles}]]
  .map(([o,p])=>[o,Object.freeze({...p,localMatrix:identity})]));
 let disposed=false;
 return {species:'submarine',
  part(partOffset){if(disposed)throw new Error('Submarine parts are disposed');const p=parts.get(partOffset);if(!p)throw new RangeError('Unknown submarine part');return p;},
  dispose(){if(disposed)return;disposed=true;geometries.forEach(g=>g.dispose());solid.dispose();bubbles.dispose();if(map===undefined)texture?.dispose();}};
}
