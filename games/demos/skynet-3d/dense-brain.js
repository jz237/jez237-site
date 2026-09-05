import * as T from 'three';

// Dense neural volume. Two batched draws, no per-node meshes.
export function createDenseBrain(parent){
 let seed=837114;const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 const count=4800,radius=4.02,positions=[],phases=[],sizes=[],colors=[],points=[],cells=new Map(),cellSize=.8;
 const key=(x,y,z)=>`${x},${y},${z}`;
 for(let i=0;i<count;i++){
  const az=random()*Math.PI*2,y=random()*2-1,r=radius*Math.cbrt(random()),radial=Math.sqrt(1-y*y);
  const p=new T.Vector3(r*radial*Math.cos(az),r*y,r*radial*Math.sin(az));points.push(p);positions.push(...p.toArray());
  phases.push(random()*Math.PI*2);sizes.push(.55+random()*.65);
  colors.push(...(i%5===0?[.35,1.15,2.5]:[3.9,.018,.065]));
  const cell=key(Math.floor(p.x/cellSize),Math.floor(p.y/cellSize),Math.floor(p.z/cellSize));
  if(!cells.has(cell))cells.set(cell,[]);cells.get(cell).push(i);
 }
 const geometry=new T.BufferGeometry();
 for(const [name,values,size] of [['position',positions,3],['phase',phases,1],['size',sizes,1],['tint',colors,3]])geometry.setAttribute(name,new T.Float32BufferAttribute(values,size));
 const nodeMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
  uniforms:{time:{value:0},resolution:{value:innerHeight}},
  vertexShader:`uniform float time,resolution;attribute float phase,size;attribute vec3 tint;varying vec3 vTint;varying float vPulse;
   void main(){
    float firing=pow(max(0.,sin(time*(1.9+mod(phase,1.7))+phase)),14.);
    float wave=pow(max(0.,sin(length(position-vec3(-1.1,.8,.4))*2.3-time*1.45)),24.);
    vPulse=.012+firing*.9+wave*.42;vTint=tint;
    vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp(size*resolution*.18/-mv.z,1.5,24.);
   }`,
  fragmentShader:`varying vec3 vTint;varying float vPulse;
   void main(){vec2 p=gl_PointCoord-.5;float r2=dot(p,p);float core=exp(-r2*320.);float halo=exp(-r2*28.);
    float alpha=(core+halo*.28)*vPulse;if(alpha<.003)discard;
    gl_FragColor=vec4(vTint+core*.9,alpha);
   }`});
 nodeMaterial.userData.glow=true;
 const nodes=new T.Points(geometry,nodeMaterial);nodes.name='Dense brain interior nodes';parent.add(nodes);

 // Short nearest-neighbor axons give structure throughout the volume.
 const edges=new Set(),lines=[],along=[],edgePhase=[],edgeTint=[];
 for(let i=0;i<count;i++){
  const p=points[i],cx=Math.floor(p.x/cellSize),cy=Math.floor(p.y/cellSize),cz=Math.floor(p.z/cellSize),neighbors=[];
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
   for(const j of cells.get(key(cx+x,cy+y,cz+z))||[]){if(j===i)continue;const d=p.distanceToSquared(points[j]);if(d<1.05&&d>.005)neighbors.push({j,d})}
  }
  neighbors.sort((a,b)=>a.d-b.d);
  for(const {j} of neighbors.slice(0,4)){
   const id=i<j?`${i}:${j}`:`${j}:${i}`;if(edges.has(id))continue;edges.add(id);
   const phase=random()*6.283185;
   lines.push(...p.toArray(),...points[j].toArray());along.push(0,1);edgePhase.push(phase,phase);
   const tint=i%5===0?[.3,.9,1.7]:[2.2,.025,.065];edgeTint.push(...tint,...tint);
  }
 }
 const linksGeometry=new T.BufferGeometry();
 for(const [name,values,size] of [['position',lines,3],['along',along,1],['phase',edgePhase,1],['tint',edgeTint,3]])linksGeometry.setAttribute(name,new T.Float32BufferAttribute(values,size));
 const linkMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
  uniforms:{time:{value:0},resolution:{value:innerHeight}},
  vertexShader:`attribute float along,phase;attribute vec3 tint;varying float vAlong,vPhase;varying vec3 vTint;
   void main(){vAlong=along;vPhase=phase;vTint=tint;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float time;varying float vAlong,vPhase;varying vec3 vTint;
   void main(){float firing=pow(max(0.,sin(time*1.7+vPhase)),18.);
    float packet=exp(-pow((vAlong-fract(time*.6+vPhase))/.15,2.));
    gl_FragColor=vec4(vTint,.008+firing*(.035+.28*packet));
   }`});
 linkMaterial.userData.glow=true;
 const links=new T.LineSegments(linksGeometry,linkMaterial);links.name='Dense brain interior axons';parent.add(links);
 return {materials:[nodeMaterial,linkMaterial],nodeCount:count,linkCount:edges.size};
}
