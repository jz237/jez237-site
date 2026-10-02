// Procedural botanical study. Geometry and palettes are illustrative, not a species scan.
import * as T from 'three';

export function createFlower() {
  const root = new T.Group(); root.name = 'botanical-flower';
  const spectral = [], dummy = new T.Object3D();
  let seed = 9271;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  function add(geo, material, parent = root) {
    const mesh = new T.Mesh(geo, material); mesh.layers.set(4); parent.add(mesh); return mesh;
  }
  function instances(geo, material, count, pose) {
    const mesh = new T.InstancedMesh(geo, material, count); mesh.layers.set(4);
    for (let i = 0; i < count; i++) { dummy.position.set(0,0,0); dummy.rotation.set(0,0,0); dummy.scale.set(1,1,1); pose(i, dummy); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix); }
    mesh.computeBoundingSphere(); root.add(mesh); return mesh;
  }
  const palettes = {
    petal: { normal: ['#7e243f','#d3487b','#fda5b5'], uv: ['#06234d','#1260a2','#7877ea'], thermal: ['#ffeb92','#ff573c','#691c83'] },
    leaf: { normal: ['#163c24','#4f7937','#90a650'], uv: ['#11233b','#1b4655','#376679'], thermal: ['#17205e','#234dac','#39aac2'] },
  };
  function maps(kind, mode) {
    const size = 512, canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
    const c = canvas.getContext('2d'), data = c.createImageData(size,size);
    const colors = palettes[kind][mode].map(v=>new T.Color(v));
    // Fine longitudinal ridges, branching venation, pigment flecks and UV absorption guides.
    for (let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const u=x/(size-1), v=y/(size-1), d=Math.abs(u-.5)*2;
      const ribs=Math.pow(.5+.5*Math.cos((u-.5)*78+Math.sin(v*15)*.9),12);
      const branches=Math.pow(.5+.5*Math.sin(v*105-d*19),20)*(1-d);
      const noise=(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;
      const color=colors[0].clone().lerp(colors[1],Math.min(1,v*1.8)).lerp(colors[2],Math.max(0,v-.25)*.7);
      color.multiplyScalar(.86 + ribs*.15 + branches*.10 + noise*.035);
      if (mode==='uv' && kind==='petal') {
        const guide=Math.exp(-Math.pow((u-.5)/(0.08+v*.03),2))*Math.max(0,1-v/.7);
        color.lerp(new T.Color('#8dfff2'), guide*.96);
        if (v<.38 && ribs>.8) color.lerp(new T.Color('#4ae5e0'),.45*(1-v/.38));
      }
      const j=(y*size+x)*4; data.data[j]=Math.min(255,color.r*255);data.data[j+1]=Math.min(255,color.g*255);data.data[j+2]=Math.min(255,color.b*255);data.data[j+3]=255;
    }
    c.putImageData(data,0,0);
    const map=new T.CanvasTexture(canvas); map.flipY=false; map.colorSpace=T.LinearSRGBColorSpace; map.anisotropy=4; return map;
  }
  function surface(kind) {
    const textures=Object.fromEntries(['normal','uv','thermal'].map(m=>[m,maps(kind,m)]));
    const material=new T.MeshPhysicalMaterial({map:textures.normal,bumpMap:textures.normal,bumpScale:.065,roughness:.64,side:T.DoubleSide,metalness:0,clearcoat:.06});
    spectral.push({material,textures,kind});return material;
  }
  const petalMat=surface('petal'), leafMat=surface('leaf');
  function ribbon(length,width,curve,serrated=false) {
    const positions=[],uv=[],indices=[],N=36,M=12;
    for(let j=0;j<=N;j++) for(let k=0;k<=M;k++) {
      const t=j/N,s=k/M*2-1,shape=Math.pow(Math.sin(Math.PI*t),serrated?.72:.45);
      const edge=serrated?1+.055*Math.sin(t*110):1+.025*Math.sin(t*71);
      positions.push(t*length,s*s*.30*shape + curve*t*t + .12*Math.sin(t*23+s*5)*shape, s*width*shape*edge);
      uv.push(k/M,t);
      if(j<N&&k<M){const a=j*(M+1)+k;indices.push(a,a+1,a+M+1,a+1,a+M+2,a+M+1);}
    }
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo;
  }
  const petalGeo=ribbon(10.8,1.6,-1.3);
  for(let layer=0;layer<2;layer++) for(let i=0;i<24;i++) {
    const a=i/24*Math.PI*2+layer*.14, r=2.8-layer*.4;
    const p=add(petalGeo,petalMat);p.position.set(Math.cos(a)*r,-layer*.34,Math.sin(a)*r);p.rotation.y=-a;
    p.rotation.z=(random()-.5)*.10;p.scale.set(1-layer*.13+(random()-.5)*.13,1,1+(random()-.5)*.18);
  }
  const green=new T.MeshStandardMaterial({color:0x526b2f,roughness:.85});
  const discMat=new T.MeshStandardMaterial({color:0x8e4821,roughness:.87});
  const gold=new T.MeshStandardMaterial({color:0xf2b83f,roughness:.68});
  const dark=new T.MeshStandardMaterial({color:0x673617,roughness:.72});
  const calyx=add(new T.SphereGeometry(3.8,40,20),green);calyx.scale.y=.35;calyx.position.y=-.4;
  const disc=add(new T.SphereGeometry(4.1,48,24),discMat);disc.scale.y=.43;
  // Golden-angle tubular disc florets, split anthers, and individual pollen grains.
  const count=420, positions=[];
  instances(new T.CylinderGeometry(.11,.19,.62,7),discMat,count,(i,o)=>{
    const r=3.95*Math.sqrt((i+.5)/count), a=i*2.3999632297,y=.30+1.38*Math.sqrt(1-r*r/17);
    o.position.set(Math.cos(a)*r,y,Math.sin(a)*r);o.rotation.z=-Math.cos(a)*r*.07;o.rotation.x=Math.sin(a)*r*.07;
    positions.push(o.position.clone());
  });
  instances(new T.TorusGeometry(.135,.046,5,8),gold,count,(i,o)=>{o.position.copy(positions[i]);o.position.y+=.35;o.rotation.x=Math.PI/2;});
  instances(new T.SphereGeometry(.070,6,4),dark,count,(i,o)=>{o.position.copy(positions[i]);o.position.y+=.36;o.scale.y=.45;});
  instances(new T.IcosahedronGeometry(.056,0),gold,2400,(i,o)=>{const p=positions[i%count];o.position.copy(p).add(new T.Vector3((random()-.5)*.45,.32+random()*.18,(random()-.5)*.45));o.scale.setScalar(.65+random()*.7);});
  const stemCurve=new T.CatmullRomCurve3([new T.Vector3(0,-.6,0),new T.Vector3(.5,-6,0),new T.Vector3(-.7,-13,1),new T.Vector3(-1.7,-22,1)]);
  add(new T.TubeGeometry(stemCurve,40,.52,14,false),green);
  const leafGeo=ribbon(9.7,2.0,.7,true);
  for(let i=0;i<4;i++) {
    const a=i*2.7+.7,l=add(leafGeo,leafMat);l.position.set(-i*.22,-6-i*3.2,.2);l.rotation.set(0,a,.3);l.scale.setScalar(1-i*.11);
    const veinGeo=new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,.03,0),new T.Vector3(4.8,.23,0),new T.Vector3(9.7,.75,0)]),20,.038,5,false);
    add(veinGeo,green,l);
  }
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2,s=add(ribbon(4.4,.5,-.8),leafMat);s.position.y=-.45;s.rotation.y=a;}
  const hairMat=new T.MeshStandardMaterial({color:0xc5d298,roughness:.85});
  instances(new T.ConeGeometry(.012,.23,3),hairMat,700,(i,o)=>{const t=random(),a=random()*Math.PI*2;o.position.copy(stemCurve.getPoint(t));o.position.x+=Math.cos(a)*.53;o.position.z+=Math.sin(a)*.53;o.rotation.z=-Math.cos(a)*1.4;o.rotation.x=Math.sin(a)*1.4;});
  const dewMat=new T.MeshPhysicalMaterial({color:0xd9f4ff,metalness:0,roughness:.05,transparent:true,opacity:.65,clearcoat:1,ior:1.33});
  const dew=instances(new T.SphereGeometry(1,12,8),dewMat,13,(i,o)=>{const a=i*2.39996,r=6+random()*4;o.position.set(Math.cos(a)*r,-.12-r*r*.006,Math.sin(a)*r);o.scale.setScalar(.14+random()*.14);o.scale.y*=.75;});
  let current='normal';
  function setSensor(mode) {
    if(mode===current)return;current=mode;
    for(const {material,textures} of spectral){material.map=textures[mode];material.emissiveMap=mode==='normal'?null:textures[mode];material.emissive.setHex(mode==='normal'?0:0xffffff);material.emissiveIntensity=mode==='normal'?0:.5;material.needsUpdate=true;}
    discMat.color.setHex(mode==='uv'?0x0ca99f:mode==='thermal'?0xffad32:0x8e4821);
    gold.color.setHex(mode==='uv'?0xbaffcf:mode==='thermal'?0xffed9a:0xf2b83f);
    dark.color.setHex(mode==='uv'?0x095365:mode==='thermal'?0xc73554:0x673617);
    green.color.setHex(mode==='normal'?0x526b2f:mode==='uv'?0x123c4d:0x173b8a);dew.visible=mode==='normal';
  }
  root.userData.detail={petals:48,florets:count,pollenGrains:2400,stemHairs:700};
  return {root,setSensor};
}
