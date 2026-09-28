// Exercise the real forest card renderer without decoding scanned trees or
// starting WebGL. Stop at its first GLB request, after all four card batches.
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { forestScenery } from '../src/scenery-vegetation';
import { seededRandom } from '../src/quarry-layout';

export async function captureForestCards() {
    const parent = new T.Group(), stop = new Error('card audit: scanned assets intentionally omitted');
    const loadTexture = T.TextureLoader.prototype.load, loadGLTF = GLTFLoader.prototype.loadAsync;
    const textures: T.Texture[] = [];
    T.TextureLoader.prototype.load = function (file: string) {
        const texture = new T.Texture(); texture.name = file; textures.push(texture); return texture;
    };
    GLTFLoader.prototype.loadAsync = async function () { throw stop; };
    // World seed9311 consumes170*7+290*8 aggregate and12*37 puddle draws
    // before forestScenery. This is the current real initial world sequence.
    const random = seededRandom(9311);
    for (let i = 0; i < 170 * 7 + 290 * 8 + 12 * 37; i++) random();
    try {
        try { await forestScenery(parent, random); }
        catch (error) { if (error !== stop) throw error; }
        const cards: { kind: string; matrix: number[]; color: number[] }[] = [];
        const matrix = new T.Matrix4(), color = new T.Color();
        for (const object of parent.children) {
            if (!(object instanceof T.InstancedMesh)) continue;
            const material = object.material as T.MeshStandardMaterial;
            const kind = material.map!.name.match(/([^/]+)\.webp$/)![1];
            for (let i = 0; i < object.count; i++) {
                object.getMatrixAt(i, matrix); object.getColorAt(i, color);
                cards.push({ kind, matrix: [...matrix.elements], color: [color.r, color.g, color.b] });
            }
        }
        return { cards, draws: parent.children.length, finalRandom: random() };
    } finally {
        T.TextureLoader.prototype.load = loadTexture; GLTFLoader.prototype.loadAsync = loadGLTF;
        parent.traverse(object => {
            if (object instanceof T.Mesh) { object.geometry.dispose(); (object.material as T.Material).dispose(); }
        });
        for (const texture of textures) texture.dispose();
    }
}
