import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ScanSet {
  rocks: THREE.Mesh[];
  trunk: THREE.Mesh;
  ferns: THREE.Mesh[];
  moss: THREE.Mesh[];
}

const BASE = './models/';

async function loadGltf(loader: GLTFLoader, url: string) {
  return new Promise<THREE.Group>((resolve, reject) => loader.load(url, (g) => resolve(g.scene), undefined, reject));
}

function meshes(root: THREE.Object3D) {
  const out: THREE.Mesh[] = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const m = o as THREE.Mesh;
      // Bake node translation away so every scan is centred on its own origin.
      m.geometry = m.geometry.clone();
      m.geometry.computeBoundingBox();
      out.push(m);
    }
  });
  return out;
}

export async function loadScans(manager?: THREE.LoadingManager): Promise<ScanSet> {
  const loader = new GLTFLoader(manager);
  const [rocks, trunk, ferns, moss] = await Promise.all([
    loadGltf(loader, `${BASE}rock_moss_set_01/rock_moss_set_01_2k.gltf`),
    loadGltf(loader, `${BASE}dead_tree_trunk_02/dead_tree_trunk_02_2k.gltf`),
    loadGltf(loader, `${BASE}fern_02/fern_02_2k.gltf`),
    loadGltf(loader, `${BASE}moss_01/moss_01_2k.gltf`),
  ]);
  const sortByName = (a: THREE.Mesh, b: THREE.Mesh) => a.name.localeCompare(b.name);
  return {
    rocks: meshes(rocks).sort(sortByName),
    trunk: meshes(trunk)[0],
    ferns: meshes(ferns).sort(sortByName),
    moss: meshes(moss).sort(sortByName),
  };
}
