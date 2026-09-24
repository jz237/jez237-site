// One bounded instanced draw for soft ground contact; no depth capture or AO pass.
import * as THREE from 'three';
import { getHeight, getNormal } from './terrain.js?v=polish1';
export class ContactShadows {
  constructor(scene) {
    this.capacity=64;this.timer=1;this.dummy=new THREE.Object3D();this.normal=new THREE.Vector3();
    const geometry=new THREE.PlaneGeometry(2,2);geometry.rotateX(-Math.PI/2);
    this.strength=new THREE.InstancedBufferAttribute(new Float32Array(96),1);geometry.setAttribute('aStrength',this.strength);
    const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,
      vertexShader:`attribute float aStrength;varying vec2 vContactUv;varying float vStrength;
        void main(){vContactUv=uv;vStrength=aStrength;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0);}`,
      fragmentShader:`varying vec2 vContactUv;varying float vStrength;
        void main(){float d=length(vContactUv*2.0-1.0);float a=(1.0-smoothstep(0.12,1.0,d))*vStrength;
          if(a<0.003)discard;gl_FragColor=vec4(0.065,0.080,0.065,a);}`});
    this.mesh=new THREE.InstancedMesh(geometry,material,96);this.mesh.count=0;this.mesh.frustumCulled=false;
    this.mesh.name='contact-shadows';this.mesh.renderOrder=-1;scene.add(this.mesh);
  }
  setCapacity(n){this.capacity=Math.min(96,n);this.timer=1;}
  update(dt,camera,foliage,player,enemies) {
    this.timer+=dt;if(this.timer<.1)return;this.timer=0;
    let count=0;
    const stamp=(x,z,rx,rz,yaw,strength,record)=>{
      if(count>=this.capacity)return;
      if(record?.contactMatrix){this.mesh.setMatrixAt(count,record.contactMatrix);this.strength.setX(count++,strength);return;}
      const d=this.dummy;getNormal(x,z,this.normal);
      d.position.set(x,getHeight(x,z)+.045,z);d.quaternion.setFromUnitVectors(THREE.Object3D.DEFAULT_UP,this.normal);
      d.rotateY(yaw);d.scale.set(rx,1,rz);d.updateMatrix();this.mesh.setMatrixAt(count,d.matrix);this.strength.setX(count++,strength);
      if(record)record.contactMatrix=d.matrix.clone();
    };
    const tanks=[];if(player)tanks.push(player);for(const e of enemies)tanks.push(e.tank);
    for(const t of tanks)if(t.alive&&Math.hypot(t.pos.x-camera.position.x,t.pos.z-camera.position.z)<50){
      const ground=getHeight(t.pos.x,t.pos.z),altitude=t.visual.root.position.y-ground;
      if(altitude<2)stamp(t.pos.x,t.pos.z,1.55*t.scale,2.25*t.scale,t.visualYaw(),.30*THREE.MathUtils.clamp(1-altitude*.5,0,1));
    }
    const trees=foliage.treesNear(camera.position.x,camera.position.z,38);
    const nearby=trees.concat(foliage.rockContacts.filter(r=>Math.hypot(r.x-camera.position.x,r.z-camera.position.z)<38));
    const dist=r=>(r.x-camera.position.x)**2+(r.z-camera.position.z)**2;
    nearby.sort((a,b)=>dist(a)-dist(b));
    for(const r of nearby){if(count>=this.capacity)break;const tree=r.variant!==undefined,fade=1-THREE.MathUtils.smoothstep(Math.sqrt(dist(r)),28,38);
      stamp(r.x,r.z,r.scale*(tree?1.05:.94),r.scale*(tree?1.05:.8),0,(tree?.23:.29)*fade,r);}
    this.mesh.count=count;this.mesh.instanceMatrix.needsUpdate=true;this.strength.needsUpdate=true;
  }
}
