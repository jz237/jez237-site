import { quarryRim, seededRandom } from './quarry-layout';
import { backdropGroundHeight, type BackdropCard } from './scenery-backdrop';
import north from './quarry-north-forest.json';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { url } from './assets';
import { loadNorthRidge } from './scenery-north-ridge';

export type NorthSaplingPart = { variant: number; level: number; sourceHeight: number; sourceBottom: number;
    geometry: T.BufferGeometry; material: T.MeshStandardMaterial };
const northCells: T.LOD[] = [];

/** On-demand diagnostics read the actual selected level and draw geometry. */
export function northForestDiagnostics(camera: T.Camera) {
    const position = new T.Vector3(); camera.getWorldPosition(position);
    return northCells.map(lod => {
        const level = lod.getCurrentLevel(); let triangles = 0, draws = 0;
        lod.levels[level]?.object.traverse(object => {
            if (!(object instanceof T.Mesh)) return;
            draws++;
            triangles += (object.geometry.index?.count ?? object.geometry.getAttribute('position').count) / 3
                * (object instanceof T.InstancedMesh ? object.count : 1);
        });
        return { id: lod.name, lod: level, visible: lod.visible, triangles, draws,
            distance: position.distanceTo(lod.getWorldPosition(new T.Vector3())) };
    });
}

/** New materials share all existing branch/needle normal and ARM maps. */
async function northMaterials(existing: ReadonlyMap<string, T.MeshStandardMaterial>) {
    const wood = existing.get('medium:fir_sapling_medium_branches');
    const twigs = existing.get('medium:fir_sapling_medium_twigs');
    if (!wood || !twigs) throw new Error('Load the shared fir PBR materials before the north forest');
    const loader = new T.TextureLoader();
    const load = async (file: string, color = false) => {
        const texture = await loader.loadAsync(url('assets/' + file));
        texture.flipY = false; texture.colorSpace = color ? T.SRGBColorSpace : T.NoColorSpace;
        texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.anisotropy = 8;
        return texture;
    };
    const needles = twigs.clone(); needles.name = 'north-fir-needles';
    needles.map = await load('north_fir_twig_diff.jpg', true);
    const trunks: T.MeshStandardMaterial[] = [];
    for (const variant of ['a', 'b']) {
        const [map, normalMap, arm] = await Promise.all([
            load(`north_fir_trunk_${variant}_diff.jpg`, true),
            load(`north_fir_trunk_${variant}_nor_gl.jpg`), load(`north_fir_trunk_${variant}_arm.jpg`),
        ]);
        const material = new T.MeshStandardMaterial({ name: 'north-fir-trunk-' + variant,
            map, normalMap, roughnessMap: arm, metalnessMap: arm, roughness: 1,
            metalness: 0, envMapIntensity: .65, side: T.DoubleSide });
        trunks.push(material);
    }
    // The official C trunk has no UV attribute. Its documented cylindrical
    // projection is encoded for this existing transformed branch photograph.
    trunks.push(wood);
    return { wood, needles, trunks };
}

/** Six bounded, 360-degree stands participate in normal per-pass culling. */
export async function loadNorthForest(parent: T.Group,
    existing: ReadonlyMap<string, T.MeshStandardMaterial>, saplings: readonly NorthSaplingPart[],
    medium: readonly NorthSaplingPart[]): Promise<T.LOD[]> {
    const materials = await northMaterials(existing);
    const decoder = new DRACOLoader().setDecoderPath(url('models/draco/')).setWorkerLimit(2);
    const loader = new GLTFLoader().setDRACOLoader(decoder);
    const sources = await Promise.all([0, 1, 2].map(v => loader.loadAsync(url(`models/quarry-north-fir-${v}.glb`))))
        .finally(() => decoder.dispose());
    const geometry = new Map<string, T.BufferGeometry>();
    for (const source of sources) {
        source.scene.updateMatrixWorld(true);
        source.scene.traverse(object => {
            if (!(object instanceof T.Mesh)) return;
            geometry.set(object.name, object.geometry.clone().applyMatrix4(object.matrixWorld));
            object.geometry.dispose();
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose();
        });
    }
    const dummy = new T.Object3D();
    for (const stand of north.stands) {
        const trees = north.trees.filter(tree => tree.stand === stand.id);
        const under = north.understory.filter(tree => tree.stand === stand.id);
        const young = north.mediumTrees.filter(tree => tree.stand === stand.id);
        const lod = new T.LOD(); lod.name = 'north-forest-' + stand.id; lod.autoUpdate = false;
        lod.position.set(stand.x, trees.reduce((sum, tree) => sum + tree.y, 0) / trees.length, stand.z);
        for (const [level, suffix] of ['near', 'far'].entries()) {
            const group = new T.Group(); group.name = lod.name + '-' + suffix;
            for (const variant of new Set(trees.map(tree => tree.variant))) {
                const placements = trees.filter(tree => tree.variant === variant);
                for (const part of ['Wood', 'Needles', 'Trunk']) {
                    const key = `NorthFir_${variant}_${suffix}_${part}`;
                    const source = geometry.get(key);
                    if (!source) throw new Error('Missing north forest mesh ' + key);
                    const material = part === 'Wood' ? materials.wood : part === 'Needles' ? materials.needles : materials.trunks[variant];
                    const mesh = new T.InstancedMesh(source, material, placements.length);
                    mesh.name = `${lod.name}-${suffix}-${variant}-${part}`;
                    placements.forEach((tree, i) => {
                        dummy.position.set(tree.x - lod.position.x, tree.y - lod.position.y, tree.z - lod.position.z);
                        dummy.rotation.set(0, tree.yaw, 0);
                        dummy.scale.set(tree.height * tree.width, tree.height, tree.height * tree.width);
                        dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
                    });
                    mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
                }
            }
            for (const part of saplings) {
                const placements = under.filter(plant => plant.variant === part.variant);
                if (!placements.length) continue;
                const mesh = new T.InstancedMesh(part.geometry, part.material, placements.length);
                mesh.name = `${lod.name}-${suffix}-understory-${part.variant}`;
                placements.forEach((plant, i) => {
                    const scale = plant.height / part.sourceHeight;
                    dummy.position.set(plant.x - lod.position.x, plant.y - lod.position.y - part.sourceBottom * scale, plant.z - lod.position.z);
                    dummy.rotation.set(0, plant.yaw, 0);
                    dummy.scale.set(scale * plant.width, scale, scale * plant.width);
                    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
                });
                mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
            }
            for (const part of medium.filter(part => part.level === level)) {
                const placements = young.filter(plant => plant.variant === part.variant);
                if (!placements.length) continue;
                const mesh = new T.InstancedMesh(part.geometry, part.material, placements.length);
                mesh.name = `${lod.name}-${suffix}-medium-${part.variant}`;
                placements.forEach((plant, i) => {
                    const scale = plant.height / part.sourceHeight;
                    dummy.position.set(plant.x - lod.position.x, plant.y - lod.position.y - part.sourceBottom * scale, plant.z - lod.position.z);
                    dummy.rotation.set(0, plant.yaw, 0);
                    dummy.scale.set(scale * plant.width, scale, scale * plant.width);
                    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
                });
                mesh.castShadow = true; mesh.receiveShadow = true; mesh.computeBoundingSphere(); group.add(mesh);
            }
            lod.addLevel(group, level ? north.lod.nearDistance : 0, north.lod.hysteresis);
            group.visible = level === 1;
        }
        parent.add(lod); northCells.push(lod);
    }
    await loadNorthRidge(parent, geometry, materials);
    return northCells;
}

/** Existing photo crowns form the rear of the authored 350°–45° woodland. */
export function composeNorthForestCards(original: readonly BackdropCard[]): BackdropCard[] {
    const random = seededRandom(529732);
    let local = 0;
    const assignment = [0, 4, 1, 5, 3, 2, 4, 1, 5, 0, 3, 2];
    return original.map(card => {
        const oldAngle = (Math.atan2(card.x / 1.08, card.z) * 180 / Math.PI + 360) % 360;
        if (oldAngle > 45 && oldAngle < 350) return card;
        const standIndex = assignment[local % assignment.length];
        const stand = north.stands[standIndex], layer = Math.floor(local / 6) % 2;
        const unwrapped = stand.angleDegrees < 350 ? stand.angleDegrees + 360 : stand.angleDegrees;
        let degrees = unwrapped + (random() + random() - 1) * [3.1, 3.6, 2.1, 4.1, 5, 4.1][standIndex];
        degrees = Math.max(350.2, Math.min(404.8, degrees));
        if (standIndex === 2) degrees = Math.min(degrees, 367.7);
        if (standIndex === 3) degrees = Math.max(degrees, 376);
        // Two overlapping rear layers leave the accessible front edge to real
        // branch geometry. The canopy is connected, not a row of isolated poles.
        const depth = stand.depth + 29 + layer * 18 + random() * 8;
        const growth = 14.5 + layer * 1.5 + random() * 3.5;
        const limit = card.kind === 'pine' ? 20 : card.kind === 'spruce' ? 19 : card.kind === 'hemlock' ? 18.5 : 18;
        const height = Math.min(limit, growth);
        const a = degrees * Math.PI / 180, radius = quarryRim(a).r + depth;
        const x = Math.sin(a) * radius * 1.08, z = Math.cos(a) * radius;
        local++;
        return { ...card, x, z, ground: backdropGroundHeight(x, z) - .025,
            height, width: .92 + random() * .15 };
    });
}
