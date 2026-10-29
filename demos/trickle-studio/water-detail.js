import * as T from '../aquaclear-studio/vendor/three.module.js';
import {padLoading,outletActive,transport} from './dynamics.js?v=3';
const TAU=Math.PI*2,clamp=T.MathUtils.clamp,V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);

// Bounded, deterministic paths deflect around conservative media envelopes.
// These are teaching paths, not droplet/film CFD or exact rib collision solving.
export function createRoutes(balls){
 const routes=[];
 for(let hole=0;hole<63;hole++){
  const path=[];let x=-3.705+(hole%9)*.338,z=-1.10+Math.floor(hole/9)*.366;
  for(let step=0;step<=128;step++){
   const y=4.13-step*(3.13/128);let contact=false;
   for(let pass=0;pass<12;pass++)for(const b of balls){const dy=y-b.y,r=.266;if(Math.abs(dy)>=r)continue;const cross=Math.sqrt(r*r-dy*dy),dx=x-b.x,dz=z-b.z,d=Math.hypot(dx,dz);if(d<cross){const a=d>1e-6?Math.atan2(dz,dx):hole*2.399;x=b.x+Math.cos(a)*(cross+.003);z=b.z+Math.sin(a)*(cross+.003);contact=true;}}
   x=clamp(x,-3.96,-.73);z=clamp(z,-1.34,1.34);path.push({x,y,z,contact});
  }routes.push(path);
 }return routes;
}
export function sampleRoute(path,y,out){const f=clamp((4.13-y)/3.13*128,0,127.999),i=Math.floor(f),t=f-i,a=path[i],b=path[i+1];return out.set(a.x+(b.x-a.x)*t,y,a.z+(b.z-a.z)*t);}

export function createWaterDetail({root,group,media,bio,balls,focusIndex,dropMaterial}){
 const routes=createRoutes(balls),o=new T.Object3D(),p=V(),q=V(),axis=V(0,1,0),matrix=new T.Matrix4(),rotation=new T.Quaternion(),scale=V(),center=V();
 const beadMat=new T.MeshPhysicalMaterial({color:'#b5f0ec',roughness:.06,metalness:.04,transparent:true,opacity:.68,depthWrite:false,clearcoat:1,clearcoatRoughness:.04});
 const beads=new T.InstancedMesh(new T.SphereGeometry(.012,8,6),beadMat,bio.count*2);beads.name='water-on-ribs';media.add(beads);
 const film=new T.InstancedMesh(new T.TorusGeometry(.258,.0045,4,12,.62),beadMat.clone(),bio.count*2);film.material.opacity=.35;media.add(film);
 const frames=[];
 for(let i=0;i<bio.count;i++){bio.getMatrixAt(i,matrix);matrix.decompose(center,rotation,scale);for(let j=0;j<2;j++){const local=new T.Quaternion().setFromAxisAngle(V(0,1,0),((i+j*3)%7)*Math.PI/7),r=rotation.clone().multiply(local),u=V(1,0,0).applyQuaternion(r),v=V(0,1,0).applyQuaternion(r);frames.push({center:center.clone(),u,v,rotation:r,size:scale.x,top:Math.atan2(v.y,u.y),phase:(i*.618+j*.37)%1,hole:Math.round((center.x+3.705)/.338)+Math.round((center.z+1.1)/.366)*9});}}
 // A faint expanding crest, with per-instance alpha, at selected landing points.
 const ringMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{},vertexShader:'attribute float rippleAlpha;varying float fade;void main(){fade=rippleAlpha;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',fragmentShader:'varying float fade;void main(){gl_FragColor=vec4(.53,.86,.87,fade); #include <tonemapping_fragment>\n #include <colorspace_fragment>\n }'.replace('; #include',';\n #include')});
 const ringGeo=new T.RingGeometry(.91,1,40);ringGeo.setAttribute('rippleAlpha',new T.InstancedBufferAttribute(new Float32Array(42),1));const rings=new T.InstancedMesh(ringGeo,ringMat,42);rings.name='impact-ripples';group.add(rings);
 const splashes=new T.InstancedMesh(new T.SphereGeometry(.009,6,4),beadMat.clone(),84);splashes.material.opacity=.45;group.add(splashes);
 const inflow=new T.Mesh(new T.CylinderGeometry(.045,.065,.14,16),dropMaterial);inflow.position.set(-2.57,4.54,-.1);group.add(inflow);
 const wetPatch=new T.Mesh(new T.CircleGeometry(.28,40),new T.MeshBasicMaterial({color:'#629b9b',transparent:true,opacity:.24,depthWrite:false}));wetPatch.rotation.x=-Math.PI/2;wetPatch.position.set(-2.57,4.527,-.1);group.add(wetPatch);
 // Restrained procedural light patterns; not physical photon transport.
 const floorLights=new T.Group();root.add(floorLights);const lightUniforms={clock:{value:0},strength:{value:1}};
 const lightMat=new T.ShaderMaterial({uniforms:lightUniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,vertexShader:'varying vec2 p;void main(){p=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 p;uniform float clock,strength;void main(){vec2 v=p*vec2(15.,10.);float a=sin(v.x*1.7+sin(v.y+clock*.7))+cos(v.y*2.3+cos(v.x-clock*.5));float b=sin(v.y*1.3+sin(v.x*.8-clock*.4));float crest=pow(1.-abs(sin(a*1.8+b)),18.);float edge=smoothstep(0.,.06,min(min(p.x,1.-p.x),min(p.y,1.-p.y)));gl_FragColor=vec4(.28,.59,.60,crest*.14*strength*edge);}`});
 for(const [w,d,x,y,z] of [[4.80,2.95,-1.65,.107,0],[3.20,2.95,2.44,.107,0],[5.0,2.30,1.35,5.38,-.15]]){const plane=new T.Mesh(new T.PlaneGeometry(w,d),lightMat);plane.rotation.x=-Math.PI/2;plane.position.set(x,y,z);floorLights.add(plane);}
 // Shallow distributor film, beneath the pad, visible when inspecting the tray.
 const pool=new T.Mesh(new T.PlaneGeometry(3.06,2.57,30,24),new T.MeshPhysicalMaterial({color:'#76c8d2',roughness:.12,transparent:true,opacity:.30,depthWrite:false,clearcoat:1,side:T.DoubleSide}));pool.rotation.x=-Math.PI/2;pool.position.set(-2.35,4.215,0);group.add(pool);
 const weir=new T.Mesh(new T.PlaneGeometry(.75,.60,20,24),pool.material.clone());weir.material.opacity=.36;group.add(weir);
 let last={};
 function update(state,h,flow,drops,sheet){
  const delivery=transport(state,h),loading=padLoading(state);
  const clock=state.flowTime??state.time*(.55+h.flow*.55),moving=flow>.005,waterLevel=Math.min(3.02,h.collectionLevel),wetVisible=state.amount<.02&&state.care<0&&!state.isolated&&delivery.film>.005;
  beads.visible=film.visible=wetVisible;inflow.visible=delivery.drain>.005&&group.visible;pool.visible=weir.visible=moving;floorLights.visible=group.visible;lightUniforms.clock.value=clock;lightUniforms.strength.value=.3+h.flow*.7;
  const openTray=['cutaway','flow','overflow'].includes(state.mode)&&state.selected==='tray',bottom=openTray?pool.position.y:4.525;inflow.position.y=(4.55+bottom)/2;inflow.scale.y=(4.55-bottom)/.14;wetPatch.visible=delivery.drain>.005&&group.visible&&!openTray;wetPatch.scale.setScalar(.7+h.flow*.5);
  for(let i=0;i<630;i++){const hole=i%63,age=(clock+i*.618)%1,y=4.13-(4.13-waterLevel)*Math.pow(age,1.20),active=outletActive(hole,loading);sampleRoute(routes[hole],y,p);sampleRoute(routes[hole],Math.max(waterLevel,y-.025),q);o.position.copy(p);q.sub(p);if(q.lengthSq()<1e-9)q.set(0,-1,0);o.quaternion.setFromUnitVectors(axis,q.normalize());o.scale.set(.85,1.2+age*.65,.85);if(!active||!moving||((i*.317)%1)>Math.min(1,flow*3))o.scale.setScalar(.0001);o.updateMatrix();drops.setMatrixAt(i,o.matrix);}drops.instanceMatrix.needsUpdate=true;drops.visible=moving;
  let wetBeads=0;for(let i=0;i<frames.length;i++){const f=frames[i],t=(clock*.25+f.phase)%1,a=f.top+Math.min(1,t/.72)*Math.PI,r=.258*f.size,active=outletActive(Math.max(0,Math.min(62,f.hole)),loading)&&((i*.317)%1)<Math.min(1,delivery.film*4)&&(state.mode!=='media'||Math.floor(i/2)===focusIndex);const point=f.center.clone().addScaledVector(f.u,Math.cos(a)*r).addScaledVector(f.v,Math.sin(a)*r),tangent=f.u.clone().multiplyScalar(-Math.sin(a)).addScaledVector(f.v,Math.cos(a)).normalize();o.position.copy(point);if(t>.93)o.position.y-=((t-.93)/.07)**2*.22;o.quaternion.setFromUnitVectors(axis,t>.72?V(0,-1,0):tangent);const swelling=t>.72?1+(Math.min(t,.93)-.72)*2.2:1;o.scale.set(.85*swelling,1.35*swelling,.85*swelling);if(!active||point.y<waterLevel)o.scale.setScalar(.0001);else wetBeads++;o.updateMatrix();beads.setMatrixAt(i,o.matrix);o.position.copy(f.center);o.quaternion.copy(f.rotation).multiply(new T.Quaternion().setFromAxisAngle(V(0,0,1),a-.31));o.scale.setScalar(active&&point.y>waterLevel?f.size:.0001);o.updateMatrix();film.setMatrixAt(i,o.matrix);}beads.instanceMatrix.needsUpdate=true;film.instanceMatrix.needsUpdate=true;
  const alpha=ringGeo.attributes.rippleAlpha;for(let i=0;i<42;i++){const hole=(i*17)%63,active=outletActive(hole,loading),t=(clock*.8+i*.618)%1;sampleRoute(routes[hole],waterLevel,p);o.position.set(p.x,waterLevel+.012,p.z);o.rotation.set(-Math.PI/2,0,0);const radius=.025+t*.17;o.scale.set(radius,radius*.88,1);o.updateMatrix();rings.setMatrixAt(i,o.matrix);alpha.setX(i,active&&moving?.32*Math.sin(t*Math.PI)*(1-t):0);}alpha.needsUpdate=true;rings.instanceMatrix.needsUpdate=true;rings.visible=moving;
  for(let i=0;i<84;i++){const hole=(i*17)%63,t=(clock*1.2+i*.618)%1,a=i*2.399;sampleRoute(routes[hole],waterLevel,p);o.position.set(p.x+Math.cos(a)*t*.07,waterLevel+Math.sin(t*Math.PI)*(.035+(i%4)*.009),p.z+Math.sin(a)*t*.07);o.rotation.set(0,0,0);o.scale.setScalar(outletActive(hole,loading)?Math.sin(t*Math.PI):.0001);o.updateMatrix();splashes.setMatrixAt(i,o.matrix);}splashes.instanceMatrix.needsUpdate=true;splashes.visible=moving;
  const a=sheet.geometry.attributes.position,uv=sheet.geometry.attributes.uv;for(let i=0;i<a.count;i++){const u=uv.getX(i),t=1-uv.getY(i);a.setXYZ(i,(u-.5)*3,.25-t*.5,-Math.sin(t*Math.PI)*.08+Math.sin(u*39-clock*9)*.006*t);}a.needsUpdate=true;sheet.geometry.computeVertexNormals();
  const pa=pool.geometry.attributes.position;for(let i=0;i<pa.count;i++)pa.setZ(i,Math.sin(pa.getX(i)*13-clock*4)*Math.cos(pa.getY(i)*10)*.003*h.flow);pa.needsUpdate=true;pool.geometry.computeVertexNormals();pool.position.y=4.215+loading*.025;
  const wa=weir.geometry.attributes.position,wuv=weir.geometry.attributes.uv;for(let i=0;i<wa.count;i++){const t=1-wuv.getY(i),u=wuv.getX(i);wa.setXYZ(i,-.83+(u-.5)*(.75-t*.16),Math.min(6.40,h.displayLevel)-t*.46,.34-.15*Math.sin(t*Math.PI/2)+Math.sin(u*45-clock*5)*(.003+t*.009));}wa.needsUpdate=true;weir.geometry.computeVertexNormals();weir.visible=delivery.drain>.005&&group.visible&&h.displayLevel>6.40;
  last={wetBeads:wetVisible?wetBeads:0,routedStreams:63,ripplesVisible:rings.visible,distributionFilm:pool.visible,clock};
 }
 return {update,routes,snapshot:()=>last};
}
