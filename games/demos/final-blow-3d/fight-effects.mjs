import * as THREE from 'three';

// A bounded pool keeps rapid combinations from allocating meshes every frame.
export class FightEffects {
  constructor(scene) {
    this.scene=scene;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.sparkGeometry=new THREE.PlaneGeometry(1,1);
    this.ringGeometry=new THREE.RingGeometry(.94,1,48);
    this.pool=[];this.cursors={spark:0,trail:0,ring:0};this.previous=new Map();
    for(let i=0;i<160;i++) {
      const material=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,depthTest:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});
      if(i<144){material.defines={USE_UV:''};material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec2 centered=vUv-0.5;
diffuseColor.a *= exp(-dot(centered,centered)*22.0) * (1.0-smoothstep(0.35,0.5,max(abs(centered.x),abs(centered.y))));`);};}
      const mesh=new THREE.Mesh(i<144?this.sparkGeometry:this.ringGeometry,material);
      mesh.visible=false;mesh.frustumCulled=false;mesh.renderOrder=10;scene.add(mesh);
      this.pool.push({mesh,velocity:new THREE.Vector3(),life:0,total:1,size:1,ring:i>=144});
    }
    this.lights=[0,1].map(()=>{const l=new THREE.PointLight(0xffbd65,0,2);scene.add(l);return l;});
  }
  emit(position,color,life,size,velocity,ring=false,trail=false) {
    const kind=ring?'ring':trail?'trail':'spark';
    const start=ring?144:trail?96:0,count=ring?16:trail?48:96;
    const p=this.pool[start+(this.cursors[kind]++%count)];
    p.mesh.position.copy(position);p.mesh.material.color.set(color);p.mesh.material.opacity=.85;
    p.mesh.visible=true;p.mesh.rotation.set(0,0,Math.random()*Math.PI);
    p.life=p.total=life;p.size=size;p.velocity.copy(velocity);p.mesh.scale.setScalar(size);
    return p;
  }
  impact(event,target,move) {
    const blocked=event.type==='block',low=event.move==='sweep';
    const pos=new THREE.Vector3(target.x+target.face*.30,low?.43:(event.move==='kick'?1.44:2.06),.6);
    const color=blocked?0x7bdcff:0xffcc79;
    const heavy=['cross','straight','uppercut','high','sweep'].includes(event.move);
    const count=this.reduced?5:heavy?26:18;
    for(let i=0;i<count;i++) {
      const a=Math.PI*2*i/count+Math.random()*.2,speed=1.2+Math.random()*2.8;
      const p=this.emit(pos,color,.30+Math.random()*.20,.065+Math.random()*.045,new THREE.Vector3(Math.cos(a)*speed,Math.sin(a)*speed,.2));
      p.mesh.scale.x*=3;p.mesh.rotation.z=a;
    }
    if(!this.reduced){this.emit(pos,color,.32,blocked?.17:.20,new THREE.Vector3(),true);
      this.emit(pos,0xfff2d5,.14,heavy?.22:.16,new THREE.Vector3());
      const l=this.lights[event.target];l.position.copy(pos);l.color.set(color);l.intensity=heavy?2:1;
    }
    if(low&&!blocked)for(let i=0;i<8;i++)this.emit(new THREE.Vector3(target.x,.06,.45),0x947452,.34,.07,new THREE.Vector3((Math.random()-.5)*2,.2+Math.random()*.5,0));
  }
  trail(index,visual,fighter,dt) {
    if(dt<=0)return;
    const active=!this.reduced&&fighter.state==='attack';
    const feet=['kick','high','sweep'].includes(fighter.move);
    const names=feet?['LeftFoot','RightFoot']:['LeftHand','RightHand'];
    for(const name of ['LeftFoot','RightFoot','LeftHand','RightHand']) {
      const key=index+name,bone=visual.model.getObjectByName(name);if(!bone)continue;
      const pos=bone.getWorldPosition(new THREE.Vector3());pos.z+=.12;
      const previous=this.previous.get(key);
      if(active&&names.includes(name)&&previous?.serial===fighter.serial) {
        const delta=pos.clone().sub(previous.position),distance=delta.length();
        if(distance>.018&&distance<.65) {
          const steps=Math.min(5,Math.ceil(distance/.05));
          for(let j=0;j<steps;j++) {
            const p=this.emit(previous.position.clone().lerp(pos,(j+1)/steps),index?0x79ddff:0xffc177,.20,feet?.075:.055,new THREE.Vector3(),false,true);
            p.mesh.material.opacity=.4;
          }
        }
      }
      this.previous.set(key,{position:pos,serial:fighter.serial});
    }
  }
  update(dt) {
    for(const p of this.pool)if(p.life>0) {
      p.life=Math.max(0,p.life-dt);const fade=p.life/p.total;
      p.mesh.visible=p.life>0;p.mesh.material.opacity=fade*(p.ring?.65:1);
      p.mesh.position.addScaledVector(p.velocity,dt);
      if(p.ring)p.mesh.scale.setScalar(p.size*(1+(1-fade)*2));
      else {p.velocity.y-=dt*2;p.mesh.scale.multiplyScalar(Math.exp(-dt*1.5));}
    }
    for(const light of this.lights)light.intensity*=Math.exp(-dt*28);
  }
  clear(){for(const p of this.pool){p.life=0;p.mesh.visible=false;}for(const l of this.lights)l.intensity=0;this.previous.clear();}
}
