// Reuses the site's Stunt Car Racer woodland atlas. Crossed, fixed planes
// give parallax from every driving angle without per-tree camera updates.
// Fine leaves, bark and branch shading live in one shared mipmapped texture.
import * as THREE from 'three';
import { makeRng } from './noise.js?v=polish2';

export function woodlandMaterial(path = './assets/textures/woodland.png') {
  // Transparent first paint while the local atlas loads (never white cards).
  const map = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
  map.needsUpdate = true;
  const mat = new THREE.MeshLambertMaterial({
    map, vertexColors: true, side: THREE.DoubleSide, alphaTest: 0.42,
  });
  new THREE.TextureLoader().load(path, texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    mat.map = texture;
    if(mat.lodDepth){mat.lodDepth.map=texture;mat.lodDepth.needsUpdate=true;}
    mat.needsUpdate = true;
    map.dispose();
  });
  // Cull back faces for the shadow pass only: no duplicate shadow fragments.
  mat.shadowSide = THREE.FrontSide;
  mat.onBeforeCompile = shader => {
    // Leaves receive sky light on both sides; flipping the deliberately
    // upward normals would make back-facing cards almost black.
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_begin>',
      '#include <normal_fragment_begin>\nnormal *= faceDirection;',
    );
  };
  mat.customProgramCacheKey = () => 'woodland-two-sided-crown-v1';
  return mat;
}

function card(width, height, bottom, angle, bounds, tint = 0xffffff, tilt = 0) {
  const g = new THREE.PlaneGeometry(width, height);
  const uv = g.attributes.uv;
  const [u0, v0, u1, v1] = bounds;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
  }
  g.rotateX(tilt);
  g.rotateY(angle);
  g.translate(0, bottom + height / 2, 0);
  const p = g.attributes.position, n = g.attributes.normal;
  const c = new THREE.Color(tint), colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    // Upward crown normals keep the baked leaf detail softly lit, avoiding
    // the alternating bright/dark rectangles of flat billboard lighting.
    const normal = new THREE.Vector3(p.getX(i) * 0.12, 1, p.getZ(i) * 0.12).normalize();
    n.setXYZ(i, normal.x, normal.y, normal.z);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return g;
}

// Bounds avoid the adjacent species and transparent outside padding.
const OAK = [0.003, 0.005, 0.497, 0.576];
const FIR = [0.515, 0.005, 0.992, 0.987];
const CROWN = [0.035, 0.205, 0.465, 0.565];

export function woodlandParts(species) {
  const fir = species === 0, slender = species === 2;
  const h = fir ? 8 : slender ? 6 : 6.8;
  const w = fir ? 4.15 : slender ? 4.1 : 6.1;
  const tint = slender ? 0xd4e2b4 : fir ? 0xe0e8d7 : 0xf0edda;
  const parts = [];
  for (let i = 0; i < 3; i++) {
    parts.push(card(w * (i === 1 ? 0.91 : 1), h, 0, i * Math.PI / 3, fir ? FIR : OAK, tint));
  }
  // A tilted interior crown gives the broadleaf canopy volume when looking
  // down from a ridge. It stays inside the three outer silhouettes.
  if (!fir) parts.push(card(w * 0.70, h * 0.44, h * 0.44, 0.5, CROWN, tint, -Math.PI * 0.38));
  return parts;
}

export function undergrowthParts() {
  return [0, Math.PI / 3, Math.PI * 2 / 3].map(a => card(1.8, 1.05, -0.12, a, CROWN, 0xb8c58b));
}

// Close-range tree models: real tapered trunks, connected limbs and spatial
// crown clusters. Only a small nearby pool renders these geometries.
export function nearTreeParts(species) {
  const wood=[], leaves=[], fir=species===0, slender=species===2;
  function branch(a,b,r0,r1) {
    const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),d=to.clone().sub(from),length=d.length();
    const g=new THREE.CylinderGeometry(r1,r0,length,6,1,true);
    const uv=g.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setY(i,uv.getY(i)*length*.8);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));
    g.translate(...from.add(to).multiplyScalar(.5).toArray());
    const c=new THREE.Color(slender?0xc4c1ab:0xb19c7c), colors=new Float32Array(g.attributes.position.count*3);
    for(let i=0;i<colors.length;i+=3)colors.set([c.r,c.g,c.b],i);
    g.setAttribute('color',new THREE.BufferAttribute(colors,3));wood.push(g);
  }
  // Individual leaf/needle sprays from First Light, oriented around each twig.
  // Full alpha cutouts preserve fine silhouettes; there are no clipped canopy discs.
  function spray(center, direction, w, h, tint, twigShift=0) {
    const along=new THREE.Vector3(...direction).normalize();
    // the needle texture's bare twig fills its left ~40%; sliding the card
    // outward buries that twig in the branch instead of showing a fishbone
    if(twigShift)center=[center[0]+along.x*w*twigShift,center[1]+along.y*w*twigShift,center[2]+along.z*w*twigShift];
    const axis=Math.abs(along.y)>.9?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0);
    const across=new THREE.Vector3().crossVectors(along,axis).normalize();
    const cross=new THREE.Vector3().crossVectors(along,across).normalize();
    for(const side of [across,cross]) {
      const g=new THREE.PlaneGeometry(1,1),p=g.attributes.position,n=g.attributes.normal;
      const c=new THREE.Color(tint),colors=new Float32Array(p.count*3);
      const face=new THREE.Vector3().crossVectors(along,side).normalize();
      // Partial sky bend, retaining local canopy shading and depth.
      if(face.y<0)face.negate();face.lerp(new THREE.Vector3(0,1,0),.38).normalize();
      for(let i=0;i<p.count;i++) {
        const u=p.getX(i)*w,v=p.getY(i)*h;
        p.setXYZ(i,center[0]+along.x*u+side.x*v,center[1]+along.y*u+side.y*v,center[2]+along.z*u+side.z*v);
        n.setXYZ(i,face.x,face.y,face.z);colors.set([c.r,c.g,c.b],i*3);
      }
      g.setAttribute('color',new THREE.BufferAttribute(colors,3));leaves.push(g);
    }
  }
  const rng=makeRng(612+species),h=fir?8:slender?6:6.8;
  branch([0,-.05,0],[.08,h*.48,0],slender?.11:.18,.09);
  branch([.08,h*.48,0],[-.12,h,0.06],.09,.008);
  if(fir){
    for(let layer=0;layer<10;layer++){
      const y=.85+layer*.72,radius=2.04-layer*.19;
      for(let side=0;side<5;side++){
        const a=side*Math.PI*2/5+layer*2.399,dx=Math.cos(a),dz=Math.sin(a);
        branch([0,y+.25,0],[dx*radius,y-.15,dz*radius],.027,.004);
        // Denser, fanned tufts: random yaw and droop, bigger toward the tip,
        // darker toward the trunk where the crown shades itself.
        for(let j=0;j<9;j++) {
          const f=.14+j*.11,sideAngle=a+(j%2?-1:1)*(.35+rng()*.75);
          const w=(.82-layer*.046)*(.9+rng()*.35)*(1.1-f*.2);
          const droop=-.32*f+(rng()-.5)*.3;
          const shade=new THREE.Color(0x8f9c7d).lerp(new THREE.Color(0xcdd8b6),Math.min(1,f*1.15)).getHex();
          spray([dx*radius*f,y+.1-f*.3+(rng()-.5)*.12,dz*radius*f],
            [Math.cos(sideAngle),droop,Math.sin(sideAngle)],w,w*.9,shade,.2);
        }
      }
    }
    spray([-.1,7.75,.05],[.05,1,.1],.7,.55,0xd4dbb6);
  } else {
    for(let i=0;i<9;i++){
      const a=i*2.399,rad=(slender?.84:1.35)*(i%2?.85:1.1);
      const x=Math.cos(a)*rad,z=Math.sin(a)*rad,y=3.5+(i%3)*.72;
      branch([.03,2.1+i*.17,0],[x,y,z],.065,.012);
      for(let j=0;j<26;j++) {
        const az=rng()*Math.PI*2,vertical=rng()*2-1,r=Math.sqrt(1-vertical*vertical);
        const spread=slender?.9:1.15,dx=Math.cos(az)*r,dz=Math.sin(az)*r;
        const c=[x+dx*spread,y+.55+vertical*1.05,z+dz*spread];
        const w=.62+rng()*.24;
        spray(c,[dx,.25+vertical*.6,dz],w,w*.88,slender?0xd4dfb9:0xe0ddbd);
      }
    }
  }
  return {wood,leaves};
}

export function nearLeafMaterial(fir) {
  return woodlandMaterial('./assets/textures/near-'+(fir?'needle':'leaf')+'.webp');
}
