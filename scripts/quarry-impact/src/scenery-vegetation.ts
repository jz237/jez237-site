import { nearTrees, saplingPlacements, landscapeHeight, scenerySurfaceHeight, quarryRim, overlapsQuarryRoadside } from './quarry-layout';
import { roadsideSaplings, roadsideGroundCover } from './scenery-flora-placement';
import { backdropFirs, composeForestBackdrop, BACKDROP_CENTER, type BackdropCard } from './scenery-backdrop';
import { composeNorthHeadwallBackdrop } from './scenery-north-backdrop';
import { composeNorthForestCards, loadNorthForest, type NorthSaplingPart } from './scenery-north-forest';
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
    ground?: number;
    width?: number;
    backdrop?: boolean;
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
    backdrop: boolean;
    levels: Map<number, Map<T.Mesh, TreeBatch>>;
};
async function scannedForest(parent: T.Group, file: string, large: boolean) {
    const gltf = await new GLTFLoader().loadAsync(url(file));
    gltf.scene.updateMatrixWorld(true);
    const cells = new Map<string, Cell>(), geometries = new Map<T.Mesh, T.BufferGeometry>();
    const northSaplings: NorthSaplingPart[] = [];
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
        // Filter after the original slice so the new approach does not populate
        // previously empty distant areas with replacement procedural saplings.
        const placements: Plant[] = large ? [
            ...nearTrees('fir-' + variant),
            ...(level === 1 ? backdropFirs(variant) : []),
        ] : [
            ...saplingPlacements(variant).slice(0, 12).filter(p => !overlapsQuarryRoadside(p.x, p.z)),
            ...roadsideSaplings(variant),
        ];
        for (const plant of placements) {
            // The distant firs share one bounded patch per variant, rather
            // than paying another three material draws for every isolated trunk.
            const cx = plant.backdrop ? BACKDROP_CENTER.x : Math.floor(plant.x / 56) * 56 + 28;
            const cz = plant.backdrop ? BACKDROP_CENTER.z : Math.floor(plant.z / 56) * 56 + 28;
            const key = (plant.backdrop ? 'backdrop:' : '') + cx + ':' + cz;
            if (!cells.has(key))
                cells.set(key, { x: cx, z: cz, backdrop: !!plant.backdrop, levels: new Map() });
            const cell = cells.get(key)!;
            if (!cell.levels.has(level))
                cell.levels.set(level, new Map());
            const batches = cell.levels.get(level)!;
            const scale = plant.height / normalization.height;
            const ground = plant.ground ?? (large ? scenerySurfaceHeight(plant.x, plant.z) : landscapeHeight(plant.x, plant.z));
            dummy.position.set(plant.x - cx, ground - normalization.bottom * scale, plant.z - cz);
            dummy.rotation.set(0, plant.yaw, 0);
            dummy.scale.set(scale * (plant.width ?? 1), scale, scale * (plant.width ?? 1));
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
        lod.name = cell.backdrop ? 'backdrop-fir-cell' : large ? 'scanned-fir-cell' : 'sapling-cell';
        lod.autoUpdate = false;
        lod.position.set(cell.x, 0, cell.z);
        for (const [level, batches] of [...cell.levels.entries()].sort((a, b) => a[0] - b[0])) {
            const group = new T.Group();
            for (const batch of batches.values()) {
                const mesh = new T.InstancedMesh(batch.geometry, batch.material, batch.matrices.length);
                batch.matrices.forEach((matrix, i) => { mesh.setMatrixAt(i, matrix); mesh.setColorAt(i, batch.colors[i]); });
                mesh.computeBoundingSphere();
                // This branch geometry remains a distant silhouette from all
                // driving views; it does not expand the moving shadow workload.
                mesh.castShadow = !cell.backdrop;
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
    for (const [index, tree] of gltf.scene.children.entries()) {
        const variant = large ? variantOf(tree.name) : index;
        const level = large && tree.name.endsWith('_FAR') ? 1 : 0;
        const normalization = normalizers.get(large ? String(variant) : tree.name)!;
        tree.traverse(object => {
            if (!(object instanceof T.Mesh)) return;
            const material = forestMaterials.get((large ? 'medium:' : 'sapling:') + (object.material as T.Material).name)!;
            // Reuse the existing uploaded geometry as well as its maps. The new
            // stand instances apply the same normalization in their transforms.
            const geometry = geometries.get(object)!;
            northSaplings.push({ variant, level, sourceHeight: normalization.height,
                sourceBottom: normalization.bottom, geometry, material });
        });
    }
    // All cells keep full 360-degree coverage. The renderer culls their bounded
    // geometry independently for the main view, reflection cube faces and shadows.
    return northSaplings;
}
export async function forestScenery(parent: T.Group, random: () => number) {
    const textures = new T.TextureLoader(), dummy = new T.Object3D();
    const track = Array.from({ length: 120 }, (_, i) => trackPoint(i / 120));
    const clearOfRoad = (x: number, z: number, margin = 10) => track.every(p => Math.hypot(x - p.x, z - p.z) > margin);
    // Mix silhouettes at the distant forest edge without increasing tree count.
    // Card widths follow their source images instead of stretching every species
    // to the same cone. Nearby trees remain scanned branch geometry.
    const distantSpecies = [
        { kind: 'pine', count: 110, aspect: 461 / 1024, minHeight: 12, heightRange: 14 },
        { kind: 'spruce', count: 96, aspect: 402 / 1024, minHeight: 11, heightRange: 13 },
        { kind: 'hemlock', count: 88, aspect: 486 / 1024, minHeight: 10, heightRange: 12 },
        { kind: 'maple', count: 76, aspect: 712 / 1024, minHeight: 10, heightRange: 10 },
    ];
    let distantIndex=0;
    const originalCards: BackdropCard[] = [];
    for (const { kind, count, minHeight, heightRange } of distantSpecies) {
        for (let i = 0; i < count; i++) {
            // Preserve the original six random draws per tree, including trees
            // being recomposed locally, so all later grass is unchanged.
            const azimuth=random(),depth=random(),size=random(),stand=distantIndex%12;
            const center=stand/12*Math.PI*2+Math.sin(stand*2.7)*.075;
            const width=.47+Math.sin(stand*1.8+.6)*.085;
            const a=center+(azimuth-.5)*width;
            const front=distantIndex%5<3,offset=front?5+depth*13:22+depth*24;
            const r=Math.max(182,quarryRim(a).r+offset),x=Math.sin(a)*r*1.08,z=Math.cos(a)*r;
            const growth=T.MathUtils.clamp(.53+Math.sin(stand*2.13)*.21+(size-.5)*.38+(front?-.04:.08),0,1);
            originalCards.push({kind,x,z,ground:landscapeHeight(x,z),height:minHeight+growth*heightRange,
                color:[.82+random()*.16,.87+random()*.13,.85+random()*.15]});
            distantIndex++;
        }
    }
    const composedCards = composeNorthForestCards(composeNorthHeadwallBackdrop(composeForestBackdrop(originalCards)));
    for (const { kind, aspect } of distantSpecies) {
        const placements = composedCards.filter(p => p.kind === kind);
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
            // A photographed canopy already contains leaf-facing and internal
            // shade variation. Its lighting proxy must not use the arbitrary
            // +/-Z normal of the flat source card, or an opposite-side sun
            // turns the entire tree black. A world-up canopy response stays
            // consistent as this silhouette rotates in main/reflection views.
            // Override after DOUBLE_SIDED's face flip; preserve photograph,
            // instance tint, alpha test, fog and all existing PBR light hooks.
            shader.fragmentShader = shader.fragmentShader.replace('#include <normal_fragment_begin>', `
        #include <normal_fragment_begin>
        normal=transformDirection(vec3(0.0,1.0,0.0),viewMatrix);
        nonPerturbedNormal=normal;
      `);
            // Approximate the canopy's mixed projected leaf area instead of
            // lighting every photographed leaf as one upward opaque face.
            // Preserve indirect sky/fill response and the photo's own shading.
            shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_end>', `
        #include <lights_fragment_end>
        reflectedLight.directDiffuse *= 0.5;
        reflectedLight.directSpecular *= 0.5;
      `);
        };
        material.customProgramCacheKey = () => 'quarry-distant-tree-billboard-canopy-v3';
        const geo = new T.PlaneGeometry(aspect, 1);
        geo.translate(0, .5, 0);
        const trees = new T.InstancedMesh(geo, material, placements.length);
        // Baked photographs supply fine twig silhouettes; their shadow maps would add
        // little at this distance and previously tripled alpha-tested overdraw.
        trees.castShadow = false;
        trees.receiveShadow = false;
        for (const [i, plant] of placements.entries()) {
            dummy.position.set(plant.x, plant.ground, plant.z);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(plant.height * (plant.width ?? 1), plant.height, plant.height);
            dummy.updateMatrix();
            trees.setMatrixAt(i, dummy.matrix);
            trees.setColorAt(i, new T.Color().setRGB(...plant.color));
        }
        trees.computeBoundingSphere();
        parent.add(trees);
    }
    const northMedium: NorthSaplingPart[] = [];
    for (const variant of ['a', 'b', 'c'])
        northMedium.push(...await scannedForest(parent, 'models/fir-medium-' + variant + '.glb', true));
    const northSaplings = await scannedForest(parent, 'models/fir-saplings-lod.glb', false);
    const p: number[] = [], colors: number[] = [], idx: number[] = [];
    const addBlade = (x: number, z: number, h: number, a: number, brown: boolean,
        ground = landscapeHeight(x, z), suppressed = false, shade = .7 + random() * .35, width = 1) => {
        // Even suppressed old tufts consume their former color random draw,
        // preserving every procedural blade outside the authored footprint.
        if (suppressed) return;
        const w = h * .04 * width, dx = Math.cos(a), dz = Math.sin(a), bend = h * .28;
        const n = p.length / 3;
        p.push(x - dx * w, ground, z - dz * w, x + dx * w, ground, z + dz * w, x + Math.sin(a) * bend - dx * w * .5, ground + h * .65, z + Math.cos(a) * bend - dz * w * .5, x + Math.sin(a) * bend + dx * w * .5, ground + h * .65, z + Math.cos(a) * bend + dz * w * .5, x + Math.sin(a) * bend * 1.7, ground + h, z + Math.cos(a) * bend * 1.7);
        const color = new T.Color(brown ? 0x877854 : 0x5a6843);
        color.multiplyScalar(shade);
        for (let i = 0; i < 5; i++)
            colors.push(color.r * (.62 + i * .075), color.g * (.62 + i * .075), color.b * (.62 + i * .075));
        idx.push(n, n + 1, n + 2, n + 1, n + 3, n + 2, n + 2, n + 3, n + 4);
    };
    for (let i = 0; i < 560; i++) {
        const a = random() * Math.PI * 2, r = 108 + random() * 40, x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (!clearOfRoad(x, z, 8.2))
            continue;
        const brown = random() > .5;
        const suppressed = overlapsQuarryRoadside(x, z, .7);
        for (let j = 0; j < 8; j++)
            addBlade(x + (random() - .5) * .75, z + (random() - .5) * .75, .25 + random() * .65, random() * 6.28, brown, undefined, suppressed);
    }
    for (const blade of roadsideGroundCover())
        addBlade(blade.x, blade.z, blade.height, blade.yaw, blade.brown, blade.ground, false, blade.shade, blade.width);
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const grasses = new T.Mesh(geo, new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide }));
    grasses.receiveShadow = true;
    parent.add(grasses);
    forestLODs.push(...await loadNorthForest(parent, forestMaterials, northSaplings, northMedium));
}
