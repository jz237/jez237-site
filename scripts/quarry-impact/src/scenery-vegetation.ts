import { nearTrees, saplingPlacements, landscapeHeight } from './quarry-layout';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { url } from './assets';
import { trackPoint } from './rules';
const forestLODs: T.LOD[] = [];
const forestMaterials = new Map<string, T.MeshStandardMaterial>();
export function updateForestView(camera: T.Camera) {
    for (const lod of forestLODs)
        lod.update(camera);
}
type Plant = {
    x: number;
    z: number;
    height: number;
    yaw: number;
};
type TreeBatch = {
    material: T.MeshStandardMaterial;
    geometry: T.BufferGeometry;
    matrices: T.Matrix4[];
    colors: T.Color[];
};
type Cell = {
    x: number;
    z: number;
    levels: Map<number, Map<T.Mesh, TreeBatch>>;
};
async function scannedForest(parent: T.Group, file: string, large: boolean) {
    const gltf = await new GLTFLoader().loadAsync(url(file));
    gltf.scene.updateMatrixWorld(true);
    const cells = new Map<string, Cell>(), geometries = new Map<T.Mesh, T.BufferGeometry>();
    const dummy = new T.Object3D(), normalizers = new Map<string, {
        height: number;
        bottom: number;
    }>();
    const variantOf = (name: string) => name.includes('medium_a') ? 0 : name.includes('medium_b') ? 1 : 2;
    for (const tree of gltf.scene.children) {
        if (large && !tree.name.endsWith('_NEAR'))
            continue;
        const key = large ? String(variantOf(tree.name)) : tree.name;
        const bounds = new T.Box3().setFromObject(tree);
        normalizers.set(key, { height: bounds.max.y - bounds.min.y, bottom: bounds.min.y });
    }
    for (const [index, tree] of gltf.scene.children.entries()) {
        const variant = large ? variantOf(tree.name) : index;
        const level = large && tree.name.endsWith('_FAR') ? 1 : 0;
        const normalization = normalizers.get(large ? String(variant) : tree.name)!;
        const placements: Plant[] = large ? nearTrees('fir-' + variant) : saplingPlacements(variant).slice(0, 12);
        for (const plant of placements) {
            const cx = Math.floor(plant.x / 56) * 56 + 28, cz = Math.floor(plant.z / 56) * 56 + 28, key = cx + ':' + cz;
            if (!cells.has(key))
                cells.set(key, { x: cx, z: cz, levels: new Map() });
            const cell = cells.get(key)!;
            if (!cell.levels.has(level))
                cell.levels.set(level, new Map());
            const batches = cell.levels.get(level)!;
            const scale = plant.height / normalization.height;
            dummy.position.set(plant.x - cx, landscapeHeight(plant.x, plant.z) - normalization.bottom * scale, plant.z - cz);
            dummy.rotation.set(0, plant.yaw, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            // Keep each variant's PBR materials shared by every spatial cell and LOD.
            tree.traverse(o => {
                if (!(o instanceof T.Mesh))
                    return;
                const source = o.material as T.MeshStandardMaterial;
                const key = (large ? 'medium:' : 'sapling:') + source.name;
                if (!forestMaterials.has(key)) {
                    const m = source.clone();
                    m.transparent = false;
                    m.opacity = 1;
                    m.depthWrite = true;
                    m.roughness = 1;
                    m.envMapIntensity = .65;
                    m.vertexColors = false;
                    forestMaterials.set(key, m);
                }
                const material = forestMaterials.get(key)!;
                if (!geometries.has(o))
                    geometries.set(o, o.geometry.clone().applyMatrix4(o.matrixWorld));
                if (!batches.has(o))
                    batches.set(o, { material, geometry: geometries.get(o)!, matrices: [], colors: [] });
                const batch = batches.get(o)!;
                const tint = .88 + ((Math.sin(plant.x * 12.7 + plant.z * 3.4) * 437.7) % 1) * .07;
                batch.matrices.push(dummy.matrix.clone());
                batch.colors.push(new T.Color(tint * .96, tint, tint * .94));
            });
        }
    }
    for (const cell of cells.values()) {
        const lod = new T.LOD();
        lod.name = large ? 'scanned-fir-cell' : 'sapling-cell';
        lod.autoUpdate = false;
        lod.position.set(cell.x, 0, cell.z);
        for (const [level, batches] of [...cell.levels.entries()].sort((a, b) => a[0] - b[0])) {
            const group = new T.Group();
            for (const batch of batches.values()) {
                const mesh = new T.InstancedMesh(batch.geometry, batch.material, batch.matrices.length);
                batch.matrices.forEach((matrix, i) => { mesh.setMatrixAt(i, matrix); mesh.setColorAt(i, batch.colors[i]); });
                mesh.computeBoundingSphere();
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                group.add(mesh);
            }
            lod.addLevel(group, level === 0 ? 0 : 55, .12);
            group.visible = level === 1 || !large;
        }
        parent.add(lod);
        forestLODs.push(lod);
    }
    // Variant GLBs repeat embedded images for portable static delivery. Only the
    // first named material owns runtime maps; discard later import copies before
    // renderer upload, preserving maps still referenced by shared materials.
    const retainedMaps = new Set<T.Texture>();
    for (const m of forestMaterials.values())
        for (const value of Object.values(m))
            if (value instanceof T.Texture)
                retainedMaps.add(value);
    const importedMaterials = new Set<T.Material>();
    gltf.scene.traverse(o => { if (o instanceof T.Mesh)
        for (const m of (Array.isArray(o.material) ? o.material : [o.material]))
            importedMaterials.add(m); });
    const disposedMaps = new Set<T.Texture>();
    for (const m of importedMaterials) {
        for (const value of Object.values(m))
            if (value instanceof T.Texture && !retainedMaps.has(value) && !disposedMaps.has(value)) {
                value.dispose();
                disposedMaps.add(value);
            }
        m.dispose();
    }
    // All cells keep full 360-degree coverage. The renderer culls their bounded
    // geometry independently for the main view, reflection cube faces and shadows.
}
export async function forestScenery(parent: T.Group, random: () => number) {
    const textures = new T.TextureLoader(), dummy = new T.Object3D();
    const track = Array.from({ length: 120 }, (_, i) => trackPoint(i / 120));
    const clearOfRoad = (x: number, z: number, margin = 10) => track.every(p => Math.hypot(x - p.x, z - p.z) > margin);
    for (const kind of ['pine', 'spruce']) {
        const photo = textures.load(url('models/' + kind + '.webp'));
        photo.colorSpace = T.SRGBColorSpace;
        photo.anisotropy = 8;
        const material = new T.MeshStandardMaterial({ map: photo, alphaTest: .45, roughness: 1, color: 0xb6beb2, side: T.DoubleSide });
        // Distant trees use a single camera-facing photographic silhouette. No crossed
        // cards overlap the real branch geometry along the accessible forest edge.
        material.onBeforeCompile = shader => {
            shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
        vec3 center=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;
        float width=length(instanceMatrix[0].xyz), height=length(instanceMatrix[1].xyz);
        vec3 cameraRight=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));
        vec3 billboard=center+cameraRight*position.x*width+vec3(0.0,position.y*height,0.0);
        vec4 mvPosition=viewMatrix*vec4(billboard,1.0);
        gl_Position=projectionMatrix*mvPosition;
      `);
        };
        material.customProgramCacheKey = () => 'quarry-distant-tree-billboard-v1';
        const geo = new T.PlaneGeometry(.64, 1);
        geo.translate(0, .5, 0);
        const trees = new T.InstancedMesh(geo, material, 185);
        // Baked photographs supply fine twig silhouettes; their shadow maps would add
        // little at this distance and previously tripled alpha-tested overdraw.
        trees.castShadow = false;
        trees.receiveShadow = false;
        for (let i = 0; i < 185; i++) {
            const a = random() * Math.PI * 2, r = 181 + random() * 95, x = Math.sin(a) * r * 1.08, z = Math.cos(a) * r;
            dummy.position.set(x, landscapeHeight(x, z), z);
            dummy.rotation.set(0, 0, 0);
            const h = 10 + random() * 16;
            dummy.scale.setScalar(h);
            dummy.updateMatrix();
            trees.setMatrixAt(i, dummy.matrix);
            trees.setColorAt(i, new T.Color().setRGB(.82 + random() * .16, .87 + random() * .13, .85 + random() * .15));
        }
        trees.computeBoundingSphere();
        parent.add(trees);
    }
    for (const variant of ['a', 'b', 'c'])
        await scannedForest(parent, 'models/fir-medium-' + variant + '.glb', true);
    await scannedForest(parent, 'models/fir-saplings-lod.glb', false);
    const p: number[] = [], colors: number[] = [], idx: number[] = [];
    const addBlade = (x: number, z: number, h: number, a: number, brown: boolean) => {
        const ground = landscapeHeight(x, z), w = h * .04, dx = Math.cos(a), dz = Math.sin(a), bend = h * .28;
        const n = p.length / 3;
        p.push(x - dx * w, ground, z - dz * w, x + dx * w, ground, z + dz * w, x + Math.sin(a) * bend - dx * w * .5, ground + h * .65, z + Math.cos(a) * bend - dz * w * .5, x + Math.sin(a) * bend + dx * w * .5, ground + h * .65, z + Math.cos(a) * bend + dz * w * .5, x + Math.sin(a) * bend * 1.7, ground + h, z + Math.cos(a) * bend * 1.7);
        const color = new T.Color(brown ? 0x877854 : 0x5a6843);
        color.multiplyScalar(.7 + random() * .35);
        for (let i = 0; i < 5; i++)
            colors.push(color.r * (.62 + i * .075), color.g * (.62 + i * .075), color.b * (.62 + i * .075));
        idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2, n + 2, n + 3, n + 4);
    };
    for (let i = 0; i < 560; i++) {
        const a = random() * Math.PI * 2, r = 108 + random() * 40, x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (!clearOfRoad(x, z, 8.2))
            continue;
        const brown = random() > .5;
        for (let j = 0; j < 8; j++)
            addBlade(x + (random() - .5) * .75, z + (random() - .5) * .75, .25 + random() * .65, random() * 6.28, brown);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const grasses = new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide }));
    grasses.receiveShadow = true;
    parent.add(grasses);
}
