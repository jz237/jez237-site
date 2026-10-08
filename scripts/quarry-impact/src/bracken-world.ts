import * as T from 'three';
import { BRACKEN, BRACKEN_SOLIDS, BRACKEN_TERRAIN, brackenTerrainPatch, brackenGroundSample } from './bracken-course';
import { freezeSceneryTransforms } from './render-work';
/** Original rallycross artwork uses the same surface sampler, triangle data
 * and reachable solid records as physics. There are no hidden road overlays. */
export function createBrackenWorld() {
    const root = new T.Group();
    root.name = 'bracken_world';
    const width = 1024, height = 768, { spanX, spanZ } = BRACKEN_TERRAIN, pixels = new Uint8Array(width * height * 4), road = new Uint8Array(width * height * 4);
    let seed = 733119;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    for (let row = 0; row < height; row++)
        for (let column = 0; column < width; column++) {
            const x = (column + .5) / width * spanX - spanX / 2, z = spanZ / 2 - (row + .5) / height * spanZ, sample = brackenGroundSample(x, z), d = sample.distance, asphalt = sample.asphalt, grain = (random() - .5) * 17;
            const field = Math.sin(x * .061 + Math.sin(z * .04) * 1.3) * Math.cos(z * .047) * 7;
            let color = asphalt ? [56, 61, 58] : d < 14.5 ? [151, 121, 81] : [85 + field, 99 + field, 58 + field];
            if (asphalt && d > 11.7 && d < 11.98)
                color = [213, 205, 167];
            if (Math.abs(x) < .8 && Math.abs(z + 82) < 11.3)
                color = (Math.floor((x + .8) * 2) + Math.floor(z + 94)) % 2 ? [226, 217, 189] : [37, 42, 39];
            if (x < -3 && x > -52 && Math.abs(Math.abs(z + 82) - 2.4) < 1.05 && Math.abs(((x + 3) % 7 + 7) % 7) < .32)
                color = [213, 207, 177];
            const i = (row * width + column) * 4;
            for (let c = 0; c < 3; c++)
                pixels[i + c] = color[c] + grain;
            pixels[i + 3] = 255;
            road[i + 3] = asphalt ? 255 : 0;
        }
    const map = new T.DataTexture(pixels, width, height);
    map.colorSpace = T.SRGBColorSpace;
    map.generateMipmaps = true;
    map.minFilter = T.LinearMipmapLinearFilter;
    map.magFilter = T.LinearFilter;
    map.anisotropy = 8;
    map.needsUpdate = true;
    const groundMaterial = new T.MeshStandardMaterial({ map, roughness: 1 }), patch = brackenTerrainPatch(), groundGeometry = new T.BufferGeometry();
    groundGeometry.setAttribute('position', new T.BufferAttribute(patch.positions, 3));
    groundGeometry.setAttribute('uv', new T.BufferAttribute(patch.uv, 2));
    groundGeometry.setIndex(new T.BufferAttribute(patch.indices, 1));
    groundGeometry.computeVertexNormals();
    const ground = new T.Mesh(groundGeometry, groundMaterial);
    ground.name = 'bracken_ground';
    ground.receiveShadow = true;
    root.add(ground);
    const materials = { concrete: new T.MeshStandardMaterial({ color: 0xbdbca9, roughness: .96 }), stripe: new T.MeshStandardMaterial({ color: 0x738c65, roughness: .95 }), steel: new T.MeshStandardMaterial({ color: 0x384943, roughness: .76, metalness: .2 }), wood: new T.MeshStandardMaterial({ color: 0x65503b, roughness: 1 }), roof: new T.MeshStandardMaterial({ color: 0x455b50, roughness: .9 }), foliage: new T.MeshStandardMaterial({ color: 0x426144, roughness: 1 }), foliageLight: new T.MeshStandardMaterial({ color: 0x697644, roughness: 1 }), seat: new T.MeshStandardMaterial({ color: 0xa08858, roughness: .9 }) };
    type Finish = keyof typeof materials;
    const batches = new Map<string, {
        geometry: T.BufferGeometry;
        finish: Finish;
        matrices: T.Matrix4[];
    }>(), matrix = new T.Matrix4(), rotation = new T.Quaternion(), boxGeometry = new T.BoxGeometry(1, 1, 1), treeGeometry = new T.ConeGeometry(1, 1, 7), trunkGeometry = new T.CylinderGeometry(.5, .6, 1, 6);
    function instance(geometry: T.BufferGeometry, finish: Finish, x: number, y: number, z: number, w: number, h: number, d: number, yaw = 0) { rotation.setFromAxisAngle(new T.Vector3(0, 1, 0), yaw); matrix.compose(new T.Vector3(x, y, z), rotation, new T.Vector3(w, h, d)); const key = geometry.uuid + finish, batch = batches.get(key) ?? { geometry, finish, matrices: [] }; batch.matrices.push(matrix.clone()); batches.set(key, batch); }
    const box = (x: number, y: number, z: number, w: number, h: number, d: number, finish: Finish, yaw = 0) => instance(boxGeometry, finish, x, y, z, w, h, d, yaw);
    for (const s of BRACKEN_SOLIDS)
        box(s.x, s.y, s.z, s.half[0] * 2, s.half[1] * 2, s.half[2] * 2, s.material, s.yaw);
    // Paddock and spectator buildings are beyond the closed safety barrier.
    for (const centre of [-35, 35])
        for (let row = 0; row < 5; row++) {
            const z = -108 - row * 1.6, top = .5 + row * .48;
            box(centre, top / 2, z, 56, top, 1.6, 'concrete');
            for (let x = -25; x <= 25; x += 2.5)
                box(centre + x, top + .2, z - .12, 1.9, .16, .65, 'seat');
        }
    box(0, 5.8, -114, 125, .25, 15, 'roof');
    for (const x of [-60, -30, 0, 30, 60])
        for (const z of [-107, -121])
            box(x, 2.9, z, .18, 5.8, .18, 'steel');
    box(135, 2.5, -67, 12, 5, 18, 'wood');
    box(135, 5.15, -67, 13, .3, 19, 'roof');
    box(128.95, 3.4, -67, .12, 1.5, 13, 'steel');
    // Open sightlines inside the track; dense woodland is beyond the outer loop.
    // Decorative trunks are unreachable without crossing the visible collider.
    for (let i = 0; i < 350; i++) {
        const x = (random() - .5) * 340, z = (random() - .5) * 260;
        if (BRACKEN.distance(x, z) < 27 || Math.abs(x) < 128 && z < -98 || Math.abs(x - 135) < 14 && Math.abs(z + 67) < 20)
            continue;
        const outward = Math.hypot(x / 125, z / 100);
        if (outward < 1.12)
            continue;
        const y = BRACKEN.height(x, z), h = 7 + random() * 7, w = 2.8 + random() * 2, yaw = random() * Math.PI;
        instance(trunkGeometry, 'wood', x, y + h * .32, z, .65, h * .64, .65, yaw);
        for (let j = 0; j < 3; j++)
            instance(treeGeometry, i % 3 ? 'foliage' : 'foliageLight', x, y + h * (.45 + j * .19), z, w * (1 - j * .2), h * .55, w * (1 - j * .2), yaw);
    }
    // Distance backdrop uses the terrain edge elevations so the ground never
    // ends in a bright void when the director pulls back.
    const apronPositions: number[] = [];
    for (const [x0, x1, z0, z1] of [[-290, -180, -230, 230], [180, 290, -230, 230], [-180, 180, -230, -140], [-180, 180, 140, 230]]) {
        const y00 = BRACKEN.height(x0, z0), y01 = BRACKEN.height(x0, z1), y10 = BRACKEN.height(x1, z0), y11 = BRACKEN.height(x1, z1);
        apronPositions.push(x0, y00, z0, x0, y01, z1, x1, y10, z0, x1, y10, z0, x0, y01, z1, x1, y11, z1);
    }
    const apronGeometry = new T.BufferGeometry();
    apronGeometry.setAttribute('position', new T.Float32BufferAttribute(apronPositions, 3));
    apronGeometry.computeVertexNormals();
    const apron = new T.Mesh(apronGeometry, materials.foliageLight);
    apron.name = 'bracken_outer_ground';
    apron.receiveShadow = true;
    root.add(apron);
    for (const [key, b] of batches) {
        const mesh = new T.InstancedMesh(b.geometry, materials[b.finish], b.matrices.length);
        b.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
        mesh.name = 'bracken_' + b.finish + '_' + key.slice(0, 8);
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.computeBoundingSphere();
        root.add(mesh);
    }
    const extras: T.Material[] = [], extraGeometry: T.BufferGeometry[] = [], textures: T.Texture[] = [map];
    if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#294438';
            ctx.fillRect(0, 0, 1024, 128);
            ctx.fillStyle = '#eddfb9';
            ctx.font = 'bold 70px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BRACKEN RALLYCROSS', 512, 64, 990);
            const signMap = new T.CanvasTexture(canvas);
            signMap.colorSpace = T.SRGBColorSpace;
            textures.push(signMap);
            const material = new T.MeshStandardMaterial({ map: signMap, roughness: .9, side: T.DoubleSide }), geometry = new T.PlaneGeometry(32, 4);
            extras.push(material);
            extraGeometry.push(geometry);
            const sign = new T.Mesh(geometry, material);
            sign.name = 'bracken_title';
            sign.position.set(0, 6.4, -106.9);
            root.add(sign);
        }
    }
    root.userData.solidRecords = BRACKEN_SOLIDS;
    freezeSceneryTransforms(root);
    let disposed = false;
    return { root, groundCoverage: { width, height, spanX, spanZ, road }, dispose() { if (disposed)
            return; disposed = true; root.removeFromParent(); root.traverse(o => { if (o instanceof T.InstancedMesh)
            o.dispose(); }); for (const g of [groundGeometry, boxGeometry, treeGeometry, trunkGeometry, apronGeometry, ...extraGeometry])
            g.dispose(); for (const m of [groundMaterial, ...Object.values(materials), ...extras])
            m.dispose(); textures.forEach(t => t.dispose()); root.clear(); } };
}
