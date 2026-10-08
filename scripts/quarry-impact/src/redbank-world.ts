import * as T from 'three';
import { REDBANK, REDBANK_SOLIDS, REDBANK_TERRAIN, redbankTerrainPatch, redbankGroundSample } from './redbank-course';
import { freezeSceneryTransforms } from './render-work';
/** Original dirt stadium artwork uses the same surface sampler, triangle data
 * and reachable solid records as physics. There are no hidden road overlays. */
export function createRedbankWorld() {
    const root = new T.Group();
    root.name = 'redbank_world';
    const width = 768, height = 512, { spanX, spanZ } = REDBANK_TERRAIN, pixels = new Uint8Array(width * height * 4), road = new Uint8Array(width * height * 4);
    let seed = 830521;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    for (let row = 0; row < height; row++)
        for (let column = 0; column < width; column++) {
            const x = (column + .5) / width * spanX - spanX / 2, z = spanZ / 2 - (row + .5) / height * spanZ, sample = redbankGroundSample(x, z), d = sample.distance, asphalt = sample.asphalt, grain = (random() - .5) * 17;
            const field = Math.sin(x * .061 + Math.sin(z * .04) * 1.3) * Math.cos(z * .047) * 7;
            let color = asphalt ? [56, 61, 58] : d < 16.5 ? [153, 87, 52] : [110 + field, 87 + field, 61 + field];
            if (asphalt && d > 11.7 && d < 11.98)
                color = [213, 205, 167];
            if (Math.abs(x) < .8 && Math.abs(z + 42) < 11.3)
                color = (Math.floor((x + .8) * 2) + Math.floor(z + 54)) % 2 ? [226, 217, 189] : [37, 42, 39];
            if (x < -3 && x > -52 && Math.abs(Math.abs(z + 42) - 2.4) < 1.05 && Math.abs(((x + 3) % 7 + 7) % 7) < .32)
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
    const groundMaterial = new T.MeshStandardMaterial({ map, roughness: 1 }), patch = redbankTerrainPatch(), groundGeometry = new T.BufferGeometry();
    groundGeometry.setAttribute('position', new T.BufferAttribute(patch.positions, 3));
    groundGeometry.setAttribute('uv', new T.BufferAttribute(patch.uv, 2));
    groundGeometry.setIndex(new T.BufferAttribute(patch.indices, 1));
    groundGeometry.computeVertexNormals();
    const ground = new T.Mesh(groundGeometry, groundMaterial);
    ground.name = 'redbank_ground';
    ground.receiveShadow = true;
    root.add(ground);
    const materials = { concrete: new T.MeshStandardMaterial({ color: 0xbdbca9, roughness: .96 }), stripe: new T.MeshStandardMaterial({ color: 0xb84d2d, roughness: .95 }), steel: new T.MeshStandardMaterial({ color: 0x384943, roughness: .76, metalness: .2 }), wood: new T.MeshStandardMaterial({ color: 0x65503b, roughness: 1 }), roof: new T.MeshStandardMaterial({ color: 0x484747, roughness: .9 }), foliage: new T.MeshStandardMaterial({ color: 0x426144, roughness: 1 }), foliageLight: new T.MeshStandardMaterial({ color: 0x786548, roughness: 1 }), seat: new T.MeshStandardMaterial({ color: 0xa08858, roughness: .9 }) };
    type Finish = keyof typeof materials;
    const batches = new Map<string, {
        geometry: T.BufferGeometry;
        finish: Finish;
        matrices: T.Matrix4[];
    }>(), matrix = new T.Matrix4(), rotation = new T.Quaternion(), boxGeometry = new T.BoxGeometry(1, 1, 1);
    function instance(geometry: T.BufferGeometry, finish: Finish, x: number, y: number, z: number, w: number, h: number, d: number, yaw = 0) { rotation.setFromAxisAngle(new T.Vector3(0, 1, 0), yaw); matrix.compose(new T.Vector3(x, y, z), rotation, new T.Vector3(w, h, d)); const key = geometry.uuid + finish, batch = batches.get(key) ?? { geometry, finish, matrices: [] }; batch.matrices.push(matrix.clone()); batches.set(key, batch); }
    const box = (x: number, y: number, z: number, w: number, h: number, d: number, finish: Finish, yaw = 0) => instance(boxGeometry, finish, x, y, z, w, h, d, yaw);
    for (const s of REDBANK_SOLIDS)
        box(s.x, s.y, s.z, s.half[0] * 2, s.half[1] * 2, s.half[2] * 2, s.material, s.yaw);
    // Terraced stands and service containers lie outside the safety wall.
    for(const centre of [-44,44])for(let row=0;row<6;row++){
      const z=-68-row*1.6,top=.7+row*.5;
      box(centre,top/2,z,72,top,1.6,'concrete');
      for(let x=-32;x<=32;x+=3)box(centre+x,top+.2,z,2.1,.2,.6,'seat');
    }
    box(0,6,-75,166,.3,16,'roof');
    for(const x of [-80,-40,0,40,80])for(const z of [-68,-82])box(x,3,z,.22,6,.22,'steel');
    for(const x of [-50,-28,28,50]){box(x,1.6,75,17,3.2,6,'stripe');box(x,3.3,75,17.4,.2,6.4,'roof');}
    // Infield maintenance cabins are protected by the inner retaining wall.
    for(const x of [-34,34]){box(x,1.8,0,14,3.6,12,'wood');box(x,3.7,0,15,.25,13,'roof');}
    // Distance backdrop uses the terrain edge elevations so the ground never
    // ends in a bright void when the director pulls back.
    const apronPositions: number[] = [];
    for (const [x0, x1, z0, z1] of [[-240, -140, -190, 190], [140, 240, -190, 190], [-140, 140, -190, -100], [-140, 140, 100, 190]]) {
        const y00 = REDBANK.height(x0, z0), y01 = REDBANK.height(x0, z1), y10 = REDBANK.height(x1, z0), y11 = REDBANK.height(x1, z1);
        apronPositions.push(x0, y00, z0, x0, y01, z1, x1, y10, z0, x1, y10, z0, x0, y01, z1, x1, y11, z1);
    }
    const apronGeometry = new T.BufferGeometry();
    apronGeometry.setAttribute('position', new T.Float32BufferAttribute(apronPositions, 3));
    apronGeometry.computeVertexNormals();
    const apron = new T.Mesh(apronGeometry, materials.foliageLight);
    apron.name = 'redbank_outer_ground';
    apron.receiveShadow = true;
    root.add(apron);
    for (const [key, b] of batches) {
        const mesh = new T.InstancedMesh(b.geometry, materials[b.finish], b.matrices.length);
        b.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
        mesh.name = 'redbank_' + b.finish + '_' + key.slice(0, 8);
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
            ctx.fillStyle = '#6c3124';
            ctx.fillRect(0, 0, 1024, 128);
            ctx.fillStyle = '#eddfb9';
            ctx.font = 'bold 70px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('REDBANK JUMP CIRCUIT', 512, 64, 990);
            const signMap = new T.CanvasTexture(canvas);
            signMap.colorSpace = T.SRGBColorSpace;
            textures.push(signMap);
            const material = new T.MeshStandardMaterial({ map: signMap, roughness: .9, side: T.DoubleSide }), geometry = new T.PlaneGeometry(32, 4);
            extras.push(material);
            extraGeometry.push(geometry);
            const sign = new T.Mesh(geometry, material);
            sign.name = 'redbank_title';
            sign.position.set(0, 6.4, -67);
            root.add(sign);
        }
    }
    root.userData.solidRecords = REDBANK_SOLIDS;
    freezeSceneryTransforms(root);
    let disposed = false;
    return { root, groundCoverage: { width, height, spanX, spanZ, road }, dispose() { if (disposed)
            return; disposed = true; root.removeFromParent(); root.traverse(o => { if (o instanceof T.InstancedMesh)
            o.dispose(); }); for (const g of [groundGeometry, boxGeometry, apronGeometry, ...extraGeometry])
            g.dispose(); for (const m of [groundMaterial, ...Object.values(materials), ...extras])
            m.dispose(); textures.forEach(t => t.dispose()); root.clear(); } };
}
