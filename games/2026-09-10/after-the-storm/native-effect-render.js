import * as T from './vendor/three.module.js';
import {makeNativeEffectTextures} from './native-effect-textures.js';
const counts={spray:4,splash:7,wake:4,droplet:1};

// Merge only adjacent compatible draws: global grouping would reorder alpha
// blending. Validation completes before any live geometry is changed.
export function prepareNativeEffectBatches(presentation){
 if(!Array.isArray(presentation?.draws))throw new TypeError('Supply prepared native effect draws');
 const batches=[],color=new T.Color();
 for(const d of presentation.draws){
  if(!d||!Object.hasOwn(counts,d.family)||!Number.isInteger(d.textureFrame)||d.textureFrame<0||d.textureFrame>=counts[d.family]||typeof d.depthTest!=='boolean')throw new RangeError('Invalid effect draw material');
  if(!Array.isArray(d.positions)||!d.positions.length||d.positions.length%9)throw new RangeError('Invalid effect triangle positions');
  const vertices=d.positions.length/3;
  for(const [key,size,min,max]of [['positions',vertices*3,-Infinity,Infinity],['uvs',vertices*2,-Infinity,Infinity],['colors',vertices*3,0,1],['alphas',vertices,0,1]]){
   if(!Array.isArray(d[key])||d[key].length!==size||d[key].some(v=>!Number.isFinite(v)||v<min||v>max||!Number.isFinite(Math.fround(v))))throw new RangeError('Invalid effect '+key);
  }
  let b=batches.at(-1);
  if(!b||b.family!==d.family||b.textureFrame!==d.textureFrame||b.depthTest!==d.depthTest){b={family:d.family,textureFrame:d.textureFrame,depthTest:d.depthTest,positions:[],uvs:[],colors:[]};batches.push(b);}
  b.positions.push(...d.positions);b.uvs.push(...d.uvs);
  for(let i=0;i<vertices;i++){
   const c=color.setRGB(d.colors[i*3],d.colors[i*3+1],d.colors[i*3+2],T.SRGBColorSpace);
   b.colors.push(c.r,c.g,c.b,d.alphas[i]);
  }
 }
 return batches;
}

export function makeNativeEffectRenderer(root,{textures,renderOrder=20}={}){
 if(!root?.isObject3D)throw new TypeError('Supply native effect scene root');
 if(!Number.isFinite(renderOrder))throw new RangeError('Invalid effect render order');
 const owned=!textures,maps=textures||makeNativeEffectTextures();
 for(const [family,count]of Object.entries(counts))if(!Array.isArray(maps[family])||maps[family].length!==count||maps[family].some(t=>!t?.isTexture))throw new RangeError('Supply all native effect texture frames');
 const group=new T.Group();group.name='native-retained-effects';group.renderOrder=renderOrder;root.add(group);
 const meshes=[],materials=new Map();let disposed=false;
 function material(b){
  const key=b.family+':'+b.textureFrame+':'+b.depthTest;
  if(!materials.has(key)){
   const m=new T.MeshBasicMaterial({map:maps[b.family][b.textureFrame],vertexColors:true,transparent:true,depthWrite:false,depthTest:b.depthTest,side:T.DoubleSide,fog:false,toneMapped:false});
   m.forceSinglePass=true;materials.set(key,m);
  }
  return materials.get(key);
 }
 return {
  update(presentation){
   if(disposed)throw new Error('Native effect renderer is disposed');
   const batches=prepareNativeEffectBatches(presentation);
   for(let i=0;i<batches.length;i++){
    const b=batches[i],vertices=b.positions.length/3;let mesh=meshes[i];
    if(!mesh){mesh=new T.Mesh(new T.BufferGeometry(),material(b));mesh.name='native-effect-batch-'+i;mesh.frustumCulled=false;mesh.userData.dynamic=true;mesh.renderOrder=i;group.add(mesh);meshes.push(mesh);}
    let geometry=mesh.geometry;
    if(!geometry.getAttribute('position')||geometry.getAttribute('position').count<vertices){
     geometry.dispose();geometry=mesh.geometry=new T.BufferGeometry();const capacity=2**Math.ceil(Math.log2(vertices));
     for(const [key,size]of [['position',3],['uv',2],['color',4]])geometry.setAttribute(key,new T.BufferAttribute(new Float32Array(capacity*size),size).setUsage(T.DynamicDrawUsage));
    }
    for(const [key,values]of [['position',b.positions],['uv',b.uvs],['color',b.colors]]){const attribute=geometry.getAttribute(key);attribute.array.set(values);attribute.needsUpdate=true;}
    geometry.setDrawRange(0,vertices);mesh.material=material(b);mesh.visible=true;
   }
   for(let i=batches.length;i<meshes.length;i++)meshes[i].visible=false;
   return {batches:batches.length,triangles:batches.reduce((n,b)=>n+b.positions.length/9,0)};
  },
  dispose(){if(disposed)return;disposed=true;root.remove(group);for(const mesh of meshes)mesh.geometry.dispose();for(const m of materials.values())m.dispose();if(owned)for(const a of Object.values(maps))for(const t of a)t.dispose();}
 };
}
