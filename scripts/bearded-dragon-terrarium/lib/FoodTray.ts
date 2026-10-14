import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {mulberry32, dataTexture, tileFbm} from './Textures';

export const FOOD_PORTIONS = 14;
export const FOOD_HEIGHT = .027;

/** Closed carved-stone bowl: a thick chipped rim, outward walls and an upward-facing basin. */
export function foodTrayGeometry(radius: number) {
  const R = radius * 1.13;
  // Trace the underside, exterior, lip and basin in order so every face points out of the stone.
  const profile = [[0,-.003],[R*.65,-.003],[R*.90,-.002],[R*.98,0],
    [R*.99,.005],[R*.98,.011],[R,.018],[R*.99,.023],[R*.96,.026],
    [R*.87,.0255],[R*.82,.023],[R*.80,.019],[R*.77,.012],[R*.70,.0065],
    [R*.52,.006],[R*.28,.006],[0,.006]].map(([r,y]) => new THREE.Vector2(r,y));
  const geometry = new THREE.LatheGeometry(profile, 96), p = geometry.getAttribute('position');
  const facets=[1.00,.98,1.045,1.015,.97,1.03,.985,1.04,.975,1.01,.98,1.03];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = p.getY(i), angle = Math.atan2(z,x), r = Math.hypot(x,z);
    const sector=(angle+Math.PI)/(Math.PI*2)*facets.length, a=Math.floor(sector)%facets.length, f=sector-Math.floor(sector);
    const outline = THREE.MathUtils.lerp(facets[a],facets[(a+1)%facets.length],f)+.006*Math.sin(angle*23+.4);
    const outer = THREE.MathUtils.smoothstep(r, R*.78, R*.96);
    const cut = outer*(.0008*Math.sin(angle*17+y*470) + .0005*Math.sin(angle*31-y*320));
    const rim = THREE.MathUtils.smoothstep(y,.010,.021);
    const chips = .0013*Math.max(0,Math.sin(angle*13+.7))**6;
    p.setXYZ(i,(x*outline+Math.cos(angle)*cut)*1.08,
      y+rim*(.0006*Math.sin(angle*9)+.00045*Math.sin(angle*21)-chips),
      (z*outline+Math.sin(angle)*cut)*.86);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function trayMaterial(photo?: THREE.Texture) {
  const grain = dataTexture(256,256,(x,y,out) => {
    const n=tileFbm(x/18,y/18,16,3,39), fine=Math.sin(x*127.1+y*311.7)*.07;
    out[0]=out[1]=out[2]=105+n*66+fine*55;
  },false);
  const material = new THREE.MeshStandardMaterial({color:0xa49c8c,roughness:.94,bumpMap:grain,bumpScale:.00065,flatShading:true});
  material.onBeforeCompile = shader => {
    if (photo) shader.uniforms.uTrayStone = {value:photo};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTrayP; varying vec3 vTrayN;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvTrayP=position;vTrayN=normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vTrayP;varying vec3 vTrayN;
${photo?'uniform sampler2D uTrayStone;':''}`)
      .replace('#include <color_fragment>',`#include <color_fragment>
${photo?`vec3 weights=pow(abs(normalize(vTrayN)),vec3(4.));weights/=max(.001,weights.x+weights.y+weights.z);
vec3 stone=texture2D(uTrayStone,vTrayP.yz*13.).rgb*weights.x+texture2D(uTrayStone,vTrayP.xz*13.).rgb*weights.y+texture2D(uTrayStone,vTrayP.xy*13.).rgb*weights.z;
stone=mix(vec3(dot(stone,vec3(.2126,.7152,.0722))),stone,.35);
diffuseColor.rgb*=mix(vec3(1.),stone*1.8,.76);`:''}
float strata=sin(vTrayP.y*1500.+sin(vTrayP.x*410.+vTrayP.z*390.)*2.);
diffuseColor.rgb*=.94+.055*strata;
diffuseColor.rgb*=mix(.86,1.08,smoothstep(.012,.024,vTrayP.y));`);
  };
  material.customProgramCacheKey=()=>`carved-food-tray-${!!photo}-v1`;
  return material;
}

/** A cupped torn leaf with a crinkled edge and pale midrib, rather than a flat polygon. */
function saladLeaf(length: number, width: number, seed: number) {
  const random=mulberry32(seed), N=20,S=8,vertices:number[]=[],uv:number[]=[],colors:number[]=[],indices:number[]=[];
  const green=new THREE.Color([0x326d20,0x427f25,0x568a2d,0x28612a][seed%4]);
  const phase=random()*6.28;
  for(let j=0;j<=N;j++) for(let k=0;k<=S;k++) {
    const t=j/N,s=k/S*2-1;
    const lobes=.88+.10*Math.sin(t*39+phase)+.04*Math.sin(t*83);
    const half=Math.sin(Math.PI*t)**.64*width*.5*lobes;
    const y=.0016*Math.sin(t*Math.PI)-.0008*s*s+.0009*Math.sin(t*21+s*8+phase)*Math.abs(s)+.0013*(t-.5)**2;
    vertices.push((t-.5)*length,y,s*half);uv.push(k/S,t);
    const rib=Math.exp(-s*s*130),light=.88+random()*.10+rib*.34;
    colors.push(green.r*light+rib*.015,green.g*light+rib*.025,green.b*light);
  }
  for(let j=0;j<N;j++) for(let k=0;k<S;k++) {const a=j*(S+1)+k,b=a+S+1;indices.push(a,b,a+1,a+1,b,b+1);}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  return geometry;
}

function greensMaterial() {
  const material=new THREE.MeshPhysicalMaterial({color:0xffffff,vertexColors:true,roughness:.72,side:THREE.DoubleSide,clearcoat:.05,clearcoatRoughness:.65});
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vSaladUv;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvSaladUv=uv;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vSaladUv;')
      .replace('#include <color_fragment>',`#include <color_fragment>
float mid=exp(-abs(vSaladUv.x-.5)*190.);
float branches=pow(max(0.,cos((vSaladUv.y+abs(vSaladUv.x-.5)*.55)*95.)),28.)*(1.-smoothstep(.34,.50,abs(vSaladUv.x-.5)));
diffuseColor.rgb*=1.+mid*.22+branches*.13;`);
  };
  material.customProgramCacheKey=()=> 'torn-salad-leaf-v1';return material;
}

export function createFoodTray(centre: THREE.Vector3, radius: number, photo?: THREE.Texture) {
  const bowl=new THREE.Mesh(foodTrayGeometry(radius),trayMaterial(photo));bowl.name='chipped-oval-stone-food-tray';
  bowl.position.copy(centre);bowl.castShadow=bowl.receiveShadow=true;
  const random=mulberry32(23714), greens=greensMaterial();
  const flesh=dataTexture(128,128,(x,y,out)=>{
    const pulp=tileFbm(x/12,y/12,12,3,72),fibres=Math.sin(x*.55+Math.sin(y*.10)*2);
    out[0]=out[1]=out[2]=226+pulp*23+fibres*4;
  });
  const vegetables=[0xe0a331,0xd78927,0xf1bd54].map(color=>new THREE.MeshStandardMaterial({color,map:flesh,bumpMap:flesh,bumpScale:.00008,roughness:.69}));
  const portions: THREE.Group[]=[];
  for(let i=0;i<FOOD_PORTIONS;i++) {
    const portion=new THREE.Group(),angle=i*2.39996+.3, r=Math.sqrt((i+.5)/FOOD_PORTIONS)*radius*.60;
    portion.name='salad-bite-portion';
    portion.position.set(centre.x+Math.cos(angle)*r*1.08,centre.y+.012+(1-r/(radius*.68))*.007,centre.z+Math.sin(angle)*r*.86);
    for(let j=0;j<4;j++) {
      const leaf=new THREE.Mesh(saladLeaf(.017+random()*.009,.008+random()*.005,i*7+j+11),greens);
      leaf.position.set((random()-.5)*.011,j*.0023,(random()-.5)*.010);
      leaf.rotation.set((random()-.5)*.40,random()*Math.PI*2,(random()-.5)*.35);
      leaf.castShadow=leaf.receiveShadow=true;portion.add(leaf);
    }
    for(let j=0;j<2;j++) {
      const w=.005+random()*.0035,h=.004+random()*.003;
      const depth=.005+random()*.003;
      const geometry=(i+j)%4===0 ? new THREE.CylinderGeometry(w*.43,w*.48,h*.75,18) : new RoundedBoxGeometry(w,h,depth,3,.0010);
      const p=geometry.getAttribute('position');
      for(let k=0;k<p.count;k++) {const x=p.getX(k),y=p.getY(k),z=p.getZ(k);p.setXYZ(k,x*(1+y/h*.22)+y*.10,y,z*(1-x/w*.13));}
      geometry.computeVertexNormals();
      const cube=new THREE.Mesh(geometry,vegetables[(i+j)%3]);
      cube.position.set((random()-.5)*.017,.010+h*.5+j*.0018,(random()-.5)*.015);
      cube.rotation.set((random()-.5)*.35,random()*Math.PI*2,(random()-.5)*.35);
      cube.castShadow=cube.receiveShadow=true;portion.add(cube);
    }
    portions.push(portion);
  }
  return {bowl,portions};
}
