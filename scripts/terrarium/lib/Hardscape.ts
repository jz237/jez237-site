import * as THREE from 'three';
import type {ScanSet} from './Assets';
import {groundHeight} from './Ground';
import type {Peaks} from './Peaks';

/**
 * Scanned CC0 stones stood on end as two mossy peaks with a cascade between
 * them, plus a scanned driftwood log for basking.
 */
export interface Placed {mesh: THREE.Mesh; walkable: boolean}

interface RockSpec {
  rock: number; pos: [number, number, number]; rot: [number, number, number]; scale: number; sink?: number; walkable?: boolean;
}

// Positions are in metres inside the case (x across, z toward the viewer).
const ROCKS: RockSpec[] = [
  // stones around the foot of the peaks and the pool
  {rock: 4, pos: [-0.48, 0, 0.17], rot: [0.1, 0.6, 0], scale: 0.03, sink: 0.012, walkable: true},
  {rock: 5, pos: [-0.03, 0, 0.18], rot: [0.1, -0.8, 0.05], scale: 0.026, sink: 0.012, walkable: true},
  {rock: 2, pos: [0.53, 0, -0.05], rot: [0, 1.2, 0.1], scale: 0.04, sink: 0.015},
  {rock: 3, pos: [-0.33, 0, -0.03], rot: [0.2, 2.1, 0.1], scale: 0.035, sink: 0.012},
  {rock: 2, pos: [0.33, 0, -0.04], rot: [0.1, 0.4, -0.1], scale: 0.032, sink: 0.012},
  {rock: 4, pos: [-0.05, 0, 0.06], rot: [0.15, 1.7, 0.1], scale: 0.026, sink: 0.01},
  {rock: 5, pos: [0.43, 0, 0.15], rot: [0.05, 0.3, 0.1], scale: 0.024, sink: 0.035},
  {rock: 2, pos: [0.15, 0, 0.12], rot: [0.0, 2.6, 0.05], scale: 0.02, sink: 0.03},
];

export class Hardscape {
  readonly group = new THREE.Group();
  readonly placed: Placed[] = [];
  readonly log: THREE.Mesh;
  readonly rockMaterial: THREE.MeshStandardMaterial;

  constructor(scans: ScanSet, peaks: Peaks) {
    this.group.add(peaks.mesh);
    this.placed.push({mesh: peaks.mesh, walkable: false});
    const src = scans.rocks[0].material as THREE.MeshStandardMaterial;
    this.rockMaterial = src.clone();
    this.rockMaterial.color = new THREE.Color(1, 1, 1);
    this.rockMaterial.envMapIntensity = 0.7;
    const ao = new THREE.TextureLoader().load('./models/rock_moss_set_01/textures/rock_moss_set_01_ao_2k.jpg');
    ao.flipY = false;
    this.rockMaterial.aoMap = ao;
    this.rockMaterial.aoMapIntensity = 1;
    // Basalt: desaturate the scanned stone toward cool grey and grow moss on
    // the faces that look up.
    this.rockMaterial.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWN; varying vec3 vWP;')
        .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWN = normalize(mat3(modelMatrix) * objectNormal); vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', `#include <common>
varying vec3 vWN; varying vec3 vWP;
float rh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float rn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(rh(i), rh(i+vec3(1,0,0)), f.x), mix(rh(i+vec3(0,1,0)), rh(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(rh(i+vec3(0,0,1)), rh(i+vec3(1,0,1)), f.x), mix(rh(i+vec3(0,1,1)), rh(i+vec3(1,1,1)), f.x), f.y), f.z); }
float rf(vec3 p){ return 0.5*rn(p) + 0.25*rn(p*2.1+3.0) + 0.125*rn(p*4.3+7.0) + 0.0625*rn(p*8.7+1.0); }`)
        .replace('#include <map_fragment>', `#include <map_fragment>
{
  float lum = dot(diffuseColor.rgb, vec3(0.3, 0.55, 0.15));
  vec3 basalt = vec3(lum) * vec3(0.78, 0.8, 0.84) * 0.62;
  diffuseColor.rgb = mix(diffuseColor.rgb * 0.55, basalt, 0.72);
  float up = smoothstep(0.35, 0.85, vWN.y);
  float n = rf(vWP * 38.0);
  float moss = smoothstep(0.55, 0.75, up * 0.75 + n * 0.55);
  vec3 mossC = mix(vec3(0.035, 0.07, 0.012), vec3(0.11, 0.17, 0.03), rf(vWP * 140.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, mossC, moss);
  vRockMoss = moss;
}`)
        .replace('void main() {', 'float vRockMoss = 0.0;\nvoid main() {')
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.95, vRockMoss);');
    };
    this.rockMaterial.customProgramCacheKey = () => 'basalt-v1';
    // The rocks' AO map (second UV set not present) is applied through uv 0.
    for (const spec of ROCKS) {
      const srcMesh = scans.rocks[spec.rock];
      const geo = srcMesh.geometry.clone();
      geo.center();
      const mesh = new THREE.Mesh(geo, this.rockMaterial);
      mesh.rotation.set(...spec.rot);
      mesh.scale.setScalar(spec.scale);
      mesh.position.set(spec.pos[0], 0, spec.pos[2]);
      mesh.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(mesh);
      const ground = groundHeight(spec.pos[0], spec.pos[2]);
      mesh.position.y = ground - box.min.y - (spec.sink ?? 0.01) + spec.pos[1];
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.name = `rock-${spec.rock}`;
      this.group.add(mesh);
      this.placed.push({mesh, walkable: !!spec.walkable});
    }
    // Driftwood: a short section of the scanned trunk.
    const trunkGeo = scans.trunk.geometry.clone();
    trunkGeo.center();
    const trunkMat = (scans.trunk.material as THREE.MeshStandardMaterial).clone();
    trunkMat.color = new THREE.Color(0.62, 0.55, 0.48);
    this.log = new THREE.Mesh(trunkGeo, trunkMat);
    this.log.scale.setScalar(0.1);
    this.log.rotation.set(0.02, 0.2, 0.06);
    this.log.position.set(-0.375, 0, 0.085);
    this.log.updateMatrixWorld(true);
    const lb = new THREE.Box3().setFromObject(this.log);
    this.log.position.y = groundHeight(-0.375, 0.085) - lb.min.y - 0.022;
    this.log.castShadow = this.log.receiveShadow = true;
    this.log.name = 'log';
    this.group.add(this.log);
    this.placed.push({mesh: this.log, walkable: true});
  }
}
