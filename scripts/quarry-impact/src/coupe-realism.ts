import * as T from 'three';
import { finishPaint } from './car-materials';

// Coupe-only finish: keep the two other cars and the physical vehicle model
// unchanged. All grain is derivative-filtered, with no new texture requests.
export function configureCoupe(root: T.Group) {
  const configured = new Set<T.Material>();
  root.traverse(o => {
    if (!(o instanceof T.Mesh)) return;
    const m = o.material as T.MeshPhysicalMaterial;
    // Door trim and concealed crash structures follow the same local contact
    // field as the skin. A dent must not expose an intact seat/door insert
    // protruding through the displaced sheet. Wheel hardware stays on pivots.
    if (o.parent === root && o.name.startsWith('detail_') &&
        (/^Interior|^Structure/.test(m.name) || m.name === 'Material_2' || m.name === 'Panel Sides')) {
      o.name = 'panel_inner_' + o.name.slice(7);
      o.geometry = o.geometry.clone();
      o.userData.original = new Float32Array(o.geometry.attributes.position.array);
      o.userData.originalNormals = new Float32Array(o.geometry.attributes.normal.array);
      o.userData.damage = 0;
      o.geometry.setAttribute('impactWear', new T.BufferAttribute(new Float32Array(o.geometry.attributes.position.count * 2), 2));
    }
    if (o.name.startsWith('panel_')) {
      const g = o.geometry;
      g.setAttribute('restPosition', new T.BufferAttribute(new Float32Array(o.userData.original), 3));
      g.setAttribute('impactAxis', new T.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    }
    if (configured.has(m)) return;
    configured.add(m);
    if (m.name.startsWith('paint')) {
      const trim = m.name.includes('Paint 2');
      m.metalness = trim ? .08 : .32;
      m.roughness = trim ? .32 : .27;
      m.normalScale.setScalar(.018);
      m.clearcoat = trim ? .45 : .95;
      m.clearcoatRoughness = .16;
      m.envMapIntensity = .82;
      finishPaint(m);
      const base = m.onBeforeCompile;
      m.onBeforeCompile = (s, renderer) => {
        base.call(m, s, renderer);
        s.vertexShader = s.vertexShader
          .replace('attribute vec2 impactWear;', 'attribute vec2 impactWear; attribute vec3 restPosition; attribute vec3 impactAxis; varying vec3 vImpactAxis;')
          .replace('vBodyPosition = position;', 'vBodyPosition = restPosition; vImpactAxis = impactAxis;');
        s.fragmentShader = s.fragmentShader
          .replace('varying vec3 vBodyPosition;', 'varying vec3 vImpactAxis; varying vec3 vBodyPosition;')
          .replace('float grain=bodyNoise(vBodyPosition*340.);', 'float grain=mix(bodyNoise(vBodyPosition*340.),.5,clamp(length(fwidth(vBodyPosition))*340.,0.,1.));')
          .replace('1.-smoothstep(.3,1.05,vBodyPosition.y)', '1.-smoothstep(.24,.72,vBodyPosition.y)')
          .replace('lowBody*(.18+silt*.16)+vImpactWear.x*.18', 'lowBody*(.10+silt*.12)+vImpactWear.x*.12')
          .replace('float scrapeLines=smoothstep(.75,.96,abs(sin(vBodyPosition.y*235.+vBodyPosition.z*29.+sin(vBodyPosition.x*12.))));', `
float across=dot(vBodyPosition,vImpactAxis)*310.;
float alias=clamp(fwidth(across),0.,1.);
float scrapeLines=mix(smoothstep(.65,.92,abs(sin(across+bodySilt(vBodyPosition*21.)*2.))),.24,alias);`)
          .replace('vec3(.22,.24,.24),bareMetal*.9', 'vec3(.38,.40,.41),bareMetal*.95')
;
        // PhysicalMaterial's clearcoat amount is assigned in lights_physical;
        // remove it from scraped metal after that assignment, before lighting.
        s.fragmentShader = s.fragmentShader.replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= 1.-clamp(bareMetal+scratch*.5+dust*.7,0.,1.);\nmaterial.clearcoatRoughness=clamp(material.clearcoatRoughness+dust*.42+scratch*.24,.04,1.);\n#endif');
      };
      m.customProgramCacheKey = () => 'coupe-paint-contact-wear-1';
    } else if (o.name.startsWith('glass_')) {
      m.color.setHex(0x34404c); m.opacity = .24; m.metalness = .04;
      m.roughness = .065; m.envMapIntensity = .9;
    } else if (/Headlight|Brakelight/.test(m.name)) {
      m.color.setHex(m.name.includes('Headlight') ? 0x18202b : 0x481010);
      m.roughness = .16; m.metalness = .1;
      m.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nattribute vec2 impactWear; attribute vec3 restPosition; varying vec2 vLampWear; varying vec3 vLampPosition;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLampWear=impactWear; vLampPosition=restPosition;');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying vec2 vLampWear; varying vec3 vLampPosition;')
          .replace('#include <color_fragment>', `#include <color_fragment>
float lampBreak=smoothstep(.12,.68,vLampWear.x);
float cell=fract(sin(dot(floor(vLampPosition*95.),vec3(31.7,87.1,13.4)))*23819.7);
if(vLampWear.x>.74 && cell<.32) discard;
float prism=abs(sin(vLampPosition.x*146.));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.13,.14,.15),lampBreak*.75);
diffuseColor.rgb+=vec3(.2)*lampBreak*smoothstep(.91,.97,prism);`)
          .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
float optics=mix(.065,1.,smoothstep(.4,.62,prism));
totalEmissiveRadiance*=optics*(1.-lampBreak);`);
      };
      m.customProgramCacheKey = () => 'coupe-fractured-lens-1';
    } else if (m.name.startsWith('Tire')) {
      m.color.multiplyScalar(1.38); m.roughness = .88;
    } else if (m.name === 'Disc') {
      m.roughness = .42; m.metalness = .78;
    } else if (m.name.startsWith('Interior') || m.name === 'Material_2') {
      m.envMapIntensity = .38; m.roughness = Math.max(.6, m.roughness);
    }
  });
}

type DentCache = { restGeometric: Float32Array; groups: number[][] };
function dentCache(panel: T.Mesh): DentCache {
  if (panel.userData.dentCache) return panel.userData.dentCache;
  const rest = panel.userData.original as Float32Array;
  const authored = panel.userData.originalNormals as Float32Array;
  const geometry = panel.geometry.clone();
  geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(rest), 3));
  geometry.computeVertexNormals();
  const restGeometric = new Float32Array(geometry.attributes.normal.array);
  geometry.dispose();
  const groups = new Map<string, number[]>();
  for (let i = 0; i < rest.length / 3; i++) {
    // UV splits with the same authored normal weld; deliberate hard edges and
    // inner sheet faces remain separate. No spatial search during later hits.
    const key = `${rest[i*3]},${rest[i*3+1]},${rest[i*3+2]}:${Math.round(authored[i*3]*1000)},${Math.round(authored[i*3+1]*1000)},${Math.round(authored[i*3+2]*1000)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(i);
  }
  return panel.userData.dentCache = { restGeometric, groups: [...groups.values()] };
}

export function finishCoupeNormals(panel: T.Mesh) {
  const { restGeometric, groups } = dentCache(panel);
  const normal = panel.geometry.attributes.normal, authored = panel.userData.originalNormals as Float32Array;
  const p = new T.Vector3(), n = new T.Vector3(), sum = new T.Vector3();
  // Bodywork normals are packed floats. Preserve the original arithmetic and
  // Float32 writes while avoiding temporary vectors for every welded corner.
  const packed=normal instanceof T.BufferAttribute&&normal.array instanceof Float32Array&&normal.itemSize===3&&!normal.normalized?normal.array:null;
  for (const group of groups) {
    if(packed){
      let x=0,y=0,z=0;
      for(const i of group){const at=i*3;x+=(packed[at]-restGeometric[at])+authored[at];y+=(packed[at+1]-restGeometric[at+1])+authored[at+1];z+=(packed[at+2]-restGeometric[at+2])+authored[at+2];}
      const inverse=1/(Math.sqrt(x*x+y*y+z*z)||1);x*=inverse;y*=inverse;z*=inverse;
      for(const i of group){const at=i*3;packed[at]=x;packed[at+1]=y;packed[at+2]=z;}
    }else{
      sum.set(0, 0, 0);
      for (const i of group) {n.fromBufferAttribute(normal, i).sub(p.fromArray(restGeometric, i*3)).add(p.fromArray(authored, i*3));sum.add(n);}
      sum.normalize();for (const i of group) normal.setXYZ(i, sum.x, sum.y, sum.z);
    }
  }
  normal.needsUpdate = true;
}

export function stampCoupeImpact(panel:T.Mesh,contact:T.Vector3,direction:T.Vector3,damage:number){
  const normal=panel.geometry.attributes.normal,axis=panel.geometry.attributes.impactAxis;
  const rest=panel.userData.original as Float32Array,authored=panel.userData.originalNormals as Float32Array;
  const p=new T.Vector3(),n=new T.Vector3(),flow=new T.Vector3(),across=new T.Vector3();
  const radius=Math.min(1.48,.65+damage*.034);
  if (!axis) return;
  for (let i = 0; i < normal.count; i++) {
    if (p.fromArray(rest, i*3).distanceTo(contact) > radius) continue;
    n.fromArray(authored, i*3);
    flow.copy(direction).addScaledVector(n, -direction.dot(n));
    if (flow.lengthSq() < .001) flow.crossVectors(new T.Vector3(0,1,0), n);
    if (flow.lengthSq() < .001) flow.set(1,0,0);
    across.crossVectors(n, flow).normalize();
    axis.setXYZ(i, across.x, across.y, across.z);
  }
  axis.needsUpdate = true;
}

export function finishCoupeDent(panel:T.Mesh,contact:T.Vector3,direction:T.Vector3,damage:number){
  finishCoupeNormals(panel);stampCoupeImpact(panel,contact,direction,damage);
}

export function repairCoupePanel(panel: T.Mesh) {
  const axis = panel.geometry.attributes.impactAxis;
  if (axis) { (axis.array as Float32Array).fill(0); axis.needsUpdate = true; }
}
