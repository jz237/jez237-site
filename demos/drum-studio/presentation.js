import * as T from '../aquaclear-studio/vendor/three.module.js';

// Local photographic lighting rig. No changes to the other filtration exhibits.
export function studioEnvironment(renderer){
 const s=new T.Scene();s.background=new T.Color('#171e26');
 for(const [x,y,z,w,h,power,color] of [
  [-5,7,4,3,8,5,'#fff2dc'],[5,5,-4,2,7,6,'#c6e4ff'],
  [0,9,0,7,2,4,'#ffffff'],[0,3,8,8,1.4,2,'#d9f6ed'],[-6,2,-2,1,5,3,'#ffffff']]){
  const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(power),side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,1.5,0);s.add(p);
 }
 const pmrem=new T.PMREMGenerator(renderer),result=pmrem.fromScene(s,.06);pmrem.dispose();s.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return result;
}

export function studioFloor(){
 const floor=new T.Group();
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){vec2 p=(vUv-.5)*2.;float shadow=exp(-dot(p*vec2(1.1,1.8),p*vec2(1.1,1.8))*4.);gl_FragColor=vec4(.008,.018,.024,shadow*.62);}' });
 const contact=new T.Mesh(new T.PlaneGeometry(16,12),material);contact.rotation.x=-Math.PI/2;floor.add(contact);
 const receiver=new T.Mesh(new T.PlaneGeometry(24,24),new T.ShadowMaterial({color:'#07131b',opacity:.13,depthWrite:false}));receiver.rotation.x=-Math.PI/2;receiver.position.y=.002;receiver.receiveShadow=true;floor.add(receiver);return floor;
}
